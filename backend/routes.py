from fastapi import APIRouter, Request, status, HTTPException, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging
import asyncio
import json
from collections import defaultdict
import time
import os
from slowapi import Limiter
from slowapi.util import get_remote_address

from chain import create_agent

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)



agents = {}
session_queues = defaultdict(asyncio.Queue)  # Automatically creates queues for new sessions

last_activity = {}
SESSION_TIMEOUT = 1200  # 20 minutes in seconds
CLEANUP_INTERVAL = 300  # 5 minutes in seconds

async def cleanup_old_sessions():
    """Background task to remove inactive sessions"""
    logging.info("Starting session cleanup task...")
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL)
        current_time = time.time()
        inactive_sessions = [
            session_id for session_id, last in last_activity.items()
            if current_time - last > SESSION_TIMEOUT
        ]
        
        for session_id in inactive_sessions:
            # Cleanup all session-related resources
            if session_id in agents:
                del agents[session_id]
            if session_id in session_queues:
                del session_queues[session_id]
            if session_id in last_activity:
                del last_activity[session_id]
            logging.info(f"Cleaned up session: {session_id}")

class MessageRequest(BaseModel):
    user_message: str
    chat_session_id: str
    chat_secret: str

@router.post("/chat_send")
@limiter.limit("10/minute")
async def chat_send(request: Request, message_request: MessageRequest):
    user_message = message_request.user_message
    chat_session_id = message_request.chat_session_id
    chat_secret = message_request.chat_secret

    if chat_secret != os.getenv("CHAT_SECRET"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid secret"
        )

    last_activity[chat_session_id] = time.time()

    # Initialize or retrieve the agent for this chat session
    if chat_session_id not in agents:
        agent, callback_handler = create_agent()
        agents[chat_session_id] = {
            "agent": agent,
            "callback_handler": callback_handler
        }

    # Put the user message in the queue for processing
    await session_queues[chat_session_id].put(user_message)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "Message queued"}
    )

@router.get("/chat_stream/{chat_session_id}")
async def chat_stream(chat_session_id: str):
    async def generate():
        if chat_session_id not in agents:
            yield "event: error\ndata: Chat session not found\n\n"
            return

        agent = agents[chat_session_id]["agent"]
        callback_handler = agents[chat_session_id]["callback_handler"]

        try:
            # Process messages from the queue
            while True:
                last_activity[chat_session_id] = time.time()
                if not session_queues[chat_session_id].empty():
                    user_message = await session_queues[chat_session_id].get()
                    # Update activity when processing message
                    last_activity[chat_session_id] = time.time()

                    # Stream the agent's response
                    async for chunk in agent.astream({"input": user_message}):
                        if "output" in chunk:
                            logging.info(f"Streaming chunk: {chunk['output']}")
                            yield f"data: {json.dumps({'content': chunk['output']})}\n\n"

                    yield "event: end\ndata: \n\n"
                    session_queues[chat_session_id].task_done()

                await asyncio.sleep(0.1)

        except Exception as e:
            logging.error(f"Streaming error: {str(e)}")
            yield f"event: error\ndata: {str(e)}\n\n"
        finally:
            yield "event: end\ndata: \n\n"
            if chat_session_id in session_queues:
                if session_queues[chat_session_id].empty():
                    del session_queues[chat_session_id]

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )
