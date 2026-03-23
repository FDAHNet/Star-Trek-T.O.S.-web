from __future__ import annotations

import json
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
EPISODE_DATA = ROOT / "series-episode-data.js"
OUTPUT = ROOT / "series-episode-translations.js"

TARGET_LANGUAGES = ["es", "fr", "ru", "uk", "ca"]
BATCH_SIZE = 40
PAUSE_SECONDS = 0.1


def load_payload() -> dict[str, list[list[dict[str, object]]]]:
    text = EPISODE_DATA.read_text(encoding="utf-8")
    return json.loads(text.split("=", 1)[1].rsplit(";", 1)[0])


def load_existing() -> dict[str, list[list[dict[str, str]]]]:
    if not OUTPUT.exists():
        return {}
    text = OUTPUT.read_text(encoding="utf-8")
    return json.loads(text.split("=", 1)[1].rsplit(";", 1)[0])


def save_payload(payload: dict[str, list[list[dict[str, str]]]]) -> None:
    OUTPUT.write_text(
        "export var SERIES_EPISODE_TRANSLATIONS = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )


def chunked(items: list[str], size: int) -> list[list[str]]:
    return [items[index:index + size] for index in range(0, len(items), size)]


def translate_texts(texts: list[str], target: str) -> list[str]:
    translator = GoogleTranslator(source="en", target=target)
    translated: list[str] = []

    for batch in chunked(texts, BATCH_SIZE):
        translated.extend(translator.translate_batch(batch))
        time.sleep(PAUSE_SECONDS)

    return translated


def main() -> None:
    payload = load_payload()
    result = load_existing()

    for slug, seasons in payload.items():
        if slug in result and len(result[slug]) == len(seasons):
            print(f"Skipping {slug}, already translated.")
            continue

        print(f"Translating {slug}...")
        result[slug] = []

        for season in seasons:
            season_result: list[dict[str, str]] = []
            source_synopses = [str(episode.get("synopsis") or "") for episode in season]
            translations_by_language = {language: [""] * len(season) for language in TARGET_LANGUAGES}

            non_empty_indexes = [index for index, synopsis in enumerate(source_synopses) if synopsis]
            non_empty_synopses = [source_synopses[index] for index in non_empty_indexes]

            for language in TARGET_LANGUAGES:
                if not non_empty_synopses:
                    continue
                translated_batch = translate_texts(non_empty_synopses, language)
                for offset, episode_index in enumerate(non_empty_indexes):
                    translations_by_language[language][episode_index] = translated_batch[offset]

            for index, synopsis in enumerate(source_synopses):
                season_result.append({
                    "en": synopsis,
                    "es": translations_by_language["es"][index] if synopsis else "",
                    "fr": translations_by_language["fr"][index] if synopsis else "",
                    "ru": translations_by_language["ru"][index] if synopsis else "",
                    "uk": translations_by_language["uk"][index] if synopsis else "",
                    "ca": translations_by_language["ca"][index] if synopsis else "",
                })

            result[slug].append(season_result)

        save_payload(result)
        print(f"Saved progress for {slug}")

    save_payload(result)
    print(f"Saved {OUTPUT}")


if __name__ == "__main__":
    main()
