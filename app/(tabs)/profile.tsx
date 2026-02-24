import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../../lib/constants';
import { useAuthStore } from '../../lib/store';
import Button from '../../components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  if (!user) {
    return (
      <View style={styles.locked}>
        <Ionicons name="person-circle-outline" size={56} color={Colors.textTertiary} />
        <Text style={styles.lockedTitle}>Connexion requise</Text>
        <Text style={styles.lockedText}>Connectez-vous pour voir et modifier votre profil.</Text>
        <Button title="Se connecter" onPress={() => router.push('/auth/login')} style={styles.lockedButton} />
      </View>
    );
  }

  const displayName = profile?.display_name || user.user_metadata?.display_name || user.email || 'Utilisateur';
  const bio = profile?.bio || 'Complétez votre profil pour inspirer confiance aux bénévoles.';
  const skills = profile?.skills || [];

  const menuItems = [
    { icon: 'list-outline' as const, label: 'Mes annonces', route: '/my-listings' },
    { icon: 'hand-left-outline' as const, label: 'Mes candidatures', route: '/my-applications' },
    { icon: 'create-outline' as const, label: 'Modifier mon profil', route: '/edit-profile' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarLetter}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.bio}>{bio}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={Colors.urgent} />
          <Text style={styles.ratingText}>MVP</Text>
          <Text style={styles.ratingCount}>(avis à connecter)</Text>
        </View>
        {skills.length > 0 && (
          <View style={styles.skillsRow}>
            {skills.map((s, i) => (
              <View key={i} style={styles.skillBadge}>
                <Text style={styles.skillText}>{s}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Annonces</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Missions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Avis</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.signOutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { paddingBottom: 40 },
  profileCard: {
    backgroundColor: Colors.white, padding: Spacing.xxl,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarLetter: { fontSize: 32, fontFamily: 'Inter_700Bold', color: Colors.primaryDark },
  displayName: { fontSize: FontSize.xl, fontFamily: 'Inter_700Bold', color: Colors.text },
  bio: {
    fontSize: FontSize.sm, fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xxl,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  ratingText: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  ratingCount: { fontSize: FontSize.sm, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  skillsRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: Spacing.sm, marginTop: Spacing.md,
  },
  skillBadge: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.full,
  },
  skillText: { fontSize: FontSize.xs, fontFamily: 'Inter_500Medium', color: Colors.primaryDark },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.white,
    marginTop: Spacing.md, paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: FontSize.xxl, fontFamily: 'Inter_700Bold', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  menu: {
    backgroundColor: Colors.white, marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight, gap: Spacing.md,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontFamily: 'Inter_500Medium', color: Colors.text },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, padding: Spacing.lg, marginTop: Spacing.xxl,
  },
  signOutText: { fontSize: FontSize.md, fontFamily: 'Inter_500Medium', color: Colors.error },
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
