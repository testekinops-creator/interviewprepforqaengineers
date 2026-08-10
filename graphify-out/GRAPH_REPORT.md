# Graph Report - C:\Users\Deepak.Hegde\Downloads\Selmium and automation  (2026-08-10)

## Corpus Check
- 49 files · ~127,225 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 58 nodes · 15 edges · 43 communities (42 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Excel Workbook Export
- Workbook Verification
- Package Dependencies
- Application Controller

## God Nodes (most connected - your core abstractions)
1. `exceljs` - 2 edges
2. `QAApp` - 1 edges
3. `fs` - 1 edges
4. `path` - 1 edges
5. `ExcelJS` - 1 edges
6. `exceljs` - 1 edges
7. `workbookPath` - 1 edges
8. `outputDir` - 1 edges
9. `targetSheets` - 1 edges
10. `checks` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (43 total, 1 thin omitted)

### Community 0 - "Excel Workbook Export"
Cohesion: 0.40
Nodes (3): ExcelJS, fs, path

### Community 1 - "Workbook Verification"
Cohesion: 0.40
Nodes (4): checks, outputDir, targetSheets, workbookPath

### Community 3 - "Package Dependencies"
Cohesion: 0.50
Nodes (3): exceljs, dependencies, exceljs

## Knowledge Gaps
- **9 isolated node(s):** `QAApp`, `fs`, `path`, `ExcelJS`, `exceljs` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `QAApp`, `fs`, `path` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._