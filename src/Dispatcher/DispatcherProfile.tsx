import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../Context/AuthContext";

export default function DispatcherProfile() {
  const { profile, user, logout } = useAuth();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Hồ sơ</Text>

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Ionicons name="headset" size={45} color="#FF6B35" />
          </View>
          <View style={styles.onlineBadge} />
        </View>

        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.infoGrid}>
          <ProfileInfo label="Số điện thoại" value={profile?.phone} icon="phone" />
          <ProfileInfo label="Vai trò hệ thống" value={profile?.role?.toUpperCase()} icon="shield-account" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Đăng xuất hệ thống</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ProfileInfo = ({ label, value, icon }: any) => (
  <View style={styles.infoBox}>
    <View style={styles.iconCircle}><MaterialCommunityIcons name={icon} size={20} color="#64748B" /></View>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC", padding: 25, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "900", color: "#0F172A", marginBottom: 30 },
  card: { backgroundColor: "#fff", borderRadius: 40, padding: 30, alignItems: "center", elevation: 5, shadowColor: '#000', shadowOpacity: 0.1 },
  avatarWrapper: { position: 'relative', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 35, backgroundColor: "#FFF5F2", justifyContent: "center", alignItems: "center" },
  onlineBadge: { position: 'absolute', bottom: -5, right: -5, width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', borderWidth: 4, borderColor: '#FFF' },
  name: { fontSize: 24, fontWeight: "900", color: "#0F172A" },
  email: { color: "#94A3B8", marginTop: 4, marginBottom: 35, fontWeight: '600' },
  infoGrid: { width: "100%", gap: 15 },
  infoBox: { width: "100%", backgroundColor: "#F8FAFC", borderRadius: 25, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  label: { color: "#64748B", fontSize: 11, fontWeight: "700", textTransform: 'uppercase' },
  value: { color: "#1E293B", fontSize: 16, fontWeight: "800", marginTop: 2 },
  logoutBtn: { width: "100%", height: 65, borderRadius: 25, backgroundColor: "#0F172A", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, gap: 10, elevation: 5 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "900" }
});