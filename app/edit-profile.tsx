import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../lib/constants';
import { useAuthStore } from '../lib/store';
import { updateUserProfile } from '../lib/api';
import { supabaseEnabled } from '../lib/supabase';
import Input from '../components/Input';
import Button from '../components/Button';

export default function EditProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState((profile?.skills || []).join(', '));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
    setBio(profile?.bio || '');
    setSkills((profile?.skills || []).join(', '));
  }, [profile]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Connexion requise.');
      return;
    }

    if (!displayName.trim()) {
      Alert.alert('Erreur', 'Le nom est requis.');
      return;
    }

    if (!supabaseEnabled) {
      Alert.alert('Profil mis à jour !', '(démo)');
      router.back();
      return;
    }

    if (saving) return;

    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

    setSaving(true);

    try {
      await updateUserProfile(user.id, {
        display_name: displayName.trim(),
        bio: bio.trim(),
        skills: skillsArray,
      });
      await fetchProfile();
      router.back();
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.avatarBtn}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="camera" size={28} color={Colors.textTertiary} />
        </View>
        <Text style={styles.avatarText}>Changer la photo</Text>
      </TouchableOpacity>

      <Input label="Nom affiché *" value={displayName} onChangeText={setDisplayName} />
      <Input
        label="Bio"
        placeholder="Parlez de vous en quelques mots..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        style={{ height: 80, textAlignVertical: 'top' }}
      />
      <Input
        label="Compétences"
        placeholder="jardinage, bricolage, cuisine... (séparées par des virgules)"
        value={skills}
        onChangeText={setSkills}
      />

      <Button title="Enregistrer" onPress={handleSave} disabled={saving} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xxl },
  avatarBtn: { alignItems: 'center', marginBottom: Spacing.xxl },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
  },
  avatarText: {
    fontSize: FontSize.sm, fontFamily: 'Inter_500Medium',
    color: Colors.primary, marginTop: Spacing.sm,
  },
});
