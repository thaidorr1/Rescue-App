import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../lib/supabase";

export default function SosTracking({ route, navigation }: any) {
  const requestId = route?.params?.requestId;
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getRequest = async () => {
    if (!requestId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (!error) {
      setRequest(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    getRequest();
  }, [requestId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>

      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={46} color="#fff" />
      </View>

      <Text style={styles.title}>SOS Request Sent</Text>
      <Text style={styles.subtitle}>
        Your emergency request has been sent to the dispatcher.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Emergency Type</Text>
        <Text style={styles.cardValue}>{request?.emergency_type}</Text>

        <Text style={styles.cardLabel}>Address</Text>
        <Text style={styles.cardValue}>{request?.address}</Text>

        <Text style={styles.cardLabel}>Status</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{request?.status || "pending"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshBtn} onPress={getRequest}>
        <Text style={styles.refreshText}>Refresh Status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("UserHome")}
      >
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 34,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FF6B35",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 21,
    marginBottom: 28,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 20,
  },
  cardLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  cardValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFF1EC",
    borderRadius: 14,
  },
  statusText: {
    color: "#FF6B35",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  refreshBtn: {
    height: 56,
    backgroundColor: "#1BA7A6",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  homeBtn: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  homeText: {
    color: "#111827",
    fontWeight: "800",
  },
});