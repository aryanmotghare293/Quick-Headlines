import { CATEGORIES, isSupportedCategory } from "../constants/categories.js";
import {
  getNewsByCategory,
  getProviderStatus,
  getRecommendations,
  getTopHeadlines,
  searchNews,
} from "../services/newsService.js";
import { ApiError } from "../utils/apiError.js";

const parsePagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const requestedSize = Number.parseInt(query.pageSize, 10) || 12;
  const pageSize = Math.min(50, Math.max(1, requestedSize));
  return { page, pageSize };
};

const requestOptions = (request) => ({
  ...parsePagination(request.query),
  country: request.query.country,
  language: request.query.language,
});

const sendNews = (response, data) => {
  response.json({
    success: true,
    data,
    meta: {
      provider: data.provider,
      fallback: data.fallback,
      cached: data.cached,
      notice: data.notice,
      page: data.page,
      pageSize: data.pageSize,
      totalResults: data.totalResults,
      hasMore: data.page * data.pageSize < data.totalResults,
    },
  });
};

export const topHeadlines = async (request, response) => {
  sendNews(response, await getTopHeadlines(requestOptions(request)));
};

export const categoryNews = async (request, response) => {
  const category = request.params.category.toLowerCase();

  if (!isSupportedCategory(category)) {
    throw new ApiError(
      400,
      `Unsupported category. Choose one of: ${CATEGORIES.join(", ")}.`,
    );
  }

  sendNews(
    response,
    await getNewsByCategory({
      ...requestOptions(request),
      category,
    }),
  );
};

export const search = async (request, response) => {
  const query = String(request.query.q || "").trim();

  if (query.length < 2) {
    throw new ApiError(400, "Search query must contain at least 2 characters.");
  }

  if (query.length > 200) {
    throw new ApiError(400, "Search query cannot exceed 200 characters.");
  }

  sendNews(
    response,
    await searchNews({
      ...requestOptions(request),
      query,
    }),
  );
};

export const recommendations = async (request, response) => {
  const interests = String(request.query.interests || "")
    .split(",")
    .map((interest) => interest.trim().toLowerCase())
    .filter(isSupportedCategory);

  if (interests.length === 0) {
    throw new ApiError(
      400,
      "Select at least one valid interest for recommendations.",
    );
  }

  sendNews(
    response,
    await getRecommendations({
      ...requestOptions(request),
      interests: [...new Set(interests)],
    }),
  );
};

export const status = (_request, response) => {
  response.json({
    success: true,
    data: {
      ...getProviderStatus(),
      categories: CATEGORIES,
    },
  });
};
