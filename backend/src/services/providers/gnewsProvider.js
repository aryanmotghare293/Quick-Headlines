import axios from "axios";
import { normalizeArticle } from "../../utils/article.js";

export class GNewsProvider {
  name = "gnews";

  constructor({ apiKey, timeoutMs, country, language }) {
    this.apiKey = apiKey;
    this.country = country;
    this.language = language;
    this.client = axios.create({
      baseURL: "https://gnews.io/api/v4",
      timeout: timeoutMs,
    });
  }

  commonParams({ page, pageSize, country, language }) {
    return {
      apikey: this.apiKey,
      country: country || this.country,
      lang: language || this.language,
      max: pageSize,
      page,
    };
  }

  async topHeadlines(options) {
    const { data } = await this.client.get("/top-headlines", {
      params: {
        ...this.commonParams(options),
        category: "general",
      },
    });
    return this.toResult(data, "general", options.page, options.pageSize);
  }

  async byCategory({ category, ...options }) {
    const { data } = await this.client.get("/top-headlines", {
      params: {
        ...this.commonParams(options),
        category,
      },
    });
    return this.toResult(data, category, options.page, options.pageSize);
  }

  async search({ query, ...options }) {
    const { data } = await this.client.get("/search", {
      params: {
        ...this.commonParams(options),
        q: query,
        sortby: "publishedAt",
      },
    });
    return this.toResult(data, "search", options.page, options.pageSize);
  }

  toResult(data, category, page, pageSize) {
    return {
      articles: (data.articles || []).map((article) =>
        normalizeArticle(article, this.name, category),
      ),
      totalResults: data.totalArticles || 0,
      page,
      pageSize,
    };
  }
}
