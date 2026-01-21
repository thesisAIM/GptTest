const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

const featured = {
  title: "Stranger Things",
  description:
    "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
  maturity: "TV-14",
  year: 2022,
  duration: "4 Seasons",
  tags: ["Sci-Fi", "Thriller", "Suspense"],
  backdrop:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
};

const rows = [
  {
    id: "trending",
    title: "Trending Now",
    items: [
      {
        id: "trend-1",
        title: "The Gray Man",
        badge: "Top 10",
        rating: "TV-MA"
      },
      {
        id: "trend-2",
        title: "Red Notice",
        badge: "New",
        rating: "PG-13"
      },
      {
        id: "trend-3",
        title: "Extraction",
        badge: "Top 10",
        rating: "R"
      },
      {
        id: "trend-4",
        title: "The Witcher",
        badge: "Popular",
        rating: "TV-MA"
      },
      {
        id: "trend-5",
        title: "Queen's Gambit",
        badge: "Awarded",
        rating: "TV-MA"
      },
      {
        id: "trend-6",
        title: "The Night Agent",
        badge: "New",
        rating: "TV-14"
      }
    ]
  },
  {
    id: "continue",
    title: "Continue Watching",
    items: [
      {
        id: "cont-1",
        title: "Ozark",
        badge: "Episode 4",
        rating: "TV-MA"
      },
      {
        id: "cont-2",
        title: "Mindhunter",
        badge: "Episode 7",
        rating: "TV-MA"
      },
      {
        id: "cont-3",
        title: "Arcane",
        badge: "Episode 2",
        rating: "TV-14"
      },
      {
        id: "cont-4",
        title: "The Crown",
        badge: "Episode 6",
        rating: "TV-MA"
      }
    ]
  },
  {
    id: "originals",
    title: "Netflix Originals",
    items: [
      {
        id: "orig-1",
        title: "Wednesday",
        badge: "Top 10",
        rating: "TV-14"
      },
      {
        id: "orig-2",
        title: "The Sandman",
        badge: "New",
        rating: "TV-MA"
      },
      {
        id: "orig-3",
        title: "Bridgerton",
        badge: "Popular",
        rating: "TV-MA"
      },
      {
        id: "orig-4",
        title: "Narcos",
        badge: "Classic",
        rating: "TV-MA"
      }
    ]
  }
];

const contentTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const sendJson = (res, statusCode, data) => {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(payload);
};

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/featured") {
    return sendJson(res, 200, featured);
  }

  if (req.method === "GET" && url.pathname === "/api/rows") {
    return sendJson(res, 200, rows);
  }

  if (req.method === "POST" && url.pathname === "/api/profile") {
    try {
      const body = await readRequestBody(req);
      const { name } = body ? JSON.parse(body) : {};
      return sendJson(res, 200, {
        ok: true,
        message: `Welcome back${name ? `, ${name}` : ""}!`,
        profile: {
          name: name || "Guest",
          avatar:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
        }
      });
    } catch (error) {
      return sendJson(res, 400, { ok: false, message: "Invalid payload." });
    }
  }

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }

  const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  const resolvedPath = path.join(publicDir, filePath);

  if (!resolvedPath.startsWith(publicDir)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (err, data) => {
    if (err) {
      fs.readFile(path.join(publicDir, "index.html"), (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(indexData);
      });
      return;
    }

    const ext = path.extname(resolvedPath);
    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream"
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
