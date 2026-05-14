import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RatingScreen({ route, navigation }: any) {
  const { requestId, teamName } = route.params;
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Lưu đánh giá vào vụ việc SOS
    const { error } = await supabase
      .from("sos_requests")
      .update({ rating: rating, feedback: feedback })
      .eq("id", requestId);

    setLoading(false);
    if (!error) {
      Alert.alert("Cảm ơn!", "Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ.");
      navigation.navigate("UserHome");
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Ionicons name="star-half" size={60} color="#FFB800" />
        <Text style={styles.title}>Đánh giá Cứu hộ</Text>
        <Text style={styles.subtitle}>Bạn thấy đội {teamName} hỗ trợ như thế nào?</Text>
      </View>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <Ionicons name={s <= rating ? "star" : "star-outline"} size={45} color="#FFB800" />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Lời nhắn cho đội cứu hộ..." 
        multiline 
        value={feedback} 
        onChangeText={setFeedback} 
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF", padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: "900", color: "#0F172A", marginTop: 15 },
  subtitle: { color: "#64748B", textAlign: 'center', marginTop: 10 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 30 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#F1F5F9' },
  btn: { backgroundColor: '#0F172A', height: 65, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  btnText: { color: '#FFF', fontWeight: '900' }
});