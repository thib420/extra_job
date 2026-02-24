import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../lib/constants';
import { supabase, supabaseEnabled } from '../lib/supabase';
import { useAuthStore } from '../lib/store';

SplashScreen.preventAutoHideAsync();

function AuthCloseButton() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={10} style={styles.closeButton}>
      <Ionicons name="close" size={22} color={Colors.secondary} />
    </Pressable>
  );
}

export default function RootLayout() {
  const setSession = useAuthStore((s) => s.setSession);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    let mounted = true;

    if (!supabaseEnabled) {
      setSession(null);
      return () => {
        mounted = false;
      };
    }

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        await fetchProfile();
      }
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      if (session) {
        await fetchProfile();
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile, setSession]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.secondary,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="listing/[id]" options={{ title: 'Annonce' }} />
        <Stack.Screen name="conversation/[id]" options={{ title: 'Conversation' }} />
        <Stack.Screen
          name="auth/login"
          options={{
            title: 'Connexion',
            presentation: 'modal',
            headerRight: () => <AuthCloseButton />,
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            title: 'Inscription',
            presentation: 'modal',
            headerRight: () => <AuthCloseButton />,
          }}
        />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Modifier mon profil' }} />
        <Stack.Screen name="my-listings" options={{ title: 'Mes annonces' }} />
        <Stack.Screen name="my-applications" options={{ title: 'Mes candidatures' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: {
    padding: 4,
  },
});
