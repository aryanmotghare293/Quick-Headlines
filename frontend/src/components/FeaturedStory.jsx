import { ArrowUpRight, Bookmark, Clock3 } from "lucide-react";
import { categoryLabel } from "../constants/categories.js";
import { formatDate, formatDateTime } from "../utils/date.js";
import { ArticleImage } from "./ArticleImage.jsx";

export function FeaturedStory({
  article,
  isBookmarked,
  onToggleBookmark,
}) {
  return (
    <article className="featured-story">
      <div className="featured-image-wrap">
        <ArticleImage src={article.imageUrl} alt="" className="featured-image" />
        <div className="featured-shade" />
        <div className="featured-content">
          <span className="featured-tag">
            <span className="live-dot" />
            Top story
          </span>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
          <div className="featured-meta">
            <span>{article.source}</span>
            <span className="dot" />
            <time
              dateTime={article.publishedAt}
              title={formatDateTime(article.publishedAt)}
            >
              <Clock3 size={15} />
              {formatDate(article.publishedAt)}
            </time>
            <span className="dot" />
            <span>{categoryLabel(article.category)}</span>
          </div>
          <a
            className="featured-link"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read full story
            <ArrowUpRight size={18} />
          </a>
        </div>
        <button
          className={`featured-bookmark ${isBookmarked ? "active" : ""}`}
          type="button"
          onClick={() => onToggleBookmark(article)}
          aria-label={isBookmarked ? "Remove saved article" : "Save article"}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}
