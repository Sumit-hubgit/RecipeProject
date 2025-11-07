from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from myenv.model.recepie_routes import router as recipe_router


app = FastAPI()

# ✅ CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include your recipe routes
app.include_router(recipe_router, prefix="/api/recipes", tags=["Recipes"])


"""from fastapi import FastAPI
from myenv.model.recepie_routes import router as recipe_router

app = FastAPI(title="AI Recipe Generator", version="1.0")

@app.get("/")
def home():
    return {"message": "Welcome to AI Recipe Generator 🍳"}

# Include routes
app.include_router(recipe_router, prefix="/api/recipes", tags=["Recipes"])

"""