// Lensmakers Curated Eyewear Catalog & AI State Data

window.LENSMAKERS_DATA = {
  locations: [
    { id: 'delhi', name: 'Connaught Place, New Delhi', address: 'Block C, Rajiv Chowk, Connaught Place, New Delhi 110001', deliveryTime: '25 mins' },
    { id: 'mumbai', name: 'Bandra West, Mumbai', address: 'Linking Rd, Khar West, Bandra West, Mumbai 400050', deliveryTime: '18 mins' },
    { id: 'hyd', name: 'Jubilee Hills, Hyderabad', address: 'Road No. 36, Jawahar Colony, Jubilee Hills, Hyderabad 500033', deliveryTime: '20 mins' },
    { id: 'blr', name: 'Indiranagar, Bangalore', address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038', deliveryTime: '15 mins' },
    { id: 'chennai', name: 'Anna Nagar, Chennai', address: '2nd Avenue, Anna Nagar East, Chennai 600102', deliveryTime: '30 mins' }
  ],

  notifications: [
    { id: 1, title: 'AI AR Scan Complete! ✨', message: 'Your pupillary distance (PD) of 63mm is saved to your AI profile.', time: '2m ago', unread: true },
    { id: 2, title: 'Summer Sale Unlocked 🌞', message: 'Use code LENS20 for 20% off plus free 1-Year replacement warranty!', time: '1h ago', unread: true },
    { id: 3, title: 'Express Delivery Ready 🚀', message: 'Connaught Place hub can deliver in under 25 minutes today.', time: '3h ago', unread: false }
  ],

  categories: [
    { id: 'man', label: 'Men', subtitle: 'Bold & Engineered', glowColor: '#EF4444', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', count: '140+ Styles' },
    { id: 'woman', label: 'Women', subtitle: 'Chic & Minimalist', glowColor: '#10B981', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', count: '180+ Styles' },
    { id: 'child', label: 'Kids', subtitle: 'Ultra-Flex Durable', glowColor: '#3B82F6', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', count: '65+ Styles' }
  ],

  premiumPicks: [
    {
      id: 'prem-1',
      name: 'Round Titanium Lite',
      material: 'Titanium · Ultra-light 12g',
      price: 5299,
      formattedPrice: '₹5,299',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'man',
      rating: 4.9,
      reviews: 142,
      isPremium: true,
      tryOnScale: 1.15,
      tryOnOffset: { y: -5 },
      description: 'Aerospace-grade Japanese beta-titanium wire construction with screwless hinge engineering.'
    },
    {
      id: 'prem-2',
      name: 'Aeron Carbon Fiber',
      material: 'Carbon · Featherweight 10g',
      price: 8499,
      formattedPrice: '₹8,499',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'man',
      rating: 5.0,
      reviews: 89,
      isPremium: true,
      tryOnScale: 1.2,
      tryOnOffset: { y: -2 },
      description: 'Hand-layered matte carbon fiber temples with hypoallergenic memory bridge.'
    },
    {
      id: 'prem-3',
      name: 'Minimalist Rimless Gold',
      material: '18K Gold Plated · 14g',
      price: 12999,
      formattedPrice: '₹12,999',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'woman',
      rating: 4.8,
      reviews: 210,
      isPremium: true,
      tryOnScale: 1.1,
      tryOnOffset: { y: -4 },
      description: 'Diamond-cut anti-reflective crystal lenses paired with electroplated 18K gold wire framing.'
    },
    {
      id: 'prem-4',
      name: 'Vortex Hexagonal TR90',
      material: 'TR90 Memory · 15g',
      price: 4899,
      formattedPrice: '₹4,899',
      image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'woman',
      rating: 4.7,
      reviews: 165,
      isPremium: true,
      tryOnScale: 1.18,
      tryOnOffset: { y: -3 },
      description: 'Geometrical architectural framing with flexible TR90 Swiss memory polymer.'
    }
  ],

  eyeglasses: [
    {
      id: 'eye-1',
      name: 'Classic Wayfarer Optical',
      material: 'Italian Acetate · 22g',
      price: 3499,
      formattedPrice: '₹3,499',
      image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'man',
      rating: 4.6,
      reviews: 320,
      isPremium: false,
      tryOnScale: 1.25,
      tryOnOffset: { y: -6 }
    },
    {
      id: 'eye-2',
      name: 'Luna Rose Gold Wire',
      material: 'Stainless Steel · 16g',
      price: 3999,
      formattedPrice: '₹3,999',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'woman',
      rating: 4.8,
      reviews: 198,
      isPremium: false,
      tryOnScale: 1.12,
      tryOnOffset: { y: -3 }
    },
    {
      id: 'eye-3',
      name: 'FlexKid Ultra Durable',
      material: 'Silicon Memory Flex · 12g',
      price: 2499,
      formattedPrice: '₹2,499',
      image: 'https://images.unsplash.com/photo-1584448141569-69f342da535c?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'child',
      rating: 4.9,
      reviews: 412,
      isPremium: false,
      tryOnScale: 1.05,
      tryOnOffset: { y: -1 }
    },
    {
      id: 'eye-4',
      name: 'Architectural Transparent',
      material: 'Crystal Bio-Acetate · 20g',
      price: 4299,
      formattedPrice: '₹4,299',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80',
      category: 'eyeglasses',
      gender: 'man',
      rating: 4.7,
      reviews: 154,
      isPremium: false,
      tryOnScale: 1.2,
      tryOnOffset: { y: -4 }
    }
  ],

  trendingSunglasses: [
    {
      id: 'sun-1',
      name: 'Obsidian Wayfarer Bold',
      material: 'Polarized UV400 · 24g',
      price: 4199,
      formattedPrice: '₹4,199',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      category: 'sunglasses',
      gender: 'man',
      rating: 4.9,
      reviews: 512,
      isPremium: false,
      tryOnScale: 1.28,
      tryOnOffset: { y: -5 }
    },
    {
      id: 'sun-2',
      name: 'Tortoise Vintage Flare',
      material: 'Hand-polished Acetate · 26g',
      price: 5499,
      formattedPrice: '₹5,499',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80',
      category: 'sunglasses',
      gender: 'woman',
      rating: 4.8,
      reviews: 340,
      isPremium: true,
      tryOnScale: 1.22,
      tryOnOffset: { y: -4 }
    },
    {
      id: 'sun-3',
      name: 'CyberShield Futuristic Pro',
      material: 'Titanium Shield · 19g',
      price: 6899,
      formattedPrice: '₹6,899',
      image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=600&q=80',
      category: 'sunglasses',
      gender: 'man',
      rating: 5.0,
      reviews: 219,
      isPremium: true,
      tryOnScale: 1.3,
      tryOnOffset: { y: -7 }
    },
    {
      id: 'sun-4',
      name: 'Aero Pilot Polarized Gold',
      material: 'Monel Metal Alloy · 18g',
      price: 4599,
      formattedPrice: '₹4,599',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80',
      category: 'sunglasses',
      gender: 'man',
      rating: 4.7,
      reviews: 423,
      isPremium: false,
      tryOnScale: 1.24,
      tryOnOffset: { y: -5 }
    }
  ],

  aiProfiles: {
    pd: '63.0 mm',
    faceShape: 'Oval / Diamond balanced',
    recommendation: 'Angular, Round, or Wayfarer frames accentuate your natural cheekbones with 98% aesthetic harmony.',
    prescription: {
      rightOD: { sph: '-1.75', cyl: '-0.50', axis: '180' },
      leftOS: { sph: '-1.50', cyl: '-0.25', axis: '175' }
    }
  }
};
