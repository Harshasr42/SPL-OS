const STORAGE_KEY = "nexora-web-state-v1";
const LEGACY_STORAGE_KEYS = [
    "splos-web-state-v4",
    "splos-web-state-v3",
    "splos-web-state-v2",
    "splos-web-state-v1"
];
const API_STATE_URL = "/api/state";
const VIEW_TITLES = {
    dashboard: "Dashboard",
    tasks: "Tasks",
    expenses: "Expenses",
    habits: "Habits",
    suggestions: "Suggestions",
    profile: "Profile"
};

const state = loadState();
const els = mapElements();
let saveTimer = null;
let hasHydratedFromServer = false;

init().catch((error) => {
    console.error(error);
});

async function init() {
    bindNavigation();
    bindControls();
    bindForms();
    bindActions();
    resetTaskForm();
    resetExpenseForm();
    resetHabitForm();
    syncViewFromHash();
    await hydrateFromServer();
    render();
    startBackgroundLoops();
}

function mapElements() {
    return {
        profileForm: document.getElementById("profileForm"),
        taskForm: document.getElementById("taskForm"),
        taskSubmitButton: document.getElementById("taskSubmitButton"),
        taskCancelEditButton: document.getElementById("taskCancelEditButton"),
        expenseForm: document.getElementById("expenseForm"),
        expenseSubmitButton: document.getElementById("expenseSubmitButton"),
        expenseCancelEditButton: document.getElementById("expenseCancelEditButton"),
        habitForm: document.getElementById("habitForm"),
        habitSubmitButton: document.getElementById("habitSubmitButton"),
        habitCancelEditButton: document.getElementById("habitCancelEditButton"),
        profileCard: document.getElementById("profileCard"),
        taskList: document.getElementById("taskList"),
        expenseList: document.getElementById("expenseList"),
        habitList: document.getElementById("habitList"),
        suggestionList: document.getElementById("suggestionList"),
        alertFeed: document.getElementById("alertFeed"),
        summaryCards: document.getElementById("summaryCards"),
        priorityQueue: document.getElementById("priorityQueue"),
        healthScore: document.getElementById("healthScore"),
        healthLabel: document.getElementById("healthLabel"),
        healthBreakdown: document.getElementById("healthBreakdown"),
        activityFeed: document.getElementById("activityFeed"),
        completionRing: document.getElementById("completionRing"),
        completionRateValue: document.getElementById("completionRateValue"),
        completedTasksCount: document.getElementById("completedTasksCount"),
        dueTodayCount: document.getElementById("dueTodayCount"),
        overdueCount: document.getElementById("overdueCount"),
        spendingBreakdown: document.getElementById("spendingBreakdown"),
        habitMomentumBoard: document.getElementById("habitMomentumBoard"),
        focusPlan: document.getElementById("focusPlan"),
        weeklyActivityChart: document.getElementById("weeklyActivityChart"),
        moduleMixChart: document.getElementById("moduleMixChart"),
        topSuggestionCard: document.getElementById("topSuggestionCard"),
        signalBoard: document.getElementById("signalBoard"),
        suggestionRadar: document.getElementById("suggestionRadar"),
        suggestionPriorityLane: document.getElementById("suggestionPriorityLane"),
        suggestionGroups: document.getElementById("suggestionGroups"),
        suggestionActionMap: document.getElementById("suggestionActionMap"),
        taskOpenMetric: document.getElementById("taskOpenMetric"),
        taskOpenNote: document.getElementById("taskOpenNote"),
        taskDueSoonMetric: document.getElementById("taskDueSoonMetric"),
        taskDueSoonNote: document.getElementById("taskDueSoonNote"),
        taskUrgentMetric: document.getElementById("taskUrgentMetric"),
        taskUrgentNote: document.getElementById("taskUrgentNote"),
        taskInsights: document.getElementById("taskInsights"),
        taskTimelineBoard: document.getElementById("taskTimelineBoard"),
        taskPriorityLane: document.getElementById("taskPriorityLane"),
        taskWorkloadBoard: document.getElementById("taskWorkloadBoard"),
        taskGroups: document.getElementById("taskGroups"),
        taskSearch: document.getElementById("taskSearch"),
        taskStatusFilter: document.getElementById("taskStatusFilter"),
        taskPriorityFilter: document.getElementById("taskPriorityFilter"),
        taskSort: document.getElementById("taskSort"),
        expenseTotalMetric: document.getElementById("expenseTotalMetric"),
        expenseTotalNote: document.getElementById("expenseTotalNote"),
        expenseAverageMetric: document.getElementById("expenseAverageMetric"),
        expenseAverageNote: document.getElementById("expenseAverageNote"),
        expenseTopCategoryMetric: document.getElementById("expenseTopCategoryMetric"),
        expenseTopCategoryNote: document.getElementById("expenseTopCategoryNote"),
        expenseSearch: document.getElementById("expenseSearch"),
        expenseCategoryFilter: document.getElementById("expenseCategoryFilter"),
        expenseSort: document.getElementById("expenseSort"),
        expenseInsights: document.getElementById("expenseInsights"),
        expenseCategoryBoard: document.getElementById("expenseCategoryBoard"),
        expenseStrategyBoard: document.getElementById("expenseStrategyBoard"),
        expenseThresholdBoard: document.getElementById("expenseThresholdBoard"),
        expensePriorityLane: document.getElementById("expensePriorityLane"),
        expenseWorkloadBoard: document.getElementById("expenseWorkloadBoard"),
        habitBestMetric: document.getElementById("habitBestMetric"),
        habitBestNote: document.getElementById("habitBestNote"),
        habitTodayMetric: document.getElementById("habitTodayMetric"),
        habitTodayNote: document.getElementById("habitTodayNote"),
        habitRiskMetric: document.getElementById("habitRiskMetric"),
        habitRiskNote: document.getElementById("habitRiskNote"),
        habitSearch: document.getElementById("habitSearch"),
        habitFilter: document.getElementById("habitFilter"),
        habitInsights: document.getElementById("habitInsights"),
        habitQualityBoard: document.getElementById("habitQualityBoard"),
        habitStrategyBoard: document.getElementById("habitStrategyBoard"),
        habitStreakBoard: document.getElementById("habitStreakBoard"),
        habitRecoveryLane: document.getElementById("habitRecoveryLane"),
        habitWorkloadBoard: document.getElementById("habitWorkloadBoard"),
        habitGroups: document.getElementById("habitGroups"),
        profileInsights: document.getElementById("profileInsights"),
        profileGoalMetric: document.getElementById("profileGoalMetric"),
        profileGoalNote: document.getElementById("profileGoalNote"),
        profileEnergyMetric: document.getElementById("profileEnergyMetric"),
        profileEnergyNote: document.getElementById("profileEnergyNote"),
        profileDataMetric: document.getElementById("profileDataMetric"),
        profileDataNote: document.getElementById("profileDataNote"),
        profileIdentityBoard: document.getElementById("profileIdentityBoard"),
        profileStrategyBoard: document.getElementById("profileStrategyBoard"),
        profileBalanceBoard: document.getElementById("profileBalanceBoard"),
        profileOwnershipBoard: document.getElementById("profileOwnershipBoard"),
        exportDataButton: document.getElementById("exportDataButton"),
        resetDataButton: document.getElementById("resetDataButton"),
        toastHost: document.getElementById("toastHost"),
        heroFocus: document.getElementById("heroFocus"),
        heroSubtext: document.getElementById("heroSubtext"),
        viewTitle: document.getElementById("viewTitle"),
        pendingTasksMetric: document.getElementById("pendingTasksMetric"),
        pendingTasksNote: document.getElementById("pendingTasksNote"),
        budgetUsageMetric: document.getElementById("budgetUsageMetric"),
        budgetUsageNote: document.getElementById("budgetUsageNote"),
        habitMomentumMetric: document.getElementById("habitMomentumMetric"),
        habitMomentumNote: document.getElementById("habitMomentumNote"),
        alertsMetric: document.getElementById("alertsMetric"),
        alertsNote: document.getElementById("alertsNote"),
        reminderStatus: document.getElementById("reminderStatus"),
        monitorStatus: document.getElementById("monitorStatus"),
        monitorSummary: document.getElementById("monitorSummary"),
        navLinks: [...document.querySelectorAll(".nav-link")],
        views: [...document.querySelectorAll(".view")]
    };
}

function loadState() {
    const fallback = {
        activeView: "dashboard",
        profile: null,
        tasks: [],
        expenses: [],
        habits: [],
        alerts: [],
        activity: []
    };

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return normalizeState({ ...fallback, ...JSON.parse(raw) });
        }

        for (const legacyKey of LEGACY_STORAGE_KEYS) {
            const legacyRaw = localStorage.getItem(legacyKey);
            if (!legacyRaw) {
                continue;
            }
            const migrated = normalizeState({ ...fallback, ...JSON.parse(legacyRaw) });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            return migrated;
        }

        return fallback;
    } catch (error) {
        return fallback;
    }
}

function saveState() {
    persistLocalState();
    scheduleRemoteSave();
}

function normalizeState(input) {
    return {
        activeView: VIEW_TITLES[input.activeView] ? input.activeView : "dashboard",
        profile: input.profile || null,
        tasks: Array.isArray(input.tasks) ? input.tasks : [],
        expenses: Array.isArray(input.expenses) ? input.expenses : [],
        habits: Array.isArray(input.habits) ? input.habits : [],
        alerts: Array.isArray(input.alerts) ? input.alerts : [],
        activity: Array.isArray(input.activity) ? input.activity : []
    };
}

function persistLocalState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scheduleRemoteSave() {
    if (!hasHydratedFromServer) {
        return;
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        pushStateToServer().catch((error) => console.error(error));
    }, 250);
}

async function hydrateFromServer() {
    try {
        const response = await fetch(API_STATE_URL);
        if (!response.ok) {
            hasHydratedFromServer = true;
            return;
        }

        const payload = await response.json();
        const remoteState = payload?.state ? normalizeState(payload.state) : null;

        if (remoteState && hasMeaningfulState(remoteState)) {
            Object.assign(state, remoteState);
            persistLocalState();
        } else if (hasMeaningfulState(state)) {
            hasHydratedFromServer = true;
            await pushStateToServer();
            return;
        }
    } catch (error) {
        console.error("Server hydration failed:", error.message);
    }

    hasHydratedFromServer = true;
}

async function pushStateToServer() {
    const response = await fetch(API_STATE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state })
    });
    if (!response.ok) {
        throw new Error("State sync failed.");
    }
}

function hasMeaningfulState(candidate) {
    return Boolean(
        candidate.profile
        || (candidate.tasks && candidate.tasks.length)
        || (candidate.expenses && candidate.expenses.length)
        || (candidate.habits && candidate.habits.length)
        || (candidate.activity && candidate.activity.length)
    );
}

function bindNavigation() {
    els.navLinks.forEach((button) => {
        button.addEventListener("click", () => setActiveView(button.dataset.view));
    });

    window.addEventListener("hashchange", syncViewFromHash);
    document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-view-target]");
        if (target) {
            setActiveView(target.dataset.viewTarget);
        }
    });
}

function bindControls() {
    [
        els.taskSearch,
        els.taskStatusFilter,
        els.taskPriorityFilter,
        els.taskSort,
        els.expenseSearch,
        els.expenseCategoryFilter,
        els.expenseSort,
        els.habitSearch,
        els.habitFilter
    ].forEach((control) => {
        if (!control) {
            return;
        }
        const eventName = control.tagName === "INPUT" ? "input" : "change";
        control.addEventListener(eventName, render);
    });

    els.taskCancelEditButton.addEventListener("click", resetTaskForm);
    els.expenseCancelEditButton.addEventListener("click", resetExpenseForm);
    els.habitCancelEditButton.addEventListener("click", resetHabitForm);
    els.exportDataButton.addEventListener("click", exportData);
    els.resetDataButton.addEventListener("click", resetData);
}

function syncViewFromHash() {
    const raw = window.location.hash.replace("#", "");
    const nextView = VIEW_TITLES[raw] ? raw : state.activeView || "dashboard";
    setActiveView(nextView, false);
}

function setActiveView(view, pushHash = true) {
    state.activeView = VIEW_TITLES[view] ? view : "dashboard";
    document.body.dataset.activeView = state.activeView;

    els.navLinks.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.view === state.activeView);
    });

    els.views.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.viewPanel === state.activeView);
    });

    els.viewTitle.textContent = VIEW_TITLES[state.activeView];

    if (pushHash && window.location.hash !== `#${state.activeView}`) {
        history.replaceState(null, "", `#${state.activeView}`);
    }

    saveState();
}

function bindForms() {
    bindForm(els.profileForm, () => {
        const data = new FormData(els.profileForm);
        state.profile = {
            name: readText(data.get("name"), 2),
            email: validateEmail(readText(data.get("email"), 5)),
            preferences: readText(data.get("preferences"), 2),
            goal: readOptionalText(data.get("goal")),
            energyMode: readOptionalText(data.get("energyMode"))
        };
        addActivity("Profile updated", "Saved profile details and preferences.");
        showToast("Profile updated.", "info");
        els.profileForm.reset();
    });

    bindForm(els.taskForm, () => {
        const data = new FormData(els.taskForm);
        const priority = requirePriority(data.get("priority"));
        const taskTitle = readText(data.get("title"), 2);
        const existingId = readOptionalText(data.get("taskId"));
        const taskPayload = {
            id: existingId || crypto.randomUUID(),
            title: taskTitle,
            notes: readOptionalText(data.get("notes")),
            deadline: requireDate(data.get("deadline")),
            priority,
            status: "PENDING",
            type: priority >= 4 ? "URGENT" : "NORMAL",
            createdAt: todayIso()
        };

        if (existingId) {
            const existingTask = findItem(state.tasks, existingId, "Task");
            taskPayload.status = existingTask.status;
            taskPayload.createdAt = existingTask.createdAt;
            const index = state.tasks.findIndex((item) => item.id === existingId);
            state.tasks[index] = taskPayload;
            addActivity("Task updated", `Updated "${taskTitle}".`);
            showToast("Task updated.", "info");
        } else {
            state.tasks.unshift(taskPayload);
            addActivity("Task added", `Created "${taskTitle}".`);
            showToast("Task added.", priority >= 4 ? "warn" : "info");
        }

        resetTaskForm();
    });

    bindForm(els.expenseForm, () => {
        const data = new FormData(els.expenseForm);
        const expenseTitle = readText(data.get("title"), 2);
        const existingId = readOptionalText(data.get("expenseId"));
        const expensePayload = {
            id: existingId || crypto.randomUUID(),
            title: expenseTitle,
            category: readText(data.get("category"), 2),
            amount: requirePositiveNumber(data.get("amount")),
            threshold: requirePositiveNumber(data.get("threshold")),
            createdAt: readOptionalText(data.get("date")) || todayIso()
        };

        if (existingId) {
            const index = state.expenses.findIndex((item) => item.id === existingId);
            if (index === -1) {
                throw new Error("Expense not found.");
            }
            state.expenses[index] = expensePayload;
            addActivity("Expense updated", `Updated "${expenseTitle}".`);
            showToast("Expense updated.", "info");
        } else {
            state.expenses.unshift(expensePayload);
            addActivity("Expense logged", `Logged "${expenseTitle}".`);
            showToast("Expense logged.", "info");
        }

        resetExpenseForm();
    });

    bindForm(els.habitForm, () => {
        const data = new FormData(els.habitForm);
        const targetFrequency = requirePositiveInt(data.get("targetFrequency"), "Habit target must be at least 1.");
        const habitName = readText(data.get("name"), 2);
        const existingId = readOptionalText(data.get("habitId"));
        const habitPayload = {
            id: existingId || crypto.randomUUID(),
            name: habitName,
            cue: readOptionalText(data.get("cue")),
            targetFrequency,
            completionDates: [],
            currentStreak: 0
        };

        if (existingId) {
            const existingHabit = findItem(state.habits, existingId, "Habit");
            habitPayload.completionDates = existingHabit.completionDates;
            habitPayload.currentStreak = existingHabit.currentStreak;
            const index = state.habits.findIndex((item) => item.id === existingId);
            state.habits[index] = habitPayload;
            addActivity("Habit updated", `Updated "${habitName}".`);
            showToast("Habit updated.", "info");
        } else {
            state.habits.unshift(habitPayload);
            addActivity("Habit added", `Started tracking "${habitName}".`);
            showToast("Habit added.", "info");
        }

        resetHabitForm();
    });
}

function bindForm(form, handler) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
            handler();
            saveState();
            render();
        } catch (error) {
            showToast(error.message || "Something went wrong.", "warn");
        }
    });
}

function bindActions() {
    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-action]");
        if (!trigger) {
            return;
        }

        try {
            const { action, id } = trigger.dataset;

            if (action === "edit-task") {
                const task = findItem(state.tasks, id, "Task");
                populateTaskForm(task);
                setActiveView("tasks");
                showToast("Task loaded for editing.", "info");
            }

            if (action === "toggle-task") {
                const task = findItem(state.tasks, id, "Task");
                task.status = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
                addActivity(task.status === "COMPLETED" ? "Task completed" : "Task reopened", `${task.title} is now ${task.status.toLowerCase()}.`);
                showToast(task.status === "COMPLETED" ? "Task completed." : "Task reopened.", "info");
            }

            if (action === "delete-task") {
                const task = findItem(state.tasks, id, "Task");
                state.tasks = state.tasks.filter((item) => item.id !== id);
                addActivity("Task deleted", `Removed "${task.title}".`);
                showToast("Task deleted.", "info");
            }

            if (action === "delete-expense") {
                const expense = findItem(state.expenses, id, "Expense");
                state.expenses = state.expenses.filter((item) => item.id !== id);
                addActivity("Expense deleted", `Removed "${expense.title}".`);
                showToast("Expense deleted.", "info");
            }

            if (action === "edit-expense") {
                const expense = findItem(state.expenses, id, "Expense");
                populateExpenseForm(expense);
                setActiveView("expenses");
                showToast("Expense loaded for editing.", "info");
            }

            if (action === "complete-habit") {
                const habit = findItem(state.habits, id, "Habit");
                markHabitComplete(habit);
            }

            if (action === "edit-habit") {
                const habit = findItem(state.habits, id, "Habit");
                populateHabitForm(habit);
                setActiveView("habits");
                showToast("Habit loaded for editing.", "info");
            }

            if (action === "delete-habit") {
                const habit = findItem(state.habits, id, "Habit");
                state.habits = state.habits.filter((item) => item.id !== id);
                addActivity("Habit deleted", `Removed "${habit.name}".`);
                showToast("Habit deleted.", "info");
            }

            saveState();
            render();
        } catch (error) {
            showToast(error.message || "Action failed.", "warn");
        }
    });
}

function render() {
    const analytics = buildAnalytics();
    renderProfile(analytics);
    renderTasks(analytics);
    renderExpenses(analytics);
    renderHabits(analytics);
    renderSuggestions(analytics);
    renderAlerts(analytics);
    renderDashboard(analytics);
    renderActivity();
}

function renderDashboard(analytics) {
    els.pendingTasksMetric.textContent = String(analytics.pendingCount);
    els.pendingTasksNote.textContent = analytics.pendingCount >= 5
        ? "Workload is climbing fast."
        : analytics.pendingCount > 0
            ? `${analytics.urgentPendingCount} urgent item(s) in the queue.`
            : "No task pressure detected.";

    els.budgetUsageMetric.textContent = `${analytics.budgetUsage.toFixed(0)}%`;
    els.budgetUsageNote.textContent = analytics.expenses.length
        ? `${formatCurrency(analytics.totalSpending)} spent across ${analytics.expenses.length} entries.`
        : "No expenses logged yet.";

    els.habitMomentumMetric.textContent = String(analytics.bestHabitStreak);
    els.habitMomentumNote.textContent = analytics.habits.length
        ? `${analytics.inactiveHabits} inactive habit(s), ${analytics.strongHabits} strong streak(s).`
        : "No streak data yet.";

    els.alertsMetric.textContent = String(analytics.alerts.length);
    els.alertsNote.textContent = analytics.alerts.length
        ? "System is detecting pressure points."
        : "System is calm right now.";

    const suggestions = buildSuggestions(analytics);
    const topSuggestion = suggestions[0];
    els.heroFocus.textContent = topSuggestion ? topSuggestion.title : "System Ready";
    els.heroSubtext.textContent = topSuggestion
        ? topSuggestion.message
        : "Create a task, expense, or habit to activate your personalized operating system.";
    els.monitorSummary.textContent = `${analytics.alerts.length} active alert(s). ${analytics.pendingCount} pending task(s), ${analytics.habits.length} habit(s), ${analytics.expenses.length} expense(s).`;

    const summaryItems = [
        {
            title: "Task Health",
            message: analytics.overdueTasks.length
                ? `${analytics.overdueTasks.length} overdue and ${analytics.dueTodayTasks.length} due today.`
                : analytics.pendingCount
                    ? `${analytics.pendingCount} open tasks with ${analytics.urgentPendingCount} urgent.`
                    : "No pending task pressure."
        },
        {
            title: "Budget Status",
            message: analytics.expenses.length
                ? `${analytics.budgetUsage.toFixed(1)}% of threshold used across ${analytics.expenses.length} expenses.`
                : "No spending data yet."
        },
        {
            title: "Habit Rhythm",
            message: analytics.habits.length
                ? `${analytics.bestHabitStreak} best streak, ${analytics.inactiveHabits} inactive habit(s).`
                : "No habits tracked yet."
        },
        {
            title: "Guidance",
            message: topSuggestion ? topSuggestion.message : "Your advisor feed will appear here as data grows."
        }
    ];

    els.summaryCards.innerHTML = summaryItems.map((item) => summaryCardTemplate(item.title, item.message)).join("");
    renderPriorityQueue(analytics);
    renderHealth(analytics);
    renderExecutionMap(analytics);
    renderSpendingBreakdown(analytics.expenseCategories);
    renderHabitMomentumBoard(analytics);
    renderFocusPlan(analytics);
    renderWeeklyActivityChart(analytics);
    renderModuleMixChart(analytics);
}

function renderTasks(analytics) {
    els.taskOpenMetric.textContent = String(analytics.pendingCount);
    els.taskOpenNote.textContent = analytics.pendingCount ? "Pending work is active." : "No active task load.";
    els.taskDueSoonMetric.textContent = String(analytics.dueSoonTasks.length);
    els.taskDueSoonNote.textContent = analytics.dueSoonTasks.length ? "Deadlines are approaching." : "No deadline cluster.";
    els.taskUrgentMetric.textContent = String(analytics.urgentPendingCount);
    els.taskUrgentNote.textContent = analytics.urgentPendingCount ? "Urgent queue needs attention." : "Urgent queue is calm.";

    const filteredTasks = filterTasks(analytics.tasks);
    els.taskList.className = filteredTasks.length ? "card-list" : "card-list empty-state";
    els.taskList.innerHTML = filteredTasks.length
        ? filteredTasks.map((task) => {
            const overdue = task.status !== "COMPLETED" && daysUntil(task.deadline) < 0;
            const dueToday = task.status !== "COMPLETED" && daysUntil(task.deadline) === 0;
            return `
                <article class="card-item">
                    <div class="card-item-top">
                        <div>
                            <h4>${escapeHtml(task.title)}</h4>
                            <p class="muted">Due ${formatDate(task.deadline)}${task.notes ? ` • ${escapeHtml(task.notes)}` : ""}</p>
                        </div>
                        <div class="pill-row">
                            <span class="pill ${task.type === "URGENT" ? "urgent" : ""}">${task.type}</span>
                            <span class="pill ${task.status === "COMPLETED" ? "completed" : overdue || dueToday ? "warning" : ""}">${task.status}</span>
                        </div>
                    </div>
                    <div class="pill-row">
                        <span class="pill">Priority ${task.priority}</span>
                        ${overdue ? '<span class="pill warning">Overdue</span>' : ""}
                        ${dueToday ? '<span class="pill warning">Due Today</span>' : ""}
                    </div>
                    <div class="action-row">
                        <button type="button" class="ghost-button" data-action="edit-task" data-id="${task.id}">Edit</button>
                        <button type="button" class="ghost-button" data-action="toggle-task" data-id="${task.id}">${task.status === "COMPLETED" ? "Mark Pending" : "Mark Complete"}</button>
                        <button type="button" class="secondary-button" data-action="delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </article>
            `;
        }).join("")
        : "No tasks match the current filters.";

    renderTaskInsights(analytics);
    renderTaskTimeline(analytics);
    renderTaskPriorityLane(analytics);
    renderTaskWorkloadBoard(analytics);
    renderTaskGroups(analytics);
}

function renderExpenses(analytics) {
    const topCategory = analytics.expenseCategories[0];
    els.expenseTotalMetric.textContent = formatCurrency(analytics.totalSpending);
    els.expenseTotalNote.textContent = analytics.expenses.length ? `${analytics.expenses.length} expense(s) recorded.` : "No expenses recorded.";
    els.expenseAverageMetric.textContent = formatCurrency(analytics.averageExpense);
    els.expenseAverageNote.textContent = analytics.expenses.length ? "Average per expense entry." : "No spending pattern yet.";
    els.expenseTopCategoryMetric.textContent = topCategory ? topCategory.category : "-";
    els.expenseTopCategoryNote.textContent = topCategory ? `${formatCurrency(topCategory.amount)} spent here.` : "No category pressure.";

    syncExpenseCategoryFilter(analytics.expenseCategories);

    const filteredExpenses = filterExpenses(analytics.expenses);
    els.expenseList.className = filteredExpenses.length ? "card-list" : "card-list empty-state";
    els.expenseList.innerHTML = filteredExpenses.length
        ? filteredExpenses.map((expense) => `
            <article class="card-item">
                <div class="card-item-top">
                    <div>
                        <h4>${escapeHtml(expense.title)}</h4>
                        <p class="muted">${escapeHtml(expense.category)} on ${formatDate(expense.createdAt)}</p>
                    </div>
                    <span class="pill ${expense.amount > expense.threshold ? "warning" : ""}">${formatCurrency(expense.amount)}</span>
                </div>
                <div class="pill-row">
                    <span class="pill">Threshold ${formatCurrency(expense.threshold)}</span>
                    <span class="pill">${expense.amount > expense.threshold ? "Above limit" : "Within limit"}</span>
                </div>
                <div class="action-row">
                    <button type="button" class="ghost-button" data-action="edit-expense" data-id="${expense.id}">Edit</button>
                    <button type="button" class="secondary-button" data-action="delete-expense" data-id="${expense.id}">Delete</button>
                </div>
            </article>
        `).join("")
        : "No expenses match the current filters.";

    const expenseInsights = buildExpenseInsights(analytics);
    els.expenseInsights.className = expenseInsights.length ? "insight-list" : "insight-list empty-state";
    els.expenseInsights.innerHTML = expenseInsights.length ? expenseInsights.map(renderInsightCard).join("") : "No expense insights yet.";
    els.expenseCategoryBoard.className = analytics.expenseCategories.length ? "bar-list" : "bar-list empty-state";
    els.expenseCategoryBoard.innerHTML = analytics.expenseCategories.length ? analytics.expenseCategories.map(renderCategoryBar).join("") : "No expense data yet.";
    renderExpenseStrategy(analytics);
    renderExpenseThresholdBoard(analytics);
    renderExpensePriorityLane(analytics);
    renderExpenseWorkloadBoard(analytics);
}

function renderExpenseStrategy(analytics) {
    const items = [];
    if (analytics.expenses.length) {
        const topCategory = analytics.expenseCategories[0];
        items.push(low("Top category", `${topCategory.category} accounts for the biggest share of logged spend.`));
        if (analytics.budgetUsage >= 100) {
            items.push(high("Threshold crossed", `Budget usage is ${analytics.budgetUsage.toFixed(1)}%. Cut optional spend immediately.`));
        } else if (analytics.budgetUsage >= 80) {
            items.push(medium("Threshold pressure", `You are at ${analytics.budgetUsage.toFixed(1)}% of budget threshold.`));
        }
        items.push(low("Average expense", `Average entry is ${formatCurrency(analytics.averageExpense)}.`));
    }

    els.expenseStrategyBoard.className = items.length ? "insight-list" : "insight-list empty-state";
    els.expenseStrategyBoard.innerHTML = items.length ? items.map(renderInsightCard).join("") : "No expense strategy yet.";
}

function renderExpenseThresholdBoard(analytics) {
    const data = analytics.expenses
        .slice()
        .sort((a, b) => (b.amount / b.threshold) - (a.amount / a.threshold))
        .slice(0, 5);

    els.expenseThresholdBoard.className = data.length ? "bar-list" : "bar-list empty-state";
    els.expenseThresholdBoard.innerHTML = data.length
        ? data.map((expense) => {
            const usage = Math.min(160, (expense.amount / expense.threshold) * 100);
            return `
                <article class="bar-item">
                    <div class="bar-row">
                        <strong>${escapeHtml(expense.title)}</strong>
                        <span class="bar-amount">${usage.toFixed(1)}%</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${Math.min(100, usage)}%"></div>
                    </div>
                    <span class="bar-meta">${formatCurrency(expense.amount)} against ${formatCurrency(expense.threshold)}</span>
                </article>
            `;
        }).join("")
        : "No threshold view yet.";
}

function renderExpensePriorityLane(analytics) {
    const priorityItems = [];

    analytics.expenses
        .filter((expense) => expense.amount > expense.threshold)
        .slice(0, 3)
        .forEach((expense) => {
            priorityItems.push({
                title: expense.title,
                detail: `This entry crossed its threshold in ${expense.category}.`,
                badge: "Over limit"
            });
        });

    if (!priorityItems.length && analytics.expenseCategories.length) {
        const topCategory = analytics.expenseCategories[0];
        priorityItems.push({
            title: topCategory.category,
            detail: `This category currently leads spending at ${formatCurrency(topCategory.amount)}.`,
            badge: "Top spend"
        });
    }

    els.expensePriorityLane.className = priorityItems.length ? "card-list" : "card-list empty-state";
    els.expensePriorityLane.innerHTML = priorityItems.length
        ? priorityItems.map((item) => `
            <article class="task-compact-card">
                <h5>${escapeHtml(item.title)}</h5>
                <p class="muted">${escapeHtml(item.detail)}</p>
                <span class="pill warning">${escapeHtml(item.badge)}</span>
            </article>
        `).join("")
        : "No budget priorities yet.";
}

function renderExpenseWorkloadBoard(analytics) {
    const items = [
        { title: "Logged Entries", message: `${analytics.expenses.length} spending record(s) available.` },
        { title: "Threshold Usage", message: `${analytics.budgetUsage.toFixed(1)}% of the highest threshold used.` },
        { title: "Average Entry", message: `${formatCurrency(analytics.averageExpense)} per expense on average.` },
        { title: "Category Spread", message: `${analytics.expenseCategories.length} active category bucket(s).` }
    ];
    els.expenseWorkloadBoard.innerHTML = items.map((item) => summaryCardTemplate(item.title, item.message)).join("");
}

function renderTaskInsights(analytics) {
    const insights = [];
    if (analytics.overdueTasks.length) {
        insights.push(high("Overdue backlog", `${analytics.overdueTasks.length} task(s) are past deadline. Clear the shortest one first.`));
    }
    if (analytics.dueTodayTasks.length) {
        insights.push(medium("Today is deadline-heavy", `${analytics.dueTodayTasks.length} task(s) are due today. Reserve focused time now.`));
    }
    if (analytics.pendingCount && !analytics.overdueTasks.length && !analytics.dueTodayTasks.length) {
        insights.push(low("Queue is under control", `${analytics.pendingCount} active task(s) are open with manageable pressure.`));
    }
    if (analytics.completionRate > 0) {
        insights.push(low("Completion pulse", `${analytics.completionRate.toFixed(1)}% of all tasks are completed.`));
    }

    els.taskInsights.className = insights.length ? "insight-list" : "insight-list empty-state";
    els.taskInsights.innerHTML = insights.length ? insights.map(renderInsightCard).join("") : "No task insights yet.";
}

function renderTaskTimeline(analytics) {
    const totalPending = Math.max(1, analytics.pendingCount);
    const segments = [
        { label: "Overdue", count: analytics.overdueTasks.length },
        { label: "Today", count: analytics.dueTodayTasks.length },
        { label: "Soon", count: analytics.dueSoonTasks.length },
        {
            label: "Later",
            count: Math.max(0, analytics.pendingCount - analytics.overdueTasks.length - analytics.dueTodayTasks.length - analytics.dueSoonTasks.length)
        }
    ].filter((item) => item.count > 0);

    els.taskTimelineBoard.className = segments.length ? "bar-list" : "bar-list empty-state";
    els.taskTimelineBoard.innerHTML = segments.length
        ? segments.map((segment) => `
            <article class="bar-item">
                <div class="bar-row">
                    <strong>${escapeHtml(segment.label)}</strong>
                    <span class="bar-amount">${segment.count} task(s)</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" style="width:${(segment.count / totalPending) * 100}%"></div>
                </div>
                <span class="bar-meta">${((segment.count / totalPending) * 100).toFixed(1)}% of active queue</span>
            </article>
        `).join("")
        : "No task distribution yet.";
}

function renderTaskPriorityLane(analytics) {
    const priorityTasks = analytics.tasks
        .filter((task) => task.status !== "COMPLETED")
        .sort((a, b) => {
            const urgencyDiff = daysUntil(a.deadline) - daysUntil(b.deadline);
            if (urgencyDiff !== 0) {
                return urgencyDiff;
            }
            return b.priority - a.priority;
        })
        .slice(0, 4);

    els.taskPriorityLane.className = priorityTasks.length ? "card-list" : "card-list empty-state";
    els.taskPriorityLane.innerHTML = priorityTasks.length
        ? priorityTasks.map((task) => `
            <article class="task-compact-card">
                <h5>${escapeHtml(task.title)}</h5>
                <p class="muted">Due ${formatDate(task.deadline)} • Priority ${task.priority}</p>
                <div class="pill-row">
                    <span class="pill ${task.type === "URGENT" ? "urgent" : ""}">${task.type}</span>
                    <button type="button" class="ghost-button" data-action="edit-task" data-id="${task.id}">Edit</button>
                </div>
            </article>
        `).join("")
        : "No priority tasks yet.";
}

function renderTaskWorkloadBoard(analytics) {
    const items = [
        { title: "Open Queue", message: `${analytics.pendingCount} pending task(s) currently active.` },
        { title: "Urgent Pressure", message: `${analytics.urgentPendingCount} urgent item(s) require elevated attention.` },
        { title: "Completed", message: `${analytics.completedTasks.length} task(s) already finished.` },
        { title: "Deadlines", message: `${analytics.dueSoonTasks.length} task(s) are approaching within 48 hours.` }
    ];
    els.taskWorkloadBoard.innerHTML = items.map((item) => summaryCardTemplate(item.title, item.message)).join("");
}

function renderTaskGroups(analytics) {
    const groups = [
        { key: "Overdue", tasks: analytics.overdueTasks, empty: "Nothing overdue." },
        { key: "Today", tasks: analytics.dueTodayTasks, empty: "Nothing due today." },
        {
            key: "Upcoming",
            tasks: analytics.tasks.filter((task) => task.status !== "COMPLETED" && daysUntil(task.deadline) > 0),
            empty: "No upcoming tasks."
        },
        { key: "Completed", tasks: analytics.completedTasks, empty: "Nothing completed yet." }
    ];

    els.taskGroups.className = "task-groups";
    els.taskGroups.innerHTML = groups.map((group) => `
        <article class="task-group-column">
            <div class="task-group-head">
                <h4>${escapeHtml(group.key)}</h4>
                <span class="pill">${group.tasks.length}</span>
            </div>
            ${group.tasks.length
                ? group.tasks.slice(0, 4).map((task) => `
                    <article class="task-compact-card">
                        <h5>${escapeHtml(task.title)}</h5>
                        <p class="muted">${task.status === "COMPLETED" ? "Finished" : `Due ${formatDate(task.deadline)}`}</p>
                    </article>
                `).join("")
                : `<div class="task-compact-card empty-state">${escapeHtml(group.empty)}</div>`}
        </article>
    `).join("");
}

function renderHabits(analytics) {
    els.habitBestMetric.textContent = String(analytics.bestHabitStreak);
    els.habitBestNote.textContent = analytics.habits.length ? "Best current streak in the system." : "No streak momentum yet.";
    els.habitTodayMetric.textContent = String(analytics.habitsCompletedToday);
    els.habitTodayNote.textContent = analytics.habitsCompletedToday ? "Habits checked off today." : "Nothing checked off today.";
    els.habitRiskMetric.textContent = String(analytics.inactiveHabits);
    els.habitRiskNote.textContent = analytics.inactiveHabits ? "These routines need a restart." : "No inactive routines right now.";

    const filteredHabits = filterHabits(analytics.habits);
    els.habitList.className = filteredHabits.length ? "card-list" : "card-list empty-state";
    els.habitList.innerHTML = filteredHabits.length
        ? filteredHabits.map((habit) => `
            <article class="card-item">
                <div class="card-item-top">
                    <div>
                        <h4>${escapeHtml(habit.name)}</h4>
                        <p class="muted">Target ${habit.targetFrequency} times / week${habit.cue ? ` • Cue: ${escapeHtml(habit.cue)}` : ""}</p>
                    </div>
                    <span class="pill ${habit.currentStreak >= 3 ? "completed" : habitDaysSinceLast(habit) >= 3 ? "warning" : ""}">${habit.currentStreak} day streak</span>
                </div>
                <div class="pill-row">
                    <span class="pill">${habit.completionDates.length} completions</span>
                    <span class="pill">${habitLastSeenText(habit)}</span>
                </div>
                <div class="action-row">
                    <button type="button" class="ghost-button" data-action="edit-habit" data-id="${habit.id}">Edit</button>
                    <button type="button" class="ghost-button" data-action="complete-habit" data-id="${habit.id}">Mark Today</button>
                    <button type="button" class="secondary-button" data-action="delete-habit" data-id="${habit.id}">Delete</button>
                </div>
            </article>
        `).join("")
        : "No habits match the current filters.";

    const habitInsights = buildHabitInsights(analytics);
    els.habitInsights.className = habitInsights.length ? "insight-list" : "insight-list empty-state";
    els.habitInsights.innerHTML = habitInsights.length ? habitInsights.map(renderInsightCard).join("") : "No habit insights yet.";
    els.habitQualityBoard.className = analytics.habits.length ? "habit-board" : "habit-board empty-state";
    els.habitQualityBoard.innerHTML = analytics.habits.length
        ? analytics.habits.slice(0, 6).map((habit) => `
            <article class="habit-momentum-card">
                <div class="card-item-top">
                    <strong>${escapeHtml(habit.name)}</strong>
                    <span class="pill ${habit.currentStreak >= 3 ? "completed" : habitDaysSinceLast(habit) >= 3 ? "warning" : ""}">${habit.currentStreak} streak</span>
                </div>
                <p>${habit.completionDates.length} completion(s), target ${habit.targetFrequency}/week.</p>
                <span class="focus-badge">${escapeHtml(habitLastSeenText(habit))}</span>
            </article>
        `).join("")
        : "No habits tracked yet.";
    renderHabitStrategy(analytics);
    renderHabitStreakBoard(analytics);
    renderHabitRecoveryLane(analytics);
    renderHabitWorkloadBoard(analytics);
    renderHabitGroups(analytics);
}

function renderHabitStrategy(analytics) {
    const items = [];
    if (analytics.habits.length) {
        if (analytics.inactiveHabits > 0) {
            items.push(medium("Recovery needed", `${analytics.inactiveHabits} habit(s) are inactive and need a restart.`));
        }
        if (analytics.bestHabitStreak > 0) {
            items.push(low("Strongest routine", `Your best active streak is ${analytics.bestHabitStreak} day(s).`));
        }
        items.push(low("Today's consistency", `${analytics.habitsCompletedToday} habit(s) have been completed today.`));
    }

    els.habitStrategyBoard.className = items.length ? "insight-list" : "insight-list empty-state";
    els.habitStrategyBoard.innerHTML = items.length ? items.map(renderInsightCard).join("") : "No habit strategy yet.";
}

function renderHabitStreakBoard(analytics) {
    const buckets = [
        { label: "0 streak", count: analytics.habits.filter((habit) => habit.currentStreak === 0).length },
        { label: "1-2 streak", count: analytics.habits.filter((habit) => habit.currentStreak >= 1 && habit.currentStreak <= 2).length },
        { label: "3-6 streak", count: analytics.habits.filter((habit) => habit.currentStreak >= 3 && habit.currentStreak <= 6).length },
        { label: "7+ streak", count: analytics.habits.filter((habit) => habit.currentStreak >= 7).length }
    ].filter((item) => item.count > 0);

    const total = Math.max(1, analytics.habits.length);
    els.habitStreakBoard.className = buckets.length ? "bar-list" : "bar-list empty-state";
    els.habitStreakBoard.innerHTML = buckets.length
        ? buckets.map((bucket) => `
            <article class="bar-item">
                <div class="bar-row">
                    <strong>${escapeHtml(bucket.label)}</strong>
                    <span class="bar-amount">${bucket.count} habit(s)</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" style="width:${(bucket.count / total) * 100}%"></div>
                </div>
                <span class="bar-meta">${((bucket.count / total) * 100).toFixed(1)}% of tracked habits</span>
            </article>
        `).join("")
        : "No streak distribution yet.";
}

function renderHabitRecoveryLane(analytics) {
    const recoveryHabits = analytics.habits
        .filter((habit) => habitDaysSinceLast(habit) >= 2)
        .sort((a, b) => habitDaysSinceLast(b) - habitDaysSinceLast(a))
        .slice(0, 4);

    els.habitRecoveryLane.className = recoveryHabits.length ? "card-list" : "card-list empty-state";
    els.habitRecoveryLane.innerHTML = recoveryHabits.length
        ? recoveryHabits.map((habit) => `
            <article class="task-compact-card">
                <h5>${escapeHtml(habit.name)}</h5>
                <p class="muted">${habitDaysSinceLast(habit)} day(s) since last completion${habit.cue ? ` • Cue: ${escapeHtml(habit.cue)}` : ""}</p>
                <div class="pill-row">
                    <span class="pill warning">Recover</span>
                    <button type="button" class="ghost-button" data-action="complete-habit" data-id="${habit.id}">Mark Today</button>
                </div>
            </article>
        `).join("")
        : "No habits need recovery right now.";
}

function renderHabitWorkloadBoard(analytics) {
    const items = [
        { title: "Tracked Habits", message: `${analytics.habits.length} routine(s) currently monitored.` },
        { title: "Completed Today", message: `${analytics.habitsCompletedToday} habit(s) checked off today.` },
        { title: "At Risk", message: `${analytics.inactiveHabits} routine(s) have gone inactive.` },
        { title: "Best Streak", message: `${analytics.bestHabitStreak} day(s) is the strongest active streak.` }
    ];
    els.habitWorkloadBoard.innerHTML = items.map((item) => summaryCardTemplate(item.title, item.message)).join("");
}

function renderHabitGroups(analytics) {
    const groups = [
        { key: "Today Done", habits: analytics.habits.filter((habit) => habit.completionDates.includes(todayIso())), empty: "No habits done today." },
        { key: "Active", habits: analytics.habits.filter((habit) => habit.currentStreak >= 1 && habitDaysSinceLast(habit) <= 1), empty: "No active habits." },
        { key: "At Risk", habits: analytics.habits.filter((habit) => habitDaysSinceLast(habit) >= 2), empty: "No habits at risk." },
        { key: "New", habits: analytics.habits.filter((habit) => habit.completionDates.length === 0), empty: "No new habits." }
    ];

    els.habitGroups.className = "task-groups";
    els.habitGroups.innerHTML = groups.map((group) => `
        <article class="task-group-column">
            <div class="task-group-head">
                <h4>${escapeHtml(group.key)}</h4>
                <span class="pill">${group.habits.length}</span>
            </div>
            ${group.habits.length
                ? group.habits.slice(0, 4).map((habit) => `
                    <article class="task-compact-card">
                        <h5>${escapeHtml(habit.name)}</h5>
                        <p class="muted">${habit.currentStreak} streak • ${habitLastSeenText(habit)}</p>
                    </article>
                `).join("")
                : `<div class="task-compact-card empty-state">${escapeHtml(group.empty)}</div>`}
        </article>
    `).join("");
}

function renderSuggestions(analytics) {
    const suggestions = buildSuggestions(analytics);
    const topSuggestion = suggestions[0];
    els.topSuggestionCard.innerHTML = topSuggestion
        ? `<p class="eyebrow">Advisor</p><h4>${escapeHtml(topSuggestion.title)}</h4><p>${escapeHtml(topSuggestion.message)}</p>`
        : `<p class="eyebrow">Advisor</p><h4>No suggestion yet.</h4>`;

    const signals = buildSignalBoard(analytics);
    els.signalBoard.innerHTML = signals.map((signal) => summaryCardTemplate(signal.title, signal.message)).join("");
    els.suggestionList.className = suggestions.length ? "insight-list" : "insight-list empty-state";
    els.suggestionList.innerHTML = suggestions.length ? suggestions.map(renderInsightCard).join("") : "No suggestions yet.";
    renderSuggestionRadar(analytics);
    renderSuggestionPriorityLane(analytics);
    renderSuggestionGroups(analytics);
    renderSuggestionActionMap(analytics);
}

function renderSuggestionRadar(analytics) {
    const radar = buildSuggestionRadarData(analytics);
    els.suggestionRadar.className = radar.length ? "bar-list" : "bar-list empty-state";
    els.suggestionRadar.innerHTML = radar.length ? radar.map(renderSignalBar).join("") : "No recommendation signals yet.";
}

function renderSuggestionPriorityLane(analytics) {
    const items = buildSuggestionPriorityLane(analytics);
    els.suggestionPriorityLane.className = items.length ? "card-list" : "card-list empty-state";
    els.suggestionPriorityLane.innerHTML = items.length
        ? items.map((item) => `
            <article class="task-compact-card">
                <h5>${escapeHtml(item.title)}</h5>
                <p class="muted">${escapeHtml(item.detail)}</p>
                <div class="pill-row">
                    <span class="pill ${item.level === "high" ? "warning" : ""}">${escapeHtml(item.badge)}</span>
                    <button type="button" class="ghost-button" data-view-target="${item.view}">Open ${escapeHtml(VIEW_TITLES[item.view])}</button>
                </div>
            </article>
        `).join("")
        : "No priority guidance yet.";
}

function renderSuggestionGroups(analytics) {
    const groups = buildSuggestionGroups(analytics);
    els.suggestionGroups.className = "task-groups";
    els.suggestionGroups.innerHTML = groups.map((group) => `
        <article class="task-group-column">
            <div class="task-group-head">
                <h4>${escapeHtml(group.title)}</h4>
                <span class="pill">${group.items.length}</span>
            </div>
            ${group.items.length
                ? group.items.map((item) => `
                    <article class="task-compact-card">
                        <h5>${escapeHtml(item.title)}</h5>
                        <p class="muted">${escapeHtml(item.message)}</p>
                    </article>
                `).join("")
                : `<div class="task-compact-card empty-state">No guidance in this area.</div>`}
        </article>
    `).join("");
}

function renderSuggestionActionMap(analytics) {
    const items = buildSuggestionActionMap(analytics);
    els.suggestionActionMap.className = items.length ? "insight-list" : "insight-list empty-state";
    els.suggestionActionMap.innerHTML = items.length ? items.map(renderInsightCardWithBadge).join("") : "No action map yet.";
}

function renderProfile(analytics) {
    if (!state.profile) {
        els.profileCard.className = "profile-card empty-state";
        els.profileCard.textContent = "No profile saved yet.";
        els.profileInsights.className = "insight-list empty-state";
        els.profileInsights.textContent = "Profile insights will appear here.";
        els.profileGoalMetric.textContent = "-";
        els.profileGoalNote.textContent = "No primary goal saved yet.";
        els.profileEnergyMetric.textContent = "-";
        els.profileEnergyNote.textContent = "No operating mode selected.";
        els.profileDataMetric.textContent = "0";
        els.profileDataNote.textContent = "No records in the system yet.";
        els.profileIdentityBoard.innerHTML = "";
        els.profileStrategyBoard.className = "insight-list empty-state";
        els.profileStrategyBoard.textContent = "No profile strategy yet.";
        els.profileBalanceBoard.className = "bar-list empty-state";
        els.profileBalanceBoard.textContent = "No personal balance data yet.";
        els.profileOwnershipBoard.className = "insight-list empty-state";
        els.profileOwnershipBoard.textContent = "No ownership information yet.";
        return;
    }

    els.profileCard.className = "profile-card";
    els.profileCard.innerHTML = `
        <h4>${escapeHtml(state.profile.name)}</h4>
        <p>${escapeHtml(state.profile.email)}</p>
        <p class="muted">Preference: ${escapeHtml(state.profile.preferences)}</p>
        ${state.profile.goal ? `<p class="muted">Goal: ${escapeHtml(state.profile.goal)}</p>` : ""}
        ${state.profile.energyMode ? `<p class="muted">Energy mode: ${escapeHtml(state.profile.energyMode)}</p>` : ""}
    `;

    const totalRecords = analytics.tasks.length + analytics.expenses.length + analytics.habits.length;
    els.profileGoalMetric.textContent = state.profile.goal ? truncateMetric(state.profile.goal) : "-";
    els.profileGoalNote.textContent = state.profile.goal ? "Primary direction currently saved." : "No primary goal saved yet.";
    els.profileEnergyMetric.textContent = state.profile.energyMode || "-";
    els.profileEnergyNote.textContent = state.profile.energyMode ? "Current operating mode." : "No operating mode selected.";
    els.profileDataMetric.textContent = String(totalRecords);
    els.profileDataNote.textContent = `${analytics.tasks.length} tasks, ${analytics.expenses.length} expenses, ${analytics.habits.length} habits.`;

    els.profileIdentityBoard.innerHTML = buildProfileIdentityCards(analytics)
        .map((item) => summaryCardTemplate(item.title, item.message))
        .join("");

    const strategy = buildProfileStrategy(analytics);
    els.profileStrategyBoard.className = strategy.length ? "insight-list" : "insight-list empty-state";
    els.profileStrategyBoard.innerHTML = strategy.length ? strategy.map(renderInsightCard).join("") : "No profile strategy yet.";

    const balance = buildProfileBalance(analytics);
    els.profileBalanceBoard.className = balance.length ? "bar-list" : "bar-list empty-state";
    els.profileBalanceBoard.innerHTML = balance.length ? balance.map(renderSignalBar).join("") : "No personal balance data yet.";

    const ownership = buildProfileOwnership(analytics);
    els.profileOwnershipBoard.className = ownership.length ? "insight-list" : "insight-list empty-state";
    els.profileOwnershipBoard.innerHTML = ownership.length ? ownership.map(renderInsightCard).join("") : "No ownership information yet.";

    const insights = buildProfileInsights(analytics);
    els.profileInsights.className = insights.length ? "insight-list" : "insight-list empty-state";
    els.profileInsights.innerHTML = insights.length ? insights.map(renderInsightCard).join("") : "Profile insights will appear here.";
}

function renderAlerts(analytics) {
    els.alertFeed.className = analytics.alerts.length ? "insight-list" : "insight-list empty-state";
    els.alertFeed.innerHTML = analytics.alerts.length ? analytics.alerts.map(renderInsightCard).join("") : "No active alerts.";
}

function renderPriorityQueue(analytics) {
    const queue = buildPriorityQueue(analytics);
    els.priorityQueue.className = queue.length ? "card-list" : "card-list empty-state";
    els.priorityQueue.innerHTML = queue.length
        ? queue.map((item) => `
            <article class="card-item">
                <div class="card-item-top">
                    <div>
                        <h4>${escapeHtml(item.title)}</h4>
                        <p class="muted">${escapeHtml(item.detail)}</p>
                    </div>
                    <span class="pill ${item.level === "high" ? "warning" : ""}">${escapeHtml(item.badge)}</span>
                </div>
                <div class="action-row">
                    <button type="button" class="ghost-button dashboard-quick" data-view-target="${item.view}">Open ${escapeHtml(VIEW_TITLES[item.view])}</button>
                </div>
            </article>
        `).join("")
        : "No priority items right now.";
}

function renderHealth(analytics) {
    const health = buildHealth(analytics);
    els.healthScore.textContent = String(health.score);
    els.healthLabel.textContent = health.label;
    els.healthBreakdown.innerHTML = health.breakdown.map(renderInsightCard).join("");
}

function renderActivity() {
    const items = state.activity || [];
    els.activityFeed.className = items.length ? "insight-list" : "insight-list empty-state";
    els.activityFeed.innerHTML = items.length
        ? items.map((item) => `
            <article class="insight-item low">
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.message)} <span class="muted">• ${escapeHtml(item.when)}</span></p>
            </article>
        `).join("")
        : "No recent activity yet.";
}

function renderExecutionMap(analytics) {
    const completion = Math.round(analytics.completionRate || 0);
    els.completionRateValue.textContent = `${completion}%`;
    els.completedTasksCount.textContent = String(analytics.completedTasks.length);
    els.dueTodayCount.textContent = String(analytics.dueTodayTasks.length);
    els.overdueCount.textContent = String(analytics.overdueTasks.length);
    els.completionRing.style.setProperty("--progress-angle", `${Math.max(0, Math.min(360, completion * 3.6))}deg`);
}

function renderSpendingBreakdown(categories) {
    els.spendingBreakdown.className = categories.length ? "bar-list" : "bar-list empty-state";
    els.spendingBreakdown.innerHTML = categories.length ? categories.map(renderCategoryBar).join("") : "No spending data yet.";
}

function renderHabitMomentumBoard(analytics) {
    els.habitMomentumBoard.className = analytics.habits.length ? "habit-board" : "habit-board empty-state";
    els.habitMomentumBoard.innerHTML = analytics.habits.length
        ? analytics.habits.slice(0, 4).map((habit) => `
            <article class="habit-momentum-card">
                <div class="card-item-top">
                    <strong>${escapeHtml(habit.name)}</strong>
                    <span class="pill ${habit.currentStreak >= 3 ? "completed" : habitDaysSinceLast(habit) >= 3 ? "warning" : ""}">
                        ${habit.currentStreak} streak
                    </span>
                </div>
                <p>${habit.completionDates.length} completion(s), target ${habit.targetFrequency}/week.</p>
                <div class="habit-streak">
                    <span class="focus-badge">${escapeHtml(habitLastSeenText(habit))}</span>
                </div>
            </article>
        `).join("")
        : "No habits tracked yet.";
}

function renderFocusPlan(analytics) {
    const items = buildFocusPlan(analytics);
    els.focusPlan.className = items.length ? "insight-list" : "insight-list empty-state";
    els.focusPlan.innerHTML = items.length ? items.map(renderInsightCardWithBadge).join("") : "No focus plan yet.";
}

function renderWeeklyActivityChart(analytics) {
    const points = buildWeeklyActivityPoints(analytics);
    const max = Math.max(1, ...points.map((point) => point.value));
    els.weeklyActivityChart.className = points.some((point) => point.value > 0) ? "chart-card" : "chart-card empty-state";
    els.weeklyActivityChart.innerHTML = points.some((point) => point.value > 0)
        ? `
            <div class="chart-bars">
                ${points.map((point) => `
                    <div class="chart-bar-wrap">
                        <span class="chart-value">${point.value}</span>
                        <div class="chart-bar" style="height:${Math.max(8, (point.value / max) * 170)}px"></div>
                        <span class="chart-label">${point.label}</span>
                    </div>
                `).join("")}
            </div>
        `
        : "No activity yet.";
}

function renderModuleMixChart(analytics) {
    const slices = buildModuleMixData(analytics);
    const total = slices.reduce((sum, slice) => sum + slice.value, 0);
    els.moduleMixChart.className = total ? "mix-card" : "mix-card empty-state";
    if (!total) {
        els.moduleMixChart.textContent = "No data mix yet.";
        return;
    }

    const [a, b, c, d] = slices;
    const sliceA = (a.value / total) * 360;
    const sliceB = sliceA + (b.value / total) * 360;
    const sliceC = sliceB + (c.value / total) * 360;

    els.moduleMixChart.innerHTML = `
        <div class="mix-layout">
            <div class="mix-donut" style="--slice-a:${sliceA}deg; --slice-b:${sliceB}deg; --slice-c:${sliceC}deg;">
                <div class="mix-center">
                    <strong>${total}</strong>
                    <span>Total items</span>
                </div>
            </div>
            <div class="mix-legend">
                ${slices.map((slice) => `
                    <div class="mix-legend-item">
                        <div class="mix-left">
                            <span class="mix-swatch" style="background:${slice.color}"></span>
                            <strong>${escapeHtml(slice.label)}</strong>
                        </div>
                        <span>${slice.value}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function buildAnalytics() {
    state.habits = state.habits.map(syncHabit);

    const pendingTasks = state.tasks.filter((task) => task.status !== "COMPLETED");
    const completedTasks = state.tasks.filter((task) => task.status === "COMPLETED");
    const overdueTasks = pendingTasks.filter((task) => daysUntil(task.deadline) < 0);
    const dueTodayTasks = pendingTasks.filter((task) => daysUntil(task.deadline) === 0);
    const dueSoonTasks = pendingTasks.filter((task) => {
        const diff = daysUntil(task.deadline);
        return diff >= 0 && diff <= 2;
    });
    const urgentPendingTasks = pendingTasks.filter((task) => task.type === "URGENT");
    const totalSpending = state.expenses.reduce((sum, item) => sum + item.amount, 0);
    const maxThreshold = state.expenses.reduce((max, item) => Math.max(max, item.threshold), 0);
    const budgetUsage = maxThreshold > 0 ? (totalSpending / maxThreshold) * 100 : 0;
    const averageExpense = state.expenses.length ? totalSpending / state.expenses.length : 0;
    const expenseCategories = buildExpenseCategories(state.expenses);
    const strongHabits = state.habits.filter((habit) => habit.currentStreak >= 3).length;
    const inactiveHabits = state.habits.filter((habit) => habitDaysSinceLast(habit) >= 3).length;
    const weakHabits = state.habits.filter((habit) => habit.currentStreak < 2).length;
    const bestHabitStreak = state.habits.reduce((best, habit) => Math.max(best, habit.currentStreak), 0);
    const completionRate = state.tasks.length ? (completedTasks.length / state.tasks.length) * 100 : 0;
    const habitsCompletedToday = state.habits.filter((habit) => habit.completionDates.includes(todayIso())).length;
    const alerts = buildAlerts({
        tasks: state.tasks,
        expenses: state.expenses,
        habits: state.habits,
        overdueTasks,
        dueTodayTasks,
        budgetUsage
    });

    state.alerts = alerts;

    return {
        tasks: state.tasks,
        expenses: state.expenses,
        habits: state.habits,
        pendingTasks,
        completedTasks,
        overdueTasks,
        dueTodayTasks,
        dueSoonTasks,
        urgentPendingTasks,
        pendingCount: pendingTasks.length,
        urgentPendingCount: urgentPendingTasks.length,
        totalSpending,
        maxThreshold,
        budgetUsage,
        averageExpense,
        expenseCategories,
        strongHabits,
        weakHabits,
        inactiveHabits,
        bestHabitStreak,
        completionRate,
        habitsCompletedToday,
        alerts
    };
}

function filterTasks(tasks) {
    const query = els.taskSearch.value.trim().toLowerCase();
    const status = els.taskStatusFilter.value;
    const bucket = els.taskPriorityFilter.value;
    const sort = els.taskSort.value;

    const filtered = tasks.filter((task) => {
        const matchesQuery = !query
            || task.title.toLowerCase().includes(query)
            || (task.notes || "").toLowerCase().includes(query);
        const matchesStatus = status === "ALL" || task.status === status;
        const matchesBucket = bucket === "ALL"
            || (bucket === "URGENT" && task.type === "URGENT")
            || (bucket === "HIGH" && task.priority >= 4)
            || (bucket === "MEDIUM" && task.priority === 3)
            || (bucket === "LOW" && task.priority <= 2);
        return matchesQuery && matchesStatus && matchesBucket;
    });

    return filtered.sort((a, b) => {
        if (sort === "priority") {
            return b.priority - a.priority;
        }
        if (sort === "created") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.deadline) - new Date(b.deadline);
    });
}

function filterExpenses(expenses) {
    const query = els.expenseSearch.value.trim().toLowerCase();
    const category = els.expenseCategoryFilter.value;
    const sort = els.expenseSort.value;

    const filtered = expenses.filter((expense) => {
        const matchesQuery = !query
            || expense.title.toLowerCase().includes(query)
            || expense.category.toLowerCase().includes(query);
        const matchesCategory = category === "ALL" || expense.category === category;
        return matchesQuery && matchesCategory;
    });

    return filtered.sort((a, b) => {
        if (sort === "amount") {
            return b.amount - a.amount;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

function filterHabits(habits) {
    const query = els.habitSearch.value.trim().toLowerCase();
    const filter = els.habitFilter.value;

    return habits.filter((habit) => {
        const matchesQuery = !query
            || habit.name.toLowerCase().includes(query)
            || (habit.cue || "").toLowerCase().includes(query);
        const matchesFilter = filter === "ALL"
            || (filter === "ACTIVE" && habit.currentStreak >= 1)
            || (filter === "ATRISK" && habitDaysSinceLast(habit) >= 3);
        return matchesQuery && matchesFilter;
    });
}

function syncExpenseCategoryFilter(categories) {
    const currentValue = els.expenseCategoryFilter.value || "ALL";
    const options = ['<option value="ALL">All categories</option>']
        .concat(categories.map((item) => `<option value="${escapeHtml(item.category)}">${escapeHtml(item.category)}</option>`));
    els.expenseCategoryFilter.innerHTML = options.join("");
    els.expenseCategoryFilter.value = categories.some((item) => item.category === currentValue) ? currentValue : "ALL";
}

function buildSuggestions(analytics) {
    const suggestions = [];

    if (!analytics.tasks.length && !analytics.expenses.length && !analytics.habits.length) {
        return [low("System Ready", "Create a task, expense, or habit to activate your personalized operating system.")];
    }

    if (analytics.pendingCount >= 8) {
        suggestions.push(high("Critical Workload", `You have ${analytics.pendingCount} pending tasks. Freeze low-value work and focus on your top 3 highest-impact items.`));
    } else if (analytics.pendingCount >= 5 || analytics.urgentPendingCount >= 3) {
        suggestions.push(medium("Workload Building", "Your queue is getting dense. Protect time for urgent work before adding anything new."));
    } else if (analytics.pendingCount === 0) {
        suggestions.push(low("Open Capacity", "Your task queue is clear. This is a good moment to plan a meaningful next milestone."));
    } else {
        suggestions.push(low("Manageable Load", "Task pressure looks stable. Keep closing work before opening too many new tasks."));
    }

    if (analytics.overdueTasks.length > 0) {
        suggestions.push(high("Overdue Tasks Detected", `${analytics.overdueTasks.length} task(s) are overdue. Finish or reschedule the shortest overdue item first.`));
    } else if (analytics.dueTodayTasks.length > 0) {
        suggestions.push(medium("Today's Deadlines Need Protection", `${analytics.dueTodayTasks.length} task(s) are due today. Lock your next focused block around those items.`));
    }

    if (analytics.tasks.length > 0 && analytics.completionRate < 40) {
        suggestions.push(medium("Low Completion Rate", `Only ${analytics.completionRate.toFixed(1)}% of tasks are complete. Break large work into smaller finishable pieces.`));
    }

    if (analytics.expenses.length === 0) {
        suggestions.push(low("No Expense Intelligence Yet", "Start logging daily expenses to unlock stronger budget guidance."));
    } else if (analytics.budgetUsage >= 100) {
        suggestions.push(high("Budget Limit Crossed", `Budget usage is ${analytics.budgetUsage.toFixed(1)}%. Pause optional spending until you recover your threshold.`));
    } else if (analytics.budgetUsage >= 80) {
        suggestions.push(medium("Budget Getting Tight", `Budget usage is already ${analytics.budgetUsage.toFixed(1)}%. Spend carefully for the rest of this cycle.`));
    }

    if (analytics.habits.length === 0) {
        suggestions.push(low("No Habit Loop Yet", "Add one repeatable habit to start building momentum and consistency."));
    } else if (analytics.inactiveHabits >= Math.max(1, Math.ceil(analytics.habits.length / 2))) {
        suggestions.push(high("Routine Drift", "Several habits are inactive. Restart the easiest one today to rebuild identity and momentum."));
    } else if (analytics.weakHabits > 0) {
        suggestions.push(medium("Consistency Needs Support", `${analytics.weakHabits} habit(s) need more regular follow-through. Keep the routine small enough to repeat.`));
    }

    if (analytics.overdueTasks.length > 0 && analytics.budgetUsage > 100) {
        suggestions.push(high("Dual Pressure Zone", "Deadlines and spending are both under strain. Finish urgent work first, then cut non-essential expenses."));
    }

    return suggestions;
}

function buildPriorityQueue(analytics) {
    const queue = [];
    analytics.overdueTasks.slice(0, 2).forEach((task) => {
        queue.push({ title: task.title, detail: `Overdue since ${formatDate(task.deadline)}. Clear or reschedule it first.`, badge: "Overdue", level: "high", view: "tasks" });
    });
    analytics.dueTodayTasks.slice(0, 2).forEach((task) => {
        queue.push({ title: task.title, detail: "Due today. Protect time for this before lower-priority work.", badge: "Today", level: "medium", view: "tasks" });
    });
    if (analytics.budgetUsage >= 100) {
        queue.push({ title: "Budget needs attention", detail: `Usage is ${analytics.budgetUsage.toFixed(1)}% of your threshold. Review expenses next.`, badge: "Budget", level: "high", view: "expenses" });
    }
    if (analytics.inactiveHabits > 0) {
        queue.push({ title: "Restart one habit", detail: `${analytics.inactiveHabits} routine(s) are inactive. A small win today will rebuild momentum.`, badge: "Habits", level: "medium", view: "habits" });
    }
    if (!queue.length) {
        queue.push({ title: "You have open capacity", detail: "The system is relatively balanced. Review suggestions for growth opportunities.", badge: "Stable", level: "low", view: "suggestions" });
    }
    return queue.slice(0, 4);
}

function buildExpenseCategories(expenses) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    if (!total) {
        return [];
    }

    const categoryMap = new Map();
    expenses.forEach((expense) => {
        categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount);
    });

    return [...categoryMap.entries()]
        .map(([category, amount]) => ({ category, amount, percent: (amount / total) * 100 }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6);
}

function buildHealth(analytics) {
    let score = 100;
    score -= analytics.overdueTasks.length * 14;
    score -= analytics.dueTodayTasks.length * 8;
    score -= analytics.budgetUsage >= 100 ? 18 : analytics.budgetUsage >= 80 ? 8 : 0;
    score -= analytics.inactiveHabits * 10;
    score -= analytics.completionRate > 0 && analytics.completionRate < 40 ? 10 : 0;
    score = Math.max(18, Math.min(100, Math.round(score)));

    let label = "Stable and well balanced.";
    if (score < 45) {
        label = "High pressure across multiple areas.";
    } else if (score < 70) {
        label = "Some systems need attention soon.";
    }

    return {
        score,
        label,
        breakdown: [
            { title: "Task pressure", message: analytics.overdueTasks.length ? `${analytics.overdueTasks.length} overdue and ${analytics.dueTodayTasks.length} due today.` : `${analytics.pendingCount} pending with ${analytics.urgentPendingCount} urgent.`, level: analytics.overdueTasks.length ? "high" : analytics.pendingCount >= 5 ? "medium" : "low" },
            { title: "Budget balance", message: analytics.expenses.length ? `${analytics.budgetUsage.toFixed(1)}% of budget threshold currently used.` : "No expense data yet, so budget pressure is low for now.", level: analytics.budgetUsage >= 100 ? "high" : analytics.budgetUsage >= 80 ? "medium" : "low" },
            { title: "Routine strength", message: analytics.habits.length ? `${analytics.bestHabitStreak} best streak and ${analytics.inactiveHabits} inactive habit(s).` : "No habits tracked yet, so routine strength is still unformed.", level: analytics.inactiveHabits > 0 ? "medium" : "low" }
        ]
    };
}

function buildFocusPlan(analytics) {
    const plan = [];
    if (analytics.overdueTasks.length) {
        plan.push({ title: "Clear one overdue task", message: `Start with "${analytics.overdueTasks[0].title}" to reduce the biggest source of system pressure.`, badge: "Highest impact", level: "high" });
    }
    if (!analytics.overdueTasks.length && analytics.dueTodayTasks.length) {
        plan.push({ title: "Protect today's deadlines", message: `You have ${analytics.dueTodayTasks.length} task(s) due today. Block uninterrupted time before routine work.`, badge: "Today", level: "medium" });
    }
    if (analytics.budgetUsage >= 80) {
        plan.push({ title: "Pause low-value spending", message: `Budget usage is ${analytics.budgetUsage.toFixed(1)}%. Review expense categories before spending again.`, badge: "Budget", level: analytics.budgetUsage >= 100 ? "high" : "medium" });
    }
    if (analytics.inactiveHabits > 0) {
        plan.push({ title: "Restart a small habit", message: "Bring back one inactive routine today so your momentum curve turns upward again.", badge: "Consistency", level: "medium" });
    }
    if (!plan.length) {
        plan.push({ title: "Use the extra capacity well", message: "Your dashboard looks balanced. Use this window to plan one meaningful next-step goal.", badge: "Stable", level: "low" });
    }
    return plan.slice(0, 4);
}

function buildExpenseInsights(analytics) {
    const insights = [];
    if (!analytics.expenses.length) {
        return insights;
    }
    const topCategory = analytics.expenseCategories[0];
    insights.push(low("Top Spending Category", `${topCategory.category} leads at ${formatCurrency(topCategory.amount)}.`));
    if (analytics.budgetUsage >= 100) {
        insights.push(high("Budget Overrun", `Overall usage has crossed the budget threshold at ${analytics.budgetUsage.toFixed(1)}%.`));
    } else if (analytics.budgetUsage >= 80) {
        insights.push(medium("Budget Tightening", `You are already at ${analytics.budgetUsage.toFixed(1)}% of the active threshold.`));
    }
    if (analytics.averageExpense > 0) {
        insights.push(low("Average Spend", `Your average logged expense is ${formatCurrency(analytics.averageExpense)}.`));
    }
    return insights;
}

function buildHabitInsights(analytics) {
    const insights = [];
    if (!analytics.habits.length) {
        return insights;
    }
    if (analytics.inactiveHabits > 0) {
        insights.push(medium("At-Risk Habits", `${analytics.inactiveHabits} habit(s) have been inactive for 3 or more days.`));
    }
    insights.push(low("Best Streak", `Your strongest current streak is ${analytics.bestHabitStreak} day(s).`));
    insights.push(low("Completed Today", `${analytics.habitsCompletedToday} habit(s) have already been marked today.`));
    return insights;
}

function buildSignalBoard(analytics) {
    return [
        { title: "Tasks", message: analytics.overdueTasks.length ? `${analytics.overdueTasks.length} overdue items need focus.` : `${analytics.pendingCount} active task(s) in queue.` },
        { title: "Expenses", message: analytics.expenses.length ? `${analytics.budgetUsage.toFixed(1)}% threshold usage.` : "No spending data yet." },
        { title: "Habits", message: analytics.habits.length ? `${analytics.inactiveHabits} inactive, ${analytics.bestHabitStreak} best streak.` : "No habits tracked." },
        { title: "Alerts", message: analytics.alerts.length ? `${analytics.alerts.length} active alert(s).` : "No active alerts." }
    ];
}

function buildSuggestionRadarData(analytics) {
    const buckets = [
        { title: "Task Pressure", value: analytics.overdueTasks.length * 2 + analytics.dueTodayTasks.length + analytics.urgentPendingCount, detail: "Deadlines and urgency", level: analytics.overdueTasks.length ? "high" : analytics.urgentPendingCount ? "medium" : "low" },
        { title: "Budget Pressure", value: Math.round(analytics.budgetUsage / 20), detail: "Spending threshold usage", level: analytics.budgetUsage >= 100 ? "high" : analytics.budgetUsage >= 80 ? "medium" : "low" },
        { title: "Habit Drift", value: analytics.inactiveHabits * 2 + analytics.weakHabits, detail: "Routine inconsistency", level: analytics.inactiveHabits ? "medium" : analytics.weakHabits ? "low" : "low" },
        { title: "System Alerts", value: analytics.alerts.length, detail: "Active attention points", level: analytics.alerts.some((item) => item.level === "high") ? "high" : analytics.alerts.length ? "medium" : "low" }
    ];

    const max = Math.max(1, ...buckets.map((item) => item.value));
    return buckets.map((item) => ({
        ...item,
        percent: (item.value / max) * 100
    }));
}

function buildSuggestionPriorityLane(analytics) {
    const items = [];
    if (analytics.overdueTasks.length) {
        items.push({
            title: "Resolve overdue work",
            detail: `${analytics.overdueTasks.length} task(s) have already slipped past deadline.`,
            badge: "Tasks",
            level: "high",
            view: "tasks"
        });
    }
    if (analytics.budgetUsage >= 100) {
        items.push({
            title: "Review spending immediately",
            detail: `Budget usage is ${analytics.budgetUsage.toFixed(1)}% of your threshold.`,
            badge: "Expenses",
            level: "high",
            view: "expenses"
        });
    }
    if (analytics.inactiveHabits > 0) {
        items.push({
            title: "Restart one routine",
            detail: `${analytics.inactiveHabits} habit(s) have gone inactive.`,
            badge: "Habits",
            level: "medium",
            view: "habits"
        });
    }
    if (!items.length) {
        items.push({
            title: "Explore growth opportunities",
            detail: "The system is relatively stable. Use this time to improve quality, not just fix pressure.",
            badge: "Advisor",
            level: "low",
            view: "dashboard"
        });
    }
    return items.slice(0, 4);
}

function buildSuggestionGroups(analytics) {
    return [
        {
            title: "Tasks",
            items: buildSuggestions(analytics).filter((item) =>
                item.title.toLowerCase().includes("task")
                || item.title.toLowerCase().includes("deadline")
                || item.title.toLowerCase().includes("workload")
                || item.title.toLowerCase().includes("completion")
            ).slice(0, 4)
        },
        {
            title: "Expenses",
            items: buildSuggestions(analytics).filter((item) =>
                item.title.toLowerCase().includes("budget")
                || item.title.toLowerCase().includes("expense")
            ).slice(0, 4)
        },
        {
            title: "Habits",
            items: buildSuggestions(analytics).filter((item) =>
                item.title.toLowerCase().includes("habit")
                || item.title.toLowerCase().includes("routine")
                || item.title.toLowerCase().includes("consistency")
            ).slice(0, 4)
        },
        {
            title: "Combined",
            items: buildSuggestions(analytics).filter((item) =>
                item.title.toLowerCase().includes("dual")
                || item.title.toLowerCase().includes("open")
                || item.title.toLowerCase().includes("manageable")
            ).slice(0, 4)
        }
    ];
}

function buildSuggestionActionMap(analytics) {
    const actions = [];
    if (analytics.overdueTasks.length) {
        actions.push({
            title: "Clear the shortest overdue item",
            message: `Reduce stress fast by completing or rescheduling "${analytics.overdueTasks[0].title}".`,
            badge: "Tasks",
            level: "high"
        });
    }
    if (!analytics.overdueTasks.length && analytics.dueTodayTasks.length) {
        actions.push({
            title: "Lock today's focus block",
            message: `${analytics.dueTodayTasks.length} task(s) are due today. Protect uninterrupted time.`,
            badge: "Calendar",
            level: "medium"
        });
    }
    if (analytics.budgetUsage >= 80) {
        actions.push({
            title: "Pause optional purchases",
            message: "Check your highest-spend category before logging another expense.",
            badge: "Expenses",
            level: analytics.budgetUsage >= 100 ? "high" : "medium"
        });
    }
    if (analytics.inactiveHabits > 0) {
        actions.push({
            title: "Recover one habit today",
            message: "Choose the easiest routine and mark it today to restore momentum.",
            badge: "Habits",
            level: "medium"
        });
    }
    if (!actions.length) {
        actions.push({
            title: "Upgrade your baseline",
            message: "Everything is stable enough to focus on optimization rather than recovery.",
            badge: "Growth",
            level: "low"
        });
    }
    return actions.slice(0, 5);
}

function buildProfileInsights(analytics) {
    if (!state.profile) {
        return [];
    }
    return [
        low("Current Focus Style", `Preference saved as "${state.profile.preferences}".`),
        low("System Load", `${analytics.pendingCount} pending tasks and ${analytics.alerts.length} active alert(s).`),
        low("Routine State", analytics.habits.length ? `${analytics.bestHabitStreak} best streak right now.` : "No habits tracked yet.")
    ];
}

function buildProfileIdentityCards(analytics) {
    return [
        {
            title: "Identity",
            message: `${state.profile.name || "Unnamed user"} with ${state.profile.preferences || "no preference"} focus style.`
        },
        {
            title: "Main Goal",
            message: state.profile.goal || "No primary goal has been saved yet."
        },
        {
            title: "Energy Mode",
            message: state.profile.energyMode || "No energy mode selected."
        },
        {
            title: "System Footprint",
            message: `${analytics.tasks.length + analytics.expenses.length + analytics.habits.length} total records currently stored.`
        }
    ];
}

function buildProfileStrategy(analytics) {
    if (!state.profile) {
        return [];
    }

    const strategy = [
        low("Profile anchor", `Your saved preference is "${state.profile.preferences}". Keep your interfaces and workflow aligned with that mode.`)
    ];

    if (state.profile.goal) {
        strategy.push(low("Goal alignment", `Your current goal is "${state.profile.goal}". Use it as the filter for what deserves attention.`));
    }

    if (state.profile.energyMode === "Deep Work" && analytics.urgentPendingCount > 0) {
        strategy.push(medium("Deep work alignment", "You are in Deep Work mode. Handle your urgent tasks in focused blocks instead of scattered attention."));
    }

    if (state.profile.energyMode === "Recovery" && analytics.inactiveHabits > 0) {
        strategy.push(medium("Recovery mode guidance", "In Recovery mode, restart one light habit first before pushing on bigger goals."));
    }

    return strategy;
}

function buildProfileBalance(analytics) {
    const values = [
        { title: "Tasks", value: analytics.pendingCount, detail: "Open work pressure" },
        { title: "Expenses", value: Math.round(analytics.budgetUsage / 20), detail: "Budget intensity" },
        { title: "Habits", value: analytics.inactiveHabits + analytics.weakHabits, detail: "Routine fragility" },
        { title: "Alerts", value: analytics.alerts.length, detail: "System alerts" }
    ];
    const max = Math.max(1, ...values.map((item) => item.value));
    return values.map((item) => ({
        ...item,
        percent: (item.value / max) * 100,
        level: item.value >= max * 0.75 ? "high" : item.value >= max * 0.4 ? "medium" : "low"
    }));
}

function buildProfileOwnership(analytics) {
    const ownership = [];
    const totalRecords = analytics.tasks.length + analytics.expenses.length + analytics.habits.length;
    ownership.push(low("Stored locally", `Your Nexora data is currently stored in this browser with ${totalRecords} total record(s).`));
    ownership.push(low("Export ready", "You can export your data from this profile module anytime for backup or migration."));
    if (analytics.alerts.length > 0) {
        ownership.push(medium("Active attention points", `${analytics.alerts.length} alert(s) are currently influencing your personal operating state.`));
    }
    return ownership;
}

function buildWeeklyActivityPoints(analytics) {
    const labels = [];
    const counts = new Map();
    for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date();
        date.setDate(date.getDate() - offset);
        const iso = date.toISOString().slice(0, 10);
        labels.push({
            iso,
            label: date.toLocaleDateString("en-IN", { weekday: "short" })
        });
        counts.set(iso, 0);
    }

    analytics.tasks.forEach((task) => {
        if (counts.has(task.createdAt)) {
            counts.set(task.createdAt, counts.get(task.createdAt) + 1);
        }
    });

    analytics.expenses.forEach((expense) => {
        if (counts.has(expense.createdAt)) {
            counts.set(expense.createdAt, counts.get(expense.createdAt) + 1);
        }
    });

    analytics.habits.forEach((habit) => {
        habit.completionDates.forEach((date) => {
            if (counts.has(date)) {
                counts.set(date, counts.get(date) + 1);
            }
        });
    });

    return labels.map((entry) => ({
        label: entry.label,
        value: counts.get(entry.iso) || 0
    }));
}

function buildModuleMixData(analytics) {
    return [
        { label: "Tasks", value: analytics.tasks.length, color: "#0f5e9c" },
        { label: "Expenses", value: analytics.expenses.length, color: "#b96b18" },
        { label: "Habits", value: analytics.habits.length, color: "#1d7a52" },
        { label: "Alerts", value: analytics.alerts.length, color: "#7253c7" }
    ];
}

function buildAlerts(source) {
    const alerts = [];
    source.overdueTasks.forEach((task) => {
        alerts.push(high("Overdue Task", `${task.title} missed its deadline on ${formatDate(task.deadline)}.`));
    });
    source.dueTodayTasks.forEach((task) => {
        alerts.push(medium("Deadline Today", `${task.title} is due today.`));
    });
    if (source.budgetUsage >= 100) {
        alerts.push(high("Budget Alert", `Spending has reached ${source.budgetUsage.toFixed(1)}% of your highest threshold.`));
    }
    source.habits.forEach((habit) => {
        if (habitDaysSinceLast(habit) >= 3) {
            alerts.push(medium("Habit Gap", `${habit.name} has been inactive for ${habitDaysSinceLast(habit)} days.`));
        }
    });
    return alerts.slice(0, 8);
}

function startBackgroundLoops() {
    setInterval(() => {
        els.reminderStatus.textContent = "Active";
        const analytics = buildAnalytics();
        const urgentToast = analytics.alerts.find((alert) => alert.level === "high");
        if (urgentToast) {
            showToast(`${urgentToast.title}: ${urgentToast.message}`, "alert");
        }
        render();
    }, 15000);

    setInterval(() => {
        els.monitorStatus.textContent = "Active";
        render();
    }, 25000);
}

function markHabitComplete(habit) {
    const today = todayIso();
    if (habit.completionDates.includes(today)) {
        showToast(`${habit.name} is already marked for today.`, "warn");
        return;
    }
    habit.completionDates.push(today);
    syncHabit(habit);
    addActivity("Habit completed", `${habit.name} marked complete for today.`);
    showToast(`${habit.name} marked complete for today.`, "info");
}

function syncHabit(habit) {
    habit.completionDates = [...new Set(habit.completionDates)].sort();
    let streak = 0;
    let pointer = new Date(`${todayIso()}T00:00:00`);

    for (let index = habit.completionDates.length - 1; index >= 0; index -= 1) {
        if (formatShortDate(pointer) === habit.completionDates[index]) {
            streak += 1;
            pointer.setDate(pointer.getDate() - 1);
            continue;
        }
        break;
    }

    habit.currentStreak = streak;
    return habit;
}

function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexora-export-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Data exported.", "info");
}

function resetData() {
    fetch(API_STATE_URL, { method: "DELETE" })
        .catch((error) => console.error(error))
        .finally(() => {
            localStorage.removeItem(STORAGE_KEY);
            showToast("App data reset. Reloading...", "warn");
            setTimeout(() => window.location.reload(), 600);
        });
}

function populateTaskForm(task) {
    els.taskForm.elements.taskId.value = task.id;
    els.taskForm.elements.title.value = task.title;
    els.taskForm.elements.deadline.value = task.deadline;
    els.taskForm.elements.priority.value = String(task.priority);
    els.taskForm.elements.notes.value = task.notes || "";
    els.taskSubmitButton.textContent = "Save Task";
    els.taskCancelEditButton.style.display = "inline-flex";
}

function resetTaskForm() {
    els.taskForm.reset();
    els.taskForm.elements.taskId.value = "";
    els.taskSubmitButton.textContent = "Add Task";
    els.taskCancelEditButton.style.display = "none";
}

function populateExpenseForm(expense) {
    els.expenseForm.elements.expenseId.value = expense.id;
    els.expenseForm.elements.title.value = expense.title;
    els.expenseForm.elements.category.value = expense.category;
    els.expenseForm.elements.amount.value = expense.amount;
    els.expenseForm.elements.threshold.value = expense.threshold;
    els.expenseForm.elements.date.value = expense.createdAt;
    els.expenseSubmitButton.textContent = "Save Expense";
    els.expenseCancelEditButton.style.display = "inline-flex";
}

function resetExpenseForm() {
    els.expenseForm.reset();
    els.expenseForm.elements.expenseId.value = "";
    els.expenseSubmitButton.textContent = "Log Expense";
    els.expenseCancelEditButton.style.display = "none";
}

function populateHabitForm(habit) {
    els.habitForm.elements.habitId.value = habit.id;
    els.habitForm.elements.name.value = habit.name;
    els.habitForm.elements.targetFrequency.value = habit.targetFrequency;
    els.habitForm.elements.cue.value = habit.cue || "";
    els.habitSubmitButton.textContent = "Save Habit";
    els.habitCancelEditButton.style.display = "inline-flex";
}

function resetHabitForm() {
    els.habitForm.reset();
    els.habitForm.elements.habitId.value = "";
    els.habitSubmitButton.textContent = "Add Habit";
    els.habitCancelEditButton.style.display = "none";
}

function addActivity(title, message) {
    state.activity = state.activity || [];
    state.activity.unshift({
        title,
        message,
        when: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    });
    state.activity = state.activity.slice(0, 8);
}

function findItem(list, id, label) {
    const item = list.find((entry) => entry.id === id);
    if (!item) {
        throw new Error(`${label} not found.`);
    }
    return item;
}

function summaryCardTemplate(title, message) {
    return `
        <article class="summary-card">
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(message)}</p>
        </article>
    `;
}

function renderInsightCard(item) {
    return `
        <article class="insight-item ${item.level}">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.message)}</p>
        </article>
    `;
}

function renderInsightCardWithBadge(item) {
    return `
        <article class="insight-item ${item.level}">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.message)}</p>
            <span class="focus-badge">${escapeHtml(item.badge)}</span>
        </article>
    `;
}

function renderCategoryBar(item) {
    return `
        <article class="bar-item">
            <div class="bar-row">
                <strong>${escapeHtml(item.category)}</strong>
                <span class="bar-amount">${formatCurrency(item.amount)}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" style="width:${item.percent}%"></div>
            </div>
            <span class="bar-meta">${item.percent.toFixed(1)}% of total spending</span>
        </article>
    `;
}

function renderSignalBar(item) {
    return `
        <article class="bar-item">
            <div class="bar-row">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="bar-amount">${typeof item.value === "number" ? item.value : ""}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" style="width:${item.percent}%"></div>
            </div>
            <span class="bar-meta">${escapeHtml(item.detail)}</span>
        </article>
    `;
}

function habitDaysSinceLast(habit) {
    if (!habit.completionDates.length) {
        return 999;
    }
    return daysBetween(habit.completionDates[habit.completionDates.length - 1], todayIso());
}

function habitLastSeenText(habit) {
    if (!habit.completionDates.length) {
        return "Never completed";
    }
    const days = habitDaysSinceLast(habit);
    return days === 0 ? "Completed today" : `${days} day(s) ago`;
}

function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    els.toastHost.appendChild(toast);
    setTimeout(() => toast.remove(), 3600);
}

function formatDate(value) {
    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(value || 0));
}

function todayIso() {
    return new Date().toISOString().slice(0, 10);
}

function formatShortDate(date) {
    return date.toISOString().slice(0, 10);
}

function daysUntil(dateString) {
    return daysBetween(todayIso(), dateString);
}

function daysBetween(start, end) {
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    return Math.round((endDate - startDate) / 86400000);
}

function readText(value, minLength) {
    const text = String(value || "").trim();
    if (text.length < minLength) {
        throw new Error(`Please enter at least ${minLength} characters.`);
    }
    return text;
}

function readOptionalText(value) {
    return String(value || "").trim();
}

function requirePositiveNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
        throw new Error("Please enter a valid positive number.");
    }
    return number;
}

function requirePositiveInt(value, message) {
    const number = Number(value);
    if (!Number.isInteger(number) || number <= 0) {
        throw new Error(message);
    }
    return number;
}

function requirePriority(value) {
    const priority = requirePositiveInt(value, "Please choose a valid priority.");
    if (priority < 1 || priority > 5) {
        throw new Error("Priority must be between 1 and 5.");
    }
    return priority;
}

function requireDate(value) {
    const text = String(value || "");
    if (!text) {
        throw new Error("Please select a valid date.");
    }
    return text;
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        throw new Error("Please enter a valid email address.");
    }
    return email;
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function truncateMetric(text) {
    const value = String(text || "");
    return value.length > 12 ? `${value.slice(0, 12)}...` : value;
}

function high(title, message) {
    return { level: "high", title, message };
}

function medium(title, message) {
    return { level: "medium", title, message };
}

function low(title, message) {
    return { level: "low", title, message };
}
