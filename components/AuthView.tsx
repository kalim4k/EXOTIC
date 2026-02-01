import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Sparkles, ChevronRight, Lock, Mail, User, Globe, ChevronDown, ArrowLeft, X } from 'lucide-react';
import { AFRICAN_COUNTRIES, getFlag } from '../data';

interface AuthViewProps {
    onBack?: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup for new users coming from landing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific states
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // --- SIGNUP ---
        
        // Basic validation
        if (!username || !country) {
            throw new Error("Veuillez remplir tous les champs (Pseudo et Pays).");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
              country: country,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Si l'inscription a réussi mais qu'il n'y a pas de session, c'est que la confirmation email est requise
        if (data.user && !data.session) {
            try {
                await supabase.from('profiles').insert([
                    { 
                        id: data.user.id, 
                        username: username,
                        country: country
                    }
                ]);
            } catch (err) {
                console.log("Profil creation deferred or failed due to RLS, will be handled on trigger or first login");
            }

            setPendingVerification(true);
            setLoading(false);
            return;
        }

        // Cas fallback si l'email confirm est désactivé
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id, 
                        username: username,
                        country: country
                    }
                ]);
            
            if (profileError && profileError.code === '23505') {
                 throw new Error("Ce pseudo est déjà utilisé.");
            }
        }
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      if (!pendingVerification) {
          setLoading(false);
      }
    }
  };

  // VUE : En attente de vérification Email
  if (pendingVerification) {
    return (
        <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center px-6 relative overflow-hidden">
             {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-300 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
            
            <div className="w-full max-w-sm z-10 animate-in fade-in zoom-in-95 duration-500 text-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 p-8 flex flex-col items-center gap-6">
                    
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-2 ring-8 ring-indigo-50/50">
                        <Mail className="text-indigo-600" size={36} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Vérifiez vos emails</h2>
                        <p className="text-sm text-gray-500 leading-relaxed px-2">
                            Un lien de confirmation a été envoyé à <span className="font-semibold text-gray-800">{email}</span>.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 w-full">
                        <p className="text-xs text-yellow-700 font-medium flex items-start gap-2 text-left">
                            <span className="text-lg">⚠️</span>
                            Si vous ne le trouvez pas, vérifiez votre dossier <strong>Spam</strong> ou <strong>Indésirables</strong>.
                        </p>
                    </div>

                    <button 
                        onClick={() => {
                            setPendingVerification(false);
                            setIsLogin(true); // Retour au login
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-2xl hover:bg-gray-200 transition-colors active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        <span>Retour à la connexion</span>
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // VUE : Login / Signup Classique
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-300 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-300 rounded-full blur-[80px] opacity-40 animate-pulse delay-1000"></div>

      <div className="w-full max-w-sm z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="relative text-center mb-8 space-y-2">
          {onBack && (
              <button 
                onClick={onBack}
                className="absolute left-0 top-0 p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                  <ArrowLeft size={24} />
              </button>
          )}

          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-2">
            <Sparkles className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Exotic<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? "Ravi de vous revoir" : "Rejoignez l'élite"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8">
          
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Signup Specific Fields */}
            {!isLogin && (
              <>
                {/* Username (Pseudo) */}
                <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-300">
                    <label className="text-xs font-semibold text-gray-500 ml-3 uppercase tracking-wider">Pseudo</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required={!isLogin}
                            className="block w-full pl-10 pr-3 py-3.5 bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium"
                            placeholder="ExoticKing"
                        />
                    </div>
                </div>

                {/* Country (Dropdown) */}
                <div className="space-y-1 animate-in slide-in-from-right-4 fade-in duration-300 delay-75">
                    <label className="text-xs font-semibold text-gray-500 ml-3 uppercase tracking-wider">Pays</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                            <Globe size={18} />
                        </div>
                        
                        <div className="relative">
                          <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              required={!isLogin}
                              className="block w-full pl-10 pr-10 py-3.5 bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                          >
                              <option value="" disabled>Sélectionnez votre pays</option>
                              {AFRICAN_COUNTRIES.map((c) => (
                                <option key={c} value={c}>{getFlag(c)} {c}</option>
                              ))}
                          </select>
                          
                          {/* Custom Dropdown Arrow */}
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                             <ChevronDown size={18} />
                          </div>
                        </div>
                    </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-3 uppercase tracking-wider">Email</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3.5 bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium"
                    placeholder="exemple@email.com"
                  />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 ml-3 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-3.5 bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200/50 transform transition-all active:scale-[0.98] hover:shadow-indigo-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{isLogin ? 'Se connecter' : "S'inscrire gratuitement"}</span>
                  <ChevronRight size={16} className="opacity-80" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Toggle Mode */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          </p>
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
            }}
            className="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {isLogin ? "Créer un compte maintenant" : "Connectez-vous ici"}
          </button>
        </div>

      </div>
      
      {/* Footer Legal */}
      <div className="absolute bottom-6 text-center w-full px-6">
        <p className="text-[10px] text-gray-400">
          En continuant, vous acceptez nos CGU et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
};

export default AuthView;