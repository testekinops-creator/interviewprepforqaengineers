const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function generateExcel() {
    console.log("Starting Excel generation...");
    
    // 1. Gather all data from existing .js files
    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js')).sort();
    
    // We will create a fake context to execute the JS files and capture defined_sections
    let defined_sections = {};
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
            // Remove 'var defined_sections = defined_sections || {};' to prevent re-declaration issues in eval
            const cleanedContent = content.replace(/var defined_sections = defined_sections \|\| \{\};/g, '');
            // Execute in local scope
            eval(cleanedContent);
            console.log(`Loaded data from ${file}`);
        } catch (e) {
            console.error(`Failed to load ${file}:`, e.message);
        }
    }

    // Combine all questions from all sections into one flat list
    let allQuestions = [];
    for (const key in defined_sections) {
        if (defined_sections[key].questions) {
            allQuestions = allQuestions.concat(defined_sections[key].questions.map(question => ({
                ...question,
                _section: key
            })));
        }
    }
    
    console.log(`Loaded a total of ${allQuestions.length} questions from web app.`);

    // 2. Setup Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'QA Interview Bible';
    workbook.created = new Date();

    // 3. Define the 102 Requested Sheets
    const sheetNames = [
        "README", "Interview Strategy", "30-Day Preparation Plan", "7-8 Year Skill Matrix", "Manual Testing",
        "STLC & SDLC", "Test Case Design", "Defect Management", "Agile & Scrum", "Selenium Fundamentals",
        "Selenium Locators", "XPath", "CSS Selectors", "Selenium WebElements", "Selenium Waits",
        "Selenium Alerts", "Selenium Frames", "Selenium Windows & Tabs", "Selenium Actions", "Selenium JSExecutor",
        "Selenium Cookies", "Selenium Screenshots", "Selenium Exceptions", "Selenium Advanced", "Java Core",
        "Java OOP", "Java Collections", "Java Strings", "Java Exception Handling", "Java Coding Programs",
        "TestNG", "Maven", "Automation Framework", "POM", "Data Driven Framework",
        "Hybrid Framework", "Framework Architecture", "Framework Design Questions", "Playwright Fundamentals", "Playwright Locators",
        "Playwright Auto-Waiting", "Playwright Assertions", "Playwright Context", "Playwright Tabs Windows", "Playwright Frames",
        "Playwright Dialogs", "Playwright Mouse Keyboard", "Playwright File Transfer", "Playwright Trace", "Playwright API Testing",
        "Playwright Fixtures", "Playwright Hooks", "Playwright Parallelism", "Playwright Projects", "Playwright Configuration",
        "Playwright Authentication", "Playwright POM", "Playwright Framework", "Playwright Coding", "Playwright Commands",
        "API Testing", "HTTP Methods", "HTTP Status Codes", "REST API", "Postman",
        "REST Assured", "API Automation Coding", "API Scenarios", "API Security Basics", "API Performance",
        "SQL", "SQL Coding", "Database Testing", "API DB Validation", "Git",
        "Git Commands", "Git Scenarios", "Git Conflict Resolution", "Linux Commands", "Linux QA Scenarios",
        "Jenkins", "CI-CD", "Maven Jenkins", "Git Jenkins", "Docker Basics",
        "Cloud Testing Basics", "JIRA", "Agile Scrum Adv", "Senior Scenarios", "Production Issues",
        "Debugging Scenarios", "Coding Round", "Automation Practical", "API Practical", "SQL Practical",
        "Tricky Questions", "Project Questions", "Resume Questions", "Mock Interview", "Top 200 Must-Know",
        "Quick Revision", "Final Checklist", "Selenium Browser Handling", "Advanced SQL",
        "Framework Reporting CI", "Playwright Assertions Fixtures", "Request Response",
        "API Authentication", "QA Strategy Metrics", "Command Cheat Sheet", "Top 50 Senior QA"
    ];

    const sheetSectionMap = {
        "Selenium Browser Handling": "selenium-browser-handling",
        "Advanced SQL": "sql-advanced",
        "Data Driven Framework": "data-driven",
        "Hybrid Framework": "hybrid-framework",
        "Framework Reporting CI": "framework-operations",
        "Playwright Assertions Fixtures": "pw-assertions-fixtures",
        "Request Response": "api-request-response",
        "API Authentication": "api-auth",
        "QA Strategy Metrics": "qa-metrics",
        "Command Cheat Sheet": "cheat-sheet",
        "Top 50 Senior QA": "top-50-senior",
        "Top 200 Must-Know": "top-200"
    };

    const standardColumns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Topic', key: 'topic', width: 20 },
        { header: 'Subtopic', key: 'subtopic', width: 20 },
        { header: 'Question', key: 'question', width: 50 },
        { header: 'Why Interviewer Asks', key: 'whyAsked', width: 40 },
        { header: 'Difficulty', key: 'difficulty', width: 10 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Interview Type', key: 'interviewType', width: 15 },
        { header: '30-Second Answer', key: 'thirtySecAnswer', width: 50 },
        { header: 'Interview Answer', key: 'interviewAnswer', width: 70 },
        { header: 'Detailed Explanation', key: 'detailedExplanation', width: 70 },
        { header: 'Simple Explanation', key: 'simpleExplanation', width: 40 },
        { header: 'Real-World Example', key: 'realWorldExample', width: 50 },
        { header: 'Project Example', key: 'projectExample', width: 50 },
        { header: 'Code / Command', key: 'codeCommand', width: 50 },
        { header: 'Expected Output', key: 'expectedOutput', width: 30 },
        { header: 'Follow-Up Question', key: 'followUpQ', width: 40 },
        { header: 'Follow-Up Answer', key: 'followUpA', width: 40 },
        { header: 'Senior-Level Follow-Up', key: 'seniorFollowUpQ', width: 40 },
        { header: 'Senior-Level Answer', key: 'seniorFollowUpA', width: 50 },
        { header: 'Common Mistake', key: 'commonMistake', width: 40 },
        { header: 'Best Practice', key: 'bestPractice', width: 40 },
        { header: 'My Notes', key: 'myNotes', width: 30 },
        { header: 'Preparation Status', key: 'preparationStatus', width: 20 }
    ];

    // Helper to format header row
    const styleHeader = (worksheet) => {
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004B87' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.views = [{ state: 'frozen', ySplit: 1 }]; // Freeze top row
        // Enable filtering for the header row
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: standardColumns.length }
        };
    };

    // Helper to style all cells
    const styleCells = (worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber > 1) {
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.alignment = { wrapText: true, vertical: 'top' };
                });
            }
        });
    };

    // Special handling for informational sheets
    const createInfoSheet = (name, title, content) => {
        const sheet = workbook.addWorksheet(name);
        sheet.getColumn(1).width = 100;
        sheet.getCell('A1').value = title;
        sheet.getCell('A1').font = { size: 16, bold: true };
        
        let rowIdx = 3;
        content.forEach(line => {
            sheet.getCell(`A${rowIdx}`).value = line;
            sheet.getCell(`A${rowIdx}`).alignment = { wrapText: true };
            rowIdx++;
        });
    };

    createInfoSheet("README", "QA Automation Engineer Interview Bible (7-8 Years)", [
        "This workbook contains the ultimate preparation material for a Senior QA Automation Engineer.",
        "It was generated specifically for candidates with 7-8 years of experience covering Selenium, Playwright, Java, API, SQL, CI/CD, and more.",
        "",
        "Instructions:",
        "- Use the 'Preparation Status' column to track your progress.",
        "- Review the 'Senior-Level Follow-Up' for deep-dive questions.",
        "- Practice writing the code in the 'Code / Command' column by hand before interviews."
    ]);

    createInfoSheet("30-Day Preparation Plan", "Recommended 30-Day Study Plan", [
        "Week 1: Core Automation (Selenium, Playwright, Framework Design)",
        "Week 2: Programming & Logic (Java Core, Collections, Coding Rounds)",
        "Week 3: Backend & Data (API Testing, REST Assured, SQL, DB Testing)",
        "Week 4: DevOps & Soft Skills (Git, Jenkins, Linux, Mock Interviews, Agile)"
    ]);

    // Create question sheets
    for (let i = 4; i < sheetNames.length; i++) {
        const sheetName = sheetNames[i];
        // Skip duplicate or informational sheets we want formatted differently if needed
        const sheet = workbook.addWorksheet(sheetName);
        sheet.columns = standardColumns;
        styleHeader(sheet);

        // Try to route existing questions into the relevant sheets
        // A very simple keyword matching routing
        const matchedQuestions = allQuestions.filter(q => {
            const mappedSection = sheetSectionMap[sheetName];
            if (mappedSection) return q._section === mappedSection;

            const cat = q.category ? q.category.toLowerCase() : '';
            const sub = q.subtopic ? q.subtopic.toLowerCase() : '';
            const top = q.topic ? q.topic.toLowerCase() : '';
            const target = sheetName.toLowerCase();
            
            // Map web app categories to sheet names roughly
            if (target.includes("selenium") && cat.includes("selenium")) return true;
            if (target.includes("playwright") && cat.includes("playwright")) return true;
            if (target.includes("java") && cat.includes("java")) return true;
            if (target.includes("api") && (cat.includes("api") || cat.includes("rest"))) return true;
            if (target.includes("sql") && cat.includes("sql")) return true;
            if (target.includes("git") && cat.includes("git")) return true;
            if (target.includes("linux") && cat.includes("linux")) return true;
            if (target.includes("jenkins") && cat.includes("jenkins")) return true;
            if (target.includes("docker") && cat.includes("docker")) return true;
            if (target.includes("manual") && cat.includes("manual")) return true;
            if (target.includes("agile") && cat.includes("agile")) return true;
            if (target.includes("maven") && cat.includes("maven")) return true;
            if (target.includes("testng") && cat.includes("testng")) return true;
            if (target.includes("coding") && cat.includes("coding")) return true;
            
            // Catch-all exact matches
            return target.includes(cat) || target.includes(top);
        });

        matchedQuestions.forEach(q => {
            sheet.addRow({
                id: q.id || 'NEW-001',
                category: q.category || 'TBD',
                topic: q.topic || 'TBD',
                subtopic: q.subtopic || 'TBD',
                question: q.question || '',
                whyAsked: q.whyAsked || '',
                difficulty: q.difficulty || 3,
                importance: q.importance || 'IMPORTANT',
                interviewType: q.interviewType || 'Technical',
                thirtySecAnswer: q.thirtySecAnswer || '',
                interviewAnswer: q.interviewAnswer || '',
                detailedExplanation: q.detailedExplanation || '',
                simpleExplanation: q.simpleExplanation || '',
                realWorldExample: q.realWorldExample || '',
                projectExample: q.projectExample || '',
                codeCommand: q.codeCommand || '',
                expectedOutput: q.expectedOutput || '',
                followUpQ: q.followUpQ || '',
                followUpA: q.followUpA || '',
                seniorFollowUpQ: q.seniorFollowUpQ || 'How would you scale this solution for 1000s of parallel executions?',
                seniorFollowUpA: q.seniorFollowUpA || 'I would implement distributed execution using cloud providers, implement strict test isolation, and use stateless APIs for data setup.',
                commonMistake: q.commonMistake || '',
                bestPractice: q.bestPractice || '',
                myNotes: '',
                preparationStatus: 'Not Started'
            });
        });

        styleCells(sheet);
    }

    // Save workbook
    const outputPath = path.join(__dirname, 'QA_Interview_Bible_7_8_Years.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Excel workbook generated successfully at: ${outputPath}`);
}

generateExcel().catch(err => {
    console.error("Error generating Excel:", err);
});
