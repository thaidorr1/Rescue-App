import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function UserLoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Lỗi", error.message);
    setLoading(false);
  };

  return (
    <ScrollView style={{backgroundColor: '#FFF'}} contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.logoCircle}><Ionicons name="shield-checkmark" size={40} color="#FF6B35" /></View>
          <Text style={styles.appName}>RESCUE CONNECT</Text>
        </View>

        <TouchableOpacity style={styles.sosMainBtn} onPress={() => navigation.navigate("SosRequest")}>
          <View style={styles.sosIconCircle}><Ionicons name="megaphone" size={32} color="#EF4444" /></View>
          <View style={{flex: 1}}>
            <Text style={styles.sosMainText}>CỨU HỘ KHẨN CẤP</Text>
            <Text style={styles.sosSubText}>Gửi vị trí GPS ngay • Không cần đăng nhập</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <View style={styles.inputWrap}><Ionicons name="mail-outline" size={20} color="#94A3B8" /><TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" /></View>
          <View style={styles.inputWrap}><Ionicons name="lock-closed-outline" size={20} color="#94A3B8" /><TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} /></View>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Chưa có tài khoản? <Text style={styles.linkHighlight}>Đăng ký ngay</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.staffBtn} onPress={() => navigation.navigate("StaffLoginScreen")}>
          <Text style={styles.staffBtnText}>Bạn là nhân viên? <Text style={{color: '#FF6B35', fontWeight: '900'}}>Cổng nhân sự</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 30, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 28, backgroundColor: '#FFF5F2', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  appName: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginTop: 15 },
  sosMainBtn: { backgroundColor: '#EF4444', borderRadius: 32, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 35, elevation: 10 },
  sosIconCircle: { width: 55, height: 55, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  sosMainText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  sosSubText: { color: '#FEE2E2', fontSize: 11, marginTop: 2 },
  inputGroup: { gap: 15, marginBottom: 20 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 22, paddingHorizontal: 20, height: 65, borderWidth: 1, borderColor: '#F1F5F9' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600' },
  loginBtn: { height: 65, backgroundColor: '#0F172A', borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  loginBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#64748B', fontSize: 14 },
  linkHighlight: { color: '#FF6B35', fontWeight: '900' },
  staffBtn: { marginTop: 30, alignItems: 'center' },
  staffBtnText: { color: '#94A3B8', fontSize: 12 }
});