import * as cheerio from "cheerio";

export const cleanText = (text: string | undefined): string => {
  const $ = cheerio.load(`<div>${text}</div>`);
  return $("div").text().replace(/\s+/g, " ").trim();
};
