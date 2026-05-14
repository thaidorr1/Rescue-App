import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function DispatcherDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const { data } = await supabase.from("sos_requests").select("status");
    if (data) {
      setStats({
        pending: data.filter(i => i.status === "pending").length,
        active: data.filter(i => i.status === "assigned" || i.status === "arrived").length,
        completed: data.filter(i => i.status === "completed").length,
      });
    }
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchStats(); }, []));

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hệ thống điều phối,</Text>
          <Text style={styles.name}>{profile?.full_name || "Dispatcher"}</Text>
        </View>
        <View style={styles.activePulse}>
          <View style={styles.pulseDot} />
          <Text style={styles.pulseText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <MaterialCommunityIcons name="Shield-airplane" size={40} color="rgba(255,255,255,0.2)" style={styles.bannerBgIcon} />
        <Text style={styles.bannerTitle}>Tổng đài cứu hộ 24/7</Text>
        <Text style={styles.bannerSub}>Giám sát và điều phối mọi yêu cầu khẩn cấp thời gian thực.</Text>
      </View>

      <Text style={styles.sectionTitle}>Thống kê tình hình</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Chờ xử lý" value={stats.pending} color="#EF4444" icon="alert-decagram" />
        <StatCard label="Đang cứu trợ" value={stats.active} color="#3B82F6" icon="truck-delivery" />
        <StatCard label="Hoàn thành" value={stats.completed} color="#10B981" icon="check-decagram" />
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Hiệu suất hệ thống</Text>
        <Text style={styles.summaryText}>Tổng số vụ việc đã tiếp nhận: {stats.pending + stats.active + stats.completed}</Text>
      </View>
    </ScrollView>
  );
}

const StatCard = ({ label, value, color, icon }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.num, { color: color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 25, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greeting: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  name: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
  activePulse: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 6 },
  pulseText: { fontSize: 10, fontWeight: '900', color: '#EF4444' },
  banner: { backgroundColor: "#0F172A", padding: 30, borderRadius: 32, marginBottom: 30, position: 'relative', overflow: 'hidden' },
  bannerBgIcon: { position: 'absolute', right: -10, top: -10 },
  bannerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  bannerSub: { color: "#94A3B8", fontSize: 13, marginTop: 8, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#0F172A", marginBottom: 15, marginLeft: 5 },
  statsGrid: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, backgroundColor: "#fff", padding: 20, borderRadius: 28, alignItems: "center", elevation: 4, shadowColor: '#000', shadowOpacity: 0.05 },
  iconCircle: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  num: { fontSize: 24, fontWeight: "900" },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', marginTop: 4 },
  summaryBox: { marginTop: 25, backgroundColor: '#FFF', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 5 },
  summaryText: { fontSize: 13, color: '#64748B', fontWeight: '600' }
});