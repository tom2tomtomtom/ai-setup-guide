# Lesson 18: Claude Agents & Automation - Autonomous Multi-Step Problem Solving
*Master agentic workflows where Claude autonomously completes complex multi-step tasks with reasoning and tool use*

## 💰 The Business Reality

Complex workflows require human oversight:
- **Sequential decision-making tax**: Tasks requiring 5-10 sequential decisions (each dependent on previous results) need human oversight, limiting true automation to simple linear flows
- **Reasoning bottleneck**: Problems requiring deep analysis across multiple sources before deciding next steps can't be automated without humans reading outputs and deciding
- **Orchestration complexity**: Multi-tool workflows (CRM → database → analytics → notification) require humans to orchestrate, creating bottlenecks

Claude Agents enable autonomous complex workflows—Claude reasons about problems, makes decisions, takes action, evaluates results, and adjusts approach—completing intricate multi-step tasks without human intervention.

**Today's ROI:**
- Time saved: 10-20 hours/week on complex workflows currently requiring human oversight
- Autonomy gain: Tasks that couldn't be automated now run unattended
- Capability: Enterprise-grade workflow automation without custom development

---

## ⚡ Your First Agent in 60 Seconds

Tell Claude to solve a problem autonomously:

### Prompt:

```
I need you to solve this business problem autonomously.

PROBLEM: Find and analyze our top 5 customer churn risks this week.

WORKFLOW:
1. Check customer activity database (low activity = risk)
2. Review recent support tickets (complaints = risk)
3. Analyze contract renewal dates (approaching expiration = risk)
4. Score risk level (critical / high / medium)
5. Generate summary report with recommended actions

Use your reasoning to decide how to proceed. Make decisions autonomously.
Stop only when analysis complete and report generated.

Start now.
```

### What Happens:

Claude will:
- Break down problem into steps
- Reason about approach
- Take actions (read data, analyze)
- Make decisions (what counts as "risk")
- Evaluate results
- Adjust if needed
- Deliver final report

All autonomously. No waiting for your input between steps.

### Success Indicator:
✅ Claude completed complex analysis independently and delivered actionable report

---

## 🎓 Progressive Mastery

### Foundation Level (5 minutes)
*Simple agents with clear decision trees*

## Exercise 1: Autonomous Agent Design Templates

This exercise provides four templates, each designed for a different level of complexity and use case, allowing you to master the core principles of agentic prompt engineering.

### What You're Learning (5 Key Principles)
✅ **The Autonomy Principle:** How to delegate decision-making authority to the model, moving from simple instruction-following to true autonomous problem-solving.
✅ **The Workflow Decomposition:** The skill of breaking down a complex, multi-step business process into a clear, sequential, and logical workflow for the agent to follow.
✅ **The Constraint-Based Guardrail:** Using explicit constraints (time, budget, authority) within the prompt to define the agent's boundaries and ensure safe, responsible operation.
✅ **The Iterative Reasoning Loop:** How to structure a prompt that encourages the agent to evaluate its own output, adjust its approach, and self-correct until the goal is met.
✅ **The Tool-Use Integration:** The fundamental concept of an agent reasoning about *when* and *how* to use external tools (like a database query or an API call) to complete its mission.

---

### Template 1: The Simple Triage Agent (Low Complexity, High Volume)

| Component | Detail |
| :--- | :--- |
| **Name** | **Simple Triage Agent** |
| **When to use** | <ul><li>High-volume, repetitive categorization tasks.</li><li>Workflows with clear, binary decision points.</li><li>Initial filtering or routing of data (e.g., emails, tickets).</li><li>Tasks where speed and consistency are prioritized over deep analysis.</li><li>As a foundational agent before adding complex logic.</li></ul> |
| **Setup Prompt** | ```You are a **Customer Support Triage Agent**. Your sole function is to analyze incoming support tickets and route them to the correct department based on the ticket's content and urgency. You have **30 seconds** per ticket. Your routing options are: [SALES_TEAM], [ENGINEERING_TEAM], [BILLING_TEAM], or [KNOWLEDGE_BASE]. Process the following ticket: [TICKET_CONTENT]``` |
| **Practice Scenario** | A company receives **1,500** support tickets per day. You must design an agent to process a batch of **50** tickets with an average processing time of **25 seconds** per ticket, aiming for **98%** accuracy in routing. |
| **Success Metrics** | <ul><li>Agent correctly identifies the core issue in the ticket.</li><li>Agent selects one of the four specified routing options.</li><li>The reasoning for the routing decision is logical and clear.</li><li>The agent completes the task without asking for human clarification.</li><li>The agent adheres to the **30-second** time constraint (simulated).</li><li>The agent's output is a clean, structured JSON object (simulated).</li><li>The agent's decision is consistent across similar ticket types.</li><li>The agent correctly identifies and flags a ticket that is **unroutable**.</li></ul> |

---

### Template 2: The Multi-Step Decision Agent (Medium Complexity, Medium Volume)

| Component | Detail |
| :--- | :--- |
| **Name** | **Multi-Step Decision Agent** |
| **When to use** | <ul><li>Lead scoring, risk assessment, or compliance checks.</li><li>Workflows requiring sequential analysis of multiple data points.</li><li>Tasks where the decision path changes based on intermediate results.</li><li>Automating a multi-stage human review process.</li><li>When integrating two or three different tools or data sources.</li></ul> |
| **Setup Prompt** | ```You are an **Investment Due Diligence Agent**. Your mission is to analyze a potential startup investment based on three criteria: [TEAM_STRENGTH], [MARKET_SIZE], and [FINANCIAL_HEALTH]. You must assign a score (1-10) to each, calculate a weighted average, and provide a final recommendation: [INVEST], [HOLD], or [PASS]. The weighted average is: Team (40%), Market (35%), Financial (25%). Analyze the following company profile: [COMPANY_PROFILE_DATA]``` |
| **Practice Scenario** | A venture capital firm needs to evaluate **12** potential investments this week. The agent must process each profile, which contains **15** pages of data, and deliver a final recommendation with a confidence score above **8.0** for any company recommended for investment. |
| **Success Metrics** | <ul><li>Agent correctly calculates the weighted average score.</li><li>The final recommendation ([INVEST]/[HOLD]/[PASS]) aligns with the calculated score.</li><li>The agent's reasoning explicitly references all three criteria.</li><li>The agent identifies a critical weakness in one of the three areas.</li><li>The agent suggests a specific mitigation strategy for a weakness.</li><li>The agent's output includes a clear, step-by-step breakdown of its process.</li><li>The agent successfully handles a scenario where one data point is missing.</li><li>The agent's final recommendation is supported by a **500-word** summary.</li></ul> |

---

### Template 3: The Self-Optimizing Agent (High Complexity, Low Volume)

| Component | Detail |
| :--- | :--- |
| **Name** | **Self-Optimizing Agent** |
| **When to use** | <ul><li>Continuous process improvement and root cause analysis.</li><li>Automating weekly or monthly business performance reviews.</li><li>Identifying anomalies and proposing corrective actions.</li><li>Tasks that require learning from past results and adjusting future behavior.</li><li>When the agent needs to act as a strategic analyst, not just an executor.</li></ul> |
| **Setup Prompt** | ```You are a **Business Operations Optimization Agent**. Your weekly task is to analyze the provided [WEEKLY_METRICS_REPORT], identify the single most critical underperforming metric, determine the root cause, and propose three distinct, actionable solutions. You must also predict the **30-day** impact of your top recommended solution. Analyze the following report: [WEEKLY_METRICS_REPORT_DATA]``` |
| **Practice Scenario** | A SaaS company's churn rate unexpectedly jumped from **3.5%** to **6.2%** in the last month. The agent is given **4** weeks of historical data and must propose a solution that can reduce the churn rate by at least **2.0 percentage points** within the next **60 days**. |
| **Success Metrics** | <ul><li>Agent correctly identifies the **6.2%** churn rate as the critical problem.</li><li>The root cause analysis is logical and data-driven.</li><li>The agent proposes three distinct, non-trivial solutions.</li><li>The top recommended solution is clearly prioritized and justified.</li><li>The predicted **30-day** impact is quantified (e.g., "reduce churn by 0.5%").</li><li>The agent's reasoning demonstrates an understanding of business trade-offs.</li><li>The agent suggests a method for tracking the solution's success.</li><li>The agent successfully integrates a learning loop for future weeks.</li><li>The agent's output is a professional, executive-ready memo.</li></ul> |

---

### Template 4: The Creative Synthesis Agent (High Complexity, Creative Output)

| Component | Detail |
| :--- | :--- |
| **Name** | **Creative Synthesis Agent** |
| **When to use** | <ul><li>Generating marketing copy, creative briefs, or content outlines.</li><li>Synthesizing disparate information into a cohesive narrative.</li><li>Brainstorming and ideation where novelty is a key requirement.</li><li>Tasks that require a blend of data analysis and creative output.</li><li>When the agent needs to adopt a specific, non-standard persona.</li></ul> |
| **Setup Prompt** | ```You are a **Brand Story Architect** for a new sustainable coffee brand. Your mission is to synthesize the provided [PRODUCT_SPECIFICATIONS] and [TARGET_AUDIENCE_DATA] into a single, compelling **15-second** video script for social media. The script must use the brand's core value of [MINIMAL_WASTE] and target the **25-35** age demographic. Deliver three distinct script options. Analyze the following data: [PRODUCT_AND_AUDIENCE_DATA]``` |
| **Practice Scenario** | A marketing team needs **3** unique video scripts for a product launch with a budget of **$15,000**. The agent must generate the scripts, each under **40 words**, and provide a rationale for why each script will resonate with the target audience (age **25-35**) based on the provided data. |
| **Success Metrics** | <ul><li>Agent delivers exactly three distinct script options.</li><li>Each script adheres to the **15-second** (approx. **40-word**) limit.</li><li>Each script explicitly incorporates the core value of **minimal waste**.</li><li>The agent provides a clear rationale for each script's appeal to the target demographic.</li><li>The agent's output is formatted as a professional, ready-to-film script.</li><li>The agent successfully synthesizes data from both the product and audience inputs.</li><li>The agent avoids using generic or cliché marketing language.</li><li>The agent's output is judged as **highly original** by a human reviewer (simulated).</li></ul> |

---

### Try It Now (7 Steps to Agentic Mastery)

1. **Select Your Template:** Choose one of the four templates above that best matches a real-world problem you want to solve (e.g., Triage Agent for email filtering).
2. **Define Your Mission:** Clearly state the agent's role and the single, measurable goal it must achieve (e.g., "Route 10 emails with 90% accuracy").
3. **Set the Constraints:** Define the agent's boundaries. What data can it use? What actions can it *not* take? (e.g., "Do not reply to the customer," "Only use data from the last 7 days").
4. **Detail the Workflow:** Write out the **5-7 sequential steps** the agent must follow to move from input to final output. This is the core of the agent's logic.
5. **Inject Real Numbers:** Replace the bracketed placeholders in the **Practice Scenario** with real data points (e.g., "Process 15 support tickets," "Score must be above 7.5").
6. **Execute the Prompt:** Copy your fully customized prompt into Claude and initiate the task.
7. **Evaluate and Refine:** Review the agent's output against the **Success Metrics**. If it fails, refine the **Workflow** or **Constraints** and try again.

---

### Final Success Metric

**Did the agent complete a multi-step task autonomously, making a complex decision that would have previously required human intervention, and deliver a final, actionable result that met all defined constraints?**


### Intermediate Level (7 minutes)
*Complex agents with conditional logic and optimization*

**Exercise 2: Multi-Step Decision Agent**

**Scenario:** Lead scoring and routing agent. Reviews leads, scores them, determines best approach, executes strategy.

**Complex Agent Workflow:**

```
"You are AI sales operations agent.

YOUR MISSION:
Analyze new leads, score them, and route to appropriate sales rep.

ANALYSIS FRAMEWORK:
Review each lead on:
1. COMPANY FIT:
   - Company size vs. our ICP (ideal customer profile)
   - Industry match
   - Technical requirements alignment

2. ENGAGEMENT LEVEL:
   - How they found us (organic / referral / ads)
   - Website activity (pages visited, time spent)
   - Content downloads
   - Demo request or just inquiry?

3. FINANCIAL CAPACITY:
   - Inferred budget (based on company size)
   - B2B or B2C
   - Likely buying timeline

4. LIKELIHOOD TO CONVERT:
   - Does company profile match past customers who converted?
   - How engaged are they (inquiry only vs. demo request)?
   - Decision-maker engagement?

SCORING:
Assign score 1-10 (10=hot lead, 1=unlikely to convert)
Consider: Fit (40%) + Engagement (30%) + Financial (20%) + Pattern match (10%)

ROUTING DECISION:
Score 8-10: Route to: Senior AE (experienced with big deals)
Score 6-7: Route to: Mid-tier AE (growing accounts)
Score 4-5: Route to: Business Development (nurture longer)
Score 1-3: Route to: Drip campaign automation (low-touch nurture)

ACTION FOR EACH LEAD:
- Create CRM record
- Set score and routing
- Draft first outreach email (if routing to sales)
- Schedule follow-up touchpoint

LEADS TO SCORE (list leads with basic info):
[Paste lead list]

Score each lead and execute routing for all."
```

**Agent Makes Continuous Decisions:**

```
For Lead 1:
- Reviews company (200 employees, SaaS)
- Checks: Matches our ICP ✓
- Checks: Engineering-focused (our sweet spot) ✓
- Checks: Website activity (High engagement, 40 min session)
- Checks: Downloaded pricing guide (strong signal)
- Decision: Score 8/10 → Route to Senior AE
- Action: Create record, draft personalized email, schedule intro call

For Lead 2:
- Reviews company (50 employees, startup)
- Checks: Doesn't match ICP (too small)
- Checks: Website activity (Low engagement, 5 min)
- Checks: Just inquiry, no clear need
- Decision: Score 3/10 → Route to automation
- Action: Add to drip campaign, set 2-week follow-up

And so on for each lead...
Agent makes all decisions, takes all actions.
```

---

### Advanced Level (8 minutes)
*Enterprise agents with learning and optimization*

**Exercise 3: Self-Improving Agent**

**Scenario:** Agent analyzes business metrics weekly, identifies problems, proposes optimizations, and executes approved improvements.

**Self-Optimizing Agent:**

```
"You are business operations optimization agent.

YOUR MISSION:
Weekly analysis of business metrics.
Identify problems.
Propose improvements.
Execute approved changes.

WEEKLY ANALYSIS PROCESS:

STEP 1: COLLECT & ANALYZE DATA
- Revenue trends (week-over-week, month-over-month)
- Customer acquisition cost
- Churn rate
- Support ticket volume and SLA compliance
- Sales conversion rates
- Website traffic and conversion
- Team productivity metrics

For each metric:
- Calculate trends
- Identify anomalies (unusual up/down)
- Assess impact (critical / important / minor)

STEP 2: IDENTIFY PROBLEMS
Look for:
- Metrics trending wrong direction
- SLA violations
- Unusual spikes or drops
- Performance below targets
- Opportunities being missed

STEP 3: ROOT CAUSE ANALYSIS
For each problem:
- What's causing this?
- When did it start?
- How many people/customers affected?
- What's the financial impact?

STEP 4: PROPOSE SOLUTIONS
For each identified problem:
- Solution 1: [Quick fix option]
- Solution 2: [Comprehensive solution]
- Solution 3: [Long-term solution]

For each solution:
- Cost to implement
- Time to implement
- Expected impact (revenue / efficiency gain)
- Risk level
- Recommendation: which to prioritize

STEP 5: PRESENT FINDINGS
Create weekly report:
- Metrics summary
- Problems identified
- Root causes
- Recommended improvements (prioritized)
- Next steps

STEP 6: EXECUTE APPROVED IMPROVEMENTS
For improvements approved by leadership:
- Implement changes
- Track results weekly
- Report impact

CURRENT METRICS DATA:
[Paste weekly metrics]

Analyze, identify problems, propose improvements."
```

**Agent Learning Process:**

```
Week 1:
- Agent analyzes metrics, finds churn spike
- Proposes: Improve support response time
- Implemented: Target response time from 4h to 1h
- Result: Churn stabilized

Week 2:
- Agent notes: Support response improvement worked
- Analyzes: What else correlates with churn?
- Proposes: Customer success outreach for at-risk accounts
- Result: Catches 3 accounts before they churned

Week 3:
- Agent applies learnings: Proactive approach works
- Analyzes: Which accounts are at-risk NOW?
- Proposes: Personalized outreach before problem occurs
- Result: Prevents expected churn

Agent improves over time based on what works.
Self-learning without explicit programming.
```

---

## 🚀 Production Templates

### Template 1: Autonomous Workflow Agent

```
"Act as autonomous agent for [WORKFLOW].

YOUR ROLE: [What you do]

DECISION FRAMEWORK:
[How you make decisions]

ACTIONS YOU CAN TAKE:
- [Action 1]
- [Action 2]
- [Action 3]

FOR EACH [ITEM TO PROCESS]:
1. Analyze: [What to evaluate]
2. Decide: [How to choose direction]
3. Act: [What action to take]
4. Track: [What to log/report]

CONSTRAINTS:
- [Budget/time/authority limits]
- [Quality standards]
- [Escalation criteria]

PROCESS:
[Items to process or instructions to start]

Work autonomously until complete.
Report final results."
```

---

### Template 2: Decision-Making Agent

```
"You are decision-making agent for [DOMAIN].

PROBLEM TO SOLVE:
[Description of problem]

DATA AVAILABLE:
[What data sources to use]

DECISION PROCESS:
1. Gather & analyze data
2. Consider options
3. Evaluate trade-offs
4. Make recommendation
5. Explain reasoning

CONSTRAINTS:
- [Business constraints]
- [Resource constraints]
- [Risk tolerance]

DELIVERABLE:
- Clear recommendation
- Reasoning (why this choice)
- Action plan (if approved)
- Risks & mitigation

Analyze and recommend."
```

---

### Template 3: Multi-Step Problem-Solving Agent

```
"Solve this complex problem autonomously.

PROBLEM: [Description]

CONSTRAINTS:
- [Limit 1]
- [Limit 2]
- [Limit 3]

APPROACH:
You should:
1. Break problem into steps
2. Make reasonable decisions at each step
3. Evaluate results
4. Adjust approach if needed
5. Don't ask for input—proceed autonomously

Solve this and report final solution."
```

---

## 💼 Business Integration

### This Week: Agent Introduction

**Day 1-2:** Simple agents (routing, categorization)
**Day 3-4:** Complex agents (multi-step decision making)
**Day 5-7:** Autonomous workflow (self-improving agent)

**Week Results:**
- 3-5 agents created and tested
- Saved 8-10 hours on workflows
- Identified additional automation opportunities

---

### This Month: Agent-Driven Automation

**Week 1:** Introduction and basic agents
**Week 2:** Complex decision-making agents
**Week 3:** Self-improving agents
**Week 4:** Full workflow automation (multiple agents)

**Month ROI:**
```
Time saved: 12-18 hours/week on complex workflows
Value: 15 hrs × $150/hr × 4 weeks = $9,000/month
Cost: Claude Pro $20/month
Net: $8,980/month
ROI: 44,900%
```

---

## 🎯 Action Plan

**Week 1 (10 hours):** Create 3-5 simple agents
**Month 1 (40+ hours):** Enterprise agents running key workflows
**90 Days:** Autonomous business process execution across organization

**Final Outcome:** Complex business workflows run autonomously with AI oversight.

---

**Next Lesson:** Lesson 19 - Claude Safety & Alignment (Building trustworthy AI systems, guardrails, responsible deployment) 🚀
