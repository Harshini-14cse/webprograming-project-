import { motion } from 'framer-motion'

/** Decorative animated AI orb for the dashboard hero. */
export default function AIOrb({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-3xl" />

      <motion.div
        className="relative"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 240 240" className="h-56 w-56 drop-shadow-[0_0_40px_rgba(124,58,237,0.5)]">
          <defs>
            <radialGradient id="orb" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="45%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#4c1d95" />
            </radialGradient>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Core sphere */}
          <circle cx="120" cy="120" r="62" fill="url(#orb)" />
          <circle cx="100" cy="98" r="20" fill="#ffffff" opacity="0.25" />

          {/* AI label */}
          <text
            x="120"
            y="132"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize="38"
            fontWeight="800"
            fill="#ffffff"
          >
            AI
          </text>

          {/* Orbit rings */}
          <motion.g
            style={{ originX: '120px', originY: '120px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <ellipse cx="120" cy="120" rx="104" ry="44" fill="none" stroke="url(#ring)" strokeWidth="1.5" />
            <circle cx="224" cy="120" r="5" fill="#a78bfa" />
          </motion.g>
          <motion.g
            style={{ originX: '120px', originY: '120px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            <ellipse
              cx="120"
              cy="120"
              rx="44"
              ry="104"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <circle cx="120" cy="16" r="4" fill="#6366f1" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}
