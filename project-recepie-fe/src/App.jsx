import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MyRecipes from "./pages/MyRecipes";
import "./App.css";

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <h1>AI Recipe Generator 🍽️</h1>
        <div>
          <Link to="/">Home</Link>
          <Link to="/my-recipes">My Recipes</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
      </Routes>
    </Router>
  );
}
