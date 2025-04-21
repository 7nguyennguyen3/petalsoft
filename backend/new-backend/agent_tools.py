from langchain.tools import tool
import json
from collections import defaultdict


@tool
def get_all_products():
    """Returns a summary of all products, grouped by category, with short descriptions, price, and reviews."""
    try:
        # Load the JSON file
        with open("./products.json", "r", encoding="utf-8") as file:
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
def get_faq_content(topic: str):
    """Returns the FAQ content for the specified topic (shipping, refund, or product).
    Supported topics: shipping, refund, product.
    """
    try:
        # Load the JSON file
        with open("./faq.json", "r", encoding="utf-8") as file:
            faq_data = json.load(file)

        # Check if the requested topic exists
        if topic.lower() in faq_data:
            return faq_data[topic.lower()]["content"]

        return f"❌ Topic '{topic}' not found in FAQ."

    except FileNotFoundError:
        return "❌ Error: The faq.json file was not found."
    except json.JSONDecodeError:
        return "❌ Error: The faq.json file is malformed."


@tool
def get_product_detail(product_names: str):
    """Returns the details of a product. The product name must be one of the following:
    Green Tea Moisturizer, Anti-Aging Serum, Skin Brightening Toner, Mineralized Sunscreen,
    Sunflower, Zinc Boost, Ocean Breeze, Radiant Glow Nourishing Cream,
    Purifying Exfoliating Cleanser, Lotus Blossom Eau de Parfum, Amber Elegance Fragrance,
    Camille Bliss Perfume, Verdant Mint Eau de Toilette.
    Supports multiple product names separated by commas.
    """
    try:
        with open("./products.json", "r", encoding="utf-8") as file:
            products = json.load(file)

        # Split input into multiple product names
        requested_products = [name.strip() for name in product_names.split(",")]
        results = []

        for requested_name in requested_products:
            found = False
            for product in products:
                if product["title"].lower() == requested_name.lower():
                    ingredients = "\n".join(
                        f"- {ingredient}"
                        for ingredient in product.get("ingredients", [])
                    )
                    results.append(
                        f"Product Details for {product['title']}\n"
                        f"Description: {product['description']}\n"
                        f"Price: ${product['price']}\n"
                        f"Stock: {product['stock']} units\n"
                        f"Ingredients:\n{ingredients}\n"
                    )
                    found = True
                    break  # Move to next requested product

            if not found:
                results.append(f"❌ Product '{requested_name}' not found.")

        return "\n\n".join(results) if results else "❌ No valid products requested."

    except FileNotFoundError:
        return "❌ Error: products.json not found."
    except json.JSONDecodeError:
        return "❌ Error: Invalid JSON data."
