/* ═══════════════════════════════════════════════════════════════
   docker-cloud.js — Docker & Cloud Testing Concepts
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['docker-cloud'] = {
  title: '☁️ Docker & Cloud Testing',
  description: 'Containerization, VMs, Cloud Service Models (IaaS, PaaS, SaaS)',
  questions: [
    {
      id: 'DC001',
      category: 'Cloud',
      topic: 'Concepts',
      subtopic: 'Cloud Service Models',
      question: 'What is the difference between IaaS, PaaS, and SaaS in Cloud Computing?',
      whyAsked: 'Ensures the QA understands the environment they are testing and deploying to.',
      difficulty: 2,
      importance: 'important',
      interviewType: 'Technical',
      thirtySecAnswer: 'IaaS provides the raw infrastructure (servers, network). PaaS provides a platform (OS, middleware) where you just deploy code. SaaS provides a fully finished software application to the end user.',
      interviewAnswer: 'In modern cloud computing, responsibilities are shared between you and the cloud provider based on the service model:\n\n**IaaS (Infrastructure as a Service):** You rent the raw VMs, storage, and networking (e.g., AWS EC2). You are responsible for installing the OS, database, and managing everything. It gives maximum control but maximum overhead.\n\n**PaaS (Platform as a Service):** The provider handles the hardware, OS, and middleware. You just bring your code and data (e.g., Heroku, AWS Elastic Beanstalk). This is great for developers who just want to deploy an app without managing servers.\n\n**SaaS (Software as a Service):** A completely finished application managed entirely by the vendor (e.g., Salesforce, Gmail). As a user, you just log in and use it.\n\nAs an SDET, when testing a SaaS product, I focus purely on UI and business logic. When testing on IaaS/PaaS, my pipeline might also need to provision the environment or test infrastructure configurations.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | IaaS | PaaS | SaaS |\n| :--- | :--- | :--- | :--- |\n| **Stands For** | Infrastructure as a Service | Platform as a Service | Software as a Service |\n| **You Manage** | OS, Runtime, Data, Apps | Data, Apps | Nothing (Just use it) |\n| **Provider Manages**| Servers, Storage, Network | Servers, Network, OS, Runtime | Everything |\n| **Examples** | AWS EC2, Azure VMs | Heroku, Google App Engine | Gmail, Salesforce, Slack |',
      simpleExplanation: 'IaaS is renting an empty plot of land to build a house. PaaS is renting a built house but you have to furnish it. SaaS is staying in a fully furnished hotel.',
      realWorldExample: 'N/A',
      projectExample: 'Our application was a SaaS product. However, our Jenkins CI/CD pipeline ran on AWS EC2 instances, which is an IaaS model. I had to write Bash scripts to install Java and Maven on those EC2 instances because we managed the OS.',
      codeCommand: 'N/A',
      expectedOutput: 'N/A',
      followUpQ: 'What is On-Premise?',
      followUpA: 'On-premise means the company owns and manages everything in their own physical data center — the servers, the network, the OS, and the applications. It offers maximum security but requires massive capital investment.',
      seniorFollowUpQ: 'Where does Docker fit into these models?',
      seniorFollowUpA: 'Docker is a containerization technology. It can be run on On-Premise servers, IaaS VMs, or managed via specialized PaaS-like services known as CaaS (Container as a Service), like AWS Fargate or Google Kubernetes Engine (GKE), where you provide the container and the cloud provider runs it without you managing the underlying VMs.',
      commonMistake: 'Confusing PaaS with SaaS.',
      bestPractice: 'Always clarify the environment architecture before designing a test strategy.'
    }
  ]
};
