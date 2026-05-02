package splos.model;

public class PremiumUser extends User {
    private final String planName;

    public PremiumUser(int id, String name, String email, String password, String preferences, String planName) {
        super(id, name, email, password, preferences);
        this.planName = planName;
    }

    @Override
    public String toString() {
        return super.toString() + " Premium(plan=" + planName + ")";
    }
}
