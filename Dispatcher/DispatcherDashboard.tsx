import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../lib/supabase";
import { useAuth } from "../Context/AuthContext";

export default function DispatcherDashboard() {
  const { profile } = useAuth();

  const [pending, setPending] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  const getStats = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("sos_requests")
      .select("status");

    if (!error && data) {
      setPending(data.filter((item) => item.status === "pending").length);
      setAssigned(
        data.filter(
          (item) =>
            item.status === "assigned" || item.status === "in_progress"
        ).length
      );
      setCompleted(data.filter((item) => item.status === "completed").length);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getStats();
    }, [])
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Dispatcher</Text>
            <Text style={styles.name}>{profile?.full_name || "Dashboard"}</Text>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="headset" size={26} color="#FF6B35" />
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Emergency Control Center</Text>
          <Text style={styles.bannerText}>
            Monitor SOS requests and assign rescue teams quickly.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6B35" />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{assigned}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Quick Guide</Text>

        <View style={styles.guideCard}>
          <Ionicons name="alert-circle" size={24} color="#FF6B35" />
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>Handle pending SOS</Text>
            <Text style={styles.guideText}>
              Open Requests tab, view details, then assign an available rescue
              team.
            </Text>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hello: {
    color: "#6B7280",
    fontSize: 15,
  },
  name: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1EC",
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    marginTop: 28,
    backgroundColor: "#1BA7A6",
    borderRadius: 28,
    padding: 22,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },
  bannerText: {
    color: "#E0FFFE",
    marginTop: 8,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FF6B35",
  },
  statLabel: {
    color: "#6B7280",
    fontWeight: "700",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginTop: 30,
    marginBottom: 14,
  },
  guideCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  guideText: {
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 19,
  },
});