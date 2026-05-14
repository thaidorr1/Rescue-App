import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Import các màn hình của Dispatcher
import DispatcherDashboard from "../Dispatcher/DispatcherDashboard";
import DispatcherProfile from "../Dispatcher/DispatcherProfile";
import DispatcherRequestDetail from "../Dispatcher/DispatcherRequestDetail";
import DispatcherRequests from "../Dispatcher/DispatcherRequests";
import DispatcherTeams from "../Dispatcher/DispatcherTeams";
import ChatScreen from "../Services/ChatScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RequestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DispatcherRequestsMain" component={DispatcherRequests} />
      <Stack.Screen name="DispatcherRequestDetail" component={DispatcherRequestDetail} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function DispatcherNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1BA7A6", 
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 10, borderTopWidth: 0, elevation: 10 },
      }}
    >
      <Tab.Screen 
        name="Stats" 
        component={DispatcherDashboard} 
        options={{ title: "Thống kê", tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Requests" 
        component={RequestStack} 
        options={{ title: "Yêu cầu", tabBarIcon: ({color}) => <Ionicons name="list" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Teams" 
        component={DispatcherTeams} 
        options={{ title: "Đội cứu hộ", tabBarIcon: ({color}) => <Ionicons name="people" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={DispatcherProfile} 
        options={{ title: "Cá nhân", tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}