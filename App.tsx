import React, { useState, useEffect } from 'react';
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

type View = 'auth' | 'models' | 'mission' | 'chat' | 'profile' | 'admin';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('models');

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
        // Redirect to models on login if we were in auth
        if (currentView === 'auth') setCurrentView('models');
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

  // Determine actual view to render
  // If not logged in, force 'auth' view
  const activeView = !session ? 'auth' : currentView;

  const renderContent = () => {
    switch (activeView) {
      case 'auth':
        return <AuthView />;
      case 'models':
        return (
          <ModelListView 
            userProfile={userProfile} 
            session={session} 
            onGoToMissions={() => {
              setCurrentView('mission');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'mission':
        return <MissionView />;
      case 'chat':
        return <ChatView onDiscover={() => setCurrentView('models')} />;
      case 'profile':
        return (
          <ProfileView 
            userProfile={userProfile} 
            session={session} 
            onAdminClick={() => setCurrentView('admin')}
          />
        );
      case 'admin':
        return <AdminView onBack={() => setCurrentView('profile')} />;
      default:
        return <ModelListView userProfile={userProfile} session={session} onGoToMissions={() => setCurrentView('mission')} />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F2F2F7]">
        {/* Header (Hidden on Auth and Admin pages) */}
        {activeView !== 'auth' && activeView !== 'admin' && <Header />}
        
        <main className={`max-w-7xl mx-auto ${activeView !== 'auth' && activeView !== 'admin' ? 'pb-28' : ''}`}>
           {renderContent()}
        </main>

        {/* Bottom Nav (Hidden on Auth and Admin pages) */}
        {activeView !== 'auth' && activeView !== 'admin' && (
          <BottomNavigation 
            currentView={activeView} 
            onChange={(view) => {
              setCurrentView(view as View);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}
      </div>
      
      <InstallPWA />
    </>
  );
};

export default App;