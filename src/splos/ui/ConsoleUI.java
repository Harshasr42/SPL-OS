package splos.ui;

import splos.core.SystemManager;
import splos.exception.InvalidInputException;
import splos.thread.MonitoringThread;
import splos.thread.ReminderThread;

import java.util.NoSuchElementException;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

public class ConsoleUI {
    private final SystemManager manager;
    private final ReminderThread reminderThread;
    private final MonitoringThread monitoringThread;
    private final Scanner scanner = new Scanner(System.in);
    private volatile boolean running = true;

    public ConsoleUI(SystemManager manager, ReminderThread reminderThread, MonitoringThread monitoringThread) {
        this.manager = manager;
        this.reminderThread = reminderThread;
        this.monitoringThread = monitoringThread;
    }

    public void run() {
        printWelcome();
        while (running) {
            try {
                System.out.println(manager.buildDashboard());
                printMenu();
                String choice = readLineOrExit().trim();
                handleChoice(choice);
            } catch (InvalidInputException exception) {
                System.out.println("Input error: " + exception.getMessage());
            } catch (InputMismatchException exception) {
                System.out.println("Type mismatch: please enter data in the requested format.");
            } catch (NoSuchElementException exception) {
                System.out.println("Input stream closed. Exiting safely.");
                running = false;
            } catch (NumberFormatException exception) {
                System.out.println("Numeric input expected. Please enter digits only where required.");
            } catch (ArithmeticException exception) {
                System.out.println("Calculation error: " + exception.getMessage());
            } catch (Exception exception) {
                System.out.println("Unexpected error handled safely: " + exception.getMessage());
            } finally {
                System.out.println("\nSystem remains active.\n");
            }
        }
        shutdown();
    }

    private void handleChoice(String choice) throws InvalidInputException {
        switch (choice.toLowerCase()) {
            case "1" -> registerUser();
            case "2" -> login();
            case "3" -> addTask();
            case "4" -> updateTaskStatus();
            case "5" -> deleteTask();
            case "6" -> addExpense();
            case "7" -> addHabit();
            case "8" -> markHabitDone();
            case "9" -> showDataViews();
            case "10" -> searchTask();
            case "11" -> showSuggestions();
            case "12" -> showThreadStatus();
            case "0", "exit", "quit" -> running = false;
            default -> handleUnstructuredInput(choice);
        }
    }

    private void registerUser() throws InvalidInputException {
        System.out.print("Name: ");
        String name = readLineOrExit();
        System.out.print("Email: ");
        String email = readLineOrExit();
        System.out.print("Password: ");
        String password = readLineOrExit();
        System.out.print("Preferences: ");
        String preferences = readLineOrExit();
        System.out.println("Registered: " + manager.registerUser(name, email, password, preferences));
    }

    private void login() throws InvalidInputException {
        System.out.print("Email: ");
        String email = readLineOrExit();
        System.out.print("Password: ");
        String password = readLineOrExit();
        System.out.println("Authenticated: " + manager.authenticate(email, password).getName());
    }

    private void addTask() throws InvalidInputException {
        System.out.print("Task title: ");
        String title = readLineOrExit();
        System.out.print("Deadline (yyyy-mm-dd): ");
        String deadline = readLineOrExit();
        System.out.print("Priority (1-5): ");
        String priority = readLineOrExit();
        System.out.println("Created: " + manager.addTask(title, deadline, priority));
    }

    private void updateTaskStatus() throws InvalidInputException {
        System.out.print("Task id: ");
        int id = Integer.parseInt(readLineOrExit().trim());
        System.out.print("Status (PENDING/COMPLETED): ");
        String status = readLineOrExit();
        manager.updateTaskStatus(id, status);
        System.out.println("Task status updated.");
    }

    private void deleteTask() {
        try {
            System.out.print("Task id: ");
            int id = Integer.parseInt(readLineOrExit().trim());
            boolean removed = manager.deleteTask(id);
            System.out.println(removed ? "Task deleted." : "Task not found.");
        } catch (NumberFormatException exception) {
            System.out.println("Task id must be numeric.");
        }
    }

    private void addExpense() throws InvalidInputException {
        System.out.print("Expense title: ");
        String title = readLineOrExit();
        System.out.print("Category: ");
        String category = readLineOrExit();
        System.out.print("Amount: ");
        String amount = readLineOrExit();
        System.out.print("Threshold: ");
        String threshold = readLineOrExit();
        System.out.println("Logged: " + manager.addExpense(title, category, amount, threshold));
    }

    private void addHabit() throws InvalidInputException {
        System.out.print("Habit name: ");
        String name = readLineOrExit();
        System.out.print("Target frequency per week: ");
        String frequency = readLineOrExit();
        System.out.println("Added: " + manager.addHabit(name, frequency));
    }

    private void markHabitDone() throws InvalidInputException {
        System.out.print("Habit id: ");
        int id = Integer.parseInt(readLineOrExit().trim());
        manager.markHabitDone(id);
        System.out.println("Habit marked as completed for today.");
    }

    private void showDataViews() {
        System.out.println(manager.listTasks());
        System.out.println(manager.listExpenses());
        System.out.println(manager.listHabits());
    }

    private void searchTask() throws InvalidInputException {
        System.out.print("Search query: ");
        String query = readLineOrExit();
        System.out.println(manager.searchTasks(query));
    }

    private void showSuggestions() {
        List<String> suggestions = manager.generateSuggestions();
        System.out.println("Smart suggestions:");
        for (String suggestion : suggestions) {
            System.out.println("- " + suggestion);
        }
    }

    private void showThreadStatus() {
        System.out.println("Reminder thread alive: " + reminderThread.isAlive());
        System.out.println("Monitoring thread alive: " + monitoringThread.isAlive());
        System.out.println(manager.healthSummary());
    }

    private void handleUnstructuredInput(String input) {
        String normalized = input.trim().toLowerCase();
        if (normalized.contains("show tasks")) {
            System.out.println(manager.listTasks());
        } else if (normalized.contains("show habits")) {
            System.out.println(manager.listHabits());
        } else if (normalized.contains("show expenses")) {
            System.out.println(manager.listExpenses());
        } else if (normalized.contains("suggest")) {
            showSuggestions();
        } else {
            System.out.println("Command not recognized. Use the menu or phrases like 'show tasks' or 'suggest'.");
        }
    }

    private void shutdown() {
        System.out.println("Stopping background services...");
        reminderThread.requestStop();
        monitoringThread.requestStop();

        try {
            reminderThread.join(2000);
            monitoringThread.join(2000);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            System.out.println("Shutdown interrupted, but cleanup completed safely.");
        }

        scanner.close();
        System.out.println("SPL-OS stopped gracefully.");
    }

    private String readLineOrExit() {
        if (!scanner.hasNextLine()) {
            throw new NoSuchElementException("No more console input available.");
        }
        return scanner.nextLine();
    }

    private void printWelcome() {
        System.out.println("Smart Personal Life Operating System");
        System.out.println("A console assistant for tasks, expenses, habits, and intelligent monitoring.");
    }

    private void printMenu() {
        System.out.println("Choose an option:");
        System.out.println("1. Register user");
        System.out.println("2. Login");
        System.out.println("3. Add task");
        System.out.println("4. Update task status");
        System.out.println("5. Delete task");
        System.out.println("6. Add expense");
        System.out.println("7. Add habit");
        System.out.println("8. Mark habit complete");
        System.out.println("9. View all data");
        System.out.println("10. Search task");
        System.out.println("11. Smart suggestions");
        System.out.println("12. Thread status");
        System.out.println("0. Exit");
        System.out.print("Enter choice: ");
    }
}
