const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const Sound = {
    playTone: (freq, type, duration, vol=0.1) => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        
        // Pitch drop effect for shoots
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (type === 'square') {
            osc.frequency.exponentialRampToValueAtTime(freq/2, audioCtx.currentTime + duration);
        }
        
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    
    playNoise: (duration, vol=0.1) => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        // Filter for thud
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
    },

    shoot: () => { if(window.AudioEnabled !== false) Sound.playTone(600, 'square', 0.1, 0.02); },
    multiply: () => { if(window.AudioEnabled !== false) Sound.playTone(1200, 'sine', 0.1, 0.03); },
    hit: () => { if(window.AudioEnabled !== false) Sound.playNoise(0.15, 0.05); },
    win: () => {
        if(window.AudioEnabled === false) return;
        Sound.playTone(440, 'sine', 0.4, 0.1);
        setTimeout(() => Sound.playTone(554, 'sine', 0.4, 0.1), 150);
        setTimeout(() => Sound.playTone(659, 'sine', 0.6, 0.1), 300);
    }
};

window.Sound = Sound;
