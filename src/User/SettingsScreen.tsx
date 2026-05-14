import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../Context/AuthContext";

export default function SettingsScreen({ navigation }: any) {
  const { logout } = useAuth();

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#0F172A" /></TouchableOpacity>
      <Text style={styles.title}>Cài đặt</Text>
      
      <View style={styles.card}>
        <SettingRow icon="person-outline" label="Thông tin cá nhân" onPress={() => navigation.navigate("PersonalInformation")} />
        <SettingRow icon="medical-outline" label="Hồ sơ y tế" onPress={() => navigation.navigate("MedicalInformation")} />
        <SettingRow icon="notifications-outline" label="Thông báo" onPress={() => navigation.navigate("NotificationScreen")} />
        <SettingRow icon="language-outline" label="Ngôn ngữ" onPress={() => navigation.navigate("LanguageScreen")} last />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert("Đăng xuất", "Bạn chắc chắn chứ?", [{ text: "Hủy" }, { text: "Đăng xuất", style: "destructive", onPress: logout }])}>
        <Ionicons name="log-out" size={22} color="#EF4444" />
        <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
}

const SettingRow = ({ icon, label, onPress, last }: any) => (
  <TouchableOpacity style={[styles.row, last && { borderBottomWidth: 0 }]} onPress={onPress}>
    <View style={styles.left}><Ionicons name={icon} size={22} color="#0F172A" /><Text style={styles.rowText}>{label}</Text></View>
    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC', padding: 25, paddingTop: 60 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 2 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 30 },
  card: { backgroundColor: '#FFF', borderRadius: 32, paddingHorizontal: 20, elevation: 3 },
  row: { minHeight: 75, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  rowText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  logoutBtn: { marginTop: 40, height: 65, borderRadius: 25, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: '#FEE2E2' },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '900' }
});