import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors, FontSize, Spacing } from '../../lib/constants';

function parseAuthParams(url: string) {
  const [beforeHash, hashPart = ''] = url.split('#');
  const queryPart = beforeHash.includes('?') ? beforeHash.split('?')[1] : '';

  const hashParams = new URLSearchParams(hashPart);
  const queryParams = new URLSearchParams(queryPart);

  return {
    accessToken: hashParams.get('access_token') || queryParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token') || queryParams.get('refresh_token'),
    code: queryParams.get('code'),
  };
}

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let handled = false;

    const finalize = async (url: string | null) => {
      if (!mounted || handled) return;
      handled = true;

      try {
        if (url) {
          const { accessToken, refreshToken, code } = parseAuthParams(url);

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } else if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          } else {
            await supabase.auth.getSession();
          }
        } else {
          await supabase.auth.getSession();
        }
      } finally {
        if (mounted) {
          router.replace('/(tabs)');
        }
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      finalize(url);
    });

    Linking.getInitialURL().then((initialUrl) => {
      finalize(initialUrl);
    });

    const fallbackTimer = setTimeout(() => {
      finalize(null);
    }, 1500);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      subscription.remove();
    };
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
