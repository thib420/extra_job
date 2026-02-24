import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/database';
import { Colors, Spacing, BorderRadius, FontSize, CATEGORIES, RADIUS_OPTIONS } from '../../lib/constants';
import { MOCK_LISTINGS } from '../../lib/mock-data';
import ListingCard from '../../components/ListingCard';

type SortBy = 'recent' | 'closest' | 'date';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | undefined>();
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [radiusIndex, setRadiusIndex] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredListings = useMemo(() => {
    let results = [...MOCK_LISTINGS];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      results = results.filter((l) => l.category === category);
    }

    if (sortBy === 'date') {
      results.sort((a, b) => {
        if (!a.preferred_date) return 1;
        if (!b.preferred_date) return -1;
        return new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime();
      });
    }

    return results;
  }, [query, category, sortBy]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Extra Job</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une activité..."
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={showFilters ? Colors.white : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={viewMode === 'list' ? Colors.white : Colors.textSecondary}
          />
          <Text style={[styles.viewBtnText, viewMode === 'list' && styles.viewBtnTextActive]}>Liste</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewBtn, viewMode === 'map' && styles.viewBtnActive]}
          onPress={() => setViewMode('map')}
        >
          <Ionicons
            name="map-outline"
            size={16}
            color={viewMode === 'map' ? Colors.white : Colors.textSecondary}
          />
          <Text style={[styles.viewBtnText, viewMode === 'map' && styles.viewBtnTextActive]}>Carte</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filters}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ value: undefined as Category | undefined, label: 'Toutes', icon: '📋' }, ...CATEGORIES]}
            keyExtractor={(item) => item.label}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.chip, category === item.value && styles.chipActive]}
                onPress={() => setCategory(item.value)}
              >
                <Text style={styles.chipIcon}>{item.icon}</Text>
                <Text style={[styles.chipText, category === item.value && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.radiusRow}>
            <Text style={styles.filterLabel}>Rayon :</Text>
            {RADIUS_OPTIONS.map((r, i) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.radiusChip, radiusIndex === i && styles.radiusChipActive]}
                onPress={() => setRadiusIndex(i)}
              >
                <Text style={[styles.radiusText, radiusIndex === i && styles.radiusTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sortRow}>
            <Text style={styles.filterLabel}>Tri :</Text>
            {[
              { key: 'recent' as SortBy, label: 'Récentes' },
              { key: 'closest' as SortBy, label: 'Proches' },
              { key: 'date' as SortBy, label: 'Date' },
            ].map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.radiusChip, sortBy === s.key && styles.radiusChipActive]}
                onPress={() => setSortBy(s.key)}
              >
                <Text style={[styles.radiusText, sortBy === s.key && styles.radiusTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      {viewMode === 'list' ? (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>Aucune annonce trouvée</Text>
              <Text style={styles.emptySubtext}>Modifiez vos filtres ou élargissez le rayon</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 46.603354,
              longitude: 1.888334,
              latitudeDelta: 9,
              longitudeDelta: 9,
            }}
          >
            {filteredListings.map((listing) => (
              <Marker
                key={listing.id}
                coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
                title={listing.title}
                description={`${listing.city} • ${listing.estimated_duration}h`}
                onCalloutPress={() => router.push(`/listing/${listing.id}`)}
              />
            ))}
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  logo: {
    fontSize: FontSize.xxl,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSize.md,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  filterBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  viewBtn: {
    flex: 1,
    height: 36,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  viewBtnActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  viewBtnText: {
    fontSize: FontSize.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  viewBtnTextActive: {
    color: Colors.white,
  },
  filters: {
    paddingBottom: Spacing.md,
  },
  categoryList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipIcon: { fontSize: 14, marginRight: 4 },
  chipText: {
    fontSize: FontSize.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.primaryDark },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  radiusChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  radiusChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  radiusText: {
    fontSize: FontSize.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  radiusTextActive: { color: Colors.primaryDark },
  list: { paddingTop: Spacing.sm, paddingBottom: Spacing.xxxl },
  mapContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: { flex: 1 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
});
