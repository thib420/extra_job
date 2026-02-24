import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_LISTINGS } from '../lib/mock-data';
import { Colors, Spacing, BorderRadius, FontSize } from '../lib/constants';
import { useAuthStore } from '../lib/store';
import Button from '../components/Button';
import ListingCard from '../components/ListingCard';

export default function MyListingsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const listings = useMemo(
    () => MOCK_LISTINGS.filter((l) => l.user_id === (user?.id || '')),
    [user?.id]
  );

  if (!user) {
    return (
      <View style={styles.locked}>
        <Ionicons name="document-text-outline" size={52} color={Colors.textTertiary} />
        <Text style={styles.lockedTitle}>Connexion requise</Text>
        <Text style={styles.lockedText}>Connectez-vous pour gérer vos annonces.</Text>
        <Button title="Se connecter" onPress={() => router.push('/auth/login')} style={styles.lockedButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <ListingCard listing={item} />
            <View style={styles.actionRow}>
              <Text style={[styles.statusBadge, styles.statusActive]}>Active</Text>
              <TouchableOpacity onPress={() => Alert.alert('Supprimer ?', 'Confirmation requise (démo)')}>
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Aucune annonce publiée</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  list: { paddingTop: Spacing.md, paddingBottom: 40 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginTop: -Spacing.sm, marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  statusBadge: { fontSize: FontSize.xs, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  statusActive: { color: Colors.primary },
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
