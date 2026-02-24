import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseEnabled } from './supabase';
import { UserProfile } from '../types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  fetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, loading: false });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  fetchProfile: async () => {
    if (!supabaseEnabled) return;
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      set({ profile: data });
    }
  },

  signOut: async () => {
    if (!supabaseEnabled) {
      set({ session: null, user: null, profile: null });
      return;
    }
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
}));
