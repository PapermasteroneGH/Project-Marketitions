import { Presets } from "./types";

export const PRESETS: Presets[] = [
  {
    name: "☕ Austin Retro Coffee",
    category: "Food & Beverage",
    brandVibe: "genz",
    location: "Austin, TX",
    audioKeyword: "Retro Sped-Up Indie Pop",
    description: "A cozy local coffee house in Austin, TX with turntable record players, serving natural honey-lavender iced lattes in vintage glassware and supporting local songwriters."
  },
  {
    name: "🌿 NYC Clean Skincare",
    category: "Beauty & Health",
    brandVibe: "educational",
    location: "New York, NY",
    audioKeyword: "Aesthetic ASMR Botanical Water",
    description: "A modern dermatological apothecary in the West Village, offering custom cold-pressed botanical facial oils in zero-waste cobalt glass bottles."
  },
  {
    name: "🧥 Shoreditch Vintage Clothing",
    category: "Retail Fashion",
    brandVibe: "high_energy_story",
    location: "London, UK",
    audioKeyword: "Aggressive UK Garage Beats",
    description: "A trendy thrift boutique in East London specializing in rare 90s leather outerwear and streetwear drops. Weekly restocks occur every Friday at 4 PM and sell out instantly."
  },
  {
    name: "⚡ SF Productivity App",
    category: "Tech Startup",
    brandVibe: "corporate_sleek",
    location: "San Francisco, CA",
    audioKeyword: "Premium Minimalist Cyber Beats",
    description: "A high-speed tactile calendar and note productivity tool for remote developers. Helps users manage deep work focus blocks and eliminates modern notification fatigue."
  }
];

export const CITY_TRENDS: Record<string, { title: string; style: string; audio: string; tags: string[] }> = {
  "Austin, TX": {
    title: "Congress South Aesthetic Walk",
    style: "Sunny handheld mobile lens flares, vintage vinyl spins, local vintage brick facades.",
    audio: "Indie Chill Rock, Lo-Fi Western Acoustic",
    tags: ["#AustinLocal", "#SouthCongress", "#AustinVibes"]
  },
  "New York, NY": {
    title: "West Village Pedestrian Vlog",
    style: "High-contrast morning shadows, rapid subway window transitions, brownstone stoop closeups.",
    audio: "Classy Jazz Lofi, Fast NY Beat-box",
    tags: ["#NYCStreetStyle", "#WestVillage", "#NYCTrending"]
  },
  "London, UK": {
    title: "Rainy Shoreditch Speed-Ramp",
    style: "Cozy warm indoor light contrasting grey cobblestone streets, red bus motion blur panning.",
    audio: "UK Garage, Neo-Jazz Bedroom Pop",
    tags: ["#LondonAesthetic", "#ShoreditchHauls", "#LondonLife"]
  },
  "Sydney, Australia": {
    title: "Bondi Sunrise Ocean Exposure",
    style: "Saturated clean blues, macro glass cup honey pours, ocean wave drone-mimicking pan.",
    audio: "Suntanned Retro-Synth, Acoustic Wave-Laps",
    tags: ["#SydneyLocal", "#BondiVibes", "#AustraliaAesthetic"]
  },
  "San Francisco, CA": {
    title: "Dolores Park Sunset Transition",
    style: "Rolling foggy hills background, terminal glowing code reflections, historic cable-car tracking.",
    audio: "Tech Lofi-Chill, SF Hip-hop loops",
    tags: ["#SFSartup", "#DoloresPark", "#BayAreaLife"]
  },
  "Tokyo, Japan": {
    title: "Neon Shibuya Intersection Fast-cut",
    style: "Cyberpunk rain puddles, neon reflection closeups, mechanical steam whisking green tea matcha.",
    audio: "Accelerated Future Bass, Kawaii Synth ASMR",
    tags: ["#TokyoVibes", "#ShibuyaCrossing", "#JapanFinds"]
  }
};
