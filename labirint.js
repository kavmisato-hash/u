(function () {
  'use strict';

  let stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const css = `
      .maze-task {
        --mz-bg: #0a1012;
        --mz-corridor: #141e21;
        --mz-wall: #0a0e10;
        --mz-wall-edge: rgba(60,80,84,0.45);
        --mz-wall-hi: rgba(80,110,115,0.25);
        --mz-trail: #c2a878;
        --mz-trail-glow: rgba(194,168,120,0.35);
        --mz-trail-core: #f0d9a8;
        --mz-start: #c2a878;
        --mz-start-glow: rgba(194,168,120,0.5);
        --mz-finish: #6b9383;
        --mz-finish-glow: rgba(107,147,131,0.5);
      }
      .maze-task .variants {
        display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;
        font-family: 'PT Mono', monospace; font-size: 11px;
      }
      .maze-task .variant {
        flex: 1 1 60px; padding: 8px;
        background: transparent;
        border: 1px solid #223336;
        color: #798c89;
        cursor: pointer; transition: .2s;
        font-family: inherit; letter-spacing: .1em;
      }
      .maze-task .variant:hover { border-color: rgba(194,168,120,.4); color: #c2a878; }
      .maze-task .variant.active {
        border-color: #c2a878; color: #c2a878;
        background: rgba(194,168,120,.08);
      }
      .maze-task .conditions {
        display: flex; flex-wrap: wrap; gap: 8px;
        margin-bottom: 10px;
        font-family: 'PT Mono', monospace;
        font-size: 10px; letter-spacing: .04em;
        text-transform: uppercase;
      }
      .maze-task .conditions span {
        padding: 4px 9px;
        border: 1px solid rgba(194,168,120,.25);
        color: #c2a878;
        background: rgba(194,168,120,.08);
      }
      .maze-task .conditions span.no {
        color: #c07a6c;
        border-color: rgba(192,122,108,.4);
        background: rgba(192,122,108,.08);
      }
      .maze-task .conditions span.done {
        color: #8ac47a;
        border-color: rgba(138,196,122,.5);
        background: rgba(138,196,122,.12);
      }
      .maze-task .legend {
        display: flex; flex-wrap: wrap; gap: 10px;
        margin-bottom: 10px;
        font-family: 'PT Mono', monospace;
        font-size: 10px; letter-spacing: .04em;
        color: #798c89;
      }
      .maze-task .legend .item { display: flex; align-items: center; gap: 5px; }
      .maze-task .legend .swatch {
        width: 10px; height: 10px;
        border-radius: 2px;
        display: inline-block;
      }
      .maze-task .mz-row {
        display: flex; align-items: center; justify-content: space-between;
        gap: 10px; margin-bottom: 8px;
        font-family: 'PT Mono', monospace; font-size: 11px;
        color: #798c89; letter-spacing: .05em; text-transform: uppercase;
      }
      .maze-task .mz-row .val { color: #c2a878; }
      .maze-task .stage {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background: #0d1517;
        border: 1px solid #223336;
        padding: 6px;
        display: flex; align-items: center; justify-content: center;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .maze-task canvas {
        display: block;
        touch-action: none;
        cursor: crosshair;
        border: 1px solid #1a2528;
      }
      .maze-task .mz-status {
        margin-top: 12px;
        min-height: 44px;
        padding: 10px 12px;
        font-size: 13px;
        line-height: 1.55;
        border-left: 2px solid #223336;
        background: #0d1517;
        color: #798c89;
        transition: .3s;
      }
      .maze-task .mz-status.good { color: #c2a878; border-color: #c2a878; background: rgba(194,168,120,.06); }
      .maze-task .mz-status.bad  { color: #c07a6c; border-color: #c07a6c; background: rgba(192,122,108,.06); }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- Константы лабиринта ----
  const CELLS_W = 9;
  const CELLS_H = 9;
  const GW = CELLS_W * 2 + 1;
  const GH = CELLS_H * 2 + 1;

  const COL = {
    bg:         '#0a1012',
    corridor:   '#141e21',
    wall:       '#0a0e10',
    wallEdge:   'rgba(60,80,84,0.45)',
    wallHi:     'rgba(80,110,115,0.25)',
    trail:      '#c2a878',
    trailGlow:  'rgba(194,168,120,0.35)',
    trailCore:  '#f0d9a8',
    start:      '#c2a878',
    startGlow:  'rgba(194,168,120,0.5)',
    finish:     '#6b9383',
    finishGlow: 'rgba(107,147,131,0.5)'
  };

  const ZONE_TYPES = {
    forest: { base: 'rgba(38,72,32,0.6)',    edge: '#7ac454', accent: '#a6e07a', label: 'лес',    good: true },
    bridge: { base: 'rgba(90,58,28,0.6)',    edge: '#d4924a', accent: '#f0b878', label: 'мост',   good: true },
    water:  { base: 'rgba(24,54,96,0.65)',   edge: '#5aa0e0', accent: '#8ac0f0', label: 'вода',   bad: true },
    swamp:  { base: 'rgba(72,72,28,0.6)',    edge: '#b8b850', accent: '#d4d478', label: 'болото', bad: true },
    rocks:  { base: 'rgba(48,48,60,0.6)',    edge: '#8888a8', accent: '#a8a8c8', label: 'скалы',  bad: true },
    thorns: { base: 'rgba(58,20,26,0.6)',    edge: '#e0454a', accent: '#ff7a80', label: 'шипы',   bad: true },
    lava:   { base: 'rgba(120,30,20,0.65)',  edge: '#e05a30', accent: '#ff9a5a', label: 'лава',   bad: true },
    cave:   { base: 'rgba(50,40,60,0.6)',    edge: '#9a7ac0', accent: '#c0a8e8', label: 'пещера', good: true }
  };

  const POS = {
    tl: { x: 2,  y: 2,  w: 4, h: 4 },
    tc: { x: 7,  y: 2,  w: 5, h: 4 },
    tr: { x: 13, y: 2,  w: 4, h: 4 },
    ml: { x: 2,  y: 7,  w: 4, h: 5 },
    cc: { x: 7,  y: 7,  w: 5, h: 5 },
    mr: { x: 13, y: 7,  w: 4, h: 5 },
    bl: { x: 2,  y: 13, w: 4, h: 4 },
    bc: { x: 7,  y: 13, w: 5, h: 4 },
    br: { x: 13, y: 13, w: 4, h: 4 }
  };

  const VARIANTS = [
    {
      conditions: [
        { text: '✓ через лес',  good: true,  key: 'forest' },
        { text: '✗ без воды',   good: false },
        { text: '✓ через мост', good: true,  key: 'bridge' }
      ],
      required: ['forest', 'bridge'],
      zones: [
        { ...POS.tc, type: 'forest' },
        { ...POS.bc, type: 'bridge' },
        { ...POS.cc, type: 'water' },
        { ...POS.mr, type: 'water' }
      ]
    },
    {
      conditions: [
        { text: '✓ через лес',  good: true,  key: 'forest' },
        { text: '✗ без болота', good: false },
        { text: '✗ без скал',   good: false },
        { text: '✗ без лавы',   good: false },
        { text: '✓ через мост', good: true,  key: 'bridge' }
      ],
      required: ['forest', 'bridge'],
      zones: [
        { ...POS.ml, type: 'forest' },
        { ...POS.mr, type: 'bridge' },
        { ...POS.cc, type: 'rocks' },
        { ...POS.tc, type: 'swamp' },
        { ...POS.tl, type: 'lava' }
      ]
    },
    {
      conditions: [
        { text: '✓ через пещеру', good: true,  key: 'cave' },
        { text: '✗ без воды',     good: false },
        { text: '✗ без скал',     good: false },
        { text: '✗ без шипов',    good: false },
        { text: '✓ через мост',   good: true,  key: 'bridge' }
      ],
      required: ['cave', 'bridge'],
      zones: [
        { ...POS.bl, type: 'cave' },
        { ...POS.tr, type: 'bridge' },
        { ...POS.tc, type: 'water' },
        { ...POS.bc, type: 'rocks' },
        { ...POS.mr, type: 'thorns' }
      ]
    },
    {
      conditions: [
        { text: '✗ без воды',   good: false },
        { text: '✗ без болота', good: false },
        { text: '✗ без скал',   good: false },
        { text: '✗ без лавы',   good: false },
        { text: '✓ через мост', good: true, key: 'bridge' }
      ],
      required: ['bridge'],
      zones: [
        { ...POS.cc, type: 'bridge' },
        { ...POS.tl, type: 'water' },
        { ...POS.bl, type: 'water' },
        { ...POS.br, type: 'swamp' },
        { ...POS.tr, type: 'rocks' },
        { ...POS.bc, type: 'lava' }
      ]
    },
    {
      conditions: [
        { text: '✓ через лес',    good: true,  key: 'forest' },
        { text: '✓ через пещеру', good: true,  key: 'cave' },
        { text: '✗ без воды',     good: false },
        { text: '✗ без болота',   good: false },
        { text: '✗ без скал',     good: false },
        { text: '✗ без шипов',    good: false },
        { text: '✗ без лавы',     good: false },
        { text: '✓ через мост',   good: true,  key: 'bridge' }
      ],
      required: ['forest', 'cave', 'bridge'],
      zones: [
        { ...POS.tl, type: 'forest' },
        { ...POS.tr, type: 'cave' },
        { ...POS.bc, type: 'bridge' },
        { ...POS.ml, type: 'water' },
        { ...POS.cc, type: 'swamp' },
        { ...POS.mr, type: 'rocks' },
        { ...POS.bl, type: 'thorns' },
        { ...POS.br, type: 'lava' }
      ]
    }
  ];

  function open(container, seedBase, onSuccess) {
    injectStyles();

    // --- HTML ---
    container.innerHTML = `
      <div class="maze-task">
        <div class="variants" id="mzVariants"></div>
        <div class="legend" id="mzLegend"></div>
        <div class="conditions" id="mzConditions"></div>
        <div class="mz-row">
          <span>Пройдено: <span class="val" id="mzProgress">0%</span></span>
        </div>
        <div class="stage" id="mzStage">
          <canvas id="mzCanvas"></canvas>
        </div>
        <div class="mz-status" id="mzStatus">Коснись золотой точки и веди палец.</div>
      </div>
    `;

    const variantsWrap = container.querySelector('#mzVariants');
    const legendEl     = container.querySelector('#mzLegend');
    const condEl       = container.querySelector('#mzConditions');
    const progEl       = container.querySelector('#mzProgress');
    const stageEl      = container.querySelector('#mzStage');
    const canvas       = container.querySelector('#mzCanvas');
    const ctx          = canvas.getContext('2d');
    const statusEl     = container.querySelector('#mzStatus');

    // Кнопки вариантов
    const variantBtns = VARIANTS.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'variant';
      b.textContent = ['I','II','III','IV','V'][i];
      b.dataset.v = String(i);
      variantsWrap.appendChild(b);
      return b;
    });

    // --- Состояние ---
    let CELL = 0;
    let grid, solution;
    let startCell = [1, 1];
    let endCell;
    let visited, trail;
    let pointerDown = false;
    let won = false;
    let gameOver = false;
    let currentVariant = 0;
    let V;
    let collected = new Set();

    function makeRng(seed) {
      let s = seed >>> 0;
      return function () {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };
    }

    function generateMaze(seed) {
      const rng = makeRng(seed * 7919 + 17);
      grid = Array.from({ length: GH }, () => Array(GW).fill(1));
      grid[1][1] = 0;
      const stack = [[0, 0]];
      const dirs = [[0,-1],[1,0],[0,1],[-1,0]];

      while (stack.length) {
        const [cx, cy] = stack[stack.length - 1];
        for (let i = dirs.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          const t = dirs[i]; dirs[i] = dirs[j]; dirs[j] = t;
        }
        let moved = false;
        for (const [dx, dy] of dirs) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || nx >= CELLS_W || ny < 0 || ny >= CELLS_H) continue;
          const gx = 2 * nx + 1, gy = 2 * ny + 1;
          if (grid[gy][gx] === 0) continue;
          grid[gy][gx] = 0;
          grid[2 * cy + 1 + dy][2 * cx + 1 + dx] = 0;
          stack.push([nx, ny]);
          moved = true;
          break;
        }
        if (!moved) stack.pop();
      }

      const LOOP_CHANCE = 0.16;
      for (let cy = 0; cy < CELLS_H; cy++) {
        for (let cx = 0; cx < CELLS_W; cx++) {
          if (cx + 1 < CELLS_W) {
            const wx = 2 * cx + 2, wy = 2 * cy + 1;
            if (grid[wy][wx] === 1 && rng() < LOOP_CHANCE) grid[wy][wx] = 0;
          }
          if (cy + 1 < CELLS_H) {
            const wx = 2 * cx + 1, wy = 2 * cy + 2;
            if (grid[wy][wx] === 1 && rng() < LOOP_CHANCE) grid[wy][wx] = 0;
          }
        }
      }
    }

    function solve() {
      const prev = Array.from({ length: GH }, () => Array(GW).fill(null));
      const q = [[1, 1]];
      prev[1][1] = [1, 1];
      const end = [GW - 2, GH - 2];
      while (q.length) {
        const [x, y] = q.shift();
        if (x === end[0] && y === end[1]) break;
        for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= GW || ny < 0 || ny >= GH) continue;
          if (grid[ny][nx] !== 0) continue;
          if (prev[ny][nx]) continue;
          prev[ny][nx] = [x, y];
          q.push([nx, ny]);
        }
      }
      const path = [];
      let cur = end;
      while (true) {
        path.push(cur.slice());
        const p = prev[cur[1]][cur[0]];
        if (p[0] === cur[0] && p[1] === cur[1]) break;
        cur = p;
      }
      path.reverse();
      return path;
    }

    function zoneAt(x, y) {
      for (const z of V.zones) {
        if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) return z;
      }
      return null;
    }

    function isSolvable() {
      const reqIndex = {};
      V.required.forEach((t, i) => { reqIndex[t] = i; });
      const fullMask = (1 << V.required.length) - 1;
      const vis = new Set([startCell[0] + ',' + startCell[1]]);
      let steps = 0;
      const STEP_BUDGET = 4000;
      function dfs(x, y, mask) {
        steps++;
        if (steps > STEP_BUDGET) return false;
        if (x === endCell[0] && y === endCell[1]) return mask === fullMask;
        for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= GW || ny < 0 || ny >= GH) continue;
          if (grid[ny][nx] !== 0) continue;
          const k = nx + ',' + ny;
          if (vis.has(k)) continue;
          const z = zoneAt(nx, ny);
          const zt = z ? z.type : null;
          if (zt && ZONE_TYPES[zt].bad) continue;
          let nmask = mask;
          if (zt && reqIndex.hasOwnProperty(zt)) nmask |= (1 << reqIndex[zt]);
          vis.add(k);
          if (dfs(nx, ny, nmask)) return true;
          vis.delete(k);
          if (steps > STEP_BUDGET) return false;
        }
        return false;
      }
      return dfs(startCell[0], startCell[1], 0);
    }

    function maskDistance(avoidBad) {
      const reqIndex = {};
      V.required.forEach((t, i) => { reqIndex[t] = i; });
      const fullMask = (1 << V.required.length) - 1;
      const key = (x, y, m) => x + ',' + y + ',' + m;
      const dist = new Map();
      dist.set(key(startCell[0], startCell[1], 0), 0);
      const queue = [[startCell[0], startCell[1], 0]];
      let qi = 0;
      while (qi < queue.length) {
        const [x, y, m] = queue[qi++];
        const d = dist.get(key(x, y, m));
        if (x === endCell[0] && y === endCell[1] && m === fullMask) return d;
        for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= GW || ny < 0 || ny >= GH) continue;
          if (grid[ny][nx] !== 0) continue;
          const z = zoneAt(nx, ny);
          const zt = z ? z.type : null;
          if (avoidBad && zt && ZONE_TYPES[zt].bad) continue;
          let nm = m;
          if (zt && reqIndex.hasOwnProperty(zt)) nm |= (1 << reqIndex[zt]);
          const k = key(nx, ny, nm);
          if (!dist.has(k)) { dist.set(k, d + 1); queue.push([nx, ny, nm]); }
        }
      }
      return Infinity;
    }

    function directPathBlocked() {
      const dFree = maskDistance(false);
      const dAvoid = maskDistance(true);
      return isFinite(dAvoid) && (dAvoid - dFree) >= 6;
    }

    function setup(variant) {
      currentVariant = variant;
      variantBtns.forEach((b, i) => b.classList.toggle('active', i === variant));
      V = VARIANTS[variant];
      startCell = [1, 1];
      endCell = [GW - 2, GH - 2];

      // seed привязан к игроку + вариант → у каждого игрока свой лабиринт
      let seed = seedBase * 1000 + variant * 100000 + 1;
      let tries = 0;
      let found = false;
      do {
        generateMaze(seed);
        seed++;
        tries++;
        if (isSolvable() && directPathBlocked()) { found = true; break; }
      } while (tries < 8000);
      if (!found) {
        seed = seedBase * 1000 + variant * 100000 + 1;
        tries = 0;
        do {
          generateMaze(seed);
          seed++;
          tries++;
        } while (!isSolvable() && tries < 4000);
      }
      solution = solve();

      visited = new Set(['1,1']);
      trail = [[1, 1]];
      pointerDown = false;
      won = false;
      gameOver = false;
      collected = new Set();

      renderConditions();
      renderLegend();
      resize();
      draw();
      updateHud();
      statusEl.className = 'mz-status';
      statusEl.textContent = 'Коснись золотой точки и веди палец.';
    }

    function renderConditions() {
      condEl.innerHTML = V.conditions.map(c => {
        let cls = c.good ? '' : 'no';
        if (c.good && c.key && collected.has(c.key)) cls = 'done';
        return '<span class="' + cls + '">' + c.text + '</span>';
      }).join('');
    }

    function renderLegend() {
      const types = [...new Set(V.zones.map(z => z.type))];
      legendEl.innerHTML = types.map(t => {
        const meta = ZONE_TYPES[t];
        return '<span class="item"><span class="swatch" style="background:' + meta.edge + '"></span>' + meta.label + '</span>';
      }).join('');
    }

    function resize() {
      const rect = stageEl.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height) - 12);
      CELL = Math.max(14, Math.floor(size / GW));
      const csize = CELL * GW;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = csize * dpr;
      canvas.height = csize * dpr;
      canvas.style.width = csize + 'px';
      canvas.style.height = csize + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const key = (x, y) => x + ',' + y;

    function draw() {
      const W = GW * CELL;
      const H = GH * CELL;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = COL.bg;
      ctx.fillRect(0, 0, W, H);

      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          if (grid[y][x] === 0) drawCorridorTile(x, y);
        }
      }
      V.zones.forEach(z => drawZone(z));
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          if (grid[y][x] === 1) drawWallTile(x, y);
        }
      }
      drawGlowDot(startCell[0], startCell[1], COL.start, COL.startGlow, 0.42);
      drawGlowDot(endCell[0], endCell[1], COL.finish, COL.finishGlow, 0.42);
      drawTrail();
    }

    function drawCorridorTile(x, y) {
      const px = x * CELL, py = y * CELL;
      ctx.fillStyle = COL.corridor;
      ctx.fillRect(px, py, CELL, CELL);
      ctx.strokeStyle = 'rgba(40,58,62,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < CELL; i += 4) {
        ctx.moveTo(px + i, py + CELL);
        ctx.lineTo(px + i + 6, py + CELL - 6);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(70,95,100,0.3)';
      ctx.fillRect(px + 1, py + 1, 1, 1);
    }

    function drawWallTile(x, y) {
      const px = x * CELL, py = y * CELL;
      ctx.fillStyle = COL.wall;
      ctx.fillRect(px, py, CELL, CELL);
      ctx.strokeStyle = COL.wallEdge;
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
      ctx.strokeStyle = COL.wallHi;
      ctx.beginPath();
      ctx.moveTo(px + 1, py + 1);
      ctx.lineTo(px + CELL - 1, py + 1);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(50,68,72,0.4)';
      ctx.beginPath();
      ctx.moveTo(px + CELL * 0.3, py + CELL * 0.3);
      ctx.lineTo(px + CELL * 0.7, py + CELL * 0.7);
      ctx.stroke();
    }

    function drawZone(z) {
      const meta = ZONE_TYPES[z.type];
      const isDone = collected.has(z.type);
      for (let y = z.y; y < z.y + z.h; y++) {
        for (let x = z.x; x < z.x + z.w; x++) {
          if (x < 0 || x >= GW || y < 0 || y >= GH) continue;
          if (grid[y][x] !== 0) continue;
          drawZoneTile(x, y, z.type);
        }
      }
      ctx.strokeStyle = meta.edge;
      ctx.lineWidth = isDone ? 3 : 2;
      ctx.globalAlpha = isDone ? 1 : 0.85;
      ctx.strokeRect(z.x * CELL + 1, z.y * CELL + 1, z.w * CELL - 2, z.h * CELL - 2);
      ctx.globalAlpha = 1;
      const marks = [
        [z.x * CELL + 1, z.y * CELL + 1],
        [(z.x + z.w) * CELL - 1, z.y * CELL + 1],
        [z.x * CELL + 1, (z.y + z.h) * CELL - 1],
        [(z.x + z.w) * CELL - 1, (z.y + z.h) * CELL - 1]
      ];
      ctx.strokeStyle = meta.edge;
      ctx.lineWidth = 2;
      marks.forEach(([mx, my]) => {
        ctx.beginPath();
        ctx.moveTo(mx, my); ctx.lineTo(mx + 5, my);
        ctx.moveTo(mx, my); ctx.lineTo(mx, my + 5);
        ctx.stroke();
      });
      if (isDone) {
        ctx.fillStyle = meta.edge;
        ctx.font = Math.max(11, Math.floor(CELL * 0.75)) + 'px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('✓', (z.x + z.w) * CELL - 8, z.y * CELL + 6);
      }
    }

    function drawZoneTile(x, y, type) {
      const px = x * CELL, py = y * CELL;
      const meta = ZONE_TYPES[type];
      ctx.fillStyle = meta.base;
      ctx.fillRect(px, py, CELL, CELL);
      if (type === 'forest') drawForestPattern(px, py, meta);
      else if (type === 'bridge') drawBridgePattern(px, py, meta);
      else if (type === 'water') drawWaterPattern(px, py, meta);
      else if (type === 'swamp') drawSwampPattern(px, py, meta);
      else if (type === 'rocks') drawRocksPattern(px, py, meta);
      else if (type === 'thorns') drawThornsPattern(px, py, meta);
      else if (type === 'lava') drawLavaPattern(px, py, meta);
      else if (type === 'cave') drawCavePattern(px, py, meta);
      ctx.strokeStyle = meta.edge;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
      ctx.globalAlpha = 1;
    }

    function hash(x, y) {
      let h = (x * 73856093) ^ (y * 19349663);
      return ((h >>> 0) % 1000) / 1000;
    }

    function drawForestPattern(px, py, meta) {
      const cols = CELL >= 14 ? 2 : 1;
      const size = CELL / cols;
      for (let i = 0; i < cols; i++) for (let j = 0; j < cols; j++) {
        const cx = px + size * i + size / 2;
        const cy = py + size * j + size / 2;
        const s = size * 0.32;
        ctx.fillStyle = meta.accent;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - s); ctx.lineTo(cx - s * 0.8, cy); ctx.lineTo(cx + s * 0.8, cy);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 0.3); ctx.lineTo(cx - s * 0.6, cy + s * 0.6); ctx.lineTo(cx + s * 0.6, cy + s * 0.6);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function drawBridgePattern(px, py, meta) {
      ctx.strokeStyle = meta.accent;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      for (let yy = 2; yy < CELL; yy += 3) {
        ctx.beginPath();
        ctx.moveTo(px + 1, py + yy + 0.5);
        ctx.lineTo(px + CELL - 1, py + yy + 0.5);
        ctx.stroke();
      }
      ctx.beginPath();
      for (let xx = 3; xx < CELL; xx += 5) {
        ctx.moveTo(px + xx + 0.5, py + 1);
        ctx.lineTo(px + xx + 0.5, py + CELL - 1);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawWaterPattern(px, py, meta) {
      ctx.strokeStyle = meta.accent;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      const step = Math.max(3, CELL / 3);
      for (let yy = step; yy < CELL; yy += step) {
        ctx.beginPath();
        for (let xx = 0; xx <= CELL; xx += 3) {
          const waveY = py + yy + Math.sin(xx * 0.7 + yy) * 1.2;
          if (xx === 0) ctx.moveTo(px + xx, waveY);
          else ctx.lineTo(px + xx, waveY);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawSwampPattern(px, py, meta) {
      ctx.fillStyle = meta.accent;
      ctx.globalAlpha = 0.4;
      const count = CELL >= 14 ? 3 : 2;
      for (let i = 0; i < count; i++) {
        const r = hash(px + i, py + i * 2);
        const cx = px + r * (CELL - 4) + 2;
        const cy = py + ((r * 3) % 1) * (CELL - 4) + 2;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, CELL * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawRocksPattern(px, py, meta) {
      ctx.fillStyle = meta.accent;
      ctx.globalAlpha = 0.45;
      const count = CELL >= 14 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const cx = px + CELL * (0.3 + i * 0.4);
        const cy = py + CELL * 0.7;
        const s = CELL * 0.25;
        ctx.beginPath();
        ctx.moveTo(cx, cy - s); ctx.lineTo(cx - s, cy); ctx.lineTo(cx + s, cy);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawThornsPattern(px, py, meta) {
      ctx.strokeStyle = meta.accent;
      ctx.globalAlpha = 0.65;
      ctx.lineWidth = 1.5;
      const count = CELL >= 14 ? 3 : 2;
      for (let i = 0; i < count; i++) {
        const r = hash(px + i * 4, py + i * 6);
        const cx = px + r * (CELL - 6) + 3;
        const cy = py + ((r * 5) % 1) * (CELL - 6) + 3;
        const s = CELL * 0.14;
        ctx.beginPath();
        ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx + s, cy + s);
        ctx.moveTo(cx - s, cy + s); ctx.lineTo(cx + s, cy - s);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawLavaPattern(px, py, meta) {
      ctx.fillStyle = meta.accent;
      ctx.globalAlpha = 0.5;
      const cx = px + CELL / 2, cy = py + CELL / 2;
      for (let i = 0; i < 4; i++) {
        const ang = i * Math.PI / 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * CELL * 0.18, cy + Math.sin(ang) * CELL * 0.18, CELL * 0.11, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawCavePattern(px, py, meta) {
      ctx.strokeStyle = meta.accent;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 2, py + CELL - 2);
      ctx.quadraticCurveTo(px + CELL / 2, py + 2, px + CELL - 2, py + CELL - 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawTrail() {
      if (trail.length <= 1) return;
      const pts = trail.map(([x, y]) => [x * CELL + CELL / 2, y * CELL + CELL / 2]);
      ctx.strokeStyle = COL.trailGlow;
      ctx.lineWidth = Math.max(6, CELL * 0.75);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
      ctx.stroke();
      ctx.strokeStyle = COL.trail;
      ctx.lineWidth = Math.max(3, CELL * 0.42);
      ctx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
      ctx.stroke();
      ctx.strokeStyle = COL.trailCore;
      ctx.lineWidth = Math.max(1, CELL * 0.14);
      ctx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
      ctx.stroke();
      const [hx, hy] = pts[pts.length - 1];
      const grd = ctx.createRadialGradient(hx, hy, 0, hx, hy, CELL * 0.55);
      grd.addColorStop(0, 'rgba(240,217,168,0.85)');
      grd.addColorStop(1, 'rgba(194,168,120,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(hx, hy, CELL * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawGlowDot(gx, gy, color, glow, rCoef) {
      const cx = gx * CELL + CELL / 2;
      const cy = gy * CELL + CELL / 2;
      const r = CELL * rCoef;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
      grd.addColorStop(0, glow);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(cx - r * 0.18, cy - r * 0.18, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }

    function updateHud() {
      const cur = trail[trail.length - 1];
      const totalDist = solution.length - 1;
      let idx = -1;
      for (let i = 0; i < solution.length; i++) {
        if (solution[i][0] === cur[0] && solution[i][1] === cur[1]) { idx = i; break; }
      }
      const pct = idx >= 0 ? Math.round((idx / totalDist) * 100) : Math.max(0, Math.round(
        ((startCell[0] + startCell[1]) - (cur[0] + cur[1])) /
        ((startCell[0] + startCell[1]) - (endCell[0] + endCell[1])) * 100
      ));
      progEl.textContent = Math.max(0, Math.min(100, pct)) + '%';
    }

    function cellFromPoint(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const scale = (CELL * GW) / rect.width;
      const fx = (clientX - rect.left) * scale / CELL;
      const fy = (clientY - rect.top)  * scale / CELL;
      let x = Math.floor(fx), y = Math.floor(fy);
      if (y < 0 || y >= GH || x < 0 || x >= GW || grid[y][x] === 1) {
        let best = null, bestDist = Infinity;
        for (const [cx, cy] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
          if (cx < 0 || cx >= GW || cy < 0 || cy >= GH) continue;
          if (grid[cy][cx] !== 0) continue;
          const d = Math.hypot((cx + 0.5) - fx, (cy + 0.5) - fy);
          if (d < bestDist) { bestDist = d; best = [cx, cy]; }
        }
        if (best && bestDist < 1) { x = best[0]; y = best[1]; }
      }
      return [x, y];
    }

    function tryExtend(x, y) {
      if (won || gameOver) return;
      if (x < 0 || x >= GW || y < 0 || y >= GH) return;
      if (grid[y][x] !== 0) return;
      const last = trail[trail.length - 1];
      if (last[0] === x && last[1] === y) return;
      const dx = Math.abs(last[0] - x);
      const dy = Math.abs(last[1] - y);
      if (dx + dy !== 1) return;
      if (visited.has(key(x, y))) return;
      const zone = zoneAt(x, y);
      if (zone) {
        const meta = ZONE_TYPES[zone.type];
        if (meta.bad) { breakTrail(meta.label.charAt(0).toUpperCase() + meta.label.slice(1) + ' — нельзя сюда заходить.'); return; }
        if (meta.good && !collected.has(zone.type)) {
          collected.add(zone.type);
          renderConditions();
        }
      }
      trail.push([x, y]);
      visited.add(key(x, y));
      if (x === endCell[0] && y === endCell[1]) win();
      draw();
      updateHud();
    }

    function breakTrail(msg) {
      pointerDown = false;
      gameOver = true;
      statusEl.className = 'mz-status bad';
      statusEl.textContent = '✗ ' + msg + ' Начни сначала.';
      trail = [[startCell[0], startCell[1]]];
      visited = new Set([key(startCell[0], startCell[1])]);
      collected = new Set();
      renderConditions();
      draw();
      updateHud();
    }

    function win() {
      pointerDown = false;
      const missing = V.required.filter(k => !collected.has(k));
      if (missing.length) {
        gameOver = true;
        statusEl.className = 'mz-status bad';
        statusEl.textContent = '✗ Дошёл до выхода, но не через все нужные места: ' +
          missing.map(k => ZONE_TYPES[k].label).join(', ') + '.';
        progEl.textContent = '100%';
      } else {
        won = true;
        statusEl.className = 'mz-status good';
        statusEl.textContent = '✓ Путь пройден. Туман расступился.';
        progEl.textContent = '100%';
        if (typeof onSuccess === 'function') onSuccess();
      }
      draw();
    }

    let lastPoint = null;

    function onDown(e) {
      if (won) return;
      const [x, y] = cellFromPoint(e.clientX, e.clientY);
      if (x === startCell[0] && y === startCell[1]) {
        gameOver = false;
        pointerDown = true;
        trail = [[x, y]];
        visited = new Set([key(x, y)]);
        collected = new Set();
        renderConditions();
        lastPoint = [x, y];
        e.preventDefault();
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Веди палец, не отпуская...';
        draw();
        updateHud();
      } else if (!gameOver) {
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Начни с золотой точки.';
      }
    }

    function onMove(e) {
      if (!pointerDown || won || gameOver) return;
      e.preventDefault();
      const [x, y] = cellFromPoint(e.clientX, e.clientY);
      if (!lastPoint) { lastPoint = [x, y]; return; }
      const dx = x - lastPoint[0];
      const dy = y - lastPoint[1];
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const ix = Math.round(lastPoint[0] + dx * t);
        const iy = Math.round(lastPoint[1] + dy * t);
        tryExtend(ix, iy);
        if (!pointerDown || gameOver) return;
      }
      lastPoint = [x, y];
    }

    function onUp() {
      if (!pointerDown) return;
      pointerDown = false;
      lastPoint = null;
      if (!won && !gameOver && trail.length > 1) {
        gameOver = true;
        statusEl.className = 'mz-status bad';
        statusEl.textContent = '✗ Палец оторвался — след оборвался. Начни сначала.';
        trail = [[startCell[0], startCell[1]]];
        visited = new Set([key(startCell[0], startCell[1])]);
        collected = new Set();
        renderConditions();
        draw();
        updateHud();
      }
    }

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    variantBtns.forEach((b, i) => {
      b.addEventListener('click', () => setup(i));
    });

    const resizeHandler = () => { resize(); draw(); };
    window.addEventListener('resize', resizeHandler);

    // Очистка при закрытии модалки (когда container будет очищен)
    const observer = new MutationObserver(() => {
      if (!document.body.contains(container)) {
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        window.removeEventListener('resize', resizeHandler);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setup(0);
  }

  window.MazeTask = { open };
})();