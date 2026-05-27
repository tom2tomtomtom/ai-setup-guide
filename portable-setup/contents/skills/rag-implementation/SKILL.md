---
name: rag-implementation
description: Answer questions about your own documents by connecting AI to your data with vector search and embeddings. Use when building chatbots over proprietary content, semantic search for a knowledge base, or AI assistants that need access to recent or custom information.
---

# RAG Implementation

Comprehensive guide for implementing production-ready Retrieval-Augmented Generation (RAG) systems with vector search, embeddings, chunking strategies, and retrieval patterns.

## When to Use This Skill

Use this skill when:
- Building AI applications that need to reference external knowledge bases
- Implementing semantic search over documents, codebases, or content
- Creating chatbots with access to proprietary or recent information
- Developing Q&A systems over large document collections
- Building context-aware AI assistants with custom knowledge
- Implementing document analysis or research tools
- Creating AI-powered search experiences

## Core RAG Concepts

### RAG Pipeline Overview

RAG consists of three main stages:

1. **Ingestion**: Convert documents into vector embeddings
2. **Retrieval**: Find relevant context using semantic search
3. **Generation**: Generate answers using retrieved context

**Benefits:**
- Access to up-to-date information beyond training cutoff
- Reduced hallucinations through grounded responses
- Citation and source attribution
- Domain-specific knowledge without fine-tuning
- Cost-effective compared to fine-tuning large models

### Basic Architecture

```
Documents → Chunking → Embeddings → Vector DB
                                         ↓
User Query → Embedding → Similarity Search → Top-K Chunks
                                                  ↓
                                          LLM + Context → Answer
```

## Embeddings

### OpenAI Embeddings

**text-embedding-3-small** (Recommended for most use cases)
- Dimensions: 1536 (default) or 512 (reduced)
- Cost: $0.02 / 1M tokens
- Performance: Fast, cost-effective
- Use case: General-purpose RAG

**text-embedding-3-large** (Higher quality)
- Dimensions: 3072 (default) or 1536/256 (reduced)
- Cost: $0.13 / 1M tokens
- Performance: Best quality, slower
- Use case: High-accuracy requirements

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float', // or 'base64' for storage optimization
  });
  return response.data[0].embedding;
}
```

### Cost Optimization

```typescript
// Batch embeddings for efficiency
async function batchEmbeddings(texts: string[]): Promise<number[][]> {
  // OpenAI supports up to 2048 inputs per request
  const BATCH_SIZE = 2048;
  const embeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
    });
    embeddings.push(...response.data.map(d => d.embedding));
  }
  
  return embeddings;
}
```

### Dimension Reduction

```typescript
// Reduce dimensions to save storage (1536 → 512)
const response = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: text,
  dimensions: 512, // Reduces storage by 67%
});
```

## Chunking Strategies

### 1. Fixed-Size Chunking

Simple, predictable chunks with overlap.

```typescript
interface ChunkOptions {
  chunkSize: number;    // Characters per chunk
  chunkOverlap: number; // Overlap between chunks
}

function fixedSizeChunking(
  text: string,
  options: ChunkOptions = { chunkSize: 1000, chunkOverlap: 200 }
): string[] {
  const { chunkSize, chunkOverlap } = options;
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - chunkOverlap;
  }

  return chunks;
}
```

**Best for:** General documents, articles, blogs
**Chunk size:** 500-1500 characters
**Overlap:** 100-300 characters (10-20%)

### 2. Sentence-Based Chunking

Respects sentence boundaries for better context.

```typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const sentenceSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', '! ', '? ', '; ', ', ', ' ', ''],
});

async function sentenceChunking(text: string): Promise<string[]> {
  return await sentenceSplitter.splitText(text);
}
```

**Best for:** Narrative content, documentation, books
**Chunk size:** 800-1200 characters

### 3. Semantic Chunking

Chunks based on topic/semantic shifts (advanced).

```typescript
import { SemanticChunker } from 'semantic-chunker';

async function semanticChunking(text: string): Promise<string[]> {
  const chunker = new SemanticChunker({
    model: 'text-embedding-3-small',
    breakpointThreshold: 0.7, // Similarity threshold
  });
  return await chunker.split(text);
}
```

**Best for:** Technical docs, research papers, diverse content
**Pros:** Preserves semantic context
**Cons:** Slower, requires embeddings

### 4. Markdown-Aware Chunking

Respects markdown structure (headers, code blocks).

```typescript
function markdownChunking(markdown: string): string[] {
  const chunks: string[] = [];
  const sections = markdown.split(/^##?\s+/gm);
  
  for (const section of sections) {
    if (section.trim().length === 0) continue;
    
    // Keep small sections together
    if (section.length < 1500) {
      chunks.push(section);
    } else {
      // Split large sections by paragraphs
      const paragraphs = section.split(/\n\n+/);
      let currentChunk = '';
      
      for (const para of paragraphs) {
        if ((currentChunk + para).length > 1000) {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = para;
        } else {
          currentChunk += (currentChunk ? '\n\n' : '') + para;
        }
      }
      if (currentChunk) chunks.push(currentChunk);
    }
  }
  
  return chunks;
}
```

**Best for:** Documentation, README files, technical guides

### 5. Code-Aware Chunking

Respects code structure (functions, classes).

```typescript
function codeChunking(code: string, language: string): string[] {
  const chunks: string[] = [];
  
  // For Python/JS: chunk by top-level functions/classes
  if (language === 'python' || language === 'javascript') {
    const functionRegex = /^(def|class|function|const\s+\w+\s*=\s*(async\s+)?function)/gm;
    const functions = code.split(functionRegex);
    
    for (let i = 0; i < functions.length; i++) {
      const chunk = functions[i];
      if (chunk && chunk.trim().length > 0) {
        // Keep functions with their preceding keyword
        if (i > 0) {
          chunks.push(functions[i - 1] + chunk);
        } else {
          chunks.push(chunk);
        }
      }
    }
  } else {
    // Fallback to fixed-size chunking for other languages
    return fixedSizeChunking(code, { chunkSize: 1500, chunkOverlap: 300 });
  }
  
  return chunks;
}
```

**Best for:** Code documentation, code search
**Chunk size:** 1000-2000 characters (larger for context)

## Vector Databases

### Pinecone

**Best for:** Production RAG with scale

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index('rag-docs');

// Upsert vectors
async function upsertDocuments(chunks: Array<{ id: string; text: string }>) {
  const vectors = await Promise.all(
    chunks.map(async (chunk) => ({
      id: chunk.id,
      values: await generateEmbedding(chunk.text),
      metadata: { text: chunk.text },
    }))
  );

  await index.upsert(vectors);
}

// Query similar documents
async function querySimilar(query: string, topK: number = 5) {
  const queryEmbedding = await generateEmbedding(query);
  
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return results.matches.map(match => ({
    text: match.metadata?.text as string,
    score: match.score,
    id: match.id,
  }));
}
```

### Supabase (pgvector)

**Best for:** All-in-one solution (database + vector search)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Create documents table with vector extension
// SQL:
// create extension if not exists vector;
// create table documents (
//   id bigserial primary key,
//   content text,
//   embedding vector(1536),
//   metadata jsonb
// );
// create index on documents using ivfflat (embedding vector_cosine_ops);

// Insert documents
async function insertDocuments(chunks: Array<{ content: string; metadata?: any }>) {
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content);
    
    await supabase.from('documents').insert({
      content: chunk.content,
      embedding: embedding,
      metadata: chunk.metadata || {},
    });
  }
}

// Semantic search
async function semanticSearch(query: string, matchCount: number = 5) {
  const embedding = await generateEmbedding(query);
  
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_count: matchCount,
    match_threshold: 0.7, // Cosine similarity threshold
  });

  if (error) throw error;
  return data;
}

// Postgres function for similarity search:
// create or replace function match_documents(
//   query_embedding vector(1536),
//   match_count int default 5,
//   match_threshold float default 0.7
// )
// returns table (
//   id bigint,
//   content text,
//   metadata jsonb,
//   similarity float
// )
// language plpgsql
// as $$
// begin
//   return query
//   select
//     documents.id,
//     documents.content,
//     documents.metadata,
//     1 - (documents.embedding <=> query_embedding) as similarity
//   from documents
//   where 1 - (documents.embedding <=> query_embedding) > match_threshold
//   order by documents.embedding <=> query_embedding
//   limit match_count;
// end;
// $$;
```

### In-Memory Vector Store (Development)

```typescript
class InMemoryVectorStore {
  private documents: Array<{
    id: string;
    text: string;
    embedding: number[];
    metadata?: any;
  }> = [];

  async addDocuments(docs: Array<{ id: string; text: string; metadata?: any }>) {
    for (const doc of docs) {
      const embedding = await generateEmbedding(doc.text);
      this.documents.push({ ...doc, embedding });
    }
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  }

  async search(query: string, topK: number = 5) {
    const queryEmbedding = await generateEmbedding(query);
    
    const results = this.documents
      .map(doc => ({
        ...doc,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }
}
```

## RAG Pipeline

### Complete Pipeline Example

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface RAGConfig {
  topK: number;
  minSimilarity: number;
  model: string;
}

class RAGPipeline {
  constructor(
    private vectorStore: InMemoryVectorStore,
    private config: RAGConfig = {
      topK: 5,
      minSimilarity: 0.7,
      model: 'claude-sonnet-4-20250514',
    }
  ) {}

  async ingest(documents: Array<{ id: string; text: string }>) {
    // 1. Chunk documents
    const chunks: Array<{ id: string; text: string }> = [];
    for (const doc of documents) {
      const docChunks = fixedSizeChunking(doc.text, {
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      docChunks.forEach((chunk, i) => {
        chunks.push({
          id: `${doc.id}_chunk_${i}`,
          text: chunk,
        });
      });
    }

    // 2. Generate embeddings and store
    await this.vectorStore.addDocuments(chunks);
  }

  async query(question: string): Promise<string> {
    // 1. Retrieve relevant chunks
    const results = await this.vectorStore.search(question, this.config.topK);
    
    // 2. Filter by similarity threshold
    const relevantChunks = results.filter(
      r => r.score >= this.config.minSimilarity
    );

    if (relevantChunks.length === 0) {
      return 'No relevant information found.';
    }

    // 3. Build context
    const context = relevantChunks
      .map((chunk, i) => `[${i + 1}] ${chunk.text}`)
      .join('\n\n');

    // 4. Generate answer
    const message = await anthropic.messages.create({
      model: this.config.model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Answer the question based on the context below. If the context doesn't contain the answer, say so.

Context:
${context}

Question: ${question}

Answer:`,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}
```

### Usage

```typescript
// Initialize
const vectorStore = new InMemoryVectorStore();
const rag = new RAGPipeline(vectorStore);

// Ingest documents
await rag.ingest([
  { id: 'doc1', text: 'Your document content here...' },
  { id: 'doc2', text: 'Another document...' },
]);

// Query
const answer = await rag.query('What is the main topic?');
console.log(answer);
```

## Advanced RAG Patterns

### 1. Hybrid Search (BM25 + Vector)

Combines keyword search with semantic search.

```typescript
interface SearchResult {
  id: string;
  text: string;
  score: number;
}

class HybridSearch {
  async search(
    query: string,
    topK: number = 5,
    alpha: number = 0.5 // Weight: 0 = all BM25, 1 = all vector
  ): Promise<SearchResult[]> {
    // 1. Vector search
    const vectorResults = await vectorStore.search(query, topK * 2);
    
    // 2. BM25 search (keyword)
    const bm25Results = await this.bm25Search(query, topK * 2);
    
    // 3. Normalize scores
    const normalizeScores = (results: SearchResult[]) => {
      const max = Math.max(...results.map(r => r.score));
      const min = Math.min(...results.map(r => r.score));
      return results.map(r => ({
        ...r,
        score: (r.score - min) / (max - min),
      }));
    };
    
    const normalizedVector = normalizeScores(vectorResults);
    const normalizedBM25 = normalizeScores(bm25Results);
    
    // 4. Combine scores
    const combined = new Map<string, SearchResult>();
    
    for (const result of normalizedVector) {
      combined.set(result.id, {
        ...result,
        score: result.score * alpha,
      });
    }
    
    for (const result of normalizedBM25) {
      const existing = combined.get(result.id);
      if (existing) {
        existing.score += result.score * (1 - alpha);
      } else {
        combined.set(result.id, {
          ...result,
          score: result.score * (1 - alpha),
        });
      }
    }
    
    // 5. Sort and return top-K
    return Array.from(combined.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private async bm25Search(query: string, k: number): Promise<SearchResult[]> {
    // Implement BM25 or use library like 'bm25'
    // For Supabase: use full-text search
    const { data } = await supabase
      .from('documents')
      .select('id, content')
      .textSearch('content', query)
      .limit(k);
    
    return data?.map(d => ({
      id: d.id,
      text: d.content,
      score: 1.0, // BM25 score if available
    })) || [];
  }
}
```

### 2. Conversational RAG

Maintains conversation history and reformulates queries.

```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

class ConversationalRAG {
  private history: Message[] = [];

  async reformulateQuery(query: string): Promise<string> {
    if (this.history.length === 0) return query;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [
        ...this.history,
        {
          role: 'user',
          content: `Given the conversation history, reformulate this follow-up question as a standalone question:

Follow-up: ${query}

Standalone question:`,
        },
      ],
    });

    const reformulated = message.content[0].type === 'text' 
      ? message.content[0].text 
      : query;
    
    return reformulated.trim();
  }

  async chat(userQuery: string): Promise<string> {
    // 1. Reformulate query with context
    const standaloneQuery = await this.reformulateQuery(userQuery);
    
    // 2. Retrieve relevant chunks
    const results = await vectorStore.search(standaloneQuery, 5);
    const context = results.map(r => r.text).join('\n\n');
    
    // 3. Generate response with history
    this.history.push({ role: 'user', content: userQuery });
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        ...this.history.slice(0, -1), // Previous history
        {
          role: 'user',
          content: `Context:
${context}

Question: ${userQuery}

Answer based on the context and our conversation:`,
        },
      ],
    });

    const answer = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    this.history.push({ role: 'assistant', content: answer });
    
    return answer;
  }
}
```

### 3. Multi-Query RAG

Generates multiple query variations for better retrieval.

```typescript
async function multiQueryRetrieval(
  query: string,
  vectorStore: InMemoryVectorStore
): Promise<SearchResult[]> {
  // 1. Generate query variations
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Generate 3 different variations of this search query:
"${query}"

Return only the queries, one per line.`,
      },
    ],
  });

  const variations = message.content[0].type === 'text'
    ? message.content[0].text.split('\n').filter(q => q.trim())
    : [query];
  
  // 2. Search with all variations
  const allResults = await Promise.all(
    [query, ...variations].map(q => vectorStore.search(q, 3))
  );
  
  // 3. Deduplicate and re-rank
  const uniqueResults = new Map<string, SearchResult>();
  
  for (const results of allResults) {
    for (const result of results) {
      const existing = uniqueResults.get(result.id);
      if (!existing || result.score > existing.score) {
        uniqueResults.set(result.id, result);
      }
    }
  }
  
  return Array.from(uniqueResults.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
```

### 4. Agentic RAG

LLM decides when and how to retrieve information.

```typescript
class AgenticRAG {
  async query(question: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 3;
    let context = '';
    
    while (attempts < maxAttempts) {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You have access to a knowledge base. 

${context ? `Retrieved context:\n${context}\n\n` : ''}

Question: ${question}

If you need more information, respond with: SEARCH: <your search query>
If you can answer, respond with: ANSWER: <your answer>`,
          },
        ],
      });

      const response = message.content[0].type === 'text'
        ? message.content[0].text
        : '';
      
      if (response.startsWith('SEARCH:')) {
        // Extract search query and retrieve
        const searchQuery = response.replace('SEARCH:', '').trim();
        const results = await vectorStore.search(searchQuery, 5);
        context += '\n\n' + results.map(r => r.text).join('\n\n');
        attempts++;
      } else if (response.startsWith('ANSWER:')) {
        return response.replace('ANSWER:', '').trim();
      } else {
        return response;
      }
    }
    
    return 'Could not find sufficient information.';
  }
}
```

## Streaming RAG

Return answers with source citations in real-time.

```typescript
import Anthropic from '@anthropic-ai/sdk';

async function* streamRAG(
  query: string,
  vectorStore: InMemoryVectorStore
): AsyncGenerator<{ type: 'sources' | 'chunk'; data: any }> {
  // 1. Retrieve and yield sources
  const results = await vectorStore.search(query, 5);
  yield {
    type: 'sources',
    data: results.map(r => ({ id: r.id, text: r.text.slice(0, 200) })),
  };
  
  // 2. Build context
  const context = results.map((r, i) => `[${i + 1}] ${r.text}`).join('\n\n');
  
  // 3. Stream answer
  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    stream: true,
    messages: [
      {
        role: 'user',
        content: `Answer based on the context. Cite sources as [1], [2], etc.

Context:
${context}

Question: ${query}`,
      },
    ],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield { type: 'chunk', data: event.delta.text };
    }
  }
}

// Usage with Server-Sent Events (SSE)
async function handleRAGStream(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const query = req.query.q as string;
  
  for await (const chunk of streamRAG(query, vectorStore)) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  
  res.write('data: [DONE]\n\n');
  res.end();
}
```

## Production Patterns

### Caching Retrieved Results

```typescript
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

async function cachedSearch(
  query: string,
  vectorStore: InMemoryVectorStore,
  ttl: number = 3600
): Promise<SearchResult[]> {
  const cacheKey = `rag:${Buffer.from(query).toString('base64')}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Search and cache
  const results = await vectorStore.search(query, 5);
  await redis.setEx(cacheKey, ttl, JSON.stringify(results));
  
  return results;
}
```

### Monitoring RAG Performance

```typescript
interface RAGMetrics {
  queryTime: number;
  retrievalTime: number;
  generationTime: number;
  chunksRetrieved: number;
  avgSimilarity: number;
}

async function monitoredRAG(query: string): Promise<{ answer: string; metrics: RAGMetrics }> {
  const startTime = Date.now();
  
  // Retrieval
  const retrievalStart = Date.now();
  const results = await vectorStore.search(query, 5);
  const retrievalTime = Date.now() - retrievalStart;
  
  // Generation
  const generationStart = Date.now();
  const answer = await generateAnswer(query, results);
  const generationTime = Date.now() - generationStart;
  
  const metrics: RAGMetrics = {
    queryTime: Date.now() - startTime,
    retrievalTime,
    generationTime,
    chunksRetrieved: results.length,
    avgSimilarity: results.reduce((sum, r) => sum + r.score, 0) / results.length,
  };
  
  // Log metrics (use your observability tool)
  console.log('RAG Metrics:', metrics);
  
  return { answer, metrics };
}
```

### Handling Document Updates

```typescript
class IncrementalRAG {
  async updateDocument(docId: string, newContent: string) {
    // 1. Remove old chunks
    await vectorStore.delete({ id: { $regex: `^${docId}_` } });
    
    // 2. Ingest new version
    const chunks = fixedSizeChunking(newContent);
    await vectorStore.addDocuments(
      chunks.map((text, i) => ({
        id: `${docId}_chunk_${i}`,
        text,
        metadata: { docId, version: Date.now() },
      }))
    );
  }

  async deleteDocument(docId: string) {
    await vectorStore.delete({ id: { $regex: `^${docId}_` } });
  }
}
```

### Error Handling

```typescript
async function robustRAG(query: string): Promise<string> {
  try {
    // 1. Validate input
    if (!query || query.trim().length === 0) {
      return 'Please provide a valid question.';
    }
    
    // 2. Retrieve with timeout
    const results = await Promise.race([
      vectorStore.search(query, 5),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Retrieval timeout')), 5000)
      ),
    ]);
    
    // 3. Check quality
    if (results.length === 0 || results[0].score < 0.5) {
      return 'I could not find relevant information to answer your question.';
    }
    
    // 4. Generate with fallback
    try {
      return await generateAnswer(query, results);
    } catch (genError) {
      console.error('Generation error:', genError);
      return 'I found relevant information but encountered an error generating the answer.';
    }
  } catch (error) {
    console.error('RAG error:', error);
    return 'An error occurred. Please try again.';
  }
}
```

## Evaluation

### Retrieval Metrics

```typescript
interface EvaluationResult {
  precision: number;
  recall: number;
  mrr: number; // Mean Reciprocal Rank
}

function evaluateRetrieval(
  retrievedChunks: string[],
  relevantChunks: string[]
): EvaluationResult {
  const retrieved = new Set(retrievedChunks);
  const relevant = new Set(relevantChunks);
  
  const truePositives = [...retrieved].filter(chunk => relevant.has(chunk)).length;
  
  const precision = retrieved.size > 0 ? truePositives / retrieved.size : 0;
  const recall = relevant.size > 0 ? truePositives / relevant.size : 0;
  
  // Mean Reciprocal Rank
  const firstRelevantIndex = retrievedChunks.findIndex(chunk => relevant.has(chunk));
  const mrr = firstRelevantIndex >= 0 ? 1 / (firstRelevantIndex + 1) : 0;
  
  return { precision, recall, mrr };
}
```

### Answer Quality Scoring

```typescript
async function evaluateAnswer(
  question: string,
  answer: string,
  groundTruth: string
): Promise<number> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Rate this answer's correctness on a scale of 1-10.

Question: ${question}

Generated Answer: ${answer}

Ground Truth: ${groundTruth}

Score (1-10):`,
      },
    ],
  });

  const response = message.content[0].type === 'text' ? message.content[0].text : '5';
  return parseInt(response.match(/\d+/)?.[0] || '5', 10);
}
```

## Best Practices

### DO:
✓ Use appropriate chunk sizes (500-1500 chars for text, 1000-2000 for code)
✓ Add overlap between chunks (10-20%)
✓ Include metadata (document ID, source, timestamp)
✓ Implement hybrid search for better recall
✓ Cache embeddings and frequent queries
✓ Monitor retrieval quality (precision, recall)
✓ Set similarity thresholds (0.7-0.8 for cosine)
✓ Use conversational reformulation for chat
✓ Provide source citations in answers
✓ Handle edge cases (no results, low confidence)

### DON'T:
✗ Don't use tiny chunks (<200 chars) - loses context
✗ Don't use huge chunks (>2000 chars) - reduces precision
✗ Don't skip chunking overlap - breaks continuity
✗ Don't ignore metadata - harder to trace sources
✗ Don't rely only on vector search - add keyword search
✗ Don't generate embeddings on every request - cache them
✗ Don't use arbitrary similarity thresholds - validate them
✗ Don't ignore conversation context - reformulate queries
✗ Don't return answers without sources - cite references
✗ Don't generate when confidence is low - admit uncertainty

### Performance Optimization

1. **Batch embeddings**: Process documents in batches (up to 2048 per request)
2. **Use smaller models**: text-embedding-3-small for most cases
3. **Reduce dimensions**: 512 instead of 1536 saves 67% storage
4. **Cache results**: Redis for frequent queries
5. **Async processing**: Parallelize document ingestion
6. **Index optimization**: Use IVF for large collections
7. **Reranking**: Use cross-encoder for top results

### Security

```typescript
// Sanitize user queries
function sanitizeQuery(query: string): string {
  return query
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000); // Limit length
}

// Filter sensitive chunks
function filterSensitive(chunks: SearchResult[]): SearchResult[] {
  const sensitivePatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{16}\b/, // Credit card
  ];
  
  return chunks.filter(chunk => 
    !sensitivePatterns.some(pattern => pattern.test(chunk.text))
  );
}
```

## Quick Reference

### Chunking Strategy Selection

| Content Type | Strategy | Size | Overlap |
|--------------|----------|------|---------|
| General text | Fixed-size | 1000 | 200 |
| Documentation | Markdown-aware | 1000-1500 | 200 |
| Code | Code-aware | 1500-2000 | 300 |
| Conversations | Sentence-based | 800-1200 | 150 |
| Research papers | Semantic | Variable | N/A |

### Embedding Models

| Model | Dimensions | Cost (/1M tokens) | Use Case |
|-------|------------|-------------------|----------|
| text-embedding-3-small | 1536 | $0.02 | General RAG |
| text-embedding-3-large | 3072 | $0.13 | High accuracy |
| text-embedding-3-small (512) | 512 | $0.02 | Storage-optimized |

### Vector Databases

| Database | Best For | Pros | Cons |
|----------|----------|------|------|
| Pinecone | Production scale | Fast, managed | Cost |
| Supabase | All-in-one | Postgres + vectors | Setup complexity |
| Weaviate | Advanced features | GraphQL, multi-modal | Learning curve |
| In-memory | Development | Simple, fast | No persistence |

### Similarity Thresholds

- **0.9+**: Nearly identical (duplicates)
- **0.8-0.9**: Very similar (relevant)
- **0.7-0.8**: Somewhat similar (acceptable)
- **0.6-0.7**: Loosely related (borderline)
- **<0.6**: Not relevant (filter out)

### Retrieval Parameters

- **topK**: 3-10 chunks (5 is typical)
- **chunk_size**: 500-1500 characters
- **overlap**: 100-300 characters (10-20%)
- **max_tokens**: 1024-2048 for answers

## Troubleshooting

**Poor retrieval quality:**
- Check chunk size (too large/small?)
- Verify embedding model consistency
- Validate similarity thresholds
- Test with different chunking strategies
- Consider hybrid search (BM25 + vector)

**Slow queries:**
- Cache embeddings
- Use smaller embedding dimensions
- Implement vector index (IVF/HNSW)
- Batch document processing
- Reduce topK parameter

**Hallucinations despite RAG:**
- Lower temperature (0.3-0.5)
- Strengthen system prompt
- Require citations
- Set confidence thresholds
- Validate retrieved context quality

**Context too long:**
- Reduce topK
- Use extractive summarization
- Implement re-ranking
- Increase chunk overlap
- Use conversational context window management
