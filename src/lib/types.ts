export interface Cat {
  id: string;
  name: string | null;
  photos: string[];
  primary_photo: string;
  location_lat: number;
  location_lng: number;
  location_name: string;
  breed: string | null;
  color: string;
  age: string | null;
  is_stray: boolean;
  background_story: string | null;
  voting_status: 'none' | 'suggesting' | 'voting' | 'complete';
  voting_round_id: string | null;
  created_at: string;
  approved: boolean;
}

export interface VotingRound {
  id: string;
  start_date: string;
  suggestion_end_date: string;
  voting_end_date: string;
  status: 'suggesting' | 'voting' | 'complete';
}

export interface NameSuggestion {
  id: string;
  cat_id: string;
  round_id: string;
  suggested_name: string;
  vote_count: number;
  created_at: string;
}

export interface Vote {
  id: string;
  suggestion_id: string;
  voter_hash: string;
  created_at: string;
}

export interface CatSubmission {
  id: string;
  photo_url: string;
  location_lat: number;
  location_lng: number;
  location_name: string | null;
  breed: string | null;
  age: string | null;
  background_story: string | null;
  is_stray: boolean;
  submitter_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}
