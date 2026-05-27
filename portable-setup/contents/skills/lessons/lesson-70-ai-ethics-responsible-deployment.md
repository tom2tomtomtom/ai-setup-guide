# Lesson 70: AI Ethics & Responsible Deployment

## 💰 Business Reality

AI ethics isn't a philosophy exercise—it's business risk management. Ethical failures cost $1-100M+ (lawsuits, fines, reputational damage). Responsible deployment builds trust (customers, regulators, employees), attracts talent, and creates sustainable competitive advantage. Organizations that ignore ethics face existential risk; those that lead on ethics gain reputation advantage.

**Ethical failures cost:**
```
Bias in hiring AI:
- Discriminates against minorities
- Cost: $100M+ settlement + regulatory fine + brand damage
- Example: Amazon scrapped hiring AI that discriminated against women

Bias in lending AI:
- Denies credit based on race/gender
- Cost: $50M+ fine (happened to multiple banks)
- Example: Capital One, JPMorgan paid tens of millions

Opacity in AI decisions:
- Hospital AI recommends treatment, no one understands why
- Patient harm + liability
- Cost: $1-10M+ per incident

Lack of consent:
- Using data without permission
- GDPR/CCPA violation
- Cost: $4M-27M per violation (regulatory)
```

**Responsible deployment pays:**
```
Investment:
- Ethics framework: $50K setup
- Bias testing: $20K quarterly
- Transparency: $30K (documentation + communication)
- Training: $20K annually

Return:
- Avoid incidents: $1-100M prevented
- Customer trust: 10-20% price premium
- Talent attraction: 20% easier hiring
- Regulatory confidence: Faster approvals

ROI: 1000%+ from avoiding single incident
```

---

## ⚡ 60-Second Quick Start

1. **Identify bias risks** (1 hour)
   - What groups could be harmed?
   - What biases could exist?
   - What would impact mean?

2. **Test for bias** (ongoing)
   - Monthly tests on decision AI
   - Different demographic groups
   - Look for disparate treatment

3. **Be transparent** (communication)
   - Tell customers: "AI helped with this decision"
   - Explain: How decision was made
   - Offer: Appeal/review process

---

## 🎓 Progressive Mastery (9 Exercises)

### Foundation Level

**Exercise 1: Master Responsible AI Deployment Templates**

**Objective**: Learn to apply three distinct AI ethics frameworks tailored to your organization's maturity level (Startup, Mid-Market, Enterprise) to proactively manage risk and build trust.

**Scenario:** Your organization is deploying a new AI system (e.g., a customer service chatbot, a loan approval model, or a content recommendation engine). The risk profile, regulatory scrutiny, and available resources for ethical governance vary dramatically based on your company's size and stage. A one-size-fits-all approach to AI ethics will either over-burden a small team or leave a large enterprise dangerously exposed.

**Your Mission:** Learn 3 AI ethics templates covering different organizational maturity levels. Choose the template matching your situation, then implement it by running the Setup Prompt and analyzing the Practice Scenario.

---

**TEMPLATE 1: The Lean & Focused AI Ethics Checklist (Startup)**

For **early-stage startups (Seed/Series A)** with limited resources and a single, high-impact AI product.

**When to use:**
- **Specific situation 1**: You have 1-2 core AI features and a team of < 20 people.
- **Specific situation 2**: Your primary focus is product-market fit and avoiding a single, catastrophic PR incident.
- **Specific situation 3**: You need a quick, documented risk assessment before a major funding round or launch.
- **Cost/Timeline note**: Minimal cost ($500-$2,000 for a few days of focused work). Timeline: 1 week.
- **Risk level note**: High-impact risk (single failure could be existential).

**Setup Prompt:**
```
You are an AI Ethics Consultant specializing in lean governance for high-growth startups. Your task is to generate a **Minimum Viable Ethics (MVE) Checklist** for a new AI feature.

CONTEXT: [Describe your AI feature in one sentence, e.g., "An AI that screens inbound sales leads for qualification."]
SPECIFIC DATA: [List the data points the AI uses, e.g., "Industry, company size, website activity, and employee count."]
GOALS: [What is the AI's primary business goal, e.g., "Increase qualified lead-to-demo rate by 20%."]
ANALYZE: [Identify the single highest-risk ethical concern (e.g., bias in lead scoring, data privacy violation) and propose a mitigation strategy.]
GENERATE: [A 5-point MVE checklist with a single, measurable success metric for each point.]
```

**Practice Scenario:**
A **Series A FinTech startup** with 15 employees is launching an AI model to predict loan default risk for small businesses.
- **Starting state (current metrics/situation)**: The initial model was trained on a dataset where 85% of the approved loans went to businesses in two specific zip codes, leading to a 40% rejection rate for businesses outside those areas, even with similar financial profiles.
- **Goal they're trying to achieve**: Deploy the model to production while reducing the disparate impact on non-target zip codes to less than 10% and ensuring regulatory compliance.
- **Step-by-step implementation**:
    1. **Identify Risk**: Disparate impact based on geography (proxy for protected class).
    2. **Mitigation**: Retrain the model using a geographically balanced dataset and introduce a fairness constraint (equalized odds) during training.
    3. **Test**: Run a simulation with 1,000 synthetic loan applications, split 50/50 between the two original zip codes and two new, diverse zip codes.
- **Expected results with ACTUAL NUMBERS**: The original model had a 40% rejection rate in the new zip codes. The retrained model achieves a 12% rejection rate in the new zip codes, while maintaining the overall accuracy (AUC) at 0.88. The disparate impact is reduced from 40% to 12% (a 70% reduction).
- **Impact/outcome**: The startup avoids a potential $500,000 fine for discriminatory lending practices and expands its market reach by 30%.

**Success Metrics:**
- [x] **MVE Checklist Created**: A 5-point Minimum Viable Ethics checklist is documented and approved by the CEO.
- [x] **High-Risk Bias Identified**: The single highest-risk bias (e.g., geographic proxy) is explicitly named.
- [x] **Bias Mitigation Implemented**: A technical or process-based mitigation strategy is deployed (e.g., re-weighting data).
- [x] **Disparate Impact Measured**: The difference in outcome (e.g., rejection rate) between two groups is quantified with a percentage.
- [x] **Regulatory Check**: The MVE checklist includes a check for the most relevant regulation (e.g., Equal Credit Opportunity Act).
- [x] **Recourse Defined**: A simple, human-in-the-loop appeal process is documented (e.g., "Email the Head of Product").
- [x] **Risk Reduction Quantified**: The expected reduction in financial/reputational risk is estimated (e.g., "Avoided $500k fine").
- [x] **Team Training**: All 15 employees have completed a 30-minute AI ethics awareness training.

---

**TEMPLATE 2: The Structured AI Ethics Review Board (Mid-Market)**

For **scaling companies (Series B/C to pre-IPO)** with multiple AI systems and a dedicated legal/compliance team.

**When to use:**
- **Specific situation 1**: You have 5-10 production AI models and a team of 100-500 people.
- **Specific situation 2**: You are preparing for regulatory audits (e.g., SOC 2, ISO 27001) and need formal documentation.
- **Specific situation 3**: You need a repeatable, structured process for reviewing all new AI projects before deployment.
- **Cost/Timeline note**: Moderate cost ($10,000-$50,000 annually for dedicated staff time). Timeline: 4-6 weeks for initial setup.
- **Risk level note**: Significant financial and reputational risk (fines up to $10M).

**Setup Prompt:**
```
You are the Chair of a newly formed Mid-Market AI Ethics Review Board. Your task is to create a **Formal Pre-Deployment Ethics Review Document** for a new, customer-facing AI system.

CONTEXT: [Describe the new AI system, e.g., "A content recommendation engine that uses user behavior to personalize the homepage feed."]
SPECIFIC DATA: [List the sensitive data used, e.g., "User purchase history, demographic data (age/location), and browsing time."]
GOALS: [What is the AI's primary business goal, e.g., "Increase average session time by 15% and conversion rate by 5%."]
ANALYZE: [Identify three key ethical risks (e.g., filter bubbles/manipulation, data privacy, model drift) and assign a severity score (1-5) to each.]
GENERATE: [A 7-section Pre-Deployment Ethics Review Document, including a risk matrix and a mandatory mitigation plan for all risks scoring 4 or higher.]
```

**Practice Scenario:**
A **Mid-Market e-commerce company** with 300 employees is launching a new AI-powered content recommendation engine.
- **Starting state (current metrics/situation)**: The initial model, optimized purely for engagement, led to 70% of users being shown content from only 5% of the product catalog, creating "filter bubbles" and reducing long-tail product sales by 15%.
- **Goal they're trying to achieve**: Deploy the engine with an ethical constraint that ensures content diversity (no user sees content from less than 20% of the catalog over a month) while maintaining a 10% increase in session time.
- **Step-by-step implementation**:
    1. **Formal Review**: The Ethics Review Board identifies "Manipulation/Filter Bubble" as a Severity 4 risk.
    2. **Mitigation**: A diversity metric is added to the model's objective function, penalizing over-exposure to a small set of items.
    3. **Monitoring**: Automated alerts are set up to flag any user whose exposure falls below the 20% threshold for more than 7 days.
- **Expected results with ACTUAL NUMBERS**: The revised model achieves an 11% increase in session time (meeting the goal) and increases long-tail product sales by 8%. The number of users in a "filter bubble" (exposure < 20%) drops from 70% to 5%.
- **Impact/outcome**: The company avoids a major PR crisis about manipulative algorithms and increases its revenue from long-tail products by $2 million annually.

**Success Metrics:**
- [x] **Ethics Review Board Formed**: The composition and charter of the Review Board are formally documented.
- [x] **Pre-Deployment Document Completed**: The 7-section review document is filled out for the new AI system.
- [x] **Three Key Risks Identified**: Three distinct ethical risks are identified and scored on a 1-5 severity scale.
- [x] **Mitigation Plan Approved**: A formal mitigation plan is approved for all high-severity risks (Score 4+).
- [x] **Ethical Constraint Encoded**: A measurable ethical constraint (e.g., content diversity threshold) is added to the model.
- [x] **Bias Testing Protocol**: A plan for quarterly bias testing on demographic groups is scheduled.
- [x] **Appeal Process Formalized**: A clear, 3-step customer appeal process with a 10-day SLA is published.
- [x] **Audit Readiness**: All documentation is organized to pass a standard regulatory audit (e.g., SOC 2).
- [x] **Risk-Adjusted ROI Calculated**: The projected revenue increase is adjusted for the cost of the ethics program.

---

**TEMPLATE 3: The Comprehensive AI Governance Framework (Enterprise)**

For **large enterprises (Fortune 500)** with dozens of AI systems, global operations, and significant regulatory exposure.

**When to use:**
- **Specific situation 1**: You have 20+ AI systems, operate in multiple jurisdictions (GDPR, CCPA), and have a dedicated Chief AI Officer.
- **Specific situation 2**: You need to establish a centralized AI governance body and a continuous monitoring system.
- **Specific situation 3**: Your AI systems are mission-critical (e.g., healthcare, finance, infrastructure) and require maximum safety and accountability.
- **Cost/Timeline note**: High, ongoing cost ($500,000+ annually for dedicated governance staff and tools). Timeline: 6-12 months for full implementation.
- **Risk level note**: Catastrophic financial and legal risk (fines up to 4% of global revenue).

**Setup Prompt:**
```
You are the Chief AI Officer for a global Enterprise. Your task is to design a **Continuous AI Ethics Monitoring and Incident Response System** for a high-stakes AI deployment.

CONTEXT: [Describe the high-stakes AI system, e.g., "An AI that determines dynamic pricing for prescription drugs based on demand and inventory."]
SPECIFIC DATA: [List all data points, including sensitive ones, e.g., "Patient location, insurance status, drug demand elasticity, and competitor pricing."]
GOALS: [What is the AI's primary business goal, e.g., "Optimize pricing to maximize revenue while ensuring access for low-income patients."]
ANALYZE: [Identify four high-stakes ethical risks (e.g., price gouging, systemic discrimination, model drift, lack of accountability) and define a specific, automated alert trigger for each.]
GENERATE: [A 10-point Incident Response Protocol, including a 48-hour "Kill Switch" decision matrix and a public communication plan.]
```

**Practice Scenario:**
A **Fortune 500 healthcare provider** is using an AI to optimize drug inventory and set dynamic pricing across 50 hospitals.
- **Starting state (current metrics/situation)**: The AI, optimized for profit, began setting prices for a critical, life-saving drug 30% higher in low-income neighborhoods, leading to a 15% drop in prescriptions filled in those areas.
- **Goal they're trying to achieve**: Implement a "Fair Access" constraint to cap price differences between the highest and lowest income areas at 5%, while maintaining 95% of the original revenue optimization.
- **Step-by-step implementation**:
    1. **Governance**: The AI Governance Committee mandates a "Fair Access" constraint.
    2. **Alert Trigger**: An automated alert is set to trigger if the price difference for any essential drug exceeds 5% between the highest and lowest income zip codes.
    3. **Incident Response**: The alert triggers. The 48-hour protocol is activated, leading to a temporary manual override of the pricing model in the affected areas (the "Kill Switch").
    4. **Fix**: The model is retrained with a hard constraint on price equity based on a social vulnerability index.
- **Expected results with ACTUAL NUMBERS**: The retrained model achieves 96% of the original revenue optimization target. The price difference between high and low-income areas is reduced to 4.5%. The prescription fill rate in low-income areas recovers to 98% of the pre-incident level.
- **Impact/outcome**: The company avoids a class-action lawsuit and a potential $100 million regulatory fine, solidifying its reputation as a socially responsible provider.

**Success Metrics:**
- [x] **Governance Body Established**: A formal AI Governance Committee with cross-functional representation is active.
- [x] **Four High-Stakes Risks Identified**: Four distinct, high-severity ethical risks are identified for the system.
- [x] **Automated Alert Triggered**: A specific, measurable alert condition is defined (e.g., price difference > 5%).
- [x] **Incident Response Protocol**: A 10-point Incident Response Protocol is documented and tested.
- [x] **"Kill Switch" Defined**: A clear, 48-hour decision matrix for model deactivation is in place.
- [x] **Fairness Constraint Implemented**: A hard, measurable constraint (e.g., max 5% price difference) is encoded in the model.
- [x] **Model Drift Monitoring**: A system for continuous monitoring of model performance and fairness metrics is active.
- [x] **Public Communication Plan**: A pre-approved statement for a public ethical incident is drafted.
- [x] **Regulatory Compliance Map**: The system is mapped against all relevant global regulations (e.g., GDPR, EU AI Act).
- [x] **Annual Audit Scheduled**: A mandatory, independent third-party audit is scheduled for the system.

---

**What You're Learning:**

- ✅ **AI ETHICS IS RISK MANAGEMENT**: The primary driver for AI ethics is mitigating financial, legal, and reputational risk, not just philosophical debate.
- ✅ **MATURITY DRIVES GOVERNANCE**: The complexity of your AI ethics framework must scale with your organization's size and the criticality of your AI systems.
- ✅ **FAIRNESS REQUIRES MEASUREMENT**: Ethical principles like fairness and transparency must be translated into quantifiable metrics (e.g., disparate impact, disclosure rate) that can be monitored.
- ✅ **ACCOUNTABILITY NEEDS PROCESS**: Clear accountability requires formal structures like Ethics Review Boards, Incident Response Protocols, and a human-in-the-loop appeal process.
- ✅ **PROMPT ENGINEERING FOR GOVERNANCE**: You can use LLMs to rapidly generate the initial drafts of your ethics checklists, review documents, and incident protocols, saving significant time and legal costs.

**Try It Now:**

1. **Assess**: Determine your organization's current AI maturity level (Startup, Mid-Market, or Enterprise).
2. **Define**: Select the corresponding template and define the context, data, and goals for your most critical AI system.
3. **Analyze**: Use the Setup Prompt to generate your initial ethics checklist or review document.
4. **Implement**: Encode the primary ethical constraint (e.g., diversity, equity, privacy) into your model's objective function or pre/post-processing pipeline.
5. **Measure**: Set up an automated dashboard to track your key success metrics (e.g., disparate impact, appeal response time).
6. **Test**: Run a synthetic or real-world scenario test to see if your ethical constraint holds under stress.
7. **Document**: Formalize your findings and integrate the chosen template into your organization's official AI governance policy.

**Success Metric:**
- You have a documented, measurable, and organizationally-approved AI ethics framework that is actively mitigating a high-priority risk in a production AI system.


**Exercise 2: Establish Ethical Framework (5 min)**

*Objective*: Define what responsible AI means for you

**Framework:**
```
FAIRNESS:
- Principle: AI treats all groups fairly
- Implementation: Test for disparate impact
- Measure: Same accuracy/outcomes across groups

TRANSPARENCY:
- Principle: People know when AI is used
- Implementation: Disclose AI involvement
- Measure: 100% disclosure for customer-facing decisions

ACCOUNTABILITY:
- Principle: Someone responsible if AI fails
- Implementation: Clear ownership + appeal process
- Measure: Response time < 24 hours to complaints

SAFETY:
- Principle: AI doesn't cause harm
- Implementation: Testing + validation before deployment
- Measure: Zero undetected safety issues

PRIVACY:
- Principle: Personal data protected
- Implementation: Encryption + consent + deletion rights
- Measure: GDPR/CCPA compliance 100%

VALUES ALIGNMENT:
- Principle: AI reflects company values
- Implementation: Training + guidelines
- Measure: Staff understand + enforce
```

**Exercise 3: Create Ethical Decision Framework (5 min)**

*Objective*: Make ethical decisions systematically

**Decision process:**
```
When deploying AI, ask:

1. FAIRNESS: Could this harm a protected group?
   - If yes: Bias testing required
   - If yes: Human review required
   - If yes: Opt-out available

2. TRANSPARENCY: Would customers want to know AI was used?
   - If yes: Disclose
   - If maybe: Disclose to be safe
   - If no: Can still disclose (builds trust)

3. ACCOUNTABILITY: If something goes wrong, who's responsible?
   - AI makes decision: Company responsible
   - AI assists human: Human + company responsible
   - Clear accountability before deployment

4. SAFETY: Could this harm someone?
   - If yes: Extra testing required
   - If yes: Insurance required
   - If yes: Consider not deploying

5. CONSENT: Do we have permission to use this data?
   - If no: Get permission or don't use
   - If implicit: Make explicit
   - If user can opt-out: They can
```

### Intermediate Level

**Exercise 4: Design Bias Testing Program (7 min)**

*Objective*: Systematically test and mitigate bias

**Testing framework:**
```
For any decision-making AI:

Test Design:
- Hypothesis: "AI is biased against [group]"
- Control group: [Group A]
- Test group: [Group B] (identical except protected characteristic)
- Sample size: 50-100 instances per group
- Metrics: Accuracy, approval rate, score distribution

Example - Hiring Bias Test:
Resume A: "John Smith, Yale, 5 years experience, Engineer"
Resume B: "Jamal Williams, Yale, 5 years experience, Engineer"
Score A: 8.5/10
Score B: 7.2/10
Finding: Bias detected (1.3 point difference)

Action:
- Retrain: Model on debiased data
- Retest: Verify bias eliminated
- Monitor: Monthly testing ongoing

Frequency:
- New models: Comprehensive testing before deployment
- Quarterly: Spot checks on production models
- Alert: If bias detected, halt use immediately
```

**Exercise 5: Implement Transparency Program (7 min)**

*Objective*: Communicate AI use responsibly

**Transparency program:**
```
CUSTOMER-FACING:
When AI is used in customer decision:
- Disclose: "An AI system assisted with this decision"
- Explain: How it works (plain English)
- Appeal: Process to dispute decision
- Alternative: Human review available

Example disclosure:
"Your loan application was reviewed using our risk assessment system.
This system considers credit history, income, and loan amount.
It recommended approval (80% confidence).
A human loan officer reviewed the recommendation and approved your application.
If you disagree with the decision, you can appeal (see process)."

INTERNAL:
Within organization:
- Document: How AI is used
- Train: Staff on responsible use
- Guidelines: What's appropriate use

REGULATORY:
For regulators if inquired:
- Document: How algorithm works
- Test results: Bias testing showed no disparate impact
- Cases: Document decisions and outcomes
- Appeal: Process for disputing decisions

Frequency:
- Every customer-facing decision: Disclose
- Every quarter: Review transparency adequacy
- Every incident: Explain what happened
```

**Exercise 6: Create Appeal & Recourse Process (7 min)**

*Objective*: Give people way to dispute AI decisions

**Process design:**
```
Customer disputes AI decision:

STEP 1: Appeal (Customer initiates)
- Method: Email, form, phone call (choose)
- Timeline: Response within 5 business days
- Content: What decision, why they disagree

STEP 2: Review (Human reviews)
- Who: Trained specialist (not AI developer)
- What: Manually review the decision
- Process: Was AI process correct? Is outcome fair?

STEP 3: Decision
- Option A: Overturn (change decision)
- Option B: Sustain (keep decision but explain better)
- Option C: Investigate further (need more info)
- Timeline: Decision within 10 business days

STEP 4: Escalation (if customer disagrees)
- To: Manager or ethics committee
- Process: Independent human review
- Final: Company makes final call

Metrics:
- Appeal time: <5 days to response target
- Overturn rate: Should be 5-10% (if higher: AI problem)
- Satisfaction: Customers feel heard
```

### Advanced Level

**Exercise 7: Build Continuous Monitoring (8 min)**

*Objective*: Detect ethical issues before they become problems

**Monitoring program:**
```
MONTHLY AUDITS:
- Accuracy by group: Is AI equally accurate for all?
- Outcome equity: Same approval rate across groups?
- Appeal rate: Do certain groups appeal more? (might indicate bias)
- Complaints: What's being complained about?

QUARTERLY DEEP DIVES:
- Bias testing: Comprehensive testing like Exercise 4
- Case review: Sample decisions, manually verify
- Impact assessment: Who's being helped/harmed?
- Trend analysis: Is problem getting better/worse?

ALERTS (Automated):
- Disparate impact: If approval rate differs >5% by group
- Error rate spike: If accuracy drops for any group
- Appeal spike: If appeals increase for any group
- Complaint pattern: If similar complaints from one group

Action on alert:
- Immediate: Escalate to ethics committee
- 24 hours: Investigate root cause
- 48 hours: Decide: Continue with monitoring OR halt use
- 1 week: Fix and retest if continuing
```

**Exercise 8: Develop Values-Aligned AI (8 min)**

*Objective*: Ensure AI reflects company values

**Process:**
```
Step 1: Define company values
- Examples: "Fairness", "Honesty", "Respect"
- Be specific: What does each value mean?

Step 2: Translate to AI context
- How does fairness apply to this AI?
- How does honesty apply to this AI?
- What should AI do differently as result?

Step 3: Encode in AI
- Objective function: What is AI optimizing for?
- Constraints: What should AI never do?
- Training: What examples teach right values?

Step 4: Test alignment
- Scenario test: Put AI in value-challenging situation
- Does it choose company values or economic gain?
- Examples: Privacy vs. profit, fairness vs. efficiency

Step 5: Continuous refinement
- Get feedback: Are people seeing values in AI?
- Adjust: If misaligned, retrain

Example - If company values privacy:
- AI should NOT optimize for maximum data collection
- AI SHOULD minimize data needed for same accuracy
- AI SHOULD delete data when no longer useful
- AI SHOULD give users control over their data
```

**Exercise 9: Create Ethics Governance (8 min)**

*Objective*: Institutionalize ethics in organization

**Governance structure:**
```
ETHICS COMMITTEE:
- Composition: CTO, Legal, HR, Privacy Officer, external expert
- Frequency: Monthly meetings
- Mandate: Review all AI decisions
  - New AI deployment: Approve before launch
  - Incidents: Investigate and recommend fixes
  - Monitoring: Review metrics monthly
  - Policy: Update ethics policies

PROCESS FOR NEW AI:
1. Proposal: Team describes AI system
2. Ethics review: Committee assesses:
   - Fairness: Could it harm a group?
   - Privacy: Data handled responsibly?
   - Transparency: Users understand?
   - Safety: Could it cause harm?
3. Conditions: Committee adds requirements
   - Bias testing mandatory
   - Disclosure required
   - Monitoring ongoing
   - Appeal process needed
4. Approval: Deploy with conditions
5. Ongoing: Review quarterly

PROCESS FOR INCIDENTS:
1. Report: Any ethical concern reported immediately
2. Investigation: What happened? Why?
3. Action: How to prevent? What to fix?
4. Communication: Transparent explanation
5. Change: Update process to prevent repeat
6. Learning: Share across organization

CULTURE:
- Ethics as everyone's responsibility
- Raise concerns without fear
- Learn from incidents (not punish)
- Transparency with customers
- Values-driven AI development
```

---

## Summary

Responsible AI deployment builds trust with customers, employees, and regulators while avoiding catastrophic ethical failures ($1-100M+). The investment in ethics (bias testing, transparency, appeal processes, monitoring) is 1-5% of AI budget but prevents 100-1000× the cost in incidents. Organizations that lead on ethics gain reputation advantage and attract top talent. Those that ignore ethics face lawsuits, fines, and disruption.
