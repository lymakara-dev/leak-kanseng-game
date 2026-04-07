import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Code, Cpu, Zap, Info, CheckCircle2, Terminal } from 'lucide-react';

export const RulesScreen: React.FC = () => {
  const rulesData = {
    project: "Leak Kanseng Digital (លាក់កន្សែង ឌីជីថល)",
    version: "2026.4.Sangkran",
    meta: {
      dev_stack: "Next.js 14 (Frontend), NestJS (Backend), Socket.io (Real-time), Tailwind (UI)",
      primary_font: "Kantumruy Pro",
      cultural_theme: "Angel Mohothareak Tevy (Monday Angel - Blue/Gold)"
    },
    game_rules_kh: {
      title: "ច្បាប់លេងលម្អិត (Detailed Rules)",
      setup: "អ្នកលេងចាប់ពី ៤-១០ នាក់អង្គុយជាវង់។ ម្នាក់ធ្វើជា 'អ្នកលាក់' ដើរជុំវិញវង់មូល។",
      vibration_logic: "ពេលអ្នកលាក់ចុច 'ទម្លាក់' លើនរណាម្នាក់ ទូរស័ព្ទអ្នកនោះនឹងញ័រ ៣ ដងខ្លីៗ (100ms)។",
      stealth_window: "អ្នកអង្គុយមានពេល ១០ វិនាទី ដើម្បីចុចប៊ូតុង 'ចាប់កន្សែង' ដែលលាក់ក្នុងមាតិកាព័ត៌មាន។",
      outcome_a: "បើចាប់បាន៖ អ្នកលាក់ត្រូវរាំ ឬច្រៀងតាមការកំណត់ (Penalty)។",
      outcome_b: "បើចាប់មិនបាន៖ អ្នកអង្គុយត្រូវរាំ ឬច្រៀង ហើយក្លាយជាអ្នកលាក់បន្ទាប់។"
    },
    tasks: [
      "1. បង្កើត NestJS Gateway សម្រាប់គ្រប់គ្រង Room State និង Timer ១០ វិនាទី។",
      "2. បង្កើត Next.js Page ដែលមានប្តូរ Role រវាង Hider និង Sitter ដោយស្វ័យប្រវត្តិ។",
      "3. សរសេរ Function បញ្ជាការញ័រ (Vibration API) ឱ្យដើរលើ Android Chrome និង iOS Safari (ក្រោយ User Interaction)។",
      "4. រៀបចំ UI ជាភាសាខ្មែរទាំងស្រុង ដោយប្រើ Kantumruy Pro font និងពណ៌ខៀវមាស។"
    ]
  };

  return (
    <main className="flex-1 relative kbach-pattern bg-background flex flex-col pt-24 pb-24 md:pl-72 min-h-screen overflow-x-hidden">
      <div className="max-w-5xl w-full mx-auto px-6 space-y-12 relative z-10">
        {/* Dossier Header */}
        <header className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-12 h-[1px] bg-blue-500"></span>
            <span className="text-[10px] font-label text-blue-400 uppercase tracking-[0.4em]">Mission Dossier — Protocol 2026</span>
          </div>
          <h1 className="text-6xl font-black text-white font-headline leading-tight">
            {rulesData.project}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="px-3 py-1 bg-blue-500/20 rounded border border-blue-500/30 text-[10px] font-label text-blue-400 uppercase tracking-widest">
              Version {rulesData.version}
            </div>
            <div className="px-3 py-1 bg-yellow-500/20 rounded border border-yellow-500/30 text-[10px] font-label text-yellow-500 uppercase tracking-widest">
              Theme: {rulesData.meta.cultural_theme}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Game Rules */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-surface-container-high/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24 text-blue-500" />
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-white font-headline uppercase tracking-tight">
                  {rulesData.game_rules_kh.title}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <p className="text-on-surface font-body leading-relaxed">{rulesData.game_rules_kh.setup}</p>
                </div>
                
                <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-label uppercase tracking-widest">
                    <Zap className="w-4 h-4" />
                    <span>Vibration Logic</span>
                  </div>
                  <p className="text-on-surface-variant font-body italic text-sm">
                    {rulesData.game_rules_kh.vibration_logic}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-yellow-500 shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                  <p className="text-on-surface font-body leading-relaxed">{rulesData.game_rules_kh.stealth_window}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                    <div className="text-[10px] font-label text-green-400 uppercase tracking-widest mb-2">Outcome A</div>
                    <p className="text-xs text-on-surface-variant font-body">{rulesData.game_rules_kh.outcome_a}</p>
                  </div>
                  <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                    <div className="text-[10px] font-label text-red-400 uppercase tracking-widest mb-2">Outcome B</div>
                    <p className="text-xs text-on-surface-variant font-body">{rulesData.game_rules_kh.outcome_b}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Tasks */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-black text-white font-headline uppercase tracking-wider">Technical Roadmap</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rulesData.tasks.map((task, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -4 }}
                    className="p-5 bg-surface-container-high/40 border border-white/5 rounded-2xl flex gap-4 items-start"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-on-surface-variant font-body leading-snug">{task}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Tech Stack & Meta */}
          <div className="space-y-8">
            <section className="bg-blue-900/20 border border-blue-500/20 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Cpu className="w-5 h-5" />
                <h3 className="font-headline font-bold uppercase tracking-widest">System Architecture</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-label text-blue-400/60 uppercase tracking-widest mb-1">Dev Stack</div>
                  <p className="text-sm text-on-surface font-mono leading-relaxed">{rulesData.meta.dev_stack}</p>
                </div>
                <div className="pt-4 border-t border-blue-500/10">
                  <div className="text-[10px] font-label text-blue-400/60 uppercase tracking-widest mb-1">Primary Font</div>
                  <p className="text-lg text-white font-headline">{rulesData.meta.primary_font}</p>
                </div>
              </div>
            </section>

            <section className="bg-yellow-900/10 border border-yellow-500/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-yellow-500">
                <Code className="w-5 h-5" />
                <h3 className="font-headline font-bold uppercase tracking-widest">Socket Events</h3>
              </div>
              <div className="space-y-2">
                <div className="text-[9px] font-label text-yellow-500/40 uppercase tracking-widest">Emitting</div>
                <div className="flex flex-wrap gap-2">
                  {["join_room", "start_game", "drop_kanseng", "catch_attempt"].map(ev => (
                    <span key={ev} className="px-2 py-1 bg-yellow-500/5 border border-yellow-500/10 rounded text-[9px] font-mono text-yellow-500/70">{ev}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="text-[9px] font-label text-yellow-500/40 uppercase tracking-widest">Listening</div>
                <div className="flex flex-wrap gap-2">
                  {["room_updated", "receive_vibration", "game_over"].map(ev => (
                    <span key={ev} className="px-2 py-1 bg-blue-500/5 border border-blue-500/10 rounded text-[9px] font-mono text-blue-400/70">{ev}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Cultural Note */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-yellow-600/10 border border-white/5">
              <p className="text-[10px] font-label text-on-surface-variant/60 uppercase tracking-[0.2em] leading-relaxed">
                Inspired by the traditional Khmer game "Leak Kanseng", reimagined for the 2026 Sangkran Digital Era.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Dossier Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-yellow-600/10 blur-[120px] rounded-full"></div>
      </div>
    </main>
  );
};
