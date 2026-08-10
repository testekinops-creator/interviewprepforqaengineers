/* ═══════════════════════════════════════════════════════════════
   jenkins-cicd.js — Jenkins & CI/CD
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['jenkins'] = {
  title: '🏗️ Jenkins & CI/CD',
  description: 'Continuous Integration, Pipelines, and Jenkins execution for SDETs',
  questions: [
    {
      id: 'JENK001',
      category: 'CI/CD',
      topic: 'Comparison',
      subtopic: 'Declarative vs Scripted Pipeline',
      question: 'What is the difference between a Declarative Pipeline and a Scripted Pipeline in Jenkins?',
      whyAsked: 'Tests architectural knowledge of CI/CD pipeline code.',
      difficulty: 3,
      importance: 'must',
      interviewType: 'Technical',
      thirtySecAnswer: 'Scripted Pipeline uses pure Groovy code, offering maximum flexibility but requiring advanced programming skills. Declarative Pipeline is a newer, simpler, and more rigid syntax designed by CloudBees that uses structured blocks (pipeline, agent, stages, steps) and is easier to read and maintain.',
      interviewAnswer: 'In modern Jenkins automation, we use the **Declarative Pipeline** syntax.\n\nA **Scripted Pipeline** is the traditional way to write Jenkinsfiles. It runs on the Jenkins master and uses pure Groovy code. It gives you absolute control—you can write complex `for` loops, if/else logic, and custom functions right in the Jenkinsfile. However, it is very hard to read for non-developers and difficult to maintain.\n\nA **Declarative Pipeline** is the modern standard. It provides a predefined structure with strict blocks: `pipeline { agent any; stages { stage(\'Build\') { steps { ... } } } }`. It includes built-in post-build actions (like `post { always { ... } }`) which makes it incredibly easy to configure things like Allure report generation or Slack notifications without complex try-catch blocks. In my projects, I always use Declarative pipelines because they are self-documenting and easier for the entire DevOps/QA team to understand.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | Declarative Pipeline | Scripted Pipeline |\n| :--- | :--- | :--- |\n| **Syntax Base** | Structured blocks (pipeline, stages) | Pure Groovy script |\n| **Flexibility** | Rigid structure, limited custom logic | Total control, complex logic allowed |\n| **Learning Curve**| Low (easy to read and write) | High (requires Groovy programming) |\n| **Post Actions** | Built-in `post { }` block | Requires custom `try/catch/finally` |\n| **Start Block** | `pipeline { }` | `node { }` |',
      simpleExplanation: 'Declarative is like filling out a form with specific boxes for "Agent", "Stages", and "Post Actions". Scripted is like getting a blank piece of paper and being told to write the code yourself.',
      realWorldExample: 'N/A',
      projectExample: 'When I took over the QA pipeline, it was a 500-line Scripted Jenkinsfile with complex Groovy try/catch blocks that kept failing silently. I rewrote it into a 50-line Declarative Pipeline. I used the `post { failure { mail to: \'team\' } }` block to easily handle email notifications on test failures.',
      codeCommand: '// Declarative (Modern)\npipeline {\n    agent any\n    stages {\n        stage(\'Test\') {\n            steps {\n                sh \'mvn clean test\'\n            }\n        }\n    }\n    post {\n        always {\n            allure includeProperties: false, jdk: \'\', results: [[path: \'target/allure-results\']]\n        }\n    }\n}\n\n// Scripted (Legacy)\nnode {\n    try {\n        stage(\'Test\') {\n            sh \'mvn clean test\'\n        }\n    } finally {\n        allure includeProperties: false, jdk: \'\', results: [[path: \'target/allure-results\']]\n    }\n}',
      expectedOutput: 'N/A',
      followUpQ: 'How do you parameterize a Declarative Pipeline?',
      followUpA: 'You use the `parameters { }` block at the top of the pipeline. For example: `parameters { string(name: \'BROWSER\', defaultValue: \'chrome\') }`. You can then access this parameter in your shell steps using `${params.BROWSER}`. E.g., `sh "mvn clean test -Dbrowser=${params.BROWSER}"`.',
      seniorFollowUpQ: 'How do you execute tests in parallel across multiple Jenkins nodes in a Declarative Pipeline?',
      seniorFollowUpA: 'You use the `parallel` block inside a stage. You can define multiple stages inside the `parallel` block, and for each stage, you specify a different `agent`. For example, one stage runs `mvn test -Dsuite=UI` on a Linux node, and another stage runs `mvn test -Dsuite=API` on an AWS agent simultaneously.',
      commonMistake: 'Trying to write complex Groovy loops directly inside a Declarative `steps` block (it requires a `script { }` block escape hatch).',
      bestPractice: 'Keep Jenkinsfiles declarative. If you need complex logic, write a bash script or Python script and just call `sh \'./my-script.sh\'` from the pipeline.'
    },
    {
      id: 'JENK002',
      category: 'CI/CD',
      topic: 'Troubleshooting',
      subtopic: 'Written Test - Failing Pipeline',
      question: 'WRITTEN TEST: Your automation suite passes 100% on your local machine, but fails immediately in the Jenkins CI pipeline. Walk me through exactly how you debug this.',
      whyAsked: 'Crucial Senior SDET question. Tests real-world debugging methodology and understanding of environments.',
      difficulty: 4,
      importance: 'must',
      interviewType: 'Written Test',
      thirtySecAnswer: 'I check the Jenkins console logs first. The issue is usually environment differences (headless mode, missing dependencies, screen resolution, different Java version) or network restrictions (VPN/firewall).',
      interviewAnswer: 'This is the most common issue in CI/CD. When tests pass locally but fail in Jenkins, I never assume the test code is broken. I follow this debug sequence:\n\n1) **Check the Console Logs:** I look for the exact exception. Is it a compilation error, a WebDriver setup error, or a UI timeout?\n2) **Environment Differences:**\n    - *Headless Mode:* Jenkins runs in headless mode (no physical monitor). Headless browsers render slightly differently. I run the test headless on my local machine to reproduce the failure.\n    - *Resolution:* Jenkins defaults to a small resolution (e.g., 800x600). Elements might overlap. I force `--window-size=1920,1080` in my driver options.\n    - *Java/Maven Versions:* I check if my local uses Java 17 but the Jenkins agent has Java 11. I verify versions using `sh "java -version"` in the pipeline.\n3) **Network & Firewalls:** Jenkins agents are often in secure subnets. Does the agent have access to the QA environment URL? Does it need a proxy? I add a simple `sh "curl -I https://qa-env.com"` to the pipeline to test connectivity.\n4) **Screenshots/Video:** I check the Allure report generated by Jenkins to see the screenshot taken exactly at the point of failure. This usually instantly reveals if the page didn\'t load, or if a popup blocked the screen.\n\nUsually, enforcing a strict 1920x1080 window size and ensuring the agent is on the correct VPN solves 90% of these issues.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Issue Area | Local Environment | Jenkins CI Environment |\n| :--- | :--- | :--- |\n| **Display** | Physical Monitor, Full UI | Headless, Virtual Framebuffer (Xvfb) |\n| **Resolution** | 1920x1080 (usually) | Often defaults to 800x600 (Causes elements to hide) |\n| **Network** | Developer VPN | Secure Subnet, strict firewall rules |\n| **Speed** | Fast CPU | Often under-provisioned, causing timeout failures |',
      simpleExplanation: 'It\'s like cooking a dish perfectly in your home kitchen, but it fails in a commercial kitchen. The recipe isn\'t wrong; you just have a different oven, different pots, and different room temperature.',
      realWorldExample: 'N/A',
      projectExample: 'Our UI tests failed in Jenkins with `ElementNotInteractableException`. By checking the Jenkins Allure screenshot, I saw a GDPR Cookie Banner was covering the entire screen in the CI environment because the CI IP address was registered in Europe, whereas my local machine was in the US. I added code to accept the cookie banner, fixing the CI build.',
      codeCommand: '// Fix for Headless Resolution issues (Chrome)\nChromeOptions options = new ChromeOptions();\noptions.addArguments("--headless=new");\noptions.addArguments("--window-size=1920,1080"); // CRITICAL for CI\noptions.addArguments("--disable-dev-shm-usage"); // Fixes memory crashes in Docker/CI\nWebDriver driver = new ChromeDriver(options);',
      expectedOutput: 'N/A',
      followUpQ: 'What does the `--disable-dev-shm-usage` flag do?',
      followUpA: 'In Docker or Jenkins Linux environments, Chrome shares memory in `/dev/shm`. By default, Docker only allocates 64MB to this. When a page is heavy, Chrome crashes with a "Crash Loop" or "Out of Memory" error. This flag forces Chrome to write to `/tmp` instead, preventing the crash.',
      seniorFollowUpQ: 'How do you handle flaky tests that pass 80% of the time in CI but fail 20%?',
      seniorFollowUpA: 'I never use the TestNG RetryAnalyzer to just "hide" the flakiness. I isolate the test and run it 100 times in a loop. I check if the flakiness is due to slow backend data (fix: wait for API), third-party dependency (fix: mock the API), or UI rendering (fix: custom explicit wait). If the test cannot be stabilized, it is deleted or rewritten as an API test.',
      commonMistake: 'Adding `Thread.sleep()` to fix CI failures instead of investigating the root environmental cause.',
      bestPractice: 'Ensure the Jenkins agent environment is as close to the local Docker/Dev environment as possible.'
    }
  ]
};
