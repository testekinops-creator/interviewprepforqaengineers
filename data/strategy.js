/* ═══════════════════════════════════════════════════════════════
   strategy.js — Interview Strategy, 30-Day Plan, Skill Matrix
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['strategy'] = {
  title: '🎯 Interview Strategy',
  type: 'strategy',
  content: `
<div class="strategy-content">
  <div class="strategy-card">
    <h3>🎯 Interview Preparation Strategy for 7-8 Year QA/SDET</h3>
    <ul>
      <li>At 7-8 years, interviewers expect you to <strong>lead conversations</strong>, not just answer questions</li>
      <li>Every answer should contain: WHAT you did → WHY you did it → HOW you implemented it → WHAT was the result</li>
      <li>Never give one-word answers. Always provide context, examples, and trade-offs</li>
      <li>Be ready to <strong>whiteboard</strong> your framework architecture at any moment</li>
      <li>Know your resume inside-out — every technology, every project, every achievement</li>
    </ul>
  </div>
  <div class="strategy-card">
    <h3>📌 What Interviewers Look For at 7-8 Years</h3>
    <ul>
      <li><strong>Depth:</strong> Can you explain WHY you chose a specific approach, not just WHAT you used?</li>
      <li><strong>Leadership:</strong> Have you mentored juniors? Defined processes? Made architectural decisions?</li>
      <li><strong>Problem-Solving:</strong> How do you debug a flaky test? How do you handle production issues?</li>
      <li><strong>Framework Design:</strong> Can you design a scalable automation framework from scratch?</li>
      <li><strong>Cross-functional:</strong> API + UI + DB validation, CI/CD integration, environment management</li>
      <li><strong>Communication:</strong> Can you explain complex technical concepts clearly?</li>
    </ul>
  </div>
  <div class="strategy-card">
    <h3>⚠️ Common Mistakes at 7-8 Year Level</h3>
    <ul>
      <li>Giving textbook definitions instead of real project experience</li>
      <li>Not knowing the architecture of your own framework</li>
      <li>Using Thread.sleep() as your synchronization answer</li>
      <li>Not being able to write code on the spot</li>
      <li>Saying "I used Selenium" without explaining HOW you used it</li>
      <li>Not being prepared for "Why?" follow-up questions</li>
      <li>Claiming expertise in technologies you've only read about</li>
    </ul>
  </div>
  <div class="strategy-card">
    <h3>🔥 The Golden Rule</h3>
    <ul>
      <li>For every technology on your resume, be prepared to answer 5 levels deep</li>
      <li>Level 1: What is it?</li>
      <li>Level 2: How did you use it?</li>
      <li>Level 3: Why did you choose it over alternatives?</li>
      <li>Level 4: What problems did you face?</li>
      <li>Level 5: How would you improve it?</li>
    </ul>
  </div>
</div>`
};

defined_sections['prep-plan'] = {
  title: '📅 30-Day Preparation Plan',
  type: 'plan',
  days: [
    { day: 1, title: 'Manual Testing Foundations', desc: 'SDLC, STLC, testing types, test case design techniques. Review smoke vs sanity, regression vs retesting.' },
    { day: 2, title: 'Defect Management & Agile', desc: 'Defect lifecycle, severity vs priority, Agile/Scrum roles, sprint ceremonies, QA in Agile.' },
    { day: 3, title: 'Java Core — Variables, OOP', desc: 'Data types, operators, conditions, loops. Classes, objects, constructors, inheritance, encapsulation.' },
    { day: 4, title: 'Java OOP — Advanced', desc: 'Abstraction, interfaces, polymorphism, overloading vs overriding. Method signatures, access modifiers.' },
    { day: 5, title: 'Java Collections', desc: 'ArrayList, HashMap, HashSet, LinkedList. When to use each. Iteration patterns. Collections in automation.' },
    { day: 6, title: 'Java Coding Round (Part 1)', desc: 'String programs: reverse, palindrome, anagram, character count, duplicate characters, first non-repeating.' },
    { day: 7, title: 'Java Coding Round (Part 2)', desc: 'Number programs: prime, fibonacci, factorial, Armstrong, array operations, sorting, second largest.' },
    { day: 8, title: 'Selenium Fundamentals', desc: 'WebDriver architecture, browser commands, locators (ID, Name, Class, CSS). Navigation commands.' },
    { day: 9, title: 'XPath Mastery', desc: 'Absolute vs relative, axes (parent, child, ancestor, descendant, following-sibling), functions (contains, text, starts-with).' },
    { day: 10, title: 'Selenium Waits & Synchronization', desc: 'Implicit, Explicit, Fluent Wait. ExpectedConditions. Dynamic elements. AJAX handling. Why not Thread.sleep().' },
    { day: 11, title: 'Selenium Advanced', desc: 'Alerts, frames, windows, tabs, dropdowns, Actions class, JavaScriptExecutor, screenshots, cookies.' },
    { day: 12, title: 'Selenium Exceptions & Debugging', desc: 'All major exceptions, root causes, solutions. StaleElementReference, ElementNotInteractable, TimeoutException.' },
    { day: 13, title: 'TestNG Deep Dive', desc: 'Annotations, assertions, DataProvider, Groups, Listeners, parallel execution, testng.xml configuration.' },
    { day: 14, title: 'Maven & Build Management', desc: 'pom.xml, dependencies, plugins, lifecycle, profiles, Surefire plugin, Maven + TestNG integration.' },
    { day: 15, title: 'Automation Framework Design (Part 1)', desc: 'POM pattern, Base classes, Driver Factory, Utility classes. BAD vs GOOD framework.' },
    { day: 16, title: 'Automation Framework Design (Part 2)', desc: 'Data-driven, Hybrid framework, Configuration management, Logging, Reporting, Screenshots, Retry mechanism.' },
    { day: 17, title: 'Playwright Fundamentals', desc: 'Architecture, Browser vs Context vs Page, Locator strategies, Auto-waiting, Playwright vs Selenium comparison.' },
    { day: 18, title: 'Playwright Advanced', desc: 'Network interception, API testing, Authentication, Trace Viewer, Fixtures, Hooks, Parallel execution.' },
    { day: 19, title: 'Playwright Coding & Framework', desc: 'POM in Playwright, Custom fixtures, Environment config, CI integration, Debugging flaky tests.' },
    { day: 20, title: 'API Testing Fundamentals', desc: 'REST principles, HTTP methods, status codes, headers, authentication, request/response structure.' },
    { day: 21, title: 'Postman & REST Assured', desc: 'Postman collections, test scripts, Newman. REST Assured: GET/POST/PUT/DELETE, validation, chaining.' },
    { day: 22, title: 'API Scenarios & Coding', desc: 'Real-world API scenarios, error handling, token management, schema validation, API + DB validation.' },
    { day: 23, title: 'SQL Fundamentals', desc: 'SELECT, WHERE, JOINs, GROUP BY, HAVING, subqueries, aggregate functions, CASE statements.' },
    { day: 24, title: 'SQL Coding & Database Testing', desc: 'Duplicate records, Nth salary, missing records, data migration validation, UI-API-DB consistency.' },
    { day: 25, title: 'Git & Version Control', desc: 'All essential commands, branching, merging, rebasing, conflict resolution, stashing, cherry-pick.' },
    { day: 26, title: 'Linux, Jenkins & CI/CD', desc: 'Essential Linux commands for QA, log analysis. Jenkins pipeline, Maven + TestNG integration, troubleshooting.' },
    { day: 27, title: 'Senior Scenarios (Part 1)', desc: 'Automation scenarios: flaky tests, slow suite, parallel execution conflicts, framework design decisions.' },
    { day: 28, title: 'Senior Scenarios (Part 2)', desc: 'Production issues, cross-team communication, mentoring, estimation, automation ROI, process improvement.' },
    { day: 29, title: 'Project, Resume & HR', desc: 'Tell me about yourself (all versions), project walkthrough, resume cross-examination, behavioral questions.' },
    { day: 30, title: 'Mock Interview & Final Revision', desc: 'Complete mock interview practice. Quick revision of top 200 questions. Review tricky questions. Final checklist.' }
  ]
};

defined_sections['skill-matrix'] = {
  title: '📊 7-8 Year Skill Matrix',
  type: 'matrix',
  skills: [
    { skill: 'Manual Testing', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Knows testing types, writes basic test cases', eightYear: 'Defines test strategy, reviews test plans, mentors junior testers, handles complex E2E and cross-browser scenarios' },
    { skill: 'Selenium WebDriver', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Can write basic scripts, knows locators', eightYear: 'Designs reusable frameworks, handles complex scenarios (Shadow DOM, dynamic elements), implements parallel execution with Grid' },
    { skill: 'Java', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Basic OOP, simple programs', eightYear: 'Collections, generics, design patterns, exception handling, file I/O, can write any automation utility from scratch' },
    { skill: 'TestNG', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Knows annotations, runs tests', eightYear: 'Custom listeners, retry analyzers, data providers, parallel strategies, complex testng.xml configurations' },
    { skill: 'Automation Framework', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Uses existing framework', eightYear: 'Architects enterprise frameworks with POM, data-driven, configuration management, multi-environment support, CI/CD integration' },
    { skill: 'API Testing', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Basic Postman usage', eightYear: 'REST Assured automation, API chaining, token management, schema validation, API + DB validation, performance awareness' },
    { skill: 'SQL', level: 'Intermediate-Advanced', levelClass: 'level-intermediate', twoYear: 'Basic SELECT, WHERE', eightYear: 'Complex JOINs, subqueries, window functions, data migration validation, stored procedure testing' },
    { skill: 'Git', level: 'Intermediate-Advanced', levelClass: 'level-intermediate', twoYear: 'clone, add, commit, push', eightYear: 'Branching strategies, rebasing, conflict resolution, cherry-pick, stash, code review workflows' },
    { skill: 'Jenkins / CI-CD', level: 'Intermediate-Advanced', levelClass: 'level-intermediate', twoYear: 'Triggers builds manually', eightYear: 'Configures pipelines, integrates test suites, manages environments, troubleshoots CI failures, schedules runs' },
    { skill: 'Agile / Scrum', level: 'Advanced', levelClass: 'level-advanced', twoYear: 'Attends ceremonies', eightYear: 'Active sprint participant, story grooming, estimation, retrospective contributor, cross-team collaboration' },
    { skill: 'Playwright', level: 'Interview-Ready', levelClass: 'level-interview', twoYear: 'N/A', eightYear: 'Understands architecture, can compare with Selenium, knows locator strategies, auto-waiting, basic framework concepts' },
    { skill: 'Docker', level: 'Basic-Intermediate', levelClass: 'level-basic', twoYear: 'N/A', eightYear: 'Can run containers, understands images, knows how QA uses Docker for test environments and Selenium Grid' },
    { skill: 'Linux', level: 'Intermediate', levelClass: 'level-intermediate', twoYear: 'Basic navigation', eightYear: 'Log analysis with grep/awk/sed, process management, file operations, scripting basics for QA tasks' },
    { skill: 'Performance Testing', level: 'Basic', levelClass: 'level-basic', twoYear: 'N/A', eightYear: 'Understands load/stress/spike testing concepts, can identify performance issues, knows JMeter basics' }
  ]
};
