import React from 'react';
import { LayoutGrid, Target, MessageCircle, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'model', label: 'Models', icon: LayoutGrid },
    { id: 'mission', label: 'Missions', icon: Target },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/85 backdrop-blur-xl border-t border-gray-200/50 z-50 pb-safe">
      {/* We use padding-bottom safe area for iPhone home indicator if supported by CSS, or fallback padding */}
      <div className="flex justify-between items-center px-6 h-16 max-w-md mx-auto w-full md:max-w-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 w-16 ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;