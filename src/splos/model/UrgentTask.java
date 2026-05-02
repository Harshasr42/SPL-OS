package splos.model;

import java.time.LocalDate;

public class UrgentTask extends Task {
    public UrgentTask(int id, String title, LocalDate deadline, int priority) {
        super(id, title, deadline, priority);
    }

    @Override
    public String getCategoryLabel() {
        return "URGENT";
    }
}
