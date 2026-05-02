package splos.thread;

import splos.core.SystemManager;

import java.util.List;

public class MonitoringThread extends Thread {
    private final SystemManager manager;
    private volatile boolean running = true;

    public MonitoringThread(SystemManager manager) {
        this.manager = manager;
    }

    @Override
    public void run() {
        while (running) {
            try {
                List<String> alerts = manager.getMonitoringAlerts();
                for (String alert : alerts) {
                    System.out.println("[Monitor] " + alert);
                }
                Thread.sleep(7000);
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
