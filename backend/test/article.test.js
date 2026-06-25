import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeArticle,
  removeInvalidAndDuplicateArticles,
  summarize,
} from "../src/utils/article.js";

test("summarize strips provider suffixes and limits long text", () => {
  const summary = summarize(`${"word ".repeat(70)}[+123 chars]`);
  assert.ok(summary.length <= 223);
  assert.ok(!summary.includes("[+123 chars]"));
});

test("normalizeArticle produces a consistent public shape", () => {
  const article = normalizeArticle(
    {
      title: "A headline",
      description: "A useful description",
      source: { name: "Example" },
      url: "https://example.com/story",
      publishedAt: "2026-01-01T00:00:00.000Z",
    },
    "test",
    "science",
  );

  assert.equal(article.source, "Example");
  assert.equal(article.category, "science");
  assert.equal(article.provider, "test");
  assert.ok(article.id);
});

test("removeInvalidAndDuplicateArticles removes duplicate URLs", () => {
  const items = [
    { title: "One", url: "https://example.com/one" },
    { title: "Duplicate", url: "https://example.com/one" },
    { title: "[Removed]", url: "https://example.com/two" },
  ];

  assert.equal(removeInvalidAndDuplicateArticles(items).length, 1);
});
