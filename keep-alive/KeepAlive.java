import java.awt.AWTException;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.Graphics2D;
import java.awt.MenuItem;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PopupMenu;
import java.awt.RenderingHints;
import java.awt.Robot;
import java.awt.SystemTray;
import java.awt.TrayIcon;
import java.awt.image.BufferedImage;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.swing.Timer;
import javax.swing.UIManager;

/**
 * KeepAlive - a blank frame with a single Start/Stop button.
 *
 * While running, it nudges the mouse pointer one pixel and immediately
 * returns it, every INTERVAL_SECONDS. The pointer ends up exactly where
 * it started, so it does not fight you if you are using the machine.
 *
 * The window never stays on top of other apps. Pressing Start moves it out
 * of the way: into the menu bar / system tray when the OS supports one
 * (Start, Stop, Show window and Quit live there), otherwise it is minimized.
 *
 * Optional argument: interval in seconds (default 30).
 *   java -jar KeepAlive.jar 45
 */
public class KeepAlive {

    private static final int DEFAULT_INTERVAL_SECONDS = 30;

    private final Robot robot;
    private final Timer timer;
    private final JButton button = new JButton("Start");
    private final MenuItem trayToggle = new MenuItem("Start");
    private JFrame frame;
    private TrayIcon trayIcon;
    private boolean running = false;

    private KeepAlive(int intervalSeconds) throws AWTException {
        this.robot = new Robot();
        this.timer = new Timer(intervalSeconds * 1000, e -> nudge());
        this.timer.setInitialDelay(0);
        this.button.addActionListener(e -> toggle());
    }

    /** Move one pixel and come straight back. */
    private void nudge() {
        Point p = MouseInfo.getPointerInfo().getLocation();
        robot.mouseMove(p.x + 1, p.y);
        robot.delay(40);
        robot.mouseMove(p.x, p.y);
    }

    private void toggle() {
        running = !running;
        String label = running ? "Stop" : "Start";
        button.setText(label);
        trayToggle.setLabel(label);
        if (trayIcon != null) {
            trayIcon.setToolTip("Keep Alive - " + (running ? "running" : "stopped"));
        }
        if (running) {
            timer.start();
            hideWindow();
        } else {
            timer.stop();
        }
    }

    /** Get the window out of the user's way without stopping the timer. */
    private void hideWindow() {
        if (trayIcon != null) {
            frame.setVisible(false);          // still reachable from the tray icon
        } else {
            frame.setState(Frame.ICONIFIED);  // no tray: minimize to the Dock/taskbar
        }
    }

    private void showWindow() {
        frame.setVisible(true);
        frame.setState(Frame.NORMAL);
        frame.toFront();
    }

    /** Menu bar (macOS) / system tray (Windows, most Linux) icon. */
    private void installTrayIcon() {
        if (!SystemTray.isSupported()) {
            return;
        }
        PopupMenu menu = new PopupMenu();
        trayToggle.addActionListener(e -> SwingUtilities.invokeLater(this::toggle));
        MenuItem show = new MenuItem("Show window");
        show.addActionListener(e -> SwingUtilities.invokeLater(this::showWindow));
        MenuItem quit = new MenuItem("Quit");
        quit.addActionListener(e -> System.exit(0));
        menu.add(trayToggle);
        menu.add(show);
        menu.addSeparator();
        menu.add(quit);

        TrayIcon icon = new TrayIcon(createIconImage(), "Keep Alive - stopped", menu);
        icon.setImageAutoSize(true);
        try {
            SystemTray.getSystemTray().add(icon);
            trayIcon = icon;
        } catch (AWTException ex) {
            // tray refused the icon; fall back to minimizing
        }
    }

    private static BufferedImage createIconImage() {
        BufferedImage img = new BufferedImage(32, 32, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setColor(new Color(0x2E7D32));
        g.fillOval(4, 4, 24, 24);
        g.dispose();
        return img;
    }

    private void show(int intervalSeconds) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.add(button, BorderLayout.CENTER);
        panel.setPreferredSize(new Dimension(220, 90));

        frame = new JFrame("Keep Alive");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setContentPane(panel);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setResizable(false);
        installTrayIcon();
        frame.setVisible(true);
    }

    public static void main(String[] args) {
        int seconds = DEFAULT_INTERVAL_SECONDS;
        if (args.length > 0) {
            try {
                seconds = Math.max(1, Integer.parseInt(args[0].trim()));
            } catch (NumberFormatException ignored) {
                // fall through to the default
            }
        }
        final int interval = seconds;

        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {
                // system look and feel is a nicety, not a requirement
            }
            try {
                new KeepAlive(interval).show(interval);
            } catch (AWTException ex) {
                JOptionPane.showMessageDialog(null,
                        "This system does not allow control of the mouse pointer:\n" + ex.getMessage(),
                        "Keep Alive", JOptionPane.ERROR_MESSAGE);
            }
        });
    }
}
