import * as Notifications from 'expo-notifications';

// Cấu hình cách thông báo hiện lên khi đang mở app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true,   
    
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Hàm kích hoạt thông báo cục bộ
export const triggerLocalNotification = async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data || {},
      sound: 'default',
    },
    trigger: null, // Hiển thị ngay lập tức
  });
};