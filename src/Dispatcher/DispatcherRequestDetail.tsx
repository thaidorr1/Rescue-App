import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { height } = Dimensions.get("window");

// Hàm tính khoảng cách giữa đội cứu hộ và nạn nhân
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
};

export default function DispatcherRequestDetail({ route, navigation }: any) {
  const { requestId } = route.params;
  const [request, setRequest] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchDetail(); }, [requestId]);
  useEffect(() => { if (request) fetchTeams(); }, [request]);

  const fetchDetail = async () => {
    try {
      // FIX: Chỉ lấy dữ liệu từ bảng sos_requests, không bắt buộc Join profiles
      const { data, error } = await supabase
        .from("sos_requests")
        .select("*")
        .eq("id", requestId)
        .single();
      
      if (error) throw error;
      setRequest(data);
    } catch (err: any) {
      console.error("Lỗi fetch:", err.message);
      Alert.alert("Lỗi", "Không thể tải thông tin vụ việc.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    // Lấy danh sách đội cứu hộ sẵn sàng
    const { data } = await supabase.from("rescue_teams").select("*").eq("status", "available");
    
    if (data && request) {
      const processedTeams = data.map((team: any) => ({
          ...team,
          distance: calculateDistance(request.latitude, request.longitude, team.current_lat, team.current_lng)
        })).sort((a: any, b: any) => a.distance - b.distance);
      setTeams(processedTeams);
    }
  };

  const handleAssignTeam = async (teamId: string, teamName: string) => {
    try {
      const { error: assignError } = await supabase.from("assignments").insert([{ 
        sos_request_id: requestId, 
        rescue_team_id: teamId, 
        status: "assigned" 
      }]);
      
      if (assignError) throw assignError;

      await supabase.from("sos_requests").update({ status: "assigned" }).eq("id", requestId);
      
      Alert.alert("Thành công", `Đã điều phối đội: ${teamName}`);
      navigation.goBack();
    } catch (err: any) { 
      Alert.alert("Lỗi", err.message); 
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#EF4444" />;
  if (!request) return null;

  const isAssigned = request.status !== "pending";

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.title}>Chi tiết vụ việc</Text>
        </View>

        {/* BẢN ĐỒ HIỆN TRƯỜNG */}
        <View style={styles.mapWrapper}>
          {request.latitude && request.longitude ? (
            <MapView 
              provider={PROVIDER_GOOGLE} 
              style={styles.map} 
              initialRegion={{ 
                latitude: request.latitude, 
                longitude: request.longitude, 
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005 
              }} 
              scrollEnabled={false}
            >
              <Marker coordinate={{ latitude: request.latitude, longitude: request.longitude }} />
            </MapView>
          ) : (
            <View style={styles.mapError}><Text>Vị trí chưa được xác định</Text></View>
          )}
        </View>

        {/* THÔNG TIN CHI TIẾT */}
        <View style={styles.infoCard}>
          <DetailRow 
            label="Địa chỉ" 
            value={request.address || `Tọa độ: ${request.latitude?.toFixed(5)}, ${request.longitude?.toFixed(5)}`} 
            icon="map-marker" 
            color="#3B82F6" 
          />
          <View style={styles.divider} />
          
          <DetailRow label="Loại khẩn cấp" value={request.emergency_type} icon="alert-rhombus" color="#EF4444" />
          <View style={styles.divider} />
          
          <DetailRow label="Mô tả" value={request.description || "Không có mô tả chi tiết."} icon="text-subject" color="#64748B" />

          {/* HÌNH ẢNH MINH CHỨNG (Nếu có) */}
          {request.image_url && (
            <Image source={{ uri: request.image_url }} style={styles.evidenceImage} />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isAssigned ? (
          <View style={styles.assignedBox}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.assignedText}>ĐÃ ĐƯỢC ĐIỀU PHỐI</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.assignBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.assignText}>ĐIỀU PHỐI ĐỘI CỨU HỘ</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal danh sách đội cứu hộ rảnh giữ nguyên */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đội cứu hộ sẵn sàng</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close-circle" size={32} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
            <FlatList 
              data={teams} 
              keyExtractor={(item) => item.id} 
              renderItem={({ item, index }) => (
                <TouchableOpacity style={styles.teamItem} onPress={() => handleAssignTeam(item.id, item.team_name)}>
                  <View style={styles.teamIcon}>
                    <MaterialCommunityIcons name="shield-car" size={24} color={index === 0 ? "#10B981" : "#FF6B35"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamNameText}>{item.team_name}</Text>
                    <Text style={styles.teamSub}>{item.vehicle_number} • Cách {item.distance} km</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              )} 
              ListEmptyComponent={<Text style={styles.emptyText}>Không có đội cứu hộ nào khả dụng.</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const DetailRow = ({ label, value, icon, color }: any) => (
  <View style={styles.detailRow}>
    <View style={[styles.miniIcon, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  container: { padding: 25, paddingTop: 60, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  title: { fontSize: 22, fontWeight: '900', marginLeft: 15, color: '#0F172A' },
  mapWrapper: { height: 220, borderRadius: 32, overflow: 'hidden', marginBottom: 25, elevation: 5, backgroundColor: '#F1F5F9' },
  map: { flex: 1 },
  mapError: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoCard: { backgroundColor: '#F8FAFC', borderRadius: 32, padding: 25 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  miniIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 12, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  value: { color: '#1E293B', fontWeight: '800', fontSize: 15 },
  evidenceImage: { width: '100%', height: 200, borderRadius: 20, marginTop: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 25, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  assignBtn: { backgroundColor: '#0F172A', height: 65, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  assignText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
  assignedBox: { backgroundColor: '#F0FDF4', height: 65, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  assignedText: { color: '#10B981', fontWeight: '900', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, maxHeight: height * 0.7 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  teamItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  teamIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  teamNameText: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  teamSub: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 30, fontWeight: '600' }
});