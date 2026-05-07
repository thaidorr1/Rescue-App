import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../lib/supabase";

export default function RescueTaskDetail({ route, navigation }: any) {
  const { assignmentId } = route.params;

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const sos = assignment?.sos_requests;

  const getTask = async () => {
    setLoading(true);

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
        ),
        rescue_teams (
          id,
          team_name,
          status
        )
      `
      )
      .eq("id", assignmentId)
      .maybeSingle();

    if (error) {
      console.log("GET TASK DETAIL ERROR:", error.message);
      Alert.alert("Lỗi", error.message);
    }

    setAssignment(data);
    setLoading(false);
  };

  const updateMissionStatus = async (
    assignmentStatus: "accepted" | "in_progress" | "completed",
    sosStatus: "assigned" | "in_progress" | "completed",
    teamStatus: "busy" | "available"
  ) => {
    if (!assignment) return;

    setUpdating(true);

    const { error: assignmentError } = await supabase
      .from("assignments")
      .update({
        status: assignmentStatus,
      })
      .eq("id", assignment.id);

    if (assignmentError) {
      setUpdating(false);
      Alert.alert("Lỗi cập nhật nhiệm vụ", assignmentError.message);
      return;
    }

    const { error: sosError } = await supabase
      .from("sos_requests")
      .update({
        status: sosStatus,
      })
      .eq("id", assignment.sos_request_id);

    if (sosError) {
      setUpdating(false);
      Alert.alert("Lỗi cập nhật SOS", sosError.message);
      return;
    }

    const { error: teamError } = await supabase
      .from("rescue_teams")
      .update({
        status: teamStatus,
      })
      .eq("id", assignment.rescue_team_id);

    if (teamError) {
      setUpdating(false);
      Alert.alert("Lỗi cập nhật đội cứu hộ", teamError.message);
      return;
    }

    setUpdating(false);
    await getTask();

    if (assignmentStatus === "completed") {
      Alert.alert("Hoàn thành", "Nhiệm vụ cứu hộ đã hoàn thành");
      navigation.goBack();
    }
  };

  useEffect(() => {
    getTask();
  }, [assignmentId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Mission Details</Text>
        <Text style={styles.subtitle}>
          Check emergency information and update your rescue progress.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Emergency Type</Text>
          <Text style={styles.value}>{sos?.emergency_type || "N/A"}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{sos?.address || "N/A"}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{sos?.description || "N/A"}</Text>

          <Text style={styles.label}>Mission Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{assignment?.status}</Text>
          </View>
        </View>

        <View style={styles.actionBox}>
          {assignment?.status === "assigned" && (
            <TouchableOpacity
              style={styles.primaryBtn}
              disabled={updating}
              onPress={() =>
                updateMissionStatus("accepted", "assigned", "busy")
              }
            >
              <Text style={styles.primaryText}>
                {updating ? "Updating..." : "Accept Mission"}
              </Text>
            </TouchableOpacity>
          )}

          {assignment?.status === "accepted" && (
            <TouchableOpacity
              style={styles.primaryBtn}
              disabled={updating}
              onPress={() =>
                updateMissionStatus("in_progress", "in_progress", "busy")
              }
            >
              <Text style={styles.primaryText}>
                {updating ? "Updating..." : "Start Mission"}
              </Text>
            </TouchableOpacity>
          )}

          {assignment?.status === "in_progress" && (
            <TouchableOpacity
              style={styles.completeBtn}
              disabled={updating}
              onPress={() =>
                updateMissionStatus("completed", "completed", "available")
              }
            >
              <Text style={styles.primaryText}>
                {updating ? "Updating..." : "Complete Mission"}
              </Text>
            </TouchableOpacity>
          )}

          {assignment?.status === "completed" && (
            <View style={styles.completedBox}>
              <Ionicons name="checkmark-circle" size={26} color="#16A34A" />
              <Text style={styles.completedText}>Mission completed</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={getTask}>
          <Text style={styles.refreshText}>Refresh Task</Text>
        </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
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
  card: {
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
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF1EC",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    color: "#FF6B35",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  actionBox: {
    marginTop: 28,
  },
  primaryBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  completeBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  refreshBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  refreshText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  completedBox: {
    backgroundColor: "#DCFCE7",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  completedText: {
    color: "#166534",
    fontSize: 16,
    fontWeight: "900",
  },
});