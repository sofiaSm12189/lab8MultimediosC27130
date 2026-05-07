const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

export const searchShows = async (query) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${query}`;

  const data = await fetch(URL).then((res) => res.json());

  return data.map((item) => ({
    id: item.show.id,
    name: item.show.name,
    image: item.show.image?.medium ?? PLACEHOLDER_IMAGE,
  }));
};

export const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;

  const data = await fetch(URL).then((res) => res.json());

  return {
    id: data.id,
    name: data.name,
    rating: Math.round(data.rating.average || 0),
    image: data.image?.medium ?? PLACEHOLDER_IMAGE,
  };
};

export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;

  const episodes = await fetch(URL).then((res) => res.json());

  const episodeList = episodes.map((episode) => ({
    number: episode.number,
    season: episode.season,
    rating: Math.round(episode.rating.average || 0),
  }));

  return Object.groupBy(episodeList, (episode) => episode.season);
};
