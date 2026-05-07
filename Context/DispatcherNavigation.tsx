import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import DispatcherDashboard from "../Dispatcher/DispatcherDashboard";
import DispatcherRequests from "../Dispatcher/DispatcherRequests";
import DispatcherRequestDetail from "../Dispatcher/DispatcherRequestDetail";
import DispatcherTeams from "../Dispatcher/DispatcherTeams";
import DispatcherProfile from "../Dispatcher/DispatcherProfile";

export type DispatcherRequestStackParamList = {
  DispatcherRequests: undefined;
  DispatcherRequestDetail: {
    requestId: string;
  };
};

export type DispatcherTabParamList = {
  DispatcherHome: undefined;
  DispatcherRequestsTab: undefined;
  DispatcherTeams: undefined;
  DispatcherProfile: undefined;
};

const Tab = createBottomTabNavigator<DispatcherTabParamList>();
const RequestStack =
  createNativeStackNavigator<DispatcherRequestStackParamList>();

function DispatcherRequestStack() {
  return (
    <RequestStack.Navigator screenOptions={{ headerShown: false }}>
      <RequestStack.Screen
        name="DispatcherRequests"
        component={DispatcherRequests}
      />
      <RequestStack.Screen
        name="DispatcherRequestDetail"
        component={DispatcherRequestDetail}
      />
    </RequestStack.Navigator>
  );
}

export default function DispatcherNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 8,
          backgroundColor: "#fff",
        },
      }}
    >
      <Tab.Screen
        name="DispatcherHome"
        component={DispatcherDashboard}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="DispatcherRequestsTab"
        component={DispatcherRequestStack}
        options={{
          title: "Requests",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="DispatcherTeams"
        component={DispatcherTeams}
        options={{
          title: "Teams",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="DispatcherProfile"
        component={DispatcherProfile}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}