export type ListingStatus = 'active' | 'complete' | 'expired' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type Category =
  | 'jardinage'
  | 'demenagement'
  | 'bricolage'
  | 'menage'
  | 'evenement'
  | 'courses'
  | 'animaux'
  | 'informatique'
  | 'cuisine'
  | 'autre';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  preferred_date: string | null;
  estimated_duration: number;
  spots_total: number;
  spots_filled: number;
  photos: string[];
  is_urgent: boolean;
  status: ListingStatus;
  created_at: string;
  expires_at: string;
  // Joined fields
  user?: UserProfile;
}

export interface Application {
  id: string;
  listing_id: string;
  user_id: string;
  status: ApplicationStatus;
  created_at: string;
  // Joined fields
  listing?: Listing;
  user?: UserProfile;
}

export interface Conversation {
  id: string;
  listing_id: string;
  participant_1: string;
  participant_2: string;
  created_at: string;
  // Joined fields
  listing?: Listing;
  other_user?: UserProfile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined fields
  reviewer?: UserProfile;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  reported_listing_id: string | null;
  reason: string;
  description: string | null;
  created_at: string;
}
