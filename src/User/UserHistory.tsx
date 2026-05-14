import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function UserHistory({ navigation }: any) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu lịch sử từ Supabase
  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setHistory(data || []);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, [user?.id]));

  // Hàm trả về màu sắc dựa trên trạng thái
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#DCFCE7', text: '#10B981', label: 'Hoàn thành' };
      case 'pending': return { bg: '#FEF3C7', text: '#D97706', label: 'Đang chờ' };
      case 'assigned': return { bg: '#DBEAFE', text: '#2563EB', label: 'Đã nhận' };
      default: return { bg: '#F1F5F9', text: '#64748B', label: status };
    }
  };

  // Hàm trả về icon dựa trên loại sự cố
  const getEmergencyIcon = (type: string): any => {
    switch (type) {
      case 'Fire': return 'flame';
      case 'Medical': return 'medical';
      case 'Accident': return 'car-sport';
      default: return 'shield-alert';
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Lịch sử SOS</Text>
          <Text style={styles.subtitle}>Danh sách các yêu cầu trợ giúp của bạn.</Text>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <TouchableOpacity style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#E2E8F0" />
            <Text style={styles.emptyText}>Bạn chưa gửi yêu cầu SOS nào.</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => {
          const status = getStatusStyle(item.status);
          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate("SosTracking", { requestId: item.id })}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name={getEmergencyIcon(item.emergency_type)} size={24} color="#FF6B35" />
                </View>
                <View style={styles.info}>
                  <Text style={styles.typeText}>{item.emergency_type}</Text>
                  <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
                  <Text style={styles.addressText} numberOfLines={1}>{item.address || "Vị trí ngoại tuyến"}</Text>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusLabel, { color: status.text }]}>{status.label}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 60, 
    paddingHorizontal: 25, 
    marginBottom: 20 
  },
  backBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 15, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15,
    elevation: 2 
  },
  title: { fontSize: 26, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  
  listContent: { padding: 25, paddingBottom: 40 },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 30, 
    padding: 20, 
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 18, 
    backgroundColor: '#FFF5F2', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15 
  },
  info: { flex: 1 },
  typeText: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  dateText: { fontSize: 11, color: '#94A3B8', fontWeight: '700', marginTop: 2 },
  addressText: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
  
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', marginTop: 15, fontSize: 15, fontWeight: '600' }
});