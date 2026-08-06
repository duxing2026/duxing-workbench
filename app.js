/**
 * 独行工作台 - 核心逻辑
 * 功能：导航切换、数据管理、各模块功能
 */

// 本地日期 YYYY-MM-DD（按用户所在时区，而非 UTC；避免中国用户跨天边界偏移 8 小时导致打卡/进度不重置）
function getLocalDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 当前前端版本号（每次发版自增）。配合 version.json 做自动更新自检，解决 PWA 缓存导致更新不到达的问题
const APP_VERSION = 'zr';

// ===== 全局状态 =====
const App = {
  currentModule: 'plan',
  today: getLocalDateStr(),
  studyStartTime: Date.now(),
  quizState: { type: 'politics', index: 0, answered: false, selectedOption: -1 },
  idiomState: { index: 0, answered: false, selectedOption: -1, tab: 'quiz' },
  englishState: { tab: 'words', wordIndex: 0, flipped: false, studyMode: null, session: null },
  essayState: { tab: 'words', wordCategory: 'all', wordMode: 'browse', reciteIndex: 0, reciteFlipped: false, quoteType: 'quote', caseFilter: 'all', correction: { topic: '', answer: '', photoData: null, report: null, loading: false } },
  formulaState: { category: 'all' },
  interviewState: { tab: 'questions', questionFilter: 'all', questionExpanded: {}, questionSearch: '', templateFilter: 'all', templateSearch: '', recordForm: { type: '', question: '', answer: '', reflection: '', questionId: null }, showRecordForm: false },
  highIdiomState: { search: '', filter: 'all', expandedId: null },
  newsTab: 'affairs',
  newsSectionState: { affairs: true, macro: false, hot: false, yunnan: false, theory: false },

  // 刷新页面：强制绕过 PWA/浏览器缓存重新加载，不丢失 localStorage 中的数据
  refresh() {
    const btn = document.getElementById('refreshBtn');
    if (btn) {
      btn.classList.add('spinning');
    }

    // 保存当前模块状态到 sessionStorage，刷新后恢复
    const state = {
      currentModule: App.currentModule,
      quizState: App.quizState,
      idiomState: App.idiomState,
      englishState: App.englishState,
      essayState: App.essayState,
      formulaState: App.formulaState,
      interviewState: App.interviewState,
      highIdiomState: App.highIdiomState,
      newsTab: App.newsTab,
      newsSectionState: App.newsSectionState,
    };
    sessionStorage.setItem('duxing_refresh_state', JSON.stringify(state));
    // 双重保险：同时保存到 localStorage
    localStorage.setItem('duxing_refresh_state', JSON.stringify(state));

    // 验证状态已保存
    const verify = sessionStorage.getItem('duxing_refresh_state');
    if (!verify) {
      Utils.toast('状态保存失败，请重试', 'error');
      if (btn) btn.classList.remove('spinning');
      return;
    }

    // 强制绕过所有缓存重新加载
    setTimeout(() => {
      // 清除所有 Cache Storage 缓存
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      // 使用 location.href 带时间戳（不用 replace，确保 sessionStorage 不丢失）
      const url = new URL(window.location.href);
      url.searchParams.delete('_t');
      url.searchParams.set('_t', Date.now());
      window.location.href = url.toString();
    }, 300);
  },
};

// ===== 数据层 =====
const DB = {
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.error('DB.get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('DB.set error:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // 获取带日期后缀的键
  dailyKey(prefix) {
    return `${prefix}_${App.today}`;
  },

  // 获取今日数据
  getToday(prefix, defaultValue = null) {
    return this.get(this.dailyKey(prefix), defaultValue);
  },

  // 设置今日数据
  setToday(prefix, value) {
    this.set(this.dailyKey(prefix), value);
  },
};

// ===== 工具函数 =====
const Utils = {
  // 显示提示消息
  toast(msg, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.className = `toast ${type}`;
    }, 2000);
  },

  // 日期格式化
  formatDate(date) {
    const d = date || new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekDays[d.getDay()]}`;
  },

  // 随机打乱数组
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // 根据日期生成确定性的随机种子（保证同一天内容不变）
  seededShuffle(arr, seed) {
    const a = [...arr];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // 日期数字作为种子
  dateSeed() {
    return App.today.split('-').join('') | 0;
  },

  // 转义HTML
  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // HTML 转换换行
  nl2br(str) {
    return this.escape(str).replace(/\n/g, '<br>');
  }
};

// ===== 初始化图标 =====
function initIcons(scope) {
  scope = scope || document;

  // 注入导航栏 SVG 图标（始终在整个文档中）
  if (scope === document) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const iconName = item.dataset.icon;
      const iconEl = item.querySelector('.nav-icon');
      if (iconEl && iconName && ICONS[iconName]) {
        iconEl.innerHTML = ICONS[iconName];
      }
    });

    // 注入火焰图标
    const streakIcon = document.getElementById('streakIcon');
    if (streakIcon) streakIcon.innerHTML = ICONS.flame;

    // 注入数据管理按钮图标
    const dataBtnIcon = document.getElementById('dataBtnIcon');
    if (dataBtnIcon) dataBtnIcon.innerHTML = ICONS.database || ICONS.refresh;
  }

  // 注入作用域内的所有以 Icon 结尾的 span
  scope.querySelectorAll('span[id$="Icon"]').forEach(span => {
    if (!span.innerHTML.trim()) {
      const id = span.id;
      const map = {
        'externalLinkIcon': ICONS.book,
        'exerciseLinkIcon': ICONS.dumbbell,
        'streakIcon': ICONS.flame,
      };
      if (map[id]) span.innerHTML = map[id];
    }
  });
}

// 标题图标辅助函数（生成带 SVG 的 HTML 字符串）
function titleIcon(name, size = 24) {
  if (!ICONS[name]) return '';
  // 替换 width/height 来调整尺寸
  const svg = ICONS[name].replace(/width="20" height="20"/, `width="${size}" height="${size}"`);
  return `<span class="title-icon" style="color: var(--pink-deep);">${svg}</span>`;
}

// ===== 导航 =====
const Nav = {
  init() {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const module = item.dataset.module;
        this.switchTo(module);
        // 移动端窄屏：点击导航项后自动收起（仅保留图标）
        if (this.isNarrow()) {
          this.collapse();
        }
      });
    });

    // 折叠/展开
    document.getElementById('navToggle').addEventListener('click', () => {
      this.toggle();
    });

    // 点击遮罩关闭（窄屏浮动模式下）
    document.getElementById('sidebarOverlay').addEventListener('click', () => {
      this.collapse();
    });

    // 数据管理
    document.getElementById('dataBtn').addEventListener('click', () => {
      DataManager.open();
    });
  },

  // 窄屏（<480px）侧栏作为浮动覆盖层
  isNarrow() {
    return window.innerWidth < 480;
  },

  toggle() {
    const sidebar = document.getElementById('sidebar');

    if (this.isNarrow()) {
      // 窄屏：浮动模式
      if (sidebar.classList.contains('mobile-open')) {
        this.collapse();
      } else {
        sidebar.classList.add('mobile-open', 'expanded');
        document.getElementById('sidebarOverlay').classList.add('show');
      }
    } else {
      // 宽屏：固定栏模式，切换图标/完整宽度
      sidebar.classList.toggle('collapsed');
    }
  },

  collapse() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('mobile-open');
    sidebar.classList.add('collapsed');
    document.getElementById('sidebarOverlay').classList.remove('show');
  },

  switchTo(module) {
    // 更新导航高亮
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.module === module);
    });

    App.currentModule = module;

    // 渲染对应模块
    const renderer = ModuleRenderers[module];
    if (renderer) {
      const content = document.getElementById('content');
      content.innerHTML = '';
      renderer();
      // 渲染后注入图标（包括动态生成的部分）
      initIcons(content);
    }
  }
};

// ===== 每日重置 =====
const DailyReset = {
  // 检查是否需要执行每日重置（跨天检测）
  checkNewDay() {
    const lastActiveDate = DB.get('duxing_last_active_date');
    const today = App.today;

    if (lastActiveDate && lastActiveDate !== today) {
      // 跨天了，执行重置逻辑
      this.resetForNewDay(lastActiveDate, today);
    }
    DB.set('duxing_last_active_date', today);
  },

  // 新的一天重置
  resetForNewDay(oldDate, newDate) {
    // 计划：重置循环计划的完成状态
    const plans = DB.get('duxing_plans', []);
    const today = new Date();
    const weekday = today.getDay();
    const weekdayMap = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };

    plans.forEach(plan => {
      if (plan.repeat === 'daily') {
        plan.completed = false;
        plan.completedAt = null;
      } else if (plan.repeat === 'weekly') {
        // 检查今天是否在计划的天数中
        plan.completed = false;
        plan.completedAt = null;
      } else if (plan.repeat === 'once') {
        // 单次计划保留状态，但如果已完成且超过7天则删除
        if (plan.completed && plan.completedAt) {
          const daysAgo = (Date.now() - new Date(plan.completedAt).getTime()) / (1000 * 60 * 60 * 24);
          if (daysAgo > 7) {
            plan._toDelete = true;
          }
        }
      }
    });

    // 过滤掉标记删除的计划
    const filteredPlans = plans.filter(p => !p._toDelete);
    DB.set('duxing_plans', filteredPlans);

    // 更新打卡天数
    const stats = DB.get('duxing_stats', { totalDays: 0, lastStudyDate: null });
    if (stats.lastStudyDate !== newDate) {
      stats.totalDays = (stats.totalDays || 0) + 1;
      stats.lastStudyDate = newDate;
      DB.set('duxing_stats', stats);
    }

    // 成语累计打卡：用户要求断签不清零，故跨天不再重置，只增不减
  },
};

// ===== 状态栏 =====
const StatusBar = {
  update() {
    // 今日完成
    const plans = DB.get('duxing_plans', []);
    const todayPlans = plans.filter(p => p.repeat !== 'once' || !p.completed);
    const completed = plans.filter(p => p.completed).length;
    document.getElementById('todayCompleted').textContent = `${completed}/${plans.length}`;

    // 学习时长
    const studyTime = Math.floor((Date.now() - App.studyStartTime) / 60000);
    document.getElementById('studyTime').textContent = `${studyTime}min`;

    // 成语打卡
    const idiomStreak = DB.get('duxing_idiom_streak', { count: 0 });
    document.getElementById('idiomStreak').textContent = `${idiomStreak.count || 0}天`;

    // 累计天数
    const stats = DB.get('duxing_stats', { totalDays: 1 });
    document.getElementById('totalDays').textContent = stats.totalDays || 1;

    // 顶部累计天数（成语背诵）
    document.getElementById('streakCount').textContent = idiomStreak.count || 0;
  }
};

// ===== 番茄时钟养树（10 种树 SVG）=====
const POMODORO_TREES = {
  // 1. 圆冠树
  round: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 14" stroke="#8a7a6a" stroke-width="1.5"/><circle cx="12" cy="9" r="6" fill="#b5c9b3" fill-opacity="0.5"/><circle cx="9" cy="8" r="2" fill="#d0dccd" fill-opacity="0.6" stroke="none"/><circle cx="14" cy="10" r="1.5" fill="#d0dccd" fill-opacity="0.5" stroke="none"/></svg>`,
  // 2. 高杉树
  tall: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 16" stroke="#8a7a6a" stroke-width="1.5"/><path d="M12 2 L6 10 L9 10 L5 16 L19 16 L15 10 L18 10 Z" fill="#b5c9b3" fill-opacity="0.5"/><path d="M12 2 L9 6" stroke="#d0dccd" stroke-width="0.8" opacity="0.6"/></svg>`,
  // 3. 灌木丛
  bush: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8" cy="16" rx="4" ry="4" fill="#d0dccd" fill-opacity="0.5"/><ellipse cx="15" cy="15" rx="4.5" ry="4" fill="#b5c9b3" fill-opacity="0.5"/><ellipse cx="12" cy="13" rx="3.5" ry="3.5" fill="#d0dccd" fill-opacity="0.5"/></svg>`,
  // 4. 柳树
  willow: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 8" stroke="#8a7a6a" stroke-width="1.5"/><ellipse cx="12" cy="7" rx="7" ry="4" fill="#b5c9b3" fill-opacity="0.3"/><path d="M6 9 Q5 14 7 19" stroke="#7a9a7a" stroke-width="0.8" opacity="0.7"/><path d="M9 8 Q8 13 9 20" stroke="#7a9a7a" stroke-width="0.8" opacity="0.7"/><path d="M12 8 Q12 14 12 21" stroke="#7a9a7a" stroke-width="0.8" opacity="0.7"/><path d="M15 8 Q16 13 15 20" stroke="#7a9a7a" stroke-width="0.8" opacity="0.7"/><path d="M18 9 Q19 14 17 19" stroke="#7a9a7a" stroke-width="0.8" opacity="0.7"/></svg>`,
  // 5. 棕榈树
  palm: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 Q11 16 12 8" stroke="#8a7a6a" stroke-width="1.5"/><path d="M12 8 Q6 5 4 9" fill="#b5c9b3" fill-opacity="0.4"/><path d="M12 8 Q18 5 20 9" fill="#b5c9b3" fill-opacity="0.4"/><path d="M12 8 Q8 3 6 4" fill="#b5c9b3" fill-opacity="0.4"/><path d="M12 8 Q16 3 18 4" fill="#b5c9b3" fill-opacity="0.4"/><path d="M12 8 Q12 2 10 3" fill="#b5c9b3" fill-opacity="0.4"/></svg>`,
  // 6. 松树
  pine: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 17" stroke="#8a7a6a" stroke-width="1.5"/><path d="M12 3 L8 8 L16 8 Z" fill="#b5c9b3" fill-opacity="0.45"/><path d="M12 7 L7 12 L17 12 Z" fill="#b5c9b3" fill-opacity="0.5"/><path d="M12 11 L6 16 L18 16 Z" fill="#b5c9b3" fill-opacity="0.55"/></svg>`,
  // 7. 樱花树
  cherry: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#c4a0a0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 13" stroke="#8a7a6a" stroke-width="1.5"/><path d="M12 15 Q9 14 7 12" stroke="#8a7a6a" stroke-width="1"/><path d="M12 14 Q15 13 17 11" stroke="#8a7a6a" stroke-width="1"/><circle cx="12" cy="8" r="5.5" fill="#e8c4c4" fill-opacity="0.5" stroke="#c4a0a0"/><circle cx="8" cy="7" r="1.2" fill="#d4a9a9" fill-opacity="0.7" stroke="none"/><circle cx="15" cy="9" r="1" fill="#d4a9a9" fill-opacity="0.7" stroke="none"/><circle cx="11" cy="5" r="0.8" fill="#d4a9a9" fill-opacity="0.6" stroke="none"/></svg>`,
  // 8. 枫树
  maple: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#c4886a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 14" stroke="#8a7a6a" stroke-width="1.5"/><path d="M12 14 L8 10 L6 12 L8 8 L4 8 L8 5 L6 2 L10 4 L12 1 L14 4 L18 2 L16 5 L20 8 L16 8 L18 12 L16 10 L12 14 Z" fill="#e8a87c" fill-opacity="0.4" stroke="#c4886a"/></svg>`,
  // 9. 白桦
  birch: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#8a8a8a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 L12 12" stroke="#d4cfc4" stroke-width="2"/><path d="M11 18 L13 18" stroke="#a8a89a" stroke-width="0.6"/><path d="M11 15 L13 15" stroke="#a8a89a" stroke-width="0.6"/><ellipse cx="12" cy="7" rx="4" ry="6" fill="#d0dccd" fill-opacity="0.5" stroke="#7a9a7a"/><ellipse cx="10" cy="6" rx="2" ry="3" fill="#d0dccd" fill-opacity="0.5" stroke="none"/></svg>`,
  // 10. 盆栽
  bonsai: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#7a9a7a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20 L16 20 L15 17 L9 17 Z" fill="#d4cfc4" fill-opacity="0.5" stroke="#8a7a6a"/><path d="M12 17 Q10 12 8 9 Q10 10 11 8 Q12 10 13 7 Q14 9 16 8 Q14 12 12 17" stroke="#8a7a6a" stroke-width="1.5" fill="none"/><circle cx="8" cy="8" r="2.5" fill="#b5c9b3" fill-opacity="0.5" stroke="#7a9a7a"/><circle cx="13" cy="6" r="2" fill="#b5c9b3" fill-opacity="0.5" stroke="#7a9a7a"/><circle cx="16" cy="7" r="2" fill="#d0dccd" fill-opacity="0.5" stroke="#7a9a7a"/></svg>`,
};
const POMODORO_TREE_KEYS = Object.keys(POMODORO_TREES);

// ========== 番茄时钟养树模块 ==========
const PomodoroModule = {
  SECONDS_PER_TREE: 3600, // 1 小时 = 1 棵树

  state: {
    timerInterval: null,
    running: false,
    pausedAccum: 0,
    lastStartTs: null,
    currentTreeType: 'round',
  },

  // 从 DB 恢复会话状态
  init() {
    const persist = DB.get('duxing_pomo_persist', {
      totalSeconds: 0,
      totalTrees: 0,
      session: { running: false, pausedAccum: 0, lastStartTs: null, currentTreeType: 'round' }
    });
    const s = persist.session || {};
    this.state.running = !!s.running;
    this.state.pausedAccum = s.pausedAccum || 0;
    this.state.lastStartTs = s.lastStartTs || null;
    this.state.currentTreeType = s.currentTreeType || 'round';
    // 之前在运行 → 自动恢复计时器
    if (this.state.running && this.state.lastStartTs) {
      this.startTimer();
    }
  },

  // 当前树的累计秒数（0 ~ 3600+）
  getCurrentSeconds() {
    let sec = this.state.pausedAccum;
    if (this.state.running && this.state.lastStartTs) {
      sec += Math.floor((Date.now() - this.state.lastStartTs) / 1000);
    }
    return sec;
  },

  // 生长进度 0~1
  getProgress() {
    return Math.min(this.getCurrentSeconds() / this.SECONDS_PER_TREE, 1);
  },

  // 开始 / 恢复
  start() {
    if (this.state.running) return;
    this.state.running = true;
    this.state.lastStartTs = Date.now();
    this.saveSession();
    this.startTimer();
    this.updateButtons();
    this.updateStatus();
  },

  // 暂停
  pause() {
    if (!this.state.running) return;
    this.state.pausedAccum = this.getCurrentSeconds();
    this.state.running = false;
    this.state.lastStartTs = null;
    this.saveSession();
    this.stopTimer();
    this.updateButtons();
    this.updateStatus();
  },

  // 重置当前树（不归零累计）
  reset() {
    this.stopTimer();
    this.state.running = false;
    this.state.pausedAccum = 0;
    this.state.lastStartTs = null;
    this.state.currentTreeType = this.getRandomTree();
    this.saveSession();
    this.renderTree();
    this.updateTimerDisplay();
    this.updateButtons();
    this.updateStatus();
    Utils.toast('已重置当前树');
  },

  startTimer() {
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    this.state.timerInterval = setInterval(() => this.tick(), 1000);
  },

  stopTimer() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = null;
    }
  },

  // 每秒回调 -- 核心
  tick() {
    this.checkNewDay();
    const sec = this.getCurrentSeconds();
    this.updateTimerDisplay();
    this.updateTreeGrowth();
    if (sec >= this.SECONDS_PER_TREE) {
      this.onTreeComplete();
    }
  },

  // 一棵树长成
  onTreeComplete() {
    // 庆祝动画
    const treeEl = document.getElementById('pomoTree');
    if (treeEl) {
      treeEl.classList.add('tree-complete');
      setTimeout(() => treeEl.classList.remove('tree-complete'), 1200);
    }

    // 今日 +1
    const today = DB.getToday('duxing_pomo_today', { todayTrees: 0, todaySeconds: 0 });
    today.todayTrees += 1;
    today.todaySeconds += this.SECONDS_PER_TREE;
    DB.setToday('duxing_pomo_today', today);

    // 累计 +1
    const persist = DB.get('duxing_pomo_persist', { totalSeconds: 0, totalTrees: 0, session: {} });
    persist.totalTrees += 1;
    persist.totalSeconds += this.SECONDS_PER_TREE;
    DB.set('duxing_pomo_persist', persist);

    Utils.toast('一棵树长成了！继续种下一棵吧~');

    // 重置当前树进度，随机选下一棵，继续计时
    this.state.pausedAccum = 0;
    this.state.lastStartTs = Date.now();
    this.state.currentTreeType = this.getRandomTree();
    this.saveSession();

    // 动画结束后替换新树
    setTimeout(() => {
      this.renderTree();
      this.updateStats();
    }, 1200);
  },

  // 跨天检测
  checkNewDay() {
    const todayStr = getLocalDateStr();
    if (todayStr !== App.today) {
      App.today = todayStr;
      this.updateStats();
    }
  },

  // 随机选树（避免连续重复）
  getRandomTree() {
    let key;
    do {
      key = POMODORO_TREE_KEYS[Math.floor(Math.random() * POMODORO_TREE_KEYS.length)];
    } while (key === this.state.currentTreeType && POMODORO_TREE_KEYS.length > 1);
    return key;
  },

  // 保存会话到 DB
  saveSession() {
    const persist = DB.get('duxing_pomo_persist', { totalSeconds: 0, totalTrees: 0, session: {} });
    persist.session = {
      running: this.state.running,
      pausedAccum: this.state.pausedAccum,
      lastStartTs: this.state.lastStartTs,
      currentTreeType: this.state.currentTreeType
    };
    DB.set('duxing_pomo_persist', persist);
  },

  // 格式化 HH:MM:SS
  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },

  updateTimerDisplay() {
    const el = document.getElementById('pomoTimer');
    if (el) {
      el.textContent = this.formatTime(this.getCurrentSeconds());
      el.className = 'pomodoro-timer' + (this.state.running ? ' running' : '');
    }
    const bar = document.getElementById('pomoProgressFill');
    if (bar) bar.style.width = (this.getProgress() * 100) + '%';
  },

  updateTreeGrowth() {
    const treeEl = document.getElementById('pomoTree');
    if (!treeEl) return;
    const p = this.getProgress();
    const scale = 0.3 + p * 0.7;
    const opacity = 0.4 + p * 0.6;
    treeEl.style.transform = `scale(${scale})`;
    treeEl.style.opacity = opacity;
  },

  updateStats() {
    const el = document.getElementById('pomoStats');
    if (!el) return;
    const today = DB.getToday('duxing_pomo_today', { todayTrees: 0, todaySeconds: 0 });
    const persist = DB.get('duxing_pomo_persist', { totalSeconds: 0, totalTrees: 0 });
    const totalHours = (persist.totalSeconds / 3600).toFixed(1);
    el.innerHTML = `
      <div class="pomo-stat-item">
        <span class="pomo-stat-num">${today.todayTrees}</span>
        <span class="pomo-stat-label">今日棵数</span>
      </div>
      <div class="pomo-stat-item">
        <span class="pomo-stat-num">${persist.totalTrees}</span>
        <span class="pomo-stat-label">累计棵数</span>
      </div>
      <div class="pomo-stat-item">
        <span class="pomo-stat-num">${totalHours}</span>
        <span class="pomo-stat-label">累计小时</span>
      </div>
    `;
  },

  updateButtons() {
    const startBtn = document.getElementById('pomoStartBtn');
    const pauseBtn = document.getElementById('pomoPauseBtn');
    if (startBtn) startBtn.style.display = this.state.running ? 'none' : '';
    if (pauseBtn) pauseBtn.style.display = this.state.running ? '' : 'none';
  },

  updateStatus() {
    const el = document.getElementById('pomoStatus');
    if (el) {
      el.textContent = this.state.running ? '专注中' : '已暂停';
      el.className = 'pomodoro-status' + (this.state.running ? ' running' : '');
    }
  },

  renderTree() {
    const el = document.getElementById('pomoTreeArea');
    if (!el) return;
    el.innerHTML = `<div id="pomoTree" class="pomodoro-tree">${POMODORO_TREES[this.state.currentTreeType] || POMODORO_TREES.round}</div>`;
    this.updateTreeGrowth();
  },

  // 全量渲染（由 ModuleRenderers.plan 调用）
  render() {
    this.renderTree();
    this.updateTimerDisplay();
    this.updateStats();
    this.updateButtons();
    this.updateStatus();
    if (this.state.running && !this.state.timerInterval) {
      this.startTimer();
    }
  }
};

// ========== 数据管理（导入/导出） ==========
const DataManager = {
  // 收集所有 duxing_ 开头的 localStorage 数据
  collectAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('duxing_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  },

  // 统计数据概览
  getStats() {
    const data = this.collectAll();
    const stats = {
      totalKeys: Object.keys(data).length,
      plans: (data['duxing_plans'] || []).length,
      quizWrong: (data['duxing_quiz_wrong'] || []).length,
      readingLogs: (data['duxing_reading_log'] || []).length,
      exerciseLogs: (data['duxing_exercise_log'] || []).length,
      pomoTrees: (data['duxing_pomo_persist'] || {}).totalTrees || 0,
    };
    // 计算总字节数
    stats.sizeKB = (JSON.stringify(data).length / 1024).toFixed(1);
    return stats;
  },

  // 打开模态框
  open() {
    document.getElementById('dataModal').style.display = 'flex';
    this.renderStats();
  },

  close() {
    document.getElementById('dataModal').style.display = 'none';
  },

  renderStats() {
    const el = document.getElementById('dataModalStats');
    if (!el) return;
    const s = this.getStats();
    el.innerHTML = `
      <div class="data-stat-pill"><span class="data-stat-pill-num">${s.totalKeys}</span><span class="data-stat-pill-label">数据项</span></div>
      <div class="data-stat-pill"><span class="data-stat-pill-num">${s.plans}</span><span class="data-stat-pill-label">计划</span></div>
      <div class="data-stat-pill"><span class="data-stat-pill-num">${s.pomoTrees}</span><span class="data-stat-pill-label">番茄树</span></div>
      <div class="data-stat-pill"><span class="data-stat-pill-num">${s.sizeKB}</span><span class="data-stat-pill-label">KB</span></div>
    `;
  },

  // 导出数据
  exportData() {
    const data = this.collectAll();
    const exportObj = {
      _meta: {
        app: '独行工作台',
        version: '1.0',
        exportTime: new Date().toISOString(),
        keyCount: Object.keys(data).length,
      },
      data: data
    };
    const json = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = getLocalDateStr();
    a.href = url;
    a.download = `独行工作台-数据备份-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Utils.toast('数据已导出');
  },

  // 复制数据到剪贴板（iOS 桌面 PWA 下载失效时的替代方案）
  copyData() {
    const data = this.collectAll();
    const exportObj = {
      _meta: {
        app: '独行工作台',
        version: '1.0',
        exportTime: new Date().toISOString(),
        keyCount: Object.keys(data).length,
      },
      data: data
    };
    const json = JSON.stringify(exportObj, null, 2);
    this._copyText(json, `已复制 ${exportObj._meta.keyCount} 项数据，可粘贴到备忘录 / 云文档保存`);
  },

  // 复制文本：优先 Clipboard API，失败回退 execCommand（兼容 iOS PWA）
  _copyText(text, okMsg) {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      Utils.toast(ok ? (okMsg || '已复制') : '复制失败，请手动选择文本', ok ? 'success' : 'error');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        Utils.toast(okMsg || '已复制', 'success');
      }).catch(() => fallback());
    } else {
      fallback();
    }
  },

  // 导入数据
  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const obj = JSON.parse(e.target.result);
        // 兼容两种格式：带 _meta 的导出文件，或纯 data 对象
        const data = obj._meta ? obj.data : obj;
        if (!data || typeof data !== 'object') {
          Utils.toast('文件格式不正确', 'error');
          return;
        }

        if (!confirm(`确认导入？这将覆盖当前所有数据（共 ${Object.keys(data).length} 项）。\n\n建议先导出当前数据作为备份。`)) {
          event.target.value = '';
          return;
        }

        // 清除现有的 duxing_ 数据
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('duxing_')) keysToRemove.push(key);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // 写入导入的数据
        let count = 0;
        for (const key in data) {
          if (key.startsWith('duxing_')) {
            localStorage.setItem(key, JSON.stringify(data[key]));
            count++;
          }
        }

        Utils.toast(`成功导入 ${count} 项数据，正在刷新...`);
        setTimeout(() => location.reload(), 1200);
      } catch (err) {
        Utils.toast('导入失败：' + err.message, 'error');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  },

  // 导出代码包：把核心源码文件打包为 ZIP，供换新会话后上传继续修改
  async exportCodePackage() {
    Utils.toast('正在打包代码…', 'info');
    try {
      const zip = new JSZip();

      // 核心文件清单（相对路径 → fetch 内容）
      const files = [
        'app.js',
        'index.html',
        'server.js',
        'manifest.json',
        'version.json',
        'styles.css',
        'data/seed-data.js',
        'data/idiom-quiz-data.js',
        'data/high-idioms.js',
        'data/icons.js',
        'data/quiz/politics-quiz-1.js',
        'data/quiz/politics-quiz-2.js',
        'data/quiz/politics-quiz-3.js',
        'data/quiz/politics-quiz-4.js',
        'data/quiz/politics-quiz-5.js',
        'data/quiz/common-quiz-1.js',
        'data/quiz/common-quiz-2.js',
        'data/quiz/common-quiz-3.js',
        'data/quiz/common-quiz-4.js',
        'data/quiz/common-quiz-5.js',
        'data/quiz/common-quiz-6.js',
        'data/quiz/common-quiz-7.js',
        'data/quiz/real-common-quiz.js',
        '用户规则记录.md',
      ];

      let loaded = 0;
      for (const f of files) {
        try {
          const res = await fetch(f + '?_t=' + Date.now(), { cache: 'no-store' });
          if (res.ok) {
            const text = await res.text();
            zip.file(f, text);
            loaded++;
          } else {
            console.warn('exportCodePackage: 404 ' + f);
          }
        } catch (e) {
          console.warn('exportCodePackage: fetch fail ' + f, e);
        }
      }

      if (loaded === 0) {
        Utils.toast('打包失败：未能加载任何文件', 'error');
        return;
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = getLocalDateStr();
      a.href = url;
      a.download = `独行工作台-代码包-${dateStr}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Utils.toast(`代码包已导出（${loaded} 个文件）`, 'success');
    } catch (err) {
      Utils.toast('打包失败：' + err.message, 'error');
      console.error('exportCodePackage error:', err);
    }
  },
};

// ===== 各模块渲染器 =====
const ModuleRenderers = {};

// ========== 1. 每日计划 ==========
ModuleRenderers.plan = function() {
  const content = document.getElementById('content');
  const plans = DB.get('duxing_plans', []);

  const progress = plans.length > 0 ? (plans.filter(p => p.completed).length / plans.length * 100).toFixed(0) : 0;

  // 每日模块打卡状态
  const moduleCheckins = DB.getToday('duxing_module_checkins', {});
  const moduleList = [
    { key: 'news',     name: '每日新闻', icon: 'news' },
    { key: 'quiz',     name: '时政常识', icon: 'book' },
    { key: 'essay',    name: '申论素材', icon: 'pen' },
    { key: 'formula',  name: '公考必背', icon: 'formula' },
    { key: 'idiom',    name: '成语背诵', icon: 'target' },
    { key: 'resources',name: '练习', icon: 'compass' },
    { key: 'english',  name: '英语',     icon: 'globe' },
    { key: 'reading',  name: '每日阅读', icon: 'reading' },
  { key: 'exercise', name: '锻炼',     icon: 'dumbbell' },
  { key: 'interview', name: '面试专区', icon: 'interview' },
];
  const checkedCount = moduleList.filter(m => moduleCheckins[m.key]).length;

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('plan', 26)} 每日计划</div>
        <div class="page-subtitle">今日完成率 ${progress}% · 共 ${plans.length} 项</div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>

      <!-- 每日模块打卡 -->
      <div class="card module-checkin-card">
        <div class="module-checkin-header">
          <span class="module-checkin-title">${titleIcon('check', 16)} 每日打卡</span>
          <span class="module-checkin-count">${checkedCount}/${moduleList.length}</span>
        </div>
        <div class="module-checkin-grid">
          ${moduleList.map(m => `
            <div class="module-checkin-item ${moduleCheckins[m.key] ? 'checked' : ''}"
                 onclick="PlanModule.toggleCheckin('${m.key}')">
              <div class="module-checkin-icon">${ICONS[m.icon] || ICONS.plan}</div>
              <div class="module-checkin-name">${m.name}</div>
              <div class="module-checkin-mark">${moduleCheckins[m.key] ? '✓' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ===== 番茄时钟养树 ===== -->
      <div class="card pomodoro-card">
        <div class="pomodoro-header">
          <span class="pomodoro-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 13 L12 8"/><path d="M10 2 L14 2"/><path d="M12 2 L12 5"/></svg>
            番茄时钟 · 养树
          </span>
          <span class="pomodoro-status" id="pomoStatus">已暂停</span>
        </div>
        <div class="pomodoro-tree-area" id="pomoTreeArea"></div>
        <div class="pomodoro-timer" id="pomoTimer">00:00:00</div>
        <div class="pomodoro-progress"><div class="pomodoro-progress-fill" id="pomoProgressFill" style="width: 0%"></div></div>
        <div class="pomodoro-stats" id="pomoStats"></div>
        <div class="pomodoro-buttons">
          <button class="btn btn-green" id="pomoStartBtn" onclick="PomodoroModule.start()">开始</button>
          <button class="btn btn-secondary" id="pomoPauseBtn" onclick="PomodoroModule.pause()" style="display:none;">暂停</button>
          <button class="btn btn-secondary" onclick="PomodoroModule.reset()">重置</button>
        </div>
      </div>

      <div class="card">
        <div class="plan-input-row">
          <input type="text" class="input-field" id="planInput" placeholder="添加新的计划..." onkeypress="if(event.key==='Enter')PlanModule.add()">
          <select class="input-field" id="planPriority" style="width: 100px;">
            <option value="high">🔴 高</option>
            <option value="medium" selected>🟡 中</option>
            <option value="low">🟢 低</option>
          </select>
          <select class="input-field" id="planRepeat" style="width: 120px;">
            <option value="daily">每天重复</option>
            <option value="weekly">每周</option>
            <option value="once">仅一次</option>
          </select>
          <button class="btn btn-primary" onclick="PlanModule.add()">➕ 添加</button>
        </div>
      </div>

      <div id="planList"></div>
    </div>
  `;

  PlanModule.renderList();
  PomodoroModule.render();
};

const PlanModule = {
  add() {
    const input = document.getElementById('planInput');
    const priority = document.getElementById('planPriority').value;
    const repeat = document.getElementById('planRepeat').value;
    const text = input.value.trim();

    if (!text) {
      Utils.toast('请输入计划内容', 'error');
      return;
    }

    const plans = DB.get('duxing_plans', []);
    plans.push({
      id: Date.now().toString(),
      text,
      priority,
      repeat,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    });

    DB.set('duxing_plans', plans);
    input.value = '';
    ModuleRenderers.plan();
    StatusBar.update();
    Utils.toast('计划已添加');
  },

  toggle(id) {
    const plans = DB.get('duxing_plans', []);
    const plan = plans.find(p => p.id === id);
    if (plan) {
      plan.completed = !plan.completed;
      plan.completedAt = plan.completed ? new Date().toISOString() : null;
      DB.set('duxing_plans', plans);
      ModuleRenderers.plan();
      StatusBar.update();
    }
  },

  // 切换模块打卡状态
  toggleCheckin(key) {
    const checkins = DB.getToday('duxing_module_checkins', {});
    checkins[key] = !checkins[key];
    DB.setToday('duxing_module_checkins', checkins);
    ModuleRenderers.plan();
    StatusBar.update();
  },

  delete(id) {
    let plans = DB.get('duxing_plans', []);
    plans = plans.filter(p => p.id !== id);
    DB.set('duxing_plans', plans);
    ModuleRenderers.plan();
    StatusBar.update();
    Utils.toast('计划已删除');
  },

  renderList() {
    const plans = DB.get('duxing_plans', []);
    const listEl = document.getElementById('planList');

    if (plans.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" style="color: var(--pink-deep);">${ICONS.write}</div>
          <div class="empty-state-text">还没有计划，添加一个开始今天的旅程吧</div>
        </div>
      `;
      return;
    }

    // 排序：未完成在前，高优先级在前
    const sorted = [...plans].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const priorityTags = {
      high: '<span class="tag tag-orange">高</span>',
      medium: '<span class="tag tag-blue">中</span>',
      low: '<span class="tag tag-green">低</span>'
    };

    const repeatLabels = {
      daily: '<span class="tag tag-pink">每日</span>',
      weekly: '<span class="tag tag-blue">每周</span>',
      once: '<span class="tag tag-gray">单次</span>'
    };

    listEl.innerHTML = sorted.map(plan => `
      <div class="plan-item ${plan.completed ? 'completed' : ''}">
        <div class="plan-checkbox ${plan.completed ? 'checked' : ''}" onclick="PlanModule.toggle('${plan.id}')"></div>
        <span class="plan-text">${Utils.escape(plan.text)}</span>
        ${priorityTags[plan.priority]}
        ${repeatLabels[plan.repeat]}
        <button class="plan-delete" onclick="PlanModule.delete('${plan.id}')" title="删除">×</button>
      </div>
    `).join('');
  }
};

// ========== 2. 每日新闻（今日时政 + 粘贴录入） ==========
ModuleRenderers.news = function() {
  const content = document.getElementById('content');
  const tab = App.newsTab || 'affairs';

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('news', 26)} 每日新闻</div>
        <div class="page-subtitle">${Utils.formatDate()} · 时政要闻</div>
      </div>

      <div class="quiz-tabs">
        <div class="quiz-tab ${tab === 'affairs' ? 'active' : ''}" onclick="NewsModule.switchTab('affairs')">${titleIcon('news', 14)} 今日时政</div>
        <div class="quiz-tab ${tab === 'media' ? 'active' : ''}" onclick="NewsModule.switchTab('media')">${titleIcon('externalLink', 14)} 权威官媒</div>
        <div class="quiz-tab ${tab === 'paste' ? 'active' : ''}" onclick="NewsModule.switchTab('paste')">${titleIcon('write', 14)} 粘贴录入</div>
      </div>

      <div id="newsTabContent"></div>
    </div>
  `;

  NewsModule.renderTab();
};

const NewsModule = {
  // 权威官媒列表
  MEDIA_SOURCES: [
    { name: '新华社', short: '新华', url: 'http://www.xinhuanet.com/', color: '#e8c4c4', tag: '国家通讯社' },
    { name: '人民日报', short: '人民日报', url: 'http://www.people.com.cn/', color: '#d8c8c0', tag: '中央党报' },
    { name: '求是网', short: '求是', url: 'http://www.qstheory.cn/', color: '#c8d4c0', tag: '中央理论刊' },
    { name: '半月谈', short: '半月', url: 'http://www.banyuetan.org/', color: '#c0c8d8', tag: '时政半月刊' },
    { name: '新闻联播', short: 'CCTV', url: 'https://tv.cctv.com/lm/xwlb/', color: '#d0c8d4', tag: '央视新闻' },
    { name: '云南日报数字报', short: '云报', url: 'https://www.yndaily.com/', color: '#c4d4d8', tag: '云南党报' },
    { name: '学习强国·云南', short: '学习强国', url: 'https://yn.xuexi.cn/', color: '#e8d4c4', tag: '学习平台' },
    { name: '新闻联播极速版', short: 'B站联播', url: 'https://search.bilibili.com/all?keyword=新闻联播极速版&order=pubdate', color: '#fb7299', tag: 'B站·时政速览' },
  ],

  // 切换 tab
  switchTab(tab) {
    App.newsTab = tab;
    ModuleRenderers.news();
  },

  // 渲染当前 tab 内容
  renderTab() {
    const container = document.getElementById('newsTabContent');
    if (!container) return;
    const tab = App.newsTab || 'affairs';
    if (tab === 'paste') {
      this.renderPaste(container);
    } else if (tab === 'media') {
      this.renderMedia(container);
    } else {
      this.renderAffairs(container);
    }
  },

  // ===== 粘贴录入（独立 tab） =====
  renderPaste(container) {
    container.innerHTML = `
      <div class="card paste-card">
        <div class="paste-card-title">${titleIcon('write', 18)} 粘贴录入</div>
        <p class="paste-desc">粘贴新闻/文章原文，自动识别分类并提取要点。录入内容保存在本地，按分类展示在下方。</p>
        <textarea class="paste-textarea" id="pasteInput" placeholder="在这里粘贴原文...&#10;支持多段文字，会自动识别分类（时政/经济/科技/国际/社会/文化）并提取标题和要点" oninput="NewsModule.updatePasteHint()"></textarea>
        <div class="paste-actions">
          <button class="btn btn-primary" onclick="NewsModule.submitPaste()">整理并录入</button>
          <button class="btn btn-secondary" onclick="document.getElementById('pasteInput').value='';NewsModule.updatePasteHint()">清空输入</button>
          <span class="paste-hint" id="pasteHint"></span>
        </div>
      </div>
      <div id="pasteNotesContainer"></div>
    `;
    this.renderPasteNotes();
  },

  // 今日时政（5分类按钮组 + 各分类内容）
  renderAffairs(container) {
    const st = App.newsSectionState;
    container.innerHTML = `
      ${this.renderSectionBar()}
      <div id="newsSection-affairs" style="display:${st.affairs ? 'block' : 'none'}; margin-top:16px;">
        ${this.renderAffairsContent()}
      </div>
      <div id="newsSection-macro" style="display:${st.macro ? 'block' : 'none'}; margin-top:16px;">
        ${this.renderMacroPolitics()}
      </div>
      <div id="newsSection-hot" style="display:${st.hot ? 'block' : 'none'}; margin-top:16px;">
        ${this.renderHotEvents()}
      </div>
      <div id="newsSection-yunnan" style="display:${st.yunnan ? 'block' : 'none'}; margin-top:16px;">
        ${this.renderYunnanPolitics()}
      </div>
      <div id="newsSection-theory" style="display:${st.theory ? 'block' : 'none'}; margin-top:16px;">
        ${this.renderBasicTheory()}
      </div>
    `;
  },

  // 分类1：今日时政要闻内容（从原 renderAffairs 提取，逻辑零改动）
  renderAffairsContent() {
    const baseSeed = Utils.dateSeed();
    const seedOffset = DB.getToday('duxing_news_seed_offset', 0);
    const updateKey = DB.getToday('duxing_news_update_time', null);
    const affairs = Utils.seededShuffle(SEED_DATA.politicsDailyAffairs, baseSeed + seedOffset * 7919);
    const readState = DB.getToday('duxing_affairs_read', {});

    let updateTimeStr = '尚未更新';
    if (updateKey) {
      const d = new Date(updateKey);
      updateTimeStr = '更新于 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    return `
      <div class="news-list-header">
        <span class="news-list-header-text">${titleIcon('news', 18)} 今日时政要闻</span>
        <div class="news-update-info">
          <span class="news-update-time">${updateTimeStr}</span>
          <button class="news-update-btn" id="newsUpdateBtn" onclick="NewsModule.refreshAffairs()">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 A9 9 0 0 1 18 5 L21 8"/><path d="M21 3 L21 8 L16 8"/><path d="M21 12 A9 9 0 0 1 6 19 L3 16"/><path d="M3 21 L3 16 L8 16"/></svg>
            更新
          </button>
        </div>
      </div>
      ${affairs.map((item, i) => `
        <div class="news-item ${readState[i] ? 'read' : ''}" id="affair-${i}" onclick="NewsModule.toggleAffair(${i})">
          <div class="news-header">
            <div class="news-number">${i + 1}</div>
            <div class="news-title">
              <span class="affair-category">${Utils.escape(item.category)}</span>
              ${Utils.escape(item.title)}
            </div>
            <span class="news-expand-icon">▼</span>
          </div>
          <div class="news-detail">
            <div class="news-interpretation">
              ${item.date ? `<span class="news-date-tag">📅 ${Utils.escape(item.date)}</span><br><br>` : ''}
              <strong>📌 内容摘要</strong><br>
              ${Utils.nl2br(item.summary)}
              <br><br>
              <strong>🎯 关键要点</strong><br>
              ${Utils.nl2br(item.points)}
              <br><br>
              <strong>📚 考点关联</strong><br>
              <span class="exam-link-tag">${Utils.escape(item.examLink)}</span>
            </div>
          </div>
        </div>
      `).join('')}
    `;
  },

  // 5个横向分类按钮
  renderSectionBar() {
    const sections = [
      { key: 'affairs', label: '今日时政要闻', icon: 'news' },
      { key: 'macro',   label: '全国宏观时政', icon: 'book' },
      { key: 'hot',     label: '国内外热点',   icon: 'globe' },
      { key: 'yunnan',  label: '云南本土时政', icon: 'compass' },
      { key: 'theory',  label: '基础理论',     icon: 'pen' },
    ];
    const st = App.newsSectionState;
    return `
      <div class="news-section-bar">
        ${sections.map(s => `
          <div class="news-section-btn ${st[s.key] ? 'active' : ''}" data-key="${s.key}"
               onclick="NewsModule.toggleSection('${s.key}')">
            ${titleIcon(s.icon, 14)} ${s.label}
          </div>
        `).join('')}
      </div>
    `;
  },

  // 切换分类展开/收起
  toggleSection(key) {
    // 手风琴模式：先收起所有分类，再展开被点击的
    const allKeys = ['affairs', 'macro', 'hot', 'yunnan', 'theory'];
    allKeys.forEach(k => {
      App.newsSectionState[k] = false;
      const el = document.getElementById(`newsSection-${k}`);
      if (el) el.style.display = 'none';
      const btn = document.querySelector(`.news-section-btn[data-key="${k}"]`);
      if (btn) btn.classList.remove('active');
    });
    // 展开被点击的分类
    App.newsSectionState[key] = true;
    const targetEl = document.getElementById(`newsSection-${key}`);
    if (targetEl) targetEl.style.display = 'block';
    const targetBtn = document.querySelector(`.news-section-btn[data-key="${key}"]`);
    if (targetBtn) targetBtn.classList.add('active');
  },

  // 通用：分类头部（标题+更新按钮）
  renderSectionHeader(config) {
    let rightSide = '';
    if (config.showUpdateBtn) {
      rightSide += `
        <span class="news-update-time">${config.updateTimeStr}</span>
        <button class="news-update-btn" id="newsUpdateBtn-${config.sectionKey}" onclick="NewsModule.refreshSection('${config.sectionKey}')">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 A9 9 0 0 1 18 5 L21 8"/><path d="M21 3 L21 8 L16 8"/><path d="M21 12 A9 9 0 0 1 6 19 L3 16"/><path d="M3 21 L3 16 L8 16"/></svg>
          更新
        </button>
      `;
    }
    return `
      <div class="news-list-header">
        <span class="news-list-header-text">${titleIcon(config.icon, 18)} ${config.title}</span>
        <div class="news-update-info">${rightSide}</div>
      </div>
    `;
  },

  // 通用：新闻条目 HTML
  renderNewsItem(item, index, prefix) {
    const id = `${prefix}-${index}`;
    return `
      <div class="news-item" id="${id}" onclick="NewsModule.toggleNewsItem('${prefix}', ${index})">
        <div class="news-header">
          <div class="news-number">${index + 1}</div>
          <div class="news-title">
            <span class="affair-category">${Utils.escape(item.category)}</span>
            ${Utils.escape(item.title)}
          </div>
          <span class="news-expand-icon">▼</span>
        </div>
        <div class="news-detail">
          <div class="news-interpretation">
            ${item.date ? `<span class="news-date-tag">📅 ${Utils.escape(item.date)}</span><br><br>` : ''}
            <strong>📌 内容摘要</strong><br>
            ${Utils.nl2br(item.summary)}
            <br><br>
            <strong>🎯 关键要点</strong><br>
            ${Utils.nl2br(item.points)}
            <br><br>
            <strong>📚 考点关联</strong><br>
            <span class="exam-link-tag">${Utils.escape(item.examLink)}</span>
          </div>
        </div>
      </div>
    `;
  },

  // 通用：条目展开/折叠
  toggleNewsItem(prefix, index) {
    const item = document.getElementById(`${prefix}-${index}`);
    if (item) item.classList.toggle('expanded');
  },

  // 分类2：全国宏观时政
  renderMacroPolitics() {
    const data = SEED_DATA.newsMacroPolitics || [];
    const sectionKey = 'macro';
    const seedOffset = DB.getToday('duxing_news_macro_offset', 0);
    const updateTime = DB.getToday('duxing_news_macro_update_time', null);
    const seed = Utils.dateSeed() + 2000 + seedOffset * 7919;
    const shuffled = Utils.seededShuffle(data, seed);

    let updateTimeStr = '尚未更新';
    if (updateTime) {
      updateTimeStr = '更新于 ' + new Date(updateTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    return `
      ${this.renderSectionHeader({ title: '全国宏观时政', icon: 'book', sectionKey, showUpdateBtn: true, updateTimeStr })}
      ${shuffled.length === 0 ? '<div class="news-section-empty">暂无数据</div>' :
        shuffled.map((item, i) => this.renderNewsItem(item, i, 'macro')).join('')}
    `;
  },

  // 分类3：国内外热点事件
  renderHotEvents() {
    const data = SEED_DATA.newsHotEvents || [];
    const sectionKey = 'hot';
    const seedOffset = DB.getToday('duxing_news_hot_offset', 0);
    const updateTime = DB.getToday('duxing_news_hot_update_time', null);
    const seed = Utils.dateSeed() + 3000 + seedOffset * 7919;
    const shuffled = Utils.seededShuffle(data, seed);

    let updateTimeStr = '尚未更新';
    if (updateTime) {
      updateTimeStr = '更新于 ' + new Date(updateTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    return `
      ${this.renderSectionHeader({ title: '国内外热点事件', icon: 'globe', sectionKey, showUpdateBtn: true, updateTimeStr })}
      ${shuffled.length === 0 ? '<div class="news-section-empty">暂无数据</div>' :
        shuffled.map((item, i) => this.renderNewsItem(item, i, 'hot')).join('')}
    `;
  },

  // 分类4：云南本土时政（4个子栏目）
  renderYunnanPolitics() {
    const data = SEED_DATA.newsYunnanPolitics || [];
    const sectionKey = 'yunnan';
    const seedOffset = DB.getToday('duxing_news_yunnan_offset', 0);
    const updateTime = DB.getToday('duxing_news_yunnan_update_time', null);
    const baseSeed = Utils.dateSeed() + 4000 + seedOffset * 7919;

    let updateTimeStr = '尚未更新';
    if (updateTime) {
      updateTimeStr = '更新于 ' + new Date(updateTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    const subsectionTitles = {
      1: '省级重要会议与政策文件',
      2: '云南重点领域工作',
      3: '云南年度重大事件典型案例',
      4: '基础云南省情',
    };

    const subsections = [1, 2, 3, 4].map(num => {
      const items = data.filter(item => item.subsection === num);
      const subSeed = baseSeed + num * 1000;
      return { num, title: subsectionTitles[num], items: Utils.seededShuffle(items, subSeed) };
    });

    const hasAny = subsections.some(sub => sub.items.length > 0);

    return `
      ${this.renderSectionHeader({ title: '云南本土时政', icon: 'compass', sectionKey, showUpdateBtn: true, updateTimeStr })}
      ${!hasAny ? '<div class="news-section-empty">暂无数据</div>' :
        subsections.map(sub => this.renderYunnanSubsection(sub, sectionKey)).join('')}
    `;
  },

  // 云南单子栏目渲染
  renderYunnanSubsection(sub, sectionKey) {
    if (sub.items.length === 0) return '';
    return `
      <div class="yunnan-subsection">
        <div class="yunnan-subsection-title">
          <span class="yunnan-subsection-num">${sub.num}</span>
          ${Utils.escape(sub.title)}
        </div>
        ${sub.items.map((item, i) => this.renderNewsItem(item, i, `${sectionKey}-sub${sub.num}`)).join('')}
      </div>
    `;
  },

  // 分类5：基础理论（静态展示）
  renderBasicTheory() {
    const data = SEED_DATA.newsBasicTheory || [];
    return `
      <div class="news-list-header">
        <span class="news-list-header-text">${titleIcon('pen', 18)} 基础理论</span>
        <span class="news-update-time">静态内容</span>
      </div>
      ${data.length === 0 ? '<div class="news-section-empty">暂无数据</div>' :
        data.map((item, i) => this.renderTheoryItem(item, i)).join('')}
    `;
  },

  // 理论条目 HTML
  renderTheoryItem(item, index) {
    return `
      <div class="news-item theory-item" id="theory-${index}" onclick="NewsModule.toggleNewsItem('theory', ${index})">
        <div class="news-header">
          <div class="news-number">${index + 1}</div>
          <div class="news-title">
            <span class="affair-category">${Utils.escape(item.category)}</span>
            ${Utils.escape(item.title)}
          </div>
          <span class="news-expand-icon">▼</span>
        </div>
        <div class="news-detail">
          <div class="news-interpretation">
            ${Utils.nl2br(item.content)}
          </div>
        </div>
      </div>
    `;
  },

  // 分类2/3/4通用更新
  refreshSection(sectionKey) {
    const btn = document.getElementById(`newsUpdateBtn-${sectionKey}`);
    if (btn) {
      btn.classList.add('spinning');
      setTimeout(() => btn.classList.remove('spinning'), 800);
    }
    const offsetKey = `duxing_news_${sectionKey}_offset`;
    const timeKey = `duxing_news_${sectionKey}_update_time`;
    const offset = DB.getToday(offsetKey, 0);
    DB.setToday(offsetKey, offset + 1);
    DB.setToday(timeKey, Date.now());

    const sectionEl = document.getElementById(`newsSection-${sectionKey}`);
    if (sectionEl) {
      if (sectionKey === 'macro') sectionEl.innerHTML = this.renderMacroPolitics();
      else if (sectionKey === 'hot') sectionEl.innerHTML = this.renderHotEvents();
      else if (sectionKey === 'yunnan') sectionEl.innerHTML = this.renderYunnanPolitics();
    }
    Utils.toast('已更新');
  },

  // ===== 权威官媒（独立 tab） =====
  renderMedia(container) {
    container.innerHTML = `
      <div class="card news-video-card">
        <div class="card-title" style="display: flex; align-items: center; gap: 8px;">
          ${titleIcon('externalLink', 18)} 权威官媒直通车
        </div>
        <p class="news-media-desc">点击下方卡片直达权威媒体官网，获取一手时政资讯。</p>
        <div class="news-media-grid">
          ${this.MEDIA_SOURCES.map(m => `
            <a href="${m.url}" target="_blank" class="news-media-card" style="--media-color: ${m.color}">
              <div class="news-media-short">${m.short}</div>
              <div class="news-media-name">${m.name}</div>
              <div class="news-media-tag">${m.tag}</div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ===== 粘贴录入相关 =====
  PASTE_KEY: 'duxing_paste_notes',

  // 分类关键词表
  CATEGORY_KEYWORDS: {
    politics: { name: '时政', cls: 'paste-cat-politics', words: ['会议', '总书记', '主席', '总理', '党中央', '国务院', '政策', '文件', '指示', '批示', '讲话', '精神', '贯彻', '落实', '党委', '政府', '人大', '政协', '十九届', '二十届', '中央', '省委', '市委', '脱贫', '攻坚', '振兴', '党建', '反腐', '巡视', '纪律'] },
    economy:  { name: '经济', cls: 'paste-cat-economy', words: ['GDP', '经济', '增长', '消费', '投资', '出口', '进口', '贸易', '金融', '股市', '基金', '银行', '利率', '通胀', '物价', '就业', '失业', '企业', '产业', '制造业', '服务业', '农业', '数字货币', '人民币', '汇率', '税收', '财政', '预算', '基建', '房地产'] },
    tech:     { name: '科技', cls: 'paste-cat-tech', words: ['技术', '科技', '人工智能', 'AI', '5G', '6G', '芯片', '半导体', '量子', '航天', '卫星', '火箭', '基因', '生物', '医药', '疫苗', '互联网', '数据', '算法', '算力', '新能源', '光伏', '电池', '电动车', '自动驾驶', '专利', '创新', '研发'] },
    intl:     { name: '国际', cls: 'paste-cat-intl', words: ['美国', '俄罗斯', '日本', '韩国', '欧盟', '英国', '法国', '德国', '印度', '巴西', '非洲', '中东', '联合国', '北约', 'G20', 'G7', '东盟', '阿盟', '欧盟', '峰会', '外交', '访华', '访问', '会谈', '制裁', '关税', '贸易战', '北约', '冲突', '战争', '和平'] },
    social:   { name: '社会', cls: 'paste-cat-social', words: ['民生', '教育', '医疗', '养老', '社保', '住房', '交通', '事故', '灾害', '天气', '暴雨', '地震', '洪水', '台风', '疫情', '防控', '安全', '食品', '环境', '污染', '碳排放', '人口', '生育', '老龄', '就业', '工资', '收入'] },
    culture:  { name: '文化', cls: 'paste-cat-culture', words: ['文化', '艺术', '文学', '电影', '音乐', '戏剧', '博物馆', '文物', '遗产', '非遗', '旅游', '体育', '奥运', '亚运', '全运', '冠军', '赛事', '书展', '出版', '历史', '考古', '哲学', '宗教', '节日'] },
  },

  // 识别分类
  detectCategory(text) {
    let best = 'other';
    let bestScore = 0;
    for (const key in this.CATEGORY_KEYWORDS) {
      const cat = this.CATEGORY_KEYWORDS[key];
      let score = 0;
      for (const w of cat.words) {
        if (text.includes(w)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = key;
      }
    }
    return best;
  },

  // 提取标题（取第一个非空行，截断到合适长度）
  extractTitle(text) {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '无标题';
    let title = lines[0];
    // 如果第一行太短，尝试拼接
    if (title.length < 6 && lines.length > 1) {
      title = lines[0] + ' ' + lines[1];
    }
    // 截断
    if (title.length > 40) title = title.substring(0, 40) + '...';
    return title;
  },

  // 提取要点（按段落/句子切分，取前几条）
  extractPoints(text) {
    // 按换行或句号分句
    const sentences = text
      .replace(/\n+/g, '\n')
      .split(/[。\n！？]/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 80);

    // 去重并取前 5 条
    const unique = [...new Set(sentences)];
    return unique.slice(0, 5);
  },

  // 提交粘贴
  submitPaste() {
    const input = document.getElementById('pasteInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) {
      Utils.toast('请先粘贴一些内容', 'error');
      return;
    }
    if (text.length < 15) {
      Utils.toast('内容太短，请粘贴完整段落', 'error');
      return;
    }

    const category = this.detectCategory(text);
    const title = this.extractTitle(text);
    const points = this.extractPoints(text);

    const notes = DB.get(this.PASTE_KEY, []);
    notes.unshift({
      id: Date.now(),
      title: title,
      category: category,
      points: points,
      raw: text,
      time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    });
    DB.set(this.PASTE_KEY, notes);

    input.value = '';
    const hint = document.getElementById('pasteHint');
    if (hint) hint.textContent = '';
    Utils.toast('已整理并录入');
    this.renderPasteNotes();
  },

  // 删除笔记
  deletePaste(id) {
    const notes = DB.get(this.PASTE_KEY, []);
    const filtered = notes.filter(n => n.id !== id);
    DB.set(this.PASTE_KEY, filtered);
    this.renderPasteNotes();
    Utils.toast('已删除');
  },

  // 清空所有笔记
  clearAllPaste() {
    const notes = DB.get(this.PASTE_KEY, []);
    if (notes.length === 0) {
      Utils.toast('暂无笔记可清空', 'error');
      return;
    }
    if (confirm(`确定清空全部 ${notes.length} 条录入笔记吗？`)) {
      DB.set(this.PASTE_KEY, []);
      this.renderPasteNotes();
      Utils.toast('已清空');
    }
  },

  // 实时提示字数
  updatePasteHint() {
    const input = document.getElementById('pasteInput');
    const hint = document.getElementById('pasteHint');
    if (!input || !hint) return;
    const len = input.value.trim().length;
    if (len === 0) {
      hint.textContent = '';
    } else {
      const cat = this.detectCategory(input.value);
      const catName = this.CATEGORY_KEYWORDS[cat] ? this.CATEGORY_KEYWORDS[cat].name : '其他';
      hint.textContent = `${len} 字 · 识别分类：${catName}`;
    }
  },

  // 渲染已录入笔记（按分类分组）
  renderPasteNotes() {
    const container = document.getElementById('pasteNotesContainer');
    if (!container) return;

    const notes = DB.get(this.PASTE_KEY, []);

    if (notes.length === 0) {
      container.innerHTML = `
        <div class="paste-notes-header">
          <span class="paste-notes-header-title">${titleIcon('note', 16)} 已录入笔记</span>
        </div>
        <div class="paste-notes-empty">暂无录入内容，在上方粘贴原文试试吧</div>
      `;
      return;
    }

    // 按分类分组
    const groups = {};
    const order = ['politics', 'economy', 'tech', 'intl', 'social', 'culture', 'other'];
    notes.forEach(n => {
      const c = n.category || 'other';
      if (!groups[c]) groups[c] = [];
      groups[c].push(n);
    });

    let html = `
      <div class="paste-notes-header">
        <span class="paste-notes-header-title">${titleIcon('note', 16)} 已录入笔记（${notes.length}）</span>
        <button class="paste-notes-clear" onclick="NewsModule.clearAllPaste()">清空全部</button>
      </div>
    `;

    order.forEach(catKey => {
      if (!groups[catKey]) return;
      const catInfo = this.CATEGORY_KEYWORDS[catKey] || { name: '其他', cls: 'paste-cat-other' };
      html += `
        <div class="paste-category-group">
          <span class="paste-category-tag ${catInfo.cls}">${catInfo.name}（${groups[catKey].length}）</span>
          ${groups[catKey].map(n => `
            <div class="paste-note-item">
              <div class="paste-note-meta">
                <span class="paste-note-time">${Utils.escape(n.time || '')}</span>
                <button class="paste-note-del" onclick="NewsModule.deletePaste(${n.id})">×</button>
              </div>
              <div class="paste-note-title">${Utils.escape(n.title)}</div>
              <div class="paste-note-body">${Utils.nl2br(n.raw.length > 200 ? n.raw.substring(0, 200) + '...' : n.raw)}</div>
              ${n.points && n.points.length > 0 ? `
                <div class="paste-note-points">
                  <div class="paste-note-points-label">提取要点</div>
                  ${n.points.map(p => `<div class="paste-note-point">${Utils.escape(p)}</div>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // 更新时政要闻（换一批）
  refreshAffairs() {
    const btn = document.getElementById('newsUpdateBtn');
    if (btn) {
      btn.classList.add('spinning');
      setTimeout(() => btn.classList.remove('spinning'), 800);
    }
    // 种子偏移 +1，换一批要闻
    const offset = DB.getToday('duxing_news_seed_offset', 0);
    DB.setToday('duxing_news_seed_offset', offset + 1);
    // 记录更新时间
    DB.setToday('duxing_news_update_time', Date.now());
    // 清除已读状态
    DB.setToday('duxing_affairs_read', {});
    // 重新渲染分类1内容区域
    const sectionEl = document.getElementById('newsSection-affairs');
    if (sectionEl) sectionEl.innerHTML = this.renderAffairsContent();
    Utils.toast('已更新时政要闻');
  },

  // 展开/折叠时政要闻
  toggleAffair(index) {
    const item = document.getElementById(`affair-${index}`);
    if (!item) return;
    item.classList.toggle('expanded');

    if (!item.classList.contains('read')) {
      item.classList.add('read');
      const readState = DB.getToday('duxing_affairs_read', {});
      readState[index] = true;
      DB.setToday('duxing_affairs_read', readState);
    }
  }
};

// ========== 3. 时政常识 ==========
ModuleRenderers.quiz = function() {
  const content = document.getElementById('content');
  const progress = DB.get('duxing_quiz_progress', { politics: { done: 0, correct: 0 }, common: { done: 0, correct: 0 } });
  const wrongCount = DB.get('duxing_quiz_wrong', []).length;

  const type = App.quizState.type;
  const stats = progress[type] || { done: 0, correct: 0 };
  const accuracy = stats.done > 0 ? Math.round(stats.correct / stats.done * 100) : 0;

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('book', 26)} 时政常识</div>
        <div class="page-subtitle">每日一练，积少成多</div>
      </div>

      <div class="quiz-stats">
        <div class="quiz-stat-card">
          <div class="quiz-stat-num" id="quizStatDone">${stats.done}</div>
          <div class="quiz-stat-label">已做题数</div>
        </div>
        <div class="quiz-stat-card">
          <div class="quiz-stat-num" id="quizStatAccuracy">${accuracy}%</div>
          <div class="quiz-stat-label">正确率</div>
        </div>
        <div class="quiz-stat-card">
          <div class="quiz-stat-num" id="quizStatWrong">${wrongCount}</div>
          <div class="quiz-stat-label">错题数</div>
        </div>
      </div>

      <div class="quiz-tabs">
        <div class="quiz-tab ${type === 'politics' ? 'active' : ''}" onclick="QuizModule.switchType('politics')">📜 时政</div>
        <div class="quiz-tab ${type === 'common' ? 'active' : ''}" onclick="QuizModule.switchType('common')">${titleIcon('book', 14)} 常识</div>
        <div class="quiz-tab ${type === 'wrong' ? 'active' : ''}" onclick="QuizModule.switchType('wrong')">❌ 错题本 (${wrongCount})</div>
      </div>

      <div id="quizContent"></div>
    </div>
  `;

  QuizModule.renderQuestion();
};

const QuizModule = {
  switchType(type) {
    App.quizState = { type, index: 0, answered: false, selectedOption: -1 };
    // 切换题型时恢复该题型当天的持久化进度，避免切回时回到第 1 题（错题本除外）
    if (type !== 'wrong') {
      App.quizState.index = DB.get(`duxing_quiz_index_${type}_${App.today}`, 0);
    }
    ModuleRenderers.quiz();
  },

  getQuestions() {
    const type = App.quizState.type;
    if (type === 'wrong') {
      return DB.get('duxing_quiz_wrong', []);
    }
    // 合并所有题库：时政题来自 politics-quiz-*.js + seed-data；常识题来自 common-quiz-*.js + real-common-quiz.js + seed-data
    let source = [];
    if (type === 'politics') {
      source = [
        ...(typeof POLITICS_QUIZ_1 !== 'undefined' ? POLITICS_QUIZ_1 : []),
        ...(typeof POLITICS_QUIZ_2 !== 'undefined' ? POLITICS_QUIZ_2 : []),
        ...(typeof POLITICS_QUIZ_3 !== 'undefined' ? POLITICS_QUIZ_3 : []),
        ...(typeof POLITICS_QUIZ_4 !== 'undefined' ? POLITICS_QUIZ_4 : []),
        ...(typeof POLITICS_QUIZ_5 !== 'undefined' ? POLITICS_QUIZ_5 : []),
        ...SEED_DATA.politicsQuiz,
      ];
    } else {
      source = [
        ...(typeof COMMON_QUIZ_1 !== 'undefined' ? COMMON_QUIZ_1 : []),
        ...(typeof COMMON_QUIZ_2 !== 'undefined' ? COMMON_QUIZ_2 : []),
        ...(typeof COMMON_QUIZ_3 !== 'undefined' ? COMMON_QUIZ_3 : []),
        ...(typeof COMMON_QUIZ_4 !== 'undefined' ? COMMON_QUIZ_4 : []),
        ...(typeof COMMON_QUIZ_5 !== 'undefined' ? COMMON_QUIZ_5 : []),
        ...(typeof COMMON_QUIZ_6 !== 'undefined' ? COMMON_QUIZ_6 : []),
        ...(typeof COMMON_QUIZ_7 !== 'undefined' ? COMMON_QUIZ_7 : []),
        ...(typeof REAL_COMMON_QUIZ !== 'undefined' ? REAL_COMMON_QUIZ : []),
        ...SEED_DATA.commonQuiz,
      ];
    }
    const seed = Utils.dateSeed();
    return Utils.seededShuffle(source, seed);
  },

  renderQuestion() {
    const questions = this.getQuestions();
    const idx = App.quizState.index;

    if (idx >= questions.length) {
      document.getElementById('quizContent').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" style="color: var(--pink-deep);">${ICONS.party}</div>
          <div class="empty-state-text">${App.quizState.type === 'wrong' ? '错题本已清空！' : '今日题目已全部完成！'}</div>
          <button class="btn btn-primary mt-16" onclick="QuizModule.restart()">重新开始</button>
        </div>
      `;
      return;
    }

    const q = questions[idx];
    const letters = ['A', 'B', 'C', 'D'];

    document.getElementById('quizContent').innerHTML = `
      <div class="quiz-question">
        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span class="tag tag-pink">第 ${idx + 1} 题</span>
            <span class="tag tag-gray">${App.quizState.type === 'politics' ? '时政' : App.quizState.type === 'common' ? '常识' : '错题'}</span>
          </div>
          <div id="quizNext" style="display:none;">
            <button class="btn btn-primary btn-small" onclick="QuizModule.next()">下一题 →</button>
          </div>
        </div>
        <div class="quiz-question-text">${Utils.escape(q.q)}</div>
        <div id="quizOptions">
          ${q.options.map((opt, i) => `
            <div class="quiz-option" id="opt-${i}" onclick="QuizModule.select(${i})">
              <div class="quiz-option-letter">${letters[i]}</div>
              <div class="quiz-option-text">${Utils.escape(opt)}</div>
            </div>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="quizExplanation">
          <strong style="color: #5a7e94;">💡 解析</strong><br><br>
          ${Utils.nl2br(q.explanation)}
        </div>
      </div>
    `;
  },

  select(i) {
    if (App.quizState.answered) return;

    const questions = this.getQuestions();
    const q = questions[App.quizState.index];
    App.quizState.answered = true;
    App.quizState.selectedOption = i;

    const letters = ['A', 'B', 'C', 'D'];

    // 标记选项
    q.options.forEach((opt, idx) => {
      const el = document.getElementById(`opt-${idx}`);
      if (idx === q.answer) {
        el.classList.add('correct');
      } else if (idx === i && i !== q.answer) {
        el.classList.add('wrong');
      }
    });

    // 显示解析
    document.getElementById('quizExplanation').classList.add('show');
    document.getElementById('quizNext').style.display = 'block';

    // 记录答题结果
    const isCorrect = i === q.answer;
    const progress = DB.get('duxing_quiz_progress', { politics: { done: 0, correct: 0 }, common: { done: 0, correct: 0 } });
    const type = App.quizState.type;

    if (type === 'politics' || type === 'common') {
      if (!progress[type]) progress[type] = { done: 0, correct: 0 };
      progress[type].done++;
      if (isCorrect) progress[type].correct++;
      DB.set('duxing_quiz_progress', progress);
    }

    // 错题收集
    if (!isCorrect) {
      const wrong = DB.get('duxing_quiz_wrong', []);
      // 检查是否已在错题本中
      const exists = wrong.some(w => w.q === q.q);
      if (!exists) {
        wrong.push({ ...q, wrongAnswer: i, addedAt: new Date().toISOString() });
        DB.set('duxing_quiz_wrong', wrong);
      }
    } else {
      // 答对了，如果是错题本中的题则移除
      const wrong = DB.get('duxing_quiz_wrong', []);
      const filtered = wrong.filter(w => w.q !== q.q);
      DB.set('duxing_quiz_wrong', filtered);
    }

    StatusBar.update();
    this.updateStats();
  },

  // 实时更新统计卡片
  updateStats() {
    const progress = DB.get('duxing_quiz_progress', { politics: { done: 0, correct: 0 }, common: { done: 0, correct: 0 } });
    const wrongCount = DB.get('duxing_quiz_wrong', []).length;
    const type = App.quizState.type;
    if (type !== 'politics' && type !== 'common') return;
    const stats = progress[type] || { done: 0, correct: 0 };
    const accuracy = stats.done > 0 ? Math.round(stats.correct / stats.done * 100) : 0;

    const elDone = document.getElementById('quizStatDone');
    const elAccuracy = document.getElementById('quizStatAccuracy');
    const elWrong = document.getElementById('quizStatWrong');
    if (elDone) elDone.textContent = stats.done;
    if (elAccuracy) elAccuracy.textContent = accuracy + '%';
    if (elWrong) elWrong.textContent = wrongCount;

    // 同步更新错题本 tab 上的数字
    const wrongTab = document.querySelector('.quiz-tab[onclick*="wrong"]');
    if (wrongTab) wrongTab.textContent = '❌ 错题本 (' + wrongCount + ')';
  },

  next() {
    App.quizState.index++;
    DB.set(`duxing_quiz_index_${App.quizState.type}_${App.today}`, App.quizState.index);
    App.quizState.answered = false;
    App.quizState.selectedOption = -1;
    this.renderQuestion();
  },

  restart() {
    App.quizState.index = 0;
    DB.set(`duxing_quiz_index_${App.quizState.type}_${App.today}`, 0);
    App.quizState.answered = false;
    App.quizState.selectedOption = -1;
    this.renderQuestion();
  }
};

// ========== 4. 申论素材 ==========
ModuleRenderers.essay = function() {
  const content = document.getElementById('content');
  const tab = App.essayState.tab;

  const tabs = [
    { key: 'words',      icon: 'write', label: '规范词' },
    { key: 'hotwords',   icon: 'news',  label: '热词' },
    { key: 'quotes',     icon: 'pen',   label: '金句' },
    { key: 'cases',      icon: 'book',  label: '素材' },
    { key: 'correction', icon: 'note',  label: '批改' },
  ];

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('pen', 26)} 申论素材</div>
        <div class="page-subtitle">规范词 · 热词 · 金句 · 素材 · AI批改</div>
      </div>
      <div class="quiz-tabs essay-tabs">
        ${tabs.map(t => `
          <div class="quiz-tab ${tab === t.key ? 'active' : ''}" onclick="EssayModule.switchTab('${t.key}')">
            ${titleIcon(t.icon, 14)} ${t.label}
          </div>
        `).join('')}
      </div>
      <div id="essayContent"></div>
    </div>
  `;

  const renderers = {
    words:      () => EssayModule.renderWords(),
    hotwords:   () => EssayModule.renderHotWords(),
    quotes:     () => EssayModule.renderQuotes(),
    cases:      () => EssayModule.renderCases(),
    correction: () => EssayModule.renderCorrection(),
  };
  (renderers[tab] || renderers.words)();
};

const EssayModule = {
  // ===== 通用 =====
  switchTab(tab) {
    App.essayState.tab = tab;
    ModuleRenderers.essay();
  },

  categoryColor(cat) {
    const map = { '经济': 'pink', '政治': 'blue', '文化': 'orange', '社会': 'pink', '生态': 'green', '民生': 'gray' };
    return map[cat] || 'gray';
  },

  // ===== Tab1: 规范词 =====
  renderWords() {
    const st = App.essayState;
    if (st.wordMode === 'recite') return this.renderRecite();

    const category = st.wordCategory;
    const searchInput = document.getElementById('essaySearch');
    const search = searchInput ? searchInput.value : '';

    let words = SEED_DATA.essayStandardWords;
    if (category !== 'all') words = words.filter(w => w.category === category);
    if (search) words = words.filter(w => w.word.includes(search) || w.meaning.includes(search) || (w.plainText && w.plainText.includes(search)));

    const categories = ['all', '经济', '政治', '文化', '社会', '生态', '民生'];

    document.getElementById('essayContent').innerHTML = `
      <div class="essay-toolbar">
        <input type="text" class="input-field essay-search" id="essaySearch"
               placeholder="搜索规范词 / 大白话 / 含义..."
               value="${Utils.escape(search)}" oninput="EssayModule.renderWords()">
        <button class="btn btn-primary essay-recite-btn" onclick="EssayModule.startRecite()">
          ${titleIcon('write', 14)} 背诵模式
        </button>
      </div>
      <div class="essay-category-bar">
        ${categories.map(c => `
          <span class="essay-category-btn ${category === c ? 'active' : ''}"
                onclick="EssayModule.setCategory('${c}')">${c === 'all' ? '全部' : c}</span>
        `).join('')}
      </div>
      <div class="essay-word-list">
        ${words.length === 0 ? '<div class="essay-empty">未找到匹配的规范词</div>' :
          words.map(w => `
            <div class="essay-word-card">
              <div class="essay-word-body">
                <div class="essay-word-plain">${Utils.escape(w.plainText || '')}</div>
                <div class="essay-word-arrow">→</div>
                <div class="essay-word">${Utils.escape(w.word)}</div>
              </div>
              <div class="essay-word-meaning">${Utils.escape(w.meaning)}</div>
              <span class="tag tag-${this.categoryColor(w.category)}">${w.category}</span>
            </div>
          `).join('')}
      </div>
    `;
  },

  setCategory(cat) {
    App.essayState.wordCategory = cat;
    this.renderWords();
  },

  startRecite() {
    App.essayState.wordMode = 'recite';
    App.essayState.reciteIndex = 0;
    App.essayState.reciteFlipped = false;
    this.renderRecite();
  },

  renderRecite() {
    const st = App.essayState;
    let words = SEED_DATA.essayStandardWords;
    if (st.wordCategory !== 'all') words = words.filter(w => w.category === st.wordCategory);

    if (words.length === 0) {
      document.getElementById('essayContent').innerHTML = '<div class="essay-empty">暂无词汇，请选择其他分类</div>';
      return;
    }

    const idx = Math.min(st.reciteIndex, words.length - 1);
    const w = words[idx];

    document.getElementById('essayContent').innerHTML = `
      <div class="essay-recite-header">
        <button class="btn btn-secondary" onclick="EssayModule.exitRecite()">← 返回浏览</button>
        <span class="tag tag-blue">${idx + 1} / ${words.length}</span>
        <span class="tag tag-${this.categoryColor(w.category)}">${w.category}</span>
      </div>
      <div class="recite-card ${st.reciteFlipped ? 'flipped' : ''}" onclick="EssayModule.flipCard()">
        <div class="recite-card-inner">
          <div class="recite-card-front">
            <div class="recite-card-label">大白话</div>
            <div class="recite-card-text">${Utils.escape(w.plainText || w.word)}</div>
            <div class="recite-card-hint">点击翻面查看规范表述</div>
          </div>
          <div class="recite-card-back">
            <div class="recite-card-label">规范词</div>
            <div class="recite-card-word">${Utils.escape(w.word)}</div>
            <div class="recite-card-meaning">${Utils.escape(w.meaning)}</div>
          </div>
        </div>
      </div>
      <div class="essay-recite-nav">
        <button class="btn btn-secondary" onclick="EssayModule.prevRecite()" ${idx === 0 ? 'disabled' : ''}>← 上一个</button>
        <button class="btn btn-primary" onclick="EssayModule.nextRecite(${words.length})" ${idx === words.length - 1 ? 'disabled' : ''}>下一个 →</button>
      </div>
    `;
  },

  flipCard() {
    App.essayState.reciteFlipped = !App.essayState.reciteFlipped;
    const card = document.querySelector('.recite-card');
    if (card) card.classList.toggle('flipped');
  },

  prevRecite() {
    if (App.essayState.reciteIndex > 0) {
      App.essayState.reciteIndex--;
      App.essayState.reciteFlipped = false;
      this.renderRecite();
    }
  },

  nextRecite(len) {
    if (App.essayState.reciteIndex < len - 1) {
      App.essayState.reciteIndex++;
      App.essayState.reciteFlipped = false;
      this.renderRecite();
    }
  },

  exitRecite() {
    App.essayState.wordMode = 'browse';
    this.renderWords();
  },

  // ===== Tab2: 热词 =====
  renderHotWords() {
    const searchInput = document.getElementById('essayHotSearch');
    const search = searchInput ? searchInput.value : '';
    let words = SEED_DATA.essayHotWords;
    if (search) {
      words = words.filter(w =>
        w.term.includes(search) || w.fullExpression.includes(search) ||
        w.scenario.includes(search) || w.example.includes(search)
      );
    }

    document.getElementById('essayContent').innerHTML = `
      <input type="text" class="input-field mb-16" id="essayHotSearch"
             placeholder="搜索热词..." value="${Utils.escape(search)}"
             oninput="EssayModule.renderHotWords()">
      <div class="essay-hotword-list">
        ${words.length === 0 ? '<div class="essay-empty">未找到匹配的热词</div>' :
          words.map((w, i) => `
            <div class="essay-hotword-card">
              <div class="essay-hotword-header">
                <span class="essay-hotword-term">${Utils.escape(w.term)}</span>
                <span class="tag tag-blue">#${i + 1}</span>
              </div>
              <div class="essay-hotword-expression">${Utils.escape(w.fullExpression)}</div>
              <div class="essay-hotword-section">
                <span class="essay-hotword-label">使用场景</span>
                <div class="essay-hotword-content">${Utils.escape(w.scenario)}</div>
              </div>
              <div class="essay-hotword-section">
                <span class="essay-hotword-label">真题例句</span>
                <div class="essay-hotword-content essay-hotword-example">${Utils.escape(w.example)}</div>
              </div>
            </div>
          `).join('')}
      </div>
    `;
  },

  // ===== Tab3: 金句 =====
  renderQuotes() {
    const type = App.essayState.quoteType;
    const typeMap = {
      quote:    '金句摘抄',
      sentence: '万能句式',
      subpoint: '分论点话术',
    };

    let items = SEED_DATA.essayGoldenQuotes.filter(q => q.type === type);

    // 按主题分组
    const groups = {};
    items.forEach(q => {
      if (!groups[q.theme]) groups[q.theme] = [];
      groups[q.theme].push(q);
    });

    document.getElementById('essayContent').innerHTML = `
      <div class="essay-quote-types">
        ${Object.entries(typeMap).map(([k, v]) => `
          <span class="essay-quote-type-btn ${type === k ? 'active' : ''}"
                onclick="EssayModule.setQuoteType('${k}')">${v}</span>
        `).join('')}
      </div>
      <div class="essay-quote-groups">
        ${Object.entries(groups).map(([theme, qs]) => `
          <div class="essay-quote-group">
            <div class="essay-quote-theme">${Utils.escape(theme)}</div>
            ${qs.map(q => `
              <div class="essay-quote-card ${type === 'sentence' ? 'essay-quote-sentence' : ''}">
                <div class="essay-quote-content">${Utils.escape(q.content)}</div>
                ${q.source ? `<div class="essay-quote-source">—— ${Utils.escape(q.source)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  },

  setQuoteType(type) {
    App.essayState.quoteType = type;
    this.renderQuotes();
  },

  // ===== Tab4: 素材 =====
  renderCases() {
    const filter = App.essayState.caseFilter;
    const bookmarks = DB.get('duxing_essay_case_bookmarks', []);
    const seed = Utils.dateSeed();
    const allCases = SEED_DATA.essayCases;
    const dailyPicks = Utils.seededShuffle([...allCases], seed).slice(0, 3);

    let cases = allCases;
    if (filter !== 'all') cases = cases.filter(c => c.type === filter);

    document.getElementById('essayContent').innerHTML = `
      <div class="essay-daily-section">
        <div class="essay-daily-title">今日推荐 (${App.today})</div>
        <div class="essay-daily-list">
          ${dailyPicks.map(c => this.renderCaseCard(c, allCases.indexOf(c), bookmarks)).join('')}
        </div>
      </div>
      <div class="essay-case-filters">
        ${['all', 'person', 'era'].map(f => `
          <span class="essay-category-btn ${filter === f ? 'active' : ''}"
                onclick="EssayModule.setCaseFilter('${f}')">
            ${f === 'all' ? '全部' : f === 'person' ? '人物案例' : '时代案例'}
          </span>
        `).join('')}
      </div>
      <div class="essay-case-list">
        ${cases.map(c => this.renderCaseCard(c, allCases.indexOf(c), bookmarks)).join('')}
      </div>
    `;
  },

  renderCaseCard(c, index, bookmarks) {
    const isBookmarked = bookmarks.includes(index);
    return `
      <div class="essay-case-card">
        <div class="essay-case-header">
          <span class="tag tag-${c.type === 'person' ? 'orange' : 'blue'}">
            ${c.type === 'person' ? '人物' : '时代'}
          </span>
          <span class="essay-case-name">${Utils.escape(c.name)}</span>
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}"
                  onclick="EssayModule.toggleCaseBookmark(${index})">
            ${isBookmarked ? '★' : '☆'}
          </button>
        </div>
        <div class="essay-case-desc">${Utils.escape(c.description)}</div>
        <div class="essay-case-keywords">
          ${c.keywords.map(k => `<span class="essay-keyword">${Utils.escape(k)}</span>`).join('')}
        </div>
      </div>
    `;
  },

  setCaseFilter(f) {
    App.essayState.caseFilter = f;
    this.renderCases();
  },

  toggleCaseBookmark(index) {
    const bookmarks = DB.get('duxing_essay_case_bookmarks', []);
    const pos = bookmarks.indexOf(index);
    if (pos >= 0) bookmarks.splice(pos, 1);
    else bookmarks.push(index);
    DB.set('duxing_essay_case_bookmarks', bookmarks);
    this.renderCases();
    Utils.toast(bookmarks.includes(index) ? '已收藏' : '已取消收藏');
  },

  // ===== Tab5: 批改 =====
  renderCorrection() {
    const st = App.essayState.correction;

    document.getElementById('essayContent').innerHTML = `
      <div class="essay-correction-page">
        <div class="essay-correction-input">
          <label class="essay-correction-label">申论题目</label>
          <textarea class="input-field essay-correction-topic" id="correctionTopic"
                    placeholder="请输入申论题目（如：请结合给定资料，以乡村振兴为主题写一篇文章）"
                    rows="2">${Utils.escape(st.topic)}</textarea>

          <label class="essay-correction-label">你的答案</label>
          <textarea class="input-field essay-correction-answer" id="correctionAnswer"
                    placeholder="在此输入你的申论作答内容..." rows="10">${Utils.escape(st.answer)}</textarea>

          <div class="essay-correction-photo">
            <label class="essay-correction-label">拍照/选图（对照图片手动输入答案后批改）</label>
            <div class="essay-photo-area">
              <input type="file" id="correctionPhoto" accept="image/*" capture="environment"
                     style="display:none" onchange="EssayModule.takePhoto()">
              <button class="btn btn-secondary" onclick="document.getElementById('correctionPhoto').click()">
                ${titleIcon('note', 14)} ${st.photoData ? '重新拍照' : '拍照/选图'}
              </button>
              ${st.photoData ? `
                <div class="essay-photo-preview">
                  <img src="${st.photoData}" alt="答卷照片" onclick="EssayModule.previewPhoto()">
                  <span class="essay-photo-tip">图片仅供参考，请将内容手动输入上方文本框</span>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="essay-correction-api">
            <details class="essay-api-details">
              <summary>使用 AI 大模型批改（可选，不填则用模拟批改）</summary>
              <input type="password" class="input-field" id="correctionApiKey"
                     placeholder="输入 API Key（如 DeepSeek / OpenAI）"
                     value="${Utils.escape(DB.get('duxing_essay_api_key', ''))}">
              <select class="input-field" id="correctionApiProvider">
                <option value="deepseek">DeepSeek</option>
                <option value="openai">OpenAI</option>
              </select>
            </details>
          </div>

          <button class="btn btn-primary essay-correction-submit"
                  onclick="EssayModule.submitCorrection()"
                  ${st.loading ? 'disabled' : ''}>
            ${st.loading ? '批改中...' : '开始批改'}
          </button>
        </div>

        <div id="correctionReport">
          ${st.report ? this.renderReportHTML(st.report) : ''}
        </div>
      </div>
    `;
  },

  takePhoto() {
    const input = document.getElementById('correctionPhoto');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        App.essayState.correction.photoData = e.target.result;
        this.renderCorrection();
        Utils.toast('图片已加载，请手动输入答案');
      };
      reader.readAsDataURL(input.files[0]);
    }
  },

  previewPhoto() {
    const src = App.essayState.correction.photoData;
    if (src) window.open(src, '_blank');
  },

  submitCorrection() {
    const topic = document.getElementById('correctionTopic').value.trim();
    const answer = document.getElementById('correctionAnswer').value.trim();

    if (!answer) { Utils.toast('请输入答案内容', 'error'); return; }

    App.essayState.correction.topic = topic;
    App.essayState.correction.answer = answer;
    App.essayState.correction.loading = true;

    const apiKeyEl = document.getElementById('correctionApiKey');
    const apiKey = apiKeyEl ? apiKeyEl.value.trim() : '';
    if (apiKey) DB.set('duxing_essay_api_key', apiKey);

    if (apiKey) {
      const provider = document.getElementById('correctionApiProvider').value;
      this.callAIApi(apiKey, provider, topic, answer);
    } else {
      setTimeout(() => {
        const report = this.mockCorrection(topic, answer);
        App.essayState.correction.report = report;
        App.essayState.correction.loading = false;
        this.renderCorrection();
        Utils.toast('批改完成（模拟批改）');
      }, 800);
    }
  },

  // 模拟批改
  mockCorrection(topic, answer) {
    const len = answer.length;
    const paragraphs = answer.split(/\n\s*\n/).filter(p => p.trim());

    const keywordPool = SEED_DATA.essayStandardWords.map(w => w.word);
    const matched = keywordPool.filter(kw => answer.includes(kw));
    const hotwords = SEED_DATA.essayHotWords.map(w => w.term);
    const matchedHot = hotwords.filter(hw => answer.includes(hw));

    const hasOpening = paragraphs.some(p => /当前|近年来|随着|站在/.test(p));
    const hasCountermeasure = paragraphs.some(p => /要|应该|需要|必须|应当/.test(p));
    const hasEnding = paragraphs.some(p => /总之|综上|唯有|方能|征程|篇章/.test(p));
    const paragraphCount = paragraphs.length;

    let structScore = 0;
    if (hasOpening) structScore += 6;
    if (hasCountermeasure) structScore += 8;
    if (hasEnding) structScore += 6;
    if (paragraphCount >= 3) structScore += 5;
    structScore = Math.min(structScore, 25);

    let langScore = 0;
    langScore += Math.min(matched.length * 2, 14);
    langScore += Math.min(matchedHot.length * 2, 6);
    if (len > 200) langScore += 5;
    langScore = Math.min(langScore, 25);

    let contentScore = 0;
    contentScore += Math.min(matchedHot.length * 4, 16);
    contentScore += Math.min(matched.length, 8);
    if (len > 500) contentScore += 6;
    contentScore = Math.min(contentScore, 30);

    let logicScore = 20;
    if (paragraphCount < 2) logicScore -= 8;
    if (len < 300) logicScore -= 6;
    if (len > 1500) logicScore -= 2;

    const total = structScore + langScore + contentScore + logicScore;

    const suggestions = [];
    if (!hasOpening) suggestions.push('开头缺乏导入语，建议用"当前/近年来/随着..."等句式引入背景。');
    if (!hasCountermeasure) suggestions.push('缺少明确的对策论述，建议用"要/应该/需要..."等句式提出对策。');
    if (!hasEnding) suggestions.push('结尾缺乏升华，建议用"总之/唯有...方能..."等句式总结升华。');
    if (matched.length < 3) suggestions.push('规范词使用不足，建议多运用申论规范表述（见"规范词"tab）。');
    if (matchedHot.length < 1) suggestions.push('未使用年度热词，建议融入"新质生产力""中国式现代化"等热词提升立意。');
    if (len < 500) suggestions.push('字数偏少，申论大作文建议不少于800-1000字。');
    if (paragraphCount < 3) suggestions.push('段落结构过于简单，建议分论点至少3段并列或递进。');
    if (suggestions.length === 0) suggestions.push('整体表现优秀！可进一步打磨分论点的对仗和层次感。');

    return {
      total, structScore, langScore, contentScore, logicScore,
      wordCount: len, paragraphCount,
      matchedWords: matched, matchedHot: matchedHot,
      suggestions, isMock: true
    };
  },

  // AI API 调用（预留接口）
  callAIApi(apiKey, provider, topic, answer) {
    const providers = {
      deepseek: { url: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' },
      openai:   { url: 'https://api.openai.com/v1/chat/completions',   model: 'gpt-4o-mini' },
    };
    const config = providers[provider] || providers.deepseek;

    const prompt = `你是一位资深的申论阅卷老师。请对以下申论作答进行批改。\n\n题目：${topic || '（未提供题目）'}\n\n作答内容：\n${answer}\n\n请从以下维度评分并给出报告，用 JSON 格式返回：\n{"total":总分(0-100),"structScore":结构评分(0-25),"langScore":语言评分(0-25),"contentScore":内容评分(0-30),"logicScore":逻辑评分(0-20),"suggestions":["改进建议1","改进建议2"],"comment":"总体评语"}`;

    fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: config.model, messages: [{ role: 'user', content: prompt }], temperature: 0.3, response_format: { type: 'json_object' } })
    })
    .then(res => res.json())
    .then(data => {
      const content = data.choices[0].message.content;
      let report;
      try { report = JSON.parse(content); } catch(e) { report = this.mockCorrection(topic, answer); }
      report.wordCount = answer.length;
      report.isMock = false;
      App.essayState.correction.report = report;
      App.essayState.correction.loading = false;
      this.renderCorrection();
      Utils.toast('AI 批改完成');
    })
    .catch(() => {
      const report = this.mockCorrection(topic, answer);
      App.essayState.correction.report = report;
      App.essayState.correction.loading = false;
      this.renderCorrection();
      Utils.toast('AI 调用失败，已降级为模拟批改');
    });
  },

  renderReportHTML(r) {
    const scoreColor = (s, max) => s >= max * 0.8 ? '#4caf50' : s >= max * 0.6 ? '#ff9800' : '#f44336';
    return `
      <div class="essay-report">
        <div class="essay-report-header">
          <span class="essay-report-title">批改报告</span>
          ${r.isMock ? '<span class="tag tag-gray">模拟批改</span>' : '<span class="tag tag-green">AI批改</span>'}
        </div>
        <div class="essay-report-total">
          <div class="essay-report-total-num" style="color:${scoreColor(r.total, 100)}">${r.total}</div>
          <div class="essay-report-total-label">总分 / 100</div>
          <div class="essay-report-meta">字数 ${r.wordCount} · 段落 ${r.paragraphCount || '-'}</div>
        </div>
        <div class="essay-report-scores">
          ${this.renderScoreBar('结构', r.structScore, 25, scoreColor(r.structScore, 25))}
          ${this.renderScoreBar('语言', r.langScore, 25, scoreColor(r.langScore, 25))}
          ${this.renderScoreBar('内容', r.contentScore, 30, scoreColor(r.contentScore, 30))}
          ${this.renderScoreBar('逻辑', r.logicScore, 20, scoreColor(r.logicScore, 20))}
        </div>
        ${r.matchedWords && r.matchedWords.length ? `
          <div class="essay-report-section">
            <div class="essay-report-section-title">命中规范词 (${r.matchedWords.length})</div>
            <div class="essay-report-tags">${r.matchedWords.map(w => `<span class="tag tag-pink">${Utils.escape(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${r.matchedHot && r.matchedHot.length ? `
          <div class="essay-report-section">
            <div class="essay-report-section-title">命中热词 (${r.matchedHot.length})</div>
            <div class="essay-report-tags">${r.matchedHot.map(w => `<span class="tag tag-blue">${Utils.escape(w)}</span>`).join('')}</div>
          </div>` : ''}
        ${r.comment ? `
          <div class="essay-report-section">
            <div class="essay-report-section-title">总评</div>
            <div class="essay-report-comment">${Utils.escape(r.comment)}</div>
          </div>` : ''}
        <div class="essay-report-section">
          <div class="essay-report-section-title">改进建议</div>
          <ol class="essay-report-suggestions">${r.suggestions.map(s => `<li>${Utils.escape(s)}</li>`).join('')}</ol>
        </div>
      </div>
    `;
  },

  renderScoreBar(label, score, max, color) {
    const pct = (score / max * 100).toFixed(0);
    return `
      <div class="essay-score-item">
        <div class="essay-score-label">${label} <span style="color:${color};font-weight:600">${score}/${max}</span></div>
        <div class="essay-score-bar"><div class="essay-score-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>`;
  }
};

// ========== 5. 公考必背 ==========
ModuleRenderers.formula = function() {
  const content = document.getElementById('content');
  const cat = App.formulaState.category;

  const categories = ['all', '资料分析', '数量关系', '判断推理'];
  const mastered = DB.get('duxing_formulas_mastered', {});

  // 合并预设卡片 + 自定义卡片
  const customCards = DB.get('duxing_custom_formulas', []);
  let allCards = [...SEED_DATA.formulaCards, ...customCards];
  if (cat !== 'all') {
    allCards = allCards.filter(c => c.category === cat);
  }
  const totalCount = SEED_DATA.formulaCards.length + customCards.length;
  const showAddForm = App.formulaState.showAddForm;

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('formula', 26)} 公考必背</div>
        <div class="page-subtitle">点击卡片翻转查看 · 已掌握 ${Object.values(mastered).filter(Boolean).length} / ${totalCount}</div>
      </div>

      <div class="formula-tabs">
        ${categories.map(c => `
          <div class="quiz-tab ${cat === c ? 'active' : ''}" onclick="FormulaModule.setCategory('${c}')">${c === 'all' ? '全部' : c}</div>
        `).join('')}
      </div>

      <!-- 添加按钮 -->
      <div style="text-align:center;margin-bottom:20px;">
        <button class="btn btn-secondary" onclick="FormulaModule.toggleAddForm()" style="font-size:14px;padding:10px 24px;">
          ${showAddForm ? '✕ 收起添加' : '+ 添加自定义内容'}
        </button>
      </div>

      <!-- 添加表单 -->
      ${showAddForm ? `
      <div class="formula-add-form" id="formulaAddForm">
        <div class="formula-add-row">
          <label class="formula-add-label">选择分类</label>
          <select class="formula-add-select" id="formulaAddCategory">
            <option value="资料分析">资料分析</option>
            <option value="数量关系">数量关系</option>
            <option value="判断推理">判断推理</option>
          </select>
        </div>
        <div class="formula-add-row">
          <label class="formula-add-label">知识点名称</label>
          <input type="text" class="formula-add-input" id="formulaAddName"
                 placeholder="例如：增长率、行程问题、德摩根定律...">
        </div>
        <div class="formula-add-row">
          <label class="formula-add-label">详细内容</label>
          <textarea class="formula-add-textarea" id="formulaAddContent" rows="6"
                    placeholder="输入需要背诵的内容，我会自动帮你整理成卡片格式...&#10;&#10;例如：&#10;公式：路程 = 速度 × 时间&#10;相遇：S = (V1+V2) × t&#10;追及：ΔS = (V1-V2) × t&#10;&#10;也支持粘贴笔记、截图文字等"></textarea>
        </div>
        <div class="formula-add-actions">
          <button class="btn btn-primary" onclick="FormulaModule.submitCustom()">整理并添加</button>
          <button class="btn btn-secondary" onclick="FormulaModule.toggleAddForm()">取消</button>
        </div>
      </div>
      ` : ''}

      <div class="formula-grid">
        ${allCards.map(card => {
          // 区分预设卡片和自定义卡片：预设卡片的 idx 在 SEED_DATA 中查找，自定义卡片用负数偏移
          const isCustom = card._custom === true;
          const presetIdx = SEED_DATA.formulaCards.indexOf(card);
          const customIdx = isCustom ? customCards.indexOf(card) : -1;
          const isMastered = isCustom ? false : mastered[presetIdx];

          return `
            <div class="formula-card ${isCustom ? 'formula-card-custom' : ''}" onclick="FormulaModule.flip(this)">
              ${isCustom ? `<button class="formula-card-delete" onclick="event.stopPropagation(); FormulaModule.deleteCustom(${customIdx})" title="删除">×</button>` : ''}
              <div class="formula-card-inner">
                <div class="formula-card-front">
                  <div class="formula-card-name">${Utils.escape(card.name)}</div>
                  <div class="formula-card-hint">${card.category} · ${isCustom ? '自定义 · ' : ''}点击翻转</div>
                </div>
                <div class="formula-card-back" onclick="event.stopPropagation()">
                  <div class="formula-card-content">${Utils.nl2br(card.content)}</div>
                  ${!isCustom ? `<button class="formula-mastered-btn ${isMastered ? 'mastered' : ''}" onclick="event.stopPropagation(); FormulaModule.toggleMastered(${presetIdx})">
                    ${isMastered ? ICONS.checkCircle + ' 已掌握' : '标记掌握'}
                  </button>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

const FormulaModule = {
  setCategory(cat) {
    App.formulaState.category = cat;
    App.formulaState.showAddForm = false;
    ModuleRenderers.formula();
  },

  flip(card) {
    card.classList.toggle('flipped');
  },

  toggleMastered(idx) {
    const mastered = DB.get('duxing_formulas_mastered', {});
    mastered[idx] = !mastered[idx];
    DB.set('duxing_formulas_mastered', mastered);
    ModuleRenderers.formula();
    StatusBar.update();
    Utils.toast(mastered[idx] ? '已标记为掌握' : '已取消标记');
  },

  toggleAddForm() {
    App.formulaState.showAddForm = !App.formulaState.showAddForm;
    ModuleRenderers.formula();
  },

  submitCustom() {
    const nameEl = document.getElementById('formulaAddName');
    const contentEl = document.getElementById('formulaAddContent');
    const catEl = document.getElementById('formulaAddCategory');

    const name = (nameEl?.value || '').trim();
    const rawContent = (contentEl?.value || '').trim();
    const category = catEl?.value || '判断推理';

    if (!name) { Utils.toast('请输入知识点名称'); return; }
    if (!rawContent) { Utils.toast('请输入详细内容'); return; }

    // AI 整理：格式化内容
    let content = rawContent;
    // 如果内容不含换行且较长，尝试按句号/分号拆分
    if (!content.includes('\n') && content.length > 40) {
      content = content.replace(/[。；;]/g, '$&\n');
    }
    // 去除多余空行，保留单个空行
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    // 智能添加小标题（如果内容中不含【】标记）
    if (!content.includes('【') && !content.includes('公式：') && !content.includes('口诀：')) {
      // 尝试识别关键行并加标记
      const lines = content.split('\n');
      const processed = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        // 如果行很短（<15字），可能是标题
        if (trimmed.length < 15 && !trimmed.endsWith('。') && !trimmed.endsWith('；') && lines.length > 1) {
          return '【' + trimmed.replace(/[：:]/g, '') + '】';
        }
        return trimmed;
      });
      content = processed.join('\n');
    }

    const customCards = DB.get('duxing_custom_formulas', []);
    customCards.push({
      _custom: true,
      category: category,
      name: name,
      content: content,
      createdAt: new Date().toISOString()
    });
    DB.set('duxing_custom_formulas', customCards);

    App.formulaState.showAddForm = false;
    ModuleRenderers.formula();
    Utils.toast(`已添加"${name}"到${category}`);
  },

  deleteCustom(idx) {
    const customCards = DB.get('duxing_custom_formulas', []);
    const name = customCards[idx]?.name || '';
    customCards.splice(idx, 1);
    DB.set('duxing_custom_formulas', customCards);
    ModuleRenderers.formula();
    Utils.toast(`已删除"${name}"`);
  }
};

// ========== 6. 成语背诵 ==========
ModuleRenderers.idiom = function() {
  const content = document.getElementById('content');
  const idiomStreak = DB.get('duxing_idiom_streak', { count: 0, lastDate: null });
  const todayDone = DB.getToday('duxing_idiom_done', []);

  // 数据源：PDF成语题库
  const quizData = (typeof IDIOM_QUIZ_DATA !== 'undefined') ? IDIOM_QUIZ_DATA : [];
  const dailyCount = 25;

  // 根据日期确定今日成语列表
  const seed = Utils.dateSeed();
  const todayIdioms = Utils.seededShuffle([...quizData], seed).slice(0, dailyCount);

  // 初始化 tab 状态
  if (!App.idiomState.tab) App.idiomState.tab = 'quiz';
  const tab = App.idiomState.tab;

  const tabs = [
    { key: 'quiz',     icon: 'target',   label: '每日练习' },
    { key: 'highfreq', icon: 'highidiom', label: '高频成语' },
  ];

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('target', 26)} 成语背诵</div>
        <div class="page-subtitle" id="idiomSubtitle">${tab === 'quiz'
          ? `<span style="display: inline-flex; vertical-align: middle;">${ICONS.flame}</span> 累计打卡 ${idiomStreak.count || 0} 天 · 今日完成 ${todayDone.length}/${dailyCount} · 题库共${quizData.length}个`
          : `公考真题高频成语 · 共 ${(typeof HIGH_FREQ_IDIOMS !== 'undefined' ? HIGH_FREQ_IDIOMS.length : 0)} 个 · 每个配3条官方媒体例句`
        }</div>
      </div>

      <div class="quiz-tabs essay-tabs">
        ${tabs.map(t => `
          <div class="quiz-tab ${tab === t.key ? 'active' : ''}" onclick="IdiomModule.switchTab('${t.key}')">
            ${titleIcon(t.icon, 14)} ${t.label}
          </div>
        `).join('')}
      </div>

      ${tab === 'quiz' ? `
        <div class="quiz-stats">
          <div class="quiz-stat-card">
            <div class="quiz-stat-num" id="idiomStatStreak">${idiomStreak.count || 0}</div>
            <div class="quiz-stat-label">累计天数</div>
          </div>
          <div class="quiz-stat-card">
            <div class="quiz-stat-num" id="idiomStatDone">${todayDone.length}</div>
            <div class="quiz-stat-label">今日已背</div>
          </div>
          <div class="quiz-stat-card">
            <div class="quiz-stat-num">${quizData.length}</div>
            <div class="quiz-stat-label">题库总量</div>
          </div>
        </div>
      ` : ''}

      <div id="idiomContent"></div>
    </div>
  `;

  if (tab === 'quiz') {
    IdiomModule.renderQuestion();
  } else {
    IdiomModule.renderHighFreq();
  }
};

const IdiomModule = {
  switchTab(tab) {
    App.idiomState.tab = tab;
    ModuleRenderers.idiom();
  },

  renderHighFreq() {
    const st = App.highIdiomState;
    const allIdioms = (typeof HIGH_FREQ_IDIOMS !== 'undefined') ? HIGH_FREQ_IDIOMS : [];

    // 按频次排序
    const sorted = [...allIdioms].sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

    let filtered = sorted;
    if (st.filter === 'high') filtered = sorted.filter(i => (i.frequency || 0) >= 10);
    else if (st.filter === 'mid') filtered = sorted.filter(i => (i.frequency || 0) >= 6 && (i.frequency || 0) < 10);
    else if (st.filter === 'low') filtered = sorted.filter(i => (i.frequency || 0) <= 5);

    document.getElementById('idiomContent').innerHTML = `
      <div class="hidiom-search-box">
        <div class="hidiom-search-title">${titleIcon('search', 16)} 成语小侦探</div>
        <div class="hidiom-search-row">
          <input type="text" id="hidiomDetectiveInput" class="hidiom-search-input" placeholder="输入成语，搜索人民网中的用法..." value="${Utils.escape(st.search)}" oninput="App.highIdiomState.search=this.value" />
          <button class="btn btn-primary hidiom-search-btn" onclick="HighIdiomModule.detective()">搜索</button>
        </div>
        <div class="hidiom-search-hint">点击搜索将打开人民网搜索该成语的应用实例</div>
      </div>

      <div class="hidiom-filter-row">
        <div class="quiz-tab ${st.filter === 'all' ? 'active' : ''}" onclick="HighIdiomModule.setFilter('all')">全部 ${allIdioms.length}</div>
        <div class="quiz-tab ${st.filter === 'high' ? 'active' : ''}" onclick="HighIdiomModule.setFilter('high')">高频 (≥10) ${allIdioms.filter(i => (i.frequency||0) >= 10).length}</div>
        <div class="quiz-tab ${st.filter === 'mid' ? 'active' : ''}" onclick="HighIdiomModule.setFilter('mid')">中频 (6-9) ${allIdioms.filter(i => (i.frequency||0) >= 6 && (i.frequency||0) < 10).length}</div>
        <div class="quiz-tab ${st.filter === 'low' ? 'active' : ''}" onclick="HighIdiomModule.setFilter('low')">低频 (≤5) ${allIdioms.filter(i => (i.frequency||0) <= 5).length}</div>
      </div>

      <div id="hidiomList"></div>
    `;

    HighIdiomModule.renderList();
  },

  // 获取今日成语列表
  getTodayIdioms() {
    const quizData = (typeof IDIOM_QUIZ_DATA !== 'undefined') ? IDIOM_QUIZ_DATA : [];
    const seed = Utils.dateSeed();
    return Utils.seededShuffle([...quizData], seed).slice(0, 25);
  },

  // 获取干扰选项
  getDistractors(correctItem, field, count) {
    const quizData = (typeof IDIOM_QUIZ_DATA !== 'undefined') ? IDIOM_QUIZ_DATA : [];
    const pool = quizData.filter(item => item[field] !== correctItem[field]);
    return Utils.shuffle(pool).slice(0, count);
  },

  // 类别颜色
  categoryColor(cat) {
    const map = {
      '望文生义': 'pink',
      '语意重复': 'orange',
      '对象误用': 'blue',
      '双重意义': 'green',
      '特殊用法': 'gray',
      '谦辞敬辞': 'green',
      '褒贬误用': 'orange',
      '易混误用': 'blue',
    };
    return map[cat] || 'gray';
  },

  // 题型选择（根据类别）
  getQuestionType(item, idx) {
    // 不同类别使用不同题型
    switch (item.category) {
      case '望文生义':
        // 0=看释义猜成语, 1=看成语选释义, 2=判断易错理解是否正确
        return idx % 3;
      case '对象误用':
        // 0=看释义猜成语, 1=看成语选释义, 2=判断适用对象
        return idx % 3;
      case '褒贬误用':
        // 0=看释义猜成语, 1=判断褒贬
        return idx % 2;
      case '语意重复':
        // 0=看释义猜成语, 1=看成语选释义
        return idx % 2;
      case '双重意义':
        // 0=看成语选释义, 1=看释义猜成语
        return idx % 2;
      case '特殊用法':
        // 0=看释义猜成语, 1=看成语选释义
        return idx % 2;
      case '谦辞敬辞':
        // 0=看释义猜成语, 1=判断敬辞/谦辞
        return idx % 2;
      case '易混误用':
        // 0=看释义猜成语, 1=看成语选释义
        return idx % 2;
      default:
        return idx % 2;
    }
  },

  // 题型名称
  questionTypeName(type, category) {
    if (category === '望文生义' && type === 2) return '判断易错理解';
    if (category === '对象误用' && type === 2) return '判断适用对象';
    if (category === '褒贬误用' && type === 1) return '判断褒贬色彩';
    if (category === '谦辞敬辞' && type === 1) return '判断敬辞谦辞';
    if (type === 0) return '看释义猜成语';
    if (type === 1) return '看成语选释义';
    return '看释义猜成语';
  },

  renderQuestion() {
    const idioms = this.getTodayIdioms();
    const idx = App.idiomState.index;
    const todayDone = DB.getToday('duxing_idiom_done', []);

    if (idx >= idioms.length) {
      // 全部完成，更新打卡
      if (todayDone.length >= idioms.length) {
        const streak = DB.get('duxing_idiom_streak', { count: 0, lastDate: null });
        if (streak.lastDate !== App.today) {
          streak.count = (streak.count || 0) + 1;
          streak.lastDate = App.today;
          DB.set('duxing_idiom_streak', streak);
        }
      }

      document.getElementById('idiomContent').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" style="color: var(--pink-deep);">${ICONS.trophy}</div>
          <div class="empty-state-text">今日${idioms.length}道成语全部练完！太棒了！</div>
          <div class="mt-16 text-sm text-gray">累计打卡 ${DB.get('duxing_idiom_streak', { count: 0 }).count} 天 · 答对 ${todayDone.length} 题</div>
        </div>
      `;
      StatusBar.update();
      IdiomModule.updateIdiomStats();
      return;
    }

    const item = idioms[idx];
    const questionType = this.getQuestionType(item, idx);
    const catColor = this.categoryColor(item.category);
    const letters = ['A', 'B', 'C', 'D'];

    let questionText, options, answerIndex, detailHTML;

    if (questionType === 0) {
      // 看释义猜成语
      questionText = `下列哪个成语的意思是："${item.meaning}"`;
      const distractors = this.getDistractors(item, 'idiom', 3);
      options = Utils.shuffle([item, ...distractors]).map(i => i.idiom);
      answerIndex = options.indexOf(item.idiom);
    } else if (questionType === 1 && (item.category === '褒贬误用')) {
      // 判断褒贬色彩
      questionText = `"${item.idiom}"的褒贬色彩是？`;
      // 从note中提取正确答案
      const isBao = item.note.includes('褒义误作贬用');
      const isBian = item.note.includes('贬义误作褒用');
      if (isBao) {
        options = ['褒义词（误作贬用）', '贬义词（误作褒用）', '中性词', '无固定色彩'];
        answerIndex = 0;
      } else if (isBian) {
        options = ['褒义词（误作贬用）', '贬义词（误作褒用）', '中性词', '无固定色彩'];
        answerIndex = 1;
      } else {
        // Fallback to standard question
        questionText = `下列哪个成语的意思是："${item.meaning}"`;
        const distractors = this.getDistractors(item, 'idiom', 3);
        options = Utils.shuffle([item, ...distractors]).map(i => i.idiom);
        answerIndex = options.indexOf(item.idiom);
      }
    } else if (questionType === 1 && item.category === '谦辞敬辞') {
      // 判断敬辞谦辞
      questionText = `"${item.idiom}"属于敬辞还是谦辞？`;
      const isJing = item.note.includes('敬辞');
      const isQian = item.note.includes('谦辞');
      if (isJing) {
        options = ['敬辞（用于称对方）', '谦辞（用于称自己）', '中性词', '无固定用法'];
        answerIndex = 0;
      } else if (isQian) {
        options = ['敬辞（用于称对方）', '谦辞（用于称自己）', '中性词', '无固定用法'];
        answerIndex = 1;
      } else {
        questionText = `"${item.idiom}" 的正确释义是？`;
        const distractors = this.getDistractors(item, 'meaning', 3);
        options = Utils.shuffle([item, ...distractors]).map(i => i.meaning);
        answerIndex = options.indexOf(item.meaning);
      }
    } else if (questionType === 2 && item.category === '望文生义') {
      // 判断易错理解是否正确
      const easyError = item.easyError || '易误解为：错误含义';
      questionText = `有人认为"${item.idiom}"的意思是"${easyError.replace('易误解为：', '')}"，这个理解对吗？`;
      options = ['正确', '错误，望文生义了'];
      answerIndex = 1;
    } else if (questionType === 2 && item.category === '对象误用') {
      // 判断适用对象
      const obj = item.applicableObject || ' unspecified';
      questionText = `"${item.idiom}"最适合用于形容以下哪个对象？`;
      const allObjs = [obj, '任何人', '自然景物', '建筑'];
      options = Utils.shuffle(allObjs);
      answerIndex = options.indexOf(obj);
    } else {
      // 看成语选释义
      questionText = `"${item.idiom}" 的正确释义是？`;
      const distractors = this.getDistractors(item, 'meaning', 3);
      options = Utils.shuffle([item, ...distractors]).map(i => i.meaning);
      answerIndex = options.indexOf(item.meaning);
    }

    // 生成详解
    detailHTML = `<strong style="color: var(--pink-deep);">📚 成语详解</strong><br><br>`;
    detailHTML += `<strong>成语：</strong>${Utils.escape(item.idiom)} <span class="tag tag-${catColor}" style="margin-left:8px;">${item.category}</span><br>`;
    detailHTML += `<strong>释义：</strong>${Utils.escape(item.meaning)}<br>`;
    if (item.easyError) {
      detailHTML += `<strong style="color: #e87b5a;">⚠️ 易错点：</strong>${Utils.escape(item.easyError)}<br>`;
    }
    if (item.applicableObject) {
      detailHTML += `<strong style="color: #5a8a5a;">🎯 适用对象：</strong>${Utils.escape(item.applicableObject)}<br>`;
    }
    if (item.note) {
      detailHTML += `<strong style="color: #5a7e94;">📝 备注：</strong>${Utils.escape(item.note)}<br>`;
    }

    const qTypeName = this.questionTypeName(questionType, item.category);

    document.getElementById('idiomContent').innerHTML = `
      <div class="idiom-question">
        <div class="idiom-type-label">
          <span class="tag tag-pink">第 ${idx + 1} 题</span>
          <span class="tag tag-${catColor}">【${item.category}】</span>
          <span class="tag tag-blue">${qTypeName}</span>
        </div>
        <div class="idiom-content" style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">${Utils.escape(questionText)}</div>
        <div class="idiom-options">
          ${options.map((opt, i) => `
            <div class="idiom-option" id="idiom-opt-${i}" onclick="IdiomModule.select(${i}, ${answerIndex})">
              <span style="font-weight: 600; margin-right: 8px;">${letters[i] || (i+1) + '.'}.</span>
              ${Utils.escape(opt)}
            </div>
          `).join('')}
        </div>
        <div class="idiom-detail" id="idiomDetail">
          ${detailHTML}
        </div>
        <div class="mt-16" id="idiomNext" style="display:none;">
          <button class="btn btn-primary" onclick="IdiomModule.next()">下一题 →</button>
        </div>
      </div>
    `;

    App.idiomState._correctAnswer = answerIndex;
  },

  select(i, correctAnswer) {
    if (App.idiomState.answered) return;

    App.idiomState.answered = true;
    App.idiomState.selectedOption = i;

    const isCorrect = i === correctAnswer;

    try {
      // 标记选项
      const totalOptions = document.querySelectorAll('.idiom-option').length;
      for (let j = 0; j < totalOptions; j++) {
        const el = document.getElementById(`idiom-opt-${j}`);
        if (el) {
          if (j === correctAnswer) {
            el.classList.add('correct');
          } else if (j === i) {
            el.classList.add('wrong');
          }
        }
      }

      // 显示详解
      const detailEl = document.getElementById('idiomDetail');
      const nextEl = document.getElementById('idiomNext');
      if (detailEl) detailEl.classList.add('show');
      if (nextEl) nextEl.style.display = 'block';
    } catch (e) {
      console.error('IdiomModule.select error:', e);
    }

    if (isCorrect) {
      // 答对：记录完成（仅答对才计入），按钮保持"下一题"
      const done = DB.getToday('duxing_idiom_done', []);
      if (!done.includes(App.idiomState.index)) {
        done.push(App.idiomState.index);
        DB.setToday('duxing_idiom_done', done);
      }
      Utils.toast('答对了！', 'success');
    } else {
      // 方案 B：答错不计入，但允许重做本题直到答对（按钮变为"重试本题"）
      const nextEl = document.getElementById('idiomNext');
      if (nextEl) {
        nextEl.innerHTML = `<button class="btn btn-primary" onclick="IdiomModule.retryCurrent()">重试本题 ↺</button>`;
      }
      Utils.toast('答错了，再试一次', 'error');
    }

    StatusBar.update();
    this.updateIdiomStats();
  },

  // 重做当前题（方案 B）：清空已答状态，重新渲染同一题
  retryCurrent() {
    App.idiomState.answered = false;
    App.idiomState.selectedOption = -1;
    this.renderQuestion();
  },

  // 实时更新成语背诵统计
  updateIdiomStats() {
    const streak = DB.get('duxing_idiom_streak', { count: 0, lastDate: null });
    const done = DB.getToday('duxing_idiom_done', []);

    const elStreak = document.getElementById('idiomStatStreak');
    const elDone = document.getElementById('idiomStatDone');
    const elSubtitle = document.getElementById('idiomSubtitle');

    if (elStreak) elStreak.textContent = streak.count || 0;
    if (elDone) elDone.textContent = done.length;

    if (elSubtitle) {
      const dailyCount = 25;
      const quizData = (typeof IDIOM_QUIZ_DATA !== 'undefined') ? IDIOM_QUIZ_DATA : [];
      elSubtitle.innerHTML = `<span style="display: inline-flex; vertical-align: middle;">${ICONS.flame}</span> 累计打卡 ${streak.count || 0} 天 · 今日完成 ${done.length}/${dailyCount} · 题库共${quizData.length}个`;
    }
  },

  next() {
    App.idiomState.index++;
    DB.set(`duxing_idiom_index_${App.today}`, App.idiomState.index);
    App.idiomState.answered = false;
    App.idiomState.selectedOption = -1;
    this.renderQuestion();
  }
};

// ========== 6.45. 高频成语（内嵌于成语背诵模块） ==========
const HighIdiomModule = {
  setFilter(f) {
    App.highIdiomState.filter = f;
    IdiomModule.renderHighFreq();
  },

  renderList() {
    const st = App.highIdiomState;
    const allIdioms = (typeof HIGH_FREQ_IDIOMS !== 'undefined') ? HIGH_FREQ_IDIOMS : [];
    const sorted = [...allIdioms].sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

    let filtered = sorted;
    if (st.filter === 'high') filtered = sorted.filter(i => (i.frequency || 0) >= 10);
    else if (st.filter === 'mid') filtered = sorted.filter(i => (i.frequency || 0) >= 6 && (i.frequency || 0) < 10);
    else if (st.filter === 'low') filtered = sorted.filter(i => (i.frequency || 0) <= 5);

    const container = document.getElementById('hidiomList');
    if (!container) return;

    container.innerHTML = filtered.map((item, idx) => {
      const isExpanded = st.expandedId === item.idiom;
      const freqColor = (item.frequency || 0) >= 10 ? 'pink' : (item.frequency || 0) >= 6 ? 'blue' : 'gray';
      return `
        <div class="hidiom-card ${isExpanded ? 'expanded' : ''}" onclick="HighIdiomModule.toggle('${item.idiom}')">
          <div class="hidiom-card-header">
            <div class="hidiom-card-left">
              <span class="hidiom-rank">${idx + 1}</span>
              <span class="hidiom-name">${Utils.escape(item.idiom)}</span>
            </div>
            <div class="hidiom-card-right">
              <span class="tag tag-${freqColor}">考频 ${item.frequency || 0}</span>
              <span class="hidiom-arrow">${isExpanded ? ICONS.arrowDown : '<span style="display:inline-block;transform:rotate(-90deg);">' + ICONS.arrowDown + '</span>'}</span>
            </div>
          </div>
          ${isExpanded ? `
            <div class="hidiom-card-body">
              <div class="hidiom-meaning">
                <span class="hidiom-label">释义</span>
                <span>${Utils.escape(item.meaning || '')}</span>
              </div>
              <div class="hidiom-origin">
                <span class="hidiom-label">出处</span>
                <span>${Utils.escape(item.origin || '')}</span>
              </div>
              <div class="hidiom-examples">
                <span class="hidiom-label">真题语境例句</span>
                <div class="hidiom-example-list">
                  ${(item.examples || []).map((ex, i) => `
                    <div class="hidiom-example">
                      <div class="hidiom-example-source">${Utils.escape(ex.source || '')}</div>
                      <div class="hidiom-example-text">${Utils.escape(ex.text || '')}</div>
                      ${ex.url ? `<a href="${Utils.escape(ex.url)}" target="_blank" rel="noopener" class="hidiom-example-link" onclick="event.stopPropagation()">${ICONS.externalLink} 查看原文</a>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="hidiom-detective-link">
                <button class="btn btn-green btn-sm" onclick="event.stopPropagation(); HighIdiomModule.searchPeople('${item.idiom}')">
                  ${ICONS.search} 在人民网搜索该成语
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  toggle(idiomName) {
    if (App.highIdiomState.expandedId === idiomName) {
      App.highIdiomState.expandedId = null;
    } else {
      App.highIdiomState.expandedId = idiomName;
    }
    this.renderList();
  },

  detective() {
    const input = document.getElementById('hidiomDetectiveInput');
    const q = (input ? input.value : '').trim();
    if (!q) {
      Utils.toast('请输入要搜索的成语', 'error');
      return;
    }
    this.searchPeople(q);
  },

  searchPeople(keyword) {
    const url = 'http://search.people.cn/cnpeople/search.do?site=people&keyword=' + encodeURIComponent(keyword);
    window.open(url, '_blank', 'noopener');
  },
};

// ========== 6.5. 练习 ==========
ModuleRenderers.resources = function() {
  const content = document.getElementById('content');

  if (!App.resourcesTab) App.resourcesTab = 'calc';

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('compass', 26)} 练习</div>
        <div class="page-subtitle">计算练习 · 专项训练</div>
      </div>

      <div class="news-tabs resources-tabs">
        <button class="news-tab ${App.resourcesTab === 'calc' ? 'active' : ''}" onclick="ResourcesModule.switchTab('calc')">基础计算</button>
        <button class="news-tab ${App.resourcesTab === 'calc2' ? 'active' : ''}" onclick="ResourcesModule.switchTab('calc2')">计算辅助</button>
        <button class="news-tab ${App.resourcesTab === 'quant' ? 'active' : ''}" onclick="ResourcesModule.switchTab('quant')">数量关系</button>
        <button class="news-tab ${App.resourcesTab === 'data' ? 'active' : ''}" onclick="ResourcesModule.switchTab('data')">资料分析</button>
      </div>

      <div id="resourcesContent"></div>
    </div>
  `;

  ResourcesModule.renderTab();
};

const ResourcesModule = {
  // Tab 配置
  tabConfig: [
    { key: 'calc',  moduleKey: 'calc',   label: '基础计算' },
    { key: 'calc2', moduleKey: 'calc2',  label: '计算辅助' },
    { key: 'quant', moduleKey: 'quant',  label: '数量关系' },
    { key: 'data',  moduleKey: 'data',   label: '资料分析' },
  ],

  switchTab(tab) {
    App.resourcesTab = tab;
    // 重置计算练习状态
    CalcModule.state.moduleKey = null;
    CalcModule.state.typeKey = null;
    CalcModule.state.questions = [];

    const config = this.tabConfig.find(t => t.key === tab);
    document.querySelectorAll('.resources-tabs .news-tab').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === config.label);
    });
    this.renderTab();
  },

  renderTab() {
    const container = document.getElementById('resourcesContent');
    if (!container) return;

    const config = this.tabConfig.find(t => t.key === App.resourcesTab);

    if (config && config.moduleKey) {
      // 如果已选择某个题型，渲染题目；否则渲染类型选择
      if (CalcModule.state.typeKey && CalcModule.state.moduleKey === config.moduleKey) {
        CalcModule.renderQuiz(container);
      } else {
        this.renderCalcTypes(container, config.moduleKey);
      }
    }
  },

  // 渲染计算练习类型选择
  renderCalcTypes(container, moduleKey) {
    const types = CalcModule.typeDefs[moduleKey] || [];
    const moduleNames = { calc: '基础计算', calc2: '计算辅助', quant: '数量关系', data: '资料分析' };

    container.innerHTML = `
      <div class="calc-intro">
        <div class="calc-intro-title">${moduleNames[moduleKey]} · 选择练习类型</div>
        <div class="calc-intro-desc">点击下方任意类型开始练习，共 ${types.length} 种练习</div>
      </div>
      <div class="calc-type-grid">
        ${types.map((t, i) => `
          <div class="calc-type-btn" onclick="CalcModule.startQuiz('${moduleKey}', '${t.key}')">
            <div class="calc-type-num">${i + 1}</div>
            <div class="calc-type-name">${Utils.escape(t.name)}</div>
          </div>
        `).join('')}
      </div>
    `;
  },
};

// ========== 计算练习模块 ==========
const CalcModule = {
  // 当前练习状态
  state: {
    moduleKey: null,   // 'calc' | 'calc2' | 'quant' | 'data'
    typeKey: null,
    questions: [],
    currentIdx: 0,
    answers: {},
    showAnswer: {},
    inputValue: '',     // 当前数字键盘输入值
    startTime: null,      // 开始时间戳
    endTime: null,        // 结束时间戳
    elapsedTime: null,   // 已用秒数（完成后）
    timerInterval: null,  // 计时器 interval ID
    finished: false       // 是否已完成全部 10 题
  },

  // 各模块的类型定义
  typeDefs: {
    calc: [
      { key: 'add3',       name: '三位数加法' },
      { key: 'sub3',       name: '三位数减法' },
      { key: 'add4',       name: '四位数相加' },
      { key: 'mul3x1',     name: '三位数乘一位数' },
      { key: 'div3x1',     name: '三位数除一位数' },
      { key: 'mul2x2',     name: '两位数乘两位数' },
      { key: 'big99',      name: '大九九乘法表' },
      { key: 'est_mul',    name: '乘法估算' },
      { key: 'div5x3',     name: '五位数除三位数' },
      { key: 'base_period', name: '求基期量' },
      { key: 'base_growth', name: '求增长量' },
    ],
    calc2: [
      { key: 'carry_add',  name: '进位加法' },
      { key: 'borrow_sub', name: '退位减法' },
      { key: 'mul2',       name: '2的乘法' },
      { key: 'mul3',       name: '3的乘法' },
      { key: 'mul4',       name: '4的乘法' },
      { key: 'mul5',       name: '5的乘法' },
      { key: 'mul6',       name: '6的乘法' },
      { key: 'mul9',       name: '9的乘法' },
      { key: 'mul11',      name: '两位数乘11' },
      { key: 'mul15',      name: '两位数乘15' },
      { key: 'frac2dec',   name: '分数化小数' },
      { key: 'dec2frac',   name: '小数化分数' },
      { key: 'pct2frac',   name: '百分化分数' },
      { key: 'frac2pct',   name: '分数化百分' },
      { key: 'pct_est',    name: '百化分估算' },
      { key: 'squares',    name: '常见平方数' },
    ],
    quant: [
      { key: 'ratio',       name: '比例表达式' },
      { key: 'engineering', name: '工程问题' },
      { key: 'mean_ineq',   name: '均值不等式' },
      { key: 'hanxin',      name: '韩信点兵' },
      { key: 'indet_eq',    name: '不定方程' },
      { key: 'gcd',         name: '最大公约数' },
      { key: 'lcm',         name: '最小公倍数' },
      { key: 'date_week',   name: '星期日期问题' },
    ],
    data: [
      { key: 'base_period',   name: '基期量' },
      { key: 'growth_amt',    name: '增长量' },
      { key: 'growth_rate',   name: '增长率' },
      { key: 'base_diff',     name: '基期差' },
      { key: 'prod_growth',   name: '乘积增长率' },
      { key: 'avg_growth',    name: '平均数增长率' },
      { key: 'mix_growth',    name: '混合增长率' },
      { key: 'diff_growth',   name: '差值增长率' },
      { key: 'base_weight',   name: '基期比重' },
      { key: 'weight_diff',   name: '两期比重差' },
      { key: 'contrib_growth', name: '贡献增长率' },
      { key: 'drive_growth',   name: '拉动增长率' },
      { key: 'change_compare', name: '变化量比较' },
      { key: 'base_compare',   name: '基期比较' },
      { key: 'average',        name: '平均值' },
      { key: 'annual_growth',  name: '年均增长率' },
    ]
  },

  // 辅助函数
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  round(num, digits = 2) { const p = Math.pow(10, digits); return Math.round(num * p) / p; },

  // 题目生成器
  generators: {
    // ===== 基础计算 =====
    calc: {
      add3() {
        const a = CalcModule.rand(100, 999), b = CalcModule.rand(100, 999);
        return { question: `${a} + ${b} = ?`, answer: String(a + b), explain: `${a} + ${b} = ${a + b}` };
      },
      sub3() {
        let a = CalcModule.rand(100, 999), b = CalcModule.rand(100, 999);
        if (b > a) [a, b] = [b, a];
        return { question: `${a} − ${b} = ?`, answer: String(a - b), explain: `${a} − ${b} = ${a - b}` };
      },
      add4() {
        const a = CalcModule.rand(1000, 9999), b = CalcModule.rand(1000, 9999);
        return { question: `${a} + ${b} = ?`, answer: String(a + b), explain: `${a} + ${b} = ${a + b}` };
      },
      mul3x1() {
        const a = CalcModule.rand(100, 999), b = CalcModule.rand(2, 9);
        return { question: `${a} × ${b} = ?`, answer: String(a * b), explain: `${a} × ${b} = ${a * b}` };
      },
      div3x1() {
        const b = CalcModule.rand(2, 9), q = CalcModule.rand(100, 999), a = b * q;
        return { question: `${a} ÷ ${b} = ?`, answer: String(q), explain: `${a} ÷ ${b} = ${q}` };
      },
      mul2x2() {
        const a = CalcModule.rand(11, 99), b = CalcModule.rand(11, 99);
        return { question: `${a} × ${b} = ?`, answer: String(a * b), explain: `${a} × ${b} = ${a * b}` };
      },
      big99() {
        const a = CalcModule.rand(11, 19), b = CalcModule.rand(11, 19);
        return { question: `${a} × ${b} = ?`, answer: String(a * b), explain: `大九九：${a} × ${b} = ${a * b}` };
      },
      est_mul() {
        const a = CalcModule.rand(380, 420) + CalcModule.rand(0, 9) * 10;
        const b = CalcModule.rand(18, 25);
        const estA = Math.round(a / 100) * 100, estB = Math.round(b / 10) * 10;
        return { question: `估算：${a} × ${b} ≈ ?`, answer: String(estA * estB / 10), explain: `${a} ≈ ${estA}，${b} ≈ ${estB}，估算结果 ≈ ${estA * estB}` };
      },
      div5x3() {
        const b = CalcModule.rand(100, 300), q = CalcModule.rand(100, 333), a = b * q;
        return { question: `${a} ÷ ${b} = ?`, answer: String(q), explain: `${a} ÷ ${b} = ${q}` };
      },
      base_period() {
        const r = CalcModule.rand(5, 30), current = CalcModule.rand(500, 5000);
        const base = CalcModule.round(current / (1 + r / 100));
        return { question: `现期量 = ${current}，增长率 = ${r}%，求基期量？`, answer: String(base), explain: `基期量 = 现期量 ÷ (1 + 增长率) = ${current} ÷ (1 + ${r}%) = ${base}` };
      },
      base_growth() {
        const r = CalcModule.rand(5, 30), current = CalcModule.rand(500, 5000);
        const growth = CalcModule.round(current * r / (100 + r));
        return { question: `现期量 = ${current}，增长率 = ${r}%，求增长量？`, answer: String(growth), explain: `增长量 = 现期量 × 增长率 ÷ (1 + 增长率) = ${current} × ${r}% ÷ (1 + ${r}%) = ${growth}` };
      },
    },
    // ===== 计算辅助 =====
    calc2: {
      carry_add() {
        let a, b;
        do { a = CalcModule.rand(11, 99); b = CalcModule.rand(11, 99); } while (Math.floor(a/10)+Math.floor(b/10) < 10 && (a%10)+(b%10) < 10);
        return { question: `${a} + ${b} = ?（进位加法）`, answer: String(a + b), explain: `${a} + ${b} = ${a + b}。技巧：个位 ${a%10}+${b%10}=${(a%10)+(b%10)}，需进位。` };
      },
      borrow_sub() {
        let a, b;
        do { a = CalcModule.rand(21, 99); b = CalcModule.rand(11, a-1); } while (a % 10 >= b % 10);
        return { question: `${a} − ${b} = ?（退位减法）`, answer: String(a - b), explain: `${a} − ${b} = ${a - b}。技巧：个位 ${a%10}−${b%10} 不够减，需从十位借1。` };
      },
      mul2() { const a = CalcModule.rand(12, 99); return { question: `${a} × 2 = ?`, answer: String(a*2), explain: `${a} × 2 = ${a*2}。技巧：${a}×2 = ${a}+${a} = ${a*2}` }; },
      mul3() { const a = CalcModule.rand(12, 99); return { question: `${a} × 3 = ?`, answer: String(a*3), explain: `${a} × 3 = ${a*3}。技巧：${a}×3 = ${a}+${a}+${a} = ${a*3}` }; },
      mul4() { const a = CalcModule.rand(12, 99); return { question: `${a} × 4 = ?`, answer: String(a*4), explain: `${a} × 4 = ${a*4}。技巧：${a}×4 = ${a*2}×2 = ${a*4}` }; },
      mul5() { const a = CalcModule.rand(12, 99); return { question: `${a} × 5 = ?`, answer: String(a*5), explain: `${a} × 5 = ${a*5}。技巧：${a}×5 = ${a}×10÷2 = ${a*5}` }; },
      mul6() { const a = CalcModule.rand(12, 99); return { question: `${a} × 6 = ?`, answer: String(a*6), explain: `${a} × 6 = ${a*6}。技巧：${a}×6 = ${a}×3×2 = ${a*3}×2 = ${a*6}` }; },
      mul9() { const a = CalcModule.rand(12, 99); return { question: `${a} × 9 = ?`, answer: String(a*9), explain: `${a} × 9 = ${a*9}。技巧：${a}×9 = ${a}×10 − ${a} = ${a*10} − ${a} = ${a*9}` }; },
      mul11() { const a = CalcModule.rand(12, 99); const s = Math.floor(a/10) + (a%10); const carry = s >= 10 ? 1 : 0; const mid = s % 10; const result = carry ? (Math.floor(a/10)+1)*100 + mid*10 + (a%10) : Math.floor(a/10)*100 + mid*10 + (a%10); return { question: `${a} × 11 = ?`, answer: String(a*11), explain: `${a} × 11 = ${a*11}。技巧："两边一拉，中间相加"：${Math.floor(a/10)} _ ${(a%10)}，中间 = ${Math.floor(a/10)}+${a%10}=${s}${carry ? '（进位）' : ''}` }; },
      mul15() { const a = CalcModule.rand(12, 99); return { question: `${a} × 15 = ?`, answer: String(a*15), explain: `${a} × 15 = ${a*15}。技巧：${a}×15 = ${a}×10 + ${a}×10÷2 = ${a*10} + ${a*5} = ${a*15}` }; },
      frac2dec() {
        const pool = [[1,2,0.5],[1,4,0.25],[3,4,0.75],[1,5,0.2],[2,5,0.4],[3,5,0.6],[1,8,0.125],[3,8,0.375],[5,8,0.625],[7,8,0.875],[1,3,0.333],[2,3,0.667]];
        const [n,d,v] = pool[CalcModule.rand(0, pool.length-1)];
        return { question: `${n}/${d} = ?（化为小数）`, answer: String(v), explain: `${n}/${d} = ${v}` };
      },
      dec2frac() {
        const pool = [[0.5,'1/2'],[0.25,'1/4'],[0.75,'3/4'],[0.2,'1/5'],[0.4,'2/5'],[0.6,'3/5'],[0.125,'1/8'],[0.375,'3/8'],[0.625,'5/8'],[0.875,'7/8']];
        const [v,f] = pool[CalcModule.rand(0, pool.length-1)];
        return { question: `${v} = ?（化为分数）`, answer: f, explain: `${v} = ${f}` };
      },
      pct2frac() {
        const pool = [['25%','1/4'],['50%','1/2'],['75%','3/4'],['20%','1/5'],['40%','2/5'],['60%','3/5'],['10%','1/10'],['12.5%','1/8'],['37.5%','3/8'],['62.5%','5/8']];
        const [p,f] = pool[CalcModule.rand(0, pool.length-1)];
        return { question: `${p} = ?（化为分数）`, answer: f, explain: `${p} = ${f}` };
      },
      frac2pct() {
        const pool = [['1/4','25%'],['1/2','50%'],['3/4','75%'],['1/5','20%'],['2/5','40%'],['3/5','60%'],['1/10','10%'],['1/8','12.5%'],['3/8','37.5%'],['5/8','62.5%']];
        const [f,p] = pool[CalcModule.rand(0, pool.length-1)];
        return { question: `${f} = ?（化为百分数）`, answer: p, explain: `${f} = ${p}` };
      },
      pct_est() {
        const pool = [['37.5%','3/8'],['62.5%','5/8'],['33.3%','1/3'],['66.7%','2/3'],['42.8%','3/7'],['57.1%','4/7'],['16.7%','1/6'],['83.3%','5/6']];
        const [p,f] = pool[CalcModule.rand(0, pool.length-1)];
        return { question: `百化分估算：${p} ≈ ?`, answer: f, explain: `${p} ≈ ${f}（估算用于快速计算）` };
      },
      squares() { const n = CalcModule.rand(11, 25); return { question: `${n}² = ?`, answer: String(n*n), explain: `${n}² = ${n*n}` }; },
    },
    // ===== 数量关系专项 =====
    quant: {
      ratio() {
        const a = CalcModule.rand(2, 9), b = CalcModule.rand(2, 9), c = CalcModule.rand(2, 9);
        const d = CalcModule.round(b * c / a);
        return { question: `A:B = ${a}:${b}，若 A = ${c}，则 B = ?`, answer: String(d), explain: `比例式 ${a}/${b} = ${c}/${d}，B = ${b}×${c}÷${a} = ${d}` };
      },
      engineering() {
        const total = CalcModule.rand(60, 240);
        const t1 = CalcModule.rand(3, 8), t2 = CalcModule.rand(3, 8);
        const e1 = CalcModule.round(total / t1), e2 = CalcModule.round(total / t2);
        const combined = e1 + e2;
        const days = CalcModule.round(total / combined);
        return { question: `一项工程，甲单独做需${t1}天，乙单独做需${t2}天。两人合作需要几天？（工程总量=${total}）`, answer: String(days), explain: `甲效率=${total}÷${t1}=${e1}，乙效率=${total}÷${t2}=${e2}，合作效率=${combined}，天数=${total}÷${combined}≈${days}天` };
      },
      mean_ineq() {
        const a = CalcModule.rand(2, 9), b = CalcModule.rand(2, 9);
        const am = CalcModule.round((a + b) / 2), gm = CalcModule.round(Math.sqrt(a * b), 2);
        return { question: `已知 a=${a}，b=${b}，求 (a+b)/2 和 √(ab)，并比较大小`, answer: `${am} ≥ ${gm}`, explain: `算术平均值 = (${a}+${b})/2 = ${am}，几何平均值 = √(${a}×${b}) = ${gm}。由均值不等式：${am} ≥ ${gm}` };
      },
      hanxin() {
        const r3 = CalcModule.rand(0, 2), r5 = CalcModule.rand(0, 4), r7 = CalcModule.rand(0, 6);
        let n = r7;
        while (n % 3 !== r3 || n % 5 !== r5 || n < 10) n += 7;
        if (n > 200) n -= 105;
        return { question: `有一群士兵，每3人一列余${r3}人，每5人一列余${r5}人，每7人一列余${r7}人。至少多少人？`, answer: String(n), explain: `韩信点兵（中国剩余定理）：满足 mod 3=${r3}，mod 5=${r5}，mod 7=${r7} 的最小正整数 = ${n}` };
      },
      indet_eq() {
        const a = CalcModule.rand(2, 5), b = CalcModule.rand(2, 5);
        const x = CalcModule.rand(1, 5), y = CalcModule.rand(1, 5);
        const c = a * x + b * y;
        return { question: `不定方程 ${a}x + ${b}y = ${c}，求一组正整数解。`, answer: `x=${x}, y=${y}`, explain: `验证：${a}×${x} + ${b}×${y} = ${a*x} + ${b*y} = ${c} ✓（答案不唯一）` };
      },
      gcd() {
        const a = CalcModule.rand(12, 99), b = CalcModule.rand(12, 99);
        const g = (function gcd(x,y){ while(y){[x,y]=[y,x%y];} return x; })(a, b);
        return { question: `${a} 和 ${b} 的最大公约数？`, answer: String(g), explain: `辗转相除法：gcd(${a}, ${b}) = ${g}` };
      },
      lcm() {
        const a = CalcModule.rand(3, 12), b = CalcModule.rand(3, 12);
        const g = (function gcd(x,y){ while(y){[x,y]=[y,x%y];} return x; })(a, b);
        const l = a * b / g;
        return { question: `${a} 和 ${b} 的最小公倍数？`, answer: String(l), explain: `lcm(${a}, ${b}) = ${a}×${b}÷gcd(${a},${b}) = ${a}×${b}÷${g} = ${l}` };
      },
      date_week() {
        const days = CalcModule.rand(10, 60);
        const startWeek = CalcModule.rand(0, 6);
        const weekDays = ['日','一','二','三','四','五','六'];
        const endWeek = (startWeek + days) % 7;
        return { question: `今天星期${weekDays[startWeek]}，${days}天后是星期几？`, answer: weekDays[endWeek], explain: `${days} ÷ 7 = ${Math.floor(days/7)} 余 ${days%7}，星期${weekDays[startWeek]} + ${days%7}天 = 星期${weekDays[endWeek]}` };
      },
    },
    // ===== 资料分析专项 =====
    data: {
      base_period() {
        const r = CalcModule.rand(5, 30), current = CalcModule.rand(500, 5000);
        const base = CalcModule.round(current / (1 + r / 100));
        return { question: `现期量 = ${current}，增长率 = ${r}%，求基期量？`, answer: String(base), explain: `基期量 = 现期量 ÷ (1 + r) = ${current} ÷ ${(1+r/100).toFixed(2)} ≈ ${base}` };
      },
      growth_amt() {
        const r = CalcModule.rand(5, 30), current = CalcModule.rand(500, 5000);
        const growth = CalcModule.round(current * r / (100 + r));
        return { question: `现期量 = ${current}，增长率 = ${r}%，求增长量？`, answer: String(growth), explain: `增长量 = 现期量 × r ÷ (1 + r) = ${current} × ${r}% ÷ ${(1+r/100).toFixed(2)} ≈ ${growth}` };
      },
      growth_rate() {
        const base = CalcModule.rand(500, 3000), r = CalcModule.rand(5, 30);
        const current = CalcModule.round(base * (1 + r / 100));
        return { question: `基期量 = ${base}，现期量 = ${current}，求增长率？`, answer: r + '%', explain: `增长率 = (现期 - 基期) / 基期 = (${current} - ${base}) / ${base} = ${r}%` };
      },
      base_diff() {
        const r1 = CalcModule.rand(5, 20), r2 = CalcModule.rand(5, 20);
        const c1 = CalcModule.rand(500, 2000), c2 = CalcModule.rand(500, 2000);
        const b1 = CalcModule.round(c1 / (1 + r1/100)), b2 = CalcModule.round(c2 / (1 + r2/100));
        const diff = CalcModule.round(b1 - b2);
        return { question: `A地区现期=${c1}，增长率=${r1}%；B地区现期=${c2}，增长率=${r2}%。求基期差（A−B）？`, answer: String(diff), explain: `A基期=${b1}，B基期=${b2}，差值=${diff}` };
      },
      prod_growth() {
        const ra = CalcModule.rand(5, 20), rb = CalcModule.rand(5, 20);
        const r = CalcModule.round(ra + rb + ra * rb / 100);
        return { question: `总量 = A × B，A的增长率 = ${ra}%，B的增长率 = ${rb}%，求总量的增长率？`, answer: r + '%', explain: `乘积增长率 = rA + rB + rA×rB/100 = ${ra} + ${rb} + ${ra*rb/100} ≈ ${r}%` };
      },
      avg_growth() {
        const rTotal = CalcModule.rand(10, 30), rNum = CalcModule.rand(2, 15);
        const r = CalcModule.round((rTotal - rNum) / (1 + rNum / 100));
        return { question: `总量增长率 = ${rTotal}%，份数增长率 = ${rNum}%，求平均数增长率？`, answer: r + '%', explain: `平均数增长率 = (总量增长率 - 份数增长率) / (1 + 份数增长率) = (${rTotal}% - ${rNum}%) / ${(1+rNum/100).toFixed(2)} ≈ ${r}%` };
      },
      mix_growth() {
        const r1 = CalcModule.rand(5, 15), r2 = CalcModule.rand(15, 30);
        const w1 = CalcModule.rand(30, 70);
        const w2 = 100 - w1;
        const r = CalcModule.round((w1 * r1 + w2 * r2) / 100);
        return { question: `部分A（占比${w1}%）增长率=${r1}%，部分B（占比${w2}%）增长率=${r2}%，求整体混合增长率？`, answer: r + '%', explain: `混合增长率 = ${w1}%×${r1}% + ${w2}%×${r2}% = ${r}%（介于${r1}%和${r2}%之间）` };
      },
      diff_growth() {
        const r1 = CalcModule.rand(10, 25), r2 = CalcModule.rand(2, 8);
        const r = CalcModule.round(r1 - r2);
        return { question: `A的增长率=${r1}%，B的增长率=${r2}%，求差值增长率（A−B）？`, answer: r + '%', explain: `差值增长率 ≈ rA - rB = ${r1}% - ${r2}% = ${r}%（近似公式）` };
      },
      base_weight() {
        const partR = CalcModule.rand(5, 20), wholeR = CalcModule.rand(5, 20);
        const partC = CalcModule.rand(200, 1000), wholeC = CalcModule.rand(1000, 5000);
        const partB = CalcModule.round(partC / (1 + partR/100));
        const wholeB = CalcModule.round(wholeC / (1 + wholeR/100));
        const w = CalcModule.round(partB / wholeB * 100);
        return { question: `部分现期=${partC}（增长率${partR}%），整体现期=${wholeC}（增长率${wholeR}%），求基期比重？`, answer: w + '%', explain: `部分基期=${partB}，整体基期=${wholeB}，基期比重=${partB}/${wholeB}≈${w}%` };
      },
      weight_diff() {
        const partR = CalcModule.rand(10, 25), wholeR = CalcModule.rand(2, 8);
        const w = CalcModule.round((partR - wholeR) / (1 + wholeR / 100));
        return { question: `部分增长率=${partR}%，整体增长率=${wholeR}%，求两期比重差（百分点）？`, answer: w + '个百分点', explain: `比重差 = (部分增长率 - 整体增长率) / (1 + 整体增长率) = (${partR}% - ${wholeR}%) / ${(1+wholeR/100).toFixed(2)} ≈ ${w}个百分点` };
      },
      contrib_growth() {
        const partGrowth = CalcModule.rand(50, 500), wholeGrowth = CalcModule.rand(200, 1000);
        const r = CalcModule.round(partGrowth / wholeGrowth * 100);
        return { question: `部分增长量=${partGrowth}，整体增长量=${wholeGrowth}，求贡献率？`, answer: r + '%', explain: `贡献率 = 部分增长量 / 整体增长量 = ${partGrowth} / ${wholeGrowth} ≈ ${r}%` };
      },
      drive_growth() {
        const partGrowth = CalcModule.rand(50, 500), wholeBase = CalcModule.rand(2000, 10000);
        const r = CalcModule.round(partGrowth / wholeBase * 100);
        return { question: `部分增长量=${partGrowth}，整体基期量=${wholeBase}，求拉动增长率？`, answer: r + '%', explain: `拉动增长率 = 部分增长量 / 整体基期量 = ${partGrowth} / ${wholeBase} ≈ ${r}%` };
      },
      change_compare() {
        const a = CalcModule.rand(100, 500), r1 = CalcModule.rand(5, 20);
        const b = CalcModule.rand(100, 500), r2 = CalcModule.rand(5, 20);
        const c = CalcModule.rand(100, 500), r3 = CalcModule.rand(5, 20);
        const g1 = CalcModule.round(a * r1 / (100 + r1));
        const g2 = CalcModule.round(b * r2 / (100 + r2));
        const g3 = CalcModule.round(c * r3 / (100 + r3));
        const items = [[a,r1,g1],[b,r2,g2],[c,r3,g3]];
        items.sort((x,y) => y[2] - x[2]);
        return { question: `A现期${a}增长率${r1}%，B现期${b}增长率${r2}%，C现期${c}增长率${r3}%。增长量最大的是？`, answer: ['A','B','C'][items.findIndex(x => x[2] === g1 && x[0]===a)] === 'A' && items[0][0]===a ? 'A' : items[0][0]===a?'A':items[0][0]===b?'B':'C', explain: `A增长量≈${g1}，B增长量≈${g2}，C增长量≈${g3}，最大的是增长量=${items[0][2]}对应的项` };
      },
      base_compare() {
        const r1 = CalcModule.rand(5, 20), r2 = CalcModule.rand(5, 20);
        const c1 = CalcModule.rand(500, 2000), c2 = CalcModule.rand(500, 2000);
        const b1 = CalcModule.round(c1 / (1 + r1/100)), b2 = CalcModule.round(c2 / (1 + r2/100));
        const ans = b1 > b2 ? 'A' : 'B';
        return { question: `A现期=${c1}增长率${r1}%，B现期=${c2}增长率${r2}%。基期量更大的是？`, answer: ans, explain: `A基期≈${b1}，B基期≈${b2}，更大的是${ans}` };
      },
      average() {
        const count = CalcModule.rand(3, 6);
        const nums = [];
        for (let i = 0; i < count; i++) nums.push(CalcModule.rand(20, 99));
        const sum = nums.reduce((a,b)=>a+b, 0);
        const avg = CalcModule.round(sum / count);
        return { question: `求平均值：${nums.join('、')}`, answer: String(avg), explain: `总和=${sum}，个数=${count}，平均值=${sum}÷${count}=${avg}` };
      },
      annual_growth() {
        const n = CalcModule.rand(3, 6);
        const ratio = CalcModule.rand(120, 180);
        const r = CalcModule.round((Math.pow(ratio / 100, 1 / n) - 1) * 100);
        return { question: `某指标${n}年间增长了到${ratio}%（末年/初年=${ratio}%），求年均增长率？`, answer: r + '%', explain: `年均增长率 = (末年/初年)^(1/n) - 1 = ${ratio}%^(1/${n}) - 1 ≈ ${r}%` };
      },
    }
  },

  // 生成单题
  generate(moduleKey, typeKey) {
    const gen = this.generators[moduleKey]?.[typeKey];
    if (!gen) return { question: '未知题型', answer: '', explain: '' };
    return gen();
  },

  // 生成批量题目
  generateBatch(moduleKey, typeKey, count = 10) {
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push(this.generate(moduleKey, typeKey));
    }
    return questions;
  },

  // 开始练习
  startQuiz(moduleKey, typeKey) {
    // 清除旧计时器
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    this.state.moduleKey = moduleKey;
    this.state.typeKey = typeKey;
    this.state.questions = this.generateBatch(moduleKey, typeKey, 10);
    this.state.currentIdx = 0;
    this.state.answers = {};
    this.state.showAnswer = {};
    this.state.inputValue = '';
    this.state.startTime = Date.now();
    this.state.endTime = null;
    this.state.elapsedTime = 0;
    this.state.finished = false;
    this.state.timerInterval = setInterval(() => {
      if (!this.state.finished && this.state.startTime) {
        const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
        const timerEl = document.getElementById('calcTimer');
        if (timerEl) {
          timerEl.textContent = this.formatTime(elapsed);
          // 超时变色
          if (elapsed > 60) {
            timerEl.className = 'calc-timer over-time';
          } else if (elapsed > 45) {
            timerEl.className = 'calc-timer warn-time';
          } else if (elapsed > 30) {
            timerEl.className = 'calc-timer ok-time';
          }
        }
      }
    }, 1000);
    this.renderQuiz(document.getElementById('resourcesContent'));
  },

  // 返回类型选择
  backToTypes() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = null;
    }
    this.state.moduleKey = null;
    this.state.typeKey = null;
    this.state.questions = [];
    this.state.startTime = null;
    this.state.endTime = null;
    this.state.elapsedTime = null;
    this.state.finished = false;
    ResourcesModule.renderTab();
  },

  // 格式化时间
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}分${s}秒` : `${s}秒`;
  },

  // 获取评级
  getRating(seconds) {
    if (seconds <= 30) return { level: '优秀', class: 'excellent', icon: '🏆', desc: '速度很快，继续保持！' };
    if (seconds <= 45) return { level: '良好', class: 'good', icon: '👍', desc: '不错的表现，再接再厉！' };
    if (seconds <= 60) return { level: '及格', class: 'pass', icon: '✅', desc: '基本掌握，可以更快！' };
    return { level: '需努力', class: 'try-harder', icon: '💪', desc: '多加练习，提升速度！' };
  },

  // 渲染题目
  renderQuiz(container) {
    const { questions, currentIdx, answers, showAnswer, startTime, endTime, finished } = this.state;

    // 如果已完成全部 10 题，显示结果页
    if (finished) {
      this.renderResult(container);
      return;
    }

    const q = questions[currentIdx];
    if (!q) return;

    const answered = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a).length;
    const total = questions.length;
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const timerClass = elapsed > 60 ? 'over-time' : (elapsed > 45 ? 'warn-time' : (elapsed > 30 ? 'ok-time' : ''));

    container.innerHTML = `
      <div class="calc-quiz-area">
        <div class="calc-quiz-header">
          <button class="btn btn-secondary btn-small" onclick="CalcModule.backToTypes()">${titleIcon('arrowLeft', 14)} 返回</button>
          <div class="calc-quiz-stats">
            <span class="calc-timer ${timerClass}" id="calcTimer">${this.formatTime(elapsed)}</span>
            <span class="calc-stat">${currentIdx + 1}/${total}</span>
            <span class="calc-stat correct-count">✓ ${correct}</span>
          </div>
        </div>

        <div class="calc-progress-bar">
          <div class="calc-progress-fill" style="width: ${((currentIdx + 1) / total) * 100}%"></div>
        </div>

        <div class="calc-question-card">
          <div class="calc-question-text">${Utils.escape(q.question)}</div>

          <!-- 数字键盘显示区 -->
          <div class="calc-display-row">
            <div class="calc-answer-display" id="calcAnswerDisplay">${this.state.inputValue !== undefined ? Utils.escape(this.state.inputValue) : ''}</div>
            ${answers[currentIdx] === undefined ? `
              <button class="btn btn-primary btn-small" onclick="CalcModule.confirmInput()">确认</button>
            ` : ''}
          </div>

          <!-- 数字键盘 -->
          ${answers[currentIdx] === undefined ? this.renderKeypad() : ''}

          ${showAnswer[currentIdx] ? `
            <div class="calc-answer-box ${answers[currentIdx] ? 'correct' : 'wrong'}">
              <div class="calc-answer-status">${answers[currentIdx] ? '✓ 回答正确' : '✗ 回答错误'}</div>
              <div class="calc-answer-text">正确答案：${Utils.escape(q.answer)}</div>
              <div class="calc-explain">${Utils.nl2br(q.explain)}</div>
            </div>
          ` : ''}
        </div>

        <div class="calc-nav">
          <button class="btn btn-secondary btn-small" onclick="CalcModule.prevQuestion()" ${currentIdx === 0 ? 'disabled' : ''}>上一题</button>
          <button class="btn btn-primary btn-small" onclick="CalcModule.nextQuestion()" ${currentIdx === total - 1 ? 'disabled' : ''}>下一题</button>
        </div>
      </div>
    `;

    // 自动聚焦输入框（已不需要，数字键盘直接操作）
  },

  // 渲染数字键盘输入器
  renderKeypad() {
    return `
      <div class="calc-keypad">
        <div class="calc-keypad-row">
          <button class="calc-keypad-btn calc-keypad-action" onclick="CalcModule.skipQuestion()">跳过</button>
          <button class="calc-keypad-btn calc-keypad-action" onclick="CalcModule.clearInput()">清空</button>
          <button class="calc-keypad-btn calc-keypad-action" onclick="CalcModule.backspace()">退格</button>
        </div>
        <div class="calc-keypad-row">
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('1')">1</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('2')">2</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('3')">3</button>
        </div>
        <div class="calc-keypad-row">
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('4')">4</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('5')">5</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('6')">6</button>
        </div>
        <div class="calc-keypad-row">
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('7')">7</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('8')">8</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('9')">9</button>
        </div>
        <div class="calc-keypad-row">
          <button class="calc-keypad-btn calc-keypad-symbol" onclick="CalcModule.inputDot()">.</button>
          <button class="calc-keypad-btn" onclick="CalcModule.inputDigit('0')">0</button>
          <button class="calc-keypad-btn calc-keypad-symbol" onclick="CalcModule.inputSlash()">/</button>
        </div>
        <div class="calc-keypad-row">
          <button class="calc-keypad-btn calc-keypad-confirm calc-keypad-confirm-full" onclick="CalcModule.confirmInput()">确认</button>
        </div>
      </div>
    `;
  },

  // 输入小数点
  inputDot() {
    if (this.state.showAnswer[this.state.currentIdx]) return;
    if ((this.state.inputValue || '').length >= 20) return;
    // 防止输入多个小数点
    if ((this.state.inputValue || '').includes('.')) return;
    this.state.inputValue = (this.state.inputValue || '') + '.';
    this.updateInputDisplay();
  },

  // 输入斜杠（用于除法或比例）
  inputSlash() {
    if (this.state.showAnswer[this.state.currentIdx]) return;
    if ((this.state.inputValue || '').length >= 20) return;
    this.state.inputValue = (this.state.inputValue || '') + '/';
    this.updateInputDisplay();
  },

  // 输入数字
  inputDigit(digit) {
    if (this.state.showAnswer[this.state.currentIdx]) return; // 已答题目不可输入
    if ((this.state.inputValue || '').length >= 20) return;
    this.state.inputValue = (this.state.inputValue || '') + digit;
    this.updateInputDisplay();
  },

  // 输入逗号（用于千分位或答案中的逗号）
  inputComma() {
    if (this.state.showAnswer[this.state.currentIdx]) return;
    if ((this.state.inputValue || '').length >= 20) return;
    this.state.inputValue = (this.state.inputValue || '') + ',';
    this.updateInputDisplay();
  },

  // 退格
  backspace() {
    if (this.state.showAnswer[this.state.currentIdx]) return;
    const val = this.state.inputValue || '';
    this.state.inputValue = val.slice(0, -1);
    this.updateInputDisplay();
  },

  // 清空
  clearInput() {
    if (this.state.showAnswer[this.state.currentIdx]) return;
    this.state.inputValue = '';
    this.updateInputDisplay();
  },

  // 跳过本题
  skipQuestion() {
    const { currentIdx, questions } = this.state;
    this.state.answers[currentIdx] = '';
    this.state.showAnswer[currentIdx] = true;
    Utils.toast('已跳过，请看解析', 'info');
    this.checkFinishOrRender();
  },

  // 确认输入
  confirmInput() {
    const userAns = (this.state.inputValue || '').trim();
    if (!userAns) {
      Utils.toast('请先输入答案', 'error');
      return;
    }
    this.submitAnswer(userAns);
  },

  // 更新显示区
  updateInputDisplay() {
    const display = document.getElementById('calcAnswerDisplay');
    if (display) display.textContent = this.state.inputValue || '';
  },

  // 检查是否完成或继续渲染
  checkFinishOrRender() {
    const total = this.state.questions.length;
    const answeredCount = Object.keys(this.state.answers).length;
    if (answeredCount >= total) {
      if (this.state.timerInterval) {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = null;
      }
      this.state.endTime = Date.now();
      this.state.finished = true;
      setTimeout(() => {
        this.renderQuiz(document.getElementById('resourcesContent'));
      }, 1500);
    } else {
      this.state.inputValue = '';
      this.renderQuiz(document.getElementById('resourcesContent'));
    }
  },

  // 渲染结果页
  renderResult(container) {
    const { questions, answers, startTime, endTime, moduleKey, typeKey } = this.state;
    const total = questions.length;
    const correct = Object.values(answers).filter(a => a).length;
    const seconds = Math.floor((endTime - startTime) / 1000);
    const rating = this.getRating(seconds);
    const accuracy = Math.round((correct / total) * 100);

    // 找类型名
    const types = this.typeDefs[moduleKey] || [];
    const typeDef = types.find(t => t.key === typeKey);
    const typeName = typeDef ? typeDef.name : '';

    container.innerHTML = `
      <div class="calc-result-area">
        <div class="calc-result-card rating-${rating.class}">
          <div class="calc-result-icon">${rating.icon}</div>
          <div class="calc-result-level">${rating.level}</div>
          <div class="calc-result-desc">${rating.desc}</div>

          <div class="calc-result-stats">
            <div class="calc-result-stat-item">
              <div class="calc-result-stat-label">用时</div>
              <div class="calc-result-stat-value">${this.formatTime(seconds)}</div>
            </div>
            <div class="calc-result-stat-item">
              <div class="calc-result-stat-label">正确</div>
              <div class="calc-result-stat-value">${correct}/${total}</div>
            </div>
            <div class="calc-result-stat-item">
              <div class="calc-result-stat-label">正确率</div>
              <div class="calc-result-stat-value">${accuracy}%</div>
            </div>
          </div>

          <div class="calc-result-standards">
            <div class="calc-standard ${seconds <= 30 ? 'active' : ''}">
              <span class="calc-standard-icon">${seconds <= 30 ? '🏆' : '⏱'}</span>
              <span class="calc-standard-label">优秀</span>
              <span class="calc-standard-time">≤30秒</span>
            </div>
            <div class="calc-standard ${seconds > 30 && seconds <= 45 ? 'active' : ''}">
              <span class="calc-standard-icon">${seconds > 30 && seconds <= 45 ? '👍' : '⏱'}</span>
              <span class="calc-standard-label">良好</span>
              <span class="calc-standard-time">≤45秒</span>
            </div>
            <div class="calc-standard ${seconds > 45 && seconds <= 60 ? 'active' : ''}">
              <span class="calc-standard-icon">${seconds > 45 && seconds <= 60 ? '✅' : '⏱'}</span>
              <span class="calc-standard-label">及格</span>
              <span class="calc-standard-time">≤60秒</span>
            </div>
            <div class="calc-standard ${seconds > 60 ? 'active' : ''}">
              <span class="calc-standard-icon">${seconds > 60 ? '💪' : '⏱'}</span>
              <span class="calc-standard-label">需努力</span>
              <span class="calc-standard-time">>60秒</span>
            </div>
          </div>

          <div class="calc-result-type">${Utils.escape(typeName)} · ${total}题</div>

          <div class="calc-result-actions">
            <button class="btn btn-primary" onclick="CalcModule.startQuiz('${moduleKey}', '${typeKey}')">${titleIcon('refresh', 14)} 再练一组</button>
            <button class="btn btn-secondary" onclick="CalcModule.backToTypes()">${titleIcon('arrowLeft', 14)} 返回列表</button>
          </div>
        </div>
      </div>
    `;
  },

  // 提交答案
  submitAnswer(userAns) {
    if (userAns === undefined) {
      const input = document.getElementById('calcAnswerInput');
      if (!input) return;
      userAns = input.value.trim();
    }
    if (!userAns) {
      Utils.toast('请输入答案', 'error');
      return;
    }

    const { currentIdx, questions } = this.state;
    const correctAns = questions[currentIdx].answer;
    const isCorrect = userAns === correctAns;

    this.state.answers[currentIdx] = userAns;
    this.state.showAnswer[currentIdx] = true;

    Utils.toast(isCorrect ? '回答正确！' : '答案错误，请看解析', isCorrect ? 'success' : 'error');

    // 检查是否全部 10 题已答完
    const total = questions.length;
    const answeredCount = Object.keys(this.state.answers).length;
    if (answeredCount >= total) {
      // 停止计时
      if (this.state.timerInterval) {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = null;
      }
      this.state.endTime = Date.now();
      this.state.finished = true;
      // 延迟 1.5 秒后显示结果，让用户看到最后一题的解析
      setTimeout(() => {
        this.renderQuiz(document.getElementById('resourcesContent'));
      }, 1500);
    } else {
      this.renderQuiz(document.getElementById('resourcesContent'));
    }
  },

  // 下一题
  nextQuestion() {
    if (this.state.currentIdx < this.state.questions.length - 1) {
      this.state.currentIdx++;
      this.state.inputValue = '';
      this.renderQuiz(document.getElementById('resourcesContent'));
    }
  },

  // 上一题
  prevQuestion() {
    if (this.state.currentIdx > 0) {
      this.state.currentIdx--;
      this.state.inputValue = '';
      this.renderQuiz(document.getElementById('resourcesContent'));
    }
  }
};

// ========== 7. 英语 ==========
ModuleRenderers.english = function() {
  const content = document.getElementById('content');
  const tab = App.englishState.tab;

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('globe', 26)} 每日英语</div>
        <div class="page-subtitle">Vlog · 单词 · 学习 · 统计 · 听写 · 英译中 · 中译英</div>
      </div>

      <div class="english-tabs">
        <div class="quiz-tab ${tab === 'vlog' ? 'active' : ''}" onclick="EnglishModule.switchTab('vlog')">${titleIcon('externalLink', 14)} Vlog</div>
        <div class="quiz-tab ${tab === 'words' ? 'active' : ''}" onclick="EnglishModule.switchTab('words')">${titleIcon('book', 14)} 单词</div>
        <div class="quiz-tab ${tab === 'study' ? 'active' : ''}" onclick="EnglishModule.switchTab('study')">${titleIcon('target', 14)} 学习</div>
        <div class="quiz-tab ${tab === 'stats' ? 'active' : ''}" onclick="EnglishModule.switchTab('stats')">${titleIcon('barChart', 14)} 统计</div>
        <div class="quiz-tab ${tab === 'dictation' ? 'active' : ''}" onclick="EnglishModule.switchTab('dictation')">${titleIcon('compass', 14)} 听写</div>
        <div class="quiz-tab ${tab === 'en2zh' ? 'active' : ''}" onclick="EnglishModule.switchTab('en2zh')">${titleIcon('write', 14)} 英译中</div>
        <div class="quiz-tab ${tab === 'zh2en' ? 'active' : ''}" onclick="EnglishModule.switchTab('zh2en')">${titleIcon('write', 14)} 中译英</div>
      </div>

      <div id="englishContent"></div>
    </div>
  `;

  if (tab === 'vlog') {
    EnglishModule.renderVlog();
  } else if (tab === 'words') {
    EnglishModule.renderWords();
  } else if (tab === 'study') {
    EnglishModule.renderStudy();
  } else if (tab === 'stats') {
    EnglishModule.renderStats();
  } else if (tab === 'dictation') {
    EnglishModule.renderDictation();
  } else {
    EnglishModule.renderSentences();
  }
};

const EnglishModule = {
  // Vlog 数据库 —— 博主拍摄英文Vlog（真实博主日常生活记录）
  VLOG_LIST: [
    { bvid: 'BV1UtrKYVEnV', channel: 'TuesMagique', title: '【全英VLOG】大学老师的期末周｜早八｜健身｜尝试新穿搭风格', level: '中级', desc: '大学老师真实日常，全英记录期末周的充实一天，语音清晰地道', play: '7.6万' },
    { bvid: 'BV1RejwzREGQ', channel: 'TuesMagique', title: '全英VLOG｜早八人5AM起床的充实一天｜上课｜太极｜图书馆自习', level: '中级', desc: '5点起床的晨间日常，沉浸式感受自律生活，全英解说', play: '11.1万' },
    { bvid: 'BV1hEEwz9Ez7', channel: 'TuesMagique', title: '【全英VLOG】在南京 被这里狠狠震撼了', level: '中级', desc: '旅行Vlog，用英语讲述中国城市故事，文化感满满', play: '10.9万' },
    { bvid: 'BV1eC411E7DJ', channel: 'TuesMagique', title: '全英VLOG｜在广西 用英语讲非遗故事｜三月三｜传统绣球制作', level: '中级', desc: '用英语传播中国非遗文化，旅行+文化双收获', play: '14.7万' },
    { bvid: 'BV1ynxTzGEAP', channel: 'TuesMagique', title: '巴塞夏日｜全英VLOG', level: '中级', desc: '巴塞罗那夏日旅行全英记录，阳光海滩异国风情', play: '2.7万' },
    { bvid: 'BV17tULBFEon', channel: 'TuesMagique', title: '【全英】去芬兰啦，拍了像纪录片的VLOG｜农场记者上线｜全员e人', level: '中高级', desc: '芬兰农场体验全英记录，纪录片质感，地道英式发音', play: '5.7万' },
    { bvid: 'BV1H2gCzTEeA', channel: 'TuesMagique', title: '【全英VLOG】结课周的日常', level: '中级', desc: '结课周校园日常，学习生活平衡的真实记录', play: '4.7万' },
    { bvid: 'BV1kAv1BDEAh', channel: '英语老师周太阳', title: 'Birta Hlin 国外真实生活Vlog 双语字幕 100集合集', level: '中级', desc: '油管博主Birta Hlin真实生活记录，100集双语字幕', play: '45.1万' },
    { bvid: 'BV1qGB8BgEsG', channel: '杰克船长爸爸爱学习', title: 'Birta Hlin 英语Vlog视频合集 100期双语字幕', level: '中级', desc: '博主日常旅行生活分享，中英双语字幕，地道口语素材', play: '7.3万' },
    { bvid: 'BV1H4MD6KEGo', channel: '-Hi鱼饼大王', title: '跟着外网博主Sydney Serena学习地道日常口语', level: '中级', desc: 'Sydney Serena博主Vlog，中英字幕+知识点总结', play: '150' },
    { bvid: 'BV1bp1jBrEmF', channel: 'Nami英语充电站', title: '全英Vlog 沉浸式宅家日常 | 油管Sydney Serena', level: '中级', desc: '博主宅家日常全英记录，轻松学地道生活用语', play: '24' },
    { bvid: 'BV1NG411676y', channel: '油管vlog学英语', title: '英文vlog精听 学习用品类词汇 | 博主日常', level: '中级', desc: '含vlog生词表，跟着油管博主Vlog学英语', play: '3.9万' },
    { bvid: 'BV1SaMQ6DEKa', channel: 'Evelyn的英语学习日记', title: '英文vlog精听 逃避循环：大脑为什么逃避重要的事', level: '中高级', desc: '中英双语，博主深度思考类Vlog，提升思辨+英语', play: '2250' },
    { bvid: 'BV12qq2BPEz9', channel: '沪漂英语博主', title: '全英Vlog｜普通沪漂英语博主的日常Vlog', level: '中级', desc: '沪漂博主真实日常全英记录，接地气的生活英语', play: '新发布' },
    { bvid: 'BV1etnez9E1e', channel: '艾莉牙好白', title: '全英vlog｜在平静的生活中感受当下 & 可可托海一日游', level: '中级', desc: '新疆可可托海旅行全英记录，慢生活治愈系Vlog', play: '2.3万' },
    { bvid: 'BV14nDZYGE6c', channel: '全英博主', title: '全英文VLOG｜A Day In My Life', level: '初级', desc: '博主一日生活全记录，语速适中，适合初学者跟学', play: '1.4万' },
    { bvid: 'BV132pdebEnM', channel: '紫芋圆西米露', title: '高中生暑假｜全英旅行vlog', level: '初级', desc: '高中生博主暑假旅行全英记录，青春活力接地气', play: '8.9万' },
    { bvid: 'BV1Gqs6zmEAz', channel: '油管旅行博主', title: '全英Vlog 油管旅行人气博主 爱尔兰戈尔韦48小时攻略', level: '中高级', desc: '旅行博主爱尔兰深度游全英记录，文化+美食+风景', play: '新发布' },
    { bvid: 'BV16JV36KELJ', channel: 'Isabel Paiqe', title: '全英vlog 五月采花酿酒的山间生活', level: '中级', desc: '博主山居生活全英记录，治愈系田园Vlog，含食谱分享', play: '新发布' },
    { bvid: 'BV1eT4y1d7NG', channel: 'TuesMagique', title: '【全英伦敦VLOG】开学过敏进急诊后，我开始学做饭了', level: '中级', desc: '伦敦留学生活真实记录，英式发音，幽默接地气', play: '14.2万' },
  ],

  switchTab(tab) {
    App.englishState.tab = tab;
    App.englishState.wordIndex = 0;
    App.englishState.flipped = false;
    App.englishState.studyMode = null;
    ModuleRenderers.english();
  },

  // 渲染 Vlog 页面
  renderVlog() {
    const seed = Utils.dateSeed();
    const offset = DB.getToday('duxing_vlog_offset', 0);
    const moreOffset = DB.getToday('duxing_vlog_more_offset', 0);
    const shuffled = Utils.seededShuffle([...this.VLOG_LIST], seed + offset * 3719);
    const todayPick = shuffled[0];   // 今日推荐
    const moreShuffled = Utils.seededShuffle([...this.VLOG_LIST], seed + moreOffset * 5821 + offset * 3719);
    const others = moreShuffled.slice(0, 6);  // 额外推荐 6 个

    document.getElementById('englishContent').innerHTML = `
      <!-- 今日推荐 -->
      <div class="vlog-section">
        <div class="vlog-section-header">
          <span class="vlog-section-icon">🎬</span>
          <span class="vlog-section-title">今日推荐</span>
          <button class="vlog-refresh-btn" onclick="EnglishModule.refreshVlog()">🔄 换一个</button>
        </div>
        <div class="vlog-featured-card">
          <div class="vlog-video-wrapper">
            <iframe
              src="https://player.bilibili.com/player.html?bvid=${todayPick.bvid}&high_quality=1&danmuku=0&autoplay=0"
              title="${Utils.escape(todayPick.title)}"
              frameborder="0"
              allow="fullscreen"
              allowfullscreen
              scrolling="no">
            </iframe>
          </div>
          <div class="vlog-info">
            <div class="vlog-badges">
              <span class="vlog-badge vlog-badge-level">${Utils.escape(todayPick.level)}</span>
              <span class="vlog-badge vlog-badge-duration">▶ ${Utils.escape(todayPick.play)}播放</span>
              <span class="vlog-badge vlog-badge-channel">${Utils.escape(todayPick.channel)}</span>
            </div>
            <div class="vlog-title">${Utils.escape(todayPick.title)}</div>
            <div class="vlog-desc">${Utils.escape(todayPick.desc)}</div>
            <div class="vlog-tips">
              <strong>💡 学习建议：</strong>
              ① 先开英文字幕看一遍 → ② 关字幕再看一遍 → ③ 跟读模仿发音 → ④ 记录生词和地道表达
            </div>
          </div>
        </div>
      </div>

      <!-- 更多推荐 -->
      <div class="vlog-section">
        <div class="vlog-section-header">
          <span class="vlog-section-icon">📺</span>
          <span class="vlog-section-title">更多推荐</span>
          <button class="vlog-refresh-btn" onclick="EnglishModule.refreshMoreVlog()" title="从B站重新获取推荐视频">🔄 换一批</button>
        </div>
        <div class="vlog-grid">
          ${others.map((v, i) => `
            <div class="vlog-card" onclick="EnglishModule.playVlog('${v.bvid}')">
              <div class="vlog-thumb">
                <img src="https://pic.bilivideo.cn/thumb/${v.bvid}.jpg" alt="${Utils.escape(v.title)}" loading="lazy"
                     onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,var(--pink-light),var(--blue-light))'">
                <div class="vlog-thumb-overlay">▶</div>
                <span class="vlog-thumb-duration">${Utils.escape(v.play)}</span>
              </div>
              <div class="vlog-card-body">
                <span class="vlog-badge vlog-badge-level vlog-badge-sm">${Utils.escape(v.level)}</span>
                <div class="vlog-card-title">${Utils.escape(v.title)}</div>
                <div class="vlog-card-channel">${Utils.escape(v.channel)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 学习提示 -->
      <div class="vlog-section">
        <div class="vlog-section-header">
          <span class="vlog-section-icon">📝</span>
          <span class="vlog-section-title">Vlog 学习方法</span>
        </div>
        <div class="vlog-tips-card">
          <div class="vlog-tip-item">
            <span class="vlog-tip-num">1</span>
            <div><strong>第一遍：开字幕看</strong><br>打开英文字幕，跟着博主沉浸式感受真实生活场景，理解大意</div>
          </div>
          <div class="vlog-tip-item">
            <span class="vlog-tip-num">2</span>
            <div><strong>第二遍：关字幕听</strong><br>关闭字幕专注听力，注意博主的语音语调、连读和地道表达</div>
          </div>
          <div class="vlog-tip-item">
            <span class="vlog-tip-num">3</span>
            <div><strong>第三遍：影子跟读</strong><br>逐句暂停模仿博主的发音、语调和节奏，让嘴巴形成肌肉记忆</div>
          </div>
          <div class="vlog-tip-item">
            <span class="vlog-tip-num">4</span>
            <div><strong>整理表达</strong><br>记录博主的地道口语、俚语和生活词汇，建立自己的口语素材库</div>
          </div>
        </div>
      </div>
    `;
  },

  refreshVlog() {
    const offset = DB.getToday('duxing_vlog_offset', 0);
    DB.setToday('duxing_vlog_offset', offset + 1);
    this.renderVlog();
    Utils.toast('已刷新推荐');
  },

  refreshMoreVlog() {
    const offset = DB.getToday('duxing_vlog_more_offset', 0);
    DB.setToday('duxing_vlog_more_offset', offset + 1);
    this.renderVlog();
    Utils.toast('已从B站获取新推荐');
  },

  playVlog(bvid) {
    // 在顶部播放器加载选中的视频，并同步更新标题、描述、学习建议等信息
    const video = this.VLOG_LIST.find(v => v.bvid === bvid);
    if (!video) return;

    const featured = document.querySelector('.vlog-featured-card');
    if (!featured) return;

    const iframe = featured.querySelector('iframe');
    if (iframe) {
      iframe.src = `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmuku=0&autoplay=1`;
    }

    // 更新标题、标签、描述和学习建议
    const titleEl = featured.querySelector('.vlog-title');
    const descEl = featured.querySelector('.vlog-desc');
    const badgesEl = featured.querySelector('.vlog-badges');
    const tipsEl = featured.querySelector('.vlog-tips');

    if (badgesEl) {
      badgesEl.innerHTML = `
        <span class="vlog-badge vlog-badge-level">${Utils.escape(video.level)}</span>
        <span class="vlog-badge vlog-badge-duration">▶ ${Utils.escape(video.play)}播放</span>
        <span class="vlog-badge vlog-badge-channel">${Utils.escape(video.channel)}</span>
      `;
    }
    if (titleEl) titleEl.textContent = video.title;
    if (descEl) descEl.textContent = video.desc;
    if (tipsEl) {
      tipsEl.innerHTML = `
        <strong>💡 学习建议：</strong>
        ① 先开英文字幕看一遍 → ② 关字幕再看一遍 → ③ 跟读模仿发音 → ④ 记录生词和地道表达
      `;
    }

    featured.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  // ===== 背单词系统 =====

  // 配置
  getConfig() {
    return DB.get('duxing_eng_config', { dailyNewWords: 20 });
  },
  setConfig(key, value) {
    const config = this.getConfig();
    config[key] = value;
    DB.set('duxing_eng_config', config);
  },

  // 进度数据
  getProgress() {
    return DB.get('duxing_eng_progress', {});
  },

  // 统计数据
  getStats() {
    const progress = this.getProgress();
    const today = App.today;
    const all = Object.values(progress);
    const totalLearned = all.length;
    const totalMastered = all.filter(p => p.status === 'mastered').length;
    const pendingReview = all.filter(p => p.status !== 'new' && p.status !== 'mastered' && p.nextReview <= today).length;
    const statsData = DB.get('duxing_eng_stats', { streak: 0, lastStudyDate: null });
    return { totalLearned, totalMastered, pendingReview, totalWords: SEED_DATA.englishWords.length, streak: statsData.streak || 0 };
  },

  // 艾宾浩斯遗忘曲线间隔
  REVIEW_INTERVALS: [0, 1, 2, 4, 7, 15],

  // 查询到期复习词
  getDueReviewWords() {
    const progress = this.getProgress();
    const today = App.today;
    return Object.values(progress).filter(wp =>
      wp.status !== 'new' && wp.nextReview <= today
    ).map(wp => wp.wordId);
  },

  // 生成每日计划
  generateDailyPlan() {
    const config = this.getConfig();
    const progress = this.getProgress();
    const allWords = SEED_DATA.englishWords;
    const today = App.today;
    const learnedIds = new Set(Object.keys(progress));
    const reviewWordIds = this.getDueReviewWords();
    const newCandidates = allWords.filter(w => !learnedIds.has(w.id)).map(w => w.id);
    const newWordIds = Utils.seededShuffle(newCandidates, Utils.dateSeed()).slice(0, config.dailyNewWords);
    const plan = { date: today, newWordIds, reviewWordIds };
    DB.set('duxing_eng_daily_plan', plan);
    return plan;
  },

  // 获取今日计划
  getTodayPlan() {
    const plan = DB.get('duxing_eng_daily_plan', null);
    if (!plan || plan.date !== App.today) {
      return this.generateDailyPlan();
    }
    return plan;
  },

  // 更新单词进度（遗忘曲线核心）
  updateWordProgress(wordId, correct) {
    const progress = this.getProgress();
    const wp = progress[wordId] || {
      wordId, status: 'new', box: 0, nextReview: App.today,
      lastReview: null, reviewCount: 0, correctCount: 0, wrongCount: 0,
      introducedDate: App.today, masteredDate: null
    };
    const today = App.today;
    wp.lastReview = today;
    wp.reviewCount++;
    if (correct) {
      wp.correctCount++;
      wp.box = Math.min(wp.box + 1, 5);
      if (wp.box === 5 && wp.status !== 'mastered') {
        wp.status = 'mastered';
        wp.masteredDate = today;
      } else if (wp.box > 0 && wp.status === 'new') {
        wp.status = 'learning';
      } else if (wp.box >= 3) {
        wp.status = 'review';
      }
    } else {
      wp.wrongCount++;
      if (wp.status === 'mastered' || wp.box === 5) {
        wp.box = 3; wp.status = 'review';
      } else {
        wp.box = Math.max(1, wp.box - 1);
        wp.status = wp.box >= 3 ? 'review' : 'learning';
      }
    }
    const interval = this.REVIEW_INTERVALS[wp.box];
    const next = new Date();
    next.setDate(next.getDate() + interval);
    wp.nextReview = getLocalDateStr(next);
    progress[wordId] = wp;
    DB.set('duxing_eng_progress', progress);
    return wp;
  },

  // 生成选择题选项
  generateOptions(word, field) {
    const correct = word[field];
    const allWords = SEED_DATA.englishWords;
    const pool = allWords.filter(w => w.id !== word.id && w.level === word.level);
    const shuffled = Utils.shuffle ? Utils.shuffle([...pool]) : pool.sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3).map(w => w[field]);
    return Utils.shuffle ? Utils.shuffle([correct, ...distractors]) : [correct, ...distractors].sort(() => Math.random() - 0.5);
  },

  // ============ 仪表盘 ============
  renderWords() {
    const stats = this.getStats();
    const plan = this.getTodayPlan();
    const config = this.getConfig();
    const totalNew = plan.newWordIds.length;
    const totalReview = plan.reviewWordIds.length;
    const totalToday = totalNew + totalReview;

    document.getElementById('englishContent').innerHTML = `
      <div class="eng-dashboard">
        <div class="eng-stats-row">
          <div class="eng-stat-card">
            <div class="eng-stat-value">${stats.totalLearned}</div>
            <div class="eng-stat-label">已学单词</div>
          </div>
          <div class="eng-stat-card">
            <div class="eng-stat-value eng-stat-warning">${stats.pendingReview}</div>
            <div class="eng-stat-label">待复习</div>
          </div>
          <div class="eng-stat-card">
            <div class="eng-stat-value eng-stat-success">${stats.totalMastered}</div>
            <div class="eng-stat-label">已掌握</div>
          </div>
          <div class="eng-stat-card">
            <div class="eng-stat-value eng-stat-primary">${stats.streak}</div>
            <div class="eng-stat-label">累计天数</div>
          </div>
        </div>

        <div class="eng-plan-card">
          <div class="eng-plan-info">
            <div class="eng-plan-title">今日学习计划</div>
            <div class="eng-plan-counts">
              <span class="eng-plan-tag eng-plan-tag-new">新词 ${totalNew}</span>
              <span class="eng-plan-tag eng-plan-tag-review">复习 ${totalReview}</span>
              <span class="eng-plan-tag eng-plan-tag-total">合计 ${totalToday} 词</span>
            </div>
          </div>
          ${totalToday > 0 ? `<button class="btn btn-primary eng-plan-btn" onclick="EnglishModule.startStudy('en2zh')">开始学习</button>` : `<div class="eng-plan-done">🎉 今日任务已完成！</div>`}
        </div>

        <div class="eng-mode-select">
          <div class="eng-mode-card" onclick="EnglishModule.startStudy('en2zh')">
            <div class="eng-mode-icon">🇬🇧→🇨🇳</div>
            <div class="eng-mode-title">看英选义</div>
            <div class="eng-mode-desc">看英文选中文释义</div>
          </div>
          <div class="eng-mode-card" onclick="EnglishModule.startStudy('zh2en')">
            <div class="eng-mode-icon">🇨🇳→🇬🇧</div>
            <div class="eng-mode-title">看义选英</div>
            <div class="eng-mode-desc">看中文选英文单词</div>
          </div>
          <div class="eng-mode-card" onclick="EnglishModule.startStudy('dictation')">
            <div class="eng-mode-icon">✍️</div>
            <div class="eng-mode-title">拼写默写</div>
            <div class="eng-mode-desc">看中文拼写英文</div>
          </div>
          <div class="eng-mode-card" onclick="EnglishModule.startStudy('flashcard')">
            <div class="eng-mode-icon">🃏</div>
            <div class="eng-mode-title">卡片复习</div>
            <div class="eng-mode-desc">翻转卡片记忆复习</div>
          </div>
        </div>

        <div class="eng-config-bar">
          <label class="eng-config-label">每日新词数</label>
          <select class="eng-config-select" onchange="EnglishModule.setConfig('dailyNewWords', parseInt(this.value)); EnglishModule.renderWords();">
            ${[10, 15, 20, 30, 50].map(n => `<option value="${n}" ${config.dailyNewWords === n ? 'selected' : ''}>${n} 个</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  },

  // ============ 学习会话 ============
  startStudy(mode) {
    const plan = this.getTodayPlan();
    if (plan.newWordIds.length === 0 && plan.reviewWordIds.length === 0) {
      Utils.toast('今日没有待学习的单词', 'warning');
      return;
    }
    const allWords = SEED_DATA.englishWords;
    const queue = [
      ...plan.newWordIds.map(id => ({ wordId: id, type: 'new' })),
      ...plan.reviewWordIds.map(id => ({ wordId: id, type: 'review' }))
    ];
    // 用日期种子打乱保证一致性
    const shuffled = Utils.seededShuffle([...queue], Utils.dateSeed());
    const session = { date: App.today, mode, queue: shuffled, currentIndex: 0, results: [] };
    App.englishState.session = session;
    App.englishState.studyMode = mode;
    App.englishState.tab = 'study';
    this.saveSession();
    ModuleRenderers.english();
  },

  saveSession() {
    if (App.englishState.session) {
      DB.set('duxing_eng_session', App.englishState.session);
    }
  },

  restoreSession() {
    const session = DB.get('duxing_eng_session', null);
    if (session && session.date === App.today && session.currentIndex < session.queue.length) {
      App.englishState.session = session;
      App.englishState.studyMode = session.mode;
    }
  },

  renderStudy() {
    const session = App.englishState.session;
    if (!session || session.currentIndex >= session.queue.length) {
      this.finishStudy();
      return;
    }
    const total = session.queue.length;
    const current = session.currentIndex + 1;
    const mode = session.mode;
    const modeLabels = { en2zh: '看英选义', zh2en: '看义选英', dictation: '拼写默写', flashcard: '卡片复习' };

    document.getElementById('englishContent').innerHTML = `
      <div class="eng-study">
        <div class="eng-study-header">
          <button class="btn btn-secondary btn-small" onclick="EnglishModule.switchTab('words')">← 返回</button>
          <span class="tag tag-blue">${current} / ${total}</span>
          <span class="tag tag-orange">${modeLabels[mode] || mode}</span>
          <button class="eng-pronounce-btn" id="engPronounceBtn" title="朗读发音">🔊</button>
        </div>
        <div class="eng-study-progress">
          <div class="progress-bar"><div class="progress-fill" style="width:${(current / total) * 100}%"></div></div>
        </div>
        <div class="eng-study-content" id="engStudyContent"></div>
      </div>
    `;
    this.renderStudyQuestion();
  },

  renderStudyQuestion() {
    const session = App.englishState.session;
    const item = session.queue[session.currentIndex];
    const word = SEED_DATA.englishWords.find(w => w.id === item.wordId);
    if (!word) { this.nextStudyItem(); return; }
    const mode = session.mode;
    const contentEl = document.getElementById('engStudyContent');
    if (!contentEl) return;

    let html = '';
    if (mode === 'en2zh') {
      const options = this.generateOptions(word, 'meaning');
      html = `
        <div class="eng-question-card">
          <div class="eng-question-word" id="engQuestionWord">${Utils.escape(word.word)}</div>
          <div class="eng-question-phonetic">${Utils.escape(word.phonetic)}</div>
        </div>
        <div class="eng-options">
          ${options.map((opt, i) => `
            <div class="quiz-option" onclick="EnglishModule.selectOption(${i})" data-index="${i}">${String.fromCharCode(65 + i)}. ${Utils.escape(opt)}</div>
          `).join('')}
        </div>
        <div class="eng-study-feedback" id="engFeedback" style="display:none;"></div>
      `;
    } else if (mode === 'zh2en') {
      const options = this.generateOptions(word, 'word');
      html = `
        <div class="eng-question-card">
          <div class="eng-question-meaning">${Utils.escape(word.meaning)}</div>
        </div>
        <div class="eng-options">
          ${options.map((opt, i) => `
            <div class="quiz-option" onclick="EnglishModule.selectOption(${i})" data-index="${i}">${String.fromCharCode(65 + i)}. ${Utils.escape(opt)}</div>
          `).join('')}
        </div>
        <div class="eng-study-feedback" id="engFeedback" style="display:none;"></div>
      `;
    } else if (mode === 'dictation') {
      html = `
        <div class="eng-question-card">
          <div class="eng-question-meaning">${Utils.escape(word.meaning)}</div>
          <div class="eng-question-hint">词性: ${Utils.escape(word.pos || '')} | 首字母: ${word.word.charAt(0)}...</div>
        </div>
        <div class="eng-dictation-area">
          <input type="text" class="english-input eng-dictation-input" id="engDictationInput" placeholder="请输入英文单词..." autocomplete="off" onkeypress="if(event.key==='Enter')EnglishModule.submitDictation()">
          <button class="btn btn-primary" onclick="EnglishModule.submitDictation()">提交</button>
        </div>
        <div class="eng-study-feedback" id="engFeedback" style="display:none;"></div>
      `;
    } else if (mode === 'flashcard') {
      App.englishState.flipped = false;
      html = `
        <div class="word-card" onclick="EnglishModule.flipCard()">
          <div class="word-card-inner">
            <div class="word-card-front">
              <div class="word-english">${Utils.escape(word.word)}</div>
              <div class="word-phonetic">${Utils.escape(word.phonetic)}</div>
              <div class="word-hint">点击翻转查看释义</div>
            </div>
            <div class="word-card-back">
              <div class="word-chinese">${Utils.escape(word.meaning)}</div>
              <div class="word-example">${Utils.escape(word.example)}</div>
            </div>
          </div>
        </div>
        <div class="eng-rating-buttons" style="margin-top:16px;display:flex;justify-content:center;gap:12px;">
          <button class="btn btn-secondary eng-btn-wrong" onclick="EnglishModule.rateWord('${word.id}', false)">不认识</button>
          <button class="btn btn-green eng-btn-correct" onclick="EnglishModule.rateWord('${word.id}', true)">认识</button>
        </div>
      `;
    }

    contentEl.innerHTML = html;

    // 绑定发音按钮
    const pronounceBtn = document.getElementById('engPronounceBtn');
    if (pronounceBtn) {
      pronounceBtn.onclick = () => this.pronounceWord(word.word);
    }

    // 自动发音
    const config = this.getConfig();
    if (config.autoPlay !== false) {
      setTimeout(() => this.pronounceWord(word.word), 300);
    }

    // 保存会话
    this.saveSession();
  },

  // 选择题
  selectOption(index) {
    const session = App.englishState.session;
    const item = session.queue[session.currentIndex];
    const word = SEED_DATA.englishWords.find(w => w.id === item.wordId);
    if (!word) return;
    const mode = session.mode;
    const correctField = mode === 'en2zh' ? 'meaning' : 'word';
    const correctAnswer = word[correctField];

    // 获取选项值
    const optionEls = document.querySelectorAll('.eng-options .quiz-option');
    let selectedValue = null;
    optionEls.forEach((el, i) => {
      el.classList.remove('selected', 'correct', 'wrong');
      el.style.pointerEvents = 'none';
      if (i === index) {
        el.classList.add('selected');
        selectedValue = el.textContent.replace(/^[A-D]\.\s*/, '');
      }
    });

    // 找正确选项
    optionEls.forEach(el => {
      const val = el.textContent.replace(/^[A-D]\.\s*/, '');
      if (val === correctAnswer) el.classList.add('correct');
    });
    if (selectedValue !== correctAnswer && index >= 0) {
      optionEls[index].classList.add('wrong');
    }

    const isCorrect = selectedValue === correctAnswer;

    // 显示反馈
    const feedback = document.getElementById('engFeedback');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div class="eng-feedback-result ${isCorrect ? 'eng-feedback-correct' : 'eng-feedback-wrong'}">
          ${isCorrect ? '✅ 正确！' : `❌ 错误！正确答案：${Utils.escape(correctAnswer)}`}
        </div>
        <div class="eng-feedback-word">
          <strong>${Utils.escape(word.word)}</strong> ${Utils.escape(word.phonetic)}<br>
          ${Utils.escape(word.meaning)}
        </div>
        <div class="eng-rating-buttons">
          <button class="btn btn-secondary eng-btn-wrong" onclick="EnglishModule.rateWord('${word.id}', false)">不认识</button>
          <button class="btn btn-green eng-btn-correct" onclick="EnglishModule.rateWord('${word.id}', true)">认识</button>
        </div>
      `;
    }

    session.results.push({ wordId: word.id, correct: isCorrect, type: item.type, timestamp: Date.now() });
    this.saveSession();
  },

  // 默写提交
  submitDictation() {
    const session = App.englishState.session;
    const item = session.queue[session.currentIndex];
    const word = SEED_DATA.englishWords.find(w => w.id === item.wordId);
    if (!word) return;
    const input = document.getElementById('engDictationInput');
    if (!input) return;
    const userInput = input.value.trim().toLowerCase();
    const correctWord = word.word.toLowerCase();
    const isCorrect = userInput === correctWord;
    input.disabled = true;

    const feedback = document.getElementById('engFeedback');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div class="eng-feedback-result ${isCorrect ? 'eng-feedback-correct' : 'eng-feedback-wrong'}">
          ${isCorrect ? '✅ 拼写正确！' : `❌ 拼写错误！正确答案：<strong>${Utils.escape(word.word)}</strong>`}
        </div>
        ${!isCorrect ? `<div class="eng-feedback-diff">你的输入：${Utils.escape(input.value)}</div>` : ''}
        <div class="eng-feedback-word">
          <strong>${Utils.escape(word.word)}</strong> ${Utils.escape(word.phonetic)}<br>
          ${Utils.escape(word.meaning)}
        </div>
        <div class="eng-rating-buttons">
          <button class="btn btn-secondary eng-btn-wrong" onclick="EnglishModule.rateWord('${word.id}', false)">不认识</button>
          <button class="btn btn-green eng-btn-correct" onclick="EnglishModule.rateWord('${word.id}', true)">认识</button>
        </div>
      `;
    }

    session.results.push({ wordId: word.id, correct: isCorrect, type: item.type, timestamp: Date.now() });
    this.saveSession();
  },

  // 评分
  rateWord(wordId, correct) {
    this.updateWordProgress(wordId, correct);
    this.nextStudyItem();
  },

  // 下一题
  nextStudyItem() {
    const session = App.englishState.session;
    if (!session) return;
    session.currentIndex++;
    if (session.currentIndex >= session.queue.length) {
      this.finishStudy();
    } else {
      App.englishState.flipped = false;
      this.saveSession();
      this.renderStudy();
    }
  },

  // 完成学习
  finishStudy() {
    const session = App.englishState.session;
    if (!session) { this.renderWords(); return; }
    const total = session.queue.length;
    const correctCount = session.results.filter(r => r.correct).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // 更新统计（累计天数：只增不减，断签不清零，与成语模块一致）
    const statsData = DB.get('duxing_eng_stats', { streak: 0, lastStudyDate: null, history: [] });
    const today = App.today;
    if (statsData.lastStudyDate !== today) {
      statsData.streak = (statsData.streak || 0) + 1;
      statsData.lastStudyDate = today;
    }
    if (!statsData.history) statsData.history = [];
    statsData.history.push({ date: today, newCount: session.queue.filter(q => q.type === 'new').length, reviewCount: session.queue.filter(q => q.type === 'review').length, correctCount });
    if (statsData.history.length > 30) statsData.history = statsData.history.slice(-30);
    DB.set('duxing_eng_stats', statsData);

    // 清除会话
    DB.remove('duxing_eng_session');
    App.englishState.session = null;
    App.englishState.studyMode = null;

    document.getElementById('englishContent').innerHTML = `
      <div class="eng-complete">
        <div class="eng-complete-icon">🎉</div>
        <div class="eng-complete-title">今日学习完成！</div>
        <div class="eng-complete-subtitle">继续保持，坚持就是胜利</div>
        <div class="eng-complete-stats">
          <div class="eng-complete-stat">
            <div class="eng-complete-stat-value">${total}</div>
            <div class="eng-complete-stat-label">学习总数</div>
          </div>
          <div class="eng-complete-stat">
            <div class="eng-complete-stat-value eng-stat-success">${correctCount}</div>
            <div class="eng-complete-stat-label">正确</div>
          </div>
          <div class="eng-complete-stat">
            <div class="eng-complete-stat-value eng-stat-primary">${accuracy}%</div>
            <div class="eng-complete-stat-label">正确率</div>
          </div>
          <div class="eng-complete-stat">
            <div class="eng-complete-stat-value eng-stat-warning">${statsData.streak}</div>
            <div class="eng-complete-stat-label">累计天数</div>
          </div>
        </div>
        <div class="eng-complete-actions">
          <button class="btn btn-primary" onclick="EnglishModule.switchTab('words')">返回单词</button>
          <button class="btn btn-secondary" onclick="EnglishModule.switchTab('stats')">查看统计</button>
        </div>
      </div>
    `;
  },

  // 翻转卡片（闪卡模式）
  flipCard() {
    App.englishState.flipped = !App.englishState.flipped;
    const card = document.querySelector('.word-card');
    if (card) card.classList.toggle('flipped');
  },

  // 发音
  pronounceWord(word) {
    if (typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    const voices = speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    speechSynthesis.speak(utterance);
  },

  // ============ 统计面板 ============
  renderStats() {
    const stats = this.getStats();
    const progress = this.getProgress();
    const allWords = SEED_DATA.englishWords;
    const cet4Words = allWords.filter(w => w.level === 'CET-4');
    const cet6Words = allWords.filter(w => w.level === 'CET-6');
    const cet4Learned = cet4Words.filter(w => progress[w.id]).length;
    const cet6Learned = cet6Words.filter(w => progress[w.id]).length;
    const cet4Mastered = cet4Words.filter(w => progress[w.id] && progress[w.id].status === 'mastered').length;
    const cet6Mastered = cet6Words.filter(w => progress[w.id] && progress[w.id].status === 'mastered').length;

    // 近7天学习记录
    const statsData = DB.get('duxing_eng_stats', { history: [] });
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateStr(d);
      const dayData = statsData.history ? statsData.history.find(h => h.date === dateStr) : null;
      last7Days.push({ date: dateStr, label: ['日','一','二','三','四','五','六'][d.getDay()], count: dayData ? dayData.newCount + dayData.reviewCount : 0, correct: dayData ? dayData.correctCount : 0 });
    }
    const maxCount = Math.max(1, ...last7Days.map(d => d.count));

    // 待复习列表
    const today = App.today;
    const reviewList = Object.values(progress)
      .filter(p => p.status !== 'mastered' && p.nextReview <= today)
      .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
      .slice(0, 20);

    document.getElementById('englishContent').innerHTML = `
      <div class="eng-stats-page">
        <div class="eng-stats-row">
          <div class="eng-stat-card"><div class="eng-stat-value">${stats.totalLearned}</div><div class="eng-stat-label">已学单词</div></div>
          <div class="eng-stat-card"><div class="eng-stat-value eng-stat-warning">${stats.pendingReview}</div><div class="eng-stat-label">待复习</div></div>
          <div class="eng-stat-card"><div class="eng-stat-value eng-stat-success">${stats.totalMastered}</div><div class="eng-stat-label">已掌握</div></div>
          <div class="eng-stat-card"><div class="eng-stat-value eng-stat-primary">${stats.streak}</div><div class="eng-stat-label">累计天数</div></div>
        </div>

        <div class="eng-stats-detail">
          <div class="card">
            <div class="card-title">${titleIcon('barChart', 14)} 分级进度</div>
            <div class="eng-level-breakdown">
              <div class="eng-level-item">
                <div class="eng-level-header"><span>CET-4</span><span>${cet4Learned}/${cet4Words.length}（掌握 ${cet4Mastered}）</span></div>
                <div class="eng-level-bar"><div class="eng-level-bar-fill" style="width:${(cet4Learned / cet4Words.length) * 100}%"></div></div>
              </div>
              <div class="eng-level-item">
                <div class="eng-level-header"><span>CET-6</span><span>${cet6Learned}/${cet6Words.length}（掌握 ${cet6Mastered}）</span></div>
                <div class="eng-level-bar"><div class="eng-level-bar-fill eng-level-bar-fill-cet6" style="width:${(cet6Learned / cet6Words.length) * 100}%"></div></div>
              </div>
              <div class="eng-level-item">
                <div class="eng-level-header"><span>总计</span><span>${stats.totalLearned}/${stats.totalWords}（掌握 ${stats.totalMastered}）</span></div>
                <div class="eng-level-bar"><div class="eng-level-bar-fill eng-level-bar-fill-total" style="width:${(stats.totalLearned / stats.totalWords) * 100}%"></div></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">${titleIcon('clock', 14)} 近7天学习</div>
            <div class="eng-chart">
              ${last7Days.map(d => `
                <div class="eng-chart-col">
                  <div class="eng-chart-bar-wrapper">
                    <div class="eng-chart-bar" style="height:${(d.count / maxCount) * 100}%"></div>
                  </div>
                  <div class="eng-chart-value">${d.count}</div>
                  <div class="eng-chart-label">${d.label}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-title">${titleIcon('book', 14)} 待复习单词</div>
            ${reviewList.length > 0 ? `
              <div class="eng-review-list">
                ${reviewList.map(p => {
                  const w = allWords.find(w => w.id === p.wordId);
                  return w ? `<div class="eng-review-item"><span class="eng-review-word">${Utils.escape(w.word)}</span><span class="eng-review-meaning">${Utils.escape(w.meaning)}</span><span class="tag tag-gray">下次复习：${p.nextReview}</span></div>` : '';
                }).join('')}
              </div>
            ` : `<div class="eng-empty-state">暂无待复习单词 🎉</div>`}
          </div>
        </div>

        <div style="margin-top:16px; text-align:center;">
          <button class="btn btn-secondary" onclick="if(confirm('确定要重置所有背单词进度吗？此操作不可恢复。')){EnglishModule.resetProgress();}">重置进度</button>
        </div>
      </div>
    `;
  },

  // 重置进度
  resetProgress() {
    DB.remove('duxing_eng_progress');
    DB.remove('duxing_eng_stats');
    DB.remove('duxing_eng_daily_plan');
    DB.remove('duxing_eng_session');
    App.englishState.session = null;
    App.englishState.studyMode = null;
    this.renderStats();
    Utils.toast('进度已重置');
  },

  renderSentences() {
    const type = App.englishState.tab;
    const seed = Utils.dateSeed();
    const sentences = SEED_DATA.englishSentences.filter(s => s.type === type);
    const todaySentences = Utils.seededShuffle(sentences, seed).slice(0, 3);

    document.getElementById('englishContent').innerHTML = `
      ${todaySentences.map((s, i) => `
        <div class="card">
          <div class="card-title">
            <span class="tag tag-blue">第 ${i + 1} 句</span>
            <span class="tag tag-gray">${type === 'en2zh' ? '英译中' : '中译英'}</span>
          </div>
          <div class="english-sentence-card">
            <div class="english-sentence-en">${type === 'en2zh' ? Utils.escape(s.en) : Utils.escape(s.zh)}</div>
          </div>
          <input type="text" class="english-input" id="answer-${i}" placeholder="${type === 'en2zh' ? '请输入中文翻译...' : '请输入英文翻译...'}" onkeypress="if(event.key==='Enter')EnglishModule.checkAnswer(${i})">
          <button class="btn btn-primary btn-small" onclick="EnglishModule.checkAnswer(${i})">查看答案</button>
          <div id="result-${i}"></div>
        </div>
      `).join('')}
    `;

    // 保存今日句子供检查
    EnglishModule._todaySentences = todaySentences;
  },

  checkAnswer(index) {
    const type = App.englishState.tab;
    const sentence = EnglishModule._todaySentences[index];
    const input = document.getElementById(`answer-${index}`).value.trim();
    const resultEl = document.getElementById(`result-${index}`);

    if (!input) {
      Utils.toast('请先输入答案', 'error');
      return;
    }

    const correctAnswer = type === 'en2zh' ? sentence.zh : sentence.en;

    resultEl.innerHTML = `
      <div class="english-sentence-card" style="border: 2px solid var(--green-sage);">
        <div style="margin-bottom: 8px;">
          <span class="tag tag-green">${ICONS.checkCircle} 参考答案</span>
        </div>
        <div class="english-sentence-en">${Utils.escape(correctAnswer)}</div>
      </div>
    `;

    // 记录完成
    const done = DB.getToday('duxing_english_done', []);
    if (!done.includes(`${type}_${index}`)) {
      done.push(`${type}_${index}`);
      DB.setToday('duxing_english_done', done);
    }

    Utils.toast('已查看答案');
  },

  // ===== 听写模块 =====
  getTodayDictation() {
    const seed = Utils.dateSeed();
    const all = SEED_DATA.englishDictation || [];
    return Utils.seededShuffle(all, seed).slice(0, 2);
  },

  renderDictation() {
    const items = this.getTodayDictation();
    const done = DB.getToday('duxing_dictation_done', []);
    const voices = (typeof speechSynthesis !== 'undefined' && speechSynthesis.getVoices) ? speechSynthesis.getVoices().filter(v => v.lang.startsWith('en')) : [];

    document.getElementById('englishContent').innerHTML = `
      <div class="dictation-intro">
        <span class="dictation-intro-icon">${titleIcon('compass', 16)}</span>
        <span>每日两句听写 · 四六级难度 · 点击喇叭播放，听写后对照原文</span>
      </div>
      ${items.map((s, i) => `
        <div class="card dictation-card" id="dict-card-${i}">
          <div class="card-title">
            <span class="tag tag-blue">第 ${i + 1} 句</span>
            <span class="tag tag-gray">${s.level}</span>
            ${done.includes(i) ? '<span class="tag tag-green">已完成</span>' : ''}
          </div>
          <div class="dictation-audio-row">
            <button class="dictation-play-btn" onclick="EnglishModule.playDictation(${i})" id="play-btn-${i}">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fill-opacity="0.2"/><path d="M15.54 8.46 a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93 a10 10 0 0 1 0 14.14"/></svg>
              播放
            </button>
            <div class="dictation-play-count" id="play-count-${i}">已播放 0 次</div>
          </div>
          <div class="dictation-controls">
            <button class="btn btn-secondary btn-small" onclick="EnglishModule.toggleSlow(${i})" id="slow-btn-${i}">慢速播放</button>
            <button class="btn btn-secondary btn-small" onclick="EnglishModule.replayDictation(${i})">重播</button>
          </div>
          <textarea class="dictation-input" id="dict-input-${i}" placeholder="在这里写下你听到的英文..." oninput="EnglishModule.onDictInput(${i})"></textarea>
          <div class="dictation-actions">
            <button class="btn btn-primary btn-small" onclick="EnglishModule.checkDictation(${i})">对照原文</button>
            <button class="btn btn-secondary btn-small" onclick="EnglishModule.showHint(${i})" id="hint-btn-${i}">显示首字母提示</button>
          </div>
          <div id="dict-result-${i}"></div>
        </div>
      `).join('')}
    `;

    EnglishModule._dictationItems = items;
    EnglishModule._dictPlayCount = [0, 0];
  },

  // 播放听写
  playDictation(index, slow) {
    if (typeof speechSynthesis === 'undefined') {
      Utils.toast('浏览器不支持语音播放', 'error');
      return;
    }
    const items = EnglishModule._dictationItems;
    if (!items || !items[index]) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(items[index].en);
    utter.lang = 'en-US';
    utter.rate = slow ? 0.6 : 1.0;
    // 尝试选英文女声
    const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    if (voices.length > 0) {
      const preferred = voices.find(v => v.name.includes('Female')) || voices.find(v => v.lang === 'en-US') || voices[0];
      utter.voice = preferred;
    }
    speechSynthesis.speak(utter);

    // 更新播放计数
    EnglishModule._dictPlayCount[index] = (EnglishModule._dictPlayCount[index] || 0) + 1;
    const countEl = document.getElementById('play-count-' + index);
    if (countEl) countEl.textContent = '已播放 ' + EnglishModule._dictPlayCount[index] + ' 次';
  },

  // 慢速播放切换
  toggleSlow(index) {
    const btn = document.getElementById('slow-btn-' + index);
    if (!btn) return;
    const isSlow = btn.classList.contains('active');
    if (isSlow) {
      btn.classList.remove('active');
      btn.textContent = '慢速播放';
      this.playDictation(index, false);
    } else {
      btn.classList.add('active');
      btn.textContent = '正常速度';
      this.playDictation(index, true);
    }
  },

  replayDictation(index) {
    const btn = document.getElementById('slow-btn-' + index);
    const slow = btn && btn.classList.contains('active');
    this.playDictation(index, slow);
  },

  // 输入时实时统计字数
  onDictInput(index) {
    const input = document.getElementById('dict-input-' + index);
    if (!input) return;
    // 保留用户输入，不做额外处理
  },

  // 对照原文
  checkDictation(index) {
    const items = EnglishModule._dictationItems;
    if (!items || !items[index]) return;
    const input = document.getElementById('dict-input-' + index);
    const resultEl = document.getElementById('dict-result-' + index);
    if (!input || !resultEl) return;

    const userInput = input.value.trim();
    const original = items[index].en;
    const zh = items[index].zh;

    if (!userInput) {
      Utils.toast('请先听写再对照', 'error');
      return;
    }

    // 简单对比：忽略大小写和标点
    const normalize = (s) => s.toLowerCase().replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim();
    const userNorm = normalize(userInput);
    const origNorm = normalize(original);
    const words = origNorm.split(' ');
    const userWords = userNorm.split(' ');
    let correctCount = 0;
    words.forEach((w, i) => {
      if (userWords[i] === w) correctCount++;
    });
    const accuracy = words.length > 0 ? Math.round(correctCount / words.length * 100) : 0;

    // 高亮差异
    let diffHtml = '';
    words.forEach((w, i) => {
      const uw = userWords[i] || '';
      if (uw === w) {
        diffHtml += '<span class="dict-word-correct">' + Utils.escape(w) + '</span> ';
      } else if (uw) {
        diffHtml += '<span class="dict-word-wrong">' + Utils.escape(w) + '</span> ';
        diffHtml += '<span class="dict-word-user">' + Utils.escape(uw) + '</span> ';
      } else {
        diffHtml += '<span class="dict-word-miss">' + Utils.escape(w) + '</span> ';
      }
    });

    const levelClass = accuracy >= 80 ? 'tag-green' : accuracy >= 50 ? 'tag-blue' : 'tag-gray';
    const levelText = accuracy >= 80 ? '优秀' : accuracy >= 50 ? '继续努力' : '需加强';

    resultEl.innerHTML = `
      <div class="dictation-result">
        <div class="dictation-result-header">
          <span class="tag ${levelClass}">准确率 ${accuracy}% · ${levelText}</span>
        </div>
        <div class="dictation-result-section">
          <div class="dictation-result-label">原文（高亮对比）</div>
          <div class="dictation-diff">${diffHtml}</div>
          <div class="dictation-legend">
            <span class="dict-legend-item"><span class="dict-legend-box dict-legend-correct"></span>正确</span>
            <span class="dict-legend-item"><span class="dict-legend-box dict-legend-wrong"></span>错误</span>
            <span class="dict-legend-item"><span class="dict-legend-box dict-legend-miss"></span>遗漏</span>
          </div>
        </div>
        <div class="dictation-result-section">
          <div class="dictation-result-label">中文翻译</div>
          <div class="dictation-zh">${Utils.escape(zh)}</div>
        </div>
      </div>
    `;

    // 记录完成
    const done = DB.getToday('duxing_dictation_done', []);
    if (!done.includes(index)) {
      done.push(index);
      DB.setToday('duxing_dictation_done', done);
      // 更新卡片标题的"已完成"标记
      const card = document.getElementById('dict-card-' + index);
      if (card) {
        const title = card.querySelector('.card-title');
        if (title && !title.querySelector('.tag-green')) {
          title.insertAdjacentHTML('beforeend', '<span class="tag tag-green">已完成</span>');
        }
      }
    }

    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  },

  // 首字母提示
  showHint(index) {
    const items = EnglishModule._dictationItems;
    if (!items || !items[index]) return;
    const btn = document.getElementById('hint-btn-' + index);
    if (!btn) return;

    if (btn.dataset.shown === '1') {
      // 已显示，点击隐藏
      btn.dataset.shown = '0';
      btn.textContent = '显示首字母提示';
      const hintEl = document.getElementById('dict-hint-' + index);
      if (hintEl) hintEl.remove();
      return;
    }

    btn.dataset.shown = '1';
    btn.textContent = '隐藏提示';
    const en = items[index].en;
    const hint = en.split(' ').map(w => {
      // 保留首字母，其余替换为 _
      const clean = w.replace(/[^a-zA-Z']/g, '');
      const punct = w.substring(clean.length);
      if (clean.length <= 1) return w;
      return clean[0] + '_'.repeat(clean.length - 1) + punct;
    }).join(' ');

    const resultEl = document.getElementById('dict-result-' + index);
    if (resultEl) {
      resultEl.insertAdjacentHTML('beforebegin', `<div class="dictation-hint" id="dict-hint-${index}"><span class="dictation-result-label">首字母提示</span><div class="dictation-hint-text">${Utils.escape(hint)}</div></div>`);
    }
  }
};

// ========== 8. 每日阅读 ==========
ModuleRenderers.reading = function() {
  const content = document.getElementById('content');
  const logs = DB.get('duxing_reading_log', []);
  const todayLog = logs.filter(l => l.date === App.today);

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('reading', 26)} 每日阅读</div>
        <div class="page-subtitle">阅读是最浪漫的修行</div>
      </div>

      <a href="https://weread.qq.com/" target="_blank" class="external-link-btn">
        <span class="external-link-icon" id="externalLinkIcon"></span>
        <div>
          <div>前往微信读书</div>
          <div style="font-size: 12px; font-weight: 400; color: var(--text-secondary);">点击打开微信读书网页版</div>
        </div>
      </a>

      <div class="card">
        <div class="card-title">${titleIcon('write', 18)} 记录今日阅读</div>
        <div class="record-row">
          <input type="text" class="input-field" id="readingBook" placeholder="书名">
          <input type="number" class="input-field" id="readingPages" placeholder="页数" style="width: 100px;">
          <input type="number" class="input-field" id="readingMinutes" placeholder="时长(分钟)" style="width: 120px;">
          <button class="btn btn-primary" onclick="ReadingModule.addLog()">记录</button>
        </div>
        <input type="text" class="input-field" id="readingNote" placeholder="阅读笔记（选填）..." style="margin-bottom: 8px;">
      </div>

      <div class="card">
        <div class="card-title">📊 今日阅读记录</div>
        <div id="readingList">
          ${todayLog.length > 0 ? todayLog.map(l => `
            <div class="record-item">
              <span class="record-type">📖 ${Utils.escape(l.book)}</span>
              <span class="record-value">${l.pages}页 · ${l.minutes}分钟</span>
              <span class="record-date">${l.note ? Utils.escape(l.note) : ''}</span>
            </div>
          `).join('') : '<div class="empty-state-text text-center">今天还没有阅读记录</div>'}
        </div>
      </div>

      <div class="card">
        <div class="card-title">📈 累计统计</div>
        <div class="quiz-stats">
          <div class="quiz-stat-card">
            <div class="quiz-stat-num">${logs.reduce((a, b) => a + (b.minutes || 0), 0)}</div>
            <div class="quiz-stat-label">总时长(分钟)</div>
          </div>
          <div class="quiz-stat-card">
            <div class="quiz-stat-num">${logs.reduce((a, b) => a + (b.pages || 0), 0)}</div>
            <div class="quiz-stat-label">总页数</div>
          </div>
          <div class="quiz-stat-card">
            <div class="quiz-stat-num">${new Set(logs.map(l => l.date)).size}</div>
            <div class="quiz-stat-label">阅读天数</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const ReadingModule = {
  addLog() {
    const book = document.getElementById('readingBook').value.trim();
    const pages = document.getElementById('readingPages').value;
    const minutes = document.getElementById('readingMinutes').value;
    const note = document.getElementById('readingNote').value.trim();

    if (!book) {
      Utils.toast('请输入书名', 'error');
      return;
    }

    const logs = DB.get('duxing_reading_log', []);
    logs.push({
      book,
      pages: parseInt(pages) || 0,
      minutes: parseInt(minutes) || 0,
      note,
      date: App.today,
      timestamp: Date.now()
    });

    DB.set('duxing_reading_log', logs);
    ModuleRenderers.reading();
    Utils.toast('阅读记录已保存');
  }
};

// ========== 9. 锻炼 ==========
// ========== 10. 锻炼（健身打卡） ==========
ModuleRenderers.exercise = function() {
  const content = document.getElementById('content');
  const tab = App.exerciseTab || 'today';
  const logs = DB.get('duxing_exercise_log', []);
  const todayLog = logs.filter(l => l.date === App.today);
  const todayMinutes = todayLog.reduce((a, b) => a + (b.minutes || 0), 0);
  const streak = ExerciseModule.getStreak();

  content.innerHTML = `
    <div class="module-page exercise-page">
      <!-- 顶部 header -->
      <div class="exercise-header">
        <div class="exercise-avatar">${titleIcon('dumbbell', 26)}</div>
        <div class="exercise-header-info">
          <div class="exercise-username">健身打卡</div>
          <div class="exercise-greeting">${ExerciseModule.getGreeting()}</div>
        </div>
        <div class="exercise-streak">
          <span class="exercise-streak-icon">${titleIcon('fire', 14)}</span>
          <span class="exercise-streak-num">${streak}</span>
          <span class="exercise-streak-label">天</span>
        </div>
      </div>

      <!-- Tab 切换 -->
      <div class="exercise-tabs">
        <button class="exercise-tab ${tab === 'today' ? 'active' : ''}" data-tab="today" onclick="ExerciseModule.switchTab('today')">今日</button>
        <button class="exercise-tab ${tab === 'blogger' ? 'active' : ''}" data-tab="blogger" onclick="ExerciseModule.switchTab('blogger')">博主</button>
        <button class="exercise-tab ${tab === 'ai' ? 'active' : ''}" data-tab="ai" onclick="ExerciseModule.switchTab('ai')">AI</button>
      </div>

      <div id="exerciseContent"></div>
    </div>
  `;

  ExerciseModule.renderTab();
};

const ExerciseModule = {
  // 数据存储 key
  SCHEDULE_KEY: 'duxing_exercise_schedule',
  FAVORITES_KEY: 'duxing_exercise_favorites',

  // 切换 Tab
  switchTab(tab) {
    App.exerciseTab = tab;
    document.querySelectorAll('.exercise-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.renderTab();
  },

  // 渲染当前 Tab
  renderTab() {
    const container = document.getElementById('exerciseContent');
    if (!container) return;
    const tab = App.exerciseTab || 'today';

    if (tab === 'today') this.renderToday(container);
    else if (tab === 'blogger') this.renderBlogger(container);
    else if (tab === 'ai') this.renderAI(container);
  },

  // 今日打卡
  renderToday(container) {
    const logs = DB.get('duxing_exercise_log', []);
    const todayLog = logs.filter(l => l.date === App.today);
    const todayMinutes = todayLog.reduce((a, b) => a + (b.minutes || 0), 0);
    const todayKcal = Math.round(todayMinutes * 6);
    const todayActions = todayLog.length;

    // 今日日程
    const schedule = DB.getToday(this.SCHEDULE_KEY, []);

    container.innerHTML = `
      <!-- 数据卡片 3×2 -->
      <div class="exercise-stat-grid">
        <div class="exercise-stat-card">
          <div class="exercise-stat-icon">${titleIcon('clock', 22)}</div>
          <div class="exercise-stat-num">${todayMinutes}<span class="exercise-stat-unit">min</span></div>
          <div class="exercise-stat-label">今日训练</div>
        </div>
        <div class="exercise-stat-card">
          <div class="exercise-stat-icon">${titleIcon('fire', 22)}</div>
          <div class="exercise-stat-num">${todayKcal}</div>
          <div class="exercise-stat-label">大卡摄入</div>
        </div>
        <div class="exercise-stat-card">
          <div class="exercise-stat-icon">${titleIcon('dumbbell', 22)}</div>
          <div class="exercise-stat-num">${todayActions}</div>
          <div class="exercise-stat-label">完成动作</div>
        </div>
        <div class="exercise-stat-card" onclick="ExerciseModule.startTraining()">
          <div class="exercise-stat-icon">${titleIcon('play', 22)}</div>
          <div class="exercise-stat-action">开始训练</div>
        </div>
        <div class="exercise-stat-card" onclick="ExerciseModule.recordDiet()">
          <div class="exercise-stat-icon">${titleIcon('book', 22)}</div>
          <div class="exercise-stat-action">记录饮食</div>
        </div>
        <div class="exercise-stat-card" onclick="ExerciseModule.openSchedule()">
          <div class="exercise-stat-icon">${titleIcon('plan', 22)}</div>
          <div class="exercise-stat-action">日程</div>
        </div>
      </div>

      <!-- 今日日程 -->
      <div class="card exercise-section">
        <div class="exercise-section-header">
          <span class="exercise-section-title">${titleIcon('plan', 14)} 今日日程</span>
          <button class="btn btn-pink btn-small" onclick="ExerciseModule.openSchedule()">管理</button>
        </div>
        <div class="exercise-schedule-list">
          ${schedule.length === 0 ? `
            <div class="exercise-empty">还没有日程，点击「管理」添加</div>
          ` : schedule.map((s, i) => `
            <div class="exercise-schedule-item">
              <span class="exercise-schedule-time">${s.time || '随时'}</span>
              <span class="exercise-schedule-name">${Utils.escape(s.name)}</span>
              <button class="exercise-schedule-del" onclick="ExerciseModule.delSchedule(${i})">×</button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 今日饮食 -->
      <div class="card exercise-section">
        <div class="exercise-section-header">
          <span class="exercise-section-title">${titleIcon('book', 14)} 今日饮食</span>
          <span class="exercise-diet-kcal">${todayKcal} kcal</span>
        </div>
        <div class="exercise-empty">还没有记录饮食，点击上方「记录饮食」添加</div>
      </div>

      <!-- 今日训练记录 -->
      <div class="card exercise-section">
        <div class="exercise-section-header">
          <span class="exercise-section-title">${titleIcon('dumbbell', 14)} 今日训练</span>
          <span class="exercise-section-count">${todayLog.length} 项</span>
        </div>
        <div class="exercise-today-list">
          ${todayLog.length === 0 ? `
            <div class="exercise-empty">还没有训练记录，点击上方「开始训练」</div>
          ` : todayLog.map((l, i) => `
            <div class="exercise-today-item">
              <span class="exercise-today-type">${Utils.escape(l.part || l.type)}</span>
              <span class="exercise-today-min">${l.minutes}分钟</span>
              <button class="exercise-today-del" onclick="ExerciseModule.delLog(${logs.indexOf(l)})">×</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 博主
  renderBlogger(container) {
    const bloggers = [
      { name: '帕梅拉', color: '#f8d4bc', key: 'pamela' },
      { name: '欧阳春晓', color: '#f4c4d4', key: 'ouyang' },
      { name: '韩小四', color: '#d4c4f8', key: 'hanxiaosi' },
      { name: '周六野 Zoey', color: '#c4f4d4', key: 'zoey' },
      { name: '美丽芭蕾', color: '#d4dcf8', key: 'balefit' },
    ];
    const favorites = DB.get(this.FAVORITES_KEY, []);

    container.innerHTML = `
      <!-- 明星跟练博主 -->
      <div class="card exercise-section">
        <div class="exercise-section-header">
          <span class="exercise-section-title">${titleIcon('star', 14)} 明星跟练博主</span>
          <span class="exercise-section-tip">点头像看合集</span>
        </div>
        <div class="exercise-blogger-grid">
          ${bloggers.map(b => `
            <div class="exercise-blogger-item" onclick="ExerciseModule.openBlogger('${b.name}')">
              <div class="exercise-blogger-avatar" style="background: ${b.color};"></div>
              <div class="exercise-blogger-name">${b.name}</div>
            </div>
          `).join('')}
          <div class="exercise-blogger-item add" onclick="ExerciseModule.addBlogger()">
            <div class="exercise-blogger-avatar add-avatar">+</div>
            <div class="exercise-blogger-name">添加</div>
          </div>
        </div>
      </div>

      <!-- 我的跟练合集 -->
      <div class="card exercise-section">
        <div class="exercise-section-header">
          <span class="exercise-section-title">${titleIcon('book', 14)} 我的跟练合集</span>
          <button class="btn btn-pink btn-small" onclick="ExerciseModule.newCollection()">+ 新建</button>
        </div>
        <div class="exercise-collection-list">
          ${favorites.length === 0 ? `
            <div class="exercise-empty">
              还没有合集～点「+ 新建」创建<br>
              比如：一三五帕梅拉燃脂·二四六周六野体态
            </div>
          ` : favorites.map((c, i) => `
            <div class="exercise-collection-item">
              <div class="exercise-collection-name">${Utils.escape(c.name)}</div>
              <div class="exercise-collection-meta">${c.count || 0} 个视频</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 一周跟练总览 -->
      <div class="card exercise-section">
        <div class="exercise-section-header">
          <span class="exercise-section-title">${titleIcon('barChart', 14)} 一周跟练总览</span>
        </div>
        <div class="exercise-week-overview">
          ${['一', '二', '三', '四', '五', '六', '日'].map(d => `
            <div class="exercise-overview-day">
              <div class="exercise-overview-circle"></div>
              <div class="exercise-overview-label">${d}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // AI 教练
  renderAI(container) {
    const msges = DB.get('duxing_exercise_ai_msgs', [
      { role: 'ai', text: '你好呀！我是你的 AI 教练，告诉我你的状态，比如「肩颈不舒服」「想瘦肚子」「今天好累」，我马上给你安排合适的跟练视频～' }
    ]);

    const quickTags = ['肩颈不舒服', '久坐腰酸', '想瘦肚子', '睡前拉伸', '生理期', '不想动'];

    container.innerHTML = `
      <div class="card exercise-ai-header">
        <div class="exercise-ai-avatar">${titleIcon('star', 28)}</div>
        <div class="exercise-ai-info">
          <div class="exercise-ai-title">AI 健身教练</div>
          <div class="exercise-ai-desc">哪里不舒服/想练哪里，直接说，我来推跟练</div>
        </div>
      </div>

      <div class="exercise-ai-tags">
        ${quickTags.map(t => `
          <button class="exercise-ai-tag" onclick="ExerciseModule.askAI('${t}')">${t}</button>
        `).join('')}
      </div>

      <div class="exercise-ai-chat">
        ${msges.map(m => `
          <div class="exercise-ai-msg ${m.role}">
            <div class="exercise-ai-bubble">${Utils.escape(m.text)}</div>
          </div>
        `).join('')}
      </div>

      <div class="exercise-ai-input-row">
        <input type="text" class="input-field" id="aiInput" placeholder="例如：肩颈不舒服..." />
        <button class="btn btn-pink" onclick="ExerciseModule.sendAI()">发送</button>
      </div>
      <div class="exercise-ai-tip">提示：当前为体验版，后续可接入 Gemini 等真实 AI 接口</div>
    `;
  },

  // 发起训练
  startTraining() {
    const name = prompt('训练名称（如：跑步、瑜伽）');
    const minutes = prompt('时长（分钟）');
    if (name && minutes && parseInt(minutes) > 0) {
      const logs = DB.get('duxing_exercise_log', []);
      logs.push({
        type: '训练',
        part: name,
        minutes: parseInt(minutes),
        date: App.today,
        timestamp: Date.now()
      });
      DB.set('duxing_exercise_log', logs);
      this.renderTab();
      Utils.toast('训练已记录');
    }
  },

  // 记录饮食
  recordDiet() {
    const input = prompt('记录饮食（吃了什么？）');
    if (input) {
      const logs = DB.get('duxing_exercise_log', []);
      logs.push({
        type: '饮食',
        part: '饮食 · ' + input,
        minutes: 0,
        date: App.today,
        timestamp: Date.now()
      });
      DB.set('duxing_exercise_log', logs);
      this.renderTab();
      Utils.toast('饮食已记录');
    }
  },

  // 打开日程
  openSchedule() {
    const input = prompt('添加日程（时间,事项 格式：18:00跑步）');
    if (input) {
      const schedule = DB.getToday(this.SCHEDULE_KEY, []);
      const [time, ...nameParts] = input.split(/[,，\s]+/);
      const name = nameParts.join(' ') || time;
      schedule.push({ time, name });
      DB.setToday(this.SCHEDULE_KEY, schedule);
      this.renderTab();
      Utils.toast('日程已添加');
    }
  },

  // 打开博主详情
  openBlogger(name) {
    const descMap = {
      '帕梅拉': '高效燃脂，强度较高',
      '欧阳春晓': '亲切耐心的国内博主，动作讲解细，新手友好',
      '韩小四': '瘦腿、改善腿型',
      '周六野 Zoey': '体态调整，简单易学',
      '美丽芭蕾': '塑形，提升气质',
    };
    const modal = document.createElement('div');
    modal.className = 'exercise-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `
      <div class="exercise-modal">
        <div class="exercise-modal-avatar">${name.charAt(0)}</div>
        <div class="exercise-modal-name">${name}</div>
        <div class="exercise-modal-desc">${descMap[name] || '健身博主'}</div>
        <a href="https://search.bilibili.com/all?keyword=${encodeURIComponent(name + ' 健身')}" target="_blank" class="btn btn-pink">B站搜索 ${name}</a>
        <button class="btn btn-primary" onclick="ExerciseModule.createCollection('${name}')">+ 用 TA 建合集</button>
        <button class="exercise-modal-close" onclick="this.closest('.exercise-modal-overlay').remove()">关闭</button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // 创建合集
  createCollection(blogger) {
    const favorites = DB.get(this.FAVORITES_KEY, []);
    favorites.push({
      name: `${blogger}跟练合集`,
      blogger,
      count: 0,
      createdAt: Date.now()
    });
    DB.set(this.FAVORITES_KEY, favorites);
    this.renderTab();
    Utils.toast('合集已创建');
  },

  // 新建合集
  newCollection() {
    const name = prompt('合集名称（如：一三五帕梅拉燃脂）');
    if (name) {
      const favorites = DB.get(this.FAVORITES_KEY, []);
      favorites.push({ name, count: 0, createdAt: Date.now() });
      DB.set(this.FAVORITES_KEY, favorites);
      this.renderTab();
    }
  },

  // 添加博主
  addBlogger() {
    const name = prompt('博主名称');
    if (name) {
      Utils.toast('博主已添加（暂仅展示）');
    }
  },

  // AI 提问
  askAI(text) {
    document.getElementById('aiInput').value = text;
    this.sendAI();
  },

  // 发送 AI 消息
  sendAI() {
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text) return;

    const msgs = DB.get('duxing_exercise_ai_msgs', []);
    msgs.push({ role: 'user', text });
    // 简单回复
    const reply = ExerciseModule.aiReply(text);
    msgs.push({ role: 'ai', text: reply });
    DB.set('duxing_exercise_ai_msgs', msgs);
    input.value = '';
    this.renderTab();
  },

  // AI 简单回复
  aiReply(text) {
    const t = text.toLowerCase();
    if (t.includes('肩颈') || t.includes('脖子')) return '推荐你做「欧阳春晓 - 肩颈拉伸 10 分钟」，动作温和不累，特别适合久坐人群～';
    if (t.includes('腰') || t.includes('久坐')) return '试试「周六野 Zoey - 久坐拉伸」，9 分钟唤醒腰背部，缓解立竿见影 ✨';
    if (t.includes('瘦') || t.includes('减脂')) return '推荐「帕梅拉 15 分钟燃脂」，强度适中，每天坚持 1 周会有明显效果！';
    if (t.includes('睡前') || t.includes('睡眠')) return '推荐「韩小四 睡前拉伸 8 分钟」，助眠不长肌肉';
    if (t.includes('生理期')) return '生理期避免剧烈运动，推荐「瑜伽 基础拉伸 15 分钟」，动作要轻柔哦～';
    if (t.includes('累') || t.includes('不想动')) return '那就从最轻的开始！「5 分钟拉伸」即可，重在坚持不放弃 💪';
    return '为你推荐「帕梅拉 入门 10 分钟燃脂」，强度适中、时长友好，适合每天打卡！';
  },

  // 删除日
  delSchedule(idx) {
    const schedule = DB.getToday(this.SCHEDULE_KEY, []);
    schedule.splice(idx, 1);
    DB.setToday(this.SCHEDULE_KEY, schedule);
    this.renderTab();
  },

  // 删除训练记录
  delLog(idx) {
    const logs = DB.get('duxing_exercise_log', []);
    logs.splice(idx, 1);
    DB.set('duxing_exercise_log', logs);
    this.renderTab();
  },

  // 问候语
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了，记得早点休息';
    if (hour < 11) return '早上好新的一天，元气满满 ✨';
    if (hour < 14) return '中午好记得午休';
    if (hour < 18) return '下午好，动起来吧';
    if (hour < 22) return '晚上好今天也要加油';
    return '夜深了，记得早点休息';
  },

  // 连续打卡天数
  getStreak() {
    const logs = DB.get('duxing_exercise_log', []);
    if (logs.length === 0) return 0;
    const dates = [...new Set(logs.map(l => l.date))].sort().reverse();
    let streak = 0;
    let today = new Date(App.today);
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.round((today - d) / (24 * 60 * 60 * 1000));
      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
};

// ========== 11. 面试专区 ==========
ModuleRenderers.interview = function() {
  const content = document.getElementById('content');
  const tab = App.interviewState.tab;

  const tabs = [
    { key: 'questions',  icon: 'book',  label: '真题' },
    { key: 'templates',  icon: 'note',  label: '模板' },
    { key: 'records',    icon: 'write', label: '记录' },
  ];

  content.innerHTML = `
    <div class="module-page">
      <div class="page-header">
        <div class="page-title">${titleIcon('interview', 26)} 面试专区</div>
        <div class="page-subtitle">结构化面试 · 真题 · 模板 · 模拟答题</div>
      </div>
      <div class="quiz-tabs essay-tabs">
        ${tabs.map(t => `
          <div class="quiz-tab ${tab === t.key ? 'active' : ''}" onclick="InterviewModule.switchTab('${t.key}')">
            ${titleIcon(t.icon, 14)} ${t.label}
          </div>
        `).join('')}
      </div>
      <div id="interviewContent"></div>
    </div>
  `;

  const renderers = {
    questions: () => InterviewModule.renderQuestions(),
    templates: () => InterviewModule.renderTemplates(),
    records:   () => InterviewModule.renderRecords(),
  };
  (renderers[tab] || renderers.questions)();
};

const InterviewModule = {
  // ===== 通用 =====
  switchTab(tab) {
    App.interviewState.tab = tab;
    ModuleRenderers.interview();
  },

  typeColor(type) {
    const map = { '综合分析': 'pink', '组织管理': 'blue', '应急应变': 'orange', '人际关系': 'green', '自我认知': 'gray' };
    return map[type] || 'gray';
  },

  difficultyColor(diff) {
    const map = { '易': 'green', '中': 'blue', '难': 'orange' };
    return map[diff] || 'gray';
  },

  // ===== Tab1: 真题 =====
  renderQuestions() {
    const st = App.interviewState;
    const filter = st.questionFilter;
    const search = st.questionSearch;

    const seed = Utils.dateSeed();
    const dailyPicks = Utils.seededShuffle([...SEED_DATA.interviewQuestions], seed).slice(0, 3);

    let questions = SEED_DATA.interviewQuestions;
    if (filter !== 'all') questions = questions.filter(q => q.type === filter);
    if (search) {
      questions = questions.filter(q =>
        q.question.includes(search) ||
        q.answer.includes(search) ||
        (q.tags && q.tags.some(t => t.includes(search)))
      );
    }

    const types = ['all', '综合分析', '组织管理', '应急应变', '人际关系', '自我认知'];
    const records = DB.get(this.RECORDS_KEY, []);
    const practicedIds = new Set(records.filter(r => r.questionId).map(r => r.questionId));

    document.getElementById('interviewContent').innerHTML = `
      <div class="interview-daily-section">
        <div class="interview-daily-title">${titleIcon('star', 16)} 每日推荐 (${App.today})</div>
        <div class="interview-daily-list">
          ${dailyPicks.map(q => this.renderQuestionCard(q, practicedIds)).join('')}
        </div>
      </div>
      <div class="interview-toolbar">
        <input type="text" class="input-field interview-search" id="interviewQuestionSearch"
               placeholder="搜索题目 / 答案 / 标签..."
               value="${Utils.escape(search)}"
               oninput="InterviewModule.onQuestionSearch(this.value)">
      </div>
      <div class="interview-filter-bar">
        ${types.map(t => `
          <span class="interview-filter-btn ${filter === t ? 'active' : ''}"
                onclick="InterviewModule.setQuestionFilter('${t}')">${t === 'all' ? '全部' : t}</span>
        `).join('')}
        <span class="interview-filter-count">${questions.length} 题</span>
      </div>
      <div class="interview-question-list">
        ${questions.length === 0 ? '<div class="essay-empty">未找到匹配的真题</div>' :
          questions.map(q => this.renderQuestionCard(q, practicedIds)).join('')}
      </div>
    `;
  },

  renderQuestionCard(q, practicedIds) {
    const expanded = App.interviewState.questionExpanded[q.id];
    const isPracticed = practicedIds.has(q.id);
    return `
      <div class="interview-question-card ${expanded ? 'expanded' : ''}" id="ivq-${q.id}">
        <div class="interview-question-header" onclick="InterviewModule.toggleQuestion(${q.id})">
          <div class="interview-question-meta">
            <span class="tag tag-${this.typeColor(q.type)}">${q.type}</span>
            <span class="tag tag-${this.difficultyColor(q.difficulty)}">${q.difficulty}</span>
            ${isPracticed ? '<span class="tag tag-green">已练习</span>' : ''}
          </div>
          <div class="interview-question-text">${Utils.escape(q.question)}</div>
          <div class="interview-question-footer">
            <div class="interview-question-tags">
              ${(q.tags || []).map(t => `<span class="interview-tag">${Utils.escape(t)}</span>`).join('')}
            </div>
            <span class="interview-expand-icon">${expanded ? '收起' : '查看答案'}</span>
          </div>
        </div>
        <div class="interview-question-answer">
          <div class="interview-answer-label">${titleIcon('note', 14)} 参考答案</div>
          <div class="interview-answer-body">${Utils.nl2br(q.answer)}</div>
          ${q.source ? `<div class="interview-answer-source">来源：${Utils.escape(q.source)}</div>` : ''}
          <div class="interview-answer-actions">
            <button class="btn btn-small btn-primary" onclick="InterviewModule.practiceQuestion(${q.id})">
              ${titleIcon('write', 14)} 去模拟答题
            </button>
          </div>
        </div>
      </div>
    `;
  },

  setQuestionFilter(filter) {
    App.interviewState.questionFilter = filter;
    this.renderQuestions();
  },

  onQuestionSearch(val) {
    App.interviewState.questionSearch = val;
    this.renderQuestions();
    const input = document.getElementById('interviewQuestionSearch');
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  },

  toggleQuestion(id) {
    App.interviewState.questionExpanded[id] = !App.interviewState.questionExpanded[id];
    const card = document.getElementById(`ivq-${id}`);
    if (card) card.classList.toggle('expanded');
  },

  practiceQuestion(id) {
    const q = SEED_DATA.interviewQuestions.find(x => x.id === id);
    if (!q) return;
    App.interviewState.tab = 'records';
    App.interviewState.showRecordForm = true;
    App.interviewState.recordForm = {
      type: q.type,
      question: q.question,
      answer: '',
      reflection: '',
      questionId: id,
    };
    ModuleRenderers.interview();
  },

  // ===== Tab2: 模板 =====
  renderTemplates() {
    const st = App.interviewState;
    const filter = st.templateFilter;
    const search = st.templateSearch;

    let templates = SEED_DATA.interviewTemplates;
    if (filter !== 'all') templates = templates.filter(t => t.type === filter);
    if (search) {
      templates = templates.filter(t =>
        t.name.includes(search) ||
        t.framework.includes(search) ||
        t.scripts.includes(search) ||
        t.example.includes(search)
      );
    }

    const types = ['all', '综合分析', '组织管理', '应急应变', '人际关系', '自我认知'];

    document.getElementById('interviewContent').innerHTML = `
      <div class="interview-toolbar">
        <input type="text" class="input-field interview-search" id="interviewTemplateSearch"
               placeholder="搜索模板名称 / 框架 / 话术..."
               value="${Utils.escape(search)}"
               oninput="InterviewModule.onTemplateSearch(this.value)">
      </div>
      <div class="interview-filter-bar">
        ${types.map(t => `
          <span class="interview-filter-btn ${filter === t ? 'active' : ''}"
                onclick="InterviewModule.setTemplateFilter('${t}')">${t === 'all' ? '全部' : t}</span>
        `).join('')}
        <span class="interview-filter-count">${templates.length} 个模板</span>
      </div>
      <div class="interview-template-list">
        ${templates.length === 0 ? '<div class="essay-empty">未找到匹配的模板</div>' :
          templates.map(t => this.renderTemplateCard(t)).join('')}
      </div>
    `;
  },

  renderTemplateCard(t) {
    return `
      <div class="interview-template-card">
        <div class="interview-template-header">
          <span class="tag tag-${this.typeColor(t.type)}">${t.type}</span>
          <span class="interview-template-name">${Utils.escape(t.name)}</span>
        </div>
        <div class="interview-template-section">
          <div class="interview-template-label">${titleIcon('compass', 14)} 框架结构</div>
          <div class="interview-template-framework">${Utils.escape(t.framework)}</div>
        </div>
        <div class="interview-template-section">
          <div class="interview-template-label">${titleIcon('note', 14)} 话术 / 万能句式</div>
          <div class="interview-template-scripts">${Utils.nl2br(t.scripts)}</div>
        </div>
        <div class="interview-template-section">
          <div class="interview-template-label">${titleIcon('book', 14)} 使用示例</div>
          <div class="interview-template-example">${Utils.nl2br(t.example)}</div>
        </div>
      </div>
    `;
  },

  setTemplateFilter(filter) {
    App.interviewState.templateFilter = filter;
    this.renderTemplates();
  },

  onTemplateSearch(val) {
    App.interviewState.templateSearch = val;
    this.renderTemplates();
    const input = document.getElementById('interviewTemplateSearch');
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  },

  // ===== Tab3: 记录 =====
  RECORDS_KEY: 'duxing_interview_records',

  renderRecords() {
    const records = DB.get(this.RECORDS_KEY, []);
    const showForm = App.interviewState.showRecordForm;

    const totalCount = records.length;
    const typeStats = {};
    records.forEach(r => {
      const t = r.type || '未分类';
      typeStats[t] = (typeStats[t] || 0) + 1;
    });

    const sorted = [...records].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const types = ['综合分析', '组织管理', '应急应变', '人际关系', '自我认知'];

    document.getElementById('interviewContent').innerHTML = `
      <div class="interview-stats">
        <div class="quiz-stat-card">
          <div class="quiz-stat-num">${totalCount}</div>
          <div class="quiz-stat-label">总练习</div>
        </div>
        ${Object.entries(typeStats).map(([type, count]) => `
          <div class="quiz-stat-card">
            <div class="quiz-stat-num">${count}</div>
            <div class="quiz-stat-label">${Utils.escape(type)}</div>
          </div>
        `).join('')}
      </div>

      <div class="interview-records-actions">
        <button class="btn btn-primary" onclick="InterviewModule.toggleForm()">
          ${showForm ? '收起表单' : titleIcon('plus', 14) + ' 新增答题记录'}
        </button>
      </div>

      ${showForm ? `
        <div class="card interview-record-form">
          <div class="card-title">${titleIcon('write', 18)} 模拟答题记录</div>
          <div class="interview-form-row">
            <label class="interview-form-label">题型</label>
            <select class="input-field" id="recordType">
              <option value="">请选择题型</option>
              ${types.map(t => `<option value="${t}" ${App.interviewState.recordForm.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="interview-form-row">
            <label class="interview-form-label">题目</label>
            <textarea class="input-field" id="recordQuestion" rows="3"
                      placeholder="输入面试题目...">${Utils.escape(App.interviewState.recordForm.question)}</textarea>
          </div>
          <div class="interview-form-row">
            <label class="interview-form-label">我的答案</label>
            <textarea class="input-field" id="recordAnswer" rows="8"
                      placeholder="输入你的答题内容...">${Utils.escape(App.interviewState.recordForm.answer)}</textarea>
          </div>
          <div class="interview-form-row">
            <label class="interview-form-label">反思总结（选填）</label>
            <textarea class="input-field" id="recordReflection" rows="4"
                      placeholder="答题后的反思、不足之处、改进方向...">${Utils.escape(App.interviewState.recordForm.reflection)}</textarea>
          </div>
          <div class="interview-form-actions">
            <button class="btn btn-primary" onclick="InterviewModule.saveRecord()">保存记录</button>
            <button class="btn btn-secondary" onclick="InterviewModule.resetForm()">清空表单</button>
          </div>
        </div>
      ` : ''}

      <div class="interview-record-list">
        ${sorted.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${titleIcon('note', 36)}</div>
            <div class="empty-state-text">还没有答题记录</div>
            <div class="empty-state-text" style="font-size: 13px; margin-top: 4px;">点击"新增答题记录"开始模拟练习</div>
          </div>
        ` : sorted.map((r) => `
          <div class="interview-record-card">
            <div class="interview-record-header">
              <div class="interview-record-meta">
                ${r.type ? `<span class="tag tag-${this.typeColor(r.type)}">${Utils.escape(r.type)}</span>` : ''}
                <span class="interview-record-date">${Utils.escape(r.dateStr || '')}</span>
              </div>
              <button class="interview-record-del" onclick="InterviewModule.deleteRecord(${r.id})">${ICONS.close || '×'}</button>
            </div>
            <div class="interview-record-question">${Utils.escape(r.question)}</div>
            <div class="interview-record-section">
              <span class="interview-record-label">${titleIcon('write', 12)} 我的答案</span>
              <div class="interview-record-answer">${Utils.nl2br(r.answer)}</div>
            </div>
            ${r.reflection ? `
              <div class="interview-record-section">
                <span class="interview-record-label">${titleIcon('note', 12)} 反思总结</span>
                <div class="interview-record-reflection">${Utils.nl2br(r.reflection)}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  toggleForm() {
    App.interviewState.showRecordForm = !App.interviewState.showRecordForm;
    if (!App.interviewState.showRecordForm) {
      App.interviewState.recordForm = { type: '', question: '', answer: '', reflection: '', questionId: null };
    }
    this.renderRecords();
  },

  resetForm() {
    App.interviewState.recordForm = { type: '', question: '', answer: '', reflection: '', questionId: null };
    this.renderRecords();
  },

  saveRecord() {
    const type = document.getElementById('recordType').value;
    const question = document.getElementById('recordQuestion').value.trim();
    const answer = document.getElementById('recordAnswer').value.trim();
    const reflection = document.getElementById('recordReflection').value.trim();

    if (!question) { Utils.toast('请输入题目', 'error'); return; }
    if (!answer) { Utils.toast('请输入你的答案', 'error'); return; }

    const records = DB.get(this.RECORDS_KEY, []);
    const now = new Date();
    records.push({
      id: Date.now(),
      type,
      question,
      answer,
      reflection,
      questionId: App.interviewState.recordForm.questionId || null,
      createdAt: now.getTime(),
      dateStr: now.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    });
    DB.set(this.RECORDS_KEY, records);

    App.interviewState.showRecordForm = false;
    App.interviewState.recordForm = { type: '', question: '', answer: '', reflection: '', questionId: null };

    Utils.toast('答题记录已保存');
    this.renderRecords();
  },

  deleteRecord(id) {
    if (!confirm('确定删除这条答题记录吗？')) return;
    let records = DB.get(this.RECORDS_KEY, []);
    records = records.filter(r => r.id !== id);
    DB.set(this.RECORDS_KEY, records);
    Utils.toast('已删除');
    this.renderRecords();
  },
};

// ===== 版本自检 / 自动更新 =====
// 解决 iOS「添加到主屏幕」PWA 缓存导致更新到不了设备的问题：
//   定期拉取 version.json（no-store），若线上版本号高于本地 APP_VERSION，则清缓存并强制重载，
//   使新版本自动到达，无需用户手动刷新。一旦用户拿到含本机制的这一版，后续发版都会自动更新。
const VersionCheck = {
  checking: false,
  async check(showToastIfUpToDate) {
    if (this.checking) return;
    this.checking = true;
    try {
      const res = await fetch('version.json?_t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const latest = (data && data.version) || '';
      if (latest && latest !== APP_VERSION) {
        Utils.toast('发现新版本，正在更新…', 'info');
        // 给用户一点时间看到提示；清掉 Cache Storage 后强制重载
        setTimeout(() => {
          if ('caches' in window) {
            caches.keys().then(names => names.forEach(n => caches.delete(n)));
          }
          // iOS PWA 的 location.reload(true) 仍可能命中缓存；
          // 改用带随机查询串的新 URL 跳转，强制浏览器重新拉取 index.html，
          // 进而拿到新 ?v= 的 app.js，确保新版本真正到达设备。
          const url = new URL(window.location.href);
          url.searchParams.delete('_v');
          url.searchParams.set('_v', Date.now());
          window.location.replace(url.toString());
        }, 1200);
      } else if (showToastIfUpToDate) {
        Utils.toast('已是最新版本', 'success');
      }
    } catch (e) {
      // 网络异常静默忽略，下次轮询再试
    } finally {
      this.checking = false;
    }
  },
  start() {
    // 启动即检查一次：若已部署更新，下次打开即可生效
    this.check(false);
    // 每 5 分钟轮询一次
    setInterval(() => this.check(false), 5 * 60 * 1000);
    // 从后台切回 / PWA 重新聚焦时也检查，提升更新及时性
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.check(false);
    });
  },
};

// ===== 初始化 =====
function init() {
  // 检查跨天
  DailyReset.checkNewDay();

  // 从 localStorage 恢复今日答题进度
  // （时政/常识的 index 需先确定题型，故在其后按「题型+日期」加载；成语按日期加载）
  const today = App.today;
  App.idiomState.index = DB.get(`duxing_idiom_index_${today}`, 0);

  // 初始化导航
  Nav.init();

  // 注入图标
  initIcons();

  // 显示日期
  document.getElementById('dateDisplay').textContent = Utils.formatDate();
  // 显示版本号（便于用户确认是否已更新到最新版）
  const vBadge = document.getElementById('versionBadge');
  if (vBadge) vBadge.textContent = 'v ' + APP_VERSION;

  // 显示每日激励语（根据日期种子选取，每日更新）
  const quotes = SEED_DATA.motivationalQuotes || [];
  if (quotes.length) {
    const seed = Utils.dateSeed();
    const idx = seed % quotes.length;
    const quoteEl = document.getElementById('motivationalQuote');
    if (quoteEl) quoteEl.textContent = quotes[idx];
  }

  // 渲染默认模块
  PomodoroModule.init();

  // [一次性] 清零时政常识答题记录
  if (!localStorage.getItem('duxing_quiz_reset_done')) {
    DB.set('duxing_quiz_progress', { politics: { done: 0, correct: 0 }, common: { done: 0, correct: 0 } });
    DB.set('duxing_quiz_wrong', []);
    localStorage.setItem('duxing_quiz_reset_done', '1');
  }

  // 恢复刷新前的状态（如果有的话）
  // 优先从 sessionStorage 读取，fallback 到 localStorage
  let savedState = sessionStorage.getItem('duxing_refresh_state');
  if (!savedState) {
    savedState = localStorage.getItem('duxing_refresh_state');
  }

  // 🔍 诊断日志：记录刷新恢复的关键信息，便于定位"刷新回第1题"问题
  try {
    const diag = {
      ts: new Date().toISOString(),
      version: APP_VERSION,
      today: App.today,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      savedStateSource: savedState ? (sessionStorage.getItem('duxing_refresh_state') ? 'session' : 'local') : 'none',
      savedQuizType: savedState ? (JSON.parse(savedState).quizState || {}).type : null,
      savedQuizIndex: savedState ? (JSON.parse(savedState).quizState || {}).index : null,
      savedModule: savedState ? JSON.parse(savedState).currentModule : null,
      persistedKeys: Object.keys(localStorage).filter(k => k.indexOf('duxing_quiz_index_') === 0),
      persistedPolitics: localStorage.getItem('duxing_quiz_index_politics_' + App.today),
      persistedCommon: localStorage.getItem('duxing_quiz_index_common_' + App.today),
    };
    console.log('[刷新诊断]', JSON.stringify(diag));
    localStorage.setItem('duxing_last_refresh_diag', JSON.stringify(diag));
  } catch(e) {}

  // ⚠️ 关键：在任何 Nav.switchTo() 渲染之前，必须先恢复 quiz 的 index，
  // 否则 renderQuestion() 会用到初始值 0，导致刷新后回到第 1 题。
  // 此处覆盖所有场景（有/无 savedState、currentModule 是否为 quiz）。
  App.quizState.index = DB.get(`duxing_quiz_index_${App.quizState.type}_${App.today}`, 0);

  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      if (state.quizState) {
        // 仅恢复题型导航；当前第几题以「题型+日期」持久化的值为准，避免刷新快照把进度覆盖回第 1 题
        App.quizState.type = state.quizState.type || App.quizState.type;
        // 题型可能变了，按新题型再次恢复 index
        App.quizState.index = DB.get(`duxing_quiz_index_${App.quizState.type}_${App.today}`, 0);
        App.quizState.answered = false;
        App.quizState.selectedOption = -1;
      }
      if (state.idiomState) {
        App.idiomState = state.idiomState;
        App.idiomState.answered = false;
        App.idiomState.selectedOption = -1;
      }
      if (state.englishState) {
        App.englishState = state.englishState;
        // 如果刷新时正在学习中，从 localStorage 恢复会话
        if (App.englishState.tab === 'study' && !App.englishState.session) {
          EnglishModule.restoreSession();
        }
      }
      if (state.essayState) App.essayState = state.essayState;
      if (state.formulaState) App.formulaState = state.formulaState;
      if (state.interviewState) App.interviewState = state.interviewState;
      if (state.highIdiomState) App.highIdiomState = state.highIdiomState;
      if (state.newsTab) App.newsTab = state.newsTab;
      if (state.newsSectionState) App.newsSectionState = state.newsSectionState;
      sessionStorage.removeItem('duxing_refresh_state');
      localStorage.removeItem('duxing_refresh_state');
      Nav.switchTo(state.currentModule || 'plan');
    } catch (e) {
      Nav.switchTo('plan');
    }
  } else {
    Nav.switchTo('plan');
  }

  // ⚠️ 终极保险：如果当前模块是时政常识，且持久化的 index 与当前显示不一致，
  // 强制按持久化值重渲染。确保任何时序问题都不会导致刷新后回到第 1 题。
  if (App.currentModule === 'quiz' && App.quizState.type !== 'wrong') {
    const persistedIdx = DB.get(`duxing_quiz_index_${App.quizState.type}_${App.today}`, 0);
    if (App.quizState.index !== persistedIdx) {
      App.quizState.index = persistedIdx;
      QuizModule.renderQuestion();
    }
  }

  // 更新状态栏
  StatusBar.update();

  // 每分钟：更新学习时长 + 跨本地午夜自检
  // 确保 App.today 随用户本地日期滚动，从而成语/新闻等"按日期种子选题"的模块无需手动刷新即可更新
  setInterval(() => {
    const localToday = getLocalDateStr();
    if (localToday !== App.today) {
      App.today = localToday;
      DailyReset.checkNewDay();
      // 若当前正停留在依赖日期种子的只读型每日模块，静默刷新内容（排除含输入框的计划、含进行中状态的答题/英语，避免打断）
      const m = App.currentModule;
      const dailyModules = ['news', 'essay', 'idiom', 'interview', 'reading', 'exercise', 'formula'];
      if (dailyModules.includes(m) && typeof ModuleRenderers[m] === 'function') {
        ModuleRenderers[m]();
      }
    }
    StatusBar.update();
  }, 60000);

  // 启动应用内版本自检（自动拉取 version.json，发现新版本则强制重载，解决 PWA 缓存陈旧问题）
  VersionCheck.start();
}

// DOM 就绪后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
