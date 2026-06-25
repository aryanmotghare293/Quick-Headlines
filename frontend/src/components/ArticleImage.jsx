import { useState } from "react";
import { Newspaper } from "lucide-react";

export function ArticleImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`article-image image-fallback ${className}`}>
        <Newspaper aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      className={`article-image ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
