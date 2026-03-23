from __future__ import annotations

import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
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

TVMAZE_SHOW_IDS = {
    "star-trek-the-original-series": 490,
    "star-trek-the-animated-series": 3513,
    "star-trek-the-next-generation": 491,
    "star-trek-deep-space-nine": 493,
    "star-trek-voyager": 492,
    "star-trek-enterprise": 714,
    "star-trek-discovery": 7480,
    "star-trek-short-treks": 39744,
    "star-trek-picard": 42193,
    "star-trek-lower-decks": 39323,
    "star-trek-prodigy": 49333,
    "star-trek-strange-new-worlds": 48090,
    "star-trek-starfleet-academy": 60302,
}

HEADERS = {"User-Agent": "Mozilla/5.0 Codex Episode Importer"}
ROOT = Path(__file__).resolve().parents[1]
EPISODE_OUTPUT = ROOT / "series-episode-data.js"
CAST_OUTPUT = ROOT / "series-cast-data.js"
SESSION = requests.Session()
SESSION.headers.update(HEADERS)


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


def clean_html_text(value: object) -> str:
    text = unescape(str(value or ""))
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    text = re.sub(r"\s+", " ", text)
    return text.strip()


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
    response = SESSION.get(url, timeout=60)
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
                "synopsis": "",
                "guestCast": [],
            })

        seasons.append(episodes)

    return seasons


def fetch_json(url: str) -> object:
    response = SESSION.get(url, timeout=60)
    response.raise_for_status()
    return response.json()


def format_credit(entry: dict[str, object]) -> str:
    person = (entry.get("person") or {}).get("name", "")
    character = (entry.get("character") or {}).get("name", "")
    person_text = clean_html_text(person)
    character_text = clean_html_text(character)
    if person_text and character_text:
        return f"{person_text} como {character_text}"
    return person_text or character_text


def fetch_guest_cast(episode_id: int) -> list[str]:
    try:
        guest_entries = fetch_json(f"https://api.tvmaze.com/episodes/{episode_id}/guestcast")
    except Exception:
        return []

    credits = []
    seen = set()
    for entry in guest_entries:
        label = format_credit(entry)
        if label and label not in seen:
            credits.append(label)
            seen.add(label)
    return credits


def fetch_tvmaze_payload(show_id: int) -> tuple[list[str], dict[tuple[int, int], dict[str, object]]]:
    regular_entries = fetch_json(f"https://api.tvmaze.com/shows/{show_id}/cast")
    regular_cast = []
    regular_seen = set()
    for entry in regular_entries:
        label = format_credit(entry)
        if label and label not in regular_seen:
            regular_cast.append(label)
            regular_seen.add(label)

    episodes = fetch_json(f"https://api.tvmaze.com/shows/{show_id}/episodes")
    episode_map: dict[tuple[int, int], dict[str, object]] = {}
    episode_ids: dict[tuple[int, int], int] = {}
    for episode in episodes:
        season = int(episode.get("season") or 0)
        number = int(episode.get("number") or 0)
        if season < 1 or number < 1:
            continue
        episode_map[(season, number)] = {
            "summary": clean_html_text(episode.get("summary", "")),
            "airdate": clean_html_text(episode.get("airdate", "")),
            "runtime": clean_html_text(episode.get("runtime", "")),
            "image": ((episode.get("image") or {}).get("original") or (episode.get("image") or {}).get("medium") or ""),
            "guestCast": [],
        }
        episode_ids[(season, number)] = int(episode["id"])

    with ThreadPoolExecutor(max_workers=8) as executor:
        future_map = {executor.submit(fetch_guest_cast, episode_id): key for key, episode_id in episode_ids.items()}
        for future in as_completed(future_map):
            key = future_map[future]
            try:
                episode_map[key]["guestCast"] = future.result()
            except Exception:
                episode_map[key]["guestCast"] = []

    return regular_cast, episode_map


def enrich_with_tvmaze(slug: str, seasons: list[list[dict[str, object]]]) -> tuple[list[list[dict[str, object]]], list[str]]:
    show_id = TVMAZE_SHOW_IDS.get(slug)
    if not show_id:
        return seasons, []

    regular_cast, episode_map = fetch_tvmaze_payload(show_id)

    for season_index, season in enumerate(seasons, start=1):
        for episode_index, episode in enumerate(season, start=1):
            tvmaze_entry = episode_map.get((season_index, episode_index))
            if not tvmaze_entry:
                continue
            if tvmaze_entry.get("summary"):
                episode["synopsis"] = tvmaze_entry["summary"]
            if tvmaze_entry.get("airdate"):
                episode["date"] = tvmaze_entry["airdate"]
            if tvmaze_entry.get("runtime"):
                episode["runtime"] = tvmaze_entry["runtime"]
            if tvmaze_entry.get("image"):
                episode["image"] = tvmaze_entry["image"]
            episode["guestCast"] = tvmaze_entry.get("guestCast") or []

    return seasons, regular_cast


def main() -> None:
    payload = {}
    cast_payload = {}

    for slug, url in SERIES_PAGES.items():
        print(f"Importing {slug}...")
        seasons = fetch_series_episodes(url)
        seasons, regular_cast = enrich_with_tvmaze(slug, seasons)
        payload[slug] = seasons
        cast_payload[slug] = regular_cast

    payload["star-trek-starfleet-academy"] = [[]]
    cast_payload["star-trek-starfleet-academy"] = []

    EPISODE_OUTPUT.write_text(
        "export var SERIES_EPISODE_DETAILS = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    CAST_OUTPUT.write_text(
        "export var SERIES_CAST_DETAILS = " + json.dumps(cast_payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Saved {EPISODE_OUTPUT}")
    print(f"Saved {CAST_OUTPUT}")


if __name__ == "__main__":
    main()
