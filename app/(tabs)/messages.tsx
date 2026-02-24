import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_CONVERSATIONS } from '../../lib/mock-data';
import { Colors, Spacing, BorderRadius, FontSize, CATEGORIES } from '../../lib/constants';
import { useAuthStore } from '../../lib/store';
import Button from '../../components/Button';

export default function MessagesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <View style={styles.locked}>
        <Ionicons name="chatbubble-ellipses-outline" size={52} color={Colors.textTertiary} />
        <Text style={styles.lockedTitle}>Connexion requise</Text>
        <Text style={styles.lockedText}>Connectez-vous pour accéder à vos conversations.</Text>
        <Button title="Se connecter" onPress={() => router.push('/auth/login')} style={styles.lockedButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const cat = CATEGORIES.find((c) => c.value === item.listing?.category);
          return (
            <TouchableOpacity
              style={styles.convItem}
              onPress={() => router.push(`/conversation/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {item.other_user.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.convContent}>
                <View style={styles.convTop}>
                  <Text style={styles.convName} numberOfLines={1}>{item.other_user.display_name}</Text>
                  <Text style={styles.convTime}>
                    {new Date(item.last_message_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <Text style={styles.convListing} numberOfLines={1}>
                  {cat?.icon} {item.listing?.title}
                </Text>
                <View style={styles.lastMsgRow}>
                  <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgUnread]} numberOfLines={1}>
                    {item.last_message}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Aucune conversation</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  convItem: {
    flexDirection: 'row', padding: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarLetter: {
    fontSize: FontSize.lg, fontFamily: 'Inter_700Bold', color: Colors.primaryDark,
  },
  convContent: { flex: 1, justifyContent: 'center' },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  convName: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.text, flex: 1 },
  convTime: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textTertiary },
  convListing: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textTertiary, marginBottom: 2 },
  lastMsgRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  lastMsg: { flex: 1, fontSize: FontSize.sm, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  lastMsgUnread: { fontFamily: 'Inter_600SemiBold', color: Colors.text },
  unreadBadge: {
    backgroundColor: Colors.primary, borderRadius: 10, minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  unreadText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.white },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.lg, fontFamily: 'Inter_600SemiBold', color: Colors.text },
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
