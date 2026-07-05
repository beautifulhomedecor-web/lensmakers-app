// Lensmakers Location Card Component (Map Grid + Pulsing Gold Pin + Lime Label + Location Sheet)

const { useState } = React;

window.LocationCard = function LocationCard({ activeLocation, setActiveLocation, locations }) {
  const [showSheet, setShowSheet] = useState(false);

  const handleSelectLocation = (loc) => {
    setActiveLocation(loc);
    setShowSheet(false);
  };

  return (
    <section className="px-5 my-6">
      {/* Large Glass Panel */}
      <div className="glass-panel border border-white/15 overflow-hidden relative shadow-2xl transition-all">
        
        {/* Map Grid Area (Low-opacity white grid lines + stylized dots) */}
        <div className="relative h-44 sm:h-52 w-full map-dotted-grid flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-[#2D1B5E]/40 to-[#1E3A6E]/30">
          
          {/* Subtle stylized city blocks / radar lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
            <div className="w-64 h-64 border border-white/20 rounded-full animate-ping" style={{ animationDuration: '6s' }}></div>
            <div className="w-40 h-40 border border-white/30 rounded-full"></div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent absolute"></div>
            <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent absolute"></div>
          </div>

          {/* Center Gold Pulsing Location Pin */}
          <div 
            onClick={() => setShowSheet(!showSheet)}
            className="relative cursor-pointer z-10 flex flex-col items-center group"
          >
            {/* Halo ring */}
            <div className="absolute -inset-4 rounded-full bg-[#FBBF24]/20 animate-ping opacity-75" style={{ animationDuration: '2.5s' }}></div>
            <div className="absolute -inset-2 rounded-full bg-[#FBBF24]/30 blur-sm"></div>
            
            {/* Gold Pin SVG */}
            <div className="pulsing-pin transform transition-transform group-hover:scale-125">
              <svg className="w-11 h-11 drop-shadow-[0_4px_12px_rgba(251,191,36,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#150E30]/90 border border-[#FBBF24]/40 text-[10px] font-bold text-[#FBBF24] tracking-wider uppercase shadow-md">
              Hub: {activeLocation.deliveryTime}
            </span>
          </div>

          {/* Top-right Delivery Tag */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center space-x-1.5 text-xs text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span>Live Radar Active</span>
          </div>
        </div>

        {/* Footer Strip Inside Same Card */}
        <div 
          onClick={() => setShowSheet(!showSheet)}
          className="bg-[#150E30]/90 backdrop-blur-md px-5 py-4 border-t border-white/10 flex items-center justify-between cursor-pointer hover:bg-[#1A152E] transition-colors group"
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#A3E635]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              {/* Lime-green label + white address text */}
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A3E635] block mb-0.5">
                DELIVER TO:
              </span>
              <p className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-[#F97316] transition-colors">
                {activeLocation.name}
              </p>
            </div>
          </div>

          {/* Chevron down icon */}
          <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#C7C3D9] group-hover:text-white transition-transform duration-300 ${showSheet ? 'rotate-180 bg-white/15' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable Location Picker Sheet */}
      {showSheet && (
        <div className="mt-3 glass-panel p-4 border border-white/25 shadow-2xl animate-fade-in-up">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <span className="font-heading font-bold text-white text-base">Select Express Delivery Hub</span>
            <span className="text-xs text-[#A3E635] font-semibold">📍 India Hubs</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            {locations.map((loc) => {
              const isSelected = loc.id === activeLocation.id;
              return (
                <div 
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${isSelected ? 'bg-gradient-to-r from-[#8B5CF6]/30 to-[#EC4899]/20 border-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-white/5 hover:bg-white/10 border-transparent hover:border-white/15'}`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{loc.name}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded bg-[#EC4899] text-white text-[10px] font-bold uppercase">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-[#C7C3D9] mt-0.5 truncate">{loc.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-[#A3E635] block">⚡ {loc.deliveryTime}</span>
                    <span className="text-[10px] text-[#C7C3D9]">Free delivery</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
