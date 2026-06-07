import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Smartphone, 
  Volume2, 
  Video, 
  Eye, 
  Palette, 
  MapPin, 
  Play, 
  CheckCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface OnboardingTourProps {
  onClose: () => void;
}

export function OnboardingTour({ onClose }: OnboardingTourProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Brand Seed Prompting",
      icon: Sparkles,
      color: "bg-[#ffcc00]",
      badge: "START HEURISTIC",
      desc: "Provide any unpolished business pitch or product idea. Marketicians handles the algorithmic translation into full high-engagement visual hooks.",
      illustration: (
        <div className="bg-slate-100 p-4 rounded-xl border-2 border-black font-mono text-[10px] space-y-2 text-left shadow-[2px_2px_0px_#000]">
          <p className="text-slate-400">// YOUR UNPOLISHED INPUT:</p>
          <p className="font-bold text-black italic">"I run a vintage bookstore on Congress in Austin, TX..."</p>
          <p className="text-zinc-600">// AI STORYBOARD SYNTHESIS:</p>
          <div className="p-1 px-2 bg-emerald-100 text-emerald-800 rounded border border-emerald-400 font-bold uppercase text-[8px] tracking-wider w-max">
            100% Algorithmic Optimization
          </div>
        </div>
      ),
      tip: "Include physical items, sensory notes, or specific customer reactions for best results."
    },
    {
      title: "2. Brand Vibe Matching",
      icon: Video,
      color: "bg-[#8b5cf6] text-white",
      badge: "TONAL METRICS",
      desc: "Instantly calibrate the narrative tone to match your target audience. Avoid 'cringey corporate speak' and match platforms native behaviors perfectly.",
      illustration: (
        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono font-black text-left">
          <div className="p-2 border-2 border-black bg-[#ffcc00] rounded-xl shadow-[1.5px_1.5px_0px_#000] space-y-0.5">
            <span className="text-[7.5px] uppercase bg-black text-white px-1 rounded">GEN-Z IRONIC</span>
            <p className="italic text-black font-semibold">"Bestie, let them cook. This aesthetic checks out..."</p>
          </div>
          <div className="p-2 border-2 border-black bg-white rounded-xl shadow-[1.5px_1.5px_0px_#000] space-y-0.5">
            <span className="text-[7.5px] uppercase bg-[#8b5cf6] text-white px-1 rounded">CORPORATE SLEEK</span>
            <p className="italic text-zinc-700 font-semibold">"Unlock the latent 10x ROI of your boutique store..."</p>
          </div>
        </div>
      ),
      tip: "Use Gen-Z for high shareability or Educational for steady engagement loops."
    },
    {
      title: "3. Hyperlocal GPS Trends",
      icon: MapPin,
      color: "bg-[#00d1ff]",
      badge: "ALGORITHMIC DISPATCH",
      desc: "Short-form platform algorithms prioritize physical geographical contexts. By selecting a target city, Marketicians infuses local landmarks & codes.",
      illustration: (
        <div className="bg-slate-100 p-3 rounded-xl border-2 border-black text-left text-[10px] font-mono space-y-1 shadow-[2px_2px_0px_#000]">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[#ff5c00]" />
            <span className="font-extrabold text-[#ff5c00]">Austin, TX Detected</span>
          </div>
          <p className="text-zinc-700 font-semibold text-[9px]">
            ✓ Infusing: Congress Bridge Bat Flight references & South Congress vintage walkabouts.
          </p>
        </div>
      ),
      tip: "We update trend data continuously across 7 core global metropolitan indices."
    },
    {
      title: "4. Live Composition Sketches",
      icon: Eye,
      color: "bg-emerald-400",
      badge: "TECHNICAL CINEMATOGRAPHY",
      desc: "Our interactive Live Sketch engine parses composition keywords inside your script to draw real-time structural blueprints (angles, lenses, camera pan directions).",
      illustration: (
        <div className="bg-zinc-950 border-2 border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-center relative overflow-hidden h-[90px] shadow-[2px_2px_0px_#000]">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-dashed border-emerald-400" />
            ))}
          </div>
          <div className="text-center space-y-1 z-10">
            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold animate-pulse">● WIDE ANGLE GRID LOCKED</span>
            <span className="text-[7.5px] font-mono text-zinc-400 block">18mm Ultra-Wide • f/5.6</span>
          </div>
        </div>
      ),
      tip: "Try writing keywords like 'closeup', 'wide panning', 'unboxing', or 'laptop screen' inside your scene visual cues."
    },
    {
      title: "5. AI Art Matte Backdrops",
      icon: Palette,
      color: "bg-pink-400",
      badge: "MOCK REELS ACCELERATION",
      desc: "One-click generation renders professional, hyper-aesthetic 9:16 backdrops directly in the viewport, helping you conceptualize lighting & aesthetics before you shoot.",
      illustration: (
        <div className="flex items-center justify-between border-2 border-black bg-[#ffcc00] p-1.5 rounded-xl shadow-[1.5px_1.5px_0px_#000]">
          <div className="text-[9px] font-mono font-black text-black pl-1">
            🎨 GENERATING MATTE IMAGE...
          </div>
          <div className="px-1.5 py-1 bg-black text-white text-[8px] font-bold uppercase rounded animate-pulse">
            GEMINI ENGINE
          </div>
        </div>
      ),
      tip: "Matte images are rendered securely client-side in seconds with high quality."
    },
    {
      title: "6. Text-to-Speech Synth",
      icon: Volume2,
      color: "bg-[#ff5c00] text-white",
      badge: "ACOUSTIC FEEDBACK",
      desc: "Generate actual voice syntheses for the voiceover scripts on the fly. Choose between multiple professional narrator profiles (Fenrir, Puck, Kore) natively.",
      illustration: (
        <div className="bg-slate-100 p-3 rounded-xl border-2 border-black flex items-center justify-between shadow-[2px_2px_0px_#000]">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-[#ff5c00]" />
            <span className="font-mono text-xs font-black">Voice: Puck (Sleek)</span>
          </div>
          <button className="bg-white px-2 py-1 border border-black rounded text-[8px] font-mono font-extrabold flex items-center space-x-1 shadow-[1px_1px_0px_#000]">
            <Play className="w-1.5 h-1.5 fill-black" />
            <span>PLAY SYNTH</span>
          </button>
        </div>
      ),
      tip: "You can click 'Synthesize' on individual scenes to hear speech, or play them consecutively."
    },
    {
      title: "7. Simulated Feed Viewport",
      icon: Smartphone,
      color: "bg-teal-400",
      badge: "SIMULATION INTERFACES",
      desc: "View, slide, and play your draft in full simulated smartphone frames mirroring TikTok, Instagram Reels, and YouTube Shorts with synchronous subtitle overlays.",
      illustration: (
        <div className="bg-zinc-900 text-white p-2.5 rounded-xl border-2 border-black space-y-1.5 text-left text-[9px] font-mono relative shadow-[2px_2px_0px_#000]">
          <div className="flex justify-between items-center text-zinc-500 text-[7px] pb-1 border-b border-zinc-800">
            <span>● IG REELS COMPATIBLE</span>
            <span>0:30s</span>
          </div>
          <p className="text-[#00d1ff] font-extrabold">"This Austin bookstore is a whole vibe..."</p>
          <div className="flex space-x-2 text-[7px] text-zinc-400">
            <span>❤ 23.4k</span>
            <span>💬 910</span>
          </div>
        </div>
      ),
      tip: "Toggle on the 'Continuous Reel Stream' button to auto-advance scenes with voice syncing like a real video feed."
    }
  ];

  const currentStepData = steps[activeStep];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      
      {/* Neo-brutalist Main Modal Frame */}
      <div className="bg-[#fdfcf6] border-4 border-black rounded-[28px] max-w-4xl w-full shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col md:grid md:grid-cols-12 relative animate-scale-up">
        
        {/* Floating escape cross */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white hover:bg-slate-50 p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] transition active:translate-y-0.5 active:shadow-none hover:rotate-90 z-20 cursor-pointer"
        >
          <X className="w-4 h-4 text-black" />
        </button>

        {/* --- LEFT NAVIGATION AREA: List of Functions (4 Columns) --- */}
        <div className="col-span-4 bg-white border-b-2 md:border-b-0 md:border-r-2 border-black p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <QuestionIcon className="w-5 h-5 text-[#ff5c00]" />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ff5c00]">Marketicians Academy</span>
            </div>
            
            <h3 className="text-sm md:text-base font-sans font-black uppercase text-black">
              Production Walkthrough & Guide
            </h3>

            {/* List selector of all functions */}
            <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
              {steps.map((step, idx) => {
                const isSelected = activeStep === idx;
                const SelectIcon = step.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`flex-none md:flex-1 text-left p-2.5 rounded-xl border-2 font-mono text-[10px] transition-all flex items-center space-x-2 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#ffcc00] border-black text-black shadow-[2px_2px_0px_#000] font-black' 
                        : 'border-transparent text-slate-500 hover:text-black hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <SelectIcon className="w-3.5 h-3.5 text-black shrink-0" />
                    <span className="truncate">{step.title.split(". ").slice(1).join(" ")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[9px] font-semibold text-slate-400 font-mono hidden md:block pt-4 border-t border-slate-100">
            Marketicians is serverless, running portable client loops securely.
          </div>
        </div>

        {/* --- RIGHT DETAILED VIEWPORT (8 Columns) --- */}
        <div className="col-span-8 p-6 md:p-8 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Header info badge & Title */}
            <div className="space-y-2">
              <span className={`inline-flex px-2.5 py-1 ${currentStepData.color} border-2 border-black rounded-lg text-[9px] font-mono font-black tracking-widest`}>
                {currentStepData.badge}
              </span>
              
              <h2 className="text-2xl md:text-3.5xl font-sans font-black uppercase text-black flex items-center space-x-2.5">
                <StepIcon className="w-8 h-8 text-black" />
                <span>{currentStepData.title}</span>
              </h2>
            </div>

            {/* In-depth feature utility description */}
            <p className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed">
              {currentStepData.desc}
            </p>

            {/* Interactive feature illustration mockup mockup */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-5 rounded-2xl">
              <span className="text-[8px] font-mono font-black uppercase tracking-wider text-slate-400 block mb-2 text-left">
                Interactive Visual Analogue
              </span>
              {currentStepData.illustration}
            </div>

            {/* Pro developer/creator Tip */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-[10.5px] font-semibold text-amber-900 leading-normal text-left flex items-start space-x-2">
              <span className="text-lg leading-none shrink-0 mt-0.5">💡</span>
              <div>
                <span className="font-bold">PRO-TIP: </span>
                <span>{currentStepData.tip}</span>
              </div>
            </div>
          </div>

          {/* Stepper controls bottom */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono font-extrabold">
              <span>PROGRESS:</span>
              <span className="text-black font-black bg-slate-200 px-1.5 py-0.5 rounded">0{activeStep + 1}</span>
              <span>/</span>
              <span>0{steps.length}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className={`py-2 px-3 rounded-lg border-2 border-black font-mono font-black text-[9px] uppercase cursor-pointer flex items-center space-x-1 transition shadow-[1.5px_1.5px_0px_#000] active:translate-y-0.5 active:shadow-none ${
                  activeStep === 0 
                    ? 'opacity-30 cursor-not-allowed bg-slate-100' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="w-3 h-3 text-black" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNext}
                className="py-2 px-4.5 rounded-lg border-2 border-black bg-[#ffcc00] text-black hover:bg-[#ffcc00]/95 font-mono font-black text-[9px] uppercase cursor-pointer flex items-center space-x-1.5 transition shadow-[1.5px_1.5px_0px_#000] active:translate-y-0.5 active:shadow-none"
              >
                <span>{activeStep === steps.length - 1 ? 'Get Started' : 'Next Function'}</span>
                <ArrowRight className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
