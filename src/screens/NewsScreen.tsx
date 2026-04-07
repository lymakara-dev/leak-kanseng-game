import React from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, MessageSquare, Settings, Bookmark, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsScreenProps {
  onWin?: () => void;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ onWin }) => {
  const [isCaught, setIsCaught] = React.useState(false);

  return (
    <main className="md:ml-72 pt-24 pb-24 px-6 min-h-screen kbach-pattern bg-background">
      {/* Intelligence HUD */}
      <section className="mb-8 relative">
        <div className="flex items-end gap-4 mb-2">
          <span className="text-[10px] font-label text-yellow-500/60 tracking-[0.2em] uppercase">Screen 02 — Sitter View (Disguised)</span>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-yellow-500/20 to-transparent"></div>
        </div>
        <h1 className="text-2xl font-bold font-headline text-white mb-1">📰 ព័ត៌មានថ្មី</h1>
        <p className="text-on-surface-variant text-sm">Disguised as a Khmer news reader</p>
      </section>

      {/* Disguised News Reader */}
      <div className="max-w-xl mx-auto">
        <div className="rounded-xl overflow-hidden shadow-2xl border border-yellow-500/10">
          <div className="bg-white p-3 flex items-center gap-3">
            <div className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">RFI</div>
            <div className="text-slate-800 text-xs font-bold flex-1">ព័ត៌មានខ្មែរ · ២០២៦</div>
            <Settings className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="bg-white/90 backdrop-blur-md p-4 space-y-4">
            <div className="flex gap-4 border-b border-slate-200 pb-4">
              <div className="w-16 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex-shrink-0" />
              <div>
                <h3 className="text-slate-900 font-bold text-sm leading-tight">ពិធីបុណ្យចូលឆ្នាំខ្មែរ នៅវត្តភ្នំ ២០២៦ — ចំនួនប្រជាជនច្រើនលើស</h3>
                <p className="text-slate-500 text-[10px] mt-1">ភ្នំពេញ · ១ ម៉ោងមុន</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-16 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0" />
              <div>
                <h3 className="text-slate-900 font-bold text-sm leading-tight">សង្រ្គានត្យ៍វត្តភ្នំ — ពិធីស្រង់ទឹក និង ភ្លេងសម្រស់ប្រពៃណី</h3>
                <p className="text-slate-500 text-[10px] mt-1">ខេត្ត · ២ ម៉ោងមុន</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 bg-white/80 backdrop-blur-md p-3 rounded-xl flex items-center gap-6 border border-white/20">
          <MessageSquare className="w-5 h-5 text-slate-400 cursor-pointer" />
          <Bookmark className="w-5 h-5 text-slate-400 cursor-pointer" />
          <Share2 className="w-5 h-5 text-slate-400 cursor-pointer" />
          
          <button 
            onClick={() => {
              if (navigator.vibrate) {
                navigator.vibrate(300);
              }
              setIsCaught(true);
              if (onWin) onWin();
            }}
            className={cn(
              "ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95",
              isCaught 
                ? "bg-yellow-100 text-yellow-700 border border-yellow-400" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            )}
          >
            <ThumbsUp className={cn("w-4 h-4", isCaught && "fill-current")} />
            <span>{isCaught ? 'ចាប់កន្សែង!' : 'មេដៃ'}</span>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-white/40">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span>WebSocket · រង់ចាំ signal...</span>
        </div>

        <div className="mt-8 p-4 bg-surface-container-high/50 backdrop-blur-md rounded-xl border border-yellow-500/10">
          <div className="text-[10px] text-yellow-500/60 uppercase tracking-widest mb-2">Annotation</div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Full screen mimics news UI. Hidden state overlay. WS fires vibration + animates catch button. Penalty screen → <span className="text-yellow-500">អ្នកចាញ់ហើយ!</span>
          </p>
        </div>
      </div>
    </main>
  );
};
