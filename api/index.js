const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

const LK21_BASE = (process.env.LK21_BASE_URL || "https://tv8.lk21official.cc").replace(/\/$/, "");
const ND_BASE = (process.env.ND_BASE_URL || "https://tv3.nontondrama.my").replace(/\/$/, "");

const api = axios.create({
    timeout: 15000,
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
});

// Helper: Clean HTML text
function cleanText(text) {
    if (!text) return "";
    const $ = cheerio.load(text);
    return $.text().trim();
}

// Scraper: Movie List
function scrapeMovieList($) {
    const payload = [];
    $("#results article, .gallery-grid article, .grid-archive article").each((i, el) => {
        const href = $(el).find("a").attr("href") || "";
        const id = href.replace(/\/$/, "").split("/").pop();
        const title = $(el).find("h3, .poster-title").first().text().trim();
        if (id && title) {
            payload.push({
                _id: id,
                title: title,
                type: "movie",
                poster: $(el).find("img").attr("src") || $(el).find("img").attr("data-src"),
                year: parseInt($(el).find(".year").text().trim()) || 0
            });
        }
    });
    return payload;
}

// Routes
app.get("/api/movies/latest", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const resp = await api.get(`${LK21_BASE}/latest/page/${page}`, { headers: { "Referer": LK21_BASE + "/" } });
        const $ = cheerio.load(resp.data);
        res.json({ data: scrapeMovieList($) });
    } catch (err) { res.status(500).json({ error: err.message, data: [] }); }
});

app.get("/api/movies/populer", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const resp = await api.get(`${LK21_BASE}/populer/page/${page}`, { headers: { "Referer": LK21_BASE + "/" } });
        const $ = cheerio.load(resp.data);
        res.json({ data: scrapeMovieList($) });
    } catch (err) { res.status(500).json({ error: err.message, data: [] }); }
});

app.get("/api/movies/:id", async (req, res) => {
    const id = req.params.id;
    const mirrors = [LK21_BASE, "https://tv7.lk21official.cc", "https://tv2.lk21official.cc"];
    for (const base of mirrors) {
        try {
            const resp = await api.get(`${base}/${id}`, { headers: { "Referer": base + "/" } });
            const $ = cheerio.load(resp.data);
            const detail = {
                title: $(".movie-info h1, .content-left h1, h1").first().text().trim(),
                director: $(".detail p").eq(0).find("a").text().trim(),
                cast: $(".detail p").eq(1).find("a").map((i, el) => $(el).text().trim()).get(),
                description: cleanText($("div.synopsis").html()),
                duration: $(".info-tag span").eq(3).text().trim() || "N/A",
                similar: []
            };
            $(".related-content figure, .video-list a").each((i, el) => {
                const $a = $(el).is("a") ? $(el) : $(el).find("a").first();
                detail.similar.push({
                    _id: $a.attr("href").replace(/\/$/, "").split("/").pop(),
                    title: $(el).find(".video-title, h3").text().trim() || $(el).find("img").attr("alt"),
                    poster: $(el).find("img").attr("src") || $(el).find("img").attr("data-src"),
                    type: "movie"
                });
            });
            return res.json({ data: detail });
        } catch (err) { }
    }
    res.status(404).json({ error: "Movie not found" });
});

app.get("/api/movies/:id/stream", async (req, res) => {
    const id = req.params.id;
    const mirrors = [LK21_BASE, "https://tv7.lk21official.cc"];
    for (const base of mirrors) {
        try {
            const resp = await api.get(`${base}/${id}`, { headers: { "Referer": base + "/" } });
            const $ = cheerio.load(resp.data);
            const streams = [];
            $("#player-list a").each((i, el) => {
                streams.push({ provider: $(el).text().trim(), link: $(el).attr("href") });
            });
            if (streams.length > 0) return res.json({ data: streams });
        } catch (err) { }
    }
    res.json({ data: [] });
});

app.get("/api/search", async (req, res) => {
    try {
        const query = req.query.s;
        if (!query) return res.status(400).json({ error: "Query missing" });
        const resp = await api.get(`${LK21_BASE}/search?s=${encodeURIComponent(query)}`, { headers: { "Referer": LK21_BASE + "/" } });
        const $ = cheerio.load(resp.data);
        res.json({ data: scrapeMovieList($) });
    } catch (err) { res.status(500).json({ data: [] }); }
});

// Series
app.get("/api/series/latest", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const resp = await api.get(`${ND_BASE}/latest/page/${page}`, { headers: { "Referer": ND_BASE + "/" } });
        const $ = cheerio.load(resp.data);
        res.json({ data: scrapeMovieList($) }); // Reusing movie list scraper for series list
    } catch (err) { res.status(500).json({ data: [] }); }
});

app.get("/api/series/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const resp = await api.get(`${ND_BASE}/${id}`, { headers: { "Referer": ND_BASE + "/" } });
        const $ = cheerio.load(resp.data);
        const detail = {
            title: $(".movie-info h1").text().trim(),
            type: "series",
            description: cleanText($("div.synopsis").html()),
            episodes: []
        };
        const script = $("#season-data");
        if (script.length) {
            const json = JSON.parse(script.text());
            detail.episodes = Object.values(json).flat().map(ep => ({ season: ep.s, title: ep.title, slug: ep.slug }));
        }
        res.json({ data: detail });
    } catch (err) { res.status(404).json({ error: "Series not found" }); }
});

app.get("/api/proxy", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing URL");
    try {
        const resp = await api.get(url, { responseType: "text" });
        const baseUrl = new URL(url);
        res.setHeader("Content-Type", "text/html");
        res.send(resp.data.replace("<head>", `<head><base href="${baseUrl.origin}/">`));
    } catch (err) { res.status(502).send("Proxy error"); }
});

app.get("/api", (req, res) => res.json({ message: "JS API is active!", now: new Date() }));

module.exports = app;
