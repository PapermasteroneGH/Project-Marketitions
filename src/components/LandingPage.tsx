import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Tv, 
  TrendingUp, 
  MapPin, 
  Volume2, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Timer, 
  Smartphone, 
  Award,
  ChevronRight,
  Heart,
  MessageSquare,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { PRESETS } from '../Presets';
import { BrandVibe } from '../types';

interface LandingPageProps {
  onStartBlank: () => void;
  onLoadPreset: (preset: typeof PRESETS[0]) => void;
  isBrainrotActive: boolean;
  isNeoThemeActive: boolean;
  onToggleEasterEgg: () => void;
}

export function LandingPage({ 
  onStartBlank, 
  onLoadPreset, 
  isBrainrotActive, 
  isNeoThemeActive, 
  onToggleEasterEgg 
}: LandingPageProps) {
  const [selectedPreviewPresetIndex, setSelectedPreviewPresetIndex] = useState(0);
  const [badgeClickCount, setBadgeClickCount] = useState(0);
  const previewPreset = PRESETS[selectedPreviewPresetIndex];

  // Custom mock FAQ questions adapted smoothly for standard and brainrot modes
  const getFaqs = () => {
    if (isBrainrotActive) {
      return [
        {
          q: "Why is Marketicians high-key more based than chatGPT?",
          a: "Standard writing bots produce major mid, boomer essays. Marketicians is built specifically for the math of short-form scroll statistics. It drops fire contiguous timecodes, precise phone angles, and hyper-local rizz hooks (such as West Village coffee tours) to make sure you do not get shadowbanned, on god."
        },
        {
          q: "Do I need a fancy cringe professional camera rig?",
          a: "No cap, absolutely not. The visual plans we cook up are made for regular smartphones, detailing high-key hand pan seeds, zoom ratios, and stupid-simple styling hacks you can map inside CapCut in 2 seconds."
        },
        {
          q: "How does the hyper-local GPS hook actually rip?",
          a: "The viral algorithm is heavily geolocated. By embedding recognizable local landmarks (like Austin's Congress bats or London's Underground stations), your video immediately targets regional For You Pages and hacks search-node distribution, period."
        }
      ];
    }
    return [
      {
        q: "What makes Marketicians different from general writing assistants?",
        a: "General writing tools output generic articles. Marketicians is custom-engineered specifically for the math of short-form algorithms (TikTok, Reels, Shorts). It outputs contiguous second-by-second timelines, precise camera angles, pacing guides, custom emotional vibes (like Gen-Z irony or sleek high-value pitches), and hyper-local geographical hooks."
      },
      {
        q: "Do I need fancy professional camera gear?",
        a: "Absolutely not. The physical visual cues generated are specifically tailored for standard smartphones, detailing practical hand pan speeds, focal zoom ratios, lighting adaptations, and easy edits you can execute on standard apps like CapCut."
      },
      {
        q: "How does the hyper-local trend engine work?",
        a: "Short-form algorithms rely heavily on geographic metadata. By embedding physical regional landmarks (such as the South Congress bridge in Austin or West Village brownstone stoops in NYC), the video immediately appeals to local viewer behaviors and targets location-specific search nodes."
      }
    ];
  };

  const currentFaqs = getFaqs();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBadgeClick = () => {
    setBadgeClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        onToggleEasterEgg();
        return 0;
      }
      return next;
    });
  };

  return (
    <div className={`w-full min-h-screen font-sans relative overflow-hidden transition-all duration-500 ease-in-out ${
      isNeoThemeActive 
        ? 'bg-stone-950 text-[#00ff22] selection:bg-[#00ff22] selection:text-black font-mono border-x-4 border-[#00ff22]' 
        : 'bg-[#fdfcf6] text-black selection:bg-[#ffcc00]'
    }`}>
      
      {/* Decorative Neo-Brutalist Floating Badges */}
      <button 
        onClick={handleBadgeClick}
        className={`absolute top-10 -left-12 rotate-[-6deg] hidden lg:block border-2 border-black py-1.5 px-4 rounded-xl shadow-[3px_3px_0px_#000] font-mono text-[10px] font-black tracking-wider uppercase z-10 transition-transform select-none cursor-default ${
          isNeoThemeActive ? 'bg-stone-900 border-[#00ff22] text-[#00ff22] shadow-[3px_3px_0px_#00ff22]' : 'bg-[#ffcc00] text-black'
        }`}
      >
        🛰️ {isBrainrotActive ? "RIZZ METRICS: ACTIVE" : "ALGORITHMIC AUDIENCE RETENTION ENGAGED"}
      </button>
      <div className={`absolute top-36 -right-12 rotate-[8deg] hidden xl:block border-2 border-black py-1.5 px-4 rounded-xl shadow-[3px_3px_0px_#000] font-mono text-[10px] font-black tracking-wider uppercase z-10 ${
        isNeoThemeActive ? 'bg-[#00ff22] text-black border-[#00ff22]' : 'bg-[#8b5cf6] text-white'
      }`}>
        🎯 {isBrainrotActive ? "DOUBLED VIEWS OR COAL ON GOD" : "TIKTOK, REELS & SHORTS ALIGNMENT"}
      </div>

      {/* --- HERO HEADER AREA --- */}
      <section className="relative max-w-7xl mx-auto px-4 pt-12 pb-16 text-center space-y-6">
        
        {/* Release Tag */}
        <div className={`inline-flex items-center space-x-2 border-2 border-black px-3.5 py-1.5 rounded-full shadow-[2.5px_2.5px_0px_#000] text-xs font-mono font-black uppercase text-black hover:-translate-y-0.5 transition-transform ${
          isNeoThemeActive ? 'bg-black text-[#00ff22] border-[#00ff22] shadow-[2.5px_2.5px_0px_#00ff22]' : 'bg-white'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
          <span>{isBrainrotActive ? "SKIBIDI CO-PILOT v2.9 RIJZ" : "PRODUCTION CO-PILOT v1.4 LIVE"}</span>
        </div>

        {/* Big Neo-Brutalist Heading with Brainrot/Sleek Alternate Layouts */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tight leading-[0.95] max-w-5xl mx-auto">
          {isBrainrotActive ? (
            <>
              Rizz Up Your Audience <br className="hidden md:inline" />
              <span className={`px-3 py-1 inline-block -rotate-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] mt-1.5 hover:rotate-1 transition-transform cursor-pointer select-none ${
                isNeoThemeActive ? 'bg-[#00ff22] text-black border-[#00ff22] shadow-[4px_4px_0px_transparent]' : 'bg-[#ff5c00] text-white'
              }`}>
                Skibidi Storyboards
              </span>
              <br className="inline" />
              No Cap.
            </>
          ) : (
            <>
              Draft High-Retention <br className="hidden md:inline" />
              <span className={`px-3 py-1 inline-block -rotate-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] mt-1.5 hover:rotate-1 transition-transform cursor-pointer select-none ${
                isNeoThemeActive ? 'bg-[#00ff22] text-black border-[#00ff22] shadow-[4px_4px_0px_transparent]' : 'bg-[#ff5c00] text-white'
              }`}>
                Short-Form Storyboards
              </span>
              <br className="inline" />
              In Seconds.
            </>
          )}
        </h1>

        <p className={`text-sm md:text-base font-semibold max-w-2xl mx-auto leading-relaxed ${
          isNeoThemeActive ? 'text-[#00ff22]/80' : 'text-slate-800'
        }`}>
          {isBrainrotActive 
            ? "Your mid business pitches are cooked, bestie. Marketicians cooks up fire smartphone camera details, customized narrator rizzer scripts, and trending sigma local concepts mapped to lock down their views, on god."
            : "Unpolished brand pitches in, viral video chronologies out. Marketicians maps precise smartphone camera cuts, custom-vibe scripts, and hyper-local trends crafted to stop the scroll."
          }
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartBlank}
            className={`w-full sm:w-auto font-sans font-black text-sm tracking-wider uppercase px-8 py-4 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] hover:shadow-[7px_7px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_#s] cursor-pointer flex items-center justify-center space-x-2 ${
              isNeoThemeActive 
                ? 'bg-[#00ff22] text-black border-[#00ff22] shadow-[5px_5px_0px_#00ff22] hover:bg-[#39ff5a]' 
                : 'bg-[#ff5c00] text-white hover:bg-[#e05200]'
            }`}
          >
            <span>{isBrainrotActive ? "Start Cooking Fire" : "Start Blank Canvas"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
          
          <a
            href="#presets-accelerator"
            className={`w-full sm:w-auto font-sans font-black text-sm tracking-widest uppercase px-8 py-4 rounded-xl border-2 border-black shadow-[5px_5px_0px_#000] hover:shadow-[7px_7px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_#000] cursor-pointer text-center ${
              isNeoThemeActive ? 'bg-black text-[#00ff22] border-[#00ff22]' : 'bg-white text-black hover:bg-slate-50'
            }`}
          >
            {isBrainrotActive ? "Peep the Sigmas ↓" : "Explore Seed Profiles ↓"}
          </a>
        </div>

        {/* Real-world trust counters styled appropriately */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
          <div className={`border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_#000] text-center ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[3px_3px_0px_#00ff22]' : 'bg-white'
          }`}>
            <p className="text-2xl md:text-3xl font-black">15,400+</p>
            <p className={`text-[10px] uppercase font-mono font-black mt-1 ${isNeoThemeActive ? 'text-[#00ff22]/60' : 'text-slate-600'}`}>
              {isBrainrotActive ? "W Videos Cooked" : "Videos Converted"}
            </p>
          </div>
          <div className={`border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_#000] text-center ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[3px_3px_0px_#00ff22]' : 'bg-white'
          }`}>
            <p className="text-2xl md:text-3xl font-black text-[#8b5cf6]">98.4%</p>
            <p className={`text-[10px] uppercase font-mono font-black mt-1 ${isNeoThemeActive ? 'text-[#00ff22]/60' : 'text-slate-600'}`}>
              {isBrainrotActive ? "Total Brain Rizz" : "Average Retention Score"}
            </p>
          </div>
          <div className={`border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_#000] text-center ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[3px_3px_0px_#00ff22]' : 'bg-white'
          }`}>
            <p className="text-2xl md:text-3xl font-black text-[#00d1ff]">100%</p>
            <p className={`text-[10px] uppercase font-mono font-black mt-1 ${isNeoThemeActive ? 'text-[#00ff22]/60' : 'text-slate-600'}`}>
              {isBrainrotActive ? "No Server Cap" : "Serverless & Portable"}
            </p>
          </div>
          <div className={`border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_#000] text-center ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[3px_3px_0px_#00ff22]' : 'bg-white'
          }`}>
            <p className="text-2xl md:text-3xl font-black text-[#ff5c00]">7 Cities</p>
            <p className={`text-[10px] uppercase font-mono font-black mt-1 ${isNeoThemeActive ? 'text-[#00ff22]/60' : 'text-slate-600'}`}>
              {isBrainrotActive ? "Sigma GPS Hubs" : "Local GPS Trend Radars"}
            </p>
          </div>
        </div>
      </section>

      {/* --- PLATFORM LOGO MARQUEE / COMPATIBILITY TICKER --- */}
      <div className={`border-y-4 border-black py-4 overflow-hidden relative select-none ${isNeoThemeActive ? 'bg-stone-900 border-[#00ff22]' : 'bg-white'}`}>
        <div className="flex justify-around items-center gap-6 max-w-7xl mx-auto flex-wrap px-4">
          <span className="text-xs font-mono font-black tracking-widest flex items-center space-x-1.5">
            <span className="px-2 py-0.5 bg-[#000] text-white rounded border border-black font-extrabold uppercase">TikTok</span>
            <span className={isNeoThemeActive ? 'text-stone-500' : 'text-slate-400'}>{isBrainrotActive ? "BASED FEED HOOK" : "9:16 FEED ALIGN"}</span>
          </span>
          <span className="text-xs font-mono font-black tracking-widest flex items-center space-x-1.5">
            <span className="px-2 py-0.5 bg-[#e01e5a] text-white rounded border border-black font-extrabold pb-1 uppercase">Reels</span>
            <span className={isNeoThemeActive ? 'text-stone-500' : 'text-slate-400'}>{isBrainrotActive ? "GYATT RETENTION" : "AUDIENCE RETENTION VIBE"}</span>
          </span>
          <span className="text-xs font-mono font-black tracking-widest flex items-center space-x-1.5">
            <span className="px-2 py-0.5 bg-[#ff0000] text-white rounded border border-black font-extrabold uppercase">Shorts</span>
            <span className={isNeoThemeActive ? 'text-stone-500' : 'text-slate-400'}>{isBrainrotActive ? "SPAM REPEAT LOOPS" : "RAPID ENGAGEMENT LOOPS"}</span>
          </span>
        </div>
      </div>

      {/* --- CORE METHODOLOGY: WHAT WE OPTIMIZE FOR --- */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className={`text-xs font-mono font-black uppercase tracking-widest inline-block px-3.5 py-1 rounded-full border border-black ${
            isNeoThemeActive ? 'bg-stone-900 text-[#00ff22] border-[#00ff22]' : 'text-[#ff5c00] bg-[#ffcc00]/20'
          }`}>
            {isBrainrotActive ? "The Science of Rizzing Feeders" : "The Science of Scroll Stopping"}
          </h2>
          <h3 className="text-2xl md:text-4xl font-sans font-black uppercase">
            {isBrainrotActive ? "How We Hijack Scrolling Brains" : "The Blueprint Behind Viral Mechanics"}
          </h3>
          <p className={`text-xs md:text-sm font-semibold leading-relaxed ${isNeoThemeActive ? 'text-[#00ff22]/70' : 'text-slate-700'}`}>
            {isBrainrotActive 
              ? "TikTok scrollers suffer major ADHD brain damage. Boring screenwriters design for cinematic feelings; Marketicians designs exclusively to hook eyeballs instantly on god."
              : "Short-form algorithms operate on dynamic statistics. Traditional screenwriters optimize for drama; Marketicians optimizes strictly for absolute retention curves."
            }
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Chronological Blocking */}
          <div className={`border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 ${
            isNeoThemeActive ? 'bg-black text-[#00ff22] border-[#00ff22] shadow-[4px_4px_0px_#00ff22]' : 'bg-white'
          }`}>
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center ${isNeoThemeActive ? 'bg-[#00ff22]/10 border-[#00ff22]' : 'bg-[#00d1ff]/10'}`}>
                <Timer className="w-6 h-6 text-[#009bbf]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-sans font-black uppercase">{isBrainrotActive ? "Contiguous Brainrot Blocks" : "Contiguous Chronologies"}</h4>
                <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/80' : 'text-slate-700'}`}>
                  {isBrainrotActive 
                    ? "Absolute zero delays. Every single scene drops in under 3 seconds to keep feed-scrollers completely mesmerized or locked onto your hook."
                    : "Zero gaps. Every scene maps down to the exact millisecond block to ensure consistent fast pacing. Keeps viewers locked on the hook."
                  }
                </p>
              </div>
            </div>
            <div className="text-[10px] uppercase font-mono font-black mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span>{isBrainrotActive ? "RIZZ SCORE RATIO" : "ALGORITHM HOOK SCORE"}</span>
              <span className={`font-extrabold px-2 py-0.5 rounded border border-black ${isNeoThemeActive ? 'bg-[#00ff22] text-black border-[#00ff22]' : 'bg-[#00d1ff]'}`}>CRAZY HIGH</span>
            </div>
          </div>

          {/* Card 2: Cinematic Camera Framing */}
          <div className={`border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 ${
            isNeoThemeActive ? 'bg-black text-[#00ff22] border-[#00ff22] shadow-[4px_4px_0px_#00ff22]' : 'bg-white'
          }`}>
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center ${isNeoThemeActive ? 'bg-[#00ff22]/10 border-[#00ff22]' : 'bg-[#ffcc00]/15'}`}>
                <Smartphone className="w-6 h-6 text-[#cc9c00]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-sans font-black uppercase">{isBrainrotActive ? "Sigma Camera Angles" : "Smartphone Lens Angles"}</h4>
                <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/80' : 'text-slate-700'}`}>
                  {isBrainrotActive 
                    ? "We generate practical phone lens directions: rapid hand tilts, macro botanical transitions, lighting flares, and smooth speed ramps."
                    : "Specify physical actions. No fancy stabilization required. We output instructions for hand pans, close-up details, lighting variations, and CapCut speed adjustments."
                  }
                </p>
              </div>
            </div>
            <div className="text-[10px] uppercase font-mono font-black mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span>{isBrainrotActive ? "EDIT COMPLEXITY" : "Smart Shoots Support"}</span>
              <span className={`font-extrabold bg-[#ffcc00] px-2 py-0.5 rounded border border-black text-black`}>{isBrainrotActive ? "BRAIN-FREE" : "EASY MANUAL"}</span>
            </div>
          </div>

          {/* Card 3: Localized Trend Infusion */}
          <div className={`border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 ${
            isNeoThemeActive ? 'bg-black text-[#00ff22] border-[#00ff22] shadow-[4px_4px_0px_#00ff22]' : 'bg-white'
          }`}>
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center ${isNeoThemeActive ? 'bg-[#00ff22]/10 border-[#00ff22]' : 'bg-[#8b5cf6]/10'}`}>
                <MapPin className="w-6 h-6 text-[#7c3aed]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-sans font-black uppercase">{isBrainrotActive ? "GPS Slang Infiltrator" : "Hyperlocal GPS Infusion"}</h4>
                <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/80' : 'text-slate-700'}`}>
                  {isBrainrotActive 
                    ? "Tap into local neighborhood aesthetics. Injects recognizable regional landmarks to lock regional viewers into watching and clicking."
                    : "Tap into neighborhood sub-cultures. Injects recognized physical regional landmarks and style codes into the visual workflow to hack regional distribution."
                  }
                </p>
              </div>
            </div>
            <div className="text-[10px] uppercase font-mono font-black mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span>{isBrainrotActive ? "GPS SENSORS" : "ALGORITHMIC RADAR"}</span>
              <span className={`font-extrabold bg-[#8b5cf6] px-2 py-0.5 rounded border border-black text-white`}>{isBrainrotActive ? "OVERPOWERED" : "ACTIVE"}</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- PRESETS ACCELERATOR & DISCOVERABILITY SHUFFLE --- */}
      <section id="presets-accelerator" className={`border-y-4 border-black py-16 px-4 transition-colors ${
        isNeoThemeActive ? 'bg-stone-900/60 border-[#00ff22]' : 'bg-[#8b5cf6]/10'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Presets Sidebar explaining what's happening (4 columns) */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <span className={`text-[10px] font-mono font-black tracking-widest border-2 border-black px-2.5 py-1 rounded-md uppercase ${
              isNeoThemeActive ? 'bg-black text-[#00ff22] border-[#00ff22]' : 'bg-white text-[#8b5cf6]'
            }`}>
              {isBrainrotActive ? "BRAINROT SEEDS" : "SEEDED ACCELERATOR"}
            </span>
            <h3 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tight">
              {isBrainrotActive ? "Select a Sigma File and Let It Cook" : "Pick a Seed Profile & Blast Into the Editor"}
            </h3>
            <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/80' : 'text-slate-700'}`}>
              {isBrainrotActive 
                ? "Skip type-maxing. Select one of our built-in curated profile templates formatted with pre-calculated rizz settings. Fire templates ready!" 
                : "Skip typing. Select one of our built-in curated profiles configured across different niches and geographic nodes. High-conversion scripts and local elements are already mapped!"
              }
            </p>

            {/* Flat selector buttons list */}
            <div className="flex flex-col gap-2 pt-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPreviewPresetIndex(idx)}
                  className={`text-left p-3 rounded-xl border-2 border-black font-semibold text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedPreviewPresetIndex === idx 
                      ? 'bg-[#ffcc00] text-black shadow-[2px_2px_0px_#000] scale-[1.02]' 
                      : (isNeoThemeActive ? 'bg-black hover:bg-stone-800 text-[#00ff22] border-[#00ff22]' : 'bg-white hover:bg-slate-50 text-slate-800')
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-400 font-extrabold">0{idx+1}</span>
                    <span className="font-bold">{preset.name.split(" ").slice(1).join(" ")}</span>
                  </div>
                  <span className={`text-[9px] border border-black px-1.5 py-0.5 rounded font-mono font-bold capitalize ${
                    isNeoThemeActive ? 'bg-stone-900 border-[#00ff22]' : 'bg-slate-100 text-slate-600'
                  }`}>{preset.brandVibe}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox Visualizer Displaying Selected Preset (8 columns) */}
          <div className={`border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#000] relative lg:col-span-8 ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[8px_8px_0px_#00ff22]' : 'bg-white'
          }`}>
            <span className="absolute top-4 right-6 text-[10px] font-mono font-black text-slate-400 uppercase">
              {isBrainrotActive ? "RIZZ CONTROL CENTER" : "LAUNCH CONTROL UNIT"}
            </span>

            <div className="space-y-6">
              <div className="flex items-center space-x-3.5">
                <div className={`p-3.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] ${isNeoThemeActive ? 'bg-black border-[#00ff22] text-[#00ff22]' : 'bg-[#ffcc00]'}`}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-sans font-black uppercase">{previewPreset.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className={`text-[9px] font-mono font-black border px-2 py-0.5 rounded ${isNeoThemeActive ? 'bg-stone-900 border-[#00ff22]' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
                      {previewPreset.category}
                    </span>
                    <span className={`text-[9px] font-mono font-black border px-2 py-0.5 rounded ${isNeoThemeActive ? 'bg-stone-900 border-[#00ff22]' : 'bg-emerald-50 text-emerald-800 border-emerald-300'}`}>
                      GPS: {previewPreset.location}
                    </span>
                    <span className={`text-[9px] font-mono font-black border px-2 py-0.5 rounded ${isNeoThemeActive ? 'bg-stone-900 border-[#00ff22]' : 'bg-purple-50 text-purple-800 border-purple-300'}`}>
                      AUDIO: {previewPreset.audioKeyword}
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw Pitch Detail Area */}
              <div className={`space-y-1.5 text-left p-4.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] ${isNeoThemeActive ? 'bg-stone-900 border-[#00ff22]' : 'bg-[#fdfcf6]'}`}>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                  {isBrainrotActive ? "Uncooked Input Pitch:" : "Raw Business Seed Prompt:"}
                </span>
                <p className="text-[11px] text-slate-400 italic leading-relaxed font-semibold">
                  "{previewPreset.description}"
                </p>
              </div>

              {/* Action Buttons to Launch */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                <button
                  onClick={() => onLoadPreset(previewPreset)}
                  className={`w-full sm:w-auto font-sans font-black text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                    isNeoThemeActive 
                      ? 'bg-[#00ff22] text-black border-[#00ff22] shadow-[3px_3px_0px_#00ff22]' 
                      : 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isBrainrotActive ? "Load Sigma Template & Cook" : "Launch With This Seed Profile"}</span>
                </button>
                <span className="text-[10px] text-slate-500 font-mono font-medium">Or customize variables inside the canvas</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- REVIEWS AND PROOF SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xs font-mono font-black text-[#8b5cf6] uppercase tracking-wider">MEMBER SPOTLIGHTS</h3>
          <h4 className="text-2xl md:text-3xl font-sans font-black uppercase">{isBrainrotActive ? "Giga Feed Masters Spitting Facts" : "Viral Results, Built Scientifically"}</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`border-2 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000] space-y-3.5 hover:translate-y-[-1px] transition-transform ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[4px_4px_0px_#00ff22]' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-1 text-[#ffcc00]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>
            <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/90' : 'text-slate-800'}`}>
              {isBrainrotActive 
                ? "\"We run a small coffee shop in Austin. Marketicians generated a 15s visual hook about Congress Bridge bat flights. The video got 100K views in 48h, absolute infinity rizz in this code!\""
                : "\"We run an indie coffee kiosk in Austin. Marketicians generated a 15-second visual hook centered around Bridge bat flights and pour-overs. The video hit 100K views in 48 hours. Absolute game-changer!\""
              }
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#ffcc00] font-black text-xs flex items-center justify-center border border-black text-black">
                MC
              </div>
              <div>
                <p className="text-[10px] font-black uppercase">Marcus C., Austin Coffee</p>
                <p className="text-[9px] text-slate-500 font-mono font-bold">Food & Beverage Niche</p>
              </div>
            </div>
          </div>

          <div className={`border-2 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000] space-y-3.5 hover:translate-y-[-1px] transition-transform ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[4px_4px_0px_#00ff22]' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-1 text-[#ffcc00]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>
            <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/90' : 'text-slate-800'}`}>
              {isBrainrotActive 
                ? "\"As a skincare dermatologist creator, my retention scores were low-key cooked. Mapped the micro-educational speed cues and macro botanical drip instructions, drop-offs fell under 12% on god!\""
                : "\"As a skincare dermatologist influencer, I struggled with video pacing. Applying the micro-educational bolds and visual framing cues like macro botanical drips kept my drop-offs at less than 12%.\""
              }
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#00d1ff] font-black text-xs flex items-center justify-center border border-black text-black">
                SL
              </div>
              <div>
                <p className="text-[10px] font-black uppercase">Sarah L., NYC Apothecary</p>
                <p className="text-[9px] text-slate-500 font-mono font-bold">Beauty & Wellness Niche</p>
              </div>
            </div>
          </div>

          <div className={`border-2 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000] space-y-3.5 hover:translate-y-[-1px] transition-transform ${
            isNeoThemeActive ? 'bg-black border-[#00ff22] shadow-[4px_4px_0px_#00ff22]' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-1 text-[#ffcc00]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>
            <p className={`text-xs leading-relaxed font-semibold ${isNeoThemeActive ? 'text-[#00ff22]/90' : 'text-slate-800'}`}>
              {isBrainrotActive 
                ? "\"The absolute brainrot slang toggle is pure gold. It makes narrator vocal scripts sound like genuine native Gen-Z humor instead of boring corporate accounts. Generated deep videos instantly!\""
                : "\"The Gen-Z vibe engine is pure gold. It writes scripts that sound genuinely native, avoiding that cringey 'corporate trying to be cool' feeling. Generated full storyboards and voiceovers instantly.\""
              }
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#8b5cf6] text-white font-black text-xs flex items-center justify-center border border-black text-black">
                DR
              </div>
              <div>
                <p className="text-[10px] font-black uppercase">Dave R., Clothing Brand</p>
                <p className="text-[9px] text-slate-500 font-mono font-bold">Thrift Streetwear Niche</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className={`border-t-4 border-black py-16 px-4 ${isNeoThemeActive ? 'bg-stone-950 border-[#00ff22]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto space-y-10 text-left">
          <div className="text-center space-y-2">
            <h3 className={`text-xs font-mono font-black uppercase tracking-widest inline-block px-3 py-1 rounded ${
              isNeoThemeActive ? 'bg-black border border-[#00ff22] text-[#00ff22]' : 'bg-[#ffcc00]/20 text-[#ff5c00]'
            }`}>
              {isBrainrotActive ? "HAVE SKIBIDI QUESTIONS?" : "HAVE QUESTIONS?"}
            </h3>
            <h4 className="text-2xl md:text-3xl font-sans font-black uppercase">
              {isBrainrotActive ? "SKIBIDI FAQS" : "Algorithmic Mechanics FAQ"}
            </h4>
          </div>

          <div className="space-y-4">
            {currentFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`border-2 border-black rounded-2xl overflow-hidden shadow-[2px_2px_0px_#000] ${
                  isNeoThemeActive ? 'border-[#00ff22] shadow-[2px_2px_0px_#00ff22]' : ''
                }`}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className={`w-full text-left p-4.5 transition-colors flex items-center justify-between font-bold text-xs md:text-sm cursor-pointer ${
                      isNeoThemeActive ? 'bg-stone-900 hover:bg-stone-800 text-[#00ff22]' : 'bg-slate-50 hover:bg-slate-100 text-black'
                    }`}
                  >
                    <span className="uppercase">{faq.q}</span>
                    <span className="text-lg font-mono font-bold">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className={`p-4.5 border-t-2 border-black text-xs leading-relaxed font-semibold ${
                      isNeoThemeActive ? 'bg-black text-[#00ff22]/90 border-[#00ff22]' : 'bg-white text-slate-800'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- BOTTOM CALL TO ACTION INTERACTIVE CONSOLE --- */}
      <section className={`border-t-4 border-black py-16 px-4 text-center space-y-6 ${
        isNeoThemeActive ? 'bg-black border-[#00ff22]' : 'bg-[#ffcc00]'
      }`}>
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className={`text-3xl md:text-5xl font-sans font-black uppercase leading-none ${
            isNeoThemeActive ? 'text-[#00ff22]' : 'text-black'
          }`}>
            {isBrainrotActive ? "STOP SCRUBBING. RIZZ EM NOW." : "Stop Stalling. Launch Your Video Co-Pilot Now."}
          </h3>
          <p className={`text-xs md:text-sm font-extrabold leading-normal max-w-lg mx-auto ${
            isNeoThemeActive ? 'text-[#00ff22]/70' : 'text-black/85'
          }`}>
            {isBrainrotActive 
              ? "Throw your unpolished raw ideas below, toggle your secret matrix overrides, and begin drafting. Direct connection is already lit, no cap."
              : "Bring your unpolished business pitch or personal project, calibrate your platform & vibe, and click generate. It's fully serverless, running with direct lightning speed."
            }
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onStartBlank}
            className={`w-full sm:w-auto font-sans font-black text-sm tracking-widest uppercase px-10 py-5 rounded-xl border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_#000] cursor-pointer inline-flex items-center justify-center space-x-2 ${
              isNeoThemeActive 
                ? 'bg-[#00ff22] text-black border-[#00ff22] shadow-[6px_6px_0px_#00ff22]' 
                : 'bg-[#ff5c00] text-white hover:bg-[#e05200]'
            }`}
          >
            <span>{isBrainrotActive ? "LAUNCH STORY RIJZ" : "Launch Storyboard Studio"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
