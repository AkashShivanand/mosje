/**
 * PM-AJAY — mirrored snapshot of the public report feeds.
 *
 * Real figures, taken from the endpoints named below on the date each carries —
 * `GIA_AS_ON`, `HOSTEL_AS_ON`. NOT invented, not rounded, not extrapolated. It exists so a
 * page still shows the department every figure it publishes when the feed is
 * unreachable, per `.claude/rules/live-data-fallback.md`.
 *
 *   GIA, approved projects by domain  /reports/gia/approved-by-domain?fin_year=
 *   GIA, physical progress            /reports/gia/physical-progress?fin_year=
 *   Hostels, summary                  /reports/hostel/summary
 *
 * Keys mirror the API's own shape so the merge is a field-by-field overlay with
 * nothing to translate.
 *
 * WHAT IS DELIBERATELY ABSENT: gender distribution. The feed
 * (/reports/gia/gender-distribution) answers with a complete, well-formed
 * structure in which EVERY figure is zero — overall and for all four
 * interventions — and `gender_overall` on the domain report is zero for every
 * financial year too. There is nothing to mirror, so there is no gender card on
 * the dashboard. A card that renders zeros would report "no women were reached",
 * which is a false statement, not a missing one.
 */

/*
 * ONE DATE PER CAPTURE, because there is more than one capture.
 *
 * There used to be a single `PMAJAY_AS_ON` covering both datasets below, and it
 * is shown to the reader — the Illustrative banner says "as on {date}". Two
 * endpoints captured on different days cannot share one honest date: refreshing
 * the hostel figures and bumping the shared date would have made the banner
 * claim a freshness the GIA numbers never had, and leaving it would have made it
 * claim staleness the hostel numbers no longer had. Either way the page states
 * something untrue.
 *
 * That is exactly how the drift got in. The hostel snapshot sat at 2,30,977 /
 * 1,25,485 under a date of 28 August while the feed answered 1,57,708 / 89,776,
 * and nothing compared the two — the date asserted freshness, and only a date.
 *
 * Split the constant the day you capture one dataset without the other. Compare
 * both against their feeds with `npm run check:feed-drift`.
 */

/** GIA — approved-by-domain and physical-progress, captured together. */
export const GIA_AS_ON = "28 August 2026";

/** Hostels — /reports/hostel/summary, re-captured after it was found stale. */
export const HOSTEL_AS_ON = "31 August 2026";

/**
 * @deprecated Ambiguous — it cannot be right for both datasets at once. Use
 * `GIA_AS_ON` or `HOSTEL_AS_ON`, whichever the surface is actually showing.
 */
export const PMAJAY_AS_ON = GIA_AS_ON;

export interface GiaBreakdown {
  name: string;
  value: number;
}

export interface GiaIntervention {
  type: number;
  key: string;
  label: string;
  /** What the source calls this intervention's breakdown axis. */
  breakdownLabel: string;
  total: number;
  /** How many rows the source published, before the top-12 cut below. */
  rowCount: number;
  breakdowns: GiaBreakdown[];
}

export interface GiaYear {
  finYear: string;
  totalApproved: number;
  physical: { totalProjects: number; inProgress: number; percent: number };
  interventions: GiaIntervention[];
}

/** 2021-2022 is omitted: the source publishes it, and every figure in it is 0. */
export const GIA_YEARS_FALLBACK: GiaYear[] = [
  {
    "finYear": "2022-2023",
    "totalApproved": 1000,
    "physical": {
      "totalProjects": 8045,
      "inProgress": 12,
      "percent": 0
    },
    "interventions": [
      {
        "type": 1,
        "key": "income-generation",
        "label": "Income Generation",
        "breakdownLabel": "Domain / Sub-domain",
        "total": 479,
        "rowCount": 45,
        "breakdowns": [
          {
            "name": "Animal Husbandary — Assistance to Animal Husbandry related cooperative societies in the areas with substantial Scheduled Caste population",
            "value": 64
          },
          {
            "name": "Animal Husbandary — Assistance for pigs and duck units",
            "value": 39
          },
          {
            "name": "Animal Husbandary",
            "value": 35
          },
          {
            "name": "Industry, Service and Business",
            "value": 28
          },
          {
            "name": "Industry, Service and Business — Electronics related activities",
            "value": 28
          },
          {
            "name": "Fisheries — Development of Scheduled Caste fishermen cooperatives",
            "value": 27
          },
          {
            "name": "Animal Husbandary — Assistance for goat/sheep",
            "value": 26
          },
          {
            "name": "Industry, Service and Business — Boutiques",
            "value": 22
          },
          {
            "name": "Animal Husbandary — Assistance for poultry",
            "value": 19
          },
          {
            "name": "Agriculture and Soil Conservation — Honey Bee keeping and processing",
            "value": 19
          },
          {
            "name": "Fisheries — Assistance to Scheduled Caste families for pisciculture",
            "value": 17
          },
          {
            "name": "Industry, Service and Business — Readymade garments units",
            "value": 16
          }
        ]
      },
      {
        "type": 2,
        "key": "skilling",
        "label": "Skilling",
        "breakdownLabel": "Type of Skill",
        "total": 188,
        "rowCount": 4,
        "breakdowns": [
          {
            "name": "Up-skilling",
            "value": 93
          },
          {
            "name": "Short-term Training",
            "value": 78
          },
          {
            "name": "Long-term Training",
            "value": 11
          },
          {
            "name": "Entrepreneurship Development",
            "value": 6
          }
        ]
      },
      {
        "type": 3,
        "key": "infrastructure",
        "label": "Infrastructure",
        "breakdownLabel": "Project Type",
        "total": 333,
        "rowCount": 7,
        "breakdowns": [
          {
            "name": "Handicrafts and Handlooms",
            "value": 265
          },
          {
            "name": "Minor Irrigation",
            "value": 24
          },
          {
            "name": "Unspecified",
            "value": 21
          },
          {
            "name": "Agriculture and Soil Conservation",
            "value": 17
          },
          {
            "name": "Horticlture",
            "value": 3
          },
          {
            "name": "Forestry Ecology and Environment",
            "value": 2
          },
          {
            "name": "Food Processing",
            "value": 1
          }
        ]
      },
      {
        "type": 6,
        "key": "tutoring",
        "label": "Special Tutoring",
        "breakdownLabel": "Overall",
        "total": 0,
        "rowCount": 0,
        "breakdowns": []
      }
    ]
  },
  {
    "finYear": "2023-2024",
    "totalApproved": 7343,
    "physical": {
      "totalProjects": 11715,
      "inProgress": 127,
      "percent": 1
    },
    "interventions": [
      {
        "type": 1,
        "key": "income-generation",
        "label": "Income Generation",
        "breakdownLabel": "Domain / Sub-domain",
        "total": 3549,
        "rowCount": 64,
        "breakdowns": [
          {
            "name": "Industry, Service and Business",
            "value": 427
          },
          {
            "name": "Industry, Service and Business — Retail shops, Grocerys and Showrooms",
            "value": 255
          },
          {
            "name": "Animal Husbandary — Assistance for goat/sheep",
            "value": 254
          },
          {
            "name": "Food Processing — Support for food processing activities",
            "value": 169
          },
          {
            "name": "Animal Husbandary — Assistance for milch cattle and diary farming",
            "value": 160
          },
          {
            "name": "Animal Husbandary — Assistance for poultry",
            "value": 154
          },
          {
            "name": "Unspecified",
            "value": 152
          },
          {
            "name": "Animal Husbandary — Assistance for pigs and duck units",
            "value": 144
          },
          {
            "name": "Industry, Service and Business — Beauty parlour",
            "value": 119
          },
          {
            "name": "Horticlture — Small nurseries, seed farms etc incidental to the above",
            "value": 111
          },
          {
            "name": "Industry, Service and Business — Readymade garments units",
            "value": 95
          },
          {
            "name": "Industry, Service and Business — Auto, Automobile repair units",
            "value": 93
          }
        ]
      },
      {
        "type": 2,
        "key": "skilling",
        "label": "Skilling",
        "breakdownLabel": "Type of Skill",
        "total": 721,
        "rowCount": 5,
        "breakdowns": [
          {
            "name": "Short-term Training",
            "value": 475
          },
          {
            "name": "Unspecified",
            "value": 81
          },
          {
            "name": "Entrepreneurship Development",
            "value": 72
          },
          {
            "name": "Up-skilling",
            "value": 51
          },
          {
            "name": "Long-term Training",
            "value": 42
          }
        ]
      },
      {
        "type": 3,
        "key": "infrastructure",
        "label": "Infrastructure",
        "breakdownLabel": "Project Type",
        "total": 3070,
        "rowCount": 8,
        "breakdowns": [
          {
            "name": "Unspecified",
            "value": 1392
          },
          {
            "name": "Agriculture and Soil Conservation",
            "value": 708
          },
          {
            "name": "Horticlture",
            "value": 413
          },
          {
            "name": "Handicrafts and Handlooms",
            "value": 314
          },
          {
            "name": "Minor Irrigation",
            "value": 171
          },
          {
            "name": "Food Processing",
            "value": 49
          },
          {
            "name": "Forestry Ecology and Environment",
            "value": 20
          },
          {
            "name": "Fisheries",
            "value": 3
          }
        ]
      },
      {
        "type": 6,
        "key": "tutoring",
        "label": "Special Tutoring",
        "breakdownLabel": "Overall",
        "total": 3,
        "rowCount": 1,
        "breakdowns": [
          {
            "name": "Special Tutoring",
            "value": 3
          }
        ]
      }
    ]
  },
  {
    "finYear": "2024-2025",
    "totalApproved": 138,
    "physical": {
      "totalProjects": 436,
      "inProgress": 0,
      "percent": 0
    },
    "interventions": [
      {
        "type": 1,
        "key": "income-generation",
        "label": "Income Generation",
        "breakdownLabel": "Domain / Sub-domain",
        "total": 78,
        "rowCount": 20,
        "breakdowns": [
          {
            "name": "Animal Husbandary — Assistance for goat/sheep",
            "value": 20
          },
          {
            "name": "Animal Husbandary — Assistance for milch cattle and diary farming",
            "value": 14
          },
          {
            "name": "Unspecified",
            "value": 14
          },
          {
            "name": "Animal Husbandary — Assistance for poultry",
            "value": 6
          },
          {
            "name": "Industry, Service and Business",
            "value": 5
          },
          {
            "name": "Animal Husbandary — Assistance for pigs and duck units",
            "value": 3
          },
          {
            "name": "Industry, Service and Business — Retail shops, Grocerys and Showrooms",
            "value": 2
          },
          {
            "name": "Agriculture and Soil Conservation",
            "value": 2
          },
          {
            "name": "Industry, Service and Business — Beauty parlour",
            "value": 1
          },
          {
            "name": "Industry, Service and Business — Auto, Automobile repair units",
            "value": 1
          },
          {
            "name": "Industry, Service and Business — IT/ITeS Services",
            "value": 1
          },
          {
            "name": "Industry, Service and Business — Banking and Financial Services related",
            "value": 1
          }
        ]
      },
      {
        "type": 2,
        "key": "skilling",
        "label": "Skilling",
        "breakdownLabel": "Type of Skill",
        "total": 30,
        "rowCount": 4,
        "breakdowns": [
          {
            "name": "Short-term Training",
            "value": 21
          },
          {
            "name": "Unspecified",
            "value": 4
          },
          {
            "name": "Long-term Training",
            "value": 3
          },
          {
            "name": "Up-skilling",
            "value": 2
          }
        ]
      },
      {
        "type": 3,
        "key": "infrastructure",
        "label": "Infrastructure",
        "breakdownLabel": "Project Type",
        "total": 30,
        "rowCount": 3,
        "breakdowns": [
          {
            "name": "Horticlture",
            "value": 14
          },
          {
            "name": "Unspecified",
            "value": 11
          },
          {
            "name": "Agriculture and Soil Conservation",
            "value": 5
          }
        ]
      },
      {
        "type": 6,
        "key": "tutoring",
        "label": "Special Tutoring",
        "breakdownLabel": "Overall",
        "total": 0,
        "rowCount": 0,
        "breakdowns": []
      }
    ]
  },
  {
    "finYear": "2025-2026",
    "totalApproved": 285,
    "physical": {
      "totalProjects": 597,
      "inProgress": 11,
      "percent": 2
    },
    "interventions": [
      {
        "type": 1,
        "key": "income-generation",
        "label": "Income Generation",
        "breakdownLabel": "Domain / Sub-domain",
        "total": 76,
        "rowCount": 21,
        "breakdowns": [
          {
            "name": "Animal Husbandary — Assistance for goat/sheep",
            "value": 18
          },
          {
            "name": "Horticlture — Training to Scheduled Castes farmers in growing, marketing of fruits and vegetables produce",
            "value": 12
          },
          {
            "name": "Industry, Service and Business — Manufacturing units",
            "value": 11
          },
          {
            "name": "Industry, Service and Business",
            "value": 6
          },
          {
            "name": "Animal Husbandary — Assistance for poultry",
            "value": 6
          },
          {
            "name": "Food Processing — Support for food processing activities",
            "value": 4
          },
          {
            "name": "Industry, Service and Business — Bakery units",
            "value": 3
          },
          {
            "name": "Agriculture and Soil Conservation — Commercial crops programme in Scheduled Caste cultivators land",
            "value": 2
          },
          {
            "name": "Industry, Service and Business — Beauty parlour",
            "value": 2
          },
          {
            "name": "Fisheries",
            "value": 1
          },
          {
            "name": "Handicrafts and Handlooms — Assistance for promotion of Handloom and Textiles",
            "value": 1
          },
          {
            "name": "Handicrafts and Handlooms",
            "value": 1
          }
        ]
      },
      {
        "type": 2,
        "key": "skilling",
        "label": "Skilling",
        "breakdownLabel": "Type of Skill",
        "total": 66,
        "rowCount": 4,
        "breakdowns": [
          {
            "name": "Short-term Training",
            "value": 60
          },
          {
            "name": "Entrepreneurship Development",
            "value": 3
          },
          {
            "name": "Long-term Training",
            "value": 2
          },
          {
            "name": "Up-skilling",
            "value": 1
          }
        ]
      },
      {
        "type": 3,
        "key": "infrastructure",
        "label": "Infrastructure",
        "breakdownLabel": "Project Type",
        "total": 143,
        "rowCount": 4,
        "breakdowns": [
          {
            "name": "Unspecified",
            "value": 134
          },
          {
            "name": "Handicrafts and Handlooms",
            "value": 4
          },
          {
            "name": "Agriculture and Soil Conservation",
            "value": 3
          },
          {
            "name": "Forestry Ecology and Environment",
            "value": 2
          }
        ]
      },
      {
        "type": 6,
        "key": "tutoring",
        "label": "Special Tutoring",
        "breakdownLabel": "Overall",
        "total": 0,
        "rowCount": 0,
        "breakdowns": []
      }
    ]
  },
  {
    "finYear": "2026-2027",
    "totalApproved": 6,
    "physical": {
      "totalProjects": 2540,
      "inProgress": 0,
      "percent": 0
    },
    "interventions": [
      {
        "type": 1,
        "key": "income-generation",
        "label": "Income Generation",
        "breakdownLabel": "Domain / Sub-domain",
        "total": 0,
        "rowCount": 0,
        "breakdowns": []
      },
      {
        "type": 2,
        "key": "skilling",
        "label": "Skilling",
        "breakdownLabel": "Type of Skill",
        "total": 3,
        "rowCount": 1,
        "breakdowns": [
          {
            "name": "Short-term Training",
            "value": 3
          }
        ]
      },
      {
        "type": 3,
        "key": "infrastructure",
        "label": "Infrastructure",
        "breakdownLabel": "Project Type",
        "total": 3,
        "rowCount": 2,
        "breakdowns": [
          {
            "name": "Digitization",
            "value": 2
          },
          {
            "name": "Drinking water and sanitation",
            "value": 1
          }
        ]
      },
      {
        "type": 6,
        "key": "tutoring",
        "label": "Special Tutoring",
        "breakdownLabel": "Overall",
        "total": 0,
        "rowCount": 0,
        "breakdowns": []
      }
    ]
  }
];

/** Physical progress across every year, which the feed serves as `fin_year=all`. */
export const GIA_ALL_PHYSICAL_FALLBACK = {"totalProjects":23802,"inProgress":150,"percent":1};

export interface HostelCounts {
  completed_hostels: number;
  beneficiaries_covered: number;
  beneficiaries_occupied: number;
}

/**
 * `completed_hostels` is 0 in the live feed and 0 here, because that is what the
 * source publishes. The dashboard does not draw it — see the component.
 */
export const HOSTEL_FALLBACK: HostelCounts = {
  completed_hostels: 0,
  beneficiaries_covered: 157708,
  beneficiaries_occupied: 89776,
};

/**
 * The same snapshot with a STAND-IN for the one field neither source publishes.
 *
 * A mirrored 0 is no use as illustrative data: in Illustrative mode the card
 * would draw "0 hostels completed", which is the exact false claim the mode
 * exists to avoid making. So this figure is DERIVED and its derivation is
 * stated, rather than picked:
 *
 *   157,708 places covered ÷ 100 seats a hostel ≈ 1,577
 *
 * 100 seats is an indicative institutional hostel; it is a modelling
 * assumption, not a published norm, which is why the figure never appears
 * without an Illustrative mark. Replace it with the department's own count the
 * day `completed_hostels` carries one, and delete this export.
 */
export const HOSTEL_FALLBACK_ILLUSTRATIVE: HostelCounts = {
  ...HOSTEL_FALLBACK,
  completed_hostels: 1577,
};
