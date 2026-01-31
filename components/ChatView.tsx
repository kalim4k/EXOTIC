import React from 'react';
import { MessageSquareDashed, Search, PlusSquare } from 'lucide-react';

interface ChatViewProps {
  onDiscover: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onDiscover }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      {/* Top Bar Actions (Like WhatsApp/iOS Messages) */}
      <div className="px-4 py-2 flex items-center justify-between">
        <button className="text-indigo-600 font-medium text-base">Modifier</button>
        <button className="text-indigo-600">
          <PlusSquare size={24} />
        </button>
      </div>

      {/* Title */}
      <div className="px-4 pb-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Discussions</h2>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 pb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-xl leading-5 bg-gray-200/60 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 transition-colors sm:text-sm"
            placeholder="Rechercher"
            disabled
          />
        </div>
      </div>

      {/* Empty State Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-10">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500 delay-150">
          <MessageSquareDashed className="text-gray-300" size={40} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Aucune discussion
        </h3>
        
        <p className="text-gray-500 text-sm max-w-[260px] leading-relaxed mb-8">
          Vos échanges privés avec les modèles apparaîtront ici une fois le contact établi.
        </p>

        <button
          onClick={onDiscover}
          className="text-indigo-600 font-semibold text-sm bg-indigo-50 px-6 py-3 rounded-full hover:bg-indigo-100 transition-colors active:scale-95"
        >
          Découvrir les modèles
        </button>
      </div>
      
      {/* Decorative Divider (simulating end of list) */}
      <div className="w-full border-t border-gray-200/60 mt-auto mb-6"></div>
    </div>
  );
};

export default ChatView;