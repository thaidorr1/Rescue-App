import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VolunteerInbox({ navigation }: any) {
  const { user } = useAuth();
  const [nearbyTasks, setNearbyTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNearbySos = async () => {
    setLoading(true);
    try {
      // 1. Kiểm tra quyền và dịch vụ định vị
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        setLoading(false);
        return Alert.alert("Thông báo", "Vui lòng bật GPS trên thiết bị của bạn.");
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return Alert.alert("Lỗi", "Cần quyền vị trí để tìm yêu cầu xung quanh.");
      }

      // 2. Lấy vị trí (Tối ưu hóa cho máy ảo/thiết bị yếu)
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(async () => {
        // Nếu lấy vị trí hiện tại thất bại, thử lấy vị trí gần nhất từng biết
        return await Location.getLastKnownPositionAsync({});
      });

      if (!location || !location.coords) {
        throw new Error("Không thể xác định vị trí.");
      }

      const { latitude, longitude } = location.coords;

      // 3. Cập nhật tọa độ TNV vào database để Dispatcher theo dõi
      if (user?.id) {
        await supabase.from("profiles").update({
          current_lat: latitude,
          current_lng: longitude
        }).eq("id", user.id);
      }

      // 4. Gọi RPC trên Supabase để tìm vụ việc trong bán kính 3km
      const { data, error } = await supabase.rpc('get_nearby_sos', {
        target_lat: latitude,
        target_lng: longitude,
        radius_km: 3.0 // Bán kính 3km
      });

      if (error) throw error;
      setNearbyTasks(data || []);

    } catch (e: any) {
      console.error("Lỗi định vị:", e.message);
      Alert.alert("Thông báo", "Đang gặp khó khăn khi xác định vị trí. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchNearbySos(); }, [user?.id]));

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Tìm tiếng gọi cộng đồng</Text>
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 50 }} color="#FF6B35" /> : (
        <FlatList
          data={nearbyTasks}
          refreshControl={<RefreshControl refreshing={false} onRefresh={fetchNearbySos} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="map-marker-off-outline" size={80} color="#E2E8F0" />
              <Text style={styles.emptyText}>Hiện không có yêu cầu hỗ trợ nào trong bán kính 3km quanh bạn.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("SosTracking", { requestId: item.id })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badge}><Text style={styles.badgeText}>{item.emergency_type}</Text></View>
                <Text style={styles.distText}>{item.distance.toFixed(1)} km</Text>
              </View>
              <Text style={styles.address}>📍 {item.address || "Đang xác định vị trí..."}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description || "Không có mô tả chi tiết."}</Text>
              <View style={styles.footer}>
                <Text style={styles.footerText}>XEM CHI TIẾT & HỖ TRỢ</Text>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 25 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 30 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginLeft: 15 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 15, fontSize: 14, fontWeight: '600', paddingHorizontal: 40, lineHeight: 22 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 28, padding: 22, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  badge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#EF4444', fontWeight: '900', fontSize: 10 },
  distText: { color: '#64748B', fontWeight: '800', fontSize: 12 },
  address: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  desc: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 15 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
  footerText: { fontSize: 12, fontWeight: '900', color: '#0F172A' }
});