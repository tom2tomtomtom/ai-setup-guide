---
name: typescript-advanced-patterns
description: Advanced TypeScript patterns including generics, utility types, type guards, and discriminated unions. Use when writing generic reusable functions, creating custom utility types, or implementing type-safe API responses and event systems.
---

# TypeScript Advanced Patterns

Master TypeScript's type system to catch bugs before runtime, improve autocomplete, and write self-documenting code.

## When to Use This Skill

Use when:
- Writing reusable functions or components that work with multiple types
- Creating type-safe APIs and data structures
- Narrowing types to handle different cases safely
- Building utility functions that transform data
- Typing complex objects like API responses
- Creating type-safe event handlers and callbacks

## Generics

### Basic Generics
```typescript
// Generic function - works with any type
function identity<T>(value: T): T {
  return value;
}

// Generic with constraint
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// Multiple generics
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

// Generic with default
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}
```

### Generic Components (React)
```typescript
// Generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage - T is inferred
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### Generic Constraints
```typescript
// Constrain to objects with specific properties
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Constrain to constructors
function createInstance<T>(ctor: new () => T): T {
  return new ctor();
}

// Constrain to functions
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
```

## Utility Types

### Built-in Utility Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Partial - all properties optional
type UserUpdate = Partial<User>;
// { id?: string; name?: string; ... }

// Required - all properties required
type RequiredUser = Required<UserUpdate>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string; }

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; ... }

// Readonly - immutable properties
type ImmutableUser = Readonly<User>;

// Record - typed object/dictionary
type RolePermissions = Record<User['role'], string[]>;
// { admin: string[]; user: string[]; }

// Extract - extract from union
type AdminRole = Extract<User['role'], 'admin'>;
// 'admin'

// Exclude - exclude from union
type NonAdminRole = Exclude<User['role'], 'admin'>;
// 'user'

// NonNullable - remove null/undefined
type Name = NonNullable<string | null | undefined>;
// string

// ReturnType - extract function return type
function getUser() { return { id: '1', name: 'John' }; }
type UserReturn = ReturnType<typeof getUser>;
// { id: string; name: string; }

// Parameters - extract function parameters
type GetUserParams = Parameters<typeof getUser>;
// []

// Awaited - unwrap Promise type
type ResolvedUser = Awaited<Promise<User>>;
// User
```

### Custom Utility Types
```typescript
// Deep Partial - recursive partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep Readonly - recursive readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Nullable - add null to type
type Nullable<T> = T | null;

// ValueOf - get union of object values
type ValueOf<T> = T[keyof T];

// Mutable - remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// RequireAtLeastOne - require at least one property
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// RequireOnlyOne - require exactly one property
type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
```

## Type Guards

### typeof Guards
```typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    // value is string here
    return value.toUpperCase();
  }
  // value is number here
  return value.toFixed(2);
}
```

### instanceof Guards
```typescript
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function handleError(error: Error) {
  if (error instanceof ApiError) {
    // error is ApiError here
    console.log(`Status: ${error.statusCode}`);
  }
}
```

### in Operator Guards
```typescript
interface Dog { bark(): void; }
interface Cat { meow(): void; }

function speak(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

### Custom Type Guards
```typescript
// Type predicate function
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}

// Usage
function processData(data: unknown) {
  if (isUser(data)) {
    // data is User here
    console.log(data.name);
  }
}

// Assertion function
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Not a user');
  }
}
```

## Discriminated Unions

### Basic Pattern
```typescript
// Each type has a discriminant property
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: Error };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <Data data={state.data} />;
    case 'error':
      return <Error error={state.error} />;
  }
}
```

### API Response Pattern
```typescript
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// Usage - TypeScript narrows correctly
const result = await fetchUser('123');
if (result.ok) {
  console.log(result.data.name); // Safe access
} else {
  console.error(result.error);
}
```

### Action/Event Pattern
```typescript
type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }; // payload is User
    case 'SET_LOADING':
      return { ...state, loading: action.payload }; // payload is boolean
    case 'SET_ERROR':
      return { ...state, error: action.payload }; // payload is string
    case 'RESET':
      return initialState; // no payload
  }
}
```

## Template Literal Types

```typescript
// Basic template literals
type Greeting = `Hello, ${string}`;
type EventName = `on${Capitalize<string>}`;

// Route patterns
type Route = `/${string}` | `/${string}/${string}`;

// CSS units
type CSSUnit = 'px' | 'em' | 'rem' | '%';
type CSSValue = `${number}${CSSUnit}`;

// Object key patterns
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// Event handlers
type EventHandlers<T extends string> = {
  [K in T as `on${Capitalize<K>}`]: (event: Event) => void;
};

type ButtonEvents = EventHandlers<'click' | 'focus' | 'blur'>;
// { onClick: ..., onFocus: ..., onBlur: ... }
```

## Conditional Types

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

// Infer keyword - extract types
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ArrayElement<T> = T extends (infer U)[] ? U : T;
type FunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never;

// Distributed conditional types
type NonNullableArray<T> = T extends null | undefined ? never : T;
type Result = NonNullableArray<string | null | undefined>; // string

// Complex inference
type PropType<T, Path extends string> =
  Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer Rest}`
      ? K extends keyof T
        ? PropType<T[K], Rest>
        : never
      : never;

// Usage
type UserName = PropType<User, 'name'>; // string
type DeepValue = PropType<{ a: { b: { c: number } } }, 'a.b.c'>; // number

// Constrained infer - restrict what can be inferred
type GetString<T> = T extends `${infer S extends string}` ? S : never;
type FirstIfString<T> = T extends [infer S extends string, ...unknown[]] ? S : never;
```

### Inferred Type Predicates (TS 5.5+)
```typescript
// TypeScript 5.5 automatically infers type predicates in filter callbacks
const nums = [1, 2, null, 3, undefined].filter(x => x !== null && x !== undefined);
// Type: number[] (previously was (number | null | undefined)[])

// Works with custom filter functions too
function getDefinedValues<T>(items: (T | undefined)[]): T[] {
  return items.filter(item => item !== undefined);
}

// Before TS 5.5, you needed explicit type predicate
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
const nums = [1, 2, undefined].filter(isDefined); // number[]
```

## Mapped Types

```typescript
// Basic mapped type
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// With key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Filter keys
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type StringProps = FilterByType<User, string>;
// { id: string; name: string; email: string; }

// Modify values
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>;
};

// Make specific keys optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserWithOptionalEmail = PartialBy<User, 'email'>;
```

## Best Practices

### 1. Prefer Type Inference
```typescript
// Let TypeScript infer when possible
const user = { name: 'John', age: 30 }; // Inferred
const numbers = [1, 2, 3]; // Inferred as number[]

// Only annotate when needed
const items: string[] = []; // Annotation needed for empty array
```

### 2. Use `unknown` over `any`
```typescript
// Bad - any bypasses type checking
function bad(data: any) {
  return data.foo.bar; // No error, but might crash
}

// Good - unknown requires type checking
function good(data: unknown) {
  if (isUser(data)) {
    return data.name; // Safe
  }
}
```

### 3. Use `as const` for Literal Types
```typescript
// Without as const - inferred as string[]
const statuses = ['pending', 'active', 'done'];

// With as const - inferred as readonly ['pending', 'active', 'done']
const statuses = ['pending', 'active', 'done'] as const;
type Status = typeof statuses[number]; // 'pending' | 'active' | 'done'

// Object literal
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;
```

### 4. Use Branded Types for Type Safety
```typescript
// Branded/Nominal types
type UserId = string & { readonly brand: unique symbol };
type PostId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = createUserId('user-123');
const postId = 'post-456' as PostId;

getUser(userId); // OK
getUser(postId); // Error! PostId is not assignable to UserId
```

### 5. Use `satisfies` for Type Validation Without Widening
```typescript
// satisfies validates type while preserving inference
interface ConfigSettings {
  compilerOptions?: { strict?: boolean; outDir?: string };
  extends?: string | string[];
}

// Without satisfies - type is ConfigSettings (loses specificity)
const config1: ConfigSettings = {
  extends: ["./base.json", "./strict.json"]
};
config1.extends.map(x => x); // Error: 'extends' might be string

// With satisfies - validates AND preserves literal type
const config2 = {
  compilerOptions: { strict: true, outDir: "../lib" },
  extends: ["./base.json", "./strict.json"]
} satisfies ConfigSettings;

config2.extends.map(x => x); // OK: extends is string[]
```

### 6. Use `const` Type Parameter for Literal Inference
```typescript
// Without const - arrays widen to mutable types
function getNames<T extends { names: readonly string[] }>(arg: T) {
  return arg.names;
}
const names1 = getNames({ names: ["Alice", "Bob"] });
// Type: string[]

// With const - arrays preserve literal types
function getNamesExact<const T extends { names: readonly string[] }>(arg: T) {
  return arg.names;
}
const names2 = getNamesExact({ names: ["Alice", "Bob"] });
// Type: readonly ["Alice", "Bob"]

// Useful for discriminated unions
function createAction<const T extends { type: string; payload?: unknown }>(action: T) {
  return action;
}
const action = createAction({ type: "SET_USER", payload: { id: 1 } });
// Type: { type: "SET_USER"; payload: { id: number } }
```

### 5. Exhaustive Checks
```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

type Status = 'pending' | 'active' | 'done';

function handleStatus(status: Status) {
  switch (status) {
    case 'pending': return 'Waiting...';
    case 'active': return 'In progress';
    case 'done': return 'Completed';
    default: return assertNever(status); // Compile error if case missed
  }
}
```

## Common Patterns

### API Type Safety
```typescript
// Define API endpoints with their types
interface ApiEndpoints {
  '/users': { GET: User[]; POST: { body: CreateUser; response: User } };
  '/users/:id': { GET: User; PUT: { body: UpdateUser; response: User }; DELETE: void };
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function api<
  Path extends keyof ApiEndpoints,
  Method extends keyof ApiEndpoints[Path]
>(
  path: Path,
  method: Method,
  ...args: Method extends 'GET' | 'DELETE'
    ? []
    : [body: ApiEndpoints[Path][Method] extends { body: infer B } ? B : never]
): Promise<
  ApiEndpoints[Path][Method] extends { response: infer R }
    ? R
    : ApiEndpoints[Path][Method]
> {
  // Implementation
}
```

### Form Types
```typescript
// Derive form types from schema
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

type FormValues<T extends FormFields<any>> = {
  [K in keyof T]: T[K]['value'];
};
```

### Event Emitter Types
```typescript
type EventMap = {
  'user:login': { userId: string };
  'user:logout': { userId: string; reason: string };
  'error': Error;
};

class TypedEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void {}
  emit<K extends keyof T>(event: K, payload: T[K]): void {}
}

const emitter = new TypedEmitter<EventMap>();
emitter.on('user:login', (payload) => {
  console.log(payload.userId); // Typed!
});
```
