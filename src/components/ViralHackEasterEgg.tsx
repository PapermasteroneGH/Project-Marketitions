import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  X, 
  Send, 
  Gamepad2, 
  Sparkles, 
  Volume2, 
  Radio, 
  Gauge, 
  LogOut, 
  Play, 
  RotateCcw,
  Coffee,
  Globe
} from 'lucide-react';

interface ViralHackEasterEggProps {
  onClose: () => void;
  onBrainrotToggle: (active: boolean) => void;
  onNeoThemeToggle: (active: boolean) => void;
  isBrainrotActive: boolean;
  isNeoThemeActive: boolean;
}

// 1. Procedural Web Audio Synth FX Engine
function playSynthSound(type: 'success' | 'failure' | 'laser' | 'tick' | 'ambient_chord') {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    
    if (type === 'success') {
      // High rising pure arpeggio chords
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major scale rise
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } else if (type === 'failure') {
      // Sad descending heavy frequency pitch modulation
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'laser') {
      // Hyper quick sweep laser
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'tick') {
      // Woodblock click
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'ambient_chord') {
      // Deep gorgeous cyber pad chords
      const now = ctx.currentTime;
      const freqSet = [110.00, 220.00, 329.63, 440.00, 523.25]; // A minor open pad
      freqSet.forEach((freq) => {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();

        // Connect LFO modulation to frequency
        lfo.frequency.setValueAtTime(4, now); // 4Hz vibrato
        lfoGain.gain.setValueAtTime(5, now); // vibrato depth
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 1.2);
        osc.stop(now + 1.2);
      });
    }
  } catch (e) {
    console.warn("AudioContext failed to initialize (interaction required)", e);
  }
}

export function ViralHackEasterEgg({ 
  onClose, 
  onBrainrotToggle, 
  onNeoThemeToggle, 
  isBrainrotActive, 
  isNeoThemeActive 
}: ViralHackEasterEggProps) {
  
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "=== MARKETICIANS ALGORITHMIC SANDBOX CENTRAL v2.09 ===",
    "🔒 CLOUD SHELL CONTAINER CONNECTED PORT:31337 | PROTOCOL: LOCALHOST",
    "🤖 DETECTING BRAIN ENGINES... GEMINI INTEGRATION ACTIVE [100% Client-Side Mode]",
    "🚨 WARNING: HIGHLY STYLIZED NEO-BRUTALIST PROTOCOLS ENGAGED",
    "Type /help for custom secrets or pick a tab below to command."
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'game' | 'cheat'>('console');
  
  // Game state
  const [gamePlaying, setGamePlaying] = useState(false);
  const [gameStatus, setGameStatus] = useState<'idle' | 'scrolling' | 'target_flash' | 'complete'>('idle');
  const [targetFlashTime, setTargetFlashTime] = useState<number>(0);
  const [scrollingHashtags, setScrollingHashtags] = useState<string[]>([]);
  const [gameScore, setGameScore] = useState<{ reactionMs: number; rating: string; views: string; tier: string } | null>(null);
  
  const consoleBottomRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<any>(null);

  // Command logs autoscroll
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Audio greeting
  useEffect(() => {
    playSynthSound('ambient_chord');
  }, []);

  // Cleanup game timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    setTerminalLogs(prev => [...prev, `guest@marketicians:~$ ${terminalInput}`]);
    setTerminalInput("");

    // Command parser
    if (cmd === '/help') {
      setTerminalLogs(prev => [
        ...prev,
        "📜 AVAILABLE CHAT COMMANDS:",
        "  /brainrot    - Toggles absolute Gen-Z brainrot titles on home page",
        "  /neon        - Alternates deep cybernetic neon outline theme",
        "  /synth       - Executes deep realtime synthesizer chord sweep",
        "  /play        - Switches tab to launch Scroll-Stop Reaction Game",
        "  /info        - Details behind-the-scenes engineering design",
        "  /clear       - Purges terminal logs history",
        "  /exit        - Closes algorithmic secrets control center"
      ]);
      playSynthSound('tick');
    } else if (cmd === '/brainrot') {
      onBrainrotToggle(!isBrainrotActive);
      setTerminalLogs(prev => [
        ...prev,
        `🔥 BRAINROT BOOSTER STATUS: ${!isBrainrotActive ? "🚀 MAXIMUM SKIBIDI MODE ACTIVATED" : "📴 STANDARDIZED LITERARY ENGLISH ENGAGED"}`
      ]);
      playSynthSound('success');
    } else if (cmd === '/neon') {
      onNeoThemeToggle(!isNeoThemeActive);
      setTerminalLogs(prev => [
        ...prev,
        `⚡ NEON ELECTRO STROBE STATUS: ${!isNeoThemeActive ? "🚨 NEON CYBERPUNK DRIZZLE ENGAGED" : "🍂 WARM CREATIVE CLAY DRIZZLE ENGAGED"}`
      ]);
      playSynthSound('success');
    } else if (cmd === '/synth') {
      setTerminalLogs(prev => [...prev, "🎹 TRIGGERING WEB-AUDIO HARDWARE VCO WAVE OSCILLATION... C-MAJOR TRIAD CHORDS"]);
      playSynthSound('ambient_chord');
    } else if (cmd === '/play') {
      setActiveSubTab('game');
      setTerminalLogs(prev => [...prev, "🎮 ROUTING SUB-MATRIX OUTPUT INTO SCROLL-STOPPER TIMING GAME... READY"]);
      playSynthSound('laser');
    } else if (cmd === '/info') {
      setTerminalLogs(prev => [
        ...prev,
        "ℹ️ PLATFORM COMPOSITION INFORMATION:",
        "  • UI SYSTEM: React 18 with high-contrast customizable Neo-Brutalist design presets",
        "  • API CONNECTORS: Full direct dynamic Client-side fetch wrappers invoking @google/genai",
        "  • AUDIO HARDWARE: Raw Web Audio synthesizer and Web Speech API local fallback profiles.",
        "  • STORAGE ENGINE: Completely modular client context & responsive local hooks."
      ]);
      playSynthSound('tick');
    } else if (cmd === '/clear') {
      setTerminalLogs([]);
    } else if (cmd === '/exit') {
      onClose();
    } else {
      setTerminalLogs(prev => [...prev, `❌ ERROR: Command "${cmd}" unrecognized. Type /help to see secrets blueprint.`]);
      playSynthSound('failure');
    }
  };

  // SCROLL-STOP GAME LOGIC
  const startScrollStopGame = () => {
    playSynthSound('laser');
    setGameScore(null);
    setGameStatus('scrolling');
    setScrollingHashtags([]);
    
    // Quick tags feeding simulation
    const tagsDatabase = [
      "#rizz", "#skibidi", "#retention", "#tiktok_growth", "#aesthetic_check",
      "#lets_cook", "#shadowbanned", "#capcut_speedramp", "#local_spots", "#aesthetic_coffee"
    ];

    let cycles = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      // Feed random tags
      const randomTag = tagsDatabase[Math.floor(Math.random() * tagsDatabase.length)] + " " + Math.floor(Math.random() * 9999);
      setScrollingHashtags(prev => [...prev.slice(-8), randomTag]);
      playSynthSound('tick');
      cycles++;

      // Trigger target flash at random cycle window
      if (cycles > 12 && Math.random() > 0.4) {
        clearInterval(intervalRef.current);
        setGameStatus('target_flash');
        setTargetFlashTime(Date.now());
        playSynthSound('laser');
        
        // Fail-safe limit: if player doesn't click within 1.5 seconds, auto-fail
        intervalRef.current = setTimeout(() => {
          triggerGameFinish(null);
        }, 1500);
      }
    }, 150);
  };

  const handleSlamBrakes = () => {
    if (gameStatus !== 'target_flash') {
      // Clicked too early!
      playSynthSound('failure');
      setGameScore({
        reactionMs: 9999,
        rating: "⚠️ BRICKED EARLY ACCELERATOR",
        views: "0 Views [Bricked Hook]",
        tier: "Total Flop Era"
      });
      setGameStatus('complete');
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }

    const clickedTime = Date.now();
    const delay = clickedTime - targetFlashTime;
    triggerGameFinish(delay);
  };

  const triggerGameFinish = (delay: number | null) => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      clearInterval(intervalRef.current);
    }

    if (delay === null) {
      playSynthSound('failure');
      setGameScore({
        reactionMs: 1500,
        rating: "🦦 TOTALLY SLEEPING / AFK",
        views: "0 Views [Shadowbanned]",
        tier: "Phone Offline"
      });
    } else {
      let ratingStr = "";
      let viewsStr = "";
      let tierStr = "";

      if (delay < 150) {
        ratingStr = "🔥 GIGACHAD VIRAL EMPEROR!";
        viewsStr = "25,000,000+ Viral Views (For You Page Spammed!)";
        tierStr = "S-TIER ALGORITHMIC GOD";
        playSynthSound('success');
      } else if (delay < 250) {
        ratingStr = "⚡ CAPCUT SPEED RAMP MASTER";
        viewsStr = "4,200,000 Views (Consistent holding curve)";
        tierStr = "A-TIER VIRAL PRO";
        playSynthSound('success');
      } else if (delay < 380) {
        ratingStr = "☕ MID-LEVEL INFLUENCER";
        viewsStr = "120,400 Views (Decent local engagement)";
        tierStr = "B-TIER CONTENT CREATOR";
        playSynthSound('tick');
      } else if (delay < 600) {
        ratingStr = "🦦 SLOP FLOPERA ENTHUSIAST";
        viewsStr = "86 Views (Mostly just family)";
        tierStr = "C-TIER SCROLLER";
        playSynthSound('failure');
      } else {
        ratingStr = "🪵 EMBARRASSING STRAW SCROLL SPEED";
        viewsStr = "0 Views (Marked as spam bot)";
        tierStr = "D-TIER BRICKED SCREEN";
        playSynthSound('failure');
      }

      setGameScore({
        reactionMs: delay,
        rating: ratingStr,
        views: viewsStr,
        tier: tierStr
      });
    }

    setGameStatus('complete');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
      
      {/* Neo Brutalist Glass Retro Arcade Cabinet Screen */}
      <div className="relative w-full max-w-2xl bg-[#080808] border-4 border-black text-[#00ff22] rounded-3xl overflow-hidden shadow-[8px_8px_0px_#ff5c00] flex flex-col md:h-[500px]">
        
        {/* CRT Scanline and Flicker Animated Graphic Overlays */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_6px_100%] opacity-35 z-20" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-[#102010]/15 animate-pulse z-20" />

        {/* Console Header Bar */}
        <div className="bg-[#111111] p-3 border-b-2 border-black flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-black animate-ping" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#ffcc00] flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-[#ffcc00]" />
              MARKETICIANS_SECRET_SANDBOX.sh
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-md bg-stone-900 border border-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-[#181818] border-b-2 border-black flex flex-wrap shrink-0">
          <button 
            onClick={() => { setActiveSubTab('console'); playSynthSound('tick'); }}
            className={`px-4.5 py-2 text-[10px] font-bold uppercase border-r-2 border-black tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'console' ? 'bg-[#00ff22] text-black font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            01. Interactive Shell
          </button>
          <button 
            onClick={() => { setActiveSubTab('game'); playSynthSound('tick'); }}
            className={`px-4.5 py-2 text-[10px] font-bold uppercase border-r-2 border-black tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'game' ? 'bg-[#ff5c00] text-white font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 animate-bounce" />
            02. Scroll-Stop timing game
          </button>
          <button 
            onClick={() => { setActiveSubTab('cheat'); playSynthSound('tick'); }}
            className={`px-4.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'cheat' ? 'bg-[#ffcc00] text-black font-black' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            03. Cheat Modifiers
          </button>
        </div>

        {/* Content Box */}
        <div className="p-4 flex-1 overflow-y-auto text-xs z-10 font-mono">
          
          {/* TAB 1: INTERACTIVE SHELL */}
          {activeSubTab === 'console' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[250px] pr-2 scrollbar-thin">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="leading-5 whitespace-pre-wrap">
                    {log.startsWith("gest@") ? (
                      <span className="text-white">{log}</span>
                    ) : log.startsWith("❌") ? (
                      <span className="text-red-400 font-bold">{log}</span>
                    ) : log.startsWith("🔥") || log.startsWith("⚡") ? (
                      <span className="text-cyan-400 font-black">{log}</span>
                    ) : log.startsWith("📜") || log.startsWith("  /") ? (
                      <span className="text-[#ffcc00] font-bold">{log}</span>
                    ) : (
                      <span>{log}</span>
                    )}
                  </div>
                ))}
                <div ref={consoleBottomRef} />
              </div>

              {/* Form Input Line */}
              <form onSubmit={handleCommandSubmit} className="border-t-2 border-[#1c1c1c] pt-3 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <span className="text-stone-500 font-extrabold select-none">guest@marketicians:~$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type a command (e.g. /help, /brainrot)..."
                    className="flex-1 bg-transparent text-white outline-none border-none py-1 text-xs caret-[#00ff22]"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="bg-[#00ff22] text-black rounded border border-black px-3 py-1 font-mono font-black text-[10px] hover:-translate-y-0.5 transition-transform"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SCROLL-STOP TIMING GAME */}
          {activeSubTab === 'game' && (
            <div className="flex flex-col items-center justify-between h-full space-y-3">
              <div className="text-center space-y-1 shrink-0">
                <h4 className="text-sm font-black text-[#ff5c00] uppercase">Scroll-Stop Reaction Trainer 🕹️</h4>
                <p className="text-[10px] text-stone-400 max-w-md">
                  In short form, you have exactly <strong className="text-white">150ms</strong> to stop a user's thumbs from scrolling. Hit the stop button the split-second the screen flashes red!
                </p>
              </div>

              {/* Scrolling Screen viewport mockup */}
              <div className="w-full max-w-sm h-48 border-2 border-stone-800 rounded-xl relative overflow-hidden bg-stone-950 flex flex-col justify-center items-center shadow-inner">
                {gameStatus === 'idle' && (
                  <div className="text-center space-y-2 select-none">
                    <Radio className="w-8 h-8 text-stone-600 animate-pulse mx-auto" />
                    <button
                      onClick={startScrollStopGame}
                      className="bg-[#00ff22] text-black font-black uppercase text-[10px] px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer hover:bg-[#39ff5a]"
                    >
                      Start Calibration Game
                    </button>
                  </div>
                )}

                {gameStatus === 'scrolling' && (
                  <div className="w-full h-full flex flex-col justify-end p-4 font-mono select-none">
                    {scrollingHashtags.map((tag, idx) => (
                      <div 
                        key={idx} 
                        className="text-[11px] text-[#00ff22]/40 text-center font-bold tracking-wider py-0.5 transform transition-all translate-y-[-10px] animate-fade-in-up"
                      >
                        {tag}
                      </div>
                    ))}
                    <div className="text-xs uppercase text-stone-500 animate-pulse text-center mt-2">
                      ⚡ USER SCROLLING FEED... GET READY TO HOOK
                    </div>
                  </div>
                )}

                {gameStatus === 'target_flash' && (
                  <button
                    onClick={handleSlamBrakes}
                    className="absolute inset-0 bg-red-600 flex flex-col justify-center items-center text-white p-4 cursor-pointer focus:outline-none select-none border-none outline-none animate-flash-urgent"
                  >
                    <span className="text-xl font-extrabold uppercase animate-bounce">🚨 OUTSTANDING HOOK ALIGN! 🚨</span>
                    <span className="text-xs tracking-widest font-black uppercase bg-black text-white px-3 py-1 rounded-md mt-2">
                       💥 SLAM HOOK BRAKES NOW! (CLICK ME!) 💥
                    </span>
                  </button>
                )}

                {gameStatus === 'complete' && gameScore && (
                  <div className="p-4 text-center space-y-1.5 bg-[#0a180a] absolute inset-0 flex flex-col justify-center items-center select-none">
                    <span className="text-[10px] uppercase font-mono font-black bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                      TIMING RUN FINAL OUTPUT
                    </span>
                    <div className="text-xl font-black text-[#00ff22] tracking-wide">
                      {gameScore.reactionMs === 9999 ? "TOO EARLY!" : `${gameScore.reactionMs} ms`}
                    </div>
                    <div className="text-[11px] font-black text-white uppercase bg-red-500/20 px-2.5 py-0.5 rounded border border-red-500/30">
                      {gameScore.rating}
                    </div>
                    <div className="text-[10px] text-[#ffcc00] font-black">{gameScore.views}</div>
                    <div className="text-[9px] text-stone-400 font-mono italic">Viral Tier: {gameScore.tier}</div>

                    <button
                      onClick={startScrollStopGame}
                      className="bg-white text-black hover:bg-slate-50 border border-black font-black uppercase text-[9px] px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer mt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Try Again
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile friendly tap panel */}
              {gameStatus === 'target_flash' && (
                <button
                  onClick={handleSlamBrakes}
                  className="w-full max-w-sm py-3 px-5 bg-red-500 hover:bg-red-600 border-2 border-black shadow-[3px_3px_0px_#000] text-center text-xs text-white font-extrabold uppercase rounded-xl select-none"
                >
                  🔴 SHOOT INTERRUPTER HOOK PANEL - SLAM RED CAPTURE!
                </button>
              )}
            </div>
          )}

          {/* TAB 3: CHEAT MODIFIERS */}
          {activeSubTab === 'cheat' && (
            <div className="space-y-4 text-left p-2">
              <h4 className="text-sm font-black text-[#ffcc00] uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#ffcc00]" />
                Algorithmic Cheat Switchboard
              </h4>
              <p className="text-[10px] text-stone-400 leading-relaxed">
                Manually injection override modifiers directly on the Client-side React context wrapper. Modifies general UI visuals instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* Switch 1: Brainrot */}
                <button
                  onClick={() => {
                    onBrainrotToggle(!isBrainrotActive);
                    playSynthSound('success');
                  }}
                  className={`p-4 rounded-xl border-2 border-black flex flex-col justify-between text-left transition-all hover:scale-[1.01] cursor-pointer ${
                    isBrainrotActive 
                      ? 'bg-[#00ff22]/20 border-[#00ff22] text-[#00ff22] shadow-[3px_3px_0px_#00ff22]' 
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  <span className="text-[9px] font-mono font-black text-stone-500 uppercase">MOD_01 [DANGEROUS]</span>
                  <span className="text-xs font-black uppercase text-white mt-1">100% Brainrot Slang</span>
                  <p className="text-[8.5px] mt-1 text-stone-400">Rebrands all home page core writing metrics into absolute internet jargon terminology (rizz, skibidi etc.).</p>
                  <span className="text-[9px] font-mono font-bold mt-2 border border-stone-700 px-1.5 py-0.5 rounded self-start bg-black text-white">
                    {isBrainrotActive ? "● ENGAGED" : "○ DISABLE"}
                  </span>
                </button>

                {/* Switch 2: Cyber Neon Theme */}
                <button
                  onClick={() => {
                    onNeoThemeToggle(!isNeoThemeActive);
                    playSynthSound('success');
                  }}
                  className={`p-4 rounded-xl border-2 border-black flex flex-col justify-between text-left transition-all hover:scale-[1.01] cursor-pointer ${
                    isNeoThemeActive 
                      ? 'bg-[#ff5c00]/25 border-[#ff5c00] text-[#ff5c00] shadow-[3px_3px_0px_#ff5c00]' 
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  <span className="text-[9px] font-mono font-black text-stone-500 uppercase">MOD_02 [STYLIZED]</span>
                  <span className="text-xs font-black uppercase text-white mt-1">Cyber Neon Overload</span>
                  <p className="text-[8.5px] mt-1 text-stone-400">Forces flashy high-contrast matrix cyberpunk strobe borders throughout home indicators container metrics.</p>
                  <span className="text-[9px] font-mono font-bold mt-2 border border-stone-700 px-1.5 py-0.5 rounded self-start bg-black text-white">
                    {isNeoThemeActive ? "● ENGAGED" : "○ DISABLE"}
                  </span>
                </button>

              </div>
              
              <div className="text-[9px] text-[#ffcc00] font-mono italic text-center pt-2">
                ⚡ Note: Turn modifiers OFF to restore standard production brand alignments.
              </div>
            </div>
          )}

        </div>

        {/* Console Footing bar */}
        <div className="bg-[#111111] p-3 border-t-2 border-black flex justify-between items-center text-[10px] text-stone-500 shrink-0 select-none">
          <span className="flex items-center gap-1">
            <Coffee className="w-3.5 h-3.5 text-stone-600" />
            Designed by Elite Creative Engineers
          </span>
          <span className="font-mono text-emerald-500">
            SYSTEM STATUS: OPERATIONAL
          </span>
        </div>

      </div>
    </div>
  );
}
