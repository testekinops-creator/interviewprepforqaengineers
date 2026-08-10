/* ═══════════════════════════════════════════════════════════════
   api-testing.js — API Testing Fundamentals
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['api-fundamentals'] = {
  title: '🌐 API Testing',
  description: 'REST principles, Status Codes, Authentication, and Automation strategies',
  questions: [
    {
      id: 'API001',
      category: 'API Testing',
      topic: 'Comparison',
      subtopic: 'REST Assured vs Postman',
      question: 'WRITTEN TEST: What are the main differences between using Postman and REST Assured for API Automation?',
      whyAsked: 'Determines if you understand when to use a GUI tool vs a code-based framework.',
      difficulty: 2,
      importance: 'must',
      interviewType: 'Written Test',
      thirtySecAnswer: 'Postman is a GUI-based client excellent for exploratory testing and manual API execution. REST Assured is a Java library used to write API tests in code, which integrates natively with TestNG, Maven, and CI/CD pipelines.',
      interviewAnswer: 'For quick exploratory testing, debugging, or sharing API collections with developers, I use **Postman**. It has a great UI and handles environments well.\n\nHowever, for an enterprise automation framework, I use **REST Assured** (Java). REST Assured allows me to write tests in code, which means I can integrate them seamlessly with my UI tests (e.g., using API to set up test data before a Selenium UI test), store them in version control (Git) easily, and execute them as part of my Maven `pom.xml` lifecycle in Jenkins. Postman *can* be automated using Newman, but it remains isolated from my Java UI framework.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | Postman (with Newman) | REST Assured (Java) |\n| :--- | :--- | :--- |\n| **Interface** | GUI | Code (Java Library) |\n| **Best For** | Manual testing, rapid debugging | E2E Frameworks, CI/CD integration |\n| **Version Control** | JSON exports (hard to read diffs) | Standard Java files (easy to review) |\n| **UI Integration** | Very difficult | Native (can use same Java framework) |\n| **Custom Logic**| Limited to JS sandbox | Full power of Java & external libraries |',
      simpleExplanation: 'Postman is like a calculator with buttons. REST Assured is like writing a Python script to do math automatically on thousands of files.',
      realWorldExample: 'N/A',
      projectExample: 'In my last project, the dev team used Postman to document APIs. I exported their Postman collection to understand the endpoints, but I built the actual nightly regression suite using REST Assured so I could tie the API responses into our existing SQL database validation utilities.',
      codeCommand: '// Postman Test Script (JavaScript)\npm.test("Status code is 200", function () {\n    pm.response.to.have.status(200);\n});\n\n// REST Assured (Java)\ngiven().when().get("/api/users").then().statusCode(200);',
      expectedOutput: 'N/A',
      followUpQ: 'How do you handle dynamic data extraction in REST Assured vs Postman?',
      followUpA: 'In Postman, you extract data in the "Tests" tab using `pm.response.json().data.id` and save it to a global variable: `pm.globals.set("userId", id)`. In REST Assured, you use JsonPath: `String id = response.jsonPath().getString("data.id");` and store it in a Java class variable or ThreadLocal variable for parallel execution.',
      seniorFollowUpQ: 'If you have a 500-test Postman collection, how do you integrate it into a Jenkins pipeline without rewriting it to REST Assured?',
      seniorFollowUpA: 'I would use `newman`, the CLI companion for Postman. I would export the Collection and Environment JSON files, place them in the Git repository, and run `newman run collection.json -e env.json --reporters cli,html` in the Jenkins shell step.',
      commonMistake: 'Claiming Postman cannot be automated (it can via Newman).',
      bestPractice: 'Use Postman for exploratory testing and dev handoffs. Use REST Assured for robust, integrated E2E automation.'
    },
    {
      id: 'API002',
      category: 'API Testing',
      topic: 'Comparison',
      subtopic: 'PUT vs PATCH',
      question: 'What is the exact difference between PUT and PATCH methods?',
      whyAsked: 'Extremely common API interview question. Tests your understanding of idempotency and REST principles.',
      difficulty: 2,
      importance: 'must',
      interviewType: 'Technical',
      thirtySecAnswer: 'PUT is used for a complete replacement of a resource. If fields are missing in the request body, they are updated to null. PATCH is used for partial updates, modifying only the fields provided without affecting the rest.',
      interviewAnswer: 'In REST architecture, **PUT** replaces the entire resource. If I send a PUT request to update a user\'s email, I must also include their name, phone, and address in the payload. If I omit them, the server will either throw a 400 error or set those missing fields to null.\n\n**PATCH**, on the other hand, is a partial update. If I only want to change the email, I send a PATCH request with just the `{"email": "new@email.com"}` payload, and the server updates only that field while leaving the rest of the user\'s data intact.\n\nFrom a testing perspective, when testing a PUT endpoint, I must verify that *all* fields were updated correctly. When testing PATCH, I verify the specific field updated, and explicitly verify that the *other* fields did not change.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | PUT | PATCH |\n| :--- | :--- | :--- |\n| **Action** | Complete Replacement | Partial Update |\n| **Payload** | Full object representation | Only fields to be changed |\n| **Idempotent** | Yes (Calling it 10x has same result as 1x) | Not necessarily (depends on implementation) |\n| **Bandwidth** | Heavier (sends all data) | Lighter (sends partial data) |',
      simpleExplanation: 'PUT is like buying a whole new car because your tire went flat. PATCH is like just replacing the flat tire.',
      realWorldExample: 'Updating your profile picture. PUT would require you to upload your picture AND type in your name, bio, and password again. PATCH just requires the picture.',
      projectExample: 'I found a bug where a frontend dev was using PUT to update a user\'s status to "Active", but failing to pass the `createdAt` timestamp. The PUT request caused the database `createdAt` field to get overwritten with NULL.',
      codeCommand: '// PUT Payload (Must send everything)\n{\n  "id": 1,\n  "name": "John",\n  "email": "john@new.com",\n  "role": "admin"\n}\n\n// PATCH Payload (Send only what changes)\n{\n  "email": "john@new.com"\n}',
      expectedOutput: 'N/A',
      followUpQ: 'What does "Idempotent" mean in the context of REST APIs?',
      followUpA: 'Idempotency means that making multiple identical requests has the same effect as making a single request. GET, PUT, and DELETE are idempotent. If you DELETE a user 10 times, the end state is the same (the user is gone). POST is NOT idempotent — if you POST 10 times, you create 10 new users.',
      seniorFollowUpQ: 'Can a POST request be idempotent?',
      seniorFollowUpA: 'By default, no. However, in distributed systems (like payment processing), engineers often make POST requests idempotent by including an "Idempotency-Key" in the header. If the server sees a POST request with an Idempotency-Key it has already processed, it returns the cached response instead of charging the credit card a second time.',
      commonMistake: 'Saying PUT creates and PATCH updates.',
      bestPractice: 'Always verify idempotency behavior when testing APIs.'
    }
  ]
};
