import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USERS } from '../lib/mock-data';
import { Colors, Spacing, BorderRadius, FontSize } from '../lib/constants';
import Input from '../components/Input';
import Button from '../components/Button';

const CURRENT_USER = MOCK_USERS[0];

export default function EditProfileScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(CURRENT_USER.display_name);
  const [bio, setBio] = useState(CURRENT_USER.bio || '');
  const [skills, setSkills] = useState(CURRENT_USER.skills.join(', '));

  const handleSave = () => {
    if (!displayName.trim()) {
      Alert.alert('Erreur', 'Le nom est requis.');
      return;
    }
    Alert.alert('Profil mis à jour !', '(démo)');
    router.back();
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

      <Button title="Enregistrer" onPress={handleSave} />
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
