AI Agent Workflow Log

This document details how AI agents were leveraged as specialized tools to accelerate the development of the FuelEU Maritime full-stack project. The core application, architecture, and "stitching" code was written by me, with AI assistance used for complex algorithms, boilerplate, and debugging.

Agents Used

    Google Gemini (Advanced Model): Used as a pair-programming "consultant" for complex business logic, architectural patterns, and debugging non-trivial errors.

    GitHub Copilot: Used for inline code completion (e.g., generating boilerplate for React components, getters/setters, and simple functions).

Prompts & Outputs

    My workflow involved writing the majority of the code manually and querying the AI when I hit a specific, complex blocker.

    Example 1: Generating Complex Domain Logic (Pooling)

    The "Pooling" (Article 21) logic is complex and stateful. I prompted Gemini to generate only this difficult algorithm, which I then integrated into my manually-written CreatePoolUseCase.

    My Prompt:

    "Write a pure TypeScript function allocatePoolSurplus. It takes an array of pool members, each with ship_id and cb_before. It must perform a greedy allocation based on these rules:

    The total sum of cb_before for all members must be >= 0.

    Sort members descending by cb_before.

    Transfer surplus from positive-CB members to negative-CB members.

    Enforce two rules: A deficit ship (cb < 0) cannot exit with a worse balance. A surplus ship (cb > 0) cannot exit with a negative balance.

    Return a new array of all members with their ship_id, cb_before, and cb_after."

Agent (Gemini) Output (Snippet):
    The agent generated the allocatePoolSurplus function. I did not ask it to write the controller, use case, or repository, which I implemented myself.

    // Generated function from Gemini:
    export function allocatePoolSurplus(
    members: PoolMemberInput[]
    ): PoolMemberResult[] {
    
    // --- 1. Validation: Check Rule 1 (Sum >= 0) ---
    const totalPoolBalance = members.reduce(
        (sum, m) => sum + m.cb_before,
        0
    );

    if (totalPoolBalance < 0) {
        throw new Error(
        `Pool is invalid. Total Compliance Balance is ${totalPoolBalance.toFixed(
            2
        )}, which is less than 0.`
        );
    }

    // --- 2. Separate and Sort ---
    const memberMap = new Map<string, PoolMemberResult>(
        // ... (logic) ...
    );
    // ... (more generated logic) ...
    }



    Example 2: Debugging Obscure Configuration

    When building the frontend, I encountered a series of cascading TypeScript errors related to verbatimModuleSyntax. This is a non-trivial configuration issue.

    My Prompt (pasting a runtime error):

    "'IRouteApi' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
    This syntax is not allowed when 'erasableSyntaxOnly' is enabled."

Agent (Gemini) Output (Analysis & Fix):
    The agent correctly identified this as a tsconfig.json issue, not a code issue, which saved significant research time.

    This is the most frustrating error in modern TypeScript... It's a new, overly-strict rule that makes this much harder than it needs to be.

    Let's fix this permanently with the easiest, one-time fix:

    Go to your /frontend folder.

    Open your tsconfig.json file.

    Find this line: "verbatimModuleSyntax": true,

    DELETE that entire line and save the file.

Validation / Corrections

    The AI-generated code was never trusted. It was treated as a "suggestion" that I had to validate and integrate.

    Manual Integration: I wrote the CreatePoolUseCase and PoolController manually. I then imported the AI-generated allocatePoolSurplus function and called it from my use case.

    Logic Correction: The AI's first version of the banking logic (cb_after: rawCB + yearTransactionSum) was incorrect. I spotted this logical flaw during testing, as it produced the wrong result (cb_after was doubled instead of zeroed out). I manually corrected this to cb_after: rawCB - yearTransactionSum.

    Data Validation: The AI's first seed.ts file had test data that made the pooling logic impossible (total balance was negative). I had to prompt the AI to analyze its own mistake and provide a corrected seed file.

Observations

Where AI saved time

    Complex Algorithms: Generating the allocatePoolSurplus function saved at least an hour of writing and debugging complex, stateful sorting and iteration logic.

    Obscure Errors: Debugging the tsconfig.json issue would have taken significant time googling. The AI identified it instantly.

    Boilerplate: GitHub Copilot was excellent for writing simple table rows (<tr>...<td>) in React and filling out simple class methods.

Where AI failed or hallucinated

    Logical Flaws: The AI consistently made simple domain-logic errors, like using + instead of -. It writes code that looks right but doesn't think right.

    Architectural Blindness: The AI's biggest failure was importing @prisma/client into the React frontend. This is a critical error it couldn't see because it was focused on "making the file work" locally, not on the project's architectural rules. I had to catch this manually.

    Stateful Bugs: The AI created a bug (POST /banking/bank could be run multiple times) and then its next feature was broken by that bug. It required a human to see the stateful connection between the two features.

    How I combined tools effectively

    This was a human-led, AI-assisted workflow.

    Me (Architect): Wrote all file "skeletons" (classes, interfaces) and the "stitching" code (controllers, hooks, App.tsx).

    Gemini (Specialist): Called upon to write specific, difficult pure functions (e.g., allocatePoolSurplus) or debug configuration errors.

Copilot (Assistant): Handled inline boilerplate (e.g., <td>{route.vesselType}</td>).

Best Practices Followed
   
   Human-in-the-Loop: I maintained the role of architect and final reviewer.
   
   Targeted AI Intervention:  I first wrote the architectural skeleton (interfaces, use case classes) myself. Then, I used highly specific prompts to ask the AI to generate the implementation for a single, specific function (e.g., allocatePoolSurplus) or to debug a specific error.

   Manual Integration & Refactoring: All AI-generated code was reviewed and manually integrated into the project. For example, I would ask for an algorithm, review it for logical flaws, and then call it from the UseCase class I had already written.

    Iterative Refinement: I used Postman and the live frontend as my testing harness. When a test failed, I did not ask the AI to "fix the bug." Instead, I diagnosed the issue (e.g., "the pool sum is incorrect") and then asked the AI to refine its specific function based on my diagnosis, iterating until the logic was correct.