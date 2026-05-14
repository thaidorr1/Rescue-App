import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView, Platform, StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../Context/AuthContext";

export default function ChatScreen({ route, navigation }: any) {
  const { requestId, receiverName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "" || !user) return;
    const { error } = await supabase.from("messages").insert({
      request_id: requestId,
      sender_id: user.id,
      text: inputText.trim(),
    });
    if (!error) setInputText("");
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`chat_${requestId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `request_id=eq.${requestId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestId]);

  return (
    <KeyboardAvoidingView 
      style={styles.root} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{receiverName}</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color="#FF6B35" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isMine = item.sender_id === user?.id;
            return (
              <View style={[styles.msgRow, isMine ? styles.myRow : styles.theirRow]}>
                <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                  <Text style={{ color: isMine ? "#fff" : "#111827" }}>{item.text}</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ padding: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Enter message ..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 54, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  msgRow: { marginBottom: 10, flexDirection: "row" },
  myRow: { justifyContent: "flex-end" },
  theirRow: { justifyContent: "flex-start" },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 15 },
  myBubble: { backgroundColor: "#FF6B35" },
  theirBubble: { backgroundColor: "#E2E8F0" },
  inputArea: { flexDirection: "row", padding: 15, backgroundColor: "#fff", alignItems: "center", paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  input: { flex: 1, backgroundColor: "#F1F5F9", borderRadius: 20, paddingHorizontal: 15, height: 40, marginRight: 10 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FF6B35", justifyContent: "center", alignItems: "center" }
});