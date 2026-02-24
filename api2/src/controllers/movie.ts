import {
  movieDetailScrape,
  moviesScrape,
  movieStreamScrape,
} from "../scrapers/movie.js";
import { Request, Response, NextFunction } from "express";
import api from "../util/axios-instance.js";

type TController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const createMovieController = (
  endpoint: string,
  message: string,
): TController => {
  return async (req, res, next) => {
    try {
      const { page = 1 } = req.query;

      const AxiosResponse = await api.get(
        `${process.env.LK21_BASE_URL}/${endpoint}/page/${Number(page)}`,
      );

      const payload = await moviesScrape(req, AxiosResponse);

      res.status(200).json({ message: message, data: payload });
    } catch (error) {
      console.error(error);
    }
  };
};

export const latestMovie = createMovieController("latest", "Latest Movies");

export const ratingMovies = createMovieController("rating", "Best Rating");

export const populerMovies = createMovieController("populer", "Populer");

export const detailMovie: TController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AxiosResponse = await api.get(`${process.env.LK21_BASE_URL}/${id}`);

    const movie = await movieDetailScrape(req, AxiosResponse);

    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    console.log(error);
  }
};

export const streamMovie: TController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AxiosResponse = await api.get(`${process.env.LK21_BASE_URL}/${id}`);

    const movie = await movieStreamScrape(req, AxiosResponse);

    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    console.log(error);
  }
};

const createCategoriesController = (endpoint: string): TController => {
  return async (req, res, next) => {
    const { param } = req.params;
    const { page = 1 } = req.query;

    const AxiosResponse = await api.get(
      `${process.env.LK21_BASE_URL}/${endpoint}/${param}/page/${Number(page)}`,
    );

    const payload = await moviesScrape(req, AxiosResponse);

    res.status(200).json({ data: payload });
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

    // List of mirrors to try
    const mirrors = [
      process.env.LK21_BASE_URL || "https://tv8.lk21official.cc",
      "https://tv7.lk21official.cc",
      "https://tv2.lk21official.cc",
      "https://tv1.lk21official.cc"
    ];

    let payload: any[] = [];

    // strategy 1: JSON API (Often more reliable and faster)
    try {
      console.log(`[Search] Trying JSON API...`);
      const jsonResponse = await api.get(`https://gudangvape.com/index.php?s=${encodeURIComponent(query)}`, {
        headers: { "Referer": "https://tv8.lk21official.cc/" },
        timeout: 5000
      });

      if (jsonResponse.data && jsonResponse.data.results && jsonResponse.data.results.length > 0) {
        payload = jsonResponse.data.results.map((item: any) => ({
          _id: item.slug,
          title: item.title,
          type: item.type === 'movie' ? 'movie' : 'series',
          poster: item.image,
          year: 0
        }));
        console.log(`[Search] JSON API Success found ${payload.length} items`);
      }
    } catch (err) {
      console.warn(`[Search] JSON API failed, falling back to HTML scraping...`);
    }

    // strategy 2: HTML Scraping Mirror Fallbacks
    if (payload.length === 0) {
      for (const baseUrl of mirrors) {
        try {
          const searchUrl = `${baseUrl}/search?s=${encodeURIComponent(query)}&page=${Number(page)}`;
          console.log(`[Search] Trying HTML mirror: ${searchUrl}`);

          const AxiosResponse = await api.get(searchUrl, {
            timeout: 8000,
            headers: {
              "Referer": `${baseUrl}/`
            }
          });

          console.log(`[Search] Mirror status: ${AxiosResponse.status}`);

          const results = await moviesScrape(req, AxiosResponse);
          if (results && results.length > 0) {
            payload = results;
            console.log(`[Search] Success! Found ${payload.length} items on ${baseUrl}`);
            break;
          }
        } catch (err: any) {
          console.warn(`[Search] Mirror ${baseUrl} failing...`);
        }
      }
    }

    res.status(200).json({
      message: payload.length > 0 ? "Search Results" : "No results found",
      data: payload
    });

  } catch (error: any) {
    console.error("Critical Search Error:", error.message);
    res.status(500).json({ error: "Failed to search movies" });
  }
};
