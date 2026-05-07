import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import SosRequest from "../User/SosRequest";
import SosTracking from "../User/SosTracking";
import UserHistory from "../User/UserHistory";
import UserHome from "../User/UserHome";
import UserProfile from "../User/UserProfile";

import ChatScreen from "@/Dispatcher/ChatScreen";
import LanguageScreen from "../User/LanguageScreen";
import MedicalInformation from "../User/MedicalInformation";
import NotificationScreen from "../User/NotificationScreen";
import PersonalInformation from "../User/PersonalInformation";
import SettingsScreen from "../User/SettingsScreen";

// 2. Thêm ChatScreen vào ParamList của HomeStack
export type UserHomeStackParamList = {
  UserHome: undefined;
  SosRequest: undefined;
  SosTracking: {
    requestId?: string;
  };
  ChatScreen: {       // Thêm kiểu dữ liệu cho tham số truyền vào Chat
    requestId: string;
    receiverName: string;
  };
};

export type UserProfileStackParamList = {
  UserProfileMain: undefined;
  PersonalInformation: undefined;
  MedicalInformation: undefined;
  NotificationScreen: undefined;
  LanguageScreen: undefined;
  SettingsScreen: undefined;
};

export type UserTabParamList = {
  HomeTab: undefined;
  UserHistory: undefined;
  ProfileTab: undefined;
};

const HomeStackNav = createNativeStackNavigator<UserHomeStackParamList>();
const ProfileStackNav = createNativeStackNavigator<UserProfileStackParamList>();
const Tab = createBottomTabNavigator<UserTabParamList>();

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="UserHome" component={UserHome} />
      <HomeStackNav.Screen name="SosRequest" component={SosRequest} />
      <HomeStackNav.Screen name="SosTracking" component={SosTracking} />
      <HomeStackNav.Screen name="ChatScreen" component={ChatScreen} />
    </HomeStackNav.Navigator>
  );
}


function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen
        name="UserProfileMain"
        component={UserProfile}
      />
      <ProfileStackNav.Screen
        name="PersonalInformation"
        component={PersonalInformation}
      />
      <ProfileStackNav.Screen
        name="MedicalInformation"
        component={MedicalInformation}
      />
      <ProfileStackNav.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <ProfileStackNav.Screen
        name="LanguageScreen"
        component={LanguageScreen}
      />
      <ProfileStackNav.Screen
        name="SettingsScreen"
        component={SettingsScreen}
      />
    </ProfileStackNav.Navigator>
  );
}

export default function UserNavigation() {
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
        name="HomeTab"
        component={HomeStack}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="UserHistory"
        component={UserHistory}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
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