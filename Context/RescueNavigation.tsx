import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import RescueDashboard from "../Rescue/RescueDashboard";
import RescueTasks from "../Rescue/RescueTasks";
import RescueTaskDetail from "../Rescue/RescueTaskDetail";
import RescueHistory from "../Rescue/RescueHistory";
import RescueProfile from "../Rescue/RescueProfile";

export type RescueTaskStackParamList = {
  RescueTasks: undefined;
  RescueTaskDetail: {
    assignmentId: string;
  };
};

export type RescueTabParamList = {
  RescueHome: undefined;
  RescueTasksTab: undefined;
  RescueHistory: undefined;
  RescueProfile: undefined;
};

const Tab = createBottomTabNavigator<RescueTabParamList>();
const TaskStack = createNativeStackNavigator<RescueTaskStackParamList>();

function RescueTaskStack() {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="RescueTasks" component={RescueTasks} />
      <TaskStack.Screen name="RescueTaskDetail" component={RescueTaskDetail} />
    </TaskStack.Navigator>
  );
}

export default function RescueNavigation() {
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
        name="RescueHome"
        component={RescueDashboard}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="RescueTasksTab"
        component={RescueTaskStack}
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="RescueHistory"
        component={RescueHistory}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="RescueProfile"
        component={RescueProfile}
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