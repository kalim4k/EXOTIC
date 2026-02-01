import React from 'react';
import { ChevronRight, Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const FEATURED_MODELS = [
  {
    name: "Kenza",
    age: 23,
    image: "https://celinaroom.com/wp-content/uploads/2026/02/photo_2026-01-30_11-29-35.jpg",
    tag: "Nouveauté"
  },
  {
    name: "Soraya",
    age: 25,
    image: "https://celinaroom.com/wp-content/uploads/2026/02/photo_2026-01-30_11-29-28.jpg",
    tag: "Populaire"
  },
  {
    name: "Nayla",
    age: 21,
    image: "https://celinaroom.com/wp-content/uploads/2026/02/photo_2026-01-30_11-29-36-2.jpg",
    tag: "Certifiée"
  },
  {
    name: "Imane",
    age: 24,
    image: "https://celinaroom.com/wp-content/uploads/2026/02/photo_2026-01-30_11-29-36.jpg",
    tag: "VIP"
  },
  {
    name: "Jade",
    age: 22,
    image: "https://celinaroom.com/wp-content/uploads/2026/02/photo_2026-01-30_11-33-43.jpg",
    tag: "En ligne"
  },
  {
    name: "Farah",
    age: 26,
    image: "https://celinaroom.com/wp-content/uploads/2026/02/photo_2026-01-30_11-34-25.jpg",
    tag: "Top Note"
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#F2F2F7] relative overflow-hidden flex flex-col">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full blur-[100px] opacity-30 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-30" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-6 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Exotic<span className="text-indigo-600">.</span>
          </h1>
        </div>
        <button 
            onClick={onStart}
            className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
        >
            Connexion
        </button>
      </header>

      <main className="flex-1 relative z-10 overflow-y-auto hide-scrollbar pb-24">
        
        {/* Hero Section */}
        <div className="px-6 py-8 space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-2">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">La référence Africaine</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Rencontrez <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    l'Élite
                </span>.
            </h2>
            
            <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
                Accédez aux profils les plus exclusifs. Vérifiés, discrets et disponibles maintenant.
            </p>

            <button 
                onClick={onStart}
                className="w-full max-w-xs mx-auto bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-gray-200 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
                <span>Créer un compte</span>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>
            
            <p className="text-xs text-gray-400 font-medium">
                Inscription gratuite • Aucun paiement requis
            </p>
        </div>

        {/* Scrollable Model Showcase */}
        <div className="px-4 mt-4">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-gray-900 text-lg">Sélection du jour</h3>
                <span className="text-xs font-medium text-indigo-600">Voir tout</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-8">
                {FEATURED_MODELS.map((model, index) => (
                    <div 
                        key={index}
                        onClick={onStart} 
                        className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 shadow-sm cursor-pointer"
                    >
                        <img 
                            src={model.image} 
                            alt={model.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                        
                        {/* Tag */}
                        <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-lg">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                {model.tag}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="text-lg font-bold leading-none">{model.name}, <span className="text-sm font-normal opacity-90">{model.age}</span></p>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-medium opacity-80">En ligne</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Features / Trust */}
        <div className="px-6 py-8 bg-white/60 backdrop-blur-xl border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-1">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">100% Vérifié</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-1">
                        <Heart size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Rencontres Réelles</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-1">
                        <Star size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Service Premium</span>
                </div>
            </div>
        </div>

      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <button 
            onClick={onStart}
            className="w-full bg-white/90 backdrop-blur-md border border-white/40 text-gray-900 font-bold py-3.5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
            <span className="text-indigo-600">Découvrir l'application</span>
        </button>
      </div>

    </div>
  );
};

export default LandingPage;