/*
 * Coverage additions found while comparing QA_SDET_Complete_Interview_Guide
 * against the existing QA Bible. Items are appended only when an equivalent
 * question is not already available anywhere in the library.
 */
var defined_sections = defined_sections || {};

(function () {
  function normalize(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function isDuplicate(prompt) {
    var incoming = normalize(prompt);
    var incomingWords = incoming.split(' ').filter(function (word) { return word.length > 2; });
    return Object.keys(defined_sections).some(function (key) {
      return (defined_sections[key].questions || []).some(function (question) {
        var existing = normalize(question.question);
        if (existing === incoming || existing.indexOf(incoming) >= 0 || incoming.indexOf(existing) >= 0) return true;
        var existingWords = existing.split(' ').filter(function (word) { return word.length > 2; });
        var overlap = incomingWords.filter(function (word) { return existingWords.indexOf(word) >= 0; }).length;
        return incomingWords.length >= 5 && overlap / incomingWords.length >= 0.82;
      });
    });
  }

  function buildQuestion(id, item) {
    return {
      id: id,
      category: 'QA / SDET Complete Guide',
      topic: item.topic,
      subtopic: item.subtopic,
      question: item.question,
      whyAsked: 'This is a practical senior-QA interview topic from the supplied guide. A strong answer connects the technical rule to reliable automation and a real delivery decision.',
      difficulty: item.difficulty || 3,
      importance: item.importance || 'important',
      interviewType: item.type || 'Technical / Practical',
      thirtySecAnswer: item.short,
      interviewAnswer: '**Strong answer:** ' + item.answer + '\n\n**Interview framing:** Explain the rule, name the risk or trade-off, and give one small framework or production example.',
      detailedExplanation: item.detail || 'Cover the normal behaviour, boundaries, and failure mode. State what you would assert or log so the result can be trusted in CI.',
      simpleExplanation: item.short,
      realWorldExample: item.example || 'Relate the answer to a maintainable test, a controlled environment, and evidence that another engineer can review.',
      projectExample: item.example || 'Use a concise Situation, Action, Result example from your own project when answering in an interview.',
      codeCommand: item.code || '',
      expectedOutput: item.output || '',
      followUpQ: 'What failure or edge case would you validate next?',
      followUpA: 'I would validate invalid input, boundaries, state cleanup, parallel safety, and diagnostics before relying on the implementation in CI.',
      seniorFollowUpQ: 'How would you make this dependable across the team?',
      seniorFollowUpA: 'I would make the behaviour explicit in a reusable utility or convention, add useful logs or reporting, and review the trend rather than hiding failures.',
      commonMistake: item.mistake || 'Giving only a textbook definition without explaining the consequence for a real automation framework.',
      bestPractice: item.best || 'Keep the design explicit, deterministic, and easy to diagnose when it fails.',
      experienceNote: 'Use an example from your own framework and emphasize the **risk**, **decision**, and measurable **result**.'
    };
  }

  var items = [
    {
      section: 'java-core', topic: 'Java Core and OOP', subtopic: 'Type casting and polymorphism',
      question: 'Explain upcasting and downcasting in Java. Why does Child child = new Parent() not compile?',
      short: 'Upcasting stores a child object in a parent reference and is safe. Downcasting needs an actual child object at runtime; a parent object cannot become a child, so Child child = new Parent() is invalid.',
      answer: 'Use a parent reference when you need only the parent contract: `WebDriver driver = new ChromeDriver()` is upcasting. Downcast only after checking the real runtime type with `instanceof`; otherwise a ClassCastException occurs. `Child child = new Parent()` is rejected because every Parent is not necessarily a Child.',
      code: 'Parent p = new Child(); // safe upcast\nif (p instanceof Child) {\n  Child c = (Child) p; // safe downcast\n}\n// Child c = new Parent(); // compile-time error',
      example: 'In a driver factory, return WebDriver publicly. Only cast to a browser-specific type for a documented capability that the chosen driver actually supports.'
    },
    {
      section: 'java-core', topic: 'Java Core and OOP', subtopic: 'Wrapper types',
      question: 'What are autoboxing and unboxing, and what null risk do they introduce?',
      short: 'Autoboxing converts a primitive to its wrapper automatically; unboxing converts a wrapper to a primitive. Unboxing null throws NullPointerException.',
      answer: 'Java boxes `int` into `Integer` for collections and unboxes it when a primitive is required. Treat wrapper values from JSON, Excel, or databases as nullable: validate before assigning to a primitive and use `Objects.requireNonNull` or a sensible default only when the business rule allows it.',
      code: 'Integer retries = null;\n// int count = retries; // NullPointerException while unboxing\nint count = retries != null ? retries : 0;',
      example: 'A nullable API field mapped into a primitive test-data model can fail before the assertion runs unless the mapping validates null explicitly.'
    },
    {
      section: 'java-core', topic: 'Java Core and OOP', subtopic: 'Abstraction intent',
      question: 'Can a class with only concrete methods be abstract, and why would you design it that way?',
      short: 'Yes. Make it abstract when it is an incomplete base concept that should not be instantiated directly, even if it currently provides reusable concrete behaviour.',
      answer: 'An abstract class can have no abstract methods. It communicates that the base is a template or shared implementation, not a standalone object. For example, a BasePage can provide waits and logging while concrete pages supply the user-facing actions; the design prevents accidental direct use of an incomplete page.',
      example: 'Use an abstract BasePage for shared driver and wait utilities, then expose LoginPage or CheckoutPage as the instantiable page objects.'
    },
    {
      section: 'java-core', topic: 'Java Core and OOP', subtopic: 'Interfaces in Selenium',
      question: 'Can you create an object of an interface? Explain WebDriver driver = new ChromeDriver().',
      short: 'You cannot instantiate an interface itself, but you can hold a concrete implementation in an interface reference. WebDriver is the contract and ChromeDriver is the object created at runtime.',
      answer: 'The expression creates `ChromeDriver`, not `WebDriver`. The interface reference deliberately limits callers to the portable WebDriver API, allowing a factory to return ChromeDriver, FirefoxDriver, RemoteWebDriver, or a test double without changing the test code.',
      example: 'A DriverFactory should return WebDriver so tests are not coupled to Chrome-specific classes.'
    },
    {
      section: 'java-core', topic: 'Java Core and OOP', subtopic: 'Inheritance and composition',
      question: 'Which inheritance types does Java support, and how do IS-A and HAS-A guide framework design?',
      short: 'Java classes support single, multilevel, and hierarchical inheritance; multiple class inheritance is avoided. IS-A is inheritance, while HAS-A is composition, which is usually safer for framework collaborators.',
      answer: 'Use inheritance for a genuine specialized type, such as LoginPage extending BasePage. Prefer composition for changing collaborators: a page HAS-A waiter, API client, reporter, or configuration object. Composition avoids fragile deep hierarchies and makes dependencies easier to replace in tests.',
      example: 'A CheckoutPage should compose a PaymentApi helper rather than extend it; the page and client have different responsibilities.'
    },
    {
      section: 'java-collections', topic: 'Java Collections', subtopic: 'HashMap internals',
      question: 'How does HashMap work internally, and why do equals and hashCode matter?',
      short: 'HashMap uses a key hash to choose a bucket, then uses equals to find the matching key within that bucket. Equal keys must produce the same hashCode.',
      answer: 'On put or get, HashMap calculates a spread hash, selects a bucket, then compares keys using equals. Collisions share a bucket and modern Java can treeify heavily-collided buckets. If a custom key overrides equals without a consistent hashCode, lookups and duplicate detection become unreliable.',
      example: 'For an Employee or API-payload key used in test data, implement both methods from the same immutable identity fields.'
    },
    {
      section: 'java-collections', topic: 'Java Collections', subtopic: 'Collection utilities',
      question: 'What is the difference between Collection and Collections in Java?',
      short: 'Collection is the root interface for groups of objects; Collections is a utility class with static helpers such as sort, reverse, unmodifiableList, and frequency.',
      answer: 'Use Collection as an abstraction in method signatures when callers may provide different collection types. Use the Collections utility class to operate on a collection. Do not confuse either with the broader Collections Framework, which also includes Map and concrete implementations.',
      example: 'Accept Collection<TestUser> for a validation helper, then use Collections.sort only when a List ordering is required.'
    },
    {
      section: 'java-core', topic: 'Java Exceptions', subtopic: 'Multi-catch',
      question: 'When should you use separate catch blocks versus a multi-catch block?',
      short: 'Use separate catches when recovery, logging, or messages differ. Use multi-catch only when the exceptions have the same safe handling path.',
      answer: 'Catch the most specific exceptions first. A multi-catch such as `catch (IOException | SQLException e)` is concise only when both failures are handled identically; the caught variable is effectively final. Never use broad Exception merely to hide a failure that should fail the test.',
      example: 'Handle a missing test-data file differently from a malformed API response because the diagnostic and corrective action are different.'
    },
    {
      section: 'java-core', topic: 'Java Concurrency', subtopic: 'Thread safety',
      question: 'Explain multithreading in Java and its impact on parallel test automation.',
      short: 'Multithreading runs independent work concurrently. Parallel tests need isolated driver, data, report, and state objects; shared mutable state creates random cross-test failures.',
      answer: 'Use ThreadLocal for one WebDriver and reporting context per test thread, avoid mutable static fields, and ensure teardown removes ThreadLocal values. Parallelism is valuable only when test data, environments, and external dependencies can tolerate concurrency; otherwise it creates flaky and misleading failures.',
      example: 'If two tests share a static driver, one test can quit or navigate it while another is still asserting the page.'
    },
    {
      section: 'java-core', topic: 'Java Core', subtopic: 'Serialization and reflection',
      question: 'What are serialization, deserialization, and reflection, and where do they appear in a test framework?',
      short: 'Serialization converts objects to a format such as JSON; deserialization converts data back to objects. Reflection inspects classes and annotations at runtime.',
      answer: 'REST Assured and JSON libraries serialize request models and deserialize responses. TestNG uses reflection to discover annotated test methods. Keep models explicit, validate mapping errors, and use reflection sparingly because it reduces compile-time safety and can hide refactor mistakes.',
      example: 'Deserialize an order response into a typed DTO, then assert its fields instead of relying on brittle string matching.'
    },
    {
      section: 'selenium-fundamentals', topic: 'Selenium Fundamentals', subtopic: 'Selenium 4 migration',
      question: 'What changed from Selenium 3 to Selenium 4, and what matters in an interview?',
      short: 'Selenium 4 standardizes the W3C protocol and adds relative locators, improved window/tab APIs, DevTools integration, and better Grid architecture.',
      answer: 'The key message is interoperability and modern browser support. Selenium 4 removed the legacy JSON Wire Protocol path in favour of W3C WebDriver, supports `newWindow`, relative locators, browser DevTools capabilities, and a redesigned Grid. Use new features only when they make a test clearer; stable locators and waits still matter more.',
      example: 'Use Selenium 4 DevTools for controlled network or console diagnostics, while keeping functional assertions on user-visible outcomes.'
    },
    {
      section: 'selenium-fundamentals', topic: 'Selenium Fundamentals', subtopic: 'Driver configuration',
      question: 'How do DesiredCapabilities and browser Options differ in Selenium 4?',
      short: 'Use browser-specific Options such as ChromeOptions or FirefoxOptions for modern local and remote configuration. DesiredCapabilities is legacy and should not be the default choice.',
      answer: 'Options provide typed browser settings such as headless mode, download preferences, arguments, and W3C-compatible capabilities. For remote execution, merge only supported capabilities into the appropriate Options object and avoid environment-specific flags in test code; keep them in profiles or configuration.',
      example: 'Create ChromeOptions from a CI profile and pass it to RemoteWebDriver rather than scattering DesiredCapabilities across test classes.'
    },
    {
      section: 'selenium-fundamentals', topic: 'Selenium Fundamentals', subtopic: 'WebDriver and WebElement APIs',
      question: 'What are WebDriver and WebElement, and which APIs do you use most often?',
      short: 'WebDriver controls the browser session; WebElement represents one located DOM element. Use explicit waits around observable element state rather than calling element methods blindly.',
      answer: 'WebDriver provides navigation, window, timeout, cookie, switching, and locating APIs. WebElement provides click, sendKeys, clear, getText, getAttribute, and state checks such as isDisplayed. Locate at the latest practical moment and wait for the state required by the next action.',
      example: 'Wait for a checkout button to be clickable, click it, then wait for a visible confirmation rather than sleeping after every action.'
    },
    {
      section: 'selenium-fundamentals', topic: 'Selenium Fundamentals', subtopic: 'Link validation',
      question: 'How do you validate broken links on a page without clicking every link?',
      short: 'Collect HTTP(S) href values, normalize and filter unsupported schemes, then make lightweight HTTP requests and report non-success or redirect-loop outcomes with the source URL.',
      answer: 'Do not navigate the browser through every link because that is slow and changes page state. Extract href values, skip anchors, mailto, tel, and deliberately external exclusions, then use an HTTP client with timeouts. Treat 200-399 as generally reachable, but agree product rules for authentication, expected 403s, and intentional redirects.',
      example: 'Run a nightly link audit that reports the page URL, link text, target URL, status, and final redirect destination.'
    },
    {
      section: 'selenium-advanced', topic: 'Advanced Selenium', subtopic: 'Failure evidence',
      question: 'How should a Selenium framework capture screenshots on failure?',
      short: 'Use a listener or test hook to capture a timestamped screenshot, current URL, test name, browser details, and relevant logs only after a real failure.',
      answer: 'Centralize capture in an ITestListener or framework hook so every failed test is treated consistently. Save an artifact path to the report, handle a missing or already-quit driver safely, and avoid screenshots that expose secrets or customer data. Screenshots supplement—not replace—assertion messages and logs.',
      example: 'On failure, attach the PNG, current URL, console errors, and trace or network artifact to the CI report for one-click triage.'
    },
    {
      section: 'testng', topic: 'TestNG', subtopic: 'Lifecycle annotations',
      question: 'What is the difference between @BeforeTest and @BeforeMethod in TestNG?',
      short: '@BeforeTest runs once before the methods inside a test tag in testng.xml; @BeforeMethod runs before every individual @Test method.',
      answer: 'Use @BeforeMethod for per-test isolation such as a fresh driver, data reset, or reporting context. Use @BeforeTest for setup shared within a logical XML test group. Do not rely on annotation names alone: explain the suite, test-tag, class, and method scopes and keep lifecycle ownership clear.',
      example: 'Create and quit the driver per method for isolated UI tests; initialize a shared non-mutable service configuration once per XML test group.'
    },
    {
      section: 'testng', topic: 'TestNG', subtopic: 'Factory pattern',
      question: 'What is @Factory in TestNG, and when would you use it instead of DataProvider?',
      short: '@Factory creates test-class instances dynamically. DataProvider invokes one test method repeatedly with different data; choose the one that matches the level of variation.',
      answer: 'Use a DataProvider when the same test logic should run for many inputs. Use @Factory when constructor configuration or whole test-class instances differ, such as browser-specific classes or tenant-specific setup. Keep generated instances deterministic and avoid using a factory as hidden global state.',
      example: 'A factory can create the same smoke-test class once per approved browser profile, while a DataProvider supplies credentials to a single login test.'
    },
    {
      section: 'testng', topic: 'TestNG', subtopic: 'Parameters and retries',
      question: 'How do TestNG XML parameters, listeners, and retry analyzers work together?',
      short: 'XML parameters provide run configuration, listeners observe lifecycle events, and a retry analyzer retries only clearly transient failures with a bounded policy.',
      answer: 'Keep environments, browser choice, and suite composition declarative in testng.xml or CI properties. Use listeners to log and attach failure evidence. Retry only known transient conditions, record every attempt, and report the final outcome honestly; retries must not mask deterministic product defects.',
      example: 'A CI suite passes `browser=chrome` and `baseUrl`, while a listener records artifacts and a retry analyzer permits one retry for a documented grid disconnect.'
    },
    {
      section: 'maven', topic: 'Maven and TestNG', subtopic: 'Build model',
      question: 'What is the difference between a Maven phase and a Maven goal?',
      short: 'A phase is a lifecycle stage such as test or package. A goal is a concrete plugin task bound to a phase, such as Surefire test.',
      answer: 'Running `mvn test` executes all lifecycle phases up to test and the plugin goals bound to them. Explain that pom.xml declares dependencies, plugins, and profiles, while the command selects a lifecycle point. This makes CI repeatable rather than relying on IDE-specific execution.',
      example: 'The Surefire plugin test goal runs TestNG during the test phase; package adds packaging work after tests pass.'
    },
    {
      section: 'maven', topic: 'Maven and TestNG', subtopic: 'Configuration ownership',
      question: 'How do testng.xml and pom.xml differ in an automation project?',
      short: 'testng.xml defines TestNG suite composition, groups, parameters, and parallel settings; pom.xml defines Maven dependencies, plugins, build profiles, and lifecycle behaviour.',
      answer: 'Keep test selection and TestNG runtime parameters in testng.xml where the team can review the suite. Keep Java dependencies and execution plugin configuration in pom.xml. CI may override values through properties, but do not duplicate the same ownership in multiple places.',
      example: 'A smoke suite lives in testng.xml, while pom.xml configures Surefire to run that suite with a selected environment profile.'
    },
    {
      section: 'framework-operations', topic: 'Reporting and CI', subtopic: 'TestNG and rich reports',
      question: 'How does the built-in TestNG report differ from ExtentReports or Allure?',
      short: 'TestNG reports basic execution results automatically. ExtentReports and Allure provide richer, shareable evidence such as screenshots, categories, history, and linked artifacts.',
      answer: 'Use the built-in report as a baseline diagnostic. Add a richer report only when it improves triage and release decisions; wire it centrally through listeners, attach meaningful artifacts, and avoid reports that only decorate pass/fail counts. The report must make a failure faster to understand.',
      example: 'A failed checkout test should show the step, assertion message, screenshot, current URL, browser, build link, and any relevant request or console evidence.'
    },
    {
      section: 'framework-design', topic: 'Automation Strategy', subtopic: 'Test selection',
      question: 'How do you select which test cases should be automated and which should remain manual?',
      short: 'Automate stable, repetitive, high-risk, high-value, and data-driven regression checks. Keep exploratory, one-off, rapidly changing, or poor-return checks manual until they become stable enough.',
      answer: 'Use a transparent value-versus-cost decision: business risk, execution frequency, deterministic setup and oracle, maintenance cost, and feedback speed. Do not automate merely to increase a count. Revisit decisions as the product stabilizes and use API or component tests before UI where they give faster reliable coverage.',
      example: 'Automate payment authorization regression and permissions; keep a newly designed visual workflow exploratory until the UX and acceptance criteria settle.'
    },
    {
      section: 'agile-scrum', topic: 'Agile and Scrum', subtopic: 'Delivery trade-offs',
      question: 'What are common Scrum challenges, and how can QA reduce their impact?',
      short: 'Scrum can suffer from unclear ownership, late development handoffs, scope creep, distributed coordination, and weak documentation. QA helps by making quality risks and testability visible early.',
      answer: 'Scrum is not a guarantee of quality. A disengaged product owner, stories entering late, fixed-scope expectations, and time-zone handoffs can compress testing. QA should refine acceptance criteria, identify dependencies early, agree quality gates, split work into testable slices, and escalate evidence-based release risk rather than silently absorbing it.',
      example: 'During refinement, call out test-data and integration dependencies before the sprint commitment so they are planned rather than discovered on the final day.'
    },
    {
      section: 'api-fundamentals', topic: 'API Testing', subtopic: 'BDD',
      question: 'Why is BDD useful in QA automation, and when is it not the right choice?',
      short: 'BDD gives product, QA, and engineering a shared executable specification in business language. It is valuable for collaboration, not as a replacement for good test design or a layer over every low-level check.',
      answer: 'Use concise Given-When-Then scenarios for important user behaviour and acceptance rules. Keep step definitions reusable but not overly generic, and run service or unit checks directly when Gherkin would add ceremony without clarity. BDD succeeds when examples are reviewed before implementation and remain readable by non-engineers.',
      example: 'Express a checkout authorization rule in Gherkin, but keep response-schema edge cases as focused API tests instead of forcing them into broad UI-style steps.'
    },
    {
      section: 'sql', topic: 'SQL', subtopic: 'Set operations',
      question: 'What is the difference between UNION and UNION ALL, and which is safer for QA analysis?',
      short: 'UNION combines compatible result sets and removes duplicates; UNION ALL keeps every row and is usually faster because it avoids deduplication.',
      answer: 'Choose based on the business question. Use UNION when duplicate removal is explicitly required. Use UNION ALL for reconciliation and defect investigation when duplicate rows are evidence rather than noise. Both queries need the same number of compatible columns and predictable ordering must be added explicitly with ORDER BY.',
      example: 'For migration reconciliation, use UNION ALL to expose a record that appears in both source extracts or is duplicated unexpectedly.'
    },
    {
      section: 'senior-scenarios', topic: 'Senior QA Scenarios', subtopic: 'Regression decision',
      question: 'A build contains many bug fixes. Should you run smoke, sanity, or regression testing?',
      short: 'Run smoke first to confirm the build is testable, then prioritize a risk-based regression. Multiple fixes can affect unrelated areas, so sanity alone is not enough.',
      answer: 'Review the fixes, affected components, shared services, data migrations, and release risk. Start with a short smoke gate, then execute focused regression around changed and dependent areas plus the agreed critical path. Communicate remaining coverage and risk; the appropriate depth is a business decision informed by impact and time.',
      example: 'After several checkout fixes, smoke login and checkout first, then regress pricing, inventory, payment callbacks, refunds, reports, and permissions based on change impact.'
    },
    {
      section: 'java-coding', topic: 'Java Coding Programs', subtopic: 'Palindrome words',
      question: 'How would you find palindrome words in a sentence and count them?',
      short: 'Normalize the sentence, split it into words, test each word against its reverse, and count only the words that satisfy the definition.',
      answer: 'Define normalization first: case folding and punctuation removal may be required. Keep a small `isPalindrome` helper, then scan words once. Clarify whether repeated palindrome words should be counted multiple times or uniquely; interviewers often use that ambiguity to test communication.',
      code: 'int count = 0;\nfor (String word : sentence.toLowerCase().replaceAll("[^a-z ]", "").split("\\\\s+")) {\n  if (!word.isEmpty() && word.equals(new StringBuilder(word).reverse().toString())) count++;\n}',
      example: 'The same normalize-then-compare approach is useful when asserting user-facing text that differs only in case or punctuation.'
    },
    {
      section: 'java-coding', topic: 'Java Coding Programs', subtopic: 'Number classification',
      question: 'How would you classify array values as odd, even, prime, odd-and-prime, or even-and-prime?',
      short: 'Evaluate parity and primality independently for each number, noting that 2 is the only even prime and values below 2 are not prime.',
      answer: 'Separate `isPrime` from parity logic so each rule is testable. Test divisors only through the square root, handle negatives and zero explicitly, then build a readable label from the two boolean results. State the expected classification of 2 during the interview.',
      code: 'boolean even = n % 2 == 0;\nboolean prime = isPrime(n);\nString label = (even ? "even" : "odd") + (prime ? " and prime" : "");',
      example: 'This demonstrates how to decompose a compound business rule into independently testable predicates.'
    },
    {
      section: 'framework-design', topic: 'Test Data', subtopic: 'Fillo and Apache POI',
      question: 'When would you use Fillo versus Apache POI for Excel-based test data?',
      short: 'Apache POI is the general Java API for reading and writing Excel files; Fillo offers SQL-like reads over simple sheets. Choose the least complex tool that matches ownership and data needs.',
      answer: 'Use Apache POI when you need full workbook, cell-type, formula, write, or formatting control. Fillo can make simple business-owned table lookups concise, but it is an additional dependency with narrower behaviour. For scalable automated suites, prefer versioned JSON, CSV, APIs, or fixtures when Excel is no longer the best source of truth.',
      example: 'Use POI for a controlled import/export validation sheet; use a simpler structured fixture for parallel API test data that must be isolated per run.'
    }
  ];

  items.forEach(function (item, index) {
    var target = defined_sections[item.section];
    if (!target || !target.questions || isDuplicate(item.question)) return;
    target.questions.push(buildQuestion('GUIDE' + String(index + 1).padStart(3, '0'), item));
  });
})();
