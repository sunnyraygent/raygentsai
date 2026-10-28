# Avelqia — Deep Current


## Palette

| Color | Hex | Role |
| --- | --- | --- |
| Soft grey | `#EEF2F6` | Main light surfaces and section backgrounds |
| Ocean blue | `#376C98` | Brand mark on light surfaces and supporting accents |
| Ice blue | `#B3D9F3` | Primary buttons and mark on dark surfaces |
| Abyss navy | `#091726` | Hero and deep backgrounds |
| Slate ink | `#16283C` | High contrast text on light backgrounds |


## Manta identity

An original vector silhouette uses swept wings, two cephalic lobes, and a tapered curved tail. The shared inline symbol appears in the header, footer, CRM preview, and voice preview. Standalone transparent assets:

- `assets/manta-mark.svg`: ocean-blue symbol.
- `assets/manta-mark-light.svg`: pale symbol for dark backgrounds.
- `assets/manta-mark-dark.svg`: dark symbol for light backgrounds.
- `assets/brand.svg`: rounded navy favicon containing the manta.

Use the whole silhouette with space around the wings and tail. Keep its proportions. The tiny favicon is a contained variant; the navigation mark is transparent. These are editable vectors, with no raster upscaling or font dependency.

## Motion

The hero renders a procedural manta mesh in WebGL: paired fin surfaces, a tapered tail, slow wing flexion, subtle body drift, broad silver-blue reflections, and a gently eased response to the pointer on pointer-capable devices. A static SVG silhouette appears when WebGL is unavailable.

Soft shafts of light move slowly behind the hero. Existing Motion and Lenis interactions remain local assets. The pause control and reduced-motion preference stop decorative movement. Rendering stops while the hero is offscreen or the tab is hidden. Resolution is capped and mesh animation runs on the GPU.

## Verification for this update

- JavaScript syntax checks passed for app.js and assets/experience.js.
- HTML IDs are unique; local assets and fragment references resolve.
- All standalone SVG assets parse as valid XML.
- Browser confirmed WebGL renderer initialization; no new warning/error entries were observed.
- Visually inspected desktop 1440 × 1000, tablet 768 × 1024, and mobile 390 × 844 / 320 × 812.
- No document horizontal overflow at those inspected widths. The manta projection was adjusted to leave space around the wings on narrow phones.
- Pause control updated its state and paused the underwater light animation; resume behavior was smoke-tested.
- SVG fallback and reduced-motion branches were reviewed in source; a forced WebGL failure and a changed operating-system motion preference were not simulated.

Voice/CRM content is illustrative. The contact form still produces a local downloadable brief until a real submission endpoint is configured. This update changes branding and presentation, not the production status of those services.
