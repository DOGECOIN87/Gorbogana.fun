import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const TRASH_EMOJIS = ['🗑️', '🚮', '🚬', '🥤', '🍌', '💩', '🦠', '⚠️', '📵', '☢️', '🦴', '🐟', '🥡', '🚽', '🧾', '🗞️', '📦'];

interface TrashRainProps {
  onTrashCountChange?: (count: number) => void;
}

const TrashRain: React.FC<TrashRainProps> = ({ onTrashCountChange }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!sceneRef.current || !canvasRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          World = Matter.World;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    
    // Set initial gravity
    engine.gravity.y = 1;

    // Canvas sizing
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Create boundaries
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 5, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 5, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Initial Trash (Start with a few)
    const stack = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * -500; // Start above screen
      const size = 30 + Math.random() * 20;
      
      const body = Bodies.circle(x, y, size / 2, {
        restitution: 0.5,
        friction: 0.5,
        angle: Math.random() * Math.PI * 2
      });
      
      // Attach emoji data to body for custom rendering
      (body as any).emoji = TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)];
      (body as any).size = size;
      
      stack.push(body);
    }
    Composite.add(engine.world, stack);

    // Continuous Spawning Logic
    const MAX_BODIES = 500; // Limit to prevent crashing
    const spawnInterval = setInterval(() => {
      const allBodies = Composite.allBodies(engine.world);
      const currentCount = allBodies.length - 3; // Subtract walls/ground
      
      if (onTrashCountChange) {
        onTrashCountChange(currentCount);
      }

      // Only spawn if under limit
      if (currentCount < MAX_BODIES) {
        const x = Math.random() * width;
        const y = -60; // Just above view
        const size = 30 + Math.random() * 20;
        
        const body = Bodies.circle(x, y, size / 2, {
          restitution: 0.5,
          friction: 0.5,
          angle: Math.random() * Math.PI * 2
        });
        
        (body as any).emoji = TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)];
        (body as any).size = size;
        
        Composite.add(engine.world, body);
      }
    }, 100); // Spawn every 100ms

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Custom Render Loop (Standard Matter.Render doesn't support text/emojis well)
    let animationFrameId: number;
    const ctx = canvasRef.current.getContext('2d');

    const renderLoop = () => {
      if (!ctx || !canvasRef.current) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Render bodies
      const bodies = Composite.allBodies(engine.world);
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      bodies.forEach((body) => {
        if (body.isStatic) return; // Don't draw walls

        const { x, y } = body.position;
        const angle = body.angle;
        const emoji = (body as any).emoji;
        const size = (body as any).size;

        if (emoji) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.font = `${size}px Arial`;
          ctx.fillStyle = '#ffffff'; // Ensure visible on dark background
          ctx.fillText(emoji, 0, 0);
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Orientation Handler
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { gamma, beta } = event; // gamma: left-right, beta: front-back
      if (gamma === null || beta === null) return;

      // Constrain gravity
      const gravityX = Math.min(Math.max(gamma / 45, -1), 1);
      const gravityY = Math.min(Math.max(beta / 45, -1), 1);

      // Apply gravity directly without sensitivity multiplier
      engine.gravity.x = gravityX;
      engine.gravity.y = Math.abs(gravityY) + 0.5; // Always some downward pull
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Mouse Interaction (Click to add trash)
    const handleClick = (e: MouseEvent) => {
      const size = 30 + Math.random() * 20;
      const body = Bodies.circle(e.clientX, e.clientY, size / 2, {
        restitution: 0.6,
        friction: 0.5
      });
      (body as any).emoji = TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)];
      (body as any).size = size;
      Composite.add(engine.world, body);
    };
    window.addEventListener('mousedown', handleClick);

    // Resize handler
    const handleResize = () => {
        if (!canvasRef.current || !engineRef.current) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(spawnInterval);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [onTrashCountChange]);

  return (
    <div ref={sceneRef} className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default TrashRain;