/* ═══════════════════════════════════════════════════════════════
   git.js — Version Control (Git)
   ═══════════════════════════════════════════════════════════════ */
var defined_sections = defined_sections || {};

defined_sections['git'] = {
  title: '🔀 Git & Version Control',
  description: 'Git branching, conflict resolution, rebase vs merge, and team collaboration workflows',
  questions: [
    {
      id: 'GIT001',
      category: 'Git',
      topic: 'Comparison',
      subtopic: 'Merge vs Rebase',
      question: 'What is the exact difference between `git merge` and `git rebase`?',
      whyAsked: 'Crucial for understanding how to integrate code cleanly in a team environment.',
      difficulty: 3,
      importance: 'must',
      interviewType: 'Technical',
      thirtySecAnswer: '`git merge` combines two branches by creating a new "merge commit" that ties their histories together, preserving the exact chronological history. `git rebase` rewrites the project history by moving the base of your branch to the tip of the target branch, creating a perfectly linear history without merge commits.',
      interviewAnswer: 'In our automation repository, multiple SDETs are pushing code simultaneously. \n\nWhen I need to pull the latest changes from `main` into my feature branch, I have two choices: Merge or Rebase.\n\nIf I use `git merge main`, Git creates a new commit that says "Merged main into feature-branch". It preserves the exact history of what happened and when, but if 10 testers do this every day, the commit graph looks like a messy spiderweb.\n\nIf I use `git rebase main`, Git temporarily removes my local commits, fast-forwards my branch to match the latest `main`, and then reapplies my commits on top. This results in a beautifully clean, linear history. \n\nThe golden rule: I **rebase** when updating my local, private feature branch to keep history clean. But I **never rebase** a public branch (like `main`) that other people are using, because rewriting shared history will break their local repositories.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| Feature | `git merge` | `git rebase` |\n| :--- | :--- | :--- |\n| **History** | Preserves exact chronological history | Rewrites history to be linear |\n| **Commits** | Creates a new "Merge Commit" | No extra merge commit is created |\n| **Conflict Resolution**| Resolves all conflicts at once in the merge commit | Resolves conflicts one commit at a time as they are reapplied |\n| **Safety** | Very safe, non-destructive | Destructive (changes commit SHAs) |\n| **Rule of Thumb**| Use when merging feature into `main` (via PR) | Use when updating your local feature branch from `main` |',
      simpleExplanation: 'Merge is like sewing two pieces of fabric together (you can see the stitch). Rebase is like un-stitching your work, moving to a new starting point, and stitching it back exactly the same way (no visible seam).',
      realWorldExample: 'Updating your local test script branch with the latest framework utility updates pushed by the architect this morning.',
      projectExample: 'Our team adopted a "Rebase-only" policy for local branches. Before opening a Pull Request, every SDET must run `git pull --rebase origin main`. This eliminated the clutter of "Merge branch main" commits and made reverting bad automation code much easier.',
      codeCommand: '// To merge main into your branch\ngit checkout feature-branch\ngit merge main\n\n// To rebase your branch onto main\ngit checkout feature-branch\ngit rebase main',
      expectedOutput: 'N/A',
      followUpQ: 'What happens if you have conflicts during a rebase?',
      followUpA: 'Unlike a merge where you fix everything at once, rebase pauses at the specific commit that caused the conflict. You fix the conflict in your IDE, stage the changes (`git add`), and then run `git rebase --continue`. You DO NOT run `git commit` during a rebase conflict resolution.',
      seniorFollowUpQ: 'Explain `git cherry-pick`.',
      seniorFollowUpA: '`git cherry-pick <commit-hash>` takes the exact changes introduced in a specific commit from another branch and applies them to your current branch. It is highly useful if someone fixed a critical framework bug in their feature branch, and you need that fix in your branch immediately without merging their unfinished tests.',
      commonMistake: 'Rebasing a public branch (like main) that others have already pulled, causing massive synchronization headaches for the team.',
      bestPractice: 'Always rebase private branches. Always merge public branches.'
    },
    {
      id: 'GIT002',
      category: 'Git',
      topic: 'Troubleshooting',
      subtopic: 'Written Test - Detached HEAD',
      question: 'WRITTEN TEST: You see the message "You are in detached HEAD state". What does this mean, and how do you fix it?',
      whyAsked: 'Tests practical Git troubleshooting skills. Very common issue for juniors.',
      difficulty: 2,
      importance: 'must',
      interviewType: 'Written Test',
      thirtySecAnswer: 'Detached HEAD means your Git checkout is pointing directly to a specific commit hash rather than a branch name. Any commits made now will be orphaned. To fix it, you either switch back to a branch (`git checkout main`) or create a new branch from this state (`git checkout -b new-branch`).',
      interviewAnswer: 'A "detached HEAD" state occurs when you checkout a specific commit hash, a remote branch, or a tag, instead of a local branch (e.g., `git checkout a1b2c3d`).\n\nNormally, the HEAD pointer points to a branch name (like `main`), which points to the latest commit. In detached HEAD, you are detached from the branch structure. \n\n**The Danger:** If you write new test code and commit it in this state, the commit belongs to NO branch. If you checkout another branch later, those commits become "orphaned" and Git will eventually delete them during garbage collection.\n\n**The Fix:**\n1) If you just wanted to look at old code and don\'t want to save anything: `git checkout main` to go back.\n2) If you wrote code and want to save it: `git checkout -b my-saved-work` to immediately create a branch that points to your new commits, re-attaching the HEAD.',
      detailedExplanation: 'SIDE-BY-SIDE COMPARISON:\n\n| State | Attached HEAD | Detached HEAD |\n| :--- | :--- | :--- |\n| **Points to** | A branch reference (e.g., `refs/heads/main`) | A specific commit SHA (e.g., `9fceb02`) |\n| **New Commits**| Automatically advance the branch pointer | Belong to no branch (will be lost) |\n| **How it happens**| `git checkout feature` | `git checkout 9fceb02` or checking out a tag |',
      simpleExplanation: 'It means you stepped off the moving train (branch) onto the platform (a specific point in time). If you build a suitcase on the platform, the train won\'t take it when it leaves unless you put it on a new train (create a new branch).',
      realWorldExample: 'You wanted to run the automation suite exactly as it was 2 weeks ago to see if a bug existed back then, so you checked out an old commit hash.',
      projectExample: 'A junior QA panicked because they lost an entire day of test script writing. They had checked out a tag, committed code, and then checked out `main`. I used `git reflog` to find the orphaned commit hash, checked it out, and created a new branch from it to recover their work.',
      codeCommand: '// Enter detached head\ngit checkout 5a4b3c2\n\n// Recover work from detached head\ngit checkout -b fix-branch',
      expectedOutput: 'N/A',
      followUpQ: 'How do you find an orphaned commit if you already switched branches and lost it?',
      followUpA: 'You use `git reflog`. It is a diary of every time the HEAD pointer moved on your local machine, regardless of branches. You find the hash of your lost commit in the reflog, and run `git checkout -b recovered-branch <hash>`.',
      seniorFollowUpQ: 'What is the difference between `git reset` and `git revert`?',
      seniorFollowUpA: '`git reset` moves the branch pointer backward, effectively erasing history (destructive, do not use on public branches). `git revert` creates a brand *new* commit that undoes the changes of a previous commit, moving history forward (safe for public branches).',
      commonMistake: 'Committing work in detached HEAD state and losing it.',
      bestPractice: 'Always ensure `git status` says "On branch X" before writing code.'
    }
  ]
};
