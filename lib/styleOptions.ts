export type StyleOption = {
  id: string
  name: string
  description: string
  category: string
  popular: boolean
  gradient: string
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'south-park',
    name: 'South Park Classic',
    description: 'Flat 2D colors, bold black outlines',
    category: 'Cartoon Classics',
    popular: true,
    gradient: 'from-lime-200 via-emerald-200 to-sky-200',
  },
  {
    id: 'simpsons',
    name: 'The Simpsons',
    description: 'Bright palettes with simple line art',
    category: 'Cartoon Classics',
    popular: true,
    gradient: 'from-amber-200 via-yellow-200 to-orange-200',
  },
  {
    id: 'family-guy',
    name: 'Family Guy',
    description: 'Bold shapes, expressive features',
    category: 'Cartoon Classics',
    popular: false,
    gradient: 'from-rose-200 via-pink-200 to-purple-200',
  },
  {
    id: 'classic-toons',
    name: 'Classic Toons',
    description: 'Retro, punchy line work',
    category: 'Cartoon Classics',
    popular: false,
    gradient: 'from-orange-200 via-amber-200 to-red-200',
  },
  {
    id: 'modern-digital',
    name: 'Modern Digital',
    description: 'Clean gradients with soft shadows',
    category: 'Modern Animation',
    popular: true,
    gradient: 'from-cyan-200 via-sky-200 to-indigo-200',
  },
  {
    id: 'vector-pop',
    name: 'Vector Pop',
    description: 'Bold blocks, graphic highlights',
    category: 'Modern Animation',
    popular: false,
    gradient: 'from-fuchsia-200 via-pink-200 to-purple-200',
  },
  {
    id: 'minimal-3d',
    name: 'Minimal 3D',
    description: 'Soft lighting, sculpted forms',
    category: 'Modern Animation',
    popular: false,
    gradient: 'from-slate-200 via-zinc-200 to-stone-200',
  },
  {
    id: 'studio-ghibli',
    name: 'Studio Ghibli',
    description: 'Dreamy, painterly anime mood',
    category: 'Anime',
    popular: true,
    gradient: 'from-emerald-200 via-teal-200 to-cyan-200',
  },
  {
    id: 'shonen-pop',
    name: 'Shonen Pop',
    description: 'Dynamic lines, energetic colors',
    category: 'Anime',
    popular: false,
    gradient: 'from-red-200 via-orange-200 to-yellow-200',
  },
  {
    id: 'chibi-cute',
    name: 'Chibi Cute',
    description: 'Oversized eyes, cozy charm',
    category: 'Anime',
    popular: false,
    gradient: 'from-pink-200 via-rose-200 to-red-200',
  },
  {
    id: 'painterly-realism',
    name: 'Painterly Realism',
    description: 'Soft brushwork with rich color',
    category: 'Realistic Cartoon',
    popular: true,
    gradient: 'from-stone-200 via-amber-200 to-rose-200',
  },
  {
    id: 'comic-realism',
    name: 'Comic Realism',
    description: 'Detailed shading with ink lines',
    category: 'Realistic Cartoon',
    popular: false,
    gradient: 'from-slate-200 via-blue-200 to-indigo-200',
  },
  {
    id: 'sketch-wash',
    name: 'Sketch + Wash',
    description: 'Textured pencil with watercolor',
    category: 'Realistic Cartoon',
    popular: false,
    gradient: 'from-neutral-200 via-gray-200 to-zinc-200',
  },
  {
    id: 'holiday-sweater',
    name: 'Holiday Sweater',
    description: 'Festive palette, cozy accents',
    category: 'Seasonal',
    popular: true,
    gradient: 'from-red-200 via-emerald-200 to-teal-200',
  },
  {
    id: 'spooky-night',
    name: 'Spooky Night',
    description: 'Moody glow with warm highlights',
    category: 'Seasonal',
    popular: false,
    gradient: 'from-indigo-200 via-purple-200 to-slate-200',
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    description: 'Floral accents, airy hues',
    category: 'Seasonal',
    popular: false,
    gradient: 'from-emerald-200 via-lime-200 to-yellow-200',
  },
]
