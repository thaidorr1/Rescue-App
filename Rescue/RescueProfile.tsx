import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../Context/AuthContext";

export default function RescueProfile() {
  const { profile, user, logout } = useAuth();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="shield-checkmark" size={42} color="#FF6B35" />
        </View>

        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{profile?.phone || "N/A"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{profile?.role}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    paddingTop: 54,
  },
  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFF1EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  email: {
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 24,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  label: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  value: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },
  logoutBtn: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});