import React, { useState, useEffect } from 'react';
import GlitchHeader from './components/GlitchHeader';
import RoastConsole from './components/RoastConsole';
import TrashRain from './components/TrashRain';
import Blackboard from './components/Blackboard';
import { generateTrashPhilosophy } from './services/geminiService';
import { ArrowRight, Recycle, Skull } from 'lucide-react';

const REAL_SITE_URL = "https://gorbagana.fun";

const App: React.FC = () => {
  const [haiku, setHaiku] = useState<string>("");
  const [showRealButton, setShowRealButton] = useState(false);
  const [trashCount, setTrashCount] = useState(0);
  const [damageLevel, setDamageLevel] = useState(0);

  useEffect(() => {
    // Load initial philosophy
    generateTrashPhilosophy().then(setHaiku);

    // Delay the real button appearance for dramatic effect
    const timer = setTimeout(() => setShowRealButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Update damage level based on trash count
  useEffect(() => {
    if (trashCount < 100) setDamageLevel(0);
    else if (trashCount < 250) setDamageLevel(1);
    else if (trashCount < 400) setDamageLevel(2);
    else setDamageLevel(3);
  }, [trashCount]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between p-4 md:p-8 bg-neutral-950 text-white selection:bg-green-500 selection:text-black overflow-x-hidden">
      
      {/* Background Layer Group */}
      <div className="fixed inset-0 z-0">
         {/* The 3D Trash Void */}
         <TrashRain onTrashCountChange={setTrashCount} />
         
         {/* CRT Overlay Effect - Applies only to background, sits behind content */}
         <div className="absolute inset-0 crt-overlay z-[5] pointer-events-none"></div>
      </div>

      {/* Main Content - High Z-index to float above scanlines */}
      <main className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-12 mt-10">
        
        {/* The Big Mistake Header */}
        <div className="drop-shadow-2xl">
          <GlitchHeader damageLevel={damageLevel} />
        </div>

        {/* The Philosophical Divider */}
        <div className="text-center max-w-md mx-auto relative group cursor-pointer perspective-500">
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-green-600/50 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           <blockquote className="relative p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm shadow-xl text-gray-300 font-mono text-sm md:text-base leading-relaxed transform transition-transform group-hover:scale-105">
             "{haiku || 'Loading cosmic trash wisdom...'}"
           </blockquote>
        </div>

        {/* The Interactive Roast Machine */}
        <div className="w-full filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          <RoastConsole damageLevel={damageLevel} />
        </div>

        {/* The Blackboard Feature */}
        <div className="w-full filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
          <Blackboard damageLevel={damageLevel} />
        </div>

        {/* The Redemption Section */}
        <div className="mt-12 text-center space-y-6 pb-20 p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 shadow-2xl">
          <p className="text-gray-400 uppercase tracking-[0.2em] text-sm font-bold text-shadow-sm">
            Escape the Digital Landfill
          </p>

          <div className="relative inline-block">
             {!showRealButton ? (
               <div className="h-16 w-64 flex items-center justify-center bg-black/50 border border-white/10 text-gray-400 rounded-lg backdrop-blur-md">
                 <span className="animate-spin mr-2"><Recycle size={16}/></span> COMPACTING TRASH...
               </div>
             ) : (
                <a 
                  href={REAL_SITE_URL}
                  className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-300 bg-green-500 font-glitch rounded-lg hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] hover:-translate-y-1 group overflow-hidden"
                >
                   <span className="absolute inset-0 w-full h-full -mt-1 -ml-1 transition-all duration-200 ease-out bg-purple-600 rounded-lg group-hover:mt-0 group-hover:ml-0 opacity-0 group-hover:opacity-100"></span>
                   <span className="relative flex items-center gap-3 z-10">
                     TAKE ME TO THE REAL SITE
                     <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                   </span>
                </a>
             )}
             
             {/* Fake Button that does nothing but mock */}
             <button 
               onClick={() => alert("NOPE. That's just more garbage.")}
               className="block mt-6 text-xs text-gray-500 hover:text-red-400 hover:underline cursor-help mx-auto transition-colors font-mono"
             >
               Stay here and rot?
             </button>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-6 text-gray-500 z-10 font-mono text-[10px] uppercase tracking-widest border-t border-white/5 bg-black/80 backdrop-blur-md mt-auto">
        <div className="flex justify-center items-center gap-2 mb-2 opacity-50">
           <Skull size={12} />
           <span>EST. 2024 - THE YEAR OF THE TYPO</span>
           <Skull size={12} />
        </div>
        <p className="opacity-40">Gorbogana.fun is not associated with Gorbagana.fun.</p>
      </footer>
    </div>
  );
};

export default App;