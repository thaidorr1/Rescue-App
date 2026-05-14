import { useAuth } from "@/src/Context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function ProfileScreen({ navigation }: any) {
  const { user, profile, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn thoát khỏi ứng dụng?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* PHẦN HEADER VỚI AVATAR */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBorder}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=FF6B35&color=fff&size=256` }} 
              style={styles.avatar} 
            />
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{profile?.full_name || "Thái Thành Công"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleTag}>
          <Text style={styles.roleText}>{profile?.role?.toUpperCase() || "USER"}</Text>
        </View>
      </View>

      {/* DANH SÁCH MENU CHỨC NĂNG */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Tài khoản & Hồ sơ</Text>
        
        <View style={styles.menuCard}>
          <MenuItem 
            icon="account-outline" 
            label="Thông tin cá nhân" 
            onPress={() => navigation.navigate("PersonalInformation")} 
          />
          <MenuItem 
            icon="medical-bag" 
            label="Hồ sơ y tế khẩn cấp" 
            onPress={() => navigation.navigate("MedicalInformation")} 
          />
          <MenuItem 
            icon="history" 
            label="Lịch sử cứu hộ" 
            onPress={() => navigation.navigate("UserHistory")} 
            last 
          />
        </View>

        <Text style={styles.sectionTitle}>Ứng dụng</Text>
        <View style={styles.menuCard}>
          <MenuItem 
            icon="bell-outline" 
            label="Cài đặt thông báo" 
            onPress={() => navigation.navigate("NotificationScreen")} 
          />
          <MenuItem 
            icon="translate" 
            label="Ngôn ngữ" 
            onPress={() => navigation.navigate("LanguageScreen")} 
          />
          <MenuItem 
            icon="cog-outline" 
            label="Thiết lập hệ thống" 
            onPress={() => navigation.navigate("SettingsScreen")} 
            last 
          />
        </View>
      </View>

      {/* NÚT ĐĂNG XUẤT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Phiên bản ứng dụng 1.0.2 • Duy Tan University</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// COMPONENT MENU ITEM CON
const MenuItem = ({ icon, label, onPress, last }: any) => (
  <TouchableOpacity 
    style={[styles.menuItem, last && { borderBottomWidth: 0 }]} 
    onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <View style={styles.iconBg}>
        <MaterialCommunityIcons name={icon} size={22} color="#FF6B35" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    alignItems: 'center', 
    paddingTop: 80, 
    paddingBottom: 30, 
    backgroundColor: '#FFF', 
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15
  },
  avatarWrapper: { position: 'relative', marginBottom: 20 },
  avatarBorder: { 
    padding: 5, 
    borderRadius: 45, 
    borderWidth: 2, 
    borderColor: '#FF6B35', 
    borderStyle: 'dashed' 
  },
  avatar: { width: 90, height: 90, borderRadius: 40 },
  editBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#0F172A', 
    width: 32, 
    height: 32, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF'
  },
  userName: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  userEmail: { fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: '500' },
  roleTag: { 
    marginTop: 12, 
    backgroundColor: '#FFF5F2', 
    paddingHorizontal: 15, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  roleText: { color: '#FF6B35', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

  menuContainer: { padding: 25 },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F172A', 
    marginBottom: 15, 
    marginLeft: 10,
    marginTop: 10
  },
  menuCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 32, 
    paddingHorizontal: 15, 
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    backgroundColor: '#FFF5F2', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  menuLabel: { fontSize: 15, fontWeight: '700', color: '#334155' },

  logoutBtn: { 
    marginHorizontal: 25, 
    height: 65, 
    borderRadius: 25, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    marginTop: 10
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '900' },
  versionText: { 
    textAlign: 'center', 
    color: '#CBD5E1', 
    fontSize: 12, 
    marginTop: 30, 
    fontWeight: '600' 
  }
});