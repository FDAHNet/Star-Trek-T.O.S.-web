import { SERIES_DETAILS } from "./franchise-data.js";
import { OTHER_SERIES, SEASONS } from "./season-data.js";

function parseSeasonBreakdown(value) {
  return String(value || "").match(/\d+/g).map(function (item) {
    return Number(item);
  });
}

function getSeasonPageUrl(slug, seasonNumber) {
  if (slug === "star-trek-the-original-series") {
    return "./temporada-" + seasonNumber + ".html";
  }

  return "./temporada-" + slug + "-" + seasonNumber + ".html";
}

function getSeriesMeta(slug) {
  return SERIES_DETAILS.find(function (item) {
    return item.slug === slug;
  });
}

function getSeasonCounts(slug, fallbackBreakdown) {
  if (slug === "star-trek-the-original-series") {
    return Object.keys(SEASONS).map(function (key) {
      return SEASONS[key].episodesCount;
    });
  }

  return parseSeasonBreakdown(fallbackBreakdown);
}

function buildSeriesSeasonEntry(config) {
  var seriesMeta = getSeriesMeta(config.slug);
  var seasonCounts = getSeasonCounts(config.slug, config.seasonBreakdown);

  return {
    slug: config.slug,
    title: config.title,
    badge: seriesMeta ? seriesMeta.badge : "Serie",
    releaseLabel: seriesMeta ? seriesMeta.releaseLabel : "",
    timelineLabel: seriesMeta ? seriesMeta.timelineLabel : "",
    continuity: seriesMeta ? seriesMeta.continuity : "Linea principal",
    seasons: config.seasons.map(function (season, index) {
      return {
        number: index + 1,
        title: "Temporada " + (index + 1),
        fullTitle: config.title + " | Temporada " + (index + 1),
        episodesCount: seasonCounts[index] || null,
        releaseWindow: season.releaseWindow,
        timelineWindow: season.timelineWindow,
        summary: season.summary,
        focus: season.focus,
        impact: season.impact,
        url: getSeasonPageUrl(config.slug, index + 1)
      };
    })
  };
}

export var SERIES_SEASON_DETAILS = [
  buildSeriesSeasonEntry({
    slug: "star-trek-the-original-series",
    title: "Star Trek: The Original Series",
    seasons: [
      {
        releaseWindow: "1966-1967",
        timelineWindow: "2265-2266",
        summary: "La temporada fundacional presenta a Kirk, Spock y McCoy y fija el tono de exploracion, aventura y comentario social de la franquicia.",
        focus: "Su gran fuerza esta en construir el canon basico: la Enterprise, la Primera Directriz, los romulanos, Khan y muchos de los dilemas clasicos.",
        impact: "Es la temporada que convierte a Star Trek en un lenguaje propio y sirve de base para casi todo lo que vendra despues."
      },
      {
        releaseWindow: "1967-1968",
        timelineWindow: "2267-2268",
        summary: "La segunda temporada amplia el universo con mas seguridad y convierte a la serie en una mitologia ya reconocible.",
        focus: "Vulcano, el universo espejo, los tribbles y la llegada de Chekov consolidan una identidad mucho mas rica y popular.",
        impact: "Suele considerarse la cima creativa del periodo clasico por la cantidad de episodios iconicos y conceptos duraderos que aporta."
      },
      {
        releaseWindow: "1968-1969",
        timelineWindow: "2268-2269",
        summary: "La tercera temporada es mas irregular, pero tambien mas atrevida en tono, ideas visuales y experimentos narrativos.",
        focus: "Alterna espionaje, ciencia ficcion filosofica y episodios extraños, con una tripulacion ya totalmente convertida en icono.",
        impact: "Cierra la emision original dejando un legado suficiente como para que la franquicia sobreviviera y renaciera mas tarde."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-the-animated-series",
    title: "Star Trek: The Animated Series",
    seasonBreakdown: "16, 6 episodios",
    seasons: [
      {
        releaseWindow: "1973",
        timelineWindow: "2269",
        summary: "La primera temporada animada prolonga directamente la etapa clasica y aprovecha el formato para mostrar mundos mas extraños y conceptos mas libres.",
        focus: "Recupera a la tripulacion original y multiplica la imaginacion visual con criaturas, escenarios y especies que la accion real no podia asumir con tanta facilidad.",
        impact: "Funciona como un puente entre la serie original y la posterior era cinematografica del reparto clasico."
      },
      {
        releaseWindow: "1974",
        timelineWindow: "2270",
        summary: "La segunda temporada es mas corta y compacta, pero mantiene la vocacion de aventura y expansion del canon clasico.",
        focus: "Su formato breve concentra las ideas y mantiene la sensacion de que la Enterprise sigue explorando tras el final televisivo de T.O.S.",
        impact: "Aunque pequeña, completa el cierre de la etapa clasica en television y refuerza el valor de la animacion dentro de Trek."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-enterprise",
    title: "Star Trek: Enterprise",
    seasonBreakdown: "26, 26, 24 y 22 episodios",
    seasons: [
      {
        releaseWindow: "2001-2002",
        timelineWindow: "2151-2152",
        summary: "La primera temporada muestra los pasos inseguros de la humanidad antes de la Federacion, cuando explorar el espacio profundo todavia resulta nuevo y arriesgado.",
        focus: "Archer y su tripulacion aprenden sobre la marcha, con una mezcla de entusiasmo pionero y tensiones culturales con vulcanos, andorianos y klingons.",
        impact: "Su mayor valor esta en enseñar el universo Trek antes de que exista la comodidad institucional de la Flota Estelar clasica."
      },
      {
        releaseWindow: "2002-2003",
        timelineWindow: "2152-2153",
        summary: "La segunda temporada afianza a la tripulacion y ensancha la sensacion de frontera, con misiones mas seguras y mejor definidas.",
        focus: "La serie sigue siendo bastante episodica, pero ya deja ver amenazas y alianzas que preparan el gran giro del tercer año.",
        impact: "Sirve como bisagra entre la exploracion ingenua del principio y la etapa mas serializada y belica que esta por llegar."
      },
      {
        releaseWindow: "2003-2004",
        timelineWindow: "2153-2154",
        summary: "La tercera temporada convierte Enterprise en una historia de guerra y respuesta al trauma con el arco Xindi como eje principal.",
        focus: "La mision en la Expanse vuelve la serie mucho mas serializada, oscura y tensa, obligando a Archer a tomar decisiones moralmente complejas.",
        impact: "Es la temporada mas transformadora de la serie y la que mejor demuestra que Enterprise podia reinventarse con ambicion."
      },
      {
        releaseWindow: "2004-2005",
        timelineWindow: "2154-2155",
        summary: "La cuarta temporada opta por arcos cortos y conecta de manera mas directa con la fundacion del canon clasico.",
        focus: "Romulanos, vulcanos, augmentos y la futura Federacion quedan articulados con mucha mas precision historica y sentido de legado.",
        impact: "Para muchos es la mejor temporada porque abraza plenamente la funcion de precuela y deja la sensacion de un universo en construccion."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-short-treks",
    title: "Star Trek: Short Treks",
    seasonBreakdown: "4 y 6 episodios",
    seasons: [
      {
        releaseWindow: "2018-2019",
        timelineWindow: "2257-2258",
        summary: "La primera tanda de Short Treks nace como complemento breve de Discovery y se centra en personajes, conexiones y pequeños relatos autónomos.",
        focus: "El formato corto permite ampliar matices sin cargar la serie principal, con historias concentradas y muy directas.",
        impact: "Abre una via flexible para contar Trek desde piezas pequeñas y experimentar con tono y estructura."
      },
      {
        releaseWindow: "2019-2020",
        timelineWindow: "2239-3181",
        summary: "La segunda temporada amplia el rango de la antologia y reparte sus historias entre varias eras del universo Trek.",
        focus: "Pike, Spock, Picard y otros rincones del canon aparecen en un formato que ya no depende solo de Discovery.",
        impact: "Demuestra que Short Treks funciona mejor como laboratorio de ideas dentro de toda la franquicia."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-discovery",
    title: "Star Trek: Discovery",
    seasonBreakdown: "15, 14, 13, 13 y 10 episodios",
    seasons: [
      {
        releaseWindow: "2017-2018",
        timelineWindow: "2256-2257",
        summary: "La primera temporada arranca con la guerra klingon y el conflicto de Michael Burnham, en una version de Trek mas dramatica y serializada.",
        focus: "El motin inicial, el contexto belico y la identidad fragmentada de la Discovery marcan una entrada muy distinta respecto a las series anteriores.",
        impact: "Su importancia esta en relanzar Star Trek para la era del streaming con un tono mas intenso y continuo."
      },
      {
        releaseWindow: "2019",
        timelineWindow: "2257-2258",
        summary: "La segunda temporada incorpora a Pike y Spock y equilibra mejor el drama serial con el espiritu clasico de exploracion.",
        focus: "Las senales rojas, el Angel Rojo y la presencia de Pike acercan la serie al periodo previo de Strange New Worlds.",
        impact: "Es el año que reconcilia Discovery con una parte del fandom clasico y abre nuevas ramificaciones para la franquicia."
      },
      {
        releaseWindow: "2020-2021",
        timelineWindow: "3188-3189",
        summary: "La tercera temporada lleva a la serie al siglo XXXII y reinicia por completo el contexto politico y tecnologico.",
        focus: "La Federacion debilitada y el misterio del Burn convierten la temporada en un relato de reconstruccion y futuro lejano.",
        impact: "Su gran aporte es mover Star Trek a una epoca apenas explorada y liberar a la serie del peso de la precuela."
      },
      {
        releaseWindow: "2021-2022",
        timelineWindow: "3190",
        summary: "La cuarta temporada consolida la etapa futura y se centra en una amenaza cosmica que exige diplomacia, ciencia y coordinacion galactica.",
        focus: "La DMA y el esfuerzo de reconstruccion de la Federacion hacen que Discovery se vuelva mas coral y estrategica.",
        impact: "Refuerza la idea de que el siglo XXXII puede sostener una identidad Trek propia, menos dependiente del pasado."
      },
      {
        releaseWindow: "2024",
        timelineWindow: "3191",
        summary: "La quinta temporada cierra la serie con una aventura de gran escala ligada a una tecnologia ancestral y a la carrera por encontrarla.",
        focus: "La mision final combina exploracion arqueologica, persecucion y despedida del equipo principal.",
        impact: "Funciona como cierre de una serie que conecto dos eras muy diferentes del universo Trek."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-strange-new-worlds",
    title: "Star Trek: Strange New Worlds",
    seasonBreakdown: "10, 10 y 10 episodios",
    seasons: [
      {
        releaseWindow: "2022",
        timelineWindow: "2259",
        summary: "La primera temporada recupera con claridad la aventura episodica y el optimismo explorador asociados al Trek clasico.",
        focus: "Pike, Spock y Number One lideran una Enterprise muy centrada en mundos nuevos, dilemas morales y equilibrio de tonos.",
        impact: "Se convierte rapidamente en la serie que mejor actualiza el espiritu de T.O.S. para el publico contemporaneo."
      },
      {
        releaseWindow: "2023",
        timelineWindow: "2260",
        summary: "La segunda temporada ensancha el reparto, apuesta por registros mas variados y profundiza en amenazas como los gorn.",
        focus: "Combina aventura, humor, musicalidad ocasional y drama personal sin perder el aire clasico de exploracion semanal.",
        impact: "Confirma que Strange New Worlds no era solo nostalgia, sino una formula muy flexible dentro del Trek moderno."
      },
      {
        releaseWindow: "2025",
        timelineWindow: "2261",
        summary: "La tercera temporada consolida la serie como antesala directa de la era Kirk mientras mantiene su estructura de misiones autocontenidas.",
        focus: "El reparto ya funciona como familia de puente y la serie gana confianza para conectar legado clasico y sensibilidad actual.",
        impact: "Refuerza a Pike y su Enterprise como una etapa con identidad propia dentro del eje pre-T.O.S."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-the-next-generation",
    title: "Star Trek: The Next Generation",
    seasonBreakdown: "26, 22, 26, 26, 26, 26 y 26 episodios",
    seasons: [
      {
        releaseWindow: "1987-1988",
        timelineWindow: "2364",
        summary: "La primera temporada presenta a Picard y la Enterprise-D mientras la serie busca una voz propia mas alla de la sombra de T.O.S.",
        focus: "Introduce a Q, Data, Worf y el nuevo puente, pero todavia alterna intuiciones brillantes con una identidad en construccion.",
        impact: "Su importancia historica es enorme: demuestra que Star Trek podia sobrevivir con una nueva tripulacion y otro tono."
      },
      {
        releaseWindow: "1988-1989",
        timelineWindow: "2365",
        summary: "La segunda temporada estabiliza la dinamica del reparto y gana confianza en sus ideas filosoficas y de ciencia ficcion.",
        focus: "Aunque breve, mejora el retrato de personajes y prepara el salto de calidad que llegara justo despues.",
        impact: "Es la temporada de ajuste que hace posible la verdadera consolidacion de TNG."
      },
      {
        releaseWindow: "1989-1990",
        timelineWindow: "2366",
        summary: "La tercera temporada dispara el prestigio de la serie con un reparto ya afianzado y episodios mucho mas consistentes.",
        focus: "La aparicion de los borg y la mayor seguridad narrativa convierten este año en el gran punto de inflexion de TNG.",
        impact: "Aqui nace de verdad la TNG que marco a toda una generacion."
      },
      {
        releaseWindow: "1990-1991",
        timelineWindow: "2367",
        summary: "La cuarta temporada capitaliza la fuerza del tercer año y profundiza en familia, identidad y deber dentro de la Federacion.",
        focus: "Picard, Worf y Data reciben materiales muy fuertes mientras la serie amplifica su madurez moral y politica.",
        impact: "Refuerza la sensacion de que TNG ya es la referencia principal de Star Trek en television."
      },
      {
        releaseWindow: "1991-1992",
        timelineWindow: "2368",
        summary: "La quinta temporada combina episodios muy populares con una vision cada vez mas rica del universo del siglo XXIV.",
        focus: "El equilibrio entre aventura, debate etico y crecimiento de personajes alcanza aqui un nivel especialmente fino.",
        impact: "Es uno de los años mas recordados por la naturalidad con la que TNG parece dominar ya su formato."
      },
      {
        releaseWindow: "1992-1993",
        timelineWindow: "2369",
        summary: "La sexta temporada entra en la recta final con una serie muy segura, capaz de arriesgar mas sin perder claridad.",
        focus: "Cardassianos, honor klingon, dilemas de mando y experimentos de tono muestran un universo muy expandido.",
        impact: "Prepara la transicion hacia el final televisivo y hacia el nuevo ecosistema Trek de los noventa."
      },
      {
        releaseWindow: "1993-1994",
        timelineWindow: "2370",
        summary: "La septima temporada despide a la Enterprise-D con un tono algo melancolico y la vista puesta en el salto al cine.",
        focus: "El final busca cerrar el ciclo humano y simbolico de la tripulacion mas que reinventar el formato.",
        impact: "Cierra una de las etapas mas importantes de toda la franquicia y deja lista la continuidad cinematografica de TNG."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-deep-space-nine",
    title: "Star Trek: Deep Space Nine",
    seasonBreakdown: "20, 26, 26, 26, 26, 26 y 25 episodios",
    seasons: [
      {
        releaseWindow: "1993",
        timelineWindow: "2369",
        summary: "La primera temporada define la estacion, el agujero de gusano y el lugar singular de Sisko dentro del mapa Trek.",
        focus: "Bajor, Cardassia y la idea de una serie casi fija en un mismo escenario marcan una diferencia radical respecto a las Enterprise itinerantes.",
        impact: "Su mayor logro es abrir una nueva forma de hacer Star Trek, mas politica, espiritual y comunitaria."
      },
      {
        releaseWindow: "1993-1994",
        timelineWindow: "2369-2370",
        summary: "La segunda temporada profundiza en la vida de la estacion y empieza a perfilar amenazas mayores en el cuadrante Gamma.",
        focus: "La serie gana textura politica y deja asomar al Dominio mientras fortalece mucho a su reparto coral.",
        impact: "Es el año en que DS9 empieza a demostrar que su apuesta distinta puede sostenerse a largo plazo."
      },
      {
        releaseWindow: "1994-1995",
        timelineWindow: "2371",
        summary: "La tercera temporada incorpora el Defiant y acelera la tension con el Dominio, volviendo la serie mas estrategica y expansiva.",
        focus: "La estacion deja de ser solo punto de paso y se convierte en epicentro de una amenaza galactica en crecimiento.",
        impact: "Marca el comienzo del tramo en el que DS9 pasa de propuesta singular a serie imprescindible."
      },
      {
        releaseWindow: "1995-1996",
        timelineWindow: "2372",
        summary: "La cuarta temporada añade a Worf y abre nuevas fricciones entre la Federacion, los klingons y el equilibrio regional.",
        focus: "La serie mezcla guerra inminente, relaciones politicas y desarrollo de personajes con una seguridad cada vez mayor.",
        impact: "Es uno de los años que convierten a DS9 en el Trek mas abiertamente politico de la franquicia."
      },
      {
        releaseWindow: "1996-1997",
        timelineWindow: "2373",
        summary: "La quinta temporada aprieta el cerco del Dominio y vuelve mas sombrio el retrato de la Federacion y sus aliados.",
        focus: "Las decisiones de Sisko y la vulnerabilidad de la estacion colocan a la serie en una tension casi permanente.",
        impact: "Prepara la guerra abierta y eleva el sentido historico del conflicto que DS9 ha venido construyendo."
      },
      {
        releaseWindow: "1997-1998",
        timelineWindow: "2374",
        summary: "La sexta temporada se desarrolla plenamente dentro de la Guerra del Dominio y explota el potencial serial de la serie.",
        focus: "Ocupacion, resistencia, desgaste moral y vida en guerra convierten este año en uno de los mas intensos de Star Trek.",
        impact: "Consolida a DS9 como la serie Trek mas ambiciosa en arco politico y belico."
      },
      {
        releaseWindow: "1998-1999",
        timelineWindow: "2375",
        summary: "La septima temporada cierra el conflicto principal y al mismo tiempo resuelve los grandes arcos espirituales y personales del reparto.",
        focus: "La guerra, Bajor, los Profetas y las despedidas individuales conviven en una recta final muy cargada de peso historico.",
        impact: "Su final deja a DS9 como una obra clave para entender la madurez dramatica que podia alcanzar Star Trek."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-voyager",
    title: "Star Trek: Voyager",
    seasonBreakdown: "16, 26, 26, 26, 26, 26 y 26 episodios",
    seasons: [
      {
        releaseWindow: "1995",
        timelineWindow: "2371",
        summary: "La primera temporada presenta la gran premisa: una nave aislada a decenas de miles de años de casa y obligada a unirse para sobrevivir.",
        focus: "Janeway debe fusionar tripulaciones enfrentadas mientras el cuadrante Delta se convierte en un territorio desconocido y hostil.",
        impact: "Establece una de las ideas mas potentes de toda la franquicia: Trek como viaje de regreso y resistencia prolongada."
      },
      {
        releaseWindow: "1995-1996",
        timelineWindow: "2371-2372",
        summary: "La segunda temporada afianza el concepto de supervivencia y mejora la cohesion interna de la Voyager.",
        focus: "La serie sigue explorando sus tensiones entre Flota y maquis mientras amplifica la sensacion de aislamiento en el cuadrante Delta.",
        impact: "Sirve para convertir una gran premisa en una rutina narrativa ya reconocible y estable."
      },
      {
        releaseWindow: "1996-1997",
        timelineWindow: "2373",
        summary: "La tercera temporada fortalece al reparto y abre conflictos de identidad y especie mucho mas marcados.",
        focus: "La aparicion de amenazas mayores y la mayor definicion de personajes empujan a Voyager hacia una etapa mas segura.",
        impact: "Es el tramo que prepara la reinvencion decisiva del cuarto año."
      },
      {
        releaseWindow: "1997-1998",
        timelineWindow: "2374",
        summary: "La cuarta temporada reinventa la serie con la llegada de Seven of Nine y una energia creativa mucho mas fuerte.",
        focus: "Borg, humanidad, disciplina y reintegracion personal pasan a ocupar el centro del relato.",
        impact: "Es uno de los grandes puntos de inflexion de todo Star Trek noventero y el año que mas redefine a Voyager."
      },
      {
        releaseWindow: "1998-1999",
        timelineWindow: "2375",
        summary: "La quinta temporada saca partido al nuevo equilibrio del reparto y encuentra una voz muy estable para la serie.",
        focus: "Janeway, Seven y el Doctor articulan buena parte del impulso dramatico mientras la nave sigue acumulando kilometros hacia casa.",
        impact: "Representa la fase de madurez en la que Voyager funciona con mas naturalidad dentro de su propio modelo."
      },
      {
        releaseWindow: "1999-2000",
        timelineWindow: "2376-2377",
        summary: "La sexta temporada mantiene la solidez del equipo y prueba ideas formales algo mas arriesgadas en la recta final.",
        focus: "La serie alterna episodios de alto concepto con el desgaste emocional del viaje prolongado.",
        impact: "Refuerza la sensacion de travesia larga y de tripulacion convertida ya en comunidad permanente."
      },
      {
        releaseWindow: "2000-2001",
        timelineWindow: "2377-2378",
        summary: "La septima temporada orienta todo hacia el regreso y cierra la historia de la Voyager como odissea de larga distancia.",
        focus: "Los personajes afrontan las ultimas transformaciones personales mientras la promesa de volver a casa se vuelve por fin concreta.",
        impact: "Su final completa una de las misiones mas extensas y reconocibles del universo Trek."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-lower-decks",
    title: "Star Trek: Lower Decks",
    seasonBreakdown: "10, 10, 10, 10 y 10 episodios",
    seasons: [
      {
        releaseWindow: "2020",
        timelineWindow: "2380",
        summary: "La primera temporada presenta a la USS Cerritos y redefine el universo Trek desde la perspectiva de los oficiales subalternos.",
        focus: "Humor rapido, referencias continuas y mucha energia convierten a Mariner, Boimler, Tendi y Rutherford en un grupo muy marcado desde el inicio.",
        impact: "Demuestra que una comedia animada podia encajar en Trek sin renunciar al cariño por el canon."
      },
      {
        releaseWindow: "2021",
        timelineWindow: "2380",
        summary: "La segunda temporada pule el tono y vuelve el humor mas organico dentro de historias con mayor peso emocional.",
        focus: "La Cerritos deja de ser solo escenario de gags y gana una identidad de nave secundaria muy entrañable.",
        impact: "Confirma que Lower Decks no es una parodia externa, sino una serie Trek con lenguaje comico propio."
      },
      {
        releaseWindow: "2022",
        timelineWindow: "2381",
        summary: "La tercera temporada incrementa las consecuencias y hace que el equipo crezca sin perder velocidad ni ironia.",
        focus: "Los protagonistas empiezan a ser algo mas que fans dentro del universo y ocupan un lugar real en la maquinaria de la Flota.",
        impact: "Es el punto donde la serie demuestra que puede mezclar comedia, aventura y evolucion de personajes con equilibrio."
      },
      {
        releaseWindow: "2023",
        timelineWindow: "2381-2382",
        summary: "La cuarta temporada expande el alcance de la Cerritos y refuerza el valor del trabajo ordinario dentro de Starfleet.",
        focus: "Las relaciones del grupo y el reconocimiento profesional ganan importancia mientras la serie sigue jugando con el legado Trek.",
        impact: "Aporta una mirada especialmente afectuosa sobre la vida cotidiana en la Flota Estelar."
      },
      {
        releaseWindow: "2024",
        timelineWindow: "2382",
        summary: "La quinta temporada funciona como despedida de la tripulacion principal y como cierre del viaje emocional de la Cerritos.",
        focus: "El humor sigue presente, pero el centro esta en rematar la evolucion del grupo y lo que significa crecer dentro de Starfleet.",
        impact: "Cierra una serie que supo convertir la periferia del universo Trek en uno de sus lugares mas vivos."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-prodigy",
    title: "Star Trek: Prodigy",
    seasonBreakdown: "20 y 20 episodios",
    seasons: [
      {
        releaseWindow: "2021-2023",
        timelineWindow: "2383",
        summary: "La primera temporada presenta a un grupo joven sin experiencia que roba la Protostar y aprende poco a poco que significa ser tripulacion.",
        focus: "La figura holografica de Janeway sirve de guia para unir aventura juvenil, descubrimiento moral y pedagogia Trek.",
        impact: "Es una puerta de entrada excelente para nuevos espectadores sin perder continuidad con el canon."
      },
      {
        releaseWindow: "2024",
        timelineWindow: "2384-2385",
        summary: "La segunda temporada madura el conflicto y conecta con mas claridad la serie con la herencia de Voyager y la Flota Estelar.",
        focus: "Los protagonistas ya no solo sobreviven: empiezan a definir que clase de oficiales y personas quieren ser.",
        impact: "Amplia la ambicion de Prodigy y la convierte en una pieza valiosa dentro del periodo posterior a Voyager."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-picard",
    title: "Star Trek: Picard",
    seasonBreakdown: "10, 10 y 10 episodios",
    seasons: [
      {
        releaseWindow: "2020",
        timelineWindow: "2399",
        summary: "La primera temporada reencuentra a Picard con un siglo XXIV menos idealizado y muy marcado por las secuelas de los sintes y los romulanos.",
        focus: "El tono es mas intimo y crepuscular, con un heroe veterano obligado a actuar cuando la Federacion ya no le resulta familiar.",
        impact: "Sirve como retorno emocional de uno de los grandes iconos de Star Trek y abre preguntas sobre legado y decadencia."
      },
      {
        releaseWindow: "2022",
        timelineWindow: "2401",
        summary: "La segunda temporada introduce a Q y un gran desvio temporal para trabajar el pasado y las heridas personales de Picard.",
        focus: "La serie abraza mas frontalmente el viaje temporal y el ajuste emocional del protagonista con su propia biografia.",
        impact: "Aporta una capa mas introspectiva a la etapa final de Picard, aunque con una estructura muy distinta a la del primer año."
      },
      {
        releaseWindow: "2023",
        timelineWindow: "2401-2402",
        summary: "La tercera temporada reune al reparto de TNG y se plantea como una gran despedida generacional.",
        focus: "La amenaza externa importa, pero el verdadero centro es ver de nuevo a la vieja tripulacion trabajando como un solo cuerpo.",
        impact: "Se convierte en cierre sentimental y celebratorio de la era Picard-Riker-Data dentro de la continuidad principal."
      }
    ]
  }),
  buildSeriesSeasonEntry({
    slug: "star-trek-starfleet-academy",
    title: "Star Trek: Starfleet Academy",
    seasonBreakdown: "10 episodios en la primera temporada",
    seasons: [
      {
        releaseWindow: "2026-prevista",
        timelineWindow: "Siglo XXXII",
        summary: "La primera temporada prevista trasladara la accion a la Academia Estelar en la era posterior a Discovery.",
        focus: "La promesa de la serie esta en combinar formacion, vida de cadetes y reconstruccion institucional en el futuro remoto.",
        impact: "Puede convertirse en la gran via para contar Star Trek desde el aprendizaje y la juventud dentro del siglo XXXII."
      }
    ]
  })
];

export function findSeriesSeasonEntry(slug) {
  return SERIES_SEASON_DETAILS.find(function (item) {
    return item.slug === slug;
  });
}

export { getSeasonPageUrl };
