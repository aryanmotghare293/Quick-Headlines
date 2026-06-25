import axios from "axios";
import { normalizeArticle } from "../../utils/article.js";

export class NewsApiProvider {
  name = "newsapi";

  constructor({ apiKey, timeoutMs, country, language }) {
    this.country = country;
    this.language = language;
    this.client = axios.create({
      baseURL: "https://newsapi.org/v2",
      timeout: timeoutMs,
      headers: { "X-Api-Key": apiKey },
    });
  }

  async topHeadlines({ page, pageSize, country = this.country }) {
    const { data } = await this.client.get("/top-headlines", {
      params: { country, page, pageSize },
    });
    return this.toResult(data, "general", page, pageSize);
  }

  async byCategory({ category, page, pageSize, country = this.country }) {
    const { data } = await this.client.get("/top-headlines", {
      params: { country, category, page, pageSize },
    });
    return this.toResult(data, category, page, pageSize);
  }

  async search({ query, page, pageSize, language = this.language }) {
    const { data } = await this.client.get("/everything", {
      params: {
        q: query,
        language,
        sortBy: "publishedAt",
        page,
        pageSize,
      },
    });
    return this.toResult(data, "search", page, pageSize);
  }

  toResult(data, category, page, pageSize) {
    return {
      articles: (data.articles || []).map((article) =>
        normalizeArticle(article, this.name, category),
      ),
      totalResults: data.totalResults || 0,
      page,
      pageSize,
    };
  }
}
