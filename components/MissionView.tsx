import React, { useState, useRef, useEffect } from 'react';
import { Zap, CheckCircle2, TicketPercent, Lock, ExternalLink } from 'lucide-react';

const AD_LINKS = [
  "https://www.effectivegatecpm.com/hire0aka43?key=a56ce096b69a2233665aec2f9ad229b5",
  "https://www.effectivegatecpm.com/zwmhnn1sy?key=44e918780ddf4ad595c454d289c53a96",
  "https://www.effectivegatecpm.com/sw3sywkqm0?key=9c1e5bf89076f5091c1c1677715a55d2",
  "https://www.effectivegatecpm.com/mubwkz26?key=0604219cd9f1025d2fde4e475f7f38ea",
  "https://www.effectivegatecpm.com/t7bwwufze?key=a6ddcb1a7d4c7d75c656937f3e87c741",
  "https://www.effectivegatecpm.com/t9jb9smf?key=40443693c17abb2135e9b6e3738db2dd",
  "https://www.effectivegatecpm.com/jbk2360sj?key=7fc034a14e94a1e760dfc819dc5eb505",
  "https://www.effectivegatecpm.com/a5g3pzk5?key=13957d2a449284399821dbab142c2ec6",
  "https://www.effectivegatecpm.com/zd6q3225?key=c8d4677f36e39b6fab42a81040613a03",
  "https://www.effectivegatecpm.com/u561dm0rb?key=8ffe49bb9342d0127cd4bf43681ac0b9"
];

const TOTAL_GOAL = 3000;
const DAILY_LIMIT = 300;

const MissionView: React.FC = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [dailyClicks, setDailyClicks] = useState(0);
  const [linkIndex, setLinkIndex] = useState(0);
  
  const [isBouncing, setIsBouncing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Load progress from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('exotic_mission_progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Check if day has changed to reset daily limit
        const today = new Date().toDateString();
        if (parsed.lastDate !== today) {
          setDailyClicks(0);
        } else {
          setDailyClicks(parsed.dailyClicks || 0);
        }
        
        setTotalClicks(parsed.totalClicks || 0);
        setLinkIndex(parsed.linkIndex || 0);
      } catch (e) {
        console.error("Erreur lecture sauvegarde mission:", e);
        // En cas d'erreur de lecture, on reset pour éviter un crash
        localStorage.removeItem('exotic_mission_progress');
      }
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    const data = {
      totalClicks,
      dailyClicks,
      linkIndex,
      lastDate: new Date().toDateString()
    };
    localStorage.setItem('exotic_mission_progress', JSON.stringify(data));
  }, [totalClicks, dailyClicks, linkIndex]);

  const fillLevel = Math.min((totalClicks / TOTAL_GOAL) * 100, 100);
  const isDailyLimitReached = dailyClicks >= DAILY_LIMIT;
  const isCompleted = totalClicks >= TOTAL_GOAL;

  const handleAction = () => {
    if (isCompleted) return;

    if (isDailyLimitReached) {
        alert("🛑 Limite journalière atteinte (300 clics). Revenez demain pour continuer !");
        return;
    }
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
    }

    // Trigger bounce animation
    setIsBouncing(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsBouncing(false), 600);

    // Open Ad Link
    const currentLink = AD_LINKS[linkIndex];
    window.open(currentLink, '_blank');

    // Update State
    setTotalClicks(prev => prev + 1);
    setDailyClicks(prev => prev + 1);
    
    // Rotate Link Index
    setLinkIndex(prev => (prev + 1) % AD_LINKS.length);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-6 py-4 space-y-6 animate-in fade-in duration-500">
        
        {/* Instructions Header */}
        <div className="space-y-2 text-center max-w-xs mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Débloquez l'accès
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Remplissez le bocal pour obtenir un accès <strong>gratuit</strong>.
            </p>
            <div className="flex justify-center gap-4 text-xs font-mono text-gray-500 mt-2">
                <span className={isDailyLimitReached ? "text-red-500 font-bold" : ""}>
                    Aujourd'hui: {dailyClicks}/{DAILY_LIMIT}
                </span>
                <span>
                    Total: {totalClicks}/{TOTAL_GOAL}
                </span>
            </div>
        </div>

        {/* Bottle Container */}
        <div className="relative group cursor-pointer select-none transform scale-90 sm:scale-100 origin-center" onClick={handleAction}>
            {/* Cap/Neck */}
            <div className="w-16 h-12 mx-auto border-4 border-b-0 border-gray-300 bg-white/60 backdrop-blur-md rounded-t-xl relative z-10 translate-y-1 shadow-sm"></div>
            
            {/* Body */}
            <div className="relative w-44 h-72 border-4 border-gray-300 bg-white/10 backdrop-blur-sm rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/50 transform transition-transform duration-100 active:scale-[0.99]">
                
                {/* Highlights/Gloss */}
                <div className="absolute inset-0 z-40 pointer-events-none rounded-[2.8rem] ring-1 ring-inset ring-white/20">
                     <div className="absolute top-6 right-5 w-3 h-24 bg-gradient-to-b from-white/80 to-transparent rounded-full blur-[1px] opacity-80"></div>
                     <div className="absolute top-6 left-4 w-1 h-12 bg-white/60 rounded-full blur-[1px]"></div>
                </div>

                {/* Liquid Container with Physics */}
                <div 
                    className={`absolute bottom-0 w-full transition-all duration-300 ease-out ${isBouncing ? 'animate-liquid-bounce' : ''}`}
                    style={{ height: `${fillLevel}%` }}
                >
                    {/* Only render liquid effects if there is liquid */}
                    {fillLevel > 0 && (
                        <>
                            {/* Waves Container - offset upwards so waves sit on top of height */}
                            <div className="absolute -top-6 left-0 w-full h-8 z-20">
                                
                                {/* Layer 3: Back (Darkest, Slowest, moving right) */}
                                <div className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave-right-slow opacity-40">
                                    <svg className="w-1/2 h-full text-indigo-900 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" transform="scale(1, -1) translate(0, -120)" />
                                    </svg>
                                </div>

                                {/* Layer 2: Middle (Medium, Moving left slowly) */}
                                <div className="absolute bottom-1 left-0 w-[200%] h-full flex animate-wave-left-slow opacity-60">
                                    <svg className="w-1/2 h-full text-indigo-700 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" transform="scale(1, -1) translate(0, -120)" />
                                    </svg>
                                </div>

                                {/* Layer 1: Front (Brightest, Fastest, Moving left) */}
                                <div className="absolute bottom-2 left-0 w-[200%] h-full flex animate-wave-left-fast z-10 animate-swell">
                                    <svg className="w-1/2 h-full text-indigo-500 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" transform="scale(1, -1) translate(0, -120)" />
                                    </svg>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Main Liquid Body with Gradient */}
                    <div className="w-full h-full bg-gradient-to-b from-indigo-500 to-indigo-700 relative overflow-hidden">
                        
                        {/* Internal Bubbles */}
                        {fillLevel > 0 && fillLevel < 100 && (
                            <div className="absolute inset-0 w-full h-full">
                                {[...Array(6)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="absolute bg-white/30 rounded-full animate-bubble backdrop-blur-[1px]"
                                        style={{
                                            width: Math.random() * 10 + 4 + 'px',
                                            height: Math.random() * 10 + 4 + 'px',
                                            left: Math.random() * 100 + '%',
                                            animationDelay: Math.random() * 2 + 's',
                                            animationDuration: Math.random() * 3 + 3 + 's'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Percentage Label */}
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <span 
                        className={`text-4xl font-black tracking-tighter transition-all duration-300 drop-shadow-lg ${fillLevel > 45 ? 'text-white' : 'text-gray-300/80'}`}
                        style={{ textShadow: fillLevel > 45 ? '0 2px 10px rgba(0,0,0,0.2)' : 'none' }}
                    >
                        {Math.floor(fillLevel)}%
                    </span>
                </div>
            </div>
        </div>

        {/* Action Button */}
        <button
            onClick={handleAction}
            disabled={isCompleted || isDailyLimitReached}
            className={`
                w-full max-w-[280px] h-16 rounded-2xl font-bold text-lg tracking-wide shadow-xl transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-3 select-none ring-1 ring-white/20
                ${isCompleted
                    ? 'bg-green-500 text-white shadow-green-200 cursor-default' 
                    : isDailyLimitReached 
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-300 hover:-translate-y-1'
                }
            `}
        >
            {isCompleted ? (
                <>
                    <CheckCircle2 size={24} />
                    <span>Terminé !</span>
                </>
            ) : isDailyLimitReached ? (
                <>
                    <Lock size={20} />
                    <span>Limite atteinte</span>
                </>
            ) : (
                <>
                    <Zap size={24} className="fill-white animate-pulse" />
                    <span>ACTION (CLIC)</span>
                    <ExternalLink size={16} className="opacity-70 ml-1" />
                </>
            )}
        </button>

        {/* Promo Code Card */}
        <div className="w-full max-w-[300px] bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-sm text-center space-y-2.5 mx-auto">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <TicketPercent size={14} />
                <span>Offre Spéciale</span>
            </div>
            
            <div className="text-gray-900 font-medium text-sm">
                Une fois à 100%, utilisez le code <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-bold select-all">EXOTIC2026</span>
            </div>
            
            <p className="text-xs text-gray-500 leading-tight">
                Pour débloquer les numéros gratuitement et avoir une 1ere baise gratuite. Vous payer juste le déplacement après la baise.<br/>
            </p>
        </div>

      </div>
  );
};

export default MissionView;