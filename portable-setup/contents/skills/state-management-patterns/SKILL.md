---
name: state-management-patterns
description: Decide where state belongs and implement it cleanly with Zustand, Context, or URL state. Use when choosing between local vs global state, sharing state across components, or optimizing unnecessary re-renders.
---

# State Management Patterns

Choose the right state management approach for each situation and implement it cleanly.

## When to Use This Skill

Use when:
- Deciding where to put state
- Setting up global state management
- Sharing state between components
- Syncing state with URL
- Optimizing re-renders

## State Categories

| Type | Where | Examples | Solution |
|------|-------|----------|----------|
| **UI State** | Local | Open/closed, hover, focus | useState |
| **Form State** | Local | Input values, validation | React Hook Form |
| **Server State** | Cache | API data | TanStack Query |
| **URL State** | Browser | Filters, pagination, tabs | URL params |
| **Global UI** | App | Theme, sidebar, modals | Zustand/Context |
| **Auth State** | App | User, session | Context + cookies |

## Local State (useState)

### When to Use
- State used by single component
- UI toggles (open/closed, show/hide)
- Form inputs (prefer React Hook Form for forms)
- Temporary/ephemeral state

```typescript
// ✅ Good - truly local state
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  // Only this component cares about open/closed
}

function SearchInput() {
  const [query, setQuery] = useState('');
  // Debounce and lift only the final value
}
```

### Derived State
```typescript
// ❌ Bad - redundant state
function FilteredList({ items }) {
  const [filteredItems, setFilteredItems] = useState(items);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setFilteredItems(items.filter(item => item.name.includes(filter)));
  }, [items, filter]);
}

// ✅ Good - derive during render
function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  );
}
```

## URL State

### When to Use
- Filters, search, pagination
- Tabs, accordion state
- Anything shareable/bookmarkable
- Back button should work

### With Next.js App Router
```typescript
// app/products/page.tsx
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read from URL
  const category = searchParams.get('category') ?? 'all';
  const sort = searchParams.get('sort') ?? 'newest';
  const page = parseInt(searchParams.get('page') ?? '1');

  // Update URL
  const setFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <select
        value={category}
        onChange={(e) => setFilters({ category: e.target.value, page: '1' })}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <ProductGrid category={category} sort={sort} page={page} />

      <Pagination
        page={page}
        onPageChange={(p) => setFilters({ page: p.toString() })}
      />
    </div>
  );
}
```

### useQueryState Hook
```typescript
// hooks/use-query-state.ts
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryState<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = (searchParams.get(key) as T) ?? defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(searchParams);
      if (newValue === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname, key, defaultValue]
  );

  return [value, setValue];
}

// Usage
function ProductFilters() {
  const [category, setCategory] = useQueryState('category', 'all');
  const [sort, setSort] = useQueryState('sort', 'newest');

  return (/* ... */);
}
```

## Zustand (Global State)

### When to Use
- Global UI state (theme, sidebar, modals)
- State shared across many components
- State that persists across navigation
- When Context causes too many re-renders

### Installation
```bash
npm install zustand
```

### Basic Store
```typescript
// stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));

// Usage - only re-renders when selected state changes
function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  if (!sidebarOpen) return null;
  return <aside>...</aside>;
}

// Select multiple values
function Header() {
  const { theme, setTheme, toggleSidebar } = useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggleSidebar: state.toggleSidebar,
  }));
}
```

### Store with Actions
```typescript
// stores/cart-store.ts
import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter((i) => i.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),

  // Computed values using get()
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
```

### Persisted Store
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      // ... actions
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
```

### Store Slices (Large Stores)
```typescript
// stores/slices/user-slice.ts
export interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const createUserSlice = (set: any): UserSlice => ({
  user: null,
  setUser: (user) => set({ user }),
});

// stores/slices/settings-slice.ts
export interface SettingsSlice {
  theme: 'light' | 'dark';
  language: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

export const createSettingsSlice = (set: any): SettingsSlice => ({
  theme: 'light',
  language: 'en',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
});

// stores/app-store.ts
import { create } from 'zustand';
import { createUserSlice, UserSlice } from './slices/user-slice';
import { createSettingsSlice, SettingsSlice } from './slices/settings-slice';

type AppStore = UserSlice & SettingsSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createUserSlice(...a),
  ...createSettingsSlice(...a),
}));
```

## React Context

### When to Use
- Dependency injection (theme, i18n, auth)
- Data that changes infrequently
- When Zustand is overkill

### Optimized Context Pattern
```typescript
// context/auth-context.tsx
import { createContext, useContext, useCallback, useMemo } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const user = await response.json();
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  // Memoize to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Split Context for Performance
```typescript
// Split state and actions to prevent unnecessary re-renders
const UserStateContext = createContext<User | null>(null);
const UserActionsContext = createContext<UserActions | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Actions don't change, so components using only actions won't re-render
  const actions = useMemo(
    () => ({
      login: async (credentials: Credentials) => {
        const user = await loginApi(credentials);
        setUser(user);
      },
      logout: async () => {
        await logoutApi();
        setUser(null);
      },
    }),
    []
  );

  return (
    <UserStateContext.Provider value={user}>
      <UserActionsContext.Provider value={actions}>
        {children}
      </UserActionsContext.Provider>
    </UserStateContext.Provider>
  );
}

// Component only using actions won't re-render when user changes
function LogoutButton() {
  const { logout } = useUserActions();
  return <button onClick={logout}>Logout</button>;
}
```

## useReducer for Complex State

### When to Use
- State with multiple sub-values
- Next state depends on previous state
- Complex state transitions
- When you want predictable state updates

```typescript
// Complex form state
interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

type FormAction =
  | { type: 'SET_VALUE'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; errors: Record<string, string> }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }, // Clear error on change
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
        isValid: false,
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false };
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function useFormReducer(initialValues: Record<string, string>) {
  const [state, dispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  const setValue = (field: string, value: string) =>
    dispatch({ type: 'SET_VALUE', field, value });

  const setTouched = (field: string) =>
    dispatch({ type: 'SET_TOUCHED', field });

  return { state, setValue, setTouched, dispatch };
}
```

## Combining Approaches

### Real-World Example
```typescript
// A product list page using multiple state types

function ProductsPage() {
  // URL state - shareable filters
  const [category, setCategory] = useQueryState('category', 'all');
  const [sort, setSort] = useQueryState('sort', 'newest');
  const [page, setPage] = useQueryState('page', '1');

  // Server state - cached API data
  const { data, isLoading } = useProducts({ category, sort, page: parseInt(page) });

  // Global state - cart
  const addToCart = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) => state.totalItems());

  // Local state - UI only
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div>
      <header>
        <CartIcon count={cartCount} />
      </header>

      <Filters
        category={category}
        sort={sort}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid
          products={data.products}
          onProductClick={setSelectedProduct}
          onAddToCart={addToCart}
        />
      )}

      <Pagination
        page={parseInt(page)}
        totalPages={data.totalPages}
        onPageChange={(p) => setPage(p.toString())}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
```

## Decision Tree

```
Where should this state live?

Is it server data (from API)?
├─ Yes → TanStack Query / SWR
└─ No ↓

Should it be shareable via URL?
├─ Yes → URL search params
└─ No ↓

Is it used by many components across the app?
├─ Yes → Zustand
└─ No ↓

Is it used by a subtree of components?
├─ Yes → Context (if rarely changes) or Zustand
└─ No ↓

Is it complex with many transitions?
├─ Yes → useReducer
└─ No → useState
```

## Anti-Patterns to Avoid

```typescript
// ❌ Duplicating server state
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);
// Use TanStack Query instead

// ❌ Prop drilling through many levels
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>
// Use Context or Zustand instead

// ❌ Everything in global state
const useStore = create((set) => ({
  isDropdownOpen: false,  // Should be local
  searchQuery: '',        // Should be URL state
  users: [],              // Should be server state
}));

// ❌ Unnecessary state
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
// Just derive it: const fullName = `${firstName} ${lastName}`;
```

## Zustand v5 Patterns

### Combined Middleware (DevTools + Persist + Immer)
```typescript
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {} from '@redux-devtools/extension' // Required for devtools typing

interface AppState {
  user: { name: string; email: string } | null
  theme: 'light' | 'dark'
  notifications: { id: string; message: string }[]
  setUser: (user: AppState['user']) => void
  setTheme: (theme: AppState['theme']) => void
  addNotification: (message: string) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        theme: 'light',
        notifications: [],
        setUser: (user) => set({ user }),
        setTheme: (theme) => set({ theme }),
        addNotification: (message) =>
          set((state) => {
            // Immer allows direct mutation
            state.notifications.push({
              id: crypto.randomUUID(),
              message,
            })
          }),
        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter((n) => n.id !== id)
          }),
      })),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ theme: state.theme }), // Only persist theme
      }
    ),
    { name: 'AppStore' }
  )
)
```

### Immer for Nested State Updates
```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// npm install immer

interface Todo {
  id: string
  title: string
  done: boolean
  subtasks: { id: string; title: string; done: boolean }[]
}

interface TodoState {
  todos: Record<string, Todo>
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  addSubtask: (todoId: string, title: string) => void
  toggleSubtask: (todoId: string, subtaskId: string) => void
}

export const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: {},
    addTodo: (title) =>
      set((state) => {
        const id = crypto.randomUUID()
        state.todos[id] = { id, title, done: false, subtasks: [] }
      }),
    toggleTodo: (id) =>
      set((state) => {
        state.todos[id].done = !state.todos[id].done
      }),
    addSubtask: (todoId, title) =>
      set((state) => {
        state.todos[todoId].subtasks.push({
          id: crypto.randomUUID(),
          title,
          done: false,
        })
      }),
    toggleSubtask: (todoId, subtaskId) =>
      set((state) => {
        const subtask = state.todos[todoId].subtasks.find(
          (s) => s.id === subtaskId
        )
        if (subtask) subtask.done = !subtask.done
      }),
  }))
)
```

### DevTools with Action Names (Slices Pattern)
```typescript
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

// Slices with explicit action names for DevTools
const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () =>
    set(
      (state) => ({ bears: state.bears + 1 }),
      undefined,
      'bears/addBear' // Action name shown in DevTools
    ),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () =>
    set(
      (state) => ({ fishes: state.fishes + 1 }),
      undefined,
      'fish/addFish'
    ),
})

export const useJungleStore = create<JungleStore>()(
  devtools(
    (...args) => ({
      ...createBearSlice(...args),
      ...createFishSlice(...args),
    }),
    { name: 'JungleStore' }
  )
)
```

### Persist with Migration
```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
  version: number
  position: { x: number; y: number }
  preferences: { darkMode: boolean; fontSize: number }
  setPosition: (position: SettingsState['position']) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      version: 2,
      position: { x: 0, y: 0 },
      preferences: { darkMode: false, fontSize: 14 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'settings-storage',
      version: 2,
      migrate: (persisted: any, version: number) => {
        // Migrate from v0 (flat x/y) to v1 (nested position)
        if (version === 0) {
          persisted.position = { x: persisted.x ?? 0, y: persisted.y ?? 0 }
          delete persisted.x
          delete persisted.y
        }
        // Migrate from v1 to v2 (add preferences)
        if (version < 2) {
          persisted.preferences = { darkMode: false, fontSize: 14 }
        }
        return persisted as SettingsState
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### createWithEqualityFn for Custom Selectors
```typescript
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/vanilla/shallow'

// Use when default Object.is comparison causes unnecessary re-renders
interface DataState {
  items: { id: string; value: number }[]
  selectedIds: string[]
  setItems: (items: DataState['items']) => void
  toggleSelection: (id: string) => void
}

export const useDataStore = createWithEqualityFn<DataState>()(
  (set) => ({
    items: [],
    selectedIds: [],
    setItems: (items) => set({ items }),
    toggleSelection: (id) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id],
      })),
  }),
  shallow // Use shallow comparison for all selectors
)

// Usage with custom selector equality
function ItemList() {
  // Only re-renders when items array contents change (shallow comparison)
  const items = useDataStore((state) => state.items)
  const selectedIds = useDataStore((state) => state.selectedIds)
  // ...
}
```

### Async Actions Pattern
```typescript
import { create } from 'zustand'

interface ApiState {
  data: User[] | null
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  createUser: (user: CreateUserInput) => Promise<User>
}

export const useApiStore = create<ApiState>((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createUser: async (user) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      if (!response.ok) throw new Error('Failed to create')
      const newUser = await response.json()

      // Optimistically update the list
      set((state) => ({
        data: state.data ? [...state.data, newUser] : [newUser],
        loading: false,
      }))
      return newUser
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },
}))
```

### Subscribe with Selector (External Subscriptions)
```typescript
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface CounterState {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterState>()(
  subscribeWithSelector((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
)

// Subscribe to specific state changes outside React
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count, // Selector
  (count, previousCount) => {
    console.log(`Count changed from ${previousCount} to ${count}`)
    // Trigger side effects, analytics, etc.
  },
  {
    fireImmediately: true, // Call immediately with current value
    equalityFn: (a, b) => a === b, // Custom equality
  }
)

// Cleanup when done
// unsubscribe()
```
