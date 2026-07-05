// Lensmakers Premium Picks Component (Glass Panel + Shimmering Orange Badges)

window.PremiumPicks = function PremiumPicks({ products, onSelectProduct, onAddToCart }) {
  return (
    <section className="px-5 my-8">
      {/* Outer Premium Picks Glass Panel */}
      <div className="glass-panel p-5 border border-white/15 shadow-2xl relative bg-gradient-to-br from-[#8B5CF6]/15 via-[#2D1B5E]/30 to-[#1E3A6E]/20">
        
        {/* Background glow highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#F97316] to-[#FBBF24]"></span>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white tracking-tight">
                Premium Picks
              </h2>
              <span className="text-xs text-[#C7C3D9]">Flagship Japanese & Swiss engineering</span>
            </div>
          </div>
          <span className="shimmer-badge px-3 py-1 rounded-full text-[10px] font-extrabold shadow-md">
            ★ VIP SERIES
          </span>
        </div>

        {/* Horizontally scrollable row of premium products */}
        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 pt-1">
          {products.map((prod, idx) => {
            return (
              <div 
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="flex-shrink-0 w-64 sm:w-72 glass-panel bg-[#150E30]/80 p-3.5 border border-white/15 hover:border-[#F97316]/50 transition-all card-spring cursor-pointer flex flex-col justify-between group shadow-lg"
              >
                {/* Image Container with Badge */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#2D1B5E]/40 to-[#150E30] mb-3 flex items-center justify-center">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-108" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#150E30]/80 via-transparent to-transparent"></div>

                  {/* Shimmering Orange PREMIUM Badge */}
                  <div className="absolute top-2.5 right-2.5 shimmer-badge px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-lg backdrop-blur-md">
                    PREMIUM
                  </div>

                  {/* Quick Try-On Trigger Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-[#150E30]/90 border border-white/20 text-[10px] font-bold text-[#EC4899] shadow-md">
                    <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>3D Try-On</span>
                  </div>
                </div>

                {/* Product Meta */}
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading font-bold text-base text-white truncate group-hover:text-[#F97316] transition-colors">
                      {prod.name}
                    </h3>
                    <div className="flex items-center space-x-1 bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-[#FBBF24] font-bold ml-2 flex-shrink-0">
                      <span>★</span>
                      <span>{prod.rating}</span>
                    </div>
                  </div>

                  {/* Material / Weight Subtitle */}
                  <p className="text-xs text-[#C7C3D9] mt-1 truncate">
                    {prod.material}
                  </p>

                  {/* Price & Add Action */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-[#C7C3D9] block uppercase font-semibold">Flagship Price</span>
                      <span className="font-heading font-extrabold text-lg text-white">
                        {prod.formattedPrice}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#EC4899] text-white text-xs font-bold transition-all btn-spring flex items-center space-x-1 border border-white/15"
                    >
                      <span>+ Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
