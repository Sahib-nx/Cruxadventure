# TODO

## Goal
Fix Vercel build failure by aligning stricter checks/environment differences with local build.

## Steps
- [x] Inspect local build status (`npm run build`) and local lint output.
- [x] Identify React hook lint errors caused by `setState` calls inside `useEffect` bodies.
- [x] Update `useDestinationSearch` to avoid setState in effect body (wrap call in async IIFE + cancellation guard).
- [x] Update `src/app/admin/destinations/page.tsx` to avoid direct `setPage(1)` in effect body (use `setTimeout`).
- [x] Update `src/app/admin/layout.tsx` to avoid `setCheckingAuth(false)` inside effect body (use `setTimeout`).
- [ ] Re-run `npm run lint -- --max-warnings=0` to confirm errors removed (expect only warnings).
- [ ] Fix remaining lint warnings that are treated as fatal on Vercel/CI (or adjust CI to not fail on warnings).
- [ ] Get the full Vercel error log (the first actual ERROR line) and verify which check is failing (ESLint, TypeScript, build step, env vars, runtime-only API).

