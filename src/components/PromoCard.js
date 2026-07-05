// Lensmakers Promo Card Component (Summer Collection + Orange LENS20 Chip + Checklist)

const { useState } = React;

window.PromoCard = function PromoCard({ onApplyCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('LENS20');
    setCopied(true);
    if (onApplyCode) onApplyCode('LENS20');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="px-5 my-8">
      <div className="glass-panel p-6 border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-r from-[#F97316]/25 via-[#2D1B5E]/50 to-[#1E3A6E]/40 group">
        
        {/* Warm-toned gradient overlay & sunburst aura */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#F97316]/25 to-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#EC4899]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FBBF24] flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24] mr-2 animate-ping"></span>
              LIMITED TIME OFFER
            </span>
            <span className="text-xs text-white/70 font-semibold">Ends in 3 days</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-3 drop-shadow">
            SUMMER COLLECTION
          </h2>

          {/* Discount text with orange highlighted chip */}
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-white/90 font-medium mb-5">
            <span>Get 20% off your first order with code</span>
            <button 
              onClick={handleCopyCode}
              className="px-3 py-1 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-heading font-extrabold tracking-wider text-base shadow-[0_0_15px_rgba(249,115,22,0.6)] btn-spring flex items-center space-x-1.5 border border-white/20"
              title="Click to copy & apply code"
            >
              <span>LENS20</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {copied ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                )}
              </svg>
            </button>
            {copied && (
              <span className="text-xs font-bold text-[#A3E635] animate-fade-in-up">
                ✓ Copied & Applied!
              </span>
            )}
          </div>

          {/* Checklist below with green checkmarks */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm font-semibold text-white">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/50 flex items-center justify-center text-[#22C55E] flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Free Shipping</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/50 flex items-center justify-center text-[#22C55E] flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>1-Year Warranty</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/50 flex items-center justify-center text-[#22C55E] flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>14-Day Free Returns</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
