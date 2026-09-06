import java.awt.AWTException;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Robot;
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
 * Optional argument: interval in seconds (default 30).
 *   java -jar KeepAlive.jar 45
 */
public class KeepAlive {

    private static final int DEFAULT_INTERVAL_SECONDS = 30;

    private final Robot robot;
    private final Timer timer;
    private final JButton button = new JButton("Start");
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
        if (running) {
            timer.start();
            button.setText("Stop");
        } else {
            timer.stop();
            button.setText("Start");
        }
    }

    private void show(int intervalSeconds) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.add(button, BorderLayout.CENTER);
        panel.setPreferredSize(new Dimension(220, 90));

        JFrame frame = new JFrame("Keep Alive");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setContentPane(panel);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setAlwaysOnTop(true);
        frame.setResizable(false);
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
