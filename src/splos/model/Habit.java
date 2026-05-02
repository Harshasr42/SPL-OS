package splos.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Habit {
    private final int id;
    private final String name;
    private final int targetFrequency;
    private int completionCount;
    private int currentStreak;
    private LocalDate lastCompletedOn;

    public Habit(int id, String name, int targetFrequency) {
        this.id = id;
        this.name = name;
        this.targetFrequency = targetFrequency;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getTargetFrequency() {
        return targetFrequency;
    }

    public int getCompletionCount() {
        return completionCount;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void markCompleted(LocalDate completionDate) {
        if (lastCompletedOn != null) {
            long gap = ChronoUnit.DAYS.between(lastCompletedOn, completionDate);
            if (gap == 1) {
                currentStreak++;
            } else if (gap > 1) {
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }

        if (lastCompletedOn == null || !lastCompletedOn.equals(completionDate)) {
            completionCount++;
            lastCompletedOn = completionDate;
        }
    }

    public long getDaysSinceLastCompletion() {
        if (lastCompletedOn == null) {
            return Long.MAX_VALUE;
        }
        return ChronoUnit.DAYS.between(lastCompletedOn, LocalDate.now());
    }

    @Override
    public String toString() {
        return "Habit{id=%d, name='%s', targetFrequency=%d/week, completions=%d, streak=%d, lastDone=%s}"
                .formatted(id, name, targetFrequency, completionCount, currentStreak,
                        lastCompletedOn == null ? "Never" : lastCompletedOn.toString());
    }
}
