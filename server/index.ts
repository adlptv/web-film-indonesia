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

// Proxy logic
const handleProxy = async (req: Request, res: Response) => {
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
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");
    const baseUrl = new URL(url);
    const baseTag = `<base href="${baseUrl.origin}/">`;
    let html = response.data as string;
    html = html.includes("<head>") ? html.replace("<head>", `<head>${baseTag}`) : baseTag + html;
    res.send(html);
  } catch (error: any) {
    res.status(502).json({ error: "Failed to fetch stream", details: error.message });
  }
};

app.get("/proxy", handleProxy);
app.get("/api/proxy", handleProxy);

// Mount routes on both root (for direct Vercel calls) and /api (for compatibility)
app.use("/api", routes);
app.use("/", routes);

app.get("/", (request: Request, response: Response) => {
  response.json({ message: "API is working!" });
});

export default app;
