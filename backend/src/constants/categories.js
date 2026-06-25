export const CATEGORIES = Object.freeze([
  "technology",
  "business",
  "sports",
  "health",
  "entertainment",
  "science",
]);

export const isSupportedCategory = (category) =>
  CATEGORIES.includes(String(category).toLowerCase());
