from __future__ import annotations

import json
import re
from io import StringIO
from pathlib import Path

import pandas as pd
import requests

SERIES_PAGES = {
    "star-trek-the-original-series": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_The_Original_Series_episodes",
    "star-trek-the-animated-series": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_The_Animated_Series_episodes",
    "star-trek-the-next-generation": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_The_Next_Generation_episodes",
    "star-trek-deep-space-nine": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Deep_Space_Nine_episodes",
    "star-trek-voyager": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Voyager_episodes",
    "star-trek-enterprise": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Enterprise_episodes",
    "star-trek-discovery": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Discovery_episodes",
    "star-trek-short-treks": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Short_Treks_episodes",
    "star-trek-picard": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Picard_episodes",
    "star-trek-lower-decks": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Lower_Decks_episodes",
    "star-trek-prodigy": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Prodigy_episodes",
    "star-trek-strange-new-worlds": "https://en.wikipedia.org/wiki/List_of_Star_Trek:_Strange_New_Worlds_episodes",
}

HEADERS = {"User-Agent": "Mozilla/5.0 Codex Episode Importer"}
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "series-episode-data.js"


def flatten_columns(df: pd.DataFrame) -> pd.DataFrame:
    columns = []
    for col in df.columns:
        if isinstance(col, tuple):
            parts = [str(item).strip() for item in col if str(item).strip() and str(item) != "nan"]
            columns.append(" | ".join(parts))
        else:
            columns.append(str(col).strip())
    df = df.copy()
    df.columns = columns
    return df


def clean_text(value: object) -> str:
    if pd.isna(value):
        return ""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    text = str(value or "").strip()
    text = re.sub(r"\[[^\]]*\]", "", text)
    text = text.replace("\u200a", " ")
    text = text.replace("\xa0", " ")
    text = text.replace("†", "")
    text = re.sub(r"\s+", " ", text)
    return text.strip(' "')


def pick_column(columns: list[str], *patterns: str) -> str | None:
    lowered = [(col, col.lower()) for col in columns]
    for pattern in patterns:
        for original, lowered_col in lowered:
            if pattern in lowered_col:
                return original
    return None


def is_section_row(display_number: str, title: str) -> bool:
    normalized = f"{display_number} {title}".strip().lower()
    return normalized.startswith("chapter ") or normalized.startswith("part ") or normalized.startswith("book ")


def fetch_series_episodes(url: str) -> list[list[dict[str, str]]]:
    response = requests.get(url, headers=HEADERS, timeout=60)
    response.raise_for_status()
    tables = [flatten_columns(df) for df in pd.read_html(StringIO(response.text))]
    season_tables = [df for df in tables if "Title" in df.columns and any("no. in season" in col.lower() for col in df.columns)]

    seasons = []
    for df in season_tables:
        title_col = pick_column(df.columns.tolist(), "title")
        season_col = pick_column(df.columns.tolist(), "no. in season")
        overall_col = pick_column(df.columns.tolist(), "no. overall")
        date_col = pick_column(df.columns.tolist(), "original u.s. release date", "original release date")
        prod_col = pick_column(df.columns.tolist(), "prod. code")
        stardate_col = pick_column(df.columns.tolist(), "stardate", "date")

        episodes = []
        for index, row in df.iterrows():
            display_number = clean_text(row.get(season_col, ""))
            title = clean_text(row.get(title_col, ""))

            if not title or title.lower() == "title" or not re.search(r"\d", display_number):
                continue
            if is_section_row(display_number, title):
                continue

            episodes.append({
                "displayNumber": display_number or str(index + 1),
                "overallNumber": clean_text(row.get(overall_col, "")),
                "title": title,
                "date": clean_text(row.get(date_col, "")),
                "productionCode": clean_text(row.get(prod_col, "")),
                "stardate": clean_text(row.get(stardate_col, "")) if stardate_col and stardate_col != date_col else "",
            })

        seasons.append(episodes)

    return seasons


def main() -> None:
    payload = {}
    for slug, url in SERIES_PAGES.items():
        payload[slug] = fetch_series_episodes(url)

    payload["star-trek-starfleet-academy"] = [[]]

    OUTPUT.write_text(
        "export var SERIES_EPISODE_DETAILS = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Saved {OUTPUT}")


if __name__ == "__main__":
    main()
