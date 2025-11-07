import { useState } from "react";
import RecipeForm from "../components/RecipeForm";
import RecipeCard from "../components/RecipeCard";
import { generateRecipe } from "../api/recipeApi";
import "./Home.css";

export default function Home() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (payload) => {
    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const data = await generateRecipe(payload);
      setRecipe(data);
    } catch (err) {
      setError("⚠️ Failed to generate recipe. Please check your backend connection or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2 className="heading">🍳 AI Recipe Generator</h2>

      <div className="home-content">
        <RecipeForm onGenerate={handleGenerate} />

        <div className="recipe-display">
          {loading && <p className="loading-text">⏳ Generating your recipe...</p>}
          {error && <p className="error-text">{error}</p>}
          {recipe && <RecipeCard recipe={recipe} />}
        </div>
      </div>
    </div>
  );
}
