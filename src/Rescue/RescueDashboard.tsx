import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RescueDashboard() {
  const { user } = useAuth();
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [stats, setStats] = useState({ active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      const { data: team } = await supabase.from("rescue_teams").select("*").eq("leader_id", user.id).maybeSingle();
      if (team) {
        setTeamInfo(team);
        const { data: assignments } = await supabase.from("assignments").select("sos_requests!inner(status)").eq("rescue_team_id", team.id);
        if (assignments) {
          setStats({
            active: assignments.filter((a: any) => a.sos_requests.status !== "completed").length,
            completed: assignments.filter((a: any) => a.sos_requests.status === "completed").length
          });
        }
      }
    } finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchDashboardData(); }, [user?.id]));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  return (
    <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDashboardData} />}>
      <View style={styles.header}>
        <Text style={styles.teamHeader}>{teamInfo?.team_name || "Đội cứu hộ"}</Text>
        <View style={styles.statusChip}>
          <View style={[styles.dot, { backgroundColor: teamInfo?.status === 'available' ? '#10B981' : '#FF6B35' }]} />
          <Text style={styles.statusText}>{teamInfo?.status?.toUpperCase() || "OFFLINE"}</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Trạm tác chiến</Text>
          <Text style={styles.bannerSub}>Giám sát nhiệm vụ và cập nhật tiến độ cứu trợ thời gian thực.</Text>
        </View>
        <MaterialCommunityIcons name="shield-cross" size={45} color="rgba(255,255,255,0.2)" />
      </View>

      <View style={styles.statsRow}>
        <StatItem label="Đang chạy" value={stats.active} color="#FF6B35" icon="run-fast" />
        <StatItem label="Hoàn tất" value={stats.completed} color="#10B981" icon="check-decagram" />
      </View>

      <Text style={styles.sectionTitle}>Thông tin đơn vị</Text>
      <View style={styles.infoCard}>
        <InfoRow label="Số điện thoại đội" value={teamInfo?.phone} icon="phone" />
        <View style={styles.divider} />
        <InfoRow label="Phương tiện đăng ký" value={teamInfo?.vehicle_number} icon="car-emergency" />
      </View>
    </ScrollView>
  );
}

const StatItem = ({ label, value, color, icon }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}><MaterialCommunityIcons name={icon} size={24} color={color} /></View>
    <Text style={[styles.statValue, { color: color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoRow = ({ label, value, icon }: any) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
    <View style={styles.miniIcon}><MaterialCommunityIcons name={icon} size={20} color="#64748B" /></View>
    <View><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value || "N/A"}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 65, marginBottom: 30 },
  teamHeader: { fontSize: 28, fontWeight: "900", color: "#0F172A" },
  statusChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, elevation: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#0F172A' },
  banner: { backgroundColor: "#0F172A", borderRadius: 32, padding: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 35 },
  bannerTitle: { color: "#FFF", fontSize: 22, fontWeight: "800" },
  bannerSub: { color: "#94A3B8", marginTop: 5, fontSize: 12, lineHeight: 18 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 35 },
  statCard: { backgroundColor: "#FFF", width: "48%", padding: 25, borderRadius: 30, alignItems: "center", elevation: 3 },
  iconCircle: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: "900" },
  statLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "700", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#0F172A", marginBottom: 15, marginLeft: 5 },
  infoCard: { backgroundColor: "#FFF", padding: 25, borderRadius: 32, elevation: 2 },
  miniIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "700", textTransform: 'uppercase' },
  infoValue: { fontSize: 17, fontWeight: "800", color: "#0F172A", marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 }
});