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
      movies: "Películas"
    },
    home: {
      eyebrow: "Explorador en Español",
      heroTitle: "Star Trek - Universo",
      heroText: "Esta portada sirve como punto de entrada a toda la web: explica de qué va Star Trek: The Original Series, resume las tres temporadas y te deja saltar a cada guía con sus episodios, personajes y actores.",
      exploreSeries: "Explorar Series",
      exploreMovies: "Explorar Películas",
      quickMapLabel: "Mapa rápido",
      quickMapTitle: "Navegador del universo",
      quickMapText: "Usa este panel para saltar directamente a una serie, abrir el archivo de películas o entrar a las tres temporadas de la serie original.",
      seriesLabel: "Series",
      chooseSeries: "Elige Serie",
      seriesUniverse: "Series del universo Trek",
      selectSeries: "Selecciona una serie",
      openSeriesFile: "Abrir ficha de la serie",
      directAccess: "Acceso directo",
      seasonsLabel: "Temporadas",
      moviesLabel: "Películas",
      openMovieArchive: "Abrir archivo de películas",
      activeSeries: "Series activas en la web",
      archivedMovies: "Películas archivadas",
      timelineCovered: "Cronología cubierta",
      websiteEyebrow: "La web",
      websiteTitle: "Una guía central para entender la serie clásica y su legado",
      websiteText: "La idea de esta página es reunir en español lo esencial de la serie original: qué cuenta, cómo evoluciona a lo largo de sus tres temporadas y cómo encaja dentro del universo más amplio de Star Trek.",
      intro1Title: "De qué va",
      intro1Text: "La USS Enterprise explora mundos desconocidos mientras Kirk, Spock y McCoy afrontan conflictos diplomáticos, científicos y morales que definieron la identidad de Star Trek.",
      intro2Title: "Cómo se navega",
      intro2Text: "Cada temporada tiene su propia subpágina con resumen, reparto, personajes principales, buscador de episodios y una ruta estelar para orientarte rápidamente.",
      intro3Title: "Por qué empezar aquí",
      intro3Text: "Esta portada te deja ver el conjunto antes de entrar al detalle, y al final incluye el resto de series de Star Trek ordenables por emisión o por cronología interna del universo.",
      seasonsEyebrow: "Temporadas",
      seasonsTitle: "Las tres etapas de la misión original",
      seasonsText: "Desde la fundación del canon en la primera temporada hasta el cierre más extraño y melancólico de la tercera, aquí tienes una entrada rápida a cada bloque de episodios.",
      moreTrekEyebrow: "Más Star Trek",
      moreTrekTitle: "Todas las series televisivas del universo Star Trek",
      moreTrekText: "Puedes ordenarlas por fecha de emisión real o por la fecha en la que ocurren dentro del universo de Star Trek. Cada ficha indica su marco temporal o la referencia de fecha estelar más útil para ubicarla.",
      sortRelease: "Ordenar por emisión",
      sortTimeline: "Ordenar por cronología Trek",
      commandEyebrow: "Puente de mando",
      commandTitle: "De la portada al detalle",
      commandText: "Usa esta página como centro de navegación: entra a cada temporada para ver los episodios completos y vuelve aquí cuando quieras situar la serie original dentro del resto del universo televisivo de Star Trek.",
      moviesEyebrow: "Películas",
      moviesTitle: "Todas las películas de Star Trek",
      moviesText: "Ordénalas por fecha de estreno real o por su posición dentro de la línea temporal de Star Trek.",
      closeMovies: "Cerrar",
      orderMoviesAria: "Ordenar películas",
      orderSeriesAria: "Ordenar series"
    },
    seasonPage: {
      summary: "Resumen",
      castAges: "Actores y edades",
      crewEyebrow: "Tripulación de la Enterprise",
      crewTitle: "Personajes principales y recurrentes de la serie",
      crewText: "La tripulación cambia ligeramente entre temporadas, pero este es el núcleo más reconocible de la nave a lo largo de la serie original.",
      episodeGuide: "Guía de episodios",
      season1: "Temporada 1",
      season2: "Temporada 2",
      season3: "Temporada 3",
      searchEpisode: "Buscar episodio",
      route: "Ruta estelar",
      trivia: "Curiosidad",
      seeSummary: "Ver resumen",
      seeEpisodes: "Ver episodios",
      quickFacts: "Datos rápidos",
      statSeason: "Temporada",
      statEpisodes: "Episodios",
      statNetwork: "Cadena original",
      statYears: "Años",
      noResults: "No hay episodios que coincidan con esa búsqueda."
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
      exploreMovies: "Explore Movies",
      quickMapLabel: "Quick map",
      quickMapTitle: "Universe navigator",
      quickMapText: "Use this panel to jump straight to a series, open the movie archive, or enter the three seasons of the original series.",
      seriesLabel: "Series",
      chooseSeries: "Choose series",
      seriesUniverse: "Series in the Trek universe",
      selectSeries: "Select a series",
      openSeriesFile: "Open series page",
      directAccess: "Quick access",
      seasonsLabel: "Seasons",
      moviesLabel: "Movies",
      openMovieArchive: "Open movie archive",
      activeSeries: "Series available on the site",
      archivedMovies: "Movies archived",
      timelineCovered: "Timeline covered",
      websiteEyebrow: "The site",
      websiteTitle: "A central guide to understand the classic series and its legacy",
      websiteText: "The goal of this page is to gather, in one place, the essentials of the original series: what it is about, how it evolves across its three seasons, and how it fits into the wider Star Trek universe.",
      intro1Title: "What it is about",
      intro1Text: "The USS Enterprise explores unknown worlds while Kirk, Spock, and McCoy face diplomatic, scientific, and moral conflicts that defined the identity of Star Trek.",
      intro2Title: "How to navigate it",
      intro2Text: "Each season has its own subpage with overview, cast, main characters, episode search, and a star route to orient you quickly.",
      intro3Title: "Why start here",
      intro3Text: "This landing page lets you see the whole picture before diving into the details, and at the end it includes the rest of the Star Trek series sortable by release or by in-universe chronology.",
      seasonsEyebrow: "Seasons",
      seasonsTitle: "The three stages of the original mission",
      seasonsText: "From the canon-building first season to the stranger and more melancholic end of the third, here is a quick entry point to each block of episodes.",
      moreTrekEyebrow: "More Star Trek",
      moreTrekTitle: "All television series in the Star Trek universe",
      moreTrekText: "You can sort them by real-world release date or by when they take place within the Star Trek universe. Each card shows the time frame or the most useful stardate reference to place it.",
      sortRelease: "Sort by release",
      sortTimeline: "Sort by Trek chronology",
      commandEyebrow: "Bridge",
      commandTitle: "From landing page to detail",
      commandText: "Use this page as a navigation hub: enter each season to see the full episodes and come back here whenever you want to place the original series within the rest of the Star Trek television universe.",
      moviesEyebrow: "Movies",
      moviesTitle: "All Star Trek movies",
      moviesText: "Sort them by real release date or by their place in the Star Trek timeline.",
      closeMovies: "Close",
      orderMoviesAria: "Sort movies",
      orderSeriesAria: "Sort series"
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
