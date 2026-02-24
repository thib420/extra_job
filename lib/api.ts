import { supabase } from './supabase';
import { Listing, Application, Conversation, Message, Review, Category } from '../types/database';

// --- Listings ---

interface SearchParams {
  query?: string;
  category?: Category;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: 'recent' | 'closest' | 'date';
}

export async function searchListings(params: SearchParams) {
  let query = supabase
    .from('listings')
    .select('*, user:users(*)')
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString());

  if (params.query) {
    query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
  }

  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.sortBy === 'date') {
    query = query.order('preferred_date', { ascending: true, nullsFirst: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(50);
  if (error) throw error;

  let results = (data || []) as Listing[];

  // Client-side distance filtering
  if (params.latitude && params.longitude && params.radiusKm) {
    results = results.filter((l) => {
      const dist = getDistanceKm(params.latitude!, params.longitude!, l.latitude, l.longitude);
      return dist <= params.radiusKm!;
    });

    if (params.sortBy === 'closest') {
      results.sort((a, b) => {
        const distA = getDistanceKm(params.latitude!, params.longitude!, a.latitude, a.longitude);
        const distB = getDistanceKm(params.latitude!, params.longitude!, b.latitude, b.longitude);
        return distA - distB;
      });
    }
  }

  return results;
}

export async function getListing(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, user:users(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function createListing(listing: Partial<Listing>) {
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function updateListing(id: string, updates: Partial<Listing>) {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
}

export async function getUserListings(userId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Listing[];
}

// --- Applications ---

export async function applyToListing(listingId: string, userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .insert({ listing_id: listingId, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Application;
}

export async function getApplicationsForListing(listingId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, user:users(*)')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Application[];
}

export async function getUserApplications(userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, listing:listings(*, user:users(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Application[];
}

export async function updateApplication(id: string, status: Application['status']) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Application;
}

// --- Conversations & Messages ---

export async function getOrCreateConversation(listingId: string, userId: string, otherUserId: string) {
  // Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('listing_id', listingId)
    .or(`and(participant_1.eq.${userId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${userId})`);

  if (existing && existing.length > 0) return existing[0] as Conversation;

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      listing_id: listingId,
      participant_1: userId,
      participant_2: otherUserId,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Conversation;
}

export async function getUserConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(title, category),
      participant_1_user:users!conversations_participant_1_fkey(*),
      participant_2_user:users!conversations_participant_2_fkey(*)
    `)
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as any[];
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as Message[];
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();
  if (error) throw error;
  return data as Message;
}

export async function markMessagesRead(conversationId: string, userId: string) {
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .is('read_at', null);
}

// --- Reviews ---

export async function createReview(review: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  if (error) throw error;
  return data as Review;
}

export async function getReviewsForUser(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:users!reviews_reviewer_id_fkey(*)')
    .eq('reviewed_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}

export async function getUserAverageRating(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewed_id', userId);
  if (error || !data || data.length === 0) return null;
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return Math.round(avg * 10) / 10;
}

// --- Reports ---

export async function createReport(report: Partial<import('../types/database').Report>) {
  const { error } = await supabase.from('reports').insert(report);
  if (error) throw error;
}

// --- User Profile ---

export async function updateUserProfile(userId: string, updates: { display_name?: string; bio?: string; avatar_url?: string; skills?: string[] }) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Helpers ---

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}
