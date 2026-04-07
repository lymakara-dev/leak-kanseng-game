import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameStatus } from '../types';

interface GameContextType {
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  isHider: boolean;
  setIsHider: (isHider: boolean) => void;
  targetId: string | null;
  setTargetId: (id: string | null) => void;
  startGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('LOBBY');
  const [isHider, setIsHider] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const startGame = () => {
    // In a real game, this would be a server-side assignment
    // For demo: 50% chance to be the hider
    const assignedAsHider = Math.random() > 0.5;
    setIsHider(assignedAsHider);
    setGameStatus('PLAYING');
    console.log(`Mission started. Role: ${assignedAsHider ? 'HIDER' : 'SITTER'}`);
  };

  return (
    <GameContext.Provider value={{ 
      gameStatus, 
      setGameStatus, 
      isHider, 
      setIsHider, 
      targetId, 
      setTargetId,
      startGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
