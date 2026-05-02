const http = require("http");
const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const root = __dirname;
const workspaceRoot = path.resolve(root, "..");
const persistentDataRoot = process.env.NEXORA_DATA_DIR || process.env.RENDER_DISK_PATH || path.join(workspaceRoot, "data");
const dataDir = persistentDataRoot;
const dbPath = path.join(dataDir, "nexora.db");
const legacyDbPath = path.join(dataDir, "splos.db");
const port = Number(process.env.PORT || 3000);

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(dbPath) && fs.existsSync(legacyDbPath)) {
    fs.copyFileSync(legacyDbPath, dbPath);
}

const db = new DatabaseSync(dbPath);
db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT,
        email TEXT,
        preferences TEXT,
        goal TEXT,
        energy_mode TEXT,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        notes TEXT,
        deadline TEXT NOT NULL,
        priority INTEGER NOT NULL,
        status TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        threshold REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cue TEXT,
        target_frequency INTEGER NOT NULL,
        current_streak INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_completions (
        habit_id TEXT NOT NULL,
        completion_date TEXT NOT NULL,
        PRIMARY KEY (habit_id, completion_date),
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        logged_at TEXT NOT NULL
    );
`);

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);

        if (url.pathname === "/api/state") {
            await handleStateApi(req, res);
            return;
        }

        if (url.pathname === "/api/health") {
            writeJson(res, 200, { status: "ok", database: dbPath });
            return;
        }

        if (url.pathname.startsWith("/api/profile") || url.pathname.startsWith("/api/tasks") || url.pathname.startsWith("/api/expenses") || url.pathname.startsWith("/api/habits") || url.pathname.startsWith("/api/activity")) {
            await handleModuleApi(req, res, url);
            return;
        }

        serveStatic(req, res, url.pathname);
    } catch (error) {
        writeJson(res, 500, { error: "Internal server error", detail: error.message });
    }
});

async function handleStateApi(req, res) {
    if (req.method === "GET") {
        writeJson(res, 200, {
            state: readFullState(),
            updatedAt: new Date().toISOString()
        });
        return;
    }

    if (req.method === "PUT") {
        const body = await readJsonBody(req);
        if (!body || typeof body !== "object" || !body.state || typeof body.state !== "object") {
            writeJson(res, 400, { error: "A JSON object with a state field is required." });
            return;
        }
        writeFullState(body.state);
        writeJson(res, 200, { ok: true, updatedAt: new Date().toISOString() });
        return;
    }

    if (req.method === "DELETE") {
        clearAllState();
        writeJson(res, 200, { ok: true });
        return;
    }

    writeJson(res, 405, { error: "Method not allowed." });
}

async function handleModuleApi(req, res, url) {
    if (req.method !== "GET") {
        writeJson(res, 405, { error: "Read-only module endpoints for now." });
        return;
    }

    const pathName = url.pathname;
    if (pathName === "/api/profile") {
        writeJson(res, 200, { profile: readProfile() });
        return;
    }
    if (pathName === "/api/tasks") {
        writeJson(res, 200, { tasks: readTasks() });
        return;
    }
    if (pathName === "/api/expenses") {
        writeJson(res, 200, { expenses: readExpenses() });
        return;
    }
    if (pathName === "/api/habits") {
        writeJson(res, 200, { habits: readHabits() });
        return;
    }
    if (pathName === "/api/activity") {
        writeJson(res, 200, { activity: readActivity() });
        return;
    }
    writeJson(res, 404, { error: "Not found." });
}

function readFullState() {
    return {
        activeView: "dashboard",
        profile: readProfile(),
        tasks: readTasks(),
        expenses: readExpenses(),
        habits: readHabits(),
        alerts: [],
        activity: readActivity()
    };
}

function writeFullState(state) {
    const now = new Date().toISOString();
    const transaction = db.transaction(() => {
        clearAllState(false);

        if (state.profile) {
            db.prepare(`
                INSERT INTO profile (id, name, email, preferences, goal, energy_mode, updated_at)
                VALUES (1, ?, ?, ?, ?, ?, ?)
            `).run(
                state.profile.name || "",
                state.profile.email || "",
                state.profile.preferences || "",
                state.profile.goal || "",
                state.profile.energyMode || "",
                now
            );
        }

        const insertTask = db.prepare(`
            INSERT INTO tasks (id, title, notes, deadline, priority, status, type, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        (state.tasks || []).forEach((task) => {
            insertTask.run(task.id, task.title, task.notes || "", task.deadline, Number(task.priority || 1), task.status || "PENDING", task.type || "NORMAL", task.createdAt || now.slice(0, 10), now);
        });

        const insertExpense = db.prepare(`
            INSERT INTO expenses (id, title, category, amount, threshold, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        (state.expenses || []).forEach((expense) => {
            insertExpense.run(expense.id, expense.title, expense.category, Number(expense.amount || 0), Number(expense.threshold || 0), expense.createdAt || now.slice(0, 10), now);
        });

        const insertHabit = db.prepare(`
            INSERT INTO habits (id, name, cue, target_frequency, current_streak, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const insertCompletion = db.prepare(`
            INSERT INTO habit_completions (habit_id, completion_date)
            VALUES (?, ?)
        `);
        (state.habits || []).forEach((habit) => {
            insertHabit.run(habit.id, habit.name, habit.cue || "", Number(habit.targetFrequency || 1), Number(habit.currentStreak || 0), now);
            (habit.completionDates || []).forEach((completionDate) => {
                insertCompletion.run(habit.id, completionDate);
            });
        });

        const insertActivity = db.prepare(`
            INSERT INTO activity_log (title, message, logged_at)
            VALUES (?, ?, ?)
        `);
        (state.activity || []).forEach((item) => {
            insertActivity.run(item.title, item.message, item.when || now);
        });
    });

    transaction();
}

function clearAllState(runDirect = true) {
    const clear = () => {
        db.exec(`
            DELETE FROM activity_log;
            DELETE FROM habit_completions;
            DELETE FROM habits;
            DELETE FROM expenses;
            DELETE FROM tasks;
            DELETE FROM profile;
        `);
    };

    if (runDirect) {
        clear();
    } else {
        clear();
    }
}

function readProfile() {
    const row = db.prepare(`SELECT name, email, preferences, goal, energy_mode FROM profile WHERE id = 1`).get();
    if (!row) {
        return null;
    }
    return {
        name: row.name,
        email: row.email,
        preferences: row.preferences,
        goal: row.goal,
        energyMode: row.energy_mode
    };
}

function readTasks() {
    return db.prepare(`SELECT id, title, notes, deadline, priority, status, type, created_at FROM tasks ORDER BY created_at DESC`).all().map((row) => ({
        id: row.id,
        title: row.title,
        notes: row.notes,
        deadline: row.deadline,
        priority: row.priority,
        status: row.status,
        type: row.type,
        createdAt: row.created_at
    }));
}

function readExpenses() {
    return db.prepare(`SELECT id, title, category, amount, threshold, created_at FROM expenses ORDER BY created_at DESC`).all().map((row) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        amount: row.amount,
        threshold: row.threshold,
        createdAt: row.created_at
    }));
}

function readHabits() {
    const habits = db.prepare(`SELECT id, name, cue, target_frequency, current_streak FROM habits ORDER BY updated_at DESC`).all();
    const completionStatement = db.prepare(`SELECT completion_date FROM habit_completions WHERE habit_id = ? ORDER BY completion_date ASC`);
    return habits.map((row) => ({
        id: row.id,
        name: row.name,
        cue: row.cue,
        targetFrequency: row.target_frequency,
        currentStreak: row.current_streak,
        completionDates: completionStatement.all(row.id).map((item) => item.completion_date)
    }));
}

function readActivity() {
    return db.prepare(`SELECT title, message, logged_at FROM activity_log ORDER BY id DESC LIMIT 8`).all().map((row) => ({
        title: row.title,
        message: row.message,
        when: row.logged_at
    }));
}

function serveStatic(req, res, pathname) {
    const requestPath = pathname === "/" ? "/index.html" : pathname;
    const normalizedPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, normalizedPath);

    if (!filePath.startsWith(root)) {
        writeJson(res, 403, { error: "Forbidden" });
        return;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
            return;
        }

        const extension = path.extname(filePath);
        res.writeHead(200, { "Content-Type": contentTypes[extension] || "text/plain; charset=utf-8" });
        res.end(data);
    });
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 5_000_000) {
                reject(new Error("Request body too large."));
                req.destroy();
            }
        });
        req.on("end", () => {
            if (!raw) {
                resolve(null);
                return;
            }
            try {
                resolve(JSON.parse(raw));
            } catch (error) {
                reject(new Error("Invalid JSON body."));
            }
        });
        req.on("error", reject);
    });
}

function writeJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
}

server.listen(port, () => {
console.log(`Nexora full-stack app running on port ${port}`);
    console.log(`SQLite database: ${dbPath}`);
});
