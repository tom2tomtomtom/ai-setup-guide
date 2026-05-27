---
name: prompt-engineering-patterns
description: Make LLM outputs reliable and consistent with structured prompting, chain-of-thought, and few-shot techniques. Use when outputs are inconsistent, you need structured data from free text, or you are reducing hallucinations in a production AI app.
---

# Prompt Engineering Patterns

Comprehensive guide for crafting effective prompts that produce reliable, high-quality outputs from LLMs. Covers structured outputs, reasoning techniques, parameter tuning, and production patterns.

## When to Use This Skill

Use this skill when:
- Building LLM applications requiring consistent output formats
- Implementing complex reasoning or analysis tasks
- Designing conversational AI with specific behaviors
- Creating content generation systems
- Extracting structured data from unstructured text
- Building agents that need reliable function calling
- Optimizing LLM performance for specific tasks
- Reducing hallucinations and improving accuracy

## Core Principles

### The Four Pillars of Effective Prompts

1. **Clarity**: Be specific and unambiguous
2. **Context**: Provide relevant background information
3. **Constraints**: Define boundaries and requirements
4. **Examples**: Show desired input/output patterns

### Prompt Structure Template

```
[ROLE/PERSONA] - Who the AI should act as
[CONTEXT] - Background information
[TASK] - What to do
[FORMAT] - How to structure output
[CONSTRAINTS] - What NOT to do
[EXAMPLES] - Sample inputs/outputs (optional)
```

## Structured Outputs

### JSON Mode (Anthropic Claude)

Force JSON responses for reliable parsing.

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function extractStructuredData(text: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Extract the following information from the text and return ONLY valid JSON.

Schema:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string"
}

Text: ${text}

JSON:`,
      },
    ],
  });

  const response = message.content[0].type === 'text' 
    ? message.content[0].text 
    : '';
  
  return JSON.parse(response);
}
```

**Best practices for JSON extraction:**
- Explicitly request "valid JSON" or "JSON only"
- Provide schema/example structure
- Use "JSON:" prefix to anchor response
- Validate and catch parsing errors
- Consider using `JSON.parse()` with try-catch

### Structured Output with Validation

```typescript
import { z } from 'zod';

const PersonSchema = z.object({
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email(),
  interests: z.array(z.string()),
});

type Person = z.infer<typeof PersonSchema>;

async function extractPerson(text: string): Promise<Person> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Extract person information from this text as JSON matching this exact schema:

{
  "name": "string",
  "age": number (positive integer),
  "email": "string (valid email)",
  "interests": ["array", "of", "strings"]
}

Text: ${text}

Return ONLY the JSON object, no additional text.`,
      },
    ],
  });

  const response = message.content[0].type === 'text'
    ? message.content[0].text
    : '{}';
  
  const parsed = JSON.parse(response);
  return PersonSchema.parse(parsed); // Throws if invalid
}
```

### Function Calling Pattern

```typescript
interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

const functions: FunctionDefinition[] = [
  {
    name: 'search_documents',
    description: 'Search the knowledge base for relevant documents',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results (default: 5)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_task',
    description: 'Create a new task in the system',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        due_date: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
        priority: { type: 'string', description: 'Priority: low, medium, high' },
      },
      required: ['title'],
    },
  },
];

async function getFunctionCall(userMessage: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a function-calling assistant. Given the user's message, determine which function to call.

Available functions:
${JSON.stringify(functions, null, 2)}

User message: "${userMessage}"

If a function should be called, respond with JSON in this format:
{
  "function": "function_name",
  "arguments": { "arg1": "value1" }
}

If no function is needed, respond with:
{ "function": null, "response": "Your natural language response" }

JSON:`,
      },
    ],
  });

  const response = message.content[0].type === 'text'
    ? message.content[0].text
    : '{}';
  
  return JSON.parse(response);
}

// Usage
const call = await getFunctionCall('Search for documents about RAG');
// { function: "search_documents", arguments: { query: "RAG" } }
```

### Multi-Field Extraction

```typescript
interface Invoice {
  invoice_number: string;
  date: string;
  vendor: string;
  total: number;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
}

async function extractInvoice(invoiceText: string): Promise<Invoice> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Extract all invoice information from this text.

IMPORTANT: Return ONLY valid JSON matching this schema:
{
  "invoice_number": "string",
  "date": "YYYY-MM-DD",
  "vendor": "string",
  "total": number,
  "items": [
    {
      "description": "string",
      "quantity": number,
      "price": number
    }
  ]
}

Invoice text:
${invoiceText}

JSON:`,
      },
    ],
  });

  const response = message.content[0].type === 'text'
    ? message.content[0].text
    : '{}';
  
  return JSON.parse(response);
}
```

## Chain-of-Thought (CoT)

### Basic Chain-of-Thought

Encourage step-by-step reasoning for complex problems.

```typescript
async function solveWithCoT(problem: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Solve this problem step by step. Think through your reasoning before providing the final answer.

Problem: ${problem}

Let's think step by step:
1.`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

**Example:**
```
Problem: If a train travels 120 miles in 2 hours, then slows down and travels 80 miles in 3 hours, what is its average speed for the entire journey?

Let's think step by step:
1. Calculate total distance: 120 + 80 = 200 miles
2. Calculate total time: 2 + 3 = 5 hours
3. Average speed = total distance / total time = 200 / 5 = 40 mph

Answer: 40 mph
```

### Zero-Shot CoT

Simple prompt addition that improves reasoning.

```typescript
async function zeroShotCoT(question: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `${question}

Let's think step by step.`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

### Self-Consistency CoT

Generate multiple reasoning paths and select the most consistent answer.

```typescript
async function selfConsistencyCoT(problem: string, samples: number = 5): Promise<string> {
  const responses: string[] = [];
  
  for (let i = 0; i < samples; i++) {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.7, // Higher temperature for diversity
      messages: [
        {
          role: 'user',
          content: `${problem}

Let's think step by step and provide your final answer.`,
        },
      ],
    });
    
    const response = message.content[0].type === 'text'
      ? message.content[0].text
      : '';
    responses.push(response);
  }
  
  // Extract final answers and find most common
  const answers = responses.map(extractFinalAnswer);
  const mostCommon = findMostCommon(answers);
  
  return mostCommon;
}

function extractFinalAnswer(response: string): string {
  // Extract answer after "Answer:", "Therefore:", etc.
  const match = response.match(/(?:Answer|Therefore|Final answer):\s*(.+?)(?:\n|$)/i);
  return match ? match[1].trim() : response.split('\n').pop()?.trim() || '';
}

function findMostCommon(arr: string[]): string {
  const counts = new Map<string, number>();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  return Array.from(counts.entries()).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}
```

### Tree-of-Thought (Advanced)

Explore multiple reasoning branches.

```typescript
async function treeOfThought(problem: string): Promise<string> {
  // Step 1: Generate possible approaches
  const approachesMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `List 3 different approaches to solve this problem:

${problem}

Approaches:`,
      },
    ],
  });

  const approaches = approachesMsg.content[0].type === 'text'
    ? approachesMsg.content[0].text.split('\n').filter(Boolean)
    : [];

  // Step 2: Evaluate each approach
  const evaluations = await Promise.all(
    approaches.map(async (approach) => {
      const evalMsg = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Rate this approach to solve the problem on a scale of 1-10 and explain why:

Problem: ${problem}
Approach: ${approach}

Rating:`,
          },
        ],
      });
      
      const evaluation = evalMsg.content[0].type === 'text'
        ? evalMsg.content[0].text
        : '';
      
      const rating = parseInt(evaluation.match(/\d+/)?.[0] || '0', 10);
      
      return { approach, rating, evaluation };
    })
  );

  // Step 3: Select best approach and solve
  const best = evaluations.reduce((a, b) => (b.rating > a.rating ? b : a));
  
  const solutionMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Solve this problem using the following approach:

Problem: ${problem}
Approach: ${best.approach}

Solution:`,
      },
    ],
  });

  return solutionMsg.content[0].type === 'text'
    ? solutionMsg.content[0].text
    : '';
}
```

## Few-Shot Learning

### Basic Few-Shot Pattern

Provide examples to guide output format and style.

```typescript
async function fewShotClassification(text: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Classify the sentiment of the following text as positive, negative, or neutral.

Examples:
Text: "I love this product! It exceeded my expectations."
Sentiment: positive

Text: "The service was terrible and the food was cold."
Sentiment: negative

Text: "The package arrived on time."
Sentiment: neutral

Now classify:
Text: "${text}"
Sentiment:`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text.trim() : '';
}
```

### Few-Shot with Reasoning

Include reasoning in examples for complex tasks.

```typescript
async function fewShotWithReasoning(text: string): Promise<{ category: string; reason: string }> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Categorize customer support tickets and explain your reasoning.

Example 1:
Text: "My order hasn't arrived yet and it's been 10 days."
Reasoning: Customer is inquiring about a delayed shipment.
Category: shipping_issue

Example 2:
Text: "How do I reset my password? I can't log in."
Reasoning: Customer needs help with account access.
Category: account_access

Example 3:
Text: "I want to return this item for a refund."
Reasoning: Customer wants to return a product and get money back.
Category: return_refund

Now categorize:
Text: "${text}"
Reasoning:`,
      },
    ],
  });

  const response = message.content[0].type === 'text'
    ? message.content[0].text
    : '';
  
  const reasoningMatch = response.match(/Reasoning:\s*(.+?)(?=\nCategory:|$)/s);
  const categoryMatch = response.match(/Category:\s*(\w+)/);
  
  return {
    reason: reasoningMatch?.[1].trim() || '',
    category: categoryMatch?.[1].trim() || 'unknown',
  };
}
```

### Dynamic Few-Shot (Retrieval-Based)

Select relevant examples based on input.

```typescript
interface Example {
  input: string;
  output: string;
  embedding?: number[];
}

class DynamicFewShot {
  private examples: Example[] = [];

  async addExamples(examples: Array<{ input: string; output: string }>) {
    this.examples = examples;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  }

  async findSimilarExamples(input: string, k: number = 3): Promise<Example[]> {
    // Assuming generateEmbedding function exists
    const inputEmbedding = await generateEmbedding(input);
    
    const similarities = this.examples.map(example => {
      if (!example.embedding) return { example, score: 0 };
      const score = this.cosineSimilarity(inputEmbedding, example.embedding);
      return { example, score };
    });
    
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(s => s.example);
  }

  async predict(input: string): Promise<string> {
    const relevantExamples = await this.findSimilarExamples(input, 3);
    
    const examplesText = relevantExamples
      .map((ex, i) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}`)
      .join('\n\n');
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `${examplesText}

Now predict:
Input: ${input}
Output:`,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}
```

## System Prompts

### Role-Based System Prompts

```typescript
const systemPrompts = {
  codeReviewer: `You are an expert code reviewer focused on:
- Code quality and best practices
- Security vulnerabilities
- Performance optimizations
- Maintainability and readability

Provide constructive feedback with specific suggestions.`,

  technicalWriter: `You are a technical documentation writer specializing in:
- Clear, concise explanations
- Step-by-step tutorials
- Code examples with comments
- Troubleshooting sections

Write for developers with intermediate experience.`,

  dataAnalyst: `You are a data analyst expert in:
- Statistical analysis
- Data visualization recommendations
- Pattern recognition
- Actionable insights

Explain findings clearly with supporting evidence.`,
};

async function askWithRole(question: string, role: keyof typeof systemPrompts) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompts[role],
    messages: [{ role: 'user', content: question }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

### Persona with Constraints

```typescript
const customerSupportAgent = `You are a friendly customer support agent for TechCo.

Guidelines:
- Always be polite and empathetic
- Acknowledge customer frustration
- Provide clear, step-by-step solutions
- If you can't help, escalate to a specialist
- Use simple language, avoid jargon
- End with "Is there anything else I can help with?"

Never:
- Make promises you can't keep
- Blame the customer
- Share confidential information
- Discuss other customers or cases`;

async function handleCustomerQuery(query: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: customerSupportAgent,
    messages: [{ role: 'user', content: query }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

### Multi-Turn System Context

```typescript
interface ConversationContext {
  userProfile: {
    name: string;
    preferences: string[];
    history: string[];
  };
  systemState: {
    currentTask?: string;
    completedTasks: string[];
  };
}

function buildSystemPrompt(context: ConversationContext): string {
  return `You are an AI assistant helping ${context.userProfile.name}.

User Preferences:
${context.userProfile.preferences.map(p => `- ${p}`).join('\n')}

Recent Activity:
${context.userProfile.history.slice(-3).map(h => `- ${h}`).join('\n')}

${context.systemState.currentTask ? `Current Task: ${context.systemState.currentTask}` : ''}

Completed Today:
${context.systemState.completedTasks.map(t => `✓ ${t}`).join('\n')}

Maintain context from our conversation and personalize responses based on preferences.`;
}

async function chatWithContext(
  message: string,
  context: ConversationContext
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: buildSystemPrompt(context),
    messages: [{ role: 'user', content: message }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
```

## Parameter Tuning

### Temperature

Controls randomness in outputs.

```typescript
interface TemperatureConfig {
  creative: number;    // 0.7-1.0
  balanced: number;    // 0.5-0.7
  precise: number;     // 0.0-0.3
}

const temperatures: TemperatureConfig = {
  creative: 0.9,  // For creative writing, brainstorming
  balanced: 0.6,  // For general conversation
  precise: 0.2,   // For factual, deterministic tasks
};

async function generateWithTemperature(
  prompt: string,
  mode: keyof TemperatureConfig
) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    temperature: temperatures[mode],
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

**Use cases:**
- **Temperature 0.0-0.3**: Code generation, data extraction, classification
- **Temperature 0.4-0.7**: General Q&A, summarization, translation
- **Temperature 0.8-1.0**: Creative writing, brainstorming, marketing copy

### Top-P (Nucleus Sampling)

Alternative to temperature for controlling randomness.

```typescript
async function generateWithTopP(prompt: string, topP: number = 0.9) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    top_p: topP,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

**Recommended values:**
- **0.1-0.3**: Very focused, deterministic
- **0.5-0.7**: Balanced diversity
- **0.9-1.0**: Maximum creativity

### Max Tokens

Control output length.

```typescript
const maxTokensByTask = {
  shortAnswer: 256,      // Yes/no, brief responses
  paragraph: 512,        // Single paragraph
  article: 2048,         // Short article
  longForm: 4096,        // Long-form content
};

async function generateWithLength(
  prompt: string,
  taskType: keyof typeof maxTokensByTask
) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokensByTask[taskType],
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

### Stop Sequences

Control where generation stops.

```typescript
async function generateWithStopSequences(prompt: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    stop_sequences: ['\n\n', 'END', '---'],
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

// Example: Generate bullet points that stop at double newline
async function generateBulletPoints(topic: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    stop_sequences: ['\n\n\n'], // Stop after bullet list
    messages: [
      {
        role: 'user',
        content: `List the key features of ${topic}:\n\n-`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}
```

## Prompt Templates

### Template System

Reusable prompt templates with variable substitution.

```typescript
interface PromptTemplate {
  name: string;
  template: string;
  variables: string[];
}

class PromptTemplateEngine {
  private templates: Map<string, PromptTemplate> = new Map();

  addTemplate(template: PromptTemplate) {
    this.templates.set(template.name, template);
  }

  render(templateName: string, variables: Record<string, string>): string {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);

    let rendered = template.template;
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return rendered;
  }

  async execute(templateName: string, variables: Record<string, string>) {
    const prompt = this.render(templateName, variables);
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}

// Define templates
const templates = new PromptTemplateEngine();

templates.addTemplate({
  name: 'summarize',
  template: `Summarize the following {{content_type}} in {{length}} words or less:

{{content}}

Summary:`,
  variables: ['content_type', 'length', 'content'],
});

templates.addTemplate({
  name: 'translate',
  template: `Translate the following text from {{source_lang}} to {{target_lang}}:

{{text}}

Translation:`,
  variables: ['source_lang', 'target_lang', 'text'],
});

templates.addTemplate({
  name: 'code_review',
  template: `Review this {{language}} code for:
- Code quality
- Security issues
- Performance
- Best practices

Code:
\`\`\`{{language}}
{{code}}
\`\`\`

Review:`,
  variables: ['language', 'code'],
});

// Usage
const summary = await templates.execute('summarize', {
  content_type: 'article',
  length: '100',
  content: 'Long article text here...',
});

const translation = await templates.execute('translate', {
  source_lang: 'English',
  target_lang: 'Spanish',
  text: 'Hello, how are you?',
});
```

### Conditional Templates

```typescript
interface ConditionalPrompt {
  condition: (context: any) => boolean;
  template: string;
}

class ConditionalPromptEngine {
  async selectAndExecute(
    prompts: ConditionalPrompt[],
    context: any,
    message: string
  ): Promise<string> {
    const selected = prompts.find(p => p.condition(context));
    const template = selected?.template || prompts[prompts.length - 1].template;
    
    const fullPrompt = template.replace('{{message}}', message);
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }
}

// Example: Different prompts based on user expertise
const expertisePrompts: ConditionalPrompt[] = [
  {
    condition: (ctx) => ctx.expertiseLevel === 'beginner',
    template: `Explain the following concept in simple terms with analogies:

{{message}}

Explanation:`,
  },
  {
    condition: (ctx) => ctx.expertiseLevel === 'intermediate',
    template: `Explain the following concept with examples:

{{message}}

Explanation:`,
  },
  {
    condition: (ctx) => ctx.expertiseLevel === 'expert',
    template: `Provide a technical deep-dive on:

{{message}}

Analysis:`,
  },
  {
    condition: () => true, // Default
    template: '{{message}}',
  },
];
```

## Testing and Evaluation

### Unit Testing Prompts

```typescript
import { describe, it, expect } from 'vitest';

describe('Sentiment Classification', () => {
  it('should classify positive sentiment', async () => {
    const result = await fewShotClassification(
      'This product is amazing! I love it!'
    );
    expect(result.toLowerCase()).toBe('positive');
  });

  it('should classify negative sentiment', async () => {
    const result = await fewShotClassification(
      'Terrible experience. Would not recommend.'
    );
    expect(result.toLowerCase()).toBe('negative');
  });

  it('should classify neutral sentiment', async () => {
    const result = await fewShotClassification(
      'The item arrived on schedule.'
    );
    expect(result.toLowerCase()).toBe('neutral');
  });
});
```

### Prompt Evaluation Framework

```typescript
interface EvaluationMetric {
  name: string;
  evaluate: (input: string, output: string, expected?: string) => Promise<number>;
}

class PromptEvaluator {
  private metrics: EvaluationMetric[] = [];

  addMetric(metric: EvaluationMetric) {
    this.metrics.push(metric);
  }

  async evaluate(
    prompt: string,
    testCases: Array<{ input: string; expected?: string }>
  ): Promise<Record<string, number>> {
    const results: Record<string, number[]> = {};

    for (const testCase of testCases) {
      const output = await this.runPrompt(prompt, testCase.input);

      for (const metric of this.metrics) {
        const score = await metric.evaluate(testCase.input, output, testCase.expected);
        if (!results[metric.name]) results[metric.name] = [];
        results[metric.name].push(score);
      }
    }

    // Average scores
    const averaged: Record<string, number> = {};
    for (const [name, scores] of Object.entries(results)) {
      averaged[name] = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    return averaged;
  }

  private async runPrompt(prompt: string, input: string): Promise<string> {
    const fullPrompt = prompt.replace('{{input}}', input);
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}

// Define metrics
const accuracyMetric: EvaluationMetric = {
  name: 'accuracy',
  evaluate: async (input, output, expected) => {
    if (!expected) return 0;
    return output.toLowerCase().trim() === expected.toLowerCase().trim() ? 1 : 0;
  },
};

const lengthMetric: EvaluationMetric = {
  name: 'length',
  evaluate: async (input, output) => {
    const words = output.split(/\s+/).length;
    return words >= 50 && words <= 200 ? 1 : 0;
  },
};

// Usage
const evaluator = new PromptEvaluator();
evaluator.addMetric(accuracyMetric);
evaluator.addMetric(lengthMetric);

const results = await evaluator.evaluate(
  'Classify sentiment: {{input}}',
  [
    { input: 'I love this!', expected: 'positive' },
    { input: 'Terrible product', expected: 'negative' },
  ]
);

console.log(results); // { accuracy: 0.95, length: 0.8 }
```

### A/B Testing Prompts

```typescript
interface PromptVariant {
  name: string;
  prompt: string;
}

async function abTestPrompts(
  variants: PromptVariant[],
  testInput: string
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const variant of variants) {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: variant.prompt.replace('{{input}}', testInput),
        },
      ],
    });

    const output = message.content[0].type === 'text'
      ? message.content[0].text
      : '';
    
    results.set(variant.name, output);
  }

  return results;
}

// Example
const variants: PromptVariant[] = [
  {
    name: 'direct',
    prompt: 'Summarize: {{input}}',
  },
  {
    name: 'detailed',
    prompt: 'Provide a comprehensive summary of the following, highlighting key points: {{input}}',
  },
  {
    name: 'bullet',
    prompt: 'Summarize in bullet points: {{input}}',
  },
];

const results = await abTestPrompts(variants, 'Long article text...');
// Compare outputs manually or with automated metrics
```

## Anti-Patterns

### ❌ Avoid: Vague Instructions

```typescript
// BAD
const badPrompt = 'Write about AI';

// GOOD
const goodPrompt = `Write a 500-word blog post about practical applications of AI in healthcare, focusing on:
- Medical imaging analysis
- Drug discovery
- Personalized treatment plans

Include specific examples and maintain a professional tone.`;
```

### ❌ Avoid: Assuming Knowledge

```typescript
// BAD
const badPrompt = 'Fix the bug';

// GOOD
const goodPrompt = `Review this TypeScript function and fix any bugs:

\`\`\`typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity);
}
\`\`\`

The bug: It doesn't handle null/undefined items or negative quantities.

Provide the corrected code with error handling.`;
```

### ❌ Avoid: Inconsistent Examples

```typescript
// BAD - Inconsistent format
const badPrompt = `Extract names:
John Smith works at Google
Email: jane@microsoft.com, Name: Jane Doe`;

// GOOD - Consistent format
const goodPrompt = `Extract names in this format: "FirstName LastName"

Example 1:
Text: "John Smith works at Google"
Name: John Smith

Example 2:
Text: "Contact Jane Doe at jane@microsoft.com"
Name: Jane Doe

Now extract:
Text: "{{text}}"
Name:`;
```

### ❌ Avoid: Overcomplicating

```typescript
// BAD - Too complex
const badPrompt = `You are an AI assistant that needs to analyze sentiment while also considering contextual nuances and cultural implications, taking into account the user's background and preferences, and then provide a detailed explanation...`;

// GOOD - Simple and clear
const goodPrompt = `Analyze the sentiment of this text:

"{{text}}"

Respond with one word: positive, negative, or neutral.`;
```

### ❌ Avoid: Leading Questions

```typescript
// BAD - Biased
const badPrompt = 'Why is Python the best programming language?';

// GOOD - Neutral
const goodPrompt = 'Compare Python and JavaScript for web development, covering pros and cons of each.';
```

## Production Patterns

### Prompt Versioning

```typescript
interface PromptVersion {
  version: string;
  prompt: string;
  createdAt: Date;
  performance?: Record<string, number>;
}

class PromptRegistry {
  private prompts: Map<string, PromptVersion[]> = new Map();

  addVersion(name: string, prompt: string) {
    const versions = this.prompts.get(name) || [];
    versions.push({
      version: `v${versions.length + 1}`,
      prompt,
      createdAt: new Date(),
    });
    this.prompts.set(name, versions);
  }

  getLatest(name: string): PromptVersion | undefined {
    const versions = this.prompts.get(name);
    return versions?.[versions.length - 1];
  }

  getVersion(name: string, version: string): PromptVersion | undefined {
    const versions = this.prompts.get(name);
    return versions?.find(v => v.version === version);
  }

  async executeLatest(name: string, variables: Record<string, string>) {
    const promptVersion = this.getLatest(name);
    if (!promptVersion) throw new Error(`Prompt ${name} not found`);

    let prompt = promptVersion.prompt;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(`{{${key}}}`, value);
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}

// Usage
const registry = new PromptRegistry();

registry.addVersion('summarize', 'Summarize: {{text}}');
registry.addVersion('summarize', 'Provide a concise summary: {{text}}');
registry.addVersion('summarize', 'Summarize in 3 sentences: {{text}}');

const result = await registry.executeLatest('summarize', {
  text: 'Long article...',
});
```

### Fallback Strategies

```typescript
async function robustPrompt(prompt: string, maxRetries: number = 3): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const response = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      // Validate response
      if (response.trim().length === 0) {
        throw new Error('Empty response');
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
}
```

### Caching Prompt Results

```typescript
import { createHash } from 'crypto';

class CachedPromptExecutor {
  private cache: Map<string, { result: string; timestamp: number }> = new Map();
  private ttl: number = 3600000; // 1 hour

  private hash(prompt: string): string {
    return createHash('sha256').update(prompt).digest('hex');
  }

  async execute(prompt: string): Promise<string> {
    const key = this.hash(prompt);
    const cached = this.cache.get(key);

    // Check cache
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.result;
    }

    // Execute prompt
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const result = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Cache result
    this.cache.set(key, { result, timestamp: Date.now() });

    return result;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

### Monitoring and Logging

```typescript
interface PromptLog {
  promptId: string;
  prompt: string;
  response: string;
  model: string;
  tokens: number;
  latency: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

class PromptMonitor {
  private logs: PromptLog[] = [];

  async track(
    promptId: string,
    prompt: string,
    executor: () => Promise<string>
  ): Promise<string> {
    const startTime = Date.now();
    let response = '';
    let success = false;
    let error: string | undefined;

    try {
      response = await executor();
      success = true;
    } catch (err) {
      error = (err as Error).message;
      throw err;
    } finally {
      this.logs.push({
        promptId,
        prompt,
        response,
        model: 'claude-sonnet-4-20250514',
        tokens: this.estimateTokens(prompt + response),
        latency: Date.now() - startTime,
        success,
        error,
        timestamp: new Date(),
      });
    }

    return response;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimate
  }

  getStats() {
    return {
      total: this.logs.length,
      successful: this.logs.filter(l => l.success).length,
      avgLatency: this.logs.reduce((sum, l) => sum + l.latency, 0) / this.logs.length,
      totalTokens: this.logs.reduce((sum, l) => sum + l.tokens, 0),
    };
  }

  exportLogs(): PromptLog[] {
    return this.logs;
  }
}
```

## Best Practices Summary

### DO:
✓ Be specific and explicit in instructions
✓ Provide examples for complex tasks (few-shot)
✓ Use chain-of-thought for reasoning tasks
✓ Set appropriate temperature for task type
✓ Include output format specifications
✓ Add constraints and boundaries
✓ Use system prompts for consistent behavior
✓ Test prompts with diverse inputs
✓ Version and track prompt changes
✓ Monitor performance and iterate

### DON'T:
✗ Don't use vague or ambiguous language
✗ Don't assume model knows your context
✗ Don't mix multiple tasks in one prompt
✗ Don't use inconsistent example formats
✗ Don't skip validation of JSON outputs
✗ Don't ignore error handling
✗ Don't hardcode prompts without templates
✗ Don't deploy without testing
✗ Don't forget to set max_tokens appropriately
✗ Don't use leading or biased questions

## Quick Reference

### Temperature Guidelines

| Task Type | Temperature | Examples |
|-----------|-------------|----------|
| Code generation | 0.0-0.2 | Function writing, bug fixing |
| Data extraction | 0.0-0.3 | JSON parsing, classification |
| Factual Q&A | 0.3-0.5 | Documentation, tutorials |
| General chat | 0.5-0.7 | Conversation, assistance |
| Creative writing | 0.7-0.9 | Stories, marketing copy |
| Brainstorming | 0.8-1.0 | Ideas, alternatives |

### Max Tokens by Task

| Task | Tokens | Use Case |
|------|--------|----------|
| Classification | 10-50 | Labels, categories |
| Short answer | 100-256 | Brief responses |
| Paragraph | 256-512 | Single paragraph |
| Article | 1024-2048 | Blog posts |
| Long-form | 2048-4096 | Reports, essays |

### Prompt Patterns Cheat Sheet

```typescript
// JSON Extraction
`Extract as JSON: { "field": "value" }
Text: {{text}}
JSON:`

// Chain-of-Thought
`Problem: {{problem}}
Let's think step by step:
1.`

// Few-Shot
`Example 1: Input → Output
Example 2: Input → Output
Now: {{input}} →`

// Classification
`Classify into: [category1, category2]
Text: {{text}}
Category:`

// Summarization
`Summarize in {{length}} words:
{{text}}
Summary:`
```

## Troubleshooting

**Inconsistent outputs:**
- Lower temperature (0.0-0.3)
- Add more specific constraints
- Use few-shot examples
- Validate with schema/regex

**Poor quality responses:**
- Add chain-of-thought prompting
- Provide better examples
- Increase context/background
- Adjust temperature

**Wrong format:**
- Explicitly request format
- Show example output
- Use structured output patterns
- Add validation

**Too short/long:**
- Set appropriate max_tokens
- Specify word/sentence count
- Use stop sequences
- Add length constraint in prompt

**Hallucinations:**
- Lower temperature
- Require citations
- Add "only use provided context"
- Use RAG with sources
