// Lensmakers Eyeglasses Section Component (Men / Women / Kids Category Row)

window.EyeglassesSection = function EyeglassesSection({ categories, onSelectCategory }) {
  return (
    <section className="px-5 my-8">
      {/* "Eyeglasses" section header (bold white, 22px) */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-extrabold text-[22px] text-white tracking-tight flex items-center">
          Eyeglasses
          <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-[#C7C3D9]">AI Engineered</span>
        </h2>
        <button 
          onClick={() => onSelectCategory('all')} 
          className="text-xs font-semibold text-[#F97316] hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Horizontal scroll row of 3 circular-cornered category cards */}
      <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-3 pt-1">
        {categories.map((cat, idx) => {
          return (
            <div 
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 w-44 sm:w-52 h-60 rounded-[28px] relative overflow-hidden card-spring bg-[#1E3A6E]/40 cursor-pointer shadow-xl animate-fade-in-up stagger-${idx+1}`}
              style={{
                border: `2px solid ${cat.glowColor}`,
                boxShadow: `0 0 20px ${cat.glowColor}40, inset 0 0 20px ${cat.glowColor}25`
              }}
            >
              {/* Person Photo */}
              <img 
                src={cat.image} 
                alt={cat.label} 
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 hover:scale-110" 
              />
              
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#150E30] via-[#150E30]/40 to-transparent"></div>

              {/* Distinct colored glow accent halo inside */}
              <div 
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-xl opacity-60"
                style={{ background: cat.glowColor }}
              ></div>

              {/* Card Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col justify-end">
                <span className="text-[11px] font-bold tracking-wider uppercase text-white/80 mb-0.5 block">
                  {cat.subtitle}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-xl text-white drop-shadow-md">
                    {cat.label}
                  </h3>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transform transition-transform group-hover:translate-x-1"
                    style={{ background: cat.glowColor }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <span className="mt-1 text-[11px] font-semibold text-[#C7C3D9] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mr-1.5 inline-block"></span>
                  {cat.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
