import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "./AuthContext";
import AuthNavigation from "./AuthNavigation";
import DispatcherNavigation from "./DispatcherNavigation";
import RescueNavigation from "./RescueNavigation";
import UserNavigation from "./UserNavigaiton";

export default function RootNavigation() {
  const { session, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <AuthNavigation />;
  }

  if (!profile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginBottom: 20,
            textAlign: "center",
            color: "#111827",
          }}
        >
          Không tìm thấy thông tin tài khoản.
        </Text>

        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: "#ff6b35",
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            Đăng xuất về Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (profile.role === "user") {
    return <UserNavigation />;
  }

  if (profile.role === "rescue_team") {
    return <RescueNavigation />;
  }

  if (profile.role === "dispatcher") {
    return <DispatcherNavigation />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          marginBottom: 20,
          textAlign: "center",
          color: "#111827",
        }}
      >
        Tài khoản chưa được phân quyền.
      </Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: "#ff6b35",
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 14,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 15,
          }}
        >
          Đăng xuất về Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}