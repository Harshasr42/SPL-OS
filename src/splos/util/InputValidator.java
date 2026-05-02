package splos.util;

import splos.exception.InvalidInputException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class InputValidator {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d).{6,20}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[A-Za-z ]{2,50}$");
    private static final Pattern TEXT_PATTERN = Pattern.compile("^[A-Za-z0-9 ,.\\-]{2,80}$");

    private InputValidator() {
    }

    public static void validateEmail(String email) throws InvalidInputException {
        requireMatch(email, EMAIL_PATTERN, "Invalid email format.");
    }

    public static void validatePassword(String password) throws InvalidInputException {
        requireMatch(password, PASSWORD_PATTERN, "Password must contain letters, digits, and be 6-20 characters long.");
    }

    public static void validateName(String name) throws InvalidInputException {
        requireMatch(name, NAME_PATTERN, "Name must be 2-50 letters long.");
    }

    public static String validateTitle(String title) throws InvalidInputException {
        requireMatch(title, TEXT_PATTERN, "Text must be 2-80 characters and avoid special symbols.");
        return title.trim();
    }

    public static String validateCategory(String category) throws InvalidInputException {
        requireMatch(category, TEXT_PATTERN, "Category must be valid text.");
        return category.trim();
    }

    public static LocalDate validateDate(String dateText) throws InvalidInputException {
        try {
            LocalDate date = LocalDate.parse(dateText.trim());
            if (date.isBefore(LocalDate.now().minusYears(1))) {
                throw new InvalidInputException("Date is too far in the past.");
            }
            return date;
        } catch (DateTimeParseException exception) {
            throw new InvalidInputException("Date must be in yyyy-mm-dd format.");
        }
    }

    public static int validatePriority(String priorityText) throws InvalidInputException {
        int priority = validatePositiveInt(priorityText, "Priority must be numeric.");
        if (priority < 1 || priority > 5) {
            throw new InvalidInputException("Priority must be between 1 and 5.");
        }
        return priority;
    }

    public static double validateAmount(String amountText) throws InvalidInputException {
        try {
            double amount = Double.parseDouble(amountText.trim());
            if (amount <= 0) {
                throw new InvalidInputException("Amount must be greater than zero.");
            }
            return amount;
        } catch (NumberFormatException exception) {
            throw new InvalidInputException("Amount must be numeric.");
        }
    }

    public static int validatePositiveInt(String value, String message) throws InvalidInputException {
        try {
            int number = Integer.parseInt(value.trim());
            if (number <= 0) {
                throw new InvalidInputException(message);
            }
            return number;
        } catch (NumberFormatException exception) {
            throw new InvalidInputException(message);
        }
    }

    public static String validateTaskStatus(String statusText) throws InvalidInputException {
        String status = statusText.trim().toUpperCase();
        if (!"PENDING".equals(status) && !"COMPLETED".equals(status)) {
            throw new InvalidInputException("Status must be PENDING or COMPLETED.");
        }
        return status;
    }

    public static String validateSearchQuery(String query) throws InvalidInputException {
        if (query == null || query.trim().length() < 2) {
            throw new InvalidInputException("Search query must be at least 2 characters long.");
        }
        return query.trim();
    }

    private static void requireMatch(String input, Pattern pattern, String message) throws InvalidInputException {
        if (input == null) {
            throw new InvalidInputException(message);
        }
        Matcher matcher = pattern.matcher(input.trim());
        if (!matcher.matches()) {
            throw new InvalidInputException(message);
        }
    }
}
