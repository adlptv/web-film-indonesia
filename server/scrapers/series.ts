import { AxiosResponse } from "axios";
import { Request } from "express";
import * as cheerio from "cheerio";
import { IEpisode, IMovie, ISeries, ISeriesDetail, IStream } from "../types";
import { cleanText } from "../util/clean-text";

export const seriesScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: any = cheerio.load(res.data);

    const payload: ISeries[] = [];
    const items = $("#results article, .gallery-grid article, .grid-archive article");
    console.log(`Series Scraper found ${items.length} items`);

    items.each((index, element) => {
      const obj = {} as ISeries;
      const href = $(element).find("a").attr("href") || "";
      const cleanHref = href.replace(/\/$/, "");

      obj["_id"] = cleanHref.split("/").pop() || "";
      obj["type"] = "series";
      obj["title"] = $(element).find("h3, .poster-title").first().text().trim();
      obj["poster"] = $(element).find("img").attr("src") || $(element).find("img").attr("data-src");
      obj["year"] = parseInt($(element).find(".year").text().trim()) || 0;

      console.log(`- Found series: ${obj.title} (${obj._id})`);

      if (obj._id && obj.title) {
        payload.push(obj);
      }
    });

    return payload;
  } catch (error) {
    console.error(error);
  }
};

export const detailSeriesScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: any = cheerio.load(res.data);

    const obj = {} as ISeriesDetail;
    let episodesList: IEpisode[] = [];

    obj["title"] = $(".movie-info h1").text().trim();
    obj["type"] = "series";
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    obj["director"] = $(".detail p").first().find("a").text().trim();
    obj["cast"] = $(".detail p")
      .eq(0)
      .find("a")
      .map((i, el) => $(el).text().trim())
      .get();
    const script = $("#season-data");
    if (!script.length) return [];
    const json = JSON.parse(script.text());

    episodesList = Object.values(json)
      .flat()
      .map((ep: any) => ({
        season: ep.s,
        title: ep.title,
        slug: ep.slug,
      }));

    obj["episodes"] = episodesList;

    return obj;
  } catch (error) {
    console.error(error);
  }
};

export const seriesStreamScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: any = cheerio.load(res.data);

    const streams: IStream[] = [];

    $("#player-list a").each((i, el) => {
      streams.push({
        provider: $(el).text().trim() || "",
        link: $(el).attr("href") || "",
      });
    });

    return streams;
  } catch (error) {
    console.error(error);
  }
};
