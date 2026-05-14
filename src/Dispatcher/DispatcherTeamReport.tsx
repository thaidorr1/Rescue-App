import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function DispatcherTeamReport() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      // Lấy dữ liệu các đội kèm số vụ đã làm và điểm rating trung bình
      const { data } = await supabase.from("rescue_teams").select(`
        team_name,
        vehicle_number,
        assignments (
          id,
          sos_requests ( status, rating )
        )
      `);

      if (data) {
        const processed = data.map((team: any) => {
          const completedTasks = team.assignments?.filter((a: any) => a.sos_requests?.status === 'completed') || [];
          const ratings = completedTasks.map((a: any) => a.sos_requests?.rating).filter((r: any) => r != null);
          const avgRating = ratings.length > 0 ? (ratings.reduce((a: any, b: any) => a + b, 0) / ratings.length).toFixed(1) : "N/A";
          
          return {
            name: team.team_name,
            vehicle: team.vehicle_number,
            total: completedTasks.length,
            rating: avgRating
          };
        });
        setReports(processed.sort((a, b) => b.total - a.total));
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) return <ActivityIndicator style={{flex:1}} color="#0F172A" />;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Báo cáo Hiệu suất</Text>
      <Text style={styles.subtitle}>Bảng xếp hạng năng lực các đội cứu hộ.</Text>

      <FlatList
        data={reports}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.rankBox}><Text style={styles.rankText}>#{index + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamName}>{item.name}</Text>
              <Text style={styles.subInfo}>{item.vehicle} • {item.total} ca hoàn thành</Text>
            </View>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 25, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '900', color: '#0F172A' },
  subtitle: { color: '#64748B', marginBottom: 25, fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: '#FFF', borderRadius: 25, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 3 },
  rankBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rankText: { fontWeight: '900', color: '#0F172A' },
  teamName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  subInfo: { color: '#94A3B8', fontSize: 12, marginTop: 2, fontWeight: '600' },
  ratingBox: { backgroundColor: '#FFF5F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '900', color: '#FFB800' }
});