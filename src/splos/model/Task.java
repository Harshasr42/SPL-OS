package splos.model;

import java.time.LocalDate;

public abstract class Task {
    private final int id;
    private final String title;
    private final LocalDate deadline;
    private final int priority;
    private String status;

    protected Task(int id, String title, LocalDate deadline, int priority) {
        this.id = id;
        this.title = title;
        this.deadline = deadline;
        this.priority = priority;
        this.status = "PENDING";
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public int getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(status);
    }

    public boolean isOverdue() {
        return !isCompleted() && deadline.isBefore(LocalDate.now());
    }

    public abstract String getCategoryLabel();

    @Override
    public String toString() {
        return "Task{id=%d, title='%s', deadline=%s, priority=%d, status=%s, type=%s}"
                .formatted(id, title, deadline, priority, status, getCategoryLabel());
    }
}
