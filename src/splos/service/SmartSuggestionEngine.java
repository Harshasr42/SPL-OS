package splos.service;

import splos.model.Expense;
import splos.model.Habit;
import splos.model.Task;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class SmartSuggestionEngine {
    public List<String> generateSuggestions(List<Task> tasks, List<Expense> expenses, List<Habit> habits) {
        List<String> suggestions = new ArrayList<>();
        LocalDate today = LocalDate.now();

        List<Task> pendingTasks = tasks.stream().filter(task -> !task.isCompleted()).toList();
        long pendingCount = pendingTasks.size();
        long completedCount = tasks.stream().filter(Task::isCompleted).count();
        long overdueTasks = pendingTasks.stream().filter(Task::isOverdue).count();
        long dueTodayTasks = pendingTasks.stream().filter(task -> task.getDeadline().isEqual(today)).count();
        long dueSoonTasks = pendingTasks.stream()
                .filter(task -> !task.getDeadline().isBefore(today) && !task.getDeadline().isAfter(today.plusDays(2)))
                .count();
        long urgentPendingTasks = pendingTasks.stream().filter(task -> "URGENT".equalsIgnoreCase(task.getCategoryLabel())).count();
        double spending = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double threshold = expenses.stream().mapToDouble(Expense::getThreshold).max().orElse(0.0);
        double averageExpense = expenses.isEmpty() ? 0.0 : spending / expenses.size();
        long largeExpenses = expenses.stream()
                .filter(expense -> averageExpense > 0.0 && expense.getAmount() >= averageExpense * 1.5)
                .count();
        long strongHabits = habits.stream().filter(habit -> habit.getCurrentStreak() >= 3).count();
        long weakHabits = habits.stream().filter(habit -> habit.getCurrentStreak() < 2).count();
        long inactiveHabits = habits.stream().filter(habit -> habit.getDaysSinceLastCompletion() >= 3).count();
        int weeklyHabitTarget = habits.stream().mapToInt(Habit::getTargetFrequency).sum();

        if (tasks.isEmpty() && expenses.isEmpty() && habits.isEmpty()) {
            suggestions.add("Start by adding tasks, expenses, or habits to activate smart analysis.");
            return suggestions;
        }

        suggestions.add(buildWorkloadAdvice(pendingCount, urgentPendingTasks, overdueTasks));
        suggestions.add(buildDeadlineAdvice(pendingTasks, dueTodayTasks, dueSoonTasks, overdueTasks));
        suggestions.add(buildCompletionAdvice(tasks.size(), completedCount));
        suggestions.add(buildExpenseAdvice(spending, threshold, averageExpense, largeExpenses, expenses.size()));
        suggestions.add(buildHabitAdvice(habits.size(), weeklyHabitTarget, strongHabits, weakHabits, inactiveHabits));

        if (overdueTasks > 0 && spending > threshold && threshold > 0.0) {
            suggestions.add("Both deadlines and spending need attention. Finish urgent work first, then pause non-essential expenses.");
        }

        if (urgentPendingTasks >= 3 && inactiveHabits > 0) {
            suggestions.add("Your urgent workload is high and routines are slipping. Protect one small habit while you clear top-priority tasks.");
        }

        if (completedCount > 0 && pendingCount <= 2 && strongHabits == habits.size() && !habits.isEmpty()) {
            suggestions.add("You are in a stable rhythm. This is a good time to take on one meaningful next-step goal.");
        }

        return suggestions;
    }

    private String buildWorkloadAdvice(long pendingCount, long urgentPendingTasks, long overdueTasks) {
        if (pendingCount >= 8) {
            return "Workload is critical with " + pendingCount + " pending tasks. Defer low-value work and focus on the top 3 items.";
        }
        if (pendingCount >= 5 || urgentPendingTasks >= 3) {
            return "Workload is building up. Prioritize urgent tasks first and avoid adding new commitments today.";
        }
        if (pendingCount == 0 && overdueTasks == 0) {
            return "Task queue is clear. Use this space to plan ahead or complete a personal improvement activity.";
        }
        return "Task load looks manageable. Keep progress steady and close tasks before adding too many new ones.";
    }

    private String buildDeadlineAdvice(List<Task> pendingTasks, long dueTodayTasks, long dueSoonTasks, long overdueTasks) {
        if (overdueTasks > 0) {
            return "You have " + overdueTasks + " overdue task(s). Reschedule them or complete the shortest one immediately.";
        }
        if (dueTodayTasks > 0) {
            return "You have " + dueTodayTasks + " task(s) due today. Protect time blocks now so deadlines do not slip.";
        }
        if (dueSoonTasks >= 2) {
            return "Several deadlines are approaching within 48 hours. Finish high-priority items before routine work.";
        }
        if (!pendingTasks.isEmpty()) {
            Task nextTask = pendingTasks.stream().min(Comparator.comparing(Task::getDeadline)).orElse(null);
            if (nextTask != null) {
                long days = ChronoUnit.DAYS.between(LocalDate.now(), nextTask.getDeadline());
                return "Next deadline is \"" + nextTask.getTitle() + "\" in " + days + " day(s). Start early to keep buffer time.";
            }
        }
        return "No deadline pressure detected right now.";
    }

    private String buildCompletionAdvice(int totalTasks, long completedCount) {
        if (totalTasks == 0) {
            return "No tasks logged yet. Add a few concrete goals so the system can track execution quality.";
        }
        double completionRate = (completedCount * 100.0) / totalTasks;
        if (completionRate >= 80.0) {
            return "Completion rate is strong at " + formatPercent(completionRate) + "%. Your task discipline is paying off.";
        }
        if (completionRate >= 50.0) {
            return "Completion rate is moderate at " + formatPercent(completionRate) + "%. Try finishing one open task before starting another.";
        }
        return "Completion rate is low at " + formatPercent(completionRate) + "%. Break large work into smaller finishable tasks.";
    }

    private String buildExpenseAdvice(double spending, double threshold, double averageExpense, long largeExpenses, int expenseCount) {
        if (expenseCount == 0) {
            return "No spending records yet. Logging daily expenses will unlock stronger budget suggestions.";
        }
        if (threshold > 0.0) {
            double budgetUsage = (spending / threshold) * 100.0;
            if (budgetUsage >= 100.0) {
                return "Budget usage is at " + formatPercent(budgetUsage) + "%. Cut optional spending until you return below the limit.";
            }
            if (budgetUsage >= 80.0) {
                return "Budget usage is already " + formatPercent(budgetUsage) + "%. Spend carefully for the rest of the cycle.";
            }
        }
        if (largeExpenses >= 2) {
            return "Spending pattern shows multiple large purchases. Review whether they were essential before logging new expenses.";
        }
        return "Spending is stable with an average entry of " + String.format("%.2f", averageExpense) + ". Keep tracking to spot patterns early.";
    }

    private String buildHabitAdvice(int habitCount, int weeklyHabitTarget, long strongHabits, long weakHabits, long inactiveHabits) {
        if (habitCount == 0) {
            return "No habits tracked yet. Add one daily routine to build consistency momentum.";
        }
        if (inactiveHabits >= Math.max(1, habitCount / 2)) {
            return "Several habits are inactive. Restart with the easiest routine and rebuild consistency one day at a time.";
        }
        if (strongHabits == habitCount) {
            return "Habit system is healthy. All tracked routines show positive momentum.";
        }
        if (weakHabits > 0) {
            return "Habit consistency needs support across " + weakHabits + " routine(s). Aim for " + weeklyHabitTarget + " check-ins this week.";
        }
        return "Habit progress is stable. Keep protecting your routine streaks.";
    }

    private String formatPercent(double value) {
        return String.format("%.1f", value);
    }
}
