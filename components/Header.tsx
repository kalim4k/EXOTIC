import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full ios-blur border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Exotic<span className="text-indigo-600">.</span>
        </h1>
        
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          <Search size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;