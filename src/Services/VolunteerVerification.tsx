import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VolunteerVerification({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    // Cập nhật trạng thái tình nguyện viên trong database
    const { error } = await supabase
      .from("profiles")
      .update({ is_volunteer: true, volunteer_status: 'verified' })
      .eq("id", user?.id);

    setLoading(false);
    if (!error) {
      Alert.alert("Chúc mừng!", "Bạn đã trở thành Tình nguyện viên. Hệ thống sẽ báo tin khi có người cần giúp đỡ quanh bạn.");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.root}>
      <Ionicons name="shield-checkmark" size={100} color="#10B981" />
      <Text style={styles.title}>Xác minh Tình nguyện viên</Text>
      <Text style={styles.desc}>
        Bằng cách nhấn xác nhận, bạn đồng ý nhận thông báo và hỗ trợ các vụ việc SOS trong bán kính 3km quanh vị trí của mình khi có thể.
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>• Luôn đảm bảo an toàn cho bản thân trước.</Text>
        <Text style={styles.infoText}>• Chỉ hỗ trợ trong khả năng và chuyên môn.</Text>
        <Text style={styles.infoText}>• Thông tin vị trí của bạn sẽ được bảo mật.</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleVerify} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "ĐANG XỬ LÝ..." : "TÔI SẴN SÀNG HỖ TRỢ"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF', padding: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginTop: 20 },
  desc: { textAlign: 'center', color: '#64748B', marginTop: 15, lineHeight: 22, fontWeight: '600' },
  infoBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, marginVertical: 30, width: '100%' },
  infoText: { color: '#1E293B', fontSize: 13, marginBottom: 8, fontWeight: '700' },
  btn: { backgroundColor: '#10B981', width: '100%', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 }
});