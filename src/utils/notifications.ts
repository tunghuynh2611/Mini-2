import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior for native
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Request notification permissions safely across platforms
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await window.Notification.requestPermission();
        return permission === 'granted';
      } catch {
        return false;
      }
    }
    return true;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Could not request notification permissions:', error);
    return false;
  }
}

/**
 * Send an immediate booking confirmation notification
 */
export async function sendBookingConfirmationNotification(
  roomName: string,
  date: string,
  startTime: string,
  endTime: string
) {
  const title = '🎉 Room Reserved!';
  const body = `You booked ${roomName} on ${date} from ${startTime} to ${endTime}.`;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      try {
        new window.Notification(title, { body });
      } catch {
        // fallback
      }
    }
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // trigger immediately
    });
  } catch (e) {
    console.warn('Immediate notification error:', e);
  }
}

/**
 * Schedule a local reminder 15 minutes before the booking starts
 */
export async function scheduleBookingReminder(
  bookingId: string,
  roomName: string,
  date: string,
  startTime: string
): Promise<string | null> {
  // Parse date and startTime into a target Date object
  // e.g. date: "2026-10-01", startTime: "14:00"
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);
  const targetDate = new Date(year, month - 1, day, hours, minutes);

  // Set reminder 15 minutes prior
  const reminderDate = new Date(targetDate.getTime() - 15 * 60 * 1000);
  const now = new Date();

  // If the booking is in the past or reminder time already passed, don't schedule
  if (reminderDate.getTime() <= now.getTime()) {
    return null;
  }

  if (Platform.OS === 'web') {
    // On web, background scheduling is limited, so we rely on immediate feedback
    return `web-scheduled-${bookingId}`;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Study Session Reminder',
        body: `Your booking at ${roomName} starts in 15 minutes! Don't forget your student card.`,
        data: { bookingId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });
    return id;
  } catch (error) {
    console.warn('Could not schedule booking reminder notification:', error);
    return null;
  }
}
