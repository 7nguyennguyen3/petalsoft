from fastapi import APIRouter, Request, status, HTTPException
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging
import os

from chain import create_agent

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class MessageRequest(BaseModel):
    user_message: str
    chat_secret: str  

@router.post("/chat")
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, message_request: MessageRequest):
    # Authentication
    if message_request.chat_secret != os.getenv("CHAT_SECRET"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid secret"
        )

    agent, _ = create_agent()

    try:
        # Use ainvoke instead of arun
        result = await agent.ainvoke({"input": message_request.user_message})
        
        # Extract the output from the result
        if "output" in result:
            return {"content": result["output"]}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Agent response format invalid"
            )
    except Exception as e:
        logging.error(f"Error generating response: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/health")
async def health_check():
    return {"status": "healthy"}