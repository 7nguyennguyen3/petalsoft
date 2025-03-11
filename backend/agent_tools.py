from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import Pinecone
from langchain.tools import tool
import psycopg2
import json
from neon_connect import pool
from typing import Union, List

def get_retriever(vectorstore):
    """Returns a retriever that performs similarity search on the vectorstore."""
    return vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})

@tool
def search_documents(query: str) -> str:
    """Searches the vectorstore for relevant documents based on the query."""
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")  # Corrected: Use keyword argument
    vectorstore = Pinecone.from_existing_index("petalsoft", embeddings)
    retriever = get_retriever(vectorstore)
    docs = retriever.get_relevant_documents(query)
    return "\n\n".join([doc.page_content for doc in docs])

import json
from langchain.tools import tool
from collections import defaultdict

@tool
def get_all_products():
    """Returns a summary of all products, grouped by category, with short descriptions, price, and reviews."""
    try:
        # Load the JSON file
        with open("products.json", "r", encoding="utf-8") as file:
            products = json.load(file)

        # Group products by category
        categories = defaultdict(list)
        for product in products:
            categories[product["category"]].append(product)

        # Build the summary
        summary = "Product Summary:\n"
        summary += f"There are {len(products)} products total:\n\n"

        # Add category-wise summaries
        for category, items in categories.items():
            summary += f"{len(items)} {category.lower()} products: {', '.join(product['title'] for product in items)}.\n"

        # Add quick product descriptions with price and reviews
        summary += "\nQuick Product Descriptions:\n"
        for product in products:
            summary += (
                f"{product['title']}: {product['shortDescription']}\n"
                f"  - Price: ${product['price']}\n"
                f"  - Reviews: {product['reviews']} reviews\n\n"
            )

        return summary

    except FileNotFoundError:
        return "❌ Error: The products.json file was not found."
    except json.JSONDecodeError:
        return "❌ Error: The products.json file is malformed."

@tool
def get_product_detail(product_name: str):
    """Returns the details of a product."""
    try:
        # Load the JSON file
        with open("products.json", "r", encoding="utf-8") as file:
            products = json.load(file)  # Assign the JSON data to the `products` variable

        # Search for the product
        for product in products:
            if product["title"].lower() == product_name.lower():
                # Format the ingredients list
                ingredients = "\n".join(f"- {ingredient}" for ingredient in product.get("ingredients", []))

                # Return the product details in a structured format
                return (
                    f"Product Details for {product['title']}\n"
                    f"Description: {product['description']}\n"
                    f"Price: ${product['price']}\n"
                    f"Stock: {product['stock']} units available\n"
                    f"Category: {product['category']}\n"
                    f"Reviews: {product['reviews']} reviews\n"
                    f"Ingredients:\n{ingredients}"
                )

        return f"❌ Product '{product_name}' not found."

    except FileNotFoundError:
        return "❌ Error: The products.json file was not found."
    except json.JSONDecodeError:
        return "❌ Error: The products.json file is malformed."

@tool
def get_product_live_detail(product_name: str) -> str:
    """Returns stock and reviews using synchronous connection pool"""
    conn = None
    try:
        conn = pool.getconn()
        with conn.cursor() as cur:
            cur.execute(
                'SELECT stock, reviews FROM "PRODUCTS" WHERE LOWER(title) = LOWER(%s)',
                (product_name.lower(),)
            )
            result = cur.fetchone()
        if result:
            return (
                f"Stock: {result[0]} units\n"
                f"Reviews: {result[1] or 'No reviews yet'}"
            )
        return f"❌ Product '{product_name}' not found"
    except psycopg2.Error as e:
        return f"❌ Database error: {str(e)}"
    finally:
        if conn:
            pool.putconn(conn)

@tool
def get_user_orders(user_identifier: str, page: int = 1, limit: int = 20) -> str:
    """Returns paginated order summary with IDs, product names, and totals sorted by most recent"""
    conn = None
    try:
        conn = pool.getconn()
        with conn.cursor() as cur:
            is_email = '@' in user_identifier
            offset = (page - 1) * limit
            
            query = f"""
                SELECT 
                    o.id AS order_id,
                    o."createdAt" AS order_date,
                    o.total,
                    ARRAY_AGG(p.title) AS product_names
                FROM "Order" o
                JOIN "LineItem" li ON o.id = li."orderId"
                JOIN "PRODUCTS" p ON li."productId" = p.id
                WHERE {'o.email = %s' if is_email else 'o."userId" = %s'}
                GROUP BY o.id
                ORDER BY o."createdAt" DESC
                LIMIT %s OFFSET %s
            """
            
            cur.execute(query, (user_identifier, limit, offset))
            orders = cur.fetchall()
            
            if not orders:
                return f"❌ No orders found for {'email' if is_email else 'user ID'}: {user_identifier}"

            result = []
            for order in orders:
                result.append({
                    "order_id": order[0],
                    "date": order[1].isoformat(),
                    "total": order[2],
                    "products": order[3]
                })
                
            return json.dumps({
                "page": page,
                "results": result,
                "next_page": page + 1 if len(result) == limit else None
            }, indent=2)

    except psycopg2.Error as e:
        return f"❌ Database error: {str(e)}"
    finally:
        if conn:
            pool.putconn(conn)

@tool
def get_user_order_detail(order_ids: Union[str, List[str]]) -> str:
    """Returns detailed information for up to 5 specific orders by ID(s)"""
    conn = None
    try:
        conn = pool.getconn()
        with conn.cursor() as cur:
            # Convert single ID to list if needed
            ids = [order_ids] if isinstance(order_ids, str) else order_ids[:5]
            
            query = """
                SELECT 
                    o.id, o.email, o.total, o."isPaid", o.status, 
                    o."createdAt", o."updatedAt",
                    sa.street, sa.city, sa.state, sa."postalCode", sa.country,
                    json_agg(json_build_object(
                        'product_id', li."productId",
                        'product_title', p.title,
                        'quantity', li.quantity,
                        'price', li.price
                    )) as line_items
                FROM "Order" o
                LEFT JOIN "ShippingAddress" sa ON o."shippingAddressId" = sa.id
                LEFT JOIN "LineItem" li ON o.id = li."orderId"
                LEFT JOIN "PRODUCTS" p ON li."productId" = p.id
                WHERE o.id = ANY(%s)
                GROUP BY o.id, sa.id
            """
            
            cur.execute(query, (ids,))
            orders = cur.fetchall()
            
            if not orders:
                return "❌ No orders found with provided IDs"

            result = []
            for order in orders:
                order_data = {
                    "order_id": order[0],
                    "email": order[1],
                    "total": order[2],
                    "is_paid": order[3],
                    "status": order[4],
                    "created_at": order[5].isoformat(),
                    "updated_at": order[6].isoformat(),
                    "shipping_address": {
                        "street": order[7],
                        "city": order[8],
                        "state": order[9],
                        "postal_code": order[10],
                        "country": order[11]
                    } if order[7] else None,
                    "line_items": order[12]
                }
                result.append(order_data)
            
            return json.dumps(result, indent=2)
            
    except psycopg2.Error as e:
        return f"❌ Database error: {str(e)}"
    finally:
        if conn:
            pool.putconn(conn)

