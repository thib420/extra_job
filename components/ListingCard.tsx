import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Listing, Category } from '../types/database';
import { Colors, Spacing, BorderRadius, FontSize, CATEGORIES } from '../lib/constants';

interface Props {
  listing: Listing;
}

function getCategoryInfo(cat: Category) {
  return CATEGORIES.find((c) => c.value === cat) || CATEGORIES[CATEGORIES.length - 1];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ListingCard({ listing }: Props) {
  const router = useRouter();
  const cat = getCategoryInfo(listing.category);
  const spotsLeft = listing.spots_total - listing.spots_filled;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/listing/${listing.id}`)}
    >
      {listing.photos?.length > 0 && (
        <Image source={{ uri: listing.photos[0] }} style={styles.image} />
      )}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </View>
          {listing.is_urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{listing.city}</Text>
          </View>
          {listing.preferred_date && (
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{formatDate(listing.preferred_date)}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{listing.estimated_duration}h</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.spotsText}>
            {spotsLeft > 0 ? `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} dispo` : 'Complet'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: FontSize.xs,
    color: Colors.primaryDark,
    fontFamily: 'Inter_500Medium',
  },
  urgentBadge: {
    backgroundColor: Colors.urgentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  urgentText: {
    fontSize: FontSize.xs,
    color: Colors.urgent,
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotsText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: 'Inter_500Medium',
  },
});
