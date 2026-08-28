import {
  UtensilsCrossed,
  Home,
  Car,
  Gamepad2,
  Zap,
  HeartPulse,
  ShoppingBag,
  Briefcase,
  Tag,
} from 'lucide-react';

// A warm, gold-forward ramp used for categories that don't have a fixed
// mapping below. Kept mostly warm on purpose, with one muted cool note
// near the end so a chart with 7+ active categories still stays readable.
export const CATEGORY_COLOR_RAMP = [
  '#e8b34d', // gold
  '#d9593f', // ember
  '#b0723c', // bronze
  '#93b25a', // moss
  '#c98a3e', // amber
  '#d98e73', // terracotta
  '#8a6fbf', // plum accent
  '#9c7a54', // umber
];

export const CATEGORY_META = {
  Food: { icon: UtensilsCrossed, color: '#e8b34d' },
  Rent: { icon: Home, color: '#d9593f' },
  Transport: { icon: Car, color: '#b0723c' },
  Entertainment: { icon: Gamepad2, color: '#8a6fbf' },
  Utilities: { icon: Zap, color: '#d98e73' },
  Healthcare: { icon: HeartPulse, color: '#93b25a' },
  Shopping: { icon: ShoppingBag, color: '#c98a3e' },
  Income: { icon: Briefcase, color: '#f6d98a' },
  Other: { icon: Tag, color: '#9c7a54' },
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getCategoryMeta = (category) => {
  if (CATEGORY_META[category]) return CATEGORY_META[category];
  const color = CATEGORY_COLOR_RAMP[hashString(category || 'Other') % CATEGORY_COLOR_RAMP.length];
  return { icon: Tag, color };
};

export const getCategoryColor = (category, index) => {
  if (CATEGORY_META[category]) return CATEGORY_META[category].color;
  if (typeof index === 'number') return CATEGORY_COLOR_RAMP[index % CATEGORY_COLOR_RAMP.length];
  return getCategoryMeta(category).color;
};
