/* ═══════════════════════════════════════════════════════════════
   app.js — QA Interview Bible Core Application
   ═══════════════════════════════════════════════════════════════ */

const QAApp = (() => {
  // State
  let currentSection = 'dashboard';
  let progress = JSON.parse(localStorage.getItem('qa_progress') || '{}');
  let bookmarks = JSON.parse(localStorage.getItem('qa_bookmarks') || '[]');
  let theme = localStorage.getItem('qa_theme') || 'dark';
  let dayChecks = JSON.parse(localStorage.getItem('qa_day_checks') || '{}');
  let allQuestions = [];
  let filteredQuestions = [];
  let mockTimer = null;
  let mockTimeLeft = 120;
  let focusMode = localStorage.getItem('qa_focus_mode') === 'true';

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

  // ── Initialize ──
  function init() {
    applyTheme(theme);
    applyFocusMode(focusMode);
    collectAllQuestions();
    addNavCounts();
    renderDashboard();
    bindEvents();
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
    themeToggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      localStorage.setItem('qa_theme', theme);
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
    if (sun && moon) {
      sun.style.display = t === 'dark' ? 'block' : 'none';
      moon.style.display = t === 'dark' ? 'none' : 'block';
    }
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
    topbarTitle.textContent = sec ? sec.title : section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

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
      panel.innerHTML = `<div class="no-results"><div class="no-results-icon">🚧</div><h3>Coming Soon</h3><p>This section is being prepared with comprehensive content.</p></div>`;
      return panel;
    }

    // Handle special section types
    if (sec.type === 'strategy') {
      panel.innerHTML = `<div class="section-header"><h2>${sec.title}</h2></div>${sec.content}`;
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
        <h2>${sec.title}</h2>
        <p>${sec.description || ''}</p>
        <div class="section-stats">
          <span class="section-stat">📝 ${questions.length} Questions</span>
          <span class="section-stat">🔴 ${questions.filter(q=>q.importance==='must').length} Must Know</span>
          <span class="section-stat">🟠 ${questions.filter(q=>q.importance==='important').length} Important</span>
        </div>
      </div>
      <div class="section-study-tools" data-section-progress="${section}">
        <div class="section-progress-copy"><span>Study progress</span><strong data-section-progress-count>${sectionProgress.done}/${sectionProgress.total}</strong></div>
        <div class="section-progress-track"><span data-section-progress-bar style="width:${sectionProgress.percent}%"></span></div>
        <button class="section-resume-btn" data-resume-section="${section}">Resume next question <span>→</span></button>
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
    const impEmoji = {must:'🔴',important:'🟠',good:'🟡',senior:'🔵'};
    const impLabels = {must:'MUST KNOW',important:'IMPORTANT',good:'GOOD TO KNOW',senior:'SENIOR LEVEL'};

    return `<div class="q-card importance-${q.importance || 'good'}" data-id="${q.id}">
      <div class="q-card-header">
        <div class="q-status ${status === 'in-progress' ? 'in-progress' : status === 'done' ? 'done' : ''}" data-id="${q.id}" title="Click to cycle: Not Started → In Progress → Done"></div>
        <div class="q-card-main">
          <div class="q-card-badges">
            <span class="badge badge-diff-${q.difficulty}">${diffLabels[q.difficulty] || 'L'+q.difficulty}</span>
            <span class="badge badge-${q.importance}">${impEmoji[q.importance] || ''} ${impLabels[q.importance] || q.importance}</span>
            <span class="badge" style="background:var(--bg-glass);color:var(--text-muted)">${q.topic}</span>
          </div>
          <div class="q-question">${q.question}</div>
        </div>
        <div class="q-card-actions">
          <button class="q-bookmark ${isBookmarked ? 'active' : ''}" data-id="${q.id}" title="Bookmark">
            <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="q-expand" title="Expand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      <div class="q-detail">
        ${q.whyAsked ? `<div class="q-detail-section"><div class="q-detail-label">💡 Why Interviewer Asks This</div><div class="q-detail-content">${formatAnswer(q.whyAsked)}</div></div>` : ''}
        
        ${q.thirtySecAnswer ? `<div class="q-detail-section answer-spotlight"><div class="q-detail-label">⚡ 30-Second Answer</div><div class="q-detail-content">${formatAnswer(q.thirtySecAnswer)}</div></div>` : ''}
        
        ${q.interviewAnswer ? `<div class="q-detail-section"><div class="q-detail-label">🎯 Interview Answer</div><div class="q-detail-content">${formatAnswer(q.interviewAnswer)}</div></div>` : ''}
        
        ${q.detailedExplanation ? `<div class="q-detail-section"><div class="q-detail-label">📖 Detailed Explanation</div><div class="q-detail-content">${formatAnswer(q.detailedExplanation)}</div></div>` : ''}
        
        ${q.simpleExplanation ? `<div class="q-detail-section"><div class="q-detail-label">🔑 Simple Explanation</div><div class="q-detail-content">${formatAnswer(q.simpleExplanation)}</div></div>` : ''}
        
        ${q.realWorldExample ? `<div class="q-detail-section"><div class="q-detail-label">🌍 Real-World Example</div><div class="q-detail-content">${formatAnswer(q.realWorldExample)}</div></div>` : ''}
        
        ${q.projectExample ? `<div class="q-detail-section"><div class="q-detail-label">💼 Project Example</div><div class="q-detail-content">${formatAnswer(q.projectExample)}</div></div>` : ''}
        ${q.experienceNote ? `<div class="experience-note"><span>Experience Lens</span><p>${formatAnswer(q.experienceNote)}</p></div>` : ''}
        
        ${q.codeCommand ? `<div class="q-detail-section"><div class="q-detail-label">💻 Code / Command</div><div class="code-block"><button class="code-copy" onclick="QAApp.copyCode(this)">Copy</button><code>${escapeHtml(q.codeCommand)}</code></div></div>` : ''}
        
        ${q.expectedOutput ? `<div class="q-detail-section"><div class="q-detail-label">📤 Expected Output</div><div class="q-detail-content">${q.expectedOutput}</div></div>` : ''}
        
        ${q.followUpQ ? `<div class="followup-box"><div class="q-detail-label">🔄 Follow-Up Question</div><div class="q-detail-content"><strong>${q.followUpQ}</strong></div><div class="q-detail-content" style="margin-top:8px">${formatAnswer(q.followUpA || '')}</div></div>` : ''}
        
        ${q.seniorFollowUpQ ? `<div class="senior-box"><div class="q-detail-label">🏆 Senior-Level Follow-Up</div><div class="q-detail-content"><strong>${q.seniorFollowUpQ}</strong></div><div class="q-detail-content" style="margin-top:8px">${formatAnswer(q.seniorFollowUpA || '')}</div></div>` : ''}
        
        ${q.commonMistake ? `<div class="mistake-box"><div class="q-detail-label" style="color:var(--accent-red)">⚠️ Common Mistake</div><div class="q-detail-content">${q.commonMistake}</div></div>` : ''}
        
        ${q.bestPractice ? `<div class="practice-box"><div class="q-detail-label" style="color:var(--accent-green)">✅ Best Practice</div><div class="q-detail-content">${q.bestPractice}</div></div>` : ''}
      </div>
    </div>`;
  }

  // ── Format Answer ──
  function formatAnswer(text) {
    if (!text) return '';
    text = escapeHtml(String(text));
    
    // Quick Markdown Table Parser for Side-by-Side Comparisons
    if (text.includes('|')) {
      const lines = text.split('\n');
      let inTable = false;
      let htmlLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
          if (!inTable) { htmlLines.push('<table class="matrix-table" style="margin-top:10px; width:100%">'); inTable = true; }
          if (line.includes(':---')) continue; // Skip markdown separator row
          const isHeader = i < lines.length - 1 && lines[i+1].includes(':---');
          const tag = isHeader ? 'th' : 'td';
          const cells = line.split('|').slice(1, -1).map(c => `<${tag}>${c.trim()}</${tag}>`).join('');
          htmlLines.push(`<tr>${cells}</tr>`);
        } else {
          if (inTable) { htmlLines.push('</table>'); inTable = false; }
          htmlLines.push(line);
        }
      }
      if (inTable) { htmlLines.push('</table>'); }
      text = htmlLines.join('\n');
    }

    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="key-term">$1</strong>')
      .replace(/\b(Risk|Impact|Decision|Action|Result|Critical|Production|Quality Gate|Root Cause|Always|Never)\b/gi, '<mark class="important-word">$1</mark>')
      .replace(/`(.*?)`/g, '<code style="background:var(--code-bg);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:13px">$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/<\/table><br>/g, '</table>'); // Fix extra breaks after table
  }

  function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

  function renderPrepPlan(sec) {
    let html = `<div class="section-header"><h2>${sec.title}</h2><p>Follow this structured 30-day plan to systematically prepare for your interview.</p></div>`;
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
    let html = `<div class="section-header"><h2>${sec.title}</h2><p>What interviewers expect at 7-8 years vs 2 years of experience.</p></div>`;
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
          <span class="tp-label">${sec.title.replace(/^[^\w]*/, '').substring(0, 20)}</span>
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
      const labels = { must: '🔴 Must Know', important: '🟠 Important', good: '🟡 Good to Know', senior: '🔵 Senior Level' };
      let html = '';
      for (const key in counts) {
        const pct = Math.round((counts[key] / total) * 100);
        html += `<div class="imp-bar-row">
          <span class="imp-bar-label">${labels[key]}</span>
          <div class="imp-bar-track"><div class="imp-bar-fill" style="width:${pct}%;background:${colors[key]}"></div></div>
          <span class="imp-bar-count">${counts[key]}</span>
        </div>`;
      }
      impBars.innerHTML = html;
    }
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
      container.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><h3>No results found</h3><p>Try different keywords or browse sections from the sidebar.</p></div>`;
    } else {
      container.innerHTML = results.map(q => renderQuestionCard(q)).join('');
      bindCardEvents(container);
    }
    
    searchPanel.classList.add('active');
    topbarTitle.textContent = '🔍 Search Results';
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
      : `<div class="no-results"><div class="no-results-icon">⭐</div><h3>No bookmarks yet</h3><p>Click the bookmark icon on any question to save it for quick access.</p></div>`;
    
    if (results.length > 0) bindCardEvents(container);
    
    searchPanel.classList.add('active');
    topbarTitle.textContent = '⭐ Bookmarked Questions';
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
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
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
    toggleFocusMode
  };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', QAApp.init);
