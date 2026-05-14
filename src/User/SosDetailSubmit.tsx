import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Network from 'expo-network'; // Thư viện kiểm tra mạng
import * as SMS from 'expo-sms'; // Thư viện gửi tin nhắn
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SosDetailSubmit({ route, navigation }: any) {
  const { emergencyType } = route.params; // Lấy loại khẩn cấp từ trang trước
  const { user, profile } = useAuth();    // Lấy thông tin người dùng từ AuthContext
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hàm chụp ảnh hiện trường
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Lỗi", "Cần quyền camera để báo cáo sự cố.");
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.4 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // HÀM XỬ LÝ GỬI CỨU HỘ CHÍNH
  const handleSend = async () => {
    setLoading(true);
    try {
      // 1. Lấy tọa độ GPS chính xác
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      // 2. Kiểm tra trạng thái kết nối Internet
      const networkState = await Network.getNetworkStateAsync();
      const isOnline = networkState.isConnected && networkState.isInternetReachable;

      if (isOnline) {
        // --- TRƯỜNG HỢP CÓ MẠNG: GỬI LÊN DATABASE SUPABASE ---
        let addressDisplay = "Vị trí GPS: " + lat.toFixed(4) + ", " + lng.toFixed(4);
        try {
          let reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
          if (reverseGeocode.length > 0) {
            const loc = reverseGeocode[0];
            addressDisplay = `${loc.streetNumber || ''} ${loc.street || ''}, ${loc.region || ''}`.trim();
          }
        } catch (e) { console.log("Lỗi lấy địa chỉ, dùng tọa độ"); }

        const { data, error } = await supabase.from("sos_requests").insert([{ 
          emergency_type: emergencyType, 
          description, 
          address: addressDisplay, 
          latitude: lat, 
          longitude: lng, 
          user_id: user?.id, 
          status: "pending"
        }]).select().single();

        if (error) throw error;
        navigation.replace("SosTracking", { requestId: data.id });

      } else {
        // --- TRƯỜNG HỢP KHÔNG CÓ MẠNG: GỬI QUA TIN NHẮN SMS ---
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
          const smsBody = `[SOS KHẨN CẤP]\nLoại: ${emergencyType}\nNgười gửi: ${profile?.full_name || "Nạn nhân"}\nVị trí: ${mapLink}\nMô tả: ${description || "Cần cứu trợ khẩn cấp!"}`;

          // Số điện thoại của tổng đài hoặc điều phối viên (Công hãy thay số này)
          const { result } = await SMS.sendSMSAsync(['056500179'], smsBody);
          
          if (result === 'sent') {
            Alert.alert("Thành công", "Đã gửi tín hiệu SOS qua tin nhắn SMS do không có mạng.");
            navigation.navigate("UserHome");
          }
        } else {
          Alert.alert("Lỗi", "Thiết bị của bạn không hỗ trợ tính năng gửi SMS.");
        }
      }

    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể xác định vị trí. Vui lòng bật GPS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: 25 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Báo cáo: {emergencyType}</Text>
      </View>

      <Text style={styles.label}>Mô tả tình hình</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nêu ngắn gọn vấn đề (ví dụ: bị kẹt trong đám cháy, tai nạn xe...)" 
        multiline 
        value={description} 
        onChangeText={setDescription} 
      />

      <Text style={styles.label}>Hình ảnh minh chứng</Text>
      <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="camera" size={40} color="#94A3B8" />
            <Text style={styles.imageText}>Chụp ảnh hiện trường</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
        onPress={handleSend} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>GỬI CỨU HỘ NGAY</Text>}
      </TouchableOpacity>
      
      <Text style={styles.note}>* Hệ thống sẽ tự động gửi tin nhắn SMS nếu không có kết nối internet.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 45, marginBottom: 30 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  label: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 10, marginLeft: 5 },
  input: { backgroundColor: '#F8FAFC', padding: 22, borderRadius: 28, minHeight: 130, marginBottom: 25, fontSize: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: '#F1F5F9' },
  imageBtn: { height: 230, backgroundColor: '#F8FAFC', borderRadius: 32, borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginBottom: 35 },
  imageText: { color: '#94A3B8', marginTop: 10, fontWeight: '700' },
  preview: { width: '100%', height: '100%', borderRadius: 32 },
  submitBtn: { backgroundColor: '#EF4444', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  note: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 15, fontStyle: 'italic' }
});