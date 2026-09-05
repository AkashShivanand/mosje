"use client";

import * as React from "react";
import { ROLES, SURFACES, type Surface } from "./typography-data";

/* ── copy-to-clipboard token chip ─────────────────────────────── */
function Copy({ text }: { text: string }): React.JSX.Element {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      className="ty-copy"
      data-done={done || undefined}
      onClick={() => {
        void navigator.clipboard?.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1100);
      }}
      aria-label={`Copy ${text}`}
    >
      <code>{text}</code>
      <span className="ty-copy__icon" aria-hidden="true">{done ? "✓" : "⧉"}</span>
    </button>
  );
}

/* ── surface segmented control ────────────────────────────────── */
function SurfaceToggle({ surface, onChange }: { surface: Surface; onChange: (s: Surface) => void }): React.JSX.Element {
  return (
    <div className="ty-toggle" role="radiogroup" aria-label="Surface">
      {SURFACES.map((s) => (
        <button
          key={s.key}
          type="button"
          role="radio"
          aria-checked={surface === s.key}
          className="ty-seg"
          data-active={surface === s.key || undefined}
          data-surface-key={s.key}
          onClick={() => onChange(s.key)}
        >
          <span className="ty-seg__label">{s.label}</span>
          <span className="ty-seg__note">{s.note}</span>
        </button>
      ))}
    </div>
  );
}

/* ── live type ramp (real --sa-type-* tokens via data-surface) ── */
function Ramp({ surface }: { surface: Surface }): React.JSX.Element {
  return (
    <div className="ty-ramp" data-surface={surface}>
      {ROLES.map((r) => {
        const [sMin, sMax] = r.size[surface];
        const [lMin, lMax] = r.lh[surface];
        const [tMin, tMax] = r.tracking[surface];
        const fluid = sMin !== sMax;
        return (
          <div className="ty-row" key={r.role} data-tier={r.tier}>
            <div className="ty-row__meta">
              <Copy text={`--sa-type-${r.role}-size`} />
              <dl className="ty-specs">
                <div><dt>size</dt><dd>{fluid ? `${sMin}→${sMax}` : sMax}<span className="u">px</span></dd></div>
                <div><dt>line</dt><dd>{lMin !== lMax ? `${lMin}→${lMax}` : lMax}<span className="u">px</span></dd></div>
                <div><dt>weight</dt><dd>{r.weight}</dd></div>
                {(tMin !== 0 || tMax !== 0) && (
                  <div><dt>track</dt><dd>{tMin === tMax ? tMax : `${tMin}→${tMax}`}<span className="u">px</span></dd></div>
                )}
              </dl>
            </div>
            <div className="ty-row__spec">
              {/* real tokens: size + line-height resolve to the active surface */}
              <div
                className="ty-sample"
                style={{
                  fontSize: `var(--sa-type-${r.role}-size)`,
                  lineHeight: `var(--sa-type-${r.role}-lh)`,
                  fontWeight: r.weightVal,
                  letterSpacing: `var(--sa-type-${r.role}-tracking, 0)`,
                }}
              >
                {r.en}
              </div>
              <div
                className="ty-sample ty-hi"
                lang="hi"
                style={{
                  fontSize: `var(--sa-type-${r.role}-size)`,
                  lineHeight: `var(--sa-type-${r.role}-lhDevanagari)`,
                  fontWeight: r.weightVal,
                }}
              >
                {r.hi}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── fluid-width preview: drag the viewport, watch type interpolate ── */
const WMIN = 360, WMAX = 1280;
function fluidPx([min, max]: [number, number], w: number): number {
  const t = Math.min(1, Math.max(0, (w - WMIN) / (WMAX - WMIN)));
  return Math.round((min + (max - min) * t) * 100) / 100;
}
function FluidPreview({ surface }: { surface: Surface }): React.JSX.Element {
  const [w, setW] = React.useState(760);
  const demo = ["display-1", "headline-1", "body-1"].map((k) => ROLES.find((r) => r.role === k)!);
  const bp = w < 600 ? "Mobile" : w < 1024 ? "Tablet" : "Desktop";
  return (
    <div className="ty-fluid">
      <div className="ty-fluid__head">
        <label htmlFor="vw" className="ty-fluid__label">Viewport width</label>
        <output className="ty-fluid__read"><b>{w}</b>px<span className="ty-fluid__bp" data-bp={bp}>{bp}</span></output>
      </div>
      <input
        id="vw" className="ty-slider" type="range" min={WMIN} max={WMAX} step={4}
        value={w} onChange={(e) => setW(Number(e.target.value))}
      />
      <div className="ty-fluid__stage" style={{ width: `${(w / WMAX) * 100}%` }} data-surface={surface}>
        {demo.map((r) => {
          const size = fluidPx(r.size[surface], w);
          const lh = fluidPx(r.lh[surface], w);
          return (
            <div className="ty-fluid__line" key={r.role}>
              <div style={{ fontSize: size, lineHeight: lh / size, fontWeight: r.weightVal }}>{r.en}</div>
              <span className="ty-fluid__tag">{r.role} · {size}px</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── token reference: tabbed, both surfaces ───────────────────── */
type Prop = "size" | "lh" | "tracking" | "para" | "weight" | "family";
const PROP_TABS: { key: Prop; label: string }[] = [
  { key: "size", label: "Font size" },
  { key: "lh", label: "Line height" },
  { key: "tracking", label: "Letter spacing" },
  { key: "para", label: "Paragraph spacing" },
  { key: "weight", label: "Weight" },
  { key: "family", label: "Family" },
];
const range = ([a, b]: [number, number]): string => (a === b ? `${a}` : `${a} → ${b}`);

function RefTable({ prop }: { prop: Prop }): React.JSX.Element {
  if (prop === "weight") {
    const rows = [["regular", 400, "Body copy"], ["medium", 500, "Display, Title, Label"], ["semibold", 600, "Headlines, emphasis"], ["bold", 700, "Strong emphasis"]] as const;
    return (
      <div className="ty-table-scroll"><table className="ty-table">
        <thead><tr><th>Token</th><th>Value</th><th>Used by</th></tr></thead>
        <tbody>{rows.map(([n, v, u]) => (
          <tr key={n}><td><Copy text={`--sa-font-weight-${n}`} /></td><td className="num">{v}</td><td className="use">{u}</td></tr>
        ))}</tbody>
      </table></div>
    );
  }
  if (prop === "family") {
    const rows = [["--sa-font-latin", "Noto Sans", "Latin / English — all UI text"], ["--sa-font-family-devanagari", "Noto Sans Devanagari", "हिन्दी text (see Indic line height)"]] as const;
    return (
      <div className="ty-table-scroll"><table className="ty-table">
        <thead><tr><th>Token</th><th>Family</th><th>Used for</th></tr></thead>
        <tbody>{rows.map(([t, f, u]) => (
          <tr key={t}><td><Copy text={t} /></td><td className="fam" style={t.includes("devanagari") ? { fontFamily: '"Noto Sans Devanagari", var(--sa-font-latin)' } : undefined}>{f}</td><td className="use">{u}</td></tr>
        ))}</tbody>
      </table></div>
    );
  }
  if (prop === "tracking") {
    const disp = ROLES.filter((r) => r.tier === "display");
    const groups: [string, string][] = [["heading", "Headline tier"], ["title", "Title tier"], ["body", "Body tier"], ["label", "Label tier"]];
    return (
      <div className="ty-table-scroll"><table className="ty-table">
        <thead><tr><th>Token</th><th className="web">Website</th><th className="por">Portal (min→max)</th></tr></thead>
        <tbody>
          {disp.map((r) => (
            <tr key={r.role}><td><Copy text={`--sa-type-${r.role}-tracking`} /></td>
              <td className="num web">0</td><td className="num por">{range(r.tracking.portal)}</td></tr>
          ))}
          {groups.map(([k, label]) => (
            <tr key={k} data-tier="headline"><td><Copy text={`--sa-type-${k}-tracking`} /></td>
              <td className="num web">0</td><td className="num por" title={label}>0</td></tr>
          ))}
        </tbody>
      </table></div>
    );
  }
  const suffix = prop === "size" ? "size" : prop === "lh" ? "lh" : "para";
  const dual = prop !== "para"; // paragraph-spacing is shared across surfaces
  return (
    <div className="ty-table-scroll"><table className="ty-table">
      <thead>
        <tr>
          <th>Token</th>
          {dual ? <><th className="web">Website (min→max)</th><th className="por">Portal (min→max)</th></> : <th>Value (min→max)</th>}
        </tr>
      </thead>
      <tbody>
        {ROLES.map((r) => {
          const key = r.role;
          const web = prop === "size" ? r.size.website : prop === "lh" ? r.lh.website : r.para;
          const por = prop === "size" ? r.size.portal : prop === "lh" ? r.lh.portal : r.para;
          return (
            <tr key={r.role} data-tier={r.tier}>
              <td><Copy text={`--sa-type-${key}-${suffix}`} /></td>
              {dual ? (
                <>
                  <td className="num web">{range(web)}</td>
                  <td className="num por">{range(por)}</td>
                </>
              ) : (
                <td className="num">{range(web)}</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table></div>
  );
}

function TokenReference(): React.JSX.Element {
  const [tab, setTab] = React.useState<Prop>("size");
  return (
    <div className="ty-ref">
      <div className="ty-tabs" role="tablist" aria-label="Token property">
        {PROP_TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
            className="ty-tab" data-active={tab === t.key || undefined} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <RefTable prop={tab} />
      {tab === "tracking" && (
        <p className="ty-hint">Website tracking is <b>0</b> at every tier. Portal uses negative tracking on the Display tier only (it scales with the fluid size); Headline/Title/Body/Label share one <code>0</code> token each (<code>heading/title/body/label</code>).</p>
      )}
      {(tab === "size" || tab === "lh") && (
        <p className="ty-hint">Two values = fluid <code>clamp()</code> between a 360px viewport (min) and 1280px (max). A single value is static. Names match the SAMAVESH Figma library 1:1.</p>
      )}
    </div>
  );
}

/* ── compact side-by-side of the two surfaces ─────────────────── */
function Compare(): React.JSX.Element {
  const rows = ["display-1", "headline-2", "body-1"].map((k) => ROLES.find((r) => r.role === k)!);
  return (
    <div className="ty-compare">
      {SURFACES.map((s) => (
        <div className="ty-compare__col" data-surface={s.key} key={s.key}>
          <div className="ty-compare__cap"><b>{s.label}</b> · {s.sample}</div>
          {rows.map((r) => (
            <div className="ty-compare__line" key={r.role}
              style={{ fontSize: `var(--sa-type-${r.role}-size)`, lineHeight: `var(--sa-type-${r.role}-lh)`, fontWeight: r.weightVal }}>
              {r.tier === "display" ? "Aa" : r.en.split(" ").slice(0, r.tier === "body" ? 6 : 3).join(" ")}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── the interactive core (placed once in the page) ───────────── */
export function TypeLab(): React.JSX.Element {
  const [surface, setSurface] = React.useState<Surface>("website");
  return (
    <>
      <section className="docs-section" aria-labelledby="the-scale">
        <span className="docs-section__label">Interactive</span>
        <h2 id="the-scale" className="docs-section__heading">The type scale, live</h2>
        <p className="ty-lead">One role vocabulary, two surfaces. Toggle to render every role at its real token
          value — the specimens below use the actual <code>--sa-type-*</code> variables, so what you see is what ships.</p>
        <SurfaceToggle surface={surface} onChange={setSurface} />
        <Ramp surface={surface} />
      </section>

      <section className="docs-section" aria-labelledby="fluid">
        <span className="docs-section__label">Interactive</span>
        <h2 id="fluid" className="docs-section__heading">Fluid, not stepped</h2>
        <p className="ty-lead">Type scales continuously between a 360px and a 1280px viewport — no breakpoint
          &ldquo;snap.&rdquo; Drag to shrink the frame and watch the same tokens interpolate.</p>
        <FluidPreview surface={surface} />
      </section>

      <section className="docs-section" aria-labelledby="two-surfaces">
        <span className="docs-section__label">Two surfaces</span>
        <h2 id="two-surfaces" className="docs-section__heading">Website vs Portal, same names</h2>
        <p className="ty-lead">The public website gets the expressive scale; portals get a denser one. Same token
          names — a portal shell opts in with <code>data-surface=&quot;portal&quot;</code> on <code>&lt;html&gt;</code>.</p>
        <Compare />
      </section>

      <section className="docs-section" aria-labelledby="tokens">
        <span className="docs-section__label">Reference</span>
        <h2 id="tokens" className="docs-section__heading">Every token</h2>
        <p className="ty-lead">All 21 roles × four fluid properties, plus weights and families — both surfaces,
          click any token to copy.</p>
        <TokenReference />
      </section>
    </>
  );
}
