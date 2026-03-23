import { MOVIE_DETAILS, SERIES_DETAILS } from "./franchise-data.js";
import { findSeriesSeasonEntry } from "./series-season-data.js";

(function () {
  "use strict";

  var MOVIE_POSTER_META = {
    "star-trek-the-motion-picture": { accent: "#7fe7ff", secondary: "#5f8cff", tag: "V'Ger", era: "La empresa renace" },
    "star-trek-ii-the-wrath-of-khan": { accent: "#ff8a5b", secondary: "#d9415a", tag: "Khan", era: "Venganza y sacrificio" },
    "star-trek-iii-the-search-for-spock": { accent: "#ffb36b", secondary: "#ff5d7f", tag: "Genesis", era: "Salvar a Spock" },
    "star-trek-iv-the-voyage-home": { accent: "#6ff3d8", secondary: "#5db6ff", tag: "1986", era: "Viaje temporal" },
    "star-trek-v-the-final-frontier": { accent: "#ffd36e", secondary: "#c471ed", tag: "La gran barrera", era: "La ultima frontera" },
    "star-trek-vi-the-undiscovered-country": { accent: "#ffd36e", secondary: "#ff6b6b", tag: "Paz klingon", era: "El pais desconocido" },
    "star-trek-generations": { accent: "#f7d76a", secondary: "#68d7ff", tag: "Kirk + Picard", era: "Dos eras colisionan" },
    "star-trek-first-contact": { accent: "#8cf2ff", secondary: "#73f0b3", tag: "Los borg", era: "Primer contacto" },
    "star-trek-insurrection": { accent: "#f6b95b", secondary: "#ff7187", tag: "Ba'ku", era: "Desobediencia moral" },
    "star-trek-nemesis": { accent: "#dcd6ff", secondary: "#6f89ff", tag: "Shinzon", era: "El espejo de Picard" },
    "star-trek-2009": { accent: "#83ebff", secondary: "#ff7d7d", tag: "Linea Kelvin", era: "La saga renace" },
    "star-trek-into-darkness": { accent: "#ff9a69", secondary: "#ffc86c", tag: "Conspiracion", era: "Hacia la oscuridad" },
    "star-trek-beyond": { accent: "#6cf0ff", secondary: "#7a8fff", tag: "Krall", era: "Mas alla" },
    "star-trek-section-31": { accent: "#ff758a", secondary: "#8a63ff", tag: "Georgiou", era: "Operacion encubierta" }
  };

  var WIKIPEDIA_MOVIE_TITLES = {
    "star-trek-the-motion-picture": "Star_Trek:_The_Motion_Picture",
    "star-trek-ii-the-wrath-of-khan": "Star_Trek_II:_The_Wrath_of_Khan",
    "star-trek-iii-the-search-for-spock": "Star_Trek_III:_The_Search_for_Spock",
    "star-trek-iv-the-voyage-home": "Star_Trek_IV:_The_Voyage_Home",
    "star-trek-v-the-final-frontier": "Star_Trek_V:_The_Final_Frontier",
    "star-trek-vi-the-undiscovered-country": "Star_Trek_VI:_The_Undiscovered_Country",
    "star-trek-generations": "Star_Trek_Generations",
    "star-trek-first-contact": "Star_Trek:_First_Contact",
    "star-trek-insurrection": "Star_Trek:_Insurrection",
    "star-trek-nemesis": "Star_Trek:_Nemesis",
    "star-trek-2009": "Star_Trek_(2009_film)",
    "star-trek-into-darkness": "Star_Trek_Into_Darkness",
    "star-trek-beyond": "Star_Trek_Beyond",
    "star-trek-section-31": "Star_Trek:_Section_31"
  };

  var MOVIE_CAST = {
    "star-trek-the-motion-picture": [
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Leonard Nimoy", role: "Spock" },
      { actor: "DeForest Kelley", role: "Leonard McCoy" },
      { actor: "Persis Khambatta", role: "Ilia" },
      { actor: "Stephen Collins", role: "Willard Decker" },
      { actor: "James Doohan", role: "Montgomery Scott" }
    ],
    "star-trek-ii-the-wrath-of-khan": [
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Leonard Nimoy", role: "Spock" },
      { actor: "DeForest Kelley", role: "Leonard McCoy" },
      { actor: "Ricardo Montalban", role: "Khan Noonien Singh" },
      { actor: "Bibi Besch", role: "Carol Marcus" },
      { actor: "Merritt Butrick", role: "David Marcus" }
    ],
    "star-trek-iii-the-search-for-spock": [
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Leonard Nimoy", role: "Spock" },
      { actor: "DeForest Kelley", role: "Leonard McCoy" },
      { actor: "Christopher Lloyd", role: "Comandante Kruge" },
      { actor: "Robin Curtis", role: "Saavik" },
      { actor: "James Doohan", role: "Montgomery Scott" }
    ],
    "star-trek-iv-the-voyage-home": [
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Leonard Nimoy", role: "Spock" },
      { actor: "DeForest Kelley", role: "Leonard McCoy" },
      { actor: "Catherine Hicks", role: "Gillian Taylor" },
      { actor: "James Doohan", role: "Montgomery Scott" },
      { actor: "George Takei", role: "Hikaru Sulu" }
    ],
    "star-trek-v-the-final-frontier": [
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Leonard Nimoy", role: "Spock" },
      { actor: "DeForest Kelley", role: "Leonard McCoy" },
      { actor: "Laurence Luckinbill", role: "Sybok" },
      { actor: "James Doohan", role: "Montgomery Scott" },
      { actor: "Nichelle Nichols", role: "Nyota Uhura" }
    ],
    "star-trek-vi-the-undiscovered-country": [
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Leonard Nimoy", role: "Spock" },
      { actor: "DeForest Kelley", role: "Leonard McCoy" },
      { actor: "Christopher Plummer", role: "General Chang" },
      { actor: "Kim Cattrall", role: "Valeris" },
      { actor: "David Warner", role: "Canciller Gorkon" }
    ],
    "star-trek-generations": [
      { actor: "Patrick Stewart", role: "Jean-Luc Picard" },
      { actor: "William Shatner", role: "James T. Kirk" },
      { actor: "Brent Spiner", role: "Data" },
      { actor: "Malcolm McDowell", role: "Dr. Tolian Soran" },
      { actor: "Jonathan Frakes", role: "William Riker" },
      { actor: "LeVar Burton", role: "Geordi La Forge" }
    ],
    "star-trek-first-contact": [
      { actor: "Patrick Stewart", role: "Jean-Luc Picard" },
      { actor: "Jonathan Frakes", role: "William Riker" },
      { actor: "Brent Spiner", role: "Data" },
      { actor: "Alice Krige", role: "Reina Borg" },
      { actor: "James Cromwell", role: "Zefram Cochrane" },
      { actor: "LeVar Burton", role: "Geordi La Forge" }
    ],
    "star-trek-insurrection": [
      { actor: "Patrick Stewart", role: "Jean-Luc Picard" },
      { actor: "Jonathan Frakes", role: "William Riker" },
      { actor: "Brent Spiner", role: "Data" },
      { actor: "Donna Murphy", role: "Anij" },
      { actor: "F. Murray Abraham", role: "Ru'afo" },
      { actor: "Michael Dorn", role: "Worf" }
    ],
    "star-trek-nemesis": [
      { actor: "Patrick Stewart", role: "Jean-Luc Picard" },
      { actor: "Tom Hardy", role: "Shinzon" },
      { actor: "Brent Spiner", role: "Data" },
      { actor: "Jonathan Frakes", role: "William Riker" },
      { actor: "Marina Sirtis", role: "Deanna Troi" },
      { actor: "LeVar Burton", role: "Geordi La Forge" }
    ],
    "star-trek-2009": [
      { actor: "Chris Pine", role: "James T. Kirk" },
      { actor: "Zachary Quinto", role: "Spock" },
      { actor: "Karl Urban", role: "Leonard McCoy" },
      { actor: "Zoe Saldana", role: "Nyota Uhura" },
      { actor: "Eric Bana", role: "Nero" },
      { actor: "Simon Pegg", role: "Montgomery Scott" }
    ],
    "star-trek-into-darkness": [
      { actor: "Chris Pine", role: "James T. Kirk" },
      { actor: "Zachary Quinto", role: "Spock" },
      { actor: "Benedict Cumberbatch", role: "Khan" },
      { actor: "Zoe Saldana", role: "Nyota Uhura" },
      { actor: "Karl Urban", role: "Leonard McCoy" },
      { actor: "Simon Pegg", role: "Montgomery Scott" }
    ],
    "star-trek-beyond": [
      { actor: "Chris Pine", role: "James T. Kirk" },
      { actor: "Zachary Quinto", role: "Spock" },
      { actor: "Karl Urban", role: "Leonard McCoy" },
      { actor: "Zoe Saldana", role: "Nyota Uhura" },
      { actor: "Idris Elba", role: "Krall" },
      { actor: "Sofia Boutella", role: "Jaylah" }
    ],
    "star-trek-section-31": [
      { actor: "Michelle Yeoh", role: "Philippa Georgiou" },
      { actor: "Omari Hardwick", role: "Alok" },
      { actor: "Sam Richardson", role: "Quasi" },
      { actor: "Kacey Rohl", role: "Rachel Garrett" },
      { actor: "Robert Kazinsky", role: "Zeph" },
      { actor: "Sven Ruygrok", role: "Fuzz" }
    ]
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hashString(value) {
    var hash = 0;
    var index;

    for (index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
    }

    return Math.abs(hash);
  }

  function buildPosterStars(seed) {
    var stars = "";
    var index;
    var x;
    var y;
    var radius;
    var opacity;

    for (index = 0; index < 38; index += 1) {
      x = (seed * (index + 11) * 37) % 900;
      y = (seed * (index + 7) * 53) % 1200;
      radius = index % 6 === 0 ? 3.2 : (index % 4 === 0 ? 2.3 : 1.5);
      opacity = index % 5 === 0 ? 0.95 : (index % 3 === 0 ? 0.62 : 0.35);
      stars += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="white" opacity="' + opacity + '" />';
    }

    return stars;
  }

  function buildDisplayTitle(title) {
    return title
      .replace(/^Star Trek:\s*/, "")
      .replace(/^Star Trek\s*/, "")
      .replace(/\bThe\b/g, "THE")
      .toUpperCase();
  }

  function splitText(text, maxLength, maxLines) {
    var words = String(text || "").split(/\s+/);
    var lines = [];
    var current = "";

    words.forEach(function (word) {
      var proposal = current ? current + " " + word : word;

      if (proposal.length > maxLength && current) {
        lines.push(current);
        current = word;
      } else {
        current = proposal;
      }
    });

    if (current) {
      lines.push(current);
    }

    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,;:!?-]*$/, "") + "...";
    }

    return lines;
  }

  function createFallbackMoviePoster(item) {
    var meta = MOVIE_POSTER_META[item.slug] || { accent: "#7fe7ff", secondary: "#ffd36e", tag: item.timelineLabel, era: item.continuity };
    var seed = hashString(item.slug || item.title);
    var stars = buildPosterStars(seed);
    var title = buildDisplayTitle(item.title);
    var titleLines = splitText(title, 18, 3);
    var summaryLines = splitText(item.summary || "", 48, 2);
    var titleSvg = titleLines.map(function (line, index) {
      return '<text x="94" y="' + (908 + (index * 86)) + '" font-family="Impact, Haettenschweiler, Arial Narrow Bold, sans-serif" font-size="96" fill="white">' + escapeHtml(line) + '</text>';
    }).join("");
    var summarySvg = summaryLines.map(function (line, index) {
      return '<text x="98" y="' + (1046 + (index * 38)) + '" font-family="Trebuchet MS, Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.82)">' + escapeHtml(line) + '</text>';
    }).join("");
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" role="img" aria-labelledby="title desc">',
      '  <title>' + escapeHtml(item.title) + '</title>',
      '  <desc>Poster ilustrado de ' + escapeHtml(item.title) + ' con ambiente espacial.</desc>',
      '  <defs>',
      '    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
      '      <stop offset="0%" stop-color="#050a14" />',
      '      <stop offset="48%" stop-color="#09172b" />',
      '      <stop offset="100%" stop-color="#02050d" />',
      '    </linearGradient>',
      '    <linearGradient id="beam" x1="10%" y1="0%" x2="100%" y2="100%">',
      '      <stop offset="0%" stop-color="' + meta.accent + '" stop-opacity="0.88" />',
      '      <stop offset="100%" stop-color="' + meta.secondary + '" stop-opacity="0.14" />',
      '    </linearGradient>',
      '    <radialGradient id="planet" cx="50%" cy="45%" r="60%">',
      '      <stop offset="0%" stop-color="' + meta.accent + '" stop-opacity="0.96" />',
      '      <stop offset="52%" stop-color="' + meta.secondary + '" stop-opacity="0.72" />',
      '      <stop offset="100%" stop-color="#050a14" stop-opacity="0" />',
      '    </radialGradient>',
      '  </defs>',
      '  <rect width="900" height="1200" fill="url(#bg)" />',
      '  <rect width="900" height="1200" fill="url(#beam)" opacity="0.34" />',
      '  <ellipse cx="700" cy="250" rx="210" ry="210" fill="url(#planet)" opacity="0.9" />',
      '  <ellipse cx="735" cy="232" rx="56" ry="56" fill="white" opacity="0.08" />',
      '  <g opacity="0.92">' + stars + '</g>',
      '  <path d="M180 756 C265 696 432 654 655 682 C605 727 575 764 538 822 C388 840 265 818 180 756 Z" fill="rgba(255,255,255,0.10)" />',
      '  <path d="M235 741 C314 699 451 683 622 709 C583 739 563 766 538 804 C418 816 310 799 235 741 Z" fill="' + meta.accent + '" opacity="0.24" />',
      '  <ellipse cx="452" cy="744" rx="184" ry="56" fill="white" opacity="0.9" />',
      '  <ellipse cx="582" cy="733" rx="120" ry="36" fill="white" opacity="0.82" />',
      '  <rect x="136" y="142" width="628" height="56" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" />',
      '  <text x="168" y="178" font-family="Trebuchet MS, Arial, sans-serif" font-size="28" letter-spacing="5" fill="' + meta.accent + '">' + escapeHtml(meta.era.toUpperCase()) + '</text>',
      titleSvg,
      '  <text x="98" y="' + (940 + (titleLines.length * 86)) + '" font-family="Trebuchet MS, Arial, sans-serif" font-size="30" letter-spacing="4" fill="' + meta.secondary + '">' + escapeHtml(meta.tag.toUpperCase()) + ' • ' + escapeHtml(item.releaseLabel) + '</text>',
      summarySvg,
      '  <text x="98" y="1112" font-family="Trebuchet MS, Arial, sans-serif" font-size="24" letter-spacing="2" fill="rgba(255,255,255,0.62)">' + escapeHtml(item.timelineLabel) + ' • ' + escapeHtml(item.continuity.toUpperCase()) + '</text>',
      '</svg>'
    ].join("");

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function fetchWikipediaMoviePoster(slug) {
    var wikiTitle = WIKIPEDIA_MOVIE_TITLES[slug];

    if (!wikiTitle || typeof fetch !== "function") {
      return Promise.resolve(null);
    }

    return fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(wikiTitle))
      .then(function (response) {
        if (!response.ok) {
          throw new Error("No se pudo cargar el poster de Wikipedia");
        }

        return response.json();
      })
      .then(function (payload) {
        if (payload && payload.originalimage && payload.originalimage.source) {
          return payload.originalimage.source;
        }

        if (payload && payload.thumbnail && payload.thumbnail.source) {
          return payload.thumbnail.source;
        }

        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function buildMoviePosterModal(item, posterSrc, posterAlt) {
    var dialog = document.createElement("dialog");

    dialog.className = "poster-modal";
    dialog.setAttribute("aria-label", "Poster ampliado de " + item.title);
    dialog.innerHTML = [
      '<div class="poster-modal__panel">',
      '  <button class="poster-modal__close" type="button" aria-label="Cerrar poster">X</button>',
      '  <img class="poster-modal__image" src="' + posterSrc + '" alt="' + escapeHtml(posterAlt) + '">',
      '  <p class="poster-modal__caption">' + escapeHtml(item.title) + '</p>',
      '</div>'
    ].join("");

    document.body.appendChild(dialog);

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.querySelector(".poster-modal__close").addEventListener("click", function () {
      dialog.close();
    });

    return dialog;
  }

  var body = document.body;
  var detailType = body.getAttribute("data-detail-type");
  var detailSlug = body.getAttribute("data-detail-slug");
  var dataset = detailType === "movie" ? MOVIE_DETAILS : SERIES_DETAILS;
  var item = dataset.find(function (entry) {
    return entry.slug === detailSlug;
  });

  if (!item) {
    return;
  }

  document.title = item.title;

  var mapping = {
    "detail-badge": item.badge,
    "detail-title": item.title,
    "detail-title-copy": item.title,
    "detail-summary": item.detailedSynopsis || item.summary,
    "detail-release": item.releaseLabel,
    "detail-timeline": item.timelineLabel,
    "detail-continuity": item.continuity,
    "detail-meta-title": detailType === "movie" ? "Ficha de la pelicula" : "Ficha de la serie",
    "detail-section-title": detailType === "movie" ? "Resumen de la pelicula" : "Resumen de la serie",
    "detail-footer-title": detailType === "movie" ? "Volver al listado de peliculas" : "Volver al universo de series"
  };

  Object.keys(mapping).forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = mapping[id];
    }
  });

  var heroVisual = document.querySelector(".detail-hero__visual");
  if (detailType === "movie" && heroVisual) {
    var fallbackPoster = createFallbackMoviePoster(item);

    heroVisual.classList.add("detail-hero__visual--poster");
    heroVisual.innerHTML = [
      '<button class="movie-poster-button" type="button" aria-label="Ampliar poster de ' + escapeHtml(item.title) + '">',
      '  <img class="movie-poster" src="' + fallbackPoster + '" alt="Poster de ' + escapeHtml(item.title) + '">',
      '</button>',
      '<p class="detail-hero__caption">Pulsa el poster para ampliarlo</p>'
    ].join("");

    var posterButton = heroVisual.querySelector(".movie-poster-button");
    var posterElement = heroVisual.querySelector(".movie-poster");
    var captionElement = heroVisual.querySelector(".detail-hero__caption");
    var posterModal = buildMoviePosterModal(item, fallbackPoster, "Poster de " + item.title);
    var modalPoster = posterModal.querySelector(".poster-modal__image");

    posterButton.addEventListener("click", function () {
      posterModal.showModal();
    });

    fetchWikipediaMoviePoster(item.slug).then(function (posterUrl) {
      if (!posterUrl) {
        return;
      }

      if (posterElement) {
        posterElement.src = posterUrl;
        posterElement.alt = "Poster oficial de " + item.title + " desde Wikipedia";
      }

      if (modalPoster) {
        modalPoster.src = posterUrl;
        modalPoster.alt = "Poster oficial de " + item.title + " desde Wikipedia";
      }

      if (captionElement) {
        captionElement.textContent = "Pulsa el poster para ampliarlo";
      }
    });
  }

  var cardsGrid = document.getElementById("detail-cards-grid");
  var fallbackCards = item.cards || [
    {
      title: detailType === "movie" ? "De que va" : "Panorama general",
      text: item.detailedSynopsis || item.summary
    },
    {
      title: detailType === "movie" ? "Ubicacion en Trek" : "Ubicacion en el canon",
      text: (detailType === "movie" ? "Esta pelicula" : "Esta serie") + " se ubica en " + item.timelineLabel + " dentro de " + item.continuity.toLowerCase() + "."
    },
    {
      title: detailType === "movie" ? "Por que verla" : "Por que importa",
      text: item.facts ? item.facts.join(" | ") + "." : "Forma parte del mapa general del universo Star Trek."
    }
  ];

  if (cardsGrid) {
    cardsGrid.innerHTML = fallbackCards.map(function (card) {
      return [
        '<article class="intro-card">',
        "  <h3>" + card.title + "</h3>",
        "  <p>" + card.text + "</p>",
        "</article>"
      ].join("");
    }).join("");
  }

  var factsList = document.getElementById("detail-facts-list");
  if (factsList) {
    factsList.innerHTML = (item.facts || []).map(function (fact) {
      return "<li>" + fact + "</li>";
    }).join("");
  }

  var statList = document.getElementById("detail-stat-list");
  var fallbackStats = item.stats || [
    { label: detailType === "movie" ? "Estreno" : "Emision", value: item.releaseLabel },
    { label: "Cronologia", value: item.timelineLabel },
    { label: "Continuidad", value: item.continuity }
  ];

  if (statList) {
    statList.innerHTML = fallbackStats.map(function (stat) {
      return "<li><span>" + stat.label + "</span><strong>" + stat.value + "</strong></li>";
    }).join("");
  }

  if (detailType === "movie") {
    var movieMain = document.querySelector("main");

    if (movieMain && item.detailedSynopsis) {
      var synopsisSection = document.createElement("section");
      synopsisSection.className = "section";
      synopsisSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Sinopsis detallada</p>',
        '  <h2>La pelicula en profundidad</h2>',
        '  <p class="section-text">' + item.detailedSynopsis + '</p>',
        '</div>',
        '<div class="intro-grid intro-grid--home card-grid--triple">',
        '  <article class="intro-card">',
        '    <h3>Contexto</h3>',
        '    <p>' + item.summary + '</p>',
        '  </article>',
        '  <article class="intro-card">',
        '    <h3>Ubicacion en Trek</h3>',
        '    <p>Esta pelicula se sitúa en ' + item.timelineLabel + ' dentro de ' + item.continuity.toLowerCase() + '.</p>',
        '  </article>',
        '  <article class="intro-card">',
        '    <h3>Claves</h3>',
        '    <p>' + (item.facts || []).join(" | ") + '</p>',
        '  </article>',
        '</div>'
      ].join("");

      movieMain.insertBefore(synopsisSection, movieMain.lastElementChild);
    }

    if (movieMain && MOVIE_CAST[item.slug] && MOVIE_CAST[item.slug].length) {
      var castSection = document.createElement("section");

      castSection.className = "section";
      castSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Artistas</p>',
        '  <h2>Reparto principal</h2>',
        '  <p class="section-text">Actores y personajes mas destacados de ' + item.title + '.</p>',
        '</div>',
        '<article class="intro-card intro-card--cast">',
        '  <ul class="cast-age-list">' +
          MOVIE_CAST[item.slug].map(function (entry) {
            return '<li><strong>' + entry.actor + '</strong> como ' + entry.role + '</li>';
          }).join("") +
        '</ul>',
        '</article>'
      ].join("");

      movieMain.insertBefore(castSection, movieMain.lastElementChild);
    }
  }

  if (detailType === "series") {
    var seasonEntry = findSeriesSeasonEntry(detailSlug);
    var main = document.querySelector("main");

    if (seasonEntry && main) {
      var seasonSection = document.createElement("section");
      seasonSection.className = "section";
      seasonSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Temporadas</p>',
        '  <h2>Explorar temporadas de ' + item.title + '</h2>',
        '  <p class="section-text">Cada temporada tiene ahora su propia subpagina con explicacion, enfoque y acceso rapido dentro de la serie.</p>',
        '</div>',
        '<div class="season-selector season-selector--detail">' +
          seasonEntry.seasons.map(function (season) {
            var suffix = season.episodesCount ? " | " + season.episodesCount + " episodios" : "";

            return '<a class="season-selector__link" href="' + season.url + '">Temporada ' + season.number + suffix + '</a>';
          }).join("") +
        '</div>'
      ].join("");

      main.insertBefore(seasonSection, main.lastElementChild);

      var seasonGridSection = document.createElement("section");
      seasonGridSection.className = "section";
      seasonGridSection.innerHTML = [
        '<div class="section-heading">',
        '  <p class="eyebrow">Mapa de temporadas</p>',
        '  <h2>Todas las temporadas explicadas</h2>',
        '  <p class="section-text">Cada bloque resume de que va esa etapa, que cambia dentro de la serie y por que es importante dentro del universo Star Trek.</p>',
        '</div>',
        '<div class="season-overview-grid">' +
          seasonEntry.seasons.map(function (season) {
            return [
              '<article class="season-overview-card">',
              '  <p class="season-overview-card__eyebrow">Temporada ' + season.number + '</p>',
              '  <h3>' + season.fullTitle + '</h3>',
              '  <p>' + season.summary + '</p>',
              '  <div class="season-overview-card__meta">',
              '    <span class="timeline__tag">' + (season.episodesCount ? season.episodesCount + ' episodios' : 'episodios pendientes') + '</span>',
              '    <span class="timeline__tag">' + (season.timelineWindow || seasonEntry.timelineLabel) + '</span>',
              '  </div>',
              '  <p class="season-overview-card__focus"><strong>Clave:</strong> ' + season.impact + '</p>',
              '  <a class="button button--primary" href="' + season.url + '">Abrir temporada ' + season.number + '</a>',
              '</article>'
            ].join("");
          }).join("") +
        '</div>'
      ].join("");

      main.insertBefore(seasonGridSection, main.lastElementChild);
    }
  }
}());
