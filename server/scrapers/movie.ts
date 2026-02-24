import { IMovie, IMovieDetail, IStream } from "../types";
import { cleanText } from "../util/clean-text";
import { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Request } from "express";

export const moviesScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const payload: IMovie[] = [];
    const items = $("#results article, .gallery-grid article, .grid-archive article, ul.sliders > a, .grid-archive > a, #archive-content article");

    items.each((index, element) => {
      const $el = $(element);
      const isAnchor = $el.is("a");

      const obj = {} as IMovie;
      const $a = isAnchor ? $el : $el.find("a").first();
      const href = $a.attr("href");
      if (!href) return;

      const cleanHref = href.replace(/\/$/, "");
      obj["_id"] = cleanHref.split("/").pop() || "";
      obj["type"] = "movie";

      // Try to find title in various places
      obj["title"] = $el.find("h3, .poster-title, figcaption h3").first().text().trim() || $el.find("img").attr("alt") || "";

      obj["poster"] = $el.find("img").attr("src") || $el.find("img").attr("data-src");

      const yearText = $el.find(".year").text().trim();
      obj["year"] = parseInt(yearText) || 0;

      if (obj._id && obj.title) {
        payload.push(obj);
      }
    });

    return payload;
  } catch (error) {
    console.error(error);
  }
};

export const movieDetailScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);
    const obj = {} as IMovieDetail;
    const similarMovies: IMovie[] = [];

    obj["title"] = $(".movie-info h1, .content-left h1, h1").first().text().trim();
    obj["director"] = $(".detail p").eq(0).find("a").text().trim();
    obj["cast"] = $(".detail p")
      .eq(1)
      .find("a")
      .map((i, el) => $(el).text().trim())
      .get();
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    obj["duration"] = $(".info-tag span").eq(3).text().trim() || $(".info-tag span").last().text().trim();

    $(".related-content figure, .video-list a").each((i, el) => {
      const movieObj = {} as IMovie;
      const $el = $(el);
      const $a = $el.is("a") ? $el : $el.find("a").first();

      movieObj["_id"] = $a.attr("href")?.replace(/\/$/, "").split("/").pop() || "";
      movieObj["type"] = "movie";
      movieObj["title"] = $el.find(".video-title, h3").text().trim() || $el.find("img").attr("alt") || "";
      movieObj["poster"] = $el.find("img").attr("src") || $el.find("img").attr("data-src");

      similarMovies.push(movieObj);
    });
    obj["similar"] = similarMovies;

    return obj;
  } catch (error) {
    console.log(error);
  }
};

export const movieStreamScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);
    const streams: IStream[] = [];

    $("#player-list a, .player-list a, .ganti-player a").each((i, el) => {
      const $el = $(el);
      const link = $el.attr("href") || $el.attr("data-url");
      const provider = $el.text().trim() || $el.attr("data-server") || `Server ${i + 1}`;

      if (link && link !== "#") {
        streams.push({
          provider: provider,
          link: link,
        });
      }
    });

    return streams;
  } catch (error) {
    console.error(error);
  }
};
