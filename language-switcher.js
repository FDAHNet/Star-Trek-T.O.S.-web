import { getLanguage, LANGUAGE_OPTIONS, setLanguage, t } from "./i18n/index.js";

export function setupLanguageSwitcher() {
  var topbar = document.querySelector(".topbar");

  if (!topbar || document.querySelector(".language-panel")) {
    return;
  }

  document.documentElement.lang = getLanguage();

  var panel = document.createElement("div");
  panel.className = "language-panel";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", t("universalTranslator"));

  var label = document.createElement("span");
  label.className = "language-panel__label";
  label.textContent = t("universalTranslator");
  panel.appendChild(label);

  var rail = document.createElement("div");
  rail.className = "language-panel__rail";

  LANGUAGE_OPTIONS.forEach(function (option) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "language-panel__button";
    button.textContent = option.label;
    button.setAttribute("aria-pressed", option.code === getLanguage() ? "true" : "false");

    if (option.code === getLanguage()) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", function () {
      if (option.code === getLanguage()) {
        return;
      }

      setLanguage(option.code);
      window.location.reload();
    });

    rail.appendChild(button);
  });

  panel.appendChild(rail);
  topbar.appendChild(panel);
}
