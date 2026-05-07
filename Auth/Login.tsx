import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
  View
} from "react-native";

import { colors } from "../Constants/theme";
import type { AuthStackParamList } from "../Context/AuthNavigation";
import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Đăng nhập thất bại", error.message);
      return;
    }

    // RootNavigation sẽ tự chuyển theo role.
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBox}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={38} color={colors.white} />
          </View>

          <Text style={styles.appName}>Rescue App</Text>
          <Text style={styles.subtitle}>
            Emergency support, fast response and safe rescue connection.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.desc}>Login to continue using your account</Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color={colors.muted} />
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text style={styles.registerHighlight}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sosHint}>
          <Ionicons name="alert-circle" size={18} color={colors.danger} />
          <Text style={styles.sosText}>
            In emergency, use SOS after logging in.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  topBox: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },
  desc: {
    marginTop: 6,
    marginBottom: 22,
    fontSize: 14,
    color: colors.muted,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: colors.text,
  },
  loginButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  registerText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    color: colors.muted,
  },
  registerHighlight: {
    color: colors.primary,
    fontWeight: "800",
  },
  sosHint: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sosText: {
    color: colors.muted,
    fontSize: 13,
  },
});