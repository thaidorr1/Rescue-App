import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Import các file màn hình
import SosRequest from "@/src/User/SosRequest";
import SosTracking from "@/src/User/SosTracking";
import Register from "../Auth/Register";
import StaffLoginScreen from "../Auth/StaffLoginScreen";
import UserLoginScreen from "../Auth/UserLoginScreen";



export type AuthStackParamList = {
  UserLoginScreen: undefined;
  StaffLoginScreen: undefined; // Tên này cực kỳ quan trọng
  Register: undefined;
  SosRequest: undefined;
  SosTracking: { requestId: string };
};


const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigation() {
  return (
    <Stack.Navigator 
      initialRouteName="UserLoginScreen" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="UserLoginScreen" component={UserLoginScreen} />
      
      {/* KHAI BÁO TÊN MÀN HÌNH NHÂN VIÊN TẠI ĐÂY */}
      <Stack.Screen name="StaffLoginScreen" component={StaffLoginScreen} />
      
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="SosRequest" component={SosRequest} />
      <Stack.Screen name="SosTracking" component={SosTracking} />
    </Stack.Navigator>
  );
}