import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function DispatcherTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeamsData = async () => {
    const { data, error } = await supabase.from("rescue_teams").select(`*, assignments (id, status, sos_requests!inner (status))`).neq("assignments.sos_requests.status", "completed");
    if (!error) {
      const processedTeams = data.map((team: any) => ({ ...team, displayStatus: (team.assignments && team.assignments.length > 0) ? "BUSY" : "AVAILABLE" }));
      setTeams(processedTeams);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { fetchTeamsData(); }, []));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0F172A" />;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Đội cứu hộ</Text>
      <Text style={styles.subtitle}>Giám sát trạng thái hoạt động toàn hệ thống.</Text>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTeamsData(); }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}><MaterialCommunityIcons name="shield-account" size={26} color="#FF6B35" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamName}>{item.team_name}</Text>
              <View style={styles.infoRow}><Ionicons name="call-outline" size={12} color="#94A3B8" /><Text style={styles.info}>{item.phone}</Text></View>
              <View style={styles.infoRow}><Ionicons name="car-outline" size={12} color="#94A3B8" /><Text style={styles.info}>{item.vehicle_number}</Text></View>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: item.displayStatus === "BUSY" ? "#FFF1EC" : "#F0FDF4" }]}>
              <View style={[styles.dot, { backgroundColor: item.displayStatus === "BUSY" ? "#F97316" : "#10B981" }]} />
              <Text style={[styles.statusText, { color: item.displayStatus === "BUSY" ? "#F97316" : "#10B981" }]}>{item.displayStatus}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { color: '#64748B', marginTop: 5, marginBottom: 25, fontWeight: '500' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 32, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05 },
  iconBox: { width: 55, height: 55, backgroundColor: '#FFF5F2', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  teamName: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  info: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }
});