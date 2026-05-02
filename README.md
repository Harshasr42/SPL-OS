# Nexora

Nexora is a browser-based life command center with a clean dashboard for tasks, expenses, habits, profile management, smart suggestions, and live monitoring alerts.

## Web App Features

- Responsive dashboard with metrics, alerts, and advisor feed
- Task management with deadlines, urgency, and completion toggles
- Expense logging with budget usage tracking
- Habit tracking with streak and inactivity logic
- Profile storage with local persistence
- Advanced rule-based suggestion engine
- Background monitoring simulation using timed browser loops

## Launch The Full-Stack App

```powershell
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Persistence

- The app now uses a Node backend plus SQLite for persistent storage.
- Browser refreshes keep data.
- Older browser-local app states can be migrated into the current version automatically.

## Deploy On Render

Nexora is a better fit for Render than Vercel because it runs a custom Node server and uses SQLite.

Recommended Render setup:

- Service type: `Web Service`
- Runtime: `Node`
- Build command: `npm install`
- Start command: `npm start`

Important:

- Render expects the app to listen on `process.env.PORT`, which Nexora already supports.
- If you use Render's free plan, the filesystem is ephemeral, so SQLite data can be lost on redeploys or restarts.
- For persistent SQLite storage, attach a Render persistent disk and set `NEXORA_DATA_DIR` to the mounted path, or use the default value from `render.yaml`.

## Legacy Java Prototype

The original console prototype is still available in `src\`.

```powershell
javac -d out (Get-ChildItem -Path .\src -Recurse -Filter *.java | ForEach-Object { $_.FullName })
java -cp out splos.Main
```
