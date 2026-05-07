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

export default function RescueDashboard() {
  const { user, profile } = useAuth();

  const [team, setTeam] = useState<any>(null);
  const [activeTasks, setActiveTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data: teamData, error: teamError } = await supabase
      .from("rescue_teams")
      .select("*")
      .eq("leader_id", user.id)
      .maybeSingle();

    if (teamError) {
      console.log("GET TEAM ERROR:", teamError.message);
    }

    setTeam(teamData);

    if (teamData?.id) {
      const { data: assignments } = await supabase
        .from("assignments")
        .select("status")
        .eq("rescue_team_id", teamData.id);

      setActiveTasks(
        assignments?.filter((item) =>
          ["assigned", "accepted", "in_progress"].includes(item.status)
        ).length || 0
      );

      setCompletedTasks(
        assignments?.filter((item) => item.status === "completed").length || 0
      );
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [user?.id])
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Rescue Team</Text>
            <Text style={styles.name}>{profile?.full_name || "Team"}</Text>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={26} color="#FF6B35" />
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{team?.team_name || "Rescue Team"}</Text>
          <Text style={styles.bannerText}>
            Receive missions, update rescue status and complete emergency tasks.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6B35" />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{activeTasks}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedTasks}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {team?.status?.toUpperCase() || "N/A"}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Team Information</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{team?.phone || "N/A"}</Text>

          <Text style={styles.label}>Vehicle</Text>
          <Text style={styles.value}>{team?.vehicle_number || "N/A"}</Text>

          <Text style={styles.label}>Current Status</Text>
          <Text style={styles.value}>{team?.status || "N/A"}</Text>
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
    fontSize: 18,
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
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
  },
  label: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 10,
  },
  value: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 5,
  },
});