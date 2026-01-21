const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const catalog = {
  featured: {
    id: "featured-1",
    title: "Shadow Grid",
    description:
      "An undercover analyst uncovers a conspiracy hidden in the data streams of a global streaming giant.",
    rating: "TV-MA",
    duration: "2h 3m",
    year: 2024,
    heroImage: "/images/hero.svg"
  },
  rows: [
    {
      id: "row-trending",
      title: "Trending Now",
      items: [
        { id: "t1", name: "Neon Harbor", badge: "New" },
        { id: "t2", name: "Atlas Protocol", badge: "Top 10" },
        { id: "t3", name: "Crimson Vow", badge: "" },
        { id: "t4", name: "Mirage City", badge: "" },
        { id: "t5", name: "Echo Valley", badge: "" },
        { id: "t6", name: "Night Circuit", badge: "" }
      ]
    },
    {
      id: "row-suspense",
      title: "Suspenseful Thrillers",
      items: [
        { id: "s1", name: "Cold Signal", badge: "" },
        { id: "s2", name: "Tether", badge: "" },
        { id: "s3", name: "Glassline", badge: "" },
        { id: "s4", name: "Stasis", badge: "" },
        { id: "s5", name: "Traceback", badge: "" },
        { id: "s6", name: "Greypoint", badge: "" }
      ]
    },
    {
      id: "row-comedy",
      title: "Comedies",
      items: [
        { id: "c1", name: "Midnight Roommates", badge: "" },
        { id: "c2", name: "Orbiting", badge: "" },
        { id: "c3", name: "Side Quest", badge: "" },
        { id: "c4", name: "Monday Again", badge: "" },
        { id: "c5", name: "The Spill", badge: "" },
        { id: "c6", name: "Love & Logic", badge: "" }
      ]
    }
  ]
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/featured", (req, res) => {
  res.json(catalog.featured);
});

app.get("/api/rows", (req, res) => {
  res.json(catalog.rows);
});

app.get("/api/profile", (req, res) => {
  res.json({
    name: "Taylor",
    plan: "Premium",
    avatar: "/images/avatar.svg"
  });
});

app.listen(port, () => {
  console.log(`Netflix demo server running on http://localhost:${port}`);
});
