AI Agent Reflection

This assignment was a fascinating exercise in "AI-Assisted Development." My partner was an AI (Google Gemini), and my role was a combination of architect, reviewer, and QA tester. Here are my reflections on the process.

What I Learned Using AI Agents

I learned that AI agents are incredibly powerful "generators" but poor "architects." The agent was able to scaffold the entire Hexagonal Architecture, write complex Prisma queries, and build React hooks in seconds. However, it repeatedly failed when it came to maintaining the state and context of the application's domain logic.

For example, the AI generated faulty seed data that made its own POST /pools logic impossible to run. It took a collaborative debugging loop, where I acted as the "runtime" (pasting errors), for the AI to "realize" its own mistake and fix the test data. I also had to catch a critical architecture violation where the AI imported a backend-only package (@prisma/client) into the frontend code.

This taught me the most important lesson: you must be smart enough to debug the AI's code. The AI gets you 90% of the way there, but the last 10% (the bugs) are subtle and require a full understanding of the system.

Efficiency Gains vs. Manual Coding

The efficiency gains are undeniable. I estimate this project would have taken 20-25 hours to complete manually.

Manual: 8-10 hours just on boilerplate: setting up configs, writing server code, creating React state logic, looking up API/library syntax.

Manual: 10-15 hours on the core domain logic (especially the complex POST /pools allocation) and debugging.

With the AI, the project took ~4-5 hours.

AI-Assisted: ~1 hour for all boilerplate and scaffolding.

AI-Assisted: ~3-4 hours purely on debugging the AI's logic.

The AI didn't just reduce the work; it changed the work. Instead of typing, I was validating. Instead of writing, I was reviewing. The bottleneck was no longer my typing speed but my "debug loop" speed—how fast I could run the code, spot the flaw, and ask the AI for a new iteration.

Improvements for Next Time

Use AI for Unit Tests First: My biggest mistake was testing manually with Postman. Next time, I would have the AI generate a jest unit test for every piece of domain logic (like calculateComplianceBalance or allocatePoolSurplus) before I even build the API endpoints. This would have caught the + vs. - bug in the banking logic and the faulty pooling data immediately, saving hours of debugging.

Smaller, More-Focused Prompts: Instead of "build the 'Banking' tab backend," I would be more granular: "Write the IComplianceRepository interface." "Now, write the PrismaComplianceRepository implementation." "Now, write the BankSurplusUseCase." This forces the AI to focus on one file at a time and makes it easier for me to spot errors like the @prisma/client import.

Never Trust, Always Verify: I learned to read every single line of AI-generated code before running it. The AI is a "shotgun" that generates code based on patterns, not on a deep understanding of my specific project's rules. My job is to be the "sniper" that finds the one line that's wrong.