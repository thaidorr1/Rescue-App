import { supabase } from "@/lib/supabase";
import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location'; // Cần import để lấy vị trí thực tế
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VolunteerInbox({ navigation }: any) {
    const { user } = useAuth();
    const [nearbyTasks, setNearbyTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNearbySos = async () => {
        setLoading(true);
        try {
            // 1. KIỂM TRA DỊCH VỤ VỊ TRÍ CÓ ĐANG BẬT KHÔNG
            const enabled = await Location.hasServicesEnabledAsync();
            if (!enabled) {
                setLoading(false);
                return Alert.alert("Lỗi vị trí", "Vui lòng bật GPS trên thiết bị của bạn để xem các yêu cầu xung quanh.");
            }

            // 2. Kiểm tra quyền truy cập
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLoading(false);
                return Alert.alert("Quyền truy cập", "Ứng dụng cần quyền vị trí để tìm các vụ SOS trong bán kính 3km.");
            }

            // 3. Lấy vị trí với cấu hình tối ưu để tránh bị timeout
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced, // Dùng độ chính xác cân bằng để lấy vị trí nhanh hơn
            });
            const { latitude, longitude } = location.coords;

            // 4. Cập nhật hồ sơ và lấy danh sách
            await supabase.from("profiles").update({
                current_lat: latitude,
                current_lng: longitude
            }).eq("id", user?.id);

            const { data, error } = await supabase.rpc('get_nearby_sos', {
                target_lat: latitude,
                target_lng: longitude,
                radius_km: 3.0
            });

            if (data) setNearbyTasks(data);
            if (error) console.error("Lỗi lấy SOS:", error.message);

        } catch (e: any) {
            // Thông báo lỗi thân thiện hơn thay vì hiện màn hình đỏ
            console.error(e);
            Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchNearbySos(); }, []));

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.title}>Yêu cầu gần bạn</Text>
            </View>

            {loading ? <ActivityIndicator style={{ marginTop: 50 }} color="#FF6B35" /> : (
                <FlatList
                    data={nearbyTasks}
                    refreshControl={<RefreshControl refreshing={false} onRefresh={fetchNearbySos} />}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Ionicons name="help-circle-outline" size={80} color="#E2E8F0" />
                            <Text style={styles.emptyText}>Hiện không có yêu cầu nào trong bán kính 3km.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate("SosTracking", { requestId: item.id })}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.badge}><Text style={styles.badgeText}>{item.emergency_type}</Text></View>
                                <Text style={styles.distText}>{item.distance.toFixed(1)} km</Text>
                            </View>
                            <Text style={styles.address}>📍 {item.address || "Đang xác định vị trí..."}</Text>
                            <Text style={styles.desc} numberOfLines={2}>{item.description || "Không có mô tả chi tiết."}</Text>
                            <View style={styles.footer}><Text style={styles.footerText}>XEM CHI TIẾT & HỖ TRỢ</Text><Ionicons name="arrow-forward" size={16} color="#0F172A" /></View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 25 },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 30 },
    backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginLeft: 15 },
    emptyBox: { alignItems: 'center', marginTop: 100 },
    emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 15, fontSize: 14, fontWeight: '600', paddingHorizontal: 40, lineHeight: 22 },
    card: { backgroundColor: '#F8FAFC', borderRadius: 28, padding: 22, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    badge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: '#EF4444', fontWeight: '900', fontSize: 10 },
    distText: { color: '#64748B', fontWeight: '800', fontSize: 12 },
    address: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
    desc: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 15 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
    footerText: { fontSize: 12, fontWeight: '900', color: '#0F172A' }
});