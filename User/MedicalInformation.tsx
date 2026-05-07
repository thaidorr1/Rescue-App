import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../lib/supabase";
import { useAuth } from "../Context/AuthContext";

export default function MedicalInformation({ navigation }: any) {
  const { user } = useAuth();

  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [loading, setLoading] = useState(false);

  const getMedicalInfo = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("medical_information")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setBloodType(data.blood_type || "");
      setAllergies(data.allergies || "");
      setMedicalConditions(data.medical_conditions || "");
      setEmergencyContact(data.emergency_contact || "");
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert("Lỗi", "Bạn chưa đăng nhập");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("medical_information").upsert(
      {
        user_id: user.id,
        blood_type: bloodType,
        allergies,
        medical_conditions: medicalConditions,
        emergency_contact: emergencyContact,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    setLoading(false);

    if (error) {
      Alert.alert("Lưu thất bại", error.message);
      return;
    }

    Alert.alert("Thành công", "Thông tin y tế đã được lưu");
    navigation.goBack();
  };

  useEffect(() => {
    getMedicalInfo();
  }, [user?.id]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Medical Information</Text>
        <Text style={styles.subtitle}>
          This information can help rescue teams respond more safely.
        </Text>

        <Text style={styles.label}>Blood type</Text>
        <TextInput
          value={bloodType}
          onChangeText={setBloodType}
          placeholder="Example: A+, B-, O+"
          style={styles.input}
        />

        <Text style={styles.label}>Allergies</Text>
        <TextInput
          value={allergies}
          onChangeText={setAllergies}
          placeholder="Example: Penicillin, seafood..."
          style={styles.input}
        />

        <Text style={styles.label}>Medical conditions</Text>
        <TextInput
          value={medicalConditions}
          onChangeText={setMedicalConditions}
          placeholder="Example: Asthma, diabetes..."
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />

        <Text style={styles.label}>Emergency contact</Text>
        <TextInput
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Phone number of relative"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Medical Info"}
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
    marginBottom: 26,
    lineHeight: 21,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
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
    height: 110,
  },
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});