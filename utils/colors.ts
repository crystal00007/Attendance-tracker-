const PALETTE = [
    '#fb923c', // orange-400
    '#facc15', // yellow-400
    '#a3e635', // lime-400
    '#4ade80', // green-400
    '#34d399', // emerald-400
    '#2dd4bf', // teal-400
    '#67e8f9', // cyan-300
    '#7dd3fc', // sky-300
    '#93c5fd', // blue-300
    '#a5b4fc', // indigo-300
    '#c4b5fd', // violet-300
    '#f0abfc', // fuchsia-300
    '#f9a8d4', // pink-300
];

/**
 * Generates a consistent color from a predefined palette based on a string seed.
 * @param seed - A string, typically the course name.
 * @returns A hex color code.
 */
export const generateColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
};

/**
 * Determines if text on a given background color should be black or white for best contrast.
 * @param hexColor - The hex color code of the background.
 * @returns '#000000' for black text or '#FFFFFF' for white text.
 */
export const getTextColorForBackground = (hexColor: string): string => {
    if (!hexColor.startsWith('#')) return '#000000';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Formula for luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#000000' : '#FFFFFF';
};