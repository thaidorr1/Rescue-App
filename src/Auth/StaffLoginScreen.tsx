import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function StaffLoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Thất bại", error.message);
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#0F172A" /></TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.staffBadge}><Text style={styles.badgeText}>STAFF ONLY</Text></View>
        <Text style={styles.title}>Cổng Nhân Viên</Text>
        <Text style={styles.subtitle}>Hệ thống tác chiến dành riêng cho lực lượng cứu hộ chuyên nghiệp.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrap}><Ionicons name="mail" size={20} color="#FF6B35" /><TextInput placeholder="Email nội bộ" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" /></View>
        <View style={styles.inputWrap}><Ionicons name="lock-closed" size={20} color="#FF6B35" /><TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} /></View>
        
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>TRUY CẬP HỆ THỐNG</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}><Text style={styles.footerText}>Bảo mật bởi DTU Emergency System</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF", padding: 30, paddingTop: 65 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  header: { marginBottom: 40 },
  staffBadge: { backgroundColor: '#0F172A', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  title: { fontSize: 32, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 10, lineHeight: 22, fontWeight: '500' },
  form: { gap: 15 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 25, paddingHorizontal: 20, height: 70, borderWidth: 1, borderColor: '#F1F5F9' },
  input: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  loginBtn: { height: 70, backgroundColor: '#FF6B35', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 20, elevation: 8, shadowColor: '#FF6B35', shadowOpacity: 0.3 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  footerText: { color: '#CBD5E1', fontSize: 12, fontWeight: '700' }
});