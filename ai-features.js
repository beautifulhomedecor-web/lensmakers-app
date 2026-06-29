/**
 * LENSMAKERS — AI Features Architecture
 * 
 * Note: To use these features, you must include the following libraries in your index.html:
 * <!-- Tesseract.js for OCR -->
 * <script src="https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js"></script>
 * <!-- ColorThief for color extraction -->
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"></script>
 */

// ==========================================
// 1. AI PRESCRIPTION SCANNER (OCR)
// ==========================================

const PrescriptionScanner = {
  /**
   * Reads an uploaded prescription image and extracts optical values.
   * @param {File|HTMLImageElement} imageSource - The uploaded Rx image
   * @returns {Promise<Object>} Extracted prescription data
   */
  async scan(imageSource) {
    if (typeof Tesseract === 'undefined') {
      console.error("[Lensmakers AI] Tesseract.js is required for OCR.");
      return null;
    }

    console.log("[Lensmakers AI] Starting prescription scan...");
    
    try {
      // 1. Run Optical Character Recognition (OCR)
      const { data: { text } } = await Tesseract.recognize(imageSource, 'eng', {
        logger: m => console.log(`[OCR Progress] ${m.status}: ${Math.round(m.progress * 100)}%`)
      });

      console.log("[Lensmakers AI] Raw OCR Text:", text);

      // 2. Parse the extracted text using Regex heuristics
      return this.parsePrescriptionData(text);

    } catch (error) {
      console.error("[Lensmakers AI] Failed to scan prescription.", error);
      throw error;
    }
  },

  /**
   * Parses raw OCR text to find SPH, CYL, AXIS, and PD values.
   */
  parsePrescriptionData(rawText) {
    // Basic regex patterns for optical values (e.g., +1.50, -0.75, 180, PD 62)
    const powerRegex = /[+-]\d{1,2}\.\d{2}/g;
    const axisRegex = /\b(?:axis|x)\s*(\d{1,3})\b/i;
    const pdRegex = /\b(?:pd)\s*(\d{2,3}(?:\.\d)?)\b/i;

    const powers = rawText.match(powerRegex) || [];
    
    // Naive heuristic: Assume first two powers are OD/OS Sphere, next two are Cylinder
    const parsedData = {
      rightEye_OD: {
        SPH: powers[0] || null,
        CYL: powers[2] || null,
        AXIS: (rawText.match(axisRegex) || [])[1] || null
      },
      leftEye_OS: {
        SPH: powers[1] || null,
        CYL: powers[3] || null,
        AXIS: (rawText.match(axisRegex) || [])[1] || null // Simplified
      },
      PD: (rawText.match(pdRegex) || [])[1] || "62" // Default fallback
    };

    console.log("[Lensmakers AI] Extracted Prescription:", parsedData);
    return parsedData;
  }
};


// ==========================================
// 2. AI OUTFIT MATCHER
// ==========================================

const OutfitMatcher = {
  /**
   * Analyzes an outfit image and recommends matching frames based on color theory.
   * @param {HTMLImageElement} outfitImageElement - The user's outfit snapshot
   * @param {Array} frameCollection - Array of available frames with metadata
   * @returns {Array} Recommended frames sorted by match score
   */
  async matchFrames(outfitImageElement, frameCollection) {
    if (typeof ColorThief === 'undefined') {
      console.error("[Lensmakers AI] ColorThief.js is required for outfit matching.");
      return null;
    }

    console.log("[Lensmakers AI] Analyzing outfit colors...");

    // 1. Extract Dominant Color & Palette
    const colorThief = new ColorThief();
    const dominantRGB = colorThief.getColor(outfitImageElement);
    const paletteRGB = colorThief.getPalette(outfitImageElement, 3); // Top 3 colors

    // 2. Determine Outfit Archetype (Warm, Cool, Neutral, High-Contrast)
    const archetype = this.getOutfitArchetype(dominantRGB);
    console.log(`[Lensmakers AI] Outfit Archetype identified as: ${archetype.toUpperCase()}`);

    // 3. Recommend Frames using Color Theory Rules
    return this.rankFramesByMatch(archetype, frameCollection);
  },

  /**
   * Categorizes an RGB color into a general style archetype.
   */
  getOutfitArchetype([r, g, b]) {
    // Simple luminance/temperature heuristic
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    if (luminance > 0.8) return 'minimalist_light';
    if (luminance < 0.2) return 'edgy_dark';
    
    // Warm vs Cool bias
    if (r > b && r > g) return 'warm_tones';
    if (b > r && b > g) return 'cool_tones';
    
    return 'neutral';
  },

  /**
   * Ranks frames against the user's outfit archetype.
   */
  rankFramesByMatch(archetype, collection) {
    // Color theory mapping
    const rules = {
      'warm_tones': ['gold', 'tortoise', 'brown', 'clear'],
      'cool_tones': ['silver', 'black', 'blue', 'gunmetal'],
      'minimalist_light': ['clear', 'silver', 'rose-gold', 'pastel'],
      'edgy_dark': ['matte-black', 'thick-acetate', 'neon', 'gunmetal'],
      'neutral': ['tortoise', 'black', 'gold', 'silver']
    };

    const preferredColors = rules[archetype] || rules['neutral'];

    return collection
      .map(frame => {
        let score = 0;
        // Boost score if frame matches outfit's ideal color theory
        if (preferredColors.includes(frame.colorCategory)) score += 10;
        // Boost versatile frames
        if (frame.colorCategory === 'tortoise' || frame.colorCategory === 'black') score += 5;
        
        return { ...frame, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore); // Highest score first
  }
};

// Expose to window
window.LensmakersAI = {
  PrescriptionScanner,
  OutfitMatcher
};
