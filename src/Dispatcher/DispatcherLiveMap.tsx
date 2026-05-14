import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function DispatcherLiveMap({ navigation }: any) {
  const [requests, setRequests] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  // Hàm lấy dữ liệu ban đầu
  const fetchLiveData = async () => {
    // 1. Lấy các vụ SOS chưa hoàn thành
    const { data: reqs } = await supabase
      .from("sos_requests")
      .select("*")
      .in("status", ["pending", "assigned", "arrived"]);
    
    // 2. Lấy vị trí các đội cứu hộ đang online
    const { data: locs } = await supabase
      .from("profiles")
      .select("id, full_name, current_lat, current_lng, status")
      .eq("role", "rescue")
      .not("current_lat", "is", null);

    if (reqs) setRequests(reqs);
    if (locs) setTeams(locs);
  };

  useEffect(() => {
    fetchLiveData();

    // ĐĂNG KÝ REAL-TIME: Tự động cập nhật khi có thay đổi trong DB
    const reqSub = supabase.channel('live_map_req')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sos_requests' }, () => fetchLiveData())
      .subscribe();

    const teamSub = supabase.channel('live_map_team')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => fetchLiveData())
      .subscribe();
    
    return () => { 
      supabase.removeChannel(reqSub); 
      supabase.removeChannel(teamSub); 
    };
  }, []);

  return (
    <View style={styles.root}>
      {/* Nút quay lại thiết kế nổi */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#0F172A" />
      </TouchableOpacity>

      <MapView 
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={{ 
          latitude: 16.0544, // Tọa độ mặc định (Đà Nẵng)
          longitude: 108.2022, 
          latitudeDelta: 0.07, 
          longitudeDelta: 0.07 
        }}
      >
        {/* HIỂN THỊ CÁC VỤ SOS */}
        {requests.map(req => (
          <Marker 
            key={req.id} 
            coordinate={{ latitude: req.latitude, longitude: req.longitude }}
            onPress={() => navigation.navigate("DispatcherRequestDetail", { requestId: req.id })}
          >
            <View style={[styles.sosMarker, { backgroundColor: req.status === 'pending' ? '#EF4444' : '#3B82F6' }]}>
              <MaterialCommunityIcons 
                name={req.status === 'pending' ? "alert-decagram" : "progress-clock"} 
                size={16} 
                color="#FFF" 
              />
            </View>
          </Marker>
        ))}

        {/* HIỂN THỊ VỊ TRÍ ĐỘI CỨU HỘ */}
        {teams.map(team => (
          <Marker 
            key={team.id} 
            coordinate={{ latitude: team.current_lat, longitude: team.current_lng }}
            title={team.full_name}
          >
            <View style={styles.teamMarker}>
              <MaterialCommunityIcons name="truck-delivery" size={16} color="#FFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Chú thích bản đồ chuyên nghiệp */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, {backgroundColor: '#EF4444'}]} />
          <Text style={styles.legendText}>SOS Chờ</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, {backgroundColor: '#3B82F6'}]} />
          <Text style={styles.legendText}>Đang xử lý</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, {backgroundColor: '#10B981'}]} />
          <Text style={styles.legendText}>Đội cứu hộ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { width: width, height: height },
  backBtn: { 
    position: 'absolute', 
    top: 60, 
    left: 25, 
    zIndex: 10, 
    width: 45, 
    height: 45, 
    borderRadius: 15, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5 
  },
  sosMarker: { 
    padding: 8, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#FFF', 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2
  },
  teamMarker: { 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: '#10B981', 
    borderWidth: 2, 
    borderColor: '#FFF', 
    elevation: 8 
  },
  legend: { 
    position: 'absolute', 
    bottom: 40, 
    left: 20, 
    right: 20, 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 25, 
    padding: 18, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '800', color: '#1E293B' }
});