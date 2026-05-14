import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../Context/AuthContext";

export default function MedicalInformation({ navigation }: any) {
  const { user } = useAuth();
  const [med, setMed] = useState({ blood_type: "", allergies: "", medical_conditions: "", emergency_contact: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user?.id) fetchInfo(); }, [user?.id]);

  const fetchInfo = async () => {
    const { data } = await supabase.from("medical_information").select("*").eq("user_id", user?.id).maybeSingle();
    if (data) setMed({ blood_type: data.blood_type || "", allergies: data.allergies || "", medical_conditions: data.medical_conditions || "", emergency_contact: data.emergency_contact || "" });
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from("medical_information").upsert({ user_id: user?.id, ...med, updated_at: new Date() });
    setLoading(false);
    if (!error) { Alert.alert("Thành công", "Thông tin đã được lưu."); navigation.goBack(); }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#111827" /></TouchableOpacity>
        <Text style={styles.title}>Hồ sơ Y tế</Text>
        <Text style={styles.subtitle}>Thông tin này hỗ trợ đội cứu hộ xử lý an toàn hơn.</Text>

        <InputBox label="Nhóm máu" icon="water" value={med.blood_type} onChange={(t) => setMed({...med, blood_type: t})} />
        <InputBox label="Dị ứng" icon="alert-circle" value={med.allergies} onChange={(t) => setMed({...med, allergies: t})} />
        <InputBox label="Bệnh lý nền" icon="clipboard-text" value={med.medical_conditions} onChange={(t) => setMed({...med, medical_conditions: t})} multiline />
        <InputBox label="Liên hệ khẩn cấp" icon="phone" value={med.emergency_contact} onChange={(t) => setMed({...med, emergency_contact: t})} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>{loading ? "Đang lưu..." : "Lưu thông tin"}</Text></TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const InputBox = ({ label, icon, value, onChange, ...props }: any) => (
  <View style={styles.inputWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.row}>
      <MaterialCommunityIcons name={icon} size={20} color="#FF6B35" />
      <TextInput style={styles.input} value={value} onChangeText={onChange} {...props} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 25, paddingTop: 60 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 2 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { color: '#64748B', marginBottom: 35, lineHeight: 22 },
  inputWrap: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 8, marginLeft: 5 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 22, paddingHorizontal: 18, elevation: 2 },
  input: { flex: 1, paddingVertical: 16, marginLeft: 12, fontSize: 15, color: '#0F172A' },
  button: { height: 65, borderRadius: 25, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', marginTop: 15, elevation: 5 },
  buttonText: { color: '#FFF', fontWeight: '900', fontSize: 16 }
});