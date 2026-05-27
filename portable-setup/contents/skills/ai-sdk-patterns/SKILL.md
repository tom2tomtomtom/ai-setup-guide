---
name: ai-sdk-patterns
description: Add AI features to your Next.js or React app with streaming chat, tool calling, and structured outputs via the Vercel AI SDK. Use when building a chat interface, integrating any LLM provider, or adding AI-powered features to an existing app.
---

# AI SDK Patterns

Build AI-powered applications with Vercel's AI SDK for streaming responses, chat interfaces, and tool calling.

## When to Use This Skill

Use when:
- Building chat interfaces with streaming
- Integrating LLMs (OpenAI, Anthropic, Google, etc.)
- Implementing tool calling/function calling
- Creating AI-powered features in Next.js/React
- Generating structured outputs from LLMs

## Installation

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/react
```

## Provider Setup

### OpenAI

```typescript
// lib/ai.ts
import { openai } from '@ai-sdk/openai';

export const model = openai('gpt-4o');
```

### Anthropic

```typescript
import { anthropic } from '@ai-sdk/anthropic';

export const model = anthropic('claude-sonnet-4-20250514');
```

### Environment Variables

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Chat Interface with useChat

### Basic Chat Component

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div className="space-y-4 mb-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong>
            {m.parts.map((part, i) => {
              if (part.type === 'text') {
                return <p key={i}>{part.text}</p>;
              }
              return null;
            })}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
}
```

### API Route Handler

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, type Message } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}

export type ChatMessage = Message;
```

## Tool Calling

### Define Tools

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
      getWeather: tool({
        description: 'Get current weather for a location',
        parameters: z.object({
          location: z.string().describe('City name'),
          unit: z.enum(['celsius', 'fahrenheit']).optional(),
        }),
        execute: async ({ location, unit = 'celsius' }) => {
          // Call weather API
          const weather = await fetchWeather(location);
          return {
            location,
            temperature: weather.temp,
            unit,
            conditions: weather.conditions,
          };
        },
      }),

      searchProducts: tool({
        description: 'Search for products in the catalog',
        parameters: z.object({
          query: z.string(),
          category: z.string().optional(),
          maxPrice: z.number().optional(),
        }),
        execute: async ({ query, category, maxPrice }) => {
          const products = await searchProducts(query, { category, maxPrice });
          return products;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

### Display Tool Results in UI

```tsx
'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong>
          {m.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <p key={i}>{part.text}</p>;
              case 'tool-getWeather':
                if (part.state === 'output-available') {
                  return (
                    <div key={i} className="p-4 bg-blue-100 rounded">
                      <p>Weather in {part.output.location}</p>
                      <p className="text-2xl">{part.output.temperature}°</p>
                      <p>{part.output.conditions}</p>
                    </div>
                  );
                }
                return <p key={i}>Loading weather...</p>;
              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
}
```

### Client-Side Tool Execution

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';

export default function Chat() {
  const { messages, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        // Execute client-side tool
        const location = await navigator.geolocation.getCurrentPosition();
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: { lat: location.coords.latitude, lng: location.coords.longitude },
        });
      }
    },
  });

  // ... render messages
}
```

## Structured Output (generateObject)

### Generate Typed Objects

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const recipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.object({
    item: z.string(),
    amount: z.string(),
  })),
  steps: z.array(z.string()),
  cookTime: z.number().describe('Cook time in minutes'),
});

export async function generateRecipe(dish: string) {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: recipeSchema,
    prompt: `Generate a recipe for ${dish}`,
  });

  return object; // Fully typed!
}
```

### Stream Structured Objects

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamObject({
    model: openai('gpt-4o'),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
    prompt,
  });

  return result.toTextStreamResponse();
}
```

## Text Generation

### Simple Generation

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Explain quantum computing in simple terms',
});
```

### Streaming Text

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const result = streamText({
  model: openai('gpt-4o'),
  prompt: 'Write a poem about coding',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## Embeddings

```typescript
import { openai } from '@ai-sdk/openai';
import { embedMany, embed } from 'ai';

// Single embedding
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'Hello world',
});

// Batch embeddings
const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['First text', 'Second text', 'Third text'],
});
```

## Multi-Provider Support

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

type Provider = 'openai' | 'anthropic' | 'google';

export function getModel(provider: Provider) {
  switch (provider) {
    case 'openai':
      return openai('gpt-4o');
    case 'anthropic':
      return anthropic('claude-sonnet-4-20250514');
    case 'google':
      return google('gemini-2.0-flash');
  }
}

// Usage
const result = streamText({
  model: getModel('anthropic'),
  prompt: 'Hello!',
});
```

## RAG Pattern

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';

export async function POST(req: Request) {
  const { query } = await req.json();

  // 1. Generate embedding for query
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  });

  // 2. Search vector database
  const relevantDocs = await vectorDb.search(embedding, { topK: 5 });

  // 3. Build context
  const context = relevantDocs.map(doc => doc.content).join('\n\n');

  // 4. Generate response with context
  const result = streamText({
    model: openai('gpt-4o'),
    system: `Answer based on this context:\n${context}`,
    messages: [{ role: 'user', content: query }],
  });

  return result.toDataStreamResponse();
}
```

## useCompletion Hook

For single-turn completions (not chat):

```tsx
'use client';

import { useCompletion } from '@ai-sdk/react';

export default function Editor() {
  const { completion, input, setInput, complete, isLoading } = useCompletion({
    api: '/api/complete',
  });

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Start writing..."
      />
      <button onClick={() => complete(input)} disabled={isLoading}>
        Complete
      </button>
      <div>{completion}</div>
    </div>
  );
}
```

## Error Handling

```typescript
import { streamText, APICallError } from 'ai';

try {
  const result = await streamText({
    model: openai('gpt-4o'),
    prompt: 'Hello',
  });
} catch (error) {
  if (error instanceof APICallError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.statusCode);
    // Handle rate limiting, auth errors, etc.
  }
  throw error;
}
```

## Best Practices

1. **Stream responses** - Better UX than waiting for full response
2. **Use structured output** - For predictable, typed responses
3. **Implement tool calling** - For dynamic, interactive AI features
4. **Add error handling** - Handle rate limits and API errors gracefully
5. **Cache embeddings** - Avoid regenerating for same content
6. **Use system prompts** - Guide model behavior consistently

## Resources

- [AI SDK Documentation](https://ai-sdk.dev)
- [AI SDK GitHub](https://github.com/vercel/ai)
- [Provider Documentation](https://ai-sdk.dev/providers)
