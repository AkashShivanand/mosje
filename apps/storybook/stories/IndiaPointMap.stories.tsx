import type { Meta, StoryObj } from "@storybook/react";
import { IndiaPointMap, type HexBin, type MapPin, type MapBubble } from "@mosje/design-system";

/**
 * **IndiaPointMap** — real coordinates on the national outline, at whichever
 * grain the data can honestly support.
 *
 * Reach for it when the data is a list of **places**, not a per-state figure.
 * `IndiaMap` shades a state and `IndiaBubbleMap` puts a circle at its centroid;
 * both answer "how much per state", and both discard coordinates. This one
 * keeps them, which matters whenever *where* is the question — PM-AJAY's 19,768
 * Adarsh Gram villages are a belt across West Bengal, Bihar and north Tamil
 * Nadu, and no per-state mark can show that.
 *
 * **Three marks, because density and identity are different questions.**
 *
 * - `bins` — a hex density field, for points too many to tell apart. What would
 *   ruin the answer here is overplotting, not resolution.
 * - `bubbles` — proportional circles at named units, for a zoomed grain where
 *   the reader wants to know *which* district. Pass `bubbleVariant="outlined"`
 *   when a density field is already drawn underneath, so the two layers do not
 *   both encode the same quantity in ink.
 * - `pins` — one mark per record, categorical by `kind`, when the records are
 *   few enough to be individuals.
 *
 * Combining them is normal: the `Everything` story draws 19,348 villages as
 * density and 200 hostels as pins, because those are different kinds of thing
 * and one mark flatters neither.
 *
 * **Cost.** ~1,000 hexes render as ten `<path>` elements — one per colour
 * bucket — and the cursor is resolved against the lattice arithmetically, so
 * hovering names a cell without anything being hit-tested. A hex is
 * deliberately **not** keyboard-reachable: a density cell has no identity to
 * land on, and tabbing through a thousand would be hostile. Pass `table` so the
 * named rows reach a screen reader, which is what a keyboard user wants.
 *
 * **Scale.** Cell counts here run 1 → 387, so the ramp is `log1p`; on a linear
 * ramp 95% of the map would be the palest step. Print the real counts in your
 * own legend — the component will not guess what a shade should mean.
 *
 * **`interactivePins` is the same judgement one scale up.** A pin is worth a
 * keyboard stop when a reader could plausibly be hunting for that particular
 * one. PM-AJAY's 200 hostels are individuals once the map is framed on a state;
 * across the whole country they are 200 indistinguishable dots, and leaving
 * them focusable puts 195 stops between the heading and the ranked list that is
 * the actual route to any of them. Switch it off at national grain — the pins
 * still answer the pointer and the `table` still carries the named rows.
 *
 * **Bin where the coordinates are.** `binIndiaPoints()` is exported for the
 * server or a build script, so a page ships ~1,000 cells instead of 19,768
 * latitudes. It must use the same `hexRadius` the map renders.
 *
 * **`valueFormat` is usually the wrong prop to touch.** It defaults to
 * `formatIndian`, which groups in lakhs and crores — the convention every other
 * figure on these properties uses. Override it only for a unit that genuinely
 * is not a count (a currency, a percentage); passing a Western grouping to make
 * a map match a foreign mock is how one page ends up disagreeing with the rest
 * of the estate about what 19,768 looks like.
 *
 * Data below is the department's own `map-points` feed, mirrored 31 August 2026.
 *
 * Lifecycle: **New**.
 */

/** [q, r, count] — PM-AJAY Adarsh Gram villages, binned at the default radius. */
const BINS: [number, number, number][] = [
  [-4,61,1],[-3,59,1],[1,38,1],[1,46,1],[2,69,2],[3,33,1],[3,34,1],[3,35,1],
  [3,37,1],[3,38,1],[3,39,2],[3,40,1],[3,55,2],[3,56,2],[3,57,1],[3,58,7],
  [3,60,2],[3,62,3],[3,67,3],[3,68,17],[3,69,1],[4,34,1],[4,36,1],[4,37,1],
  [4,39,1],[4,40,1],[4,49,1],[4,54,1],[4,55,1],[4,56,11],[4,57,12],[4,58,30],
  [4,59,19],[4,60,18],[4,61,1],[4,62,5],[4,63,6],[4,64,14],[4,65,6],[4,67,22],
  [4,68,18],[5,29,1],[5,36,1],[5,37,1],[5,38,1],[5,40,1],[5,46,2],[5,47,1],
  [5,48,1],[5,52,2],[5,53,3],[5,54,29],[5,55,50],[5,56,54],[5,57,18],[5,58,31],
  [5,59,19],[5,60,17],[5,61,17],[5,62,6],[5,63,9],[5,64,11],[5,65,19],[5,66,6],
  [5,67,5],[6,36,1],[6,39,1],[6,44,2],[6,50,3],[6,52,1],[6,53,2],[6,54,15],
  [6,55,46],[6,56,31],[6,57,6],[6,58,12],[6,59,6],[6,60,36],[6,61,4],[6,62,5],
  [6,63,4],[6,64,7],[6,65,1],[6,66,19],[6,67,1],[7,36,1],[7,44,1],[7,45,2],
  [7,46,1],[7,51,17],[7,52,2],[7,53,13],[7,54,19],[7,55,13],[7,56,10],[7,57,25],
  [7,58,25],[7,59,42],[7,60,6],[7,61,7],[7,62,15],[7,63,12],[7,64,10],[7,65,5],
  [8,30,1],[8,35,2],[8,36,2],[8,39,2],[8,47,1],[8,50,3],[8,51,14],[8,52,22],
  [8,53,25],[8,54,7],[8,55,6],[8,56,10],[8,57,32],[8,58,56],[8,59,9],[8,60,18],
  [8,61,25],[8,62,22],[8,63,50],[8,64,26],[9,27,1],[9,28,6],[9,29,9],[9,30,4],
  [9,31,15],[9,35,1],[9,36,3],[9,48,1],[9,50,14],[9,51,3],[9,52,7],[9,53,8],
  [9,54,2],[9,55,1],[9,56,12],[9,57,55],[9,58,69],[9,59,23],[9,60,47],[9,61,137],
  [9,62,112],[9,63,217],[9,64,48],[10,26,4],[10,27,3],[10,28,7],[10,29,7],[10,30,16],
  [10,31,12],[10,35,1],[10,43,2],[10,46,1],[10,48,2],[10,49,7],[10,50,26],[10,51,2],
  [10,52,6],[10,53,1],[10,54,5],[10,56,5],[10,57,7],[10,58,30],[10,59,25],[10,60,60],
  [10,61,125],[10,62,118],[10,63,12],[11,25,4],[11,26,2],[11,27,5],[11,28,15],[11,29,8],
  [11,30,3],[11,31,13],[11,32,1],[11,34,1],[11,41,1],[11,42,2],[11,43,3],[11,46,1],
  [11,47,1],[11,48,15],[11,49,8],[11,50,15],[11,51,4],[11,52,4],[11,53,1],[11,54,2],
  [11,55,4],[11,56,1],[11,57,7],[11,58,48],[11,59,140],[11,60,112],[12,24,3],[12,25,1],
  [12,26,1],[12,27,7],[12,28,3],[12,29,5],[12,30,1],[12,31,15],[12,33,4],[12,34,2],
  [12,36,3],[12,37,1],[12,41,2],[12,45,2],[12,46,2],[12,47,11],[12,48,27],[12,49,12],
  [12,50,3],[12,51,3],[12,52,3],[12,53,14],[12,54,8],[12,55,11],[12,56,5],[12,57,37],
  [12,58,96],[12,59,178],[12,60,1],[13,21,1],[13,23,1],[13,24,1],[13,25,1],[13,26,8],
  [13,27,13],[13,28,2],[13,29,3],[13,30,2],[13,34,3],[13,35,1],[13,41,1],[13,42,6],
  [13,43,3],[13,44,3],[13,45,2],[13,46,23],[13,47,12],[13,48,16],[13,49,4],[13,50,3],
  [13,51,4],[13,52,2],[13,53,6],[13,54,3],[13,55,10],[13,56,61],[13,57,69],[13,58,46],
  [14,16,1],[14,24,2],[14,25,6],[14,26,12],[14,27,8],[14,28,3],[14,30,2],[14,31,1],
  [14,35,1],[14,36,1],[14,37,3],[14,39,2],[14,40,8],[14,41,13],[14,42,7],[14,43,4],
  [14,44,7],[14,45,11],[14,46,2],[14,47,4],[14,48,9],[14,49,2],[14,50,3],[14,52,13],
  [14,53,13],[14,54,4],[14,55,11],[14,56,10],[15,22,4],[15,23,3],[15,24,3],[15,25,6],
  [15,27,6],[15,28,7],[15,29,5],[15,30,5],[15,31,5],[15,32,6],[15,33,1],[15,34,10],
  [15,35,9],[15,36,3],[15,37,4],[15,39,5],[15,40,15],[15,41,6],[15,42,3],[15,43,6],
  [15,44,7],[15,45,8],[15,46,4],[15,47,2],[15,48,2],[15,49,1],[15,50,1],[15,51,2],
  [15,52,24],[15,53,19],[16,17,1],[16,21,3],[16,22,2],[16,23,5],[16,24,7],[16,25,4],
  [16,26,4],[16,27,3],[16,28,3],[16,29,3],[16,30,11],[16,31,6],[16,32,4],[16,33,8],
  [16,34,22],[16,35,23],[16,36,3],[16,37,1],[16,39,2],[16,40,15],[16,41,10],[16,42,6],
  [16,43,7],[16,44,4],[16,46,2],[16,47,2],[16,48,1],[16,49,2],[16,51,13],[16,52,11],
  [16,53,1],[17,15,1],[17,21,15],[17,22,1],[17,23,4],[17,24,8],[17,25,6],[17,26,5],
  [17,27,3],[17,28,5],[17,29,13],[17,30,3],[17,31,1],[17,32,6],[17,33,12],[17,34,22],
  [17,35,6],[17,36,2],[17,37,1],[17,39,10],[17,40,6],[17,41,10],[17,42,2],[17,43,1],
  [17,44,3],[17,45,5],[17,47,3],[17,48,2],[17,49,15],[17,50,55],[17,51,37],[17,52,4],
  [18,18,2],[18,20,23],[18,23,5],[18,24,12],[18,25,14],[18,26,2],[18,27,3],[18,28,5],
  [18,29,12],[18,30,1],[18,31,15],[18,33,3],[18,34,3],[18,35,2],[18,36,3],[18,38,3],
  [18,39,5],[18,40,2],[18,41,2],[18,42,1],[18,43,6],[18,44,4],[18,45,22],[18,46,2],
  [18,48,1],[18,49,22],[18,50,52],[18,51,31],[19,17,1],[19,18,1],[19,19,46],[19,20,23],
  [19,22,8],[19,23,12],[19,24,5],[19,25,9],[19,26,7],[19,27,16],[19,28,15],[19,29,24],
  [19,30,10],[19,31,8],[19,32,1],[19,33,4],[19,34,1],[19,36,5],[19,37,1],[19,38,3],
  [19,39,4],[19,41,1],[19,42,3],[19,43,5],[19,44,11],[19,45,22],[19,46,2],[19,47,1],
  [19,48,3],[19,49,29],[19,50,16],[20,18,50],[20,19,26],[20,20,5],[20,21,4],[20,22,5],
  [20,23,4],[20,24,11],[20,25,6],[20,26,20],[20,27,32],[20,28,16],[20,29,10],[20,30,17],
  [20,31,2],[20,33,1],[20,34,3],[20,35,2],[20,36,2],[20,37,2],[20,38,2],[20,39,1],
  [20,40,3],[20,41,5],[20,42,6],[20,43,4],[20,44,1],[20,45,1],[20,47,3],[20,48,1],
  [20,49,17],[20,50,38],[21,17,8],[21,18,35],[21,19,32],[21,20,19],[21,21,11],[21,22,3],
  [21,23,8],[21,24,3],[21,25,7],[21,26,27],[21,27,9],[21,28,18],[21,30,3],[21,31,3],
  [21,34,2],[21,35,5],[21,36,1],[21,37,7],[21,38,2],[21,39,1],[21,40,4],[21,41,2],
  [21,47,3],[21,49,18],[21,50,5],[22,9,1],[22,16,20],[22,17,5],[22,18,25],[22,19,13],
  [22,20,5],[22,21,11],[22,22,4],[22,23,1],[22,24,4],[22,25,29],[22,26,13],[22,27,9],
  [22,29,4],[22,30,4],[22,31,4],[22,32,1],[22,33,1],[22,35,4],[22,36,5],[22,37,3],
  [22,39,3],[22,40,7],[22,43,1],[22,46,12],[22,48,1],[23,11,1],[23,15,5],[23,16,3],
  [23,17,2],[23,18,2],[23,19,20],[23,20,8],[23,21,6],[23,22,2],[23,23,14],[23,24,34],
  [23,25,51],[23,26,43],[23,27,3],[23,28,1],[23,31,1],[23,33,2],[23,34,1],[23,35,1],
  [23,36,1],[23,38,1],[23,39,4],[23,40,3],[23,42,1],[23,45,2],[24,14,7],[24,16,1],
  [24,17,3],[24,18,33],[24,19,12],[24,20,4],[24,21,11],[24,22,4],[24,23,16],[24,24,16],
  [24,25,48],[24,26,44],[24,27,1],[24,28,3],[24,29,8],[24,30,6],[24,31,5],[24,32,10],
  [24,33,5],[24,34,1],[24,35,1],[24,36,1],[24,39,11],[24,40,13],[24,42,4],[24,43,3],
  [24,44,2],[24,45,3],[24,47,1],[25,13,2],[25,14,20],[25,15,8],[25,16,2],[25,17,9],
  [25,18,3],[25,19,7],[25,20,2],[25,21,17],[25,22,17],[25,23,2],[25,24,11],[25,25,11],
  [25,26,14],[25,27,26],[25,28,8],[25,29,38],[25,30,17],[25,31,11],[25,32,6],[25,34,1],
  [25,35,3],[25,37,1],[25,38,3],[25,39,7],[25,40,10],[25,43,6],[25,44,14],[25,45,2],
  [25,46,1],[25,47,1],[26,9,3],[26,10,2],[26,11,3],[26,14,15],[26,15,5],[26,16,17],
  [26,17,10],[26,18,10],[26,19,12],[26,20,7],[26,21,268],[26,22,50],[26,23,26],[26,24,26],
  [26,25,2],[26,26,33],[26,27,9],[26,29,12],[26,30,12],[26,31,4],[26,32,4],[26,37,20],
  [26,38,5],[26,39,4],[26,40,5],[26,41,6],[26,42,14],[26,43,17],[26,44,1],[26,45,6],
  [26,46,9],[26,47,1],[27,7,1],[27,9,3],[27,10,7],[27,11,22],[27,12,30],[27,13,6],
  [27,14,5],[27,15,2],[27,16,8],[27,17,33],[27,18,13],[27,19,30],[27,20,16],[27,21,16],
  [27,22,16],[27,23,22],[27,24,11],[27,25,10],[27,26,6],[27,27,12],[27,28,1],[27,29,18],
  [27,30,11],[27,31,5],[27,34,1],[27,35,1],[27,36,2],[27,37,66],[27,38,23],[27,40,1],
  [27,42,14],[27,43,2],[27,44,1],[27,45,1],[28,7,3],[28,9,1],[28,10,1],[28,11,5],
  [28,12,2],[28,13,7],[28,14,14],[28,15,7],[28,16,9],[28,17,26],[28,18,6],[28,19,30],
  [28,20,10],[28,21,7],[28,22,2],[28,23,3],[28,24,24],[28,25,21],[28,26,23],[28,27,29],
  [28,28,3],[28,29,2],[28,30,28],[28,33,4],[28,34,1],[28,35,1],[28,36,1],[28,37,8],
  [28,38,8],[28,40,3],[28,41,6],[28,43,2],[28,44,10],[28,51,1],[29,9,1],[29,10,3],
  [29,11,2],[29,12,2],[29,13,18],[29,14,12],[29,15,2],[29,16,3],[29,17,5],[29,18,6],
  [29,19,1],[29,20,8],[29,21,63],[29,22,21],[29,23,4],[29,24,10],[29,25,39],[29,26,39],
  [29,27,30],[29,28,6],[29,29,19],[29,30,30],[29,33,1],[29,35,1],[29,37,3],[29,38,3],
  [29,39,3],[29,40,10],[29,41,1],[29,42,5],[29,43,49],[29,44,19],[30,7,1],[30,12,9],
  [30,13,2],[30,14,13],[30,15,2],[30,16,9],[30,18,1],[30,19,12],[30,20,16],[30,21,30],
  [30,22,24],[30,23,3],[30,24,2],[30,25,6],[30,26,62],[30,27,30],[30,28,19],[30,29,36],
  [30,30,34],[30,31,9],[30,32,1],[30,34,1],[30,35,2],[30,36,4],[30,38,2],[30,39,7],
  [30,40,4],[30,41,3],[30,42,11],[30,43,26],[31,12,1],[31,13,1],[31,14,1],[31,15,2],
  [31,17,3],[31,18,9],[31,19,22],[31,20,1],[31,21,35],[31,22,13],[31,23,24],[31,24,15],
  [31,25,17],[31,26,10],[31,27,23],[31,28,20],[31,29,75],[31,30,34],[31,31,10],[31,34,2],
  [31,37,1],[31,38,1],[31,39,2],[31,41,6],[31,42,22],[31,43,5],[32,11,1],[32,15,1],
  [32,18,16],[32,19,10],[32,21,6],[32,23,17],[32,24,4],[32,25,2],[32,27,11],[32,28,3],
  [32,29,3],[32,30,18],[32,31,3],[32,32,30],[32,35,3],[32,38,3],[32,40,8],[32,41,20],
  [32,42,63],[33,1,1],[33,16,1],[33,17,1],[33,18,7],[33,19,1],[33,22,2],[33,23,6],
  [33,24,5],[33,25,9],[33,26,73],[33,27,109],[33,28,11],[33,29,32],[33,30,89],[33,31,7],
  [33,32,31],[33,33,5],[33,40,25],[33,41,46],[33,42,8],[34,16,1],[34,24,1],[34,25,8],
  [34,26,50],[34,27,43],[34,28,62],[34,29,53],[34,30,136],[34,31,163],[34,32,66],[34,33,13],
  [34,34,3],[34,36,3],[34,37,2],[34,38,1],[34,39,20],[34,40,41],[34,41,5],[35,21,2],
  [35,22,2],[35,25,8],[35,26,15],[35,27,10],[35,28,21],[35,29,60],[35,30,93],[35,31,359],
  [35,32,8],[35,33,8],[35,34,1],[35,35,4],[35,36,1],[35,37,4],[35,38,11],[35,39,60],
  [35,40,1],[36,2,1],[36,24,1],[36,25,23],[36,26,16],[36,27,32],[36,28,23],[36,29,77],
  [36,30,192],[36,31,216],[36,32,6],[36,33,6],[36,34,5],[36,35,5],[36,36,8],[36,37,66],
  [36,38,96],[36,39,5],[36,42,1],[37,25,47],[37,26,29],[37,27,25],[37,28,62],[37,29,125],
  [37,30,154],[37,31,16],[37,32,26],[37,33,2],[37,34,74],[37,35,58],[37,36,102],[37,37,102],
  [37,38,57],[38,2,1],[38,24,5],[38,25,16],[38,26,17],[38,27,74],[38,28,115],[38,29,52],
  [38,30,49],[38,31,41],[38,32,8],[38,33,45],[38,34,174],[38,35,242],[38,36,222],[38,37,79],
  [38,38,78],[39,22,1],[39,26,15],[39,27,58],[39,28,54],[39,29,57],[39,30,52],[39,31,25],
  [39,32,1],[39,33,169],[39,34,211],[39,35,306],[39,36,195],[39,37,387],[39,38,1],[40,26,3],
  [40,27,35],[40,28,26],[40,29,4],[40,30,36],[40,32,92],[40,33,294],[40,34,179],[40,35,304],
  [40,36,209],[40,37,65],[41,21,3],[41,26,1],[41,27,20],[41,28,17],[41,29,19],[41,30,7],
  [41,31,48],[41,32,179],[41,33,39],[41,34,173],[41,35,115],[41,36,7],[42,26,3],[42,27,36],
  [42,28,40],[42,29,48],[42,30,128],[42,32,16],[43,27,20],[43,28,99],[43,29,323],[43,30,53],
  [44,26,107],[44,27,25],[44,29,73],[44,33,1],[45,25,1],[45,26,71],[45,27,104],[45,28,4],
  [45,42,1],[46,26,113],[46,27,293],[46,28,2],[46,32,31],[46,34,15],[46,35,1],[47,23,1],
  [47,24,1],[47,26,30],[47,27,29],[47,28,1],[47,33,2],[47,34,2],[48,22,2],[48,27,23],
  [48,28,2],[48,32,13],[49,20,1],[49,26,22],[49,27,7],[49,28,2],[49,30,1],[49,31,3],
  [49,32,3],[50,26,3],[50,27,12],[50,30,6],[50,31,23],[51,26,15],[51,27,16],[51,28,1],
  [51,30,1],[51,31,6],[51,32,1],[52,26,1],[52,27,13],[52,28,1],[52,31,2],[52,32,1],
  [53,26,9],[53,27,3],[53,31,1],[54,26,8],[55,-1,1],[55,25,7],[55,26,2],[55,27,1],
  [56,21,1],[56,25,7],[56,26,2],[57,24,1],[57,25,10],[58,24,7],[58,25,1],[59,24,4],
  [60,23,4],[64,5,2],[69,-2,1],
];

const VILLAGE_BINS: HexBin[] = BINS.map(([q, r, count]) => ({ q, r, count }));

/** [lon, lat, type, district] — every PM-AJAY hostel the feed could place. */
const HOSTELS: [number, number, number, string][] = [
  [76.9495,14.5444,0,"Anantapur"],[78.298116,13.602516,2,"Annamayya"],[78.7442,13.1912,1,"Chittoor"],
  [78.745,13.1935,0,"Chittoor"],[80.6417,16.1142,0,"Guntur"],[79.4287,16.4761,1,"Guntur"],
  [80.9168,16.2289,1,"Krishna"],[80.9704,16.3302,0,"Krishna"],[78.2707,15.8554,0,"Kurnool"],
  [78.0294,15.8345,1,"Kurnool"],[77.8066,15.7728,0,"Kurnool"],[78.5797,15.8806,1,"Kurnool"],
  [80.645,16.7575,0,"Ntr"],[80.7821,16.9442,1,"Ntr"],[80.0569,15.5025,1,"Prakasam"],
  [79.3047,16.0338,0,"Prakasam"],[79.8718,14.2077,0,"Spsr Nellore"],[79.3115,13.5916,1,"Tirupati"],
  [83.4368,17.8939,1,"Visakhapatanam"],[83.3101,17.7084,0,"Visakhapatanam"],[83.4268,18.7817,1,"Vizianagaram"],
  [83.145,18.1108,0,"Vizianagaram"],[83.3356,18.2878,1,"Vizianagaram"],[81.2333,16.7833,0,"West Godavari"],
  [78.94,15.1104,1,"Y.s.r."],[78.5621,14.755,0,"Y.s.r."],[91.574,26.6306,2,"Baksa"],
  [91.004,26.3304,2,"Barpeta"],[90.6266,26.1702,2,"Barpeta"],[93.1827,26.4919,1,"Biswanath"],
  [93.1827,26.4616,0,"Biswanath"],[90.7131,26.4759,2,"Bongaigaon"],[89.09,26.028,2,"Bongaigaon"],
  [92.7993,24.8305,1,"Cachar"],[90.6993,26.4914,2,"Chirang"],[92.025,26.4488,2,"Darrang"],
  [90.4507,26.29,2,"Dhubri"],[90.4234,26.1023,2,"Goalpara"],[94.0351,26.6047,2,"Golaghat"],
  [92.5643,24.6846,2,"Hailakandi"],[92.9553,25.9377,1,"Hojai"],[92.8488,25.999,0,"Hojai"],
  [91.7157,26.2027,2,"Kamrup"],[91.5954,26.1464,0,"Kamrup Metro"],[90.1944,25.4599,2,"Kamrup Metro"],
  [92.4653,24.5699,1,"Karimganj"],[92.4542,24.5831,2,"Karimganj"],[90.2944,26.4695,2,"Kokrajhar"],
  [94.0903,27.2304,2,"Lakhimpur"],[94.4568,27.3114,2,"Lakhimpur"],[93.844,27.0368,2,"Lakhimpur"],
  [94.0741,26.9499,2,"Majuli"],[94.1702,26.9533,2,"Majuli"],[92.2421,26.1228,2,"Marigaon"],
  [92.124,26.2298,2,"Marigaon"],[92.048,26.2549,2,"Marigaon"],[92.5126,26.2195,2,"Nagaon"],
  [91.4438,26.4363,2,"Nalbari"],[92.3342,26.6984,2,"Udalguri"],[82.5538,22.5977,2,"Korba"],
  [81.6917,22.2719,2,"Mungeli"],[75.7318,29.1736,0,"Hisar"],[76.6929,28.2432,1,"Rewari"],
  [76.5203,31.701,2,"Hamirpur"],[76.5203,31.701,2,"Hamirpur"],[77.4604,12.9776,2,"Bengaluru Urban"],
  [78.0886,13.7181,2,"Chikkaballapura"],[76.2686,13.8044,2,"Chitradurga"],[76.1934,14.367,2,"Chitradurga"],
  [76.3949,14.2264,1,"Chitradurga"],[76.335,14.5064,2,"Davangere"],[75.1306,15.3335,1,"Dharwad"],
  [77.9385,13.0039,2,"Kolar"],[76.3549,12.3107,2,"Mysuru"],[75.5608,13.9302,0,"Shivamogga"],
  [76.6633,13.1576,2,"Tumakuru"],[76.4491,13.2507,2,"Tumakuru"],[75.6794,16.8262,2,"Vijayapura"],
  [76.1305,16.33,2,"Vijayapura"],[75.9619,16.5744,2,"Vijayapura"],[76.1305,16.3301,2,"Vijayapura"],
  [75.0923,12.3931,2,"Kasaragod"],[76.8896,8.56508,2,"Thiruvananthapuram"],[76.0102,23.7103,2,"Agar Malwa"],
  [79.5812,24.9164,2,"Chhatarpur"],[76.0534,22.9676,2,"Dewas"],[75.9207,22.5204,1,"Indore"],
  [75.8107,22.6364,2,"Indore"],[77.0844,23.2032,2,"Sehore"],[76.0457,22.9741,2,"Ujjain"],
  [93.7765,24.5015,0,"Bishnupur"],[93.9225,24.8658,0,"Imphal East"],[93.9167,24.8332,2,"Imphal West"],
  [93.9167,24.8332,2,"Imphal West"],[93.9415,24.8213,0,"Imphal West"],[93.9377,24.8227,1,"Imphal West"],
  [93.9481,24.8063,2,"Jiribam"],[94.0055,24.516,2,"Thoubal"],[90.2563,20.2326,2,"East Garo Hills"],
  [90.6565,30.2212,2,"East Garo Hills"],[77.6545,30.6566,2,"East Garo Hills"],[89.6566,28.6526,2,"East Garo Hills"],
  [90.5657,28.6566,2,"East Garo Hills"],[93.4344,23.3722,0,"Aizawl"],[92.7264,23.6046,0,"Aizawl"],
  [92.4533,22.5435,0,"Lunglei"],[93.7681,25.8405,2,"Dimapur"],[94.1035,25.7075,2,"Dimapur"],
  [94.1035,25.7074,2,"Dimapur"],[93.7681,25.8405,2,"Dimapur"],[94.1055,25.6586,2,"Kohima"],
  [94.1055,25.6586,2,"Kohima"],[94.4375,26.4967,2,"Mokokchung"],[94.3148,26.1948,2,"Mokokchung"],
  [94.3148,26.1948,2,"Mokokchung"],[95.01,26.712,2,"Mon"],[95.0313,26.7254,2,"Mon"],
  [94.7979,26.2465,2,"Tuensang"],[94.7979,26.2465,2,"Tuensang"],[94.5238,26.0092,2,"Zunheboto"],
  [94.5238,26.0092,2,"Zunheboto"],[86.7638,21.3711,1,"Baleshwar"],[83.7637,21.2672,1,"Bargarh"],
  [83.6759,20.4884,2,"Boudh"],[84.7712,19.422,1,"Ganjam"],[86.3815,20.6615,2,"Jajapur"],
  [86.3565,20.8134,0,"Jajapur"],[86.3329,20.8338,0,"Jajapur"],[83.8949,21.8202,2,"Jharsuguda"],
  [85.6411,20.1795,2,"Khordha"],[82.4118,18.881,2,"Koraput"],[82.4606,18.8028,2,"Koraput"],
  [82.2912,19.1251,2,"Koraput"],[82.6935,19.1159,2,"Koraput"],[82.3061,18.8155,2,"Koraput"],
  [81.9656,18.0189,2,"Malkangiri"],[76.4506,30.3568,2,"Patiala"],[75.0273,26.6236,1,"Ajmer"],
  [75.0273,26.6236,0,"Ajmer"],[75.8063,25.2003,0,"Kota"],[86.6,27.31,1,"Gangtok"],
  [88.484,27.2753,2,"Gangtok"],[88.5976,27.3106,2,"Gangtok"],[88.6,27.31,0,"Gangtok"],
  [88.6432,27.1766,2,"Pakyong"],[80.217,13.0184,2,"Chennai"],[80.217,13.0183,2,"Chennai"],
  [80.2622,13.0885,2,"Chennai"],[80.2171,13.0183,2,"Chennai"],[80.2171,13.0184,2,"Chennai"],
  [80.2622,13.0885,2,"Chennai"],[77.0586,10.999,2,"Coimbatore"],[77.0583,10.999,2,"Coimbatore"],
  [77.7333,12.6324,2,"Krishnagiri"],[77.7343,12.6353,2,"Krishnagiri"],[78.2005,12.5275,2,"Krishnagiri"],
  [78.1596,11.4431,2,"Namakkal"],[78.1597,11.443,2,"Namakkal"],[78.8048,11.3511,2,"Perambalur"],
  [78.8054,11.3508,2,"Perambalur"],[79.1192,10.5147,2,"Pudukkottai"],[79.1191,10.5146,2,"Pudukkottai"],
  [78.6344,9.83556,2,"Sivaganga"],[78.6343,9.83548,2,"Sivaganga"],[79.2467,10.6319,2,"Thanjavur"],
  [79.2473,10.6299,2,"Thanjavur"],[79.6148,10.8787,2,"Thiruvarur"],[77.8487,8.39487,0,"Tirunelveli"],
  [77.4414,8.7064,0,"Tirunelveli"],[77.6979,8.8261,1,"Tirunelveli"],[77.5223,10.7505,1,"Tiruppur"],
  [79.1271,12.8862,2,"Vellore"],[79.1269,12.8863,2,"Vellore"],[77.9751,9.56599,2,"Virudhunagar"],
  [77.9751,9.56599,2,"Virudhunagar"],[77.9751,9.56599,2,"Virudhunagar"],[77.9749,9.5662,2,"Virudhunagar"],
  [78.5266,17.419,1,"Hyderabad"],[78.5266,17.419,0,"Hyderabad"],[91.6487,23.5358,2,"Gomati"],
  [91.2646,23.4754,2,"Sepahijala"],[91.2676,23.4764,2,"Sepahijala"],[91.6744,23.0183,2,"South Tripura"],
  [92.0386,24.1587,2,"Unakoti"],[91.2522,23.7984,2,"West Tripura"],[91.3181,23.7864,2,"West Tripura"],
  [91.2805,23.8353,2,"West Tripura"],[79.362,29.4609,0,"Almora"],[79.782,29.8475,2,"Bageshwar"],
  [79.4626,29.4942,2,"Bageshwar"],[79.4626,29.4942,2,"Bageshwar"],[79.4626,29.4942,2,"Bageshwar"],
  [79.4626,29.4942,2,"Bageshwar"],[78.044,30.3174,2,"Dehradun"],[78.1343,30.1801,1,"Dehradun"],
  [79.4814,29.3871,1,"Nainital"],[78.0749,27.8759,2,"Aligarh"],[83.3503,26.7459,2,"Gorakhpur"],
  [78.0361,27.5884,1,"Hathras"],[82.1292,26.3051,0,"Sultanpur"],
];

/**
 * A state's districts, centred on the MEDIAN of their own village coordinates.
 * A mean would be dragged into the Bay of Bengal by a single row published at
 * the wrong end of the country, and this feed has such rows.
 */
const WB_DISTRICTS: MapBubble[] = [
  { id: "24S", label: "24 Paraganas South", value: 652, lat: 22.26, lon: 88.3724 },
  { id: "BIR", label: "Birbhum", value: 510, lat: 23.8627, lon: 87.7135 },
  { id: "HOO", label: "Hooghly", value: 488, lat: 22.8905, lon: 88.0625 },
  { id: "BAN", label: "Bankura", value: 480, lat: 23.1592, lon: 87.2323 },
  { id: "COO", label: "Coochbehar", value: 453, lat: 26.3312, lon: 89.3202 },
  { id: "MEW", label: "Medinipur West", value: 436, lat: 22.607, lon: 87.4616 },
  { id: "PUB", label: "Purba Bardhaman", value: 402, lat: 23.3662, lon: 87.9718 },
  { id: "NAD", label: "Nadia", value: 308, lat: 23.299, lon: 88.5917 },
  { id: "DID", label: "Dinajpur Dakshin", value: 307, lat: 25.3788, lon: 88.5309 },
  { id: "DIU", label: "Dinajpur Uttar", value: 297, lat: 25.6435, lon: 88.2138 },
  { id: "24N", label: "24 Paraganas North", value: 261, lat: 22.7996, lon: 88.7649 },
  { id: "MUR", label: "Murshidabad", value: 249, lat: 24.1613, lon: 88.0532 },
];

const KINDS = [
  { kind: "girls", label: "Girls", color: "var(--sa-chart-cat-3)" },
  { kind: "boys", label: "Boys", color: "var(--sa-chart-cat-2)" },
  { kind: "unrecorded", label: "Type not recorded", color: "var(--sa-chart-axis)" },
];

const HOSTEL_PINS: MapPin[] = HOSTELS.map(([lon, lat, t, district], i) => ({
  id: `h${i}`,
  lon,
  lat,
  kind: KINDS[t]!.kind,
  label: district,
  detail: KINDS[t]!.label,
}));

function Ramp() {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
      <span style={{ fontSize: "var(--sa-type-label-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
        Villages per locality
      </span>
      <span style={{ display: "flex", width: "11rem", height: 8, borderRadius: 4, overflow: "hidden" }}>
        {steps.map((s) => (
          <span key={s} style={{ flex: 1, backgroundColor: `var(--sa-chart-seq-${s})` }} />
        ))}
      </span>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "11rem",
          fontSize: "var(--sa-type-body-3-size)",
          color: "var(--sa-text-neutral-subtle)",
        }}
      >
        <span>1</span>
        <span>387</span>
      </span>
    </div>
  );
}

const meta = {
  title: "Data display/Charts/IndiaPointMap",
  component: IndiaPointMap,
  parameters: { layout: "padded" },
} satisfies Meta<typeof IndiaPointMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both components at once — the way the PM-AJAY page draws them. */
export const Everything: Story = {
  args: {
    title: "PM-AJAY across India",
    summary: "19,348 Adarsh Gram villages and 200 hostels.",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    pins: HOSTEL_PINS,
    pinKinds: KINDS,
    legend: <Ramp />,
  },
};

/**
 * The density field alone. This is the view that made the case for the
 * component: West Bengal and Bihar hold 44% of every Adarsh Gram village, and
 * a per-state mark cannot say so.
 */
export const DensityOnly: Story = {
  args: {
    title: "Adarsh Gram villages",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    legend: <Ramp />,
  },
};

/**
 * Pins alone — 200 hostels, coloured by type. Colour is a **redundant**
 * encoding: each pin's accessible name and tooltip say its type in words, so a
 * reader who cannot separate teal from amber loses nothing (WCAG 1.4.1).
 */
export const PinsOnly: Story = {
  args: {
    title: "PM-AJAY hostels",
    pins: HOSTEL_PINS,
    pinKinds: KINDS,
    // 200 pins is past the point where each is worth a tab stop.
    interactivePins: false,
  },
};

/**
 * `focusRegion` zooms to a state and mutes the rest. Zooming changes the
 * **viewBox**, not a transform, so strokes and marks keep their drawn size
 * against the land instead of being magnified with it.
 */
export const FocusedOnAState: Story = {
  args: {
    title: "PM-AJAY in West Bengal",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    pins: HOSTEL_PINS,
    pinKinds: KINDS,
    focusRegion: "West Bengal",
    legend: <Ramp />,
  },
};

/**
 * `highlightRegion` outlines a state without zooming — wire it to whichever row
 * of your own list is under the cursor.
 */
export const HighlightedWithoutZoom: Story = {
  args: {
    title: "Adarsh Gram villages",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    highlightRegion: "Tamil Nadu",
    legend: <Ramp />,
  },
};

/**
 * With `onSelectRegion` every state outline becomes a button — clickable,
 * focusable, and operable with Enter and Space, which an SVG element gets from
 * nowhere by default. Without the prop the outlines are inert scenery.
 */
export const Selectable: Story = {
  args: {
    title: "Choose a state",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    onSelectRegion: (region: string) => {
      // eslint-disable-next-line no-console
      console.log("selected", region);
    },
    legend: <Ramp />,
  },
};

/**
 * The screen-reader table is the accessible source of truth, and it is the
 * caller's job to pass one — the component will not invent rows from a density
 * field, because a lattice cell is not a place anyone can name.
 */
export const WithScreenReaderTable: Story = {
  args: {
    title: "Adarsh Gram villages by state",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    legend: <Ramp />,
    table: {
      columns: ["State", "Villages"],
      rows: [
        ["West Bengal", 5792],
        ["Bihar", 2853],
        ["Tamil Nadu", 2184],
        ["Uttar Pradesh", 2083],
        ["Rajasthan", 1493],
      ],
    },
  },
};

/**
 * Rings over a density field — `bubbleVariant="outlined"`, which is the whole
 * point of the prop. The hexes already say how many villages are where; a
 * FILLED circle on top would encode the same quantity a second time and the eye
 * adds the two together. An outline reads as a boundary marker instead, so the
 * map can name districts without saying "villages" twice.
 *
 * `maxBubbleRadius` sizes the largest ring; raise it when a zoomed frame makes
 * the default look timid, and remember `r ∝ √v`, so doubling it quadruples the
 * ink of every ring.
 *
 * `highlightBubbleId` thickens one ring. Wire it to whichever row of your own
 * list is under the cursor — that is what turns a table beside a map into one
 * object rather than two.
 */
export const DistrictRingsOverDensity: Story = {
  args: {
    title: "PM-AJAY in West Bengal",
    bins: VILLAGE_BINS,
    binNoun: "villages",
    bubbles: WB_DISTRICTS,
    bubbleVariant: "outlined",
    maxBubbleRadius: 26,
    highlightBubbleId: "BIR",
    focusRegion: "West Bengal",
    legend: <Ramp />,
  },
};

/**
 * The same rings with `bubbleVariant="filled"` and no density underneath —
 * correct when the circles ARE the data rather than an annotation on it.
 */
export const FilledBubblesAlone: Story = {
  args: {
    title: "Adarsh Gram villages by district, West Bengal",
    bubbles: WB_DISTRICTS,
    bubbleVariant: "filled",
    maxBubbleRadius: 26,
    focusRegion: "West Bengal",
  },
};
