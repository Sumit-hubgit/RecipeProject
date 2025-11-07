import { useState } from "react";
import "./RecipeForm.css";
export default function RecipeForm({ onGenerate }) {
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      alert("Please enter at least one ingredient.");
      return;
    }

    onGenerate({
      ingredients: ingredients.split(",").map((i) => i.trim()),
      dietary_restrictions: dietary ? [dietary] : [],
      cuisine_type: cuisine,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-box">
      <h2>🍳 Generate a Recipe</h2>

      <input
        type="text"
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        />

      <select value={dietary} onChange={(e) => setDietary(e.target.value)}>
        <option value="">No Dietary Restriction</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="gluten-free">Gluten-Free</option>
      </select>

      <input
        type="text"
        placeholder="Cuisine type (e.g., Indian, Italian)"
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
      />

      <button type="submit" >Generate Recipe</button>
    </form>
  );
}
