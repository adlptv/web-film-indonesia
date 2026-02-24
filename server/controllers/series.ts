import {
  detailSeriesScrape,
  seriesScrape,
  seriesStreamScrape,
} from "../scrapers/series";
import { Request, Response, NextFunction } from "express";
import api from "../util/axios-instance";

type TController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const getBaseUrl = () => process.env.ND_BASE_URL || "https://tv3.nontondrama.my";

const createSeriesController = (
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

      const series = await seriesScrape(req, AxiosResponse);

      res.status(200).json({ message: message, data: series });
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: [] });
    }
  };
};

export const latestSeries = createSeriesController("latest", "Latest Series");
export const populerSeries = createSeriesController("populer", "Populer Series");
export const ratingSeries = createSeriesController("rating", "Best Rating Series");
export const ongoingSeries = createSeriesController("series/ongoing", "Ongoing Series");

export const detailSeries: TController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const baseUrl = getBaseUrl();

    const AxiosResponse = await api.get(`${baseUrl}/${id}`, {
      headers: { "Referer": baseUrl + "/" }
    });

    const series = await detailSeriesScrape(req, AxiosResponse);

    res.status(200).json({ message: "Series Details", data: series });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

export const streamSeries: TController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const baseUrl = getBaseUrl();

    const AxiosResponse = await api.get(`${baseUrl}/${id}`, {
      headers: { "Referer": baseUrl + "/" }
    });

    const series = await seriesStreamScrape(req, AxiosResponse);

    res.status(200).json({ message: "Series Streams", data: series });
  } catch (error) {
    console.log(error);
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

      const payload = await seriesScrape(req, AxiosResponse);
      res.status(200).json({ data: payload });
    } catch (error) {
      res.status(500).json({ data: [] });
    }
  };
};

export const genreSeries = createCategoriesController("genre");
export const countryseries = createCategoriesController("country");
