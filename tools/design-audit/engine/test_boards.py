#!/usr/bin/env python3
"""The crop cases that produced bad markers before the arithmetic was shared."""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import boards as B


class Band(unittest.TestCase):
    def test_a_footer_anchor_grows_the_crop_upwards(self):
        # the failure: an anchor 20px from the bottom left a 150px band, too short for its pin
        y0, y1 = B.band(1000, [[0, 960, 10, 20]])
        self.assertEqual(1000, y1)
        self.assertGreaterEqual(y1 - y0, B.MIN_CROP)

    def test_a_masthead_anchor_starts_at_zero(self):
        y0, y1 = B.band(1000, [[0, 10, 10, 20]])
        self.assertEqual(0, y0)

    def test_several_anchors_share_one_band(self):
        y0, y1 = B.band(2000, [[0, 300, 10, 20], [0, 900, 10, 20]])
        self.assertLessEqual(y0, 300)
        self.assertGreaterEqual(y1, 920)


class Pins(unittest.TestCase):
    def _spec(self, clip=400, img=1000, y=200):
        return {"dPins": [[100, y]], "bPins": [[100, y]], "dClipH": clip, "bClipH": clip,
                "dOff": -100, "bOff": -100, "dImgH": img, "bImgH": img}

    def test_a_pin_in_the_middle_passes(self):
        self.assertEqual([], B.check_pins(self._spec()))

    def test_a_pin_outside_the_crop_fails(self):
        self.assertTrue(B.check_pins(self._spec(y=500)))

    def test_a_pin_hugging_an_inside_edge_fails(self):
        self.assertTrue(B.check_pins(self._spec(y=6)))

    def test_a_pin_at_the_true_top_of_the_page_is_allowed(self):
        s = self._spec(y=6)
        s["dOff"] = s["bOff"] = 0            # the crop starts at the top of the image
        self.assertEqual([], B.check_pins(s))


if __name__ == "__main__":
    unittest.main(verbosity=2)
