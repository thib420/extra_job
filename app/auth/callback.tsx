import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors, FontSize, Spacing } from '../../lib/constants';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      await supabase.auth.getSession();
      router.replace('/(tabs)');
    };
    finalize();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Connexion en cours...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
});
