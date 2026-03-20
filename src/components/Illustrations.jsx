import React from 'react';

/* ──────────────────────────────────────────────────────────
   Empty State: No classes today
   ────────────────────────────────────────────────────────── */
export const IllustrationNoClasses = ({ width = 220, className = '' }) => (
  <svg
    width={width}
    viewBox="0 0 220 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Background circle */}
    <circle cx="110" cy="90" r="78" fill="url(#grad-bg)" opacity="0.12" />

    {/* Calendar body */}
    <rect x="44" y="52" width="132" height="100" rx="14" fill="url(#grad-cal)" opacity="0.95" />
    <rect x="44" y="52" width="132" height="100" rx="14" stroke="url(#grad-stroke)" strokeWidth="1.5" />

    {/* Calendar header strip */}
    <rect x="44" y="52" width="132" height="32" rx="14" fill="url(#grad-header)" />
    <rect x="44" y="68" width="132" height="16" fill="url(#grad-header)" />

    {/* Header dots / binding holes */}
    <circle cx="75" cy="48" r="5" fill="url(#grad-dot)" />
    <circle cx="145" cy="48" r="5" fill="url(#grad-dot)" />
    <rect x="73" y="44" width="4" height="10" rx="2" fill="#6366f1" opacity="0.4" />
    <rect x="143" y="44" width="4" height="10" rx="2" fill="#6366f1" opacity="0.4" />

    {/* Month label */}
    <rect x="80" y="61" width="60" height="8" rx="4" fill="white" opacity="0.35" />

    {/* Day grid */}
    {[0,1,2,3,4,5,6].map((i) => (
      <rect key={i} x={54 + i * 17} y="96" width="10" height="6" rx="3" fill="white" opacity="0.18" />
    ))}

    {/* Empty row lines */}
    {[0,1,2].map((r) =>
      [0,1,2,3,4,5,6].map((c) => (
        <rect
          key={`${r}-${c}`}
          x={54 + c * 17}
          y={110 + r * 14}
          width="10"
          height="6"
          rx="3"
          fill="white"
          opacity={0.06 + Math.random() * 0.08}
        />
      ))
    )}

    {/* Star / sparkle top-right */}
    <g transform="translate(162, 34)">
      <line x1="0" y1="-9" x2="0" y2="9" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
      <line x1="-9" y1="0" x2="9" y2="0" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
      <line x1="-6" y1="-6" x2="6" y2="6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="6" y1="-6" x2="-6" y2="6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </g>

    {/* Small sparkle bottom-left */}
    <g transform="translate(46, 166)">
      <line x1="0" y1="-5" x2="0" y2="5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Moon icon on calendar face - "free day" */}
    <path
      d="M107 118 a14 14 0 1 0 14 -14 a10 10 0 1 1 -14 14z"
      fill="url(#grad-moon)"
      opacity="0.7"
    />

    {/* Small orbiting dot */}
    <circle cx="130" cy="100" r="3" fill="#f59e0b" opacity="0.8" />
    <circle cx="88" cy="138" r="2" fill="#10b981" opacity="0.7" />

    {/* Floating dots */}
    <circle cx="34" cy="70" r="3" fill="#6366f1" opacity="0.3" />
    <circle cx="192" cy="130" r="4" fill="#a78bfa" opacity="0.25" />
    <circle cx="28" cy="120" r="2" fill="#f59e0b" opacity="0.4" />

    <defs>
      <linearGradient id="grad-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="grad-cal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e35" />
        <stop offset="100%" stopColor="#16162a" />
      </linearGradient>
      <linearGradient id="grad-header" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="grad-stroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="grad-dot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="grad-moon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
  </svg>
);

/* ──────────────────────────────────────────────────────────
   Empty State: No timetable entries at all
   ────────────────────────────────────────────────────────── */
export const IllustrationEmptyTimetable = ({ width = 220, className = '' }) => (
  <svg
    width={width}
    viewBox="0 0 220 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="110" cy="90" r="78" fill="url(#et-bg)" opacity="0.1" />

    {/* Notebook lines */}
    <rect x="50" y="30" width="120" height="140" rx="12" fill="url(#et-book)" />
    <rect x="50" y="30" width="120" height="140" rx="12" stroke="url(#et-stroke)" strokeWidth="1.5" />

    {/* Spine */}
    <rect x="50" y="30" width="18" height="140" rx="12" fill="url(#et-spine)" />
    <rect x="50" y="30" width="18" height="140" rx="0" fill="url(#et-spine)" />
    <rect x="50" y="30" width="18" height="140" rx="12" fill="url(#et-spine)" />

    {/* Binding holes */}
    {[55, 90, 125, 160].map((y) => (
      <circle key={y} cx="59" cy={y} r="4" fill="#0a0a0f" opacity="0.5" />
    ))}

    {/* Ruled lines */}
    {[70, 86, 102, 118, 134, 150].map((y) => (
      <rect key={y} x="78" y={y} width="80" height="4" rx="2" fill="white" opacity="0.08" />
    ))}

    {/* Plus icon in centre — "add entries" hint */}
    <circle cx="118" cy="110" r="20" fill="url(#et-plus-bg)" opacity="0.9" />
    <line x1="118" y1="102" x2="118" y2="118" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="110" y1="110" x2="126" y2="110" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

    {/* Title lines */}
    <rect x="78" y="48" width="55" height="7" rx="3.5" fill="url(#et-accent)" opacity="0.7" />
    <rect x="78" y="58" width="35" height="5" rx="2.5" fill="white" opacity="0.12" />

    {/* Floating elements */}
    <circle cx="36" cy="55" r="5" fill="#6366f1" opacity="0.2" />
    <circle cx="188" cy="145" r="7" fill="#a78bfa" opacity="0.18" />
    <circle cx="185" cy="50" r="3" fill="#f59e0b" opacity="0.35" />
    <circle cx="38" cy="148" r="3" fill="#10b981" opacity="0.3" />

    {/* Sparkle */}
    <g transform="translate(178, 68)">
      <line x1="0" y1="-7" x2="0" y2="7" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="-7" y1="0" x2="7" y2="0" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
    </g>

    <defs>
      <linearGradient id="et-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="et-book" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e35" />
        <stop offset="100%" stopColor="#13132a" />
      </linearGradient>
      <linearGradient id="et-spine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="et-stroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="et-plus-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="et-accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
  </svg>
);

/* ──────────────────────────────────────────────────────────
   Hero / Today page decorative banner illustration
   ────────────────────────────────────────────────────────── */
export const IllustrationTodayHero = ({ className = '' }) => (
  <svg
    viewBox="0 0 340 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Glow blob */}
    <ellipse cx="270" cy="55" rx="90" ry="65" fill="url(#hero-blob)" opacity="0.18" />
    <ellipse cx="80" cy="55" rx="60" ry="45" fill="url(#hero-blob2)" opacity="0.12" />

    {/* Clock face */}
    <circle cx="270" cy="55" r="40" stroke="url(#hero-clock-stroke)" strokeWidth="2" fill="url(#hero-clock-fill)" />
    <circle cx="270" cy="55" r="3" fill="url(#hero-accent)" />
    {/* Hour ticks */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 270 + 33 * Math.sin(angle);
      const y1 = 55 - 33 * Math.cos(angle);
      const x2 = 270 + 37 * Math.sin(angle);
      const y2 = 55 - 37 * Math.cos(angle);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="white" strokeWidth={i % 3 === 0 ? 2 : 1} strokeLinecap="round" opacity="0.3" />
      );
    })}
    {/* Hands — showing ~9:20 */}
    <line x1="270" y1="55" x2="258" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    <line x1="270" y1="55" x2="285" y2="46" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

    {/* Schedule cards */}
    <rect x="20" y="20" width="180" height="28" rx="8" fill="url(#hero-card1)" opacity="0.9" />
    <rect x="22" y="24" width="5" height="20" rx="2.5" fill="#6366f1" />
    <rect x="34" y="28" width="70" height="5" rx="2.5" fill="white" opacity="0.8" />
    <rect x="34" y="36" width="45" height="4" rx="2" fill="white" opacity="0.35" />
    <rect x="170" y="26" width="24" height="6" rx="3" fill="url(#hero-live)" />
    <circle cx="173" cy="29" r="2" fill="white" opacity="0.9" />

    <rect x="20" y="55" width="180" height="28" rx="8" fill="url(#hero-card2)" opacity="0.85" />
    <rect x="22" y="59" width="5" height="20" rx="2.5" fill="#10b981" />
    <rect x="34" y="63" width="80" height="5" rx="2.5" fill="white" opacity="0.7" />
    <rect x="34" y="71" width="50" height="4" rx="2" fill="white" opacity="0.3" />

    <rect x="20" y="90" width="180" height="22" rx="8" fill="url(#hero-card3)" opacity="0.55" />
    <rect x="22" y="93" width="5" height="16" rx="2.5" fill="#f59e0b" />
    <rect x="34" y="97" width="60" height="5" rx="2.5" fill="white" opacity="0.5" />

    {/* Connecting dots/line */}
    <line x1="205" y1="34" x2="228" y2="55" stroke="url(#hero-line)" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

    {/* Decorative small circles */}
    <circle cx="10" cy="10" r="4" fill="#6366f1" opacity="0.25" />
    <circle cx="330" cy="10" r="3" fill="#a78bfa" opacity="0.3" />
    <circle cx="8" cy="100" r="3" fill="#10b981" opacity="0.3" />
    <circle cx="335" cy="100" r="5" fill="#f59e0b" opacity="0.2" />

    {/* Grid dots top-right corner */}
    {[0,1,2].map(r => [0,1,2].map(c => (
      <circle key={`${r}-${c}`} cx={295 + c * 8} cy={10 + r * 8} r="1.2"
        fill="white" opacity="0.15" />
    )))}

    <defs>
      <linearGradient id="hero-blob" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="hero-blob2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="hero-clock-stroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="hero-clock-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e35" />
        <stop offset="100%" stopColor="#13132a" />
      </linearGradient>
      <linearGradient id="hero-accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="hero-card1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e35" />
        <stop offset="100%" stopColor="#16162a" />
      </linearGradient>
      <linearGradient id="hero-card2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a2535" />
        <stop offset="100%" stopColor="#131d2a" />
      </linearGradient>
      <linearGradient id="hero-card3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e35" />
        <stop offset="100%" stopColor="#16162a" />
      </linearGradient>
      <linearGradient id="hero-live" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

/* ──────────────────────────────────────────────────────────
   Timetable page hero — weekly grid decoration
   ────────────────────────────────────────────────────────── */
export const IllustrationWeekHero = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Background glow */}
    <ellipse cx="100" cy="45" rx="95" ry="42" fill="url(#wh-bg)" opacity="0.12" />

    {/* 7-column week grid */}
    {['M','T','W','T','F','S','S'].map((d, i) => (
      <g key={i} transform={`translate(${8 + i * 27}, 0)`}>
        {/* Day label */}
        <rect x="2" y="8" width="20" height="12" rx="4" fill="url(#wh-day)" opacity="0.55" />
        <text x="12" y="18" textAnchor="middle" fontSize="6" fill="white" opacity="0.7" fontFamily="Inter,sans-serif" fontWeight="600">{d}</text>

        {/* Random class blocks per column */}
        {[28, 44, 60, 76].map((y, j) => {
          const hasClass = (i + j) % 3 !== 0;
          const colors = ['url(#wh-c1)', 'url(#wh-c2)', 'url(#wh-c3)', 'url(#wh-c4)'];
          return hasClass ? (
            <rect key={j} x="2" y={y} width="20" height={j === 1 ? 12 : 10} rx="3"
              fill={colors[(i + j) % 4]} opacity={i === 4 && j === 0 ? 1 : 0.65} />
          ) : null;
        })}
      </g>
    ))}

    {/* Highlight today column (index 4 = Friday) */}
    <rect x="116" y="6" width="24" height="82" rx="6" stroke="#6366f1" strokeWidth="1.5"
      fill="#6366f1" fillOpacity="0.06" />

    {/* Current time indicator line */}
    <line x1="8" y1="56" x2="196" y2="56" stroke="url(#wh-time)" strokeWidth="1"
      strokeDasharray="3 3" opacity="0.5" />
    <circle cx="8" cy="56" r="3" fill="#6366f1" />

    {/* Floating sparkles */}
    <g transform="translate(190, 12)">
      <line x1="0" y1="-5" x2="0" y2="5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <circle cx="4" cy="82" r="2" fill="#10b981" opacity="0.5" />
    <circle cx="196" cy="82" r="2" fill="#f59e0b" opacity="0.5" />

    <defs>
      <linearGradient id="wh-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="wh-day" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="wh-c1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4f52d4" />
      </linearGradient>
      <linearGradient id="wh-c2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="wh-c3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="wh-c4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="wh-time" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

/* ──────────────────────────────────────────────────────────
   OCR / Scan illustration for the upload zone
   ────────────────────────────────────────────────────────── */
export const IllustrationScan = ({ width = 56, className = '' }) => (
  <svg
    width={width}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="52" height="52" rx="14" fill="url(#scan-bg)" opacity="0.15" />

    {/* Corner scan brackets */}
    <path d="M8 20 L8 8 L20 8" stroke="url(#scan-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36 8 L48 8 L48 20" stroke="url(#scan-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M48 36 L48 48 L36 48" stroke="url(#scan-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 48 L8 48 L8 36" stroke="url(#scan-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Scan line */}
    <line x1="10" y1="28" x2="46" y2="28" stroke="url(#scan-line)" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="10" y="26" width="36" height="4" rx="2" fill="url(#scan-line)" opacity="0.15" />

    {/* Document lines inside */}
    <rect x="16" y="18" width="24" height="3" rx="1.5" fill="white" opacity="0.2" />
    <rect x="16" y="35" width="18" height="3" rx="1.5" fill="white" opacity="0.2" />

    <defs>
      <linearGradient id="scan-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="scan-accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="scan-line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
        <stop offset="30%" stopColor="#6366f1" />
        <stop offset="70%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
