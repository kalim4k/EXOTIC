export interface Model {
  id: string;
  name: string;
  country: string;
  flag: string;
  imageUrl: string;
  phoneNumber: string;
  isOnline?: boolean;
  price: number;
}

export interface UserProfile {
  id: string;
  username?: string;
  country?: string;
  avatar_url?: string;
  // full_name est remplacé par username, on peut le garder optionnel pour la compatibilité ou le retirer
  full_name?: string; 
}