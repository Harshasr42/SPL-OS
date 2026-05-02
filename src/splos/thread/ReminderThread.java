package splos.thread;

import splos.core.SystemManager;

import java.util.List;

public class ReminderThread extends Thread {
    private final SystemManager manager;
    private volatile boolean running = true;

    public ReminderThread(SystemManager manager) {
        this.manager = manager;
    }

    @Override
    public void run() {
        while (running) {
            try {
                List<String> alerts = manager.getReminderAlerts();
                for (String alert : alerts) {
                    System.out.println("[Reminder] " + alert);
                }
                Thread.sleep(5000);
            } catch (InterruptedException exception) {
                interrupt();
                running = false;
            }
        }
    }

    public void requestStop() {
        running = false;
        interrupt();
    }
}
