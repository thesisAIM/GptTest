const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroMeta = document.getElementById("heroMeta");
const heroArt = document.getElementById("heroArt");
const catalogRoot = document.getElementById("catalog");
const profileName = document.getElementById("profileName");
const profileAvatar = document.getElementById("profileAvatar");

const createMetaPill = (text) => {
  const pill = document.createElement("span");
  pill.textContent = text;
  return pill;
};

const renderHero = (featured) => {
  heroTitle.textContent = featured.title;
  heroDescription.textContent = featured.description;
  heroMeta.innerHTML = "";
  heroMeta.append(
    createMetaPill(featured.rating),
    createMetaPill(`${featured.year}`),
    createMetaPill(featured.duration)
  );
  heroArt.style.backgroundImage = `linear-gradient(140deg, rgba(229, 9, 20, 0.5), rgba(11, 11, 15, 0.8)), url('${featured.heroImage}')`;
};

const renderRows = (rows) => {
  catalogRoot.innerHTML = "";
  rows.forEach((row) => {
    const section = document.createElement("section");
    section.className = "row";

    const title = document.createElement("h2");
    title.className = "row-title";
    title.textContent = row.title;

    const items = document.createElement("div");
    items.className = "row-items";

    row.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      const name = document.createElement("h3");
      name.textContent = item.name;
      card.appendChild(name);

      if (item.badge) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = item.badge;
        card.appendChild(badge);
      }

      items.appendChild(card);
    });

    section.append(title, items);
    catalogRoot.appendChild(section);
  });
};

const loadData = async () => {
  try {
    const [featuredResponse, rowsResponse, profileResponse] = await Promise.all([
      fetch("/api/featured"),
      fetch("/api/rows"),
      fetch("/api/profile")
    ]);

    const featured = await featuredResponse.json();
    const rows = await rowsResponse.json();
    const profile = await profileResponse.json();

    renderHero(featured);
    renderRows(rows);
    profileName.textContent = profile.name;
    profileAvatar.src = profile.avatar;
  } catch (error) {
    heroTitle.textContent = "Unable to load catalog";
    heroDescription.textContent = "Please ensure the demo server is running.";
  }
};

loadData();
