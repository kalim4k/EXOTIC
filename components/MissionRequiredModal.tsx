import React from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';

interface MissionRequiredModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const MissionRequiredModal: React.FC<MissionRequiredModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xs sm:max-w-sm rounded-3xl shadow-2xl p-6 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 ring-1 ring-black/5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-5 pt-2">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center ring-8 ring-indigo-50/50">
            <Lock className="text-indigo-600" size={28} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Mission Requise
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed px-2">
              Pour contacter ce modèle, vous devez d'abord valider une mission rapide.
            </p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200/50 active:scale-[0.98]"
          >
            <span>Accéder aux missions</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionRequiredModal;