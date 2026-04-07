import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Castle, Flower2, User } from 'lucide-react';
import { PLAYERS } from '../constants';
import socket from '../lib/socket';
import { AVATARS } from '../lib/avatars';
import { cn } from '../lib/utils';

interface JoinScreenProps {
  onJoin: (name: string, avatarIndex: number) => void;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin }) => {
  const [name, setName] = React.useState('');
  const [selectedAvatar, setSelectedAvatar] = React.useState(4); // Default to Rabbit/Horse
  const [isFocused, setIsFocused] = React.useState(false);
  const [playerCount, setPlayerCount] = useState(PLAYERS.length); // Initial value from constants
  const [lobbyPlayers, setLobbyPlayers] = useState<{ name: string; avatarIndex: number; isMock?: boolean }[]>([]);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    socket.on('player_count_update', (data: { count: number }) => {
      console.log('Player count updated:', data.count);
      setPlayerCount(data.count);
    });

    socket.on('players_update', (players: { name: string; avatarIndex: number; isMock?: boolean }[]) => {
      console.log('Lobby players updated:', players);
      setLobbyPlayers(players);
    });

    return () => {
      socket.off('player_count_update');
      socket.off('players_update');
    };
  }, []);

  const handleJoinClick = () => {
    if (name.trim()) {
      socket.emit('join_lobby', { name, avatarIndex: selectedAvatar });
      onJoin(name, selectedAvatar);
      setHasJoined(true);
    }
  };

  const handleStartGame = () => {
    console.log('Emitting start_game');
    socket.emit('start_game');
  };

  const SelectedIcon = AVATARS[selectedAvatar]?.icon || User;
  const realPlayers = lobbyPlayers.filter(p => !p.isMock);
  const canStartGame = realPlayers.length >= 2;

  return (
    <main className="md:pl-72 pt-24 pb-20 min-h-screen flex flex-col items-center justify-center px-4 relative radial-stealth">
      <div className="fixed inset-0 kbach-pattern pointer-events-none opacity-20"></div>
      
      {/* Festive Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-12 relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent p-6 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Castle className="w-32 h-32 text-yellow-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/40 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Flower2 className="w-10 h-10 text-yellow-500" />
            </motion.div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-yellow-500 font-headline mb-1 tracking-tight">
              រីករាយពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ
            </h2>
            <p className="text-yellow-500/70 font-body text-sm md:text-base max-w-xl">
              សូមស្វាគមន៍មកកាន់បេសកកម្ម <span className="text-yellow-400 font-bold">"លាក់កន្សែងឌីជីថល"</span>។ សូមឱ្យឆ្នាំថ្មីនេះ នាំមកនូវសិរីសួស្ដី ជ័យមង្គល និងភាពជោគជ័យគ្រប់ភារកិច្ច!
            </p>
          </div>
          <div className="ml-auto hidden xl:block">
            <div className="text-[10px] font-label text-yellow-500/40 uppercase tracking-[0.4em] vertical-text">
              SANGKRAN 2026
            </div>
          </div>
        </div>
        
        {/* Animated Sparkles */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
        />
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Intelligence HUD */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-yellow-500/80 to-transparent h-1 w-24 mb-4"></div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary font-headline tracking-tighter leading-none mb-2">
              បេសកកម្ម<br/><span className="text-primary-container drop-shadow-glow">ឌីជីថល</span>
            </h1>
            <p className="text-on-surface-variant font-body text-lg max-w-md">
              រៀបចំខ្លួនសម្រាប់ហ្គេមបំបាំងកាយ។ ជ្រើសរើសអត្តសញ្ញាណរបស់អ្នក ហើយចូលរួមក្នុងសាលរង់ចាំ។
            </p>
          </motion.div>
          <div className="space-y-6">
            {!hasJoined ? (
              <>
                <div className="group relative w-full max-w-sm">
                  <motion.label 
                    animate={{ 
                      color: isFocused || name ? '#EAB308' : '#EAB30880',
                      x: isFocused || name ? 0 : 4
                    }}
                    className="block text-xs font-label uppercase tracking-widest mb-2 ml-1"
                  >
                    លេខកូដភ្នាក់ងារ
                  </motion.label>
                  <motion.div 
                    animate={{ 
                      scale: isFocused ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative"
                  >
                    <input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full bg-surface-container-low/30 border-0 border-b-2 border-outline-variant/30 text-on-surface py-4 px-2 focus:ring-0 transition-all placeholder:text-blue-200/20 font-headline text-xl outline-none relative z-10" 
                      placeholder="បញ្ចូលឈ្មោះរបស់អ្នក..." 
                      type="text"
                    />
                    {/* Animated Underline */}
                    <motion.div 
                      animate={{ 
                        scaleX: isFocused ? 1 : 0,
                        backgroundColor: isFocused ? '#EAB308' : '#EAB30840'
                      }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 origin-left z-20 shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    {/* Focus Glow Background */}
                    <motion.div 
                      animate={{ 
                        opacity: isFocused ? 1 : 0,
                        boxShadow: isFocused ? '0 0 30px rgba(234, 179, 8, 0.1)' : '0 0 0px rgba(234, 179, 8, 0)'
                      }}
                      className="absolute inset-0 bg-primary-container/5 blur-xl -z-10"
                    />
                  </motion.div>
                </div>

                {/* Selection Preview */}
                <AnimatePresence mode="wait">
                  {(name || selectedAvatar !== null) && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 w-fit"
                    >
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/40">
                        <SelectedIcon className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-label text-yellow-500/60 uppercase tracking-widest">ភ្នាក់ងារដែលបានជ្រើសរើស</div>
                        <div className="text-xl font-headline font-black text-white">
                          {name || 'មិនទាន់មានឈ្មោះ'}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 backdrop-blur-md max-w-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/40">
                    <SelectedIcon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-label text-yellow-500/60 uppercase tracking-widest">ភ្នាក់ងាររួចរាល់</div>
                    <div className="text-xl font-headline font-black text-white">{name}</div>
                  </div>
                </div>
                <div className="text-xs font-body text-yellow-500/70 mb-4">
                  សូមរង់ចាំភ្នាក់ងារផ្សេងទៀតចូលរួម។ ហ្គេមអាចចាប់ផ្ដើមបាននៅពេលមានភ្នាក់ងារយ៉ាងតិច ២ នាក់។
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", realPlayers.length >= 2 ? "bg-green-500 animate-pulse" : "bg-red-500")}></div>
                  <span className="text-[10px] font-label uppercase tracking-widest text-yellow-500/60">
                    {realPlayers.length >= 2 ? 'រួចរាល់សម្រាប់បេសកកម្ម' : `ត្រូវការភ្នាក់ងារ ${2 - realPlayers.length} នាក់ទៀត`}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Start Action */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {!hasJoined ? (
              <motion.button 
                onClick={handleJoinClick}
                initial={false}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-primary-container text-on-primary font-black text-xl rounded overflow-hidden transition-all w-full sm:w-auto"
              >
                <span className="relative z-10">ចូលរួមលេង</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                
                {/* Pulsing Glow Background */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                    boxShadow: [
                      "0 0 20px rgba(255,215,0,0.3)",
                      "0 0 40px rgba(255,215,0,0.6)",
                      "0 0 20px rgba(255,215,0,0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-yellow-500/10 -z-10"
                />
              </motion.button>
            ) : (
              <motion.button 
                onClick={handleStartGame}
                disabled={!canStartGame}
                initial={false}
                whileHover={canStartGame ? { 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                } : {}}
                whileTap={canStartGame ? { 
                  scale: 0.95,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                } : {}}
                className={cn(
                  "group relative inline-flex items-center justify-center px-10 py-5 font-black text-xl rounded overflow-hidden transition-all w-full sm:w-auto",
                  canStartGame 
                    ? "bg-yellow-500 text-black shadow-[0_0_30px_rgba(255,215,0,0.4)]" 
                    : "bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed grayscale"
                )}
              >
                <span className="relative z-10">ចាប់ផ្ដើមបេសកកម្ម</span>
                {canStartGame && (
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
                
                {/* Pulsing Glow Background */}
                {canStartGame && (
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                      boxShadow: [
                        "0 0 20px rgba(255,215,0,0.3)",
                        "0 0 40px rgba(255,215,0,0.6)",
                        "0 0 20px rgba(255,215,0,0.3)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-yellow-500/10 -z-10"
                  />
                )}
              </motion.button>
            )}

            {/* Tactical Player Count HUD */}
            <div className="flex flex-col gap-1 border-l-2 border-yellow-500/20 pl-6 py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-label text-yellow-500/60 uppercase tracking-widest">Lobby Status</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-headline leading-none">{playerCount}</span>
                <span className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest">ភ្នាក់ងារ</span>
              </div>
              <div className="text-[9px] font-label text-on-surface-variant/40 uppercase tracking-tighter">កំពុងរង់ចាំបេសកកម្ម</div>
            </div>
          </div>

          {/* Lobby Player List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-yellow-500/30"></span>
              <span className="text-[10px] font-label text-yellow-500/40 uppercase tracking-widest">ភ្នាក់ងារក្នុងសាលរង់ចាំ</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {realPlayers.map((player, idx) => {
                  const AvatarIcon = AVATARS[player.avatarIndex]?.icon || User;
                  return (
                    <motion.div
                      key={`${player.name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      className="flex items-center gap-2 bg-surface-container-high/40 backdrop-blur-md border border-white/5 px-3 py-2 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                        <AvatarIcon className="w-3 h-3 text-yellow-500" />
                      </div>
                      <span className="text-xs font-headline font-bold text-on-surface">{player.name}</span>
                    </motion.div>
                  );
                })}
                {realPlayers.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-label text-on-surface-variant/30 uppercase italic"
                  >
                    មិនទាន់មានភ្នាក់ងារចូលរួមនៅឡើយទេ...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Avatar Selection Grid */}
        <div className="relative">
          <div className="absolute -inset-10 bg-primary-container/5 blur-[100px] rounded-full"></div>
          <div className="grid grid-cols-3 gap-4 p-8 bg-surface-container-high/20 backdrop-blur-3xl rounded-xl border border-white/5 relative z-10">
            {AVATARS.map((avatar, i) => (
              <motion.div 
                key={i}
                layout
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAvatar(i)}
                className={`aspect-square rounded flex items-center justify-center group cursor-pointer transition-all relative ${
                  selectedAvatar === i
                    ? 'bg-primary-container text-on-primary border border-yellow-500 shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105 z-20' 
                    : 'bg-surface-container-highest border border-white/5 text-slate-400 hover:bg-yellow-500/20 hover:text-yellow-500'
                }`}
              >
                {selectedAvatar === i && (
                  <motion.div 
                    layoutId="active-glow"
                    className="absolute inset-0 bg-yellow-500/20 blur-md -z-10"
                  />
                )}
                <avatar.icon className="w-10 h-10" />
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[8px] font-label text-yellow-500 uppercase">
                  {avatar.label}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Decorative UI Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-primary-container/30 pointer-events-none"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary-container/30 pointer-events-none"></div>
        </div>
      </div>

      {/* Background Decoration Image */}
      <div className="fixed top-0 right-0 w-1/3 h-screen opacity-10 pointer-events-none mix-blend-overlay">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDirUhFyecMrGUZMxm1Kc-KFzPhqpwUDgq3TortTpYRZjnn5ik6_Mk7xm-p8WIY8Wycx9Ws0j-oy7aUlwWSD9LqM1z5ToXgctVyfxVP_B8nNweXR0kp2DmsccmBtlHn8j7bQ10N0wl6Bz258fqMXmnlVupBbVTyFrcuEmuTjdUYRHG6ymsoU_GCiVCZIVS_58gYMCM4k8FUpZWE5C3ws7-ggOVcJ12HHwr-cfyGVpEi_G3UzlHue_6fl4csbr01um_hFRE6R0yvT4g"
        />
      </div>
    </main>
  );
};
