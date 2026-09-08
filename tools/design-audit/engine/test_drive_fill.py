"""Contract tests for the wizard filler's embedded JavaScript.

Two defects live here that no browser reports and no screenshot shows, so they are asserted
in Python instead: a mangled escape (the JS is a raw string, and stops working silently if
that `r` is ever dropped) and the value table the JS reads by name.
"""

from drive import DEFAULT_VALUES, FILL_ALL_JS


def test_word_boundaries_reach_the_browser_intact():
    # Without the r prefix Python turns every \b into \x08 before the browser sees it, so the
    # regex word boundaries never match. AVYAY's step 4 blocked on exactly that for four runs.
    assert "\x08" not in FILL_ALL_JS
    assert r"\b(?:number of|" in FILL_ALL_JS


def test_every_value_the_javascript_reads_is_defined():
    for key in sorted(set(re_keys())):
        assert key in DEFAULT_VALUES, f"FILL_ALL_JS reads F.{key}, which DEFAULT_VALUES lacks"


def re_keys():
    import re

    return re.findall(r"\bF\.([A-Za-z_][A-Za-z0-9_]*)", FILL_ALL_JS)


def test_the_end_of_a_date_span_falls_after_its_start():
    # NAPDDR's step 2 needs "Registration valid up to" to be after "Date of Registration".
    assert DEFAULT_VALUES["dateLater"] > DEFAULT_VALUES["date"]
