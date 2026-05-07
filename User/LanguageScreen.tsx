import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LanguageScreen({ navigation }: any) {
  const [language, setLanguage] = useState("English");

  const languages = ["English", "Tiếng Việt"];

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Language</Text>
      <Text style={styles.subtitle}>Choose your app language.</Text>

      <View style={styles.card}>
        {languages.map((item, index) => {
          const active = language === item;

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.row,
                index === languages.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => setLanguage(item)}
            >
              <Text style={styles.rowText}>{item}</Text>

              {active ? (
                <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color="#D1D5DB" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  rowText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
});