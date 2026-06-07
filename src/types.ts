/**
 * Types and interfaces for Marketicians
 */

export type BrandVibe = 'genz' | 'corporate_sleek' | 'educational' | 'high_energy_story';

export interface StoryboardScene {
  timecode: string;
  durationSeconds: number;
  visualCue: string;
  voiceover: string;
  textOverlay: string;
  proTip: string;
}

export interface Storyboard {
  title: string;
  description: string;
  hashtags: string[];
  localTrendUsed: string;
  scenes: StoryboardScene[];
}

export interface GenerationSettings {
  businessDescription: string;
  brandVibe: BrandVibe;
  platform: 'tiktok' | 'reels' | 'shorts';
  durationSeconds: 15 | 30 | 60;
  location: string;
  audioKeyword: string;
}

export interface Presets {
  name: string;
  category: string;
  description: string;
  brandVibe: BrandVibe;
  location: string;
  audioKeyword: string;
}
