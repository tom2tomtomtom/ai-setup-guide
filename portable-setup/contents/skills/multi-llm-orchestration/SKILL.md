---
name: multi-llm-orchestration
description: Multi-LLM orchestration with routing between GPT-4, Claude, and Gemini including cost optimization and fallback strategies. Use when routing requests across LLM providers, implementing provider failover, or optimizing AI costs.
---

# Multi-LLM Orchestration

Comprehensive guide for orchestrating multiple LLM providers (OpenAI, Anthropic, Google, etc.), implementing intelligent routing, fallback strategies, cost optimization, and streaming patterns for production AI applications.

## When to Use This Skill

Use when:
- Building AI applications with multiple LLM providers
- Implementing fallback strategies for reliability
- Optimizing costs across different models
- Routing requests based on task complexity
- Implementing A/B testing for different models
- Building LLM gateways or proxies
- Managing rate limits across providers
- Streaming responses from multiple providers
- Implementing model-specific prompt engineering
- Monitoring LLM usage and performance

## Provider Setup

### OpenAI (GPT-4, GPT-3.5)

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function chatWithOpenAI(messages: any[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    temperature: 0.7,
    max_tokens: 1000
  })
  
  return response.choices[0].message.content
}
```

### Anthropic (Claude)

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

async function chatWithClaude(messages: any[]) {
  // Convert OpenAI format to Anthropic format
  const systemMessage = messages.find(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')
  
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    system: systemMessage?.content,
    messages: conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))
  })
  
  return response.content[0].type === 'text' 
    ? response.content[0].text 
    : ''
}
```

### Google (Gemini)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

async function chatWithGemini(messages: any[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  // Convert to Gemini format
  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  })
  
  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.content)
  
  return result.response.text()
}
```

### Unified Interface

```typescript
// lib/llm/types.ts
export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'openrouter'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMConfig {
  model: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface LLMResponse {
  content: string
  provider: LLMProvider
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  latency: number
  cost: number
}
```

```typescript
// lib/llm/client.ts
export class LLMClient {
  private openai: OpenAI
  private anthropic: Anthropic
  private genAI: GoogleGenerativeAI

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  }

  async chat(
    provider: LLMProvider,
    messages: LLMMessage[],
    config: LLMConfig
  ): Promise<LLMResponse> {
    const startTime = Date.now()

    try {
      switch (provider) {
        case 'openai':
          return await this.chatOpenAI(messages, config, startTime)
        case 'anthropic':
          return await this.chatAnthropic(messages, config, startTime)
        case 'google':
          return await this.chatGoogle(messages, config, startTime)
        default:
          throw new Error(`Unknown provider: ${provider}`)
      }
    } catch (error) {
      throw new Error(`LLM request failed: ${error.message}`)
    }
  }

  private async chatOpenAI(
    messages: LLMMessage[],
    config: LLMConfig,
    startTime: number
  ): Promise<LLMResponse> {
    const response = await this.openai.chat.completions.create({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      top_p: config.topP,
      frequency_penalty: config.frequencyPenalty,
      presence_penalty: config.presencePenalty
    })

    const latency = Date.now() - startTime
    const usage = response.usage!
    
    return {
      content: response.choices[0].message.content!,
      provider: 'openai',
      model: config.model,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens
      },
      latency,
      cost: this.calculateCost('openai', config.model, usage)
    }
  }

  private async chatAnthropic(
    messages: LLMMessage[],
    config: LLMConfig,
    startTime: number
  ): Promise<LLMResponse> {
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const response = await this.anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens || 1000,
      temperature: config.temperature,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    })

    const latency = Date.now() - startTime
    const usage = response.usage
    
    return {
      content: response.content[0].type === 'text' 
        ? response.content[0].text 
        : '',
      provider: 'anthropic',
      model: config.model,
      usage: {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens
      },
      latency,
      cost: this.calculateCost('anthropic', config.model, usage)
    }
  }

  private async chatGoogle(
    messages: LLMMessage[],
    config: LLMConfig,
    startTime: number
  ): Promise<LLMResponse> {
    const model = this.genAI.getGenerativeModel({ 
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        topP: config.topP
      }
    })

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    })

    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    const response = result.response

    const latency = Date.now() - startTime
    
    return {
      content: response.text(),
      provider: 'google',
      model: config.model,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0
      },
      latency,
      cost: this.calculateCost('google', config.model, response.usageMetadata)
    }
  }

  private calculateCost(
    provider: LLMProvider,
    model: string,
    usage: any
  ): number {
    // Pricing per 1M tokens (as of 2024)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo-preview': { input: 10, output: 30 },
      'gpt-4': { input: 30, output: 60 },
      'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
      'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
      'claude-3-opus-20240229': { input: 15, output: 75 },
      'claude-3-sonnet-20240229': { input: 3, output: 15 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
      'gemini-pro': { input: 0.5, output: 1.5 }
    }

    const modelPricing = pricing[model] || { input: 0, output: 0 }
    
    const inputCost = (usage.prompt_tokens || usage.input_tokens || usage.promptTokenCount || 0) 
      * modelPricing.input / 1_000_000
    const outputCost = (usage.completion_tokens || usage.output_tokens || usage.candidatesTokenCount || 0) 
      * modelPricing.output / 1_000_000

    return inputCost + outputCost
  }
}
```

## Intelligent Routing

### Task-Based Routing

```typescript
// lib/llm/router.ts
export type TaskComplexity = 'simple' | 'medium' | 'complex' | 'reasoning'

export interface RoutingStrategy {
  selectProvider(
    task: TaskComplexity,
    constraints?: {
      maxCost?: number
      maxLatency?: number
      preferredProviders?: LLMProvider[]
    }
  ): { provider: LLMProvider; model: string }
}

export class CostOptimizedRouter implements RoutingStrategy {
  selectProvider(
    task: TaskComplexity,
    constraints?: any
  ): { provider: LLMProvider; model: string } {
    // Simple tasks -> cheapest models
    if (task === 'simple') {
      return { provider: 'openai', model: 'gpt-3.5-turbo' }
    }

    // Medium tasks -> balanced models
    if (task === 'medium') {
      return { provider: 'anthropic', model: 'claude-3-haiku-20240307' }
    }

    // Complex tasks -> powerful models
    if (task === 'complex') {
      return { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
    }

    // Reasoning tasks -> most capable models
    if (task === 'reasoning') {
      return { provider: 'openai', model: 'gpt-4-turbo-preview' }
    }

    return { provider: 'openai', model: 'gpt-3.5-turbo' }
  }
}

export class PerformanceOptimizedRouter implements RoutingStrategy {
  selectProvider(
    task: TaskComplexity,
    constraints?: any
  ): { provider: LLMProvider; model: string } {
    // Prioritize speed over cost
    if (task === 'simple') {
      return { provider: 'google', model: 'gemini-pro' }
    }

    if (task === 'medium') {
      return { provider: 'anthropic', model: 'claude-3-haiku-20240307' }
    }

    if (task === 'complex' || task === 'reasoning') {
      return { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
    }

    return { provider: 'google', model: 'gemini-pro' }
  }
}

export class LoadBalancingRouter implements RoutingStrategy {
  private requestCounts: Map<LLMProvider, number> = new Map()

  selectProvider(
    task: TaskComplexity,
    constraints?: any
  ): { provider: LLMProvider; model: string } {
    // Get eligible providers for task
    const eligibleProviders = this.getEligibleProviders(task)
    
    // Select provider with lowest current load
    const provider = eligibleProviders.reduce((min, curr) => {
      const minCount = this.requestCounts.get(min) || 0
      const currCount = this.requestCounts.get(curr) || 0
      return currCount < minCount ? curr : min
    })

    // Increment count
    this.requestCounts.set(provider, (this.requestCounts.get(provider) || 0) + 1)

    // Select appropriate model
    const model = this.selectModelForProvider(provider, task)
    
    return { provider, model }
  }

  private getEligibleProviders(task: TaskComplexity): LLMProvider[] {
    if (task === 'simple') {
      return ['openai', 'google', 'anthropic']
    }
    if (task === 'medium') {
      return ['openai', 'anthropic']
    }
    // Complex tasks
    return ['openai', 'anthropic']
  }

  private selectModelForProvider(
    provider: LLMProvider,
    task: TaskComplexity
  ): string {
    const modelMap: Record<LLMProvider, Record<TaskComplexity, string>> = {
      openai: {
        simple: 'gpt-3.5-turbo',
        medium: 'gpt-4-turbo-preview',
        complex: 'gpt-4-turbo-preview',
        reasoning: 'gpt-4-turbo-preview'
      },
      anthropic: {
        simple: 'claude-3-haiku-20240307',
        medium: 'claude-3-sonnet-20240229',
        complex: 'claude-3-5-sonnet-20241022',
        reasoning: 'claude-3-opus-20240229'
      },
      google: {
        simple: 'gemini-pro',
        medium: 'gemini-pro',
        complex: 'gemini-pro',
        reasoning: 'gemini-pro'
      },
      openrouter: {
        simple: 'gpt-3.5-turbo',
        medium: 'gpt-4-turbo-preview',
        complex: 'gpt-4-turbo-preview',
        reasoning: 'gpt-4-turbo-preview'
      }
    }

    return modelMap[provider][task]
  }
}
```

### Orchestrator

```typescript
// lib/llm/orchestrator.ts
export class LLMOrchestrator {
  private client: LLMClient
  private router: RoutingStrategy

  constructor(router: RoutingStrategy = new CostOptimizedRouter()) {
    this.client = new LLMClient()
    this.router = router
  }

  async chat(
    messages: LLMMessage[],
    options: {
      task?: TaskComplexity
      config?: Partial<LLMConfig>
      constraints?: any
    } = {}
  ): Promise<LLMResponse> {
    // Determine task complexity if not provided
    const task = options.task || this.inferComplexity(messages)
    
    // Route to appropriate provider
    const { provider, model } = this.router.selectProvider(
      task,
      options.constraints
    )

    // Merge config
    const config: LLMConfig = {
      model,
      temperature: 0.7,
      maxTokens: 1000,
      ...options.config
    }

    // Execute request
    return await this.client.chat(provider, messages, config)
  }

  private inferComplexity(messages: LLMMessage[]): TaskComplexity {
    const lastMessage = messages[messages.length - 1].content
    const wordCount = lastMessage.split(/\s+/).length

    // Simple heuristics
    if (wordCount < 20) return 'simple'
    if (wordCount < 100) return 'medium'
    if (lastMessage.includes('analyze') || lastMessage.includes('explain')) {
      return 'complex'
    }
    if (lastMessage.includes('reason') || lastMessage.includes('solve')) {
      return 'reasoning'
    }

    return 'medium'
  }
}
```

## Fallback Strategies

### Sequential Fallback

```typescript
// lib/llm/fallback.ts
export class FallbackOrchestrator extends LLMOrchestrator {
  async chatWithFallback(
    messages: LLMMessage[],
    options: {
      primaryProvider?: LLMProvider
      fallbackChain?: LLMProvider[]
      maxRetries?: number
    } = {}
  ): Promise<LLMResponse> {
    const chain = options.fallbackChain || ['openai', 'anthropic', 'google']
    const maxRetries = options.maxRetries || 3

    for (let i = 0; i < chain.length; i++) {
      const provider = chain[i]
      
      try {
        const { model } = this.router.selectProvider('medium')
        const response = await this.client.chat(
          provider,
          messages,
          { model }
        )
        
        return response
      } catch (error) {
        console.error(`Provider ${provider} failed:`, error.message)
        
        // If last provider, throw error
        if (i === chain.length - 1) {
          throw new Error('All providers failed')
        }
        
        // Otherwise, try next provider
        console.log(`Falling back to ${chain[i + 1]}...`)
        continue
      }
    }

    throw new Error('All providers failed')
  }
}
```

### Parallel Racing

```typescript
export class RacingOrchestrator extends LLMOrchestrator {
  async chatWithRacing(
    messages: LLMMessage[],
    providers: LLMProvider[] = ['openai', 'anthropic']
  ): Promise<LLMResponse> {
    // Race multiple providers, return first successful response
    const promises = providers.map(provider => {
      const { model } = this.router.selectProvider('medium')
      return this.client.chat(provider, messages, { model })
    })

    try {
      return await Promise.race(promises)
    } catch (error) {
      throw new Error('All providers failed in race')
    }
  }

  async chatWithRedundancy(
    messages: LLMMessage[],
    providers: LLMProvider[] = ['openai', 'anthropic']
  ): Promise<LLMResponse[]> {
    // Call all providers, return all responses
    const promises = providers.map(async provider => {
      try {
        const { model } = this.router.selectProvider('medium')
        return await this.client.chat(provider, messages, { model })
      } catch (error) {
        return null
      }
    })

    const results = await Promise.all(promises)
    return results.filter(r => r !== null) as LLMResponse[]
  }
}
```

### Circuit Breaker

```typescript
export class CircuitBreaker {
  private failures: Map<LLMProvider, number> = new Map()
  private lastFailureTime: Map<LLMProvider, number> = new Map()
  private readonly threshold = 5
  private readonly timeout = 60000 // 1 minute

  isOpen(provider: LLMProvider): boolean {
    const failures = this.failures.get(provider) || 0
    const lastFailure = this.lastFailureTime.get(provider) || 0
    
    // Reset if timeout passed
    if (Date.now() - lastFailure > this.timeout) {
      this.failures.set(provider, 0)
      return false
    }

    return failures >= this.threshold
  }

  recordSuccess(provider: LLMProvider): void {
    this.failures.set(provider, 0)
  }

  recordFailure(provider: LLMProvider): void {
    const current = this.failures.get(provider) || 0
    this.failures.set(provider, current + 1)
    this.lastFailureTime.set(provider, Date.now())
  }
}

export class ResilientOrchestrator extends LLMOrchestrator {
  private circuitBreaker = new CircuitBreaker()

  async chatResilent(
    messages: LLMMessage[],
    options: any = {}
  ): Promise<LLMResponse> {
    const { provider, model } = this.router.selectProvider(
      options.task || 'medium'
    )

    // Check circuit breaker
    if (this.circuitBreaker.isOpen(provider)) {
      console.log(`Circuit breaker open for ${provider}, using fallback`)
      // Use fallback provider
      const fallback = provider === 'openai' ? 'anthropic' : 'openai'
      const fallbackModel = this.router.selectProvider('medium').model
      
      try {
        const response = await this.client.chat(fallback, messages, {
          model: fallbackModel
        })
        return response
      } catch (error) {
        throw new Error('Fallback provider also failed')
      }
    }

    try {
      const response = await this.client.chat(provider, messages, { model })
      this.circuitBreaker.recordSuccess(provider)
      return response
    } catch (error) {
      this.circuitBreaker.recordFailure(provider)
      throw error
    }
  }
}
```

## Streaming

### Unified Streaming Interface

```typescript
// lib/llm/streaming.ts
export async function* streamChat(
  provider: LLMProvider,
  messages: LLMMessage[],
  config: LLMConfig
): AsyncGenerator<string> {
  switch (provider) {
    case 'openai':
      yield* streamOpenAI(messages, config)
      break
    case 'anthropic':
      yield* streamAnthropic(messages, config)
      break
    case 'google':
      yield* streamGoogle(messages, config)
      break
    default:
      throw new Error(`Streaming not supported for ${provider}`)
  }
}

async function* streamOpenAI(
  messages: LLMMessage[],
  config: LLMConfig
): AsyncGenerator<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  
  const stream = await openai.chat.completions.create({
    model: config.model,
    messages,
    stream: true,
    temperature: config.temperature,
    max_tokens: config.maxTokens
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      yield content
    }
  }
}

async function* streamAnthropic(
  messages: LLMMessage[],
  config: LLMConfig
): AsyncGenerator<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  
  const systemMessage = messages.find(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')

  const stream = anthropic.messages.stream({
    model: config.model,
    max_tokens: config.maxTokens || 1000,
    system: systemMessage?.content,
    messages: conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && 
        event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}

async function* streamGoogle(
  messages: LLMMessage[],
  config: LLMConfig
): AsyncGenerator<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const model = genAI.getGenerativeModel({ 
    model: config.model,
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxTokens
    }
  })

  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessageStream(lastMessage.content)

  for await (const chunk of result.stream) {
    yield chunk.text()
  }
}
```

### Streaming API Endpoint

```typescript
// app/api/chat/stream/route.ts
import { streamChat } from '@/lib/llm/streaming'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { messages, provider, model } = await request.json()

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      try {
        for await (const chunk of streamChat(
          provider,
          messages,
          { model }
        )) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
```

### Client-Side Streaming

```typescript
'use client'

import { useState } from 'react'

export default function ChatWithStreaming() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)

  const sendMessage = async () => {
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          provider: 'openai',
          model: 'gpt-4-turbo-preview'
        })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              assistantMessage += parsed.content
              
              // Update UI with streaming content
              setMessages(prev => {
                const updated = [...prev]
                if (updated[updated.length - 1]?.role === 'assistant') {
                  updated[updated.length - 1].content = assistantMessage
                } else {
                  updated.push({ role: 'assistant', content: assistantMessage })
                }
                return updated
              })
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !streaming && sendMessage()}
        disabled={streaming}
      />
      
      <button onClick={sendMessage} disabled={streaming}>
        {streaming ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
```

## Cost Optimization

### Token Counting

```typescript
// lib/llm/tokens.ts
import { encoding_for_model } from 'tiktoken'

export function countTokens(text: string, model: string): number {
  try {
    const encoding = encoding_for_model(model as any)
    const tokens = encoding.encode(text)
    encoding.free()
    return tokens.length
  } catch {
    // Fallback estimation
    return Math.ceil(text.length / 4)
  }
}

export function estimateCost(
  messages: LLMMessage[],
  model: string,
  estimatedCompletionTokens: number = 500
): number {
  const promptTokens = messages.reduce(
    (sum, msg) => sum + countTokens(msg.content, model),
    0
  )

  // Pricing per 1M tokens
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo-preview': { input: 10, output: 30 },
    'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
  }

  const modelPricing = pricing[model] || { input: 1, output: 2 }
  
  const inputCost = promptTokens * modelPricing.input / 1_000_000
  const outputCost = estimatedCompletionTokens * modelPricing.output / 1_000_000

  return inputCost + outputCost
}
```

### Cost-Aware Routing

```typescript
export class CostAwareRouter implements RoutingStrategy {
  selectProvider(
    task: TaskComplexity,
    constraints?: { maxCost?: number }
  ): { provider: LLMProvider; model: string } {
    const maxCost = constraints?.maxCost || Infinity

    // Cost tiers (per 1M tokens, average)
    const models = [
      { provider: 'openai', model: 'gpt-3.5-turbo', avgCost: 1, quality: 7 },
      { provider: 'anthropic', model: 'claude-3-haiku-20240307', avgCost: 0.75, quality: 8 },
      { provider: 'google', model: 'gemini-pro', avgCost: 1, quality: 7 },
      { provider: 'anthropic', model: 'claude-3-sonnet-20240229', avgCost: 9, quality: 9 },
      { provider: 'openai', model: 'gpt-4-turbo-preview', avgCost: 20, quality: 10 },
      { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', avgCost: 9, quality: 10 }
    ]

    // Filter by cost constraint
    const affordable = models.filter(m => m.avgCost <= maxCost)
    
    if (affordable.length === 0) {
      throw new Error('No models within cost constraint')
    }

    // Select highest quality within budget
    const selected = affordable.reduce((best, curr) =>
      curr.quality > best.quality ? curr : best
    )

    return {
      provider: selected.provider as LLMProvider,
      model: selected.model
    }
  }
}
```

### Caching

```typescript
// lib/llm/cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export async function cachedChat(
  orchestrator: LLMOrchestrator,
  messages: LLMMessage[],
  options: any = {}
): Promise<LLMResponse> {
  // Create cache key
  const cacheKey = `llm:${JSON.stringify({ messages, options })}`
  
  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return cached as LLMResponse
  }

  // Execute request
  const response = await orchestrator.chat(messages, options)

  // Cache response (1 hour)
  await redis.setex(cacheKey, 3600, response)

  return response
}
```

## Monitoring & Analytics

### Usage Tracking

```typescript
// lib/llm/analytics.ts
export interface UsageMetrics {
  provider: LLMProvider
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  latency: number
  success: boolean
  timestamp: Date
}

export class UsageTracker {
  private metrics: UsageMetrics[] = []

  track(metric: UsageMetrics): void {
    this.metrics.push(metric)
    
    // Store in database
    this.persistMetric(metric)
  }

  async persistMetric(metric: UsageMetrics): Promise<void> {
    await db.llmUsage.create({
      data: {
        provider: metric.provider,
        model: metric.model,
        prompt_tokens: metric.promptTokens,
        completion_tokens: metric.completionTokens,
        total_tokens: metric.totalTokens,
        cost: metric.cost,
        latency: metric.latency,
        success: metric.success,
        timestamp: metric.timestamp
      }
    })
  }

  getMetrics(
    startDate: Date,
    endDate: Date
  ): {
    totalCost: number
    totalTokens: number
    avgLatency: number
    successRate: number
    byProvider: Record<LLMProvider, any>
  } {
    const filtered = this.metrics.filter(
      m => m.timestamp >= startDate && m.timestamp <= endDate
    )

    const totalCost = filtered.reduce((sum, m) => sum + m.cost, 0)
    const totalTokens = filtered.reduce((sum, m) => sum + m.totalTokens, 0)
    const avgLatency = filtered.reduce((sum, m) => sum + m.latency, 0) / filtered.length
    const successRate = filtered.filter(m => m.success).length / filtered.length

    const byProvider = filtered.reduce((acc, m) => {
      if (!acc[m.provider]) {
        acc[m.provider] = {
          count: 0,
          cost: 0,
          tokens: 0,
          avgLatency: 0
        }
      }
      acc[m.provider].count++
      acc[m.provider].cost += m.cost
      acc[m.provider].tokens += m.totalTokens
      acc[m.provider].avgLatency += m.latency
      return acc
    }, {} as Record<LLMProvider, any>)

    // Calculate averages
    Object.keys(byProvider).forEach(provider => {
      byProvider[provider as LLMProvider].avgLatency /= byProvider[provider as LLMProvider].count
    })

    return {
      totalCost,
      totalTokens,
      avgLatency,
      successRate,
      byProvider
    }
  }
}
```

### Instrumented Orchestrator

```typescript
export class InstrumentedOrchestrator extends LLMOrchestrator {
  private tracker: UsageTracker

  constructor(router: RoutingStrategy, tracker: UsageTracker) {
    super(router)
    this.tracker = tracker
  }

  async chat(
    messages: LLMMessage[],
    options: any = {}
  ): Promise<LLMResponse> {
    const startTime = Date.now()
    let success = false
    let response: LLMResponse | null = null

    try {
      response = await super.chat(messages, options)
      success = true
      return response
    } catch (error) {
      throw error
    } finally {
      if (response) {
        this.tracker.track({
          provider: response.provider,
          model: response.model,
          promptTokens: response.usage.promptTokens,
          completionTokens: response.usage.completionTokens,
          totalTokens: response.usage.totalTokens,
          cost: response.cost,
          latency: Date.now() - startTime,
          success,
          timestamp: new Date()
        })
      }
    }
  }
}
```

## Production Patterns

### Rate Limiting

```typescript
export class RateLimitedOrchestrator extends LLMOrchestrator {
  private requestCounts: Map<LLMProvider, number[]> = new Map()
  private readonly limits: Record<LLMProvider, number> = {
    openai: 500, // requests per minute
    anthropic: 50,
    google: 60,
    openrouter: 200
  }

  async chat(
    messages: LLMMessage[],
    options: any = {}
  ): Promise<LLMResponse> {
    const { provider } = this.router.selectProvider(options.task || 'medium')
    
    // Check rate limit
    if (this.isRateLimited(provider)) {
      // Use fallback provider
      const fallback = this.getFallbackProvider(provider)
      const { model } = this.router.selectProvider('medium')
      return await this.client.chat(fallback, messages, { model })
    }

    // Track request
    this.trackRequest(provider)

    return await super.chat(messages, options)
  }

  private isRateLimited(provider: LLMProvider): boolean {
    const now = Date.now()
    const requests = this.requestCounts.get(provider) || []
    
    // Remove requests older than 1 minute
    const recent = requests.filter(time => now - time < 60000)
    this.requestCounts.set(provider, recent)

    return recent.length >= this.limits[provider]
  }

  private trackRequest(provider: LLMProvider): void {
    const requests = this.requestCounts.get(provider) || []
    requests.push(Date.now())
    this.requestCounts.set(provider, requests)
  }

  private getFallbackProvider(primary: LLMProvider): LLMProvider {
    const fallbacks: Record<LLMProvider, LLMProvider> = {
      openai: 'anthropic',
      anthropic: 'google',
      google: 'openai',
      openrouter: 'openai'
    }
    return fallbacks[primary]
  }
}
```

### Retry Logic

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i < maxRetries - 1) {
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}
```

## Best Practices

### Do's ✅

- **Implement fallback strategies** for reliability
- **Monitor costs** across all providers
- **Cache responses** when appropriate
- **Use task-based routing** for cost optimization
- **Implement rate limiting** to avoid quota issues
- **Track usage metrics** for analytics
- **Use circuit breakers** to prevent cascading failures
- **Stream responses** for better UX
- **Validate inputs** before sending to LLMs
- **Handle errors gracefully** with meaningful messages

### Don'ts ❌

- **Don't hardcode provider selection**
- **Don't ignore rate limits**
- **Don't skip error handling**
- **Don't expose API keys** to clients
- **Don't forget to count tokens**
- **Don't use the same prompt** for all models
- **Don't ignore latency** in routing decisions
- **Don't skip validation** of LLM responses
- **Don't forget about model-specific** quirks
- **Don't over-rely** on a single provider

## Quick Reference

### Provider Comparison
| Provider | Best For | Cost | Speed | Quality |
|----------|----------|------|-------|---------|
| GPT-4 | Reasoning, complex tasks | High | Medium | Excellent |
| GPT-3.5 | Simple tasks, speed | Low | Fast | Good |
| Claude 3.5 Sonnet | Balanced performance | Medium | Fast | Excellent |
| Claude 3 Haiku | High throughput | Very Low | Very Fast | Good |
| Gemini Pro | Google ecosystem | Low | Fast | Good |

### Task Complexity Routing
```typescript
simple -> gpt-3.5-turbo / claude-haiku
medium -> claude-sonnet / gpt-4-turbo
complex -> claude-3.5-sonnet / gpt-4
reasoning -> gpt-4 / claude-opus
```

### Cost Estimates (per 1M tokens)
```
GPT-4: $10-60
GPT-3.5: $0.5-1.5
Claude Sonnet: $3-15
Claude Haiku: $0.25-1.25
Gemini Pro: $0.5-1.5
```