import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../lib/store';
import { getUserApplications } from '../lib/api';
import { Application } from '../types/database';
import { Colors, Spacing, BorderRadius, FontSize, CATEGORIES } from '../lib/constants';
import Button from '../components/Button';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: Colors.urgent },
  accepted: { label: 'Acceptée', color: Colors.primary },
  rejected: { label: 'Refusée', color: Colors.error },
  cancelled: { label: 'Annulée', color: Colors.textTertiary },
};

export default function MyApplicationsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserApplications(user.id);
      setApplications(data);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetch(); }, [fetch]));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <View style={styles.locked}>
        <Ionicons name="hand-left-outline" size={52} color={Colors.textTertiary} />
        <Text style={styles.lockedTitle}>Connexion requise</Text>
        <Text style={styles.lockedText}>Connectez-vous pour voir vos candidatures.</Text>
        <Button title="Se connecter" onPress={() => router.push('/auth/login')} style={styles.lockedButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const status = STATUS_LABELS[item.status] || STATUS_LABELS.pending;
          const cat = CATEGORIES.find((c) => c.value === item.listing?.category);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => item.listing && router.push(`/listing/${item.listing_id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.listing?.title || 'Annonce'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
              {cat && (
                <Text style={styles.cardCategory}>{cat.icon} {cat.label}</Text>
              )}
              {item.listing?.city && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.detailText}>{item.listing.city}</Text>
                </View>
              )}
              <Text style={styles.cardDate}>
                Candidature du {new Date(item.created_at).toLocaleDateString('fr-FR')}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="hand-left-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Aucune candidature</Text>
            <Text style={styles.emptySubtext}>Parcourez les annonces et postulez !</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  list: { padding: Spacing.lg, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  cardTitle: { flex: 1, fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginRight: Spacing.sm },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontFamily: 'Inter_600SemiBold' },
  cardCategory: { fontSize: FontSize.sm, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginBottom: Spacing.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.xs },
  detailText: { fontSize: FontSize.sm, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  cardDate: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textTertiary, marginTop: Spacing.xs },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.lg, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  emptySubtext: { fontSize: FontSize.sm, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
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
