import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';



export default function ChatScreen({ route }) {
    const { sosId, currentUserId } = route.params;

    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel('chat-room')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `sos_id=eq.${sosId}`,
                },
                (payload: any) => {
                    setMessages(prev => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('sos_id', sosId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setMessages(data);
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        await supabase.from('messages').insert({
            sos_id: sosId,
            sender_id: currentUserId,
            message: text,
        });

        setText('');
    };

    const renderItem = ({ item } : any) => {
        const isMine = item.sender_id === currentUserId;

        return (
            <View
                style={[
                    styles.message,
                    isMine ? styles.myMessage : styles.otherMessage,
                ]}>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Type message..."
                    style={styles.input}
                />

                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                    <Text style={{ color: '#fff' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    message: {
        padding: 12,
        margin: 10,
        borderRadius: 12,
        maxWidth: '75%',
    },

    myMessage: {
        backgroundColor: '#ff6b35',
        alignSelf: 'flex-end',
    },

    otherMessage: {
        backgroundColor: '#eee',
        alignSelf: 'flex-start',
    },

    messageText: {
        color: '#000',
    },

    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
    },

    sendBtn: {
        backgroundColor: '#ff6b35',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
    },
});