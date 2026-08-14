/*
 * Workflow maps for process-oriented questions.
 *
 * This is intentionally a final enrichment pack: it visits every question in
 * defined_sections, marks it as reviewed, and adds a compact workflow only
 * when the prompt benefits from a sequence, decision path, or architecture
 * flow. Definition-only cards remain text-first.
 */
var defined_sections = defined_sections || {};

(function () {
  var templates = {
    manual: {
      title: 'Test design workflow',
      purpose: 'Move from a requirement to clear, evidence-backed coverage.',
      steps: ['Understand scope', 'Map risks', 'Design coverage', 'Execute & observe', 'Share evidence']
    },
    defect: {
      title: 'Defect handling workflow',
      purpose: 'Keep triage factual and make the final verification traceable.',
      steps: ['Reproduce', 'Isolate evidence', 'Record clearly', 'Triage impact', 'Verify & close']
    },
    agile: {
      title: 'Agile delivery workflow',
      purpose: 'Connect quality work to the sprint feedback loop.',
      steps: ['Refine backlog', 'Plan the sprint', 'Build & test', 'Review outcome', 'Improve next sprint']
    },
    selenium: {
      title: 'UI automation workflow',
      purpose: 'Make interactions stable, observable, and safe to repeat.',
      steps: ['Prepare browser', 'Locate & wait', 'Perform action', 'Assert behavior', 'Clean up evidence']
    },
    playwright: {
      title: 'Playwright execution workflow',
      purpose: 'Use isolated contexts and rich artifacts for dependable feedback.',
      steps: ['Create context', 'Navigate & locate', 'Act with auto-wait', 'Assert outcome', 'Trace on failure']
    },
    java: {
      title: 'Coding answer workflow',
      purpose: 'Show the interviewer a deliberate, edge-case-aware solution.',
      steps: ['Read input', 'Guard edge cases', 'Apply core logic', 'Check examples', 'Return result']
    },
    framework: {
      title: 'Automation framework workflow',
      purpose: 'Turn reusable test layers into fast, actionable team feedback.',
      steps: ['Set standards', 'Build test layers', 'Run in CI', 'Publish evidence', 'Improve feedback']
    },
    api: {
      title: 'API validation workflow',
      purpose: 'Validate the contract, business outcome, and downstream state.',
      steps: ['Set contract & auth', 'Send request', 'Validate response', 'Verify state', 'Report evidence']
    },
    database: {
      title: 'Data validation workflow',
      purpose: 'Reconcile application behavior with trustworthy database evidence.',
      steps: ['Prepare test data', 'Query or change', 'Reconcile results', 'Check constraints', 'Record evidence']
    },
    devops: {
      title: 'Delivery pipeline workflow',
      purpose: 'Catch quality signals before a change reaches users.',
      steps: ['Commit change', 'Build artifact', 'Run checks', 'Apply quality gate', 'Release & monitor']
    },
    metrics: {
      title: 'Quality decision workflow',
      purpose: 'Use a measurable signal to drive the next quality decision.',
      steps: ['Set outcome', 'Capture signals', 'Read the trend', 'Choose action', 'Recheck impact']
    },
    senior: {
      title: 'Senior QA decision workflow',
      purpose: 'Balance urgency, evidence, stakeholders, and prevention.',
      steps: ['Clarify impact', 'Gather facts', 'Weigh trade-offs', 'Communicate decision', 'Prevent recurrence']
    },
    behavioral: {
      title: 'Experience answer workflow',
      purpose: 'Structure a concise answer that proves impact and learning.',
      steps: ['Frame context', 'Name the challenge', 'Explain your action', 'Quantify outcome', 'Share learning']
    }
  };

  var sectionTemplates = {
    'manual-testing': 'manual', 'test-design': 'manual', 'sdlc-stlc': 'manual',
    'defect-mgmt': 'defect', 'agile-scrum': 'agile',
    'selenium-fundamentals': 'selenium', 'selenium-locators': 'selenium',
    'sel-waits': 'selenium', 'selenium-browser-handling': 'selenium',
    'selenium-advanced': 'selenium', 'selenium-exceptions': 'selenium',
    'pw-fundamentals': 'playwright', 'pw-locators': 'playwright',
    'pw-assertions-fixtures': 'playwright', 'pw-advanced': 'playwright',
    'pw-coding': 'playwright', 'pw-framework': 'playwright', 'pw-commands': 'playwright',
    'java-core': 'java', 'java-collections': 'java', 'java-strings': 'java',
    'java-coding': 'java', 'coding-round': 'java',
    'testng': 'framework', 'maven': 'framework', 'framework-design': 'framework',
    'pom-design': 'framework', 'data-driven': 'framework', 'hybrid-framework': 'framework',
    'framework-operations': 'framework',
    'api-fundamentals': 'api', 'http-methods': 'api', 'api-request-response': 'api',
    'api-auth': 'api', 'postman': 'api', 'rest-assured': 'api', 'api-scenarios': 'api',
    'sql': 'database', 'sql-coding': 'database', 'sql-advanced': 'database', 'db-testing': 'database',
    'git': 'devops', 'linux': 'devops', 'jenkins': 'devops', 'docker-cloud': 'devops',
    'qa-metrics': 'metrics', 'senior-scenarios': 'senior', 'tricky-questions': 'senior',
    'project-resume': 'senior', 'mock-interviews': 'senior', 'hr-behavioral': 'behavioral'
  };

  var flowSignals = /\b(how\s+(do|would|can|should|did)|walk\s+(me\s+)?through|step[ -]?by[ -]?step|process|workflow|life\s?cycle|lifecycle|flow|strategy|approach|framework|architecture|pipeline|triage|debug|troubleshoot|investigate|root cause|handle|resolve|design|implement|build|create|configure|execute|run|automate|validate|verify|test plan|test strategy|test case|scenario|migration|deploy|release|sprint|regression|integration|production|incident|coding program|write a program)\b/i;
  var definitionOnly = /^(what is|define\b|which\b|list\b|name\b|differentiate\b|compare\b|can you explain\b|is .+\?)$/i;

  function shouldAddWorkflow(question, section) {
    var prompt = [question.question, question.topic, question.subtopic, question.category].filter(Boolean).join(' ');
    if (!sectionTemplates[section]) return false;
    if (!flowSignals.test(prompt)) return false;
    if (definitionOnly.test(String(question.question || '')) && !/process|workflow|life\s?cycle|framework|architecture|strategy|flow|pipeline/i.test(prompt)) return false;
    return true;
  }

  Object.keys(defined_sections).forEach(function (section) {
    var questions = defined_sections[section] && defined_sections[section].questions;
    if (!Array.isArray(questions)) return;

    questions.forEach(function (question) {
      question.workflowReviewed = true;
      if (!question.workflowDiagram && shouldAddWorkflow(question, section)) {
        var templateKey = sectionTemplates[section];
        var template = templates[templateKey];
        question.workflowDiagram = {
          key: templateKey,
          title: template.title,
          purpose: template.purpose,
          steps: template.steps.slice()
        };
      }
    });
  });
})();
