const MAX_SUMMARY_LENGTH = 220;

const cleanText = (value = "") =>
  String(value)
    .replace(/\[\+\d+\schars\]$/i, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const summarize = (...candidates) => {
  const text =
    candidates.map(cleanText).find((candidate) => candidate.length > 0) ||
    "Open the original story for the full report.";

  if (text.length <= MAX_SUMMARY_LENGTH) {
    return text;
  }

  const shortened = text.slice(0, MAX_SUMMARY_LENGTH);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 150 ? lastSpace : -1).trim()}...`;
};

export const normalizeArticle = (article, provider, category = "general") => ({
  id: Buffer.from(
    `${provider}:${article.url || article.title || Math.random()}`,
  ).toString("base64url"),
  title: cleanText(article.title) || "Untitled story",
  summary: summarize(article.description, article.content),
  source:
    cleanText(article.source?.name || article.source) || "Unknown source",
  author: cleanText(article.author) || null,
  publishedAt: article.publishedAt || new Date().toISOString(),
  imageUrl: article.urlToImage || article.image || null,
  url: article.url || "#",
  category,
  provider,
});

export const removeInvalidAndDuplicateArticles = (articles) => {
  const seen = new Set();

  return articles.filter((article) => {
    const title = article.title?.toLowerCase();
    const valid =
      title &&
      title !== "[removed]" &&
      article.url &&
      article.url !== "#" &&
      !seen.has(article.url);

    if (valid) {
      seen.add(article.url);
    }

    return valid;
  });
};
