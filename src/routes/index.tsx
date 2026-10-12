import { createFileRoute } from "@tanstack/react-router";
import { createElement, useEffect, useState } from "react";

const TITLE = "Meshy × Maxon: Create Faster. Refine Professionally.";
const DESC =
  "A proposed partnership concept adding optional AI-powered 3D asset generation from Meshy to the Cinema 4D workflow.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MODEL_URL = "/meshy-asset.glb";
// Paste the original Meshy prompt here once the model is added.
const MESHY_PROMPT = "";

const steps = {
  Generate: "AI-generated initial 3D asset using Meshy.",
  Transfer: "Proposed one-click asset transfer to Cinema 4D. This step is simulated and is not an existing feature.",
  Refine: "Artists refine geometry, materials and animation using Maxon's professional tools.",
  Render:
    "Finish using Redshift and optionally continue into Adobe After Effects through existing workflows.",
} as const;
type Step = keyof typeof steps;

const DEFAULTS = { users: 10000, activation: 10, conversion: 20, revenue: 20, trialCost: 1, cost: 4 };

const nav = [
  ["intro", "Intro"],
  ["viewer", "Asset"],
  ["workflow", "Workflow"],
  ["partnership", "Partnership"],
  ["calculator", "Calculator"],
  ["pilot", "Pilot"],
];

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl md:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Viewer() {
  const [status, setStatus] = useState<"checking" | "ready" | "missing">("checking");
  useEffect(() => {
    let cancelled = false;
    fetch(MODEL_URL, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") || "";
        if (!r.ok || type.includes("text/html")) throw new Error();
        if (!document.querySelector("script[data-model-viewer]")) {
          const s = document.createElement("script");
          s.type = "module";
          s.setAttribute("data-model-viewer", "1");
          s.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
          document.head.appendChild(s);
        }
        if (!cancelled) setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("missing"));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card">
        {status === "ready" ? (
          createElement("model-viewer", {
            src: MODEL_URL,
            alt: "Meshy-generated 3D asset",
            "camera-controls": true,
            "auto-rotate": true,
            "shadow-intensity": "1",
            style: { width: "100%", height: "100%" },
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 border-2 border-dashed border-border p-8 text-center">
            <div className="h-14 w-14 rotate-45 rounded-md border-2 border-primary/60" />
            <p className="mt-4 text-lg font-medium">
              {status === "checking" ? "Checking for model…" : "Meshy-generated asset will be added here."}
            </p>
            <p className="text-sm text-muted-foreground">Expected file: meshy-asset.glb</p>
          </div>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Original Meshy prompt</p>
        <p className="mt-4 leading-relaxed">
          {MESHY_PROMPT || <span className="italic text-muted-foreground">Prompt will be added with the model.</span>}
        </p>
        <p className="mt-8 text-sm text-muted-foreground">Drag to rotate · scroll or pinch to zoom.</p>
      </div>
    </div>
  );
}

function Workflow() {
  const [active, setActive] = useState<Step>("Generate");
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(Object.keys(steps) as Step[]).map((k, i) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            aria-pressed={active === k}
            className={`rounded-lg border px-5 py-4 text-left transition-colors ${
              active === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            <span className="text-xs opacity-70">0{i + 1}</span>
            <span className="block text-lg font-semibold">{k}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-8">
        {active === "Transfer" && (
          <span className="mb-3 inline-block rounded-full border border-primary/50 px-3 py-1 text-xs text-primary">
            Simulated
          </span>
        )}
        <p className="text-xl leading-relaxed">{steps[active]}</p>
      </div>
    </div>
  );
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const usd = (n: number) => (n < 0 ? "-$" : "$") + fmt(Math.abs(n));

function Calculator() {
  const [v, setV] = useState(DEFAULTS);
  const activated = v.users * (v.activation / 100);
  const paying = activated * (v.conversion / 100);
  const revenue = paying * v.revenue * 12;
  const trialCosts = activated * v.trialCost;
  const serviceCosts = paying * v.cost * 12;
  const contribution = revenue - trialCosts - serviceCosts;

  const fields: { key: keyof typeof DEFAULTS; label: string; min: number; max: number; step: number; unit?: string; prefix?: string }[] = [
    { key: "users", label: "Eligible users", min: 0, max: 100000, step: 500 },
    { key: "activation", label: "Trial activation rate", min: 0, max: 100, step: 1, unit: "%" },
    { key: "conversion", label: "Paid conversion among trial users", min: 0, max: 100, step: 1, unit: "%" },
    { key: "revenue", label: "Monthly revenue per paying user", min: 0, max: 100, step: 1, prefix: "$" },
    { key: "trialCost", label: "One time introductory trial cost per activated user", min: 0, max: 20, step: 0.5, prefix: "$" },
    { key: "cost", label: "Monthly service cost per paying user", min: 0, max: 50, step: 0.5, prefix: "$" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Hypothetical assumptions</p>
          <button onClick={() => setV(DEFAULTS)} className="rounded-md border border-border px-4 py-1.5 text-sm hover:bg-accent">
            Reset
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">These inputs are hypothetical and illustrative. They are not verified Maxon figures. Adjust freely.</p>
        <div className="mt-6 space-y-6">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span>{f.label} <span className="text-muted-foreground">(hypothetical)</span></span>
                <span className="flex items-center gap-1">
                  {f.prefix}
                  <input
                    type="number"
                    min={f.min}
                    step={f.step}
                    value={v[f.key]}
                    onChange={(e) => setV({ ...v, [f.key]: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-24 rounded-md border border-input bg-background px-2 py-1 text-right"
                  />
                  {f.unit}
                </span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={Math.min(v[f.key], f.max)}
                onChange={(e) => setV({ ...v, [f.key]: Number(e.target.value) })}
                className="mt-3 w-full accent-primary"
              />
            </label>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Illustrative outputs</p>
        <dl className="mt-6 divide-y divide-border">
          {[
            ["Activated trial users", fmt(activated)],
            ["Paying users", fmt(paying)],
            ["Annual gross revenue", usd(revenue)],
            ["First year introductory trial costs", usd(-trialCosts)],
            ["Annual paid user service costs", usd(-serviceCosts)],
          ].map(([k, val]) => (
            <div key={k} className="flex justify-between py-4">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-semibold tabular-nums">{val}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 rounded-lg bg-secondary p-5">
          <p className="text-sm text-muted-foreground">Illustrative first year contribution before fixed costs</p>
          <p className={`mt-1 font-display text-4xl tabular-nums ${contribution < 0 ? "text-destructive" : "text-primary"}`}>{usd(contribution)}</p>
        </div>
        <div className="mt-6 rounded-lg border border-border p-5 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">How it's calculated</p>
          <ul className="mt-3 space-y-2 font-mono text-xs leading-relaxed text-muted-foreground">
            <li>Activated trial users = eligible users × trial activation rate</li>
            <li>Paying users = activated trial users × paid conversion rate</li>
            <li>Annual gross revenue = paying users × monthly revenue per paying user × 12</li>
            <li>First year trial costs = activated trial users × one time trial cost</li>
            <li>Annual service costs = paying users × monthly service cost × 12</li>
            <li>First year contribution = revenue − trial costs − service costs</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Excludes fixed costs (engineering, integration, support, marketing). Results may be negative.</p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          This is an illustrative scenario only. It is not a verified ROI, profit figure or forecast.
        </p>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#intro" className="font-display text-lg">Meshy × Maxon</a>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            {nav.map(([id, l]) => (
              <a key={id} href={`#${id}`} className="hover:text-foreground">{l}</a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section id="intro" className="py-20 md:py-32">
          <p className="inline-block rounded-full border border-primary/40 px-4 py-1.5 text-xs text-primary">
            Strategic partnership concept, simulated workflow
          </p>
          <h1 className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            Generate in Meshy. <span className="text-primary">Create in Cinema 4D.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
            A proposed AI asset generation experience that helps artists move from concept to professional production.
          </p>
          <p className="mt-8 max-w-2xl leading-relaxed text-muted-foreground">
            Meshy could handle the first draft by turning a text or image prompt into a starting 3D asset in
            minutes. Cinema 4D remains where artists do the real work: refining, animating and rendering with the
            professional control they already rely on.
          </p>
        </section>

        <Section id="viewer" eyebrow="01 · Asset" title="Interactive 3D asset viewer"><Viewer /></Section>
        <Section id="workflow" eyebrow="02 · Workflow" title="From prompt to final render"><Workflow /></Section>

        <Section id="partnership" eyebrow="03 · Partnership" title="A proposed three stage commercial journey">
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ["Introduce", "Limited introductory access with controlled generation credits."],
              ["Monetize", "Paid professional usage or licensing."],
              ["Expand", "Potential later expansion into broader creative workflows, including Adobe, subject to separate agreement."],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-xl border border-border bg-card p-6">
                <span className="font-display text-4xl text-primary">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">No joint pricing or commercial terms have been set. All terms subject to mutual agreement.</p>
        </Section>

        <Section id="calculator" eyebrow="04 · Calculator" title="Illustrative financial scenario"><Calculator /></Section>

        <Section id="pilot" eyebrow="05 · Pilot" title="A 30-day joint feasibility pilot">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Days 1 to 10", "Test asset quality and import compatibility."],
              ["Days 11 to 20", "Test professional artist workflow, time savings and rework."],
              ["Days 21 to 30", "Evaluate product adoption interest and commercial feasibility."],
            ].map(([d, t]) => (
              <div key={d} className="border-l-2 border-primary pl-5">
                <p className="text-sm font-semibold text-primary">{d}</p>
                <p className="mt-2">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 rounded-2xl border border-border bg-card p-10 text-center md:p-16">
            <h3 className="font-display text-3xl md:text-5xl">Let's scope a joint technical and commercial pilot.</h3>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Strategic partnership concept. Not endorsed or approved by Meshy, Maxon or Adobe. All trademarks belong to their owners.
      </footer>
    </div>
  );
}
