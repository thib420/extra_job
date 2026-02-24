import { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_MESSAGES } from '../../lib/mock-data';
import { Message } from '../../types/database';
import { Colors, Spacing, BorderRadius, FontSize } from '../../lib/constants';
import { useAuthStore } from '../../lib/store';
import Button from '../../components/Button';

export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const myId = user?.id || 'me';
  const conversationId = id || '';
  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES.filter((m) => m.conversation_id === conversationId)
  );
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  if (!user) {
    return (
      <View style={styles.locked}>
        <Ionicons name="chatbubble-ellipses-outline" size={52} color={Colors.textTertiary} />
        <Text style={styles.lockedTitle}>Connexion requise</Text>
        <Text style={styles.lockedText}>Connectez-vous pour envoyer des messages.</Text>
        <Button title="Se connecter" onPress={() => router.push('/auth/login')} style={styles.lockedButton} />
      </View>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: String(Date.now()),
      conversation_id: conversationId,
      sender_id: myId,
      content: input.trim(),
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    const isMine = item.sender_id === myId;
    return (
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
          {item.content}
        </Text>
        <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>
          {new Date(item.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  }, [myId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Commencez la conversation !</Text>
          </View>
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          placeholderTextColor={Colors.textTertiary}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color={input.trim() ? Colors.white : Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  messageList: { padding: Spacing.lg, paddingBottom: Spacing.sm },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: FontSize.md, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  bubbleTextMine: { color: Colors.white },
  bubbleTextOther: { color: Colors.text },
  bubbleTime: {
    fontSize: FontSize.xs, fontFamily: 'Inter_400Regular',
    color: Colors.textTertiary, marginTop: 4, alignSelf: 'flex-end',
  },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.7)' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { fontSize: FontSize.md, fontFamily: 'Inter_400Regular', color: Colors.textTertiary },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.md,
    paddingBottom: Spacing.xl, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.sm,
  },
  input: {
    flex: 1, backgroundColor: Colors.backgroundSecondary, borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    fontSize: FontSize.md, fontFamily: 'Inter_400Regular', color: Colors.text, maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.backgroundSecondary },
  locked: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  lockedTitle: {
    marginTop: Spacing.md,
    fontSize: FontSize.lg,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  lockedText: {
    marginTop: Spacing.xs,
    textAlign: 'center',
    fontSize: FontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  lockedButton: {
    marginTop: Spacing.xl,
    width: '100%',
  },
});
