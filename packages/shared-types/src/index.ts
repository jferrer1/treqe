// ─── Product ───
export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  subcategory: string | null;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  weight: number | null;
  photos: string[];
  videos: string[];
  status: "active" | "reserved" | "sold" | "deleted";
  created_at: string;
}

// ─── User ───
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  reputation: number;
  verified: boolean;
  created_at: string;
}

// ─── Match ───
export interface Match {
  id: string;
  circular_id: string | null;
  status: "pending" | "active" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  expires_at: string | null;
  participants: MatchParticipant[];
}

export interface MatchParticipant {
  id: string;
  user_id: string;
  product_id: string;
  receives_from: string | null;
  cash_diff: number;
  status: "pending" | "accepted" | "rejected";
}

// ─── Pagos ───
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

// ─── PubSub (WebSocket) ───
export interface PubSubNotification {
  type:
    | "new_match"
    | "match_accepted"
    | "match_rejected"
    | "match_broken"
    | "payment_confirmed"
    | "escrow_released"
    | "shipping_update"
    | "dispute_resolved"
    | "price_drop"
    | "new_offer";
  title: string;
  body: string;
  action_url: string;
  reference_id: string;
  timestamp: string;
}
