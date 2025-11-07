from fastapi import APIRouter, HTTPException, Request
from myenv.model.recepie import RecipeRequest, RecipeResponse
from myenv.model.recepie_service import generate_recipe, model, parser
from myenv.db.mongo_client import recipes_collection
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
import json

# ✅ Initialize limiter for these routes
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# ✅ 1. Generate and Auto-Save Recipe (heavy operation)
@router.post("/generate", response_model=RecipeResponse)
@limiter.limit("3/minute")  # max 3 generations/min per IP
async def generate_recipe_endpoint(request: Request, req: RecipeRequest):
    try:
        recipe = generate_recipe(
            ingredients=req.ingredients,
            dietary_restrictions=req.dietary_restrictions,
            cuisine_type=req.cuisine_type,
        )
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 2. Get All Recipes (no rate limit)
@router.get("/", response_model=List[RecipeResponse])
async def get_all_recipes():
    try:
        recipes = list(recipes_collection.find({}, {"_id": 0}))
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 3. Get Specific Recipe (no limit)
@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe_by_id(recipe_id: str):
    recipe = recipes_collection.find_one({"recipe_id": recipe_id}, {"_id": 0})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


# ✅ 4. Delete Recipe (moderate limit)
@router.delete("/{recipe_id}")
@limiter.limit("10/minute")  # prevent accidental spam deletes
async def delete_recipe(request: Request, recipe_id: str):
    result = recipes_collection.delete_one({"recipe_id": recipe_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"message": "✅ Recipe deleted successfully"}


# ✅ 5. Modify Existing Recipe (moderate limit)
@router.post("/{recipe_id}/modify", response_model=RecipeResponse)
@limiter.limit("5/minute")
async def modify_recipe(request: Request, recipe_id: str, instruction: str):
    """
    Modify an existing recipe using Gemini instructions (e.g., 'make it spicier').
    The modified recipe replaces the old one in MongoDB.
    """
    # 1️⃣ Fetch old recipe
    old_recipe = recipes_collection.find_one({"recipe_id": recipe_id}, {"_id": 0})
    if not old_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # 2️⃣ Create the modification prompt
    new_prompt = (
        f"You are an expert chef. Modify the given recipe according to the instruction below.\n\n"
        f"Instruction: {instruction}\n\n"
        "Return ONLY valid JSON with these exact keys:\n"
        "{ 'title': '', 'ingredients': [], 'instructions': [], 'prep_time': '', 'difficulty': '' }\n\n"
        f"Here is the original recipe:\n{json.dumps(old_recipe, indent=2)}"
    )

    # 3️⃣ Call Gemini model
    result = model.invoke(new_prompt)

    # ✅ Extract text from AIMessage (important fix!)
    response_text = result.content if hasattr(result, "content") else str(result)

    # 4️⃣ Clean and parse JSON safely
    cleaned = (
        response_text.strip()
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        print("⚠️ Gemini returned invalid JSON. Raw output:")
        print(response_text)
        raise HTTPException(status_code=500, detail="Failed to parse Gemini JSON output.")

    # 5️⃣ Preserve the same recipe_id and update MongoDB
    data["recipe_id"] = old_recipe["recipe_id"]

    try:
        recipes_collection.update_one({"recipe_id": recipe_id}, {"$set": data})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB update failed: {e}")

    # 6️⃣ Return the modified recipe
    return RecipeResponse(**data)
