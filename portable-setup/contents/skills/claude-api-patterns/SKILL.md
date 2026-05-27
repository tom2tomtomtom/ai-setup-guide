---
name: claude-api-patterns
description: Anthropic Claude API patterns for building AI applications with streaming, tool use, and vision; use when integrating Claude into applications
---

# Claude API Patterns

Comprehensive patterns for integrating the Anthropic Claude API including messages, streaming, tool use, and vision capabilities.

## When to Use This Skill

Use this skill when:
- Building AI-powered applications with Claude
- Implementing chat interfaces
- Adding AI features to existing apps
- Using Claude for content generation
- Implementing tool use / function calling
- Processing images with Claude

## Installation

```bash
npm install @anthropic-ai/sdk
```

## Basic Setup

```typescript
// lib/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

## Basic Message

```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hello, Claude!' }
  ],
});

console.log(message.content[0].text);
```

## Conversation with System Prompt

```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: 'You are a helpful assistant that responds concisely.',
  messages: [
    { role: 'user', content: 'What is TypeScript?' },
    { role: 'assistant', content: 'TypeScript is a typed superset of JavaScript.' },
    { role: 'user', content: 'Why should I use it?' }
  ],
});
```

## Streaming Responses

```typescript
const stream = await anthropic.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Tell me a story' }],
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text);
  }
}

const finalMessage = await stream.finalMessage();
```

### Next.js Streaming Route

```typescript
// app/api/chat/route.ts
import { anthropic } from '@/lib/anthropic';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages,
  });

  return new Response(stream.toReadableStream());
}
```

### Client-Side Streaming

```typescript
async function chat(messages: Message[]) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    // Parse SSE events
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'content_block_delta') {
          console.log(data.delta.text);
        }
      }
    }
  }
}
```

## Tool Use (Function Calling)

```typescript
const tools = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a location',
    input_schema: {
      type: 'object' as const,
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature unit',
        },
      },
      required: ['location'],
    },
  },
];

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  tools,
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ],
});

// Check if Claude wants to use a tool
if (message.stop_reason === 'tool_use') {
  const toolUse = message.content.find(block => block.type === 'tool_use');

  if (toolUse) {
    // Execute the tool
    const result = await getWeather(toolUse.input);

    // Continue conversation with tool result
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      tools,
      messages: [
        { role: 'user', content: "What's the weather in San Francisco?" },
        { role: 'assistant', content: message.content },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            },
          ],
        },
      ],
    });

    console.log(response.content[0].text);
  }
}
```

## Vision (Image Processing)

```typescript
// From URL
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'url',
            url: 'https://example.com/image.jpg',
          },
        },
        {
          type: 'text',
          text: 'What is in this image?',
        },
      ],
    },
  ],
});

// From base64
const imageData = fs.readFileSync('image.jpg').toString('base64');

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageData,
          },
        },
        {
          type: 'text',
          text: 'Describe this image in detail.',
        },
      ],
    },
  ],
});
```

## Extended Thinking

```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 16000,
  thinking: {
    type: 'enabled',
    budget_tokens: 10000,
  },
  messages: [
    { role: 'user', content: 'Solve this complex math problem...' }
  ],
});

// Access thinking and response
for (const block of message.content) {
  if (block.type === 'thinking') {
    console.log('Thinking:', block.thinking);
  }
  if (block.type === 'text') {
    console.log('Response:', block.text);
  }
}
```

## Chat Application Pattern

```typescript
// types.ts
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// chat.ts
class ChatSession {
  private messages: Message[] = [];
  private systemPrompt: string;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  async sendMessage(userMessage: string): Promise<string> {
    this.messages.push({ role: 'user', content: userMessage });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: this.systemPrompt,
      messages: this.messages,
    });

    const assistantMessage = response.content[0].text;
    this.messages.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
  }

  getHistory(): Message[] {
    return [...this.messages];
  }

  clearHistory(): void {
    this.messages = [];
  }
}
```

## Error Handling

```typescript
import Anthropic from '@anthropic-ai/sdk';

try {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hello' }],
  });
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.error('API Error:', error.status, error.message);

    if (error.status === 429) {
      // Rate limited - implement retry with backoff
    }
    if (error.status === 400) {
      // Bad request - check your inputs
    }
    if (error.status === 401) {
      // Authentication error - check API key
    }
  }
}
```

## Rate Limiting & Retries

```typescript
async function createMessageWithRetry(
  params: Anthropic.MessageCreateParams,
  maxRetries = 3
): Promise<Anthropic.Message> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (error) {
      if (error instanceof Anthropic.APIError && error.status === 429) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Best Practices

1. **Use streaming** - Better UX for long responses
2. **Set max_tokens** - Prevent runaway token usage
3. **Handle errors** - Implement proper error handling
4. **Rate limiting** - Implement backoff strategies
5. **System prompts** - Be specific about behavior

## Models

| Model | Best For |
|-------|----------|
| claude-opus-4-20250514 | Complex reasoning, coding |
| claude-sonnet-4-20250514 | Balanced performance |
| claude-haiku-3-5-20241022 | Fast, simple tasks |

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
