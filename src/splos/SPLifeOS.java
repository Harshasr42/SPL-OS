package splos;

import splos.core.SystemManager;
import splos.thread.MonitoringThread;
import splos.thread.ReminderThread;
import splos.ui.ConsoleUI;

public class SPLifeOS {
    public void start() {
        SystemManager manager = new SystemManager();
        ReminderThread reminderThread = new ReminderThread(manager);
        MonitoringThread monitoringThread = new MonitoringThread(manager);

        reminderThread.setName("Reminder-Thread");
        monitoringThread.setName("Monitoring-Thread");
        reminderThread.setPriority(Thread.NORM_PRIORITY + 1);
        monitoringThread.setPriority(Thread.NORM_PRIORITY);

        reminderThread.start();
        monitoringThread.start();

        ConsoleUI consoleUI = new ConsoleUI(manager, reminderThread, monitoringThread);
        consoleUI.run();
    }
}
