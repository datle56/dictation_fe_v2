import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocity: {
    x: number;
    y: number;
  };
  rotationSpeed: number;
  size: number;
  shape: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart' | 'diamond';
}

interface ConfettiEffectProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

export default function ConfettiEffect({ isActive, duration = 3000, onComplete }: ConfettiEffectProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8BBD9', '#A8E6CF', '#FFD3A5', '#FD6A9A', '#81C784',
    '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7',
    '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#00B894'
  ];

  useEffect(() => {
    if (!isActive) {
      setConfettiPieces([]);
      return;
    }

    // Create confetti pieces shooting from multiple positions
    const pieces: ConfettiPiece[] = [];
    const pieceCount = 300; // Even more pieces for full coverage
    
    for (let i = 0; i < pieceCount; i++) {
      // Multiple launch positions for better coverage
      const launchPosition = i % 6;
      let startX = 0, startY = 0;
      
      switch (launchPosition) {
        case 0: // Bottom left corner
          startX = -100 + Math.random() * 200;
          startY = window.innerHeight + 100;
          break;
        case 1: // Bottom right corner
          startX = window.innerWidth - 100 + Math.random() * 200;
          startY = window.innerHeight + 100;
          break;
        case 2: // Bottom center
          startX = window.innerWidth / 2 - 100 + Math.random() * 200;
          startY = window.innerHeight + 100;
          break;
        case 3: // Left side middle
          startX = -100 + Math.random() * 150;
          startY = window.innerHeight / 2 + Math.random() * 200;
          break;
        case 4: // Right side middle
          startX = window.innerWidth - 50 + Math.random() * 150;
          startY = window.innerHeight / 2 + Math.random() * 200;
          break;
        case 5: // Bottom spread
          startX = Math.random() * window.innerWidth;
          startY = window.innerHeight + 50 + Math.random() * 100;
          break;
      }
      
      // Calculate velocity to shoot toward center area with variation
      const centerX = window.innerWidth / 2 + (Math.random() - 0.5) * 400;
      const centerY = window.innerHeight / 3 + (Math.random() - 0.5) * 200;
      
      const deltaX = centerX - startX;
      const deltaY = centerY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const speed = 10 + Math.random() * 10; // Speed between 10-20
      const velocityX = (deltaX / distance) * speed;
      const velocityY = (deltaY / distance) * speed;
      
      pieces.push({
        id: i,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: velocityX,
          y: velocityY
        },
        rotationSpeed: (Math.random() - 0.5) * 15, // Faster rotation
        size: 3 + Math.random() * 8, // Varied size between 3-11px
        shape: (['rectangle', 'circle', 'triangle', 'star', 'heart', 'diamond'] as const)[Math.floor(Math.random() * 6)]
      });
    }

    setConfettiPieces(pieces);

    // Animation loop
    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < duration) {
        setConfettiPieces(prevPieces => 
          prevPieces.map(piece => ({
            ...piece,
            x: piece.x + piece.velocity.x,
            y: piece.y + piece.velocity.y,
            rotation: piece.rotation + piece.rotationSpeed,
            velocity: {
              x: piece.velocity.x * 0.995, // Less air resistance for stronger effect
              y: piece.velocity.y + 0.15 // Less gravity for longer flight
            }
          })).filter(piece => 
            piece.y < window.innerHeight + 100 && 
            piece.x > -100 && 
            piece.x < window.innerWidth + 100
          )
        );
        
        animationId = requestAnimationFrame(animate);
      } else {
        setConfettiPieces([]);
        onComplete?.();
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, duration, onComplete]);

  const renderConfettiShape = (piece: ConfettiPiece) => {
    const baseStyle = {
      left: piece.x,
      top: piece.y,
      backgroundColor: piece.color,
      transform: `rotate(${piece.rotation}deg)`,
      width: piece.size,
      height: piece.size,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    switch (piece.shape) {
      case 'circle':
        return (
          <div
            key={piece.id}
            className="absolute opacity-90"
            style={{
              ...baseStyle,
              borderRadius: '50%'
            }}
          />
        );
      
      case 'triangle':
        return (
          <div
            key={piece.id}
            className="absolute opacity-90"
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${piece.size/2}px solid transparent`,
              borderRight: `${piece.size/2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
              borderRadius: 0
            }}
          />
        );
      
      case 'star':
        return (
          <div
            key={piece.id}
            className="absolute opacity-90"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              borderRadius: 0
            }}
          />
        );
      
      case 'heart':
        return (
          <div
            key={piece.id}
            className="absolute opacity-90"
            style={{
              ...baseStyle,
              clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")',
              borderRadius: 0
            }}
          />
        );
      
      case 'diamond':
        return (
          <div
            key={piece.id}
            className="absolute opacity-90"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              borderRadius: 0
            }}
          />
        );
      
      default: // rectangle
        return (
          <div
            key={piece.id}
            className="absolute opacity-90"
            style={{
              ...baseStyle,
              borderRadius: '2px'
            }}
          />
        );
    }
  };

  if (!isActive || confettiPieces.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map(piece => renderConfettiShape(piece))}
    </div>
  );
}
