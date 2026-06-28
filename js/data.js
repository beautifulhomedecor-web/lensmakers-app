/* ============================================
   SHADOWVEIL CHRONICLES — Game Data
   Maps, Enemies, Spells, Dialogues, Items
   ============================================ */

// Tile Legend:
// 0 = void (impassable black), 1 = stone floor, 2 = wall
// 3 = water, 4 = grass/dirt path, 5 = encounter zone
// 6 = transition tile, 7 = NPC spot, 8 = chest, 9 = boss tile

window.GameData = {

    tileSize: 40,

    colors: {
        void:       '#06060c',
        floor:      '#1e1e2a',
        floorAlt:   '#22222f',
        wall:       '#2a1f1f',
        wallTop:    '#3a2a2a',
        water:      '#0a1a3a',
        waterLight: '#1a2a5a',
        grass:      '#0f1a0a',
        grassAlt:   '#141f0f',
        encounter:  '#1e1e2a',
        transition: '#2a1a3a',
        npcGlow:    '#d4af37',
        chestColor: '#8b6914',
        bossFloor:  '#2a0a0a',
        torch:      '#e8652e',
    },

    // ── ENEMY DEFINITIONS ──
    enemies: {
        shadowRat: {
            name: 'Shadow Rat',
            hp: 18, atk: 6, def: 2, spd: 9, mag: 0,
            xpReward: 12, goldReward: 5,
            color: '#3a2a4a', eyeColor: '#ff3344',
            type: 'beast', size: 0.6,
            abilities: ['bite', 'scratch'],
        },
        cursedKnight: {
            name: 'Cursed Knight',
            hp: 45, atk: 14, def: 10, spd: 5, mag: 3,
            xpReward: 35, goldReward: 20,
            color: '#4a2a2a', eyeColor: '#ff6600',
            type: 'undead', size: 1.0,
            abilities: ['slash', 'shieldBash'],
        },
        darkWraith: {
            name: 'Dark Wraith',
            hp: 32, atk: 16, def: 4, spd: 11, mag: 8,
            xpReward: 30, goldReward: 15,
            color: '#1a1a4a', eyeColor: '#aa66ff',
            type: 'spirit', size: 0.9,
            abilities: ['soulDrain', 'shadowBolt'],
        },
        shadowlord: {
            name: 'THE SHADOWLORD',
            hp: 150, atk: 22, def: 14, spd: 8, mag: 18,
            xpReward: 200, goldReward: 100,
            color: '#2a0505', eyeColor: '#ff0000',
            type: 'boss', size: 1.5,
            abilities: ['darkCleave', 'shadowNova', 'drainLife'],
            isBoss: true,
        },
    },

    // ── SPELL DEFINITIONS ──
    spells: {
        fireball: {
            name: 'Fireball', mpCost: 8, power: 18, type: 'damage',
            color: '#ff4500', particleColor: '#ffaa00',
            description: 'Hurl a ball of flame',
        },
        heal: {
            name: 'Heal', mpCost: 6, power: 25, type: 'heal',
            color: '#00ff88', particleColor: '#88ffbb',
            description: 'Restore health',
        },
        shadowStrike: {
            name: 'Shadow Strike', mpCost: 14, power: 35, type: 'damage',
            color: '#8b00ff', particleColor: '#bb66ff',
            description: 'Strike with dark energy',
        },
    },

    // ── ITEMS ──
    items: {
        potion: { name: 'Health Potion', type: 'consumable', effect: 'heal', value: 30, color: '#cc3333' },
        ether: { name: 'Mana Ether', type: 'consumable', effect: 'restoreMp', value: 20, color: '#3366cc' },
        elixir: { name: 'Elixir', type: 'consumable', effect: 'healAll', value: 50, color: '#cc66ff' },
    },

    // ── LEVEL CURVE ──
    // XP needed to reach each level (index = level)
    levelCurve: [0, 0, 20, 50, 100, 170, 260, 380, 530, 720, 950, 1250, 1600, 2050, 2600, 3300],

    // Base stats at level 1 + per-level growth
    baseStats: {
        hp: 50, mp: 20, str: 8, def: 6, mag: 5, spd: 7,
    },
    statGrowth: {
        hp: 8, mp: 4, str: 2, def: 1, mag: 2, spd: 1,
    },

    // ── ZONE CONFIGS ──
    zoneConfigs: {
        village: { encounterRate: 0, possibleEnemies: [], ambience: 'calm' },
        forest:  { encounterRate: 0.06, possibleEnemies: ['shadowRat'], ambience: 'tense' },
        dungeon: { encounterRate: 0.09, possibleEnemies: ['cursedKnight', 'darkWraith'], ambience: 'dark' },
    },

    // ── DIALOGUES ──
    dialogues: {
        elder: [
            { speaker: 'Elder Morvyn', text: 'You awaken at last, fallen knight...', color: '#d4af37' },
            { speaker: 'Elder Morvyn', text: 'The Shadow Crown has corrupted this land. Darkness seeps from the Cursed Dungeon to the south.', color: '#d4af37' },
            { speaker: 'Elder Morvyn', text: 'Pass through the Dark Forest and find the Shadowlord. Only by defeating him can the curse be lifted.', color: '#d4af37' },
            { speaker: 'Elder Morvyn', text: 'Take this potion. You will need it. May the old light guide you.', color: '#d4af37', giveItem: 'potion' },
        ],
        forestSign: [
            { speaker: '???', text: 'A weathered sign reads: "BEWARE — Dark Forest ahead. Twisted creatures lurk within."', color: '#888888' },
        ],
        dungeonGate: [
            { speaker: '???', text: 'Ancient runes glow on the gate: "Only the worthy may enter the domain of shadows."', color: '#8b00ff' },
        ],
        victory: [
            { speaker: '???', text: 'The Shadow Crown shatters! Light floods the land of Shadowveil once more.', color: '#d4af37' },
            { speaker: '???', text: 'You have broken the curse. The fallen knight rises as a true hero.', color: '#00ff88' },
            { speaker: '???', text: 'CONGRATULATIONS — You have completed Shadowveil Chronicles!', color: '#ffffff' },
        ],
    },

    // ── MAP DATA ──
    maps: {
        // VILLAGE — 20x15, safe starting area
        village: {
            width: 20, height: 15,
            playerStart: { x: 10, y: 10 },
            tiles: [
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,2,2,2,2,1,1,1,1,1,2,2,2,2,1,1,1,2],
                [2,1,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,8,1,2],
                [2,1,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,2],
                [2,1,1,2,2,2,2,1,1,1,1,1,2,2,2,2,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,7,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,3,3,1,1,1,1,1,1,1,1,1,3,3,1,1,1,2],
                [2,1,1,3,3,1,1,1,1,1,1,1,1,1,3,3,1,1,1,2],
                [2,2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2,2,2,2],
                [0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0],
            ],
            transitions: [
                { x: 9, y: 13, toZone: 'forest', toX: 12, toY: 1 },
                { x: 10, y: 13, toZone: 'forest', toX: 13, toY: 1 },
                { x: 9, y: 14, toZone: 'forest', toX: 12, toY: 1 },
                { x: 10, y: 14, toZone: 'forest', toX: 13, toY: 1 },
            ],
            npcs: [
                { x: 8, y: 8, id: 'elder', name: 'Elder Morvyn', dialogue: 'elder' },
            ],
            chests: [
                { x: 17, y: 4, id: 'village_chest', item: 'potion', opened: false },
            ],
            torches: [
                { x: 3, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 6 }, { x: 15, y: 6 },
            ],
        },

        // FOREST — 25x20, encounter zone with winding paths
        forest: {
            width: 25, height: 20,
            playerStart: { x: 12, y: 1 },
            tiles: [
                [2,2,2,2,2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2,2,2,2,2,2],
                [2,4,4,2,2,4,4,4,2,2,4,4,4,4,4,4,2,2,4,4,4,4,4,4,2],
                [2,4,4,2,2,4,4,4,2,2,5,5,4,4,5,5,2,2,4,4,4,2,2,4,2],
                [2,4,4,4,4,4,2,2,2,2,5,5,4,4,5,5,2,2,4,4,4,2,2,4,2],
                [2,2,2,4,4,4,2,2,2,4,5,5,4,4,5,5,4,4,4,2,2,2,4,4,2],
                [2,4,4,4,2,2,2,4,4,4,5,5,5,5,5,5,4,4,4,2,2,2,4,4,2],
                [2,4,4,4,2,2,4,4,5,5,5,2,2,2,2,5,5,4,4,4,2,4,4,4,2],
                [2,4,4,4,4,4,4,5,5,2,2,2,8,2,2,2,5,5,4,4,4,4,4,4,2],
                [2,2,2,2,4,4,4,5,5,2,2,4,4,4,2,2,5,5,4,4,4,2,2,2,2],
                [2,4,4,2,4,4,5,5,4,4,4,4,4,4,4,4,4,5,5,4,4,2,4,4,2],
                [2,4,4,2,4,5,5,4,4,4,2,2,7,2,2,4,4,4,5,5,4,2,4,4,2],
                [2,4,4,4,4,5,4,4,2,2,2,4,4,4,2,2,2,4,4,5,4,4,4,4,2],
                [2,4,4,4,5,5,4,4,2,4,4,4,4,4,4,4,2,4,4,5,5,4,4,4,2],
                [2,2,2,4,5,4,4,4,4,4,4,2,2,2,2,4,4,4,4,4,5,4,2,2,2],
                [2,4,4,4,5,5,4,2,2,4,4,2,4,4,2,4,4,2,2,4,5,5,4,4,2],
                [2,4,4,5,5,4,4,2,4,4,4,4,4,4,4,4,4,4,2,4,4,5,5,4,2],
                [2,4,4,5,4,4,4,4,4,4,2,2,4,4,2,2,4,4,4,4,4,4,5,4,2],
                [2,4,5,5,4,4,2,2,4,4,2,4,4,4,4,2,4,4,2,2,4,4,5,5,2],
                [2,4,5,4,4,4,2,2,4,4,4,4,4,4,4,4,4,4,2,2,4,4,4,5,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2,2,2,2,2,2],
            ],
            transitions: [
                { x: 12, y: 0, toZone: 'village', toX: 9, toY: 12 },
                { x: 13, y: 0, toZone: 'village', toX: 10, toY: 12 },
                { x: 12, y: 19, toZone: 'dungeon', toX: 10, toY: 1 },
                { x: 13, y: 19, toZone: 'dungeon', toX: 11, toY: 1 },
            ],
            npcs: [
                { x: 12, y: 10, id: 'forestSign', name: 'Weathered Sign', dialogue: 'forestSign' },
            ],
            chests: [
                { x: 12, y: 7, id: 'forest_chest', item: 'ether', opened: false },
            ],
            torches: [],
        },

        // DUNGEON — 22x28, linear dungeon with rooms + boss
        dungeon: {
            width: 22, height: 28,
            playerStart: { x: 10, y: 1 },
            tiles: [
                [2,2,2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2,2,2,2,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,2,2,2,2,2,1,1,1,1,1,2,2,2,2,2,1,1,1,2],
                [2,1,1,2,5,5,5,2,1,1,1,1,1,2,5,5,5,2,1,1,1,2],
                [2,1,1,2,5,5,5,2,2,2,1,2,2,2,5,5,5,2,1,1,1,2],
                [2,1,1,2,5,5,5,1,1,1,1,1,1,1,5,5,5,2,1,1,1,2],
                [2,1,1,2,2,2,2,1,1,8,1,1,1,2,2,2,2,2,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,2,2,2,2,2,2,2,2,2,5,2,2,2,2,2,2,2,2,2,2,2],
                [0,0,0,0,0,0,0,0,0,2,5,2,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,2,5,2,0,0,0,0,0,0,0,0,0,0],
                [2,2,2,2,2,2,2,2,2,2,5,2,2,2,2,2,2,2,2,2,2,2],
                [2,5,5,5,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,5,5,2],
                [2,5,1,1,1,1,2,2,2,1,1,1,2,2,2,1,1,1,1,1,5,2],
                [2,5,1,1,8,1,2,1,2,1,1,1,2,1,2,1,1,8,1,1,5,2],
                [2,5,1,1,1,1,2,2,2,1,1,1,2,2,2,1,1,1,1,1,5,2],
                [2,5,5,5,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,5,5,2],
                [2,2,2,2,2,2,2,2,2,2,5,2,2,2,2,2,2,2,2,2,2,2],
                [0,0,0,0,0,0,0,0,0,2,5,2,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,2,5,2,0,0,0,0,0,0,0,0,0,0],
                [2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,2,2,2,2,9,2,2,2,2,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,2,9,9,9,9,9,9,9,2,1,1,1,1,1,1,2],
                [2,1,1,1,1,1,2,9,9,9,9,9,9,9,2,1,1,1,1,1,1,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            ],
            transitions: [
                { x: 10, y: 0, toZone: 'forest', toX: 12, toY: 18 },
                { x: 11, y: 0, toZone: 'forest', toX: 13, toY: 18 },
            ],
            npcs: [
                { x: 10, y: 2, id: 'dungeonGate', name: 'Ancient Runes', dialogue: 'dungeonGate' },
            ],
            chests: [
                { x: 9, y: 7, id: 'dungeon_chest1', item: 'potion', opened: false },
                { x: 4, y: 15, id: 'dungeon_chest2', item: 'elixir', opened: false },
                { x: 17, y: 15, id: 'dungeon_chest3', item: 'ether', opened: false },
            ],
            torches: [
                { x: 3, y: 3 }, { x: 17, y: 3 },
                { x: 1, y: 9 }, { x: 20, y: 9 },
                { x: 1, y: 18 }, { x: 20, y: 18 },
                { x: 6, y: 24 }, { x: 14, y: 24 },
            ],
            boss: { x: 10, y: 25, type: 'shadowlord' },
        },
    },
};
