import { CATEGORIES } from "../../constants/categories.js";
import { normalizeArticle } from "../../utils/article.js";

const stories = [
  {
    category: "technology",
    title: "Smaller AI models move from research labs into everyday devices",
    description:
      "Hardware makers are bringing compact language and vision models onto phones and laptops, promising faster features with less cloud processing.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=on-device%20AI",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "technology",
    title: "Cities expand smart-grid pilots as electricity demand rises",
    description:
      "Utilities are testing software that shifts demand throughout the day and helps neighborhoods use renewable energy more efficiently.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=smart%20grid",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "business",
    title: "Global markets focus on rates, jobs, and the next inflation signal",
    description:
      "Investors are weighing fresh economic data as businesses plan hiring and spending for the second half of the year.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=global%20markets",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "business",
    title: "Independent retailers find new audiences through local delivery",
    description:
      "Small shops are combining digital storefronts with neighborhood fulfillment to compete on convenience and customer relationships.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=small%20business%20retail",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "sports",
    title: "Data-driven training changes how teams manage a long season",
    description:
      "Coaches are using workload tracking and recovery metrics to tailor practice plans and keep athletes available.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=sports%20training%20data",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "sports",
    title: "Youth leagues rethink access, travel, and the cost of competition",
    description:
      "Community programs are testing regional schedules and equipment grants to make organized sports easier for families to join.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=youth%20sports%20access",
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "health",
    title: "Public health teams turn to neighborhood-level heat alerts",
    description:
      "New warning systems combine weather forecasts with local risk factors to help residents prepare for dangerous temperatures.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=heat%20health%20alerts",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "health",
    title: "Researchers study how consistent sleep supports healthy aging",
    description:
      "Long-running studies are looking beyond sleep duration to understand how regular schedules relate to memory and heart health.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=sleep%20healthy%20aging",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "entertainment",
    title: "Independent filmmakers build global audiences one release at a time",
    description:
      "Flexible distribution and festival partnerships are helping smaller productions reach viewers across borders.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=independent%20film",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "entertainment",
    title: "Live music venues experiment with more flexible event formats",
    description:
      "Promoters are mixing early shows, local lineups, and streamed performances to serve broader audiences.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=live%20music%20venues",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "science",
    title: "Ocean sensors offer a sharper view of changing coastal waters",
    description:
      "A new generation of lower-cost instruments is giving researchers more continuous measurements of temperature, chemistry, and currents.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=ocean%20sensors%20research",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "science",
    title: "Astronomers coordinate observatories to catch brief cosmic events",
    description:
      "Automated alerts now help telescopes around the world turn toward short-lived events before they fade.",
    source: "Quick Headlines Demo",
    url: "https://news.google.com/search?q=astronomy%20transient%20events",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
  },
];

const withDates = () =>
  stories.map((story, index) => ({
    ...story,
    publishedAt: new Date(Date.now() - index * 47 * 60 * 1000).toISOString(),
  }));

const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export class DemoProvider {
  name = "demo";

  async topHeadlines({ page, pageSize }) {
    const items = withDates();
    return this.toResult(items, page, pageSize, "general");
  }

  async byCategory({ category, page, pageSize }) {
    const items = withDates().filter((article) => article.category === category);
    return this.toResult(items, page, pageSize, category);
  }

  async search({ query, page, pageSize }) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    let items = withDates().filter((article) => {
      const haystack =
        `${article.title} ${article.description} ${article.category}`.toLowerCase();
      return words.some((word) => haystack.includes(word));
    });

    if (items.length === 0) {
      items = withDates().filter((article) =>
        CATEGORIES.includes(article.category),
      );
    }

    return this.toResult(items, page, pageSize, "search");
  }

  toResult(items, page, pageSize, category) {
    return {
      articles: paginate(items, page, pageSize).map((article) =>
        normalizeArticle(article, this.name, article.category || category),
      ),
      totalResults: items.length,
      page,
      pageSize,
    };
  }
}
