# Meshy × Maxon — Partnership Concept Demo

Single-page sales demo proposing an (unofficial, simulated) Meshy + Cinema 4D partnership. No backend, no login, no APIs.

Sections: Introduction, 3D asset viewer, interactive workflow, proposed partnership, financial calculator (hypothetical), 30-day pilot.

## Adding the Meshy model

1. Put your file at `public/meshy-asset.glb` (exact name).
2. Paste the original Meshy prompt into `MESHY_PROMPT` at the top of `src/routes/index.tsx`.

Until the file exists, the viewer shows a placeholder and the rest of the site works normally. The viewer uses Google's `<model-viewer>`, loaded only when the model is present (rotate by dragging, zoom by scrolling/pinching).
