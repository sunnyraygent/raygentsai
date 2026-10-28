# AI booking agents: website positioning update

The current offer is AI voice agents that answer calls, qualify requests, and book or reschedule visits for US contractors. CRM compatibility is part of the agent setup; Raygents no longer markets a custom CRM product on the website.

## Changes

- Updated the hero, page title, description, social metadata, navigation, solution cards, industry examples, approach, FAQ, and final call to action.
- Removed the proprietary CRM workspace demo and its contact, pipeline, estimate, and copilot interactions.
- Added an illustrated agent → existing calendar → existing CRM handoff. Compatibility, available actions, and synced fields are confirmed during discovery; no named platform support is claimed.
- Replaced CRM-product inquiry choices with agent setup choices. Added an optional current CRM/calendar field and included it in the downloadable brief.
- Preserved the manta identity, ocean palette, voice scenarios, scroll story, animation controls, and preview-only inquiry behavior.
- Existing market reports and earlier design documents are historical records, not the current service catalog.

## Verification

- JavaScript syntax checks passed for both application scripts.
- Static production build passed; generated output remains in `dist/`.
- All 54 HTML IDs are unique, all 75 fragment references resolve, and all 8 local resources exist.
- Active HTML, JavaScript, and package metadata contain no custom CRM offer or removed workspace handlers.
- Browser checks at 1440, 681, 515, and 375 CSS-pixel widths found no page-width overflow. Desktop and mobile integration layouts were visually inspected; tablet navigation fits and the integration card content is not clipped.
- Mobile navigation opens, reaches CRM compatibility, and closes after selection.
- Voice rescheduling and construction scenario controls update correctly.
- The inquiry form completed with synthetic details. The downloaded brief includes the agent setup and current CRM/calendar field. Nothing was sent externally.
- No browser warnings or errors were recorded during these checks. Motion pause/resume still works.

Screenshots and the sample brief are local artifacts under `artifacts/` and are not committed. These checks cover the marketing website, not a production voice agent or an actual customer CRM integration.

## Version control and deployment

The main source directory had no Git repository. A baseline snapshot preserves the previous website, followed by a separate commit for this positioning change. This update is committed locally.
