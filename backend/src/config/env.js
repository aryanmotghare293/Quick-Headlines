import dotenv from "dotenv";

dotenv.config();

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = Object.freeze({
  port: toPositiveNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  newsProvider: (process.env.NEWS_PROVIDER || "auto").toLowerCase(),
  newsApiKey: process.env.NEWS_API_KEY || "47b2f4dbe1644dbbaa09f6c82cba8998",
  gnewsApiKey: process.env.GNEWS_API_KEY || "6ea33a35b1a28a9029169b1dca540c46",
  defaultCountry: (process.env.DEFAULT_COUNTRY || "us").toLowerCase(),
  defaultLanguage: (process.env.DEFAULT_LANGUAGE || "en").toLowerCase(),
  cacheTtlMs: toPositiveNumber(process.env.CACHE_TTL_SECONDS, 300) * 1000,
  requestTimeoutMs: toPositiveNumber(process.env.REQUEST_TIMEOUT_MS, 8000),
  allowDemoFallback:
    (process.env.ALLOW_DEMO_FALLBACK || "true").toLowerCase() === "true",
});
