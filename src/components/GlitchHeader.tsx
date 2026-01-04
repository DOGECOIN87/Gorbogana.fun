import React, { useState, useEffect } from 'react';

interface GlitchHeaderProps {
  damageLevel?: number; // 0 to 3
}

const GlitchHeader: React.FC<GlitchHeaderProps> = ({ damageLevel = 0 }) => {
  const [offset1, setOffset1] = useState({ x: 0, y: 0 });
  const [offset2, setOffset2] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setOffset1({
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 5
        });
        setOffset2({
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 5
        });
        
        // Reset quickly
        setTimeout(() => {
          setOffset1({ x: 0, y: 0 });
          setOffset2({ x: 0, y: 0 });
        }, 100);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex justify-center items-center py-4 select-none pointer-events-none">
      {/* Glass Window Container */}
      <div className="relative px-8 py-10 md:px-16 md:py-12 bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] text-center overflow-hidden max-w-[95vw]">
        
        {/* Reflection Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-0"></div>

        {/* Damage Overlay */}
        {damageLevel > 0 && (
          <div className={`glass-crack glass-crack-${damageLevel} animate-pulse`}></div>
        )}

        <h1 className="text-5xl md:text-8xl font-bold font-wet text-white tracking-widest opacity-100 z-10 relative drop-shadow-[0_5px_5px_rgba(0,255,0,0.5)]">
          GORBOGANA
        </h1>
        
        {/* Glitch Layer Red */}
        <h1 
          className="text-5xl md:text-8xl font-bold font-wet text-red-600 tracking-widest absolute top-10 md:top-12 left-0 w-full opacity-60 z-0 mix-blend-color-dodge"
          style={{ transform: `translate(${offset1.x}px, ${offset1.y}px)` }}
        >
          GORBOGANA
        </h1>
        
        {/* Glitch Layer Green */}
        <h1 
          className="text-5xl md:text-8xl font-bold font-wet text-green-600 tracking-widest absolute top-10 md:top-12 left-0 w-full opacity-60 z-0 mix-blend-color-dodge"
          style={{ transform: `translate(${offset2.x}px, ${offset2.y}px)` }}
        >
          GORBOGANA
        </h1>

        <p className="mt-8 text-xl md:text-2xl text-green-400 font-mono relative z-20 flex flex-wrap justify-center items-center gap-2">
          <span className="bg-black/80 px-3 py-1 rounded border border-white/10 shadow-lg">Did you mean:</span> 
          <span className="line-through decoration-red-500 decoration-4 text-gray-500 font-bold opacity-70">Gorbogana</span> 
          <span className="text-purple-400 font-bold animate-pulse drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">Gorbagana?</span>
        </p>
      </div>
    </div>
  );
};

export default GlitchHeader;