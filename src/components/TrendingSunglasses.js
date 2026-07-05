// Lensmakers Trending Sunglasses Component (Horizontal Scroll + Glass Cards)

window.TrendingSunglasses = function TrendingSunglasses({ products, onSelectProduct, onAddToCart }) {
  return (
    <section className="px-5 my-8 pb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#22C55E]"></span>
          <div>
            <h2 className="font-heading font-extrabold text-[22px] text-white tracking-tight">
              Trending Sunglasses
            </h2>
            <span className="text-xs text-[#C7C3D9]">Polarized UV400 protection & futuristic builds</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#F97316] hover:underline cursor-pointer">
          Explore All
        </span>
      </div>

      <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-3 pt-1">
        {products.map((prod, idx) => {
          return (
            <div 
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="flex-shrink-0 w-60 sm:w-68 glass-panel bg-[#1E3A6E]/30 p-3.5 border border-white/15 hover:border-white/30 transition-all card-spring cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#150E30] to-[#2D1B5E]/60 mb-3 flex items-center justify-center">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-108" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150E30]/80 via-transparent to-transparent"></div>
                
                {prod.isPremium && (
                  <div className="absolute top-2.5 right-2.5 shimmer-badge px-2 py-0.5 rounded-full text-[9px] font-extrabold">
                    PREMIUM
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white font-bold">
                  UV400 PRO
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-white truncate">
                    {prod.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-[#FBBF24] font-bold ml-1 flex-shrink-0">
                    <span>★</span>
                    <span>{prod.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-[#C7C3D9] mt-0.5 truncate">
                  {prod.material}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <span className="font-heading font-extrabold text-lg text-white">
                    {prod.formattedPrice}
                  </span>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#EC4899] text-white text-xs font-bold transition-all btn-spring border border-white/15"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
