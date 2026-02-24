import dotenv from "dotenv";

dotenv.config();

import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";
import routes from "./routes/routes";
const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

// Mount routes on both /api and root to handle Vercel routing
app.use("/api", routes);
app.use(routes);

// Proxy endpoint to bypass CSP frame-ancestors restriction
// This fetches the streaming player page and serves it from our domain
const proxyHandler = async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    res.status(400).json({ error: "URL parameter is required" });
    return;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": process.env.LK21_BASE_URL || "https://tv8.lk21official.cc",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      responseType: "text",
      timeout: 15000,
    });

    // Set headers - remove CSP that blocks iframe embedding
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");

    // Inject a base tag so relative URLs in the streaming page resolve correctly
    const baseUrl = new URL(url);
    const baseTag = `<base href="${baseUrl.origin}/">`;

    let html = response.data as string;

    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${baseTag}`);
    } else if (html.includes("<HEAD>")) {
      html = html.replace("<HEAD>", `<HEAD>${baseTag}`);
    } else {
      html = baseTag + html;
    }

    res.send(html);
  } catch (error: any) {
    console.error("Proxy error:", error.message);
    res.status(502).json({ error: "Failed to fetch stream", details: error.message });
  }
};

app.get("/proxy", proxyHandler);
app.get("/api/proxy", proxyHandler);

app.get("/", (request: Request, response: Response) => {
  response.json({ message: "API is working!", env: process.env.LK21_BASE_URL ? "set" : "missing" });
});
app.get("/api", (request: Request, response: Response) => {
  response.json({ message: "API is working via /api!", env: process.env.LK21_BASE_URL ? "set" : "missing" });
});

export default app;
