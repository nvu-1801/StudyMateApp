// import * as Notifications from "expo-notifications";

// // Cho phép nhận thông báo foreground
// // Notifications.setNotificationHandler({
// //   handleNotification: async () => ({
// //     shouldShowAlert: true,
// //     shouldPlaySound: true,
// //     shouldSetBadge: false,
// //   }),
// // });

// // Xin quyền khi app khởi động
// export async function requestNotificationPermission() {
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.warn("Notification permissions not granted!");
//   }
// }

// // Đặt lịch reminder
// // export async function scheduleStudyReminder(courseName: string, dateTime: Date) {
// //   await Notifications.scheduleNotificationAsync({
// //     content: {
// //       title: "Study Reminder",
// //       body: `It's time to study your planned course: ${courseName}`,
// //     },
// //     trigger: { date: dateTime }, // use Date trigger object to satisfy NotificationTriggerInput
// //   });
// // }
