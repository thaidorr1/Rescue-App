import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Register({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert("Lỗi", error.message);
    else Alert.alert("Thành công", "Vui lòng xác nhận qua email của bạn.");
  };

  return (
    <ScrollView style={{backgroundColor: '#FFF'}} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      <View style={styles.root}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Tham gia mạng lưới cứu hộ cộng đồng ngay hôm nay.</Text>

        <View style={styles.inputWrap}><Ionicons name="mail-outline" size={20} color="#94A3B8" /><TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" /></View>
        <View style={styles.inputWrap}><Ionicons name="lock-closed-outline" size={20} color="#94A3B8" /><TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} /></View>

        <TouchableOpacity style={styles.regBtn} onPress={handleRegister}>
          <Text style={styles.regText}>ĐĂNG KÝ NGAY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Đã có tài khoản? <Text style={{color: '#FF6B35', fontWeight: '900'}}>Quay lại đăng nhập</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 35 },
  title: { fontSize: 32, fontWeight: '900', color: '#0F172A', marginBottom: 10 },
  subtitle: { color: '#64748B', marginBottom: 40, fontSize: 15, lineHeight: 22, fontWeight: '500' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 25, paddingHorizontal: 20, height: 70, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  input: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '600' },
  regBtn: { backgroundColor: '#0F172A', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 15, elevation: 5 },
  regText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  backLink: { marginTop: 30, alignItems: 'center' },
  backText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' }
});