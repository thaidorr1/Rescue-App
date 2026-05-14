import { triggerLocalNotification } from "@/lib/notificationHelper";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 1. CẤU HÌNH TRỌNG SỐ ƯU TIÊN & MÀU SẮC
const PRIORITY_CONFIG: any = {
  'Fire': { level: 1, label: 'CRITICAL', color: '#EF4444', icon: 'fire' },
  'Medical': { level: 1, label: 'CRITICAL', color: '#EF4444', icon: 'medical-bag' },
  'Accident': { level: 2, label: 'HIGH', color: '#FF6B35', icon: 'car-crash' },
  'Crime': { level: 2, label: 'HIGH', color: '#FF6B35', icon: 'shield-alert' },
  'Flood': { level: 3, label: 'MEDIUM', color: '#3B82F6', icon: 'tsunami' },
  'Tech': { level: 4, label: 'LOW', color: '#64748B', icon: 'hammer-wrench' },
  'Default': { level: 5, label: 'NORMAL', color: '#94A3B8', icon: 'alert-circle' }
};

export default function DispatcherRequests({ navigation }: any) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. HÀM LẤY DỮ LIỆU & SẮP XẾP THÔNG MINH
  const fetchRequests = async () => {
    const { data } = await supabase
      .from("sos_requests")
      .select("*")
      .neq("status", "completed"); // Chỉ lấy vụ chưa hoàn thành
    
    if (data) {
      const sorted = data.sort((a, b) => {
        const pA = PRIORITY_CONFIG[a.emergency_type]?.level || 5;
        const pB = PRIORITY_CONFIG[b.emergency_type]?.level || 5;
        
        // Ưu tiên theo cấp độ trước (1 < 2 < 3...), nếu bằng nhau thì mới theo thời gian
        if (pA !== pB) return pA - pB;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setRequests(sorted);
    }
    setLoading(false);
  };

  // 3. LẮNG NGHE REAL-TIME
  useEffect(() => {
    const channel = supabase.channel('dispatcher_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_requests' }, (payload) => {
          triggerLocalNotification("🚨 CÓ VỤ VIỆC MỚI!", `Loại: ${payload.new.emergency_type}. Vị trí: ${payload.new.address}`);
          fetchRequests(); 
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_requests' }, () => fetchRequests())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useFocusEffect(useCallback(() => { fetchRequests(); }, []));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0F172A" />;

  return (
    <View style={styles.root}>
      {/* Header với số lượng vụ việc thực tế */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Bàn điều phối</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{requests.length} vụ</Text></View>
      </View>

      <FlatList
        data={requests}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchRequests} />}
        renderItem={({ item }) => {
          const config = PRIORITY_CONFIG[item.emergency_type] || PRIORITY_CONFIG['Default'];
          
          return (
            <TouchableOpacity 
              style={[styles.card, { borderLeftWidth: 5, borderLeftColor: config.color }]} 
              onPress={() => navigation.navigate("DispatcherRequestDetail", { requestId: item.id })}
            >
              {/* Icon thay đổi theo loại sự cố */}
              <View style={[styles.iconBox, { backgroundColor: config.color + '15' }]}>
                <MaterialCommunityIcons name={config.icon} size={26} color={config.color} />
              </View>
              
              <View style={{ flex: 1 }}>
                <View style={styles.cardTop}>
                  <View style={styles.titleRow}>
                    <Text style={styles.type}>{item.emergency_type}</Text>
                    {/* HUY HIỆU ƯU TIÊN */}
                    <View style={[styles.pBadge, { backgroundColor: config.color }]}>
                      <Text style={styles.pBadgeText}>{config.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.time}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                
                <Text style={styles.address} numberOfLines={1}>
                  {item.address || "Đang xác định tọa độ..."}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 25 },
  header: { fontSize: 26, fontWeight: "900", color: '#0F172A' },
  badge: { backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  card: { backgroundColor: "#fff", padding: 18, borderRadius: 28, flexDirection: "row", alignItems: "center", marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05 },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  type: { fontSize: 17, fontWeight: "800", color: '#1E293B' },
  pBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  pBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  time: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  address: { color: "#64748B", fontSize: 13, marginTop: 4, fontWeight: '500' }
});