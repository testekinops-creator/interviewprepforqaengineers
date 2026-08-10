/* ═══════════════════════════════════════════════════════════════
   sql-coding.js — SQL Coding Problems
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['sql-coding'] = {
  title: '💻 SQL Coding',
  description: 'SQL coding problems commonly asked in SDET interviews — queries, data analysis, and problem solving',
  questions: [
    {
      id: 'SQC001',
      category: 'SQL Coding',
      topic: 'Problems',
      subtopic: 'Find Duplicates',
      question: 'Write a SQL query to find duplicate records in a table.',
      whyAsked: 'Very common interview coding question.',
      difficulty: 3,
      importance: 'must',
      interviewType: 'Coding',
      thirtySecAnswer: 'Use GROUP BY with HAVING COUNT(*) > 1 to find duplicate values. SELECT column, COUNT(*) FROM table GROUP BY column HAVING COUNT(*) > 1.',
      interviewAnswer: 'Finding duplicates is a fundamental SQL task. The approach: GROUP BY the column(s) that should be unique, then filter with HAVING COUNT(*) > 1. For simple duplicates on one column: `SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1`. For duplicates across multiple columns: `SELECT first_name, last_name, COUNT(*) FROM users GROUP BY first_name, last_name HAVING COUNT(*) > 1`. To see the actual duplicate records (not just counts): use a subquery or self-join. In testing, I check for duplicates after data migration, bulk imports, or when investigating data integrity issues.',
      detailedExplanation: 'To delete duplicates keeping one: DELETE FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email). Or use ROW_NUMBER() in databases that support window functions.',
      simpleExplanation: 'Finding duplicates is like checking a guest list for repeat names — group by name, count, and flag anyone appearing more than once.',
      realWorldExample: 'After data migration from old system to new: check for duplicate email addresses that shouldn\'t exist due to unique constraint.',
      projectExample: 'During data migration testing, I found 200+ duplicate user records using this query. The duplicates were caused by a bug in the migration script that ran the same batch twice.',
      codeCommand: '-- Find duplicate emails\nSELECT email, COUNT(*) as count\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;\n\n-- Find actual duplicate rows\nSELECT * FROM users\nWHERE email IN (\n  SELECT email FROM users\n  GROUP BY email HAVING COUNT(*) > 1\n)\nORDER BY email;\n\n-- Using ROW_NUMBER to find and remove duplicates\nWITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER(PARTITION BY email ORDER BY id) as rn\n  FROM users\n)\nSELECT * FROM ranked WHERE rn > 1;',
      expectedOutput: 'List of duplicate records',
      followUpQ: 'How would you delete duplicates keeping the first occurrence?',
      followUpA: 'Using ROW_NUMBER(): DELETE FROM users WHERE id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER(PARTITION BY email ORDER BY id) as rn FROM users) t WHERE rn > 1). This keeps the record with the smallest id and deletes the rest. Alternative: DELETE u1 FROM users u1, users u2 WHERE u1.email = u2.email AND u1.id > u2.id.',
      seniorFollowUpQ: 'How does the performance of GROUP BY compare to ROW_NUMBER() for very large datasets?',
      seniorFollowUpA: 'For finding duplicates, `GROUP BY ... HAVING` is generally faster and uses less memory than `ROW_NUMBER() OVER(...)`. Window functions require sorting the entire dataset partition, which can spill to disk if memory is constrained. However, for *deleting* duplicates while retaining a specific row, window functions are often more robust and easier to read.',
      commonMistake: 'Forgetting HAVING and trying to use WHERE with aggregate functions.',
      bestPractice: 'Always use GROUP BY + HAVING for duplicate detection. Use window functions for more complex duplicate handling.'
    },
    {
      id: 'SQC004',
      category: 'SQL Coding',
      topic: 'Problems',
      subtopic: 'Written Test - Null Handling',
      question: 'WRITTEN TEST: What is the output of `SELECT COUNT(*)` vs `SELECT COUNT(column_name)` if the column contains NULL values?',
      whyAsked: 'Tests fundamental understanding of how SQL aggregate functions handle NULLs.',
      difficulty: 2,
      importance: 'must',
      interviewType: 'Written Test',
      thirtySecAnswer: '`COUNT(*)` counts all rows in the table regardless of NULLs. `COUNT(column_name)` counts only the rows where `column_name` is NOT NULL.',
      interviewAnswer: 'This is a classic SQL gotcha. \n\n`COUNT(*)` counts the total number of rows in the result set, including rows that contain NULL values. It is generally the fastest way to get a total row count.\n\n`COUNT(column_name)` counts only the non-null values in that specific column. \n\nFor example, if I have a `users` table with 10 rows, and 3 users do not have a phone number (phone is NULL): `SELECT COUNT(*) FROM users` returns 10. `SELECT COUNT(phone) FROM users` returns 7. As a QA, understanding this difference is critical when writing data validation scripts, otherwise you might report incorrect totals.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | `COUNT(*)` | `COUNT(column_name)` |\n| :--- | :--- | :--- |\n| **What it counts** | Rows | Non-NULL values in the column |\n| **Includes NULLs?**| Yes | No |\n| **Performance** | Optimized by DB engine (often uses indexes) | Slightly slower (has to evaluate each row\'s value) |',
      simpleExplanation: '`COUNT(*)` asks "How many people are in the room?". `COUNT(phone)` asks "How many people in the room have a phone?".',
      realWorldExample: 'N/A',
      projectExample: 'While validating an analytics dashboard, the UI showed 5,000 active users, but my SQL query `SELECT COUNT(last_login_date)` showed 4,800. The discrepancy was because 200 users had just registered and never logged in, so their `last_login_date` was NULL. Using `COUNT(*)` fixed my validation script.',
      codeCommand: '-- Table has 5 rows, 2 have NULL in the "age" column\n\nSELECT COUNT(*) FROM employees; \n-- Output: 5\n\nSELECT COUNT(age) FROM employees;\n-- Output: 3',
      expectedOutput: 'N/A',
      followUpQ: 'How does `SUM(column_name)` handle NULL values?',
      followUpA: 'Like most aggregate functions, `SUM` ignores NULL values entirely. It just adds up the non-null numbers. However, if EVERY row in the column is NULL, `SUM` returns NULL, not 0.',
      seniorFollowUpQ: 'What happens if you run `SELECT COUNT(1) FROM table`?',
      seniorFollowUpA: '`COUNT(1)` is functionally identical to `COUNT(*)`. The database engine optimizes them exactly the same way. The myth that `COUNT(1)` is faster than `COUNT(*)` is outdated; modern query optimizers treat them as the exact same instruction to count rows.',
      commonMistake: 'Assuming `COUNT(column)` will return the same number as `COUNT(*)`.',
      bestPractice: 'Always use `COUNT(*)` when you just want the total number of rows.'
    }
  ]
};
