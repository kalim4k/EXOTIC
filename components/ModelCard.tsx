import React from 'react';
import { Model } from '../types';
import { MessageCircle, Tag } from 'lucide-react';

interface ModelCardProps {
  model: Model;
  onContactClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onContactClick }) => {
  return (
    <div className="flex flex-col gap-3 group">
      {/* Photo Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.02] group-active:scale-[0.98]">
        <img
          src={model.imageUrl}
          alt={model.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

        {/* Online Status */}
        {model.isOnline && (
          <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white/30 animate-pulse" />
        )}

        {/* Content on Image */}
        <div className="absolute bottom-0 left-0 w-full p-3 text-white">
          <h3 className="text-lg font-bold tracking-tight leading-none mb-1">
            {model.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/20 backdrop-blur-md w-fit px-2 py-1 rounded-full">
            <span>{model.flag}</span>
            <span className="uppercase tracking-wide opacity-90">{model.country}</span>
          </div>
        </div>
      </div>

      {/* Info Below Image */}
      <div className="px-1 space-y-2">
        {/* Price Badge */}
        <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100/50 shadow-sm">
                <Tag size={12} className="fill-indigo-700" />
                <span className="text-xs font-bold tracking-tight">
                    1 COUP = {model.price.toLocaleString('fr-FR')} FCFA
                </span>
            </div>
        </div>

        {/* Blurred Number */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-gray-100">
           <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-0.5">Mobile</span>
           <div className="relative w-full text-center">
             <span className="block filter blur-[5px] select-none text-gray-800 font-mono text-sm">
                {model.phoneNumber}
             </span>
             {/* Unblur visual trick overlay */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <span className="text-xs text-gray-400 font-bold">**** ** ** **</span>
             </div>
           </div>
        </div>

        {/* Whatsapp Button */}
        <button
          onClick={onContactClick}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] active:bg-[#1faa53] text-white py-2.5 px-4 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 hover:shadow-lg hover:shadow-green-500/20"
        >
          <MessageCircle size={18} fill="currentColor" className="text-white" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default ModelCard;