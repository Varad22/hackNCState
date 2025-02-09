menu = {
    "Arrabiata Sauce": ["Vegetarian", "Vegan"],
    "Classic Marinara": ["Vegetarian", "Vegan"],
    "Fettuccine Noodles": ["Gluten Allergen", "Vegetarian"],
    "Garlic Bread": ["Gluten Allergen", "Vegetarian"],
    "Pasta Primavera": ["Gluten Allergen", "Vegetarian"],
    "Vegetable Ravioli": ["Gluten Allergen"],
    "Baby Carrots": ["Vegetarian", "Vegan"],
    "Hawaiian Sweet Roll": ["Gluten Allergen", "Vegetarian"],
    "Herb Crusted Pork Loin w/ Glaze": ["Gluten Allergen"],
    "Red Bean Ratatouille": ["Vegetarian", "Vegan"],
    "Red Skin Mashed Potatoes": ["Vegetarian"],
    "Roasted Zucchini with Tomatoes": ["Vegetarian", "Vegan"],
    "Baked Sweet Potato": ["Vegetarian", "Vegan"],
    "Cumin Black Beans": ["Vegetarian", "Vegan"],
    "Mustard Greens": ["Vegetarian", "Vegan"],
    "Roasted Acorn Squash": ["Vegetarian", "Vegan"],
    "Roasted Garlic & Herb Beef Top Round": ["Anything Meal"],
    "Banana Peppers": ["Vegetarian", "Vegan"],
    "Cheddar Cheese": ["Vegetarian"],
    "Ham Deli Meat": ["Anything Meal"],
    "Homemade Chicken Salad": ["Anything Meal"],
    "Lettuce": ["Vegetarian", "Vegan"],
    "Pickle Chips": ["Vegetarian", "Vegan"],
    "Sliced Onions": ["Vegetarian", "Vegan"],
    "Sliced Tomatoes": ["Vegetarian", "Vegan"],
    "Swiss Cheese": ["Vegetarian"],
    "Turkey Deli Meat": ["Anything Meal"],
    "Black Bean Patty": ["Vegetarian", "Vegan"],
    "Cheeseburger Patty": ["Anything Meal"],
    "Crinkle Cut Fries": ["Vegetarian", "Vegan"],
    "Hamburger Bun": ["Gluten Allergen", "Vegetarian"],
    "Hamburger Patty": ["Anything Meal"],
    "Hot Dog": ["Anything Meal"],
    "Hot Dog Bun": ["Gluten Allergen", "Vegetarian"],
    "Chips & Salsa Station": ["Anything Meal"],
    "Chips and Dip": ["Anything Meal"],
    "Sour Cream": ["Vegetarian"],
    "Gluten Friendly Cheese Pizza": ["Gluten Allergen"],
    "Spiced Sausage Pizza": ["Gluten Allergen"],
    "Traditional Cheese Pizza": ["Gluten Allergen"],
    "Soup Du Jour": ["Anything Meal"],
    "Fresh Cantaloupe": ["Vegetarian", "Vegan"],
    "Fresh Honeydew": ["Vegetarian", "Vegan"],
    "Fresh Pineapple": ["Vegetarian", "Vegan"],
    "Fresh Strawberries": ["Vegetarian", "Vegan"],
    "Granola": ["Gluten Allergen", "Vegetarian"],
  
}

import os
import openai
API_KEY= os.getenv("API_KEY")

# Step 2: Set your OpenAI API key
openai.api_key = API_KEY

# Step 4: Categorize menu items into packages
def categorize_menu(menu):
    packages = {
        "Vegan": [],
        "Vegetarian": [],
        "Gluten-Free": [],
        "Meat": []
    }

    for item, tags in menu.items():
        if "Vegan" in tags:
            packages["Vegan"].append(item)
        if "Vegetarian" in tags:
            packages["Vegetarian"].append(item)
        if "Gluten Allergen" not in tags:
            packages["Gluten-Free"].append(item)
        packages["Meat"].append(item)

    return packages

categorized_menu = categorize_menu(menu)

# Step 5: Generate a summary of the selected package
def generate_summary(package_name, categorized_menu):
    items = categorized_menu.get(package_name, [])
    summary_items = items[:10]  # Select only 4-5 diverse items for brevity
    summary = f"The {package_name} package may include: {', '.join(summary_items)}. These items are prepared from leftover dining hall food and may vary."
    return summary

