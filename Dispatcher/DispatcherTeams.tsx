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

export default function DispatcherTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getTeams = async () => {
    const { data, error } = await supabase
      .from("rescue_teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setTeams(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getTeams();
    }, [])
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Rescue Teams</Text>
      <Text style={styles.subtitle}>
        Monitor available and busy rescue teams.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getTeams();
              }}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No rescue teams found.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="shield-checkmark" size={24} color="#FF6B35" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.teamName}>{item.team_name}</Text>
                <Text style={styles.teamInfo}>Phone: {item.phone}</Text>
                <Text style={styles.teamInfo}>
                  Vehicle: {item.vehicle_number || "N/A"}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          )}
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
    backgroundColor: "#FFF1EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  teamInfo: {
    color: "#6B7280",
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#FFF1EC",
    paddingVertical: 7,
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