from dotenv import load_dotenv

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_core.messages import SystemMessage
from .agent_tools import get_all_products, get_faq_content, get_product_detail

from langgraph.graph import StateGraph, END, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition

tools = [
    get_faq_content,
    get_product_detail,
    get_all_products,
]

system_prompt_content = """You are a friendly and helpful assistant for Petalsoft 🌸, a skincare product store.
Utilize the tools provided to answer user questions. PetalSoft has 13 products total.
You have the following tools available:
- `get_all_products`: Use this to list all available products when the user asks generally what you sell.
- `get_product_detail`: Use this when the user asks for details about a *specific* product name.
- `get_faq_content`: Use this to answer general questions about shipping, returns, ingredients policy, etc., that might be in an FAQ.

Please keep your answers concise and informative. Format your responses nicely (e.g., using bullet points for lists) and try to incorporate relevant emojis to make the interaction welcoming and engaging! ✨🌿💧"""

system_message = SystemMessage(content=system_prompt_content)


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")
llm_with_tools = llm.bind_tools(tools)


def chatbot(state: MessagesState):
    """
    Chatbot node that invokes the LLM.
    It prepends the static system message to the current message history
    before making the LLM call.
    """
    messages_with_system_prompt = [system_message] + state["messages"][-10:]

    response = llm_with_tools.invoke(messages_with_system_prompt)

    return {"messages": [response]}


tool_node = ToolNode(tools=tools)

builder = StateGraph(MessagesState)

builder.add_node("chatbot", chatbot)
builder.add_node("tools", tool_node)

builder.set_entry_point("chatbot")

builder.add_conditional_edges(
    "chatbot",
    tools_condition,
    {"tools": "tools", END: END},
)
builder.add_edge("tools", "chatbot")

graph = builder.compile()
