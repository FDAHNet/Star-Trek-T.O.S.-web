var LANGUAGE_OPTIONS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
  { code: "uk", label: "UA" },
  { code: "ca", label: "CAT" }
];

var STORAGE_KEY = "st-universe-language";
var GOOGLE_SCRIPT_ID = "google-translate-script";
var GOOGLE_CONTAINER_ID = "google_translate_element";

function getStoredLanguage() {
  return window.localStorage.getItem(STORAGE_KEY) || "es";
}

function setStoredLanguage(language) {
  window.localStorage.setItem(STORAGE_KEY, language);
}

function setGoogleCookie(language) {
  var cookieValue = language === "es" ? "/es/es" : "/es/" + language;
  document.cookie = "googtrans=" + cookieValue + "; path=/";
  document.cookie = "googtrans=" + cookieValue + "; domain=" + window.location.hostname + "; path=/";
}

function dispatchChange(element) {
  element.dispatchEvent(new Event("change"));
  element.dispatchEvent(new Event("input"));
}

function waitForGoogleCombo(language) {
  var attempts = 0;

  function poll() {
    var combo = document.querySelector(".goog-te-combo");

    if (combo) {
      combo.value = language;
      dispatchChange(combo);
      return;
    }

    attempts += 1;
    if (attempts < 40) {
      window.setTimeout(poll, 250);
    }
  }

  poll();
}

function applyLanguage(language) {
  setStoredLanguage(language);
  setGoogleCookie(language);

  if (language === "es") {
    window.location.reload();
    return;
  }

  waitForGoogleCombo(language);
}

function buildSelector() {
  var topbar = document.querySelector(".topbar");

  if (!topbar || document.querySelector(".language-panel")) {
    return;
  }

  var panel = document.createElement("div");
  panel.className = "language-panel";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "Selector de idioma");

  var label = document.createElement("span");
  label.className = "language-panel__label";
  label.textContent = "Universal Translator";
  panel.appendChild(label);

  var rail = document.createElement("div");
  rail.className = "language-panel__rail";

  LANGUAGE_OPTIONS.forEach(function (option) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "language-panel__button";
    button.textContent = option.label;
    button.setAttribute("data-lang-code", option.code);
    button.setAttribute("aria-pressed", option.code === getStoredLanguage() ? "true" : "false");

    if (option.code === getStoredLanguage()) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", function () {
      document.querySelectorAll(".language-panel__button").forEach(function (item) {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      applyLanguage(option.code);
    });

    rail.appendChild(button);
  });

  panel.appendChild(rail);
  topbar.appendChild(panel);
}

function ensureGoogleContainer() {
  if (document.getElementById(GOOGLE_CONTAINER_ID)) {
    return;
  }

  var container = document.createElement("div");
  container.id = GOOGLE_CONTAINER_ID;
  container.className = "google-translate-anchor";
  document.body.appendChild(container);
}

function ensureGoogleScript() {
  if (document.getElementById(GOOGLE_SCRIPT_ID)) {
    return;
  }

  var script = document.createElement("script");
  script.id = GOOGLE_SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

function initGoogleTranslate() {
  if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
    return;
  }

  new window.google.translate.TranslateElement({
    pageLanguage: "es",
    includedLanguages: "en,fr,ru,uk,ca",
    autoDisplay: false,
    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
  }, GOOGLE_CONTAINER_ID);

  var savedLanguage = getStoredLanguage();
  if (savedLanguage !== "es") {
    waitForGoogleCombo(savedLanguage);
  }
}

window.googleTranslateElementInit = initGoogleTranslate;

export function setupLanguageSwitcher() {
  buildSelector();
  ensureGoogleContainer();
  ensureGoogleScript();
  setGoogleCookie(getStoredLanguage());
}
