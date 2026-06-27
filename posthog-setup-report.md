<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hsp landing page. PostHog is initialized via a reusable `src/components/posthog.astro` component (using the `is:inline` + `define:vars` pattern to safely pass env vars) and is included in `src/layouts/Layout.astro` so it loads on every page. Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) are stored in `.env` and never hardcoded. Five new events were instrumented across the single-page app and the thank-you page, covering the full conversion funnel from landing to application submission.

| Event name | Description | File |
|---|---|---|
| `page_2_viewed` | User navigated to the salary calculator page (step 2 of the conversion funnel). | `src/pages/index.astro` |
| `page_3_viewed` | User navigated to the application form page (step 3 of the conversion funnel). | `src/pages/index.astro` |
| `ugc_video_played` | User tapped the play button on the UGC video carousel. | `src/pages/index.astro` |
| `calculator_interacted` | User first interacted with the earnings calculator chart. | `src/pages/index.astro` |
| `form_step_completed` | User completed a step in the multi-step application form and advanced to the next step (includes `step_number` property). | `src/pages/index.astro` |
| `form_submitted` | User submitted the final application form (pre-existing event, now includes `source` UTM property). | `src/pages/index.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/203814/dashboard/778470)
- [Conversion Funnel: Landing → Calculator → Form → Submitted](https://eu.posthog.com/project/203814/insights/maUUWgjV)
- [Form Submissions Over Time](https://eu.posthog.com/project/203814/insights/Co09YMzy)
- [Funnel Drop-off: Pages Reached](https://eu.posthog.com/project/203814/insights/iauYG4MP)
- [Engagement: Video Plays & Calculator Interactions](https://eu.posthog.com/project/203814/insights/Oo75sV7c)
- [Total Applications Submitted (30 days)](https://eu.posthog.com/project/203814/insights/wWICU1Rc)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
