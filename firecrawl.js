/*
import FirecrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export const crawlResponse = async (url) => {
  console.log("🔍 Crawling URL:", url);
  console.log("🔑 API Key present:", !!process.env.FIRECRAWL_API_KEY);

  const response = await firecrawl.crawlUrl(url, {
    scrapeOptions: {
      formats: ["markdown", "html"],
    },
  });
  return response;
};
*/
