import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationScreen({ navigation }: any) {
  const [sosNotification, setSosNotification] = useState(true);
  const [statusNotification, setStatusNotification] = useState(true);
  const [messageNotification, setMessageNotification] = useState(false);

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Notification</Text>
      <Text style={styles.subtitle}>Manage your notification preferences.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>SOS updates</Text>
            <Text style={styles.rowDesc}>Notify when your SOS status changes</Text>
          </View>
          <Switch value={sosNotification} onValueChange={setSosNotification} />
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Rescue status</Text>
            <Text style={styles.rowDesc}>Notify when rescue team is assigned</Text>
          </View>
          <Switch
            value={statusNotification}
            onValueChange={setStatusNotification}
          />
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View>
            <Text style={styles.rowTitle}>Messages</Text>
            <Text style={styles.rowDesc}>Notify when you receive messages</Text>
          </View>
          <Switch
            value={messageNotification}
            onValueChange={setMessageNotification}
          />
        </View>
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
    minHeight: 78,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  rowDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
});