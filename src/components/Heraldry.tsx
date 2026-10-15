export function StateCrest({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield shape */}
      <path
        d="M60 8L10 28V68C10 98 60 132 60 132C60 132 110 98 110 68V28L60 8Z"
        fill="url(#shieldGradient)"
        stroke="#D4AF37"
        strokeWidth="2.5"
      />
      
      {/* Inner shield border */}
      <path
        d="M60 14L16 32V68C16 94 60 125 60 125C60 125 104 94 104 68V32L60 14Z"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="0.8"
        opacity="0.5"
      />
      
      {/* Crown */}
      <path
        d="M35 35L42 28L48 35L54 25L60 35L66 25L72 35L78 28L85 35V42H35V35Z"
        fill="#D4AF37"
        opacity="0.9"
      />
      <circle cx="48" cy="32" r="2" fill="#121417" />
      <circle cx="60" cy="29" r="2.5" fill="#121417" />
      <circle cx="72" cy="32" r="2" fill="#121417" />
      
      {/* Central star */}
      <path
        d="M60 55L63.5 65H74L65.5 71.5L68.5 82L60 76L51.5 82L54.5 71.5L46 65H56.5L60 55Z"
        fill="#D4AF37"
        opacity="0.9"
      />
      
      {/* Laurel branches */}
      <path
        d="M30 70C32 65 36 62 40 60C38 64 37 68 37 72C35 70 32 69 30 70Z"
        fill="#D4AF37"
        opacity="0.6"
      />
      <path
        d="M28 80C30 75 34 72 38 70C36 74 35 78 35 82C33 80 30 79 28 80Z"
        fill="#D4AF37"
        opacity="0.6"
      />
      <path
        d="M30 90C32 85 36 82 40 80C38 84 37 88 37 92C35 90 32 89 30 90Z"
        fill="#D4AF37"
        opacity="0.6"
      />
      
      <path
        d="M90 70C88 65 84 62 80 60C82 64 83 68 83 72C85 70 88 69 90 70Z"
        fill="#D4AF37"
        opacity="0.6"
      />
      <path
        d="M92 80C90 75 86 72 82 70C84 74 85 78 85 82C87 80 90 79 92 80Z"
        fill="#D4AF37"
        opacity="0.6"
      />
      <path
        d="M90 90C88 85 84 82 80 80C82 84 83 88 83 92C85 90 88 89 90 90Z"
        fill="#D4AF37"
        opacity="0.6"
      />
      
      {/* Banner ribbon */}
      <path
        d="M25 105L35 100H85L95 105L90 110H30L25 105Z"
        fill="#D4AF37"
        opacity="0.8"
      />
      <path
        d="M25 105L20 112L30 110"
        fill="#a88a2c"
        opacity="0.6"
      />
      <path
        d="M95 105L100 112L90 110"
        fill="#a88a2c"
        opacity="0.6"
      />
      
      {/* Banner text */}
      <text
        x="60"
        y="108"
        textAnchor="middle"
        fill="#121417"
        fontFamily="serif"
        fontSize="7"
        fontWeight="bold"
        letterSpacing="1"
      >
        VERITAS
      </text>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="shieldGradient" x1="60" y1="8" x2="60" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a1d23" />
          <stop offset="50%" stopColor="#121417" />
          <stop offset="100%" stopColor="#0d0f12" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OrnamentalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37] opacity-50">
        <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
    </div>
  );
}

export function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotations = {
    tl: 'rotate(0)',
    tr: 'rotate(90)',
    bl: 'rotate(270)',
    br: 'rotate(180)',
  };
  
  const positions = {
    tl: 'top-2 left-2',
    tr: 'top-2 right-2',
    bl: 'bottom-2 left-2',
    br: 'bottom-2 right-2',
  };
  
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`absolute ${positions[position]} text-[#D4AF37] opacity-30`}
      style={{ transform: rotations[position] }}
    >
      <path d="M0 0L20 0L20 4L4 4L4 20L0 20L0 0Z" fill="currentColor" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}
