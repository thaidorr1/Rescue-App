import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../Context/AuthContext";


export default function RescueProfile() {
  const { profile, user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn muốn thoát khỏi hệ thống tác chiến?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Hồ sơ cứu hộ</Text>

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="shield-account" size={48} color="#FF6B35" />
          </View>
          <View style={styles.onlineStatus} />
        </View>

        <Text style={styles.name}>{profile?.full_name || "Nhân viên cứu hộ"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.infoSection}>
          <InfoItem label="Số điện thoại cá nhân" value={profile?.phone || "N/A"} icon="phone" />
          <InfoItem label="Vị trí công tác" value={profile?.role || "Rescuer"} icon="badge-account" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FFF" />
          <Text style={styles.logoutText}>ĐĂNG XUẤT HỆ THỐNG</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerInfo}>
        <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
        <Text style={styles.footerText}>Hệ thống cứu hộ trực tuyến • DTU 2026</Text>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ label, value, icon }: any) => (
  <View style={styles.infoBox}>
    <View style={styles.iconCircle}>
      <MaterialCommunityIcons name={icon} size={20} color="#64748B" />
    </View>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 25, paddingTop: 65 },
  title: { fontSize: 30, fontWeight: "900", color: "#0F172A", marginBottom: 30 },
  card: { backgroundColor: "#fff", borderRadius: 40, padding: 30, alignItems: "center", elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  avatarWrapper: { position: 'relative', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 35, backgroundColor: "#FFF5F2", justifyContent: "center", alignItems: "center" },
  onlineStatus: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', borderWidth: 4, borderColor: '#FFF' },
  name: { fontSize: 24, fontWeight: "900", color: "#0F172A" },
  email: { color: "#94A3B8", marginTop: 4, marginBottom: 35, fontWeight: '600' },
  infoSection: { width: "100%", gap: 15 },
  infoBox: { width: "100%", backgroundColor: "#F8FAFC", borderRadius: 25, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  label: { color: "#64748B", fontSize: 11, fontWeight: "700", textTransform: 'uppercase' },
  value: { color: "#1E293B", fontSize: 16, fontWeight: "800", marginTop: 2 },
  logoutBtn: { width: "100%", height: 65, borderRadius: 25, backgroundColor: "#0F172A", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 35, gap: 10, elevation: 8, shadowColor: '#0F172A', shadowOpacity: 0.3 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 1 },
  footerInfo: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, gap: 6 },
  footerText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' }
});