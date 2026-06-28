/* =======================================
   Crowd Clash 3D — Main Orchestrator (Ultimate)
   ======================================= */

(function () {
    'use strict';

    const STATE = { TITLE: 0, PLAYING: 1, GAME_OVER: 2, SHOP: 3, BASE: 4, PAUSED: 5 };
    
    // UI Elements
    const els = {
        title: document.getElementById('titleScreen'),
        shop: document.getElementById('shopScreen'),
        baseScrn: document.getElementById('baseScreen'),
        hud: document.getElementById('hud'),
        end: document.getElementById('endScreen'),
        endTitle: document.getElementById('endTitle'),
        endStats: document.getElementById('endStats'),
        
        btnPlay: document.getElementById('btnPlay'),
        btnShop: document.getElementById('btnShop'),
        btnBase: document.getElementById('btnBase'),
        btnShopBack: document.getElementById('btnShopBack'),
        btnBaseBack: document.getElementById('btnBaseBack'),
        btnNext: document.getElementById('btnNext'),
        
        btnChamp: document.getElementById('btnChampion'),
        champFill: document.getElementById('champFill'),
        
        shopCoins: document.getElementById('shopCoins'),
        baseCoins: document.getElementById('baseCoins'),
        coinsL: document.getElementById('coinsLabel'),
        levelL: document.getElementById('levelLabel'),
        
        globalMulText: document.getElementById('globalMulText'),
        
        settingsScrn: document.getElementById('settingsScreen'),
        btnSettingsHUD: document.getElementById('btnSettings'),
        btnSettingsTitle: document.getElementById('btnSettingsTitle'),
        btnSettingsClose: document.getElementById('btnSettingsClose'),
        btnSettingsQuit: document.getElementById('btnSettingsQuit'),
        btnToggleSound: document.getElementById('btnToggleSound'),
        btnToggleVib: document.getElementById('btnToggleVib')
    };

    class GameApp {
        constructor() {
            this.state = STATE.TITLE;
            this.level = parseInt(localStorage.getItem('cc3d_level')) || 1;
            this.coins = parseInt(localStorage.getItem('cc3d_coins')) || 0;
            
            // Upgrades
            this.upg = {
                fireRate: parseInt(localStorage.getItem('cc3d_u_fr')) || 1,
                health: parseInt(localStorage.getItem('cc3d_u_hp')) || 1,
                town: parseInt(localStorage.getItem('cc3d_u_town')) || 1 // Base multiplier
            };
            
            this.globalMultiplier = 1.0 + (this.upg.town - 1) * 0.2;
            
            this.champCharge = 0;
            this.champMax = 100; // Damage needed to spawn champion
            
            this.engine = new Engine3D(document.getElementById('gameContainer'));
            this.levelMgr = null;
            
            // Input state
            this.input = { keys: {}, dragging: false, dragDeltaX: 0, lastX: 0 };
            
            this._bindEvents();
            this._updateUI();
            window.AudioEnabled = localStorage.getItem('cc3d_snd') !== 'off';
        window.VibEnabled = localStorage.getItem('cc3d_vib') !== 'off';
        
        this._updateSettingsUI();
        
        els.btnSettingsHUD.onclick = () => this.openSettings();
        els.btnSettingsTitle.onclick = () => this.openSettings();
        els.btnSettingsClose.onclick = () => this.closeSettings();
        els.btnSettingsQuit.onclick = () => {
            this.state = STATE.TITLE;
            this.closeSettings();
            this._updateUI();
        };
        
        els.btnToggleSound.onclick = () => {
            window.AudioEnabled = !window.AudioEnabled;
            localStorage.setItem('cc3d_snd', window.AudioEnabled ? 'on' : 'off');
            this._updateSettingsUI();
        };
        
        els.btnToggleVib.onclick = () => {
            window.VibEnabled = !window.VibEnabled;
            localStorage.setItem('cc3d_vib', window.VibEnabled ? 'on' : 'off');
            this._updateSettingsUI();
        };
        
        this._loop = this._loop.bind(this);
            
            // Setup global callback for dealing damage (to charge champion)
            window.onDealDamage = (dmg) => {
                this.champCharge += dmg;
                if (this.champCharge >= this.champMax) {
                    this.champCharge = this.champMax;
                    els.btnChamp.disabled = false;
                }
                els.champFill.style.height = (this.champCharge / this.champMax * 100) + '%';
            };
            
            requestAnimationFrame(this._loop);
        }
        
        _bindEvents() {
            const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);
            
            on('btnPlay', () => this.startLevel());
            on('btnShop', () => { this.state = STATE.SHOP; this._updateUI(); });
            on('btnShopBack', () => { this.state = STATE.TITLE; this._updateUI(); });
            on('btnBase', () => { this.state = STATE.BASE; this._updateUI(); });
            on('btnBaseBack', () => { this.state = STATE.TITLE; this._updateUI(); });
            on('btnNext', () => {
                this.state = STATE.TITLE;
                if (this.levelMgr.victory) this.level++;
                this.coins += this.levelMgr.earnedCoins;
                this.save();
                this.levelMgr.destroy();
                this.levelMgr = null;
                this._updateUI();
            });
            
            on('btnFR', () => this._buy('fireRate', 'frLv', 'frCst', 'frBar'));
            on('btnHP', () => this._buy('health', 'hpLv', 'hpCst', 'hpBar'));
            on('btnTown', () => this._buyBase('town', 'townLv', 'townCst', 'townBar'));
            
            els.btnChamp.addEventListener('click', () => {
                if (this.champCharge >= this.champMax && this.levelMgr) {
                    this.levelMgr.spawnChampion();
                    this.champCharge = 0;
                    els.btnChamp.disabled = true;
                    els.champFill.style.height = '0%';
                }
            });
            
            // Input
            window.addEventListener('keydown', e => this.input.keys[e.key] = true);
            window.addEventListener('keyup', e => this.input.keys[e.key] = false);
            
            const tz = document.getElementById('touchZone');
            tz.addEventListener('pointerdown', e => { this.input.dragging = true; this.input.lastX = e.clientX; });
            window.addEventListener('pointermove', e => {
                if (!this.input.dragging) return;
                this.input.dragDeltaX = e.clientX - this.input.lastX;
                this.input.lastX = e.clientX;
            });
            window.addEventListener('pointerup', () => { this.input.dragging = false; this.input.dragDeltaX = 0; });
        }
        
        _cost(lv) { return Math.floor(15 * Math.pow(1.3, lv)); }
        _baseCost(lv) { return Math.floor(100 * Math.pow(1.5, lv)); }
        
        _buy(key, lvID, costID, barID) {
            const cur = this.upg[key];
            const cst = this._cost(cur);
            if (this.coins >= cst && cur < 20) {
                this.coins -= cst;
                this.upg[key]++;
                this.save();
                this._updateUI();
            }
        }
        
        _buyBase(key, lvID, costID, barID) {
            const cur = this.upg[key];
            const cst = this._baseCost(cur);
            if (this.coins >= cst) {
                this.coins -= cst;
                this.upg[key]++;
                this.globalMultiplier = 1.0 + (this.upg[key] - 1) * 0.2;
                this.save();
                this._updateUI();
            }
        }
        
        _updateSettingsUI() {
            els.btnToggleSound.textContent = window.AudioEnabled ? "ON" : "OFF";
            els.btnToggleSound.className = "btn-toggle" + (window.AudioEnabled ? "" : " off");
            els.btnToggleVib.textContent = window.VibEnabled ? "ON" : "OFF";
            els.btnToggleVib.className = "btn-toggle" + (window.VibEnabled ? "" : " off");
        }
        
        openSettings() {
            this.prevState = this.state;
            if (this.state === STATE.PLAYING) this.state = STATE.PAUSED;
            els.settingsScrn.classList.remove('hidden');
            els.btnSettingsQuit.classList.toggle('hidden', this.prevState !== STATE.PLAYING);
        }
        
        closeSettings() {
            els.settingsScrn.classList.add('hidden');
            if (this.state === STATE.PAUSED) this.state = STATE.PLAYING;
        }

        save() {
            localStorage.setItem('cc3d_level', this.level);
            localStorage.setItem('cc3d_coins', this.coins);
            localStorage.setItem('cc3d_u_fr', this.upg.fireRate);
            localStorage.setItem('cc3d_u_hp', this.upg.health);
            localStorage.setItem('cc3d_u_town', this.upg.town);
        }
        
        _updateUI() {
            els.title.classList.toggle('hidden', this.state !== STATE.TITLE);
            els.shop.classList.toggle('hidden', this.state !== STATE.SHOP);
            els.baseScrn.classList.toggle('hidden', this.state !== STATE.BASE);
            els.hud.classList.toggle('hidden', this.state !== STATE.PLAYING);
            els.end.classList.toggle('hidden', this.state !== STATE.GAME_OVER);
            
            els.coinsL.textContent = this.coins;
            els.shopCoins.textContent = this.coins;
            els.baseCoins.textContent = this.coins;
            els.levelL.textContent = this.level;
            els.globalMulText.textContent = 'x' + this.globalMultiplier.toFixed(1);
            
            const renderUpg = (key, lvID, costID, barID, costFn, max = 20) => {
                const lv = this.upg[key];
                document.getElementById(lvID).textContent = lv;
                const btn = document.getElementById(lvID).parentElement;
                if (lv >= max) {
                    btn.textContent = "MAX";
                    btn.disabled = true;
                    document.getElementById(barID).style.width = '100%';
                } else {
                    const cst = costFn(lv);
                    document.getElementById(costID).textContent = cst;
                    btn.disabled = this.coins < cst;
                    document.getElementById(barID).style.width = ((lv / max) * 100) + '%';
                }
            };
            
            if (this.state === STATE.SHOP) {
                renderUpg('fireRate', 'frLv', 'frCst', 'frBar', this._cost.bind(this));
                renderUpg('health', 'hpLv', 'hpCst', 'hpBar', this._cost.bind(this));
            }
            if (this.state === STATE.BASE) {
                renderUpg('town', 'townLv', 'townCst', 'townBar', this._baseCost.bind(this), 50); // High max for base
            }
        }
        
        startLevel() {
            this.state = STATE.PLAYING;
            
            // Cleanup any lingering float texts
            document.querySelectorAll('.float-text').forEach(e => e.remove());
            
            this.levelMgr = new LevelManager(this.engine.scene, this.engine, this.level, this.upg, this.globalMultiplier);
            this.engine.buildTrack(this.level);
            this.champCharge = 0;
            this.champMax = 100 + (this.level * 20); // Gets harder to charge
            els.btnChamp.disabled = true;
            els.champFill.style.height = '0%';
            
            this._updateUI();
        }
        
        _loop() {
            if (this.state === STATE.PAUSED) {
                this.engine.render();
                requestAnimationFrame(this._loop);
                return;
            }
            
            if (this.state === STATE.PLAYING && this.levelMgr) {
                this.levelMgr.update(0.016, this.input); // Fixed dt for physics stability
                this.engine.update(this.levelMgr.cannon.z);
                
                // Smooth coin counter animation
                const targetCoins = this.coins + Math.floor(this.levelMgr.earnedCoins);
                if (this.displayedCoins === undefined) this.displayedCoins = this.coins;
                if (this.displayedCoins < targetCoins) {
                    this.displayedCoins += (targetCoins - this.displayedCoins) * 0.2;
                    if (targetCoins - this.displayedCoins < 0.5) this.displayedCoins = targetCoins;
                    els.coinsL.textContent = Math.floor(this.displayedCoins);
                }
                
                if (this.levelMgr.victory || this.levelMgr.gameOver) {
                    this.state = STATE.GAME_OVER;
                    if (window.Sound && this.levelMgr.victory) Sound.win();
                    els.endTitle.textContent = this.levelMgr.victory ? "VICTORY!" : "DEFEAT!";
                    els.endTitle.style.color = this.levelMgr.victory ? "#60a5fa" : "#ef4444";
                    els.endStats.textContent = `Earned: ${this.levelMgr.earnedCoins} Coins`;
                    this._updateUI();
                }
                
                // Reset drag delta so it doesn't spin infinitely
                this.input.dragDeltaX = 0;
            }
            
            this.engine.render();
            requestAnimationFrame(this._loop);
        }
    }

    // Capture global errors so the user can see them
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        const log = document.getElementById('errorLog');
        if (log) {
            log.classList.remove('hidden');
            log.innerHTML += `ERROR: ${msg} <br>Line: ${lineNo}<br><hr>`;
        }
        return false;
    };

    window.onload = () => {
        if (typeof THREE === 'undefined') {
            document.getElementById('errorLog').classList.remove('hidden');
            document.getElementById('errorLog').innerHTML = "CRITICAL ERROR: Three.js failed to load. Check internet connection or CORS.";
            return;
        }
        new GameApp();
    };

})();
