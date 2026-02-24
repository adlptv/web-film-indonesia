import {
  movieDetailScrape,
  moviesScrape,
  movieStreamScrape,
} from "../scrapers/movie";
import { Request, Response, NextFunction } from "express";
import api from "../util/axios-instance";

type TController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const getBaseUrl = () => (process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, "");

const createMovieController = (
  endpoint: string,
  message: string,
): TController => {
  return async (req, res, next) => {
    try {
      const { page = 1 } = req.query;
      const baseUrl = getBaseUrl();

      const AxiosResponse = await api.get(
        `${baseUrl}/${endpoint}/page/${Number(page)}`,
        { headers: { "Referer": baseUrl + "/" } }
      );

      const payload = await moviesScrape(req, AxiosResponse);

      res.status(200).json({ message: message, data: payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: [] });
    }
  };
};

export const latestMovie = createMovieController("latest", "Latest Movies");
export const ratingMovies = createMovieController("rating", "Best Rating");
export const populerMovies = createMovieController("populer", "Populer");

const tryMirrors = async (req: Request, id: string, scraper: any) => {
  const mirrors = [
    getBaseUrl(),
    "https://tv7.lk21official.cc",
    "https://tv2.lk21official.cc",
    "https://tv1.lk21official.cc",
    "https://tv10.lk21official.cc",
    "https://149.202.164.210"
  ];

  for (const baseUrl of mirrors) {
    try {
      const targetUrl = `${baseUrl.replace(/\/$/, "")}/${id}`;
      console.log(`[Fetch] Trying mirror: ${targetUrl}`);
      const AxiosResponse = await api.get(targetUrl, {
        timeout: 10000,
        headers: {
          "Referer": baseUrl + "/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
      });
      const data = await scraper(req, AxiosResponse);
      if (data && (Array.isArray(data) ? data.length > 0 : (data.title || data.length > 0))) {
        return data;
      }
    } catch (err: any) {
      console.warn(`[Fetch] Mirror ${baseUrl} failed`);
    }
  }
  return null;
};

export const detailMovie: TController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await tryMirrors(req, id, movieDetailScrape);
    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

export const streamMovie: TController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const streams = await tryMirrors(req, id, movieStreamScrape);
    res.status(200).json({ message: "Movie Streams", data: streams });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stream" });
  }
};

const createCategoriesController = (endpoint: string): TController => {
  return async (req, res, next) => {
    try {
      const { param } = req.params;
      const { page = 1 } = req.query;
      const baseUrl = getBaseUrl();

      const AxiosResponse = await api.get(
        `${baseUrl}/${endpoint}/${param}/page/${Number(page)}`,
        { headers: { "Referer": baseUrl + "/" } }
      );

      const payload = await moviesScrape(req, AxiosResponse);
      res.status(200).json({ data: payload });
    } catch (error) {
      res.status(500).json({ data: [] });
    }
  };
};

export const genreMovie = createCategoriesController("genre");
export const countryMovie = createCategoriesController("country");

export const searchMovie: TController = async (req, res, next) => {
  try {
    const { s, page = 1 } = req.query;
    const query = String(s).trim();

    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const mirrors = [
      getBaseUrl(),
      "https://tv7.lk21official.cc",
      "https://tv2.lk21official.cc",
      "https://tv1.lk21official.cc",
      "https://tv10.lk21official.cc",
      "https://149.202.164.210"
    ];

    let payload: any[] = [];

    // strategy: HTML Scraping Mirror Fallbacks (Better ID compatibility)
    for (const baseUrl of mirrors) {
      try {
        const cleanBaseUrl = baseUrl.replace(/\/$/, "");
        const searchUrl = `${cleanBaseUrl}/search?s=${encodeURIComponent(query)}&page=${Number(page)}`;
        const AxiosResponse = await api.get(searchUrl, {
          timeout: 10000,
          headers: { "Referer": cleanBaseUrl + "/" }
        });
        const results = await moviesScrape(req, AxiosResponse);
        if (results && results.length > 0) {
          payload = results;
          break;
        }
      } catch (err: any) { }
    }

    res.status(200).json({
      message: payload.length > 0 ? "Search Results" : "No results found",
      data: payload
    });

  } catch (error: any) {
    res.status(500).json({ error: "Failed to search movies" });
  }
};
