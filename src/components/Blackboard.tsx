import React, { useState, useEffect } from 'react';
import { Eraser, PenTool } from 'lucide-react';

const TRASH_EMOJIS = ['🗑️', '🧴', '🧻', '🚬', '🥤', '🍌', '💩', '🦠', '⚠️', '📵', '☢️', '🦴', '🐟', '🥡', '🚽'];

interface BoardTrash {
  id: number;
  emoji: string;
  left: number;
  top: number;
  rotation: number;
}

interface BlackboardProps {
  damageLevel?: number; // 0-3
}

const TrashItem: React.FC<Omit<BoardTrash, 'id'>> = ({ emoji, left, top, rotation }) => {
  const [currentTop, setCurrentTop] = useState(-10);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setCurrentTop(top);
      setOpacity(1);
    });
    return () => cancelAnimationFrame(timer);
  }, [top]);

  return (
    <div 
      className="absolute text-2xl pointer-events-none select-none z-20 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
      style={{
        left: `${left}%`,
        top: `${currentTop}%`,
        transform: `rotate(${rotation}deg)`,
        opacity: opacity,
        transition: 'top 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.27), opacity 0.3s ease-in'
      }}
    >
      {emoji}
    </div>
  );
};

const Blackboard: React.FC<BlackboardProps> = ({ damageLevel = 0 }) => {
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [trashItems, setTrashItems] = useState<BoardTrash[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/chalkboard')
      .then(res => res.json())
      .then(data => setMessage(data.text));
  }, []);

  const handleSave = () => {
    fetch('http://localhost:3001/api/chalkboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
    setIsEditing(false);
  };

  const handleErase = () => {
    if (window.confirm("Are you sure you want to wipe the slate clean?")) {
      setMessage('');
      setTrashItems([]); 
      fetch('http://localhost:3001/api/chalkboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '' }),
      });
      setIsEditing(true);
    }
  };

  const handleDustClick = () => {
    const newTrash: BoardTrash = {
      id: Date.now() + Math.random(),
      emoji: TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)],
      left: Math.random() * 90 + 5, 
      top: Math.random() * 80 + 10,
      rotation: Math.random() * 360
    };
    setTrashItems(prev => [...prev, newTrash]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 perspective-1000 group">
      {/* 3D Transform Container */}
      <div className="relative bg-[#2b3a2b] border-[16px] border-[#5d4037] rounded-sm shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden transform rotate-1 transition-all duration-500 group-hover:rotate-0 group-hover:scale-[1.01] ring-1 ring-white/10">
        
        {/* Frame Highlight - Bevel Effect */}
        <div className="absolute inset-0 border-4 border-[#ffffff10] pointer-events-none z-50 rounded-sm"></div>
        <div className="absolute inset-0 border-[8px] border-[#00000040] pointer-events-none z-40 rounded-sm filter blur-[1px]"></div>

        {/* Chalk dust texture overlay */}
        <div className="absolute inset-0 chalk-dust opacity-40 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/60 pointer-events-none z-0"></div>

        {/* Damage Overlay */}
        {damageLevel > 0 && (
          <div className={`glass-crack glass-crack-${damageLevel} z-[45] opacity-50`}></div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center bg-[#4e342e] p-3 text-[#d7ccc8] font-mono text-xs border-b border-[#3e2723] relative z-30 shadow-md">
          <span className="uppercase tracking-widest font-bold text-white/80 shadow-black drop-shadow-sm">The Wall of Shame</span>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="text-white/70 hover:text-white hover:scale-110 transition-all flex items-center gap-1"
              title="Pick up chalk"
            >
              <PenTool size={14} /> <span className="hidden sm:inline">Write</span>
            </button>
            <button 
              onClick={handleErase} 
              className="text-white/70 hover:text-white hover:scale-110 transition-all flex items-center gap-1"
              title="Wipe board"
            >
              <Eraser size={14} /> <span className="hidden sm:inline">Erase</span>
            </button>
          </div>
        </div>

        {/* Board Content */}
        <div className="p-6 min-h-[220px] flex items-center justify-center relative z-10">
          {/* Render Board Trash */}
          {trashItems.map(item => (
            <TrashItem 
              key={item.id}
              emoji={item.emoji}
              left={item.left}
              top={item.top}
              rotation={item.rotation}
            />
          ))}

          {isEditing ? (
            <div className="w-full h-full relative z-20">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={handleSave}
                placeholder="Leave your mark before you rot..."
                className="w-full h-40 bg-transparent text-white/90 font-chalk text-2xl md:text-3xl resize-none outline-none border-b-2 border-dashed border-white/20 placeholder:text-white/20 relative z-20"
                autoFocus
              />
              <p className="text-right text-xs text-white/40 mt-2 font-mono">Click outside to save</p>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="w-full h-full cursor-text text-center group z-10 py-4"
            >
              {message ? (
                <p className="font-chalk text-2xl md:text-4xl text-white/95 leading-relaxed -rotate-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  {message}
                </p>
              ) : (
                <p className="font-chalk text-xl text-white/20 select-none group-hover:text-white/40 transition-colors">
                  ( The board is empty. Write your last words. )
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Interactive Chalk dust pile at bottom */}
        <div 
          onClick={handleDustClick}
          className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white/10 to-transparent cursor-pointer hover:bg-white/5 transition-colors z-30 flex items-end justify-center"
          title="Kick up some dust"
        >
          <div className="w-3/4 h-2 bg-white/10 rounded-full blur-xl mb-1 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
      
      {/* Chalk Tray Shadow on Wall */}
      <div className="flex justify-center mt-4">
         <div className="w-1/3 h-4 bg-black/50 rounded-[100%] blur-md"></div>
      </div>
    </div>
  );
};

export default Blackboard;