import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SafetyCircle({ navigation }: any) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const fetchContacts = async () => {
    const { data } = await supabase.from("emergency_contacts").select("*").eq("user_id", user?.id);
    if (data) setContacts(data);
  };

  useEffect(() => { fetchContacts(); }, []);

  const addContact = async () => {
    if (contacts.length >= 5) return Alert.alert("Lưu ý", "Bạn chỉ nên thêm tối đa 5 người thân.");
    if (!name || !phone) return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");

    const { error } = await supabase.from("emergency_contacts").insert([{ user_id: user?.id, name, phone_number: phone }]);
    if (!error) {
      setName(""); setPhone("");
      fetchContacts();
    }
  };

  const deleteContact = async (id: string) => {
    await supabase.from("emergency_contacts").delete().eq("id", id);
    fetchContacts();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#0F172A" /></TouchableOpacity>
        <Text style={styles.title}>Vòng tròn an toàn</Text>
      </View>

      <View style={styles.addForm}>
        <TextInput style={styles.input} placeholder="Tên người thân" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Số điện thoại" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TouchableOpacity style={styles.addBtn} onPress={addContact}>
          <Text style={styles.addBtnText}>THÊM VÀO VÒNG TRÒN</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone_number}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteContact(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF', padding: 25, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 22, fontWeight: '900', marginLeft: 15, color: '#0F172A' },
  addForm: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 25, marginBottom: 30 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  addBtn: { backgroundColor: '#0F172A', padding: 15, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: '800' },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderRadius: 18, marginBottom: 12, elevation: 2 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  contactPhone: { fontSize: 13, color: '#64748B', marginTop: 2 }
});