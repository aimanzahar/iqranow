import re
from difflib import SequenceMatcher
from typing import Dict, List, Tuple


ARABIC_DIACRITICS_PATTERN = re.compile(
    r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]"
)


def strip_diacritics(text: str) -> str:
    if not text:
        return ""
    return re.sub(ARABIC_DIACRITICS_PATTERN, "", text)


def normalize_arabic(text: str) -> str:
    if not text:
        return ""
    text = strip_diacritics(text)
    # Normalize common variations (alef forms, taa marbuta, etc.)
    replacements = {
        "أ": "ا",
        "إ": "ا",
        "آ": "ا",
        "ى": "ي",
        "ؤ": "و",
        "ئ": "ي",
        "ة": "ه",
        "ٱ": "ا",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    # Remove punctuation and extra whitespace
    text = re.sub(r"[\u060C\u061B\u061F,;?!\.\-—\(\)\[\]\{\}\"']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def diff_text(expected: str, actual: str) -> List[Dict]:
    expected_norm = normalize_arabic(expected)
    actual_norm = normalize_arabic(actual)

    sm = SequenceMatcher(a=expected_norm, b=actual_norm)
    diffs = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        diffs.append({
            "op": tag,  # equal, replace, delete, insert
            "expected": expected_norm[i1:i2],
            "actual": actual_norm[j1:j2],
            "i1": i1,
            "i2": i2,
            "j1": j1,
            "j2": j2,
        })
    return diffs


def compute_score(expected: str, actual: str) -> float:
    expected_norm = normalize_arabic(expected)
    actual_norm = normalize_arabic(actual)
    if not expected_norm:
        return 0.0
    ratio = SequenceMatcher(a=expected_norm, b=actual_norm).ratio()
    return round(ratio * 100.0, 2)


def basic_tajweed_flags(expected: str, actual: str) -> List[str]:
    flags: List[str] = []
    en = strip_diacritics(expected)
    an = strip_diacritics(actual)

    # Very coarse heuristics as placeholders for Tajweed feedback
    # These are not authoritative; real implementation requires linguistic analysis

    # Madd (elongation) placeholders: presence of madd letters ا و ي after certain harakat
    if "ا" in en and "ا" not in an:
        flags.append("Possible missing madd on 'ا' (elongation)")
    if "و" in en and "و" not in an:
        flags.append("Possible missing madd on 'و' (elongation)")
    if "ي" in en and "ي" not in an:
        flags.append("Possible missing madd on 'ي' (elongation)")

    # Qalqalah letters: ق ط ب ج د - naive presence check
    qalqalah_letters = set("قطبجد")
    if any(letter in en for letter in qalqalah_letters) and not any(letter in an for letter in qalqalah_letters):
        flags.append("Possible weak qalqalah articulation")

    # Noon sakinah/tanween assimilation placeholders
    if "ن" in en and "ن" not in an:
        flags.append("Check noon sakinah/ikhfa' application")

    return flags


def score_recitation(expected: str, actual: str) -> Dict:
    return {
        "score": compute_score(expected, actual),
        "diffs": diff_text(expected, actual),
        "tajweedFlags": basic_tajweed_flags(expected, actual),
    }
