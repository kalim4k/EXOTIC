import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import MissionView from './components/MissionView';
import ChatView from './components/ChatView';
import AuthView from './components/AuthView';
import AdminView from './components/AdminView';
import ModelListView from './components/ModelListView';
import ProfileView from './components/ProfileView';
import InstallPWA from './components/InstallPWA';
import { supabase } from './supabaseClient';
import { UserProfile } from './types';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Manage Auth Session and Fetch Profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
          fetchProfile(session.user.id);
      } else {
          setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
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
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
          </div>
      );
  }

  return (
    <>
      <Routes>
        {/* Route publique : Auth */}
        <Route path="/auth" element={!session ? <AuthView /> : <Navigate to="/models" replace />} />
        
        {/* Routes Protégées (Layout Principal) */}
        <Route element={<ProtectedLayout session={session} />}>
            <Route path="/" element={<Navigate to="/models" replace />} />
            <Route path="/models" element={<ModelListView userProfile={userProfile} session={session} />} />
            <Route path="/mission" element={<MissionView />} />
            <Route path="/chat" element={<ChatView onDiscover={() => navigate('/models')} />} />
            <Route path="/profile" element={<ProfileView userProfile={userProfile} session={session} />} />
        </Route>

        {/* Route Admin (Protégée mais sans le layout standard si désiré, ou avec) */}
        {/* Ici on le met hors du layout principal pour avoir le plein écran comme avant */}
        <Route path="/admin" element={session ? <AdminView onBack={() => navigate('/profile')} /> : <Navigate to="/auth" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <InstallPWA />
    </>
  );
};

// Layout component pour les pages connectées avec Header et BottomNav
const ProtectedLayout: React.FC<{ session: Session | null }> = ({ session }) => {
    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-[#F2F2F7]">
            <Header />
            <main className="max-w-7xl mx-auto pb-28">
                <Outlet />
            </main>
            <BottomNavigation />
        </div>
    );
};

export default App;