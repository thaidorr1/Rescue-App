import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Import các màn hình
import ChatScreen from "@/src/Services/ChatScreen"; // Import file Chat
import SosDetailSubmit from "@/src/User/SosDetailSubmit";
import SosRequest from "@/src/User/SosRequest";
import SosTracking from "@/src/User/SosTracking";
import UserHistory from "@/src/User/UserHistory";
import UserHome from "@/src/User/UserHome";
import UserProfile from "@/src/User/UserProfile";
import RatingScreen from "../Services/RatingScreen";
import VolunteerInbox from "../Services/VolunteerInbox";
import VolunteerVerification from "../Services/VolunteerVerification";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserHome" component={UserHome} />
      <Stack.Screen name="SosRequest" component={SosRequest} />
      <Stack.Screen name="SosDetailSubmit" component={SosDetailSubmit} />
      <Stack.Screen name="SosTracking" component={SosTracking} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="VolunteerVerification" component={VolunteerVerification} />
      <Stack.Screen name="VolunteerInbox" component={VolunteerInbox} />
      <Stack.Screen name="RatingScreen" component={RatingScreen} />
    </Stack.Navigator>
  );
}

export default function UserNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#FF6B35" }}>
      <Tab.Screen name="Home" component={HomeStack} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="home-outline" size={24} color={color} /> }} 
      />
      <Tab.Screen name="History" component={UserHistory} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="time-outline" size={24} color={color} /> }} 
      />
      <Tab.Screen name="Profile" component={UserProfile} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="person-outline" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}