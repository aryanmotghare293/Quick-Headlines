import { BookmarkX, RefreshCw, SearchX } from "lucide-react";

export function EmptyState({ type, onAction }) {
  const saved = type === "bookmarks";
  const Icon = saved ? BookmarkX : SearchX;

  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={26} />
      </span>
      <h2>{saved ? "No saved stories yet" : "No stories found"}</h2>
      <p>
        {saved
          ? "Use the bookmark button on any story to keep it here for later."
          : "Try a broader search or return to the latest headlines."}
      </p>
      <button className="secondary-button" type="button" onClick={onAction}>
        <RefreshCw size={17} />
        Browse top stories
      </button>
    </div>
  );
}
