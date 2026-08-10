/* ═══════════════════════════════════════════════════════════════
   framework.js — Framework Architecture
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['framework-design'] = {
  title: '🏗️ Framework Architecture',
  description: 'Design patterns, POM, Data-Driven vs Keyword-Driven, and Senior Architect level questions',
  questions: [
    {
      id: 'FW001',
      category: 'Framework',
      topic: 'Comparison',
      subtopic: 'Data-Driven vs Keyword-Driven',
      question: 'Explain the difference between a Data-Driven Framework and a Keyword-Driven Framework.',
      whyAsked: 'Tests if you understand framework paradigms beyond just writing simple scripts.',
      difficulty: 2,
      importance: 'must',
      interviewType: 'Technical',
      thirtySecAnswer: 'Data-Driven separates test data from the test logic, feeding multiple data sets (via Excel/JSON) into one script. Keyword-Driven abstracts the code entirely, allowing non-technical users to write tests in Excel using action keywords like "CLICK" or "ENTER_TEXT".',
      interviewAnswer: 'A **Data-Driven Framework** separates the test script logic from the test data. The script is written in code (Java/TestNG), and the data is read from an external source (Excel, JSON, Database). The same script runs multiple times with different sets of data. This is what most modern POM frameworks use via TestNG `@DataProvider`.\n\nA **Keyword-Driven Framework** goes a step further and separates the *action logic* from the code. You build a library of keywords (e.g., `CLICK`, `TYPE`, `VERIFY`). Then, a manual tester can write an entire automated test in an Excel sheet by combining these keywords and providing target locators and data. The framework acts as an engine that parses the Excel sheet and maps the keywords to Java methods.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | Data-Driven Framework | Keyword-Driven Framework |\n| :--- | :--- | :--- |\n| **Core Separation** | Separates Data from Code | Separates Actions and Data from Code |\n| **Who writes tests?**| SDETs / Automation Engineers | Manual Testers, BAs (in Excel) |\n| **Maintenance** | Medium (update code if UI changes) | High (engine maintenance is complex) |\n| **Flexibility** | High (full power of Java) | Low (restricted by available keywords) |\n| **Modern Usage** | Very Common (Industry Standard) | Rarely built from scratch anymore (Robot Framework handles this) |',
      simpleExplanation: 'Data-driven: I give the robot a script, and hand it a bucket of different inputs to try. Keyword-driven: I give the robot a remote control, and a non-coder presses the buttons (keywords) to tell it what to do.',
      realWorldExample: 'Testing Login: Data-driven reads 10 username/password pairs and runs the `loginTest()` method 10 times. Keyword-driven reads Excel rows: [TYPE, usernameBox, admin], [TYPE, passwordBox, 123], [CLICK, loginBtn].',
      projectExample: 'In our project, we use a Hybrid framework. The core is Data-Driven (TestNG DataProviders feeding JSON data into tests), but it incorporates POM (Page Object Model) to abstract locators.',
      codeCommand: 'N/A - Architectural concept',
      expectedOutput: 'N/A',
      followUpQ: 'What is a Hybrid Framework?',
      followUpA: 'A Hybrid Framework combines features of multiple paradigms. The most common industry standard is combining Page Object Model (for structural abstraction) with Data-Driven Testing (for data abstraction) and modular utilities.',
      seniorFollowUpQ: 'If you were starting a brand new enterprise project today, would you build a custom Keyword-Driven framework?',
      seniorFollowUpA: 'No. Building and maintaining a custom keyword parser engine in Java is an anti-pattern today. It creates massive maintenance overhead. If the business demands non-technical users write automation, I would implement BDD using Cucumber (which is a form of keyword-driven) or use an off-the-shelf tool like Robot Framework or a low-code tool. Otherwise, a code-based POM/Data-Driven framework is vastly superior for maintainability.',
      commonMistake: 'Confusing BDD (Cucumber) with standard Data-Driven testing.',
      bestPractice: 'Keep test data out of the source code. Use JSON or YAML for data instead of Excel for easier Git version control tracking.'
    },
    {
      id: 'FW002',
      category: 'Framework',
      topic: 'Architecture',
      subtopic: 'Written Test - ThreadLocal',
      question: 'WRITTEN TEST: In a Selenium framework, why must `WebDriver` be wrapped in a `ThreadLocal` object for parallel execution?',
      whyAsked: 'Crucial for Senior SDETs. Tests understanding of thread safety in Java.',
      difficulty: 4,
      importance: 'must',
      interviewType: 'Written Test',
      thirtySecAnswer: 'WebDriver is not thread-safe. If multiple parallel tests share a single `static WebDriver` instance, they will overwrite each other\'s sessions and crash. `ThreadLocal` ensures each Java thread gets its own isolated WebDriver instance.',
      interviewAnswer: 'In Java, static variables are shared across all instances of a class. If you declare `public static WebDriver driver;`, and TestNG runs 5 tests in parallel (5 threads), all 5 threads will try to use that single `driver` variable simultaneously.\n\nThread 1 might navigate to Google, but before it can search, Thread 2 navigates the *same driver* to Amazon. The tests will fail with `NoSuchSessionException` or erratic behavior.\n\nTo achieve true parallel execution, WebDriver must be thread-safe. We do this by wrapping it in `ThreadLocal<WebDriver>`. This tells the JVM to create a separate, isolated copy of the variable for every thread that accesses it. Thread 1 gets Driver A, Thread 2 gets Driver B, and they never interact.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Variable Declaration | Parallel Execution Behavior | Result |\n| :--- | :--- | :--- |\n| `static WebDriver driver;` | All threads share the exact same browser instance | Chaos, overriding, test failures |\n| `WebDriver driver;` (Instance) | New instance per class, but difficult to pass to utility classes without dependency injection | Hard to maintain globally |\n| `ThreadLocal<WebDriver> driver;` | Each thread has an isolated, globally accessible driver | Safe parallel execution |',
      simpleExplanation: 'Imagine WebDriver is a steering wheel. If it\'s `static`, 5 drivers are trying to steer the same car at once. `ThreadLocal` gives every driver their own steering wheel and their own car.',
      realWorldExample: 'N/A',
      projectExample: 'When I joined the project, their suite took 3 hours. I refactored the `DriverFactory` to use `ThreadLocal`, which allowed us to run TestNG in `parallel="methods"`. Execution time dropped to 20 minutes.',
      codeCommand: 'public class DriverFactory {\n    // ThreadLocal wrapper\n    private static ThreadLocal<WebDriver> tlDriver = new ThreadLocal<>();\n\n    public static synchronized void setDriver(String browser) {\n        tlDriver.set(new ChromeDriver()); // Assigns driver to current thread\n    }\n\n    public static synchronized WebDriver getDriver() {\n        return tlDriver.get(); // Retrieves driver for current thread\n    }\n\n    public static synchronized void quitDriver() {\n        tlDriver.get().quit();\n        tlDriver.remove(); // Prevents memory leaks\n    }\n}',
      expectedOutput: 'N/A',
      followUpQ: 'Why is `tlDriver.remove()` necessary at the end of the test?',
      followUpA: 'Application servers and CI tools use Thread Pools (reusing threads for different tasks). If you don\'t call `.remove()`, the dead WebDriver reference remains attached to the thread in the pool. When that thread is reused later, it still holds the old data, leading to memory leaks or erratic behavior.',
      seniorFollowUpQ: 'How does Playwright handle this compared to Selenium?',
      seniorFollowUpA: 'Playwright\'s test runner (@playwright/test) handles test isolation and parallelism natively through Workers. Each worker is an isolated OS process. You do not need to write ThreadLocal logic in JavaScript/TypeScript Playwright frameworks; test isolation is guaranteed out-of-the-box.',
      commonMistake: 'Making WebDriver static to "make it easier to access" from page objects, thereby killing parallel execution capabilities.',
      bestPractice: 'Use a Singleton DriverFactory with ThreadLocal for Selenium Java frameworks.'
    }
  ]
};
