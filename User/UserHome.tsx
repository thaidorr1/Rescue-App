import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../Context/AuthContext";

export default function UserHome({ navigation }: any) {
  const { profile } = useAuth();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Hello,</Text>
            <Text style={styles.name}>{profile?.full_name || "User"}</Text>
          </View>

          <TouchableOpacity 
            onPress={() => navigation.navigate("UserProfile")}
            style={styles.avatar} >
            <Ionicons  name="person" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Emergency Help</Text>
            <Text style={styles.bannerText}>
              Press SOS to request rescue support immediately.
            </Text>
          </View>

          <View style={styles.bannerIcon}>
            <Ionicons name="medical" size={34} color="#fff" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => navigation.navigate("SosRequest")}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Emergency Services</Text>

        <View style={styles.serviceGrid}>
          <View style={styles.serviceCard}>
            <Ionicons name="flame-outline" size={28} color="#FF6B35" />
            <Text style={styles.serviceTitle}>Fire</Text>
            <Text style={styles.serviceDesc}>Fire rescue support</Text>
          </View>

          <View style={styles.serviceCard}>
            <Ionicons name="medkit-outline" size={28} color="#FF6B35" />
            <Text style={styles.serviceTitle}>Medical</Text>
            <Text style={styles.serviceDesc}>Ambulance emergency</Text>
          </View>

          <View style={styles.serviceCard}>
            <Ionicons name="car-outline" size={28} color="#FF6B35" />
            <Text style={styles.serviceTitle}>Accident</Text>
            <Text style={styles.serviceDesc}>Traffic accident</Text>
          </View>

          <View style={styles.serviceCard}>
            <Ionicons name="shield-checkmark-outline" size={28} color="#FF6B35" />
            <Text style={styles.serviceTitle}>Rescue</Text>
            <Text style={styles.serviceDesc}>General rescue</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 20,
    paddingTop: 54,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hello: {
    fontSize: 15,
    color: "#6B7280",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF1EC",
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    marginTop: 28,
    backgroundColor: "#1BA7A6",
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  bannerText: {
    color: "#E0FFFE",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  sosButton: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 34,
    shadowColor: "#FF6B35",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  sosText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  serviceCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    minHeight: 130,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
    color: "#111827",
  },
  serviceDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 17,
  },
});