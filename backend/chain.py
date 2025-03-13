from langchain_openai import ChatOpenAI
from langchain.agents import Tool, initialize_agent
from langchain.schema import SystemMessage
from langchain.callbacks import AsyncIteratorCallbackHandler
from dotenv import load_dotenv

from agent_tools import get_faq_content, get_product_detail, get_all_products, get_product_live_detail, get_user_orders, get_user_order_detail
from custom_memory import SlidingChatMemory

load_dotenv()

def create_agent():
    callback_handler = AsyncIteratorCallbackHandler()
    model = ChatOpenAI(
        temperature=0,
        streaming=True,
        callbacks=[callback_handler],
        model="gpt-4o-mini"
    )

    tools = [
    Tool(
        name="GetFAQContent",
        func=get_faq_content,
        description="Useful for retrieving FAQ content related to shipping, refund, or product. The topic should be one of the following: shipping, refund, product."
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
        description="Useful for getting the user's order details, supporting up to 5 per request."
    )
]
    system_prompt = SystemMessage(
    content="""You are a helpful AI assistant of a company called PetalSoft. They sell perfume and cosmetics for women. Your task is to assist users by answering their questions or performing actions using the tools available to you.
    
    You have access to the following tools:
    1. GetFAQContent: Use this tool to retrieve FAQ content related to shipping, refund, or product details.
    2. GetAllProducts: Use this tool to get information about all the products that PetalSoft has to offer.
    3. GetProductDetail: Use this tool to get the details of a product.
    4. GetProductLiveDetail: Use this tool to get the latest stock and reviews of a product. The product name is the same as the GetProductDetail tool.
    5. GetUserOrders: Use this tool to find out how many orders the user has made.
    6. GetUserOrderDetail: Use this tool to get the user's order details, supporting up to 5 per request.
    
    Follow these guidelines:
    - Always be polite and professional.
    - If the user asks about shipping, refund, or product FAQs, use the `GetFAQContent` tool.
    - If the user's query requires searching for documents, use the `SearchDocuments` tool.
    - If the user asks about a product, use the `GetProductDetail` tool.
    - If the user asks for a summary of all products, use the `GetAllProducts` tool.
    - If you are unsure how to respond, ask the user for clarification.
    - Keep your responses concise and informative."""
)

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