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
        flex: 1 1 60px; padding: 9px 4px;
        background: transparent;
        border: 1px solid #223336;
        color: #798c89;
        cursor: pointer; transition: .2s;
        font-family: inherit; letter-spacing: .1em;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      .maze-task .variant:hover { border-color: rgba(194,168,120,.4); color: #c2a878; }
      .maze-task .variant.active {
        border-color: #c2a878; color: #c2a878;
        background: rgba(194,168,120,.08);
      }
      .maze-task .variant.done {
        border-color: #8ac47a; color: #8ac47a;
        background: rgba(138,196,122,.14);
      }
      .maze-task .variant.done.active {
        border-color: #c2a878; color: #c2a878;
        background: rgba(194,168,120,.12);
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
        border: 1px solid rgba(255,255,255,0.15);
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
        padding: 4px;
        display: flex; align-items: center; justify-content: center;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
        overscroll-behavior: none;
      }
      .maze-task canvas {
        display: block;
        touch-action: none;
        cursor: crosshair;
        border: 1px solid #1a2528;
      }
      .maze-task .maze-actions {
        display: flex; gap: 8px; margin-top: 10px;
      }
      .maze-task .mz-reset {
        flex: 1;
        padding: 12px 14px;
        background: transparent;
        border: 1px solid #223336;
        color: #798c89;
        font-family: 'PT Mono', monospace;
        font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
        cursor: pointer; transition: .2s;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      .maze-task .mz-reset:hover { border-color: rgba(194,168,120,.4); color: #c2a878; }
      .maze-task .mz-reset:active { background: rgba(194,168,120,.08); }
      .maze-task .mz-status {
        margin-top: 10px;
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

      @media (max-width: 900px) {
        .maze-task .stage { padding: 3px; }
        .maze-task .variants,
        .maze-task .legend,
        .maze-task .conditions {
          gap: 4px;
          margin-bottom: 6px;
        }
        .maze-task .variant {
          padding: 8px 4px;
          font-size: 10px;
        }
        .maze-task .conditions span {
          padding: 3px 7px;
          font-size: 9px;
        }
        .maze-task .legend { font-size: 9px; gap: 6px; }
        .maze-task .mz-status { font-size: 12px; padding: 8px 10px; }
        .maze-task .mz-reset { padding: 11px 12px; font-size: 10px; }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- Константы ----------
  // Размер сетки выбирается в open(): меньше для телефона, больше для десктопа.
  let CELLS_W = 9;
  let CELLS_H = 9;
  let GW = CELLS_W * 2 + 1;
  let GH = CELLS_H * 2 + 1;

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
    forest: { fill: 'rgba(58,110,48,0.55)',  edge: '#7ac454', label: 'лес',    good: true },
    bridge: { fill: 'rgba(140,90,42,0.55)',  edge: '#d4924a', label: 'мост',   good: true },
    cave:   { fill: 'rgba(76,62,96,0.55)',   edge: '#9a7ac0', label: 'пещеру', good: true },
    water:  { fill: 'rgba(36,76,140,0.55)',  edge: '#5aa0e0', label: 'воды',   bad: true },
    swamp:  { fill: 'rgba(112,112,42,0.55)', edge: '#b8b850', label: 'болота', bad: true },
    rocks:  { fill: 'rgba(72,72,90,0.55)',   edge: '#8888a8', label: 'скал',   bad: true },
    thorns: { fill: 'rgba(86,32,38,0.55)',   edge: '#e0454a', label: 'шипов',  bad: true },
    lava:   { fill: 'rgba(170,50,32,0.55)',  edge: '#e05a30', label: 'лавы',   bad: true }
  };

  // 9 позиций для десктопа (сетка 19×19).
  const POS_DESKTOP = {
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
  const POS_KEYS_DESKTOP = ['tl','tc','tr','ml','cc','mr','bl','bc','br'];

  // 9 позиций для телефона (сетка 15×15).
  const POS_MOBILE = {
    tl: { x: 2,  y: 2,  w: 3, h: 3 },
    tc: { x: 6,  y: 2,  w: 3, h: 3 },
    tr: { x: 10, y: 2,  w: 3, h: 3 },
    ml: { x: 2,  y: 6,  w: 3, h: 3 },
    cc: { x: 6,  y: 6,  w: 3, h: 3 },
    mr: { x: 10, y: 6,  w: 3, h: 3 },
    bl: { x: 2,  y: 10, w: 3, h: 3 },
    bc: { x: 6,  y: 10, w: 3, h: 3 },
    br: { x: 10, y: 10, w: 3, h: 3 }
  };
  const POS_KEYS_MOBILE = ['tl','tc','tr','ml','cc','mr','bl','bc','br'];

  // Шаблоны вариантов: набор good/bad типов зон.
  // Раскладка по позициям рандомится для каждого игрока.
  const VARIANT_TEMPLATES = [
    { good: ['forest', 'bridge'],         bad: ['water', 'thorns', 'rocks'] },
    { good: ['cave', 'bridge'],           bad: ['water', 'swamp', 'lava'] },
    { good: ['cave', 'bridge'],           bad: ['water', 'rocks', 'thorns'] },
    { good: ['forest', 'cave'],           bad: ['water', 'swamp', 'lava'] },
    { good: ['forest', 'cave', 'bridge'], bad: ['water', 'swamp', 'thorns'] }
  ];

  // ---------- Утилиты ----------
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildLayout(variantSeed, variant, posMap, posKeys) {
    const tpl = VARIANT_TEMPLATES[variant];
    const rng = makeRng(variantSeed * 2654435761 + variant * 1009 + 13);

    const positions = shuffle(posKeys.slice(), rng);
    const goodTypes = shuffle(tpl.good.slice(), rng);
    const badTypes  = shuffle(tpl.bad.slice(), rng);

    const zones = [];
    let idx = 0;

    goodTypes.forEach(t => {
      const key = positions[idx++];
      zones.push({ ...posMap[key], type: t });
    });
    badTypes.forEach(t => {
      const key = positions[idx++];
      zones.push({ ...posMap[key], type: t });
    });

    const conditions = [];
    goodTypes.forEach(t => {
      conditions.push({ text: '✓ через ' + ZONE_TYPES[t].label, good: true, key: t });
    });
    badTypes.forEach(t => {
      conditions.push({ text: '✗ без ' + ZONE_TYPES[t].label, good: false });
    });

    return {
      conditions,
      required: goodTypes.slice(),
      zones
    };
  }

  function open(container, seedBase, onSuccess) {
    injectStyles();

    // --- Определяем режим: телефон или десктоп ---
    const isTouchDevice = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
      || (window.innerWidth < 900);

    CELLS_W = isTouchDevice ? 7 : 9;
    CELLS_H = isTouchDevice ? 7 : 9;
    GW = CELLS_W * 2 + 1;
    GH = CELLS_H * 2 + 1;

    const POS_MAP  = isTouchDevice ? POS_MOBILE     : POS_DESKTOP;
    const POS_KEYS = isTouchDevice ? POS_KEYS_MOBILE : POS_KEYS_DESKTOP;

    const userSeed = (typeof seedBase === 'number')
      ? (seedBase >>> 0)
      : hashStr(String(seedBase));

    const STORAGE_KEY = 'maze_done::' + userSeed;

    container.innerHTML = `
      <div class="maze-task">
        <div class="variants" id="mzVariants"></div>
        <div class="legend" id="mzLegend"></div>
        <div class="conditions" id="mzConditions"></div>
        <div class="mz-row">
          <span>Уровни: <span class="val" id="mzVariantsDone">0 / 5</span></span>
          <span>Пройдено: <span class="val" id="mzProgress">0%</span></span>
        </div>
        <div class="stage" id="mzStage">
          <canvas id="mzCanvas"></canvas>
        </div>
        <div class="maze-actions">
          <button type="button" class="mz-reset" id="mzReset">Сбросить путь</button>
        </div>
        <div class="mz-status" id="mzStatus">Тапни по золотой точке.</div>
      </div>
    `;

    const variantsWrap   = container.querySelector('#mzVariants');
    const legendEl       = container.querySelector('#mzLegend');
    const condEl         = container.querySelector('#mzConditions');
    const progEl         = container.querySelector('#mzProgress');
    const variantsDoneEl = container.querySelector('#mzVariantsDone');
    const stageEl        = container.querySelector('#mzStage');
    const canvas         = container.querySelector('#mzCanvas');
    const ctx            = canvas.getContext('2d');
    const statusEl       = container.querySelector('#mzStatus');
    const resetBtn       = container.querySelector('#mzReset');

    // Прогресс
    let completedSet = new Set();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) completedSet = new Set(arr.map(Number));
      }
    } catch (e) {}

    function saveCompleted() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSet])); } catch (e) {}
    }

    function updateVariantButtons() {
      variantBtns.forEach((b, i) => {
        const done = completedSet.has(i);
        b.classList.toggle('done', done);
        b.textContent = ['I','II','III','IV','V'][i] + (done ? ' ✓' : '');
      });
      if (variantsDoneEl) {
        variantsDoneEl.textContent = completedSet.size + ' / ' + VARIANT_TEMPLATES.length;
      }
    }

    const variantBtns = VARIANT_TEMPLATES.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'variant';
      b.textContent = ['I','II','III','IV','V'][i];
      b.dataset.v = String(i);
      variantsWrap.appendChild(b);
      return b;
    });

    // ---------- Состояние ----------
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
      // 1) В каждой required-зоне должна быть хотя бы одна открытая клетка.
      for (const reqType of V.required) {
        let hasOpen = false;
        for (const z of V.zones) {
          if (z.type !== reqType) continue;
          for (let y = z.y; y < z.y + z.h && !hasOpen; y++) {
            for (let x = z.x; x < z.x + z.w; x++) {
              if (x < 0 || x >= GW || y < 0 || y >= GH) continue;
              if (grid[y][x] === 0) { hasOpen = true; break; }
            }
          }
          if (hasOpen) break;
        }
        if (!hasOpen) return false;
      }

      // 2) DFS: есть ли путь, собирающий все required и не заходящий в bad.
      const reqIndex = {};
      V.required.forEach((t, i) => { reqIndex[t] = i; });
      const fullMask = (1 << V.required.length) - 1;
      const vis = new Set([startCell[0] + ',' + startCell[1]]);
      let steps = 0;
      const STEP_BUDGET = 6000;

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
      const k = (x, y, m) => x + ',' + y + ',' + m;
      const dist = new Map();
      dist.set(k(startCell[0], startCell[1], 0), 0);
      const queue = [[startCell[0], startCell[1], 0]];
      let qi = 0;
      while (qi < queue.length) {
        const [x, y, m] = queue[qi++];
        const d = dist.get(k(x, y, m));
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
          const kk = k(nx, ny, nm);
          if (!dist.has(kk)) { dist.set(kk, d + 1); queue.push([nx, ny, nm]); }
        }
      }
      return Infinity;
    }

    function directPathBlocked() {
      const dFree = maskDistance(false);
      const dAvoid = maskDistance(true);
      return isFinite(dAvoid) && (dAvoid - dFree) >= 5;
    }

    function setup(variant) {
      currentVariant = variant;
      variantBtns.forEach((b, i) => b.classList.toggle('active', i === variant));

      const variantSeed = ((userSeed ^ (variant * 0x9E3779B1)) >>> 0) || 1;

      V = buildLayout(variantSeed, variant, POS_MAP, POS_KEYS);

      startCell = [1, 1];
      endCell = [GW - 2, GH - 2];

      // Ищем лабиринт: проходим, требует обхода, в каждой good-зоне есть открытая клетка.
      let seed = variantSeed + 1;
      let tries = 0;
      let found = false;
      do {
        generateMaze(seed);
        seed++;
        tries++;
        if (isSolvable() && directPathBlocked()) { found = true; break; }
      } while (tries < 800);

      // Фолбэк — первый просто проходимый.
      if (!found) {
        seed = variantSeed + 1;
        tries = 0;
        do {
          generateMaze(seed);
          seed++;
          tries++;
        } while (!isSolvable() && tries < 400);
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
      updateVariantButtons();
      resize();
      draw();
      updateHud();
      statusEl.className = 'mz-status';
      statusEl.textContent = 'Тапни по золотой точке.';
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
        return '<span class="item"><span class="swatch" style="background:' + meta.fill + ';border-color:' + meta.edge + '"></span>' + meta.label + '</span>';
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

      // Коридоры
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          if (grid[y][x] === 0) drawCorridorTile(x, y);
        }
      }
      // Зоны поверх коридоров
      V.zones.forEach(z => drawZone(z));
      // Стены поверх всего
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          if (grid[y][x] === 1) drawWallTile(x, y);
        }
      }
      drawGlowDot(startCell[0], startCell[1], COL.start, COL.startGlow, 0.55);
      drawGlowDot(endCell[0], endCell[1], COL.finish, COL.finishGlow, 0.55);
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
    }

    // Зона: сплошная заливка + рамка + уголки. Без узоров.
    function drawZone(z) {
      const meta = ZONE_TYPES[z.type];
      const isDone = collected.has(z.type);

      // Заливаем только проходимые клетки внутри зоны.
      for (let y = z.y; y < z.y + z.h; y++) {
        for (let x = z.x; x < z.x + z.w; x++) {
          if (x < 0 || x >= GW || y < 0 || y >= GH) continue;
          if (grid[y][x] !== 0) continue;
          ctx.fillStyle = meta.fill;
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }

      // Рамка по периметру зоны.
      ctx.strokeStyle = meta.edge;
      ctx.lineWidth = isDone ? 3 : 2;
      ctx.globalAlpha = isDone ? 1 : 0.9;
      ctx.strokeRect(z.x * CELL + 1, z.y * CELL + 1, z.w * CELL - 2, z.h * CELL - 2);
      ctx.globalAlpha = 1;

      // Уголки-засечки.
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

      // Галочка если зона собрана.
      if (isDone) {
        ctx.fillStyle = meta.edge;
        ctx.font = 'bold ' + Math.max(12, Math.floor(CELL * 0.9)) + 'px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('✓', (z.x + z.w) * CELL - 6, z.y * CELL + 4);
      }
    }

    function drawTrail() {
      if (trail.length <= 1) return;
      const pts = trail.map(([x, y]) => [x * CELL + CELL / 2, y * CELL + CELL / 2]);
      ctx.strokeStyle = COL.trailGlow;
      ctx.lineWidth = Math.max(8, CELL * 0.85);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
      ctx.stroke();
      ctx.strokeStyle = COL.trail;
      ctx.lineWidth = Math.max(5, CELL * 0.55);
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
      const fy = (clientY - rect.top) * scale / CELL;
      let x = Math.floor(fx), y = Math.floor(fy);

      // Если попал в стену или за пределы — ищем ближайшую проходимую клетку.
      if (y < 0 || y >= GH || x < 0 || x >= GW || grid[y][x] === 1) {
        let best = null, bestDist = Infinity;
        for (let cy = Math.max(0, y - 1); cy <= Math.min(GH - 1, y + 1); cy++) {
          for (let cx = Math.max(0, x - 1); cx <= Math.min(GW - 1, x + 1); cx++) {
            if (grid[cy][cx] !== 0) continue;
            const d = Math.hypot((cx + 0.5) - fx, (cy + 0.5) - fy);
            if (d < bestDist) { bestDist = d; best = [cx, cy]; }
          }
        }
        if (best && bestDist < 1.5) { x = best[0]; y = best[1]; }
      }
      return [x, y];
    }

    // Пересобирает collected после отката трейла.
    function recollectFromTrail() {
      collected = new Set();
      V.zones.forEach(z => {
        if (!ZONE_TYPES[z.type].good) return;
        for (const [tx, ty] of trail) {
          if (tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h) {
            collected.add(z.type);
            break;
          }
        }
      });
      renderConditions();
    }

    function tryExtend(x, y) {
      if (won || gameOver) return;
      if (x < 0 || x >= GW || y < 0 || y >= GH) return;
      if (grid[y][x] !== 0) return;

      // Возврат по своей же линии: обрезаем всё, что было после.
      const existingIdx = trail.findIndex(p => p[0] === x && p[1] === y);
      if (existingIdx >= 0 && existingIdx < trail.length - 1) {
        trail = trail.slice(0, existingIdx + 1);
        visited = new Set(trail.map(p => key(p[0], p[1])));
        recollectFromTrail();
        draw();
        updateHud();
        return;
      }

      const last = trail[trail.length - 1];
      if (last[0] === x && last[1] === y) return;
      const dx = Math.abs(last[0] - x);
      const dy = Math.abs(last[1] - y);
      if (dx + dy !== 1) return;
      if (visited.has(key(x, y))) return;

      const zone = zoneAt(x, y);
      if (zone) {
        const meta = ZONE_TYPES[zone.type];
        if (meta.bad) {
          breakTrail(meta.label.charAt(0).toUpperCase() + meta.label.slice(1) + ' — нельзя сюда заходить.');
          return;
        }
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
      statusEl.textContent = '✗ ' + msg + ' Нажми «Сбросить путь».';
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
        draw();
        return;
      }

      won = true;
      statusEl.className = 'mz-status good';
      progEl.textContent = '100%';

      completedSet.add(currentVariant);
      saveCompleted();
      updateVariantButtons();

      if (completedSet.size >= VARIANT_TEMPLATES.length) {
        statusEl.textContent = '✓ Все уровни пройдены. Туман расступился.';
        if (typeof onSuccess === 'function') onSuccess();
      } else {
        const left = VARIANT_TEMPLATES.length - completedSet.size;
        statusEl.textContent = '✓ Уровень пройден. Осталось: ' + left + '. Нажми на следующий номер сверху.';
      }

      draw();
    }

    let lastPoint = null;

    function onDown(e) {
      if (won) return;
      const [x, y] = cellFromPoint(e.clientX, e.clientY);

      // 1. Тап по золотой точке — начать заново.
      const nearStart =
        Math.abs(x - startCell[0]) <= 1 &&
        Math.abs(y - startCell[1]) <= 1;
      if (nearStart) {
        gameOver = false;
        pointerDown = true;
        trail = [[startCell[0], startCell[1]]];
        visited = new Set([key(startCell[0], startCell[1])]);
        collected = new Set();
        renderConditions();
        lastPoint = [startCell[0], startCell[1]];
        e.preventDefault();
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Веди палец...';
        draw();
        updateHud();
        return;
      }

      // 2. Тап рядом с кончиком — продолжаем.
      const last = trail[trail.length - 1];
      if (Math.abs(x - last[0]) <= 2 && Math.abs(y - last[1]) <= 2) {
        gameOver = false;
        pointerDown = true;
        lastPoint = last;
        e.preventDefault();
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Веди палец...';
        draw();
        updateHud();
        return;
      }

      // 3. Тап по линии — откат до этой клетки.
      const idx = trail.findIndex(p => p[0] === x && p[1] === y);
      if (idx >= 0) {
        trail = trail.slice(0, idx + 1);
        visited = new Set(trail.map(p => key(p[0], p[1])));
        recollectFromTrail();
        gameOver = false;
        pointerDown = true;
        lastPoint = [x, y];
        e.preventDefault();
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Откат. Веди дальше...';
        draw();
        updateHud();
        return;
      }

      // 4. Мимо.
      if (!gameOver) {
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Тапни по линии или начни заново с золотой точки.';
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

    // Отпускание пальца НЕ убивает линию: можно продолжить с кончика
    // или откатиться, тапнув по линии.
    function onUp() {
      if (!pointerDown) return;
      pointerDown = false;
      lastPoint = null;
      if (!won && !gameOver) {
        statusEl.className = 'mz-status';
        statusEl.textContent = 'Можно вести дальше с кончика или тапнуть по линии для отката.';
      }
    }

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    variantBtns.forEach((b, i) => {
      b.addEventListener('click', () => setup(i));
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => setup(currentVariant));
    }

    const resizeHandler = () => { resize(); draw(); };
    window.addEventListener('resize', resizeHandler);

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
