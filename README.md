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

## Legacy Java Prototype

The original console prototype is still available in `src\`.

```powershell
javac -d out (Get-ChildItem -Path .\src -Recurse -Filter *.java | ForEach-Object { $_.FullName })
java -cp out splos.Main
```
