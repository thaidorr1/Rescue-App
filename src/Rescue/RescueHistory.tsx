import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../Context/AuthContext";

export default function RescueHistory({ navigation }: any) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    if (!user?.id) return;
    const { data: teamData } = await supabase.from("rescue_teams").select("id").eq("leader_id", user.id).maybeSingle();
    if (teamData) {
      const { data, error } = await supabase.from("assignments").select("*, sos_requests!inner(*)").eq("rescue_team_id", teamData.id).eq("sos_requests.status", "completed").order("assigned_at", { ascending: false });
      if (!error) setHistory(data || []);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, [user?.id]));

  if (loading) return <ActivityIndicator style={styles.loader} color="#FF6B35" />;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lịch sử nhiệm vụ</Text>
          <Text style={styles.subtitle}>Các ca cứu hộ đã hoàn thành.</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{history.length}</Text></View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchHistory(); }} />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate("RescueTaskDetail", { taskId: item.sos_requests.id })} // Đảm bảo key là taskId
          >
            <View style={styles.iconBox}><MaterialCommunityIcons name="check-decagram" size={26} color="#10B981" /></View>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.sos_requests?.emergency_type}</Text>
                <Text style={styles.cardDate}>{new Date(item.assigned_at).toLocaleDateString('vi-VN')}</Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text style={styles.address} numberOfLines={1}>{item.sos_requests?.address}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingTop: 60 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { color: '#64748B', fontSize: 13, fontWeight: '600', marginTop: 2 },
  countBadge: { backgroundColor: '#0F172A', width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  countText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 3 },
  iconBox: { width: 55, height: 55, backgroundColor: '#F0FDF4', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  cardDate: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  address: { fontSize: 13, color: '#64748B', marginLeft: 4, flex: 1, fontWeight: '500' }
});