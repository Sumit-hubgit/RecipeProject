export default function RecipeDetailsModal({ recipe, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box-lg">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>{recipe.title}</h2>
        <p>
          ⏱ {recipe.prep_time} | 🧑‍🍳 {recipe.difficulty}
        </p>

        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>

        <h3>Instructions:</h3>
        <ol>
          {recipe.instructions.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
