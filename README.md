# FlowCrew

FlowCrew is a Next.js prototype for organizing messy client conversations with
a Gemini-powered AI crew:

- Jackie cleans and structures the raw message.
- Dex adds tags, priority, and CRM-style next steps.
- Nora evaluates opportunity and risk.
- Milo drafts replies for human approval.

## Local Setup

Create `.env.local` from `.env.example` and add a server-side Gemini API key:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

The optional `GEMINI_MODEL` variable overrides the default
`gemini-2.5-flash` model.

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On managed Windows machines, Node may need the system certificate store for
outbound HTTPS calls:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npm run dev
```

## AI Routes

- `POST /api/analyze` returns structured Crew output for one client
  conversation.
- `POST /api/chat` powers the read-only FlowCrew Bot demo inbox assistant.

The Gemini key is read only in server-side route handlers. It is never exposed
to browser code.

## Checks

```bash
npm run lint
npm run build
```
