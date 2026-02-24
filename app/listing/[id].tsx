import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_LISTINGS } from '../../lib/mock-data';
import { Listing, Category } from '../../types/database';
import { Colors, Spacing, BorderRadius, FontSize, CATEGORIES } from '../../lib/constants';
import { useAuthStore } from '../../lib/store';
import { supabaseEnabled } from '../../lib/supabase';
import { applyToListing, deleteListing, getApplicationsForListing, getListing } from '../../lib/api';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

function getCategoryInfo(cat: Category) {
  return CATEGORIES.find((c) => c.value === cat) || CATEGORIES[CATEGORIES.length - 1];
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadListing = async () => {
      if (!id) {
        if (isActive) {
          setLoading(false);
        }
        return;
      }

      if (isActive) {
        setLoading(true);
        setError(false);
      }

      if (!supabaseEnabled) {
        const found = MOCK_LISTINGS.find((l) => l.id === id) ?? null;
        if (isActive) {
          setListing(found);
          setHasApplied(false);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getListing(id);
        if (!isActive) return;

        setListing(data);

        if (user?.id) {
          try {
            const applications = await getApplicationsForListing(data.id);
            if (!isActive) return;
            setHasApplied(applications.some((application) => application.user_id === user.id));
          } catch {
            if (!isActive) return;
            setHasApplied(false);
          }
        } else {
          setHasApplied(false);
        }
      } catch {
        if (!isActive) return;
        setError(true);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadListing();

    return () => {
      isActive = false;
    };
  }, [id, user?.id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Annonce introuvable</Text>
      </View>
    );
  }

  const cat = getCategoryInfo(listing.category);
  const spotsLeft = listing.spots_total - listing.spots_filled;
  const isMyListing = !!user && user.id === listing.user_id;

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Connectez-vous pour candidater.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    if (applying) return;

    if (!supabaseEnabled) {
      setHasApplied(true);
      Alert.alert('Candidature envoyée !', 'L\'annonceur a été notifié (démo).');
      return;
    }

    setApplying(true);

    try {
      await applyToListing(listing.id, user.id);
      setHasApplied(true);
      Alert.alert('Candidature envoyée !', 'L\'annonceur a été notifié.');
    } catch (err: any) {
      if (String(err?.code) === '23505') {
        setHasApplied(true);
        Alert.alert('Information', 'Vous avez déjà candidaté.');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue.');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Supprimer cette annonce ?', '', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            if (supabaseEnabled) {
              await deleteListing(listing.id);
            }
            router.back();
          } catch {
            Alert.alert('Erreur', 'Impossible de supprimer l\'annonce.');
          }
        },
      },
    ]);
  };

  const handleContact = () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Connectez-vous pour envoyer un message.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }
    router.push('/conversation/1');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.body}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{cat.icon} {cat.label}</Text>
          </View>
          {listing.is_urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="flash" size={12} color={Colors.urgent} />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.description}>{listing.description}</Text>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Lieu</Text>
            <Text style={styles.infoValue}>{listing.city}</Text>
          </View>
          {listing.preferred_date && (
            <View style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {new Date(listing.preferred_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          )}
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Durée</Text>
            <Text style={styles.infoValue}>{listing.estimated_duration}h</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="people-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoLabel}>Places</Text>
            <Text style={styles.infoValue}>{spotsLeft}/{listing.spots_total}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Localisation approximative</Text>
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: listing.latitude,
              longitude: listing.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            <Marker
              coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
              title={listing.city}
              description="Emplacement approximatif"
            />
          </MapView>
        </View>

        {/* Owner profile */}
        {listing.user && (
          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarLetter}>{listing.user.display_name.charAt(0)}</Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{listing.user.display_name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={Colors.urgent} />
                <Text style={styles.ratingText}>4.8/5</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {!isMyListing && spotsLeft > 0 && !hasApplied && (
            <Button title="Je suis dispo !" onPress={handleApply} disabled={applying} loading={applying} />
          )}
          {!isMyListing && hasApplied && (
            <View style={styles.appliedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.appliedText}>Candidature envoyée</Text>
            </View>
          )}
          {isMyListing && (
            <>
              <Button title="Voir les candidatures" onPress={() => Alert.alert('Bientôt', 'Écran candidat à connecter (MVP).')} />
              <Button title="Modifier l'annonce" onPress={() => Alert.alert('Bientôt', 'Édition à connecter (MVP).')} variant="outline" />
              <Button title="Supprimer" onPress={handleDelete} variant="ghost" />
            </>
          )}
          <Button
            title="Contacter"
            onPress={handleContact}
            variant="outline"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: FontSize.md, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  body: { padding: Spacing.xxl },
  headerRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  categoryBadge: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.full,
  },
  categoryText: { fontSize: FontSize.sm, fontFamily: 'Inter_500Medium', color: Colors.primaryDark },
  urgentBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.urgentLight, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.full,
  },
  urgentText: { fontSize: FontSize.xs, fontFamily: 'Inter_600SemiBold', color: Colors.urgent },
  title: { fontSize: FontSize.xxl, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: Spacing.md },
  description: {
    fontSize: FontSize.md, fontFamily: 'Inter_400Regular', color: Colors.textSecondary,
    lineHeight: 22, marginBottom: Spacing.xl,
  },
  infoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl,
  },
  infoCard: {
    flex: 1, minWidth: (width - 80) / 2,
    backgroundColor: Colors.backgroundSecondary, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', gap: 4,
  },
  infoLabel: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textTertiary },
  infoValue: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  mapWrapper: {
    height: 180,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  map: { flex: 1 },
  ownerCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.backgroundSecondary, padding: Spacing.lg,
    borderRadius: BorderRadius.lg, marginBottom: Spacing.xl,
  },
  ownerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  ownerAvatarLetter: { fontSize: FontSize.lg, fontFamily: 'Inter_700Bold', color: Colors.primaryDark },
  ownerInfo: { flex: 1 },
  ownerName: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: FontSize.sm, fontFamily: 'Inter_500Medium', color: Colors.text },
  actions: { gap: Spacing.md },
  appliedBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
  },
  appliedText: { fontSize: FontSize.md, fontFamily: 'Inter_500Medium', color: Colors.primaryDark },
});
