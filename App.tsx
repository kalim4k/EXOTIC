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
import LandingPage from './components/LandingPage';
import { supabase } from './supabaseClient';
import { UserProfile } from './types';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

type View = 'landing' | 'auth' | 'models' | 'mission' | 'chat' | 'profile' | 'admin';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  // Default to landing page if no session
  const [currentView, setCurrentView] = useState<View>('landing');

  // Manage Auth Session and Fetch Profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
          fetchProfile(session.user.id);
          // If logged in, go to models directly
          setCurrentView('models');
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
        setCurrentView('models');
      } else {
        setUserProfile(null);
        setLoading(false);
        // Do not force 'landing' here to allow AuthView to handle email verification steps if needed,
        // but typically logout brings you back to landing or auth.
        setCurrentView('landing'); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Gestion du Script Publicitaire (Popunder)
  // Ne se charge que si l'utilisateur est connecté (donc pas sur la Landing Page)
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    if (session) {
      script = document.createElement('script');
      script.src = "https://pl28615385.effectivegatecpm.com/69/a2/12/69a21253bf7c0bb8243b615443445dc2.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Nettoyage si l'utilisateur se déconnecte
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [session]);

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

  // Determine actual view to render logic
  const renderContent = () => {
    // If not logged in, we only allow Landing or Auth
    if (!session) {
        if (currentView === 'auth') {
            return <AuthView onBack={() => setCurrentView('landing')} />;
        }
        return <LandingPage onStart={() => setCurrentView('auth')} />;
    }

    // Logged in views
    switch (currentView) {
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

  const isPublicPage = !session && (currentView === 'landing' || currentView === 'auth');
  const hideChrome = isPublicPage || currentView === 'admin';

  return (
    <>
      <div className="min-h-screen bg-[#F2F2F7]">
        {/* Header (Hidden on Public pages and Admin) */}
        {!hideChrome && <Header />}
        
        <main className={`max-w-7xl mx-auto ${!hideChrome ? 'pb-28' : ''}`}>
           {renderContent()}
        </main>

        {/* Bottom Nav (Hidden on Public pages and Admin) */}
        {!hideChrome && (
          <BottomNavigation 
            currentView={currentView} 
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