import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function UserHistory() {
  const { user } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getHistory = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    console.log("CURRENT USER ID:", user.id);

    const { data, error } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get SOS history error:", error.message);
      Alert.alert("Lỗi", error.message);
      setItems([]);
    } else {
      console.log("SOS HISTORY DATA:", data);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await getHistory();
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>SOS History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No SOS history found.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="alert-circle" size={24} color="#FF6B35" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {item.emergency_type || "Emergency"}
                </Text>

                <Text style={styles.cardAddress}>
                  {item.address || "No address"}
                </Text>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description || "No description"}
                </Text>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {item.status || "pending"}
                  </Text>
                </View>
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
    marginBottom: 20,
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 80,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
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
  cardAddress: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  cardDesc: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#FFF1EC",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});