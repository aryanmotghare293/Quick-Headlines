import {
  Bookmark,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
} from "lucide-react";

export function Header({
  theme,
  onToggleTheme,
  onNavigateHome,
  onShowBookmarks,
  onShowRecommendations,
  onCustomize,
  bookmarkCount,
  searchValue,
  onSearchValueChange,
  onSearch,
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="brand"
          type="button"
          onClick={onNavigateHome}
          aria-label="Go to top stories"
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Quick Headlines</span>
        </button>

        <form className="search-form" onSubmit={onSearch}>
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search a topic, company, or person"
            aria-label="Search news"
            minLength={2}
          />
          <kbd>Enter</kbd>
        </form>

        <nav className="header-actions" aria-label="News tools">
          <button
            className="header-action"
            type="button"
            onClick={onShowRecommendations}
          >
            <Sparkles size={18} />
            <span>For you</span>
          </button>
          <button
            className="header-action icon-action mobile-hide"
            type="button"
            onClick={onCustomize}
            aria-label="Customize interests"
            title="Customize interests"
          >
            <SlidersHorizontal size={18} />
          </button>
          <button
            className="header-action saved-action"
            type="button"
            onClick={onShowBookmarks}
          >
            <Bookmark size={18} />
            <span className="mobile-hide">Saved</span>
            {bookmarkCount > 0 && (
              <span className="count-badge">{bookmarkCount}</span>
            )}
          </button>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
