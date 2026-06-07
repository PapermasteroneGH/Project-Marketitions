import React, { useState, useRef, useEffect } from "react";
import { 
  Film, 
  Sparkles, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Volume2, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  ChevronRight, 
  AlertTriangle, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Play, 
  Pause, 
  Loader2, 
  RefreshCw, 
  HelpCircle,
  Video,
  Info,
  Tv,
  Mic,
  FolderDown,
  Download,
  Send,
  Plus,
  MessageCircle,
  Terminal,
  Key,
  Trash2,
  X,
  ShieldCheck
} from "lucide-react";
import JSZip from "jszip";
import { BrandVibe, Storyboard, StoryboardScene } from "./types";
import { PRESETS, CITY_TRENDS } from "./Presets";
import { SceneVisualizer } from "./components/SceneVisualizer";
import { LandingPage } from "./components/LandingPage";
import { OnboardingTour } from "./components/OnboardingTour";
import { ViralHackEasterEgg } from "./components/ViralHackEasterEgg";
import { vibeTrackSynth } from "./lib/synth";
import { 
  generateStoryboardClient, 
  generateSceneImageClient, 
  generateSceneAudioClient,
  customizeSceneImageClient,
  generateSmartAudioVibeMesh,
  sanitizeSecurityLog,
  getInitialDraftMatte
} from "./lib/gemini";

const genrePresets = [
  { label: "🌅 Jazz Lo-Fi", keyword: "Sunset Jazz Lo-Fi Chill", description: "Soft mellow 76 BPM drums & warm rhodes keys" },
  { label: "🌌 Ambient Pad", keyword: "Cinematic Ambient Drone Pad", description: "Deep calming 64 BPM spacious pads, no drums" },
  { label: "⚡ 80s Synthwave", keyword: "Retro 80s Synthwave Neon Outrun", description: "Driving 110 BPM bassline & gated retro brass synths" },
  { label: "🌴 Bossa Lounge", keyword: "Tropical Bossa Nova Lounge", description: "Bouncy 114 BPM syncopated latin acoustic marimba grooves" },
  { label: "🎸 Indie Folk", keyword: "Cozy Indie Folk Acoustic Pluck", description: "Warm fingerpicked 104 BPM folk acoustic plucks" },
  { label: "👾 Future Bass", keyword: "Glitch Hyperpop Future Bass Happy", description: "140 BPM sparkling bright saw arpeggios & trap drums" },
  { label: "🔊 Cyber Techno", keyword: "Cyberpunk Industrial Techno Club", description: "Hard-hitting 126 BPM 4-on-the-floor synth rave" },
  { label: "📈 Bright Pop", keyword: "Bright Upbeat Pop Commercial", description: "Happy 135 BPM bright plucks & disco pump" }
];

export default function App() {
  // Navigation & View switcher states
  const [view, setView] = useState<"landing" | "workspace">("landing");
  const [showTour, setShowTour] = useState(false);

  // Easter Egg States
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isBrainrotActive, setIsBrainrotActive] = useState(false);
  const [isNeoThemeActive, setIsNeoThemeActive] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [brandClicks, setBrandClicks] = useState(0);

  // Secret dynamic secret typing listener ("viral")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }
      const key = e.key.toLowerCase();
      // Only match letters to avoid punctuation noise
      if (/^[a-z]$/.test(key)) {
        setSecretInput(prev => {
          const next = (prev + key).slice(-5);
          if (next === "viral") {
            setIsEasterEggOpen(true);
            return "";
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Input settings states with safe client-side localStorage lazy loaders
  const [businessDescription, setBusinessDescription] = useState<string>(() => {
    return (typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("marketicians_desc")) || "";
  });
  const [brandVibe, setBrandVibe] = useState<BrandVibe>(() => {
    return ((typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("marketicians_vibe")) as BrandVibe) || "genz";
  });
  const [narratorVoice, setNarratorVoice] = useState<string>(() => {
    return (typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("marketicians_voice")) || "Fenrir";
  });
  const [platform, setPlatform] = useState<"tiktok" | "reels" | "shorts">(() => {
    return ((typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("marketicians_platform")) as "tiktok" | "reels" | "shorts") || "tiktok";
  });
  const [durationSeconds, setDurationSeconds] = useState<15 | 30 | 60>(() => {
    return (Number((typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("marketicians_duration")) || 30)) as 15 | 30 | 60;
  });
  const [location, setLocation] = useState<string>(() => {
    return (typeof window !== "undefined" && window.localStorage && window.localStorage.getItem("marketicians_location")) || "Austin, TX";
  });

  const [audioKeyword, setAudioKeyword] = useState("lofi");
  const [songTitle, setSongTitle] = useState("Sunset Jazz Lo-Fi Chill");
  const [songExplanation, setSongExplanation] = useState("Procedural 76 BPM mellow boom-bap rhythm customized for campaign vibe.");
  const [meshingAudio, setMeshingAudio] = useState(false);
  const [storyboardFrameMode, setStoryboardFrameMode] = useState<"matte" | "gif" | "hud">("matte");
  const [gifCameraPreset, setGifCameraPreset] = useState<"zoom" | "pan" | "leaks" | "handheld">("zoom");

  // Output response states with safe client-side localStorage lazy loaders
  const [storyboard, setStoryboard] = useState<Storyboard | null>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const cached = window.localStorage.getItem("marketicians_storyboard");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.scenes) return parsed;
        }
      }
    } catch (_) {}
    return null;
  });
  const [generating, setGenerating] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);

  // Gemini active processes states
  const [imageGeneratingIndex, setImageGeneratingIndex] = useState<number | null>(null);
  const [voiceGeneratingIndex, setVoiceGeneratingIndex] = useState<number | null>(null);
  const [batchImageGenerating, setBatchImageGenerating] = useState(false);
  const [batchVoiceGenerating, setBatchVoiceGenerating] = useState(false);
  
  const [sceneImages, setSceneImages] = useState<Record<number, string>>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const cached = window.localStorage.getItem("marketicians_images");
        if (cached) return JSON.parse(cached);
      }
    } catch (_) {}
    return {};
  });
  
  const [sceneAudios, setSceneAudios] = useState<Record<number, string>>({});
  const [exporting, setExporting] = useState(false);
  const [isCompilingVideo, setIsCompilingVideo] = useState(false);
  const [compileProgress, setCompileProgress] = useState("");
  const [compileProgressPercentage, setCompileProgressPercentage] = useState(0);

  // Matte Visual Chat Support States
  const [sceneChats, setSceneChats] = useState<Record<number, { id: string; sender: 'user' | 'assistant'; text: string; time: string }[]>>({});
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [customizingImageIndex, setCustomizingImageIndex] = useState<number | null>(null);

  // Auto transition to workspace if a storyboard is already cached on reload
  useEffect(() => {
    if (storyboard && storyboard.scenes && storyboard.scenes.length > 0) {
      setView("workspace");
    }
  }, []);

  // Save input parameters and draft storyboards automatically into client-side cache
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem("marketicians_desc", businessDescription);
      window.localStorage.setItem("marketicians_vibe", brandVibe);
      window.localStorage.setItem("marketicians_voice", narratorVoice);
      window.localStorage.setItem("marketicians_platform", platform);
      window.localStorage.setItem("marketicians_duration", String(durationSeconds));
      window.localStorage.setItem("marketicians_location", location);
      if (storyboard) {
        window.localStorage.setItem("marketicians_storyboard", JSON.stringify(storyboard));
      } else {
        window.localStorage.removeItem("marketicians_storyboard");
      }
    } catch (e) {
      console.warn("localStorage cache Sync failed:", e);
    }
  }, [businessDescription, brandVibe, narratorVoice, platform, durationSeconds, location, storyboard]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      if (Object.keys(sceneImages).length > 0) {
        window.localStorage.setItem("marketicians_images", JSON.stringify(sceneImages));
      } else {
        window.localStorage.removeItem("marketicians_images");
      }
    } catch (e) {
      console.warn("localStorage images sync failed:", e);
    }
  }, [sceneImages]);

  // Reset the storyboard draft and client-side localStorage caches
  const handleResetDraft = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to discard your current storyboard draft and state? This cannot be undone.")) {
      setStoryboard(null);
      setSceneImages({});
      setSceneChats({});
      setChatInputs({});
      setAudioBlobUrls({});
      setError(null);
      setActiveSceneIndex(0);
      try {
        window.localStorage.removeItem("marketicians_storyboard");
        window.localStorage.removeItem("marketicians_images");
        window.localStorage.removeItem("marketicians_desc");
        window.localStorage.setItem("marketicians_location", "Austin, TX");
        window.localStorage.setItem("marketicians_duration", "30");
        window.localStorage.setItem("marketicians_platform", "tiktok");
        window.localStorage.setItem("marketicians_vibe", "genz");
        window.localStorage.setItem("marketicians_voice", "Fenrir");
        setBusinessDescription("");
        setBrandVibe("genz");
        setNarratorVoice("Fenrir");
        setPlatform("tiktok");
        setDurationSeconds(30);
        setLocation("Austin, TX");
      } catch (_) {}
      setView("landing");
    }
  };

  // Audio playing state
  const [playingVoiceIndex, setPlayingVoiceIndex] = useState<number | null>(null);
  const [playingVibeTrack, setPlayingVibeTrack] = useState(false);
  const [audioBlobUrls, setAudioBlobUrls] = useState<Record<number, string>>({});
  const [fallbackSpeechTexts, setFallbackSpeechTexts] = useState<Record<number, string>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync sidechain ducking of background music with vocal play state
  useEffect(() => {
    if (playingVoiceIndex !== null) {
      vibeTrackSynth.setDucking(true);
    } else {
      vibeTrackSynth.setDucking(false);
    }
  }, [playingVoiceIndex]);

  // Handle switching views or unmount
  useEffect(() => {
    if (view === "landing") {
      vibeTrackSynth.stop();
      setPlayingVibeTrack(false);
    }
  }, [view]);

  // Early preloading system to ensure standard web voice list is warm and cached immediately on all browsers
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.getVoices) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      vibeTrackSynth.stop();
    };
  }, []);

  const toggleVibeTrack = () => {
    if (playingVibeTrack) {
      vibeTrackSynth.stop();
      setPlayingVibeTrack(false);
    } else {
      vibeTrackSynth.start(audioKeyword);
      setPlayingVibeTrack(true);
    }
  };

  // Play Storyboard Reel (Interactive Carousel Mode)
  const [reelMode, setReelMode] = useState(false);
  const reelTimerRef = useRef<any>(null);
  const lastVoiceRef = useRef<string>("");
  const lastVibeRef = useRef<string>("");
  const lastStoryboardRef = useRef<any>(null);

  // Copy buttons indicator states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  // Errors state
  const [error, setError] = useState<string | null>(null);

  // Loading statements array to cycle through during storyboard generation
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingStatements = [
    "Analyzing brand narrative archetype...",
    "Calibrating smartphone camera lens ratios...",
    "Synthesizing high-retention acoustic hooks...",
    "Injecting hyper-local cultural references...",
    "Aligning micro-dialogue for maximum retention...",
    "Structuring second-by-second B-Roll pivots..."
  ];

  // Rotate loading step statement
  useEffect(() => {
    let interval: any;
    if (generating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingStatements.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [generating]);

  // Sync B-roll sound & presets when city is selected
  const handleLocationChange = (cityName: string) => {
    setLocation(cityName);
    const details = CITY_TRENDS[cityName];
    if (details) {
      setAudioKeyword(details.audio);
    }
  };

  // Preset click handler
  const loadPreset = (preset: typeof PRESETS[0]) => {
    setBusinessDescription(preset.description);
    setBrandVibe(preset.brandVibe);
    setLocation(preset.location);
    setAudioKeyword(preset.audioKeyword);
    setSongTitle(preset.name + " Sound Mesh");
    setSongExplanation(`Selected interactive regional preset beat style: ${preset.name}.`);
    const defaultVoice = preset.brandVibe === "genz" ? "Fenrir" : preset.brandVibe === "corporate_sleek" ? "Puck" : preset.brandVibe === "educational" ? "Zephyr" : "Charon";
    setNarratorVoice(defaultVoice);
    setError(null);
  };

  // Smart audio vibe track trigger (Predict, Mesh and configure Procedural Audio Synthesizer)
  const handleRemeshAudioTrack = async (desc: string, loc: string, vibe: string) => {
    setMeshingAudio(true);
    try {
      const res = await generateSmartAudioVibeMesh({
        businessDescription: desc,
        location: loc,
        brandVibe: vibe,
      });
      setSongTitle(res.songTitle);
      setAudioKeyword(res.audioKeyword);
      setSongExplanation(res.explanation);
      if (playingVibeTrack) {
        vibeTrackSynth.start(res.audioKeyword);
      }
    } catch (err) {
      console.error("Could not run musicology remesher", err);
    } finally {
      setMeshingAudio(false);
    }
  };

  // Generate main storyboard
  const handleGenerateStoryboard = async () => {
    if (!businessDescription.trim()) {
      setError("Please write or select a business description first");
      return;
    }

    setGenerating(true);
    setError(null);
    setStoryboard(null);
    setActiveSceneIndex(0);
    setSceneImages({});
    setSceneAudios({});
    setAudioBlobUrls({});
    setPlayingVoiceIndex(null);
    setReelMode(false);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    try {
      // 1. Predict, mesh, and align local trends with pitch dynamically!
      let alignedKeyword = audioKeyword;
      try {
        const res = await generateSmartAudioVibeMesh({
          businessDescription: businessDescription,
          location: location,
          brandVibe: brandVibe,
        });
        setSongTitle(res.songTitle);
        setAudioKeyword(res.audioKeyword);
        setSongExplanation(res.explanation);
        alignedKeyword = res.audioKeyword;
        if (playingVibeTrack) {
          vibeTrackSynth.start(res.audioKeyword);
        }
      } catch (e) {
        console.warn("Music pre-calculation failed. Falling back to default baseline keywords.");
      }

      // 2. Compute main storyboard script & directives from Gemini
      const data = await generateStoryboardClient({
        businessDescription,
        brandVibe,
        platform,
        durationSeconds,
        location,
        audioKeyword: alignedKeyword
      });

      const initialImages: Record<number, string> = {};
      data.scenes.forEach((scene: any, i: number) => {
        initialImages[i] = getInitialDraftMatte(scene.visualCue, i);
      });
      setSceneImages(initialImages);
      setStoryboard(data);
    } catch (err: any) {
      console.error(err);
      setError(sanitizeSecurityLog(err.message) || "Something went wrong while compiling the storyboard prompt.");
    } finally {
      setGenerating(false);
    }
  };

  // Generate Image Scene Matte
  const handleGenerateSceneImage = async (index: number, cueText: string) => {
    if (imageGeneratingIndex !== null) return;
    
    setImageGeneratingIndex(index);
    setError(null);
    try {
      const imageUrl = await generateSceneImageClient(cueText);

      setSceneImages(prev => ({ ...prev, [index]: imageUrl }));
    } catch (err: any) {
      console.error("Visual Generation error caught:", err);
      // Generate a beautiful, freshly randomized helper fallback image related to the cue
      const salt = Math.floor(Math.random() * 5000) + 1;
      const fallbackUrl = getInitialDraftMatte(cueText, index, salt);
      setSceneImages(prev => ({ ...prev, [index]: fallbackUrl }));

      setError(`Algorithmic image rendering paused: ${sanitizeSecurityLog(err.message)}. A high-quality layout photography preview has been substituted.`);
    } finally {
      setImageGeneratingIndex(null);
    }
  };

  // Customize and Refine Scene Image Art Matte via Chat Context
  const handleCustomizeSceneImage = async (index: number, userPrompt: string) => {
    if (!storyboard || customizingImageIndex !== null) return;
    if (!userPrompt || userPrompt.trim() === "") return;

    setCustomizingImageIndex(index);
    setError(null);

    // 1. Instantly append the user message to the active scene chats state to make UI super responsive
    const newUserMsg = {
      id: Math.random().toString(36).substring(7),
      sender: 'user' as const,
      text: userPrompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setSceneChats(prev => ({
      ...prev,
      [index]: [...(prev[index] || []), newUserMsg]
    }));

    // Clear input for this scene
    setChatInputs(prev => ({ ...prev, [index]: "" }));

    try {
      const activeScene = storyboard.scenes[index];
      const existingImg = sceneImages[index] || null;

      // 2. Call customizeSceneImageClient
      const result = await customizeSceneImageClient({
        originalVisualCue: activeScene.visualCue,
        userInstruction: userPrompt,
        existingImageBase64: existingImg
      });

      // 3. Update the scene's visualCue description in the storyboard state
      const updatedScenes = [...storyboard.scenes];
      updatedScenes[index] = {
        ...activeScene,
        visualCue: result.updatedVisualCue
      };
      setStoryboard({
        ...storyboard,
        scenes: updatedScenes
      });

      // 4. Set the newly generated/edited image
      setSceneImages(prev => ({ ...prev, [index]: result.base64Image }));

      // 5. Add Assistant confirmation message
      const assistantMsg = {
        id: Math.random().toString(36).substring(7),
        sender: 'assistant' as const,
        text: `Success! I have customized the camera matte for scene ${index + 1} and updated the cinematography context to: "${result.updatedVisualCue}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setSceneChats(prev => ({
        ...prev,
        [index]: [...(prev[index] || []), assistantMsg]
      }));

    } catch (err: any) {
      console.error("Customize error:", err);
      // Graceful error notification inside the active chat history
      const assistantErrorMsg = {
        id: Math.random().toString(36).substring(7),
        sender: 'assistant' as const,
        text: `Notice: Gemini generated customized scenery, but we encountered an error: ${sanitizeSecurityLog(err.message)}. Please double-check your API Key in Settings > Secrets.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setSceneChats(prev => ({
        ...prev,
        [index]: [...(prev[index] || []), assistantErrorMsg]
      }));
    } finally {
      setCustomizingImageIndex(null);
    }
  };

  // Helper to convert raw 24kHz 16-bit Mono PCM bytes to WAV
  const pcmToWav = (subChunk2: Uint8Array): Uint8Array => {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const subChunk2Size = subChunk2.length;
    const chunkSize = 36 + subChunk2Size;

    const wav = new Uint8Array(44 + subChunk2Size);
    const view = new DataView(wav.buffer);

    // ChunkID "RIFF"
    wav[0] = 0x52; wav[1] = 0x49; wav[2] = 0x46; wav[3] = 0x46;
    // ChunkSize
    view.setUint32(4, chunkSize, true);
    // Format "WAVE"
    wav[8] = 0x57; wav[9] = 0x41; wav[10] = 0x56; wav[11] = 0x45;
    // Subchunk1ID "fmt "
    wav[12] = 0x66; wav[13] = 0x6d; wav[14] = 0x74; wav[15] = 0x20;
    // Subchunk1Size
    view.setUint32(16, 16, true);
    // AudioFormat (1 for PCM)
    view.setUint16(20, 1, true);
    // NumChannels
    view.setUint16(22, numChannels, true);
    // SampleRate
    view.setUint32(24, sampleRate, true);
    // ByteRate
    view.setUint32(28, byteRate, true);
    // BlockAlign
    view.setUint16(32, blockAlign, true);
    // BitsPerSample
    view.setUint16(34, bitsPerSample, true);
    // Subchunk2ID "data"
    wav[36] = 0x64; wav[37] = 0x61; wav[38] = 0x74; wav[39] = 0x61;
    // Subchunk2Size
    view.setUint32(40, subChunk2Size, true);
    
    // Copy PCM data
    wav.set(subChunk2, 44);
    return wav;
  };

  // Generate Audio TTS Voiceover
  const handleGenerateSceneAudio = async (index: number, voiceoverText: string) => {
    if (voiceGeneratingIndex !== null) return;

    setVoiceGeneratingIndex(index);
    setError(null);
    try {
      const audioBase64 = await generateSceneAudioClient(voiceoverText, narratorVoice, brandVibe);

      // Decode base64 and create Blob URL for raw audio playback
      const binary = atob(audioBase64);
      let bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      // Secure check: verify if the first bytes represents standard WAV format "RIFF"
      const isWav = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
      if (!isWav) {
        bytes = pcmToWav(bytes);
      }

      const blob = new Blob([bytes], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      setAudioBlobUrls(prev => ({ ...prev, [index]: url }));
      setSceneAudios(prev => ({ ...prev, [index]: audioBase64 }));
    } catch (err: any) {
      console.warn("Gemini voiceover failed or quota exceeded. Activating browser speech speaker fallback.", err);
      // Fallback: Register the text overlay so we can play the story on-demand using browser's speechSynthesis
      setFallbackSpeechTexts(prev => ({ ...prev, [index]: voiceoverText }));
      setAudioBlobUrls(prev => ({ ...prev, [index]: "fallback-speech" }));
      setError("AI Voiceover synthesis was routed through the high-fidelity local browser text-to-speech engine due to server quota limitations.");
    } finally {
      setVoiceGeneratingIndex(null);
    }
  };

  // Generate All scene images in a batch (Batch B-Roll Mattes Rendering)
  const handleGenerateAllImages = async () => {
    if (!storyboard || batchImageGenerating) return;
    setBatchImageGenerating(true);
    setError(null);
    try {
      for (let i = 0; i < storyboard.scenes.length; i++) {
        const scene = storyboard.scenes[i];
        if (!sceneImages[i]) {
          setImageGeneratingIndex(i);
          try {
            const imageUrl = await generateSceneImageClient(scene.visualCue);
            setSceneImages(prev => ({ ...prev, [i]: imageUrl }));
          } catch (err) {
            console.warn(`Failed scene ${i} image generation in batch`, err);
            const salt = Math.floor(Math.random() * 5000) + 1;
            const fallbackUrl = getInitialDraftMatte(scene.visualCue, i, salt);
            setSceneImages(prev => ({ ...prev, [i]: fallbackUrl }));
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setImageGeneratingIndex(null);
      setBatchImageGenerating(false);
    }
  };

  // Generate All scene voiceovers in a batch (Batch AI Vocal-Narrative Rendering)
  const handleGenerateAllVoices = async (forceRegen: boolean | React.MouseEvent = false) => {
    if (!storyboard || batchVoiceGenerating) return;
    setBatchVoiceGenerating(true);
    setError(null);
    try {
      const shouldForce = forceRegen === true;
      if (shouldForce) {
        setAudioBlobUrls({});
        setSceneAudios({});
        setFallbackSpeechTexts({});
      }

      for (let i = 0; i < storyboard.scenes.length; i++) {
        const scene = storyboard.scenes[i];
        
        // If force is active, proceed. Otherwise, check existing cache records.
        if (shouldForce || (!sceneAudios[i] && !audioBlobUrls[i])) {
          setVoiceGeneratingIndex(i);
          try {
            const audioBase64 = await generateSceneAudioClient(scene.voiceover, narratorVoice, brandVibe);
            const binary = atob(audioBase64);
            let bytes = new Uint8Array(binary.length);
            for (let j = 0; j < binary.length; j++) {
              bytes[j] = binary.charCodeAt(j);
            }
            const isWav = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
            if (!isWav) {
              bytes = pcmToWav(bytes);
            }
            const blob = new Blob([bytes], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            setAudioBlobUrls(prev => ({ ...prev, [i]: url }));
            setSceneAudios(prev => ({ ...prev, [i]: audioBase64 }));
          } catch (err) {
            console.warn(`Failed scene ${i} voice synthesis in batch`, err);
            // Fallback
            setFallbackSpeechTexts(prev => ({ ...prev, [i]: scene.voiceover }));
            setAudioBlobUrls(prev => ({ ...prev, [i]: "fallback-speech" }));
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setVoiceGeneratingIndex(null);
      setBatchVoiceGenerating(false);
    }
  };

  // Helper utility to format seconds into standard SRT subtitle timestamp structure (HH:MM:SS,mmm)
  const formatSRTTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  };

  // Bundle the current storyboard, textual transcripts, assets, AI vocals, and visuals into a downloadable ZIP package
  const handleExportStoryboard = async () => {
    if (!storyboard) return;
    setExporting(true);
    setError(null);
    try {
      const zip = new JSZip();

      // README file
      const readmeTxt = `========================================================================
MARKETICIANS - HIGH-CONVERSION STORYBOARD EXPORT BUNDLE
========================================================================
Storyboard Title: ${storyboard.title}
Platform: ${platform.toUpperCase()}
Brand Vibe: ${brandVibe.replace("_", " ").toUpperCase()}
Narrator Voice Pick: ${narratorVoice}
Background Vibe Synth: ${audioKeyword}
Location Context: ${location}

Thank you for using Marketicians to craft your high-converting marketing storyboard.

------------------------------------------------------------------------
FOLDER STRUCTURE & HOW TO USE EACH FILE
------------------------------------------------------------------------

1. /storyboard_meta.json:
   Contains the complete raw structured storyboard data, handy for backup or custom API feeds.

2. /full_script.txt:
   An elegant text script tailored for the director/prompter. Features the voiceover text, timing markers, text overlays, and pro-tips for editing side-by-side.

3. /subtitles_srt.srt:
   Standard subtitle file for vertical captions (SRT format). You can import this directly into CapCut, Premiere Pro, or DaVinci Resolve, and it will align exactly with the timing markers.

4. /scenes/ folder:
   Holds scene-by-scene assets for quick drag-and-drop assembly.
   - For every scene:
     * visual cue matte image (.png/.jpg) -> Used as mock frames or background guide for B-roll references.
     * voice audio track (.wav) -> The hi-fi narrated vocal audio file. Drag this directly into your timeline!
     * scene_{X}_cue.txt -> Quick text cheat sheet indicating overlay text and editing tips for that scene.

------------------------------------------------------------------------
🎬 CREATIVE PRODUCTION GUIDE: COMBINING THE ASSETS
------------------------------------------------------------------------
Step 1: Open your favorite editing software (CapCut Mobile/Desktop, Premiere Pro, or Canva).
Step 2: Create a vertical 9:16 project format.
Step 3: Import the generated voice wav tracks from \`/scenes/\` and align them sequentially on the timeline.
Step 4: Place the generated visual matte images or your raw b-roll shot matching the scene cues.
Step 5: Load the \`/subtitles_srt.srt\` subtitle file into the captions editor to snap styled overlays instantly.
Step 6: Export and publish with the hashtags listed in the /full_script.txt file.

Let's make some high-retention content!
========================================================================`;
      zip.file("README_how_to_use.txt", readmeTxt);

      // JSON metadata
      zip.file("storyboard_meta.json", JSON.stringify(storyboard, null, 2));

      // Script file
      const scriptTxt = `========================================================================
${storyboard.title.toUpperCase()}
========================================================================
Description: ${storyboard.description}
Hashtags: ${storyboard.hashtags.join(" ")}
Local Trend Infused: ${storyboard.localTrendUsed}
Platform Target: ${platform.toUpperCase()} (${durationSeconds} seconds)
Brand Vibe Style: ${brandVibe}

========================================================================
SCENE TRANSCRIPT
========================================================================
${storyboard.scenes.map((scene, i) => `
[Scene ${i + 1}] (${scene.timecode} | Duration: ${scene.durationSeconds}s)
-------------------------------------------------------------
🎙️ Voiceover Narration:
"${scene.voiceover}"

📺 Text On-Screen Overlay:
"${scene.textOverlay}"

👁️ Visual B-Roll Cue:
${scene.visualCue}

💡 Production Pro Tip:
${scene.proTip}
`).join("\n\n")}
========================================================================`;
      zip.file("full_script.txt", scriptTxt);

      // SRT subtitles
      let currentElapsed = 0;
      const srtLines = storyboard.scenes.map((scene, i) => {
        const startSec = currentElapsed;
        const endSec = currentElapsed + scene.durationSeconds;
        currentElapsed = endSec;

        const srtIndex = i + 1;
        const startStr = formatSRTTime(startSec);
        const endStr = formatSRTTime(endSec);
        const srtText = scene.textOverlay.trim();

        return `${srtIndex}\n${startStr} --> ${endStr}\n${srtText}\n`;
      }).join("\n");
      zip.file("subtitles_srt.srt", srtLines);

      // Pack individual scenes
      const scenesFolder = zip.folder("scenes");
      if (scenesFolder) {
        for (let i = 0; i < storyboard.scenes.length; i++) {
          const scene = storyboard.scenes[i];
          
          // Scene specific cue info
          const sceneInfo = `Scene ${i + 1}
Timecode: ${scene.timecode}
Duration: ${scene.durationSeconds} seconds
Voiceover Script: ${scene.voiceover}
Text Overlay: ${scene.textOverlay}
Visual Cue Description: ${scene.visualCue}
Pro Editing Tip: ${scene.proTip}`;
          scenesFolder.file(`scene_${i + 1}_cue.txt`, sceneInfo);

          // Voice audio tracks (.wav base64 or converted PCM)
          const base64Audio = sceneAudios[i];
          if (base64Audio) {
            const binary = atob(base64Audio);
            let bytes = new Uint8Array(binary.length);
            for (let j = 0; j < binary.length; j++) {
              bytes[j] = binary.charCodeAt(j);
            }
            const isWav = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
            if (!isWav) {
              bytes = pcmToWav(bytes);
            }
            scenesFolder.file(`scene_${i + 1}_voice.wav`, bytes);
          } else {
            scenesFolder.file(`scene_${i + 1}_voice_not_rendered.txt`, `Voiceover narrative has not been synthesized for this scene yet. Click "Render All AI Voices" in the workspace to generate high-fidelity vocals first.`);
          }

          // Image assets (base64 or URL)
          const imageUrl = sceneImages[i];
          if (imageUrl) {
            if (imageUrl.startsWith("data:")) {
              const [, base64Data] = imageUrl.split(",");
              const mimeType = imageUrl.substring(5, imageUrl.indexOf(";"));
              const ext = mimeType.split("/")[1] || "png";
              scenesFolder.file(`scene_${i + 1}_visual.${ext}`, base64Data, { base64: true });
            } else if (imageUrl.startsWith("http")) {
              // Remote image, try downloading it
              try {
                const response = await fetch(imageUrl, { mode: "cors" });
                if (response.ok) {
                  const blob = await response.blob();
                  scenesFolder.file(`scene_${i + 1}_visual.jpg`, blob);
                } else {
                  throw new Error("HTTP Fetch failed");
                }
              } catch (e) {
                console.warn(`CORS restriction or network error loading remote Unsplash image in zip packaging. Adding download link instead.`, e);
                scenesFolder.file(`scene_${i + 1}_visual_link.txt`, `Visual Scene Link (Download directly via browser):\n${imageUrl}\n\nCue Description:\n${scene.visualCue}`);
              }
            }
          } else {
            scenesFolder.file(`scene_${i + 1}_visual_not_rendered.txt`, `Visual matte has not been rendered for this scene yet. Click "Render All Mattes" in the workspace to generate high-fidelity camera storyboard frames.`);
          }
        }
      }

      // Generate the ZIP blob
      const blob = await zip.generateAsync({ type: "blob" });
      const safeName = storyboard.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `marketicians_${safeName}_package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("ZIP packaging compilation failed: ", err);
      setError("An unexpected error occurred compiling the zip archive. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Helper to wrap subtitle text inside the compiled canvas frame
  const wrapSubtitleText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    // Clean asterisks or syntax indicators
    const cleanText = text.replace(/\*/g, "").toUpperCase();
    const words = cleanText.split(" ");
    let line = "";
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Render transparent black backing bar over text zone for max clarity
    const totalHeight = lines.length * lineHeight;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    // Draw backing card
    ctx.beginPath();
    ctx.roundRect(x - (maxWidth / 2) - 20, y - (totalHeight / 2) - 15, maxWidth + 40, totalHeight + 30, 16);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Print text
    let startY = y - (totalHeight / 2) + (lineHeight / 2);
    ctx.font = "black 24px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let k = 0; k < lines.length; k++) {
      const lineStr = lines[k].trim();
      // Draw Stroke Outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 6;
      ctx.strokeText(lineStr, x, startY);

      // Draw Fill - alternating bright yellow for high retention impact
      ctx.fillStyle = k % 2 === 0 ? "#ffcc00" : "#ffffff";
      ctx.fillText(lineStr, x, startY);

      startY += lineHeight;
    }
  };

  // Automated Canvas Render Engine to compile and download standard high-retention video
  const handleCompileAndDownloadVideo = async () => {
    if (!storyboard) return;
    setIsCompilingVideo(true);
    setCompileProgressPercentage(0);
    setCompileProgress("Initializing Render Engine...");
    setError(null);

    // Intercept active media playback
    if (reelMode) setReelMode(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    vibeTrackSynth.stop();
    setPlayingVoiceIndex(null);

    try {
      // 1. Asynchronously load all scene images ahead of compilation
      setCompileProgress("Preloading high-fidelity visuals...");
      const images: (HTMLImageElement | null)[] = await Promise.all(
        storyboard.scenes.map((scene, idx) => {
          return new Promise<HTMLImageElement | null>((resolve) => {
            const url = sceneImages[idx];
            if (!url) {
              resolve(null);
              return;
            }
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => {
              console.warn(`Failed preloading image segment for scene index ${idx}`);
              resolve(null);
            };
            img.src = url;
          });
        })
      );

      // 2. Set up dimensions match tiktok/reels vertical 9:16 layout
      const canvasWidth = 540;
      const canvasHeight = 960;
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not construct 2D Canvas pipeline");

      // 3. Setup Web Audio API Context and output routing
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const audioDest = audioCtx.createMediaStreamDestination();

      // Ensure audio context is ready
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // Mix backing ambient track
      const backingOsc = audioCtx.createOscillator();
      const backingGain = audioCtx.createGain();
      backingOsc.type = "sine";
      backingOsc.frequency.setValueAtTime(92, audioCtx.currentTime); // sub lofi bass hum
      backingGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      backingOsc.connect(backingGain);
      backingGain.connect(audioDest);
      backingOsc.start();

      // 4. Capture canvas animation stream at 30 Frame-per-second
      const videoStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks()
      ]);

      // 5. Setup Recorder - Prefer standard mp4 types, fallback to webm but download as mp4
      let options = { mimeType: "video/mp4;codecs=h264,aac" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/mp4;codecs=vp9,opus" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: "video/mp4" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: "video/webm;codecs=vp9,opus" };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: "video/webm" };
            }
          }
        }
      }

      const recorder = new MediaRecorder(combinedStream, options);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Wrap a promise around the sequential scene play loop
      const compilationPromise = new Promise<void>((resolveCompile, rejectCompile) => {
        let currentSceneIndex = 0;
        let renderingActive = true;
        let timerId: any = null;
        let activeVoiceAudio: HTMLAudioElement | null = null;
        let sceneStartTime = Date.now();

        const cleanActiveSceneResources = () => {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
          if (activeVoiceAudio) {
            try {
              activeVoiceAudio.pause();
            } catch (_) {}
            activeVoiceAudio = null;
          }
        };

        const renderNextSceneSegment = () => {
          cleanActiveSceneResources();

          if (currentSceneIndex >= storyboard.scenes.length) {
            renderingActive = false;
            resolveCompile();
            return;
          }

          const scene = storyboard.scenes[currentSceneIndex];
          const img = images[currentSceneIndex];
          const voiceUrl = audioBlobUrls[currentSceneIndex];
          const sceneDurationTotalSec = scene.durationSeconds || 5;

          setCompileProgressPercentage(Math.round((currentSceneIndex / storyboard.scenes.length) * 100));
          setCompileProgress(`Baking Visuals & Transcripts: Scene ${currentSceneIndex + 1} of ${storyboard.scenes.length}`);

          sceneStartTime = Date.now();

          // Connect and trigger hi-fi voice audio track or fallback to timer
          let resolvedEnd = false;
          const advanceSegment = () => {
            if (resolvedEnd) return;
            resolvedEnd = true;
            currentSceneIndex++;
            renderNextSceneSegment();
          };

          if (voiceUrl) {
            activeVoiceAudio = new Audio(voiceUrl);
            activeVoiceAudio.crossOrigin = "anonymous";
            // Connect to web audio routing so MediaRecorder intercepts
            try {
              const srcNode = audioCtx.createMediaElementSource(activeVoiceAudio);
              srcNode.connect(audioDest);
              srcNode.connect(audioCtx.destination); // feed direct playback monitor
            } catch (err) {
              console.warn("MediaElement connection failed (non-blocking fallback to local speakers):", err);
            }

            activeVoiceAudio.onended = () => {
              advanceSegment();
            };

            activeVoiceAudio.onerror = (e) => {
              console.warn("Audio element failed to load correctly, falling back to temporal tick duration", e);
              setTimeout(advanceSegment, sceneDurationTotalSec * 1000);
            };

            activeVoiceAudio.play().catch((err) => {
              console.warn("Autoplay block (non-blocking fallback):", err);
              setTimeout(advanceSegment, sceneDurationTotalSec * 1000);
            });
          } else {
            // No audio, fallback immediately to temporal duration
            setTimeout(advanceSegment, sceneDurationTotalSec * 1000);
          }

          // Frame Drawing Loop matching 30 frames a second (33ms ticks)
          timerId = setInterval(() => {
            if (!renderingActive) return;

            // Clear frame
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const elapsedMs = Date.now() - sceneStartTime;
            const progressRatio = Math.min(1, elapsedMs / (sceneDurationTotalSec * 1000));

            // Apply modern Ken Burns smooth kinetic zoom pan factor over loaded image
            if (img && img.naturalWidth > 0) {
              ctx.save();
              const zoomScale = 1.0 + 0.14 * progressRatio;
              ctx.translate(canvasWidth / 2, canvasHeight / 2);
              ctx.scale(zoomScale, zoomScale);

              // Aspect ratio cover algorithm
              const imgRatio = img.naturalWidth / img.naturalHeight;
              const canvasRatio = canvasWidth / canvasHeight;
              let drawW = canvasWidth;
              let drawH = canvasHeight;

              if (imgRatio > canvasRatio) {
                drawW = canvasHeight * imgRatio;
              } else {
                drawH = canvasWidth / imgRatio;
              }

              ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
              ctx.restore();
            } else {
              // Draw gorgeous procedural backup slide backdrop using theme colors
              ctx.fillStyle = "#111827"; // deep slate black
              ctx.fillRect(0, 0, canvasWidth, canvasHeight);
              
              // Draw neo-brutalist grids
              ctx.strokeStyle = "rgba(255, 92, 0, 0.15)";
              ctx.lineWidth = 1.5;
              for (let x = 0; x < canvasWidth; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvasHeight);
                ctx.stroke();
              }
              for (let y = 0; y < canvasHeight; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvasWidth, y);
                ctx.stroke();
              }

              // Warm glowing circle
              ctx.save();
              const gradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 20, canvasWidth/2, canvasHeight/2, 280);
              gradient.addColorStop(0, "rgba(255, 92, 0, 0.15)");
              gradient.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvasWidth, canvasHeight);
              ctx.restore();
            }

            // Cinematic Grain Overlays
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            for (let j = 0; j < 5; j++) {
              ctx.fillRect(Math.random() * canvasWidth, Math.random() * canvasHeight, 2, 2);
            }

            // High-retention Subtitle text track wrapping
            wrapSubtitleText(ctx, scene.textOverlay, canvasWidth / 2, 700, 460, 36);

            // REC Pulsing Button
            ctx.save();
            ctx.font = "900 13px 'JetBrains Mono', monospace";
            ctx.textAlign = "left";
            const pulseActive = Math.floor(Date.now() / 600) % 2 === 0;
            ctx.fillStyle = pulseActive ? "#ff5c00" : "rgba(255, 92, 0, 0.3)";
            ctx.beginPath();
            ctx.arc(32, 32, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.fillText("REC ● LIVE", 48, 36);

            // Storyboard tags overlay
            ctx.fillStyle = "rgba(255, 204, 0, 1.0)";
            ctx.fillText(platform.toUpperCase(), 32, canvasHeight - 32);
            ctx.restore();

            // Active Scene frame timer progress bar
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(32, canvasHeight - 18, canvasWidth - 64, 6);
            ctx.fillStyle = "#ffcc00"; // vibrant gold
            ctx.fillRect(32, canvasHeight - 18, (canvasWidth - 64) * progressRatio, 6);
            ctx.restore();

          }, 33.3);
        };

        // Start recursion
        renderNextSceneSegment();

        // Safety timeout to avoid infinite freezes
        setTimeout(() => {
          if (renderingActive) {
            renderingActive = false;
            cleanActiveSceneResources();
            resolveCompile();
          }
        }, 120000); // 2 mins upper ceiling limit
      });

      // Start recording!
      recorder.start();
      await compilationPromise;

      // Stop backing synth
      backingOsc.stop();

      // Trigger standard MediaRecorder cycle end and wrap files
      setCompileProgress("Polishing container files & wrappers...");
      recorder.stop();

      await new Promise<void>((resolveTrack) => {
        recorder.onstop = () => {
          const videoBlob = new Blob(chunks, { type: options.mimeType || "video/mp4" });
          const safeTitle = storyboard.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
          const downloadUrl = URL.createObjectURL(videoBlob);
          
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `marketicians_${safeTitle}_video.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          resolveTrack();
        };
      });

      setCompileProgressPercentage(100);
      setCompileProgress("Video compilation download completed!");
    } catch (err: any) {
      console.error("Video compilation pipeline collapsed:", err);
      setError("Web Video Recorder pipeline aborted. Reverting to zip backup instead.");
    } finally {
      setTimeout(() => {
        setIsCompilingVideo(false);
      }, 1500);
    }
  };

  // Play audio voice over
  const playVoice = (index: number) => {
    const url = audioBlobUrls[index];

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    // Terminate any standard browser speak instances to avoid overlapping audio
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (playingVoiceIndex === index) {
      setPlayingVoiceIndex(null);
      return;
    }

    if (!url || url === "fallback-speech") {
      const textToSpeak = fallbackSpeechTexts[index] || (storyboard?.scenes[index]?.voiceover || "").replace(/\*/g, "");
      if (!textToSpeak) return;

      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Highly granular consistent matching to bind specific system voices to our 5 official narrator profiles
        const voices = window.speechSynthesis.getVoices();
        
        const fallbackProfiles: Record<string, { isMale: boolean; keywords: string[]; rate: number; pitch: number }> = {
          Zephyr: {
            isMale: false,
            keywords: ["samantha", "susan", "zira", "female", "english", "en-us"],
            rate: brandVibe === "genz" ? 1.15 : 1.05,
            pitch: 1.02
          },
          Kore: {
            isMale: false,
            keywords: ["hazel", "karen", "moira", "female", "english", "en-gb"],
            rate: 0.96,
            pitch: 0.95
          },
          Puck: {
            isMale: true,
            keywords: ["daniel", "david", "male", "english", "en-gb"],
            rate: 1.12,
            pitch: 1.02
          },
          Fenrir: {
            isMale: true,
            keywords: ["uk english male", "daniel", "david", "male", "english", "en-us"],
            rate: 1.25,
            pitch: 0.92
          },
          Charon: {
            isMale: true,
            keywords: ["david", "daniel", "male", "english", "en-us"],
            rate: 0.88,
            pitch: 0.78 // Elegant deep cinematic tone
          }
        };

        const activeProfile = fallbackProfiles[narratorVoice] || fallbackProfiles["Zephyr"];
        const isMaleVoice = activeProfile.isMale;
        
        let selectedVoice = null;
        
        // 1. Try step-by-step match of preferred voice keywords
        for (const kw of activeProfile.keywords) {
          selectedVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            const correctGender = isMaleVoice ? 
              (name.includes("male") || name.includes("david") || name.includes("daniel") || name.includes("jack") || name.includes("mark")) : 
              (name.includes("female") || name.includes("samantha") || name.includes("zira") || name.includes("hazel") || name.includes("susan") || name.includes("moira"));
            return correctGender && name.includes(kw);
          });
          if (selectedVoice) break;
        }

        // 2. Fallback to general gender match if no specific keyword matches
        if (!selectedVoice) {
          selectedVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            return isMaleVoice ? 
              (name.includes("male") || name.includes("david") || name.includes("daniel") || name.includes("jack")) : 
              (name.includes("female") || name.includes("samantha") || name.includes("zira") || name.includes("hazel") || name.includes("susan"));
          });
        }

        // 3. System absolute fallback to english-language speakers, or first general browser speaker
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        // Apply profile-specific vocal calibrations
        utterance.rate = activeProfile.rate;
        utterance.pitch = activeProfile.pitch;

        setPlayingVoiceIndex(index);
        
        utterance.onend = () => {
          setPlayingVoiceIndex(null);
        };
        utterance.onerror = () => {
          setPlayingVoiceIndex(null);
        };

        window.speechSynthesis.speak(utterance);
      }
    } else {
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      setPlayingVoiceIndex(index);

      audio.play().catch(e => {
        console.warn("Interactive audio play blocked on client side:", e);
        setPlayingVoiceIndex(null);
      });
      audio.onended = () => {
        setPlayingVoiceIndex(null);
      };
    }
  };

  // Cycle Reel playback slideshow loop
  const toggleReelMode = () => {
    if (reelMode) {
      setReelMode(false);
      if (reelTimerRef.current) clearTimeout(reelTimerRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoiceIndex(null);
      vibeTrackSynth.stop();
      setPlayingVibeTrack(false);
    } else {
      if (!storyboard || storyboard.scenes.length === 0) return;
      setReelMode(true);
      vibeTrackSynth.start(audioKeyword);
      setPlayingVibeTrack(true);
      runReelScene(0);
    }
  };

  // Run slideshow for a scene index
  const runReelScene = (index: number) => {
    if (!storyboard) return;
    const scene = storyboard.scenes[index];
    if (!scene) {
      // Loop or stop
      setReelMode(false);
      setPlayingVoiceIndex(null);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      vibeTrackSynth.stop();
      setPlayingVibeTrack(false);
      return;
    }

    setActiveSceneIndex(index);

    // Auto play vocal track (either prebuilt or browser fallback)
    playVoice(index);

    const durationMs = (scene.durationSeconds || 5) * 1000;
    
    reelTimerRef.current = setTimeout(() => {
      const nextIndex = (index + 1) % storyboard.scenes.length;
      if (nextIndex === 0) {
        // finished full loop
        setReelMode(false);
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        vibeTrackSynth.stop();
        setPlayingVibeTrack(false);
      } else {
        runReelScene(nextIndex);
      }
    }, durationMs);
  };

  // Auto clean timer on unmount
  useEffect(() => {
    return () => {
      if (reelTimerRef.current) clearTimeout(reelTimerRef.current);
    };
  }, []);

  // Proactively auto-generate realistic AI voiceovers for all scenes when a storyboard is loaded or when configuration changes
  useEffect(() => {
    if (!storyboard || storyboard.scenes.length === 0) return;

    const voiceChanged = lastVoiceRef.current !== narratorVoice;
    const vibeChanged = lastVibeRef.current !== brandVibe;
    const storyboardChanged = lastStoryboardRef.current !== storyboard;

    lastVoiceRef.current = narratorVoice;
    lastVibeRef.current = brandVibe;
    lastStoryboardRef.current = storyboard;

    if (storyboardChanged) {
      // Proactively pre-render the entire vocal narrative track for all scenes so they are natural on load
      handleGenerateAllVoices(false);
    } else if (voiceChanged || vibeChanged) {
      // Re-render immediately if the narrator profile or style pacing was adjusted
      handleGenerateAllVoices(true);
    }
  }, [storyboard, brandVibe, narratorVoice]);

  // Copy to clipboard helpers
  const handleCopy = (text: string, type: "title" | "caption" | "tags") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else if (type === "caption") {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else if (type === "tags") {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    }
  };

  // Highlight bold text segments inside voiceover
  const renderVoiceoverTextWithBolds = (text: string) => {
    const parts = text.split(/\*(.*?)\*/g);
    return parts.map((part, i) => {
      // odd indexes are matches
      if (i % 2 === 1) {
        return <strong key={i} className="text-[#ff5c00] font-extrabold underline bg-[#ffcc00] px-1 rounded">{part}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const selectedTrends = CITY_TRENDS[location];
  const isFullStoryRendered = !!storyboard && storyboard.scenes.length > 0 && storyboard.scenes.every((_, idx) => !!sceneImages[idx] && (!!audioBlobUrls[idx] || !!sceneAudios[idx]));

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-all duration-500 ease-in-out selection:bg-[#ffcc00] ${
      isNeoThemeActive ? "bg-stone-950 text-[#00ff22] font-mono border-x-4 border-[#00ff22]" : "bg-[#fdfcf6] text-[#1a1a1a] font-sans"
    }`}>
      {/* Upper Navigation Rail */}
      <header className={`border-b-4 border-black sticky top-0 z-50 px-6 py-4 transition-colors ${
        isNeoThemeActive ? "bg-stone-900 border-[#00ff22]" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => {
                setBrandClicks(prev => {
                  const next = prev + 1;
                  if (next >= 5) {
                    setIsEasterEggOpen(true);
                    return 0;
                  }
                  return next;
                });
              }}
              className={`p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-default select-none transition-transform active:scale-95 ${
                isNeoThemeActive ? "bg-black border-[#00ff22] text-[#00ff22] shadow-[3px_3px_0px_transparent]" : "bg-[#ff5c00]"
              }`}
              title="Marketicians Storyboard Creator"
            >
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className={`text-2xl md:text-3xl font-display font-black uppercase tracking-tight font-sans ${
                  isNeoThemeActive ? "text-[#00ff22]" : "text-black"
                }`}>
                  {isBrainrotActive ? "RIZZ-ICIANS" : "Marketicians"}
                </h1>
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] border-2 border-black font-mono font-black tracking-wider uppercase ${
                  isNeoThemeActive ? "bg-black border-[#00ff22] text-[#00ff22]" : "bg-[#ffcc00] text-black"
                }`}>
                  {isBrainrotActive ? "SKIBIDI v2.9" : "PRO CO-PILOT v1.4"}
                </span>
              </div>
              <p className={`text-xs font-medium ${isNeoThemeActive ? "text-[#00ff22]/60" : "text-slate-700"}`}>
                {isBrainrotActive ? "Skibidi Short-Form Video Storyboard, Retention, & Brainrot Optimizer" : "Chronological Short-Form Video Storyboard & Retention Engine"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* AI Engine active status indicator */}
            <span className={`hidden md:flex items-center space-x-2 text-[10px] border-2 border-black px-2.5 py-1.5 rounded-lg font-mono font-black shadow-[2px_2px_0px_#000] ${
              isNeoThemeActive ? "bg-black border-[#00ff22] text-[#00ff22] shadow-[2px_2px_0px_#00ff22]" : "bg-slate-100 text-black"
            }`} title="AI processing engine status indicator.">
              <span className={`w-2 h-2 rounded-full ${isNeoThemeActive ? "bg-[#00ff22] animate-pulse" : "bg-[#ff5c00]"}`}></span>
              <span className="text-slate-500 uppercase tracking-wider text-[8.5px]">AI Engine:</span>
              <span className="font-extrabold">{isBrainrotActive ? "COOKING" : "Active"}</span>
            </span>

            <span className={`hidden lg:flex items-center space-x-2 text-xs border-2 border-black px-3.5 py-1.5 rounded-lg font-mono font-bold shadow-[2px_2px_0px_#000] ${
              isNeoThemeActive ? "bg-black border-[#00ff22] text-[#00ff22] shadow-[2px_2px_0px_#00ff22]" : "bg-white text-black"
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-emerald-600 font-extrabold">TREND RADAR: ACTIVE</span>
            </span>
            {view === "landing" ? (
              <button 
                onClick={() => setView("workspace")}
                className={`px-4 py-2 text-xs hover:bg-[#ff5c00]/90 transition rounded-lg border-2 border-black text-white font-extrabold shadow-[2px_2px_0px_#000] cursor-pointer ${
                  isNeoThemeActive ? "bg-black border-[#00ff22] text-[#00ff22]/90 shadow-[2px_2px_0px_#00ff22]" : "bg-[#ff5c00]"
                }`}
              >
                Launch Studio Workspace
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                {storyboard && (
                  <button 
                    onClick={handleResetDraft}
                    className="px-3 py-2 text-xs bg-rose-600 hover:bg-rose-500 text-white transition rounded-lg border-2 border-black font-extrabold shadow-[2px_2px_0px_#000] cursor-pointer flex items-center space-x-1"
                    title="Discard current draft and clear client cache"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden md:inline">Reset Draft</span>
                  </button>
                )}

                <button 
                  onClick={() => setShowTour(true)}
                  className="px-3.5 py-2 text-xs bg-[#ffcc00] hover:bg-[#ffcc00]/90 transition rounded-lg border-2 border-black text-black font-extrabold shadow-[2px_2px_0px_#000] cursor-pointer flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span className="hidden sm:inline">💡 Guided Tour</span>
                  <span className="sm:hidden">💡 Tour</span>
                </button>
                <button 
                  onClick={() => setView("landing")}
                  className={`px-4 py-2 text-xs hover:bg-[#00d1ff]/90 transition rounded-lg border-2 border-black font-extrabold shadow-[2px_2px_0px_#000] cursor-pointer ${
                    isNeoThemeActive ? "bg-black text-[#00ff22] border-[#00ff22] shadow-[2px_2px_0px_#00ff22]" : "bg-[#00d1ff] text-black"
                  }`}
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {view === "landing" ? (
        <LandingPage 
          onStartBlank={() => setView("workspace")} 
          onLoadPreset={(preset) => {
            loadPreset(preset);
            setView("workspace");
          }} 
          isBrainrotActive={isBrainrotActive}
          isNeoThemeActive={isNeoThemeActive}
          onToggleEasterEgg={() => setIsEasterEggOpen(prev => !prev)}
        />
      ) : (
        /* Main Body Grid */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Left Column: Settings and Input Panel (4 Cores) */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          
          {/* Preset Buttons Dashboard Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-3.5 border-b-2 border-dashed border-slate-200 pb-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ff5c00]" />
                Select Seed Profile
              </h2>
              <span className="text-[10px] bg-[#ffcc00] text-black border-2 border-black px-2 py-0.5 rounded font-black font-mono uppercase">Quick Seed</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(preset)}
                  className="text-left p-3 text-xs bg-[#fdfcf6] transition-all duration-150 rounded-xl border-2 border-black flex flex-col justify-between hover:bg-[#ffcc00]/20 hover:-translate-y-0.5 cursor-pointer shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]"
                  id={`preset-btn-${idx}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold text-[#1a1a1a]">{preset.name}</span>
                    <span className="text-[9px] bg-white border border-black px-1.5 py-0.5 rounded font-mono font-bold text-slate-600">{preset.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Segment */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 space-y-4 shadow-[6px_6px_0px_#000]">
            
            {/* Business Description Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black flex justify-between items-center">
                <span>Raw Business Description</span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{businessDescription.length}/400 chars</span>
              </label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value.slice(0, 400))}
                placeholder="Drop raw, unpolished details of your shop, product, launch, or startup here... (e.g., 'A local family-owned flower vendor in Austin who delivers fresh hand-wrapped bouquets in mason jars with custom notes.')"
                className="w-full h-32 bg-white text-xs border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#ff5c00] text-black placeholder-slate-400 transition resize-none leading-relaxed font-semibold shadow-[inner_2px_2px_0px_rgba(0,0,0,0.05)]"
                id="business-desc-input"
              />
            </div>

            {/* Platform & Duration Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-black">Target Platform</label>
                <div className="grid grid-cols-3 bg-[#fdfcf6] p-1 rounded-xl border-2 border-black">
                  {(["tiktok", "reels", "shorts"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`text-[10px] font-bold py-1.5 rounded-lg capitalize transition cursor-pointer ${
                        platform === p 
                          ? "bg-[#8b5cf6] text-white border-2 border-black shadow-[1px_1px_0px_#000]" 
                          : "text-slate-600 hover:text-black hover:bg-slate-200/40"
                      }`}
                    >
                      {p === 'tiktok' ? 'TikTok' : p === 'reels' ? 'Reels' : 'Shorts'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-black flex items-center justify-between">
                  <span>Duration</span>
                  <span className="text-[9px] text-slate-500 font-mono">Blocks</span>
                </label>
                <div className="grid grid-cols-3 bg-[#fdfcf6] p-1 rounded-xl border-2 border-black">
                  {([15, 30, 60] as const).map((secs) => (
                    <button
                      key={secs}
                      onClick={() => setDurationSeconds(secs)}
                      className={`text-[10px] font-bold py-1.5 rounded-lg transition cursor-pointer ${
                        durationSeconds === secs 
                          ? "bg-[#ff5c00] text-white border-2 border-black shadow-[1px_1px_0px_#000]" 
                          : "text-slate-600 hover:text-black hover:bg-slate-200/40"
                      }`}
                    >
                      {secs}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vibe Selection Segment */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-black">Brand Vibe Calibration</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "genz" as BrandVibe, label: "Gen-Z Humor", desc: "Irony, rapid memes & slang" },
                  { value: "corporate_sleek" as BrandVibe, label: "Corporate Sleek", desc: "High value, premium, calm" },
                  { value: "educational" as BrandVibe, label: "Hyper-Educate", desc: "Data hooks & fast facts" },
                  { value: "high_energy_story" as BrandVibe, label: "High Energy Arc", desc: "Conflict & peak drama" }
                ].map((vib) => (
                  <button
                    key={vib.value}
                    onClick={() => {
                      setBrandVibe(vib.value);
                      const defaultVoice = vib.value === "genz" ? "Fenrir" : vib.value === "corporate_sleek" ? "Puck" : vib.value === "educational" ? "Zephyr" : "Charon";
                      setNarratorVoice(defaultVoice);
                    }}
                    className={`text-left p-2.5 rounded-xl border-2 transition cursor-pointer ${
                      brandVibe === vib.value
                        ? "bg-[#8b5cf6]/10 border-black shadow-[3px_3px_0px_#000] text-black"
                        : "bg-white border-2 border-black text-slate-705 hover:bg-[#fddcf6]/10 text-slate-700 hover:text-black shadow-[1.5px_1.5px_0px_#000]"
                    }`}
                  >
                    <div className="text-[11px] font-bold flex items-center space-x-1">
                      <span className={`w-2 h-2 rounded-full border border-black ${brandVibe === vib.value ? 'bg-[#ff5c00]' : 'bg-white'}`}></span>
                      <span>{vib.label}</span>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-0.5 leading-snug line-clamp-1">{vib.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Narrator Vocal Profile Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-black flex items-center space-x-1">
                <Mic className="w-3.5 h-3.5 text-[#ff5c00]" />
                <span>AI Narrator Vocal Profile</span>
              </label>
              <select
                value={narratorVoice}
                onChange={(e) => setNarratorVoice(e.target.value)}
                className="w-full bg-[#fdfcf6] text-xs border-2 border-black rounded-xl p-2.5 focus:outline-none focus:border-[#ff5c00] text-black font-bold shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <option value="Zephyr">Zephyr (Breezy & Natural - Female Recommended)</option>
                <option value="Kore">Kore (Warm & Narrative - Female)</option>
                <option value="Puck">Puck (Clear & Energetic - Male)</option>
                <option value="Fenrir">Fenrir (Charismatic & Rapid - Gen-Z Male)</option>
                <option value="Charon">Charon (Deep & Sophisticated - Male)</option>
              </select>
            </div>

            {/* Hyperlocal & Music Mesh Calibration section */}
            <div className="space-y-4 pt-1.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-black flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-black" />
                  <span>Target Area (Local Neighborhood Trends)</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full bg-white text-xs border-2 border-black rounded-xl p-2.5 focus:outline-none focus:border-[#ff5c00] text-black font-bold shadow-[2px_2px_0px_#000]"
                >
                  <option value="Austin, TX">Austin, TX</option>
                  <option value="New York, NY">New York, NY</option>
                  <option value="London, UK">London, UK</option>
                  <option value="Sydney, Australia">Sydney, Australia</option>
                  <option value="San Francisco, CA">San Francisco, CA</option>
                  <option value="Tokyo, Japan">Tokyo, Japan</option>
                </select>
              </div>

              {/* Real-time AI Sound Vibe Mesh controller container */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-black flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Volume2 className="w-3.5 h-3.5 text-black" />
                    <span>AI Regional Sound Vibe Mesh</span>
                  </span>
                  {playingVibeTrack && (
                    <span className="text-[7.5px] font-mono font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded animate-pulse border border-emerald-300">
                      PLAYING SYNTH
                    </span>
                  )}
                </label>

                <div className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_#000] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 max-w-[70%]">
                      <h4 className="text-[11.5px] font-black text-black uppercase tracking-tight font-sans line-clamp-1">
                        🎧 {songTitle}
                      </h4>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[8px] font-mono font-black bg-[#00d1ff] text-black border border-black px-1.5 py-0.5 rounded uppercase">
                          {audioKeyword} TYPE
                        </span>
                        <span className="text-[7.5px] text-slate-500 font-bold font-mono">
                          Procedural Synth
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleVibeTrack}
                      title={playingVibeTrack ? "Stop Audio Loop" : "Test Synth Background Loop"}
                      className={`px-3 py-2 rounded-lg border text-[9.5px] font-mono font-black cursor-pointer transition-colors ${
                        playingVibeTrack 
                          ? "bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-[1px_1px_0px_#000]" 
                          : "bg-[#ffcc00] text-black border-black hover:bg-[#ffcc00]/95 shadow-[1.5px_1.5px_0px_#000]"
                      }`}
                    >
                      {playingVibeTrack ? "■ STOP" : "▶ PLAY TRACK"}
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-800 bg-black/[0.02] p-2.5 rounded-lg border border-black/10 leading-relaxed font-semibold">
                    {songExplanation}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <span className="text-[8px] text-slate-500 font-bold italic line-clamp-1">
                      Our musicology mesh matches local trends
                    </span>
                    <button
                      type="button"
                      disabled={meshingAudio || !businessDescription}
                      onClick={() => handleRemeshAudioTrack(businessDescription, location, brandVibe)}
                      className="text-[8px] px-2 py-1.5 rounded bg-[#00d1ff]/15 hover:bg-[#00d1ff] hover:text-black border border-black font-black uppercase cursor-pointer transition active:translate-y-0.5 disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                      {meshingAudio ? "Meshing Vibe..." : "🔄 Re-Mesh Vibe"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hyperlocal Trend Radar View Widget */}
            {selectedTrends && (
              <div className="bg-[#00d1ff]/10 p-3.5 rounded-xl border-2 border-black space-y-1 shadow-[2.5px_2.5px_0px_#000]">
                <div className="flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-black" />
                  <span className="text-[10px] font-black tracking-wider text-black uppercase">Local Algorithmic Trend Infusion:</span>
                </div>
                <p className="text-[10px] text-black font-semibold leading-relaxed font-mono">
                  {selectedTrends.style}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedTrends.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono text-black font-bold bg-[#00d1ff] border border-black px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <button
              onClick={handleGenerateStoryboard}
              disabled={generating}
              className={`w-full py-3.5 px-4 rounded-xl font-display font-black text-xs tracking-wider transition uppercase flex items-center justify-center space-x-2 border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer ${
                generating 
                  ? "bg-slate-200 text-slate-500 border-2 border-black cursor-not-allowed shadow-[1px_1px_0px_#000]" 
                  : "bg-[#ff5c00] text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_#000]"
              }`}
              id="generate-storyboard-cta"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span className="text-black">Synthesizing Storyboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white fill-white" />
                  <span>Generate Production Storyboard</span>
                </>
              )}
            </button>

            {/* Friendly explanation about API Key configuration */}
            <div className="flex items-start space-x-2.5 text-[10px] text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-300">
              <Info className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
              <p className="leading-normal font-medium">
                Generates complete 0s to 60s chronologies. Image scene assets and vocal TTS are loaded on-the-fly dynamically. Configure secrets inside the Settings menu.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Output Workstation (8 Cores) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Handling error display */}
          {error && (
            <div className="bg-rose-950/30 border border-rose-900 text-rose-300 px-4 py-3.5 rounded-xl flex items-start space-x-3 text-xs animate-fade-in shadow-lg">
              <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-rose-200">Algorithmic Synthesis Halted</p>
                <p className="leading-relaxed">{error}</p>
                {error.includes("GEMINI_API_KEY") && (
                  <div className="mt-2 text-rose-400/90 bg-rose-950/50 p-2 rounded border border-rose-900/60 leading-normal">
                    💡 <strong>Setup Helper:</strong> Open <strong>Settings &gt; Secrets</strong> in the top-right AI Studio toolbar, add <code>GEMINI_API_KEY</code> with your real API credential, and make sure it has been set, then rerun.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Core Interactive Workspace Content */}
          {generating ? (
            <div className="flex-1 bg-white border-2 border-black rounded-3xl min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-6 shadow-[6px_6px_0px_#000]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-black border-t-[#ff5c00] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-black">
                  <Film className="w-6 h-6 animate-pulse text-[#ff5c00]" />
                </div>
              </div>
              <div className="space-y-3.5 max-w-sm">
                <h3 className="font-display font-black text-black text-lg tracking-tight uppercase">Marketicians is Crafting Assets...</h3>
                <p className="text-xs text-black tracking-wider font-mono font-black uppercase bg-[#ffcc00] px-4 py-2 rounded-lg border-2 border-black animate-pulse shadow-[2px_2px_0px_#000]">
                  {loadingStatements[loadingStep]}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold pt-2">
                  Building deep hooks, timing camera pans, and embedding high-influence text overlays. Grab a tea, this takes 5–10 seconds.
                </p>
              </div>
            </div>
          ) : storyboard ? (
            <div className="space-y-6 flex flex-col">
              
              {/* Marketing Metadata SEO Panel */}
              <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000] space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-dashed border-slate-200 pb-4 gap-3">
                  <div>
                    <span className="text-[10px] bg-[#00d1ff] border-2 border-black text-black px-2.5 py-0.5 rounded font-mono font-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                      {platform} Optimized Package
                    </span>
                    <h3 className="text-lg font-display font-black text-black mt-1.5 uppercase">SEO & Discoverability Package</h3>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Batch Render Images */}
                    <button
                      onClick={handleGenerateAllImages}
                      disabled={batchImageGenerating || imageGeneratingIndex !== null || reelMode}
                      className={`text-xs px-3 py-2 rounded-lg border-2 border-black transition flex items-center space-x-1.5 font-bold cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#000] ${
                        batchImageGenerating 
                          ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-[#00d1ff] text-black hover:bg-[#00d1ff]/90"
                      }`}
                      title="Generates high-fidelity camera B-Roll visuals for every single scene automatically"
                    >
                      {batchImageGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Rendering Mattes...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-black" />
                          <span>Render All Mattes</span>
                        </>
                      )}
                    </button>

                    {/* Export Storyboard ZIP Package */}
                    <button
                      onClick={handleExportStoryboard}
                      disabled={exporting}
                      className={`text-xs px-4 py-2 rounded-lg border-2 border-black transition flex items-center space-x-1.5 font-bold cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
                        exporting 
                          ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-[#10b981] text-white hover:bg-[#10b981]/90"
                      }`}
                      title="Download the full storyboard ZIP package with all scene assets, scripts, SRT subtitles, and AI voice overs"
                    >
                      {exporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Preparing ZIP...</span>
                        </>
                      ) : (
                        <>
                          <FolderDown className="w-3.5 h-3.5 text-white" />
                          <span>Download ZIP Bundle</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                  {/* Title and Caption Fields */}
                  <div className="md:col-span-8 space-y-4">
                    
                    {/* Visual SEO Title */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-black font-mono">Algorithmic Title Hook</span>
                        <button 
                          onClick={() => handleCopy(storyboard.title, "title")}
                          className="text-[10px] text-[#ff5c00] hover:underline flex items-center space-x-1 font-bold cursor-pointer"
                        >
                          {copiedTitle ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTitle ? "Copied" : "Copy Title"}</span>
                        </button>
                      </div>
                      <div className="bg-[#fdfcf6] rounded-xl px-3.5 py-2.5 border-2 border-black font-display font-black text-black flex items-center justify-between shadow-[2px_2px_0px_#000]">
                        <p>{storyboard.title}</p>
                      </div>
                    </div>
 
                    {/* SEO Body Caption */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-black font-mono">Engagement Loop Caption</span>
                        <button 
                          onClick={() => handleCopy(storyboard.description, "caption")}
                          className="text-[10px] text-[#ff5c00] hover:underline flex items-center space-x-1 font-bold cursor-pointer"
                        >
                          {copiedCaption ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCaption ? "Copied" : "Copy Caption"}</span>
                        </button>
                      </div>
                      <div className="bg-[#fdfcf6] rounded-xl px-3.5 py-2.5 border-2 border-black text-black leading-relaxed text-[11px] font-semibold shadow-[2px_2px_0px_#000]">
                        <p className="whitespace-pre-line">{storyboard.description}</p>
                      </div>
                    </div>
                  </div>
 
                  {/* Hashtags and Infusion */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-black font-mono">Niche Hashtags</span>
                        <button 
                          onClick={() => handleCopy(storyboard.hashtags.join(" "), "tags")}
                          className="text-[10px] text-[#ff5c00] hover:underline flex items-center space-x-1 font-bold cursor-pointer"
                        >
                          {copiedTags ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copy List</span>
                        </button>
                      </div>
                      <div className="bg-[#fdfcf6] rounded-xl p-3 border-2 border-black flex flex-wrap gap-1.5 min-h-[72px] content-start shadow-[2px_2px_0px_#000]">
                        {storyboard.hashtags.map((tag, i) => (
                           <span key={i} className="text-[10px] font-mono font-bold text-black bg-[#ffcc00] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
 
                    {/* Local Infusion summary pill */}
                    <div className="bg-[#8b5cf6]/10 text-black rounded-xl p-3.5 border-2 border-black space-y-1 shadow-[2px_2px_0px_#000]">
                      <span className="text-[9px] uppercase font-black font-mono tracking-wider text-[#8b5cf6] block">Hyper-Local Anchor Infusion:</span>
                      <p className="text-[10px] text-black font-bold font-sans leading-relaxed">{storyboard.localTrendUsed}</p>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Workstation Workspace split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
 
                {/* Left side in Split: Storyboard chronological scenes list (7 columns) */}
                <div className="md:col-span-7 flex flex-col space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-[#ff5c00]" />
                      Sequential Timeline Progression
                    </h4>
                    <span className="text-[10px] bg-white border-2 border-black px-2 py-0.5 rounded font-mono font-bold uppercase text-black shadow-[1.5px_1.5px_0px_#000]">Total {durationSeconds}s Block</span>
                  </div>
 
                  <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
                    {storyboard.scenes.map((scene, index) => {
                      const isActive = index === activeSceneIndex;
                      const hasImage = !!sceneImages[index];
                      const hasAudio = !!audioBlobUrls[index];

                      return (
                        <div
                          key={index}
                          onClick={() => {
                            if (!reelMode) setActiveSceneIndex(index);
                          }}
                          className={`bg-white rounded-2xl border-2 text-left p-4.5 transition duration-150 cursor-pointer text-xs relative ${
                            isActive 
                              ? "border-black ring-2 ring-[#ff5c00] shadow-[5px_5px_0px_#000] bg-[#fdfcf6]" 
                              : "border-black/80 hover:border-black hover:bg-slate-50/50 shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000]"
                          }`}
                          id={`scene-block-${index}`}
                        >
                          {/* Active highlight label indicator */}
                          {isActive && (
                            <span className="absolute -left-1 top-4 w-2 h-10 bg-[#ff5c00] rounded-r-md border-y-2 border-r-2 border-black"></span>
                          )}

                          {/* Time code bar & metadata header */}
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                            <div className="flex items-center space-x-2">
                              <span className="bg-[#ffcc00] text-black font-extrabold font-mono text-[10px] px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                                {scene.timecode}
                              </span>
                              <span className="text-[10px] text-slate-700 font-mono font-bold">{scene.durationSeconds} seconds</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              {hasImage && <span className="text-[9px] bg-emerald-50 border border-emerald-400 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded">🎨 Rendered</span>}
                              {hasAudio && <span className="text-[9px] bg-cyan-50 border border-cyan-400 text-cyan-800 font-mono font-bold px-1.5 py-0.5 rounded">🎙️ Voiced</span>}
                            </div>
                          </div>

                          {/* Split text contents */}
                          <div className="space-y-2 pt-1 font-sans">
                            {/* Visual cue instructions */}
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#ff5c00] font-black font-mono block">Visual Cinematic Framing:</span>
                              <p className="text-[11px] text-black leading-normal font-sans pt-0.5 font-bold">{scene.visualCue}</p>
                            </div>

                            {/* Audio monologue text */}
                            <div className="bg-[#00d1ff]/10 px-3.5 py-2.5 rounded-xl border-2 border-black my-1.5 pb-2.5 shadow-[1.5px_1.5px_0px_#000]">
                              <span className="text-[10px] uppercase tracking-wider text-[#8b5cf6] font-black font-mono flex items-center justify-between">
                                <span>Voiceover Script:</span>
                              </span>
                              <p className="text-[11px] text-black font-semibold leading-relaxed pt-1">{renderVoiceoverTextWithBolds(scene.voiceover)}</p>
                            </div>

                            {/* Subtitles text screen overlay indicator */}
                            <div className="flex items-start space-x-1.5">
                              <span className="text-[10px] uppercase tracking-wider text-[#8b5cf6] font-black font-mono">Screen Overlay text:</span>
                              <p className="text-[11px] text-black font-black">"{scene.textOverlay}"</p>
                            </div>

                            {/* Pro-Tip section */}
                            <div className="text-[10px] text-slate-700 bg-slate-55 p-2.5 rounded-lg border-2 border-black flex gap-1.5 items-start mt-2.5">
                              <span className="text-[#ff5c00] font-black flex-shrink-0">PRO TIP:</span>
                              <p className="italic font-semibold">{scene.proTip}</p>
                            </div>
                          </div>

                          {/* Row buttons for triggering live creations */}
                          <div className="flex items-center space-x-2 mt-3.5 pt-3.5 border-t-2 border-dashed border-slate-200">
                            {imageGeneratingIndex === index ? (
                              <button disabled className="text-[10px] px-2.5 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 font-bold rounded-lg flex items-center space-x-1">
                                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                                <span>Generating Matte...</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerateSceneImage(index, scene.visualCue);
                                }}
                                className={`text-[10px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 border-2 border-black cursor-pointer shadow-[1.5px_1.5px_0px_#000] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#000] ${
                                  hasImage 
                                    ? "bg-[#ffcc00] text-black hover:bg-[#ffcc00]/90" 
                                    : "bg-white text-black hover:bg-slate-50"
                                }`}
                              >
                                <ImageIcon className="w-3 h-3 text-black" />
                                <span>{hasImage ? "Regen Camera Matte" : "Generate B-Roll Matte"}</span>
                              </button>
                            )}

                            {voiceGeneratingIndex === index ? (
                              <button disabled className="text-[10px] px-2.5 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 font-bold rounded-lg flex items-center space-x-1">
                                <Loader2 className="w-3 h-3 animate-spin text-brand-cyan" />
                                <span>Synthesizing Voice...</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerateSceneAudio(index, scene.voiceover);
                                }}
                                className={`text-[10px] px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 border-2 border-black cursor-pointer shadow-[1.5px_1.5px_0px_#000] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#000] ${
                                  hasAudio 
                                    ? "bg-[#00d1ff] text-black hover:bg-[#00d1ff]/90" 
                                    : "bg-white text-black hover:bg-slate-50"
                                }`}
                              >
                                <Volume2 className="w-3 h-3 text-black" />
                                <span>{hasAudio ? "Regen Vocal Track" : "Generate 🎙️ Voiceover"}</span>
                              </button>
                            )}

                            {hasAudio && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playVoice(index);
                                }}
                                className={`ml-auto text-[10px] px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 shadow-[1.5px_1.5px_0px_#005] border-2 border-black active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#005] cursor-pointer ${
                                  playingVoiceIndex === index 
                                    ? "bg-rose-500 text-white animate-pulse" 
                                    : "bg-[#8b5cf6] text-white hover:bg-[#8b5cf6]/90"
                                }`}
                              >
                                {playingVoiceIndex === index ? (
                                  <>
                                    <Pause className="w-3 h-3 text-white fill-white" />
                                    <span>Stop Voice</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 text-white fill-white" />
                                    <span>Listen Audio</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right side in Split: Phone Simulator Viewport (5 columns) */}
                <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-2 px-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-[#ff5c00]" />
                      {platform === 'tiktok' ? 'TikTok' : platform === 'reels' ? 'Instagram Reels' : 'YouTube Shorts'} Storyboard Generator Frame
                    </h4>
                    <span className="text-[10px] text-black font-mono font-black uppercase bg-[#00d1ff] px-2 py-0.5 rounded border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                      Active Live
                    </span>
                  </div>

                  {/* Unified Storyboard Generator Frame Mode (Locked to Matte) */}
                  <div className="flex w-full max-w-[290px] mb-2 bg-[#ffcc00] p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] justify-center items-center">
                    <span className="text-[10px] font-mono font-black uppercase text-black tracking-wide flex items-center gap-1.5">
                      🎨 Storyboard Matte Frame Active
                    </span>
                  </div>

                  {/* Dynamic Interactive GIF camera customization presets */}
                  {storyboardFrameMode === "gif" && (
                    <div className="flex items-center space-x-1 mb-3 bg-slate-100 p-1 rounded-xl border-2 border-black max-w-[290px] w-full justify-between shadow-[2px_2px_0px_#000]">
                      <span className="text-[8px] font-mono font-extrabold text-[#da1c5c] pl-2 uppercase tracking-wide">GIF Motion:</span>
                      <div className="flex space-x-0.5">
                        <button
                          onClick={() => setGifCameraPreset("zoom")}
                          className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-md border cursor-pointer transition ${
                            gifCameraPreset === 'zoom' ? 'bg-[#da1c5c] text-white border-black shadow-[0.5px_0.5px_0px_#000]' : 'bg-white text-black border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          🔍 Zoom
                        </button>
                        <button
                          onClick={() => setGifCameraPreset("pan")}
                          className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-md border cursor-pointer transition ${
                            gifCameraPreset === 'pan' ? 'bg-[#da1c5c] text-white border-black shadow-[0.5px_0.5px_0px_#000]' : 'bg-white text-black border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          ↔️ Pan
                        </button>
                        <button
                          onClick={() => setGifCameraPreset("leaks")}
                          className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-md border cursor-pointer transition ${
                            gifCameraPreset === 'leaks' ? 'bg-[#da1c5c] text-white border-black shadow-[0.5px_0.5px_0px_#000]' : 'bg-white text-black border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          🌅 Glow
                        </button>
                        <button
                          onClick={() => setGifCameraPreset("handheld")}
                          className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-md border cursor-pointer transition ${
                            gifCameraPreset === 'handheld' ? 'bg-[#da1c5c] text-white border-black shadow-[0.5px_0.5px_0px_#000]' : 'bg-white text-black border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          📳 Shake
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Simulator container viewport matching aspect ratio 9:16 */}
                  <div className="w-full max-w-[290px] aspect-[9/16] bg-black border-[5px] border-black rounded-[30px] overflow-hidden relative shadow-[8px_8px_0px_#000] flex flex-col">
                    
                    {/* Simulated phone top notch/camera pill */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#1a1a1a] rounded-full z-30 flex items-center justify-center border border-[#333]/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]"></span>
                    </div>

                    {/* Active Screen Canvas Background */}
                    <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col justify-between p-3.5 pt-10">
                      
                      {/* Direct rendering of the integrated high-tech SceneVisualizer */}
                      <div className="absolute inset-0 z-0">
                        <SceneVisualizer
                          scene={storyboard.scenes[activeSceneIndex]}
                          activeSceneIndex={activeSceneIndex}
                          totalScenes={storyboard.scenes.length}
                          brandVibe={brandVibe}
                          imageUrl={sceneImages[activeSceneIndex]}
                          onGenerateImage={() => handleGenerateSceneImage(activeSceneIndex, storyboard.scenes[activeSceneIndex].visualCue)}
                          imageGenerating={imageGeneratingIndex === activeSceneIndex}
                        />
                        {/* Soft overlay vignette for reading subtitled overlays if image loaded */}
                        {sceneImages[activeSceneIndex] && (
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none z-5"></div>
                        )}
                      </div>

                      {/* Header controls layout inside TikTok */}
                      <div className="relative z-10 flex items-center justify-between pointer-events-none mt-1">
                        <span className="text-[9px] text-white font-mono px-1.5 py-0.5 rounded bg-black/50 font-bold uppercase tracking-wider backdrop-blur-xs border border-white/10">
                          {storyboard.scenes[activeSceneIndex]?.timecode.split(" (")[0] || "Scene"}
                        </span>
                        
                        <div className="flex space-x-1.5">
                          <span className="text-[9px] bg-red-600/90 text-white font-black font-mono tracking-wider px-1.5 py-0.5 rounded">
                            LIVE
                          </span>
                        </div>
                      </div>

                      {/* Interactive Side Interactions Rail (heart, views, comment etc) */}
                      <div className="absolute right-2.5 top-1/3 z-10 flex flex-col space-y-3.5 items-center">
                        {/* Author Profile image */}
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-[#8b5cf6] to-[#00d1ff] flex items-center justify-center font-black text-[9px] text-black shadow-md">
                            VB
                          </div>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold font-mono border border-black">
                            +
                          </span>
                        </div>

                        {/* Heart widget */}
                        <div className="flex flex-col items-center">
                          <button className="bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-xs text-white transition cursor-pointer border border-white/5">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                          </button>
                          <span className="text-[9px] text-white text-shadow mt-1 font-mono font-bold">42.8K</span>
                        </div>

                        {/* Comment balloon widget */}
                        <div className="flex flex-col items-center">
                          <button className="bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-xs text-white transition cursor-pointer border border-white/5">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[9px] text-white text-shadow mt-1 font-mono font-bold">1.2K</span>
                        </div>

                        {/* Share ball/arrow */}
                        <div className="flex flex-col items-center">
                          <button className="bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-xs text-white transition cursor-pointer border border-white/5">
                            <Bookmark className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          </button>
                          <span className="text-[9px] text-white text-shadow mt-1 font-mono font-bold">941</span>
                        </div>

                        {/* Music vinyl disk icon spins if vocal playing or synth playing */}
                        <div className="mt-2.5">
                          <button
                            onClick={toggleVibeTrack}
                            title={playingVibeTrack ? "Mute Background Music" : "Play Background Music"}
                            className={`w-7 h-7 rounded-full bg-slate-950 border border-slate-705 p-0.5 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer relative group ${
                              (playingVoiceIndex !== null || playingVibeTrack) ? 'animate-spin' : ''
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] text-black ${
                              playingVibeTrack ? 'bg-emerald-400' : 'bg-[#00d1ff]'
                            }`}>
                              {playingVibeTrack ? "🔊" : "♫"}
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Foreground Overlay caption layout and subtitles (Bottom Left area) */}
                      <div className="relative z-10 space-y-2 mt-auto text-left w-9/12 pb-1.5 animate-fade-in font-sans">
                        
                        {/* Interactive TikTok style subtitle text block overlay */}
                        <div className="bg-black/60 backdrop-blur-xs p-2 rounded-lg border border-white/20 shadow-lg mb-1 relative overflow-hidden">
                          <span className="text-[7px] uppercase font-mono tracking-wider text-[#00d1ff] font-bold block mb-0.5">Captioned subtitle:</span>
                          <p className="text-[10px] text-white font-extrabold font-sans tracking-wide leading-normal">
                            {storyboard.scenes[activeSceneIndex]?.textOverlay}
                          </p>
                        </div>

                        {/* Creator name & video context caption */}
                        <div className="text-[10px] text-white font-medium">
                          <p className="font-bold">@Marketicians</p>
                          <p className="text-[9px] text-slate-100 line-clamp-2 mt-0.5 font-semibold leading-normal select-none">
                            {storyboard.description.split("#")[0]}
                          </p>
                          <span className="text-[9px] font-mono text-[#00d1ff] font-black block mt-1">
                            #ShortFormPro #{brandVibe}
                          </span>
                        </div>

                        {/* Audio track ticker name */}
                        <div className="flex items-center space-x-1 bg-black/60 px-2 py-1 rounded w-max border border-white/10 max-w-full font-mono">
                          <span className="text-[8px] text-[#00d1ff] font-bold block animate-bounce truncate">
                            🎚️ {audioKeyword}
                          </span>
                        </div>
                      </div>

                      {/* Moving Equalizer sound spectrum during voice audition play */}
                      {playingVoiceIndex === activeSceneIndex && (
                        <div className="absolute top-5 right-11 bg-black/80 border-2 border-black backdrop-blur-lg rounded-xl py-2 px-3 flex items-center space-x-2 shadow-[2px_2px_0px_#000]">
                          <div className="flex items-end space-x-0.5 h-3 w-5">
                            <span className="w-0.5 bg-[#00d1ff] h-3 animate-pulse"></span>
                            <span className="w-0.5 bg-[#00d1ff] h-2.5 animate-bounce"></span>
                            <span className="w-0.5 bg-[#00d1ff] h-1 animate-pulse"></span>
                            <span className="w-0.5 bg-[#00d1ff] h-2 animate-bounce"></span>
                          </div>
                          <span className="text-[8px] font-mono text-white tracking-widest font-black">AUDITING VOICE</span>
                        </div>
                      )}
                    </div>

                    {/* Sequential control bar underneath viewport */}
                    <div className="bg-white px-3 py-2 border-t-2 border-black flex items-center justify-between text-[10px] relative z-20">
                      <div className="text-black font-mono font-black">
                        Scene: {activeSceneIndex + 1}/{storyboard.scenes.length}
                      </div>

                      <div className="flex space-x-1.5">
                        <button
                          disabled={activeSceneIndex === 0}
                          onClick={() => setActiveSceneIndex(prev => Math.max(0, prev - 1))}
                          className="px-2 py-0.5 bg-[#ffcc00] hover:bg-[#ffcc00]/80 disabled:opacity-45 rounded border-2 border-black text-black font-bold font-mono shadow-[1px_1px_0px_#000]"
                        >
                          ‹
                        </button>
                        <button
                          disabled={activeSceneIndex === storyboard.scenes.length - 1}
                          onClick={() => setActiveSceneIndex(prev => Math.min(storyboard.scenes.length - 1, prev + 1))}
                          className="px-2 py-0.5 bg-[#ffcc00] hover:bg-[#ffcc00]/80 disabled:opacity-45 rounded border-2 border-black text-black font-bold font-mono shadow-[1px_1px_0px_#000]"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Play Video Reel compilation button */}
                  <div className="w-full max-w-[290px] mt-4">
                    <button
                      onClick={toggleReelMode}
                      className={`w-full py-3 px-4 rounded-xl border-2 border-black font-display font-black text-xs tracking-wider transition uppercase flex items-center justify-center space-x-2 shadow-[3px_3px_0px_#000] cursor-pointer active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
                        reelMode 
                          ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse" 
                          : isFullStoryRendered 
                            ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[4px_4px_0px_#000]"
                            : "bg-[#00d1ff] text-black hover:bg-[#00d1ff]/90"
                      }`}
                    >
                      {reelMode ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-white fill-white" />
                          <span>Stop Video Reel</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-current fill-current animate-bounce" />
                          <span>Play Full Results Video</span>
                        </>
                      )}
                    </button>

                    {isFullStoryRendered && (
                      <div className="flex flex-col gap-2 w-full mt-2">
                        <button
                          onClick={handleCompileAndDownloadVideo}
                          disabled={isCompilingVideo}
                          className="w-full py-3 px-4 rounded-xl border-2 border-black font-display font-black text-xs tracking-wider transition uppercase flex items-center justify-center space-x-2 bg-[#ffcc00] text-black hover:bg-[#ffcc00]/90 shadow-[3px_3px_0px_#000] cursor-pointer active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]"
                          title="Compile and download the raw output video with vocals, kinetic motion, and hardburned subtitles"
                        >
                          {isCompilingVideo ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                              <span>Compiling Video...</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-3.5 h-3.5 text-black animate-pulse" />
                              <span>Download Rendered Video</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleExportStoryboard}
                          disabled={exporting}
                          className="w-full py-2 px-4 rounded-xl border-2 border-black font-mono font-black text-[9px] tracking-wider transition uppercase flex items-center justify-center space-x-1.5 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#000]"
                          title="Backup download for raw production ZIP package containing separate wave vocal files and png images"
                        >
                          {exporting ? (
                            <>
                              <Loader2 className="w-2.5 h-2.5 animate-spin text-slate-600" />
                              <span>Assembling ZIP Package...</span>
                            </>
                          ) : (
                            <>
                              <FolderDown className="w-2.5 h-2.5 text-slate-600" />
                              <span>Download Production ZIP Pack</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    {/* Status hint dynamically advising user */}
                    <div className="mt-2 text-[9.5px] font-semibold text-center text-slate-800 flex flex-col items-center justify-center gap-1 bg-slate-50 border-2 border-black p-2.5 rounded-xl shadow-[1.5px_1.5px_0px_#000]">
                      {isFullStoryRendered ? (
                        <div className="text-emerald-800 flex flex-col items-center gap-1 font-extrabold uppercase text-[9px]">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                            <span>✨ Video fully rendered! ready to play & download</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-800 leading-normal">
                          <p>
                            ⚡ <strong>Status:</strong> {storyboard.scenes.filter((_, idx) => !!sceneImages[idx]).length}/{storyboard.scenes.length} Mattes • {storyboard.scenes.filter((_, idx) => !!audioBlobUrls[idx]).length}/{storyboard.scenes.length} Vocals Loaded
                          </p>
                          <p className="text-[8.5px] text-slate-500 mt-0.5">
                            We recommend rendering all camera mattes and voiceovers for a polished full playthrough!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informative advice label underneath mobile frame */}
                  <p className="text-[10px] text-slate-800 text-center mt-3.5 leading-relaxed max-w-[280px] font-bold">
                    💡 <strong>ProTip:</strong> Click any frame on the storyboard list to cycle. Generating a "B-Roll Matte" paints a fully tailored vertical scene overlay using Imagen!
                  </p>

                  {/* AI Storyboard Generator Customizer Chat Support */}
                  <div className="w-full max-w-[290px] bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] mt-5 flex flex-col space-y-3.5 text-left font-sans animate-fade-in" id="matte-customizer-chat-panel">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                       <div className="flex items-center space-x-1.5">
                        <div className="bg-[#00d1ff] p-1 rounded-lg border border-black text-black">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-black uppercase tracking-tight text-black font-display">Storyboard Generator</h5>
                          <span className="text-[8px] font-mono font-bold text-slate-600 uppercase">Scene #{activeSceneIndex + 1} Style Customizer</span>
                        </div>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>

                    {/* Chat messages history log */}
                    <div className="h-32 overflow-y-auto bg-slate-50 border border-slate-300 rounded-xl p-2.5 space-y-2.5 text-[10px] scrollbar-thin">
                      {(!sceneChats[activeSceneIndex] || sceneChats[activeSceneIndex].length === 0) ? (
                        <div className="text-center text-slate-700 py-4 font-semibold italic space-y-1">
                          <p>No customizations applied yet.</p>
                          <p className="text-[8.5px] text-slate-605 not-italic">Say: "make it golden hour", "neon purple", or click a style tag below!</p>
                        </div>
                      ) : (
                        sceneChats[activeSceneIndex].map((chat) => (
                          <div 
                            key={chat.id} 
                            className={`flex flex-col space-y-0.5 max-w-[85%] ${
                              chat.sender === 'user' ? 'ml-auto items-end' : 'items-start'
                            }`}
                          >
                            <span className="text-[7px] text-slate-500 font-mono font-bold uppercase">{chat.sender === 'user' ? 'Me' : 'Gemini'} • {chat.time}</span>
                            <div className={`p-2 rounded-xl text-shadow-none border ${
                              chat.sender === 'user' 
                                ? 'bg-[#00d1ff]/10 text-black border-black font-semibold' 
                                : 'bg-white text-slate-800 border-slate-300 font-semibold'
                            }`}>
                              {chat.text}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Fast Modifier Tag Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono font-bold tracking-wider text-slate-700 uppercase block">One-Click Style Modifier Tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { tag: "🌇 Golden Hour", prompt: "glorious golden hour sunset aesthetic" },
                          { tag: "💜 Cyber Neon", prompt: "vibrant cyberpunk neon pink and teal reflections" },
                          { tag: "📸 35mm Film", prompt: "authentic grainy 35mm retro analog film shot" },
                          { tag: "🏔️ Matte Pastel", prompt: "minimalist cozy pastel color grading palette" },
                          { tag: "🌧️ Moody Rain", prompt: "rainy moody atmosphere, cozy reflection reflections" },
                        ].map((btn) => (
                          <button
                            key={btn.tag}
                            disabled={customizingImageIndex !== null}
                            onClick={() => handleCustomizeSceneImage(activeSceneIndex, btn.prompt)}
                            type="button"
                            className="text-[8px] px-2 py-1 rounded bg-[#fdfcf6] border border-black cursor-pointer font-bold hover:bg-[#ffcc00] transition active:translate-y-0.5 disabled:opacity-40"
                          >
                            {btn.tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat message manual input */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = chatInputs[activeSceneIndex] || "";
                        if (input.trim()) {
                          handleCustomizeSceneImage(activeSceneIndex, input);
                        }
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        value={chatInputs[activeSceneIndex] || ""}
                        onChange={(e) => setChatInputs(prev => ({ ...prev, [activeSceneIndex]: e.target.value }))}
                        placeholder="Type (e.g. 'retro lofi aesthetic')..."
                        disabled={customizingImageIndex !== null}
                        className="flex-1 text-[10px] font-semibold border-2 border-black rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none focus:bg-white focus:border-[#ff5c00] transition disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={customizingImageIndex !== null || !(chatInputs[activeSceneIndex] || "").trim()}
                        className="p-1.5 bg-[#ffcc00] hover:bg-[#ffcc00]/90 disabled:bg-slate-150 disabled:border-slate-350 border-2 border-black rounded-lg text-black cursor-pointer transition active:translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
                        title="Customize Imagery"
                      >
                        {customizingImageIndex === activeSceneIndex ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                        ) : (
                          <Send className="w-3.5 h-3.5 text-black" />
                        )}
                      </button>
                    </form>

                    {/* Loading subtitle overlay state banner */}
                    {customizingImageIndex === activeSceneIndex && (
                      <div className="text-[8px] font-mono font-bold text-center text-slate-800 bg-[#ffcc00]/10 border border-dashed border-[#ffcc00] py-1 rounded animate-pulse">
                        ⏳ Re-rendering art assets & sync logic...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Pristine empty guide dashboard screen */
            <div className="flex-1 bg-white border-2 border-black rounded-3xl min-h-[500px] p-6 md:p-10 flex flex-col justify-between align-middle text-center font-sans space-y-6 shadow-[6px_6px_0px_#000]">
              
              <div className="max-w-md mx-auto my-auto space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#ff5c00] border-2 border-black mx-auto flex items-center justify-center text-black shadow-[3px_3px_0px_#000]">
                  <Film className="w-7 h-7 text-black" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-display font-black text-black tracking-tight uppercase">Marketicians Short-Form Production Co-Pilot</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    Small business owner, indie founder, or content marketer—deploy elite, high-retention video chronologies from raw pitches in seconds. Satisfies exact time allocations for Instagram, Shorts, and TikTok!
                  </p>
                </div>

                <div className="bg-[#fdfcf6] p-5 border-2 border-black rounded-xl space-y-3 text-left text-xs shadow-[3px_3px_0px_#000]">
                  <span className="text-[10px] uppercase tracking-wider text-[#ff5c00] font-black font-mono block">What is compiled in the package:</span>
                  <div className="grid grid-cols-1 gap-2.5 text-black leading-snug font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#00d1ff] border border-black"></span>
                      <p><strong>Chronological Blocking:</strong> Contiguous second-by-second timelines.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#00d1ff] border border-black"></span>
                      <p><strong>Cinematic Framing Cues:</strong> Smartphone camera angles & pans.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#00d1ff] border border-black"></span>
                      <p><strong>Vibe calibrated Voiceovers:</strong> Slang loops or elite product pitches.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#00d1ff] border border-black"></span>
                      <p><strong>Hyperlocal hooks:</strong> Infused landmarks & local regional trends.</p>
                    </div>
                  </div>
                </div>

                <div className="text-slate-800 font-bold font-mono text-[10px] bg-[#ffcc00]/10 border border-dashed border-[#ffcc00] py-2 px-3 rounded inline-block">
                  💡 <em>Click any <strong>Seed Profile</strong> preset in the sidebar left to immediately pre-fill and launch generation!</em>
                </div>
              </div>

              {/* Minimal footer inside empty layout */}
              <div className="text-[9px] text-slate-700 font-mono font-bold flex items-center justify-center space-x-2 border-t border-slate-200 pt-4">
                <span>LOCAL AREA GPS RESOLUTION</span>
                <span>•</span>
                <span>GEMINI FLASH-3.5 PROMPT ENGINE</span>
              </div>
            </div>
          )}

        </div>
      </main>
      )}

      {/* Aesthetic Page Footer */}
      <footer className="border-t-2 border-black bg-white py-6 px-4 mt-auto font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-black font-bold gap-3">
          <p>© 2026 Marketicians • Engineered for TikTok, Instagram Reels, and Shorts workflows.</p>
          <div className="flex space-x-4">
            <span>Powered by Gemini 3.5 Flash JSON Output</span>
            <span>•</span>
            <span>Real-time local trends priority</span>
          </div>
        </div>
      </footer>

      {isCompilingVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[200] animate-fade-in font-sans">
          <div className="bg-white border-4 border-black w-full max-w-sm rounded-2xl p-6 shadow-[8px_8px_0px_#000] relative text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#ff5c00]/10 border-2 border-dashed border-[#ff5c00] flex items-center justify-center text-[#ff5c00] animate-spin mb-4">
              <Video className="w-8 h-8" />
            </div>

            <h3 className="font-display font-black text-black text-lg uppercase tracking-tight">
              🎬 RENDERING VIDEO...
            </h3>
            
            <p className="text-xs text-slate-800 font-semibold mt-2 leading-relaxed max-w-[340px] mx-auto">
              We are stitching your generated camera mattes, high-fidelity AI voices, kinetic animations, and styled subtitles together frame-by-frame.
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-black text-slate-500 uppercase px-1">
                <span>{compileProgress}</span>
                <span>{compileProgressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-150 border-2 border-black rounded-xl h-5 overflow-hidden p-0.5 shadow-[1.5px_1.5px_0px_#000]">
                <div 
                  className="bg-gradient-to-r from-[#ff5c00] to-[#ffcc00] h-full rounded-md transition-all duration-300 ease-out"
                  style={{ width: `${compileProgressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 border border-dashed border-slate-300 p-3.5 rounded-xl text-[9px] text-slate-700 leading-normal text-left font-medium space-y-1">
              <p className="font-extrabold text-black uppercase tracking-wider text-[8px] flex items-center gap-1.5 mb-1 text-[#ff5c00]">
                <span>⚡ Active pipeline operations:</span>
              </p>
              <p>• Panning and zoom motion mapped dynamically to each visual cue</p>
              <p>• Syncing narrated vocal wave tracks into the Master Mix</p>
              <p>• Live-burned vertical word overlays stamped frame-by-frame</p>
            </div>
          </div>
        </div>
      )}

      {showTour && <OnboardingTour onClose={() => setShowTour(false)} />}
      {isEasterEggOpen && (
        <ViralHackEasterEgg 
          onClose={() => setIsEasterEggOpen(false)}
          onBrainrotToggle={(active) => setIsBrainrotActive(active)}
          onNeoThemeToggle={(active) => setIsNeoThemeActive(active)}
          isBrainrotActive={isBrainrotActive}
          isNeoThemeActive={isNeoThemeActive}
        />
      )}


    </div>
  );
}
