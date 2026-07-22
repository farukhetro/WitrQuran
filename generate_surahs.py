import json

slugs = [
    "al-fatihah", "al-baqarah", "ali-imran", "an-nisa", "al-maidah", "al-anam", "al-araf", "al-anfal", "at-tawbah", "yunus",
    "hud", "yusuf", "ar-rad", "ibrahim", "al-hijr", "an-nahl", "al-isra", "al-kahf", "maryam", "ta-ha",
    "al-anbiya", "al-hajj", "al-muminun", "an-nur", "al-furqan", "ash-shuara", "an-naml", "al-qasas", "al-ankabut", "ar-rum",
    "luqman", "as-sajdah", "al-ahzab", "saba", "fatir", "ya-sin", "as-saffat", "sad", "az-zumar", "ghafir",
    "fussilat", "ash-shura", "az-zukhruf", "ad-dukhan", "al-jathiyah", "al-ahqaf", "muhammad", "al-fath", "al-hujurat", "qaf",
    "adh-dhariyat", "at-tur", "an-najm", "al-qamar", "ar-rahman", "al-waqiah", "al-hadid", "al-mujadilah", "al-hashr", "al-mumtahanah",
    "as-saff", "al-jumuah", "al-munafiqun", "at-taghabun", "at-talaq", "at-tahrim", "al-mulk", "al-qalam", "al-haqqah", "al-maarij",
    "nuh", "al-jinn", "al-muzzammil", "al-muddaththir", "al-qiyamah", "al-insan", "al-mursalat", "an-naba", "an-naziat", "abasa",
    "at-takwir", "al-infitar", "al-mutaffifin", "al-inshiqaq", "al-buruj", "at-tariq", "al-ala", "al-ghashiyah", "al-fajr", "al-balad",
    "ash-shams", "al-layl", "ad-duha", "ash-sharh", "at-tin", "al-alaq", "al-qadr", "al-bayyinah", "az-zalzalah", "al-adiyat",
    "al-qariah", "at-takathur", "al-asr", "al-humazah", "al-fil", "quraysh", "al-maun", "al-kawthar", "al-kafirun", "an-nasr",
    "al-masad", "al-ikhlas", "al-falaq", "an-nas"
]

surahs = []
for i, slug in enumerate(slugs):
    # Format name nicely for the dummy data
    name = slug.replace('-', ' ').title()
    surahs.append({
        "id": i + 1,
        "slug": slug,
        "arabicName": f"سورة {name}",
        "englishName": name,
        "transliteration": name,
        "revelationType": "Meccan" if i % 2 == 0 else "Medinan",
        "totalAyahs": (114 - i) + 3
    })

import os
os.makedirs("src/data", exist_ok=True)
with open("src/data/surahs.json", "w", encoding="utf-8") as f:
    json.dump(surahs, f, indent=2, ensure_ascii=False)

print("Generated src/data/surahs.json")
