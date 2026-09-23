// A small animated vector remains available even when WebGL cannot initialize.
export default function HeroFallback() {
  return (
    <div className="hero__fallback" aria-hidden="true">
      <svg viewBox="0 0 200 260" width="200" height="260">
        <defs>
          <radialGradient id="bb8-shell" cx="35%" cy="25%" r="75%">
            <stop offset="0" stopColor="#fffdf2" />
            <stop offset=".65" stopColor="#d7d5c7" />
            <stop offset="1" stopColor="#85877f" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="246" rx="76" ry="9" fill="#17120e" opacity=".3" />
        <g className="hero__fallback-body">
          <circle cx="100" cy="166" r="76" fill="url(#bb8-shell)" stroke="#a9aaa0" strokeWidth="2" />
          <circle cx="105" cy="168" r="45" fill="#a75b20" />
          <circle cx="105" cy="168" r="32" fill="#d9d8cb" stroke="#6e716b" strokeWidth="3" />
          <path d="M95 137h20v20h19v22h-19v19H95v-19H76v-22h19z" fill="#646a65" />
          <path d="M38 120q-20 37-5 65M157 110q26 32 17 64" fill="none" stroke="#b56827" strokeWidth="12" />
          <path d="m44 205 16-12m71 34-8-17M72 100l7 16" stroke="#92978e" strokeWidth="4" />
        </g>
        <g className="hero__fallback-head">
          <path d="m76 47-4-33m13 30 1-25" stroke="#a4a69b" strokeWidth="3" />
          <path d="M47 92a53 53 0 0 1 106 0l-7 12H54z" fill="url(#bb8-shell)" stroke="#8e9189" strokeWidth="2" />
          <path d="M50 84h100M55 97h90" stroke="#b96c27" strokeWidth="7" />
          <path d="M74 48q25-13 48 1" fill="none" stroke="#777e78" strokeWidth="6" />
          <circle cx="114" cy="69" r="14" fill="#252d30" stroke="#737b79" strokeWidth="4" />
          <circle cx="118" cy="64" r="4" fill="#e1edf0" />
          <circle cx="139" cy="83" r="5" fill="#292f30" />
        </g>
      </svg>
    </div>
  );
}
