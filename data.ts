import { Model } from './types';

export const AFRICAN_COUNTRIES = [
  "Bénin",
  "Burkina Faso",
  "Cameroun",
  "Côte d'Ivoire",
  "Gabon",
  "Mali",
  "Niger",
  "Sénégal",
  "Togo"
].sort();

// Helper pour les drapeaux
export const getFlag = (country: string) => {
  const flags: Record<string, string> = {
    "Bénin": "🇧🇯", "Burkina Faso": "🇧🇫", "Cameroun": "🇨🇲", 
    "Côte d'Ivoire": "🇨🇮", "Gabon": "🇬🇦", "Mali": "🇲🇱", 
    "Niger": "🇳🇪", "Sénégal": "🇸🇳", "Togo": "🇹🇬",
    // Fallbacks pour les données statiques existantes si besoin
    "France": "🇫🇷", "Espagne": "🇪🇸", "Brésil": "🇧🇷", 
    "Maroc": "🇲🇦", "Russie": "🇷🇺", "UK": "🇬🇧"
  };
  return flags[country] || "🌍";
};

export const modelsData: Model[] = [
  {
    id: '1',
    name: 'Ava',
    country: 'France',
    flag: '🇫🇷',
    imageUrl: 'https://picsum.photos/400/600?random=1',
    phoneNumber: '+33 6 12 34 56 78',
    isOnline: true,
    price: 15000,
  },
  {
    id: '2',
    name: 'Trixi',
    country: 'Espagne',
    flag: '🇪🇸',
    imageUrl: 'https://picsum.photos/400/600?random=2',
    phoneNumber: '+34 612 345 678',
    isOnline: false,
    price: 10000,
  },
  {
    id: '3',
    name: 'Viviana',
    country: 'Brésil',
    flag: '🇧🇷',
    imageUrl: 'https://picsum.photos/400/600?random=3',
    phoneNumber: '+55 11 91234-5678',
    isOnline: true,
    price: 12000,
  },
  {
    id: '4',
    name: 'Nourachou',
    country: 'Maroc',
    flag: '🇲🇦',
    imageUrl: 'https://picsum.photos/400/600?random=4',
    phoneNumber: '+212 6 12 34 56 78',
    isOnline: true,
    price: 8000,
  },
  {
    id: '5',
    name: 'Fleurie',
    country: 'Cameroun',
    flag: '🇨🇲',
    imageUrl: 'https://picsum.photos/400/600?random=5',
    phoneNumber: '+237 6 12 34 56 78',
    isOnline: false,
    price: 7000,
  },
  {
    id: '6',
    name: 'Liza',
    country: 'Russie',
    flag: '🇷🇺',
    imageUrl: 'https://picsum.photos/400/600?random=6',
    phoneNumber: '+7 912 345-67-89',
    isOnline: true,
    price: 15000,
  },
  {
    id: '7',
    name: 'Lizy',
    country: 'UK',
    flag: '🇬🇧',
    imageUrl: 'https://picsum.photos/400/600?random=7',
    phoneNumber: '+44 7700 900077',
    isOnline: false,
    price: 10000,
  },
  {
    id: '8',
    name: 'SexyAmina',
    country: 'Sénégal',
    flag: '🇸🇳',
    imageUrl: 'https://picsum.photos/400/600?random=8',
    phoneNumber: '+221 77 123 45 67',
    isOnline: true,
    price: 9000,
  },
  {
    id: '9',
    name: 'AichaTrixi',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    imageUrl: 'https://picsum.photos/400/600?random=9',
    phoneNumber: '+225 07 12 34 56 78',
    isOnline: true,
    price: 7500,
  },
  {
    id: '10',
    name: 'FatouSkinny',
    country: 'Mali',
    flag: '🇲🇱',
    imageUrl: 'https://picsum.photos/400/600?random=10',
    phoneNumber: '+223 70 12 34 56',
    isOnline: false,
    price: 8500,
  },
];