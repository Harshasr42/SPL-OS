package splos.model;

import java.time.LocalDate;

public class StandardTask extends Task {
    public StandardTask(int id, String title, LocalDate deadline, int priority) {
        super(id, title, deadline, priority);
    }

    @Override
    public String getCategoryLabel() {
        return "NORMAL";
    }
}
