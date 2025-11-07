import { useState } from "react";
import ModifyRecipeModal from "./ModifyRecipeModal";

export default function RecipeCard({ recipe, onDelete }) {
  const [showModify, setShowModify] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(recipe);

  const handleUpdate = (updated) => {
    setCurrentRecipe(updated);
  };

  return (
    <div className="recipe-card">
      <h3>{currentRecipe.title}</h3>
      <p> {currentRecipe.prep_time} | 🧑‍🍳 {currentRecipe.difficulty}</p>

      <h4>Ingredients:</h4>
      <ul>
        {currentRecipe.ingredients.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>

      <h4>Instructions:</h4>
      <ol>
        {currentRecipe.instructions.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ol>

      <div className="btn-row">
        <button onClick={() => setShowModify(true)}>Modify</button>
        {onDelete && (
          <button className="delete-btn" onClick={() => onDelete(currentRecipe.recipe_id)}>
            Delete
          </button>
        )}
      </div>

      {showModify && (
        <ModifyRecipeModal
          recipe={currentRecipe}
          onClose={() => setShowModify(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
