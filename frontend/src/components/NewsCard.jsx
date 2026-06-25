import { ArrowUpRight, Bookmark, Clock3 } from "lucide-react";
import { categoryLabel } from "../constants/categories.js";
import { formatDate, formatDateTime } from "../utils/date.js";
import { ArticleImage } from "./ArticleImage.jsx";

export function NewsCard({ article, isBookmarked, onToggleBookmark }) {
  return (
    <article className="news-card">
      <div className="card-image-wrap">
        <ArticleImage src={article.imageUrl} alt="" />
        <button
          className={`bookmark-button ${isBookmarked ? "active" : ""}`}
          type="button"
          onClick={() => onToggleBookmark(article)}
          aria-label={isBookmarked ? "Remove saved article" : "Save article"}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-eyebrow">
          <span>{categoryLabel(article.category)}</span>
          <span className="dot" />
          <time
            dateTime={article.publishedAt}
            title={formatDateTime(article.publishedAt)}
          >
            <Clock3 size={14} />
            {formatDate(article.publishedAt)}
          </time>
        </div>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <div className="card-footer">
          <span className="source-name">{article.source}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read ${article.title} at ${article.source}`}
          >
            Read more
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
