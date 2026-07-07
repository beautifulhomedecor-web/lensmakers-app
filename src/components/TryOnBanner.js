// Lensmakers Virtual Try-On Banner Component (Full-width Glass Panel + Breathing Glow Button)

window.TryOnBanner = function TryOnBanner({ onTriggerTryOn }) {
  return (
    <section className="px-5 my-8">
      <div className="glass-panel p-5 sm:p-6 border border-white/20 relative overflow-hidden shadow-2xl bg-gradient-to-r from-[#8B5CF6]/20 via-[#EC4899]/15 to-[#2D1B5E]/30 group">
        
        {/* Ambient magenta aura */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#EC4899]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#EC4899]/30 transition-colors duration-500"></div>

        {/* Top Row: Icon + Title + Infinity Mark */}
        <div className="flex items-start justify-between relative z-10 mb-5">
          <div className="flex items-start space-x-4">
            
            {/* Pink camera/face-scan icon in rounded square */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC4899]/30 to-[#F43F5E]/10 border border-[#EC4899]/50 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] flex-shrink-0">
              <svg className="w-8 h-8 text-[#F43F5E] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18v-1a6 6 0 0112 0v1" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeDasharray="2 2" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight">
                  Virtual Try-On
                </h2>
                <span className="bg-gradient-to-r from-[#00E5FF] to-[#8140DC] text-[#0B2A6B] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(0,229,255,0.8)]">
                  AI Studio Pro
                </span>
              </div>
              <p className="text-sm text-[#C7C3D9] max-w-xs sm:max-w-md leading-relaxed font-normal">
                Real-time FaceMesh live camera or instant selfie photo upload
              </p>
            </div>
          </div>

          {/* Small Brand Infinity Mark on Right */}
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M18.178 8C19.864 8 21.231 9.367 21.231 11.053C21.231 12.739 19.864 14.106 18.178 14.106C16.492 14.106 15.125 12.739 15.125 11.053C15.125 9.367 16.492 8 18.178 8Z" stroke="url(#tryon-logo-grad)" strokeWidth="2.5"/>
              <path d="M5.822 8C7.508 8 8.875 9.367 8.875 11.053C8.875 12.739 7.508 14.106 5.822 14.106C4.136 14.106 2.769 9.367 2.769 11.053C2.769 9.367 4.136 8 5.822 8Z" stroke="url(#tryon-logo-grad)" strokeWidth="2.5"/>
              <defs>
                <linearGradient id="tryon-logo-grad" x1="2.769" y1="8" x2="21.231" y2="14.106" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6"/>
                  <stop offset="1" stopColor="#22C55E"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Large Pill-Shaped "Try Now" Button in Magenta-Pink Gradient with Breathing Glow */}
        <div className="relative z-10 flex justify-center mt-2">
          <button 
            onClick={onTriggerTryOn}
            className="w-full sm:w-80 py-4 px-6 rounded-full primary-gradient-btn breathing-glow btn-spring flex items-center justify-center space-x-3 text-base sm:text-lg font-bold uppercase tracking-wider shadow-xl"
          >
            <svg className="w-6 h-6 text-white animate-bounce" style={{ animationDuration: '2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Try Now</span>
          </button>
        </div>

        {/* Feature badges at bottom */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-[#C7C3D9]/80 font-medium">
          <span className="flex items-center">⚡ Instant 3D AR</span>
          <span className="flex items-center">AI Face Fit Analysis</span>
        </div>
      </div>
    </section>
  );
};
