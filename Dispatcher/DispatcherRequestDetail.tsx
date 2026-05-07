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
import { useAuth } from "../Context/AuthContext";

export default function DispatcherRequestDetail({ route, navigation }: any) {
  const { requestId } = route.params;
  const { user } = useAuth();

  const [request, setRequest] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [assignedTeam, setAssignedTeam] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const isPending = request?.status === "pending";

  const getData = async () => {
    setLoading(true);

    const { data: requestData, error: requestError } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) {
      console.log("GET REQUEST ERROR:", requestError.message);
      Alert.alert("Lỗi", requestError.message);
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from("assignments")
      .select(
        `
        *,
        rescue_teams (
          id,
          team_name,
          phone,
          vehicle_number,
          status
        )
      `
      )
      .eq("sos_request_id", requestId)
      .order("assigned_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (assignmentError) {
      console.log("GET ASSIGNMENT ERROR:", assignmentError.message);
    }

    if (assignmentData?.rescue_teams) {
      setAssignedTeam(assignmentData.rescue_teams);
    } else {
      setAssignedTeam(null);
    }

    const { data: teamData, error: teamError } = await supabase
      .from("rescue_teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (teamError) {
      console.log("RESCUE TEAMS ERROR:", teamError.message);
      Alert.alert("Lỗi lấy đội cứu hộ", teamError.message);
    }

    setRequest(requestData);
    setTeams(teamData || []);
    setSelectedTeam(null);
    setLoading(false);
  };

  const handleAssign = async () => {
    if (!request) {
      Alert.alert("Lỗi", "Không tìm thấy yêu cầu SOS");
      return;
    }

    if (request.status !== "pending") {
      Alert.alert(
        "Không thể phân công",
        "Yêu cầu SOS này đã được phân công hoặc đang được xử lý."
      );
      return;
    }

    if (!selectedTeam) {
      Alert.alert("Thông báo", "Vui lòng chọn đội cứu hộ");
      return;
    }

    if (!user?.id) {
      Alert.alert("Lỗi", "Không tìm thấy tài khoản dispatcher");
      return;
    }

    if (selectedTeam.status !== "available") {
      Alert.alert(
        "Thông báo",
        "Đội cứu hộ này hiện không khả dụng. Vui lòng chọn đội khác."
      );
      return;
    }

    setAssigning(true);

    const { data: existingAssignment } = await supabase
      .from("assignments")
      .select("id")
      .eq("sos_request_id", requestId)
      .maybeSingle();

    if (existingAssignment) {
      setAssigning(false);
      Alert.alert(
        "Không thể phân công",
        "Yêu cầu này đã được giao cho một đội cứu hộ trước đó."
      );
      await getData();
      return;
    }

    const { error: assignError } = await supabase.from("assignments").insert({
      sos_request_id: requestId,
      rescue_team_id: selectedTeam.id,
      dispatcher_id: user.id,
      status: "assigned",
    });

    if (assignError) {
      setAssigning(false);
      Alert.alert("Phân công thất bại", assignError.message);
      return;
    }

    const { error: requestUpdateError } = await supabase
      .from("sos_requests")
      .update({
        status: "assigned",
      })
      .eq("id", requestId);

    if (requestUpdateError) {
      setAssigning(false);
      Alert.alert("Lỗi cập nhật SOS", requestUpdateError.message);
      return;
    }

    const { error: teamUpdateError } = await supabase
      .from("rescue_teams")
      .update({
        status: "busy",
      })
      .eq("id", selectedTeam.id);

    if (teamUpdateError) {
      setAssigning(false);
      Alert.alert("Lỗi cập nhật đội cứu hộ", teamUpdateError.message);
      return;
    }

    setAssigning(false);

    Alert.alert("Thành công", "Đã phân công đội cứu hộ cho yêu cầu SOS");
    await getData();
  };

  useEffect(() => {
    getData();
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
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>SOS Details</Text>
        <Text style={styles.subtitle}>
          Review emergency details and assign an available rescue team.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Emergency Type</Text>
          <Text style={styles.value}>{request?.emergency_type || "N/A"}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{request?.address || "N/A"}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{request?.description || "N/A"}</Text>

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{request?.status || "pending"}</Text>
          </View>
        </View>

        {!isPending && assignedTeam && (
          <>
            <Text style={styles.sectionTitle}>Assigned Rescue Team</Text>

            <View style={styles.assignedCard}>
              <View style={styles.teamIcon}>
                <Ionicons name="shield-checkmark" size={24} color="#FF6B35" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.teamName}>{assignedTeam.team_name}</Text>
                <Text style={styles.teamInfo}>
                  Phone: {assignedTeam.phone || "N/A"}
                </Text>
                <Text style={styles.teamInfo}>
                  Vehicle: {assignedTeam.vehicle_number || "N/A"}
                </Text>

                <View style={styles.assignedBadge}>
                  <Text style={styles.assignedText}>ALREADY ASSIGNED</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {isPending && (
          <>
            <Text style={styles.sectionTitle}>Choose Rescue Team</Text>

            {teams.length === 0 && (
              <View style={styles.emptyTeamBox}>
                <Ionicons name="alert-circle-outline" size={24} color="#FF6B35" />
                <Text style={styles.emptyTeamText}>
                  Chưa có đội cứu hộ nào trong hệ thống hoặc dispatcher chưa có
                  quyền đọc bảng rescue_teams.
                </Text>
              </View>
            )}

            {teams.map((team) => {
              const active = selectedTeam?.id === team.id;
              const isAvailable = team.status === "available";

              return (
                <TouchableOpacity
                  key={team.id}
                  style={[
                    styles.teamCard,
                    active && styles.teamCardActive,
                    !isAvailable && styles.teamCardDisabled,
                  ]}
                  onPress={() => {
                    if (!isAvailable) {
                      Alert.alert(
                        "Đội không khả dụng",
                        "Đội này đang bận hoặc offline."
                      );
                      return;
                    }

                    setSelectedTeam(team);
                  }}
                >
                  <View style={styles.teamLeft}>
                    <View style={styles.teamIcon}>
                      <Ionicons
                        name="shield-checkmark"
                        size={24}
                        color={isAvailable ? "#FF6B35" : "#9CA3AF"}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.teamName}>{team.team_name}</Text>
                      <Text style={styles.teamInfo}>
                        Phone: {team.phone || "N/A"}
                      </Text>
                      <Text style={styles.teamInfo}>
                        Vehicle: {team.vehicle_number || "N/A"}
                      </Text>

                      <View
                        style={[
                          styles.teamStatusBadge,
                          isAvailable
                            ? styles.availableBadge
                            : styles.unavailableBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.teamStatusText,
                            isAvailable
                              ? styles.availableText
                              : styles.unavailableText,
                          ]}
                        >
                          {team.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {active ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={26}
                      color="#FF6B35"
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={26}
                      color="#D1D5DB"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}

        <TouchableOpacity
          style={[
            styles.assignBtn,
            (!isPending || !selectedTeam || assigning) && styles.assignBtnDisabled,
          ]}
          onPress={handleAssign}
          disabled={!isPending || !selectedTeam || assigning}
        >
          <Text style={styles.assignText}>
            {!isPending
              ? "Already Assigned"
              : assigning
              ? "Assigning..."
              : "Assign Rescue Team"}
          </Text>
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
    paddingBottom: 120,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginTop: 28,
    marginBottom: 14,
  },
  assignedCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  assignedBadge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#FFF1EC",
  },
  assignedText: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "900",
  },
  emptyTeamBox: {
    backgroundColor: "#FFF1EC",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  emptyTeamText: {
    flex: 1,
    color: "#7C2D12",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamCardActive: {
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  teamCardDisabled: {
    opacity: 0.45,
  },
  teamLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  teamIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF1EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  teamInfo: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 13,
  },
  teamStatusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  availableBadge: {
    backgroundColor: "#DCFCE7",
  },
  unavailableBadge: {
    backgroundColor: "#F3F4F6",
  },
  teamStatusText: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  availableText: {
    color: "#16A34A",
  },
  unavailableText: {
    color: "#6B7280",
  },
  assignBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  assignBtnDisabled: {
    backgroundColor: "#FDBA9E",
  },
  assignText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});