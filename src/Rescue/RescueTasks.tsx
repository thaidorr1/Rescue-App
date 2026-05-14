import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RescueTasks({ navigation }: any) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user?.id) return;
    const { data: team } = await supabase.from("rescue_teams").select("id").eq("leader_id", user.id).maybeSingle();
    if (team) {
      const { data } = await supabase.from("assignments").select("*, sos_requests!inner(*)").eq("rescue_team_id", team.id).neq("sos_requests.status", "completed").order("assigned_at", { ascending: false });
      setTasks(data || []);
    }
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchTasks(); }, [user?.id]));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Nhiệm vụ đội</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{tasks.length} ca</Text></View>
      </View>

      <FlatList
        data={tasks}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTasks} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("RescueTaskDetail", { taskId: item.sos_requests.id })}>
            <View style={styles.cardLeft}>
              <View style={styles.alertIcon}><MaterialCommunityIcons name="alert-light" size={28} color="#EF4444" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.type}>{item.sos_requests.emergency_type}</Text>
                <Text style={styles.address} numberOfLines={2}>{item.sos_requests.address}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30 },
  header: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  badge: { backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 },
  alertIcon: { width: 55, height: 55, borderRadius: 18, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' },
  type: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  address: { color: '#64748B', fontSize: 13, marginTop: 4, fontWeight: '500', lineHeight: 18 }
});