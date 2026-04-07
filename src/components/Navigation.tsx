import React from 'react';
import { LayoutGrid, Newspaper, Radio, User, Shield, Radar, BookOpen } from 'lucide-react';
import { Screen } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { id: 'radar', label: 'សាលរង់ចាំ', icon: LayoutGrid },
    { id: 'news', label: 'បណ្តាញព័ត៌មាន', icon: Newspaper },
    { id: 'rules', label: 'ច្បាប់លេង', icon: BookOpen },
    { id: 'radar_active', label: 'រ៉ាដាអ្នកលាក់', icon: Radio },
    { id: 'settings', label: 'ការកំណត់', icon: Shield },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full z-[60] flex flex-col hidden md:flex w-72 border-r border-yellow-500/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-yellow-500/5">
      <div className="p-8 pb-4">
        <div className="text-2xl font-black text-yellow-500 font-headline mb-8">កន្សែង</div>
        <div className="flex items-center gap-3 p-4 bg-surface-container-high rounded-xl mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-yellow-500/30">
            <img 
              alt="agent" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGqcQAZHDK7sUNCQH8mWF7PWo3X_mpA4kGfrqwQ1kx3ntFm-vH4iNPVzHIvimhstf8GYqfgzSCMMLt0jXIZ46Hytl4_-aVX5grfwT6WjMcl4L9bkYxZzTcFnjx3dxycu2xw2ZuHzIyKiV8eWjwNb3rjcH95zYRXvDkltNdzfRFB1His9hIEdr--y3LJqLy-JZOBaaSjGbU8U8ZaruFLw-xBxEHyZcXkgocJPylzJvVKt-LRyyyk6KsMEjofpugt14LzcLdWF_28Vk"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-500 font-headline">ភ្នាក់ងារ ០០១</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-label">ស្ថានភាព: លាក់កំបាំង</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 transition-all hover:translate-x-1 duration-200 rounded-lg",
              currentScreen === item.id 
                ? "text-yellow-400 bg-yellow-500/10 border-r-2 border-yellow-500" 
                : "text-slate-400 hover:text-yellow-200/70 hover:bg-slate-900/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-headline text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6">
        <button className="w-full bg-primary-container text-on-primary py-3 rounded font-bold font-headline uppercase tracking-wider active:scale-95 transition-transform shadow-lg shadow-primary-container/20">
          ចូលបេសកកម្ម
        </button>
      </div>
    </aside>
  );
};

export const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_15px_rgba(255,215,0,0.1)]">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold tracking-tighter text-yellow-500 uppercase font-headline">ឌីជីថល លេចធ្លាយ កន្សែង</span>
      </div>
      <div className="flex gap-4">
        <button className="text-blue-200/50 hover:text-yellow-200 transition-colors duration-300 active:scale-95">
          <Shield className="w-6 h-6" />
        </button>
        <button className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] hover:text-yellow-200 transition-colors duration-300 active:scale-95">
          <Radar className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 bg-gradient-to-r from-yellow-500/40 via-transparent to-transparent h-[1px] w-2/5"></div>
    </header>
  );
};
