(function () {
  'use strict';

  const sb = window.sb;
  const BUFF_MULT = 1.2;
  const TEAM_SIZE = 4;
  const ADMIN_CODE = '1707227';
  const MAX_SHUFFLES = 3;
  const BUCKET = 'reports';

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
    ratniki:    'Туман оставил тебе след.\n\nТы не стал ждать, пока опасность сама найдёт тебя.\n\nТы — Ратник.',
    kudesniki:  'Туман оставил тебе голос.\n\nТы не стал довольствоваться тем, что увидел.\n\nТы — Кудесник.'
  };

  const VISIONS = [
    { text: 'Ты выходишь с Поляны для сна и видишь, что туман добрался до Камышовой поляны.',
      options: [
        { letter:'а', t:'Остаёшься у камышей и смотришь на очертания в дымке.', p:'likotvorcy' },
        { letter:'б', t:'Сразу идёшь в туман искать патрульных.', p:'ratniki' },
        { letter:'в', t:'Изучаешь следы у края поляны.', p:'kudesniki' }
      ] },
    { branches: {
        'а': { text: 'Ты возвращаешься к Поляне для сна. У Старого вяза непривычно тихо.',
          options: [
            { letter:'а', t:'Проходишь мимо, но замечаешь странное сочетание ветвей и теней.', p:'likotvorcy' },
            { letter:'б', t:'Идёшь к Старому вязу.', p:'ratniki' },
            { letter:'в', t:'Осматриваешь землю вокруг вяза.', p:'kudesniki' }
          ] },
        'б': { text: 'Ты выходишь на Мшистую полянку. Патрульных здесь тоже нет.',
          options: [
            { letter:'а', t:'Рассматриваешь оставленные вещи.', p:'likotvorcy' },
            { letter:'б', t:'Идёшь дальше, выкрикивая имена.', p:'ratniki' },
            { letter:'в', t:'Изучаешь следы.', p:'kudesniki' }
          ] },
        'в': { text: 'Следы приводят тебя к краю Камышовой поляны. В тумане появляется силуэт.',
          options: [
            { letter:'а', t:'Отходишь в камыши.', p:'likotvorcy' },
            { letter:'б', t:'Подходишь к силуэту.', p:'ratniki' },
            { letter:'в', t:'Следишь за силуэтом.', p:'kudesniki' }
          ] }
    } },
    { branches: {
        'а': { text: 'Ты выходишь к Пещере с травами. У входа никого нет.',
          options: [
            { letter:'а', t:'Замечаешь тени растений на камне.', p:'likotvorcy' },
            { letter:'б', t:'Заходишь внутрь.', p:'ratniki' },
            { letter:'в', t:'Осматриваешь землю у входа.', p:'kudesniki' }
          ] },
        'б': { text: 'Ты подходишь к Палатке предводителя. Рядом нет ни одного стражника.',
          options: [
            { letter:'а', t:'Замечаешь царапины на камне.', p:'likotvorcy' },
            { letter:'б', t:'Входишь внутрь.', p:'ratniki' },
            { letter:'в', t:'Изучаешь обстановку у входа.', p:'kudesniki' }
          ] },
        'в': { text: 'Ты подходишь к Дальнему уголку. Здесь пусто.',
          options: [
            { letter:'а', t:'Рассматриваешь следы.', p:'likotvorcy' },
            { letter:'б', t:'Идёшь искать участников собрания.', p:'ratniki' },
            { letter:'в', t:'Осматриваешь место собрания.', p:'kudesniki' }
          ] }
    } },
    { intro: 'Туман начинает рассеиваться. Впереди показывается Тенистая поляна. Наконец все взгляды обращаются к тебе.',
      branches: {
        'а': { text: 'Ты всю ночь замечал странные вещи.',
          options: [
            { letter:'а', t:'Предлагаешь зарисовать всё необычное.', p:'likotvorcy' },
            { letter:'б', t:'Предлагаешь отправить поисковую группу.', p:'ratniki' },
            { letter:'в', t:'Предлагаешь сопоставить свидетельства.', p:'kudesniki' }
          ] },
        'б': { text: 'Ты всю ночь искал пропавших.',
          options: [
            { letter:'а', t:'Предлагаешь зарисовать силуэт.', p:'likotvorcy' },
            { letter:'б', t:'Требуешь идти к Галечному берегу.', p:'ratniki' },
            { letter:'в', t:'Предлагаешь расспросить свидетелей.', p:'kudesniki' }
          ] },
        'в': { text: 'Ты всю ночь собирал сведения.',
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

  // Заглушки. Когда появятся настоящие тексты — просто замени массив.
  const PREDICTIONS = Array.from({ length: 40 }, (_, i) => 'Предсказание ' + (i + 1));

  const TASKS_BY_LEVEL = [
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
        { id:'l3-sl-2', name:'задание24', req:'текст', pts:5, sphere:'slovo' },
        {
          id: 'l3-in-1',
          name: 'Загадки тумана',
          req: 'Разгадай пять загадок и собери слово из букв.',
          pts: 15,
          sphere: 'slovo',
          type: 'riddle',
          riddles: [
            { q: 'Появляется, когда есть свет, и пропадает, когда его нет. Весь день идёт за тобой, а ночью пропадает.', answer: 'тень',   letter: 'Т' },
            { q: 'Не совсем кот и не совсем рыба, а хвост будто из чешуи. Одни клянутся, что с ним можно поговорить, другие видели только тень на воде.', answer: 'утопец', letter: 'У' },
            { q: 'Лепят из глины, сушат у огня, потом разрисовывают. Носят не для красоты, а чтобы нечисть прошла мимо.', answer: 'маска',  letter: 'М' },
            { q: 'Носят в зубах и прячут от чужих. Считается, что пока она с тобой, ты не один.', answer: 'амулет', letter: 'А' },
            { q: 'Наступает, когда прячется солнце, и уходит с первым лучом.', answer: 'ночь', letter: 'Н' }
          ],
          finalWord: 'ТУМАН'
        }
      ]
    }
  ];

  let users = {};
  let teams = {};
  let progress = {};
  let regOrder = [];
  let userPredictions = {};
  let eventSettings = {
    event_start: Date.now(),
    dev_offset: 0,
    shuffles: 0,
    task_order: null
  };
  let session = { userId: localStorage.getItem('tuman_session') || null };
  let dataReady = false;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }
  function round1(n) { return Math.round(n * 10) / 10; }
  function norm(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9]/g, '');
  }

    function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }
  function round1(n) { return Math.round(n * 10) / 10; }
  function norm(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9]/g, '');
  }

  async function hashPin(pin) {
    const text = 'tuman::' + pin;
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // fallback на случай file:// или старого браузера
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i++) {
      const ch = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h2 = Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
  }

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

  async function loadAllFromSupabase() {
    if (!sb) throw new Error('Supabase не сконфигурирован');
    await sb.auth.signInAnonymously().catch(() => {});

    const [uRes, tRes, pRes, rRes, sRes, prRes] = await Promise.all([
      sb.from('users').select('*'),
      sb.from('teams').select('*'),
      sb.from('progress').select('*'),
      sb.from('reg_order').select('*').order('position', { ascending: true }),
      sb.from('event_settings').select('*').eq('id', 1).maybeSingle(),
      sb.from('user_predictions').select('*')
    ]);

    users = Object.fromEntries((uRes.data || []).map(r => [r.id, {
      id: r.id, name: r.name, path: r.path,
      teamId: r.team_id, isAdmin: !!r.is_admin,
      frozen: !!r.frozen, approved: !!r.approved,
      pinHash: r.pin_hash || null
    }]));

    teams = Object.fromEntries((tRes.data || []).map(r => [r.id, {
      id: r.id, size: r.size || TEAM_SIZE,
      members: Array.isArray(r.members) ? r.members.slice() : [],
      dailies: r.dailies || {}
    }]));

    regOrder = (rRes.data || []).map(r => r.user_id);

    progress = {};
    (pRes.data || []).forEach(row => {
      (progress[row.user_id] = progress[row.user_id] || {})[row.task_id] = {
        status: row.status,
        answer: row.answer,
        image: row.image,
        reason: row.reason,
        submittedBy: row.submitted_by,
        submittedAt: row.submitted_at,
        decidedAt: row.decided_at
      };
    });

    userPredictions = {};
    (prRes.data || []).forEach(row => {
      (userPredictions[row.user_id] = userPredictions[row.user_id] || []).push({
        idx: row.prediction_idx, day: row.day,
        drawnAt: new Date(row.drawn_at).getTime(), dbId: row.id
      });
    });

    if (sRes.data) {
      eventSettings = {
        event_start: Number(sRes.data.event_start) || Date.now(),
        dev_offset:  sRes.data.dev_offset || 0,
        shuffles:    sRes.data.shuffles || 0,
        task_order:  sRes.data.task_order || null
      };
    } else {
      await sb.from('event_settings').upsert({
        id: 1, event_start: Date.now(), dev_offset: 0, shuffles: 0, task_order: null
      });
    }

    Object.keys(users).forEach(uid => {
      const u = users[uid];
      const found = Object.values(teams).find(t => t.members.indexOf(uid) !== -1);
      u.teamId = found ? found.id : null;
    });

    dataReady = true;
  }

  async function upsertUser(u) {
    users[u.id] = u;
    const { error } = await sb.from('users').upsert({
      id: u.id, name: u.name, path: u.path,
      team_id: u.teamId || null,
      is_admin: !!u.isAdmin,
      frozen: !!u.frozen,
      approved: u.approved !== false,
      pin_hash: u.pinHash || null
    });
    if (error) console.error('upsertUser', error);
  }

  async function upsertUsersBulk(list) {
    if (!list.length) return;
    const { error } = await sb.from('users').upsert(list.map(u => ({
      id: u.id, name: u.name, path: u.path,
      team_id: u.teamId || null,
      is_admin: !!u.isAdmin,
      frozen: !!u.frozen,
      approved: u.approved !== false,
      pin_hash: u.pinHash || null
    })));
    if (error) console.error('upsertUsersBulk', error);
  }

  async function upsertTeam(team) {
    teams[team.id] = team;
    const { error } = await sb.from('teams').upsert({
      id: team.id, size: team.size,
      members: team.members || [],
      dailies: team.dailies || {}
    });
    if (error) console.error('upsertTeam', error);
  }

  async function saveTaskState(uid, taskId, state) {
    progress[uid] = progress[uid] || {};
    progress[uid][taskId] = state;
    const { error } = await sb.from('progress').upsert({
      user_id: uid, task_id: taskId,
      status: state.status,
      answer: state.answer || null,
      image: state.image || null,
      reason: state.reason || null,
      submitted_by: state.submittedBy || null,
      submitted_at: state.submittedAt || null,
      decided_at: state.decidedAt || null,
      updated_at: new Date().toISOString()
    });
    if (error) console.error('saveTaskState', error);
  }

  async function saveSettings() {
    const { error } = await sb.from('event_settings').upsert({
      id: 1,
      event_start: eventSettings.event_start,
      dev_offset:  eventSettings.dev_offset,
      shuffles:    eventSettings.shuffles,
      task_order:  eventSettings.task_order
    });
    if (error) console.error('saveSettings', error);
  }

  async function uploadReportImage(file) {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600', upsert: false
    });
    if (error) throw error;
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function savePredictionDraw(uid, idx, day) {
    userPredictions[uid] = userPredictions[uid] || [];
    userPredictions[uid].push({ idx, day, drawnAt: Date.now() });
    const { error } = await sb.from('user_predictions').insert({
      user_id: uid, prediction_idx: idx, day
    });
    if (error && error.code !== '23505') console.error('savePredictionDraw', error);
  }

  async function autoPlaceInTeam(uid) {
    const user = users[uid];
    if (!user || user.frozen || !user.approved) return;
    let target = Object.values(teams).find(t => t.members.length < TEAM_SIZE);
    if (target) {
      if (target.members.indexOf(uid) === -1) {
        target.members.push(uid);
        user.teamId = target.id;
        await upsertTeam(target);
        await upsertUser(user);
      }
    } else {
      let maxIdx = 0;
      Object.keys(teams).forEach(tid => {
        const n = parseInt(tid.split('-')[1], 10) || 0;
        if (n > maxIdx) maxIdx = n;
      });
      const newId = 'team-' + (maxIdx + 1);
      const newTeam = { id: newId, size: TEAM_SIZE, members: [uid], dailies: {} };
      user.teamId = newId;
      await upsertTeam(newTeam);
      await upsertUser(user);
    }
  }

  let ALL_TASKS = [];
  let TASK_ORDER = [];
  let TASK_DEPENDS = {};
  const depthCache = {};
  let showCompleted = true;

  const MOBILE_ITEM = 78;
  const GAP_X = 24;
  const GAP_Y = 54;
  const BAND_GAP = 82;
  const TASK_ORDER_SEED = 170717;

  function hashStr(s) { let h = 0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i))|0; return Math.abs(h); }
  function jitter(seed, range) { return ((hashStr(seed) % 1000) / 1000 - 0.5) * 2 * range; }
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
    for (let i=a.length-1;i>0;i--) {
      const j = Math.floor(rng()*(i+1));
      const tmp = a[i]; a[i]=a[j]; a[j]=tmp;
    }
    return a;
  }

  function rebuildAllTasks() {
    ALL_TASKS = [];
    TASKS_BY_LEVEL.forEach((level, levelIdx) => {
      Object.keys(SPHERES).forEach(sk => {
        (level[sk]||[]).forEach(t => ALL_TASKS.push(Object.assign({}, t, { level: levelIdx })));
      });
    });
    rebuildTaskDepends();
  }

  function applyOrder(orderIds) {
    TASK_ORDER = orderIds.slice();
    TASK_DEPENDS = {};
    TASK_ORDER.forEach((id, i) => {
      if (i === 0) TASK_DEPENDS[id] = null;
      else TASK_DEPENDS[id] = { any: [TASK_ORDER[Math.floor((i - 1) / 2)]] };
    });
    Object.keys(depthCache).forEach(k => delete depthCache[k]);
  }

  function rebuildTaskDepends() {
    const saved = eventSettings.task_order;
    if (Array.isArray(saved) && saved.length === ALL_TASKS.length) {
      const ids = ALL_TASKS.map(t => t.id).sort().join(',');
      const savedIds = saved.slice().sort().join(',');
      if (ids === savedIds) {
        applyOrder(saved);
        positionRiddle();
        return;
      }
    }
    const rng = mulberry32(TASK_ORDER_SEED);
    const byPts = {};
    ALL_TASKS.forEach(t => { (byPts[t.pts] = byPts[t.pts] || []).push(t.id); });
    const ptsKeys = Object.keys(byPts).map(Number).sort((a,b)=>a-b);
    let order = [];
    ptsKeys.forEach(p => { order = order.concat(shuffleArr(byPts[p], rng)); });
    applyOrder(order);
    positionRiddle();
  }

  // Загадка всегда привязана к первому корневому заданию, чтобы не висеть в воздухе.
  function positionRiddle() {
    const riddle = ALL_TASKS.find(t => t.type === 'riddle');
    if (!riddle) return;
    const rootId = TASK_ORDER[0];
    if (!rootId || rootId === riddle.id) {
      TASK_DEPENDS[riddle.id] = null;
    } else {
      TASK_DEPENDS[riddle.id] = { any: [rootId] };
    }
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
    return (progress[u.id] && progress[u.id][task.id]) || { status: 'none' };
  }

  function isTaskUnlockedByDeps(u, task) {
    if (getTaskState(u, task).status !== 'none') return true;
    const dep = TASK_DEPENDS[task.id];
    if (!dep) return true;
    const ids = dep.any || dep.all || [];
    if (!ids.length) return true;
    const check = tid => {
      const t = ALL_TASKS.find(x => x.id === tid);
      if (!t) return false;
      const st = getTaskState(u, t).status;
      return st === 'approved' || st === 'pending';
    };
    return dep.all ? ids.every(check) : ids.some(check);
  }

  function computeFinalPts(u, task) {
    const path = u.path && PATHS[u.path];
    const isBuff = path && path.buffSphere === task.sphere;
    return isBuff ? round1(task.pts * BUFF_MULT) : task.pts;
  }

  function getDailyState(team, dailyId) {
    if (!team || !team.dailies) return { status: 'none' };
    return team.dailies[dailyId] || { status: 'none' };
  }

  function teamDailyBonusFor(u) {
    if (!u || !u.teamId) return 0;
    const team = teams[u.teamId];
    if (!team) return 0;
    let sum = 0;
    TEAM_DAILIES.forEach(d => {
      if (getDailyState(team, d.id).status === 'approved') sum += d.pts;
    });
    return sum;
  }

  function personalScore(u) {
    if (!u) return 0;
    let sum = 0;
    ALL_TASKS.forEach(t => {
      if (getTaskState(u, t).status === 'approved') sum += computeFinalPts(u, t);
    });
    sum += teamDailyBonusFor(u);
    return round1(sum);
  }

  function isDailyInWindow(daily, day) { return day >= daily.dayFrom && day <= daily.dayTo; }
  function dailyWindowLabel(daily) { return 'дни ' + daily.dayFrom + '–' + daily.dayTo; }

  function getCurrentDay() {
    const start = eventSettings.event_start || Date.now();
    const offset = eventSettings.dev_offset || 0;
    const realDay = Math.floor((Date.now() - start) / 86400000) + 1;
    return Math.max(1, realDay + offset);
  }

  function bumpDevDay(delta) {
    const cur = eventSettings.dev_offset || 0;
    const realDay = Math.floor((Date.now() - (eventSettings.event_start || Date.now())) / 86400000) + 1;
    const proposed = cur + delta;
    if (realDay + proposed < 1) return;
    eventSettings.dev_offset = proposed;
    saveSettings();
  }

  function currentUser() {
    return session.userId ? users[session.userId] : null;
  }

  function routeAfterLogin() {
    const u = currentUser();
    if (!u) return;
    if (!u.approved && !u.isAdmin) {
      $('#pendingName').textContent = 'Тебя ждёт туман, ' + u.name;
      showScreen('screen-pending');
      return;
    }
    if (u.frozen && !u.isAdmin) {
      showScreen('screen-dashboard');
      renderDashboard();
      return;
    }
    if (u.path) { showScreen('screen-dashboard'); renderDashboard(); }
    else {
      $('#greetName').textContent = 'Туман знает тебя, ' + u.name;
      showScreen('screen-test-intro');
    }
  }

  function doLogout() {
    session.userId = null;
    localStorage.removeItem('tuman_session');
    $('#inputName').value = '';
    $('#inputId').value = '';
    $('#inputPin').value = '';
    $('#adminCodeHint').classList.remove('show');
    showScreen('screen-auth');
  }

  function bindAuth() {
    const idInput = $('#inputId');
    const hint = $('#adminCodeHint');
    if (idInput && hint) {
      idInput.addEventListener('input', () => {
        if (idInput.value.trim() === ADMIN_CODE) hint.classList.add('show');
        else hint.classList.remove('show');
      });
    }

    $('#btnStartAuth').addEventListener('click', async () => {
      if (!dataReady) { toast('Секунду, связываюсь с туманом...'); return; }
      const name = $('#inputName').value.trim();
      const id = $('#inputId').value.trim();
      const pin = $('#inputPin').value.trim();
      const err = $('#authErr');
      const isAdminCode = (id === ADMIN_CODE);

      const fail = (msg) => {
        err.textContent = msg;
        err.classList.add('show');
      };

      if (!id || !pin || (!name && !isAdminCode)) {
        fail('Заполни имя, ID и пароль.');
        return;
      }
      if (pin.length < 3) {
        fail('Пароль — хотя бы 3 символа.');
        return;
      }
      err.classList.remove('show');

      const pinHash = await hashPin(pin);
      const finalName = name || 'Участник';
      let u = users[id];
      const isNew = !u;

      if (u && u.pinHash && u.pinHash !== pinHash) {
        fail('Неверный пароль. Забыл — попроси модератора сбросить.');
        return;
      }

      if (u) {
        u.name = finalName;
        // либо миграция (старый юзер без пароля), либо просто обновление имени
        if (!u.pinHash) u.pinHash = pinHash;
      } else {
        u = {
          id, name: finalName, path: null, teamId: null,
          isAdmin: false, frozen: false, approved: false,
          pinHash
        };
      }

      if (isAdminCode) { u.isAdmin = true; u.approved = true; }

      session.userId = id;
      localStorage.setItem('tuman_session', id);
      await upsertUser(u);

      if (isNew) {
        const { error } = await sb.from('reg_order').insert({
          user_id: id, position: regOrder.length
        });
        if (!error) regOrder.push(id);
      }

      routeAfterLogin();
    });

    $('#btnDayMinus').addEventListener('click', () => { bumpDevDay(-1); renderDashboard(); });
    $('#btnDayPlus').addEventListener('click',  () => { bumpDevDay(1);  renderDashboard(); });

    const pRefresh = $('#btnPendingRefresh');
    if (pRefresh) pRefresh.addEventListener('click', async () => {
      if (!session.userId) return;
      const { data } = await sb.from('users').select('*').eq('id', session.userId).maybeSingle();
      if (data) {
        users[data.id] = {
          id: data.id, name: data.name, path: data.path,
          teamId: data.team_id, isAdmin: !!data.is_admin,
          frozen: !!data.frozen, approved: !!data.approved,
          pinHash: data.pin_hash || null
        };
        if (data.approved) {
          toast('Подтверждено');
          await autoPlaceInTeam(data.id);
          routeAfterLogin();
          return;
        }
      }
      toast('Ещё не подтверждено');
    });

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
      if (d > activeDepth + 2) return;
      if (d === activeDepth + 2) {
        const dep = TASK_DEPENDS[id];
        if (dep) {
          const parentIds = dep.any || dep.all || [];
          const parentVisible = parentIds.some(pid => {
            const pt = ALL_TASKS.find(x => x.id === pid);
            return pt && (isTaskUnlockedByDeps(u, pt) || taskDepth(pid) <= activeDepth);
          });
          if (!parentVisible) return;
        }
      }
      (byDepth[d] = byDepth[d] || []).push(t);
    });

    const depths = Object.keys(byDepth).map(Number).sort((a,b)=>a-b);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'tree-lines');
    wrap.appendChild(svg);

    const containerWidth = Math.max(280, wrap.clientWidth || 900);
    const nodeEls = {};
    const isWide = containerWidth >= 900;

    if (isWide) renderWideTree(u, wrap, byDepth, depths, containerWidth, nodeEls);
    else        renderCompactTree(u, wrap, byDepth, depths, containerWidth, nodeEls);

    requestAnimationFrame(() => drawTreeLines(u, svg, wrap, nodeEls));
  }

  function renderCompactTree(u, wrap, byDepth, depths, containerWidth, nodeEls) {
    const CELL = MOBILE_ITEM, GX = GAP_X, GY = GAP_Y;
    const usableWidth = Math.max(CELL, containerWidth - 24);
    const perRow = Math.max(1, Math.floor((usableWidth + GX) / (CELL + GX)));
    let cursorY = 40;

    depths.forEach((d, depthIndex) => {
      const list = byDepth[d];
      const rows = [];
      for (let i = 0; i < list.length; i += perRow) rows.push(list.slice(i, i + perRow));

      let rowY = cursorY;
      let globalIdx = 0;

      rows.forEach(rowItems => {
        const countInRow = rowItems.length;
        const rowWidth = countInRow * CELL + (countInRow - 1) * GX;
        const startX = Math.max(0, (containerWidth - rowWidth) / 2);
        let x = startX;

        rowItems.forEach(task => {
          const unlocked = isTaskUnlockedByDeps(u, task);
          const jx = jitter(task.id + 'mx', 14);
          const jy = jitter(task.id + 'my', 16);
          const zigX = (globalIdx % 2 === 0 ? -20 : 20) * (0.4 + 0.6 * ((globalIdx + 1) % 3) / 2);
          const zigY = (globalIdx % 3 === 0 ? -14 : globalIdx % 3 === 1 ? 8 : 18);

          const leftPx = Math.min(containerWidth - CELL / 2, Math.max(CELL / 2, x + CELL / 2 + jx + zigX));
          const topPx = rowY + jy + zigY;

          const outer = document.createElement('div');
          outer.className = 'tree-node-wrap';
          outer.style.left = leftPx + 'px';
          outer.style.top = topPx + 'px';
          outer.style.width = CELL + 'px';
          outer.style.transform = 'translateX(-50%)';

          outer.appendChild(unlocked ? renderTaskNodeOrb(u, task) : renderLockedOrb(task));
          wrap.appendChild(outer);
          nodeEls[task.id] = outer;

          x += CELL + GX;
          globalIdx++;
        });
        rowY += CELL + GY + 40;
      });
      cursorY = rowY + (depthIndex < depths.length - 1 ? BAND_GAP : 20);
    });

    wrap.style.height = cursorY + 'px';
  }

  function renderWideTree(u, wrap, byDepth, depths, containerWidth, nodeEls) {
    const CARD_W = 240, CARD_H = 190, GX = 28, GY = 44, ZIGZAG = 40, BAND = 70;
    let cursorY = 46;

    depths.forEach((d, depthIndex) => {
      const list = byDepth[d];
      const perRow = Math.max(1, Math.floor((containerWidth + GX) / (CARD_W + GX)));
      const rows = [];
      for (let i = 0; i < list.length; i += perRow) rows.push(list.slice(i, i + perRow));

      let rowY = cursorY;
      rows.forEach(rowItems => {
        const countInRow = rowItems.length;
        const rowWidth = countInRow * CARD_W + (countInRow - 1) * GX;
        const startX = Math.max(0, (containerWidth - rowWidth) / 2);
        let x = startX;

        rowItems.forEach((task, idx) => {
          const unlocked = isTaskUnlockedByDeps(u, task);
          const zig = (idx % 2 === 0 ? -1 : 1) * ZIGZAG;

          const outer = document.createElement('div');
          outer.className = 'tree-node-wrap';
          outer.style.left = (x + CARD_W / 2) + 'px';
          outer.style.top  = (rowY + zig) + 'px';
          outer.style.width = CARD_W + 'px';
          outer.style.transform = 'translateX(-50%)';

          outer.appendChild(unlocked ? renderTaskNodeCard(u, task) : renderLockedOrb(task));
          wrap.appendChild(outer);
          nodeEls[task.id] = outer;

          x += CARD_W + GX;
        });
        rowY += CARD_H + GY + ZIGZAG * 2;
      });
      cursorY = rowY + (depthIndex < depths.length - 1 ? BAND : 20);
    });

    wrap.style.height = cursorY + 'px';
  }

  function renderLockedOrb(task) {
    const sphere = SPHERES[task.sphere];
    const orb = document.createElement('div');
    orb.className = 'locked-orb';
    orb.innerHTML = '<span class="lo-icon">' + sphere.icon + '</span>';
    orb.addEventListener('click', () => toast('Скрыто туманом — отправь предыдущий отчёт, чтобы это открылось'));
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
    orb.innerHTML = '<span class="tno-icon">' + sphere.icon + '</span>'
                  + '<span class="tno-pts">' + finalPts + '</span>';
    return orb;
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
      '<div class="tnc-top"><div class="tnc-icon">' + sphere.icon + '</div>'
      + '<div class="tnc-name">' + escapeHtml(task.name) + '</div></div>'
      + '<div class="tnc-req">' + escapeHtml(task.req) + '</div>'
      + '<div class="tnc-bottom"><span class="tnc-pts">' + task.pts
      + (isBuff ? ' → <b>' + finalPts + '</b>' : '')
      + '</span><span class="tnc-status">' + statusLabel + '</span></div>';
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

        if (childStatus === 'approved' || childStatus === 'pending') {
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
      if (u && $('#tabview-tasks').classList.contains('active')) renderTaskTree(u);
    }, 220);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const u = currentUser();
      if (u && $('#tabview-tasks').classList.contains('active')) renderTaskTree(u);
    }, 320);
  });

  let currentModalUser = null, currentModalTask = null;
  let currentModalDaily = null, currentModalTeam = null;

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
      dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
      dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
      dz.addEventListener('drop', e => {
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
      rm.addEventListener('click', e => { e.preventDefault(); onRemove(); });
    }
  }

  function renderEditableForm(state, placeholder) {
    return ''
      + '<div class="field">'
      +   '<label>Ответ / описание отчёта</label>'
      +   '<textarea id="modalAnswer" rows="4" placeholder="'
      +      escapeHtml(placeholder || 'Опиши, что удалось сделать') + '">'
      +      escapeHtml(state.answer || '') + '</textarea>'
      + '</div>'
      + '<div class="field">'
      +   '<label>Фото / скриншоты</label>'
      +   imageUploadBlock(state)
      + '</div>';
  }

  function renderModalContent(u, task) {
    if (task.type === 'riddle') { renderRiddleModal(u, task); return; }
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
      + '<div class="modal-points">баллы: ' + task.pts
      + (isBuff ? ' → <b>' + finalPts + '</b> (бафф тумана)' : '') + '</div>'
      + statusArea;

    attachImageZoom($('#taskModalBody'));
    attachImageUploadHandlers(async () => {
      const st = getTaskState(u, task);
      st.image = null;
      await saveTaskState(u.id, task.id, st);
      renderModalContent(u, task);
    });

    const submitBtn = $('#btnSubmitTask');
    if (submitBtn) submitBtn.addEventListener('click', () => handleSubmitTask(u, task));
    const withdrawBtn = $('#btnWithdraw');
    if (withdrawBtn) withdrawBtn.addEventListener('click', () => handleWithdraw(u, task));
  }

  function renderRiddleModal(u, task) {
    const state = getTaskState(u, task);
    if (state.status === 'approved' || state.status === 'pending') {
      $('#taskModalBody').innerHTML = ''
        + '<div class="modal-head"><div class="modal-icon">' + SPHERES[task.sphere].icon + '</div><div>'
        + '<div class="modal-eyebrow">' + SPHERES[task.sphere].name + '</div>'
        + '<h3 class="display modal-title">' + escapeHtml(task.name) + '</h3></div></div>'
        + '<div class="riddle-solved-note">'
        +   '<div class="big">Загадки разгаданы</div>'
        +   '<div class="small">Ты собрал слово «' + escapeHtml(task.finalWord) + '» и получил <b>' + task.pts + '</b> баллов.</div>'
        + '</div>';
      return;
    }

    const letters = task.riddles.map(r => r.letter);

    // Индексы букв перемешиваем, чтобы слово не читалось слева направо.
    const displayOrder = letters.map((_, i) => i);
    for (let i = displayOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = displayOrder[i]; displayOrder[i] = displayOrder[j]; displayOrder[j] = t;
    }

    let listHTML = '';
    task.riddles.forEach((r, i) => {
      listHTML += ''
        + '<div class="riddle-item" data-idx="' + i + '">'
        +   '<div class="riddle-q">' + escapeHtml(r.q) + '<span class="riddle-mark">✓</span></div>'
        +   '<input type="text" class="riddle-input" data-idx="' + i + '" placeholder="Ответ..." autocomplete="off">'
        + '</div>';
    });

    let lettersHTML = ''
      + '<div class="letters-hint">Буквы рассыпались — сложи из них слово сам.</div>'
      + '<div class="letters-row">';
    displayOrder.forEach(origIdx => {
      lettersHTML += '<div class="letter-tile" data-idx="' + origIdx + '">?</div>';
    });
    lettersHTML += '</div>';

    $('#taskModalBody').innerHTML = ''
      + '<div class="modal-head"><div class="modal-icon">' + SPHERES[task.sphere].icon + '</div><div>'
      + '<div class="modal-eyebrow">' + SPHERES[task.sphere].name + ' · ' + task.pts + ' баллов</div>'
      + '<h3 class="display modal-title">' + escapeHtml(task.name) + '</h3></div></div>'
      + '<p class="lore-text muted modal-req">' + escapeHtml(task.req) + '</p>'
      + '<div class="riddle-list" id="riddleList">' + listHTML + '</div>'
      + lettersHTML
      + '<div class="final-word-block" id="finalWordBlock" style="display:none;">'
      +   '<p class="final-word-hint">Собери слово из букв и впиши его.</p>'
      +   '<input type="text" class="final-word-input" id="finalWordInput" placeholder="СЛОВО" autocomplete="off">'
      +   '<button class="btn btn-primary" id="btnSubmitRiddle" style="max-width:280px;margin:0 auto;display:block;">Разгадать туман</button>'
      + '</div>';

    const solvedSet = new Set();

    function updateLettersRow() {
      const tiles = $all('.letter-tile');
      tiles.forEach(tile => {
        const i = Number(tile.dataset.idx);
        if (solvedSet.has(i)) {
          tile.classList.add('revealed');
          tile.textContent = letters[i];
        } else {
          tile.classList.remove('revealed');
          tile.textContent = '?';
        }
      });
    }

    function checkRiddle(i, value) {
      const r = task.riddles[i];
      if (norm(value) === norm(r.answer)) {
        const item = $('.riddle-item[data-idx="' + i + '"]');
        if (item) {
          item.classList.add('solved');
          const inp = item.querySelector('.riddle-input');
          if (inp) { inp.value = r.answer; inp.disabled = true; }
        }
        solvedSet.add(i);
        updateLettersRow();
        if (solvedSet.size === task.riddles.length) {
          const fw = $('#finalWordBlock');
          if (fw) fw.style.display = 'block';
          toast('Все буквы собраны — сложи слово');
        }
      }
    }

    $all('.riddle-input').forEach(inp => {
      inp.addEventListener('change', () => checkRiddle(Number(inp.dataset.idx), inp.value));
      inp.addEventListener('blur',  () => checkRiddle(Number(inp.dataset.idx), inp.value));
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkRiddle(Number(inp.dataset.idx), inp.value);
          const next = $('.riddle-input:not([disabled])');
          if (next) next.focus();
        }
      });
    });

    const submitBtn = $('#btnSubmitRiddle');
    if (submitBtn) submitBtn.addEventListener('click', async () => {
      if (solvedSet.size < task.riddles.length) { toast('Сначала разгадай все загадки'); return; }
      const wordInp = $('#finalWordInput');
      const word = wordInp ? wordInp.value : '';
      if (norm(word) !== norm(task.finalWord)) {
        toast('Слово неверное — попробуй ещё');
        if (wordInp) wordInp.value = '';
        return;
      }
      await saveTaskState(u.id, task.id, {
        status: 'approved',
        answer: 'Загадки разгаданы. Слово: ' + task.finalWord,
        image: null, reason: null,
        submittedBy: u.name,
        submittedAt: Date.now(),
        decidedAt: Date.now()
      });
      toast('Туман принял твой ответ');
      renderRiddleModal(u, task);
      renderDashboard();
    });

    const first = $('.riddle-input');
    if (first) setTimeout(() => first.focus(), 80);
  }

  function renderDailyModalContent(u, team, daily) {
    const state = getDailyState(team, daily.id);
    const day = getCurrentDay();
    const inWindow = isDailyInWindow(daily, day);
    const activeCount = team.members.length;
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
        + '<p class="window-note active">Открыто для отчёта: дни ' + daily.dayFrom + '–' + daily.dayTo + '. Сейчас день ' + day + '. Участников: ' + activeCount + '.</p>'
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
        + (state.image ? '<img src="' + state.image + '" alt="" class="img-preview">' : '')
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
          +     '<option value="all"'  + (state.reportMode === 'all'  ? ' selected' : '') + '>Один собрал все отчёты</option>'
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
      + '<div class="modal-eyebrow">командный дейлик · ' + dailyWindowLabel(daily) + ' · ' + activeCount + ' уч.</div>'
      + '<h3 class="display modal-title">' + escapeHtml(daily.name) + '</h3></div></div>'
      + '<p class="lore-text muted modal-req">' + escapeHtml(daily.req) + '</p>'
      + '<div class="modal-points">баллы каждому участнику: ' + daily.pts + ' · отчёт один на команду</div>'
      + statusArea;

    attachImageZoom($('#taskModalBody'));
    attachImageUploadHandlers(async () => {
      const st = getDailyState(team, daily.id);
      st.image = null;
      team.dailies[daily.id] = st;
      await upsertTeam(team);
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
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTaskModal(); }, { once: true });
  }

  function openDailyModal(u, team, daily) {
    currentModalUser = u;
    currentModalTask = null;
    currentModalDaily = daily;
    currentModalTeam = team;
    renderDailyModalContent(u, team, daily);
    $('#taskModalBackdrop').classList.add('open');
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTaskModal(); }, { once: true });
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

  async function handleSubmitTask(u, task) {
    const answer = readModalAnswer();
    const existing = getTaskState(u, task);
    const file = readModalFile();
    if (!answer && !file && !existing.image) { toast('Добавь описание или фото отчёта'); return; }

    let imageUrl = existing.image || null;
    if (file) {
      try {
        toast('Загружаю фото...');
        imageUrl = await uploadReportImage(file);
      } catch (e) {
        console.error(e);
        toast('Не удалось загрузить фото');
        return;
      }
    }

    await saveTaskState(u.id, task.id, {
      status: 'pending', answer, image: imageUrl, reason: null,
      submittedBy: u.name, submittedAt: Date.now()
    });

    toast('Отчёт отправлен в туман...');
    closeTaskModal();
    renderDashboard();
  }

  async function handleSubmitDaily(u, team, daily) {
    const day = getCurrentDay();
    if (!isDailyInWindow(daily, day)) { toast('Задание закрыто'); return; }
    const answer = readModalAnswer();
    const existing = getDailyState(team, daily.id);
    const file = readModalFile();
    const modeEl = document.getElementById('modalReportMode');
    const reportMode = modeEl ? modeEl.value : 'each';
    if (!answer && !file && !existing.image) { toast('Добавь описание или фото отчёта'); return; }

    let imageUrl = existing.image || null;
    if (file) {
      try {
        toast('Загружаю фото...');
        imageUrl = await uploadReportImage(file);
      } catch (e) {
        console.error(e);
        toast('Не удалось загрузить фото');
        return;
      }
    }

    team.dailies = team.dailies || {};
    team.dailies[daily.id] = {
      status: 'pending', answer, image: imageUrl, reason: null,
      reportMode, submittedBy: u.name, submittedAt: Date.now()
    };
    await upsertTeam(team);

    toast('Отчёт отправлен в туман...');
    closeTaskModal();
    renderDashboard();
  }

  async function handleWithdraw(u, task) {
    const state = getTaskState(u, task);
    state.status = 'none';
    await saveTaskState(u.id, task.id, state);
    renderModalContent(u, task);
    renderDashboard();
  }

  async function handleWithdrawDaily(u, team, daily) {
    const state = getDailyState(team, daily.id);
    state.status = 'none';
    team.dailies[daily.id] = state;
    await upsertTeam(team);
    renderDailyModalContent(u, team, daily);
    renderDashboard();
  }

  function getTodayDraw(uid) {
    const day = getCurrentDay();
    const list = userPredictions[uid] || [];
    return list.find(x => x.day === day) || null;
  }

  function pickPredictionFor(uid) {
    const seen = new Set((userPredictions[uid] || []).map(x => x.idx));
    const pool = [];
    for (let i = 0; i < PREDICTIONS.length; i++) {
      if (!seen.has(i)) pool.push(i);
    }
    if (!pool.length) {
      for (let i = 0; i < PREDICTIONS.length; i++) pool.push(i);
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function renderPredictions() {
    const wrap = $('#predictionsWrap');
    if (!wrap) return;
    const u = currentUser();
    if (!u) { wrap.innerHTML = ''; return; }

    const day = getCurrentDay();
    const todayDraw = getTodayDraw(u.id);
    const all = (userPredictions[u.id] || []).slice().sort((a, b) => b.drawnAt - a.drawnAt);

    let stageHTML;
    if (todayDraw) {
      const pred = PREDICTIONS[todayDraw.idx] || '';
      stageHTML = ''
        + '<div class="prediction-reveal">'
        +   '<div class="prediction-decor">✦ ◈ ✦</div>'
        +   '<div class="prediction-text">' + escapeHtml(pred) + '</div>'
        +   '<div class="prediction-meta">день ' + day + ' · палочка вытянута</div>'
        + '</div>';
    } else {
      stageHTML = ''
        + '<div class="sticks-bundle" id="sticksBundle">'
        +   '<div class="stick s1"></div>'
        +   '<div class="stick s2"></div>'
        +   '<div class="stick s3"></div>'
        +   '<div class="stick s4"></div>'
        +   '<div class="stick s5"></div>'
        + '</div>'
        + '<div class="predictions-hint" style="position:absolute;bottom:0;left:0;right:0;">Вытянуть палочку</div>';
    }

    let historyHTML = '';
    if (all.length) {
      historyHTML = ''
        + '<div class="predictions-history">'
        +   '<div class="predictions-history-title">Прежние знамения</div>'
        +   '<div class="predictions-history-list">';
      all.forEach(x => {
        historyHTML += ''
          + '<div class="history-item">'
          +   '<span class="day">день ' + x.day + '</span>'
          +   '<span>' + escapeHtml(PREDICTIONS[x.idx] || '—') + '</span>'
          + '</div>';
      });
      historyHTML += '</div></div>';
    }

    wrap.innerHTML = ''
      + '<div class="predictions-panel">'
      +   '<div class="predictions-title">'
      +     '<span>Предсказания тумана</span>'
      +     '<span class="predictions-day">день ' + day + '</span>'
      +   '</div>'
      +   '<div class="predictions-stage">' + stageHTML + '</div>'
      +   historyHTML
      + '</div>';

    const bundle = $('#sticksBundle');
    if (bundle) {
      bundle.addEventListener('click', async () => {
        if (todayDraw) return;
        bundle.classList.add('drawing');
        const idx = pickPredictionFor(u.id);
        setTimeout(async () => {
          bundle.classList.remove('drawing');
          bundle.classList.add('drawn');
          await savePredictionDraw(u.id, idx, day);
          setTimeout(() => renderPredictions(), 500);
        }, 900);
      });
    }
  }

  function collectSubmissions() {
    const out = [];
    ALL_TASKS.forEach(task => {
      Object.keys(progress).forEach(uid => {
        const st = progress[uid] && progress[uid][task.id];
        if (st && st.status !== 'none') {
          const uu = users[uid];
          out.push({
            kind: 'task', task, state: st, ownerId: uid,
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
            kind: 'daily', daily: d, state: st, teamId,
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
        taskLine = '✦ ' + escapeHtml(s.daily.name) + ' · командный · ' + s.daily.pts + ' б. · '
                 + (s.state.reportMode === 'all' ? 'один за всех' : 'каждый свой');
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
      const rejectBtn  = entry.querySelector('[data-act="reject"]');
      if (approveBtn) approveBtn.addEventListener('click', () => adminDecide(s, 'approved'));
      if (rejectBtn)  rejectBtn.addEventListener('click',  () => adminDecide(s, 'rejected'));
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

  async function confirmReject() {
    const s = pendingRejectSubmission;
    if (!s) return;
    const input = $('#rejectReasonInput');
    let reason = input ? input.value.trim() : '';
    if (!reason) reason = 'Уточни отчёт и отправь снова.';

    s.state.status = 'rejected';
    s.state.reason = reason;
    s.state.decidedAt = Date.now();

    if (s.kind === 'task') {
      await saveTaskState(s.ownerId, s.task.id, s.state);
    } else {
      const team = teams[s.teamId];
      if (team) {
        team.dailies = team.dailies || {};
        team.dailies[s.daily.id] = s.state;
        await upsertTeam(team);
      }
    }

    toast('Отклонено');
    closeRejectModal();
    renderAdminList();
    renderDashboard();
  }

  async function adminDecide(s, decision) {
    if (decision === 'rejected') { openRejectModal(s); return; }
    s.state.status = 'approved';
    s.state.reason = null;
    s.state.decidedAt = Date.now();

    if (s.kind === 'task') {
      await saveTaskState(s.ownerId, s.task.id, s.state);
    } else {
      const team = teams[s.teamId];
      if (!team) return;
      team.dailies = team.dailies || {};
      team.dailies[s.daily.id] = s.state;
      await upsertTeam(team);
    }

    toast('Принято');
    renderAdminList();
    renderDashboard();
  }

  function bindRejectModal() {
    const closeBtn   = $('#rejectCloseBtn');
    const cancelBtn  = $('#rejectCancelBtn');
    const confirmBtn = $('#rejectConfirmBtn');
    const backdrop   = $('#rejectBackdrop');

    if (closeBtn)   closeBtn.addEventListener('click', closeRejectModal);
    if (cancelBtn)  cancelBtn.addEventListener('click', closeRejectModal);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmReject);
    if (backdrop) {
      backdrop.addEventListener('click', e => {
        if (e.target.id === 'rejectBackdrop') closeRejectModal();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) closeRejectModal();
    });
  }

  function renderModTeams() {
    const wrap = $('#modpanel-teams');
    if (!wrap) return;
    wrap.innerHTML = '';

    const teamIds = Object.keys(teams).sort((a, b) => {
      const na = parseInt(a.split('-')[1], 10) || 0;
      const nb = parseInt(b.split('-')[1], 10) || 0;
      return na - nb;
    });

    const head = document.createElement('div');
    head.style.marginBottom = '14px';
    head.innerHTML = '<button class="btn btn-ghost" id="btnCompactTeams" style="width:auto;padding:9px 16px;font-size:13px;">Пересобрать команды</button>';
    wrap.appendChild(head);

    if (!teamIds.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-hint';
      empty.textContent = 'Пока нет ни одной команды.';
      wrap.appendChild(empty);
      const cBtn0 = $('#btnCompactTeams');
      if (cBtn0) cBtn0.addEventListener('click', compactTeams);
      return;
    }

    const freeUsers = Object.values(users).filter(u => !u.isAdmin && !u.teamId && !u.frozen && u.approved);

    teamIds.forEach(tid => {
      const team = teams[tid];
      const block = document.createElement('div');
      block.className = 'team-editor';

      let membersHTML = '';
      if (!team.members.length) {
        membersHTML = '<p class="te-empty">Команда пуста</p>';
      } else {
        team.members.forEach(mid => {
          const m = users[mid];
          if (!m) {
            membersHTML += ''
              + '<div class="te-user">'
              +   '<div class="te-user-info"><span class="te-user-name">Неизвестный</span><span class="te-user-id">' + escapeHtml(mid) + '</span></div>'
              +   '<div class="te-user-actions">'
              +     '<button class="te-btn danger" data-act="remove" data-uid="' + escapeHtml(mid) + '">Убрать</button>'
              +     '<button class="te-btn danger" data-act="delete" data-uid="' + escapeHtml(mid) + '">Удалить</button>'
              +   '</div>'
              + '</div>';
            return;
          }
          let badges = '';
          if (m.isAdmin) badges += '<span class="te-user-badge admin">модератор</span>';
          membersHTML += ''
            + '<div class="te-user' + (m.frozen ? ' frozen' : '') + '">'
            +   '<div class="te-user-info">'
            +     '<span class="te-user-name">' + escapeHtml(m.name) + '</span>'
            +     '<span class="te-user-id">' + escapeHtml(m.id) + '</span>'
            +     badges
            +   '</div>'
            +   '<div class="te-user-actions">'
            +     '<button class="te-btn" data-act="freeze" data-uid="' + escapeHtml(m.id) + '">Заморозить</button>'
            +     '<button class="te-btn danger" data-act="remove" data-uid="' + escapeHtml(m.id) + '">Убрать</button>'
            +     '<button class="te-btn danger" data-act="delete" data-uid="' + escapeHtml(m.id) + '">Удалить</button>'
            +   '</div>'
            + '</div>';
        });
      }

      const options = freeUsers.map(fu =>
        '<option value="' + escapeHtml(fu.id) + '">' + escapeHtml(fu.name) + ' (' + escapeHtml(fu.id) + ')</option>'
      ).join('');

      block.innerHTML = ''
        + '<div class="team-editor-head">'
        +   '<div class="team-editor-title">Команда No' + tid.split('-')[1] + '</div>'
        +   '<div class="team-editor-count">' + team.members.length + ' / ' + team.size + ' участников</div>'
        + '</div>'
        + '<div>' + membersHTML + '</div>'
        + (options
            ? '<div class="te-add-row">'
            +   '<select class="te-add-select"><option value="">— выбрать игрока —</option>' + options + '</select>'
            +   '<button class="te-btn gold" data-act="add">Добавить</button>'
            + '</div>'
            : '<p class="te-empty" style="margin-top:8px;">Нет свободных игроков для добавления.</p>');

      wrap.appendChild(block);

      block.querySelectorAll('[data-act]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const act = btn.dataset.act;
          const uid = btn.dataset.uid;
          if (act === 'remove') await teamRemoveUser(tid, uid);
          else if (act === 'freeze') await teamFreezeUser(uid);
          else if (act === 'delete') await deleteUser(uid);
          else if (act === 'add') {
            const sel = block.querySelector('.te-add-select');
            if (sel && sel.value) await teamAddUser(tid, sel.value);
            else toast('Выбери игрока');
          }
        });
      });
    });

    const cBtn = $('#btnCompactTeams');
    if (cBtn) cBtn.addEventListener('click', compactTeams);
  }

  async function teamRemoveUser(teamId, uid) {
    const team = teams[teamId];
    if (!team) return;
    team.members = team.members.filter(x => x !== uid);
    if (users[uid]) {
      users[uid].teamId = null;
      await upsertUser(users[uid]);
    }
    await upsertTeam(team);
    toast('Убран из команды');
    renderModTeams();
    renderDashboard();
  }

  async function teamFreezeUser(uid) {
    const u = users[uid];
    if (!u) return;
    if (u.frozen) {
      u.frozen = false;
      await upsertUser(u);
      toast('Разморожен');
    } else {
      for (const tid of Object.keys(teams)) {
        const t = teams[tid];
        if (t.members.indexOf(uid) !== -1) {
          t.members = t.members.filter(x => x !== uid);
          await upsertTeam(t);
        }
      }
      u.frozen = true;
      u.teamId = null;
      await upsertUser(u);
      toast('Заморожен');
    }
    renderModTeams();
    renderDashboard();
  }

  async function teamAddUser(teamId, uid) {
    const team = teams[teamId];
    const u = users[uid];
    if (!team || !u) return;
    if (team.members.indexOf(uid) !== -1) { toast('Уже в команде'); return; }
    if (u.teamId && u.teamId !== teamId) {
      const old = teams[u.teamId];
      if (old) { old.members = old.members.filter(x => x !== uid); await upsertTeam(old); }
    }
    team.members.push(uid);
    u.teamId = teamId;
    u.frozen = false;
    await upsertTeam(team);
    await upsertUser(u);
    toast('Добавлен в команду');
    renderModTeams();
    renderDashboard();
  }

  async function deleteUser(uid) {
    const u = users[uid];
    if (!u) return;
    if (uid === ADMIN_CODE) { toast('Главного модератора удалить нельзя'); return; }
    if (session.userId === uid) { toast('Нельзя удалить себя'); return; }
    if (!confirm('Удалить игрока «' + (u.name || uid) + '»? Действие необратимо.')) return;

    for (const tid of Object.keys(teams)) {
      const t = teams[tid];
      if (t.members.indexOf(uid) !== -1) {
        t.members = t.members.filter(x => x !== uid);
        await upsertTeam(t);
      }
    }
    await sb.from('progress').delete().eq('user_id', uid);
    await sb.from('user_predictions').delete().eq('user_id', uid);
    await sb.from('reg_order').delete().eq('user_id', uid);
    await sb.from('users').delete().eq('id', uid);

    delete users[uid];
    delete progress[uid];
    delete userPredictions[uid];
    regOrder = regOrder.filter(x => x !== uid);

    toast('Удалён');
    renderModResponsibles();
    renderModTeams();
    renderDashboard();
  }

  async function compactTeams() {
    if (!confirm('Пересобрать команды заново? Прогресс по командным дейликам сбросится.')) return;

    const active = regOrder.filter(uid =>
      users[uid] && !users[uid].frozen && users[uid].approved
    );

    for (const tid of Object.keys(teams)) {
      await sb.from('teams').delete().eq('id', tid);
    }
    teams = {};

    for (let i = 0; i < active.length; i += TEAM_SIZE) {
      const idx = Math.floor(i / TEAM_SIZE) + 1;
      const id = 'team-' + idx;
      const chunk = active.slice(i, i + TEAM_SIZE);
      teams[id] = { id, size: TEAM_SIZE, members: chunk.slice(), dailies: {} };
      chunk.forEach(mid => { users[mid].teamId = id; });
      await upsertTeam(teams[id]);
    }

    Object.keys(users).forEach(uid => {
      if (!active.includes(uid)) users[uid].teamId = null;
    });
    await upsertUsersBulk(Object.values(users));

    toast('Команды пересобраны');
    renderModTeams();
    renderDashboard();
  }

  function renderModResponsibles() {
    const wrap = $('#modpanel-responsibles');
    if (!wrap) return;
    wrap.innerHTML = '';

    const all = Object.values(users).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const pending = all.filter(u => !u.isAdmin && !u.approved);
    const admins = all.filter(u => u.isAdmin);
    const regular = all.filter(u => !u.isAdmin && u.approved);

    wrap.innerHTML = '<p class="lore-text muted" style="margin-bottom:16px;">Модераторы могут принимать отчёты, управлять командами и выдавать права другим. Новые заявки приходят в самый верхний блок.</p>';

    const selfId = currentUser() ? currentUser().id : null;

    function buildGroup(title, list, emptyText, buildActions) {
      const block = document.createElement('div');
      block.className = 'resp-group';
      let html = '<div class="resp-group-title">' + escapeHtml(title) + ' <span class="resp-count">' + list.length + '</span></div>';
      if (!list.length) {
        html += '<p class="te-empty">' + escapeHtml(emptyText) + '</p>';
      } else {
        list.forEach(u => {
          html += ''
            + '<div class="te-user' + (u.frozen ? ' frozen' : '') + '">'
            +   '<div class="te-user-info">'
            +     '<span class="te-user-name">' + escapeHtml(u.name || '—') + '</span>'
            +     '<span class="te-user-id">' + escapeHtml(u.id) + '</span>'
            +     (u.frozen ? '<span class="te-user-badge frozen">заморожен</span>' : '')
            +   '</div>'
            +   '<div class="te-user-actions">' + buildActions(u) + '</div>'
            + '</div>';
        });
      }
      block.innerHTML = html;
      return block;
    }

    wrap.appendChild(buildGroup(
      'Ожидают подтверждения',
      pending,
      'Новых заявок нет.',
      u => {
        const del = (u.id !== ADMIN_CODE && u.id !== selfId)
          ? '<button class="te-btn danger" data-act="delete" data-uid="' + escapeHtml(u.id) + '">Удалить</button>' : '';
        return '<button class="te-btn gold" data-act="approve" data-uid="' + escapeHtml(u.id) + '">Подтвердить</button>' + del;
      }
    ));

    wrap.appendChild(buildGroup(
      'С правами модератора',
      admins,
      'Пока никого.',
      u => {
        const canRemoveRoot = (u.id !== ADMIN_CODE);
        const del = (u.id !== ADMIN_CODE && u.id !== selfId)
          ? '<button class="te-btn danger" data-act="delete" data-uid="' + escapeHtml(u.id) + '">Удалить</button>' : '';
        const reset = u.pinHash
          ? '<button class="te-btn" data-act="resetpin" data-uid="' + escapeHtml(u.id) + '">Сбросить пароль</button>' : '';
        const main = canRemoveRoot
          ? '<button class="te-btn danger" data-act="demote" data-uid="' + escapeHtml(u.id) + '">Снять права</button>'
          : '<span class="te-user-id">главный</span>';
        return main + reset + del;
      }
    ));

    wrap.appendChild(buildGroup(
      'Участники',
      regular,
      'Пока никто не зарегистрировался.',
      u => {
        const del = (u.id !== ADMIN_CODE && u.id !== selfId)
          ? '<button class="te-btn danger" data-act="delete" data-uid="' + escapeHtml(u.id) + '">Удалить</button>' : '';
        const reset = u.pinHash
          ? '<button class="te-btn" data-act="resetpin" data-uid="' + escapeHtml(u.id) + '">Сбросить пароль</button>' : '';
        return '<button class="te-btn gold" data-act="promote" data-uid="' + escapeHtml(u.id) + '">Сделать модератором</button>' + reset + del;
      }
    ));

    wrap.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uid = btn.dataset.uid;
        const u = users[uid];
        if (!u) return;
        const act = btn.dataset.act;
        if (act === 'promote') { u.isAdmin = true; u.approved = true; await upsertUser(u); toast('Права выданы'); }
        else if (act === 'demote') { u.isAdmin = false; await upsertUser(u); toast('Права сняты'); }
        else if (act === 'approve') {
          u.approved = true;
          await upsertUser(u);
          toast('Подтверждён');
          await autoPlaceInTeam(u.id);
        }
        else if (act === 'resetpin') {
          if (!confirm('Сбросить пароль игроку «' + (u.name || uid) + '»? Он введёт новый при следующем входе.')) return;
          u.pinHash = null;
          await upsertUser(u);
          toast('Пароль сброшен');
        }
        else if (act === 'delete') { await deleteUser(uid); return; }
        renderModResponsibles();
        renderModTeams();
        renderDashboard();
      });
    });
  }

  function renderTeamPanel(u) {
    const wrap = $('#teamPanelWrap');
    if (!wrap) return;

    if (u.frozen && !u.isAdmin) {
      wrap.innerHTML = '<div class="frozen-notice">Ты заморожен модераторами. Отчёты временно недоступны.</div>';
      return;
    }

    const team = u.teamId ? teams[u.teamId] : null;
    if (!team) { wrap.innerHTML = '<div class="stub-block">Ты пока не в команде.</div>'; return; }

    const day = getCurrentDay();
    const members = team.members;
    const personalSum = members.reduce((s, mid) => s + (users[mid] ? personalScore(users[mid]) : 0), 0);
    const activeCount = members.length;

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
      const after  = day > d.dayTo;

      let cardClass = 'daily-card';
      let statusLabel = '';
      let clickable = false;

      if (st.status === 'pending') { cardClass += ' state-pending'; statusLabel = 'на проверке'; clickable = inWindow; }
      else if (st.status === 'approved') { cardClass += ' state-approved'; statusLabel = 'принято'; clickable = true; }
      else if (st.status === 'rejected') { cardClass += ' state-rejected'; statusLabel = 'отклонено'; clickable = inWindow; }
      else {
        if (inWindow) { cardClass += ' state-active'; statusLabel = 'открыто · сейчас'; clickable = true; }
        else if (before) { cardClass += ' state-closed'; statusLabel = 'ещё не открыто'; }
        else if (after)  { cardClass += ' state-closed'; statusLabel = 'время истекло'; }
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
        +     '<span class="daily-pts">+' + d.pts + ' б. каждому · ' + activeCount + ' уч.</span>'
        +     '<span class="daily-status">' + statusLabel + '</span>'
        +   '</div>'
        + '</div>';
    });

    wrap.innerHTML = ''
      + '<div class="team-panel">'
      +   '<div class="team-panel-title">'
      +     '<span>Команда No' + team.id.split('-')[1] + ' · день ' + day + '</span>'
      +     '<span class="mono team-pool">общее кол-во баллов: ' + round1(personalSum) + '</span>'
      +   '</div>'
      +   '<div class="team-members">' + membersHTML + '</div>'
      +   '<h3 class="dailies-title">Командные задания</h3>'
      +   '<p class="dailies-hint">Три командных задания, по два дня каждое (1–2, 3–4, 5–6). Отчёт один на команду — при принятии баллы получает каждый активный участник (' + activeCount + ' чел.).</p>'
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

    $('#dashName').textContent = u.name;
    $('#dayNum').textContent = getCurrentDay();

    const dayMinus = $('#btnDayMinus');
    const dayPlus  = $('#btnDayPlus');
    if (dayMinus) dayMinus.style.display = u.isAdmin ? '' : 'none';
    if (dayPlus)  dayPlus.style.display  = u.isAdmin ? '' : 'none';

    const path = PATHS[u.path];
    if (path) {
      $('#chipPath').textContent = 'Путь: ' + path.name;
      $('#chipBuff').textContent = 'Бафф: +' + Math.round((BUFF_MULT - 1) * 100) + '% · ' + SPHERES[path.buffSphere].name;
    } else {
      $('#chipPath').textContent = 'Путь: —';
      $('#chipBuff').textContent = 'Бафф: —';
    }

    $('#personalScore').textContent = personalScore(u);

    const total = ALL_TASKS.length;
    const done = ALL_TASKS.filter(t => getTaskState(u, t).status === 'approved').length;
    $('#levelPoints').textContent = done + ' / ' + total;
    $('#levelFill').style.width = (total ? Math.min(100, (done / total) * 100) : 0) + '%';

    if (u.frozen && !u.isAdmin) {
      $('#taskTree').innerHTML = '<div class="frozen-notice" style="margin-top:20px;">Ты заморожен модераторами. Задания временно недоступны.</div>';
      $('#teamPanelWrap').innerHTML = '<div class="frozen-notice">Ты заморожен модераторами.</div>';
      renderPredictions();
    } else if (!path) {
      $('#taskTree').innerHTML = '<div class="stub-block">Пройди видения, чтобы открыть задания.</div>';
      renderTeamPanel(u);
      renderPredictions();
    } else {
      renderTaskTree(u);
      renderTeamPanel(u);
      renderPredictions();
    }

    const modBtn = $('#modTabBtn');
    if (u.isAdmin) {
      modBtn.style.display = 'block';
      if (modBtn.classList.contains('active')) {
        renderAdminList();
        renderModTeams();
        renderModResponsibles();
      }
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
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
      });
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

  async function finishTest() {
    let best = 'likotvorcy', bestVal = -1;
    Object.keys(testTally).forEach(k => {
      if (testTally[k] > bestVal) { bestVal = testTally[k]; best = k; }
    });
    const u = currentUser();
    u.path = best;
    await upsertUser(u);
    const fullStory = WAKE_STORY.concat(ITOG_INTRO_STORY)
      .concat([{ eyebrow: 'Кем ты стал', text: PATH_RESULTS[best] }]);
    playStory(fullStory, () => goToResultScreen());
  }

  function goToResultScreen() {
    const u = currentUser();
    const path = PATHS[u.path];
    const buff = SPHERES[path.buffSphere];
    $('#resultIcon').innerHTML = path.icon;
    $('#resultPathName').textContent = path.name;
    $('#resultBuffText').textContent = 'Туман даёт бафф +' + Math.round((BUFF_MULT - 1) * 100)
      + '% к баллам за задания «' + buff.name + '»';
    $('#resultLore').textContent = path.lore;
    showScreen('screen-result');
  }

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
    $('#btnLeaveVision').addEventListener('click', () => {
      showScreen('screen-dashboard');
      renderDashboard();
    });
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

        if (tab.dataset.tab === 'mod') {
          renderAdminList();
          renderModTeams();
          renderModResponsibles();
        }
        if (tab.dataset.tab === 'tasks' && u) renderTaskTree(u);
        if (tab.dataset.tab === 'team' && u) renderTeamPanel(u);
        if (tab.dataset.tab === 'predictions' && u) renderPredictions();
      });
    });

    $all('.mod-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        $all('.mod-subtab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $all('.mod-panel').forEach(p => p.classList.remove('active'));
        const target = $('#modpanel-' + btn.dataset.modtab);
        if (target) target.classList.add('active');
        if (btn.dataset.modtab === 'reports') renderAdminList();
        if (btn.dataset.modtab === 'teams') renderModTeams();
        if (btn.dataset.modtab === 'responsibles') renderModResponsibles();
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
    $('#taskModalBackdrop').addEventListener('click', e => {
      if (e.target.id === 'taskModalBackdrop') closeTaskModal();
    });
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
      img.addEventListener('click', e => {
        e.stopPropagation();
        openImageViewer(img.src);
      });
    });
  }

  function subscribeRealtime() {
    if (!sb) return;

    sb.channel('progress-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'progress' }, payload => {
        const row = payload.new || payload.old;
        if (!row) return;
        progress[row.user_id] = progress[row.user_id] || {};
        if (payload.eventType === 'DELETE') delete progress[row.user_id][row.task_id];
        else progress[row.user_id][row.task_id] = {
          status: row.status, answer: row.answer, image: row.image,
          reason: row.reason, submittedBy: row.submitted_by,
          submittedAt: row.submitted_at, decidedAt: row.decided_at
        };
        const u = currentUser();
        if (u && $('#screen-dashboard').classList.contains('active')) {
          renderDashboard();
          if ($('#modTabBtn').classList.contains('active')) renderAdminList();
        }
      })
      .subscribe();

    sb.channel('users-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
        const row = payload.new;
        if (!row) return;
        users[row.id] = {
          id: row.id, name: row.name, path: row.path,
          teamId: row.team_id, isAdmin: !!row.is_admin,
          frozen: !!row.frozen, approved: !!row.approved,
          pinHash: row.pin_hash || null
        };
        const u = currentUser();
        if (u && u.id === row.id && row.approved && $('#screen-pending').classList.contains('active')) {
          autoPlaceInTeam(u.id).then(() => routeAfterLogin());
          return;
        }
        if (u && $('#screen-dashboard').classList.contains('active')) {
          renderDashboard();
          if ($('#modTabBtn').classList.contains('active')) {
            renderModTeams();
            renderModResponsibles();
          }
        }
      })
      .subscribe();

    sb.channel('teams-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, payload => {
        const row = payload.new;
        if (!row) return;
        teams[row.id] = {
          id: row.id, size: row.size || TEAM_SIZE,
          members: Array.isArray(row.members) ? row.members.slice() : [],
          dailies: row.dailies || {}
        };
        const u = currentUser();
        if (u && $('#screen-dashboard').classList.contains('active')) {
          renderTeamPanel(u);
          if ($('#modTabBtn').classList.contains('active')) renderModTeams();
        }
      })
      .subscribe();

    sb.channel('predictions-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_predictions' }, payload => {
        const row = payload.new;
        if (!row) return;
        userPredictions[row.user_id] = userPredictions[row.user_id] || [];
        if (!userPredictions[row.user_id].some(x => x.idx === row.prediction_idx)) {
          userPredictions[row.user_id].push({
            idx: row.prediction_idx, day: row.day,
            drawnAt: new Date(row.drawn_at).getTime(), dbId: row.id
          });
        }
      })
      .subscribe();
  }

  async function init() {
    rebuildAllTasks();

    bindAuth();
    bindVision();
    bindTabs();
    bindAdmin();
    bindModal();
    bindRejectModal();
    updateToggleDoneBtn();

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
      iv.addEventListener('click', e => {
        if (e.target.id === 'imageViewer') closeImageViewer();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeImageViewer();
    });

    if (!sb) {
      toast('Supabase не настроен — заполни supabase-config.js');
      dataReady = true;
      return;
    }

    try {
      await loadAllFromSupabase();
      rebuildTaskDepends();
      subscribeRealtime();
    } catch (e) {
      console.error(e);
      toast('Не удалось загрузить данные из Supabase');
      dataReady = true;
      return;
    }

    if (session.userId && users[session.userId]) {
      const u = users[session.userId];
      $('#inputName').value = u.name;
      $('#inputId').value = u.id;
      if (u.id === ADMIN_CODE) $('#adminCodeHint').classList.add('show');
      routeAfterLogin();
    } else {
      showScreen('screen-auth');
    }
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

  init();
})();
