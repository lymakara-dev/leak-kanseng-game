import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'motion/react';
import { Bird, Wifi, Battery, MapPin, Crosshair, Play, RefreshCw, AlertTriangle, Skull, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useGame } from '../context/GameContext';
import socket from '../lib/socket';
import { AVATARS } from '../lib/avatars';

interface PlayerData {
  id: string;
  name: string;
  avatarIndex: number;
  x: number;
  y: number;
  status: string;
}

interface RadarScreenProps {
  playerData?: { name: string; avatarIndex: number } | null;
  onWin?: () => void;
}

export const RadarScreen: React.FC<RadarScreenProps> = ({ playerData, onWin }) => {
  const { gameStatus, setGameStatus, isHider, startGame, targetId, setTargetId } = useGame();
  const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [hoveredPlayerId, setHoveredPlayerId] = React.useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  useEffect(() => {
    socket.on('kanseng_dropped', (data) => {
      console.log('Received kanseng_dropped event:', data);
      setTargetId(data.targetId);
    });

    socket.on('players_update', (updatedPlayers: PlayerData[]) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off('kanseng_dropped');
      socket.off('players_update');
    };
  }, [setTargetId]);

  const handleDrag = (event: any, info: any) => {
    if (!isHider) return;

    let currentHoveredId: string | null = null;
    for (const [id, ref] of Object.entries(playerRefs.current)) {
      if (ref instanceof HTMLDivElement) {
        const rect = ref.getBoundingClientRect();
        if (
          info.point.x >= rect.left &&
          info.point.x <= rect.right &&
          info.point.y >= rect.top &&
          info.point.y <= rect.bottom
        ) {
          currentHoveredId = id;
          break;
        }
      }
    }
    setHoveredPlayerId(currentHoveredId);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (!isHider) return;

    // Check if dropped over a player
    let droppedOnPlayerId: string | null = null;

    for (const [id, ref] of Object.entries(playerRefs.current)) {
      if (ref instanceof HTMLDivElement) {
        const rect = ref.getBoundingClientRect();
        if (
          info.point.x >= rect.left &&
          info.point.x <= rect.right &&
          info.point.y >= rect.top &&
          info.point.y <= rect.bottom
        ) {
          droppedOnPlayerId = id;
          break;
        }
      }
    }

    if (droppedOnPlayerId) {
      setTargetId(droppedOnPlayerId);
      socket.emit('drop_kanseng', { targetId: droppedOnPlayerId });
    }

    setHoveredPlayerId(null);
    // Reset position
    dragX.set(0);
    dragY.set(0);
  };

  const getStatusConfig = () => {
    switch (gameStatus) {
      case 'LOBBY':
        return { label: 'សាលរង់ចាំ', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: RefreshCw };
      case 'PLAYING':
        return { label: 'កំពុងលេង', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: Play };
      case 'REVEAL':
        return { label: 'បង្ហាញខ្លួន', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: AlertTriangle };
      case 'PENALTY':
        return { label: 'ពិន័យ', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: Skull };
      default:
        return { label: 'មិនស្គាល់', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: RefreshCw };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <main className="flex-1 relative kbach-pattern bg-background flex flex-col items-center justify-center pt-20 pb-24 md:pl-72 min-h-screen overflow-hidden">
      {/* Intelligence HUD */}
      <div className="absolute top-24 left-6 md:left-80 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-[1px] bg-yellow-500"></span>
          <span className="text-[10px] font-label text-yellow-500 uppercase tracking-[0.3em]">
            Screen 03 — {isHider ? 'Hider' : 'Sitter'} Radar
          </span>
        </div>
        <div className="flex items-center gap-4">
          {playerData && (
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              {React.createElement(AVATARS[playerData.avatarIndex]?.icon || User, {
                className: "w-6 h-6 text-yellow-500"
              })}
            </div>
          )}
          <h1 className="text-5xl font-black text-white font-headline leading-none">
            {playerData ? playerData.name : (isHider ? 'អ្នកលាក់' : 'អ្នកអង្គុយ')}
          </h1>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500", statusConfig.bg, statusConfig.border)}>
            <StatusIcon className={cn("w-3 h-3 animate-pulse", statusConfig.color)} />
            <span className={cn("text-[10px] font-bold uppercase font-label", statusConfig.color)}>
              {statusConfig.label}
            </span>
          </div>
          <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Sector: PHNOM PENH 01</div>
        </div>
      </div>

      {/* Game Status Controls (For Demo) */}
      <div className="absolute top-24 right-6 z-20 flex flex-col gap-2">
        <div className="text-[8px] font-label text-yellow-500/40 uppercase tracking-widest text-right">Debug Controls</div>
        <div className="flex gap-2">
          {(['LOBBY', 'PLAYING', 'REVEAL', 'PENALTY'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setGameStatus(status)}
              className={cn(
                "px-2 py-1 rounded text-[8px] font-bold transition-all border",
                gameStatus === status 
                  ? "bg-yellow-500 text-black border-yellow-500" 
                  : "bg-surface-container-high/40 text-on-surface-variant border-white/5 hover:border-yellow-500/30"
              )}
            >
              {status}
            </button>
          ))}
          <button
            onClick={startGame}
            className="px-3 py-1 rounded text-[8px] font-black bg-yellow-500 text-black border border-yellow-400 hover:bg-yellow-400 transition-all uppercase"
          >
            Start Mission (Random Role)
          </button>
          <button
            onClick={onWin}
            className="px-3 py-1 rounded text-[8px] font-black bg-green-500 text-black border border-green-400 hover:bg-green-400 transition-all uppercase"
          >
            Trigger Win
          </button>
        </div>
      </div>

      {/* Central Radar UI */}
      <div className="relative flex items-center justify-center w-[340px] h-[340px] md:w-[500px] md:h-[500px]">
        {/* Radar Background Circles */}
        <motion.div 
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full border border-yellow-500/5 flex items-center justify-center"
        >
          <div className="w-3/4 h-3/4 rounded-full border border-yellow-500/10 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-yellow-500/20"></div>
          </div>
        </motion.div>
        
        {/* Radar Scan Line */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-500/10 to-transparent origin-center"
        />

        {/* Central Pulse Effect */}
        <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full radar-pulse pointer-events-none z-10" />
        <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full radar-pulse pointer-events-none z-10" style={{ animationDelay: '1.5s' }} />

        {/* The Center Piece: Kanseng Unit */}
        <motion.div 
          drag={isHider}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={1}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          x={dragX}
          y={dragY}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 60px rgba(255,215,0,0.2)",
              "0 0 100px rgba(255,215,0,0.4)",
              "0 0 60px rgba(255,215,0,0.2)"
            ],
            opacity: 1,
            cursor: isHider ? 'grab' : 'default'
          }}
          whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 100 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-container-highest backdrop-blur-3xl border border-yellow-500/40 flex items-center justify-center overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-transparent"></div>
          <div className="relative flex flex-col items-center">
            {playerData ? (
              <div className="flex flex-col items-center">
                {React.createElement(AVATARS[playerData.avatarIndex]?.icon || User, {
                  className: "w-12 h-12 md:w-16 md:h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                })}
              </div>
            ) : (
              <Bird className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
            )}
            <span className="text-[8px] font-label text-yellow-200 mt-1 tracking-widest uppercase">
              {playerData ? playerData.name : 'KANSENG UNIT'}
            </span>
          </div>
        </motion.div>

        {/* Circular Player Positions */}
        <AnimatePresence>
          {players.filter(p => p.id !== socket.id).map((player, index) => {
            const isTargeted = targetId === player.id;
            const isHovered = hoveredPlayerId === player.id;
            const AvatarIcon = AVATARS[player.avatarIndex]?.icon || User;

            return (
              <motion.div
                key={player.id}
                ref={(el) => (playerRefs.current[player.id] = el)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: isHovered ? 1.2 : 1,
                  zIndex: isHovered ? 50 : 30,
                  x: player.x,
                  y: player.y
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                onClick={() => setTargetId(isTargeted ? null : player.id)}
                className={cn(
                  "absolute flex flex-col items-center gap-1 group cursor-pointer",
                  isTargeted && "targeted",
                  isHovered && "scale-110"
                )}
              >
                <div className="relative">
                  {/* Visual Indicator (Targeting Reticle) */}
                  {(isTargeted || isHovered) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -inset-4 pointer-events-none z-30"
                    >
                      {/* Pulsing Ring */}
                      <motion.div 
                        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className={cn(
                          "absolute inset-0 rounded-full border-2 shadow-[0_0_15px_rgba(255,215,0,0.5)]",
                          isHovered ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "border-yellow-500"
                        )}
                      />
                      {/* Reticle Corners */}
                      <div className={cn("absolute inset-0", isHovered ? "text-green-500" : "text-yellow-500")}>
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className={cn(
                    "w-10 h-10 rounded-full p-0.5 bg-surface-container border border-yellow-500/30 group-hover:scale-110 transition-transform flex items-center justify-center",
                    (isTargeted || isHovered) && "border-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.5)]",
                    isHovered && "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                  )}>
                    <AvatarIcon className={cn(
                      "w-6 h-6 grayscale brightness-75 group-hover:grayscale-0 transition-all text-yellow-500",
                      (isTargeted || isHovered) && "grayscale-0 brightness-100"
                    )} />
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                    player.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                  )} />
                </div>
                <div className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5 shadow-lg">
                  <span className="text-[8px] font-headline font-bold text-white whitespace-nowrap">{player.name}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Decorative Coordinate Lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-yellow-500/10 -z-10"></div>
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-yellow-500/10 -z-10"></div>
      </div>

      {/* Tactical Data Footer */}
      <div className="absolute bottom-28 left-6 md:left-80 right-8 flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-surface-container-low/50 backdrop-blur-md p-3 rounded-lg border border-white/5">
            <div className="p-2 bg-yellow-500/10 rounded">
              <MapPin className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <div className="text-[8px] text-on-surface-variant uppercase font-label">Distance to Unit</div>
              <div className="text-sm font-bold text-white font-headline">១២.៥ ម៉ែត្រ</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-surface-container-low/50 backdrop-blur-md p-3 rounded-lg border border-white/5">
            <div className="p-2 bg-yellow-500/10 rounded">
              <Wifi className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <div className="text-[8px] text-on-surface-variant uppercase font-label">Signal Strength</div>
              <div className="text-sm font-bold text-white font-headline">៩៨% [ស្ថេរ]</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-yellow-500/60">
            <Battery className="w-4 h-4" />
            <span className="text-[10px] font-label uppercase">Battery: 84%</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-500/60">
            <Crosshair className="w-4 h-4" />
            <span className="text-[10px] font-label uppercase">Lock: Active</span>
          </div>
        </div>
      </div>
    </main>
  );
};
