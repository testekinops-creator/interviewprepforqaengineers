/* ═══════════════════════════════════════════════════════════════
   app.js — QA Interview Mastery Core Application
   ═══════════════════════════════════════════════════════════════ */

const QAApp = (() => {
  // State
  let currentSection = 'dashboard';
  let progress = JSON.parse(localStorage.getItem('qa_progress') || '{}');
  let bookmarks = JSON.parse(localStorage.getItem('qa_bookmarks') || '[]');
  const supportedThemes = ['dark', 'light', 'reading'];
  let theme = supportedThemes.includes(localStorage.getItem('qa_theme')) ? localStorage.getItem('qa_theme') : 'dark';
  let textScale = ['compact', 'comfortable', 'large'].includes(localStorage.getItem('qa_text_scale')) ? localStorage.getItem('qa_text_scale') : 'comfortable';
  let dayChecks = JSON.parse(localStorage.getItem('qa_day_checks') || '{}');
  let notes = JSON.parse(localStorage.getItem('qa_question_notes') || '{}');
  let reviewState = JSON.parse(localStorage.getItem('qa_review_state') || '{}');
  let dailyGoal = Math.min(50, Math.max(1, Number(localStorage.getItem('qa_daily_goal') || 5)));
  let studyActivity = JSON.parse(localStorage.getItem('qa_study_activity') || '{}');
  let allQuestions = [];
  let filteredQuestions = [];
  let mockTimer = null;
  let mockTimeLeft = 120;
  let focusMode = localStorage.getItem('qa_focus_mode') === 'true';
  let readerPanelOpen = false;

  // Premium, code-native SVG icon system.  Icons inherit the surrounding
  // color, stay sharp at every density, and replace the old emoji UI.
  const iconPaths = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m16.5 7.5 4-4M17 3.5h3.5V7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M13 14h3M8 17h3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/><path d="m4 8 5-4 5 5 6-7"/>',
    clipboard: '<path d="M9 4h6a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2h2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m8 13 2 2 4-4"/>',
    workflow: '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="15" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><path d="M9 6.5h6M12 6.5v11M12 17.5h3"/>',
    loop: '<path d="M20 8a8 8 0 0 0-14.8-3L3 8"/><path d="M3 4v4h4M4 16a8 8 0 0 0 14.8 3L21 16"/><path d="M21 20v-4h-4"/>',
    ruler: '<path d="m4 20 16-16 2 2L6 22z"/><path d="m12 8 2 2M8 12l2 2M16 4l2 2"/>',
    bug: '<rect x="8" y="7" width="8" height="10" rx="4"/><path d="M12 7V3M8 9 5 7M16 9l3-2M8 12H4M16 12h4M8 15l-3 2M16 15l3 2"/>',
    activity: '<path d="M3 12h4l2.2-6 4 12 2.2-6H21"/>',
    browser: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18M7 6h.01M10 6h.01M13 6h.01"/>',
    crosshair: '<circle cx="12" cy="12" r="5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 13l3-2M12 5V2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
    zap: '<path d="m13 2-9 12h7l-1 8 9-12h-7z"/>',
    alert: '<path d="M10.3 3.6 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    terminal: '<path d="m5 7 4 4-4 4M12 17h7"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    code: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/>',
    blocks: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="8.5" y="14" width="7" height="7" rx="1"/><path d="M6.5 10v2h9v-2M12 12v2"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 8a3 3 0 0 0 2.6 4h8.8a3 3 0 0 0 2.6-4l-5-8V3"/><path d="M8 15h8"/>',
    package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    play: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.2 2.5 3.2 5.5 3.2 9S14.2 18.5 12 21c-2.2-2.5-3.2-5.5-3.2-9S9.8 5.5 12 3"/>',
    server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    shield: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
    send: '<path d="m21 3-8.5 18-3.2-7.3L3 10.5z"/><path d="M9.3 13.7 21 3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
    git: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 6h8M6 8v5a5 5 0 0 0 5 5h5"/>',
    cloud: '<path d="M7 18h11a4 4 0 0 0 .6-8A6.5 6.5 0 0 0 6.2 8.2 5 5 0 0 0 7 18Z"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12.5-1 8 4.5-2.5 4.5 2.5-1-8"/><path d="m10 8 1.3 1.3L14 6.8"/>',
    sparkles: '<path d="m12 3 1.2 4.3L17.5 9l-4.3 1.2L12 14.5l-1.2-4.3L6.5 9l4.3-1.7zM19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7zM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7z"/>',
    microphone: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8"/>',
    users: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 10.5a3 3 0 0 0 0-6M21 20v-1.5a4 4 0 0 0-2.5-3.7"/>',
    book: '<path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/>',
    output: '<path d="M5 4h14v16H5z"/><path d="m9 9 3 3-3 3M14 15h2"/>',
    repeat: '<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
    lightbulb: '<path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14c-.7.6-1.1 1.4-1.2 2H9.7c-.1-.7-.5-1.4-1.2-1.5Z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>'
  };

  const iconAliases = {
    overview: 'clipboard', manual: 'clipboard', testing: 'clipboard', selenium: 'browser',
    java: 'terminal', framework: 'blocks', playwright: 'play', api: 'globe',
    devops: 'workflow', senior: 'award', reference: 'book', database: 'database',
    code: 'code', important: 'sparkles', good: 'lightbulb', must: 'alert'
  };

  function renderIcon(name, className = '') {
    const resolved = iconAliases[name] || name;
    const path = iconPaths[resolved] || iconPaths.sparkles;
    return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
  }

  function hydrateStaticIcons() {
    document.querySelectorAll('[data-icon]').forEach((element) => {
      element.innerHTML = renderIcon(element.dataset.icon);
    });
  }

  function cleanSectionTitle(title) {
    return String(title || '').replace(/^[\s\u{1F000}-\u{1FAFF}\u2600-\u27BF]+/u, '').trim();
  }

  // DOM refs
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const hamburger = document.getElementById('hamburger');
  const sidebarClose = document.getElementById('sidebarClose');
  const globalSearch = document.getElementById('globalSearch');
  const contentArea = document.getElementById('contentArea');
  const topbarTitle = document.getElementById('topbarTitle');
  const filterDiff = document.getElementById('filterDifficulty');
  const filterImp = document.getElementById('filterImportance');
  const bookmarkFilterBtn = document.getElementById('bookmarkFilter');
  const themeToggle = document.getElementById('themeToggle');
  const focusToggle = document.getElementById('focusToggle');
  const readerToggle = document.getElementById('readerToggle');
  const readerPanel = document.getElementById('readerPanel');

  // ── Initialize ──
  function init() {
    hydrateStaticIcons();
    applyTheme(theme);
    applyTextScale(textScale);
    applyFocusMode(focusMode);
    collectAllQuestions();
    addNavCounts();
    renderDashboard();
    bindEvents();
    bindDashboardEvents();
    updateProgress();
  }

  // ── Collect all questions from defined_sections ──
  function collectAllQuestions() {
    allQuestions = [];
    for (const key in defined_sections) {
      const sec = defined_sections[key];
      if (sec.questions) {
        sec.questions.forEach(q => {
          q._section = key;
          allQuestions.push(q);
        });
      }
    }
  }

  // ── Add question counts to nav items ──
  function addNavCounts() {
    const sectionMap = {};
    allQuestions.forEach(q => {
      sectionMap[q._section] = (sectionMap[q._section] || 0) + 1;
    });
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      const sec = item.dataset.section;
      const count = sectionMap[sec];
      if (count) {
        const badge = document.createElement('span');
        badge.className = 'nav-count';
        badge.textContent = count;
        item.appendChild(badge);
      }
    });
  }

  // ── Bind Events ──
  function bindEvents() {
    // Sidebar nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.dataset.section);
      });
    });

    // Hamburger
    hamburger.addEventListener('click', () => toggleSidebar(true));
    sidebarClose.addEventListener('click', () => toggleSidebar(false));
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

    // Theme
    themeToggle.addEventListener('click', () => setTheme(supportedThemes[(supportedThemes.indexOf(theme) + 1) % supportedThemes.length]));

    readerToggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      setReaderPanel(!readerPanelOpen);
    });

    readerPanel?.addEventListener('click', (event) => {
      const themeChoice = event.target.closest('[data-theme-choice]');
      const scaleChoice = event.target.closest('[data-text-scale-choice]');
      if (themeChoice) setTheme(themeChoice.dataset.themeChoice);
      if (scaleChoice) setTextScale(scaleChoice.dataset.textScaleChoice);
      if (event.target.closest('[data-reader-close]')) setReaderPanel(false);
    });

    document.addEventListener('click', (event) => {
      if (readerPanelOpen && !readerPanel?.contains(event.target) && !readerToggle?.contains(event.target)) setReaderPanel(false);
    });

    // Focus mode
    focusToggle?.addEventListener('click', toggleFocusMode);

    // Search
    let searchTimeout;
    globalSearch.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const q = globalSearch.value.trim();
        if (q.length >= 2) {
          performSearch(q);
        } else if (q.length === 0 && currentSection === 'search-results') {
          navigateTo('dashboard');
        }
      }, 300);
    });

    // Filters
    filterDiff.addEventListener('change', applyFilters);
    filterImp.addEventListener('change', applyFilters);

    // Bookmark filter
    let bookmarkMode = false;
    bookmarkFilterBtn.addEventListener('click', () => {
      bookmarkMode = !bookmarkMode;
      bookmarkFilterBtn.classList.toggle('active', bookmarkMode);
      if (bookmarkMode) {
        showBookmarked();
      } else {
        navigateTo(currentSection === 'search-results' ? 'dashboard' : currentSection);
      }
    });

    // Mock interview
    document.getElementById('mockClose')?.addEventListener('click', closeMockModal);
    document.getElementById('mockNext')?.addEventListener('click', nextMockQuestion);
    document.getElementById('mockReveal')?.addEventListener('click', revealMockAnswer);
    document.getElementById('mockStop')?.addEventListener('click', closeMockModal);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleSidebar(false);
        closeMockModal();
        setReaderPanel(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        globalSearch.focus();
      }
    });
  }

  // ── Theme ──
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const sun = document.querySelector('.icon-sun');
    const moon = document.querySelector('.icon-moon');
    const reading = document.querySelector('.icon-reading');
    if (sun && moon && reading) {
      sun.style.display = t === 'dark' ? 'block' : 'none';
      moon.style.display = t === 'dark' ? 'none' : 'block';
      reading.style.display = t === 'reading' ? 'block' : 'none';
      moon.style.display = t === 'light' ? 'block' : 'none';
    }
    const themeName = { dark: 'Night', light: 'White', reading: 'Read' }[t] || 'Night';
    if (themeToggle) {
      themeToggle.title = `Theme: ${themeName}`;
      themeToggle.setAttribute('aria-label', `Theme: ${themeName}. Change theme`);
    }
    updateReaderControls();
  }

  function setTheme(nextTheme) {
    if (!supportedThemes.includes(nextTheme)) return;
    theme = nextTheme;
    localStorage.setItem('qa_theme', theme);
    applyTheme(theme);
  }

  function applyTextScale(scale) {
    document.documentElement.setAttribute('data-text-scale', scale);
    updateReaderControls();
  }

  function setTextScale(nextScale) {
    if (!['compact', 'comfortable', 'large'].includes(nextScale)) return;
    textScale = nextScale;
    localStorage.setItem('qa_text_scale', textScale);
    applyTextScale(textScale);
  }

  function setReaderPanel(open) {
    readerPanelOpen = Boolean(open);
    if (readerPanel) readerPanel.hidden = !readerPanelOpen;
    if (readerToggle) readerToggle.setAttribute('aria-expanded', String(readerPanelOpen));
  }

  function updateReaderControls() {
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      const active = button.dataset.themeChoice === theme;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-text-scale-choice]').forEach(button => {
      const active = button.dataset.textScaleChoice === textScale;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (readerToggle) readerToggle.title = `Reading preferences · ${textScale} text`;
  }

  // ── Sidebar ──
  function toggleSidebar(open) {
    sidebar.classList.toggle('open', open);
    sidebarOverlay.classList.toggle('active', open);
  }

  // ── Navigation ──
  function navigateTo(section) {
    currentSection = section;
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update topbar title
    const sec = defined_sections[section];
    topbarTitle.textContent = sec ? cleanSectionTitle(sec.title) : section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Show correct section
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    let panel = document.getElementById(`section-${section}`);
    if (!panel) {
      panel = createSectionPanel(section);
      contentArea.appendChild(panel);
    }
    panel.classList.add('active');

    toggleSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Create Section Panel ──
  function createSectionPanel(section) {
    const panel = document.createElement('section');
    panel.className = 'section-panel active';
    panel.id = `section-${section}`;

    const sec = defined_sections[section];
    if (!sec) {
      panel.innerHTML = `<div class="no-results"><div class="no-results-icon">${renderIcon('workflow')}</div><h3>Coming Soon</h3><p>This section is being prepared with comprehensive content.</p></div>`;
      return panel;
    }

    // Handle special section types
    if (sec.type === 'strategy') {
      panel.innerHTML = `<div class="section-header"><h2>${cleanSectionTitle(sec.title)}</h2></div>${sec.content}`;
      return panel;
    }

    if (sec.type === 'plan') {
      panel.innerHTML = renderPrepPlan(sec);
      return panel;
    }

    if (sec.type === 'matrix') {
      panel.innerHTML = renderSkillMatrix(sec);
      return panel;
    }

    // Standard question section
    const questions = sec.questions || [];
    const sectionProgress = getSectionProgress(section);
    let html = `<div class="section-header section-hero-card">
      <div class="section-hero-copy">
        <span class="section-kicker">Senior QA Study Library</span>
        <h2>${cleanSectionTitle(sec.title)}</h2>
        <p>${sec.description || ''}</p>
        <div class="section-stats">
          <span class="section-stat">${renderIcon('clipboard')} ${questions.length} Questions</span>
          <span class="section-stat tone-must">${renderIcon('alert')} ${questions.filter(q=>q.importance==='must').length} Must Know</span>
          <span class="section-stat tone-important">${renderIcon('sparkles')} ${questions.filter(q=>q.importance==='important').length} Important</span>
        </div>
      </div>
      <div class="section-study-tools" data-section-progress="${section}">
        <div class="section-progress-copy"><span>Study progress</span><strong data-section-progress-count>${sectionProgress.done}/${sectionProgress.total}</strong></div>
        <div class="section-progress-track"><span data-section-progress-bar style="width:${sectionProgress.percent}%"></span></div>
        <button class="section-resume-btn" data-resume-section="${section}">Resume next question ${renderIcon('arrow')}</button>
      </div>
    </div>
    <div class="questions-container">`;

    questions.forEach(q => {
      html += renderQuestionCard(q);
    });

    html += '</div>';
    panel.innerHTML = html;

    // Bind card events
    bindCardEvents(panel);
    bindSectionTools(panel);
    return panel;
  }

  // ── Render Question Card ──
  function renderQuestionCard(q) {
    const status = progress[q.id] || 'not-started';
    const isBookmarked = bookmarks.includes(q.id);
    const diffLabels = {1:'Beginner',2:'Basic',3:'Intermediate',4:'Advanced',5:'Senior'};
    const impIcon = {must:'alert',important:'sparkles',good:'lightbulb',senior:'award'};
    const impLabels = {must:'MUST KNOW',important:'IMPORTANT',good:'GOOD TO KNOW',senior:'SENIOR LEVEL'};

    return `<div class="q-card importance-${q.importance || 'good'}" data-id="${q.id}">
      <div class="q-card-header">
        <div class="q-status ${status === 'in-progress' ? 'in-progress' : status === 'done' ? 'done' : ''}" data-id="${q.id}" title="Click to cycle: Not Started → In Progress → Done"></div>
        <div class="q-card-main">
          <div class="q-card-badges">
            <span class="badge badge-diff-${q.difficulty}">${diffLabels[q.difficulty] || 'L'+q.difficulty}</span>
            <span class="badge badge-${q.importance}">${renderIcon(impIcon[q.importance] || 'sparkles')} ${impLabels[q.importance] || q.importance}</span>
            <span class="badge" style="background:var(--bg-glass);color:var(--text-muted)">${q.topic}</span>
          </div>
          <div class="q-question">${q.question}</div>
        </div>
        <div class="q-card-actions">
          <button class="q-bookmark ${isBookmarked ? 'active' : ''}" data-id="${q.id}" title="Bookmark">
            <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="q-expand" title="Expand">${renderIcon('chevron')}</button>
        </div>
      </div>
      <div class="q-detail">
        ${renderQuestionReadingMeta(q)}
        ${q.whyAsked ? `<div class="q-detail-section">${renderDetailLabel('lightbulb', 'Why Interviewer Asks This')}<div class="q-detail-content">${formatAnswer(q.whyAsked)}</div></div>` : ''}
        
        ${q.thirtySecAnswer ? `<div class="q-detail-section answer-spotlight">${renderDetailLabel('zap', '30-Second Answer')}<div class="q-detail-content">${formatAnswer(q.thirtySecAnswer)}</div></div>` : ''}
        
        ${q.interviewAnswer ? `<div class="q-detail-section">${renderDetailLabel('target', 'Interview Answer')}<div class="q-detail-content">${formatAnswer(q.interviewAnswer)}</div></div>` : ''}
        
        ${q.detailedExplanation ? `<div class="q-detail-section">${renderDetailLabel('book', 'Detailed Explanation')}<div class="q-detail-content">${formatAnswer(q.detailedExplanation)}</div></div>` : ''}
        
        ${q.simpleExplanation ? `<div class="q-detail-section">${renderDetailLabel('sparkles', 'Simple Explanation')}<div class="q-detail-content">${formatAnswer(q.simpleExplanation)}</div></div>` : ''}
        
        ${q.realWorldExample ? `<div class="q-detail-section">${renderDetailLabel('globe', 'Real-World Example')}<div class="q-detail-content">${formatAnswer(q.realWorldExample)}</div></div>` : ''}
        
        ${q.projectExample ? `<div class="q-detail-section">${renderDetailLabel('file', 'Project Example')}<div class="q-detail-content">${formatAnswer(q.projectExample)}</div></div>` : ''}
        ${q.experienceNote ? `<div class="experience-note"><span>Experience Lens</span><p>${formatAnswer(q.experienceNote)}</p></div>` : ''}
        ${renderConfidenceControls(q)}
        ${renderPersonalNotes(q)}
        ${q.workflowDiagram ? renderWorkflowDiagram(q.workflowDiagram) : ''}
        
        ${q.codeCommand ? `<div class="q-detail-section">${renderDetailLabel('code', 'Code / Command')}<div class="code-block"><button class="code-copy" onclick="QAApp.copyCode(this)">${renderIcon('copy')}<span>Copy</span></button><pre><code>${escapeHtml(q.codeCommand)}</code></pre></div>${q.codeExplanation ? `<div class="code-explanation"><strong>How it works:</strong> ${formatAnswer(q.codeExplanation)}</div>` : ''}</div>` : ''}
        
        ${q.expectedOutput ? `<div class="q-detail-section">${renderDetailLabel('output', 'Expected Output')}<div class="q-detail-content">${q.expectedOutput}</div></div>` : ''}
        
        ${q.followUpQ ? `<div class="followup-box">${renderDetailLabel('repeat', 'Follow-Up Question')}<div class="q-detail-content"><strong>${q.followUpQ}</strong></div><div class="q-detail-content" style="margin-top:8px">${formatAnswer(q.followUpA || '')}</div></div>` : ''}
        
        ${q.seniorFollowUpQ ? `<div class="senior-box">${renderDetailLabel('award', 'Senior-Level Follow-Up')}<div class="q-detail-content"><strong>${q.seniorFollowUpQ}</strong></div><div class="q-detail-content" style="margin-top:8px">${formatAnswer(q.seniorFollowUpA || '')}</div></div>` : ''}
        
        ${q.commonMistake ? `<div class="mistake-box">${renderDetailLabel('alert', 'Common Mistake', 'tone-red')}<div class="q-detail-content">${q.commonMistake}</div></div>` : ''}
        
        ${q.bestPractice ? `<div class="practice-box">${renderDetailLabel('check', 'Best Practice', 'tone-green')}<div class="q-detail-content">${q.bestPractice}</div></div>` : ''}
      </div>
    </div>`;
  }

  function renderQuestionReadingMeta(q) {
    const answerLayers = [
      q.whyAsked,
      q.thirtySecAnswer,
      q.interviewAnswer,
      q.detailedExplanation,
      q.simpleExplanation,
      q.realWorldExample,
      q.projectExample,
      q.followUpA,
      q.seniorFollowUpA
    ].filter(Boolean);
    const wordCount = answerLayers.join(' ').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.min(9, Math.ceil(wordCount / 185)));
    const depth = q.difficulty >= 4 ? 'Senior depth' : q.difficulty >= 3 ? 'Practical depth' : 'Core depth';

    return `<div class="q-reading-meta" aria-label="Reading guidance">
      <span>${renderIcon('timer')} ${minutes} min focused read</span>
      <span>${renderIcon('layers')} ${answerLayers.length} answer layers</span>
      <span>${renderIcon('target')} ${depth}</span>
    </div>`;
  }

  function renderDetailLabel(iconName, label, toneClass = '') {
    return `<div class="q-detail-label ${toneClass}">${renderIcon(iconName)}<span>${label}</span></div>`;
  }

  function renderWorkflowDiagram(diagram) {
    const steps = Array.isArray(diagram.steps) ? diagram.steps.slice(0, 6) : [];
    if (steps.length < 2) return '';
    const key = escapeHtml(diagram.key || 'manual');
    const title = escapeHtml(diagram.title || 'Workflow map');
    const purpose = escapeHtml(diagram.purpose || 'Follow the sequence and explain your decision at every stage.');
    const stepHtml = steps.map((step, index) => {
      const arrow = index < steps.length - 1 ? `<span class="workflow-arrow">${renderIcon('arrow')}</span>` : '';
      return `<div class="workflow-step"><span class="workflow-step-index">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(step)}</span></div>${arrow}`;
    }).join('');
    return `<section class="workflow-card workflow-${key}" aria-label="${title}">
      <div class="workflow-heading">
        <span class="workflow-icon">${renderIcon('workflow')}</span>
        <div><span class="workflow-kicker">Workflow map</span><h4>${title}</h4></div>
        <span class="workflow-steps-count">${steps.length} steps</span>
      </div>
      <div class="workflow-steps">${stepHtml}</div>
      <p>${purpose}</p>
    </section>`;
  }

  // ── Format Answer ──
  function formatAnswer(text) {
    if (!text) return '';
    const lines = escapeHtml(String(text)).split('\n');
    const blocks = [];
    let tableRows = [];

    const formatInline = (value) => value
      .replace(/\*\*(.*?)\*\*/g, '<strong class="key-term">$1</strong>')
      .replace(/\b(Risk|Impact|Decision|Action|Result|Critical|Production|Quality Gate|Root Cause|Always|Never)\b/gi, '<mark class="important-word">$1</mark>')
      .replace(/`(.*?)`/g, '<code style="background:var(--code-bg);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:13px">$1</code>');

    const flushTable = () => {
      if (!tableRows.length) return;
      const [header, ...body] = tableRows;
      const headerHtml = header.map(cell => `<th scope="col">${formatInline(cell)}</th>`).join('');
      const bodyHtml = body.map(row => `<tr>${row.map(cell => `<td>${formatInline(cell)}</td>`).join('')}</tr>`).join('');
      blocks.push(`<div class="comparison-table-wrap"><table class="matrix-table comparison-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`);
      tableRows = [];
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      const isTableRow = line.startsWith('|') && line.endsWith('|');
      const isDivider = /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(line);

      if (isTableRow) {
        if (!isDivider) tableRows.push(line.split('|').slice(1, -1).map(cell => cell.trim()));
        return;
      }

      flushTable();
      if (!line) return;
      const className = /^SIDE-BY-SIDE COMPARISON:?$/i.test(line) ? ' class="comparison-kicker"' : '';
      blocks.push(`<p${className}>${formatInline(line)}</p>`);
    });
    flushTable();
    return blocks.join('');
  }

  function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Personal study tools ──
  function getDayKey(offset = 0) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function createReviewRecord(level) {
    const intervals = { review: 1, practiced: 3, mastered: 7 };
    return { level, reviewedOn: getDayKey(), dueOn: getDayKey(intervals[level] || 1) };
  }

  function getReviewCopy(id) {
    const state = reviewState[id];
    if (!state) return { label: 'Choose confidence to schedule a revisit', due: '' };
    const labels = { review: 'Review soon', practiced: 'Practiced', mastered: 'Mastered' };
    const today = getDayKey();
    const due = state.dueOn <= today ? (state.dueOn === today ? 'Review today' : 'Revision overdue') : `Next review ${state.dueOn}`;
    return { label: labels[state.level] || 'Practiced', due };
  }

  function renderConfidenceControls(q) {
    const state = reviewState[q.id] || {};
    const copy = getReviewCopy(q.id);
    return `<div class="confidence-panel">
      <div class="confidence-heading"><div><span>Confidence check</span><strong>${copy.label}</strong></div><small>${copy.due}</small></div>
      <div class="confidence-actions">
        <button type="button" class="confidence-choice review ${state.level === 'review' ? 'active' : ''}" data-confidence="review" data-id="${q.id}">Need review</button>
        <button type="button" class="confidence-choice practiced ${state.level === 'practiced' ? 'active' : ''}" data-confidence="practiced" data-id="${q.id}">Practiced</button>
        <button type="button" class="confidence-choice mastered ${state.level === 'mastered' ? 'active' : ''}" data-confidence="mastered" data-id="${q.id}">Mastered</button>
      </div>
    </div>`;
  }

  function renderPersonalNotes(q) {
    const note = escapeHtml(notes[q.id] || '');
    return `<div class="personal-notes">
      <div class="notes-heading"><span>My interview note</span><small>Saved only in this browser</small></div>
      <textarea data-note-input="${q.id}" placeholder="Write your project example, key phrase, or follow-up here…">${note}</textarea>
      <div class="notes-footer"><span>Tip: save a real example using Situation → Action → Result.</span><button type="button" data-save-note="${q.id}">Save note</button></div>
    </div>`;
  }

  function savePersonalNote(id, value, button) {
    const cleanValue = value.trim();
    if (cleanValue) notes[id] = cleanValue;
    else delete notes[id];
    localStorage.setItem('qa_question_notes', JSON.stringify(notes));
    if (button) {
      const original = button.textContent;
      button.textContent = 'Saved ✓';
      setTimeout(() => { button.textContent = original; }, 1400);
    }
    showToast(cleanValue ? 'Personal note saved' : 'Personal note cleared');
  }

  function saveReviewState() {
    localStorage.setItem('qa_review_state', JSON.stringify(reviewState));
  }

  function recordStudyActivity(id) {
    const today = getDayKey();
    studyActivity[today] = studyActivity[today] || {};
    studyActivity[today][id] = true;
    localStorage.setItem('qa_study_activity', JSON.stringify(studyActivity));
  }

  function setQuestionConfidence(id, level) {
    reviewState[id] = createReviewRecord(level);
    progress[id] = level === 'mastered' ? 'done' : 'in-progress';
    recordStudyActivity(id);
    saveReviewState();
    saveProgress();

    document.querySelectorAll(`.q-card[data-id="${id}"]`).forEach(card => {
      const status = card.querySelector('.q-status');
      if (status) status.className = 'q-status ' + (level === 'mastered' ? 'done' : 'in-progress');
      const panel = card.querySelector('.confidence-panel');
      if (panel) {
        panel.querySelectorAll('.confidence-choice').forEach(choice => {
          choice.classList.toggle('active', choice.dataset.confidence === level);
        });
        const copy = getReviewCopy(id);
        const label = panel.querySelector('.confidence-heading strong');
        const due = panel.querySelector('.confidence-heading small');
        if (label) label.textContent = copy.label;
        if (due) due.textContent = copy.due;
      }
    });

    const question = allQuestions.find(item => item.id === id);
    if (question?._section) updateSectionProgressUI(question._section);
    updateProgress();
    showToast(level === 'mastered' ? 'Marked mastered — revision scheduled in 7 days' : 'Confidence saved — a review has been scheduled');
  }

  // ── Bind Card Events ──
  function bindCardEvents(container) {
    // Toggle expand
    container.querySelectorAll('.q-card-header').forEach(header => {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.q-status') || e.target.closest('.q-bookmark')) return;
        const card = header.closest('.q-card');
        card.classList.toggle('expanded');
      });
    });

    // Status toggle
    container.querySelectorAll('.q-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const current = progress[id] || 'not-started';
        const next = current === 'not-started' ? 'in-progress' : current === 'in-progress' ? 'done' : 'not-started';
        progress[id] = next;
        btn.className = 'q-status ' + (next === 'in-progress' ? 'in-progress' : next === 'done' ? 'done' : '');
        if (next === 'in-progress' || next === 'done') {
          recordStudyActivity(id);
          if (!reviewState[id]) {
            reviewState[id] = createReviewRecord(next === 'done' ? 'mastered' : 'practiced');
            saveReviewState();
          }
        }
        saveProgress();
        updateProgress();
        const question = allQuestions.find(item => item.id === id);
        if (question?._section) updateSectionProgressUI(question._section);
      });
    });

    // Bookmark toggle
    container.querySelectorAll('.q-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const idx = bookmarks.indexOf(id);
        if (idx >= 0) {
          bookmarks.splice(idx, 1);
          btn.classList.remove('active');
          btn.querySelector('svg').setAttribute('fill', 'none');
        } else {
          bookmarks.push(id);
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', 'currentColor');
        }
        localStorage.setItem('qa_bookmarks', JSON.stringify(bookmarks));
        updateProgress();
      });
    });

    // Confidence rating and personal notes
    container.querySelectorAll('[data-confidence]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setQuestionConfidence(btn.dataset.id, btn.dataset.confidence);
      });
    });

    container.querySelectorAll('[data-save-note]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.saveNote;
        const input = container.querySelector(`[data-note-input="${id}"]`);
        if (input) savePersonalNote(id, input.value, btn);
      });
    });
  }

  // ── Render Prep Plan ──
  function getSectionProgress(section) {
    const questions = defined_sections[section]?.questions || [];
    const done = questions.filter(q => progress[q.id] === 'done').length;
    return { done, total: questions.length, percent: questions.length ? Math.round((done / questions.length) * 100) : 0 };
  }

  function updateSectionProgressUI(section) {
    const sectionProgress = getSectionProgress(section);
    document.querySelectorAll(`[data-section-progress="${section}"]`).forEach(widget => {
      const count = widget.querySelector('[data-section-progress-count]');
      const bar = widget.querySelector('[data-section-progress-bar]');
      if (count) count.textContent = `${sectionProgress.done}/${sectionProgress.total}`;
      if (bar) bar.style.width = `${sectionProgress.percent}%`;
    });
  }

  function bindSectionTools(panel) {
    panel.querySelectorAll('[data-resume-section]').forEach(button => {
      button.addEventListener('click', () => resumeSection(button.dataset.resumeSection));
    });
  }

  function resumeSection(section) {
    const nextQuestion = (defined_sections[section]?.questions || []).find(q => progress[q.id] !== 'done');
    if (!nextQuestion) {
      showToast('Great work — this section is complete!');
      return;
    }
    const card = document.querySelector(`#section-${section} .q-card[data-id="${nextQuestion.id}"]`);
    if (!card) return;
    card.classList.add('expanded');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function applyFocusMode(enabled) {
    document.body.classList.toggle('focus-mode', enabled);
    if (focusToggle) {
      focusToggle.classList.toggle('active', enabled);
      focusToggle.setAttribute('aria-pressed', String(enabled));
      focusToggle.title = enabled ? 'Exit focus mode' : 'Focus mode';
    }
  }

  function toggleFocusMode() {
    focusMode = !focusMode;
    localStorage.setItem('qa_focus_mode', String(focusMode));
    applyFocusMode(focusMode);
  }

  function getReviewQueue() {
    const today = getDayKey();
    const importanceRank = { must: 0, senior: 1, important: 2, good: 3 };
    const due = allQuestions.filter(q => reviewState[q.id] && reviewState[q.id].dueOn <= today);
    const candidates = due.length ? due : allQuestions.filter(q => progress[q.id] !== 'done');
    return candidates.sort((a, b) => {
      const aDue = reviewState[a.id]?.dueOn || '9999-12-31';
      const bDue = reviewState[b.id]?.dueOn || '9999-12-31';
      return aDue.localeCompare(bDue) || (importanceRank[a.importance] || 4) - (importanceRank[b.importance] || 4) || b.difficulty - a.difficulty;
    }).slice(0, 4);
  }

  function getStudyStreak() {
    let streak = 0;
    for (let offset = 0; offset < 365; offset++) {
      const key = getDayKey(-offset);
      const count = Object.keys(studyActivity[key] || {}).length;
      if (count >= dailyGoal) streak++;
      else if (offset > 0 || count === 0) break;
    }
    return streak;
  }

  function renderStudyDashboard() {
    const todayCount = Object.keys(studyActivity[getDayKey()] || {}).length;
    const goalProgress = Math.min(100, Math.round((todayCount / dailyGoal) * 100));
    const progressEl = document.getElementById('dailyGoalProgress');
    const bar = document.getElementById('dailyGoalBar');
    const goalInput = document.getElementById('dailyGoalInput');
    const streakEl = document.getElementById('studyStreak');
    if (progressEl) progressEl.textContent = `${todayCount} / ${dailyGoal}`;
    if (bar) bar.style.width = `${goalProgress}%`;
    if (goalInput) goalInput.value = dailyGoal;
    if (streakEl) {
      const streak = getStudyStreak();
      streakEl.textContent = todayCount >= dailyGoal
        ? `Goal achieved — ${streak || 1}-day consistency streak. Keep the momentum.`
        : `${Math.max(0, dailyGoal - todayCount)} more ${dailyGoal - todayCount === 1 ? 'answer' : 'answers'} to complete today's goal.`;
    }

    const queue = getReviewQueue();
    const dueCount = allQuestions.filter(q => reviewState[q.id] && reviewState[q.id].dueOn <= getDayKey()).length;
    const dueEl = document.getElementById('reviewDueCount');
    const list = document.getElementById('reviewQueueList');
    if (dueEl) dueEl.textContent = dueCount ? `${dueCount} due` : 'Ready to start';
    if (list) {
      list.innerHTML = queue.length ? queue.map(q => {
        const review = reviewState[q.id];
        const tag = review ? (review.dueOn <= getDayKey() ? 'Due now' : review.level) : 'High priority';
        return `<button type="button" class="review-queue-item" data-review-question="${q.id}">
          <span class="review-queue-copy"><small>${q.topic}</small><strong>${q.question}</strong></span>
          <span class="review-queue-tag">${tag}</span>
        </button>`;
      }).join('') : `<div class="review-queue-empty">Everything is current. Choose a Senior Scenario or a bookmarked question for a fresh practice round.</div>`;
    }
  }

  function openReviewQuestion(id) {
    const question = allQuestions.find(item => item.id === id);
    if (!question?._section) return;
    navigateTo(question._section);
    setTimeout(() => {
      const card = document.querySelector(`#section-${question._section} .q-card[data-id="${id}"]`);
      if (card) {
        card.classList.add('expanded');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

  function bindDashboardEvents() {
    const dashboard = document.getElementById('section-dashboard');
    if (!dashboard) return;
    const dailyGoalInput = dashboard.querySelector('#dailyGoalInput');
    if (dailyGoalInput) {
      dailyGoalInput.addEventListener('input', event => {
        if (event.target.value !== '') setDailyGoal(event.target.value);
      });
      dailyGoalInput.addEventListener('change', event => {
        setDailyGoal(event.target.value);
        confirmDailyGoal();
      });
    }
    dashboard.addEventListener('click', event => {
      const reviewButton = event.target.closest('[data-review-question]');
      if (reviewButton) openReviewQuestion(reviewButton.dataset.reviewQuestion);
      const action = event.target.closest('[data-study-action]')?.dataset.studyAction;
      if (action === 'export') exportStudyBackup();
      if (action === 'import') document.getElementById('studyImportInput')?.click();
    });
    dashboard.addEventListener('change', event => {
      if (event.target.id === 'studyImportInput' && event.target.files?.[0]) importStudyBackup(event.target.files[0]);
    });
  }

  function setDailyGoal(value) {
    if (value === '') return;
    dailyGoal = Math.min(50, Math.max(1, Number(value) || 5));
    localStorage.setItem('qa_daily_goal', String(dailyGoal));
    renderStudyDashboard();
  }

  function confirmDailyGoal() {
    showToast(`Daily goal set to ${dailyGoal} questions`);
  }

  function exportStudyBackup() {
    const backup = {
      app: 'QA Interview Mastery', version: 1, exportedAt: new Date().toISOString(),
      progress, bookmarks, notes, reviewState, dailyGoal, studyActivity
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-bible-backup-${getDayKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Backup downloaded successfully');
  }

  function importStudyBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);
        if (!backup || typeof backup !== 'object') throw new Error('Invalid backup');
        progress = backup.progress && typeof backup.progress === 'object' ? backup.progress : {};
        bookmarks = Array.isArray(backup.bookmarks) ? backup.bookmarks : [];
        notes = backup.notes && typeof backup.notes === 'object' ? backup.notes : {};
        reviewState = backup.reviewState && typeof backup.reviewState === 'object' ? backup.reviewState : {};
        dailyGoal = Math.min(50, Math.max(1, Number(backup.dailyGoal) || 5));
        studyActivity = backup.studyActivity && typeof backup.studyActivity === 'object' ? backup.studyActivity : {};
        saveProgress();
        localStorage.setItem('qa_bookmarks', JSON.stringify(bookmarks));
        localStorage.setItem('qa_question_notes', JSON.stringify(notes));
        saveReviewState();
        localStorage.setItem('qa_daily_goal', String(dailyGoal));
        localStorage.setItem('qa_study_activity', JSON.stringify(studyActivity));
        renderDashboard();
        updateProgress();
        showToast('Backup restored — your study data is ready');
      } catch (error) {
        showToast('That file is not a valid QA Mastery backup');
      }
    };
    reader.readAsText(file);
  }

  function renderPrepPlan(sec) {
    let html = `<div class="section-header"><h2>${cleanSectionTitle(sec.title)}</h2><p>Follow this structured 30-day plan to systematically prepare for your interview.</p></div>`;
    sec.days.forEach(d => {
      const checked = dayChecks[d.day] || false;
      html += `<div class="day-card">
        <div class="day-num">D${d.day}</div>
        <div class="day-content">
          <h4>${d.title}</h4>
          <p>${d.desc}</p>
        </div>
        <div class="day-check ${checked ? 'checked' : ''}" data-day="${d.day}"></div>
      </div>`;
    });
    // Bind day check events after a tick
    setTimeout(() => {
      document.querySelectorAll('.day-check').forEach(chk => {
        chk.addEventListener('click', () => {
          const day = chk.dataset.day;
          dayChecks[day] = !dayChecks[day];
          chk.classList.toggle('checked', dayChecks[day]);
          localStorage.setItem('qa_day_checks', JSON.stringify(dayChecks));
        });
      });
    }, 50);
    return html;
  }

  // ── Render Skill Matrix ──
  function renderSkillMatrix(sec) {
    let html = `<div class="section-header"><h2>${cleanSectionTitle(sec.title)}</h2><p>What interviewers expect at 7-8 years vs 2 years of experience.</p></div>`;
    html += `<table class="matrix-table">
      <thead><tr><th>Skill</th><th>Expected Level</th><th>2-Year Candidate</th><th>7-8 Year Candidate</th></tr></thead>
      <tbody>`;
    sec.skills.forEach(s => {
      html += `<tr>
        <td><strong>${s.skill}</strong></td>
        <td><span class="level-badge ${s.levelClass}">${s.level}</span></td>
        <td>${s.twoYear}</td>
        <td>${s.eightYear}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    return html;
  }

  // ── Dashboard ──
  function renderDashboard() {
    document.getElementById('statTotal').textContent = allQuestions.length;
    document.getElementById('statCompleted').textContent = Object.values(progress).filter(v => v === 'done').length;
    document.getElementById('statBookmarked').textContent = bookmarks.length;
    document.getElementById('statSections').textContent = Object.keys(defined_sections).length;

    // Topic progress
    const topicList = document.getElementById('topicProgressList');
    if (topicList) {
      let html = '';
      for (const key in defined_sections) {
        const sec = defined_sections[key];
        if (!sec.questions || sec.questions.length === 0) continue;
        const total = sec.questions.length;
        const done = sec.questions.filter(q => progress[q.id] === 'done').length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        html += `<div class="topic-progress-item">
          <span class="tp-label">${cleanSectionTitle(sec.title).substring(0, 20)}</span>
          <div class="tp-bar"><div class="tp-fill" style="width:${pct}%"></div></div>
          <span class="tp-pct">${pct}%</span>
        </div>`;
      }
      topicList.innerHTML = html || '<div style="color:var(--text-muted);font-size:13px">Questions are loading...</div>';
    }

    // Importance bars
    const impBars = document.getElementById('importanceBars');
    if (impBars) {
      const counts = { must: 0, important: 0, good: 0, senior: 0 };
      allQuestions.forEach(q => { if (counts[q.importance] !== undefined) counts[q.importance]++; });
      const total = allQuestions.length || 1;
      const colors = { must: 'var(--importance-must)', important: 'var(--importance-important)', good: 'var(--importance-good)', senior: 'var(--importance-senior)' };
      const labels = { must: 'Must Know', important: 'Important', good: 'Good to Know', senior: 'Senior Level' };
      const labelIcons = { must: 'alert', important: 'sparkles', good: 'lightbulb', senior: 'award' };
      let html = '';
      for (const key in counts) {
        const pct = Math.round((counts[key] / total) * 100);
        html += `<div class="imp-bar-row">
          <span class="imp-bar-label">${renderIcon(labelIcons[key])}${labels[key]}</span>
          <div class="imp-bar-track"><div class="imp-bar-fill" style="width:${pct}%;background:${colors[key]}"></div></div>
          <span class="imp-bar-count">${counts[key]}</span>
        </div>`;
      }
      impBars.innerHTML = html;
    }

    renderStudyDashboard();
  }

  // ── Search ──
  function performSearch(query) {
    const q = query.toLowerCase();
    const results = allQuestions.filter(item =>
      item.question.toLowerCase().includes(q) ||
      (item.interviewAnswer && item.interviewAnswer.toLowerCase().includes(q)) ||
      (item.topic && item.topic.toLowerCase().includes(q)) ||
      (item.subtopic && item.subtopic.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );

    currentSection = 'search-results';
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    
    const searchPanel = document.getElementById('section-search-results');
    const searchInfo = document.getElementById('searchInfo');
    const container = document.getElementById('searchResultsContainer');
    
    searchInfo.textContent = `Found ${results.length} results for "${query}"`;
    
    if (results.length === 0) {
      container.innerHTML = `<div class="no-results"><div class="no-results-icon">${renderIcon('search')}</div><h3>No results found</h3><p>Try different keywords or browse sections from the sidebar.</p></div>`;
    } else {
      container.innerHTML = results.map(q => renderQuestionCard(q)).join('');
      bindCardEvents(container);
    }
    
    searchPanel.classList.add('active');
    topbarTitle.textContent = 'Search Results';
  }

  // ── Filters ──
  function applyFilters() {
    const diff = filterDiff.value;
    const imp = filterImp.value;
    
    if (currentSection === 'dashboard' || currentSection === 'search-results') return;
    
    const panel = document.getElementById(`section-${currentSection}`);
    if (!panel) return;
    
    panel.querySelectorAll('.q-card').forEach(card => {
      const id = card.dataset.id;
      const q = allQuestions.find(item => item.id === id);
      if (!q) return;
      
      let show = true;
      if (diff !== 'all' && q.difficulty !== parseInt(diff)) show = false;
      if (imp !== 'all' && q.importance !== imp) show = false;
      
      card.style.display = show ? '' : 'none';
    });
  }

  // ── Bookmarked ──
  function showBookmarked() {
    const results = allQuestions.filter(q => bookmarks.includes(q.id));
    
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    
    const searchPanel = document.getElementById('section-search-results');
    const searchInfo = document.getElementById('searchInfo');
    const container = document.getElementById('searchResultsContainer');
    
    searchInfo.textContent = `${results.length} bookmarked questions`;
    container.innerHTML = results.length > 0 
      ? results.map(q => renderQuestionCard(q)).join('')
      : `<div class="no-results"><div class="no-results-icon">${renderIcon('bookmark')}</div><h3>No bookmarks yet</h3><p>Click the bookmark icon on any question to save it for quick access.</p></div>`;
    
    if (results.length > 0) bindCardEvents(container);
    
    searchPanel.classList.add('active');
    topbarTitle.textContent = 'Bookmarked Questions';
  }

  // ── Progress ──
  function updateProgress() {
    const total = allQuestions.length || 1;
    const done = Object.values(progress).filter(v => v === 'done').length;
    const pct = Math.round((done / total) * 100);

    const circle = document.getElementById('progressCircle');
    const pctEl = document.getElementById('progressPct');
    if (circle) {
      const circumference = 163.36;
      circle.style.strokeDashoffset = circumference - (circumference * pct / 100);
    }
    if (pctEl) pctEl.textContent = pct + '%';

    // Update dashboard stats
    const statComp = document.getElementById('statCompleted');
    const statBook = document.getElementById('statBookmarked');
    if (statComp) statComp.textContent = done;
    if (statBook) statBook.textContent = bookmarks.length;
    renderStudyDashboard();
  }

  function saveProgress() {
    localStorage.setItem('qa_progress', JSON.stringify(progress));
  }

  // ── Mock Interview ──
  function startMockInterview() {
    const modal = document.getElementById('mockModal');
    modal.classList.add('active');
    mockTimeLeft = 120;
    document.getElementById('mockQuestion').textContent = 'Click "Next Question" to begin your mock interview...';
    document.getElementById('mockAnswer').style.display = 'none';
    document.getElementById('mockTimer').textContent = '02:00';
    if (mockTimer) clearInterval(mockTimer);
  }

  function nextMockQuestion() {
    if (allQuestions.length === 0) return;
    const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    document.getElementById('mockQuestion').innerHTML = `<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">${q.category} → ${q.topic}</div>${q.question}`;
    document.getElementById('mockAnswer').innerHTML = formatAnswer(q.interviewAnswer || q.thirtySecAnswer || 'No answer available.');
    document.getElementById('mockAnswer').style.display = 'none';
    
    mockTimeLeft = 120;
    if (mockTimer) clearInterval(mockTimer);
    mockTimer = setInterval(() => {
      mockTimeLeft--;
      const m = Math.floor(mockTimeLeft / 60);
      const s = mockTimeLeft % 60;
      document.getElementById('mockTimer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (mockTimeLeft <= 0) {
        clearInterval(mockTimer);
        document.getElementById('mockTimer').textContent = '00:00';
        document.getElementById('mockTimer').style.color = 'var(--accent-red)';
      } else if (mockTimeLeft <= 30) {
        document.getElementById('mockTimer').style.color = 'var(--accent-amber)';
      } else {
        document.getElementById('mockTimer').style.color = 'var(--accent-blue)';
      }
    }, 1000);
  }

  function revealMockAnswer() {
    const ans = document.getElementById('mockAnswer');
    ans.style.display = ans.style.display === 'none' ? 'block' : 'none';
  }

  function closeMockModal() {
    document.getElementById('mockModal').classList.remove('active');
    if (mockTimer) clearInterval(mockTimer);
  }

  // ── Copy Code ──
  function copyCode(btn) {
    const code = btn.parentElement.querySelector('code');
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.innerHTML = `${renderIcon('check')}<span>Copied</span>`;
      setTimeout(() => { btn.innerHTML = `${renderIcon('copy')}<span>Copy</span>`; }, 2000);
    });
  }

  // ── Toast ──
  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
  }

  // ── Public API ──
  return {
    init,
    navigateTo,
    startMockInterview,
    copyCode,
    showToast,
    resumeSection,
    toggleFocusMode,
    setDailyGoal,
    confirmDailyGoal
  };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', QAApp.init);
