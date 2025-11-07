from pydantic import BaseModel, Field
from typing import List, Optional


class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(default=[], description="List of available ingredients")
    dietary_restrictions: List[str] = Field(default=[], description="Dietary restrictions")
    cuisine_type: Optional[str] = Field(default="", description="Type of cuisine")


class RecipeResponse(BaseModel):
    recipe_id: str
    title: str
    ingredients: List[str]
    instructions: List[str]
    prep_time: str
    difficulty: str
