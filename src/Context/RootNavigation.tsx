import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "./AuthContext";

// Import các luồng điều hướng chính
import AuthNavigation from "./AuthNavigation";
import DispatcherNavigation from "./DispatcherNavigation";
import RescueNavigation from "./RescueNavigation";
import UserNavigation from "./UserNavigaiton"; // Giữ nguyên tên file sai chính tả của bạn

// Import các màn hình SOS dùng chung
import ChatScreen from "@/src/Services/ChatScreen";
import SosDetailSubmit from "@/src/User/SosDetailSubmit";
import SosRequest from "@/src/User/SosRequest";
import SosTracking from "@/src/User/SosTracking";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const { session, profile, loading } = useAuth();

  // QUAN TRỌNG: Đợi tải xong thông tin người dùng để không hiện sai màn hình lúc khởi động
  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* BƯỚC 1: KIỂM TRA ĐĂNG NHẬP TRƯỚC TIÊN. 
        Màn hình AuthStack nằm đầu tiên nên khi mở app sẽ hiện trang ĐĂNG NHẬP nếu chưa login.
      */}
      {!session ? (
        <Stack.Screen name="AuthStack" component={AuthNavigation} />
      ) : (
        // BƯỚC 2: PHÂN QUYỀN CHÍNH XÁC KHI ĐÃ ĐĂNG NHẬP
        <>
          {profile?.role === "rescue_team" ? (
            <Stack.Screen name="RescueStack" component={RescueNavigation} />
          ) : profile?.role === "dispatcher" ? (
            // FIX: Nhánh riêng cho Dispatcher để không bị nhảy vào giao diện User
            <Stack.Screen name="DispatcherStack" component={DispatcherNavigation} />
          ) : (
            // Mặc định là Người dân (User)
            <Stack.Screen name="UserStack" component={UserNavigation} />
          )}
        </>
      )}

      {/* BƯỚC 3: NHÓM MÀN HÌNH SOS TOÀN CỤC.
        Đặt ở dưới cùng để chúng không bao giờ là màn hình mặc định khi mở app.
      */}
      <Stack.Group>
        <Stack.Screen name="SosRequest" component={SosRequest} />
        <Stack.Screen name="SosDetailSubmit" component={SosDetailSubmit} />
        <Stack.Screen name="SosTracking" component={SosTracking} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}