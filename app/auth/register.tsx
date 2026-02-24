import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors, Spacing, FontSize } from '../../lib/constants';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    const emailRedirectTo = 'extra-job://auth/callback';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo,
      },
    });

    if (error) {
      setLoading(false);
      Alert.alert('Erreur', error.message);
      return;
    }

    // Create user profile
    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        display_name: displayName,
      });
    }

    setLoading(false);
    Alert.alert(
      'Bienvenue !',
      data.session ? 'Votre compte a été créé avec succès.' : 'Vérifiez votre email pour activer votre compte.'
    );
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Inscription</Text>
      <Text style={styles.subtitle}>Créez un compte pour rejoindre la communauté</Text>

      <Input
        label="Nom affiché"
        placeholder="Votre prénom ou pseudo"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
      />
      <Input
        label="Email"
        placeholder="votre@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input
        label="Mot de passe"
        placeholder="6 caractères minimum"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
      />

      <Button title="Créer mon compte" onPress={handleRegister} loading={loading} />

      <TouchableOpacity style={styles.link} onPress={() => router.replace('/auth/login')}>
        <Text style={styles.linkText}>
          Déjà un compte ?{' '}
          <Text style={styles.linkBold}>Se connecter</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xxl,
    backgroundColor: Colors.background,
  },
  heading: {
    fontSize: FontSize.xxl,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  link: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  linkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  linkBold: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});
