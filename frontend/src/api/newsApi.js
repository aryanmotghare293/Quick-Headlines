import axios from "axios";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ""}/api`,
  timeout: 12000,
});

const endpoints = {
  top: ({ page, pageSize }) => ({
    url: "/news/top",
    params: { page, pageSize },
  }),
  category: ({ category, page, pageSize }) => ({
    url: `/news/category/${category}`,
    params: { page, pageSize },
  }),
  search: ({ query, page, pageSize }) => ({
    url: "/news/search",
    params: { q: query, page, pageSize },
  }),
  recommendations: ({ interests, page, pageSize }) => ({
    url: "/news/recommendations",
    params: { interests: interests.join(","), page, pageSize },
  }),
};

export async function fetchNews(options, signal) {
  const request = endpoints[options.feedType]?.(options);

  if (!request) {
    throw new Error("Unknown news feed.");
  }

  const response = await client.get(request.url, {
    params: request.params,
    signal,
  });

  return {
    articles: response.data.data.articles,
    meta: response.data.meta,
  };
}
