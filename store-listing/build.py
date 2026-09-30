# -*- coding: utf-8 -*-
"""Generate paste-ready store listing files from master.py.

Run: python3 build.py  -> writes out/<lang>.md, checks field limits,
CTA presence per locale, script sanity, and manifest.json validity.
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import master  # noqa: E402

OUT = HERE / "out"
MANIFEST = HERE.parent / "manifest.json"

LIMIT_TITLE = 45   # safe bound; exact CWS title limit unverified (search unavailable)
LIMIT_SHORT = 132  # confirmed: developer.chrome.com/docs/webstore/best-listing

CTA = {
    "en": "Add OneClick Snooze to Chrome",
    "ru": "Добавьте OneClick Snooze в Chrome",
    "de": "OneClick Snooze zu Chrome hinzufügen",
    "es": "Añade OneClick Snooze a Chrome",
    "zh": "把 OneClick Snooze 添加到 Chrome",
    "uk": "Додайте OneClick Snooze до Chrome",
    "fr": "Ajoutez OneClick Snooze à Chrome",
    "pt": "Adicione o OneClick Snooze ao Chrome",
    "it": "Aggiungi OneClick Snooze a Chrome",
    "pl": "Dodaj OneClick Snooze do Chrome",
    "tr": "OneClick Snooze'u Chrome'a ekle",
    "ja": "OneClick Snooze を Chrome に追加",
    "tw": "把 OneClick Snooze 加入 Chrome",
    "ko": "OneClick Snooze를 Chrome에 추가",
    "nl": "Voeg OneClick Snooze toe aan Chrome",
    "vi": "Thêm OneClick Snooze vào Chrome",
    "id": "Tambahkan OneClick Snooze ke Chrome",
}
# light script sanity: marker that must appear in that locale's long text
SCRIPT = {
    "en": None, "ru": "\u0430", "de": "\u00df", "es": "\u00f1", "zh": "\u4e2d",
    "uk": "\u0456", "fr": "\u00e9", "pt": "\u00e7", "it": "\u00e0", "pl": "\u0119",
    "tr": "\u0131", "ja": "\u306e", "tw": "\u7684", "ko": "\uc744", "nl": "ij",
    "vi": "\u01b0", "id": None,
}


def main():
    errors = []
    for lang in master.TITLES:
        title, short, long_ = master.TITLES[lang], master.SHORTS[lang], master.LONGS[lang]
        if len(title) > LIMIT_TITLE:
            errors.append(f"{lang}: title {len(title)} > {LIMIT_TITLE}")
        if len(short) > LIMIT_SHORT:
            errors.append(f"{lang}: short {len(short)} > {LIMIT_SHORT}")
        if CTA[lang] not in long_:
            errors.append(f"{lang}: CTA phrase missing from long description")
        marker = SCRIPT[lang]
        if marker and marker not in long_:
            errors.append(f"{lang}: expected script marker {marker!r} missing")
        if "Chrome" not in long_:
            errors.append(f"{lang}: 'Chrome' missing from long description")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if not manifest.get("description"):
        errors.append("manifest.json: empty description")
    if errors:
        raise SystemExit("FAIL:\n" + "\n".join(errors))

    OUT.mkdir(exist_ok=True)
    for lang in master.TITLES:
        (OUT / f"{lang}.md").write_text(
            f"# Title ({len(master.TITLES[lang])} chars)\n{master.TITLES[lang]}\n\n"
            f"# Short description ({len(master.SHORTS[lang])} chars)\n{master.SHORTS[lang]}\n\n"
            f"# Long description\n{master.LONGS[lang]}\n",
            encoding="utf-8",
        )
        print(
            f"{lang}: title={len(master.TITLES[lang])} "
            f"short={len(master.SHORTS[lang])} long={len(master.LONGS[lang])} -> out/{lang}.md"
        )
    print(f"OK: {len(master.TITLES)} locales, limits, CTA presence, script markers, manifest JSON valid")


if __name__ == "__main__":
    main()
