import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Category {
  name: string;
  icon: IconName;
  sub: string;
}

export default function SosRequest({ navigation }: any) {
  // Bổ sung các trường hợp: An ninh, Thiên tai và Sự cố kỹ thuật
  const categories: Category[] = [
    { name: 'Fire', icon: 'flame', sub: 'Hỏa hoạn, cháy nổ' },
    { name: 'Medical', icon: 'medical', sub: 'Cấp cứu y tế 115' },
    { name: 'Accident', icon: 'car-sport', sub: 'Tai nạn giao thông' },
    { name: 'Crime', icon: 'shield-half', sub: 'Cướp giật, hành hung' },
    { name: 'Flood', icon: 'water', sub: 'Lũ lụt, thiên tai' },
    { name: 'Tech', icon: 'construct', sub: 'Sự cố xe, điện, gas' },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loại sự cố</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.guideText}>Vui lòng chọn loại tình huống khẩn cấp để chúng tôi điều phối lực lượng hỗ trợ phù hợp nhất.</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.name} 
              style={styles.card}
              onPress={() => navigation.navigate("SosDetailSubmit", { emergencyType: cat.name })}
            >
              <View style={styles.iconCircle}><Ionicons name={cat.icon} size={32} color="#FF6B35" /></View>
              <Text style={styles.cardTitle}>{cat.name}</Text>
              <Text style={styles.cardSub}>{cat.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 60, paddingHorizontal: 25, marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: '900', marginLeft: 15, color: '#0F172A' },
  container: { padding: 25 },
  guideText: { fontSize: 14, color: '#64748B', marginBottom: 30, lineHeight: 22, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '47%', backgroundColor: '#FFF', borderRadius: 35, padding: 25, marginBottom: 20, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  iconCircle: { width: 65, height: 65, borderRadius: 22, backgroundColor: '#FFF5F2', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginTop: 15 },
  cardSub: { fontSize: 11, color: '#94A3B8', marginTop: 5, textAlign: 'center', fontWeight: '700' }
});