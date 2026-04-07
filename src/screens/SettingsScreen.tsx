import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Bell, Shield, Eye, Globe, Moon, Sun, ChevronRight, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export const SettingsScreen: React.FC = () => {
  const [soundLevel, setSoundLevel] = React.useState(75);
  const [musicLevel, setMusicLevel] = React.useState(45);
  const [notifications, setNotifications] = React.useState({
    missionUpdates: true,
    agentAlerts: true,
    systemStatus: false,
  });
  const [stealthMode, setStealthMode] = React.useState(true);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="flex-1 relative kbach-pattern bg-background flex flex-col pt-24 pb-24 md:pl-72 min-h-screen overflow-x-hidden">
      <div className="max-w-4xl w-full mx-auto px-6 space-y-12 relative z-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-yellow-500"></span>
            <span className="text-[10px] font-label text-yellow-500 uppercase tracking-[0.3em]">System Config — Settings</span>
          </div>
          <h1 className="text-5xl font-black text-white font-headline leading-none">ការកំណត់</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Audio Settings */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary-container">
              <Volume2 className="w-5 h-5" />
              <h2 className="font-headline text-xl uppercase tracking-wider">សំឡេង</h2>
            </div>
            
            <div className="bg-surface-container-high/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-label text-on-surface-variant uppercase tracking-widest">
                  <span>សំឡេងហ្គេម</span>
                  <span className="text-primary-container">{soundLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={soundLevel}
                  onChange={(e) => setSoundLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-label text-on-surface-variant uppercase tracking-widest">
                  <span>តន្ត្រីបេសកកម្ម</span>
                  <span className="text-primary-container">{musicLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={musicLevel}
                  onChange={(e) => setMusicLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                />
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary-container">
              <Bell className="w-5 h-5" />
              <h2 className="font-headline text-xl uppercase tracking-wider">ការជូនដំណឹង</h2>
            </div>
            
            <div className="bg-surface-container-high/20 backdrop-blur-xl border border-white/5 rounded-2xl p-4 space-y-2">
              {[
                { key: 'missionUpdates', label: 'បច្ចុប្បន្នភាពបេសកកម្ម' },
                { key: 'agentAlerts', label: 'ការជូនដំណឹងពីភ្នាក់ងារ' },
                { key: 'systemStatus', label: 'ស្ថានភាពប្រព័ន្ធ' },
              ].map((item) => (
                <button 
                  key={item.key}
                  onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-on-surface font-body">{item.label}</span>
                  <div className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    notifications[item.key as keyof typeof notifications] ? "bg-primary-container" : "bg-surface-container-highest"
                  )}>
                    <motion.div 
                      animate={{ x: notifications[item.key as keyof typeof notifications] ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Stealth & Privacy */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary-container">
              <Shield className="w-5 h-5" />
              <h2 className="font-headline text-xl uppercase tracking-wider">សុវត្ថិភាព & ឯកជនភាព</h2>
            </div>
            
            <div className="bg-surface-container-high/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-on-surface font-body">របៀបបំបាំងកាយ (Stealth Mode)</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">លាក់ទីតាំងរបស់អ្នកពីភ្នាក់ងារផ្សេងទៀត</p>
                </div>
                <button 
                  onClick={() => setStealthMode(!stealthMode)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    stealthMode ? "bg-primary-container" : "bg-surface-container-highest"
                  )}
                >
                  <motion.div 
                    animate={{ x: stealthMode ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <button className="w-full flex items-center justify-between text-xs font-label text-on-surface-variant hover:text-primary-container transition-colors uppercase tracking-widest">
                  <span>ផ្លាស់ប្តូរលេខកូដភ្នាក់ងារ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between text-xs font-label text-on-surface-variant hover:text-primary-container transition-colors uppercase tracking-widest">
                  <span>លុបទិន្នន័យបេសកកម្ម</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary-container">
              <Eye className="w-5 h-5" />
              <h2 className="font-headline text-xl uppercase tracking-wider">រូបរាង</h2>
            </div>
            
            <div className="bg-surface-container-high/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-primary-container text-on-primary border border-yellow-500 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                  <Moon className="w-6 h-6" />
                  <span className="text-xs font-label uppercase tracking-widest">ងងឹត</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface-container-highest text-on-surface-variant border border-white/5 hover:border-primary-container/30 transition-all">
                  <Sun className="w-6 h-6" />
                  <span className="text-xs font-label uppercase tracking-widest">ភ្លឺ</span>
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-label text-on-surface-variant uppercase tracking-widest">
                  <span>ភាសា (Language)</span>
                  <div className="flex items-center gap-2 text-primary-container">
                    <Globe className="w-4 h-4" />
                    <span>ខ្មែរ</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Save Action */}
        <div className="pt-8 flex justify-end">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-primary-container text-on-primary font-black text-lg rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-all"
          >
            <Save className="w-5 h-5" />
            <span>រក្សាទុកការកំណត់</span>
          </motion.button>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-primary-container/5 blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-1/2 h-screen bg-blue-500/5 blur-[120px] -z-10 pointer-events-none"></div>
    </main>
  );
};
