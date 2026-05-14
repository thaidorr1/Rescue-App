import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserHome({ navigation }: any) {
  const { user } = useAuth();
  const [activeSos, setActiveSos] = useState<any>(null);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [loading, setLoading] = useState(true);

  // HÀM LẤY DỮ LIỆU ĐỘNG
  const fetchData = async () => {
    if (!user?.id) return setLoading(false);
    
    // 1. Kiểm tra yêu cầu SOS đang xử lý của chính người dùng
    const { data: sosData } = await supabase.from("sos_requests")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["pending", "assigned", "arrived"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setActiveSos(sosData);

    // 2. Kiểm tra trạng thái Tình nguyện viên từ bảng profiles
    const { data: profileData } = await supabase.from("profiles")
      .select("is_volunteer")
      .eq("id", user.id)
      .single();
    
    if (profileData) setIsVolunteer(profileData.is_volunteer);
    
    setLoading(false);
  };

  // Tự động cập nhật trạng thái mỗi khi màn hình được hiển thị
  useFocusEffect(useCallback(() => { fetchData(); }, [user?.id]));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />;

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* PHẦN HEADER VỚI TÊN VÀ HUY HIỆU */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.helloText}>Xin chào,</Text>
            {isVolunteer && (
              <View style={styles.vBadge}>
                <MaterialCommunityIcons name="heart" size={12} color="#FFF" />
                <Text style={styles.vBadgeText}>TÌNH NGUYỆN VIÊN</Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || "Người dùng"}</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Hỗ trợ khẩn cấp</Text>
          <Text style={styles.bannerSub}>Nhấn nút SOS bên dưới để yêu cầu hỗ trợ ngay.</Text>
        </View>
        <View style={styles.bannerIcon}><Ionicons name="shield-checkmark" size={24} color="#FFF" /></View>
      </View>

      {/* KHU VỰC SOS */}
      <View style={styles.sosCenter}>
        {activeSos ? (
          <TouchableOpacity style={styles.trackingCard} onPress={() => navigation.navigate("SosTracking", { requestId: activeSos.id })}>
            <View style={styles.pulseDot} />
            <Text style={styles.trackingText}>Yêu cầu đang xử lý...</Text>
            <Text style={styles.trackingStatus}>{activeSos.status.toUpperCase()}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate("SosRequest")}>
            <View style={styles.sosOuter}>
              <View style={styles.sosInner}><Text style={styles.sosText}>SOS</Text></View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* XỬ LÝ HIỂN THỊ PHẦN TÌNH NGUYỆN VIÊN */}
      {isVolunteer ? (
        /* NẾU LÀ TNV: HIỆN NÚT VÀO HÒM THƯ CỨU TRỢ */
        <TouchableOpacity 
          style={styles.inboxBtn} 
          onPress={() => navigation.navigate("VolunteerInbox")}
        >
          <MaterialCommunityIcons name="mailbox-open-outline" size={24} color="#FFF" />
          <Text style={styles.inboxText}>XEM TIẾNG GỌI CỘNG ĐỒNG (3KM)</Text>
        </TouchableOpacity>
      ) : (
        /* NẾU CHƯA LÀ TNV: HIỆN THẺ MỜI THAM GIA */
        <TouchableOpacity 
          style={styles.volunteerBanner} 
          onPress={() => navigation.navigate("VolunteerVerification")}
        >
          <View style={styles.vIconBox}><Ionicons name="heart" size={24} color="#EF4444" /></View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.vTitle}>Bạn muốn là Tình nguyện viên?</Text>
            <Text style={styles.vSub}>Nhận tin báo và hỗ trợ những người xung quanh trong bán kính 3km.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Dịch vụ cứu hộ</Text>
      <View style={styles.grid}>
        <ServiceCard icon="flame-outline" title="Cứu hỏa" sub="PCCC" onPress={() => navigation.navigate("SosRequest", { type: 'Fire' })} />
        <ServiceCard icon="medical-outline" title="Y tế" sub="Cấp cứu" onPress={() => navigation.navigate("SosRequest", { type: 'Medical' })} />
        <ServiceCard icon="shield-half-outline" title="An ninh" sub="Cảnh sát" onPress={() => navigation.navigate("SosRequest", { type: 'Crime' })} />
        <ServiceCard icon="water-outline" title="Thiên tai" sub="Bão lũ" onPress={() => navigation.navigate("SosRequest", { type: 'Flood' })} />
      </View>
    </ScrollView>
  );
}

const ServiceCard = ({ icon, title, sub, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardIcon}><Ionicons name={icon} size={28} color="#FF6B35" /></View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSub}>{sub}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 65, marginBottom: 30 },
  helloText: { fontSize: 15, color: '#64748B', fontWeight: '600' },
  vBadge: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, gap: 4 },
  vBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  userName: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  avatarContainer: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  banner: { backgroundColor: '#0F172A', borderRadius: 32, padding: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 35 },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  bannerSub: { color: '#94A3B8', marginTop: 5, fontSize: 12 },
  bannerIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  sosCenter: { alignItems: 'center', marginBottom: 30 },
  sosButton: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center' },
  sosOuter: { width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255, 107, 53, 0.15)', justifyContent: 'center', alignItems: 'center' },
  sosInner: { width: 155, height: 155, borderRadius: 80, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', elevation: 15 },
  sosText: { color: '#FFF', fontSize: 42, fontWeight: '900', letterSpacing: 2 },
  trackingCard: { width: '100%', padding: 25, backgroundColor: '#FFF', borderRadius: 32, borderLeftWidth: 8, borderLeftColor: '#FF6B35', elevation: 4 },
  pulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B35', marginBottom: 10 },
  trackingText: { fontWeight: '900', color: '#0F172A', fontSize: 16 },
  trackingStatus: { color: '#64748B', marginTop: 5, fontSize: 12, fontWeight: '700' },
  volunteerBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 28, marginBottom: 25, elevation: 3 },
  vIconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  vTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  vSub: { fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: '600', lineHeight: 16 },
  inboxBtn: { flexDirection: 'row', backgroundColor: '#0F172A', padding: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 25, elevation: 5 },
  inboxText: { color: '#FFF', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  card: { width: '47%', backgroundColor: '#FFF', borderRadius: 30, padding: 22, elevation: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#FFF5F2', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  cardSub: { fontSize: 12, color: '#94A3B8', marginTop: 4 }
});