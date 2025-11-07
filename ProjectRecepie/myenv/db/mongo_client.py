from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_DB_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "recipe_db")

if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not found in .env file!")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collection for recipes
recipes_collection = db["recipes"]
