import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Switch, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Category } from '../../types/database';
import { Colors, Spacing, BorderRadius, FontSize, CATEGORIES, DURATIONS } from '../../lib/constants';
import { useAuthStore } from '../../lib/store';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface AddressSuggestion {
  label: string;
  city: string;
  postcode: string;
}

export default function PublishScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(2);
  const [spotsTotal, setSpotsTotal] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchAddress = (text: string) => {
    setAddressQuery(text);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(text)}&limit=5`
        );
        const json = await res.json();
        const results: AddressSuggestion[] = json.features.map((f: any) => ({
          label: f.properties.label,
          city: f.properties.city,
          postcode: f.properties.postcode,
        }));
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const selectAddress = (s: AddressSuggestion) => {
    setAddressQuery(s.label);
    setSuggestions([]);
  };

  const pickImage = async () => {
    if (photos.length >= 5) {
      Alert.alert('Maximum atteint', 'Vous pouvez ajouter jusqu\'à 5 photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5 - photos.length,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setPhotos([...photos, ...uris]);
    }
  };

  const handlePublish = () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Connectez-vous pour publier une annonce.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    if (!title || !category || !description || !addressQuery) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre, la catégorie, la description et l\'adresse.');
      return;
    }
    Alert.alert('Annonce publiée !', 'Votre annonce est maintenant visible (démo).');
    setTitle(''); setDescription(''); setCategory(''); setAddressQuery('');
    setPreferredDate(null); setDuration(2); setSpotsTotal(1); setPhotos([]); setIsUrgent(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Input label="Titre *" placeholder="Ex: Aide pour déménagement" value={title} onChangeText={setTitle} />

      {/* Category picker */}
      <Text style={styles.label}>Catégorie *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[styles.catChip, category === c.value && styles.catChipActive]}
            onPress={() => setCategory(c.value)}
          >
            <Text style={styles.catIcon}>{c.icon}</Text>
            <Text style={[styles.catText, category === c.value && styles.catTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Input
        label="Description *"
        placeholder="Décrivez l'activité, ce dont vous avez besoin..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
      />

      {/* Address autocomplete */}
      <Text style={styles.label}>Adresse *</Text>
      <View style={styles.addressContainer}>
        <TextInput
          style={styles.addressInput}
          placeholder="Tapez une adresse..."
          placeholderTextColor={Colors.textTertiary}
          value={addressQuery}
          onChangeText={searchAddress}
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map((s, i) => (
              <TouchableOpacity key={i} style={styles.suggestionItem} onPress={() => selectAddress(s)}>
                <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.suggestionText} numberOfLines={1}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Date */}
      <Text style={styles.label}>Date souhaitée</Text>
      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(!showDatePicker)}>
        <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
        <Text style={styles.dateText}>
          {preferredDate ? preferredDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Choisir une date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <View style={styles.dateButtons}>
          {[0, 1, 2, 3, 7, 14].map((days) => {
            const d = new Date();
            d.setDate(d.getDate() + days);
            return (
              <TouchableOpacity
                key={days}
                style={[styles.dateBtn, preferredDate?.toDateString() === d.toDateString() && styles.dateBtnActive]}
                onPress={() => { setPreferredDate(d); setShowDatePicker(false); }}
              >
                <Text style={[styles.dateBtnText, preferredDate?.toDateString() === d.toDateString() && styles.dateBtnTextActive]}>
                  {days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Duration */}
      <Text style={styles.label}>Durée estimée</Text>
      <View style={styles.durationRow}>
        {DURATIONS.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.durationChip, duration === d.value && styles.durationChipActive]}
            onPress={() => setDuration(d.value)}
          >
            <Text style={[styles.durationText, duration === d.value && styles.durationTextActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Spots */}
      <Text style={styles.label}>Personnes nécessaires</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => setSpotsTotal(Math.max(1, spotsTotal - 1))}>
          <Ionicons name="remove" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{spotsTotal}</Text>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => setSpotsTotal(Math.min(20, spotsTotal + 1))}>
          <Ionicons name="add" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Photos */}
      <Text style={styles.label}>Photos (optionnel, max 5)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
        {photos.map((uri, i) => (
          <View key={i} style={styles.photoWrapper}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.photoRemove}
              onPress={() => setPhotos(photos.filter((_, idx) => idx !== i))}
            >
              <Ionicons name="close-circle" size={22} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        {photos.length < 5 && (
          <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
            <Ionicons name="camera-outline" size={28} color={Colors.textTertiary} />
            <Text style={styles.addPhotoText}>Ajouter</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Urgent toggle */}
      <View style={styles.urgentRow}>
        <View>
          <Text style={styles.urgentLabel}>Annonce urgente</Text>
          <Text style={styles.urgentSubtext}>Sera mise en avant dans les résultats</Text>
        </View>
        <Switch
          value={isUrgent}
          onValueChange={setIsUrgent}
          trackColor={{ true: Colors.urgent, false: Colors.border }}
          thumbColor={Colors.white}
        />
      </View>

      <Button title="Publier l'annonce" onPress={handlePublish} style={styles.publishBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xxl, paddingBottom: 60 },
  label: {
    fontSize: FontSize.sm, fontFamily: 'Inter_500Medium', color: Colors.text,
    marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  catScroll: { marginBottom: Spacing.md },
  catChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm, backgroundColor: Colors.white,
  },
  catChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  catIcon: { fontSize: 14, marginRight: 4 },
  catText: { fontSize: FontSize.sm, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  catTextActive: { color: Colors.primaryDark },
  addressContainer: { marginBottom: Spacing.lg, zIndex: 10 },
  addressInput: {
    backgroundColor: Colors.backgroundSecondary, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.md, fontFamily: 'Inter_400Regular', color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  suggestions: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, marginTop: 4,
  },
  suggestionItem: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight, gap: Spacing.sm,
  },
  suggestionText: { flex: 1, fontSize: FontSize.sm, fontFamily: 'Inter_400Regular', color: Colors.text },
  datePicker: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  dateText: { fontSize: FontSize.md, fontFamily: 'Inter_400Regular', color: Colors.text },
  dateButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  dateBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  dateBtnActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  dateBtnText: { fontSize: FontSize.sm, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  dateBtnTextActive: { color: Colors.primaryDark },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  durationChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  durationChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  durationText: { fontSize: FontSize.sm, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  durationTextActive: { color: Colors.primaryDark },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginBottom: Spacing.lg },
  stepperBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  stepperValue: { fontSize: FontSize.xl, fontFamily: 'Inter_600SemiBold', color: Colors.text, minWidth: 30, textAlign: 'center' },
  photosRow: { marginBottom: Spacing.lg },
  photoWrapper: { marginRight: Spacing.sm, position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: BorderRadius.md },
  photoRemove: { position: 'absolute', top: -6, right: -6 },
  addPhoto: {
    width: 80, height: 80, borderRadius: BorderRadius.md, borderWidth: 1.5,
    borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
  },
  addPhotoText: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textTertiary, marginTop: 2 },
  urgentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.urgentLight, padding: Spacing.lg,
    borderRadius: BorderRadius.md, marginBottom: Spacing.xxl,
  },
  urgentLabel: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.text },
  urgentSubtext: { fontSize: FontSize.xs, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  publishBtn: { marginTop: Spacing.md },
});
