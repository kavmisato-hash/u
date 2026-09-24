(function () {
  'use strict';

  const APPS_SCRIPT_URL = '';
  const BUFF_MULT = 1.2;
  const TEAM_SIZE = 4;
  const ADMIN_CODE = '876798765368994847';
  const MAX_SHUFFLES = 3;

  const SPHERES = {
    tvorenie:  { name: 'Креативность', icon: '✎' },
    dvizhenie: { name: 'Активность',   icon: '≈' },
    slovo:     { name: 'Деятельность', icon: '✦' }
  };

  const TEAM_DAILIES = [
    { id: 'team-d1', name: 'задание1', req: 'текст', pts: 3, dayFrom: 1, dayTo: 2 },
    { id: 'team-d2', name: 'задание2', req: 'текст', pts: 3, dayFrom: 3, dayTo: 4 },
    { id: 'team-d3', name: 'задание3', req: 'текст', pts: 4, dayFrom: 5, dayTo: 6 }
  ];

  const PATHS = {
    likotvorcy: {
      name: 'Ликотворцы', icon: '<img src="png/3681529.png" alt="">', buffSphere: 'tvorenie',
      lore: 'Их лики скрыты, а взгляд избегает чужих глаз. Ликотворцы сторонятся заводей и оживлённых троп, предпочитая тишину своего шатра. Денно и нощно они лепят, коптят и разукрашивают маски — и верят, что именно маска убережёт от подкрадывающейся нечисти. Работу сопровождают тихие молитвы. Стоит почувствовать холодок по коже — тушат огонь и сыплют соль у порога.'
    },
    ratniki: {
      name: 'Ратники', icon: '<img src="png/297775.png" alt="">', buffSphere: 'dvizhenie',
      lore: 'Утонуть на глубине, провалиться в зыбучую гальку — их этим не напугать. Ратники готовы к любой угрозе, бьют на опережение и смеются смерти в лицо. Следы тварей их не отпугивают, а лишь раззадоривают: скоро можно будет отыскать очаг опасности и разбить его.'
    },
    kudesniki: {
      name: 'Кудесники', icon: '<img src="png/10632653.png" alt="">', buffSphere: 'slovo',
      lore: 'Даже в самые тяжёлые времена дипломатия занимала почётное место — порой рядом с самыми радикальными решениями. Мантры, обряды, подношения — Кудесники кладут на алтарь всё, лишь бы гости из иномирья позволили пережить грядущую ночь.'
    }
  };

  const PATH_RESULTS = {
    likotvorcy: 'Туман оставил тебе маску.\n\nТы не искал встречи с неизвестным, но и не отвернулся от него.\n\nТы — Ликотворец.',
    ratniki: 'Туман оставил тебе след.\n\nТы не стал ждать, пока опасность сама найдёт тебя.\n\nТы — Ратник.',
    kudesniki: 'Туман оставил тебе голос.\n\nТы не стал довольствоваться тем, что увидел.\n\nТы — Кудесник.'
  };

  const VISIONS = [
    {
      text: 'Ты выходишь с Поляны для сна и видишь, что туман добрался до Камышовой поляны.',
      options: [
        { letter:'а', t:'Остаёшься у камышей и смотришь на очертания в дымке.', p:'likotvorcy' },
        { letter:'б', t:'Сразу идёшь в туман искать патрульных.', p:'ratniki' },
        { letter:'в', t:'Изучаешь следы у края поляны.', p:'kudesniki' }
      ]
    },
    { branches: {
        'а': {
          text: 'Ты возвращаешься к Поляне для сна. У Старого вяза непривычно тихо.',
          options: [
            { letter:'а', t:'Проходишь мимо, но замечаешь странное сочетание ветвей и теней.', p:'likotvorcy' },
            { letter:'б', t:'Идёшь к Старому вязу.', p:'ratniki' },
            { letter:'в', t:'Осматриваешь землю вокруг вяза.', p:'kudesniki' }
          ] },
        'б': {
          text: 'Ты выходишь на Мшистую полянку. Патрульных здесь тоже нет.',
          options: [
            { letter:'а', t:'Рассматриваешь оставленные вещи.', p:'likotvorcy' },
            { letter:'б', t:'Идёшь дальше, выкрикивая имена.', p:'ratniki' },
            { letter:'в', t:'Изучаешь следы.', p:'kudesniki' }
          ] },
        'в': {
          text: 'Следы приводят тебя к краю Камышовой поляны. В тумане появляется силуэт.',
          options: [
            { letter:'а', t:'Отходишь в камыши.', p:'likotvorcy' },
            { letter:'б', t:'Подходишь к силуэту.', p:'ratniki' },
            { letter:'в', t:'Следишь за силуэтом.', p:'kudesniki' }
          ] }
    } },
    { branches: {
        'а': {
          text: 'Ты выходишь к Пещере с травами. У входа никого нет.',
          options: [
            { letter:'а', t:'Замечаешь тени растений на камне.', p:'likotvorcy' },
            { letter:'б', t:'Заходишь внутрь.', p:'ratniki' },
            { letter:'в', t:'Осматриваешь землю у входа.', p:'kudesniki' }
          ] },
        'б': {
          text: 'Ты подходишь к Палатке предводителя. Рядом нет ни одного стражника.',
          options: [
            { letter:'а', t:'Замечаешь царапины на камне.', p:'likotvorcy' },
            { letter:'б', t:'Входишь внутрь.', p:'ratniki' },
            { letter:'в', t:'Изучаешь обстановку у входа.', p:'kudesniki' }
          ] },
        'в': {
          text: 'Ты подходишь к Дальнему уголку. Здесь пусто.',
          options: [
            { letter:'а', t:'Рассматриваешь следы.', p:'likotvorcy' },
            { letter:'б', t:'Идёшь искать участников собрания.', p:'ratniki' },
            { letter:'в', t:'Осматриваешь место собрания.', p:'kudesniki' }
          ] }
    } },
    { intro: 'Туман начинает рассеиваться. Впереди показывается Тенистая поляна. Наконец все взгляды обращаются к тебе.',
      branches: {
        'а': {
          text: 'Ты всю ночь замечал странные вещи.',
          options: [
            { letter:'а', t:'Предлагаешь зарисовать всё необычное.', p:'likotvorcy' },
            { letter:'б', t:'Предлагаешь отправить поисковую группу.', p:'ratniki' },
            { letter:'в', t:'Предлагаешь сопоставить свидетельства.', p:'kudesniki' }
          ] },
        'б': {
          text: 'Ты всю ночь искал пропавших.',
          options: [
            { letter:'а', t:'Предлагаешь зарисовать силуэт.', p:'likotvorcy' },
            { letter:'б', t:'Требуешь идти к Галечному берегу.', p:'ratniki' },
            { letter:'в', t:'Предлагаешь расспросить свидетелей.', p:'kudesniki' }
          ] },
        'в': {
          text: 'Ты всю ночь собирал сведения.',
          options: [
            { letter:'а', t:'Предлагаешь записать всё увиденное.', p:'likotvorcy' },
            { letter:'б', t:'Предлагаешь проверить опасные места.', p:'ratniki' },
            { letter:'в', t:'Предлагаешь вступить в контакт.', p:'kudesniki' }
          ] }
    } }
  ];

  const WAKE_STORY = [
    { eyebrow: 'Туман рассеивается', text: 'Ты резко дёргаешься и открываешь глаза. Всё вокруг тихо.' },
    { eyebrow: 'Пробуждение', text: 'Ты лежишь на Поляне для сна.' },
    { eyebrow: 'Поляна для сна', text: 'Наверное, просто сон.' },
    { eyebrow: 'Но что-то не так', text: 'Ты замечаешь туман между деревьями. Такой же, как во сне.' }
  ];

  const ITOG_INTRO_STORY = [
    { eyebrow: 'Итог видений', text: 'Так это был не сон.', emphasis: true },
    { eyebrow: 'Итог видений', text: 'Туман видел тебя так же ясно, как ты видел его.' }
  ];

  const DEMO_FREE_AGENTS = [
    { id: 'demo-lisa',  name: 'Лиса',  path: 'kudesniki' },
    { id: 'demo-bars',  name: 'Барс',  path: 'ratniki' },
    { id: 'demo-sova',  name: 'Сова',  path: 'kudesniki' },
    { id: 'demo-vydra', name: 'Выдра', path: 'ratniki' },
    { id: 'demo-volk',  name: 'Волк',  path: 'kudesniki' },
    { id: 'demo-tsapl', name: 'Цапля', path: 'ratniki' }
  ];

  const DEMO_TASKS_BY_LEVEL = [
    { tvorenie: [
        { id:'l1-tv-1', name:'задание1', req:'текст', pts:2, sphere:'tvorenie' },
        { id:'l1-tv-2', name:'задание2', req:'текст', pts:2, sphere:'tvorenie' },
        { id:'l1-tv-3', name:'задание3', req:'текст', pts:3, sphere:'tvorenie' }
      ],
      dvizhenie: [
        { id:'l1-dv-1', name:'задание4', req:'текст', pts:2, sphere:'dvizhenie' },
        { id:'l1-dv-2', name:'задание5', req:'текст', pts:2, sphere:'dvizhenie' },
        { id:'l1-dv-3', name:'задание6', req:'текст', pts:3, sphere:'dvizhenie' }
      ],
      slovo: [
        { id:'l1-sl-1', name:'задание7', req:'текст', pts:2, sphere:'slovo' },
        { id:'l1-sl-2', name:'задание8', req:'текст', pts:2, sphere:'slovo' },
        { id:'l1-sl-3', name:'задание9', req:'текст', pts:3, sphere:'slovo' }
      ]
    },
    { tvorenie: [
        { id:'l2-tv-1', name:'задание10', req:'текст', pts:3, sphere:'tvorenie' },
        { id:'l2-tv-2', name:'задание11', req:'текст', pts:3, sphere:'tvorenie' },
        { id:'l2-tv-3', name:'задание12', req:'текст', pts:4, sphere:'tvorenie' }
      ],
      dvizhenie: [
        { id:'l2-dv-1', name:'задание13', req:'текст', pts:3, sphere:'dvizhenie' },
        { id:'l2-dv-2', name:'задание14', req:'текст', pts:3, sphere:'dvizhenie' },
        { id:'l2-dv-3', name:'задание15', req:'текст', pts:4, sphere:'dvizhenie' }
      ],
      slovo: [
        { id:'l2-sl-1', name:'задание16', req:'текст', pts:3, sphere:'slovo' },
        { id:'l2-sl-2', name:'задание17', req:'текст', pts:3, sphere:'slovo' },
        { id:'l2-sl-3', name:'задание18', req:'текст', pts:4, sphere:'slovo' }
      ]
    },
    { tvorenie: [
        { id:'l3-tv-1', name:'задание19', req:'текст', pts:4, sphere:'tvorenie' },
        { id:'l3-tv-2', name:'задание20', req:'текст', pts:5, sphere:'tvorenie' }
      ],
      dvizhenie: [
        { id:'l3-dv-1', name:'задание21', req:'текст', pts:4, sphere:'dvizhenie' },
        { id:'l3-dv-2', name:'задание22', req:'текст', pts:5, sphere:'dvizhenie' }
      ],
      slovo: [
        { id:'l3-sl-1', name:'задание23', req:'текст', pts:4, sphere:'slovo' },
        { id:'l3-sl-2', name:'задание24', req:'текст', pts:5, sphere:'slovo' }
      ]
    }
  ];

  const LS_USERS = 'tuman_users';
  const LS_TEAMS = 'tuman_teams';
  const LS_SESSION = 'tuman_session';
  const LS_PROGRESS = 'tuman_progress';
  const LS_REGORDER = 'tuman_regorder';
  const LS_EVENTSTART = 'tuman_eventstart';
  const LS_DEVOFFSET = 'tuman_devoffset';
  const LS_SHUFFLES = 'tuman_shuffles';
  const LS_TASKORDER = 'tuman_taskorder';

  const ORB_W = 60;
  const MOBILE_ITEM = 78;
  const GAP_X = 24;
  const GAP_Y = 54;
  const BAND_GAP = 82;
  const JITTER_X = 9;
  const JITTER_Y = 7;
  const TASK_ORDER_SEED = 170717;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function loadJSON(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v || fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { toast('Не удалось сохранить — возможно, файл слишком большой'); return false; }
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (ch) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch];
    });
  }
  function round1(n) { return Math.round(n * 10) / 10; }

  function showScreen(id) {
    $all('.screen').forEach(s => s.classList.remove('active'));
    $('#' + id).classList.add('active');
    window.scrollTo(0, 0);
  }
  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  let users = loadJSON(LS_USERS, {});
  let teams = loadJSON(LS_TEAMS, {});
  let progress = loadJSON(LS_PROGRESS, {});
  let regOrder = loadJSON(LS_REGORDER, []);
  let session = { userId: localStorage.getItem(LS_SESSION) || null };

  if (!localStorage.getItem(LS_EVENTSTART)) {
    localStorage.setItem(LS_EVENTSTART, String(Date.now()));
  }

  function saveUsers() { saveJSON(LS_USERS, users); }
  function saveTeams() { saveJSON(LS_TEAMS, teams); }
  function saveProgress() { saveJSON(LS_PROGRESS, progress); }
  function saveRegOrder() { saveJSON(LS_REGORDER, regOrder); }

  function currentUser() {
    return session.userId ? users[session.userId] : null;
  }
  function userProgress(uid) {
    if (!progress[uid]) progress[uid] = {};
    return progress[uid];
  }

  function getCurrentDay() {
    const start = parseInt(localStorage.getItem(LS_EVENTSTART), 10) || Date.now();
    const offset = parseInt(localStorage.getItem(LS_DEVOFFSET), 10) || 0;
    const realDay = Math.floor((Date.now() - start) / 86400000) + 1;
    return Math.max(1, realDay + offset);
  }
  function bumpDevDay(delta) {
    const cur = parseInt(localStorage.getItem(LS_DEVOFFSET), 10) || 0;
    const start = parseInt(localStorage.getItem(LS_EVENTSTART), 10) || Date.now();
    const realDay = Math.floor((Date.now() - start) / 86400000) + 1;
    const proposed = cur + delta;
    if (realDay + proposed < 1) return;
    localStorage.setItem(LS_DEVOFFSET, String(proposed));
  }

  function rebuildTeamsFromOrder() {
    const oldTeams = teams;
    teams = {};
    for (let i = 0; i < regOrder.length; i += TEAM_SIZE) {
      const idx = Math.floor(i / TEAM_SIZE) + 1;
      const id = 'team-' + idx;
      const chunk = regOrder.slice(i, i + TEAM_SIZE);
      const prev = oldTeams[id] || {};
      teams[id] = {
        id: id,
        size: TEAM_SIZE,
        members: chunk.slice(),
        dailies: prev.dailies || {}
      };
      chunk.forEach(mid => { if (users[mid]) users[mid].teamId = id; });
    }
    saveTeams(); saveUsers();
  }
  function registerInTeamOrder(uid) {
    if (regOrder.indexOf(uid) === -1) {
      regOrder.push(uid);
      saveRegOrder();
    }
    rebuildTeamsFromOrder();
  }

  function seedDemo() {
    let changed = false;
    DEMO_FREE_AGENTS.forEach(a => {
      if (!users[a.id]) {
        users[a.id] = { id: a.id, name: a.name, path: a.path, teamId: null, demo: true };
        changed = true;
      }
    });
    if (regOrder.length === 0) {
      regOrder = DEMO_FREE_AGENTS.map(a => a.id);
      saveRegOrder();
    }
    if (changed) saveUsers();
    rebuildTeamsFromOrder();
  }

  let ALL_TASKS = [];
  let TASK_ORDER = [];
  let TASK_DEPENDS = {};
  const depthCache = {};
  let showCompleted = true;

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function jitter(seed, range) {
    return ((hashStr(seed) % 1000) / 1000 - 0.5) * 2 * range;
  }
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffleArr(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function rebuildAllTasks() {
    ALL_TASKS = [];
    DEMO_TASKS_BY_LEVEL.forEach((level, levelIdx) => {
      Object.keys(SPHERES).forEach(sk => {
        (level[sk] || []).forEach(t => ALL_TASKS.push(Object.assign({}, t, { level: levelIdx })));
      });
    });
    rebuildTaskDepends();
  }

  function rebuildTaskDepends() {
    const saved = localStorage.getItem(LS_TASKORDER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === ALL_TASKS.length) {
          const ids = ALL_TASKS.map(t => t.id).sort().join(',');
          const savedIds = parsed.slice().sort().join(',');
          if (ids === savedIds) {
            TASK_ORDER = parsed;
            TASK_DEPENDS = {};
            TASK_ORDER.forEach((id, i) => {
              if (i === 0) TASK_DEPENDS[id] = null;
              else TASK_DEPENDS[id] = { any: [TASK_ORDER[Math.floor((i - 1) / 2)]] };
            });
            Object.keys(depthCache).forEach(k => delete depthCache[k]);
            return;
          }
        }
      } catch (e) {}
    }

    const rng = mulberry32(TASK_ORDER_SEED);
    const byPts = {};
    ALL_TASKS.forEach(t => { (byPts[t.pts] = byPts[t.pts] || []).push(t.id); });
    const ptsKeys = Object.keys(byPts).map(Number).sort((a, b) => a - b);
    let order = [];
    ptsKeys.forEach(p => { order = order.concat(shuffleArr(byPts[p], rng)); });
    TASK_ORDER = order;
    TASK_DEPENDS = {};
    TASK_ORDER.forEach((id, i) => {
      if (i === 0) TASK_DEPENDS[id] = null;
      else TASK_DEPENDS[id] = { any: [TASK_ORDER[Math.floor((i - 1) / 2)]] };
    });
    Object.keys(depthCache).forEach(k => delete depthCache[k]);
  }

  function taskDepth(id) {
    if (depthCache[id] !== undefined) return depthCache[id];
    depthCache[id] = 0;
    const dep = TASK_DEPENDS[id];
    const ids = dep ? (dep.any || dep.all || []) : [];
    const d = ids.length ? Math.max.apply(null, ids.map(taskDepth)) + 1 : 0;
    depthCache[id] = d;
    return d;
  }

  function getTaskState(u, task) {
    if (!u) return { status: 'none' };
    return userProgress(u.id)[task.id] || { status: 'none' };
  }
  function setTaskState(u, task, state) {
    userProgress(u.id)[task.id] = state;
    saveProgress();
  }
  function isTaskUnlockedByDeps(u, task) {
    if (getTaskState(u, task).status !== 'none') return true;
    const dep = TASK_DEPENDS[task.id];
    if (!dep) return true;
    const ids = dep.any || dep.all || [];
    if (!ids.length) return true;
    const isApproved = tid => {
      const t = ALL_TASKS.find(x => x.id === tid);
      return !!t && getTaskState(u, t).status === 'approved';
    };
    return dep.all ? ids.every(isApproved) : ids.some(isApproved);
  }
  function computeFinalPts(u, task) {
    const path = u.path && PATHS[u.path];
    const isBuff = path && path.buffSphere === task.sphere;
    return isBuff ? round1(task.pts * BUFF_MULT) : task.pts;
  }

    function teamDailyBonusFor(u) {
    if (!u || !u.teamId) return 0;
    const team = teams[u.teamId];
    if (!team) return 0;
    let sum = 0;
    TEAM_DAILIES.forEach(d => {
      const st = getDailyState(team, d.id);
      if (st.status === 'approved') sum += d.pts;
    });
    return sum;
  }

  function personalScore(u) {
    let sum = 0;
    ALL_TASKS.forEach(t => {
      const st = getTaskState(u, t);
      if (st.status === 'approved') sum += computeFinalPts(u, t);
    });
    sum += teamDailyBonusFor(u);
    return round1(sum);
  }

  function getDailyState(team, dailyId) {
    if (!team || !team.dailies) return { status: 'none' };
    return team.dailies[dailyId] || { status: 'none' };
  }
  function setDailyState(team, dailyId, state) {
    if (!team) return;
    if (!team.dailies) team.dailies = {};
    team.dailies[dailyId] = state;
    saveTeams();
  }
  function teamDailyBonus(team) {
    if (!team) return 0;
    let sum = 0;
    TEAM_DAILIES.forEach(d => {
      const st = getDailyState(team, d.id);
      if (st.status === 'approved') sum += d.pts;
    });
    return sum;
  }
  function isDailyInWindow(daily, day) {
    return day >= daily.dayFrom && day <= daily.dayTo;
  }
  function dailyWindowLabel(daily) {
    return 'дни ' + daily.dayFrom + '–' + daily.dayTo;
  }

  function getShufflesLeft() {
    const used = parseInt(localStorage.getItem(LS_SHUFFLES), 10) || 0;
    return Math.max(0, MAX_SHUFFLES - used);
  }

  function updateShuffleBtn() {
    const btn = $('#btnShuffle');
    if (!btn) return;
    const left = getShufflesLeft();
    const text = btn.querySelector('.btn-shuffle-text');
    if (text) text.textContent = 'Перетасовать · осталось ' + left;
    if (left <= 0) {
      btn.disabled = true;
      btn.dataset.state = 'hidden';
    } else {
      btn.disabled = false;
      btn.dataset.state = 'shown';
    }
  }

  function randomShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function shuffleTree() {
    const left = getShufflesLeft();
    if (left <= 0) { toast('Больше перетасовок нет'); return; }

    const firstId = TASK_ORDER[0];
    const rest = TASK_ORDER.slice(1);
    let shuffled = randomShuffle(rest);

    if (shuffled[0] === firstId) {
      shuffled = randomShuffle(rest);
    }

    TASK_ORDER = [firstId].concat(shuffled);
    TASK_DEPENDS = {};
    TASK_ORDER.forEach((id, i) => {
      if (i === 0) TASK_DEPENDS[id] = null;
      else TASK_DEPENDS[id] = { any: [TASK_ORDER[Math.floor((i - 1) / 2)]] };
    });
    Object.keys(depthCache).forEach(k => delete depthCache[k]);

    const used = (parseInt(localStorage.getItem(LS_SHUFFLES), 10) || 0) + 1;
    localStorage.setItem(LS_SHUFFLES, String(used));
    localStorage.setItem(LS_TASKORDER, JSON.stringify(TASK_ORDER));

    updateShuffleBtn();
    const u = currentUser();
    if (u) renderTaskTree(u);
    toast('Задания перетасованы · осталось ' + (MAX_SHUFFLES - used));
  }

  function updateToggleDoneBtn() {
    const btn = $('#btnToggleDone');
    if (!btn) return;
    btn.dataset.state = showCompleted ? 'shown' : 'hidden';
    const icon = btn.querySelector('.btn-toggle-done-icon');
    const text = btn.querySelector('.btn-toggle-done-text');
    if (icon) icon.textContent = showCompleted ? '−' : '+';
    if (text) text.textContent = showCompleted ? 'Скрыть выполненные' : 'Показать выполненные';
  }

  function openImageViewer(src) {
    const v = $('#imageViewer');
    if (!v || !src) return;
    const img = $('#imageViewerImg');
    if (img) img.src = src;
    v.classList.add('open');
  }
  function closeImageViewer() {
    const v = $('#imageViewer');
    if (v) v.classList.remove('open');
  }

  function attachImageZoom(root) {
    if (!root) return;
    root.querySelectorAll('img.img-preview, img.js-zoomable').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openImageViewer(img.src);
      });
    });
  }

  function renderTaskTree(u) {
    const wrap = $('#taskTree');
    if (!wrap) return;
    wrap.innerHTML = '';

    const byDepth = {};
    let activeDepth = 0;

    TASK_ORDER.forEach(id => {
      const t = ALL_TASKS.find(x => x.id === id);
      if (!t) return;
      if (!showCompleted && getTaskState(u, t).status === 'approved') return;
      const d = taskDepth(id);
      if (isTaskUnlockedByDeps(u, t) || getTaskState(u, t).status !== 'none') {
        activeDepth = Math.max(activeDepth, d);
      }
    });

    TASK_ORDER.forEach(id => {
      const t = ALL_TASKS.find(x => x.id === id);
      if (!t) return;
      if (!showCompleted && getTaskState(u, t).status === 'approved') return;

      const d = taskDepth(id);
      if (d > activeDepth + 1) return;

      if (d === activeDepth + 1) {
        const dep = TASK_DEPENDS[id];
        if (dep) {
          const parentIds = dep.any || dep.all || [];
          const parentVisible = parentIds.some(pid => {
            const pt = ALL_TASKS.find(x => x.id === pid);
            return pt && isTaskUnlockedByDeps(u, pt);
          });
          if (!parentVisible) return;
        }
      }

      (byDepth[d] = byDepth[d] || []).push(t);
    });

    const depths = Object.keys(byDepth).map(Number).sort((a, b) => a - b);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'tree-lines');
    wrap.appendChild(svg);

    const containerWidth = Math.max(280, wrap.clientWidth || 900);
    const nodeEls = {};

    const isWide = containerWidth >= 900;
    if (isWide) renderWideTree(u, wrap, byDepth, depths, containerWidth, nodeEls);
    else renderCompactTree(u, wrap, byDepth, depths, containerWidth, nodeEls);

    requestAnimationFrame(() => drawTreeLines(u, svg, wrap, nodeEls));
  }

      function renderCompactTree(u, wrap, byDepth, depths, containerWidth, nodeEls) {
    const CELL = 52;
    const GX = 16;
    const GY = 18;
    const ZIGZAG = 28;
    const BAND_GAP = 44;

    const usableWidth = Math.max(CELL, containerWidth - 16);
    const perRow = Math.max(1, Math.floor((usableWidth + GX) / (CELL + GX)));

    let cursorY = 30;

    depths.forEach((d, depthIndex) => {
      const list = byDepth[d];
      const rows = [];
      for (let i = 0; i < list.length; i += perRow) {
        rows.push(list.slice(i, i + perRow));
      }

      let rowY = cursorY;
      rows.forEach(rowItems => {
        const countInRow = rowItems.length;
        const rowWidth = countInRow * CELL + (countInRow - 1) * GX;
        const startX = Math.max(0, (containerWidth - rowWidth) / 2);

        let x = startX;
        rowItems.forEach((task, idx) => {
          const unlocked = isTaskUnlockedByDeps(u, task);
          const zig = (idx % 2 === 0 ? -1 : 1) * ZIGZAG;

          const outer = document.createElement('div');
          outer.className = 'tree-node-wrap';
          outer.style.left = (x + CELL / 2) + 'px';
          outer.style.top = (rowY + zig) + 'px';
          outer.style.width = CELL + 'px';
          outer.style.transform = 'translateX(-50%)';

          if (unlocked) {
            outer.appendChild(renderSmallCard(u, task));
          } else {
            outer.appendChild(renderLockedOrb(task));
          }

          wrap.appendChild(outer);
          nodeEls[task.id] = outer;

          x += CELL + GX;
        });

        rowY += CELL + GY + ZIGZAG * 2;
      });

      cursorY = rowY + (depthIndex < depths.length - 1 ? BAND_GAP : 20);
    });

    wrap.style.height = cursorY + 'px';
  }

  function renderWideTree(u, wrap, byDepth, depths, containerWidth, nodeEls) {
    const CARD_W = 240;
    const CARD_H = 190;
    const GAP_X = 28;
    const GAP_Y = 44;
    const ZIGZAG = 40;
    const BAND_GAP = 70;

    let cursorY = 46;

    depths.forEach((d, depthIndex) => {
      const list = byDepth[d];

      const perRow = Math.max(1, Math.floor((containerWidth + GAP_X) / (CARD_W + GAP_X)));
      const rows = [];
      for (let i = 0; i < list.length; i += perRow) {
        rows.push(list.slice(i, i + perRow));
      }

      let rowY = cursorY;
      rows.forEach(rowItems => {
        const countInRow = rowItems.length;
        const rowWidth = countInRow * CARD_W + (countInRow - 1) * GAP_X;
        const startX = Math.max(0, (containerWidth - rowWidth) / 2);

        let x = startX;
        rowItems.forEach((task, idx) => {
          const unlocked = isTaskUnlockedByDeps(u, task);
          const zig = (idx % 2 === 0 ? -1 : 1) * ZIGZAG;

          const outer = document.createElement('div');
          outer.className = 'tree-node-wrap';
          outer.style.left = (x + CARD_W / 2) + 'px';
          outer.style.top = (rowY + zig) + 'px';
          outer.style.width = CARD_W + 'px';
          outer.style.transform = 'translateX(-50%)';

          if (unlocked) {
            outer.appendChild(renderTaskNodeCard(u, task));
          } else {
            outer.appendChild(renderLockedOrb(task));
          }

          wrap.appendChild(outer);
          nodeEls[task.id] = outer;

          x += CARD_W + GAP_X;
        });

        rowY += CARD_H + GAP_Y + ZIGZAG * 2;
      });

      cursorY = rowY + (depthIndex < depths.length - 1 ? BAND_GAP : 20);
    });

    wrap.style.height = cursorY + 'px';
  }

  function renderLockedOrb(task) {
    const sphere = SPHERES[task.sphere];
    const orb = document.createElement('div');
    orb.className = 'locked-orb';
    orb.innerHTML = '<div class="fogpatch"></div><span class="lo-icon">' + sphere.icon + '</span>';
    orb.addEventListener('click', () => toast('Скрыто туманом — выполни предыдущее задание, чтобы это открылось'));
    return orb;
  }

  function renderTaskNodeOrb(u, task) {
    const state = getTaskState(u, task);
    const sphere = SPHERES[task.sphere];
    const finalPts = computeFinalPts(u, task);
    const orb = document.createElement('div');
    orb.className = 'task-node-orb state-' + state.status;
    orb.dataset.taskId = task.id;
    orb.addEventListener('click', () => openTaskModal(u, task));
    orb.innerHTML =
      '<span class="tno-icon">' + sphere.icon + '</span>'
      + '<span class="tno-pts">' + finalPts + '</span>';
    return orb;
  }

  function renderSmallCard(u, task) {
    const state = getTaskState(u, task);
    const sphere = SPHERES[task.sphere];

    const card = document.createElement('div');
    card.className = 'task-square state-' + state.status;
    card.dataset.taskId = task.id;
    card.addEventListener('click', () => openTaskModal(u, task));

    card.innerHTML = '<span class="tsq-icon">' + sphere.icon + '</span>';

    return card;
  }

    function renderLockedSquare(task) {
    const sphere = SPHERES[task.sphere];
    const card = document.createElement('div');
    card.className = 'task-square state-locked';
    card.innerHTML = '<span class="tsq-icon">' + sphere.icon + '</span>';
    card.addEventListener('click', () => toast('Скрыто туманом — выполни предыдущее задание, чтобы это открылось'));
    return card;
  }
  
  function renderTaskNodeCard(u, task) {
    const state = getTaskState(u, task);
    const sphere = SPHERES[task.sphere];
    const finalPts = computeFinalPts(u, task);
    const isBuff = finalPts !== task.pts;
    const statusLabel = { none:'не начато', pending:'отправлено', approved:'принято', rejected:'отклонено' }[state.status];
    const card = document.createElement('div');
    card.className = 'task-node-card state-' + state.status;
    card.dataset.taskId = task.id;
    card.addEventListener('click', () => openTaskModal(u, task));
    card.innerHTML =
      '<div class="tnc-top"><div class="tnc-icon">' + sphere.icon + '</div><div class="tnc-name">' + escapeHtml(task.name) + '</div></div>'
      + '<div class="tnc-req">' + escapeHtml(task.req) + '</div>'
      + '<div class="tnc-bottom"><span class="tnc-pts">' + task.pts + (isBuff ? ' → <b>' + finalPts + '</b>' : '') + '</span><span class="tnc-status">' + statusLabel + '</span></div>';
    return card;
  }

  function drawTreeLines(u, svg, container, nodeEls) {
    const crect = container.getBoundingClientRect();
    svg.setAttribute('width', container.scrollWidth);
    svg.setAttribute('height', container.scrollHeight);
    svg.innerHTML = '';

    const svgNS = 'http://www.w3.org/2000/svg';
    const positions = {};
    Object.keys(nodeEls).forEach(id => {
      const wrapEl = nodeEls[id];
      const inner = wrapEl.querySelector('.task-node-card, .task-node-orb, .locked-orb') || wrapEl;
      const r = inner.getBoundingClientRect();
      positions[id] = {
        cx: r.left + r.width / 2 - crect.left,
        top: r.top - crect.top,
        bottom: r.bottom - crect.top
      };
    });

    TASK_ORDER.forEach(taskId => {
      const dep = TASK_DEPENDS[taskId];
      if (!dep) return;
      const ids = dep.any || dep.all || [];
      ids.forEach(pid => {
        const parent = positions[pid], child = positions[taskId];
        if (!parent || !child) return;

        const x1 = parent.cx, y1 = parent.bottom;
        const x2 = child.cx, y2 = child.top;
        const midY = y1 + (y2 - y1) * 0.55;

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d',
          'M' + x1 + ',' + y1 +
          ' C' + x1 + ',' + midY +
          ' ' + x2 + ',' + midY +
          ' ' + x2 + ',' + y2
        );

        const childTask = ALL_TASKS.find(t => t.id === taskId);
        const childStatus = childTask ? getTaskState(u, childTask).status : 'none';

        let cls = 'tree-edge';
        if (childStatus === 'approved') cls += ' active';
        else if (childStatus === 'pending') cls += ' open';
        path.setAttribute('class', cls);
        svg.appendChild(path);

        if (childStatus === 'approved') {
          const spark = document.createElementNS(svgNS, 'circle');
          spark.setAttribute('cx', x1);
          spark.setAttribute('cy', y1);
          spark.setAttribute('r', '2.8');
          spark.setAttribute('class', 'tree-edge-spark');
          svg.appendChild(spark);
        }
      });
    });
  }

  let treeResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(treeResizeTimer);
    treeResizeTimer = setTimeout(() => {
      const u = currentUser();
      if (u && $('#tabview-tasks') && $('#tabview-tasks').classList.contains('active')) renderTaskTree(u);
    }, 220);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const u = currentUser();
      if (u && $('#tabview-tasks') && $('#tabview-tasks').classList.contains('active')) renderTaskTree(u);
    }, 320);
  });

  let currentModalUser = null;
  let currentModalTask = null;
  let currentModalDaily = null;
  let currentModalTeam = null;

  function imageUploadBlock(state) {
    const hasImage = !!(state && state.image);
    return ''
      + '<div class="img-upload">'
      +   (hasImage
            ? '<div class="img-upload-preview">'
            +   '<img src="' + state.image + '" class="js-zoomable" alt="Отчёт">'
            +   '<button type="button" class="img-upload-remove" id="imgRemoveBtn" title="Удалить фото">×</button>'
            + '</div>'
            : '<label class="img-upload-dropzone" id="imgDropzone" for="modalImage">'
            +   '<div class="img-upload-icon">✦</div>'
            +   '<div class="img-upload-hint">Выбрать или перетащить фото</div>'
            +   '<div class="img-upload-subhint">PNG · JPG · WebP</div>'
            + '</label>')
      +   '<input type="file" id="modalImage" accept="image/*" class="visually-hidden">'
      + '</div>';
  }

  function attachImageUploadHandlers(onRemove) {
    const dz = $('#imgDropzone');
    if (dz) {
      const input = $('#modalImage');
      dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
      dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
      dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          input.files = e.dataTransfer.files;
          const name = e.dataTransfer.files[0].name;
          const hint = dz.querySelector('.img-upload-hint');
          if (hint) hint.textContent = name.length > 32 ? name.slice(0, 30) + '…' : name;
        }
      });
      input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
          const name = input.files[0].name;
          const hint = dz.querySelector('.img-upload-hint');
          if (hint) hint.textContent = name.length > 32 ? name.slice(0, 30) + '…' : name;
        }
      });
    }
    const rm = $('#imgRemoveBtn');
    if (rm && typeof onRemove === 'function') {
      rm.addEventListener('click', (e) => {
        e.preventDefault();
        onRemove();
      });
    }
  }

  function renderEditableForm(state, placeholder) {
    return ''
      + '<div class="field">'
      +   '<label>Ответ / описание отчёта</label>'
      +   '<textarea id="modalAnswer" rows="4" placeholder="' + escapeHtml(placeholder || 'текстекстектс внутри текста') + '">' + escapeHtml(state.answer || '') + '</textarea>'
      + '</div>'
      + '<div class="field">'
      +   '<label>Фото / скриншоты</label>'
      +   imageUploadBlock(state)
      + '</div>';
  }

  function renderModalContent(u, task) {
    const state = getTaskState(u, task);
    const sphere = SPHERES[task.sphere];
    const finalPts = computeFinalPts(u, task);
    const isBuff = finalPts !== task.pts;
    let statusArea = '';

    if (state.status === 'pending') {
      statusArea = ''
        + '<div class="submission-view">'
        + (state.image ? '<img src="' + state.image + '" class="img-preview">' : '')
        + '<p class="lore-text">' + escapeHtml(state.answer || '(без текста)') + '</p></div>'
        + '<p class="status-note pending">Туман изучает твой отчёт... жди решения хранителей.</p>'
        + '<button class="btn btn-ghost" id="btnWithdraw">Отозвать и изменить</button>';
    } else if (state.status === 'approved') {
      statusArea = ''
        + '<div class="submission-view">'
        + (state.image ? '<img src="' + state.image + '" class="img-preview">' : '')
        + '<p class="lore-text">' + escapeHtml(state.answer || '(без текста)') + '</p></div>'
        + '<p class="status-note approved">Задание принято. Получено баллов: <b>' + finalPts + '</b></p>';
    } else if (state.status === 'rejected') {
      statusArea = '<p class="status-note rejected">Отклонено: ' + escapeHtml(state.reason || 'без указания причины') + '</p>'
        + renderEditableForm(state)
        + '<button class="btn btn-primary" id="btnSubmitTask" style="margin-top:14px;">Отправить заново</button>';
    } else {
      statusArea = renderEditableForm(state)
        + '<button class="btn btn-primary" id="btnSubmitTask" style="margin-top:14px;">Отправить в туман</button>';
    }

    $('#taskModalBody').innerHTML = ''
      + '<div class="modal-head"><div class="modal-icon">' + sphere.icon + '</div><div>'
      + '<div class="modal-eyebrow">' + sphere.name + '</div>'
      + '<h3 class="display modal-title">' + escapeHtml(task.name) + '</h3></div></div>'
      + '<p class="lore-text muted modal-req">' + escapeHtml(task.req) + '</p>'
      + '<div class="modal-points">баллы: ' + task.pts + (isBuff ? ' → <b>' + finalPts + '</b> (бафф тумана)' : '') + '</div>'
      + statusArea;

    attachImageZoom($('#taskModalBody'));
    attachImageUploadHandlers(() => {
      const st = getTaskState(u, task);
      st.image = null;
      setTaskState(u, task, st);
      renderModalContent(u, task);
    });

    const submitBtn = $('#btnSubmitTask');
    if (submitBtn) submitBtn.addEventListener('click', () => handleSubmitTask(u, task));
    const withdrawBtn = $('#btnWithdraw');
    if (withdrawBtn) withdrawBtn.addEventListener('click', () => handleWithdraw(u, task));
  }

  function renderDailyModalContent(u, team, daily) {
    const state = getDailyState(team, daily.id);
    const day = getCurrentDay();
    const inWindow = isDailyInWindow(daily, day);
    let statusArea = '';

    if (!inWindow && state.status === 'none') {
      const before = day < daily.dayFrom;
      statusArea = '<p class="window-note closed">'
        + (before
            ? 'Задание откроется в день ' + daily.dayFrom + '. Сейчас день ' + day + '.'
            : 'Время отчёта по этому заданию истекло (дни ' + daily.dayFrom + '–' + daily.dayTo + ').')
        + '</p>';
    } else if (state.status === 'none') {
      statusArea = ''
        + '<p class="window-note active">Открыто для отчёта: дни ' + daily.dayFrom + '–' + daily.dayTo + '. Сейчас день ' + day + '.</p>'
        + '<div class="field">'
        +   '<label>Формат отчёта</label>'
        +   '<select id="modalReportMode">'
        +     '<option value="each">Каждый отчитался отдельно</option>'
        +     '<option value="all">Один собрал все отчёты</option>'
        +   '</select>'
        + '</div>'
        + renderEditableForm(state)
        + '<button class="btn btn-primary" id="btnSubmitDaily" style="margin-top:14px;">Отправить в туман</button>';
    } else if (state.status === 'pending') {
      statusArea = ''
        + '<div class="submission-view">'
        + '<span class="report-mode-tag">' + (state.reportMode === 'all' ? 'один за всех' : 'каждый свой') + '</span>'
        + (state.image ? '<img src="' + state.image + '" class="img-preview">' : '')
        + '<p class="lore-text">' + escapeHtml(state.answer || '(без текста)') + '</p></div>'
        + '<p class="status-note pending">Отчёт изучается хранителями.</p>'
        + (inWindow ? '<button class="btn btn-ghost" id="btnWithdrawDaily">Отозвать и изменить</button>' : '');
    } else if (state.status === 'approved') {
      statusArea = ''
        + '<div class="submission-view">'
        + '<span class="report-mode-tag">' + (state.reportMode === 'all' ? 'один за всех' : 'каждый свой') + '</span>'
        + (state.image ? '<img src="' + state.image + '" class="img-preview">' : '')
        + '<p class="lore-text">' + escapeHtml(state.answer || '(без текста)') + '</p></div>'
        + '<p class="status-note approved">Принято. Каждый участник получил <b>' + daily.pts + '</b> б.</p>';
        } else if (state.status === 'rejected') {
      statusArea = '<p class="status-note rejected">Отклонено: ' + escapeHtml(state.reason || 'без указания причины') + '</p>';
      if (inWindow) {
        statusArea += ''
          + '<div class="field">'
          +   '<label>Формат отчёта</label>'
          +   '<select id="modalReportMode">'
          +     '<option value="each"' + (state.reportMode === 'each' ? ' selected' : '') + '>Каждый отчитался отдельно</option>'
          +     '<option value="all"' + (state.reportMode === 'all' ? ' selected' : '') + '>Один собрал все отчёты</option>'
          +   '</select>'
          + '</div>'
          + renderEditableForm(state)
          + '<button class="btn btn-primary" id="btnSubmitDaily" style="margin-top:14px;">Отправить заново</button>';
      } else {
        statusArea += '<p class="window-note closed">Время отчёта истекло, изменить уже нельзя.</p>';
      }
    }

    $('#taskModalBody').innerHTML = ''
      + '<div class="modal-head"><div class="modal-icon">✦</div><div>'
      + '<div class="modal-eyebrow">командный дейлик · ' + dailyWindowLabel(daily) + '</div>'
      + '<h3 class="display modal-title">' + escapeHtml(daily.name) + '</h3></div></div>'
      + '<p class="lore-text muted modal-req">' + escapeHtml(daily.req) + '</p>'
      + '<div class="modal-points">баллы каждому участнику: ' + daily.pts + ' · отчёт один на команду</div>'
            + statusArea;

    attachImageZoom($('#taskModalBody'));
    attachImageUploadHandlers(() => {
      const st = getDailyState(team, daily.id);
      st.image = null;
      setDailyState(team, daily.id, st);
      renderDailyModalContent(u, team, daily);
    });

    const submitBtn = $('#btnSubmitDaily');
    if (submitBtn) submitBtn.addEventListener('click', () => handleSubmitDaily(u, team, daily));
    const withdrawBtn = $('#btnWithdrawDaily');
    if (withdrawBtn) withdrawBtn.addEventListener('click', () => handleWithdrawDaily(u, team, daily));
  }

  function openTaskModal(u, task) {
    currentModalUser = u;
    currentModalTask = task;
    currentModalDaily = null;
    currentModalTeam = null;
    renderModalContent(u, task);
    $('#taskModalBackdrop').classList.add('open');
    const onKey = (e) => { if (e.key === 'Escape') closeTaskModal(); };
    document.addEventListener('keydown', onKey, { once: true });
  }
  function openDailyModal(u, team, daily) {
    currentModalUser = u;
    currentModalTask = null;
    currentModalDaily = daily;
    currentModalTeam = team;
    renderDailyModalContent(u, team, daily);
    $('#taskModalBackdrop').classList.add('open');
    const onKey = (e) => { if (e.key === 'Escape') closeTaskModal(); };
    document.addEventListener('keydown', onKey, { once: true });
  }
  function closeTaskModal() {
    $('#taskModalBackdrop').classList.remove('open');
    currentModalUser = null;
    currentModalTask = null;
    currentModalDaily = null;
    currentModalTeam = null;
  }

  function readModalAnswer() {
    const el = document.getElementById('modalAnswer');
    return el ? el.value.trim() : '';
  }
  function readModalFile() {
    const el = document.getElementById('modalImage');
    return el && el.files && el.files[0] ? el.files[0] : null;
  }

  function handleSubmitTask(u, task) {
    const answer = readModalAnswer();
    const existing = getTaskState(u, task);
    const file = readModalFile();
    if (!answer && !file && !existing.image) { toast('Добавь описание или фото отчёта'); return; }
    function finalize(imageData) {
      const state = {
        status: 'pending',
        answer: answer,
        image: imageData !== undefined ? imageData : (existing.image || null),
        reason: null,
        submittedBy: u.name,
        submittedAt: Date.now()
      };
      setTaskState(u, task, state);
      toast('Отчёт отправлен в туман...');
      closeTaskModal();
      renderDashboard();
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => finalize(reader.result);
      reader.onerror = () => { toast('Не удалось прочитать файл'); finalize(undefined); };
      reader.readAsDataURL(file);
    } else finalize(undefined);
  }

  function handleSubmitDaily(u, team, daily) {
    const day = getCurrentDay();
    if (!isDailyInWindow(daily, day)) { toast('Задание закрыто'); return; }
    const answer = readModalAnswer();
    const existing = getDailyState(team, daily.id);
    const file = readModalFile();
    const modeEl = document.getElementById('modalReportMode');
    const reportMode = modeEl ? modeEl.value : 'each';
    if (!answer && !file && !existing.image) { toast('Добавь описание или фото отчёта'); return; }
    function finalize(imageData) {
      const state = {
        status: 'pending',
        answer: answer,
        image: imageData !== undefined ? imageData : (existing.image || null),
        reason: null,
        reportMode: reportMode,
        submittedBy: u.name,
        submittedAt: Date.now()
      };
      setDailyState(team, daily.id, state);
      toast('Отчёт отправлен в туман...');
      closeTaskModal();
      renderDashboard();
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => finalize(reader.result);
      reader.onerror = () => { toast('Не удалось прочитать файл'); finalize(undefined); };
      reader.readAsDataURL(file);
    } else finalize(undefined);
  }

  function handleWithdraw(u, task) {
    const state = getTaskState(u, task);
    state.status = 'none';
    setTaskState(u, task, state);
    renderModalContent(u, task);
    renderDashboard();
  }
  function handleWithdrawDaily(u, team, daily) {
    const state = getDailyState(team, daily.id);
    state.status = 'none';
    setDailyState(team, daily.id, state);
    renderDailyModalContent(u, team, daily);
    renderDashboard();
  }

  function collectSubmissions() {
    const out = [];
    ALL_TASKS.forEach(task => {
      Object.keys(progress).forEach(uid => {
        const st = progress[uid] && progress[uid][task.id];
        if (st && st.status !== 'none') {
          const uu = users[uid];
          out.push({
            kind: 'task',
            task: task,
            state: st,
            ownerId: uid,
            label: (uu ? uu.name : '?') + ' (ID ' + uid + ')'
          });
        }
      });
    });

    Object.keys(teams).forEach(teamId => {
      const team = teams[teamId];
      if (!team.dailies) return;
      TEAM_DAILIES.forEach(d => {
        const st = team.dailies[d.id];
        if (st && st.status && st.status !== 'none') {
          const names = team.members.map(mid => users[mid] ? users[mid].name : '?').join(', ');
          out.push({
            kind: 'daily',
            daily: d,
            state: st,
            teamId: teamId,
            label: 'Команда No' + teamId.split('-')[1] + ' · ' + d.name + ' (' + names + ')'
          });
        }
      });
    });

    out.sort((a, b) => (b.state.submittedAt || 0) - (a.state.submittedAt || 0));
    return out;
  }

  let adminFilter = 'pending';

  function renderAdminList() {
    const list = $('#adminList');
    if (!list) return;
    list.innerHTML = '';
    const subs = collectSubmissions().filter(s => adminFilter === 'all' ? true : s.state.status === adminFilter);
    if (!subs.length) { list.innerHTML = '<p class="empty-hint">Здесь пока пусто.</p>'; return; }
    subs.forEach(s => {
      const entry = document.createElement('div');
      entry.className = 'admin-entry';
      let actionsHtml;
      if (s.state.status === 'pending') {
        actionsHtml = '<div class="admin-entry-actions"><button class="btn-approve" data-act="approve">Принять</button><button class="btn-reject" data-act="reject">Отклонить</button></div>';
      } else {
        const tag = { approved: 'принято', rejected: 'отклонено' }[s.state.status] || '';
        actionsHtml = '<span class="admin-decided-tag ' + s.state.status + '">' + tag + '</span>';
      }

      let taskLine = '';
      if (s.kind === 'task') {
        const sphere = SPHERES[s.task.sphere];
        taskLine = sphere.icon + ' ' + escapeHtml(s.task.name) + ' · ур.' + (s.task.level + 1) + ' · ' + s.task.pts + ' б.';
      } else {
        taskLine = '✦ ' + escapeHtml(s.daily.name) + ' · командный · ' + s.daily.pts + ' б. · ' + (s.state.reportMode === 'all' ? 'один за всех' : 'каждый свой');
      }

      entry.innerHTML = ''
        + '<div class="admin-entry-top"><div class="admin-entry-who">' + escapeHtml(s.label) + '</div>'
        + '<div class="admin-entry-task mono">' + taskLine + '</div></div>'
        + '<div class="admin-entry-body">'
        + (s.state.image ? '<img src="' + s.state.image + '" class="img-preview">' : '')
        + (s.state.answer ? escapeHtml(s.state.answer) : '<i>без текста</i>')
        + '</div>'
        + (s.state.status === 'rejected' ? '<div class="status-note rejected">Причина: ' + escapeHtml(s.state.reason || '—') + '</div>' : '')
        + actionsHtml;
      const approveBtn = entry.querySelector('[data-act="approve"]');
      const rejectBtn = entry.querySelector('[data-act="reject"]');
      if (approveBtn) approveBtn.addEventListener('click', () => adminDecide(s, 'approved'));
      if (rejectBtn) rejectBtn.addEventListener('click', () => adminDecide(s, 'rejected'));
      list.appendChild(entry);
    });
    attachImageZoom(list);
  }

  let pendingRejectSubmission = null;

  function openRejectModal(s) {
    pendingRejectSubmission = s;
    const subtitle = $('#rejectSubtitle');
    if (subtitle) {
      const taskName = s.kind === 'task' ? s.task.name : s.daily.name;
      subtitle.textContent = s.label + ' · ' + taskName;
    }
    const input = $('#rejectReasonInput');
    if (input) input.value = '';
    $('#rejectBackdrop').classList.add('open');
    setTimeout(() => { if (input) input.focus(); }, 60);
  }

  function closeRejectModal() {
    pendingRejectSubmission = null;
    $('#rejectBackdrop').classList.remove('open');
  }

  function confirmReject() {
    const s = pendingRejectSubmission;
    if (!s) return;
    const input = $('#rejectReasonInput');
    let reason = input ? input.value.trim() : '';
    if (!reason) reason = 'Уточни отчёт и отправь снова.';

    s.state.status = 'rejected';
    s.state.reason = reason;
    s.state.decidedAt = Date.now();

    if (s.kind === 'task') {
      progress[s.ownerId][s.task.id] = s.state;
      saveProgress();
    } else {
      const team = teams[s.teamId];
      if (team) {
        if (!team.dailies) team.dailies = {};
        team.dailies[s.daily.id] = s.state;
        saveTeams();
      }
    }

    toast('Отклонено');
    closeRejectModal();
    renderAdminList();
    renderDashboard();
  }

  function adminDecide(s, decision) {
    if (decision === 'rejected') {
      openRejectModal(s);
      return;
    }

    s.state.status = 'approved';
    s.state.reason = null;
    s.state.decidedAt = Date.now();

    if (s.kind === 'task') {
      progress[s.ownerId][s.task.id] = s.state;
      saveProgress();
    } else {
      const team = teams[s.teamId];
      if (!team) return;
      if (!team.dailies) team.dailies = {};
      team.dailies[s.daily.id] = s.state;
      saveTeams();
    }

    toast('Принято');
    renderAdminList();
    renderDashboard();
  }

  function bindRejectModal() {
    const closeBtn = $('#rejectCloseBtn');
    const cancelBtn = $('#rejectCancelBtn');
    const confirmBtn = $('#rejectConfirmBtn');
    const backdrop = $('#rejectBackdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeRejectModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeRejectModal);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmReject);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target.id === 'rejectBackdrop') closeRejectModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
        closeRejectModal();
      }
    });
  }

  function renderTeamPanel(u) {
    const wrap = $('#teamPanelWrap');
    if (!wrap) return;

    const team = u.teamId ? teams[u.teamId] : null;

    if (!team) {
      wrap.innerHTML = '<div class="stub-block">Ты пока не в команде.</div>';
      return;
    }

    const day = getCurrentDay();
    const members = team.members;
    const personalSum = members.reduce((s, mid) => s + (users[mid] ? personalScore(users[mid]) : 0), 0);
    const total = personalSum;

    let membersHTML = '';
    members.forEach(mid => {
      const m = users[mid];
      const isMe = mid === u.id;
      membersHTML += '<div class="team-member-chip' + (isMe ? ' me' : '') + '">'
        + '<span>' + escapeHtml(m ? m.name : '?') + (isMe ? ' · ты' : '') + '</span>'
        + '<span class="mono">' + (m ? personalScore(m) : 0) + '</span>'
        + '</div>';
    });

    for (let i = members.length; i < team.size; i++) {
      membersHTML += '<div class="team-member-chip empty">свободное место</div>';
    }

    let dailiesHTML = '';
    TEAM_DAILIES.forEach(d => {
      const st = getDailyState(team, d.id);
      const inWindow = isDailyInWindow(d, day);
      const before = day < d.dayFrom;
      const after = day > d.dayTo;

      let cardClass = 'daily-card';
      let statusLabel = '';
      let clickable = false;

      if (st.status === 'pending') {
        cardClass += ' state-pending';
        statusLabel = 'на проверке';
        clickable = inWindow;
      } else if (st.status === 'approved') {
        cardClass += ' state-approved';
        statusLabel = 'принято';
        clickable = true;
      } else if (st.status === 'rejected') {
        cardClass += ' state-rejected';
        statusLabel = 'отклонено';
        clickable = inWindow;
      } else {
        if (inWindow) {
          cardClass += ' state-active';
          statusLabel = 'открыто · сейчас';
          clickable = true;
        } else if (before) {
          cardClass += ' state-closed';
          statusLabel = 'ещё не открыто';
        } else if (after) {
          cardClass += ' state-closed';
          statusLabel = 'время истекло';
        }
      }

      if (clickable) cardClass += ' clickable';

      dailiesHTML += ''
        + '<div class="' + cardClass + '" data-daily="' + d.id + '">'
        +   '<div class="daily-head">'
        +     '<div class="daily-name">' + escapeHtml(d.name) + '</div>'
        +     '<div class="daily-window">' + dailyWindowLabel(d) + '</div>'
        +   '</div>'
        +   '<div class="daily-req">' + escapeHtml(d.req) + '</div>'
        +   '<div class="daily-bottom">'
        +     '<span class="daily-pts">+' + d.pts + ' б. каждому</span>'
        +     '<span class="daily-status">' + statusLabel + '</span>'
        +   '</div>'
        + '</div>';
    });

    wrap.innerHTML = ''
      + '<div class="team-panel">'
      +   '<div class="team-panel-title">'
      +     '<span>Команда No' + team.id.split('-')[1] + ' · день ' + day + '</span>'
      +     '<span class="mono team-pool">общее кол-во баллов: ' + round1(total) + '</span>'
      +   '</div>'
      +   '<div class="team-members">' + membersHTML + '</div>'

      +   '<h3 class="dailies-title">Командные задания</h3>'
      +   '<p class="dailies-hint">Три командных задания. Каждое открыто два дня: дни 1–2, 3–4, 5–6. Отчёт один на команду, но при принятии баллы получает каждый участник.</p>'
      +   '<div class="dailies-list">' + dailiesHTML + '</div>'

     +   '<p class="hint-small" style="margin-top:20px;">Общее количество баллов команды — сумма личных баллов всех участников, включая баллы за принятые дейлики.</p>'
      + '</div>';

    wrap.querySelectorAll('[data-daily]').forEach(card => {
      const dId = card.dataset.daily;
      const daily = TEAM_DAILIES.find(x => x.id === dId);
      if (!daily) return;
      card.addEventListener('click', () => {
        const st = getDailyState(team, dId);
        const inWindow = isDailyInWindow(daily, day);
        if (st.status === 'none' && !inWindow) {
          if (day < daily.dayFrom) toast('Откроется в день ' + daily.dayFrom);
          else toast('Время отчёта по этому заданию истекло');
          return;
        }
        openDailyModal(u, team, daily);
      });
    });
  }

  function renderDashboard() {
    const u = currentUser();
    if (!u) return;
    const path = PATHS[u.path];
    if (!path) return;
    const day = getCurrentDay();
    $('#dashName').textContent = u.name;
    $('#dayNum').textContent = day;
    $('#chipPath').textContent = 'Путь: ' + path.name;
    $('#chipBuff').textContent = 'Бафф: +' + Math.round((BUFF_MULT - 1) * 100) + '% · ' + SPHERES[path.buffSphere].name;
    $('#chipAdmin').style.display = u.isAdmin ? 'inline-block' : 'none';
    $('#personalScore').textContent = personalScore(u);
    const total = ALL_TASKS.length;
    const done = ALL_TASKS.filter(t => getTaskState(u, t).status === 'approved').length;
    $('#levelPoints').textContent = done + ' / ' + total;
    $('#levelFill').style.width = (total ? Math.min(100, (done / total) * 100) : 0) + '%';
    renderTaskTree(u);
    renderTeamPanel(u);
    const modBtn = $('#modTabBtn');
    if (u.isAdmin) {
      modBtn.style.display = 'block';
      if (modBtn.classList.contains('active')) renderAdminList();
    } else {
      if (modBtn.classList.contains('active')) {
        modBtn.classList.remove('active');
        $('#tabview-mod').classList.remove('active');
        $all('.view-tab')[0].classList.add('active');
        $('#tabview-tasks').classList.add('active');
      }
      modBtn.style.display = 'none';
    }
  }

  let visionStep = 0, lastLetter = null;
  let testTally = { likotvorcy: 0, ratniki: 0, kudesniki: 0 };

  function currentVision() {
    const step = VISIONS[visionStep];
    if (visionStep === 0) return { text: step.text, options: step.options };
    const branch = step.branches[lastLetter];
    return { text: (step.intro ? step.intro + ' ' : '') + branch.text, options: branch.options };
  }

  function renderQuestion() {
    const vision = currentVision();
    $('#testStep').textContent = (visionStep + 1) + ' / ' + VISIONS.length;
    $('#testFill').style.width = Math.round((visionStep / VISIONS.length) * 100) + '%';
    $('#questionText').textContent = vision.text;
    const wrap = $('#optionList');
    wrap.innerHTML = '';
    vision.options.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'option-item';
      div.textContent = opt.t;
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');
      const choose = () => {
        testTally[opt.p]++;
        lastLetter = opt.letter;
        visionStep++;
        if (visionStep < VISIONS.length) renderQuestion();
        else { $('#testFill').style.width = '100%'; finishTest(); }
      };
      div.addEventListener('click', choose);
      div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
      wrap.appendChild(div);
    });
  }

  let storyQueue = [], storyIndex = 0, storyOnComplete = null;

  function renderStoryItem(item) {
    $('#storyEyebrow').textContent = item.eyebrow || 'Туман расступается';
    $('#storyText').textContent = item.text;
    $('#storyText').classList.toggle('emphasis', !!item.emphasis);
    $('#storyText').classList.toggle('reveal', !!item.icon);
    const iconEl = $('#storyIcon');
    if (item.icon) { iconEl.innerHTML = item.icon; iconEl.classList.add('show'); }
    else { iconEl.textContent = ''; iconEl.classList.remove('show'); }
  }
  function playStory(items, onComplete) {
    storyQueue = items; storyIndex = 0; storyOnComplete = onComplete;
    renderStoryItem(storyQueue[0]);
    showScreen('screen-story');
  }

  function finishTest() {
    let best = 'likotvorcy', bestVal = -1;
    Object.keys(testTally).forEach(k => { if (testTally[k] > bestVal) { bestVal = testTally[k]; best = k; } });
    const u = currentUser();
    u.path = best;
    saveUsers();
    const fullStory = WAKE_STORY.concat(ITOG_INTRO_STORY).concat([{ eyebrow: 'Кем ты стал', text: PATH_RESULTS[best] }]);
    playStory(fullStory, () => goToResultScreen());
  }

  function goToResultScreen() {
    const u = currentUser();
    const path = PATHS[u.path];
    const buff = SPHERES[path.buffSphere];
    $('#resultIcon').innerHTML = path.icon;
    $('#resultPathName').textContent = path.name;
    $('#resultBuffText').textContent = 'Туман даёт бафф +' + Math.round((BUFF_MULT - 1) * 100) + '% к баллам за задания «' + buff.name + '»';
    $('#resultLore').textContent = path.lore;
    showScreen('screen-result');
  }

  function routeAfterLogin() {
    const u = currentUser();
    if (!u) return;
    if (u.path) { showScreen('screen-dashboard'); renderDashboard(); }
    else { $('#greetName').textContent = 'Туман знает тебя, ' + u.name; showScreen('screen-test-intro'); }
  }

  function doLogout() {
    session.userId = null;
    localStorage.removeItem(LS_SESSION);
    $('#inputName').value = '';
    $('#inputId').value = '';
    showScreen('screen-auth');
  }

  function bindAuth() {
    $('#btnStartAuth').addEventListener('click', () => {
      const name = $('#inputName').value.trim();
      const id = $('#inputId').value.trim();
      const err = $('#authErr');
      const isAdminCode = (id === ADMIN_CODE);
      if (!id || (!name && !isAdminCode)) { err.classList.add('show'); return; }
      err.classList.remove('show');
      const finalName = name || 'Хранитель тумана';
      let u = users[id];
      const isNew = !u;
      if (u) u.name = finalName;
      else { u = { id: id, name: finalName, path: null, teamId: null }; users[id] = u; }
      if (isAdminCode) u.isAdmin = true;
      session.userId = id;
      localStorage.setItem(LS_SESSION, id);
      saveUsers();
      if (isAdminCode) {
        if (!u.path) u.path = 'kudesniki';
        showScreen('screen-dashboard');
        renderDashboard();
        return;
      }
      if (isNew) registerInTeamOrder(id);
      routeAfterLogin();
    });
    $('#btnLogout').addEventListener('click', doLogout);
    $('#btnDayMinus').addEventListener('click', () => { bumpDevDay(-1); renderDashboard(); });
    $('#btnDayPlus').addEventListener('click', () => { bumpDevDay(1); renderDashboard(); });
  }

  let cursorTrailTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - cursorTrailTime < 15) return;
    cursorTrailTime = now;
    const dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;'
      + 'left:' + e.clientX + 'px;top:' + e.clientY + 'px;'
      + 'width:5px;height:5px;background:var(--gold);border-radius:50%;'
      + 'box-shadow:0 0 12px 3px rgba(194,168,120,0.8);opacity:1;'
      + 'transform:translate(-50%,-50%) scale(1);'
      + 'transition:opacity .6s ease-out, transform .6s ease-out;';
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%,-50%) scale(.1)';
    });
    setTimeout(() => dot.remove(), 600);
  });

  function bindVision() {
    $('#btnStartTest').addEventListener('click', () => {
      visionStep = 0; lastLetter = null;
      testTally = { likotvorcy: 0, ratniki: 0, kudesniki: 0 };
      renderQuestion();
      showScreen('screen-test');
    });
    $('#storyCard').addEventListener('click', () => {
      storyIndex++;
      if (storyIndex < storyQueue.length) renderStoryItem(storyQueue[storyIndex]);
      else { const cb = storyOnComplete; storyOnComplete = null; if (cb) cb(); }
    });
    $('#btnContinueFromResult').addEventListener('click', () => showScreen('screen-final'));
    $('#btnLeaveVision').addEventListener('click', () => { showScreen('screen-dashboard'); renderDashboard(); });
  }

  function bindTabs() {
    $all('.view-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $all('.view-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $all('.tabview').forEach(v => v.classList.remove('active'));
        $('#tabview-' + tab.dataset.tab).classList.add('active');

        const u = currentUser();
        document.body.classList.toggle('tasks-tab-active', tab.dataset.tab === 'tasks');

        if (tab.dataset.tab === 'mod') renderAdminList();
        if (tab.dataset.tab === 'tasks' && u) renderTaskTree(u);
        if (tab.dataset.tab === 'team' && u) renderTeamPanel(u);
      });
    });
  }

  function bindAdmin() {
    $all('.admin-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        adminFilter = btn.dataset.filter;
        $all('.admin-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAdminList();
      });
    });
  }

  function bindModal() {
    $('#modalCloseBtn').addEventListener('click', closeTaskModal);
    $('#taskModalBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'taskModalBackdrop') closeTaskModal();
    });
  }

  function init() {
    rebuildAllTasks();
    seedDemo();
    bindAuth();
    bindVision();
    bindTabs();
    bindAdmin();
    bindModal();
    bindRejectModal();

    updateToggleDoneBtn();
    updateShuffleBtn();

    const btnShuffle = $('#btnShuffle');
    if (btnShuffle) {
      btnShuffle.addEventListener('click', shuffleTree);
    }

    const btnToggle = $('#btnToggleDone');
    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        showCompleted = !showCompleted;
        updateToggleDoneBtn();
        const u = currentUser();
        if (u) renderTaskTree(u);
      });
    }

    const ivClose = $('#imageViewerClose');
    if (ivClose) ivClose.addEventListener('click', closeImageViewer);
    const iv = $('#imageViewer');
    if (iv) {
      iv.addEventListener('click', (e) => {
        if (e.target.id === 'imageViewer') closeImageViewer();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeImageViewer();
    });

    if (session.userId && users[session.userId]) {
      const u = users[session.userId];
      $('#inputName').value = u.name;
      $('#inputId').value = u.id;
      routeAfterLogin();
    }
  }

  init();
})();
