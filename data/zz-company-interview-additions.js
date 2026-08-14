/*
 * Curated additions from the supplied company-interview notes.
 * The guard deliberately skips an item when an equivalent question already
 * exists anywhere in the QA Bible, so the library grows without repetition.
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
        return incomingWords.length >= 5 && overlap / incomingWords.length >= 0.78;
      });
    });
  }

  function interviewQuestion(id, item) {
    return {
      id: id,
      category: 'Company Interview Bank',
      topic: item.topic,
      subtopic: item.subtopic || 'Experienced QA interview',
      question: item.question,
      whyAsked: 'This was reported in an experienced QA/SDET interview. It checks whether you can explain the reasoning, write safe code where needed, and connect the answer to real project work.',
      difficulty: item.difficulty || 4,
      importance: item.importance || 'must',
      interviewType: item.type || 'Technical / Practical',
      thirtySecAnswer: item.short,
      interviewAnswer: '**Strong answer:** ' + item.answer + '\n\n**Interview framing:** State the business or engineering risk first, explain your decision, then show a small code or project example where it helps.',
      detailedExplanation: item.detail || '**What good looks like:** Give the correct concept, explain the edge cases, and say how you would verify the outcome in a project.',
      simpleExplanation: item.short,
      realWorldExample: item.example || 'Tie your answer to a stable, maintainable automation check from a real application rather than describing only a textbook definition.',
      projectExample: item.example || 'Use your own project context, action, evidence, and measurable result.',
      codeCommand: item.code || '',
      expectedOutput: item.output || '',
      followUpQ: 'What edge case or failure mode would you test next?',
      followUpA: 'I would cover invalid or boundary data, state changes, permissions, timing, cleanup, and the diagnostics needed to explain a failed run.',
      seniorFollowUpQ: 'How would you make this reliable for the whole team?',
      seniorFollowUpA: 'I would turn the learning into a small reusable utility or convention, add observability, document ownership, and review the trend in CI.',
      commonMistake: item.mistake || 'Answering with a definition or code snippet but not explaining the risk, edge cases, and expected outcome.',
      bestPractice: item.best || 'Keep the example small, deterministic, readable, and connected to a real user or release risk.',
      experienceNote: 'Use a real project example and explain the **decision**, **risk**, and measurable **result** in your own words.'
    };
  }

  var items = [
    {
      section: 'java-collections', topic: 'Java Collections', subtopic: 'Domain objects in ArrayList',
      question: 'Write a user-defined ArrayList for Employee data containing age, employee ID, and name.',
      short: 'Create a small immutable Employee class, add instances to List<Employee>, and validate the data through clear getters or record accessors.',
      answer: 'Model Employee as a dedicated type instead of parallel lists. Store it in an ArrayList, preserve type safety with generics, and override toString() only for readable diagnostics—not for business logic.',
      code: 'class Employee {\n  private final int age; private final String empId; private final String name;\n  Employee(int age, String empId, String name) { this.age = age; this.empId = empId; this.name = name; }\n  public String toString() { return empId + " | " + name + " | " + age; }\n}\nList<Employee> employees = new ArrayList<>();\nemployees.add(new Employee(30, "E101", "Nikhil"));',
      output: 'E101 | Nikhil | 30',
      example: 'In automation, this same pattern is useful for test-user profiles, API payload models, or report data.'
    },
    {
      section: 'java-strings', topic: 'Java Strings', subtopic: 'Normalization and character sorting',
      question: 'Given "My Name is Nikhil", remove spaces and sort the characters without changing the original input.',
      short: 'Remove whitespace into a new value, convert it to a char array, sort the array, and create the output string.',
      answer: 'Strings are immutable, so keep the source value intact. Normalize with replaceAll, sort a char array with Arrays.sort, and be explicit about whether case should be normalized before comparison.',
      code: 'String source = "My Name is Nikhil";\nchar[] chars = source.replaceAll("\\\\s+", "").toLowerCase().toCharArray();\nArrays.sort(chars);\nString sorted = new String(chars);',
      example: 'Use the same pattern when comparing UI and API values that differ only by whitespace or casing.'
    },
    {
      section: 'java-coding', topic: 'Java Coding Programs', subtopic: 'Prime number pattern',
      question: 'Write a Java program that prints prime numbers in a pyramid shape.',
      short: 'Generate candidate numbers, keep only primes using a square-root divisor check, and print the required count on each row.',
      answer: 'Separate the primality check from the printing loop. Test divisors only until sqrt(n), handle values below two, and make the row size configurable so the algorithm stays readable.',
      code: 'static boolean isPrime(int n) {\n  if (n < 2) return false;\n  for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;\n  return true;\n}\nint candidate = 2;\nfor (int row = 1; row <= 4; row++) {\n  for (int col = 1; col <= row; ) {\n    if (isPrime(candidate)) { System.out.print(candidate + " "); col++; }\n    candidate++;\n  }\n  System.out.println();\n}',
      output: '2\n3 5\n7 11 13\n17 19 23 29'
    },
    {
      section: 'java-strings', topic: 'Java Strings', subtopic: 'Regex extraction',
      question: 'Given "abc-2019", extract the alphabetic and numeric values separately.',
      short: 'Use explicit character-class replacement or a matcher to separate letters from digits, then validate absent groups.',
      answer: 'For a simple fixed format, replace non-letters and non-digits. For a changing format, use a named regex pattern so that optional groups and validation are clear.',
      code: 'String value = "abc-2019";\nString letters = value.replaceAll("[^A-Za-z]", "");\nString digits = value.replaceAll("\\\\D", "");\nSystem.out.println(letters);\nSystem.out.println(digits);',
      output: 'abc\n2019'
    },
    {
      section: 'java-strings', topic: 'Java Strings', subtopic: 'String immutability',
      question: 'What is printed by: String name = "Testing"; name.toUpperCase(); System.out.println(name);',
      short: 'It prints Testing because String methods return a new value; they do not mutate the existing String.',
      answer: 'String is immutable. toUpperCase creates a new String that is discarded here. Assign the returned result—name = name.toUpperCase()—when you want the variable to refer to the uppercase value.',
      code: 'String name = "Testing";\nname.toUpperCase();\nSystem.out.println(name); // Testing\nname = name.toUpperCase();\nSystem.out.println(name); // TESTING',
      output: 'Testing\nTESTING'
    },
    {
      section: 'java-collections', topic: 'Java Collections', subtopic: 'Frequency counting',
      question: 'How would you count unknown colored balls and print results such as blue 3, red 5, and indigo 7?',
      short: 'Use a Map<String, Integer>, increment the count for each value, then print the entries in a predictable order if required.',
      answer: 'A HashMap is the direct frequency counter. Choose LinkedHashMap when encounter order matters or TreeMap when sorted output matters. Validate null or unexpected color values instead of silently treating them as a real category.',
      code: 'Map<String, Integer> counts = new TreeMap<>();\nfor (String color : balls) {\n  counts.merge(color, 1, Integer::sum);\n}\ncounts.forEach((color, count) -> System.out.println(color + " " + count));',
      example: 'This pattern is useful for analysing error categories, browser distribution, and test-result summaries.'
    },
    {
      section: 'java-core', topic: 'Java Core & OOP', subtopic: 'Circular inheritance',
      question: 'Can class A extend B while class B extends A? Explain the result.',
      short: 'No. Java rejects circular inheritance at compile time because it cannot build a valid inheritance hierarchy.',
      answer: 'Inheritance must form an acyclic hierarchy. A circular parent relationship makes method and field resolution impossible, so the compiler reports a cyclic inheritance error. Use composition or an interface for shared behaviour instead.',
      detail: '**Design choice:** If two types depend on each other, extract a shared interface or service. Do not try to model mutual dependency with inheritance.'
    },
    {
      section: 'java-core', topic: 'Java Core & OOP', subtopic: 'Constructor chaining',
      question: 'How do you call a parameterized constructor from a user-created no-argument constructor?',
      short: 'Use this(arguments) as the first statement in the no-argument constructor.',
      answer: 'Constructor chaining centralizes initialization. this(...) must be the first statement because Java must fully initialize the object through one constructor path before other statements execute.',
      code: 'class User {\n  private final String name;\n  User() { this("Guest"); }\n  User(String name) { this.name = name; }\n}',
      output: 'The no-argument constructor creates User with the default name Guest.'
    },
    {
      section: 'testng', topic: 'TestNG', subtopic: 'Dependency design',
      question: 'A test needs a prerequisite created by another test. How should you design this in TestNG?',
      short: 'Avoid test-to-test dependency where possible; create state in setup or an API fixture. Use dependsOnMethods only when the dependency is intentional and visible.',
      answer: 'Independent tests are easier to rerun and parallelize. Prefer @BeforeMethod, @BeforeClass, or an API setup helper for prerequisites. If a true workflow dependency remains, use dependsOnMethods and make skipped behaviour and cleanup explicit.',
      code: '@BeforeMethod\npublic void createUser() { userId = api.createUser(); }\n\n@Test\npublic void updateUser() { /* independent test using userId */ }',
      example: 'For purchase workflows, create customer and cart data by API instead of relying on a previous UI test.'
    },
    {
      section: 'testng', topic: 'TestNG', subtopic: 'Suite capacity',
      question: 'Is there a fixed maximum number of tests that can be listed in testng.xml?',
      short: 'There is no useful framework limit; practical limits come from execution capacity, data isolation, browser/Grid resources, and reporting time.',
      answer: 'Do not design around a hard count. Split suites by purpose and duration, run stable smoke checks first, and scale workers only after data, environment, reporting, and retry behaviour are isolated and observable.',
      example: 'A 2,000-test regression suite should be sharded by risk and capacity rather than treated as one serial XML file.'
    },
    {
      section: 'selenium-browser-handling', topic: 'Selenium WebElements & Browser Handling', subtopic: 'Dynamic web table metrics',
      question: 'How do you fetch total rows and columns from a dynamic web table without relying on hard-coded indexes?',
      short: 'Wait until loading completes, locate visible rows and header cells from the table root, then validate the business row by a key rather than by its position.',
      answer: 'Scope locators to the table component and distinguish header, data, and pagination rows. Use the current DOM result only after the loading indicator is gone, and assert the row/column counts together with a meaningful data rule.',
      code: 'WebElement table = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("table[data-testid=orders]")));\nint rows = table.findElements(By.cssSelector("tbody tr")).size();\nint columns = table.findElements(By.cssSelector("thead th")).size();',
      example: 'For a paginated order table, verify the total count from the API separately from the count visible on the current page.'
    },
    {
      section: 'selenium-locators', topic: 'Selenium Locators & XPath', subtopic: 'Whitespace-resistant XPath',
      question: 'When should you use normalize-space(text()) in XPath?',
      short: 'Use it when visible text contains extra leading, trailing, or repeated whitespace that should not affect matching.',
      answer: 'normalize-space makes text matching resilient to formatting whitespace, but it is still weaker than a stable ID, role, or data-testid. Use it only where text is the real user-facing contract.',
      code: "By save = By.xpath(\"//button[normalize-space(.)='Save changes']\");",
      example: 'It is helpful when a button label contains line breaks from a responsive layout.'
    },
    {
      section: 'selenium-advanced', topic: 'Advanced Selenium', subtopic: 'In-page navigation',
      question: 'How do you move to a different location on the same page in Selenium?',
      short: 'Locate the target and use scrollIntoView through JavaScript, then wait until the target is visible and interactable.',
      answer: 'Scrolling is not a success condition by itself. Scroll to the element, wait for its visible state, account for sticky headers, and assert the intended user action or content after scrolling.',
      code: 'WebElement target = driver.findElement(By.id("payment-section"));\n((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: \'center\'});", target);\nwait.until(ExpectedConditions.visibilityOf(target));',
      example: 'Use this for a long checkout page where payment controls are below address and shipping details.'
    },
    {
      section: 'selenium-fundamentals', topic: 'Selenium Fundamentals', subtopic: 'Link audit',
      question: 'How do you count the links on a page and decide which links should be validated?',
      short: 'Use findElements for all anchor tags, filter empty/non-navigable links, then validate critical destinations with a safe HTTP or browser-level check.',
      answer: 'Counting every a tag is only inventory. Filter javascript, mailto, and empty href values; prioritise customer-facing links; and avoid opening destructive/logout links in a generic crawler.',
      code: 'List<WebElement> links = driver.findElements(By.tagName("a"));\nlong navigable = links.stream().map(link -> link.getAttribute("href"))\n  .filter(href -> href != null && href.startsWith("http")).count();\nSystem.out.println(navigable);',
      example: 'Run a link audit on static content pages as a separate, non-blocking health check.'
    },
    {
      section: 'framework-design', topic: 'Framework Architecture', subtopic: 'Configuration security',
      question: 'Why is keeping usernames and passwords in a properties file risky, and what is the safer approach?',
      short: 'Properties files are acceptable for non-secret configuration; credentials should come from a secret manager or CI credential store and never be committed.',
      answer: 'Separate configuration from secrets. Keep browser, base URL, and timeout values in versioned config, but inject credentials through environment variables, Jenkins credentials, Vault, or a cloud secret manager. Mask values in reports and logs.',
      example: 'In CI, map a credential-store entry into runtime environment variables and build the authenticated test state through an API or secure login helper.'
    },
    {
      section: 'framework-design', topic: 'Framework Architecture', subtopic: 'Excel data trade-offs',
      question: 'When is WorkbookFactory appropriate for Excel test data, and when should you choose another approach?',
      short: 'WorkbookFactory is convenient for small, controlled test data; for large datasets use streaming readers, APIs, CSV, or generated data to avoid memory and maintenance problems.',
      answer: 'Excel is a business-friendly input format but not a universal test-data store. Close files deterministically, validate headers and cell types, keep data versioned, and avoid loading large workbooks into every parallel test worker.',
      example: 'Use an API data builder for parallel regression tests and retain a small Excel file only where a business user owns the sample matrix.'
    },
    {
      section: 'manual-testing', topic: 'Manual Testing & SDLC', subtopic: 'Boundary test design',
      question: 'A text area accepts a maximum of 2,000 characters. Which test scenarios are essential?',
      short: 'Test 0, 1, 1,999, 2,000, and 2,001 characters, then add paste, multi-byte characters, whitespace, line breaks, accessibility, error text, and saved-data behaviour.',
      answer: 'Use boundary value analysis first, then test realistic input modes and downstream handling. Verify whether the product blocks extra characters or validates on submit, and check that the API/database contract has the same limit.',
      example: 'A 2,001-character pasted value should produce a clear, accessible validation result without losing valid content or corrupting the saved record.'
    },
    {
      section: 'test-design', topic: 'Test Case Design', subtopic: 'Message delivery scenarios',
      question: 'Design high-value test scenarios for a send-message screen with recipient number, message text, and Send button.',
      short: 'Cover recipient validity and permission, message boundaries and encoding, Send state, delivery result, retries, duplicates, offline behaviour, and privacy.',
      answer: 'Start from the user journey: valid recipient plus valid message. Add invalid/missing recipient, blocked or self recipient, empty/maximum text, Unicode and emoji, double taps, network failure, delivery acknowledgement, history, and data masking in logs.',
      example: 'For the Send button, verify disabled/enabled rules, one logical message per click, a clear pending state, and a safe retry after a transient error.'
    },
    {
      section: 'test-design', topic: 'Test Case Design', subtopic: 'Release decision scenario',
      question: 'How would you decide whether a glass tumbler is ready for release as a physical-product testing scenario?',
      short: 'Define intended use and safety risks, test dimensions/material/finish, perform risk-based drop and thermal tests, inspect defects, and make the release decision from acceptance criteria and evidence.',
      answer: 'Treat it like a product quality gate. Clarify customer use, safety regulations, load and temperature expectations, packaging, manufacturing variation, and defect severity. A release decision includes residual risk and traceable evidence—not only a pass count.',
      example: 'If a cosmetic scratch is acceptable but a sharp edge is not, severity and acceptance criteria must make that difference explicit.'
    },
    {
      section: 'test-design', topic: 'Test Case Design', subtopic: 'State-machine scenarios',
      question: 'What are five high-value test scenarios for an elevator or lift?',
      short: 'Cover normal floor travel, invalid/multiple requests, door obstruction, overload, emergency handling, and recovery after power or network interruption.',
      answer: 'Model the lift as a state machine. Validate allowed transitions between idle, moving, door opening, door open, and alarm states. Add safety rules: doors cannot move while open, overload prevents movement, and emergency controls override normal requests.',
      example: 'A request for a floor in the current direction should be queued predictably; an emergency stop should halt motion and record the event.'
    },
    {
      section: 'db-testing', topic: 'Database Testing', subtopic: 'Order and inventory consistency',
      question: 'How would you test a purchase flow where an invoice is created and inventory must be updated?',
      short: 'Validate the UI/API order outcome, invoice record, inventory reservation/decrement, payment state, idempotency, rollback on failure, and reconciliation across systems.',
      answer: 'Map the transaction boundaries and failure points. Test successful purchase, payment failure, duplicate submission, out-of-stock race, cancellation/refund, partial integration failure, and asynchronous event delays. Use correlation IDs to reconcile order, invoice, and inventory data.',
      example: 'For the same order request sent twice, the system must not create two invoices or decrement stock twice.'
    },
    {
      section: 'sql', topic: 'SQL', subtopic: 'Read vs write safety',
      question: 'Explain the difference between SELECT and UPDATE, including QA safety practices.',
      short: 'SELECT reads data; UPDATE changes existing rows. Before an UPDATE, use a SELECT with the same WHERE clause, use a transaction where appropriate, and verify affected-row count.',
      answer: 'A QA engineer should treat write queries as controlled changes. Use precise keys, a safe non-production environment, a transaction/rollback plan, and audit evidence. Never use broad UPDATE statements against shared data without a verified WHERE clause.',
      code: 'SELECT status FROM orders WHERE order_id = 101;\nUPDATE orders SET status = \'CANCELLED\' WHERE order_id = 101;\nSELECT status FROM orders WHERE order_id = 101;',
      example: 'For database validation, prefer SELECT queries; use UPDATE only for explicitly approved test-data setup or cleanup.'
    },
    {
      section: 'linux', topic: 'Linux Commands', subtopic: 'Process diagnosis',
      question: 'What does the Linux top command help you investigate during a test or CI incident?',
      short: 'top shows live CPU, memory, load, and process activity, helping you identify resource contention or a runaway process.',
      answer: 'Use top as a first diagnostic signal, then correlate with application, container, and CI logs. It does not prove root cause, but it can show whether a slow test run coincides with CPU saturation, memory pressure, or a specific process.',
      code: 'top\n# press P to sort by CPU, M to sort by memory, q to exit',
      example: 'When browser tests slow down on an agent, top can reveal orphaned browser processes consuming memory.'
    },
    {
      section: 'api-fundamentals', topic: 'API Testing', subtopic: 'Testing objective',
      question: 'What is the real goal of API testing beyond checking a 200 response?',
      short: 'Prove that the contract, business rules, security, error handling, performance expectations, and side effects are correct for consumers.',
      answer: 'Status code is only one signal. Validate request constraints, response schema and meaning, headers, authorization, negative paths, idempotency, persistence/events, observability, latency, and compatibility with real consumers.',
      example: 'A create-order API can return 200 while still creating the wrong tax value or emitting no inventory event—both are API defects.'
    },
    {
      section: 'api-testing', topic: 'API Testing', subtopic: 'Postman prerequisites',
      question: 'What are prerequisites in Postman and how should they be used safely?',
      short: 'Pre-request scripts prepare the request, such as generating a token, timestamp, signature, or dynamic test data before the API call runs.',
      answer: 'Keep pre-request logic small, deterministic, and visible. Store secrets in secure environments, never hard-code production credentials, and add tests that fail clearly when prerequisite token or data creation fails.',
      example: 'A collection can call a login endpoint in a pre-request script, store a short-lived token as an environment variable, and use it only for the current test run.'
    },
    {
      section: 'project-resume', topic: 'Project & Resume', subtopic: 'Automation selection',
      question: 'How do you choose P1, P2, and P3 test suites for automation and release execution?',
      short: 'Classify by business impact, failure likelihood, change frequency, execution cost, and required feedback speed—not by an arbitrary label alone.',
      answer: 'P1 covers revenue, security, login, payment, and critical customer workflows in fast CI smoke. P2 covers broader regression and key integrations. P3 covers lower-risk, infrequent, or expensive checks that run nightly or on demand. Revisit the classification after incidents and product changes.',
      example: 'A checkout payment smoke test belongs in P1; a rare report-export format can run nightly unless it recently caused production defects.'
    },
    {
      section: 'senior-scenarios', topic: 'Senior QA Scenarios', subtopic: 'Non-reproducible defect',
      question: 'How do you handle a high-impact issue that cannot currently be reproduced?',
      short: 'Preserve evidence, assess customer impact, narrow variables, add observability, seek correlation, and communicate the residual risk instead of closing it as invalid.',
      answer: 'Capture timestamps, user/session IDs, environment, build, logs, traces, network evidence, and frequency. Compare successful and failed paths, turn observations into hypotheses, add safe telemetry or a diagnostic flag, and decide mitigation or release risk with stakeholders.',
      example: 'For an intermittent payment error, correlate the request ID across gateway, application, and queue logs before changing test retries.'
    },
    {
      section: 'senior-scenarios', topic: 'Senior QA Scenarios', subtopic: 'Captcha boundaries',
      question: 'How should an automation team handle CAPTCHA in a test environment?',
      short: 'Do not automate or bypass a production CAPTCHA. Use a test-only bypass, provider sandbox keys, feature flag, or API-level setup approved by the product and security teams.',
      answer: 'CAPTCHA is designed to distinguish humans from bots, so a browser test should not attempt to defeat it. Make the testability requirement explicit: expose a controlled non-production switch, mock verification response, or authenticate through a supported service path.',
      example: 'Use a sandbox site key in test and retain the real CAPTCHA in production; verify the integration contract separately with provider-approved test credentials.'
    },
    {
      section: 'mock-interviews', topic: 'Mock Interviews', subtopic: 'Self-assessment',
      question: 'How should you answer “Rate yourself out of 10” for Java, Selenium, Linux, or framework work?',
      short: 'Give an honest range, immediately define the work you can independently deliver, name one growth area, and support it with a project example.',
      answer: 'Avoid saying ten unless you can defend deep design, debugging, and trade-off questions. A strong answer is: “I would rate myself 7. I can design and debug X independently, I have delivered Y, and I am strengthening Z.”',
      example: 'For Selenium: describe stable locator strategy, waits, Grid/parallel experience, framework ownership, and one concrete reliability improvement.'
    }
  ];

  var added = 0;
  items.forEach(function (item, index) {
    var target = defined_sections[item.section];
    if (!target || !target.questions || isDuplicate(item.question)) return;
    target.questions.push(interviewQuestion('CINT' + String(index + 1).padStart(3, '0'), item));
    added++;
  });

})();
