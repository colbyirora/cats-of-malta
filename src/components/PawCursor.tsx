'use client';

import { useEffect, useState } from 'react';

interface Paw {
  id: number;
  x: number;
  y: number;
  rotation: number;
  isLeft: boolean;
}

export default function PawCursor() {
  const [paws, setPaws] = useState<Paw[]>([]);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [pawId, setPawId] = useState(0);
  const [isLeft, setIsLeft] = useState(true);

  useEffect(() => {
    let throttleTimer: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle to prevent too many paws
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 100); // New paw every 100ms max

      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only create paw if moved enough distance
      if (distance < 30) return;

      // Calculate rotation based on movement direction
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Alternate left/right paw and offset slightly
      const offsetX = isLeft ? -8 : 8;
      const offsetY = isLeft ? -5 : 5;

      const newPaw: Paw = {
        id: pawId,
        x: e.clientX + offsetX,
        y: e.clientY + offsetY,
        rotation: angle + 90 + (isLeft ? -15 : 15),
        isLeft: isLeft,
      };

      setPaws((prev) => [...prev.slice(-10), newPaw]); // Keep max 10 paws
      setPawId((prev) => prev + 1);
      setLastPos({ x: e.clientX, y: e.clientY });
      setIsLeft((prev) => !prev);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastPos, pawId, isLeft]);

  // Remove paws after animation
  useEffect(() => {
    if (paws.length === 0) return;

    const timer = setTimeout(() => {
      setPaws((prev) => prev.slice(1));
    }, 500);

    return () => clearTimeout(timer);
  }, [paws]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="absolute animate-[pawFade_0.5s_ease-out_forwards]"
          style={{
            left: paw.x,
            top: paw.y,
            transform: `translate(-50%, -50%) rotate(${paw.rotation}deg)`,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 100 100"
            fill="var(--terracotta)"
            className="opacity-30"
          >
            {/* Main pad - heart/triangle shape like real cat paw */}
            <path d="M50 95 C20 75 15 55 30 45 Q50 35 70 45 C85 55 80 75 50 95 Z" />
            {/* Four toe beans */}
            <ellipse cx="28" cy="32" rx="12" ry="14" />
            <ellipse cx="50" cy="22" rx="11" ry="13" />
            <ellipse cx="72" cy="32" rx="12" ry="14" />
            {/* Optional fourth small toe */}
            <ellipse cx="50" cy="58" rx="6" ry="7" opacity="0" />
          </svg>
        </div>
      ))}
    </div>
  );
}
