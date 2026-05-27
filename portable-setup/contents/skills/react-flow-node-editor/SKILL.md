---
name: react-flow-node-editor
description: Builds production node-based editors with @xyflow/react v12+, covering custom typed nodes, dynamic handles, topological pipeline execution, connection validation, node status visualization, context menus, and Zustand/database persistence; use when building visual pipeline or workflow editors
---

# React Flow Node Editor

Production patterns for building visual node-based pipeline editors with `@xyflow/react` (React Flow v12+). Covers custom node components with typed data, handle-based connections, dynamic handle generation, topological sorting for execution order, node status visualization, edge validation, context menus, and saving/loading flows. All patterns are drawn from the AIDEN Creative Agent pipeline editor -- a 40+ node type production system.

## When to Use This Skill

Use when:
- Building a visual node-based editor (pipelines, workflows, DAGs)
- Creating custom node components with typed data and handles
- Implementing connection validation between typed handles
- Adding dynamic handles that grow/shrink at runtime
- Executing a node graph in topological order (level-by-level)
- Visualizing node execution status (idle/running/completed/failed)
- Building right-click context menus for node creation
- Persisting flow state to a database or sessionStorage
- Integrating React Flow with Zustand or React state

## Installation and Setup

```bash
npm install @xyflow/react
```

Required CSS import (in layout or global CSS):

```css
@import "@xyflow/react/dist/style.css";
```

## Core Architecture

### Page-Level Setup with ReactFlowProvider

Every React Flow editor needs `ReactFlowProvider` wrapping the component that calls `useReactFlow()`. When using Next.js with `useSearchParams`, wrap in `<Suspense>` as well.

```tsx
"use client";

import { Suspense } from "react";
import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react";
import { PipelineNode, PipelineEdge } from "@/types/nodes";

// Register all custom node types (must be defined OUTSIDE the component)
const nodeTypes: NodeTypes = {
  textInput: TextInputNode,
  analysis: AnalysisNode,
  generator: GeneratorNode,
  output: OutputNode,
} as NodeTypes;

function EditorContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PipelineNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<PipelineEdge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      selectionOnDrag
      selectionMode={SelectionMode.Partial}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Panel position="top-left">
        {/* Toolbar buttons */}
      </Panel>
    </ReactFlow>
  );
}

// Wrapper: ReactFlowProvider MUST wrap the component using useReactFlow()
export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactFlowProvider>
        <EditorContent />
      </ReactFlowProvider>
    </Suspense>
  );
}
```

**Critical rules:**
- `nodeTypes` must be defined outside the component or memoized -- never inline in JSX.
- `ReactFlowProvider` must wrap any component calling `useReactFlow()`.
- Next.js App Router with `useSearchParams` requires `<Suspense>` boundary.

## Typed Node Data System

### Defining Node Data Types

Create a union type system for all node data. Each node type gets its own interface with `[key: string]: unknown` for React Flow compatibility.

```tsx
// types/nodes.ts
import { Node, Edge } from "@xyflow/react";

export interface TextInputNodeData {
  label: string;
  text: string;
  [key: string]: unknown;
}

export interface AnalysisNodeData {
  label: string;
  status: "idle" | "running" | "completed" | "failed";
  analysis?: string;
  model: "gpt-5" | "gemini";
  [key: string]: unknown;
}

export interface GeneratorNodeData {
  label: string;
  status: "idle" | "running" | "completed" | "failed";
  aspectRatio: string;
  resolution: "1K" | "2K" | "4K";
  imageHandleCount: number;
  generatedImageUrl?: string;
  [key: string]: unknown;
}

export interface OutputNodeData {
  label: string;
  imageUrl?: string;
  images?: GeneratedImage[];
  saved: boolean;
  [key: string]: unknown;
}

// Union of all node data types
export type PipelineNodeData =
  | TextInputNodeData
  | AnalysisNodeData
  | GeneratorNodeData
  | OutputNodeData;

// Enum of all node type strings
export type PipelineNodeType =
  | "textInput"
  | "analysis"
  | "generator"
  | "output";

// Typed node and edge aliases
export type PipelineNode = Node<PipelineNodeData, PipelineNodeType>;
export type PipelineEdge = Edge;
```

### Custom NodeProps Type

React Flow v12 changed how node props are typed. Define a custom props interface for consistency:

```tsx
// Workaround for @xyflow/react v12 type changes
export interface CustomNodeProps<T extends Record<string, unknown>> {
  id: string;
  data: T;
  selected?: boolean;
  type?: string;
  zIndex?: number;
  isConnectable?: boolean;
  positionAbsoluteX?: number;
  positionAbsoluteY?: number;
  dragging?: boolean;
}
```

## Custom Node Components

### Base Node Component System

Build a composable design system with `BaseNode`, `NodeHeader`, `NodeContent`, `NodeFooter`, and `NodeHandle` primitives. This ensures visual consistency across 40+ node types.

```tsx
// nodes/BaseNode.tsx
"use client";
import { memo, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BaseNodeProps {
  selected?: boolean;
  children: ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
  style?: React.CSSProperties;
}

const widthClasses = {
  sm: "w-[160px]",
  md: "w-[200px]",
  lg: "w-[260px]",
  xl: "w-[320px]",
};

export const BaseNode = memo(
  forwardRef<HTMLDivElement, BaseNodeProps>(function BaseNode(
    { selected, children, width = "md", style },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl transition-all duration-200",
          "bg-node-bg border border-node-border",
          "shadow-[var(--node-shadow)]",
          selected && "border-[var(--node-border-selected)] shadow-[var(--node-shadow-hover)]",
          widthClasses[width]
        )}
        style={style}
      >
        {children}
      </div>
    );
  })
);
```

### NodeHeader with Status Indicators

```tsx
// nodes/NodeHeader.tsx
"use client";
import { memo, ReactNode } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export type NodeStatus = "idle" | "running" | "completed" | "failed";
export type NodeColor = "green" | "blue" | "orange" | "purple" | "amber" | "slate";

export const NodeHeader = memo(function NodeHeader({
  icon,
  label,
  status = "idle",
  color = "slate",
  actions,
}: {
  icon: ReactNode;
  label: string;
  status?: NodeStatus;
  color?: NodeColor;
  actions?: ReactNode;
}) {
  const statusIcon = {
    running: <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />,
    completed: <CheckCircle className="h-3.5 w-3.5 text-green-500" />,
    failed: <XCircle className="h-3.5 w-3.5 text-red-500" />,
    idle: null,
  }[status];

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-t-xl bg-[var(--node-header-slate)]">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-[11px] font-semibold flex-1 truncate">{label}</span>
      {actions}
      {statusIcon}
    </div>
  );
});
```

### Complete Custom Node Example

```tsx
// nodes/GeneratorNode.tsx
"use client";
import { memo, useCallback, useEffect } from "react";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { Play, Minus, Plus } from "lucide-react";
import { GeneratorNodeData, CustomNodeProps } from "@/types/nodes";
import {
  BaseNode,
  NodeHeader,
  NodeContent,
  NodeRow,
  NodeFooter,
  NodeHandle,
} from "./index";

const MAX_IMAGE_HANDLES = 12;
const MIN_IMAGE_HANDLES = 1;

export const GeneratorNode = memo(function GeneratorNode({
  id,
  data,
  selected,
}: CustomNodeProps<GeneratorNodeData>) {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const imageHandleCount = data.imageHandleCount || 1;

  // CRITICAL: Notify React Flow when handles change so edges re-render
  useEffect(() => {
    updateNodeInternals(id);
  }, [imageHandleCount, id, updateNodeInternals]);

  const handleRun = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection
    window.dispatchEvent(
      new CustomEvent("runGenerator", { detail: { nodeId: id } })
    );
  }, [id]);

  const handleAddImageInput = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageHandleCount >= MAX_IMAGE_HANDLES) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, imageHandleCount: imageHandleCount + 1 } }
          : node
      )
    );
  }, [id, imageHandleCount, setNodes]);

  // Handle positioning constants
  const HEADER_HEIGHT = 52;
  const START_OFFSET = HEADER_HEIGHT + 24;
  const HANDLE_SPACING = 28;
  const TXT_HANDLE_TOP = START_OFFSET;
  const IMAGE_HANDLES_START = TXT_HANDLE_TOP + HANDLE_SPACING;

  return (
    <BaseNode selected={selected} width="lg">
      {/* Fixed text input handle */}
      <NodeHandle
        type="target"
        position={Position.Left}
        id="prompt"
        dataType="text"
        label="txt"
        style={{ top: `${TXT_HANDLE_TOP}px` }}
      />

      {/* Dynamic image input handles */}
      {Array.from({ length: imageHandleCount }).map((_, index) => (
        <NodeHandle
          key={`img-${index}`}
          type="target"
          position={Position.Left}
          id={`${id}-images-${index}`}
          dataType="image"
          label={imageHandleCount > 1 ? `img ${index + 1}` : "img"}
          style={{ top: `${IMAGE_HANDLES_START + index * HANDLE_SPACING}px` }}
        />
      ))}

      <NodeHeader
        icon={<span className="text-base">AI</span>}
        label={data.label}
        color="slate"
        status={data.status}
      />

      <NodeContent>
        <NodeRow label="Aspect Ratio" value={data.aspectRatio} />
        <NodeRow label="Resolution" value={data.resolution} />
        <NodeRow label="Status" value={<span className="capitalize">{data.status}</span>} />

        {data.generatedImageUrl && (
          <img src={data.generatedImageUrl} alt="Generated" className="w-full rounded" />
        )}
      </NodeContent>

      <NodeFooter>
        <button onClick={handleRun} disabled={data.status === "running"}>
          <Play className="h-3 w-3" />
          Run
        </button>
      </NodeFooter>

      {/* Output handle */}
      <NodeHandle
        type="source"
        position={Position.Right}
        id="image"
        dataType="image"
        label="out"
        style={{ top: "50%" }}
      />
    </BaseNode>
  );
});
```

## Handle System

### Handle ID Convention (CRITICAL)

Dynamic handle IDs MUST include the node ID to be globally unique. Without this, multiple instances of the same node type will have colliding handle IDs.

**Format:** `{nodeId}-{handleType}-{index}`

```tsx
// CORRECT - globally unique
id={`${id}-images-${index}`}      // "generator-1-images-0"
id={`${id}-input-${index}`}       // "prompt-1-input-0"

// WRONG - will collide between instances
id={`images-${index}`}            // Two generators both have "images-0"
```

**When parsing handle IDs in connection validation:**

```tsx
// CORRECT - use includes() for prefixed IDs
if (targetHandle.includes("-images-")) { ... }

// WRONG - won't match "generator-1-images-0"
if (targetHandle.startsWith("images-")) { ... }
```

### Typed Handle Component

Color-code handles by data type for visual clarity:

```tsx
// nodes/NodeHandle.tsx
import { Handle, Position } from "@xyflow/react";

export type HandleDataType = "image" | "text" | "analysis" | "data" | "video" | "audio";

const handleColors: Record<HandleDataType, string> = {
  image: "!bg-green-500",
  text: "!bg-orange-500",
  analysis: "!bg-purple-500",
  data: "!bg-blue-500",
  video: "!bg-violet-500",
  audio: "!bg-pink-500",
};

export function NodeHandle({
  type,
  position,
  id,
  dataType = "data",
  label,
  style,
}: {
  type: "source" | "target";
  position: Position;
  id?: string;
  dataType?: HandleDataType;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <Handle
        type={type}
        position={position}
        id={id}
        style={style}
        className={`!w-3.5 !h-3.5 ${handleColors[dataType]} !border-2 !border-node-bg`}
      />
      {label && (
        <span
          className="absolute text-[8px] text-muted-foreground pointer-events-none"
          style={{
            ...style,
            transform: "translateY(-50%)",
            [position === Position.Left ? "left" : "right"]: "18px",
          }}
        >
          {label}
        </span>
      )}
    </>
  );
}
```

### Dynamic Handle Generation

Handles that can be added/removed at runtime. Call `useUpdateNodeInternals` after changing handle count.

```tsx
import { useUpdateNodeInternals } from "@xyflow/react";

const updateNodeInternals = useUpdateNodeInternals();
const handleCount = data.imageHandleCount || 1;

// CRITICAL: Tell React Flow to re-measure handles when count changes
useEffect(() => {
  updateNodeInternals(id);
}, [handleCount, id, updateNodeInternals]);

// Add handle
const handleAddInput = useCallback((e: React.MouseEvent) => {
  e.stopPropagation();
  if (handleCount >= MAX_HANDLES) return;
  setNodes((nds) =>
    nds.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, imageHandleCount: handleCount + 1 } }
        : node
    )
  );
}, [id, handleCount, setNodes]);

// Remove handle
const handleRemoveInput = useCallback((e: React.MouseEvent) => {
  e.stopPropagation();
  if (handleCount <= MIN_HANDLES) return;
  setNodes((nds) =>
    nds.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, imageHandleCount: handleCount - 1 } }
        : node
    )
  );
}, [id, handleCount, setNodes]);
```

### NodeHandleGroup Helper

For nodes with multiple fixed handles at regular intervals:

```tsx
export function NodeHandleGroup({
  type,
  position,
  handles,
  startOffset = 60,
  spacing = 28,
}: {
  type: "source" | "target";
  position: Position;
  handles: Array<{ id: string; dataType?: HandleDataType; label?: string }>;
  startOffset?: number;
  spacing?: number;
}) {
  return (
    <>
      {handles.map((handle, index) => (
        <NodeHandle
          key={handle.id}
          type={type}
          position={position}
          id={handle.id}
          dataType={handle.dataType}
          label={handle.label}
          style={{ top: `${startOffset + index * spacing}px` }}
        />
      ))}
    </>
  );
}
```

## Connection Validation

### Type-Safe Edge Validation

Use `isValidConnection` to enforce type compatibility between source and target handles:

```tsx
const isValidConnection = useCallback(
  (connection: Connection | Edge) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;

    // 1. Determine source output type
    let sourceType: string;
    if (sourceNode.type === "textInput") {
      sourceType = "text";
    } else if (sourceNode.type === "generator") {
      sourceType = "image";
    } else if (sourceNode.type === "analysis") {
      sourceType = "analysis";
    } else {
      const outputTypes: Record<string, string> = {
        imageUpload: "image",
        prompt: "text",
        aiMusic: "audio",
        klingVideo: "video",
      };
      sourceType = outputTypes[sourceNode.type || ""];
    }

    // 2. Define what each target node/handle accepts
    const inputTypes: Record<string, Record<string, string[]>> = {
      analysis: { default: ["image"] },
      prompt: { default: ["text", "analysis"] },
      generator: {
        images: ["image"],
        prompt: ["text"],
        default: ["image", "text"],
      },
      output: { default: ["image"] },
    };

    // 3. Normalize dynamic handle IDs
    let targetHandle = connection.targetHandle || "default";
    if (targetNode.type === "generator" && targetHandle.includes("-images-")) {
      targetHandle = "images"; // Normalize "gen-1-images-0" to "images"
    }

    // 4. Check compatibility
    const targetAccepts =
      inputTypes[targetNode.type || ""]?.[targetHandle] ||
      inputTypes[targetNode.type || ""]?.default;

    if (!sourceType || !targetAccepts) return true; // No rules = allow
    return targetAccepts.includes(sourceType);
  },
  [nodes, edges]
);

// Pass to ReactFlow
<ReactFlow isValidConnection={isValidConnection} ... />
```

### Multi-Connection Slot Validation

For handles that accept limited connections (e.g., one media + one dialog per clip slot):

```tsx
// Check existing connections to this specific clip handle
if (targetNode.type === "mediaSequence" && connection.targetHandle?.includes("-clip-")) {
  const existingConnections = edges.filter(
    (e) => e.target === targetNode.id && e.targetHandle === connection.targetHandle
  );

  let hasMedia = false;
  let hasDialog = false;
  for (const edge of existingConnections) {
    const existingSource = nodes.find((n) => n.id === edge.source);
    if (existingSource?.type === "textToDialog") {
      hasDialog = true;
    } else {
      hasMedia = true;
    }
  }

  if (sourceType === "dialog") {
    if (hasDialog) return false; // Only one dialog per slot
  } else {
    if (hasMedia) return false;  // Only one media per slot
  }
}
```

## Topological Sorting for Pipeline Execution

### Kahn's Algorithm for Execution Levels

Group nodes into execution levels. Level 0 has no dependencies, Level 1 depends on Level 0, etc. Nodes within the same level execute in parallel.

```tsx
// lib/pipeline/execution-helpers.ts

/**
 * Returns nodes grouped by execution level using Kahn's algorithm.
 * Level 0 = no dependencies, Level 1 = depends on Level 0, etc.
 * Deduplicates multi-handle edges between same source->target pair.
 */
export function getExecutionLevels(
  nodes: PipelineNode[],
  edges: PipelineEdge[]
): PipelineNode[][] {
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  // Initialize
  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adjacencyList.set(n.id, []);
  });

  // Build graph - deduplicate edges between same node pair
  // Multiple handles between the same two nodes count as ONE dependency
  const seenEdges = new Set<string>();
  edges.forEach((edge) => {
    const edgeKey = `${edge.source}->${edge.target}`;
    if (seenEdges.has(edgeKey)) return;
    seenEdges.add(edgeKey);

    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    adjacencyList.get(edge.source)?.push(edge.target);
  });

  // Kahn's algorithm - group by levels
  const levels: PipelineNode[][] = [];
  let currentLevel = nodes.filter((n) => inDegree.get(n.id) === 0);

  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    const nextLevel: PipelineNode[] = [];

    for (const node of currentLevel) {
      for (const neighborId of adjacencyList.get(node.id) || []) {
        inDegree.set(neighborId, (inDegree.get(neighborId) || 1) - 1);
        if (inDegree.get(neighborId) === 0) {
          const neighborNode = nodes.find((n) => n.id === neighborId);
          if (neighborNode) nextLevel.push(neighborNode);
        }
      }
    }

    currentLevel = nextLevel;
  }

  return levels;
}
```

### Level-by-Level Execution with Status Updates

Execute the pipeline by processing each level sequentially, with nodes within each level running in parallel:

```tsx
const handleRunPipeline = async () => {
  setIsRunning(true);
  setPipelineError(null);

  // Reset all executable node statuses to idle
  setNodes((nds) =>
    nds.map((node) => {
      if (["analysis", "chatgpt", "generator"].includes(node.type || "")) {
        return { ...node, data: { ...node.data, status: "idle" } };
      }
      return node;
    })
  );

  try {
    const levels = getExecutionLevels(nodes, edges);

    // Filter to only executable node types (skip data pass-through nodes)
    const executableTypes = ["analysis", "chatgpt", "generator", "anyLLM"];

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const executableNodes = level.filter((n) =>
        executableTypes.includes(n.type || "")
      );

      if (executableNodes.length === 0) continue;

      // Wait for React state to propagate (sync nodes like prompt)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get fresh node state
      let currentNodes: PipelineNode[] = [];
      setNodes((nds) => {
        currentNodes = nds;
        return nds;
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Execute all nodes in this level in PARALLEL
      await Promise.all(
        executableNodes.map((node) =>
          executeNode(node, currentNodes, edges, setNodes, urlToBase64)
        )
      );

      // Wait for state update before next level
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  } catch (error) {
    setPipelineError(error instanceof Error ? error.message : "Pipeline failed");
    setIsRunning(false);
  }
};
```

### Node Execution with Input Resolution

Each node resolves its inputs from connected upstream nodes, then calls its API:

```tsx
export async function executeNode(
  node: PipelineNode,
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  setNodes: React.Dispatch<React.SetStateAction<PipelineNode[]>>,
  urlToBase64: (url: string) => Promise<{ base64: string; mimeType: string }>
): Promise<void> {
  const { images, prompt } = resolveNodeInputs(node, edges, nodes);

  // Set status to running
  setNodes((nds) =>
    nds.map((n) =>
      n.id === node.id ? { ...n, data: { ...n.data, status: "running" } } : n
    )
  );

  try {
    switch (node.type) {
      case "analysis": {
        if (images.length === 0) throw new Error("No image connected");
        const { base64, mimeType } = await urlToBase64(images[0]);
        const response = await fetch("/api/node/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, analysis: data.analysis, status: "completed" } }
              : n
          )
        );
        break;
      }

      case "generator": {
        const validImages = images.filter(Boolean);
        const imageInputs = await Promise.all(validImages.map(urlToBase64));
        const response = await fetch("/api/node/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: imageInputs,
            prompt: prompt || "Generate an image.",
            aspectRatio: (node.data as any).aspectRatio || "4:5",
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        const generatedUrl = `data:${data.mimeType};base64,${data.imageData}`;
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, generatedImageUrl: generatedUrl, status: "completed" } }
              : n
          )
        );
        break;
      }

      default:
        return; // Non-executable nodes are skipped
    }
  } catch (error) {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, status: "failed" } } : n
      )
    );
    throw error;
  }
}
```

### Resolving Node Inputs from Edges

Walk the incoming edges to collect images and prompts from upstream nodes:

```tsx
export function resolveNodeInputs(
  node: PipelineNode,
  edges: PipelineEdge[],
  nodes: PipelineNode[]
): { images: string[]; prompt: string | undefined } {
  const incomingEdges = edges.filter((e) => e.target === node.id);
  const images: string[] = [];
  let prompt: string | undefined;

  for (const edge of incomingEdges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (!sourceNode) continue;

    const sourceData = sourceNode.data as Record<string, unknown>;
    const targetHandle = edge.targetHandle || "default";
    const imageUrl = sourceData.imageUrl || sourceData.generatedImageUrl;
    const isValidImage = typeof imageUrl === "string" && imageUrl.length > 0;

    // Route by target handle type
    if (targetHandle.includes("-images-") && isValidImage) {
      images.push(imageUrl as string);
    } else if (targetHandle === "prompt") {
      prompt = (sourceData.combinedPrompt || sourceData.output || sourceData.text) as string;
    } else if (targetHandle === "default" && isValidImage) {
      images.push(imageUrl as string);
    }
  }

  return { images, prompt };
}
```

## Node Status Visualization

### Status-Based Node Appearance

Nodes display their execution state through header color and icons:

| Status | Header Background | Icon | Animation |
|--------|------------------|------|-----------|
| `idle` | Type default | None | None |
| `running` | Blue | Loader2 | `animate-spin` |
| `completed` | Green | CheckCircle | None |
| `failed` | Red | XCircle | None |

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "running": return "bg-blue-50 dark:bg-blue-950";
    case "completed": return "bg-green-50 dark:bg-green-950";
    case "failed": return "bg-red-50 dark:bg-red-950";
    default: return "bg-slate-50 dark:bg-slate-950";
  }
};
```

### Pipeline-Level Status Reset

Reset all nodes before running:

```tsx
setNodes((nds) =>
  nds.map((node) => {
    if (["analysis", "generator", "chatgpt"].includes(node.type || "")) {
      return { ...node, data: { ...node.data, status: "idle" } };
    }
    if (node.type === "output") {
      return { ...node, data: { ...node.data, saved: false } };
    }
    return node;
  })
);
```

## Node Context Menu

### Right-Click Node Creation

Convert screen coordinates to flow coordinates for accurate node placement:

```tsx
const [contextMenu, setContextMenu] = useState<{
  x: number; y: number; flowX: number; flowY: number;
} | null>(null);

const { screenToFlowPosition } = useReactFlow();

const onPaneContextMenu = useCallback(
  (event: MouseEvent | React.MouseEvent) => {
    event.preventDefault();
    const flowPosition = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      flowX: flowPosition.x,
      flowY: flowPosition.y,
    });
  },
  [screenToFlowPosition]
);

const onPaneClick = useCallback(() => {
  setContextMenu(null);
}, []);

// In JSX:
<ReactFlow onPaneContextMenu={onPaneContextMenu} onPaneClick={onPaneClick} ... />

{contextMenu && (
  <NodeContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    flowPosition={{ x: contextMenu.flowX, y: contextMenu.flowY }}
    onClose={() => setContextMenu(null)}
    onAddNode={handleAddNode}
  />
)}
```

### Context Menu Component with Categories

```tsx
interface NodeContextMenuProps {
  x: number;
  y: number;
  flowPosition: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: string, data: Record<string, unknown>, position?: { x: number; y: number }) => void;
}

export function NodeContextMenu({ x, y, flowPosition, onClose, onAddNode }: NodeContextMenuProps) {
  const [search, setSearch] = useState("");

  const categories = [
    {
      label: "Input",
      items: [
        { type: "imageUpload", label: "Image Upload", data: { label: "Image Upload" } },
        { type: "textInput", label: "Prompt", data: { label: "Prompt", text: "" } },
      ],
    },
    {
      label: "Processing",
      items: [
        { type: "analysis", label: "Analysis", data: { label: "Analysis", status: "idle" } },
        { type: "generator", label: "AI Generator", data: { label: "Generator", status: "idle", imageHandleCount: 1 } },
      ],
    },
    {
      label: "Output",
      items: [
        { type: "output", label: "Output", data: { label: "Output", saved: false } },
      ],
    },
  ];

  return (
    <div
      className="fixed z-50 bg-background border rounded-lg shadow-lg p-2 w-64"
      style={{ left: x, top: y }}
    >
      <Input
        placeholder="Search nodes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      {categories.map((cat) => (
        <div key={cat.label}>
          <p className="text-xs text-muted-foreground font-semibold px-2 py-1">{cat.label}</p>
          {cat.items
            .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  onAddNode(item.type, item.data, flowPosition);
                  onClose();
                }}
                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted"
              >
                {item.label}
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
```

### Adding Nodes at Flow Position

```tsx
const handleAddNode = (
  type: string,
  data: Record<string, unknown>,
  position?: { x: number; y: number }
) => {
  setNodes((nds) => {
    const maxZIndex = Math.max(0, ...nds.map((n) => n.zIndex ?? 0));
    const newNode: PipelineNode = {
      id: `${type}-${Date.now()}`,
      type: type as PipelineNodeType,
      position: position || { x: 400, y: 200 },
      data: data as PipelineNodeData,
      zIndex: maxZIndex + 1,
    };
    return [...nds, newNode];
  });
};
```

## Node Sync (Non-Executable Nodes)

Some nodes transform data without making API calls (prompt combiners, arrays, routers). These need reactive syncing via `useEffect` whenever their upstream data changes.

```tsx
// hooks/useNodeSync.ts
export function useNodeSync(
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  setNodes: React.Dispatch<React.SetStateAction<PipelineNode[]>>
): void {
  // Sync connected text inputs to Prompt nodes
  useEffect(() => {
    const promptNodes = nodes.filter((n) => n.type === "prompt");

    for (const promptNode of promptNodes) {
      const incomingEdges = edges.filter((e) => e.target === promptNode.id);

      const inputTexts = incomingEdges
        .map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          if (!sourceNode) return null;

          let text = "";
          if (sourceNode.type === "textInput") {
            text = (sourceNode.data as { text?: string }).text || "";
          } else if (sourceNode.type === "analysis") {
            text = (sourceNode.data as { analysis?: string }).analysis || "";
          }

          return {
            sourceNodeId: sourceNode.id,
            sourceNodeLabel: (sourceNode.data as { label: string }).label,
            text,
          };
        })
        .filter(Boolean);

      // Build combined prompt from all inputs
      const combinedPrompt = inputTexts
        .map((block) => block?.text)
        .filter(Boolean)
        .join("\n\n---\n\n");

      // Only update if changed (prevent infinite loops)
      const currentData = promptNode.data as PromptNodeData;
      if (currentData.combinedPrompt !== combinedPrompt) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === promptNode.id
              ? { ...n, data: { ...n.data, inputTexts, combinedPrompt } }
              : n
          )
        );
      }
    }
  }, [nodes, edges, setNodes]);
}
```

**Important:** For worker/webhook execution parity, the sync logic for non-executable nodes must also exist in your worker. Extract sync functions into a shared module.

## Saving and Loading Flows

### Session Storage Draft (Auto-Save)

Save pipeline state to sessionStorage for crash recovery:

```tsx
// hooks/usePipelineDraft.ts
const DRAFT_KEY = "pipeline-editor-draft";
const DEBOUNCE_MS = 500;

export function usePipelineDraft(
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  onRestore: (nodes: PipelineNode[], edges: PipelineEdge[]) => void
) {
  const isInitialMount = useRef(true);
  const hasRestored = useRef(false);

  // Restore on mount
  useEffect(() => {
    if (hasRestored.current) return;
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (saved) {
      const draft = JSON.parse(saved);
      if (Date.now() - draft.savedAt < 24 * 60 * 60 * 1000) {
        onRestore(draft.nodes, draft.edges);
      }
    }
    hasRestored.current = true;
    setTimeout(() => { isInitialMount.current = false; }, 100);
  }, [onRestore]);

  // Save on changes (debounced)
  useEffect(() => {
    if (isInitialMount.current) return;
    const timeout = setTimeout(() => {
      // Strip large data URLs before saving
      const strippedNodes = nodes.map((node) => {
        const data = { ...node.data } as Record<string, unknown>;
        if (typeof data.generatedImageUrl === "string" && data.generatedImageUrl.startsWith("data:")) {
          data.generatedImageUrl = undefined;
        }
        return { ...node, data };
      });
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        nodes: strippedNodes,
        edges,
        savedAt: Date.now(),
      }));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [nodes, edges]);

  const clearDraft = useCallback(() => sessionStorage.removeItem(DRAFT_KEY), []);
  return { clearDraft };
}
```

### Database Persistence with Auto-Save

```tsx
// hooks/useAutoSave.ts
export type SaveStatus = "idle" | "saving" | "saved" | "error" | "unsaved";

export function useAutoSave({
  presetId,
  nodes,
  edges,
  presetName,
  debounceMs = 10000,
}: {
  presetId: string | null;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  presetName: string;
  debounceMs?: number;
}) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const lastHashRef = useRef<string>("");

  // Generate hash of current state (excluding volatile fields)
  function getStateHash(nodes: PipelineNode[], edges: PipelineEdge[]): string {
    const stripped = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        status: undefined,       // Runtime state
        generatedImageUrl: undefined, // Base64 (too large)
        error: undefined,        // Runtime errors
      },
    }));
    return JSON.stringify({ nodes: stripped, edges });
  }

  useEffect(() => {
    if (!presetId) return;

    const hash = getStateHash(nodes, edges);
    if (hash === lastHashRef.current) return;

    setSaveStatus("unsaved");

    const timeout = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await fetch(`/api/presets/${presetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: presetName, nodes, edges }),
        });
        lastHashRef.current = hash;
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [nodes, edges, presetId, presetName, debounceMs]);

  return { saveStatus };
}
```

### Data Preservation Rules on Save

When saving pipelines, separate volatile runtime data from persistent configuration:

```tsx
// PRESERVE (user expects these to persist):
const preserveFields = {
  output: node.type === "anyLLM" ? node.data.output : undefined,
  generatedImagePath: node.data.generatedImagePath, // Storage paths persist
};

// STRIP (volatile runtime data):
const stripFields = {
  status: undefined,              // Runtime execution state
  error: undefined,               // Runtime errors
  generatedImageUrl: undefined,   // Base64 data URLs (too large for DB)
  imageUrl: undefined,            // Temporary blob URLs
  splitItems: undefined,          // Computed from input
  selectedPrompt: undefined,      // Computed from array
};
```

## Node Interaction Patterns

### Node Click Selection with Z-Index

Bring clicked nodes to the front:

```tsx
const onNodeClick = useCallback((_: React.MouseEvent, node: PipelineNode) => {
  setSelectedNode(node);
  setInspectorOpen(true);
  setNodes((nds) => {
    const maxZIndex = Math.max(0, ...nds.map((n) => n.zIndex ?? 0));
    return nds.map((n) =>
      n.id === node.id ? { ...n, zIndex: maxZIndex + 1 } : n
    );
  });
}, [setNodes]);
```

### Node Duplication

```tsx
const handleDuplicateNode = useCallback(() => {
  if (!selectedNode) return;
  const newNodeId = `${selectedNode.type}-${Date.now()}`;

  setNodes((nds) => {
    const maxZIndex = Math.max(0, ...nds.map((n) => n.zIndex ?? 0));
    const duplicated: PipelineNode = {
      id: newNodeId,
      type: selectedNode.type,
      position: {
        x: selectedNode.position.x + 50,
        y: selectedNode.position.y + 50,
      },
      data: JSON.parse(JSON.stringify(selectedNode.data)),
      zIndex: maxZIndex + 1,
    };
    return [...nds, duplicated];
  });
}, [selectedNode, setNodes]);

// Keyboard shortcut: Cmd+D
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "d" && selectedNode) {
      e.preventDefault();
      handleDuplicateNode();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [selectedNode, handleDuplicateNode]);
```

### Node Update Pattern

Always update nodes immutably through `setNodes`:

```tsx
const handleUpdateNode = (nodeId: string, data: Partial<PipelineNodeData>) => {
  setNodes((nds) =>
    nds.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    )
  );
};
```

### Stop Propagation on Interactive Elements

Any clickable element inside a node (buttons, selects, inputs) MUST call `e.stopPropagation()` to prevent the click from triggering node selection or dragging:

```tsx
<button onClick={(e) => { e.stopPropagation(); handleRun(); }}>
  Run
</button>

<select onChange={handleChange} onClick={(e) => e.stopPropagation()}>
  <option>1:1</option>
</select>
```

## Multi-Select and Selection Box

Enable spacebar-to-pan with drag-to-select:

```tsx
const [isSpacePressed, setIsSpacePressed] = useState(false);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && !e.repeat) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
      setIsSpacePressed(true);
    }
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") setIsSpacePressed(false);
  };
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, []);

<ReactFlow
  selectionOnDrag={!isSpacePressed}
  panOnDrag={isSpacePressed ? [0, 1, 2] : [1, 2]}
  selectionMode={SelectionMode.Partial}
  multiSelectionKeyCode={null}
  selectionKeyCode={null}
  className={isSpacePressed ? "cursor-grab" : "cursor-crosshair"}
/>
```

## Human-in-the-Loop Pipeline Pausing

Pause pipeline execution at a review checkpoint, then resume:

```tsx
const [waitingForHumanReview, setWaitingForHumanReview] = useState<string | null>(null);
const [pendingLevels, setPendingLevels] = useState<PipelineNode[][]>([]);

// Inside the execution loop:
for (let i = 0; i < levels.length; i++) {
  const level = levels[i];

  const humanReviewNode = level.find((n) => n.type === "humanReview");
  if (humanReviewNode) {
    // Update node with upstream data for display
    setNodes((nds) =>
      nds.map((n) =>
        n.id === humanReviewNode.id
          ? { ...n, data: { ...n.data, status: "pending_review" } }
          : n
      )
    );

    // Store remaining levels for later
    setPendingLevels(levels.slice(i + 1));
    setWaitingForHumanReview(humanReviewNode.id);
    return; // Exit and wait for user action
  }

  // ... normal execution continues
}
```

## Edge Format Reference

Edge objects connecting nodes through specific handles:

```tsx
// Edge targeting a dynamic handle (MUST use full handle ID)
{
  id: "edge-1",
  source: "textInput-1",
  sourceHandle: "text",        // Static handle: no prefix needed
  target: "generator-1",
  targetHandle: "generator-1-images-0",  // Dynamic handle: MUST include nodeId prefix
}

// Edge to static handle (no prefix needed on target)
{
  id: "edge-2",
  source: "prompt-1",
  sourceHandle: "prompt",
  target: "generator-1",
  targetHandle: "prompt",      // Static handle
}
```

## Pipeline Preset Structure

Database schema for saving/loading complete pipelines:

```tsx
export interface PipelinePreset {
  id: string;
  name: string;
  description?: string;
  category?: string;
  nodes: PipelineNode[];    // Serialized node array
  edges: PipelineEdge[];    // Serialized edge array
  isDefault: boolean;
  agentEnabled?: boolean;
  apiKey?: string | null;   // For webhook-triggered execution
  createdAt: string;
  updatedAt: string;
}
```

## Common Pitfalls

1. **Defining nodeTypes inline**: Creates a new object every render, causing all nodes to unmount/remount. Define outside the component or memoize with `useMemo`.

2. **Missing `useUpdateNodeInternals`**: When handle count changes dynamically, React Flow does not know to re-measure. Always call `updateNodeInternals(id)` in a `useEffect` watching handle count.

3. **Handle ID collisions**: Two nodes of the same type with handle `id="images-0"` will cause broken connections. Always prefix with node ID: `id={nodeId}-images-{index}`.

4. **Forgetting `e.stopPropagation()`**: Any interactive element (button, select, input) inside a node MUST stop propagation or clicks will be swallowed by the node selection handler.

5. **Mutating node data directly**: Never do `node.data.status = "running"`. Always use the functional form of `setNodes` with spread operators for immutable updates.

6. **Saving base64 to database**: Generated image data URLs can be megabytes. Strip `generatedImageUrl` before saving; persist only storage paths (`generatedImagePath`).

7. **Non-executable node sync parity**: If a node computes output from inputs without an API call (prompt combiner, array splitter, selector), its sync logic must exist in BOTH the browser (`useNodeSync` hook) AND the worker (shared `syncNonExecutableNodes` function). Otherwise webhook-triggered executions will produce different results.

8. **Multi-handle edge deduplication in topological sort**: Two edges between the same source/target pair (via different handles) should count as ONE dependency. Without deduplication, nodes may execute at wrong levels.

9. **Race conditions during execution**: After `setNodes`, the new state is not immediately available. Use the pattern `setNodes((nds) => { currentNodes = nds; return nds; })` followed by `await new Promise(resolve => setTimeout(resolve, 0))` to read the latest state.

10. **ReactFlowProvider placement**: `useReactFlow()` fails if called outside `ReactFlowProvider`. Always ensure the provider wraps the component hierarchy, not just the `<ReactFlow>` element.
