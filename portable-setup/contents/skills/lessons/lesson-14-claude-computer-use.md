# Lesson 14: Claude Computer Use - Autonomous Computer Control & GUI Automation
*Master Claude's groundbreaking computer control capability to automate complex multi-step tasks across applications*

## 💰 The Business Reality

Manual computer tasks consume massive amounts of professional time:
- **Repetitive task burden**: Knowledge workers spend 8-12 hours/week on repetitive computer tasks (data entry, file management, report generation, cross-application workflows) that could be automated but aren't due to complexity
- **Cross-application friction**: Tasks requiring 3+ different applications (Excel → CRM → Email → Slack) take 40-60% longer due to context switching and manual data transfer, costing 5-8 hours/week per employee
- **Automation complexity gap**: Traditional automation tools (Zapier, scripts) require technical skills or only work for simple linear workflows, leaving 70% of automation opportunities untapped

Claude's Computer Use capability (October 2024, refined 2025) enables AI to control your computer autonomously—taking screenshots, moving mouse, clicking, typing—to complete multi-step tasks across any application, breaking through the complexity barrier.

**Today's ROI:**
- Time saved: 8-12 hours/week on repetitive multi-application tasks
- Money saved: $15,000-30,000+/year vs. hiring virtual assistants or automation developers
- Capability gained: Automate complex workflows previously impossible without custom software development

---

## ⚡ Your First Automated Task in 60 Seconds

Let's watch Claude control your computer to complete a task right now.

### Copy This Exact Prompt (in Claude with Computer Use enabled):

```
I want you to help me test Computer Use capability.

Task: Open my web browser, navigate to google.com, search for "Claude AI computer use",
and tell me the top 3 results you see.

Use your computer control abilities to:
1. Take screenshot to see current state
2. Open browser
3. Navigate and search
4. Read results
5. Report back

Start now.
```

### What You Should See:

Claude will:
- **Take screenshot** of your desktop
- **Identify browser icon** and click it
- **Type URL** in address bar
- **Perform search** query
- **Read results** from the page
- **Report findings** back to you

This happens autonomously—you're watching Claude control your computer.

### Success Indicator:
✅ Claude successfully completed multi-step task across GUI without you touching keyboard/mouse

---

## 🎓 Progressive Mastery

### Foundation Level (5 minutes)
*Master basic computer control workflows and task delegation*

## Exercise 1: Autonomous Workflow Templates - From Repetitive Task to Production System

**Goal:** Master the core patterns of Claude's Computer Use capability by applying structured prompts to common business use cases, transforming manual, repetitive tasks into reliable, autonomous workflows.

---

### Template 1: Cross-Application Data Migration & Entry

**Name:** **Bulk Data Entry and Validation**

**When to use:**
*   Transferring a large list of contacts from a spreadsheet into a CRM or marketing platform.
*   Migrating product inventory data from an old system's export file into a new e-commerce backend.
*   Processing a batch of expense reports by entering line items into an accounting software interface.
*   Updating user profiles across multiple internal tools (e.g., HR system, project management, communication platform).
*   Any task involving reading structured data from one source and accurately inputting it into a graphical user interface.

**Setup Prompt:**

```markdown
I need you to perform a bulk data entry task from a local spreadsheet into a web-based CRM.

**TASK:** Migrate the first [15] new leads from the 'Q4_Leads.xlsx' file into the 'Salesforce' CRM.

**SOURCE FILE:** /Users/[USER_NAME]/Documents/Data/Q4_Leads.xlsx
**DESTINATION URL:** [https://salesforce.com/leads/new]

**PROCESS STEPS:**
1. Open the Excel file at the specified path.
2. For the first [15] rows of data (excluding the header row):
    a. Open the DESTINATION URL in the browser.
    b. Input the data from columns 'Name', 'Email', 'Company', and 'Phone' into the corresponding fields on the 'New Lead' form.
    c. Set the 'Lead Source' field to 'Website Inquiry'.
    d. Click the 'Save' button.
    e. Wait for the success confirmation message.
    f. Repeat for the next row.
3. Log the status (Success/Failure) for each of the [15] records in a new column in the Excel file.
4. Close the Excel file and the browser.

**VERIFICATION:**
- Take a screenshot of the final [15th] successfully created lead record in the CRM.
- Report the total number of successful and failed entries.

Start the process now.
```

**Practice Scenario:**

A sales development representative (SDR) receives a list of **150** qualified leads from a recent webinar in an Excel file. The SDR needs to manually enter the first **15** leads into the company's CRM, which takes approximately **3 minutes** per lead. The goal is to automate this **45-minute** task to free up the SDR for follow-up calls.

**Success Metrics (Checkboxes):**
- [ ] Claude successfully opened the local Excel file.
- [ ] Claude navigated to the specified CRM 'New Lead' URL.
- [ ] Data from the first **15** rows was accurately read and transferred.
- [ ] The 'Lead Source' field was correctly set to 'Website Inquiry' for all entries.
- [ ] The 'Save' button was clicked for each record, and the process completed without error.
- [ ] A new column was added to the Excel file with the status of each entry.
- [ ] Claude provided a final count of successful and failed entries (**15** successful, **0** failed).
- [ ] A screenshot of the final, saved lead record was provided.
- [ ] The total time taken by Claude was less than **5 minutes**.

---

### Template 2: Automated Reporting & Data Synthesis

**Name:** **Multi-Source Performance Dashboard Generation**

**When to use:**
*   Compiling a weekly business performance report from multiple SaaS dashboards (e.g., marketing, sales, finance).
*   Creating a competitive analysis report by scraping data from several competitor websites and synthesizing it into a single document.
*   Generating a personalized monthly client report by combining data from an internal database and a third-party analytics tool.
*   Any task requiring the aggregation, analysis, and structured presentation of data from disparate web-based sources.
*   Automating the creation of a standardized document or presentation that relies on fresh, real-time data.

**Setup Prompt:**

```markdown
Generate a 'Weekly Marketing Performance' report by synthesizing data from three different platforms into a Google Doc.

**TASK:** Create a report for the week of [10/28/2024] to [11/03/2024].

**SOURCES:**
1. **Google Analytics:** [https://analytics.google.com/view/traffic] (Extract: Total Users, Bounce Rate)
2. **Mailchimp:** [https://mailchimp.com/reports/campaigns] (Extract: Email Open Rate, Click-Through Rate)
3. **Stripe:** [https://dashboard.stripe.com/reports/revenue] (Extract: Total Revenue, New Subscriptions)

**PROCESS STEPS:**
1. Log into each of the three platforms and navigate to the specified report sections.
2. Set the date range filter to [10/28/2024] to [11/03/2024] on all platforms.
3. Extract the required metrics for each source.
4. Create a new Google Doc titled 'Weekly Marketing Report - [11/04/2024]'.
5. Format the extracted data into a clear table and write a 150-word summary analyzing the key trends (e.g., 'Revenue is up 12% week-over-week, but the email CTR dropped 5%').
6. Share the link to the completed Google Doc.

**VERIFICATION:**
- Provide a screenshot of the date range filter applied in Google Analytics.
- Confirm the total revenue figure extracted from Stripe.

Start the process now.
```

**Practice Scenario:**

A marketing manager needs a weekly report that takes **90 minutes** to compile manually. The report must cover the last **7 days** of data. The manager wants to automate this to save **6 hours** per month. The target metrics for the week of **10/28/2024** to **11/03/2024** are: Total Users (**12,500**), Email Open Rate (**22.5%**), and Total Revenue (**$45,200**).

**Success Metrics (Checkboxes):**
- [ ] Claude successfully logged into and navigated all three specified platforms.
- [ ] The correct date range (**10/28/2024** to **11/03/2024**) was applied to all data sources.
- [ ] The six required metrics were accurately extracted (Users, Bounce Rate, Open Rate, CTR, Revenue, Subscriptions).
- [ ] A new Google Doc was created with the correct title format.
- [ ] The extracted data was presented in a clear, structured table within the document.
- [ ] A summary of at least **150** words was generated, analyzing the data.
- [ ] The final Google Doc link was provided.
- [ ] The reported Total Users was close to the expected **12,500** (within 5%).
- [ ] The reported Total Revenue was close to the expected **$45,200** (within 5%).
- [ ] The entire report generation process took less than **10 minutes**.

---

### Template 3: Conditional Workflow & Triage

**Name:** **Intelligent Support Ticket Triage and Escalation**

**When to use:**
*   Automating the initial screening and routing of customer support tickets based on keywords, customer tier, and urgency.
*   Processing incoming job applications by filtering candidates based on required skills and experience levels before assigning them to a recruiter.
*   Triage of system alerts, where different alert types (e.g., 'High CPU', 'Disk Full', 'Network Down') require distinct, automated responses (e.g., restart service, notify engineer, log to incident system).
*   Any workflow that requires complex **IF/THEN/ELSE** logic and conditional actions across multiple systems.
*   Implementing a rule-based system for content moderation or compliance review.

**Setup Prompt:**

```markdown
Automate the triage and routing of new support tickets based on a defined set of conditional rules.

**TASK:** Process the last [25] support tickets in the 'New' queue.

**SOURCE PLATFORM:** [https://supportdesk.com/tickets/new]
**ESCALATION SYSTEM:** [https://slack.com/channel/incidents]

**CONDITIONAL RULES:**
1. **IF** Ticket Subject contains 'Payment Failure' **AND** Customer Tier is 'Enterprise':
    → **ACTION:** Assign to 'Finance Escalation' queue. Send a Slack alert to [#finance-critical].
2. **ELSE IF** Ticket Category is 'Bug' **AND** Priority is 'High':
    → **ACTION:** Create a new ticket in Jira with the summary. Assign to 'Engineering Triage'.
3. **ELSE IF** Ticket Category is 'Question' **AND** Customer Tier is 'Free':
    → **ACTION:** Search the Knowledge Base for an answer. Draft a response with the top result. Assign to 'General Support'.
4. **ELSE** (Default):
    → **ACTION:** Assign to 'Tier 1 Support'. Set status to 'Pending Review'.

**PROCESS STEPS:**
1. Log into the support platform and access the 'New' queue.
2. For each of the last [25] tickets:
    a. Read the Subject, Category, Priority, and Customer Tier.
    b. Apply the conditional rules to determine the required action.
    c. Execute the action (re-assign, create Jira ticket, draft response, send Slack alert).
    d. Log the Ticket ID and the final action taken in a separate log file: /home/ubuntu/triage_log_[DATE].txt
3. Report the total number of tickets processed and the count for each action taken.

Start the process now.
```

**Practice Scenario:**

A support team receives an average of **100** tickets per day. Manually triaging the first **25** tickets takes a senior agent about **60 minutes**. The goal is to automate this initial triage. In a test batch of **25** tickets, **3** should trigger the Finance Escalation rule, **5** should trigger the Engineering Triage rule, **12** should trigger the General Support rule, and **5** should fall to the Default rule.

**Success Metrics (Checkboxes):**
- [ ] Claude successfully processed the last **25** tickets in the 'New' queue.
- [ ] The conditional logic was correctly applied to all tickets.
- [ ] **3** tickets were correctly assigned to 'Finance Escalation' and triggered a Slack alert.
- [ ] **5** tickets resulted in a new ticket being created in the simulated Jira system.
- [ ] **12** tickets had a draft response generated from the simulated Knowledge Base search.
- [ ] **5** tickets were correctly assigned to 'Tier 1 Support'.
- [ ] A log file (`triage_log_[DATE].txt`) was created with the final action for all **25** tickets.
- [ ] Claude reported the final count of actions taken (3, 5, 12, 5).
- [ ] The process demonstrated the ability to interact with at least **3** different simulated applications (Support Desk, Jira, Slack).

---

### Template 4: System Monitoring & Error Handling

**Name:** **Autonomous Daily Health Check with Resilience**

**When to use:**
*   Running a daily or hourly check on critical business systems (e.g., website uptime, database connection, API health).
*   Automating a nightly batch process that must be retried or logged if it fails (e.g., data backup, ETL job).
*   Monitoring a production environment for specific error messages in log files and automatically escalating or attempting a fix.
*   Any task that requires unattended, scheduled execution with robust **error detection, logging, and recovery** mechanisms.
*   Implementing a continuous integration/continuous deployment (CI/CD) pipeline step that needs to handle transient failures.

**Setup Prompt:**

```markdown
Execute a daily health check on our primary web application, including robust error handling and logging.

**TASK:** Perform a 3-step health check on the 'Product Dashboard' at [https://app.company.com/dashboard].

**CHECK STEPS:**
1. **Login Check:** Navigate to the URL and successfully log in with credentials [USER] and [PASS].
2. **Data Load Check:** Navigate to the 'Analytics' tab and verify that the 'Total Users' metric loads a number greater than [1000].
3. **API Health Check:** Click the 'Settings' icon and verify that the 'API Status' indicator is green.

**ERROR HANDLING:**
- **IF** Login fails: Take a screenshot of the error message. **RETRY** the login once after a [30] second delay. If the second attempt fails, log 'CRITICAL FAILURE: Login' and **STOP** the entire check.
- **IF** Data Load fails (e.g., metric is missing or < [1000]): Log 'WARNING: Data Load Issue'. Continue to the next step.
- **IF** API Health Check fails (indicator is red): Take a screenshot. Log 'CRITICAL FAILURE: API Down'.

**PROCESS STEPS:**
1. Execute the three checks sequentially.
2. Log all actions and errors to a master log file: /home/ubuntu/health_check_log_[DATE].txt
3. At the end, send a summary email to [ops@company.com] with the overall status (GREEN/YELLOW/RED).

Start the process now.
```

**Practice Scenario:**

An operations team runs a daily health check that takes **15 minutes** manually. The check is critical for system stability. The goal is to automate this check, including the ability to handle a common transient login failure. The expected 'Total Users' metric is **15,500**. The system should be tested with a simulated transient failure on the first login attempt.

**Success Metrics (Checkboxes):**
- [ ] Claude attempted the first login and simulated a failure.
- [ ] Claude correctly waited for the specified **30** second delay.
- [ ] Claude successfully performed the second login attempt.
- [ ] The 'Data Load Check' was performed, and the 'Total Users' metric was verified against the expected **15,500** (or > **1000**).
- [ ] The 'API Health Check' was performed, and the status was verified.
- [ ] The entire process was logged to the `health_check_log_[DATE].txt` file, including the retry attempt.
- [ ] The final summary email was simulated to be sent to `ops@company.com`.
- [ ] The final status reported was **GREEN** (assuming the retry succeeded and no other errors occurred).
- [ ] The process demonstrated the ability to detect and recover from a transient failure.
- [ ] The total time taken, including the delay, was less than **5 minutes**.

---

### What You're Learning

✅ **The Principle of Explicit Instruction:** Claude's computer use is only as good as the prompt. You learn to break down complex, multi-application tasks into explicit, sequential steps that leave no room for ambiguity.
✅ **State-Aware Automation:** You understand that Claude operates by observing the screen state (screenshots) and making decisions. This requires prompts to include clear verification steps and expected outcomes at each stage.
✅ **Conditional Logic for Business Rules:** You master the use of `IF/THEN/ELSE` structures within prompts to handle real-world business complexity, such as triaging support tickets or validating data before processing.
✅ **Resilience and Error Handling:** You learn to design workflows that anticipate failure (e.g., login errors, slow loading) and include explicit instructions for retries, logging, and graceful skipping to ensure the overall process is robust.
✅ **The Power of Abstraction:** You move beyond simple single-step commands to orchestrate a series of actions across disparate systems (web, desktop, file system) using a single, high-level natural language instruction.

---

### Try It Now: Build Your First Production-Grade Workflow

Follow these steps to build and test a robust, multi-step automation using one of the templates above.

1.  **Select a Template:** Choose the **Template 4: Autonomous Daily Health Check** as your starting point.
2.  **Identify a Target:** Select a simple, non-critical web application or website (e.g., a personal dashboard, a public status page) to use as your target system.
3.  **Define the Checks:** Modify the `CHECK STEPS` in the template to include three specific, verifiable actions on your chosen target (e.g., "Verify logo is present," "Check the number of items in the cart," "Confirm the last updated date is today").
4.  **Set the Failure Point:** Introduce a deliberate, temporary failure into your prompt's `ERROR HANDLING` section (e.g., instruct Claude to use an incorrect password once, or look for a metric that is temporarily hidden).
5.  **Refine the Prompt:** Write the final `Setup Prompt` with real, non-sensitive data and clear instructions for logging and reporting. Use the `[BRACKETS]` for any variable data.
6.  **Execute and Observe:** Run the prompt in Claude and observe its behavior, specifically watching how it handles the deliberate failure and the subsequent recovery/logging steps.
7.  **Review the Log:** Check the generated log file (`health_check_log_[DATE].txt`) to ensure the failure, the retry, and the final status were all correctly recorded.

### Final Success Metric

✅ **Your first production-grade workflow is complete:** You have successfully executed a multi-step, cross-application automation that included explicit conditional logic, demonstrated recovery from a transient failure, and produced a structured log file and final status report.


### Intermediate Level (7 minutes)
*Complex workflows, decision-making, and conditional logic*

**Exercise 2: Advanced Automation with Conditional Logic**

**Scenario:** You manage customer support tickets. Each ticket requires different handling based on priority, category, and customer tier. Manual triage takes 2 hours/day. Automate it with Claude making intelligent decisions.

**Your Mission:** Master complex automation with decision trees and conditional logic.

**Advanced Workflow Pattern:**

**Conditional Task Automation**

```
"Automate support ticket triage with intelligent decision-making.

TICKET SOURCE: [Support platform URL]
LOGIN: [Credentials when prompted]

WORKFLOW:

FOR EACH NEW TICKET:

STEP 1: READ TICKET
- Ticket ID
- Subject line
- Customer name
- Customer tier (Free / Pro / Enterprise)
- Priority (set by customer)
- Category (Bug / Feature Request / Question)
- Description (first 200 words)

STEP 2: ANALYZE & CATEGORIZE
Determine:
- Actual priority (may differ from customer's)
  • CRITICAL: System down, data loss, security
  • HIGH: Major feature broken, blocking work
  • MEDIUM: Annoying bug, feature request
  • LOW: Question, minor issue

- Complexity:
  • SIMPLE: Answer in knowledge base
  • MEDIUM: Requires investigation
  • COMPLEX: Engineering escalation needed

STEP 3: DECISION TREE

IF Priority = CRITICAL:
  → Assign to: On-call engineer
  → Slack alert: #incidents channel
  → Set SLA: 1 hour response
  → Add tag: 'critical-incident'

ELSE IF Priority = HIGH AND Customer = Enterprise:
  → Assign to: Senior support
  → Email notification to account manager
  → Set SLA: 2 hour response
  → Add tag: 'enterprise-priority'

ELSE IF Category = Bug AND Complexity = COMPLEX:
  → Assign to: Engineering queue
  → Create Jira ticket
  → Link to support ticket
  → Set SLA: 24 hour response

ELSE IF Category = Question AND Complexity = SIMPLE:
  → Search knowledge base for answer
  → Post answer as draft response
  → Assign to: Support agent for review
  → Set SLA: 4 hour response

ELSE:
  → Assign to: General support queue
  → Set SLA: 8 hour response
  → Add appropriate tags

STEP 4: LOG ACTIONS
Create log entry:
- Ticket ID
- Priority assigned
- Queue assigned
- Reasoning (why this decision)
- SLA set
- Time processed

STEP 5: REPEAT
Process next ticket.

SAFEGUARDS:
- Don't auto-respond to customers (draft only)
- Flag any ticket you're uncertain about
- If customer tier = Enterprise, always involve human
- Screenshot each ticket processed

Process tickets from last 2 hours as test run."
```

**What This Enables:**
- Claude reads context (ticket content, customer data)
- Makes intelligent decisions (not simple if/then)
- Takes different actions based on analysis
- Works across multiple systems (support platform, Slack, Jira, etc.)
- Maintains audit trail

**Advanced Pattern: Data Processing Pipeline**

```
"Process monthly expense reports with validation and categorization.

SOURCE: Email inbox → Search 'Expense Report' in last 30 days

FOR EACH EMAIL:

1. DOWNLOAD ATTACHMENT (Excel file)

2. VALIDATE DATA:
   - All required columns present?
   - Dates in valid format?
   - Amounts are numbers?
   - Receipts attached match line items?

   IF validation fails:
   → Reply to sender: 'Expense report has errors: [LIST ISSUES]'
   → Move to 'Needs Correction' folder
   → Skip to next email

3. CATEGORIZE EXPENSES:
   Read each line item, categorize:
   - Travel (flights, hotels, meals while traveling)
   - Office (supplies, software, equipment)
   - Marketing (ads, events, sponsorships)
   - Client (client dinners, gifts)
   - Other

   Add category column to spreadsheet

4. FLAG FOR REVIEW:
   IF any item > $500 → Flag as 'Requires Manager Approval'
   IF category = 'Other' > 20% of total → Flag as 'Unusual Distribution'
   IF total > employee's monthly limit → Flag as 'Over Budget'

5. SUMMARIZE:
   Create summary tab in Excel:
   - Total by category
   - Items flagged for review
   - Comparison to budget
   - Variance explanation needed

6. EXPORT & ROUTE:
   - Save to: /Accounting/Expense Reports/[MONTH]/[EMPLOYEE].xlsx
   - Upload to: [Accounting system URL]
   - IF flagged:
     → Email manager for approval
   - ELSE:
     → Auto-approve in accounting system

7. LOG:
   Append to master log:
   - Employee name
   - Total amount
   - Categories breakdown
   - Flags (if any)
   - Status (Approved / Pending)
   - Date processed

Process all pending expense reports. Show me summary when done."
```

**Advanced Technique: Web Scraping + Analysis**

```
"Research competitors and compile intelligence report.

COMPETITORS: [List 5 competitor websites]

FOR EACH COMPETITOR:

1. NAVIGATE TO WEBSITE
   - Homepage
   - Pricing page
   - Product/features page
   - About/team page (if exists)
   - Blog (recent posts)

2. EXTRACT DATA:
   - Pricing: Plans, prices, features per tier
   - Product: Key features listed
   - Team size: Estimate from about page
   - Recent updates: Last 3 blog posts (titles, dates)
   - Messaging: What do they emphasize? (value prop)

3. TAKE SCREENSHOTS:
   - Pricing page
   - Key product features
   - Homepage hero section

4. ANALYZE:
   - Price vs our pricing (cheaper/same/more expensive)
   - Features they have that we don't
   - Features we have that they don't
   - Messaging angle (technical vs business vs creative)

5. COMPILE REPORT:
   Create Google Doc: 'Competitor Analysis [DATE]'

   For each competitor:
   ## [Competitor Name]
   - Website: [URL]
   - Pricing: [Summary]
   - Key Features: [Bullet list]
   - Differentiators: [What makes them unique]
   - vs Us: [How we compare]
   - Screenshots: [Insert]

   Final section:
   ## Summary
   - Market positioning map (who targets who)
   - Pricing comparison table
   - Feature gap analysis
   - Strategic recommendations

Share doc link when complete."
```

---

### Advanced Level (8 minutes)
*Autonomous workflows, error recovery, and production automation*

**Exercise 3: Production-Grade Automation System**

**Scenario:** You need a fully autonomous system that runs daily without supervision, handles errors gracefully, and reports issues. This is production-grade automation that saves 2-3 hours daily.

**Your Mission:** Build reliable, autonomous workflow that runs unattended.

**Production Automation Framework:**

**Daily Automated Workflow**

```
"Setup autonomous daily workflow - runs every morning at 8 AM.

MASTER WORKFLOW: Daily Business Operations

I. MORNING BRIEFING GENERATION (30 min)

1. DATA COLLECTION:
   - Google Analytics → Yesterday's traffic
   - Stripe → Yesterday's revenue + new customers
   - Support platform → Open tickets count, SLA status
   - Github → PRs merged, issues opened
   - Email inbox → Count unread in each folder

2. ANALYSIS:
   - Traffic: Up/down vs. last week? Anomalies?
   - Revenue: On track for monthly goal? (X% of way through month, Y% of revenue goal)
   - Support: Any SLA violations? Backlog growing/shrinking?
   - Development: Velocity vs. last week?

3. GENERATE BRIEFING:
   Create doc: 'Daily Briefing [DATE]'

   Format:
   # Daily Briefing - [DATE]

   ## 📊 Metrics
   - Traffic: X visitors (↑/↓ Y% vs last week)
   - Revenue: $X (↑/↓ Y% vs last week) - Z% toward monthly goal
   - Support: X open tickets (Y critical)
   - Development: X PRs merged, Y issues closed

   ## ⚠️ Issues Requiring Attention
   [Auto-flagged items that need human review]

   ## 📈 Trends
   [7-day and 30-day trend analysis]

   Post to: Slack #daily-updates channel

II. TASK AUTOMATION (60 min)

4. SUPPORT TICKET TRIAGE:
   [Use conditional logic from Intermediate exercise]
   - Process all new tickets from last 24 hours
   - Auto-categorize and assign
   - Draft responses for simple questions
   - Escalate complex/critical issues

5. SALES LEAD ENRICHMENT:
   For each new lead in CRM (added yesterday):
   - Search: Company name on LinkedIn
   - Find: Employee count, industry, recent news
   - Search: Company website for tech stack info
   - Update CRM with enriched data
   - Score lead: Enterprise (500+ employees) / Mid-market (50-500) / SMB (<50)
   - Add to appropriate nurture sequence

6. EXPENSE REPORT PROCESSING:
   [Use validation pipeline from Intermediate exercise]
   - Process all pending expense reports
   - Validate, categorize, flag exceptions
   - Auto-approve or route for approval

7. FILE ORGANIZATION:
   - Downloads folder cleanup
   - Email attachments: Save to appropriate project folders
   - Screenshot cleanup: Delete >30 days old

III. REPORTING & ALERTS (15 min)

8. EXCEPTION REPORTING:
   IF any critical issues found:
   → Send email alert with:
     - What's wrong
     - Severity (Critical / High / Medium)
     - Recommended action
     - Relevant links/data

   Examples:
   - Revenue down >20% from last week
   - SLA violations >5 today
   - Critical support tickets unassigned >30 min
   - Server errors >100 in last hour

9. WORKFLOW LOG:
   Append to master log:
   - Date/time executed
   - Tasks completed
   - Issues encountered
   - Errors (if any)
   - Time taken
   - Success/failure status per task

ERROR HANDLING:

IF task fails:
1. Try again (1 retry with 30 sec delay)
2. If still fails: Log error, screenshot state, continue to next task
3. At end: Report failed tasks in summary

SAFEGUARDS:
- Read-only operations unless explicitly specified as write
- Never delete files without confirmation (move to trash instead)
- Never send email to customers without draft review
- Maximum runtime: 2 hours (timeout protection)
- If stuck on any task >10 minutes, skip and log

COMPLETION:
Post to Slack:
✅ Daily automation complete
⏱️ Completed in X minutes
📋 Tasks: [list completed]
⚠️ Issues: [list any that failed]
📊 Brief: [link to briefing doc]
"
```

**Error Recovery & Resilience:**

```
"Make this automation robust to failures.

ERROR SCENARIOS TO HANDLE:

1. WEBSITE NOT LOADING:
   - Wait 30 seconds, retry
   - If fails again, check internet connection
   - If internet OK but site down, log and skip
   - Set flag: 'Website unavailable - manual check needed'

2. LOGIN FAILURE:
   - Verify credentials (ask user if expired)
   - Check if 2FA required (alert user)
   - Try alternate login method
   - If all fail: Skip this task, log error

3. DATA FORMAT CHANGED:
   - If expected column missing in spreadsheet
   - Try to find similar column (fuzzy match)
   - If can't proceed: Alert user, show screenshot
   - Don't process incomplete data

4. UNEXPECTED POPUP/DIALOG:
   - Screenshot the popup
   - Try common actions (Close, Cancel, OK)
   - If blocks progress: Log and move to next task
   - Report: 'Unexpected dialog on [APP] - see screenshot'

5. APPLICATION CRASH:
   - If app becomes unresponsive (no screenshot changes for 60s)
   - Force quit application
   - Wait 10 seconds
   - Reopen and retry task
   - If crashes again: Skip task, log error

6. MISSING FILE/FOLDER:
   - Check common alternate locations
   - Search file system for filename
   - If not found: Alert user, list expected location
   - Don't proceed with task that requires this file

LOGGING STRATEGY:
Create daily log: /Logs/Automation_[DATE].txt

For each task:
[TIMESTAMP] Starting: [TASK NAME]
[TIMESTAMP] Status: [SUCCESS / RETRY / FAILED]
[TIMESTAMP] Details: [What happened]
[TIMESTAMP] Screenshot: [Path if error]

REPORTING TIERS:
- GREEN: All tasks completed successfully
- YELLOW: Some tasks failed but automation mostly worked
- RED: Critical failures, manual intervention needed

Post appropriate status to Slack with summary."
```

**Advanced: Multi-Day Workflow Orchestration**

```
"Orchestrate week-long campaign launch workflow.

CAMPAIGN: [Product launch, 5-day sequence]

MONDAY (Day 1):
- 9 AM: Post announcement on company blog
- 10 AM: Send email to customer list
- 11 AM: Post to social media (LinkedIn, Twitter)
- 2 PM: Monitor initial response (email opens, social engagement)
- 5 PM: Generate Day 1 report

TUESDAY (Day 2):
- 9 AM: Follow-up email to non-openers
- 10 AM: Respond to social media comments (draft responses, flag for review)
- 2 PM: Update dashboard with metrics
- 5 PM: Generate Day 2 report

WEDNESDAY (Day 3):
- 9 AM: Case study email to engaged prospects
- 10 AM: Create retargeting audience (list of email openers)
- 2 PM: Competitive analysis (how competitors reacting?)
- 5 PM: Mid-week report with pivot recommendations

THURSDAY (Day 4):
- 9 AM: Testimonial campaign (email top customers for quotes)
- 10 AM: Update website with early results
- 2 PM: Sales team enablement (compile objections seen, suggested responses)
- 5 PM: Day 4 report

FRIDAY (Day 5):
- 9 AM: Final push email (last chance messaging)
- 10 AM: Compile all campaign data
- 2 PM: Generate comprehensive campaign report
- 4 PM: Schedule team debrief meeting, send calendar invite

EACH TASK:
- Execute automatically at scheduled time
- Verify completion
- Screenshot/log results
- Handle errors gracefully
- Report status in Slack

AT END OF WEEK:
Create master report:
- Campaign Overview
- Day-by-day results
- Total metrics (emails sent/opened/clicked, social reach, conversions)
- What worked / what didn't
- Recommendations for next campaign

This is 5-day autonomous workflow requiring minimal human oversight."
```

---

## 🚀 Production Templates

### Template 1: Daily Automation Workflow

```
"Setup daily recurring automation.

RUN TIME: [When to execute]
ESTIMATED DURATION: [How long it takes]

TASKS:
1. [Task 1 description with steps]
2. [Task 2 description with steps]
3. [Task 3 description with steps]

FOR EACH TASK:
- Clear success criteria
- Error handling instructions
- Verification steps
- What to do if fails

REPORTING:
- Post summary to: [Slack channel / Email]
- Include: Tasks completed, issues encountered, next steps
- Attach: Relevant screenshots or generated reports

ERROR RECOVERY:
- Retry logic for each task type
- Fallback actions if retry fails
- When to alert human
- How to gracefully degrade

LOGGING:
- Daily log file: [Location]
- Include: Timestamps, status, errors, screenshots
- Retention: [How long to keep logs]

Make this production-ready and fully autonomous."
```

**Use When:** Daily/weekly recurring workflows
**Time Saved:** 10-20 hours/week of manual repetitive work

---

### Template 2: Data Processing Pipeline

```
"Automate data processing from source to destination.

SOURCE: [Where data comes from]
DESTINATION: [Where it goes]

PIPELINE:

STEP 1: DATA COLLECTION
- Source location: [Path / URL]
- Data format: [CSV / Excel / API / etc.]
- Collection frequency: [How often]

STEP 2: VALIDATION
Check data for:
- Required fields present
- Correct data types
- Value ranges (min/max)
- No duplicates (if applicable)

If validation fails:
- Log specific errors
- Alert: [Who to notify]
- Don't proceed with bad data

STEP 3: TRANSFORMATION
- Clean: [What to clean]
- Calculate: [Derived fields]
- Format: [Standardization rules]
- Enrich: [Additional data to add]

STEP 4: QUALITY CHECKS
Before final output:
- Row count reasonable? (not 0, not 10x expected)
- Values in expected ranges?
- Spot check: [Sample validation]

STEP 5: LOAD
- Destination: [System / file / database]
- Method: [API / upload / etc.]
- Conflict handling: [Update / skip / alert]

STEP 6: VERIFICATION
- Confirm data arrived
- Row counts match
- Spot check integrity

STEP 7: REPORTING
- Rows processed: [X]
- Errors encountered: [Y]
- Data quality score: [Z]
- Completion time: [Duration]

Make it handle 1,000-10,000 rows reliably."
```

**Use When:** ETL workflows, report generation, data migration
**Time Saved:** 5-10 hours/week of manual data processing

---

### Template 3: Multi-Application Workflow

```
"Automate task spanning multiple applications.

APPLICATIONS INVOLVED:
1. [App 1] - [What we do here]
2. [App 2] - [What we do here]
3. [App 3] - [What we do here]

WORKFLOW:

IN [APP 1]:
- Action 1: [Specific steps]
- Extract: [Data to get]
- Screenshot: [For verification]

IN [APP 2]:
- Action 2: [Use data from App 1]
- Process: [Transformation needed]
- Output: [What this produces]

IN [APP 3]:
- Action 3: [Final destination]
- Verify: [Confirmation]
- Complete: [End state]

HANDOFFS BETWEEN APPS:
- How to transfer data (copy-paste, file, etc.)
- Verification at each handoff
- Error handling if app not responding

COMPLETION CRITERIA:
- What indicates success
- How to verify end-to-end
- What deliverable looks like

EDGE CASES:
- If App 1 data is empty
- If App 2 login fails
- If App 3 rejects data

Automate complete workflow from start to finish."
```

**Use When:** Cross-platform tasks, complex workflows
**Time Saved:** 3-8 hours/week on multi-app processes

---

### Template 4: Research & Compilation

```
"Automate research and report compilation.

RESEARCH TOPIC: [What to research]
SOURCES: [List websites, tools, databases]
OUTPUT: [Report format]

RESEARCH PROCESS:

FOR EACH SOURCE:
1. Navigate to source
2. Search/filter for: [Criteria]
3. Extract: [Specific data points]
4. Screenshot: [Evidence]
5. Log: [What was found]

COMPILATION:

Create document: [Google Doc / Word / etc.]

Structure:
# [Title]
Date: [Auto-insert]

## Summary
[1-paragraph overview of findings]

## Detailed Findings
### [Source 1]
- Finding 1: [Data]
- Finding 2: [Data]
[Screenshot]

### [Source 2]
[Same structure]

## Analysis
- Patterns observed
- Contradictions found
- Gaps in data
- Recommendations

## Appendix
[Screenshots, raw data, links]

QUALITY CHECKS:
- All sources covered
- Data is current (not outdated)
- Screenshots clear and relevant
- Analysis is substantive (not just summary)

Deliver comprehensive research report."
```

**Use When:** Market research, competitive intelligence, due diligence
**Time Saved:** 4-8 hours per research project

---

### Template 5: Monitoring & Alerting

```
"Setup monitoring workflow with intelligent alerts.

WHAT TO MONITOR:
1. [Metric/system 1] - Check every [frequency]
2. [Metric/system 2] - Check every [frequency]
3. [Metric/system 3] - Check every [frequency]

FOR EACH CHECK:

NORMAL STATE:
- What does healthy look like?
- Acceptable ranges
- Expected values

WARNING TRIGGERS:
- When to raise yellow flag
- Example: Response time >2s but <5s

CRITICAL TRIGGERS:
- When to raise red flag
- Example: Response time >5s or errors >10

ACTIONS:

IF WARNING:
- Log the issue
- Continue monitoring (check more frequently)
- If persists >30 min: Escalate to critical

IF CRITICAL:
- Immediate alert: [Slack / Email / SMS]
- Include: What's wrong, severity, time detected
- Screenshot: Current state
- Suggest: Likely causes and remedies
- Create incident ticket: [Where]

RECOVERY DETECTION:
- When metrics return to normal
- How long normal before all-clear
- Post recovery notification

REPORTING:
Daily summary:
- Checks performed: [X]
- Warnings: [Y]
- Critical alerts: [Z]
- Uptime: [%]
- Response time average: [Ms]

Make this run continuously with minimal supervision."
```

**Use When:** System monitoring, SLA tracking, business metrics watching
**Time Saved:** 24/7 monitoring without dedicated staff

---

## 💼 Business Integration

### This Week: Automation Basics

**Day 1-2: First Automations (4 hours)**
- Automate 3 simple repetitive tasks
- Test and refine
- Measure time saved
- Success: Save 2-3 hours this week

**Day 3-4: Complex Workflow (3 hours)**
- Automate one multi-step, multi-application task
- Add error handling
- Success: Complex task runs successfully

**Day 5-7: Production Setup (3 hours)**
- Setup one daily recurring automation
- Monitor for errors
- Refine based on results
- Success: Autonomous daily workflow working

**Week Results:**
- 5+ tasks automated
- Saved 5-8 hours this week
- Foundation for expanding automation

---

### This Month: Automation System

**Week 1:** Basic task automation
**Week 2:** Complex workflows + error handling
**Week 3:** Production-grade daily automation
**Week 4:** Team automation library + documentation

**Month ROI:**
```
Time saved: 10-15 hours/week
Value: 15 hrs × $100/hr × 4 weeks = $6,000/month
Cost: Claude Pro $20/month
Net: $5,980/month
ROI: 29,900%
```

---

## 🔧 Troubleshooting & Pro Tips

**Problem 1: "Computer Use is slow"**
**Solution:** Expected—Claude takes screenshots, analyzes, then acts. Optimize by being specific about what to click/where to look.

**Problem 2: "Can't find button/element on screen"**
**Solution:** Provide exact location or description. "Click the blue 'Submit' button in bottom right corner."

**Problem 3: "Automation got stuck"**
**Solution:** Add timeout logic. "If no progress in 2 minutes, take screenshot and ask me for help."

**💡 Pro Tip 1: "Verification Screenshots"**
Always request screenshots of completed tasks. Visual proof + easier to debug.

**💡 Pro Tip 2: "Incremental Testing"**
Test with 1-5 items first, then scale to hundreds. Catch errors before mass processing.

**💡 Pro Tip 3: "Error Logs"**
Maintain detailed logs. When automation fails, logs show exactly where and why.

**💡 Pro Tip 4: "Human in Loop"**
For high-stakes tasks, have Claude draft/prepare but require human approval before execution.

**💡 Pro Tip 5: "Version Control"**
Document your automation workflows. When they break (app UI changes), you can fix quickly.

---

## 🎯 Your Action Plan

**Week 1 (10 hours):** Basic automation of 5 repetitive tasks
**Month 1 (40 hours):** Production automation system saving 10-15 hrs/week
**90 Days:** Comprehensive automation across all repetitive workflows

**Final Outcome:** Computer tasks you used to do manually run autonomously, saving 15-20 hours/week.

---

**Next Lesson:** Lesson 15 - Claude Projects (Persistent context, team collaboration, knowledge management) 🚀
