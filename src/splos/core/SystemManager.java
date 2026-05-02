package splos.core;

import splos.exception.InvalidInputException;
import splos.model.Expense;
import splos.model.Habit;
import splos.model.StandardTask;
import splos.model.Task;
import splos.model.UrgentTask;
import splos.model.User;
import splos.service.SmartSuggestionEngine;
import splos.util.InputValidator;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import java.util.stream.Collectors;

public class SystemManager {
    private final List<User> users = Collections.synchronizedList(new ArrayList<>());
    private final List<Task> tasks = Collections.synchronizedList(new ArrayList<>());
    private final List<Expense> expenses = Collections.synchronizedList(new ArrayList<>());
    private final List<Habit> habits = Collections.synchronizedList(new ArrayList<>());
    private final SmartSuggestionEngine suggestionEngine = new SmartSuggestionEngine();

    private User activeUser;
    private int userCounter = 1;
    private int taskCounter = 1;
    private int expenseCounter = 1;
    private int habitCounter = 1;

    public synchronized User registerUser(String name, String email, String password, String preferences)
            throws InvalidInputException {
        InputValidator.validateName(name);
        InputValidator.validateEmail(email);
        InputValidator.validatePassword(password);

        boolean exists = users.stream().anyMatch(user -> user.getEmail().equalsIgnoreCase(email));
        if (exists) {
            throw new InvalidInputException("A user with this email already exists.");
        }

        User user = new User(userCounter++, name.trim(), email.trim().toLowerCase(), password.trim(), preferences.trim());
        users.add(user);
        if (activeUser == null) {
            activeUser = user;
        }
        return user;
    }

    public synchronized User authenticate(String email, String password) throws InvalidInputException {
        InputValidator.validateEmail(email);
        InputValidator.validatePassword(password);

        return users.stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email.trim()) && user.matchesPassword(password.trim()))
                .findFirst()
                .map(user -> {
                    activeUser = user;
                    return user;
                })
                .orElseThrow(() -> new InvalidInputException("Invalid email or password."));
    }

    public synchronized Task addTask(String title, String deadlineText, String priorityText) throws InvalidInputException {
        ensureActiveUser();
        String cleanTitle = InputValidator.validateTitle(title);
        LocalDate deadline = InputValidator.validateDate(deadlineText);
        int priority = InputValidator.validatePriority(priorityText);

        Task task = priority >= 4
                ? new UrgentTask(taskCounter++, cleanTitle, deadline, priority)
                : new StandardTask(taskCounter++, cleanTitle, deadline, priority);

        tasks.add(task);
        return task;
    }

    public synchronized boolean updateTaskStatus(int id, String statusText) throws InvalidInputException {
        Task task = findTaskById(id);
        task.setStatus(InputValidator.validateTaskStatus(statusText));
        return true;
    }

    public synchronized boolean deleteTask(int id) {
        return tasks.removeIf(task -> task.getId() == id);
    }

    public synchronized Expense addExpense(String title, String category, String amountText, String thresholdText)
            throws InvalidInputException {
        ensureActiveUser();
        String cleanTitle = InputValidator.validateTitle(title);
        String cleanCategory = InputValidator.validateCategory(category);
        double amount = InputValidator.validateAmount(amountText);
        double threshold = InputValidator.validateAmount(thresholdText);

        Expense expense = new Expense(expenseCounter++, cleanTitle, cleanCategory, amount, threshold, LocalDate.now());
        expenses.add(expense);
        return expense;
    }

    public synchronized Habit addHabit(String name, String targetFrequencyText) throws InvalidInputException {
        ensureActiveUser();
        String cleanName = InputValidator.validateTitle(name);
        int targetFrequency = InputValidator.validatePositiveInt(targetFrequencyText, "Habit frequency must be positive.");

        Habit habit = new Habit(habitCounter++, cleanName, targetFrequency);
        habits.add(habit);
        return habit;
    }

    public synchronized boolean markHabitDone(int id) throws InvalidInputException {
        Habit habit = findHabitById(id);
        habit.markCompleted(LocalDate.now());
        return true;
    }

    public synchronized List<String> generateSuggestions() {
        return suggestionEngine.generateSuggestions(snapshotTasks(), snapshotExpenses(), snapshotHabits());
    }

    public synchronized List<String> getReminderAlerts() {
        List<String> alerts = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (Task task : tasks) {
            if (!task.isCompleted() && task.getDeadline().isBefore(today)) {
                alerts.add("Overdue task: " + task.getTitle() + " (deadline " + task.getDeadline() + ")");
            } else if (!task.isCompleted() && !task.getDeadline().isAfter(today.plusDays(1))) {
                alerts.add("Upcoming task: " + task.getTitle() + " (deadline " + task.getDeadline() + ")");
            }
        }
        for (Habit habit : habits) {
            if (habit.getDaysSinceLastCompletion() >= 2) {
                alerts.add("Habit gap detected: " + habit.getName() + " has been inactive for " + habit.getDaysSinceLastCompletion() + " day(s).");
            }
        }
        return alerts;
    }

    public synchronized List<String> getMonitoringAlerts() {
        List<String> alerts = new ArrayList<>();
        long pendingTasks = tasks.stream().filter(task -> !task.isCompleted()).count();
        double spending = getTotalSpending();
        if (pendingTasks >= 5) {
            alerts.add("Monitoring: workload is heavy with " + pendingTasks + " pending tasks.");
        }
        if (spending > getHighestThreshold()) {
            alerts.add("Monitoring: spending has crossed at least one budget threshold.");
        }
        for (Habit habit : habits) {
            if (habit.getCurrentStreak() == 0 && habit.getCompletionCount() > 0) {
                alerts.add("Monitoring: streak reset for habit " + habit.getName() + ".");
            }
        }
        return alerts;
    }

    public synchronized String buildDashboard() {
        StringBuilder builder = new StringBuilder();
        builder.append("\n========== SPL-OS Dashboard ==========\n");
        builder.append("Active user: ").append(activeUser == null ? "None" : activeUser.getName()).append('\n');
        builder.append("Users: ").append(users.size()).append('\n');
        builder.append("Tasks: ").append(tasks.size())
                .append(" | Pending: ").append(tasks.stream().filter(task -> !task.isCompleted()).count())
                .append(" | Completed: ").append(tasks.stream().filter(Task::isCompleted).count()).append('\n');
        builder.append("Expenses logged: ").append(expenses.size())
                .append(" | Total spending: ").append(String.format("%.2f", getTotalSpending())).append('\n');
        builder.append("Habits tracked: ").append(habits.size()).append('\n');
        builder.append("Smart insights: ").append(String.join(" | ", generateSuggestions())).append('\n');
        builder.append("======================================\n");
        return builder.toString();
    }

    public synchronized String listTasks() {
        if (tasks.isEmpty()) {
            return "No tasks available.";
        }

        List<Task> sortedTasks = snapshotTasks();
        sortedTasks.sort(Comparator.comparing(Task::getDeadline).thenComparing(Task::getPriority).reversed());

        StringBuilder builder = new StringBuilder();
        builder.append("Tasks:\n");
        for (Task task : sortedTasks) {
            builder.append(task).append('\n');
        }
        return builder.toString();
    }

    public synchronized String listExpenses() {
        if (expenses.isEmpty()) {
            return "No expenses available.";
        }

        Map<String, Double> byCategory = new LinkedHashMap<>();
        for (Expense expense : expenses) {
            byCategory.merge(expense.getCategory(), expense.getAmount(), Double::sum);
        }

        StringBuilder builder = new StringBuilder("Expenses:\n");
        for (Expense expense : expenses) {
            builder.append(expense).append('\n');
        }
        builder.append("Category totals: ");
        StringJoiner joiner = new StringJoiner(", ");
        byCategory.forEach((key, value) -> joiner.add(key + "=" + String.format("%.2f", value)));
        builder.append(joiner);
        return builder.toString();
    }

    public synchronized String listHabits() {
        if (habits.isEmpty()) {
            return "No habits available.";
        }

        StringBuilder builder = new StringBuilder("Habits:\n");
        for (Habit habit : habits) {
            builder.append(habit).append('\n');
        }
        return builder.toString();
    }

    public synchronized String searchTasks(String query) throws InvalidInputException {
        String cleanQuery = InputValidator.validateSearchQuery(query).toLowerCase();
        List<Task> matches = tasks.stream()
                .filter(task -> task.getTitle().toLowerCase().contains(cleanQuery)
                        || task.getStatus().toLowerCase().contains(cleanQuery)
                        || task.getCategoryLabel().toLowerCase().contains(cleanQuery))
                .collect(Collectors.toList());

        if (matches.isEmpty()) {
            return "No matching tasks found.";
        }

        StringBuffer buffer = new StringBuffer("Search results:\n");
        for (Task task : matches) {
            buffer.append(task).append('\n');
        }
        return buffer.toString();
    }

    public synchronized String healthSummary() {
        return "Threads safe: synchronized collections active | Reminder alerts: "
                + getReminderAlerts().size()
                + " | Monitoring alerts: "
                + getMonitoringAlerts().size();
    }

    public synchronized User getActiveUser() {
        return activeUser;
    }

    public synchronized List<Task> snapshotTasks() {
        return new ArrayList<>(tasks);
    }

    public synchronized List<Expense> snapshotExpenses() {
        return new ArrayList<>(expenses);
    }

    public synchronized List<Habit> snapshotHabits() {
        return new ArrayList<>(habits);
    }

    private double getTotalSpending() {
        return expenses.stream().mapToDouble(Expense::getAmount).sum();
    }

    private double getHighestThreshold() {
        return expenses.stream().mapToDouble(Expense::getThreshold).max().orElse(Double.MAX_VALUE);
    }

    private void ensureActiveUser() throws InvalidInputException {
        if (activeUser == null) {
            throw new InvalidInputException("Please register or login first.");
        }
    }

    private Task findTaskById(int id) throws InvalidInputException {
        return tasks.stream()
                .filter(task -> task.getId() == id)
                .findFirst()
                .orElseThrow(() -> new InvalidInputException("Task not found for id " + id));
    }

    private Habit findHabitById(int id) throws InvalidInputException {
        return habits.stream()
                .filter(habit -> habit.getId() == id)
                .findFirst()
                .orElseThrow(() -> new InvalidInputException("Habit not found for id " + id));
    }
}
