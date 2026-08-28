export const GranuleMark = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="granule-mark-g" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#F6D98A" />
        <stop offset="0.55" stopColor="#E8B34D" />
        <stop offset="1" stopColor="#B0762A" />
      </linearGradient>
    </defs>
    <path d="M24 6 L40 15.5 V32.5 L24 42 L8 32.5 V15.5 Z" fill="url(#granule-mark-g)" />
    <path d="M24 6 L40 15.5 L24 24 L8 15.5 Z" fill="#F6D98A" fillOpacity="0.55" />
    <path d="M24 24 L40 15.5 V32.5 L24 42 Z" fill="#8A5A1E" fillOpacity="0.35" />
    <path d="M24 6 V24 M24 24 L8 15.5 M24 24 L40 15.5 M24 24 V42" stroke="#0B0805" strokeWidth="0.75" strokeOpacity="0.4" />
  </svg>
);
