import { env } from "../config/env.js";
import { MemoryCache } from "../utils/cache.js";
import { removeInvalidAndDuplicateArticles } from "../utils/article.js";
import { ApiError } from "../utils/apiError.js";
import { DemoProvider } from "./providers/demoProvider.js";
import { GNewsProvider } from "./providers/gnewsProvider.js";
import { NewsApiProvider } from "./providers/newsApiProvider.js";

const cache = new MemoryCache(env.cacheTtlMs);

const providerOptions = {
  timeoutMs: env.requestTimeoutMs,
  country: env.defaultCountry,
  language: env.defaultLanguage,
};

const createConfiguredProvider = () => {
  if (env.newsProvider === "newsapi") {
    if (!env.newsApiKey) {
      throw new ApiError(503, "NEWS_API_KEY is not configured.");
    }
    return new NewsApiProvider({ ...providerOptions, apiKey: env.newsApiKey });
  }

  if (env.newsProvider === "gnews") {
    if (!env.gnewsApiKey) {
      throw new ApiError(503, "GNEWS_API_KEY is not configured.");
    }
    return new GNewsProvider({ ...providerOptions, apiKey: env.gnewsApiKey });
  }

  if (env.newsProvider === "demo") {
    return new DemoProvider();
  }

  if (env.newsProvider !== "auto") {
    throw new ApiError(
      500,
      `Unsupported NEWS_PROVIDER "${env.newsProvider}".`,
    );
  }

  if (env.newsApiKey) {
    return new NewsApiProvider({ ...providerOptions, apiKey: env.newsApiKey });
  }

  if (env.gnewsApiKey) {
    return new GNewsProvider({ ...providerOptions, apiKey: env.gnewsApiKey });
  }

  return new DemoProvider();
};

const primaryProvider = createConfiguredProvider();
const demoProvider = new DemoProvider();

const publicErrorMessage = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    return "The configured news provider rejected the API key.";
  }

  if (error.response?.status === 429) {
    return "The news provider rate limit has been reached. Try again shortly.";
  }

  if (error.code === "ECONNABORTED") {
    return "The news provider took too long to respond.";
  }

  return error.response?.data?.message || error.message || "News request failed.";
};

const runProviderRequest = async (method, options) => {
  const key = `${method}:${primaryProvider.name}:${JSON.stringify(options)}`;
  const cached = cache.get(key);

  if (cached) {
    return { ...cached, cached: true };
  }

  try {
    const result = await primaryProvider[method](options);
    const response = {
      ...result,
      articles: removeInvalidAndDuplicateArticles(result.articles),
      provider: primaryProvider.name,
      fallback: false,
      cached: false,
    };
    cache.set(key, response);
    return response;
  } catch (error) {
    if (primaryProvider.name !== "demo" && env.allowDemoFallback) {
      const result = await demoProvider[method](options);
      return {
        ...result,
        articles: removeInvalidAndDuplicateArticles(result.articles),
        provider: "demo",
        fallback: true,
        cached: false,
        notice: publicErrorMessage(error),
      };
    }

    throw new ApiError(502, publicErrorMessage(error));
  }
};

export const getTopHeadlines = (options) =>
  runProviderRequest("topHeadlines", options);

export const getNewsByCategory = (options) =>
  runProviderRequest("byCategory", options);

export const searchNews = (options) => runProviderRequest("search", options);

export const getRecommendations = async ({
  interests,
  page,
  pageSize,
  country,
}) => {
  const selectedInterests = interests.slice(0, 3);
  const requestSize = Math.max(4, Math.ceil(pageSize / selectedInterests.length));
  const responses = await Promise.all(
    selectedInterests.map((category) =>
      getNewsByCategory({
        category,
        page,
        pageSize: requestSize,
        country,
      }),
    ),
  );

  const articles = responses
    .flatMap((response) => response.articles)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, pageSize);

  return {
    articles: removeInvalidAndDuplicateArticles(articles),
    totalResults: responses.reduce(
      (total, response) => total + response.totalResults,
      0,
    ),
    page,
    pageSize,
    provider: responses.some((response) => response.provider === "demo")
      ? "demo"
      : primaryProvider.name,
    fallback: responses.some((response) => response.fallback),
    cached: responses.every((response) => response.cached),
    interests: selectedInterests,
  };
};

export const getProviderStatus = () => ({
  provider: primaryProvider.name,
  live: primaryProvider.name !== "demo",
  demoFallbackEnabled: env.allowDemoFallback,
});
