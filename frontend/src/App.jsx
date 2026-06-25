import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowDown, RefreshCw, SlidersHorizontal } from "lucide-react";
import { fetchNews } from "./api/newsApi.js";
import { CategoryBar } from "./components/CategoryBar.jsx";
import { EmptyState } from "./components/EmptyState.jsx";
import { FeaturedStory } from "./components/FeaturedStory.jsx";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
import { InterestModal } from "./components/InterestModal.jsx";
import { NewsCard } from "./components/NewsCard.jsx";
import { NewsSkeleton } from "./components/NewsSkeleton.jsx";
import { categoryLabel } from "./constants/categories.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

const PAGE_SIZE = 10;

const feedCopy = {
  top: {
    kicker: "The daily signal",
    title: "Stories shaping the moment",
    description:
      "A clear view of the most important headlines, updated throughout the day.",
  },
  recommendations: {
    kicker: "Picked for you",
    title: "Your personal briefing",
    description:
      "A tailored mix based on the topics you care about most.",
  },
  bookmarks: {
    kicker: "Your reading list",
    title: "Saved for later",
    description: "The stories you marked, collected in one quiet place.",
  },
};

function App() {
  const [theme, setTheme] = useLocalStorage("pulsewire-theme", "light");
  const [bookmarks, setBookmarks] = useLocalStorage(
    "pulsewire-bookmarks",
    [],
  );
  const [interests, setInterests] = useLocalStorage("pulsewire-interests", [
    "technology",
    "business",
  ]);
  const [feedType, setFeedType] = useState("top");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111815" : "#f2f4ef");
  }, [theme]);

  useEffect(() => {
    if (feedType === "bookmarks") {
      setLoading(false);
      setError("");
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchNews(
      {
        feedType,
        category,
        query: searchQuery,
        interests,
        page,
        pageSize: PAGE_SIZE,
      },
      controller.signal,
    )
      .then(({ articles: nextArticles, meta: nextMeta }) => {
        setArticles((current) => {
          const combined = page === 1 ? nextArticles : [...current, ...nextArticles];
          return combined.filter(
            (article, index, all) =>
              all.findIndex((item) => item.url === article.url) === index,
          );
        });
        setMeta(nextMeta);
      })
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED") {
          setError(
            requestError.response?.data?.error ||
              "The news feed could not be loaded. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [category, feedType, interests, page, requestVersion, searchQuery]);

  const visibleArticles =
    feedType === "bookmarks" ? bookmarks : articles;

  const bookmarkedUrls = useMemo(
    () => new Set(bookmarks.map((article) => article.url)),
    [bookmarks],
  );

  const selectFeed = (nextFeed, nextCategory = "") => {
    setFeedType(nextFeed);
    setCategory(nextCategory);
    setPage(1);
    setArticles([]);
    setMeta(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchInput.trim();

    if (query.length < 2) {
      return;
    }

    setSearchQuery(query);
    selectFeed("search");
  };

  const toggleBookmark = (article) => {
    setBookmarks((current) =>
      current.some((item) => item.url === article.url)
        ? current.filter((item) => item.url !== article.url)
        : [article, ...current],
    );
  };

  const saveInterests = (nextInterests) => {
    setInterests(nextInterests);
    setInterestModalOpen(false);
    selectFeed("recommendations");
  };

  const copy =
    feedType === "category"
      ? {
          kicker: "Category desk",
          title: categoryLabel(category),
          description: `The latest reporting and analysis from the world of ${categoryLabel(
            category,
          ).toLowerCase()}.`,
        }
      : feedType === "search"
        ? {
            kicker: "Search results",
            title: `“${searchQuery}”`,
            description: "The newest matching stories from across the news.",
          }
        : feedCopy[feedType];

  const featured = visibleArticles[0];
  const gridArticles = featured ? visibleArticles.slice(1) : [];
  const showSkeleton = loading && visibleArticles.length === 0;
  const canLoadMore =
    feedType !== "bookmarks" && Boolean(meta?.hasMore) && !error;

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onNavigateHome={() => selectFeed("top")}
        onShowBookmarks={() => selectFeed("bookmarks")}
        onShowRecommendations={() => selectFeed("recommendations")}
        onCustomize={() => setInterestModalOpen(true)}
        bookmarkCount={bookmarks.length}
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
        onSearch={handleSearch}
      />

      <CategoryBar
        activeFeed={feedType}
        activeCategory={category}
        onSelect={selectFeed}
      />

      <main>
        <section className="intro-section">
          <div>
            <p className="section-kicker">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p className="section-description">{copy.description}</p>
          </div>
          <div className="intro-aside">
            {feedType === "recommendations" && (
              <button
                className="secondary-button"
                type="button"
                onClick={() => setInterestModalOpen(true)}
              >
                <SlidersHorizontal size={17} />
                Tune interests
              </button>
            )}
            {meta && (
              <span className="provider-status">
                <span className={meta.fallback ? "status-demo" : "status-live"} />
                {meta.fallback ? "Demo feed" : `Live via ${meta.provider}`}
              </span>
            )}
          </div>
        </section>

        {meta?.notice && (
          <div className="notice-banner">
            <AlertCircle size={18} />
            <span>
              {meta.notice} Showing the built-in demo feed in the meantime.
            </span>
          </div>
        )}

        {error && visibleArticles.length === 0 && (
          <div className="error-panel" role="alert">
            <AlertCircle size={24} />
            <div>
              <strong>We lost the signal.</strong>
              <p>{error}</p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setError("");
                setArticles([]);
                setPage(1);
                setRequestVersion((current) => current + 1);
              }}
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        )}

        {showSkeleton && <NewsSkeleton />}

        {!loading && !error && visibleArticles.length === 0 && (
          <EmptyState type={feedType} onAction={() => selectFeed("top")} />
        )}

        {featured && (
          <>
            <FeaturedStory
              article={featured}
              isBookmarked={bookmarkedUrls.has(featured.url)}
              onToggleBookmark={toggleBookmark}
            />

            {gridArticles.length > 0 && (
              <section className="feed-section" aria-labelledby="latest-heading">
                <div className="feed-heading">
                  <h2 id="latest-heading">
                    {feedType === "bookmarks" ? "More saved stories" : "More to know"}
                  </h2>
                  <span>
                    {feedType === "bookmarks"
                      ? `${bookmarks.length} saved`
                      : `${meta?.totalResults || visibleArticles.length} stories`}
                  </span>
                </div>
                <div className="news-grid">
                  {gridArticles.map((article) => (
                    <NewsCard
                      article={article}
                      isBookmarked={bookmarkedUrls.has(article.url)}
                      onToggleBookmark={toggleBookmark}
                      key={article.id || article.url}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {canLoadMore && (
          <div className="load-more-wrap">
            <button
              className="load-more-button"
              type="button"
              disabled={loading}
              onClick={() => setPage((current) => current + 1)}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Fetching stories
                </>
              ) : (
                <>
                  Load more
                  <ArrowDown size={17} />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <Footer />

      <InterestModal
        open={interestModalOpen}
        interests={interests}
        onClose={() => setInterestModalOpen(false)}
        onSave={saveInterests}
      />
    </div>
  );
}

export default App;
