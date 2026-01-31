import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Model, UserProfile } from '../types';
import { modelsData as staticModelsData, getFlag } from '../data';
import ModelCard from './ModelCard';
import MissionRequiredModal from './MissionRequiredModal';
import { Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModelListViewProps {
  userProfile: UserProfile | null;
  session: any;
}

const ModelListView: React.FC<ModelListViewProps> = ({ userProfile, session }) => {
  const navigate = useNavigate();
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'new' | 'popular'>('all');
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

  // Fetch data from Supabase (Models)
  useEffect(() => {
    // Only fetch if logged in
    if (!session) return;

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
  }, [session]);

  const handleContactClick = () => {
    setIsMissionModalOpen(true);
  };

  const handleGoToMissions = () => {
    setIsMissionModalOpen(false);
    navigate('/mission');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const onlineCount = models.filter(m => m.isOnline).length;

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

      {isMissionModalOpen && (
        <MissionRequiredModal 
          onClose={() => setIsMissionModalOpen(false)} 
          onConfirm={handleGoToMissions} 
        />
      )}
    </>
  );
};

export default ModelListView;