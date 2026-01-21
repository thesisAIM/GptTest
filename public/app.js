const hero = document.querySelector(".hero");
const featuredTitle = document.getElementById("featured-title");
const featuredDescription = document.getElementById("featured-description");
const featuredMeta = document.getElementById("featured-meta");
const featuredTags = document.getElementById("featured-tags");
const rowsContainer = document.getElementById("rows");
const profileForm = document.getElementById("profile-form");
const profileCard = document.getElementById("profile-card");

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const renderFeatured = (featured) => {
  featuredTitle.textContent = featured.title;
  featuredDescription.textContent = featured.description;
  featuredMeta.innerHTML = `
    <span>${featured.year}</span>
    <span>${featured.maturity}</span>
    <span>${featured.duration}</span>
  `;
  featuredTags.innerHTML = featured.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  hero.style.backgroundImage = `url("${featured.backdrop}")`;
};

const renderRows = (rows) => {
  rowsContainer.innerHTML = rows
    .map(
      (row) => `
        <div class="row">
          <div class="row-title">${row.title}</div>
          <div class="row-items">
            ${row.items
              .map(
                (item) => `
                  <div class="row-card">
                    <div>
                      <h4>${item.title}</h4>
                      <p class="badge">${item.badge}</p>
                    </div>
                    <span class="rating">${item.rating}</span>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");
};

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const name = formData.get("name");

  try {
    const response = await fetchJson("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    profileCard.querySelector("img").src = response.profile.avatar;
    profileCard.querySelector(".profile-name").textContent = response.profile.name;
    profileCard.querySelector(".profile-message").textContent = response.message;
  } catch (error) {
    profileCard.querySelector(".profile-message").textContent =
      "We couldn't update your profile. Try again.";
  }
});

const init = async () => {
  try {
    const [featured, rows] = await Promise.all([
      fetchJson("/api/featured"),
      fetchJson("/api/rows")
    ]);
    renderFeatured(featured);
    renderRows(rows);
  } catch (error) {
    rowsContainer.innerHTML =
      "<p>Unable to load content right now. Please try again later.</p>";
  }
};

init();
