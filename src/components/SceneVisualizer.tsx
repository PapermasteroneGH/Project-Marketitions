import React, { useMemo, useState, useEffect } from 'react';
import { Camera, Play, Pause, RefreshCw, Layers, Sparkles, Sliders } from 'lucide-react';
import { StoryboardScene } from '../types';

interface SceneVisualizerProps {
  scene: StoryboardScene;
  activeSceneIndex: number;
  totalScenes: number;
  brandVibe: string;
  imageUrl?: string;
  onGenerateImage?: () => void;
  imageGenerating?: boolean;
}

type ArtFilterStyle = 'blueprint-traditional' | 'charcoal-paper' | 'sunset-matte' | 'neon-terminal';

export function SceneVisualizer({
  scene,
  activeSceneIndex,
  totalScenes,
  brandVibe,
  imageUrl,
  onGenerateImage,
  imageGenerating,
}: SceneVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState<number>(4); // Hand-drawn vintage storyboard speed (default 4FPS)
  const [activeFrame, setActiveFrame] = useState<number>(0);
  const [activeStyle, setActiveStyle] = useState<ArtFilterStyle>('sunset-matte');

  // Multi-frame simulation ticker to emulate a looping animated GIF cinemagraph
  useEffect(() => {
    if (!isPlaying) return;
    
    // Convert FPS to milliseconds interval
    const intervalMs = Math.round(1000 / fps);
    const intervalId = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % 4); // 4-frame looping gif cycle
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [isPlaying, fps]);

  // Handle parsing composition keywords into movie technical specs
  const shotDetails = useMemo(() => {
    const cue = (scene.visualCue || '').toLowerCase();
    
    let shotType = 'MEDIUM SHOT';
    let focalLength = '35mm Prime';
    let aperture = 'f/2.8';
    let cameraAngle = 'EYE LEVEL';
    let estimatedZoom = '1.0x';
    let motionType = 'STATIC LOCK';

    if (cue.includes('close-up') || cue.includes('closeup') || cue.includes('macro') || cue.includes('ecb') || cue.includes('tight')) {
      shotType = 'CLOSE-UP (ECU)';
      focalLength = '85mm Cinematic';
      aperture = 'f/1.8 Depth';
      estimatedZoom = '2.5x';
    } else if (cue.includes('wide') || cue.includes('scenic') || cue.includes('landscape') || cue.includes('panoramic')) {
      shotType = 'WIDE ANGLE';
      focalLength = '18mm Wide';
      aperture = 'f/5.6 Deep';
      estimatedZoom = '0.5x';
    } else if (cue.includes('extreme close')) {
      shotType = 'EXTREME CLOSE-UP';
      focalLength = '105mm Macro';
      aperture = 'f/1.4 Focus';
      estimatedZoom = '4.0x';
    } else if (cue.includes('pov') || cue.includes('perspective') || cue.includes('subjective')) {
      shotType = 'POV COMPOSITION';
      focalLength = '24mm Prime';
      aperture = 'f/2.0 Prime';
      estimatedZoom = '1.0x';
    }

    if (cue.includes('low angle') || cue.includes('look up') || cue.includes('looking up') || cue.includes('tilt up')) {
      cameraAngle = 'LOW ANGLE';
    } else if (cue.includes('high angle') || cue.includes('overhead') || cue.includes('drone') || cue.includes('look down') || cue.includes('bird')) {
      cameraAngle = 'OVERHEAD BIRD';
    }

    if (cue.includes('pan') || cue.includes('sweep') || cue.includes('rotate')) {
      motionType = 'SWEEP PAN';
    } else if (cue.includes('zoom') || cue.includes('pinch') || cue.includes('pull back') || cue.includes('push in')) {
      motionType = 'DYNAMIC ZOOM';
    } else if (cue.includes('dolly') || cue.includes('tracking') || cue.includes('follow') || cue.includes('slide')) {
      motionType = 'DOLLY TRACK';
    } else if (cue.includes('tilt') || cue.includes('crane')) {
      motionType = 'VERTICAL TILT';
    }

    return { shotType, focalLength, aperture, cameraAngle, estimatedZoom, motionType };
  }, [scene.visualCue]);

  // Context clues mapping
  const cueKeywords = useMemo(() => {
    const cue = (scene.visualCue || '').toLowerCase();
    return {
      coffee: cue.includes('coffee') || cue.includes('cup') || cue.includes('brew') || cue.includes('latte') || cue.includes('barista') || cue.includes('pour') || cue.includes('mug') || cue.includes('cafe'),
      screens: cue.includes('screen') || cue.includes('laptop') || cue.includes('code') || cue.includes('computer') || cue.includes('dashboard') || cue.includes('keyboard') || cue.includes('phone') || cue.includes('app'),
      people: cue.includes('person') || cue.includes('man') || cue.includes('woman') || cue.includes('founder') || cue.includes('face') || cue.includes('hand') || cue.includes('host') || cue.includes('smile') || cue.includes('presenter'),
      store: cue.includes('store') || cue.includes('shop') || cue.includes('street') || cue.includes('building') || cue.includes('exterior') || cue.includes('city') || cue.includes('neighborhood') || cue.includes('window'),
      metrics: cue.includes('chart') || cue.includes('grow') || cue.includes('graph') || cue.includes('arrow') || cue.includes('diagram') || cue.includes('metric') || cue.includes('stat') || cue.includes('sale') || cue.includes('revenue'),
      package: cue.includes('unboxing') || cue.includes('box') || cue.includes('package') || cue.includes('ship') || cue.includes('delivery') || cue.includes('open'),
    };
  }, [scene.visualCue]);

  // Helper to generate coordinates that slightly shifts dynamically based on current frame ticks,
  // creating a very satisfying wiggling hand-drawn animatic GIF look!
  const wiggle = (val: number, multiplier = 1): number => {
    if (!isPlaying) return val;
    // Fast pseudo-random offset cycle based on target coord value and frame tick
    const cycleOffsets = [0.8, -0.6, -1.0, 0.9];
    const hash = Math.floor((val + activeFrame * 17) % 4);
    return Number((val + cycleOffsets[hash] * multiplier).toFixed(1));
  };

  // String version for cleaner SVG attribute interpolation
  const wPath = (points: [number, number][], close = false): string => {
    if (points.length === 0) return '';
    let d = `M ${wiggle(points[0][0])},${wiggle(points[0][1])}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${wiggle(points[i][0])},${wiggle(points[i][1])}`;
    }
    if (close) d += ' Z';
    return d;
  };

  // Custom styling colors based on current Art Filter selected
  const themeStyles = useMemo(() => {
    const hasPhoto = !!imageUrl;
    switch (activeStyle) {
      case 'charcoal-paper':
        return {
          bg: 'bg-[#e6e2db]',
          strokePrimary: hasPhoto ? '#ffffff' : '#222222',
          strokeSecondary: hasPhoto ? '#94a3b8' : '#666666',
          strokeAccent: '#f59e0b',
          gridOpacity: 'opacity-[0.22]',
          borderTheme: 'border-amber-900/10'
        };
      case 'sunset-matte':
        return {
          bg: 'bg-[#fff7ed]',
          strokePrimary: hasPhoto ? '#ffeedd' : '#431407',
          strokeSecondary: hasPhoto ? '#f43f5e' : '#be123c',
          strokeAccent: '#f97316',
          gridOpacity: 'opacity-[0.25]',
          borderTheme: 'border-orange-500/15'
        };
      case 'neon-terminal':
        return {
          bg: 'bg-[#030712]',
          strokePrimary: '#22c55e',
          strokeSecondary: '#3b82f6',
          strokeAccent: '#a855f7',
          gridOpacity: 'opacity-[0.32]',
          borderTheme: 'border-emerald-500/20'
        };
      case 'blueprint-traditional':
      default:
        return {
          bg: 'bg-[#0f172a]',
          strokePrimary: '#ffffff',
          strokeSecondary: '#00d1ff',
          strokeAccent: '#ffaa00',
          gridOpacity: 'opacity-[0.28]',
          borderTheme: 'border-[#00d1ff]/20'
        };
    }
  }, [activeStyle, imageUrl]);

  return (
    <div className={`w-full h-full ${imageUrl ? 'bg-slate-950' : themeStyles.bg} relative select-none flex flex-col justify-between overflow-hidden transition-all duration-300`}>
      {/* Background Image Layer */}
      {imageUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 opacity-90"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      {/* Black ambient glass overlay to give stunning studio readability */}
      {imageUrl && <div className="absolute inset-0 z-0 bg-black/55 pointer-events-none" />}

      {/* Visual Blueprint Grid Layout */}
      <div className={`absolute inset-0 z-0 pointer-events-none ${themeStyles.gridOpacity} grid grid-cols-6 grid-rows-10 border border-current`}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="border-r border-b border-dashed border-current opacity-40" />
        ))}
      </div>

      {/* Rule of thirds key intersections guide lines */}
      <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
        <div className="border-r border-b border-dashed border-current" />
        <div className="border-r border-b border-dashed border-current" />
        <div className="border-b border-dashed border-current" />
        <div className="border-r border-b border-dashed border-current" />
        <div className="border-r border-b border-dashed border-current" />
        <div className="border-b border-dashed border-current" />
        <div className="border-r border-dashed border-current" />
        <div className="border-r border-dashed border-current" />
        <div className="border-none" />
      </div>

      {/* Interactive Toolbar Header */}
      <div className="relative z-20 w-full bg-black/60 backdrop-blur-xs px-3.5 py-1.5 flex items-center justify-between border-b border-white/5 font-mono text-[8px]">
        <div className="flex items-center space-x-1.5 text-white">
          <Camera className="w-3 h-3 text-[#ff5c00]" />
          <span className="font-extrabold tracking-wider uppercase text-[8.5px]">STORYBOARD MATTE FRAME</span>
        </div>
        <div className="flex items-center space-x-2">
          {onGenerateImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateImage();
              }}
              disabled={imageGenerating}
              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-mono font-black rounded uppercase tracking-wider cursor-pointer flex items-center gap-1 active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed select-none mr-1 shadow-[1px_1px_0px_#000]"
              title="Click here to invoke Gemini AI image rendering for this camera cue"
            >
              <Sparkles className="w-2.5 h-2.5 animate-pulse text-white" />
              <span>{imageGenerating ? "Rendering..." : "Regen Art"}</span>
            </button>
          )}

          {/* Active Style Indicator Badge */}
          <span className="text-[7.5px] px-1.5 py-0.5 bg-white/10 text-white font-medium rounded-xs border border-white/10 uppercase">
            {activeStyle.replace('-', ' ')}
          </span>
          <div className="px-1.5 py-0.5 bg-[#ffcc00] text-black font-extrabold rounded-xs uppercase">
            SCENE: {activeSceneIndex + 1}/{totalScenes}
          </div>
        </div>
      </div>

      {/* Multi-Layered Vector Keyframe Canvas (Wiggling GIF Engine) */}
      <div className="absolute inset-x-4 top-14 bottom-22 z-0 flex items-center justify-center">
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full max-h-[220px]"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={themeStyles.strokePrimary}
          fill="none"
        >
          {/* Rule of thirds key overlays */}
          <circle cx={wiggle(66.6)} cy={wiggle(80)} r="2.5" stroke={themeStyles.strokeSecondary} fill={`${themeStyles.strokeSecondary}44`} />
          <circle cx={wiggle(133.3)} cy={wiggle(80)} r="2.5" stroke={themeStyles.strokeSecondary} fill={`${themeStyles.strokeSecondary}44`} />
          <circle cx={wiggle(66.6)} cy={wiggle(160)} r="2.5" stroke={themeStyles.strokeSecondary} fill={`${themeStyles.strokeSecondary}44`} />
          <circle cx={wiggle(133.3)} cy={wiggle(160)} r="2.5" stroke={themeStyles.strokeSecondary} fill={`${themeStyles.strokeSecondary}44`} />

          {/* Contextual vector animations */}
          {cueKeywords.coffee && (
            <g id="animated-coffee-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              {/* Floor/Table */}
              <path d={wPath([[10, 180], [190, 180]])} strokeDasharray="3 3" opacity={0.6} />
              
              {/* Cup container */}
              <path 
                d={`M ${wiggle(65)},${wiggle(115)} Q ${wiggle(65)},${wiggle(165)} ${wiggle(100)},${wiggle(165)} Q ${wiggle(135)},${wiggle(165)} ${wiggle(135)},${wiggle(115)} Z`} 
                stroke={themeStyles.strokeAccent} 
                strokeWidth="2.5"
                fill={`${themeStyles.strokeAccent}11`}
              />
              
              {/* Strap/Handle */}
              <path 
                d={`M ${wiggle(135)},${wiggle(123)} Q ${wiggle(155)},${wiggle(125)} ${wiggle(150)},${wiggle(143)} Q ${wiggle(145)},${wiggle(153)} ${wiggle(133)},${wiggle(149)}`} 
                stroke={themeStyles.strokeAccent} 
              />

              {/* Rising Coffee Steam loop particles (Frame-dependent wiggling offset) */}
              <path 
                d={`M ${wiggle(85)},${wiggle(95)} Q ${wiggle(88 + (activeFrame === 1 ? 5 : -4))},${wiggle(85)} ${wiggle(85)},${wiggle(75)}`} 
                stroke={themeStyles.strokeSecondary} 
              />
              <path 
                d={`M ${wiggle(100)},${wiggle(92)} Q ${wiggle(103 + (activeFrame === 2 ? 6 : -3))},${wiggle(82)} ${wiggle(100)},${wiggle(72)}`} 
                stroke={themeStyles.strokeSecondary} 
              />
              <path 
                d={`M ${wiggle(115)},${wiggle(95)} Q ${wiggle(118 + (activeFrame === 3 ? 4 : -5))},${wiggle(85)} ${wiggle(115)},${wiggle(75)}`} 
                stroke={themeStyles.strokeSecondary} 
              />

              {/* Pour vector action directions */}
              <path d={wPath([[100, 45], [100, 80]])} stroke={themeStyles.strokeSecondary} />
              <path d={wPath([[94, 72], [100, 80], [106, 72]])} stroke={themeStyles.strokeSecondary} />
            </g>
          )}

          {cueKeywords.screens && (
            <g id="animated-screen-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              {/* Laptop base layout */}
              <path d={wPath([[30, 175], [170, 175], [185, 195], [15, 195]], true)} stroke={themeStyles.strokeAccent} fill={`${themeStyles.strokeAccent}11`} />
              
              {/* Core Screen */}
              <rect x={wiggle(42)} y={wiggle(85)} width={wiggle(116) - wiggle(42)} height={wiggle(168) - wiggle(85)} rx="4" stroke={themeStyles.strokeSecondary} strokeWidth="2.2" />
              
              {/* Wireframes scrolling code rows */}
              <line x1={wiggle(52)} y1={wiggle(100)} x2={wiggle(110)} y2={wiggle(100)} stroke={themeStyles.strokePrimary} />
              <line x1={wiggle(52)} y1={wiggle(115)} x2={wiggle(145 - (activeFrame % 2 === 0 ? 15 : 0))} y2={wiggle(115)} stroke={themeStyles.strokeSecondary} strokeDasharray="2 2" />
              <line x1={wiggle(52)} y1={wiggle(130)} x2={wiggle(130 + (activeFrame % 3 === 0 ? 10 : -10))} y2={wiggle(130)} stroke={themeStyles.strokeSecondary} strokeDasharray="3 2" />
              
              {/* Pulsing blinking interactive caret code tag */}
              {activeFrame % 2 === 0 && (
                <text x="100" y="152" textAnchor="middle" fill={themeStyles.strokeAccent} fontSize="14" fontWeight="bold" stroke="none" className="font-mono">
                  &lt; / &gt;
                </text>
              )}
            </g>
          )}

          {cueKeywords.people && (
            <g id="animated-people-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              {/* Presenter frame profile */}
              <path d={`M ${wiggle(40)},${wiggle(210)} Q ${wiggle(100)},${wiggle(155)} ${wiggle(160)},${wiggle(210)}`} stroke={themeStyles.strokeAccent} strokeWidth="2" />
              
              {/* Round face */}
              <circle cx={wiggle(100)} cy={wiggle(105)} r="32" stroke={themeStyles.strokePrimary} strokeWidth="2.5" fill={`${themeStyles.strokePrimary}0b`} />
              
              {/* Eye focus coordinate lines */}
              <line x1={wiggle(78)} y1={wiggle(105)} x2={wiggle(122)} y2={wiggle(105)} stroke={themeStyles.strokePrimary} strokeWidth="0.8" strokeDasharray="2 2" />
              
              {/* Loop mouth shape (simulating speaking loop!) */}
              <path 
                d={activeFrame % 2 === 0 
                  ? `M ${wiggle(90)},${wiggle(118)} Q ${wiggle(100)},${wiggle(128)} ${wiggle(110)},${wiggle(118)}`
                  : `M ${wiggle(92)},${wiggle(120)} Q ${wiggle(100)},${wiggle(125)} ${wiggle(108)},${wiggle(120)}`
                } 
                stroke={themeStyles.strokeAccent} 
                strokeWidth="2" 
              />

              {/* Dynamic Soundwave ripples (expressive storytelling indicator) */}
              <circle cx={wiggle(100)} cy={wiggle(105)} r={32 + (activeFrame * 4)} stroke={themeStyles.strokeSecondary} strokeWidth="0.8" opacity={1 - activeFrame * 0.25} />
            </g>
          )}

          {cueKeywords.store && (
            <g id="animated-storefront-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              {/* Horizon depth */}
              <line x1="10" y1="180" x2="190" y2="180" stroke={themeStyles.strokePrimary} strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Store profile structure */}
              <path d={wPath([[15, 85], [75, 105], [75, 180], [15, 180]], true)} stroke={themeStyles.strokeAccent} fill={`${themeStyles.strokeAccent}11`} />
              
              {/* Flipping canvas Storefront Awning */}
              <path d={wPath([[10, 90], [80, 110], [75, 122], [12, 105]], true)} stroke={themeStyles.strokePrimary} />
              
              {/* Show rotating storefront neon lights based on loop clocks */}
              <circle cx={wiggle(25)} cy={wiggle(100)} r="2" fill={activeFrame === 0 ? themeStyles.strokeSecondary : 'transparent'} stroke="none" />
              <circle cx={wiggle(45)} cy={wiggle(106)} r="2" fill={activeFrame === 1 ? themeStyles.strokeSecondary : 'transparent'} stroke="none" />
              <circle cx={wiggle(65)} cy={wiggle(112)} r="2" fill={activeFrame === 2 ? themeStyles.strokeSecondary : 'transparent'} stroke="none" />

              {/* Window box coordinates */}
              <rect x={wiggle(25)} y={wiggle(130)} width="30" height="35" stroke={themeStyles.strokeSecondary} />
            </g>
          )}

          {cueKeywords.metrics && (
            <g id="animated-metrics-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              {/* Dynamic axes indicators */}
              <line x1={wiggle(30)} y1={wiggle(180)} x2={wiggle(170)} y2={wiggle(180)} stroke={themeStyles.strokePrimary} strokeWidth="1.5" />
              <line x1={wiggle(30)} y1={wiggle(60)} x2={wiggle(30)} y2={wiggle(180)} stroke={themeStyles.strokePrimary} strokeWidth="1.5" />
              
              {/* Procedural growth curves bouncing at active rate */}
              <path 
                d={`M ${wiggle(30)},${wiggle(170)} Q ${wiggle(70)},${wiggle(165 - (activeFrame * 4))} ${wiggle(100)},${wiggle(120 - (activeFrame * 6))} T ${wiggle(170)},${wiggle(55 - (activeFrame * 8))}`} 
                stroke={themeStyles.strokeSecondary} 
                strokeWidth="2.8" 
              />
              
              {/* Floating dot marker */}
              <circle cx={wiggle(170)} cy={wiggle(55 - (activeFrame * 8))} r="6" fill={themeStyles.strokeAccent} stroke="none" />
            </g>
          )}

          {cueKeywords.package && (
            <g id="animated-package-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              {/* Outer box dimensions */}
              <path d={wPath([[60, 110], [100, 80], [140, 110], [140, 160], [100, 195], [60, 160]], true)} stroke={themeStyles.strokeAccent} fill={`${themeStyles.strokeAccent}0d`} />
              
              {/* Animated flaps loop */}
              <path d={wPath([[60, 110], [40 - (activeFrame * 3), 85 - (activeFrame * 1.5)]])} stroke={themeStyles.strokePrimary} />
              <path d={wPath([[140, 110], [160 + (activeFrame * 3), 85 - (activeFrame * 1.5)]])} stroke={themeStyles.strokePrimary} />

              {/* Bouncing upward release indicator particles inside the box */}
              <path 
                d={wPath([[100, 185], [100, 120 - (activeFrame * 6)]])} 
                stroke={themeStyles.strokeSecondary} 
                strokeDasharray="2 3" 
              />
              <path d={wPath([[94, 130 - (activeFrame * 6)], [100, 120 - (activeFrame * 6)], [106, 130 - (activeFrame * 6)]])} stroke={themeStyles.strokeSecondary} />
            </g>
          )}

          {/* Fallback Gorgeous Isometric Prism when no context is active */}
          {!cueKeywords.coffee && !cueKeywords.screens && !cueKeywords.people && !cueKeywords.store && !cueKeywords.metrics && !cueKeywords.package && (
            <g id="default-isometric-cinemagraph" stroke={themeStyles.strokePrimary} fill="none">
              <path d={wPath([[10, 120], [190, 120]])} strokeDasharray="3 3" opacity={0.4} />

              {/* Rotatable-emulating Isometric Core Prism */}
              <path 
                d={wPath([
                  [100, 45 - (activeFrame * 1.5)], 
                  [145 + (activeFrame * 1.2), 85], 
                  [100, 125 + (activeFrame * 1.5)], 
                  [55 - (activeFrame * 1.2), 85]
                ], true)} 
                stroke={themeStyles.strokeSecondary} 
                strokeWidth="2"
                fill={`${themeStyles.strokeSecondary}0a`}
              />
              
              {/* Interactive anchoring bounding frame corners */}
              <path d={wPath([[32, 60], [32, 40], [52, 40]])} stroke={themeStyles.strokeAccent} strokeWidth="2.2" />
              <path d={wPath([[168, 60], [168, 40], [148, 40]])} stroke={themeStyles.strokeAccent} strokeWidth="2.2" />
              <path d={wPath([[32, 160], [32, 180], [52, 180]])} stroke={themeStyles.strokeAccent} strokeWidth="2.2" />
              <path d={wPath([[168, 160], [168, 180], [148, 180]])} stroke={themeStyles.strokeAccent} strokeWidth="2.2" />

              <text x="100" y="234" textAnchor="middle" fill={themeStyles.strokeAccent} fontSize="8.5" fontWeight="black" stroke="none" className="font-mono uppercase tracking-wider">
                MATTE KEYFRAME GENERATOR
              </text>
            </g>
          )}

          {/* Dynamic Active Direction Camera Vectors */}
          {shotDetails.motionType.includes('ZOOM') && (
            <g id="motion-overlay-zoom">
              <path d={wPath([[20, 20], [38, 38]])} stroke={themeStyles.strokeAccent} strokeWidth="2" />
              <path d={wPath([[180, 20], [162, 38]])} stroke={themeStyles.strokeAccent} strokeWidth="2" />
              <circle cx="100" cy="115" r={8 + (activeFrame * 4)} stroke={themeStyles.strokeAccent} strokeDasharray="2 3" />
            </g>
          )}
          {shotDetails.motionType.includes('PAN') && (
            <g id="motion-overlay-pan">
              <path d={wPath([[22, 115], [178, 115]])} stroke={themeStyles.strokeSecondary} strokeWidth="2" strokeDasharray="5 3" />
              {/* Arrow Heads */}
              <path d={wPath([[32, 108], [22, 115], [32, 122]])} stroke={themeStyles.strokeSecondary} strokeWidth="2" />
              <path d={wPath([[168, 108], [178, 115], [168, 122]])} stroke={themeStyles.strokeSecondary} strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>

      {/* Frame Interactive Controls HUD Bar inside the canvas border context */}
      <div className="relative z-20 mx-3 mt-auto mb-2 p-2 bg-black/90 border-2 border-black rounded-xl flex flex-col space-y-1.5 shadow-[2px_2px_0px_#000]">
        
        {/* Style selection buttons + Play speed sequencer controls */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-white/10 pb-2">
          
          {/* Preset Styles - Interactive 4-options filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[8px] text-white/50 font-mono font-bold mr-1 uppercase">Filter:</span>
            <button
              onClick={() => setActiveStyle('blueprint-traditional')}
              className={`w-3.5 h-3.5 rounded-full bg-[#1e3a8a] border border-[#00d1ff] cursor-pointer transition-transform active:scale-90 ${activeStyle === 'blueprint-traditional' ? 'ring-2 ring-sky-300 ring-offset-1 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Blueprint Traditional"
            />
            <button
              onClick={() => setActiveStyle('charcoal-paper')}
              className={`w-3.5 h-3.5 rounded-full bg-[#2d3748] border border-neutral-400 cursor-pointer transition-transform active:scale-90 ${activeStyle === 'charcoal-paper' ? 'ring-2 ring-neutral-200 ring-offset-1 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Charcoal Paper"
            />
            <button
              onClick={() => setActiveStyle('sunset-matte')}
              className={`w-3.5 h-3.5 rounded-full bg-[#ea580c] border border-rose-500 cursor-pointer transition-transform active:scale-90 ${activeStyle === 'sunset-matte' ? 'ring-2 ring-rose-450 ring-offset-1 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Sunset Cinematic Matte"
            />
            <button
              onClick={() => setActiveStyle('neon-terminal')}
              className={`w-3.5 h-3.5 rounded-full bg-[#090d16] border border-emerald-500 cursor-pointer transition-transform active:scale-90 ${activeStyle === 'neon-terminal' ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100'}`}
              title="Neon Terminal"
            />
          </div>

          {/* Play/Pause state looper and FPS speeds */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 text-black bg-white hover:bg-neutral-100 rounded-md border border-neutral-300 font-mono text-[9px] font-black uppercase flex items-center space-x-1 cursor-pointer transition-colors active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-2.5 h-2.5 fill-black" />
                  <span>Pause Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-black" />
                  <span>Start loop</span>
                </>
              )}
            </button>

            {/* Simulated Frame Interval Controls */}
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              disabled={!isPlaying}
              className="bg-neutral-800 text-white text-[8px] font-mono border border-neutral-700 rounded px-1.5 py-0.5"
            >
              <option value={1}>1 FPS (Sketch)</option>
              <option value={3}>3 FPS (Animatic)</option>
              <option value={6}>6 FPS (Cinemagraph)</option>
              <option value={12}>12 FPS (Smooth GIF)</option>
            </select>
          </div>

        </div>

        {/* Informative Camera metadata */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[8.5px] leading-tight text-neutral-300">
          <div>
            CUE SHOT: <span className="text-[#ffcc00] font-extrabold block truncate">{shotDetails.shotType}</span>
          </div>
          <div className="text-right">
            MOTION: <span className="text-[#00d1ff] font-extrabold block truncate">{shotDetails.motionType}</span>
          </div>
          <div className="pt-1.5 border-t border-white/5 text-neutral-400">
            RATIO LENS: <span className="text-white font-extrabold block">{shotDetails.focalLength} • {shotDetails.aperture}</span>
          </div>
          <div className="text-right pt-1.5 border-t border-white/5 text-neutral-400">
            FRAME-RATE: <span className="text-amber-400 font-extrabold block">{isPlaying ? `${fps} FPS LOOPING GIF` : 'PAUSED'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
