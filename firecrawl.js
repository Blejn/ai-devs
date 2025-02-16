import FirecrawlApp from "@mendable/firecrawl-js";

const url = "https://xyz.ag3nts.org/";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export const crawlResponse = await firecrawl.crawlUrl(url, {
  scrapeOptions: {
    formats: ["markdown", "html"],
  },
});
