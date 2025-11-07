from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from myenv.model.recepie import RecipeResponse 
from myenv.db.mongo_client import recipes_collection
import os
import uuid
import json

# Load env variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("❌ GOOGLE_API_KEY not found in .env")

# Initialize Gemini model
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    google_api_key=api_key,
    temperature=0.3,
    convert_system_message_to_human=True
)

prompt = PromptTemplate(
    input_variables=["ingredients", "dietary_restrictions", "cuisine_type"],
    template=(
        "You are a professional chef. Generate a detailed recipe given these details:\n\n"
        "Ingredients: {ingredients}\n"
        "Dietary Restrictions: {dietary_restrictions}\n"
        "Cuisine Type: {cuisine_type}\n\n"
        "Respond ONLY in valid JSON with these exact keys:\n"
        "title, ingredients (array of strings), instructions (array of strings), prep_time, difficulty.\n\n"
        "No markdown or explanations."
    )
)




parser = StrOutputParser()
chain = prompt | model | parser


def generate_recipe(ingredients, dietary_restrictions, cuisine_type) -> RecipeResponse:
    """Generate and auto-save recipe using Gemini."""
    response_text = chain.invoke({
        "ingredients": ", ".join(ingredients),
        "dietary_restrictions": ", ".join(dietary_restrictions),
        "cuisine_type": cuisine_type or "general"
    })

    # Clean up Gemini response
    cleaned = (
        response_text.strip()
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("⚠️ JSON parse failed:", e)
        data = {}

    recipe_obj = RecipeResponse(
        recipe_id=str(uuid.uuid4()),
        title=data.get("title", "Untitled Recipe"),
        ingredients=data.get("ingredients", ingredients),
        instructions=data.get("instructions", ["No instructions generated."]),
        prep_time=data.get("prep_time", "Unknown"),
        difficulty=data.get("difficulty", "Medium")
    )

    # ✅ Auto-save to MongoDB
    try:
        recipes_collection.insert_one(recipe_obj.dict())
        print(f"✅ Recipe '{recipe_obj.title}' saved to MongoDB!")
    except Exception as e:
        print(f"⚠️ Failed to save recipe: {e}")

    return recipe_obj
