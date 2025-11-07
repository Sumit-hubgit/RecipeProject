import { useState } from "react";
import { modifyRecipe } from "../api/recipeApi";

export default function ModifyRecipeModal({ recipe, onClose, onUpdate }) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModify = async () => {
    if (!instruction.trim()) {
      setError("Please enter a modification instruction.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updated = await modifyRecipe(recipe.recipe_id, instruction);
      onUpdate(updated);
      onClose();
    } catch (err) {
      setError("Failed to modify recipe. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Modify Recipe</h3>
        <textarea
          placeholder='Example: "make it spicier and creamier"'
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button onClick={handleModify} disabled={loading}>
            {loading ? "Modifying..." : "Apply Changes"}
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
