// Lensmakers Navbar Component (Top Bar + Search Pill + Notification Tray)

const { useState, useEffect } = React;

window.Navbar = function Navbar({ searchQuery, setSearchQuery, onSearchFocus, onSelectProduct, notifications, setNotifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      setIsSearching(true);
      const allProducts = [
        ...window.LENSMAKERS_DATA.premiumPicks,
        ...window.LENSMAKERS_DATA.eyeglasses,
        ...window.LENSMAKERS_DATA.trendingSunglasses
      ];
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.material.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="w-full px-5 pt-6 pb-4 sticky top-0 z-40 bg-[#150E30]/80 backdrop-blur-xl border-b border-white/5 transition-all">
      {/* Top Bar Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center space-x-2.5 cursor-pointer btn-spring" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          {/* Blue-Green Infinity Mark */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B82F6]/20 to-[#22C55E]/20 border border-[#3B82F6]/40 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.178 8C19.864 8 21.231 9.367 21.231 11.053C21.231 12.739 19.864 14.106 18.178 14.106C16.492 14.106 15.125 12.739 15.125 11.053C15.125 9.367 16.492 8 18.178 8Z" stroke="url(#logo-grad-1)" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M5.822 8C7.508 8 8.875 9.367 8.875 11.053C8.875 12.739 7.508 14.106 5.822 14.106C4.136 14.106 2.769 9.367 2.769 11.053C2.769 9.367 4.136 8 5.822 8Z" stroke="url(#logo-grad-1)" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M15.125 11.053L8.875 11.053" stroke="url(#logo-grad-1)" strokeWidth="2.2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logo-grad-1" x1="2.769" y1="8" x2="21.231" y2="14.106" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6"/>
                  <stop offset="1" stopColor="#22C55E"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Wordmark */}
          <span className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center">
            lensmakers
            <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[#A3E635] inline-block animate-pulse"></span>
          </span>
        </div>

        {/* Notification Bell Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-11 h-11 rounded-full glass-panel flex items-center justify-center btn-spring border border-white/10 hover:border-white/30 text-white shadow-lg"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Small Red Unread Dot */}
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#F43F5E] border-2 border-[#150E30] animate-pulse"></span>
            )}
          </button>

          {/* Notifications Drawer Modal / Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel p-4 shadow-2xl border border-white/20 z-50 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="font-heading font-bold text-white text-base">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EC4899]/30 text-[#EC4899] text-xs font-bold border border-[#EC4899]/40">{unreadCount} new</span>
                  )}
                </div>
                <button 
                  onClick={markAllRead}
                  className="text-xs text-[#A3E635] hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-3 rounded-xl transition-all ${notif.unread ? 'bg-white/10 border border-[#8B5CF6]/30 shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]' : 'bg-white/5 opacity-80'}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-sm text-white mb-0.5">{notif.title}</span>
                      <span className="text-[10px] text-[#C7C3D9]">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#C7C3D9] leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowNotifications(false)}
                className="w-full mt-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors border border-white/10"
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-width Glass Pill Search Bar */}
      <div className="relative">
        <div className="relative flex items-center w-full glass-pill search-focus-glow px-4 py-3 border border-white/15 shadow-inner">
          {/* Orange Search Icon */}
          <svg className="w-5 h-5 text-[#F97316] mr-3 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={onSearchFocus}
            placeholder="Search eyeglasses, sunglasses, brands"
            className="w-full bg-transparent text-white placeholder-[#C7C3D9]/70 text-sm sm:text-base font-normal focus:outline-none"
          />

          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setIsSearching(false); setSearchResults([]); }}
              className="p-1 text-[#C7C3D9] hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-panel p-3 border border-white/20 shadow-2xl z-50 max-h-80 overflow-y-auto no-scrollbar animate-fade-in-up">
            <div className="text-xs font-semibold text-[#F97316] uppercase tracking-wider mb-2 px-2">
              Found {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#C7C3D9]">No eyewear matching "{searchQuery}"</div>
            ) : (
              <div className="space-y-2">
                {searchResults.map(prod => (
                  <div 
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      setIsSearching(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-white/15"
                  >
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-[#1E3A6E]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white truncate">{prod.name}</span>
                        <span className="font-bold text-sm text-white ml-2">{prod.formattedPrice}</span>
                      </div>
                      <span className="text-xs text-[#C7C3D9] block truncate">{prod.material}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
