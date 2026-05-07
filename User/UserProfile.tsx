import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { useAuth } from "../Context/AuthContext";

export default function UserProfile({ navigation }: any) {
  const { profile, logout } = useAuth();

  const menuItems = [
    {
      title: "Personal Information",
      icon: <Ionicons name="person" size={20} color="#111" />,
      onPress: () => navigation.navigate("UserProfileMain"),
      // sau này có thể đổi thành:
      // onPress: () => navigation.navigate("PersonalInformation")
    },
    {
      title: "Medical Information",
      icon: <FontAwesome5 name="briefcase-medical" size={18} color="#111" />,
      onPress: () => navigation.navigate("MedicalInformation"),
    },
    {
      title: "Notification",
      icon: <Ionicons name="notifications" size={20} color="#111" />,
      onPress: () => navigation.navigate("NotificationScreen"),
    },
    {
      title: "Language",
      icon: <MaterialCommunityIcons name="translate" size={20} color="#111" />,
      onPress: () => navigation.navigate("LanguageScreen"),
    },
    {
      title: "Settings",
      icon: <Ionicons name="settings" size={20} color="#111" />,
      onPress: () => navigation.navigate("SettingsScreen"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header user info */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={38} color="#2C7A7B" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.name}>
            {profile?.full_name?.toUpperCase() || "USER NAME"}
          </Text>
          <Text style={styles.phone}>{profile?.phone || "No phone number"}</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={item.onPress}
          >
            <View style={styles.leftSection}>
              <View style={styles.iconBox}>{item.icon}</View>
              <Text style={styles.menuText}>{item.title}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  profileHeader: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },

  avatarWrapper: {
    marginRight: 14,
  },

  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F4F8",
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  phone: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },

  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },

  menuItem: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 26,
    alignItems: "center",
    marginRight: 12,
  },

  menuText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: 24,
    backgroundColor: "#FF6B35",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});