import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function RescueTaskDetail({ route, navigation }: any) {
  const { taskId } = route.params || {}; 
  const { user } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchTaskDetail(); }, [taskId]);

  const fetchTaskDetail = async () => {
    const { data } = await supabase.from("sos_requests").select("*, profiles(*), assignments(*)").eq("id", taskId).single();
    if (data) setTask(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (nextStatus: string) => {
    setUpdating(true);
    const { error } = await supabase.from("sos_requests").update({ status: nextStatus }).eq("id", taskId);
    if (!error) {
      if (nextStatus === "completed") navigation.goBack();
      else fetchTaskDetail();
    }
    setUpdating(false);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  const isAccepted = task?.status !== "pending";
  const citizenName = task?.profiles?.full_name || "Người dân ẩn danh";

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color="#0F172A" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tác chiến</Text>
      </View>

      <View style={styles.mapBox}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{ latitude: task.latitude, longitude: task.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }}>
          <Marker coordinate={{ latitude: task.latitude, longitude: task.longitude }} />
        </MapView>
        <TouchableOpacity style={styles.navBtn} onPress={() => Linking.openURL(`geo:${task.latitude},${task.longitude}?q=${task.latitude},${task.longitude}`)}>
          <Ionicons name="navigate" size={18} color="#FFF" /><Text style={styles.navText}>CHỈ ĐƯỜNG</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.emergencyType}>{task?.emergency_type}</Text>
        <View style={styles.locationRow}><Ionicons name="location" size={20} color="#FF6B35" /><Text style={styles.address}>{task?.address || "Đang xác định..."}</Text></View>
        <View style={styles.divider} />
        <Text style={styles.label}>Mô tả hiện trường:</Text>
        <Text style={styles.desc}>{task?.description || "Không có mô tả thêm."}</Text>
      </View>

      {task?.image_url && <Image source={{ uri: task.image_url }} style={styles.evidenceImage} />}

      <View style={styles.footer}>
        {!isAccepted ? (
          <TouchableOpacity style={styles.acceptBtn} onPress={() => handleUpdateStatus("assigned")} disabled={updating}><Text style={styles.btnText}>TIẾP NHẬN NHIỆM VỤ</Text></TouchableOpacity>
        ) : (
          <View style={{ gap: 15 }}>
            <View style={styles.contactBar}>
              <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate("ChatScreen", { requestId: task.id, receiverName: citizenName })}><Ionicons name="chatbubble" size={24} color="#FFF" /></TouchableOpacity>
              <TouchableOpacity style={styles.callBtn} onPress={() => task?.profiles?.phone && Linking.openURL(`tel:${task.profiles.phone}`)}><Ionicons name="call" size={24} color="#FFF" /><Text style={styles.callText}>GỌI NẠN NHÂN</Text></TouchableOpacity>
            </View>
            <StatusButton status={task.status} onUpdate={handleUpdateStatus} updating={updating} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const StatusButton = ({ status, onUpdate, updating }: any) => {
  if (status === "assigned") return <TouchableOpacity style={styles.arrivedBtn} onPress={() => onUpdate("arrived")} disabled={updating}><Text style={styles.btnText}>XÁC NHẬN ĐÃ ĐẾN NƠI</Text></TouchableOpacity>;
  if (status === "arrived") return <TouchableOpacity style={styles.completeBtn} onPress={() => onUpdate("completed")} disabled={updating}><Text style={styles.btnText}>HOÀN THÀNH NHIỆM VỤ</Text></TouchableOpacity>;
  return null;
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 55, paddingHorizontal: 25, marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginLeft: 15 },
  mapBox: { height: 250, borderRadius: 35, marginHorizontal: 20, overflow: 'hidden', elevation: 5 },
  map: { flex: 1 },
  navBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#0F172A', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 8 },
  navText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  mainCard: { margin: 20, padding: 25, backgroundColor: '#FFF', borderRadius: 35, elevation: 2 },
  emergencyType: { fontSize: 26, fontWeight: '900', color: '#EF4444', marginBottom: 10 },
  locationRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  address: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '700', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  label: { fontSize: 12, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  desc: { fontSize: 15, color: '#475569', lineHeight: 22, fontWeight: '600' },
  evidenceImage: { width: width - 40, height: 240, borderRadius: 35, marginHorizontal: 20, marginBottom: 20 },
  footer: { paddingHorizontal: 20 },
  acceptBtn: { backgroundColor: '#FF6B35', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  contactBar: { flexDirection: 'row', gap: 15 },
  chatBtn: { width: 70, height: 70, borderRadius: 25, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  callBtn: { flex: 1, height: 70, borderRadius: 25, backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  callText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  arrivedBtn: { backgroundColor: '#3B82F6', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  completeBtn: { backgroundColor: '#10B981', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});