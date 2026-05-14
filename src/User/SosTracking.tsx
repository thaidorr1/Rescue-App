import { triggerLocalNotification } from "@/lib/notificationHelper";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

// DỮ LIỆU BỘ NÃO AI HỖ TRỢ SƠ CỨU
const AI_FIRST_AID_GUIDE: any = {
  'Fire': { title: 'Hỗ trợ Hỏa hoạn', steps: ['Dùng khăn ướt che mũi và miệng.', 'Di chuyển thấp gần mặt sàn.', 'Xả nước mát vào vết bỏng 15 phút.'], color: '#EF4444', icon: 'fire' },
  'Medical': { title: 'Hỗ trợ Y tế', steps: ['Kiểm tra nhịp thở nạn nhân.', 'Thực hiện ép tim CPR nếu cần.', 'Nới lỏng quần áo cho dễ thở.'], color: '#FF6B35', icon: 'medical-bag' },
  'Accident': { title: 'Hỗ trợ Tai nạn', steps: ['Giữ nguyên hiện trường.', 'Dùng vải sạch ép chặt vết thương.', 'Tránh di chuyển nạn nhân bị đau cổ.'], color: '#3B82F6', icon: 'car-crash' },
  'Default': { title: 'Hướng dẫn an toàn', steps: ['Giữ bình tĩnh, hít thở sâu.', 'Bật đèn flash để cứu hộ thấy bạn.', 'Mở sẵn cổng nếu ở trong nhà.'], color: '#0F172A', icon: 'shield-alert' }
};

export default function SosTracking({ route, navigation }: any) {
  const { requestId } = route.params;
  const [sosDetail, setSosDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rescuerLocation, setRescuerLocation] = useState<any>(null);

  const fetchInitialData = async () => {
    const { data } = await supabase.from("sos_requests").select(`*, assignments(*, rescue_teams(*))`).eq("id", requestId).single();
    if (data) {
      setSosDetail(data);
      const rescuerId = data.assignments?.[0]?.rescue_team_id;
      if (rescuerId) fetchRescuerLocation(rescuerId);
    }
    setLoading(false);
  };

  const fetchRescuerLocation = async (id: string) => {
    const { data } = await supabase.from("profiles").select("current_lat, current_lng").eq("id", id).maybeSingle();
    if (data?.current_lat) setRescuerLocation({ latitude: data.current_lat, longitude: data.current_lng });
  };

  useEffect(() => {
    fetchInitialData();
    const subscription = supabase.channel(`tracking_${requestId}`).on("postgres_changes", { event: "UPDATE", schema: "public", table: "sos_requests", filter: `id=eq.${requestId}` }, (payload) => {
          if (payload.new.status === "arrived") triggerLocalNotification("🚑 CỨU HỘ ĐÃ ĐẾN!", "Đội cứu hộ đã có mặt.");
          fetchInitialData(); 
    }).subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, [requestId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  const isAccepted = sosDetail?.status !== "pending" && sosDetail?.status !== "completed";
  const isCompleted = sosDetail?.status === "completed";
  const guide = AI_FIRST_AID_GUIDE[sosDetail?.emergency_type] || AI_FIRST_AID_GUIDE['Default'];

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi cứu hộ</Text>
      </View>

      <View style={styles.mapBox}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{ latitude: sosDetail?.latitude || 16.0544, longitude: sosDetail?.longitude || 108.2022, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
          <Marker coordinate={{ latitude: sosDetail.latitude, longitude: sosDetail.longitude }}>
            <View style={styles.userDot} />
          </Marker>
          {isAccepted && rescuerLocation && (
            <Marker coordinate={rescuerLocation}>
              <View style={styles.rescueMarker}><Ionicons name="medical" size={16} color="#FFF" /></View>
            </Marker>
          )}
        </MapView>
      </View>

      {/* THẺ AI HỖ TRỢ SƠ CỨU */}
      {isAccepted && (
        <View style={[styles.aiCard, { borderColor: guide.color }]}>
          <View style={styles.aiHeader}>
            <View style={[styles.aiIconBox, { backgroundColor: guide.color }]}><MaterialCommunityIcons name={guide.icon} size={20} color="#FFF" /></View>
            <Text style={[styles.aiTitle, { color: guide.color }]}>AI HỖ TRỢ: {guide.title.toUpperCase()}</Text>
          </View>
          {guide.steps.map((step: string, idx: number) => (
            <View key={idx} style={styles.stepRow}><Text style={[styles.stepNum, { color: guide.color }]}>{idx + 1}.</Text><Text style={styles.stepText}>{step}</Text></View>
          ))}
        </View>
      )}

      {/* STATUS BOX - ĐÃ FIX LỖI DUPLICATE TRONG ẢNH */}
      <View style={styles.statusBox}>
        <Text style={[styles.statusText, { color: isCompleted ? '#10B981' : '#FF6B35' }]}>
          {isCompleted ? "Nhiệm vụ hoàn tất" : isAccepted ? "Đội cứu hộ đang đến" : "Đang tìm đội cứu trợ..."}
        </Text>
        <Text style={styles.idText}>Mã vụ: {requestId.slice(0, 8).toUpperCase()}</Text>

        {/* NÚT ĐÁNH GIÁ KHI HOÀN THÀNH */}
        {isCompleted && (
          <TouchableOpacity 
            style={styles.rateBtn}
            onPress={() => navigation.navigate("RatingScreen", { 
              requestId: sosDetail.id, 
              teamName: sosDetail.assignments?.[0]?.rescue_teams?.team_name || "Đội cứu hộ"
            })}
          >
            <Ionicons name="star" size={18} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.rateText}>ĐÁNH GIÁ ĐỘI CỨU HỘ</Text>
          </TouchableOpacity>
        )}
      </View>

      {isAccepted && (
        <View style={styles.teamCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.teamLabel}>Đội hỗ trợ:</Text>
            <Text style={styles.teamName}>{sosDetail?.assignments?.[0]?.rescue_teams?.team_name}</Text>
          </View>
          <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate("ChatScreen", { requestId, receiverName: "Cứu hộ" })}>
            <Ionicons name="chatbubbles" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 55, paddingHorizontal: 25, marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', marginLeft: 15, color: '#0F172A' },
  mapBox: { height: 280, borderRadius: 35, marginHorizontal: 20, overflow: 'hidden', elevation: 5 },
  map: { flex: 1 },
  userDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B82F6', borderWidth: 3, borderColor: '#FFF' },
  rescueMarker: { backgroundColor: '#EF4444', padding: 8, borderRadius: 12, elevation: 5 },
  aiCard: { margin: 20, backgroundColor: '#FFF', borderRadius: 32, padding: 25, borderWidth: 2, borderStyle: 'dashed' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  aiIconBox: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  aiTitle: { fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  stepRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  stepNum: { fontWeight: '900', width: 20 },
  stepText: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '600' },
  statusBox: { marginHorizontal: 25, backgroundColor: '#FFF', borderRadius: 28, padding: 25, alignItems: 'center', elevation: 3 },
  statusText: { fontSize: 18, fontWeight: '900' },
  idText: { fontSize: 10, color: '#94A3B8', marginTop: 5, fontWeight: '800' },
  rateBtn: { 
    backgroundColor: '#FFB800', 
    flexDirection: 'row',
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 18, 
    marginTop: 20,
    alignItems: 'center',
    elevation: 4
  },
  rateText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
  teamCard: { margin: 25, backgroundColor: '#0F172A', borderRadius: 32, padding: 20, flexDirection: 'row', alignItems: 'center' },
  teamLabel: { color: '#94A3B8', fontSize: 12 },
  teamName: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  chatBtn: { width: 55, height: 55, backgroundColor: '#FF6B35', borderRadius: 18, justifyContent: 'center', alignItems: 'center' }
});