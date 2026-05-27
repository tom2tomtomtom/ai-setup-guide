---
name: n8n-workflow-patterns
description: Create n8n workflow JSON with webhook triggers, HTTP/API nodes, conditional branching, data transformation expressions, error handling, and AI agent nodes (OpenAI, LangChain); use when building or modifying n8n automations
---

# n8n Workflow Patterns

Comprehensive guide for creating n8n automation workflows, covering workflow JSON structure, node types, connections, expressions, data transformation, AI integrations, and best practices.

## When to Use This Skill

Use when:
- Creating new n8n workflows from scratch
- Building automation workflows with triggers, HTTP requests, and data processing
- Integrating AI/LangChain nodes into workflows
- Writing Code nodes for data transformation
- Connecting multiple services and APIs
- Implementing webhook-based automations
- Creating scheduled/cron-based workflows
- Processing and transforming data between nodes

## Workflow JSON Structure

### Complete Workflow Template

Every n8n workflow follows this JSON structure:

```json
{
  "name": "My Workflow",
  "nodes": [
    {
      "parameters": {},
      "id": "unique-node-id",
      "name": "Node Display Name",
      "type": "n8n-nodes-base.nodeType",
      "typeVersion": 1,
      "position": [250, 300],
      "credentials": {
        "credentialType": {
          "id": "credential-id",
          "name": "Credential Name"
        }
      }
    }
  ],
  "connections": {
    "Source Node Name": {
      "main": [
        [
          {
            "node": "Target Node Name",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true
  }
}
```

### Node Structure

Each node contains:

```json
{
  "parameters": {
    // Node-specific configuration
  },
  "id": "uuid-format-id",
  "name": "Unique Node Name",
  "type": "n8n-nodes-base.nodeType",
  "typeVersion": 1,
  "position": [x, y],
  "credentials": {
    // Optional: credentials if node requires authentication
  }
}
```

### Connection Structure

Connections define data flow between nodes:

```json
{
  "connections": {
    "Node A": {
      "main": [
        [
          { "node": "Node B", "type": "main", "index": 0 }
        ]
      ]
    },
    "Node B": {
      "main": [
        [
          { "node": "Node C", "type": "main", "index": 0 },
          { "node": "Node D", "type": "main", "index": 0 }
        ]
      ]
    }
  }
}
```

For nodes with multiple outputs (like IF node):

```json
{
  "IF Node": {
    "main": [
      [{ "node": "True Branch", "type": "main", "index": 0 }],
      [{ "node": "False Branch", "type": "main", "index": 0 }]
    ]
  }
}
```

## Trigger Nodes

### Manual Trigger

```json
{
  "parameters": {},
  "id": "manual-trigger-id",
  "name": "When clicking 'Execute Workflow'",
  "type": "n8n-nodes-base.manualTrigger",
  "typeVersion": 1,
  "position": [250, 300]
}
```

### Webhook Trigger

```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "my-webhook-path",
    "responseMode": "onReceived",
    "responseData": "firstEntryJson",
    "options": {
      "rawBody": false,
      "responseHeaders": {
        "entries": [
          { "name": "Content-Type", "value": "application/json" }
        ]
      }
    }
  },
  "id": "webhook-id",
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [250, 300],
  "webhookId": "unique-webhook-id"
}
```

### Schedule Trigger (Cron)

```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 9 * * *"
        }
      ]
    }
  },
  "id": "schedule-id",
  "name": "Schedule Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1,
  "position": [250, 300]
}
```

Common cron expressions:
- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour
- `0 9 * * *` - Daily at 9am
- `0 8 * * 1` - Monday at 8am
- `0 0 1 * *` - First day of month

## HTTP Request Node

### Basic GET Request

```json
{
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "options": {}
  },
  "id": "http-get-id",
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "position": [450, 300]
}
```

### POST Request with Body

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/users",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "name", "value": "={{ $json.name }}" },
        { "name": "email", "value": "={{ $json.email }}" }
      ]
    },
    "options": {}
  },
  "id": "http-post-id",
  "name": "Create User",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "position": [450, 300]
}
```

### With Authentication

```json
{
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "options": {}
  },
  "id": "http-auth-id",
  "name": "Authenticated Request",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.1,
  "position": [450, 300],
  "credentials": {
    "httpHeaderAuth": {
      "id": "credential-id",
      "name": "API Key"
    }
  }
}
```

## Code Node

### JavaScript Code Node

```json
{
  "parameters": {
    "jsCode": "const items = $input.all();\nconst newItems = items.map(item => {\n  return {\n    json: {\n      name: item.json.name,\n      processed: true,\n      timestamp: new Date().toISOString()\n    }\n  };\n});\nreturn newItems;"
  },
  "id": "code-id",
  "name": "Process Data",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [650, 300]
}
```

### Code Node Patterns

**Access all input items:**
```javascript
const items = $input.all();
```

**Access first item:**
```javascript
const firstItem = $input.first();
```

**Access data from specific node:**
```javascript
const nodeData = $('Node Name').all();
const firstFromNode = $('Node Name').first();
```

**Return properly formatted data:**
```javascript
return items.map(item => ({
  json: {
    // Your transformed data
    field1: item.json.originalField,
    field2: 'new value'
  }
}));
```

**Aggregate data:**
```javascript
const items = $input.all();
const total = items.reduce((sum, item) => sum + item.json.amount, 0);
return [{ json: { total, count: items.length } }];
```

**Split array into items:**
```javascript
const items = $input.first();
return items.json.data.map(item => ({
  json: item
}));
```

## Conditional Logic (IF Node)

```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "condition-id",
          "leftValue": "={{ $json.status }}",
          "rightValue": "active",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  },
  "id": "if-id",
  "name": "IF",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2,
  "position": [650, 300]
}
```

### Condition Operators

String operations:
- `equals`, `notEquals`
- `contains`, `notContains`
- `startsWith`, `endsWith`
- `regex`

Number operations:
- `equals`, `notEquals`
- `gt` (greater than), `gte` (greater or equal)
- `lt` (less than), `lte` (less or equal)

Boolean operations:
- `true`, `false`

## Edit Fields (Set Node)

```json
{
  "parameters": {
    "mode": "manual",
    "duplicateItem": false,
    "assignments": {
      "assignments": [
        {
          "id": "assign-1",
          "name": "newField",
          "value": "={{ $json.existingField }}",
          "type": "string"
        },
        {
          "id": "assign-2",
          "name": "computed",
          "value": "={{ $json.price * $json.quantity }}",
          "type": "number"
        }
      ]
    },
    "options": {}
  },
  "id": "set-id",
  "name": "Edit Fields",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.3,
  "position": [650, 300]
}
```

## Loop Over Items (Split In Batches)

```json
{
  "parameters": {
    "batchSize": 10,
    "options": {}
  },
  "id": "loop-id",
  "name": "Loop Over Items",
  "type": "n8n-nodes-base.splitInBatches",
  "typeVersion": 3,
  "position": [450, 300]
}
```

Loop connection pattern:
```json
{
  "Loop Over Items": {
    "main": [
      null,
      [{ "node": "Process Item", "type": "main", "index": 0 }]
    ]
  },
  "Process Item": {
    "main": [
      [{ "node": "Loop Over Items", "type": "main", "index": 0 }]
    ]
  }
}
```

## Merge Node

```json
{
  "parameters": {
    "mode": "combine",
    "mergeByFields": {
      "values": [
        {
          "field1": "id",
          "field2": "userId"
        }
      ]
    },
    "options": {}
  },
  "id": "merge-id",
  "name": "Merge",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 2.1,
  "position": [850, 300]
}
```

Merge modes:
- `append` - Combine all items from both inputs
- `combine` - Match items by field value
- `chooseBranch` - Select which input to use

## Expressions

### Basic Expressions

```javascript
// Access current item's JSON data
{{ $json.fieldName }}

// Access nested data
{{ $json.user.email }}

// Access array item
{{ $json.items[0].name }}

// String concatenation
{{ "Hello " + $json.name }}

// Conditional expression
{{ $json.status === 'active' ? 'Yes' : 'No' }}
```

### Reference Other Nodes

```javascript
// Get data from specific node
{{ $('Node Name').item.json.field }}

// Get all items from node
{{ $('Node Name').all() }}

// Get first item
{{ $('Node Name').first().json.field }}

// Get item at index
{{ $('Node Name').itemMatching(0).json.field }}
```

### Data Transformation Functions

```javascript
// String functions
{{ $json.name.toUpperCase() }}
{{ $json.email.toLowerCase() }}
{{ $json.text.trim() }}
{{ $json.description.slice(0, 100) }}

// Array functions
{{ $json.tags.join(', ') }}
{{ $json.items.length }}
{{ $json.numbers.includes(5) }}

// Date functions
{{ $now.toISO() }}
{{ $today.format('YYYY-MM-DD') }}

// Check if value exists
{{ $json.optionalField ?? 'default value' }}

// Type conversion
{{ Number($json.stringNumber) }}
{{ String($json.numberValue) }}
```

## AI/LangChain Nodes

### AI Agent Node

```json
{
  "parameters": {
    "options": {
      "systemMessage": "You are a helpful assistant that processes customer inquiries."
    }
  },
  "id": "agent-id",
  "name": "AI Agent",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1,
  "position": [650, 300]
}
```

### OpenAI Chat Model

```json
{
  "parameters": {
    "model": "gpt-4o",
    "options": {
      "temperature": 0.7,
      "maxTokens": 1000
    }
  },
  "id": "openai-id",
  "name": "OpenAI Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
  "typeVersion": 1,
  "position": [450, 450],
  "credentials": {
    "openAiApi": {
      "id": "openai-cred-id",
      "name": "OpenAI API"
    }
  }
}
```

### Using $fromAI() Function

The `$fromAI()` function allows AI to populate field values:

```javascript
// Basic usage - AI infers from key name
{{ $fromAI('email') }}

// With description for better context
{{ $fromAI('customerName', 'The full name of the customer') }}

// With type specification
{{ $fromAI('itemCount', 'Number of items ordered', 'number', 1) }}

// Parameters: key, description, type, defaultValue
```

## Complete Workflow Examples

### Webhook to HTTP Request Workflow

```json
{
  "name": "Process Webhook Data",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "process-data",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "webhook-uuid"
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nreturn items.map(item => ({\n  json: {\n    ...item.json.body,\n    receivedAt: new Date().toISOString()\n  }\n}));"
      },
      "id": "code-1",
      "name": "Process Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [450, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.example.com/store",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify($json) }}",
        "options": {}
      },
      "id": "http-1",
      "name": "Store Data",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { success: true, id: $json.id } }}"
      },
      "id": "respond-1",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [850, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Process Data", "type": "main", "index": 0 }]]
    },
    "Process Data": {
      "main": [[{ "node": "Store Data", "type": "main", "index": 0 }]]
    },
    "Store Data": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
}
```

### Scheduled Data Sync with Conditional Processing

```json
{
  "name": "Daily Data Sync",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{ "field": "cronExpression", "expression": "0 6 * * *" }]
        }
      },
      "id": "schedule-1",
      "name": "Daily 6am",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com/items?status=pending",
        "options": {}
      },
      "id": "http-1",
      "name": "Fetch Pending Items",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "conditions": {
          "conditions": [{
            "id": "cond-1",
            "leftValue": "={{ $json.items.length }}",
            "rightValue": "0",
            "operator": { "type": "number", "operation": "gt" }
          }],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "if-1",
      "name": "Has Items?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [650, 300]
    },
    {
      "parameters": {
        "jsCode": "return $input.first().json.items.map(item => ({ json: item }));"
      },
      "id": "code-1",
      "name": "Split Items",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [850, 200]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.example.com/process/{{ $json.id }}",
        "options": {}
      },
      "id": "http-2",
      "name": "Process Item",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1050, 200]
    }
  ],
  "connections": {
    "Daily 6am": {
      "main": [[{ "node": "Fetch Pending Items", "type": "main", "index": 0 }]]
    },
    "Fetch Pending Items": {
      "main": [[{ "node": "Has Items?", "type": "main", "index": 0 }]]
    },
    "Has Items?": {
      "main": [
        [{ "node": "Split Items", "type": "main", "index": 0 }],
        []
      ]
    },
    "Split Items": {
      "main": [[{ "node": "Process Item", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
}
```

## Error Handling

### Error Trigger Node

```json
{
  "parameters": {},
  "id": "error-trigger-id",
  "name": "Error Trigger",
  "type": "n8n-nodes-base.errorTrigger",
  "typeVersion": 1,
  "position": [250, 500]
}
```

Error data structure received:
```json
{
  "execution": {
    "id": "execution-id",
    "url": "https://n8n.example.com/execution/123",
    "error": {
      "message": "Error message",
      "stack": "Stack trace"
    },
    "lastNodeExecuted": "Node Name",
    "mode": "manual"
  },
  "workflow": {
    "id": "workflow-id",
    "name": "Workflow Name"
  }
}
```

### Continue on Fail Pattern

Handle errors gracefully in Code nodes:
```javascript
try {
  // Your logic
  const result = await someOperation();
  return [{ json: { success: true, data: result } }];
} catch (error) {
  return [{ json: { success: false, error: error.message } }];
}
```

## Best Practices

### Do's

- **Use descriptive node names** - Name nodes by their function (e.g., "Fetch User Data", "Send Notification")
- **Position nodes logically** - Left to right flow, group related nodes
- **Use expressions for dynamic values** - `{{ $json.field }}` instead of hardcoded values
- **Validate input data** - Add IF nodes to check data before processing
- **Handle errors** - Use error workflows for critical processes
- **Add sticky notes** - Document complex logic in the workflow
- **Test incrementally** - Test each node before connecting to the next
- **Use environment variables** - Store secrets in credentials, not in node parameters

### Don'ts

- **Don't hardcode sensitive data** - Use credentials for API keys, passwords
- **Don't create infinite loops** - Ensure loop conditions will eventually end
- **Don't ignore error states** - Handle both success and failure paths
- **Don't overload single Code nodes** - Split complex logic into multiple nodes
- **Don't forget about data types** - Ensure expressions return expected types

### Performance Tips

- **Batch operations** - Use Loop Over Items with appropriate batch sizes
- **Minimize HTTP calls** - Batch requests when APIs support it
- **Filter early** - Remove unnecessary data as soon as possible
- **Use pagination** - Don't fetch entire datasets at once
- **Cache where possible** - Store frequently accessed data

## Node Type Reference

| Node Type | Package |
|-----------|---------|
| Manual Trigger | `n8n-nodes-base.manualTrigger` |
| Webhook | `n8n-nodes-base.webhook` |
| Schedule Trigger | `n8n-nodes-base.scheduleTrigger` |
| HTTP Request | `n8n-nodes-base.httpRequest` |
| Code | `n8n-nodes-base.code` |
| IF | `n8n-nodes-base.if` |
| Switch | `n8n-nodes-base.switch` |
| Set/Edit Fields | `n8n-nodes-base.set` |
| Merge | `n8n-nodes-base.merge` |
| Split In Batches | `n8n-nodes-base.splitInBatches` |
| Wait | `n8n-nodes-base.wait` |
| Respond to Webhook | `n8n-nodes-base.respondToWebhook` |
| Error Trigger | `n8n-nodes-base.errorTrigger` |
| AI Agent | `@n8n/n8n-nodes-langchain.agent` |
| OpenAI Chat | `@n8n/n8n-nodes-langchain.lmChatOpenAi` |

## Data Structure

n8n passes data between nodes as arrays of items:

```json
[
  {
    "json": {
      "field1": "value1",
      "field2": 123
    },
    "binary": {
      "data": {
        "data": "base64-encoded-data",
        "mimeType": "image/png",
        "fileName": "image.png"
      }
    }
  }
]
```

- `json` - Required: Contains the main data
- `binary` - Optional: Contains binary data (files, images)
