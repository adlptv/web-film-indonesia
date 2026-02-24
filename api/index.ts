import express, { Application, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

// --- Types ---
export interface IMovie {
    _id: string;
    title: string;
    type: string;
    poster?: string;
    year?: number;
    rating?: string;
    quality?: string;
    episodeLabel?: string;
}

export interface ISeries extends IMovie {
    episodesCount?: number;
}

export interface IStream {
    provider: string;
    link: string;
}

export interface IEpisode {
    season: number;
    title: string;
    slug: string;
}

export interface IMovieDetail extends IMovie {
    director: string;
    cast: string[];
    description: string;
    duration: string;
    similar: IMovie[];
}

export interface ISeriesDetail extends IMovie {
    director: string;
    cast: string[];
    description: string;
    episodes: IEpisode[];
}

// --- Utils ---
export const cleanText = (text: string | undefined): string => {
    if (!text) return "";
    const $ = cheerio.load(text);
    return $.text().trim();
};

const lk21_api = axios.create({
    baseURL: (process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, ""),
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    },
    timeout: 15000,
});

// --- Scrapers ---
const moviesScrape = async (res: AxiosResponse) => {
    const $: any = cheerio.load(res.data);
    const payload: IMovie[] = [];
    const items = $("#results article, .gallery-grid article, .grid-archive article");
    items.each((index, element) => {
        const obj = {} as IMovie;
        const href = $(element).find("a").attr("href") || "";
        const cleanHref = href.replace(/\/$/, "");
        obj["_id"] = cleanHref.split("/").pop() || "";
        obj["type"] = "movie";
        obj["title"] = $(element).find("h3, .poster-title").first().text().trim();
        obj["poster"] = $(element).find("img").attr("src") || $(element).find("img").attr("data-src");
        obj["year"] = parseInt($(element).find(".year").text().trim()) || 0;
        if (obj._id && obj.title) payload.push(obj);
    });
    return payload;
};

const movieDetailScrape = async (res: AxiosResponse) => {
    const $: any = cheerio.load(res.data);
    const obj = {} as IMovieDetail;
    obj["title"] = $(".movie-info h1, .content-left h1, h1").first().text().trim();
    obj["director"] = $(".detail p").eq(0).find("a").text().trim();
    obj["cast"] = $(".detail p").eq(1).find("a").map((i, el) => $(el).text().trim()).get();
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    obj["duration"] = $(".info-tag span").eq(3).text().trim() || $(".info-tag span").last().text().trim();
    const similarMovies: IMovie[] = [];
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
};

const seriesScrape = async (res: AxiosResponse) => {
    const $: any = cheerio.load(res.data);
    const payload: ISeries[] = [];
    const items = $("#results article, .gallery-grid article, .grid-archive article");
    items.each((index, element) => {
        const obj = {} as ISeries;
        const href = $(element).find("a").attr("href") || "";
        const cleanHref = href.replace(/\/$/, "");
        obj["_id"] = cleanHref.split("/").pop() || "";
        obj["type"] = "series";
        obj["title"] = $(element).find("h3, .poster-title").first().text().trim();
        obj["poster"] = $(element).find("img").attr("src") || $(element).find("img").attr("data-src");
        obj["year"] = parseInt($(element).find(".year").text().trim()) || 0;
        if (obj._id && obj.title) payload.push(obj);
    });
    return payload;
};

const detailSeriesScrape = async (res: AxiosResponse) => {
    const $: any = cheerio.load(res.data);
    const obj = {} as ISeriesDetail;
    obj["title"] = $(".movie-info h1").text().trim();
    obj["type"] = "series";
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    obj["director"] = $(".detail p").first().find("a").text().trim();
    obj["cast"] = $(".detail p").eq(0).find("a").map((i, el) => $(el).text().trim()).get();
    const script = $("#season-data");
    if (script.length) {
        const json = JSON.parse(script.text());
        obj["episodes"] = Object.values(json).flat().map((ep: any) => ({
            season: ep.s,
            title: ep.title,
            slug: ep.slug,
        }));
    } else {
        obj["episodes"] = [];
    }
    return obj;
};

const streamScrape = async (res: AxiosResponse) => {
    const $: any = cheerio.load(res.data);
    const streams: IStream[] = [];
    $("#player-list a").each((i, el) => {
        streams.push({
            provider: $(el).text().trim() || "",
            link: $(el).attr("href") || "",
        });
    });
    return streams;
};

// --- Controllers ---
const tryMirrors = async (id: string, scraper: any, isSeries = false) => {
    const mirrors = isSeries
        ? [(process.env.ND_BASE_URL || "https://tv3.nontondrama.my").replace(/\/$/, ""), "https://tv2.nontondrama.my"]
        : [(process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, ""), "https://tv7.lk21official.cc", "https://tv2.lk21official.cc"];

    for (const baseUrl of mirrors) {
        try {
            const AxiosResponse = await lk21_api.get(`${baseUrl}/${id}`, {
                timeout: 10000,
                headers: { "Referer": baseUrl + "/" }
            });
            const data = await scraper(AxiosResponse);
            if (data && (Array.isArray(data) ? data.length > 0 : (data.title || data.length > 0))) return data;
        } catch (err) { }
    }
    return null;
};

// --- App Setup ---
const app: Application = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

// Routes Implementation
app.get("/api/movies/latest", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const baseUrl = (process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, "");
        const response = await lk21_api.get(`${baseUrl}/latest/page/${Number(page)}`, { headers: { "Referer": baseUrl + "/" } });
        const data = await moviesScrape(response);
        res.json({ data });
    } catch (err) { res.status(500).json({ data: [] }); }
});

app.get("/api/movies/populer", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const baseUrl = (process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, "");
        const response = await lk21_api.get(`${baseUrl}/populer/page/${Number(page)}`, { headers: { "Referer": baseUrl + "/" } });
        const data = await moviesScrape(response);
        res.json({ data });
    } catch (err) { res.status(500).json({ data: [] }); }
});

app.get("/api/movies/:id", async (req, res) => {
    const data = await tryMirrors(req.params.id, movieDetailScrape);
    res.json({ data });
});

app.get("/api/movies/:id/stream", async (req, res) => {
    const data = await tryMirrors(req.params.id, streamScrape);
    res.json({ data });
});

app.get("/api/search", async (req, res) => {
    const { s, page = 1 } = req.query;
    const query = String(s).trim();
    if (!query) return res.status(400).json({ error: "Missing query" });

    const mirrors = [(process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, ""), "https://tv7.lk21official.cc"];
    let payload: any[] = [];
    for (const baseUrl of mirrors) {
        try {
            const resp = await lk21_api.get(`${baseUrl}/search?s=${encodeURIComponent(query)}&page=${Number(page)}`, { headers: { "Referer": baseUrl + "/" } });
            payload = await moviesScrape(resp);
            if (payload.length > 0) break;
        } catch (err) { }
    }
    res.json({ data: payload });
});

// Series Routes
app.get("/api/series/latest", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const baseUrl = (process.env.ND_BASE_URL || "https://tv3.nontondrama.my").replace(/\/$/, "");
        const response = await lk21_api.get(`${baseUrl}/latest/page/${Number(page)}`, { headers: { "Referer": baseUrl + "/" } });
        const data = await seriesScrape(response);
        res.json({ data });
    } catch (err) { res.status(500).json({ data: [] }); }
});

app.get("/api/series/:id", async (req, res) => {
    const data = await tryMirrors(req.params.id, detailSeriesScrape, true);
    res.json({ data });
});

app.get("/api/series/:id/stream", async (req, res) => {
    const data = await tryMirrors(req.params.id, streamScrape, true);
    res.json({ data });
});

// Proxy
app.get("/api/proxy", async (req, res) => {
    const url = req.query.url as string;
    if (!url) return res.status(400).send("Missing URL");
    try {
        const response = await lk21_api.get(url, { responseType: "text" });
        res.setHeader("Content-Type", "text/html");
        const baseUrl = new URL(url);
        const html = (response.data as string).replace("<head>", `<head><base href="${baseUrl.origin}/">`);
        res.send(html);
    } catch (err) { res.status(502).send("Proxy error"); }
});

app.get("/api", (req, res) => res.json({ message: "API is active!", timestamp: new Date() }));

export default app;
