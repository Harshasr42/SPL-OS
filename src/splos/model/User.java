package splos.model;

public class User {
    private final int id;
    private String name;
    private String email;
    private String password;
    private String preferences;

    public User(int id, String name, String email, String password, String preferences) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.preferences = preferences;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPreferences() {
        return preferences;
    }

    public boolean matchesPassword(String inputPassword) {
        return password.equals(inputPassword);
    }

    @Override
    public String toString() {
        return "User{id=%d, name='%s', email='%s', preferences='%s'}"
                .formatted(id, name, email, preferences);
    }
}
