const RobotLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center gap-6">
    <svg width="80" height="90" viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          {`
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
            @keyframes blink { 0%,90%,100%{opacity:1} 93%,97%{opacity:0} }
            @keyframes think { 0%,100%{opacity:0.2} 50%{opacity:1} }
            @keyframes glow { 0%,100%{opacity:0.95} 50%{opacity:0.55} }
            .rl-robot { animation: float 3.2s ease-in-out infinite; }
            .rl-eye-l { animation: blink 4s ease-in-out infinite, glow 2s ease-in-out infinite; }
            .rl-eye-r { animation: blink 4s ease-in-out infinite 0.15s, glow 2s ease-in-out infinite 0.5s; }
            .rl-td1 { animation: think 1.2s ease-in-out infinite; }
            .rl-td2 { animation: think 1.2s ease-in-out infinite 0.3s; }
            .rl-td3 { animation: think 1.2s ease-in-out infinite 0.6s; }
          `}
        </style>
      </defs>
      <g className="rl-robot">
        {/* Antenna */}
        <line x1="40" y1="18" x2="40" y2="4" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="4" r="4" fill="#EEEDFE" stroke="#534AB7" strokeWidth="1.2" />
        <circle cx="40" cy="4" r="2" fill="#7F77DD" />
        {/* Head */}
        <rect x="4" y="18" width="72" height="52" rx="12" fill="#EEEDFE" stroke="#534AB7" strokeWidth="1.4" />
        {/* Eyes */}
        <rect x="12" y="30" width="22" height="16" rx="5" fill="#3C3489" opacity="0.12" stroke="#534AB7" strokeWidth="0.8" />
        <rect x="46" y="30" width="22" height="16" rx="5" fill="#3C3489" opacity="0.12" stroke="#534AB7" strokeWidth="0.8" />
        <ellipse cx="23" cy="38" rx="7" ry="7" fill="#7F77DD" className="rl-eye-l" />
        <ellipse cx="57" cy="38" rx="7" ry="7" fill="#7F77DD" className="rl-eye-r" />
        <ellipse cx="23" cy="38" rx="3" ry="3" fill="#EEEDFE" />
        <ellipse cx="57" cy="38" rx="3" ry="3" fill="#EEEDFE" />
        {/* Mouth */}
        <rect x="22" y="56" width="36" height="8" rx="4" fill="#3C3489" opacity="0.1" stroke="#534AB7" strokeWidth="0.6" />
        <line x1="29" y1="60" x2="29" y2="60" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="36" y1="58" x2="36" y2="62" stroke="#7F77DD" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="44" y1="57" x2="44" y2="63" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <line x1="52" y1="58" x2="52" y2="62" stroke="#7F77DD" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Thinking dots */}
        <circle cx="64" cy="14" r="3" fill="#AFA9EC" className="rl-td1" />
        <circle cx="72" cy="8" r="3.5" fill="#AFA9EC" className="rl-td2" />
        <circle cx="80" cy="2" r="4.5" fill="#7F77DD" className="rl-td3" />
        {/* Neck */}
        <rect x="29" y="70" width="22" height="12" rx="4" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.8" />
      </g>
    </svg>
    <p className="text-custom-light/60 text-sm tracking-widest uppercase">{message}</p>
  </div>
)

export default RobotLoader