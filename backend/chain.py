from langchain_openai import ChatOpenAI
from langchain.agents import Tool, initialize_agent
from langchain.schema import SystemMessage
from langchain.callbacks import AsyncIteratorCallbackHandler
from dotenv import load_dotenv

from agent_tools import search_documents, get_product_detail, get_all_products, get_product_live_detail, get_user_orders, get_user_order_detail
from custom_memory import SlidingChatMemory

load_dotenv()

# Create the agent with streaming support
def create_agent():
    # Initialize the streaming LLM with callback handler
    callback_handler = AsyncIteratorCallbackHandler()
    model = ChatOpenAI(
        temperature=0,
        streaming=True,
        callbacks=[callback_handler],
        model="gpt-4o-mini"
    )

    # Define the tools (unchanged)
    tools = [
        Tool(
            name="SearchDocuments",
            func=search_documents,
            description="Useful for answering frequently asked questions or questions relating to company policies such as shipping and refund."
        ),
        Tool(
            name="GetProductDetail",
            func=get_product_detail,
            description="Useful for getting the details of a product. The product name should be one of the following: Green Tea Moisturizer, Anti-Aging Serum, Skin Brightening Toner, Mineralized Sunscreen, Sunflower, Zinc Boost, Ocean Breeze, Radiant Glow Nourishing Cream, Purifying Exfoliating Cleanser, Lotus Blossom Eau de Parfum, Amber Elegance Fragrance, Camille Bliss Perfume, Verdant Mint Eau de Toilette."
        ),
        Tool(
            name="GetAllProducts",
            func=get_all_products,
            description="Useful for getting a summary of all products, grouped by category, with short descriptions, price, and reviews."
        ),
        Tool(
            name="GetProductLiveDetail",
            func=get_product_live_detail,
            description="Useful for getting the latest stock and reviews of a product. The product name should be one of the following: Green Tea Moisturizer, Anti-Aging Serum, Skin Brightening Toner, Mineralized Sunscreen, Sunflower, Zinc Boost, Ocean Breeze, Radiant Glow Nourishing Cream, Purifying Exfoliating Cleanser, Lotus Blossom Eau de Parfum, Amber Elegance Fragrance, Camille Bliss Perfume, Verdant Mint Eau de Toilette."
        ),
        Tool(
            name="GetUserOrders",
            func=get_user_orders,
            description="Useful for getting how many orders the user has made."
        ),
        Tool(
            name="GetUserOrderDetail",
            func=get_user_order_detail,
            description="Useful for getting the user's order details support up to 5 per request."
        )
    ]

    # Define the system prompt (unchanged)
    system_prompt = SystemMessage(
        content="""You are a helpful AI assistant of a company called PetalSoft. They sell perfume and cosmetic for women. Your task is to assist users by answering their questions or performing actions using the tools available to you. 
        You have access to the following tools:
        1. SearchDocuments: Use this tool to answer user questions regarding company policies (e.g., refund policy, shipping) or frequently asked questions.
        2. GetAllProducts: Use this tool to get information about all the products that PetalSoft has to offer.
        3. GetProductDetail: Use this tool to get the details of a product.
        4. GetProductLiveDetail: Use this tool to get the latest stock and reviews of a product. The product name is the same as the GetProductDetail tool.  
        5. GetUserOrders: Use this tool to find out how many orders user have made.
        6. GetUserOrderDetail: Use this tool to get the user's order details support up to 5 per request.
        
        Follow these guidelines:
        - Always be polite and professional.
        - If the user's query requires searching for documents, use the `SearchDocuments` tool.
        - If the user asks about a product, use the `GetProductDetail` tool.
        - If the user asks for a summary of all products, use the `GetAllProducts` tool.
        - If you are unsure how to respond, ask the user for clarification.
        - Keep your responses concise and informative."""
    )

    # Initialize memory for chat history (unchanged)
    memory = SlidingChatMemory(max_messages=10, max_words=600)

    # Initialize the agent with streaming support
    agent = initialize_agent(
        tools=tools,
        llm=model,
        agent="chat-conversational-react-description",
        verbose=True,
        max_iterations=5,
        early_stopping_method="generate",
        memory=memory,
        system_message=system_prompt,
        return_intermediate_steps=True  # Enable intermediate steps for streaming
    )

    return agent, callback_handler  # Return both agent and callback handler