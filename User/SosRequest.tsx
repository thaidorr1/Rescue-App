import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../lib/supabase";
import { useAuth } from "../Context/AuthContext";

const emergencyTypes = ["Fire", "Medical", "Accident", "Rescue"];

export default function SosRequest({ navigation }: any) {
  const { user } = useAuth();

  const [emergencyType, setEmergencyType] = useState("Fire");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendSos = async () => {
    if (!user?.id) {
      Alert.alert("Lỗi", "Bạn chưa đăng nhập");
      return;
    }

    if (!description || !address) {
      Alert.alert("Thông báo", "Vui lòng nhập mô tả và địa chỉ");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("sos_requests")
      .insert({
        user_id: user.id,
        title: `${emergencyType} Emergency`,
        description,
        emergency_type: emergencyType,
        address,
        latitude: 16.047079,
        longitude: 108.20623,
        status: "pending",
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      Alert.alert("Gửi SOS thất bại", error.message);
      return;
    }

    Alert.alert("Thành công", "Yêu cầu SOS đã được gửi");
    navigation.replace("SosTracking", {
      requestId: data.id,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Send Emergency SOS</Text>
        <Text style={styles.subtitle}>
          Please provide emergency information so rescue teams can respond faster.
        </Text>

        <Text style={styles.label}>Emergency Type</Text>

        <View style={styles.typeWrap}>
          {emergencyTypes.map((item) => {
            const active = emergencyType === item;

            return (
              <TouchableOpacity
                key={item}
                style={[styles.typeBtn, active && styles.typeBtnActive]}
                onPress={() => setEmergencyType(item)}
              >
                <Text style={[styles.typeText, active && styles.typeTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Current Address</Text>
        <TextInput
          placeholder="Enter your current address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Describe what happened..."
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#9CA3AF"
        />

        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={22} color="#FF6B35" />
          <Text style={styles.warningText}>
            Your request will be sent to the dispatcher immediately.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendSos}
          disabled={loading}
        >
          <Text style={styles.sendText}>
            {loading ? "Sending..." : "Send SOS Request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },
  typeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  typeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  typeBtnActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  typeText: {
    color: "#374151",
    fontWeight: "700",
  },
  typeTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    height: 130,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FFF1EC",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    color: "#7C2D12",
    fontSize: 13,
    lineHeight: 18,
  },
  sendButton: {
    height: 58,
    borderRadius: 20,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});