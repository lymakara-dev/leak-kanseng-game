/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar, TopBar } from './components/Navigation';
import { RadarScreen } from './screens/RadarScreen';
import { NewsScreen } from './screens/NewsScreen';
import { JoinScreen } from './screens/JoinScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RulesScreen } from './screens/RulesScreen';
import { WinOverlay } from './components/WinOverlay';
import { Chat } from './components/Chat';
import { Screen } from './types';
import { Home, Rss, Target, Settings, AlertTriangle } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [error, setError] = React.useState<any>(null);
  const [currentScreen, setScreen] = React.useState<Screen>('join');
  const [isJoined, setIsJoined] = React.useState(false);
  const [playerData, setPlayerData] = React.useState<{ name: string; avatarIndex: number } | null>(null);
  const [showWin, setShowWin] = React.useState(false);

  // Global error listener for Firebase/Async errors
  React.useEffect(() => {
    const handleError = (event: PromiseRejectionEvent | ErrorEvent) => {
      const err = 'reason' in event ? event.reason : event.error;
      if (err?.message?.includes('{"error":')) {
        setError(err);
      }
    };
    window.addEventListener('unhandledrejection', handleError);
    window.addEventListener('error', handleError);

    // Listen for game start from server
    const handleGameStart = () => {
      console.log('Game started by server');
      setScreen('radar');
    };
    import('./lib/socket').then(({ default: socket }) => {
      socket.on('game_started', handleGameStart);
    });

    return () => {
      window.removeEventListener('unhandledrejection', handleError);
      window.removeEventListener('error', handleError);
      import('./lib/socket').then(({ default: socket }) => {
        socket.off('game_started', handleGameStart);
      });
    };
  }, []);

  if (error) {
    let errorMessage = "មានបញ្ហាបច្ចេកទេសមួយបានកើតឡើង។";
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error) errorMessage = `បញ្ហា៖ ${parsed.error}`;
    } catch (e) {}

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-headline font-bold text-on-background mb-2">សូមអភ័យទោស!</h2>
        <p className="text-on-surface-variant mb-6 max-w-md">{errorMessage}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-bold hover:scale-105 transition-all"
        >
          ព្យាយាមម្ដងទៀត
        </button>
      </div>
    );
  }
  const handleJoin = (name: string, avatarIndex: number) => {
    if (name.trim()) {
      setPlayerData({ name, avatarIndex });
      setIsJoined(true);
      // Stay on join screen until server broadcasts game_started
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'join':
        return <JoinScreen onJoin={handleJoin} />;
      case 'radar':
        return <RadarScreen playerData={playerData} onWin={() => setShowWin(true)} />;
      case 'news':
        return <NewsScreen onWin={() => setShowWin(true)} />;
      case 'settings':
        return <SettingsScreen />;
      case 'rules':
        return <RulesScreen />;
      default:
        return <RadarScreen playerData={playerData} onWin={() => setShowWin(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <TopBar />
      
      {isJoined && (
        <>
          <Sidebar currentScreen={currentScreen} setScreen={setScreen} />
          <Chat playerData={playerData} />
        </>
      )}

      <WinOverlay isVisible={showWin} onClose={() => setShowWin(false)} />

      <div className={cn("transition-all duration-500", !isJoined && "md:pl-0")}>
        {renderScreen()}
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-[#001C30]/90 backdrop-blur-md border-t border-yellow-500/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setScreen('radar')}
          className={cn(
            "flex flex-col items-center justify-center px-4 py-1.5 transition-all",
            currentScreen === 'radar' ? "bg-yellow-500/20 text-yellow-400 rounded-xl animate-pulse" : "text-blue-200/40"
          )}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold font-headline">សាល</span>
        </button>
        <button 
          onClick={() => setScreen('news')}
          className={cn(
            "flex flex-col items-center justify-center px-4 py-1.5 transition-all",
            currentScreen === 'news' ? "bg-yellow-500/20 text-yellow-400 rounded-xl animate-pulse" : "text-blue-200/40"
          )}
        >
          <Rss className="w-6 h-6" />
          <span className="text-[10px] font-bold font-headline">ព័ត៌មាន</span>
        </button>
        <button className="flex flex-col items-center justify-center text-blue-200/40 px-4 py-1.5 hover:text-yellow-300 transition-all">
          <Target className="w-6 h-6" />
          <span className="text-[10px] font-bold font-headline">រ៉ាដា</span>
        </button>
        <button 
          onClick={() => setScreen('settings')}
          className={cn(
            "flex flex-col items-center justify-center px-4 py-1.5 transition-all",
            currentScreen === 'settings' ? "bg-yellow-500/20 text-yellow-400 rounded-xl animate-pulse" : "text-blue-200/40"
          )}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold font-headline">កំណត់</span>
        </button>
      </nav>
    </div>
  );
}
