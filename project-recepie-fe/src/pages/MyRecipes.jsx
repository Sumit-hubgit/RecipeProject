import { useEffect, useState } from "react";
import ModifyRecipeModal from "../components/ModifyRecipeModal";
import "./MyRecipes.css";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(false);

  // ✅ Fetch all recipes
  useEffect(() => {
    fetch("http://127.0.0.1:8001/api/recipes/")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:8001/api/recipes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete recipe");
      alert("✅ Recipe deleted successfully");
      setRecipes((prev) => prev.filter((r) => r.recipe_id !== id));
      setSelectedRecipe(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting recipe");
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  // ✅ Update the recipe after modification
  const handleRecipeUpdate = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.recipe_id === updatedRecipe.recipe_id ? updatedRecipe : r
      )
    );
    setSelectedRecipe(updatedRecipe);
  };

  return (
    <div className="myrecipes-container">
      <h2 className="heading">📜 My Recipes</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ===== Recipe Grid ===== */}
      <div className={`recipe-grid ${selectedRecipe ? "blur-active" : ""}`}>
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <div
              key={r.recipe_id}
              className="recipe-card-mini"
              onClick={() => setSelectedRecipe(r)}
            >
              {r.title}
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

      {/* ===== Detail Modal ===== */}
      {selectedRecipe && (
        <div className="modal-overlay">
          <div className="modal-box-lg">
            <button className="close-btn" onClick={closeModal}>✖</button>
            <h2>{selectedRecipe.title}</h2>

            <h3>Ingredients</h3>
            <ul>
              {selectedRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <h3>Instructions</h3>
            <ol>
              {selectedRecipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>

            <p><strong>Prep Time:</strong> {selectedRecipe.prep_time}</p>
            <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>

            <div className="modal-actions">
              <button
                className="modify-btn"
                onClick={() => setShowModifyModal(true)}
              >
                ✏️ Modify
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(selectedRecipe.recipe_id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modify Recipe Modal ===== */}
      {showModifyModal && (
        <ModifyRecipeModal
          recipe={selectedRecipe}
          onClose={() => setShowModifyModal(false)}
          onUpdate={handleRecipeUpdate}
        />
      )}
    </div>
  );
}
