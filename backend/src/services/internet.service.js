import { tavily } from "@tavily/core";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const seatchInternet = async (query) => {
  const result = await tvly.search(query, {
    maxResults: 5,
    includeImages: true,
    searchDepth: "basic",
  });
  return JSON.stringify(result);
};