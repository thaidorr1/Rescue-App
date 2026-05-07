import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../lib/supabase";
import { useAuth } from "../Context/AuthContext";

export default function RescueHistory() {
  const { user } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getHistory = async () => {
    if (!user?.id) return;

    const { data: teamData } = await supabase
      .from("rescue_teams")
      .select("*")
      .eq("leader_id", user.id)
      .maybeSingle();

    if (!teamData) {
      setItems([]);
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
          emergency_type,
          address,
          description,
          status,
          created_at
        )
      `
      )
      .eq("rescue_team_id", teamData.id)
      .eq("status", "completed")
      .order("assigned_at", { ascending: false });

    if (!error) {
      setItems(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getHistory();
    }, [user?.id])
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Rescue History</Text>
      <Text style={styles.subtitle}>Completed rescue missions.</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getHistory();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No completed missions found.</Text>
          }
          renderItem={({ item }) => {
            const sos = item.sos_requests;

            return (
              <View style={styles.card}>
                <View style={styles.iconBox}>
                  <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {sos?.emergency_type || "Emergency"}
                  </Text>
                  <Text style={styles.address}>{sos?.address}</Text>
                  <Text style={styles.desc} numberOfLines={2}>
                    {sos?.description}
                  </Text>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>completed</Text>
                  </View>
                </View>
              </View>
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
    backgroundColor: "#DCFCE7",
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
    backgroundColor: "#DCFCE7",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});