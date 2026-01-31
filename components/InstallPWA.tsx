import React, { useState, useEffect } from 'react';
import { Share, X, Download, PlusSquare } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée (Standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      return; // Ne rien afficher si déjà installé
    }

    // Détection iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Vérifier si l'utilisateur a déjà fermé la popup récemment (localStorage)
    const hasClosed = localStorage.getItem('install_prompt_closed');
    // On peut ajouter une expiration ici si on veut réafficher après X jours, 
    // pour l'instant on affiche si pas fermé.
    
    if (!hasClosed) {
      // Petit délai pour ne pas agresser l'utilisateur dès l'arrivée
      const timer = setTimeout(() => {
        // Pour Android/Chrome, on attend que l'event 'beforeinstallprompt' ait eu lieu (géré dans index.html)
        // Pour iOS, on affiche direct après le délai
        if (isIosDevice) {
            setShowPrompt(true);
        } else {
            // Pour Android, on vérifie si l'event est dispo
            if ((window as any).deferredPrompt) {
                setShowPrompt(true);
            } else {
                // Parfois l'event met du temps, on ajoute un listener de secours
                 const checkPrompt = setInterval(() => {
                    if ((window as any).deferredPrompt) {
                        setShowPrompt(true);
                        clearInterval(checkPrompt);
                    }
                 }, 1000);
                 // Stop checking after 10s
                 setTimeout(() => clearInterval(checkPrompt), 10000);
            }
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Sur iOS, on ne peut pas forcer l'install, on affiche juste les instructions
      // Ici, on pourrait ouvrir un modal plus grand, mais le design actuel suffit
    } else {
      // Android / Desktop
      const promptEvent = (window as any).deferredPrompt;
      if (promptEvent) {
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
        }
        (window as any).deferredPrompt = null;
      }
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('install_prompt_closed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom-6 duration-500">
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[28px] p-4 flex items-center gap-4 ring-1 ring-black/5">
        
        {/* Icone App - Style iOS Rounded */}
        <div className="relative shrink-0">
            <img 
                src="https://celinaroom.com/wp-content/uploads/2026/01/ChatGPT-Image-31-janv.-2026-01_00_31.png" 
                alt="App Icon" 
                className="w-14 h-14 rounded-[14px] shadow-sm object-cover"
            />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
                Installer Exotic
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-tight">
                {isIOS ? (
                    <span>
                        Appuyez sur <Share size={12} className="inline mx-0.5 -mt-0.5" /> puis sur <span className="font-semibold text-gray-700">"Sur l'écran d'accueil"</span> <PlusSquare size={12} className="inline mx-0.5 -mt-0.5"/>
                    </span>
                ) : (
                    "Ajoutez l'application pour une meilleure expérience."
                )}
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
            {!isIOS && (
                <button 
                    onClick={handleInstallClick}
                    className="bg-gray-900 text-white p-2 rounded-full hover:bg-black transition-colors shadow-md active:scale-95 flex items-center justify-center"
                >
                    <Download size={18} />
                </button>
            )}
             <button 
                onClick={handleClose}
                className="bg-gray-200 text-gray-500 p-2 rounded-full hover:bg-gray-300 transition-colors active:scale-95 flex items-center justify-center"
            >
                <X size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;