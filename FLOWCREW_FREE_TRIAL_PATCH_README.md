# FlowCrew one-lead free trial patch

Run from your project root:

```bash
cd C:\Users\mauri\Desktop\FlowCrew\flowcrew
node apply-flowcrew-trial.js
npm run lint
npm run build
```

What it does:

- Changes landing CTAs from `/leads` to `/trial` where appropriate.
- Creates/updates `app/trial/page.tsx`.
- Enforces one free lead run using `localStorage` key `flowcrew:trial:one-lead:v1`.
- Shows Jackie, Nora, Milo, and Dex full output after submit.
- Shows the upgrade panel: “Your free lead is complete. Upgrade to keep your Crew running.”
- Adds `Upgrade to Pro` and `View dashboard` buttons.
- Keeps Stripe/auth out of the flow.
