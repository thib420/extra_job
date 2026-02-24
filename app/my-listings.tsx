import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_LISTINGS } from '../lib/mock-data';
import { Colors, Spacing, FontSize } from '../lib/constants';
import { useAuthStore } from '../lib/store';
import { getUserListings, deleteListing } from '../lib/api';
import { supabaseEnabled } from '../lib/supabase';
import { Listing } from '../types/database';
import Button from '../components/Button';
import ListingCard from '../components/ListingCard';

const STATUS_LABELS: Record<Listing['status'], { label: string; color: string }> = {
  active: { label: 'Active', color: Colors.success },
  complete: { label: 'Terminée', color: Colors.textSecondary },
  expired: { label: 'Expirée', color: Colors.textSecondary },
  cancelled: { label: 'Annulée', color: Colors.textSecondary },
};

export default function MyListingsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadListings = useCallback(async (isRefreshing = false) => {
    if (!user) {
      setListings([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (!supabaseEnabled) {
        setListings(MOCK_LISTINGS.filter((l) => l.user_id === user.id));
        return;
      }

      const data = await getUserListings(user.id);
      setListings(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger vos annonces.');
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleDelete = (listingId: string) => {
    Alert.alert('Supprimer cette annonce ?', '', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            if (supabaseEnabled) {
              await deleteListing(listingId);
            }
            setListings((prev) => prev.filter((listing) => listing.id !== listingId));
          } catch {
            Alert.alert('Erreur', 'Impossible de supprimer.');
          }
        },
      },
    ]);
  };

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = STATUS_LABELS[item.status] ?? STATUS_LABELS.active;

          return (
            <View>
              <ListingCard listing={item} />
              <View style={styles.actionRow}>
                <Text style={[styles.statusBadge, { color: status.color }]}>{status.label}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={() => loadListings(true)}
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingTop: Spacing.md, paddingBottom: 40 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginTop: -Spacing.sm, marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  statusBadge: { fontSize: FontSize.xs, fontFamily: 'Inter_500Medium' },
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
