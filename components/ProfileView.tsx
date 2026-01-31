import React from 'react';
import { supabase } from '../supabaseClient';
import { Construction, MapPin, BadgeCheck, ShieldCheck, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  session: any;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, session }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // Check admin access (username 'kalim' OR email 'kalim@gmail.com')
  const isAdmin = (userProfile?.username && userProfile.username.toLowerCase() === 'kalim') || 
                  (session?.user?.email && session.user.email.toLowerCase() === 'kalim@gmail.com');

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
            onClick={() => navigate('/admin')}
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
};

export default ProfileView;