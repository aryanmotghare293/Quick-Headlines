import { createElement } from "react";
import { Flame } from "lucide-react";
import { CATEGORIES } from "../constants/categories.js";

export function CategoryBar({ activeFeed, activeCategory, onSelect }) {
  return (
    <nav className="category-shell" aria-label="News categories">
      <div className="category-bar">
        <button
          type="button"
          className={`category-pill ${activeFeed === "top" ? "active" : ""}`}
          onClick={() => onSelect("top")}
        >
          <Flame size={16} />
          Trending
        </button>
        {CATEGORIES.map(({ id, label, icon }) => (
          <button
            type="button"
            className={`category-pill ${
              activeFeed === "category" && activeCategory === id ? "active" : ""
            }`}
            key={id}
            onClick={() => onSelect("category", id)}
          >
            {createElement(icon, { size: 16 })}
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
