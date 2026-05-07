import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../lib/supabase";
import { useAuth } from "../Context/AuthContext";

export default function RescueTasks({ navigation }: any) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getTasks = async () => {
    if (!user?.id) return;

    const { data: teamData, error: teamError } = await supabase
      .from("rescue_teams")
      .select("*")
      .eq("leader_id", user.id)
      .maybeSingle();

    if (teamError || !teamData) {
      console.log("GET OWN TEAM ERROR:", teamError?.message);
      setTasks([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
        *,
        sos_requests (
          id,
          title,
          description,
          emergency_type,
          address,
          latitude,
          longitude,
          status,
          created_at
        )
      `
      )
      .eq("rescue_team_id", teamData.id)
      .in("status", ["assigned", "accepted", "in_progress"])
      .order("assigned_at", { ascending: false });

    if (error) {
      console.log("GET RESCUE TASKS ERROR:", error.message);
      setTasks([]);
    } else {
      setTasks(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getTasks();
    }, [user?.id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getTasks();
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Assigned Tasks</Text>
      <Text style={styles.subtitle}>
        View SOS missions assigned by dispatcher.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No assigned tasks found.</Text>
          }
          renderItem={({ item }) => {
            const sos = item.sos_requests;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("RescueTaskDetail", {
                    assignmentId: item.id,
                  })
                }
              >
                <View style={styles.iconBox}>
                  <Ionicons name="alert-circle" size={24} color="#FF6B35" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {sos?.emergency_type || "Emergency"}
                  </Text>

                  <Text style={styles.address}>
                    {sos?.address || "No address"}
                  </Text>

                  <Text style={styles.desc} numberOfLines={2}>
                    {sos?.description || "No description"}
                  </Text>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    paddingTop: 54,
  },
  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 20,
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  address: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  desc: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#FFF1EC",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});