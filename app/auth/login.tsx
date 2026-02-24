import { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../lib/supabase';
import { Colors, Spacing, FontSize, BorderRadius } from '../../lib/constants';
import Input from '../../components/Input';
import Button from '../../components/Button';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      router.back();
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) Alert.alert('Erreur', error.message);
        else router.back();
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Erreur', 'La connexion Apple a échoué.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const redirectTo = makeRedirectUri({
        scheme: 'extra-job',
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert('Erreur', error.message);
        return;
      }

      if (!data?.url) {
        Alert.alert('Erreur', 'Impossible de démarrer la connexion Google.');
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') {
        await supabase.auth.getSession();
        router.back();
      }
    } catch {
      Alert.alert('Erreur', 'La connexion Google a échoué.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Connexion</Text>
      <Text style={styles.subtitle}>Connectez-vous pour publier et postuler</Text>

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
        placeholder="Votre mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      <Button title="Se connecter" onPress={handleLogin} loading={loading} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.dividerLine} />
      </View>

      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={BorderRadius.md}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}

      <Button
        title="Continuer avec Google"
        onPress={handleGoogleSignIn}
        variant="outline"
        icon={<Ionicons name="logo-google" size={18} color={Colors.primary} />}
        style={styles.googleButton}
      />

      <TouchableOpacity style={styles.link} onPress={() => router.replace('/auth/register')}>
        <Text style={styles.linkText}>
          Pas encore de compte ?{' '}
          <Text style={styles.linkBold}>S'inscrire</Text>
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: 'Inter_400Regular',
  },
  appleButton: {
    width: '100%',
    height: 48,
    marginBottom: Spacing.md,
  },
  googleButton: {
    marginBottom: Spacing.md,
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
