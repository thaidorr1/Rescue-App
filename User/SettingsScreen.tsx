import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../Context/AuthContext";

export default function SettingsScreen({ navigation }: any) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Bạn có chắc muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your account and app settings.</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#111827" />
            <Text style={styles.rowText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="help-circle-outline" size={22} color="#111827" />
            <Text style={styles.rowText}>Help Center</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={styles.left}>
            <Ionicons name="information-circle-outline" size={22} color="#111827" />
            <Text style={styles.rowText}>About App</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  logoutBtn: {
    marginTop: 28,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});