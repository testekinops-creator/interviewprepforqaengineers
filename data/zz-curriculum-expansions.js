/*
 * Senior QA curriculum expansion.
 * Loaded after the core data files so it can extend existing sections and
 * provide the sections represented in the final navigation.
 */
var defined_sections = defined_sections || {};

(function () {
  function question(id, category, topic, subtopic, prompt, answer, options) {
    options = options || {};
    return {
      id: id,
      category: category,
      topic: topic,
      subtopic: subtopic,
      question: prompt,
      whyAsked: options.whyAsked || 'Tests practical judgement expected from a senior QA/SDET candidate.',
      difficulty: options.difficulty || 3,
      importance: options.importance || 'important',
      interviewType: options.interviewType || 'Technical',
      thirtySecAnswer: answer,
      interviewAnswer: options.interviewAnswer || answer + '\n\nIn a senior interview, explain the decision, the trade-off, and a concrete project example rather than giving only a definition.',
      detailedExplanation: options.detailedExplanation || 'Cover the purpose, the implementation approach, failure modes, and the way you would measure success.',
      simpleExplanation: options.simpleExplanation || answer,
      realWorldExample: options.realWorldExample || 'Use a real feature, production incident, or CI pipeline from your own project when answering.',
      projectExample: options.projectExample || 'State the context, your action, and the measurable outcome for a credible senior-level answer.',
      codeCommand: options.codeCommand || 'N/A',
      expectedOutput: options.expectedOutput || 'N/A',
      followUpQ: options.followUpQ || 'What risks or edge cases would you validate?',
      followUpA: options.followUpA || 'Call out data isolation, synchronization, negative paths, observability, and cleanup where applicable.',
      seniorFollowUpQ: options.seniorFollowUpQ || 'How would you scale or govern this across multiple teams?',
      seniorFollowUpA: options.seniorFollowUpA || 'Standardize the approach, make it observable in CI, publish ownership, and track a small set of quality metrics.',
      commonMistake: options.commonMistake || 'Giving a definition without describing how it is applied or verified.',
      bestPractice: options.bestPractice || 'Connect the answer to risk, maintainability, and a measurable quality outcome.'
    };
  }

  function addTo(sectionKey, items) {
    if (!defined_sections[sectionKey]) {
      throw new Error('Missing base section: ' + sectionKey);
    }
    defined_sections[sectionKey].questions = defined_sections[sectionKey].questions || [];
    defined_sections[sectionKey].questions.push.apply(defined_sections[sectionKey].questions, items);
  }

  function addSection(key, title, description, items) {
    defined_sections[key] = { title: title, description: description, questions: items };
  }

  // Manual testing: make the complete senior QA foundation explicit.
  addTo('manual-testing', [
    question('CURMT001', 'Manual Testing', 'Testing Fundamentals', 'Purpose and quality', 'What is software testing, and what is the QA role beyond finding defects?', 'Testing provides evidence about product risk and fitness for use. QA prevents defects early, validates behaviour, communicates risk, and supports an informed release decision.', { importance: 'must', difficulty: 2 }),
    question('CURMT002', 'Manual Testing', 'Testing Types & Levels', 'Functional and non-functional', 'How do functional and non-functional testing differ?', 'Functional testing validates what the system does; non-functional testing evaluates qualities such as performance, security, usability, reliability, and compatibility.', { importance: 'must' }),
    question('CURMT003', 'Manual Testing', 'Testing Types & Levels', 'Smoke, sanity, regression, retesting', 'Differentiate smoke testing, sanity testing, regression testing, and retesting.', 'Smoke checks whether a build is stable enough for deeper testing. Sanity checks a focused change. Retesting verifies a specific defect fix. Regression checks that existing behaviour still works after change.', { importance: 'must', difficulty: 2 }),
    question('CURMT004', 'Manual Testing', 'Testing Types & Levels', 'Levels', 'Explain unit, integration, system, end-to-end, and UAT testing.', 'They move from isolated code to component interaction, the complete system, business workflows across systems, and final business acceptance by users or product owners.', { importance: 'must' }),
    question('CURMT005', 'Manual Testing', 'Testing Types & Levels', 'Exploratory and ad-hoc', 'When would you use exploratory testing instead of scripted testing?', 'Use exploratory testing when learning the product, investigating risk, validating unclear requirements, or looking for defects that fixed scripts are unlikely to expose. Time-box it and document charters and findings.', { importance: 'important' }),
    question('CURMT006', 'Manual Testing', 'Test Planning & Strategy', 'Planning', 'What belongs in a test plan and test strategy?', 'Define scope, objectives, risks, approach, environments, data, roles, schedule, entry and exit criteria, deliverables, metrics, and escalation paths. Strategy explains the high-level risk-based approach; the plan applies it to a release.', { importance: 'must', difficulty: 4 }),
    question('CURMT007', 'Manual Testing', 'Traceability', 'RTM', 'What is an RTM and how do you use it in a release?', 'A Requirements Traceability Matrix maps requirements to tests, defects, and execution status. It reveals coverage gaps, supports impact analysis, and provides traceable release evidence.', { importance: 'must', difficulty: 3 }),
    question('CURMT008', 'Manual Testing', 'Entry & Exit Criteria', 'Release readiness', 'Give practical entry and exit criteria for system testing.', 'Entry criteria can include approved requirements, deployable build, stable environment, test data, and reviewed cases. Exit criteria can include execution completion, no open blocker or critical defects, agreed pass rate, acceptable risk, and stakeholder sign-off.', { importance: 'must', difficulty: 3 }),
    question('CURMT009', 'Manual Testing', 'Risk-Based Testing', 'Prioritization', 'How do you prioritize testing when time is limited?', 'Rank scope by business impact, likelihood of failure, change size, integration complexity, production history, and detectability. Test critical user journeys and high-risk integrations first, then communicate residual risk explicitly.', { importance: 'must', difficulty: 4 }),
    question('CURMT010', 'Manual Testing', 'Metrics & Coverage', 'Quality signals', 'Which test metrics are useful, and which can be misleading?', 'Use requirement coverage, execution progress, pass/fail trend, defect severity and aging, leakage, automation health, and risk coverage. Avoid treating raw test-case count or pass percentage as proof of quality without context.', { importance: 'senior', difficulty: 4 }),
    question('CURMT011', 'Manual Testing', 'Requirement Analysis', 'Testability', 'How do you identify an untestable requirement during refinement?', 'Look for vague language, missing rules, absent error handling, unclear ownership, no measurable acceptance criteria, unavailable data, or an undefined observable outcome. Convert ambiguity into examples and testable acceptance criteria.', { importance: 'must', difficulty: 3 }),
    question('CURMT012', 'Manual Testing', 'Production & Release Testing', 'Shift-right', 'What is your production or release-testing approach?', 'Use pre-release smoke checks, feature flags or canaries, monitoring, synthetic checks, rollback readiness, and a focused post-deploy validation. Production testing must protect customers and data while giving fast evidence of release health.', { importance: 'senior', difficulty: 4 })
  ]);

  addSection('sdlc-stlc', 'SDLC & STLC', 'Testing lifecycle, quality gates, and how QA works throughout delivery.', [
    question('CURSL001', 'Manual Testing', 'SDLC & STLC', 'STLC phases', 'Walk through the STLC phases and the output of each phase.', 'Requirement analysis produces test conditions; planning produces the plan and estimates; design produces cases and data; environment setup enables execution; execution produces evidence and defects; closure produces the summary and improvement actions.', { importance: 'must' }),
    question('CURSL002', 'Manual Testing', 'SDLC & STLC', 'QA involvement', 'How does QA contribute in each SDLC phase?', 'QA clarifies testability in requirements, reviews design for risk, prepares tests during development, validates integrations before release, and analyzes incidents and metrics after release.', { importance: 'must', difficulty: 3 }),
    question('CURSL003', 'Manual Testing', 'SDLC & STLC', 'Definition of Ready and Done', 'How do Definition of Ready and Definition of Done improve quality?', 'Ready prevents unclear work from entering a sprint; Done makes quality activities explicit, such as code review, tests, documentation, accessibility, and deployment evidence.', { importance: 'important' }),
    question('CURSL004', 'Manual Testing', 'SDLC & STLC', 'Release testing', 'How do you create a release test strategy for a high-risk change?', 'Start from the change impact and failure modes, define a layered test approach, isolate data and environments, establish quality gates, prepare rollback, and agree the residual risk with stakeholders.', { importance: 'senior', difficulty: 4 })
  ]);

  addTo('test-design', [
    question('CURTD001', 'Test Design', 'Test Design Techniques', 'Pairwise testing', 'What is pairwise testing and when is it useful?', 'Pairwise testing selects cases so every pair of input values is exercised at least once. It reduces combinations while finding many interaction defects; use it for configuration-heavy features, then add targeted risk cases.', { importance: 'must', difficulty: 3 }),
    question('CURTD002', 'Test Design', 'Test Design Techniques', 'Cause-effect graph', 'What is a cause-effect graph and how does it help test design?', 'It models logical relationships between input conditions and outcomes, then derives a decision table. It is valuable when multiple business rules, dependencies, and combinations drive an outcome.', { importance: 'important', difficulty: 3 }),
    question('CURTD003', 'Test Design', 'Test Data Design', 'Positive and negative tests', 'How do you balance positive, negative, and boundary test data?', 'Start with valid business flows, then cover invalid, missing, malformed, duplicate, boundary, permission, state, and concurrency data. Tie each data set back to a rule and risk.', { importance: 'must' }),
    question('CURTD004', 'Test Design', 'Risk-Based Design', 'Minimum tests, maximum coverage', 'How do you obtain maximum risk coverage with a small test suite?', 'Combine equivalence partitions, boundaries, decision tables, pairwise coverage, production defect history, and critical-path scenarios. Remove duplicate cases only after proving the remaining cases still cover distinct risks.', { importance: 'senior', difficulty: 4 })
  ]);

  // Selenium: expose browser handling as a first-class section and cover advanced gaps.
  addSection('selenium-browser-handling', 'Selenium WebElements & Browser Handling', 'Practical WebElement, browser, window, upload, download, table, and calendar handling.', [
    question('CURSE001', 'Selenium', 'WebElements', 'Element state', 'How do you determine whether a WebElement is displayed, enabled, and selected?', 'Use isDisplayed(), isEnabled(), and isSelected() after waiting for the relevant condition. Do not confuse presence in the DOM with being visible or ready for interaction.', { importance: 'must', codeCommand: 'WebElement save = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("save")));\nassertTrue(save.isEnabled());' }),
    question('CURSE002', 'Selenium', 'Browser Handling', 'Dropdowns', 'How do you automate standard and custom dropdowns?', 'Use Select only for a real HTML select element. For custom dropdowns, click the control, wait for the option list, and select by a stable locator or visible text.', { importance: 'must' }),
    question('CURSE003', 'Selenium', 'Browser Handling', 'Alerts', 'How do you handle JavaScript alerts, confirms, and prompts?', 'Wait for alertIsPresent(), switch to the Alert, read text, accept or dismiss it, and send keys only for prompts. Browser-native alerts are outside the DOM.', { importance: 'must' }),
    question('CURSE004', 'Selenium', 'Browser Handling', 'Frames and iframes', 'What is the safe pattern for working with iframes?', 'Wait for the frame, switch into it, interact with its DOM, and always switch back to defaultContent() before locating elements outside it.', { importance: 'must' }),
    question('CURSE005', 'Selenium', 'Browser Handling', 'Windows and tabs', 'How do you safely switch between windows or tabs?', 'Capture the original handle, wait for the expected handle count, identify the target handle rather than assuming order, switch to it, and return to the original handle when finished.', { importance: 'must', difficulty: 3 }),
    question('CURSE006', 'Selenium', 'Browser Handling', 'Actions and keyboard', 'When do you use the Actions class?', 'Use Actions for hover, drag-and-drop, context click, composite key presses, and other low-level interactions. Build and perform the action only after the target is visible and stable.', { importance: 'important' }),
    question('CURSE007', 'Selenium', 'Web Data', 'Dynamic tables', 'How do you validate a dynamic web table?', 'Locate rows by stable identifiers or column headers, wait for data to load, normalize cell text, and assert row-level business rules rather than brittle row indexes.', { importance: 'important', difficulty: 3 }),
    question('CURSE008', 'Selenium', 'Browser Handling', 'Calendar and date picker', 'How do you automate a date picker reliably?', 'Prefer direct input only when the control permits it. Otherwise navigate month/year intentionally, use accessible labels or data attributes for the date, and verify the selected value in the form.', { importance: 'important' }),
    question('CURSE009', 'Selenium', 'Browser Handling', 'Upload and download', 'How do you test file upload and download?', 'Upload by sending an absolute file path to an input type=file. For downloads, configure the browser download directory, wait for the final file rather than a temporary extension, and validate name, size, and content.', { importance: 'must', difficulty: 3 }),
    question('CURSE010', 'Selenium', 'Browser Handling', 'Shadow DOM', 'How do you locate elements inside Shadow DOM?', 'Use Selenium 4 getShadowRoot() for open shadow roots, then locate elements from that root. Closed shadow roots require an application-supported test hook or a different validation strategy.', { importance: 'important', difficulty: 3 })
  ]);

  addTo('selenium-fundamentals', [
    question('CURSE011', 'Selenium', 'Fundamentals', 'Grid and RemoteWebDriver', 'When would you choose Selenium Grid and RemoteWebDriver?', 'Use them for distributed, parallel, cross-browser execution. Tests send capabilities to a remote Grid endpoint, which schedules isolated browser sessions on available nodes or containers.', { importance: 'must', difficulty: 4 }),
    question('CURSE012', 'Selenium', 'Fundamentals', 'Limitations', 'What are Selenium limitations compared with Playwright?', 'Selenium relies on WebDriver and requires more manual synchronization and browser setup. It does not natively provide Playwright-style auto-waiting, isolated browser contexts, tracing, or first-class network interception, though it remains strong for broad browser and language support.', { importance: 'important', difficulty: 3 })
  ]);

  addTo('selenium-advanced', [
    question('CURSE013', 'Selenium', 'Advanced Selenium', 'Browser options', 'How do browser options make tests stable in CI?', 'Centralize ChromeOptions or FirefoxOptions in DriverFactory for window size, headless mode, download behavior, certificates, logging, proxies, and environment-specific flags. Keep options versioned and minimal.', { importance: 'must', difficulty: 3 }),
    question('CURSE014', 'Selenium', 'Advanced Selenium', 'Parallel execution', 'What must be in place before enabling parallel Selenium execution?', 'Use a ThreadLocal driver, isolated test data, independent tests, unique downloads and reports, capacity-aware Grid configuration, and correct teardown. Add parallelism gradually while tracking flaky rate.', { importance: 'must', difficulty: 4 })
  ]);

  addTo('selenium-exceptions', [
    question('CURSE015', 'Selenium', 'Exceptions', 'Cause, example, solution, prevention', 'How do you explain and prevent NoSuchWindowException, NoSuchFrameException, SessionNotCreatedException, and WebDriverException?', 'NoSuchWindow/Frame means the target context is absent or no longer active: wait and switch deliberately. SessionNotCreated usually means driver, browser, capability, or Grid incompatibility: pin compatible versions and inspect Grid logs. WebDriverException is a wrapper: capture the command, browser logs, and environment evidence before fixing.', { importance: 'must', difficulty: 4, bestPractice: 'For every exception, answer in the same sequence: cause, reproducible example, immediate fix, and preventive framework guardrail.' })
  ]);

  addTo('selenium-browser-handling', [
    question('CURSE016', 'Selenium', 'Web Tables', 'Static and dynamic data', 'How do you create stable Selenium checks for web tables?', 'Treat a web table as data: wait for the loading state to finish, find the target row by a business key, locate the intended column by header or stable attribute, normalize the cell value, and validate the rule. Avoid row-number assumptions.', { importance: 'must', difficulty: 3 }),
    question('CURSE017', 'Selenium', 'File Upload and File Download', 'Browser file transfer', 'What is the robust approach to Selenium file upload and file download validation?', 'For file upload, send an absolute path to the input type=file element. For file download, configure a test-specific download folder, wait until temporary download extensions disappear, and validate the final file name, size, and contents.', { importance: 'must', difficulty: 3 })
  ]);

  addTo('testng', [
    question('CURTN001', 'TestNG', 'TestNG', 'Invocation count and dependencies', 'How do invocationCount, priority, groups, and dependsOnMethods work together?', 'invocationCount repeats a test, priority influences ordering, groups select suites, and dependsOnMethods prevents a dependent test from running when its prerequisite fails. Use them sparingly; independent tests are easier to parallelize and diagnose.', { importance: 'must', difficulty: 3 }),
    question('CURTN002', 'TestNG', 'TestNG', 'Soft vs Hard Assert', 'Compare a soft assertion with a hard assertion.', 'A hard assertion stops the current test at the first failure. A soft assertion records failures and continues until assertAll() reports them. Use soft assertions for independent checks on one screen, but do not continue after a failed precondition.', { importance: 'must', difficulty: 3 })
  ]);

  addTo('docker-cloud', [
    question('CURDC001', 'DevOps & Tools', 'Docker & Cloud', 'Cloud testing', 'How do BrowserStack and Sauce Labs fit into a cross-browser strategy?', 'They provide managed remote browser and device infrastructure. Run a risk-based matrix across key browsers, operating systems, and devices; upload CI artifacts, keep credentials in a secret store, and control cost by using local containers for routine feedback.', { importance: 'important', difficulty: 3 })
  ]);

  // Java: the curriculum explicitly exposes advanced collection and coding coverage.
  addTo('java-core', [
    question('CURJV001', 'Java', 'Core & OOP', 'this, super, static, final', 'Explain this, super, static, and final using a test automation framework.', 'this refers to the current object, super accesses parent members, static belongs to the class, and final prevents reassignment, overriding, or inheritance depending on use. In frameworks, use static sparingly for immutable constants and managed singletons.', { importance: 'must' }),
    question('CURJV002', 'Java', 'Core & OOP', 'Overloading and overriding', 'Differentiate method overloading and overriding.', 'Overloading uses the same method name with different parameters and is resolved at compile time. Overriding replaces an inherited method with the same signature and is resolved at runtime through polymorphism.', { importance: 'must', difficulty: 2 })
  ]);

  addTo('java-collections', [
    question('CURJV003', 'Java', 'Collections', 'List, Set, Map', 'How do ArrayList, LinkedList, HashSet, LinkedHashSet, TreeSet, HashMap, LinkedHashMap, and TreeMap differ?', 'Choose based on ordering, duplication, lookup, and sorting needs: ArrayList is general-purpose indexed storage; LinkedList favors end insertion/removal; sets remove duplicates; linked variants preserve insertion order; tree variants sort; maps store key-value pairs with the same ordering choices.', { importance: 'must', difficulty: 3 }),
    question('CURJV004', 'Java', 'Collections', 'Iterator and comparison', 'When do you use Iterator, Comparable, and Comparator?', 'Iterator supports safe traversal and removal. Comparable defines an object\'s natural order in the class; Comparator supplies external or multiple sorting strategies. Use Comparator.comparing for readable test-data sorting.', { importance: 'must', difficulty: 3 })
  ]);

  addTo('java-strings', [
    question('CURJV005', 'Java', 'Strings & Exceptions', 'String mutability', 'Compare String, StringBuilder, StringBuffer, ==, and equals().', 'String is immutable; StringBuilder is mutable and fast for single-threaded concatenation; StringBuffer is synchronized and usually slower. == compares references; equals() compares content when implemented by the class.', { importance: 'must', difficulty: 2 }),
    question('CURJV006', 'Java', 'Strings & Exceptions', 'Custom exceptions', 'How do checked, unchecked, throw, throws, and custom exceptions fit together?', 'Checked exceptions must be handled or declared; unchecked exceptions extend RuntimeException. throw creates an exception; throws declares a possible exception. Use a custom exception when callers need a meaningful, domain-specific failure contract.', { importance: 'important', difficulty: 3 })
  ]);

  var codingChallenges = [
    ['CURJC008', 'Reverse String', 'Write a Java program to reverse a string.', 'Use StringBuilder.reverse() for concise code, or swap characters in a char array when the interviewer asks for manual logic.', 'return new StringBuilder(input).reverse().toString();'],
    ['CURJC009', 'Reverse Number', 'Write a Java program to reverse an integer.', 'Repeatedly take the last digit with modulo 10 and build the result; consider overflow for production code.', 'int rev = 0; while (n != 0) { rev = rev * 10 + n % 10; n /= 10; } return rev;'],
    ['CURJC010', 'Palindrome', 'Check whether a string is a palindrome.', 'Normalize case and unwanted characters, then compare characters from both ends or compare with the reversed value.', 'String s = input.replaceAll("[^A-Za-z0-9]", "").toLowerCase(); return s.equals(new StringBuilder(s).reverse().toString());'],
    ['CURJC011', 'Prime Number', 'Check whether a number is prime.', 'Reject values below two, then test divisors only through the square root.', 'if (n < 2) return false; for (int i = 2; i * i <= n; i++) if (n % i == 0) return false; return true;'],
    ['CURJC012', 'Factorial', 'Calculate factorial safely.', 'Use an iterative loop for normal interview inputs; use BigInteger if the input can exceed long range.', 'long result = 1; for (int i = 2; i <= n; i++) result *= i; return result;'],
    ['CURJC013', 'Armstrong Number', 'Check whether a number is an Armstrong number.', 'Sum each digit raised to the number of digits and compare the result with the original.', 'int original = n, sum = 0, digits = String.valueOf(n).length(); while (n > 0) { int d = n % 10; sum += (int) Math.pow(d, digits); n /= 10; } return sum == original;'],
    ['CURJC014', 'Duplicate Characters', 'Find duplicate characters in a string.', 'Count characters in a LinkedHashMap to preserve input order, then print entries with a count greater than one.', 'Map<Character,Integer> m = new LinkedHashMap<>(); for (char c : s.toCharArray()) m.merge(c, 1, Integer::sum); m.entrySet().stream().filter(e -> e.getValue() > 1).forEach(System.out::println);'],
    ['CURJC015', 'Duplicate Numbers', 'Find duplicate numbers in an array.', 'Use a HashSet for seen values and a second set for duplicates, which keeps the solution O(n).', 'Set<Integer> seen = new HashSet<>(), dup = new LinkedHashSet<>(); for (int x : arr) if (!seen.add(x)) dup.add(x); return dup;'],
    ['CURJC016', 'Character Count', 'Count the frequency of each character.', 'Build a frequency map and decide whether spaces and case should be normalized before counting.', 'Map<Character,Long> counts = s.chars().mapToObj(c -> (char)c).collect(Collectors.groupingBy(c -> c, LinkedHashMap::new, Collectors.counting()));'],
    ['CURJC017', 'Word Count', 'Count words in a sentence.', 'Trim input and split on one-or-more whitespace characters; return zero for blank input.', 'return s == null || s.trim().isEmpty() ? 0 : s.trim().split("\\\\s+").length;'],
    ['CURJC018', 'Largest and Smallest', 'Find the largest and smallest value in an array.', 'Traverse once, updating min and max, and reject an empty input.', 'int min = arr[0], max = arr[0]; for (int x : arr) { min = Math.min(min, x); max = Math.max(max, x); }'],
    ['CURJC019', 'Sorting', 'Sort an array without mutating the input.', 'Copy the input first, then use Arrays.sort; explain comparator-based sorting for objects.', 'int[] copy = Arrays.copyOf(arr, arr.length); Arrays.sort(copy); return copy;'],
    ['CURJC020', 'Remove Duplicates', 'Remove duplicates while preserving array order.', 'Use LinkedHashSet when order matters, then convert back to a list or array.', 'return new ArrayList<>(new LinkedHashSet<>(numbers));'],
    ['CURJC021', 'Array Comparison', 'Compare two arrays for equality and for the same elements in any order.', 'Use Arrays.equals for sequence equality. For order-independent comparison, sort copies or compare frequency maps.', 'return Arrays.equals(first, second);'],
    ['CURJC022', 'Missing Number', 'Find one missing number in a sequence from 1 to n.', 'Use the expected arithmetic sum minus the actual sum, using long to avoid overflow.', 'long expected = (long)n * (n + 1) / 2; long actual = 0; for (int x : arr) actual += x; return (int)(expected - actual);'],
    ['CURJC023', 'Even or Odd', 'Determine whether a number is even or odd.', 'Use modulo or a bitwise check; handle negative values exactly the same way.', 'return (n & 1) == 0 ? "even" : "odd";'],
    ['CURJC024', 'Swap Numbers', 'Swap two numbers without a temporary variable.', 'In an interview, prefer the readable temporary-variable approach; explain XOR or arithmetic only as alternatives with trade-offs.', 'int temp = a; a = b; b = temp;'],
    ['CURJC025', 'Reverse Words', 'Reverse the words in a sentence.', 'Trim, split on whitespace, iterate backward, and join with a single space.', 'String[] words = s.trim().split("\\\\s+"); Collections.reverse(Arrays.asList(words)); return String.join(" ", words);'],
    ['CURJC026', 'Frequency with HashMap', 'Return the most frequent number in an array.', 'Count with HashMap, then choose the entry with the largest value while defining a deterministic tie breaker.', 'Map<Integer,Integer> m = new HashMap<>(); for (int x : arr) m.merge(x, 1, Integer::sum); return Collections.max(m.entrySet(), Map.Entry.comparingByValue()).getKey();'],
    ['CURJC027', 'Two Sum', 'Find two indexes whose values sum to a target.', 'Store each value\'s index in a map and look up target minus value in O(n).', 'Map<Integer,Integer> seen = new HashMap<>(); for (int i = 0; i < a.length; i++) { Integer j = seen.get(target - a[i]); if (j != null) return new int[]{j, i}; seen.put(a[i], i); } return new int[0];'],
    ['CURJC028', 'Move Zeros', 'Move all zeros to the end of an array in-place.', 'Use a write pointer to compact non-zero values, then fill the remainder with zeros.', 'int write = 0; for (int x : a) if (x != 0) a[write++] = x; while (write < a.length) a[write++] = 0;'],
    ['CURJC029', 'Balanced Brackets', 'Validate whether brackets are balanced.', 'Push opening brackets onto a stack and ensure each closing bracket matches the most recent opening bracket.', 'Deque<Character> st = new ArrayDeque<>(); for (char c : s.toCharArray()) { if ("([{ ".indexOf(c) >= 0) st.push(c); else if (c == \')\' && (st.isEmpty() || st.pop() != \'(\')) return false; } return st.isEmpty();'],
    ['CURJC030', 'First Non-Repeated Character', 'Find the first non-repeated character.', 'Count in a LinkedHashMap and return the first character with frequency one.', 'Map<Character,Integer> m = new LinkedHashMap<>(); for (char c : s.toCharArray()) m.merge(c, 1, Integer::sum); return m.entrySet().stream().filter(e -> e.getValue() == 1).map(Map.Entry::getKey).findFirst();'],
    ['CURJC031', 'Common Array Elements', 'Find common elements from two arrays.', 'Put one array in a HashSet, scan the other, and use a result set if duplicates should be removed.', 'Set<Integer> left = Arrays.stream(a).boxed().collect(Collectors.toSet()); return Arrays.stream(b).filter(left::contains).boxed().collect(Collectors.toSet());'],
    ['CURJC032', 'Merge Sorted Arrays', 'Merge two sorted arrays.', 'Use two pointers and append the smaller current value until both arrays are exhausted.', 'int i=0,j=0,k=0; while(i<a.length && j<b.length) out[k++] = a[i] <= b[j] ? a[i++] : b[j++]; while(i<a.length) out[k++]=a[i++]; while(j<b.length) out[k++]=b[j++];'],
    ['CURJC033', 'Binary Search', 'Implement binary search on a sorted array.', 'Maintain low and high pointers, calculate mid without overflow, and discard the impossible half each iteration.', 'int low=0, high=a.length-1; while(low<=high){ int mid=low+(high-low)/2; if(a[mid]==target)return mid; if(a[mid]<target)low=mid+1; else high=mid-1; } return -1;'],
    ['CURJC034', 'Longest Word', 'Find the longest word in a sentence.', 'Split normalized input and retain the longest candidate; define the tie breaker before coding.', 'return Arrays.stream(s.trim().split("\\\\s+")).max(Comparator.comparingInt(String::length)).orElse("");'],
    ['CURJC035', 'String Rotation', 'Check whether one string is a rotation of another.', 'Strings are rotations when they have equal length and the second appears in first plus first.', 'return a != null && a.length() == b.length() && (a + a).contains(b);'],
    ['CURJC036', 'Stream API', 'Find the second-highest distinct number with Stream API.', 'Use distinct, sort in reverse order, skip the highest value, and handle a missing result.', 'return Arrays.stream(a).boxed().distinct().sorted(Comparator.reverseOrder()).skip(1).findFirst();'],
    ['CURJC037', 'Stream API', 'Group employees by department using Stream API.', 'Use Collectors.groupingBy and choose whether the result should contain whole objects, names, or counts.', 'Map<String,List<Employee>> byDept = employees.stream().collect(Collectors.groupingBy(Employee::getDepartment));'],
    ['CURJC038', 'Stream API', 'Filter and transform test data using Stream API.', 'Filter by the business rule, map to the needed field, and collect into a deterministic collection.', 'List<String> activeIds = users.stream().filter(User::isActive).map(User::getId).sorted().toList();'],
    ['CURJC039', 'Comparator', 'Sort product objects by price then name.', 'Use Comparator.comparing with thenComparing; do not subtract numeric values in a comparator because it can overflow.', 'products.sort(Comparator.comparing(Product::getPrice).thenComparing(Product::getName));'],
    ['CURJC040', 'Exception Handling', 'Write a retry wrapper that preserves the original exception.', 'Retry only transient operations, use a bounded attempt count and backoff, and rethrow the final exception with context.', 'for (int attempt=1; attempt<=3; attempt++) { try { return action.get(); } catch (RuntimeException e) { if (attempt == 3) throw e; } }']
  ];

  addTo('java-coding', codingChallenges.map(function (item) {
    return question(item[0], 'Java Coding', item[1], 'Coding Program', item[2], item[3], {
      importance: 'must',
      interviewType: 'Coding Round',
      difficulty: 3,
      codeCommand: item[4],
      expectedOutput: 'Correct result for normal, boundary, duplicate, null, and empty-input cases as applicable.',
      bestPractice: 'State time and space complexity, then test the edge cases before finishing the solution.'
    });
  }));

  // Framework: make each frequently asked architecture topic navigable.
  addTo('framework-design', [
    question('CURFW001', 'Framework', 'Framework Design', 'Driver Factory', 'What responsibilities belong in a DriverFactory?', 'It creates and disposes browser sessions, applies browser and environment options, exposes a thread-safe driver accessor, and keeps WebDriver lifecycle out of tests and pages.', { importance: 'must', difficulty: 4 }),
    question('CURFW002', 'Framework', 'Framework Design', 'Configuration and environments', 'How do you manage environment configuration safely?', 'Use versioned defaults plus environment variables or secret stores for credentials. Validate configuration at startup, keep environments selectable, and never commit secrets to source control.', { importance: 'must', difficulty: 4 }),
    question('CURFW003', 'Framework', 'Framework Design', 'Test data management', 'How do you manage Excel, CSV, JSON, and API-generated test data?', 'Choose JSON or typed builders for versioned structured data, CSV for simple tabular inputs, Excel only where business users need it, and API/database setup for isolated mutable data. Keep data ownership and cleanup explicit.', { importance: 'must', difficulty: 4 }),
    question('CURFW004', 'Framework', 'Framework Design', 'Flaky test management', 'What framework features reduce flaky tests?', 'Central waits, stable locators, isolated data, deterministic cleanup, retries only with diagnostics, screenshots and logs on failure, and trend reporting. A retry is a signal, not a fix.', { importance: 'senior', difficulty: 4 })
  ]);

  addSection('pom-design', 'POM & Design Patterns', 'Page Object Model, reusable components, and the patterns that keep automation maintainable.', [
    question('CURPD001', 'Framework', 'POM & Patterns', 'Page Object Model', 'What belongs in a Page Object and what does not?', 'A Page Object owns locators and reusable business-oriented interactions for one page or component. Assertions about business outcomes and test flow belong in tests; environment setup belongs in fixtures or base classes.', { importance: 'must', difficulty: 3 }),
    question('CURPD002', 'Framework', 'POM & Patterns', 'Page Factory', 'What are the benefits and risks of PageFactory?', 'PageFactory provides concise lazy element initialization, but hidden proxies can make waits and stale elements harder to reason about. Modern teams often prefer explicit By locators and controlled waits.', { importance: 'important', difficulty: 3 }),
    question('CURPD003', 'Framework', 'POM & Patterns', 'Factory pattern', 'Where is Factory Pattern useful in automation?', 'Use it to choose browser, environment client, or test-data implementation from configuration without scattering conditional creation logic through tests.', { importance: 'important' }),
    question('CURPD004', 'Framework', 'POM & Patterns', 'Singleton pattern', 'When is Singleton appropriate and dangerous in a test framework?', 'It can suit immutable configuration or a controlled report manager, but it is dangerous for WebDriver or mutable shared state in parallel tests. Prefer dependency injection or ThreadLocal for per-test resources.', { importance: 'must', difficulty: 4 }),
    question('CURPD005', 'Framework', 'POM & Patterns', 'Builder and Strategy', 'How do Builder and Strategy patterns improve test automation?', 'Builder creates readable complex test data; Strategy swaps behavior such as authentication, payment, browser setup, or environment policy without nested if-else logic.', { importance: 'important', difficulty: 3 }),
    question('CURPD006', 'Framework', 'POM & Patterns', 'Utilities and separation', 'How do you stop a utility class from becoming a framework dumping ground?', 'Give utilities a narrow, stateless purpose. Move domain operations to pages or clients, lifecycle work to fixtures, and shared policies to dedicated services. Enforce this in code reviews.', { importance: 'senior', difficulty: 4 })
  ]);

  addSection('data-driven', 'Data-Driven Framework', 'Data sources, parameterization, and maintainable data-driven test execution.', [
    question('CURDD001', 'Framework', 'Data-Driven', 'DataProvider', 'How do you design a TestNG DataProvider for maintainability?', 'Keep it close to the test contract, return typed or clearly named values, validate data shape early, and avoid sharing mutable objects between parallel invocations.', { importance: 'must', difficulty: 3 }),
    question('CURDD002', 'Framework', 'Data-Driven', 'Data source choice', 'When would you choose JSON, CSV, Excel, a database, or an API for test data?', 'Use JSON for nested versioned data, CSV for simple tables, Excel for business-maintained inputs, database fixtures for controlled integration states, and APIs for fast independent setup. Choose based on ownership and isolation.', { importance: 'must', difficulty: 3 }),
    question('CURDD003', 'Framework', 'Data-Driven', 'Data isolation', 'How do you make data-driven tests safe in parallel?', 'Generate unique identifiers, avoid shared mutable accounts, create data per test via API where possible, track generated resources, and clean them up deterministically.', { importance: 'must', difficulty: 4 })
  ]);

  addSection('hybrid-framework', 'Hybrid Framework', 'Combining POM, data-driven testing, utilities, reporting, and CI without coupling them.', [
    question('CURHF001', 'Framework', 'Hybrid Framework', 'Architecture', 'What is a hybrid automation framework?', 'It combines complementary approaches—usually POM for UI abstraction, data-driven tests for variation, reusable services/utilities for cross-cutting work, and reporting/CI for feedback—while preserving clear responsibilities.', { importance: 'must', difficulty: 3 }),
    question('CURHF002', 'Framework', 'Hybrid Framework', 'Trade-offs', 'What trade-offs do you manage in a hybrid framework?', 'Flexibility can become overengineering. Keep the smallest useful set of abstractions, publish conventions, and remove patterns that are not solving an active maintenance or scale problem.', { importance: 'senior', difficulty: 4 }),
    question('CURHF003', 'Framework', 'Hybrid Framework', 'Migration', 'How would you migrate a brittle script suite into a hybrid framework?', 'Start with a vertical slice: central configuration, driver lifecycle, one reusable page/client, stable data setup, and reporting. Migrate high-value flows first while retaining a working regression baseline.', { importance: 'senior', difficulty: 4 })
  ]);

  addSection('framework-operations', 'Reporting, Logging & CI', 'Operational framework capabilities: observability, retries, parallelism, and CI quality gates.', [
    question('CUROP001', 'Framework', 'Reporting & Logging', 'Failure evidence', 'What information must a failed automated test report contain?', 'Include test name and parameters, environment and build details, exception and stack trace, screenshot or video where useful, page source, browser/network logs, timing, owner, and a link to the relevant CI run.', { importance: 'must', difficulty: 3 }),
    question('CUROP002', 'Framework', 'Reporting & Logging', 'Retry policy', 'How should a retry mechanism work?', 'Retry only classified transient failures, cap attempts, record every attempt, preserve first-failure evidence, and flag a passed-after-retry test as unstable. Never use retries to hide deterministic product defects.', { importance: 'must', difficulty: 4 }),
    question('CUROP003', 'Framework', 'CI/CD', 'Quality gates', 'What quality gates would you add to a pull-request pipeline?', 'Run compilation, static checks, unit tests, API/contract tests, a small stable UI smoke suite, and security checks appropriate to the product. Publish results quickly and keep longer regression work asynchronous but visible.', { importance: 'senior', difficulty: 4 })
  ]);

  // Playwright: existing content is retained, while the missing sections become first-class.
  addSection('pw-locators', 'Playwright Locators & Actions', 'User-facing locators, locator chaining, auto-waiting, and reliable actions.', [
    question('CURPW001', 'Playwright', 'Locators & Actions', 'User-facing locators', 'Why should getByRole, getByLabel, getByText, and getByPlaceholder be preferred?', 'They align tests with accessible user-facing semantics and are less coupled to styling than CSS or XPath. Use test IDs when user-facing semantics are not unique.', { importance: 'must', difficulty: 3 }),
    question('CURPW002', 'Playwright', 'Locators & Actions', 'Locator chaining', 'How do locator chaining and filtering improve Playwright tests?', 'Scope a locator to a stable parent, then filter by meaningful text, role, or test ID. This avoids global matches and makes intent clearer than positional selectors.', { importance: 'must', difficulty: 3 }),
    question('CURPW003', 'Playwright', 'Locators & Actions', 'Auto-waiting', 'What does Playwright auto-wait for, and what does it not solve?', 'It waits for actionability such as visibility, stability, receiving events, and enabled state. It does not guarantee business data is ready, a backend job completed, or a third-party dependency is healthy.', { importance: 'must', difficulty: 3 }),
    question('CURPW004', 'Playwright', 'Locators & Actions', 'CSS and XPath', 'When are CSS or XPath justified in Playwright?', 'Use them only when semantic locators and test IDs cannot express the target. Keep selectors short and based on stable attributes; avoid layout-dependent XPath and nth-child selectors.', { importance: 'important' })
  ]);

  addSection('pw-assertions-fixtures', 'Playwright Assertions & Fixtures', 'Web-first assertions, hooks, fixtures, and clean test isolation.', [
    question('CURPW005', 'Playwright', 'Assertions & Fixtures', 'Web-first assertions', 'Why use Playwright expect assertions instead of manual waits?', 'Web-first assertions retry until the expected state is met or a timeout occurs, producing better diagnostics and reducing duplicated timing code. Assert observable user outcomes, not implementation details.', { importance: 'must', difficulty: 3 }),
    question('CURPW006', 'Playwright', 'Assertions & Fixtures', 'Fixtures', 'How do fixtures improve test design?', 'Fixtures provide setup, dependencies, and teardown declaratively. They make tests explicit, reusable, and isolated while allowing layered extensions for authenticated pages, API clients, or seeded data.', { importance: 'must', difficulty: 3 }),
    question('CURPW007', 'Playwright', 'Assertions & Fixtures', 'Hooks', 'When should you use beforeEach/afterEach versus fixtures?', 'Use hooks for local, simple setup. Use fixtures when resources need dependency management, composition, optional scope, or reliable teardown. Avoid hidden global setup that makes tests order-dependent.', { importance: 'important', difficulty: 3 }),
    question('CURPW008', 'Playwright', 'Assertions & Fixtures', 'Authentication state', 'How do you reuse authentication safely with storageState?', 'Create storage state from a controlled login setup, store it outside source control, use separate states for roles, and refresh it when authentication expires. Do not let tests mutate a shared authenticated account.', { importance: 'must', difficulty: 4 })
  ]);

  addSection('pw-advanced', 'Playwright Advanced', 'Contexts, frames, popups, trace viewer, network interception, API testing, and CI scale.', [
    question('CURPW009', 'Playwright', 'Advanced', 'Browser contexts', 'Why are BrowserContext instances valuable for test isolation?', 'A context is an isolated, lightweight browser profile with separate cookies, storage, permissions, and cache. It enables parallel tests without the cost or leakage of sharing one browser session.', { importance: 'must', difficulty: 3 }),
    question('CURPW010', 'Playwright', 'Advanced', 'Frames and popups', 'How do you test frames and popups in Playwright?', 'Use frameLocator for iframe content and Promise.all with page.waitForEvent("popup") or context.waitForEvent("page") before triggering the action. Then await a stable state in the new page.', { importance: 'must', difficulty: 3 }),
    question('CURPW011', 'Playwright', 'Advanced', 'Downloads and uploads', 'How do you validate downloads and uploads in Playwright?', 'Use file chooser or setInputFiles for uploads. For downloads, wait for the download event, save to a test-specific path, and validate content rather than only the filename.', { importance: 'important' }),
    question('CURPW012', 'Playwright', 'Advanced', 'Dialogs', 'How do you handle dialogs without race conditions?', 'Register page.once("dialog") before the action that creates it, verify text when relevant, then accept, dismiss, or provide prompt input. Do not rely on arbitrary timeouts.', { importance: 'important' }),
    question('CURPW013', 'Playwright', 'Advanced', 'Trace, video, screenshots', 'How do trace viewer, video, and screenshots help triage failures?', 'Enable them selectively in CI, retain artifacts for failed retries, and use the trace timeline to inspect actions, DOM snapshots, console, and network context. This converts a flaky report into debuggable evidence.', { importance: 'must', difficulty: 3 }),
    question('CURPW014', 'Playwright', 'Advanced', 'Network interception', 'When should you use route interception?', 'Use it to isolate deterministic UI states, simulate rare responses, block third-party noise, or validate request payloads. Do not over-mock critical integration behaviour that needs real end-to-end coverage.', { importance: 'must', difficulty: 4 }),
    question('CURPW015', 'Playwright', 'Advanced', 'API testing', 'How can Playwright APIRequestContext support UI tests?', 'Use it to seed data, authenticate, validate backend side effects, and clean up resources quickly. Keep API helpers reusable and make UI tests independent of pre-existing shared data.', { importance: 'must', difficulty: 3 }),
    question('CURPW016', 'Playwright', 'Advanced', 'Projects and parallelism', 'How do projects, retries, and sharding work together in CI?', 'Projects define browser/device/environment variants; workers run isolated tests in parallel; retries produce diagnostics for transient failures; sharding splits a suite across agents. Size parallelism to capacity and test-data isolation.', { importance: 'must', difficulty: 4 })
  ]);

  // API testing: split protocols, HTTP, request/response, auth, and Postman into clear study areas.
  addTo('api-fundamentals', [
    question('CURAPI001', 'API Testing', 'API Fundamentals', 'REST, SOAP, and architecture', 'Compare REST and SOAP, and explain client-server API architecture.', 'REST is an architectural style commonly using HTTP resources and JSON; SOAP is a protocol with a strict XML contract and standards such as WS-Security. In both, a client sends a request to a server endpoint, which validates, processes, and returns a response.', { importance: 'must', difficulty: 3 }),
    question('CURAPI002', 'API Testing', 'API Fundamentals', 'URI, URL, endpoint, payload', 'Differentiate a URI, URL, endpoint, request, response, JSON, and XML.', 'A URI identifies a resource; a URL also describes how to locate it. An endpoint is an exposed API route. Requests carry method, path, headers, parameters, and optional body; responses carry status, headers, and body in formats such as JSON or XML.', { importance: 'must', difficulty: 2 })
  ]);

  addSection('http-methods', 'HTTP Methods & Status Codes', 'Methods, idempotency, status-code families, and their testing implications.', [
    question('CURHT001', 'API Testing', 'HTTP Methods', 'GET, POST, PUT, PATCH, DELETE', 'Explain GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.', 'GET reads, POST creates or triggers processing, PUT replaces a resource, PATCH partially updates, DELETE removes, HEAD returns headers without a body, and OPTIONS reports supported communication options. Test semantics and idempotency, not just status codes.', { importance: 'must', difficulty: 3 }),
    question('CURHT002', 'API Testing', 'HTTP Status Codes', 'Success codes', 'When do 200, 201, 202, and 204 apply?', '200 means successful response, 201 means a resource was created, 202 means accepted for asynchronous processing, and 204 means successful with no response body. Validate headers and resulting state as well.', { importance: 'must' }),
    question('CURHT003', 'API Testing', 'HTTP Status Codes', 'Client errors', 'Differentiate 400, 401, 403, 404, 405, 409, 415, 422, and 429.', 'They respectively represent invalid request, missing/invalid authentication, authenticated but unauthorized, missing resource, unsupported method, state conflict, unsupported media type, semantically invalid input, and rate limiting.', { importance: 'must', difficulty: 3 }),
    question('CURHT004', 'API Testing', 'HTTP Status Codes', 'Server errors', 'How do you test and handle 500, 502, 503, and 504 responses?', 'Validate the client-facing contract and diagnostic correlation ID, then distinguish application failure, bad gateway, unavailable service, and upstream timeout. Verify safe retries only where the operation is idempotent.', { importance: 'important', difficulty: 4 })
  ]);

  addSection('api-request-response', 'Request / Response', 'Headers, parameters, bodies, contracts, and validation of API behavior.', [
    question('CURRR001', 'API Testing', 'Request / Response', 'Parameters and headers', 'How do query parameters, path parameters, headers, and request bodies differ?', 'Path parameters identify a resource, query parameters filter or modify retrieval, headers carry metadata such as auth and content type, and the body carries the resource representation or command payload.', { importance: 'must' }),
    question('CURRR002', 'API Testing', 'Request / Response', 'Validation', 'What should an API test validate beyond the HTTP status code?', 'Validate headers, schema, required and optional fields, data types, values, ordering where promised, side effects, idempotency, response time, security boundaries, and correlation with database or downstream state.', { importance: 'must', difficulty: 3 }),
    question('CURRR003', 'API Testing', 'Request / Response', 'Contract testing', 'What is API contract validation?', 'It verifies that provider and consumer agree on request and response shape, types, required fields, status behavior, and compatibility rules. Schema validation is one layer; consumer-driven contracts can validate behavior across services.', { importance: 'important', difficulty: 4 })
  ]);

  addSection('api-auth', 'Authentication & Authorization', 'Tokens, sessions, roles, OAuth, and negative security scenarios.', [
    question('CURAU001', 'API Testing', 'Authentication & Authorization', 'Authentication vs authorization', 'Differentiate authentication and authorization.', 'Authentication establishes who the caller is; authorization determines what that caller may do. A valid token can still receive 403 when it lacks the required permission.', { importance: 'must' }),
    question('CURAU002', 'API Testing', 'Authentication & Authorization', 'Token lifecycle', 'How do you test expired, invalid, missing, and malformed tokens?', 'Use controlled tokens for each state, assert the correct error contract without leaking sensitive detail, verify refresh behaviour where applicable, and confirm the request never performs the protected action.', { importance: 'must', difficulty: 3 }),
    question('CURAU003', 'API Testing', 'Authentication & Authorization', 'OAuth and service accounts', 'How do you secure API tests that use OAuth or service accounts?', 'Obtain short-lived credentials from a secret manager or CI identity, never hard-code them, use least-privileged scopes, mask them in logs, and rotate or revoke them independently of test code.', { importance: 'must', difficulty: 4 }),
    question('CURAU004', 'API Testing', 'Authentication & Authorization', 'Role-based access', 'How would you test role-based authorization?', 'Use a small matrix of roles and operations, test permitted and denied paths, verify no state changes on denial, and include indirect-access cases such as guessing another tenant\'s resource ID.', { importance: 'must', difficulty: 4 })
  ]);

  addSection('postman', 'Postman', 'Collections, variables, request scripting, chaining, runner, and Newman execution.', [
    question('CURPM001', 'API Testing', 'Postman', 'Collections and environments', 'How do collections, environments, and variables make Postman tests reusable?', 'Collections group related requests and scripts. Environments hold deploy-specific values; collection and global variables hold shared defaults. Use the narrowest variable scope and never place production secrets in exported collections.', { importance: 'must' }),
    question('CURPM002', 'API Testing', 'Postman', 'Pre-request and tests', 'What are pre-request scripts and test scripts used for?', 'Pre-request scripts create dynamic inputs such as timestamps, signatures, or tokens. Test scripts validate status/body/headers and can save extracted values for later requests.', { importance: 'must', difficulty: 3 }),
    question('CURPM003', 'API Testing', 'Postman', 'Chaining', 'How do you chain API requests in Postman?', 'Extract a value such as token or resource ID from one response and save it to a scoped variable, then reference it in the next request. Keep setup, assertion, and cleanup clear.', { importance: 'must', difficulty: 3 }),
    question('CURPM004', 'API Testing', 'Postman', 'Runner and Newman', 'How do you run a Postman collection in CI?', 'Use Collection Runner locally for data files and iterations, then execute the collection through Newman in CI with environment files, secure variables, reporters, and a non-zero exit code on failed assertions.', { importance: 'important', difficulty: 3 })
  ]);

  addTo('rest-assured', [
    question('CURRA001', 'REST Assured', 'REST Assured', 'Schema validation', 'How do you add JSON schema validation to REST Assured tests?', 'Store versioned schemas with the test resources, validate shape with matchesJsonSchemaInClasspath, and pair it with business-value assertions because a valid schema alone does not prove correct data.', { importance: 'must', difficulty: 3, codeCommand: 'given().when().get("/users/1").then().body(matchesJsonSchemaInClasspath("schemas/user.json"));' }),
    question('CURRA002', 'REST Assured', 'REST Assured', 'Request and response specifications', 'Why use RequestSpecification and ResponseSpecification?', 'They centralize base URI, authentication, content type, common headers, timeouts, and standard response assertions. This prevents drift while allowing an individual test to add its specific contract.', { importance: 'must', difficulty: 3 })
  ]);

  // Database: advanced SQL and realistic database validation are surfaced separately.
  addSection('sql-advanced', 'Joins & Advanced SQL', 'Joins, subqueries, CTEs, window functions, and senior database-test design.', [
    question('CURSQL001', 'SQL', 'Advanced SQL', 'Join selection', 'Compare INNER, LEFT, RIGHT, FULL, CROSS, and self joins.', 'INNER returns matches; LEFT/RIGHT retain all rows from one side; FULL retains both sides; CROSS returns combinations; self join relates rows in the same table. Choose the join from the business question, not habit.', { importance: 'must', difficulty: 3 }),
    question('CURSQL002', 'SQL', 'Advanced SQL', 'Subqueries and CTEs', 'When do you choose a CTE over a subquery?', 'A CTE can make a multi-step query more readable and reusable within one statement; a subquery is concise for a localized condition. Validate the execution plan for performance rather than assuming one is faster.', { importance: 'must', difficulty: 3 }),
    question('CURSQL003', 'SQL', 'Advanced SQL', 'Window functions', 'Explain ROW_NUMBER, RANK, DENSE_RANK, LAG, and LEAD.', 'Window functions calculate over a related result set without collapsing rows. Use them for deduplication, ranking, pagination, and comparing a row with previous or next values.', { importance: 'must', difficulty: 4 }),
    question('CURSQL004', 'SQL', 'Advanced SQL', 'Data migration', 'How would you validate a data migration?', 'Reconcile record counts, primary keys, transformations, nulls, duplicates, referential integrity, aggregates, samples at boundaries, rejected records, and rerun/idempotency behavior. Keep a repeatable reconciliation query set.', { importance: 'senior', difficulty: 4 }),
    question('CURSQL005', 'SQL', 'Database Testing', 'Constraints and integrity', 'How do primary keys, foreign keys, unique constraints, and nullability affect QA testing?', 'They encode data rules. Test both valid writes and violations, validate UI/API error contracts, and reconcile that failures do not leave partial or orphaned data.', { importance: 'must', difficulty: 3 }),
    question('CURSQL006', 'SQL', 'Database Testing', 'UI/API to DB validation', 'How do you validate UI-to-DB and API-to-DB flows without making tests brittle?', 'Validate a small number of business-critical records through supported read access or APIs, use unique test IDs, wait for eventual consistency when documented, and avoid coupling every UI test directly to schema internals.', { importance: 'important', difficulty: 4 })
  ]);

  // Senior level: strategy, metrics, leadership, and release accountability.
  addTo('senior-scenarios', [
    question('CURSS001', 'Senior QA', 'Test Strategy', 'Automation ROI', 'How do you decide what to automate?', 'Prioritize stable, repeatable, high-volume or high-risk checks with expensive manual repetition. Consider maintenance cost, test-data feasibility, feedback speed, and the alternative layers—unit, API, UI, or monitoring.', { importance: 'must', difficulty: 4 }),
    question('CURSS002', 'Senior QA', 'Test Estimation', 'Planning', 'How do you estimate testing for a feature with unknowns?', 'Decompose scope into risk areas, test design, data, environment, automation, execution, defect retest, and coordination. Use ranges, assumptions, historical data, and an explicit contingency for unknowns.', { importance: 'must', difficulty: 4 }),
    question('CURSS003', 'Senior QA', 'Release Decision', 'Critical defect', 'A critical defect is found immediately before release. What do you do?', 'Confirm impact and reproducibility, assess affected users and workaround, gather business and technical owners, present options such as fix, flag, rollback, or defer, and record the risk-based decision. QA informs; accountable stakeholders decide.', { importance: 'must', difficulty: 5 }),
    question('CURSS004', 'Senior QA', 'Leadership', 'Mentoring and code review', 'How do you improve quality through mentoring and code reviews?', 'Define pragmatic standards, pair on risky changes, review for testability and reliability, share failure patterns, and measure improvement through fewer escaped defects, lower flakiness, and faster onboarding—not through process volume.', { importance: 'senior', difficulty: 4 }),
    question('CURSS005', 'Senior QA', 'Technical Debt', 'Regression optimization', 'How do you reduce technical debt in an automation suite?', 'Make debt visible, rank it by risk and maintenance cost, allocate capacity, remove duplicate checks, replace brittle selectors and sleeps, improve test data, and track suite duration, failure triage time, and flaky rate.', { importance: 'senior', difficulty: 4 }),
    question('CURSS006', 'Senior QA', 'Stakeholder Communication', 'Cross-team dependencies', 'How do you communicate a quality risk with cross-team dependencies?', 'Use a concise statement of user impact, evidence, scope, ownership, mitigation, decision deadline, and residual risk. Avoid vague status; make the dependency and unblock path visible.', { importance: 'senior', difficulty: 4 })
  ]);

  addSection('qa-metrics', 'QA Strategy & Metrics', 'Quality management metrics, release gates, automation health, and risk-based decision making.', [
    question('CURQM001', 'QA Metrics', 'Quality Metrics', 'Defect density', 'What is defect density and what are its limits?', 'It relates defects to a size measure such as story points, function points, or lines of code. Use it as a trend with comparable scope; it is not a universal quality score.', { importance: 'senior', difficulty: 4 }),
    question('CURQM002', 'QA Metrics', 'Quality Metrics', 'Leakage and escaped defects', 'How do defect leakage and escaped defects differ?', 'Defect leakage generally measures defects found in a later test phase than intended; escaped defects are those that reach production. Both require cause analysis, not blame or a vanity target.', { importance: 'senior', difficulty: 4 }),
    question('CURQM003', 'QA Metrics', 'Quality Metrics', 'Defect rejection and aging', 'What do defect rejection ratio and defect aging reveal?', 'Rejection ratio can expose unclear reporting, environment problems, or disagreement on requirements. Aging exposes unresolved risk and bottlenecks. Segment both by severity, reason, team, and release context.', { importance: 'important', difficulty: 4 }),
    question('CURQM004', 'QA Metrics', 'Coverage', 'Requirement and risk coverage', 'How do you report coverage honestly?', 'Report the share of requirements and risk areas with meaningful tests and execution evidence, plus excluded or untestable scope. Do not equate the number of test cases with completeness.', { importance: 'must', difficulty: 4 }),
    question('CURQM005', 'QA Metrics', 'Automation Health', 'Automation percentage and ROI', 'How do you calculate automation ROI?', 'Compare the cost of build and maintenance with time saved, feedback speed, risk reduction, and execution frequency. Automation percentage is a capacity signal, not ROI; a large brittle suite can have negative value.', { importance: 'senior', difficulty: 4 }),
    question('CURQM006', 'QA Metrics', 'Automation Health', 'Flaky test rate', 'How do you measure flaky-test rate?', 'Track tests that produce inconsistent outcomes on unchanged code/environment across repeat runs, including passed-after-retry. Segment by root cause and keep the rate separate from product failure rate.', { importance: 'must', difficulty: 4 }),
    question('CURQM007', 'QA Metrics', 'Operations', 'MTTR and release quality', 'How do MTTR and release-quality signals guide QA strategy?', 'MTTR measures time to restore service; release quality combines customer impact, escaped defects, rollback rate, and reliability. Use trends to strengthen observability, canary checks, rollback paths, and test focus.', { importance: 'senior', difficulty: 4 }),
    question('CURQM008', 'QA Metrics', 'Quality Gates', 'Risk assessment', 'What makes a quality gate useful?', 'It is objective, automated where possible, tied to material risk, fast enough to influence decisions, and accompanied by an exception process. A gate should prevent known harm, not create ceremony.', { importance: 'senior', difficulty: 4 })
  ]);

  addTo('project-resume', [
    question('CURPR001', 'Project & Resume', 'Project Story', 'Architecture and responsibilities', 'How do you describe your project architecture and responsibilities in two minutes?', 'State the product and users, team shape, delivery model, stack, quality strategy, your ownership, and one measurable improvement. Be precise about what you personally did versus what the team did.', { importance: 'must', difficulty: 4 }),
    question('CURPR002', 'Project & Resume', 'Project Story', 'Impact metrics', 'Which project metrics should you be ready to discuss?', 'Prepare credible figures for automation coverage, suite duration, execution frequency, defect discovery, escaped defects, flaky-rate reduction, time saved, CI adoption, and team size. Explain how the metric was measured.', { importance: 'must', difficulty: 4 }),
    question('CURPR003', 'Project & Resume', 'Project Story', 'Production incident', 'How do you answer a question about your biggest production issue?', 'Use situation, impact, your action, technical and process root cause, immediate mitigation, long-term prevention, and the measured result. Own the learning without exposing confidential information.', { importance: 'must', difficulty: 4 })
  ]);

  addTo('hr-behavioral', [
    question('CURHR001', 'HR & Behavioral', 'Behavioral', 'Conflict', 'Describe a conflict with a developer or manager and how you resolved it.', 'Use a factual example: align on the shared customer outcome, bring reproducible evidence, listen to constraints, agree on an experiment or decision owner, and document the resolution. Never frame the answer as winning an argument.', { importance: 'must', difficulty: 3 }),
    question('CURHR002', 'HR & Behavioral', 'Behavioral', 'Leadership', 'How have you mentored a junior QA engineer?', 'Describe the skill gap, structured guidance, pairing or reviews, ownership you transferred, and evidence of improvement such as independent delivery, clearer defects, or a stable automation contribution.', { importance: 'must', difficulty: 3 }),
    question('CURHR003', 'HR & Behavioral', 'Behavioral', 'Failure and learning', 'Tell me about a failure or mistake and what you changed afterward.', 'Choose a real but safe example, own your part, explain the customer or delivery impact, show the corrective action, and close with the lasting process or technical improvement.', { importance: 'important', difficulty: 3 })
  ]);

  addSection('cheat-sheet', 'Command Cheat Sheet', 'Commands and code snippets for Git, Linux, Maven, Jenkins, Playwright, Selenium, Docker, and REST Assured.', [
    question('CURCS001', 'Quick Reference', 'Git Commands', 'Daily workflow', 'Git: clone, fetch, pull, add, commit, push, branch, merge, rebase, stash, reset, revert, and cherry-pick.', 'Know the intent and safe use of each command; prefer revert for shared history and reset only when rewriting local history is acceptable.', { importance: 'must', interviewType: 'Command Cheat Sheet', codeCommand: 'git clone <url>\ngit fetch origin\ngit pull --ff-only\ngit switch -c feature/name\ngit add .\ngit commit -m "Add API tests"\ngit push -u origin feature/name\ngit stash push -m "wip"\ngit rebase origin/main\ngit revert <commit>' }),
    question('CURCS002', 'Quick Reference', 'Linux Commands', 'Inspection and files', 'Linux essentials for QA and CI.', 'Use commands deliberately and verify the target before a destructive action. Combine logs, search, process inspection, and HTTP checks for fast CI triage.', { importance: 'must', interviewType: 'Command Cheat Sheet', codeCommand: 'pwd\nls -la\ncd <dir>\nmkdir <dir>\ncp <src> <dst>\nmv <src> <dst>\ncat <file>\nless <file>\ngrep -R "error" .\nfind . -name "*.log"\ntail -f app.log\nps aux | grep java\ncurl -I https://example.com' }),
    question('CURCS003', 'Quick Reference', 'Maven Commands', 'Build and test', 'Maven commands for clean builds, targeted tests, profiles, and reports.', 'Use the smallest command that proves the change locally, then let CI run the broader suite.', { importance: 'must', interviewType: 'Command Cheat Sheet', codeCommand: 'mvn clean test\nmvn -Dtest=LoginTest test\nmvn -Dgroups=smoke test\nmvn -Pqa clean verify\nmvn dependency:tree' }),
    question('CURCS004', 'Quick Reference', 'Playwright Commands', 'Node runner', 'Playwright commands for install, execution, tracing, and reports.', 'Run a focused spec while developing, use projects for browser coverage, and inspect artifacts for failed CI runs.', { importance: 'must', interviewType: 'Command Cheat Sheet', codeCommand: 'npx playwright install\nnpx playwright test\nnpx playwright test tests/login.spec.ts\nnpx playwright test --project=chromium\nnpx playwright show-report\nnpx playwright show-trace trace.zip' }),
    question('CURCS005', 'Quick Reference', 'Docker Commands', 'Containers and Grid', 'Docker commands commonly used with test infrastructure.', 'Use image tags deliberately and inspect container logs and health before assuming a test failure is in the product.', { importance: 'important', interviewType: 'Command Cheat Sheet', codeCommand: 'docker build -t qa-tests:local .\ndocker run --rm qa-tests:local\ndocker ps\ndocker logs <container>\ndocker compose up -d\ndocker compose down' }),
    question('CURCS006', 'Quick Reference', 'REST Assured', 'Test skeleton', 'REST Assured request, assertion, extraction, and schema-validation skeleton.', 'Use shared specifications for configuration, then keep individual tests focused on intent and contract.', { importance: 'must', interviewType: 'Command Cheat Sheet', codeCommand: 'given().spec(requestSpec)\n  .pathParam("id", userId)\n.when().get("/users/{id}")\n.then().spec(responseSpec)\n  .body("id", equalTo(userId))\n  .body(matchesJsonSchemaInClasspath("schemas/user.json"));' })
  ]);

  // A true 50-question senior revision section, spread across every interview area.
  var top50 = [
    ['Manual Testing', 'How do you create a risk-based test strategy?'], ['Manual Testing', 'Explain smoke, sanity, regression, and retesting.'], ['Manual Testing', 'How do you use an RTM and define release exit criteria?'], ['Manual Testing', 'How do you test an ambiguous requirement?'], ['Manual Testing', 'How do you decide a release is ready?'],
    ['Selenium', 'Explain Selenium WebDriver architecture and the W3C protocol.'], ['Selenium', 'How do explicit, implicit, and fluent waits differ?'], ['Selenium', 'How do you diagnose a stale element exception?'], ['Selenium', 'How do you make Selenium tests parallel-safe?'], ['Selenium', 'How do you automate windows, frames, uploads, downloads, and Shadow DOM?'],
    ['Java', 'Explain OOP with examples from a test framework.'], ['Java', 'Compare List, Set, Map, Comparable, and Comparator.'], ['Java', 'Compare String, StringBuilder, and StringBuffer.'], ['Java', 'Write a solution for duplicates or frequency using HashMap.'], ['Java', 'Write a Stream API solution and explain its trade-offs.'],
    ['Framework', 'Describe the architecture of your automation framework.'], ['Framework', 'Why use POM, DriverFactory, and ThreadLocal?'], ['Framework', 'How do you handle configuration, secrets, and environments?'], ['Framework', 'Explain data-driven and hybrid frameworks.'], ['Framework', 'How do you reduce flaky tests in the framework?'],
    ['Playwright', 'Why choose Playwright over Selenium for a new project?'], ['Playwright', 'How do browser contexts provide isolation?'], ['Playwright', 'How do fixtures, storage state, traces, and retries work?'], ['Playwright', 'How do you test network failures and API side effects with Playwright?'], ['Playwright', 'How do you scale Playwright in CI with projects and sharding?'],
    ['API Testing', 'Compare REST and SOAP, URI and URL, and request and response.'], ['API Testing', 'Explain HTTP methods, idempotency, and key status codes.'], ['API Testing', 'Differentiate authentication from authorization.'], ['API Testing', 'How do you validate schema, data, headers, and performance?'], ['API Testing', 'How do you design a REST Assured framework?'],
    ['Database', 'Explain joins, CTEs, and window functions.'], ['Database', 'How do you validate API-to-database consistency?'], ['Database', 'How do you test a data migration?'], ['Database', 'How do constraints and referential integrity affect testing?'], ['Database', 'Write SQL for duplicates, second-highest value, and ranking.'],
    ['DevOps', 'Describe your Git workflow and conflict-resolution approach.'], ['DevOps', 'How do you design a Jenkins pipeline for automation?'], ['DevOps', 'How do Docker and Selenium Grid support parallel testing?'], ['DevOps', 'How do you troubleshoot a test that fails only in CI?'], ['DevOps', 'What security practices apply to test automation in CI?'],
    ['Senior QA', 'How do you estimate testing and communicate uncertainty?'], ['Senior QA', 'What QA metrics would you report to leadership?'], ['Senior QA', 'How do you calculate and defend automation ROI?'], ['Senior QA', 'How do you manage a critical production incident?'], ['Senior QA', 'How do you improve regression execution time without lowering quality?'],
    ['Leadership', 'How do you mentor junior engineers and set automation standards?'], ['Leadership', 'How do you handle conflict with a developer or product owner?'], ['Leadership', 'How do you communicate a release risk to stakeholders?'], ['Project', 'Explain your project, contribution, impact, and biggest challenge.'], ['Behavioral', 'Why should we hire you for a senior QA/SDET role?']
  ];

  addSection('top-50-senior', 'Top 50 Senior QA Questions', 'A focused senior-level revision set across manual QA, automation, API, SQL, DevOps, and leadership.', top50.map(function (item, index) {
    var number = String(index + 1).padStart(2, '0');
    return question('TOP50' + number, 'Top 50 Senior QA', item[0], 'Senior Revision', item[1], 'Answer with a concise framework: define the concept, describe your project approach, explain the risk or trade-off, and finish with a measurable outcome.', {
      importance: 'must',
      difficulty: 4,
      interviewType: 'Senior Interview',
      detailedExplanation: 'Use this as a timed prompt. Spend 30 seconds outlining the answer, then give a two-minute example backed by evidence from your project.'
    });
  }));

  // Build the Top 200 page from the most important complete question cards so it is a real revision set rather than a broken menu item.
  var allSourceQuestions = [];
  Object.keys(defined_sections).forEach(function (key) {
    if (key !== 'top-200' && key !== 'top-50-senior') {
      var section = defined_sections[key];
      if (section.questions) allSourceQuestions.push.apply(allSourceQuestions, section.questions);
    }
  });
  var priorityQuestions = allSourceQuestions.filter(function (item) { return item.importance === 'must' || item.importance === 'senior'; });
  var sourceForTop200 = priorityQuestions.length >= 200 ? priorityQuestions : allSourceQuestions;
  addSection('top-200', 'Top 200 Must-Know', 'A curated, cross-topic revision deck assembled from the full senior QA curriculum.', Array.from({ length: 200 }, function (_, index) {
    var source = sourceForTop200[index % sourceForTop200.length];
    var copy = Object.assign({}, source);
    copy.id = 'TOP' + String(index + 1).padStart(3, '0');
    copy.category = 'Top 200 Must-Know';
    copy.topic = source.category + ' - ' + source.topic;
    copy.importance = 'must';
    return copy;
  }));
})();
