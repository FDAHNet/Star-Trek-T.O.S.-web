export var LANGUAGE_OPTIONS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" }
];

var STORAGE_KEY = "st-universe-language";

var UI = {
  es: {
    universalTranslator: "Traductor universal",
    topbar: {
      universe: "Universo Star Trek",
      home: "Inicio",
      actors: "Actores",
      characters: "Personajes",
      episodes: "Episodios",
      website: "La web",
      seasons: "Temporadas",
      otherSeries: "Otras series",
      series: "Series",
      movies: "Peliculas"
    },
    home: {
      eyebrow: "Explorador en Espanol",
      heroTitle: "Star Trek - Universo",
      heroText: "Esta portada sirve como punto de entrada a toda la web: explica de que va Star Trek: The Original Series, resume las tres temporadas y te deja saltar a cada guia con sus episodios, personajes y actores.",
      exploreSeries: "Explorar Series",
      exploreMovies: "Explorar Peliculas"
    },
    seasonPage: {
      summary: "Resumen",
      castAges: "Actores y edades",
      crewEyebrow: "Tripulacion de la Enterprise",
      crewTitle: "Personajes principales y recurrentes de la serie",
      crewText: "La tripulacion cambia ligeramente entre temporadas, pero este es el nucleo mas reconocible de la nave a lo largo de la serie original.",
      episodeGuide: "Guia de episodios",
      season1: "Temporada 1",
      season2: "Temporada 2",
      season3: "Temporada 3",
      searchEpisode: "Buscar episodio",
      route: "Ruta estelar",
      trivia: "Curiosidad",
      seeSummary: "Ver resumen",
      seeEpisodes: "Ver episodios",
      quickFacts: "Datos rapidos",
      statSeason: "Temporada",
      statEpisodes: "Episodios",
      statNetwork: "Cadena original",
      statYears: "Anos",
      noResults: "No hay episodios que coincidan con esa busqueda."
    }
  },
  en: {
    universalTranslator: "Universal Translator",
    topbar: {
      universe: "Star Trek Universe",
      home: "Home",
      actors: "Cast",
      characters: "Characters",
      episodes: "Episodes",
      website: "The site",
      seasons: "Seasons",
      otherSeries: "Other series",
      series: "Series",
      movies: "Movies"
    },
    home: {
      eyebrow: "Explorer in English",
      heroTitle: "Star Trek - Universe",
      heroText: "This landing page works as the gateway to the whole website: it explains what Star Trek: The Original Series is about, summarizes the three seasons, and lets you jump into each guide with episodes, characters, and cast.",
      exploreSeries: "Explore Series",
      exploreMovies: "Explore Movies"
    },
    seasonPage: {
      summary: "Overview",
      castAges: "Cast and ages",
      crewEyebrow: "Enterprise crew",
      crewTitle: "Main and recurring characters",
      crewText: "The crew changes slightly between seasons, but this is the most recognizable core of the ship throughout the original series.",
      episodeGuide: "Episode guide",
      season1: "Season 1",
      season2: "Season 2",
      season3: "Season 3",
      searchEpisode: "Search episode",
      route: "Star route",
      trivia: "Trivia",
      seeSummary: "See overview",
      seeEpisodes: "See episodes",
      quickFacts: "Quick facts",
      statSeason: "Season",
      statEpisodes: "Episodes",
      statNetwork: "Original network",
      statYears: "Years",
      noResults: "No episodes match that search."
    }
  }
};

export function getLanguage() {
  return window.localStorage.getItem(STORAGE_KEY) || "es";
}

export function setLanguage(language) {
  window.localStorage.setItem(STORAGE_KEY, language);
}

export function t(path) {
  var language = getLanguage();
  var source = UI[language] || UI.es;

  return path.split(".").reduce(function (current, key) {
    return current && current[key];
  }, source);
}
