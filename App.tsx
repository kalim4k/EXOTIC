import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModelCard from './components/ModelCard';
import BottomNavigation from './components/BottomNavigation';
import MissionRequiredModal from './components/MissionRequiredModal';
import MissionView from './components/MissionView';
import ChatView from './components/ChatView';
import AuthView from './components/AuthView';
import AdminView from './components/AdminView';
import { modelsData as staticModelsData, getFlag } from './data'; // Fallback data & helpers
import { Sparkles, Construction, Loader2, LogOut, MapPin, BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Model, UserProfile } from './types';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('model');
  const [filterTab, setFilterTab] = useState<'all' | 'new' | 'popular'>('all');
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  
  // Data State
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manage Auth Session and Fetch Profile
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
       console.error("Exception fetching profile:", error);
    }
  };

  // Fetch data from Supabase (Models)
  useEffect(() => {
    // Only fetch if logged in
    if (!session) return;
    // If admin view is active, fetching is handled inside AdminView component
    if (activeTab === 'admin') return;

    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Map Supabase snake_case columns to our camelCase types
          const formattedModels: Model[] = data.map((item: any) => ({
            id: item.id.toString(),
            name: item.name,
            country: item.country,
            // Fallback: Si le drapeau est null en BDD, on le génère via le helper getFlag
            flag: item.flag || getFlag(item.country),
            imageUrl: item.image_url,
            phoneNumber: item.phone_number,
            isOnline: item.is_online,
            price: item.price,
          }));
          setModels(formattedModels);
        } else {
          // If table is empty or connection not set up, use static data
          console.log("No data found or Supabase not connected, using static data.");
          setModels(staticModelsData);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        // Fallback to static data on error (e.g., missing API keys)
        setModels(staticModelsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [session, activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab('model');
  };

  // Calcul du nombre de modèles en ligne
  const onlineCount = models.filter(m => m.isOnline).length;

  const handleContactClick = () => {
    setIsMissionModalOpen(true);
  };

  const handleGoToMissions = () => {
    setIsMissionModalOpen(false);
    setActiveTab('mission');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleGoToModels = () => {
    setActiveTab('model');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check admin access (username 'kalim' OR email 'kalim@gmail.com')
  const isAdmin = (userProfile?.username && userProfile.username.toLowerCase() === 'kalim') || 
                  (session?.user?.email && session.user.email.toLowerCase() === 'kalim@gmail.com');

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminView onBack={() => setActiveTab('profile')} />;
      case 'model':
        // LOGIQUE DE LOCALISATION : 
        // Si l'utilisateur a un pays défini, on remplace le pays/drapeau du modèle par celui de l'utilisateur
        const displayModels = models.map(model => {
            if (userProfile?.country) {
                return {
                    ...model,
                    country: userProfile.country || model.country,
                    flag: getFlag(userProfile.country || "")
                };
            }
            return model;
        });

        return (
          <>
            {/* Hero / Intro Section */}
            <div className="px-4 py-6 space-y-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                  <Sparkles size={16} />
                  <span>Exclusivité {userProfile?.country ? ` - ${getFlag(userProfile.country)} ${userProfile.country}` : ''}</span>
                </div>

                {/* Badge Compteur En Ligne */}
                {!isLoading && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-green-100 shadow-sm animate-in fade-in">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-xs font-bold text-green-700 tracking-tight">{onlineCount} en ligne</span>
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Découvrez nos<br />
                modèles d'exception.
              </h2>
            </div>

            {/* Filter Tabs (iOS Segmented Control Style) */}
            <div className="px-4 mb-6 overflow-x-auto hide-scrollbar">
              <div className="flex p-1 bg-gray-200/80 rounded-lg w-fit">
                <button 
                  onClick={() => setFilterTab('all')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filterTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  Tous
                </button>
                <button 
                  onClick={() => setFilterTab('new')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filterTab === 'new' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  Nouveautés
                </button>
                <button 
                  onClick={() => setFilterTab('popular')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filterTab === 'popular' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  Populaires
                </button>
              </div>
            </div>

            {/* Grid Layout or Loading State */}
            {isLoading ? (
               <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-4">
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                  <p className="text-sm text-gray-400 font-medium">Chargement des modèles...</p>
               </div>
            ) : (
              <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {displayModels.map((model) => (
                  <ModelCard 
                    key={model.id} 
                    model={model} 
                    onContactClick={handleContactClick}
                  />
                ))}
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-12 mb-8 text-center px-6">
              <p className="text-xs text-gray-400">
                En continuant, vous acceptez nos conditions d'utilisation. 
                Les photos sont à titre illustratif.
              </p>
            </div>
          </>
        );
      case 'mission':
        return <MissionView />;
      case 'chat':
        return <ChatView onDiscover={handleGoToModels} />;
      case 'profile':
         return (
           <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-6 animate-in fade-in duration-300">
             
             {/* Profile Header */}
             <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-white rounded-full flex items-center justify-center shadow-inner border border-white relative">
                    <Construction className="text-indigo-500" size={36} />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                       <BadgeCheck size={14} className="text-white" strokeWidth={3} />
                    </div>
                </div>
                
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                        {userProfile?.username || session?.user?.email?.split('@')[0]}
                    </h3>
                    
                    {userProfile?.country && (
                        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm font-medium bg-gray-100 py-1 px-3 rounded-full w-fit mx-auto">
                            <MapPin size={14} />
                            <span>{userProfile.country}</span>
                        </div>
                    )}
                    
                    <p className="text-gray-400 text-xs mt-1">{session?.user?.email}</p>
                </div>
             </div>

             <div className="w-full max-w-xs space-y-3 pt-4">
                <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 text-left flex justify-between items-center">
                     <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Statut</p>
                        <p className="text-sm font-medium text-gray-900">Membre Standard</p>
                     </div>
                     <span className="text-2xl">🥉</span>
                </div>

                <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 text-left flex justify-between items-center">
                     <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Solde Mission</p>
                        <p className="text-sm font-medium text-gray-900">0 Points</p>
                     </div>
                     <span className="text-2xl">💰</span>
                </div>

                {/* ADMIN BUTTON (Visible for 'kalim' or 'kalim@gmail.com') */}
                {isAdmin && (
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl shadow-sm border border-gray-800 flex justify-between items-center mt-4 transition-transform active:scale-95"
                  >
                     <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-yellow-400" />
                        <div className="text-left">
                          <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Espace Admin</p>
                          <p className="text-sm font-bold text-white">Gérer les modèles</p>
                        </div>
                     </div>
                     <span className="text-xl">⚙️</span>
                  </button>
                )}
             </div>

             {/* Logout Button */}
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-medium text-sm hover:bg-red-50 px-6 py-2.5 rounded-full transition-colors mt-8 ring-1 ring-red-100"
             >
                <LogOut size={16} />
                <span>Se déconnecter</span>
             </button>
          </div>
        );
      default:
        return null;
    }
  };

  // If not authenticated, show Auth View
  if (!session) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Hide header in admin mode for more space */}
      {activeTab !== 'admin' && <Header />}
      
      <main className={`max-w-7xl mx-auto ${activeTab !== 'admin' ? 'pb-28' : ''}`}>
        {renderContent()}
      </main>

      {/* Hide bottom nav in admin mode */}
      {activeTab !== 'admin' && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      {isMissionModalOpen && (
        <MissionRequiredModal 
          onClose={() => setIsMissionModalOpen(false)} 
          onConfirm={handleGoToMissions} 
        />
      )}
    </div>
  );
};

export default App;