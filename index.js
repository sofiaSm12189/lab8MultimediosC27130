import { searchShows, getShowData, getEpisodeList } from "./services/tvmaze.js";

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $form = document.querySelector(".search-form");
const $input = document.querySelector("#searchInput");
const $results = document.querySelector(".results");

const createEpisodeHTML = (episode) => {
  return `
        <div class="episode rating-${episode.rating}">
            ${episode.number} 
        </div>
    `;
};

const createSeasonHTML = (data, number) => {
  const episodesHTML = data.map(createEpisodeHTML).join("");

  return `
        <article class="season">

            <header class="season-header">
                T${number}
            </header>

            ${episodesHTML}

        </article>
    `;
};

const renderShow = async (id) => {
  const show = await getShowData(id);

  const seasons = await getEpisodeList(id);

  $header.innerHTML = `
        <img
            class="poster"
            src="${show.image}"
            alt="${show.name}"
        >

        <h1>${show.name}</h1>

        <p>Rating: ${show.rating}/10</p>
    `;

  const list = Object.values(seasons).map((season, index) =>
    createSeasonHTML(season, index + 1),
  );

  $episodes.innerHTML = list.join("");
};

const renderResults = async (query) => {
  if (!query) {
    $results.innerHTML = "";
    return;
  }

  const shows = await searchShows(query);

  const html = shows
    .slice(0, 5)
    .map((show) => {
      return `
                <article
                    class="result-item"
                    data-id="${show.id}"
                >

                    <img
                        src="${show.image}"
                        alt="${show.name}"
                    >

                    <span>${show.name}</span>

                </article>
            `;
    })
    .join("");

  $results.innerHTML = html;
};

$input.addEventListener("input", async (e) => {
  const value = e.target.value.trim();

  renderResults(value);
});

$results.addEventListener("click", async (e) => {
  const item = e.target.closest(".result-item");

  if (!item) return;

  const id = item.dataset.id;

  renderShow(id);

  $results.innerHTML = "";

  $input.value = "";
});

$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const value = $input.value.trim();

  if (!value) return;

  const shows = await searchShows(value);

  if (!shows.length) return;

  renderShow(shows[0].id);

  $results.innerHTML = "";
});

renderShow(169);
