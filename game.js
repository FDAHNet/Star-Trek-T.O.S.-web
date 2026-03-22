(function () {
  "use strict";

  var episodes = [
    {
      number: 1,
      title: "The Man Trap",
      date: "8 de septiembre de 1966",
      summary: "La Enterprise investiga una remota estación científica y descubre una criatura cambiaformas que se alimenta de sal."
    },
    {
      number: 2,
      title: "Charlie X",
      date: "15 de septiembre de 1966",
      summary: "Un joven con poderes extraordinarios sube a bordo y convierte la convivencia en una amenaza impredecible."
    },
    {
      number: 3,
      title: "Where No Man Has Gone Before",
      date: "22 de septiembre de 1966",
      summary: "Un accidente en el borde de la galaxia altera a dos tripulantes y pone en cuestión los límites del poder humano."
    },
    {
      number: 4,
      title: "The Naked Time",
      date: "29 de septiembre de 1966",
      summary: "Un contagio emocional elimina el autocontrol de la tripulación y deja a la nave al borde del desastre."
    },
    {
      number: 5,
      title: "The Enemy Within",
      date: "6 de octubre de 1966",
      summary: "Un fallo del transportador divide al capitán Kirk en dos versiones opuestas de su personalidad."
    },
    {
      number: 6,
      title: "Mudd's Women",
      date: "13 de octubre de 1966",
      summary: "El estafador Harcourt Fenton Mudd llega con tres mujeres cuyo aparente encanto esconde un engaño químico."
    },
    {
      number: 7,
      title: "What Are Little Girls Made Of?",
      date: "20 de octubre de 1966",
      summary: "La búsqueda de un científico perdido conduce a androides capaces de imitar a seres humanos con inquietante precisión."
    },
    {
      number: 8,
      title: "Miri",
      date: "27 de octubre de 1966",
      summary: "La tripulación encuentra un planeta idéntico a la Tierra donde solo sobreviven niños y una enfermedad letal."
    },
    {
      number: 9,
      title: "Dagger of the Mind",
      date: "3 de noviembre de 1966",
      summary: "Kirk destapa abusos psiquiátricos en una colonia penal que utiliza tecnología para controlar la mente."
    },
    {
      number: 10,
      title: "The Corbomite Maneuver",
      date: "10 de noviembre de 1966",
      summary: "Kirk improvisa un farol diplomático para evitar la destrucción de la Enterprise ante un poderoso desconocido."
    },
    {
      number: 11,
      title: "The Menagerie, Part I",
      date: "17 de noviembre de 1966",
      summary: "Spock secuestra la Enterprise para llevar al capitán Pike a Talos IV y se enfrenta a un juicio militar."
    },
    {
      number: 12,
      title: "The Menagerie, Part II",
      date: "24 de noviembre de 1966",
      summary: "El juicio continúa mientras se revela la historia de Pike y la verdadera razón del desafío de Spock."
    },
    {
      number: 13,
      title: "The Conscience of the King",
      date: "8 de diciembre de 1966",
      summary: "Kirk sospecha que un actor itinerante podría ser un criminal de guerra oculto desde hace años."
    },
    {
      number: 14,
      title: "Balance of Terror",
      date: "15 de diciembre de 1966",
      summary: "La Enterprise se enfrenta por primera vez a los romulanos en un duelo táctico cargado de tensión."
    },
    {
      number: 15,
      title: "Shore Leave",
      date: "29 de diciembre de 1966",
      summary: "Un planeta aparentemente paradisíaco materializa pensamientos y recuerdos, con resultados peligrosos y absurdos."
    },
    {
      number: 16,
      title: "The Galileo Seven",
      date: "5 de enero de 1967",
      summary: "Spock lidera una misión atrapada en un planeta hostil, donde la lógica pura es puesta a prueba."
    },
    {
      number: 17,
      title: "The Squire of Gothos",
      date: "12 de enero de 1967",
      summary: "Un ser caprichoso y casi omnipotente retiene a la tripulación para su propio entretenimiento."
    },
    {
      number: 18,
      title: "Arena",
      date: "19 de enero de 1967",
      summary: "Kirk debe combatir en duelo singular contra un gorn mientras una raza superior juzga ambas civilizaciones."
    },
    {
      number: 19,
      title: "Tomorrow Is Yesterday",
      date: "26 de enero de 1967",
      summary: "La Enterprise viaja accidentalmente al siglo XX y lucha por regresar sin alterar la historia."
    },
    {
      number: 20,
      title: "Court Martial",
      date: "2 de febrero de 1967",
      summary: "Kirk es sometido a consejo de guerra tras una aparente negligencia mortal durante una emergencia."
    },
    {
      number: 21,
      title: "The Return of the Archons",
      date: "9 de febrero de 1967",
      summary: "En un planeta dominado por una falsa armonía social, la tripulación descubre un poder controlador oculto."
    },
    {
      number: 22,
      title: "Space Seed",
      date: "16 de febrero de 1967",
      summary: "La Enterprise rescata a Khan Noonien Singh, un líder genéticamente mejorado con ambiciones imperiales."
    },
    {
      number: 23,
      title: "A Taste of Armageddon",
      date: "23 de febrero de 1967",
      summary: "Dos mundos en guerra virtual sacrifican ciudadanos reales para mantener un conflicto limpio y burocrático."
    },
    {
      number: 24,
      title: "This Side of Paradise",
      date: "2 de marzo de 1967",
      summary: "Esporas alienígenas convierten una colonia y a parte de la tripulación en una comunidad eufórica y pasiva."
    },
    {
      number: 25,
      title: "The Devil in the Dark",
      date: "9 de marzo de 1967",
      summary: "Una supuesta criatura asesina resulta ser la clave de un malentendido entre especies."
    },
    {
      number: 26,
      title: "Errand of Mercy",
      date: "23 de marzo de 1967",
      summary: "Federación y klingons se disputan un planeta estratégico, pero sus habitantes esconden un poder inesperado."
    },
    {
      number: 27,
      title: "The Alternative Factor",
      date: "30 de marzo de 1967",
      summary: "Un hombre perseguido a través de universos paralelos amenaza con desencadenar una catástrofe cósmica."
    },
    {
      number: 28,
      title: "The City on the Edge of Forever",
      date: "6 de abril de 1967",
      summary: "Un salto temporal obliga a Kirk a elegir entre el amor y el futuro de la historia humana."
    },
    {
      number: 29,
      title: "Operation: Annihilate!",
      date: "13 de abril de 1967",
      summary: "Parásitos neurales invaden colonias humanas y amenazan incluso a la propia familia de Kirk."
    }
  ];

  var episodeGrid = document.getElementById("episode-grid");
  var episodeCount = document.getElementById("episode-count");
  var episodeSearch = document.getElementById("episode-search");
  var emptyState = document.getElementById("empty-state");

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatCount(total, visible) {
    if (visible === total) {
      return total + " episodios listados";
    }

    return visible + " de " + total + " episodios visibles";
  }

  function buildEpisodeCard(episode) {
    return [
      '<article class="episode-card">',
      '  <div class="episode-card__top">',
      '    <div>',
      '      <span class="episode-card__number">Episodio ' + episode.number + '</span>',
      '      <h3 class="episode-card__title">' + episode.title + '</h3>',
      '      <p class="episode-card__meta">Emisión original: ' + episode.date + '</p>',
      '    </div>',
      '  </div>',
      '  <p>' + episode.summary + '</p>',
      '</article>'
    ].join("");
  }

  function filterEpisodes(query) {
    var normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return episodes.slice();
    }

    return episodes.filter(function (episode) {
      var haystack = normalize(
        episode.number + " " +
        episode.title + " " +
        episode.summary + " " +
        episode.date
      );

      return haystack.indexOf(normalizedQuery) !== -1;
    });
  }

  function renderEpisodes(query) {
    if (!episodeGrid || !episodeCount || !emptyState) {
      return;
    }

    var filteredEpisodes = filterEpisodes(query);

    episodeCount.textContent = formatCount(episodes.length, filteredEpisodes.length);
    episodeGrid.innerHTML = filteredEpisodes.map(buildEpisodeCard).join("");
    emptyState.hidden = filteredEpisodes.length > 0;
  }

  if (episodeSearch) {
    episodeSearch.addEventListener("input", function (event) {
      renderEpisodes(event.target.value);
    });
  }

  renderEpisodes("");
}());
