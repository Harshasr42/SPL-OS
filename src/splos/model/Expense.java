package splos.model;

import java.time.LocalDate;

public class Expense {
    private final int id;
    private final String title;
    private final String category;
    private final double amount;
    private final double threshold;
    private final LocalDate createdOn;

    public Expense(int id, String title, String category, double amount, double threshold, LocalDate createdOn) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.amount = amount;
        this.threshold = threshold;
        this.createdOn = createdOn;
    }

    public String getCategory() {
        return category;
    }

    public double getAmount() {
        return amount;
    }

    public double getThreshold() {
        return threshold;
    }

    @Override
    public String toString() {
        return "Expense{id=%d, title='%s', category='%s', amount=%.2f, threshold=%.2f, date=%s}"
                .formatted(id, title, category, amount, threshold, createdOn);
    }
}
