"""The field inventory records what a control CONTAINS, and never a password.

Run:  cd tools/design-audit && python3 -m unittest engine.test_extract_values -v
      (stdlib only — the extractor is JS, so these assert its source contract)

Why this exists: the inventory recorded a field's name, label, type and options and stopped
there, so every capture reported no value whether the control was filled or empty. On
2026-09-07 that gap produced a confident wrong diagnosis — AVYAY's Justification step was
read as "three empty mandatory fields" from a key the extractor never wrote — and an engine
"fix" built on it regressed a different scheme's walk. A capture that cannot distinguish a
completed step from a blank one is not evidence.
"""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import capture as C


class FieldInventoryContract(unittest.TestCase):
    def test_records_a_value(self):
        # The key whose absence caused the misdiagnosis.
        self.assertIn("value: valueOf(el)", C.EXTRACT_JS)

    def test_records_browser_validity_and_its_message(self):
        # `validationMessage` was declared and hard-coded to null since the inventory was
        # written. It is the one field that answers "why will this step not advance".
        self.assertIn("validationMessage: el.validationMessage || null", C.EXTRACT_JS)
        self.assertIn("el.checkValidity()", C.EXTRACT_JS)
        self.assertNotIn("validationMessage: null", C.EXTRACT_JS)

    def test_a_password_is_never_recorded(self):
        # Only WHETHER something was typed, never what. Verified live against
        # eanudaan-user-uat on 2026-09-07: the secret appeared nowhere in the payload.
        self.assertIn("if (el.type === 'password') return el.value ? '[redacted]' : '';",
                      C.EXTRACT_JS)

    def test_a_checkbox_or_radio_reports_its_checked_state_not_its_value_attribute(self):
        # A radio's `value` is its option id and is the same whether or not it is chosen;
        # `checked` is the answer the applicant actually gave.
        self.assertIn("if (el.type === 'checkbox' || el.type === 'radio') return el.checked;",
                      C.EXTRACT_JS)

    def test_a_select_reports_the_option_a_reader_would_see(self):
        # The option TEXT, not the machine value — a capture is read by people.
        self.assertIn("el.selectedOptions", C.EXTRACT_JS)

    def test_values_are_truncated(self):
        # A capture is evidence, not a copy of the applicant's answers.
        self.assertIn("String(el.value ?? '').slice(0, 200)", C.EXTRACT_JS)


if __name__ == "__main__":
    unittest.main()
