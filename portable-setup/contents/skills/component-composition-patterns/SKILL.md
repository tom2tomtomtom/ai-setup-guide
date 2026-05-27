---
name: component-composition-patterns
description: React component patterns including compound components, render props, slots, and headless UI. Use when a component has too many props, building a design system with composable parts, or implementing headless/unstyled UI logic.
---

# Component Composition Patterns

Build flexible, reusable components that adapt to different use cases without prop explosion.

## When to Use This Skill

Use when:
- Building reusable component libraries
- Creating flexible UI components
- Avoiding prop drilling and "boolean soup"
- Implementing design system components
- Building headless UI patterns

## Compound Components

### The Problem
```typescript
// ❌ Prop explosion - hard to customize
<Select
  options={options}
  value={value}
  onChange={onChange}
  placeholder="Select..."
  label="Country"
  error="Required"
  helpText="Choose your country"
  showSearch={true}
  searchPlaceholder="Search countries..."
  emptyText="No results"
  loading={false}
  disabled={false}
  clearable={true}
  multiple={false}
  // ... 20 more props
/>
```

### The Solution: Compound Components
```typescript
// ✅ Flexible composition
<Select value={value} onValueChange={onChange}>
  <Select.Label>Country</Select.Label>
  <Select.Trigger placeholder="Select..." />
  <Select.Content>
    <Select.Search placeholder="Search countries..." />
    <Select.Empty>No results found</Select.Empty>
    {countries.map((country) => (
      <Select.Item key={country.code} value={country.code}>
        <Select.ItemIcon>{country.flag}</Select.ItemIcon>
        {country.name}
      </Select.Item>
    ))}
  </Select.Content>
  <Select.Error>Required field</Select.Error>
</Select>
```

### Implementation
```typescript
// components/Select/SelectContext.tsx
import { createContext, useContext } from 'react';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within <Select>');
  }
  return context;
}

// components/Select/Select.tsx
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function SelectRoot({ value, onValueChange, disabled = false, children }: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, disabled }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

// components/Select/SelectTrigger.tsx
function SelectTrigger({ placeholder }: { placeholder?: string }) {
  const { value, open, setOpen, disabled } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      disabled={disabled}
      aria-expanded={open}
      className="flex items-center justify-between w-full px-3 py-2 border rounded"
    >
      <span>{value || placeholder}</span>
      <ChevronDown className={open ? 'rotate-180' : ''} />
    </button>
  );
}

// components/Select/SelectContent.tsx
function SelectContent({ children }: { children: React.ReactNode }) {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-1 border rounded shadow-lg bg-white z-50">
      {children}
    </div>
  );
}

// components/Select/SelectItem.tsx
function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext();
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      {children}
    </button>
  );
}

// components/Select/index.tsx
export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Label: SelectLabel,
  Error: SelectError,
  Search: SelectSearch,
  Empty: SelectEmpty,
});
```

## Render Props

### Basic Pattern
```typescript
// Mouse position tracker
interface MouseTrackerProps {
  children: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <>{children(position)}</>;
}

// Usage
<MouseTracker>
  {({ x, y }) => (
    <div>
      Mouse position: {x}, {y}
    </div>
  )}
</MouseTracker>
```

### Data Fetching Render Prop
```typescript
interface FetchProps<T> {
  url: string;
  children: (state: {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function Fetch<T>({ url, children }: FetchProps<T>) {
  const [state, setState] = useState({
    data: null as T | null,
    loading: true,
    error: null as Error | null,
  });

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const response = await fetch(url);
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children({ ...state, refetch: fetchData })}</>;
}

// Usage
<Fetch<User[]> url="/api/users">
  {({ data, loading, error, refetch }) => {
    if (loading) return <Spinner />;
    if (error) return <Error onRetry={refetch} />;
    return <UserList users={data!} />;
  }}
</Fetch>
```

## Slots Pattern

### Named Slots
```typescript
interface CardProps {
  children: React.ReactNode;
}

interface CardSlots {
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
}

function CardRoot({ children }: CardProps) {
  return <div className="border rounded-lg shadow">{children}</div>;
}

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-4 py-3 border-b bg-gray-50 font-semibold">{children}</div>
);

const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-4 py-4">{children}</div>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-4 py-3 border-t bg-gray-50">{children}</div>
);

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
}) as React.FC<CardProps> & CardSlots;

// Usage
<Card>
  <Card.Header>User Profile</Card.Header>
  <Card.Body>
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
  </Card.Body>
  <Card.Footer>
    <Button>Edit</Button>
  </Card.Footer>
</Card>
```

### Extracting Slots from Children
```typescript
import { Children, isValidElement, ReactNode } from 'react';

function getSlots(children: ReactNode) {
  const slots: Record<string, ReactNode> = {};

  Children.forEach(children, (child) => {
    if (isValidElement(child) && typeof child.type !== 'string') {
      const displayName = (child.type as any).displayName || child.type.name;
      slots[displayName] = child;
    }
  });

  return slots;
}

// Dialog that extracts header, content, actions
function Dialog({ children }: { children: ReactNode }) {
  const slots = getSlots(children);

  return (
    <div className="dialog">
      {slots.DialogHeader && <div className="dialog-header">{slots.DialogHeader}</div>}
      {slots.DialogContent && <div className="dialog-content">{slots.DialogContent}</div>}
      {slots.DialogActions && <div className="dialog-actions">{slots.DialogActions}</div>}
    </div>
  );
}

Dialog.Header = function DialogHeader({ children }: { children: ReactNode }) {
  return <>{children}</>;
};
Dialog.Header.displayName = 'DialogHeader';

Dialog.Content = function DialogContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
};
Dialog.Content.displayName = 'DialogContent';

Dialog.Actions = function DialogActions({ children }: { children: ReactNode }) {
  return <>{children}</>;
};
Dialog.Actions.displayName = 'DialogActions';

// Usage - slots can be in any order
<Dialog>
  <Dialog.Actions>
    <Button>Cancel</Button>
    <Button>Confirm</Button>
  </Dialog.Actions>
  <Dialog.Header>Confirm Action</Dialog.Header>
  <Dialog.Content>Are you sure?</Dialog.Content>
</Dialog>
```

## Headless Components

### Headless Toggle
```typescript
interface UseToggleProps {
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

function useToggle({
  defaultPressed = false,
  pressed: controlledPressed,
  onPressedChange,
}: UseToggleProps = {}) {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);

  const isControlled = controlledPressed !== undefined;
  const pressed = isControlled ? controlledPressed : uncontrolledPressed;

  const toggle = useCallback(() => {
    if (isControlled) {
      onPressedChange?.(!pressed);
    } else {
      setUncontrolledPressed((p) => !p);
    }
  }, [isControlled, pressed, onPressedChange]);

  return {
    pressed,
    toggle,
    buttonProps: {
      'aria-pressed': pressed,
      onClick: toggle,
    },
  };
}

// Usage - you control the rendering
function FavoriteButton({ itemId }: { itemId: string }) {
  const { pressed, buttonProps } = useToggle();

  return (
    <button {...buttonProps} className="p-2">
      <Heart filled={pressed} />
    </button>
  );
}
```

### Headless Disclosure (Accordion/Collapsible)
```typescript
interface UseDisclosureProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function useDisclosure({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: UseDisclosureProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const contentId = useId();
  const triggerId = useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = useCallback(() => {
    const newValue = !open;
    if (!isControlled) {
      setUncontrolledOpen(newValue);
    }
    onOpenChange?.(newValue);
  }, [isControlled, open, onOpenChange]);

  return {
    open,
    toggle,
    triggerProps: {
      id: triggerId,
      'aria-expanded': open,
      'aria-controls': contentId,
      onClick: toggle,
    },
    contentProps: {
      id: contentId,
      role: 'region',
      'aria-labelledby': triggerId,
      hidden: !open,
    },
  };
}

// Usage
function FAQ({ question, answer }: { question: string; answer: string }) {
  const { open, triggerProps, contentProps } = useDisclosure();

  return (
    <div className="border-b">
      <button
        {...triggerProps}
        className="w-full py-4 text-left font-medium flex justify-between"
      >
        {question}
        <ChevronDown className={open ? 'rotate-180' : ''} />
      </button>
      <div {...contentProps} className="pb-4">
        {answer}
      </div>
    </div>
  );
}
```

### Headless Combobox
```typescript
interface UseComboboxProps<T> {
  items: T[];
  itemToString: (item: T | null) => string;
  onSelectedItemChange?: (item: T | null) => void;
  filterFn?: (items: T[], inputValue: string) => T[];
}

function useCombobox<T>({
  items,
  itemToString,
  onSelectedItemChange,
  filterFn = (items, input) =>
    items.filter((item) =>
      itemToString(item).toLowerCase().includes(input.toLowerCase())
    ),
}: UseComboboxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const filteredItems = useMemo(
    () => filterFn(items, inputValue),
    [items, inputValue, filterFn]
  );

  const selectItem = useCallback(
    (item: T) => {
      setSelectedItem(item);
      setInputValue(itemToString(item));
      setIsOpen(false);
      onSelectedItemChange?.(item);
    },
    [itemToString, onSelectedItemChange]
  );

  const inputProps = {
    value: inputValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(0);
    },
    onFocus: () => setIsOpen(true),
    onBlur: () => setTimeout(() => setIsOpen(false), 200),
    onKeyDown: (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[highlightedIndex]) {
            selectItem(filteredItems[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    'aria-expanded': isOpen,
    'aria-autocomplete': 'list' as const,
    role: 'combobox',
  };

  const getItemProps = (item: T, index: number) => ({
    onClick: () => selectItem(item),
    onMouseEnter: () => setHighlightedIndex(index),
    'aria-selected': index === highlightedIndex,
    role: 'option',
  });

  return {
    isOpen,
    inputValue,
    highlightedIndex,
    selectedItem,
    filteredItems,
    inputProps,
    getItemProps,
    listboxProps: {
      role: 'listbox',
    },
  };
}

// Usage
function CountryCombobox() {
  const {
    isOpen,
    filteredItems,
    highlightedIndex,
    inputProps,
    getItemProps,
    listboxProps,
  } = useCombobox({
    items: countries,
    itemToString: (country) => country?.name ?? '',
    onSelectedItemChange: (country) => console.log('Selected:', country),
  });

  return (
    <div className="relative">
      <input {...inputProps} className="w-full border rounded px-3 py-2" />
      {isOpen && filteredItems.length > 0 && (
        <ul {...listboxProps} className="absolute w-full border rounded shadow mt-1 bg-white">
          {filteredItems.map((country, index) => (
            <li
              key={country.code}
              {...getItemProps(country, index)}
              className={`px-3 py-2 cursor-pointer ${
                index === highlightedIndex ? 'bg-blue-100' : ''
              }`}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Polymorphic Components

### The "as" Prop Pattern
```typescript
import { ElementType, ComponentPropsWithoutRef } from 'react';

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
} & ComponentPropsWithoutRef<T>;

function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';

  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Component
      className={`rounded font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

// Usage
<Button>Default button</Button>
<Button as="a" href="/page">Link button</Button>
<Button as={Link} to="/page">Router link button</Button>
```

## Provider Pattern

### Theme Provider
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
  };
}

const ThemeContext = createContext<Theme | null>(null);

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return theme;
}

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          '--color-primary': theme.colors.primary,
          '--color-secondary': theme.colors.secondary,
          '--color-background': theme.colors.background,
          '--color-text': theme.colors.text,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Themed component
function ThemedButton({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <button
      style={{
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
      }}
    >
      {children}
    </button>
  );
}
```

## Composition Best Practices

### 1. Prefer Composition Over Props
```typescript
// ❌ Too many props
<Button
  icon={<Icon />}
  iconPosition="left"
  loading={true}
  loadingText="Saving..."
>
  Save
</Button>

// ✅ Compose what you need
<Button>
  {loading ? (
    <>
      <Spinner /> Saving...
    </>
  ) : (
    <>
      <Icon /> Save
    </>
  )}
</Button>
```

### 2. Single Responsibility
```typescript
// ❌ Component does too much
<UserCard
  user={user}
  showAvatar={true}
  showBio={true}
  showFollowers={true}
  onFollow={handleFollow}
  onMessage={handleMessage}
/>

// ✅ Compose smaller components
<UserCard>
  <UserCard.Avatar user={user} />
  <UserCard.Info>
    <UserCard.Name>{user.name}</UserCard.Name>
    <UserCard.Bio>{user.bio}</UserCard.Bio>
  </UserCard.Info>
  <UserCard.Actions>
    <FollowButton userId={user.id} />
    <MessageButton userId={user.id} />
  </UserCard.Actions>
</UserCard>
```

### 3. Inversion of Control
```typescript
// ❌ Parent controls everything
<List
  items={items}
  renderItem={(item) => <Item item={item} />}
  onItemClick={handleClick}
  selectedId={selectedId}
/>

// ✅ Children control themselves
<List>
  {items.map((item) => (
    <List.Item
      key={item.id}
      selected={item.id === selectedId}
      onClick={() => handleClick(item)}
    >
      {item.name}
    </List.Item>
  ))}
</List>
```
