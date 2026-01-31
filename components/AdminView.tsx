import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Model } from '../types';
import { AFRICAN_COUNTRIES, getFlag } from '../data';
import { Plus, X, Upload, Save, Trash2, Edit2, Loader2, Image as ImageIcon, Database, AlertCircle } from 'lucide-react';

interface AdminViewProps {
  onBack: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModel, setCurrentModel] = useState<Partial<Model>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Rafraichir la session pour s'assurer que les droits admin sont actifs
    supabase.auth.refreshSession();
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('models').select('*').order('id', { ascending: false });
      
      if (error) {
        throw error;
      }

      if (data) {
         const formatted: Model[] = data.map((d: any) => ({
           id: d.id.toString(), 
           name: d.name, 
           country: d.country, 
           flag: d.flag, 
           imageUrl: d.image_url, 
           phoneNumber: d.phone_number, 
           isOnline: d.is_online, 
           price: d.price
         }));
         setModels(formatted);
      }
    } catch (e: any) {
      console.error("Fetch error:", e);
      alert("Erreur de chargement: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce modèle ?")) return;
    
    try {
      const { error } = await supabase.from('models').delete().eq('id', parseInt(id));
      if (error) throw error;
      // Optimistic update
      setModels(models.filter(m => m.id !== id));
    } catch (error: any) {
      alert("Erreur suppression: " + error.message);
    }
  };

  const handleEdit = (model: Model) => {
    setCurrentModel(model);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentModel({ isOnline: true, price: 5000, country: "Cameroun" });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Limite de taille simple (ex: 5MB)
      if (file.size > 5 * 1024 * 1024) {
          alert("L'image est trop volumineuse (Max 5MB)");
          return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée. Reconnectez-vous.");

      let imageUrl = currentModel.imageUrl;

      // 1. Upload Image
      if (imageFile) {
        // Sanitize filename: remove accents, spaces, special chars
        const fileExt = imageFile.name.split('.').pop();
        const safeName = imageFile.name
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever accents
            .replace(/[^a-zA-Z0-9]/g, "_"); // Remplacer le reste par _
            
        const fileName = `${Date.now()}_${safeName}.${fileExt}`;
        
        // Upload avec upsert false pour éviter d'écraser par erreur
        const { error: uploadError } = await supabase.storage
          .from('model-images')
          .upload(fileName, imageFile, { upsert: false });

        if (uploadError) {
             console.error("Storage Error:", uploadError);
             throw new Error("Erreur Upload Image: " + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('model-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      if (!imageUrl) imageUrl = "https://picsum.photos/400/600";

      const flag = getFlag(currentModel.country || "");
      const safePrice = currentModel.price ? Number(currentModel.price) : 0;
      
      const modelData = {
        name: currentModel.name,
        country: currentModel.country,
        flag: flag,
        image_url: imageUrl,
        phone_number: currentModel.phoneNumber,
        price: safePrice,
        is_online: currentModel.isOnline || false
      };

      if (currentModel.id) {
        // UPDATE
        const { error } = await supabase
            .from('models')
            .update(modelData)
            .eq('id', parseInt(currentModel.id));
            
        if (error) throw error;
      } else {
        // CREATE
        const { error } = await supabase.from('models').insert([modelData]);
        if (error) throw error;
      }

      setIsEditing(false);
      await fetchModels();

    } catch (error: any) {
      console.error("Save Error:", error);
      alert("Erreur lors de la sauvegarde :\n" + (error.message || "Erreur inconnue"));
    } finally {
      setUploading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 bg-white border-b px-4 h-16 flex items-center justify-between z-10">
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X size={24} />
          </button>
          <h2 className="font-bold text-lg">{currentModel.id ? 'Modifier' : 'Nouveau Modèle'}</h2>
          <div className="w-10"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
          
          {/* Image Upload Area */}
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-56 bg-gray-100 rounded-2xl overflow-hidden relative cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all group shadow-sm"
            >
              {(imageFile || currentModel.imageUrl) ? (
                <img 
                  src={imageFile ? URL.createObjectURL(imageFile) : currentModel.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Preview"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={40} className="mb-2" />
                  <span className="text-xs font-medium">Ajouter une photo</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="text-white" size={24} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              className="hidden" 
              accept="image/*"
            />
            {imageFile && (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    Nouvelle image sélectionnée
                </span>
            )}
          </div>

          <div className="space-y-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nom du modèle</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium"
                value={currentModel.name || ''}
                onChange={e => setCurrentModel({...currentModel, name: e.target.value})}
                placeholder="Ex: Trixi"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pays</label>
                  <select 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                    value={currentModel.country || ''}
                    onChange={e => setCurrentModel({...currentModel, country: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{getFlag(c)} {c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Prix (FCFA)</label>
                  <input 
                    type="number"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono"
                    value={currentModel.price || ''}
                    onChange={e => {
                        const val = e.target.value;
                        setCurrentModel({...currentModel, price: val === '' ? undefined : parseInt(val)});
                    }}
                  />
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Téléphone / Whatsapp</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={currentModel.phoneNumber || ''}
                onChange={e => setCurrentModel({...currentModel, phoneNumber: e.target.value})}
                placeholder="+225 ..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-medium text-gray-900">En ligne (Visible)</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={currentModel.isOnline || false}
                    onChange={e => setCurrentModel({...currentModel, isOnline: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            <span>{currentModel.id ? 'Enregistrer les modifications' : 'Créer le modèle'}</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-in fade-in">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-indigo-600 font-medium">Retour</button>
        <h1 className="font-bold text-lg">Administration</h1>
        <button onClick={handleAddNew} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow-sm transition-transform active:scale-95">
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4 grid gap-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : models.length > 0 ? (
            models.map(model => (
            <div key={model.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-18 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
                    <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
                    {model.isOnline && <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>}
                </div>
                <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate text-base">{model.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    {model.flag} {model.country}
                </p>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">{model.price.toLocaleString()} FCFA</p>
                </div>
                <div className="flex gap-2">
                <button onClick={() => handleEdit(model)} className="p-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                    <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(model.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                    <Trash2 size={18} />
                </button>
                </div>
            </div>
            ))
        ) : (
          <div className="text-center text-gray-400 mt-20 flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Database size={24} className="opacity-40" />
            </div>
            <p>Aucun modèle dans la base de données.</p>
            <p className="text-xs text-gray-400 max-w-xs">
                Si vous avez exécuté le script SQL, rafraichissez la page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;