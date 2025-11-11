import * as Notifications from "expo-notifications";

/** Compat: handler cho nhiều phiên bản typings khác nhau */
Notifications.setNotificationHandler({
  // Cast về NotificationBehavior cho chắc chắn
  handleNotification: async (): Promise<Notifications.NotificationBehavior> =>
    ({
      // Newer SDKs
      shouldShowBanner: true,
      shouldShowList: true,
      // Older SDKs
      shouldShowAlert: true,
      // Chung
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as any),
});

/** Xin quyền thông báo */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/** Compat builder: tạo trigger hằng ngày 19:00, hoặc theo giờ/phút tuỳ chọn */
function buildDailyTrigger(hour: number, minute: number) {
  // Hai biến thể: có/không có 'type: "calendar"'
  // -> cast về any để không bị kẹt bởi sự khác biệt typings
  const legacy = { hour, minute, repeats: true } as any;                  // SDK cũ
  const calendar = { type: "calendar", hour, minute, repeats: true } as any; // SDK mới
  // Dùng biến thể không 'type' để an toàn hơn (ít lỗi TS hơn)
  return legacy as Notifications.NotificationTriggerInput;
}

/** Đặt lịch:
 * repeatDaily = true  -> lặp hằng ngày theo giờ:phút
 * repeatDaily = false -> 1 lần duy nhất (Date)
 */
export async function scheduleStudyReminder(
  courseName: string,
  dateTime: Date,
  repeatDaily = true
): Promise<string> {
  const content: Notifications.NotificationContentInput = {
    title: "Study Reminder",
    body: `It's time to study your planned course: ${courseName}`,
  };

  if (repeatDaily) {
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const trigger = buildDailyTrigger(hour, minute);
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger, // đã cast compat
    });
    return id;
  }

  // One-shot: truyền trực tiếp Date (cast để né sai khác typings)
  const id = await Notifications.scheduleNotificationAsync({
    content,
    trigger: dateTime as unknown as Notifications.NotificationTriggerInput,
  });
  return id;
}

/** Hủy 1 lịch */
export async function cancelReminder(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {}
}
