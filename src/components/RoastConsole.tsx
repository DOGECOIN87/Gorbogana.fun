import React, { useState } from 'react';
import { generateRoast } from '../services/geminiService';
import { RoastIntensity } from '../types';
import { Flame, Trash2, Terminal, AlertTriangle, Monitor } from 'lucide-react';

interface RoastConsoleProps {
  damageLevel?: number; // 0-3
}

const RoastConsole: React.FC<RoastConsoleProps> = ({ damageLevel = 0 }) => {
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [burnCount, setBurnCount] = useState(0);

  const handleRoast = async (intensity: RoastIntensity) => {
    setLoading(true);
    setRoast(null);
    const result = await generateRoast(intensity);
    setRoast(result);
    setLoading(false);
    setBurnCount(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-b from-green-500/20 to-transparent rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
      
      {/* Glass Container */}
      <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-2xl overflow-hidden ring-1 ring-white/5">
        
        {/* Damage Overlay */}
        {damageLevel > 0 && (
          <div className={`glass-crack glass-crack-${damageLevel}`}></div>
        )}

        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white/5 border-b border-white/10 px-4 py-2 rounded-t-lg relative z-10">
          <div className="flex items-center gap-2 text-green-400">
            <Terminal size={16} />
            <span className="font-mono text-xs font-bold tracking-widest text-shadow-glow">SYSTEM_MONITOR // ROAST_V1.0</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 border border-red-500/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 border border-yellow-500/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 border border-green-500/30"></div>
          </div>
        </div>

        <div className="p-6 space-y-6 relative z-10">
          {/* Screen Output Area */}
          <div className="relative bg-black/80 rounded border border-white/5 p-6 min-h-[140px] flex items-center justify-center text-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] group/screen">
            {/* Subtle inner grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 font-mono">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="animate-spin text-green-500"><Monitor size={24}/></span>
                  <span className="animate-pulse text-green-400 text-sm tracking-wider">CALCULATING INSULT TRAJECTORY...</span>
                </div>
              ) : roast ? (
                <div className="typing-effect">
                  <p className="text-xl md:text-2xl text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                    "{roast}"
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 italic text-sm">
                  "Status: Waiting for user to accept their fate."
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleRoast(RoastIntensity.MILD)}
              disabled={loading}
              className="group/btn relative px-4 py-3 bg-white/5 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/50 rounded transition-all active:scale-[0.98] overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-500/80 group-hover/btn:text-yellow-400 font-bold uppercase tracking-wider text-sm">
                <Trash2 size={16} />
                <span>Mild Trash</span>
              </div>
            </button>

            <button
              onClick={() => handleRoast(RoastIntensity.SPICY)}
              disabled={loading}
              className="group/btn relative px-4 py-3 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/50 rounded transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2 text-orange-500/80 group-hover/btn:text-orange-400 font-bold uppercase tracking-wider text-sm">
                <Flame size={16} />
                <span>Spicy Burn</span>
              </div>
            </button>

            <button
              onClick={() => handleRoast(RoastIntensity.NUCLEAR)}
              disabled={loading}
              className="group/btn relative px-4 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 rounded transition-all active:scale-[0.98] animate-trash-shake"
            >
              <div className="flex items-center justify-center gap-2 text-red-500/80 group-hover/btn:text-red-400 font-bold uppercase tracking-wider text-sm">
                <AlertTriangle size={16} />
                <span>Nuke Me</span>
              </div>
            </button>
          </div>

          {burnCount > 0 && (
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-white/5 pt-2">
              <span>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              <span>BURNS_LOGGED: {burnCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoastConsole;