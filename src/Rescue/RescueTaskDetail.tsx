import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function RescueTaskDetail({ route, navigation }: any) {
  // Đồng bộ tham số taskId từ màn hình danh sách nhiệm vụ
  const { taskId } = route.params || {}; 
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      Alert.alert("Lỗi", "Không tìm thấy mã nhiệm vụ.");
      return navigation.goBack();
    }
    fetchTaskDetail();
  }, [taskId]);

  const fetchTaskDetail = async () => {
    try {
      // Lấy thông tin vụ việc và hồ sơ nạn nhân
      const { data, error } = await supabase
        .from("sos_requests")
        .select(`*, profiles(full_name, phone_number)`)
        .eq("id", taskId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Nhiệm vụ không tồn tại.");

      setTask(data);
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể lấy thông tin nhiệm vụ.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // CHỨC NĂNG CHỈ ĐƯỜNG: Mở Google Maps/Apple Maps
  const openNavigation = () => {
    if (!task?.latitude || !task?.longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${task.latitude},${task.longitude}`;
    Linking.openURL(url);
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("sos_requests")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;
      Alert.alert("Thành công", `Trạng thái: ${newStatus}`);
      fetchTaskDetail();
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể cập nhật.");
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;
  
  // FIX: Ngăn chặn lỗi Render khi dữ liệu tọa độ chưa sẵn sàng
  if (!task || !task.latitude) {
    return (
      <View style={styles.errorContainer}>
        <Text>Đang tải dữ liệu nhiệm vụ...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết nhiệm vụ</Text>
      </View>

      <View style={styles.mapWrapper}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          style={styles.map} 
          initialRegion={{ 
            latitude: task.latitude,
            longitude: task.longitude, 
            latitudeDelta: 0.005, 
            longitudeDelta: 0.005 
          }}
        >
          <Marker coordinate={{ latitude: task.latitude, longitude: task.longitude }} />
        </MapView>
      </View>

      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{task.emergency_type}</Text></View>
          <Text style={styles.statusLabel}>TT: {task.status.toUpperCase()}</Text>
        </View>

        <Text style={styles.address}>📍 {task.address || "Địa chỉ không xác định"}</Text>

        <View style={styles.userCard}>
          <Ionicons name="person-circle" size={40} color="#CBD5E1" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.userName}>{task.profiles?.full_name || "Nạn nhân"}</Text>
            <Text style={styles.userPhone}>{task.profiles?.phone_number || "Không có SĐT"}</Text>
          </View>
          
          {/* NÚT NHẮN TIN VỚI NẠN NHÂN */}
          <TouchableOpacity 
            style={styles.chatIconBtn} 
            onPress={() => navigation.navigate("ChatScreen", { requestId: task.id, recipientName: task.profiles?.full_name })}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Mô tả vụ việc</Text>
        <Text style={styles.description}>{task.description || "Không có mô tả chi tiết."}</Text>

        {task.image_url && (
          <Image source={{ uri: task.image_url }} style={styles.evidenceImage} />
        )}

        {/* KHU VỰC ĐIỀU KHIỂN TÁC CHIẾN */}
        <View style={styles.actionGrid}>
          {/* NÚT CHỈ ĐƯỜNG LUÔN HIỂN THỊ */}
          <TouchableOpacity style={[styles.btn, styles.navBtn]} onPress={openNavigation}>
            <MaterialCommunityIcons name="google-maps" size={24} color="#FFF" />
            <Text style={styles.btnText}>CHỈ ĐƯỜNG</Text>
          </TouchableOpacity>

          {task.status === 'assigned' && (
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#3B82F6' }]} onPress={() => updateStatus('arrived')}>
              <Text style={styles.btnText}>ĐÃ ĐẾN HIỆN TRƯỜNG</Text>
            </TouchableOpacity>
          )}
          
          {task.status === 'arrived' && (
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#10B981' }]} onPress={() => updateStatus('completed')}>
              <Text style={styles.btnText}>HOÀN THÀNH CỨU HỘ</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 60, paddingHorizontal: 25, marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginLeft: 15 },
  mapWrapper: { height: 230, width: '100%', backgroundColor: '#F1F5F9' },
  map: { flex: 1 },
  content: { padding: 25 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badge: { backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  badgeText: { color: '#EF4444', fontWeight: '800', fontSize: 12 },
  statusLabel: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  address: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 20, marginBottom: 25 },
  userName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  userPhone: { fontSize: 13, color: '#64748B' },
  chatIconBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase' },
  description: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 25 },
  evidenceImage: { width: '100%', height: 200, borderRadius: 20, marginBottom: 30 },
  actionGrid: { gap: 12 },
  btn: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  navBtn: { backgroundColor: '#0F172A' },
  btnText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});