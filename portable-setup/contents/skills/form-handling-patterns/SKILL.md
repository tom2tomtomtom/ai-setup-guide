---
name: form-handling-patterns
description: React form patterns with React Hook Form, Zod validation, error handling, and accessible form UX; use when building forms that don't frustrate users
---

# Form Handling Patterns

Build forms that are fast to develop, validate properly, and provide excellent user experience.

## When to Use This Skill

Use when:
- Building any form (login, signup, settings, data entry)
- Setting up form validation
- Handling complex form state (arrays, nested objects)
- Creating reusable form components
- Improving form accessibility and UX

## Stack: React Hook Form + Zod

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Basic Form Setup

### Schema-First Approach
```typescript
// schemas/user.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/user';

export function LoginForm({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <span role="alert">{errors.password.message}</span>
        )}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('rememberMe')} />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
```

## Zod Validation Patterns

### Common Validations
```typescript
import { z } from 'zod';

// String validations
const stringSchema = z.object({
  required: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  url: z.string().url('Invalid URL'),
  minLength: z.string().min(3, 'At least 3 characters'),
  maxLength: z.string().max(100, 'Too long'),
  pattern: z.string().regex(/^[A-Z]{2}\d{4}$/, 'Invalid format (e.g., AB1234)'),
  trim: z.string().trim(), // Trims whitespace
  toLowerCase: z.string().toLowerCase(),
});

// Number validations
const numberSchema = z.object({
  positive: z.number().positive('Must be positive'),
  int: z.number().int('Must be whole number'),
  range: z.number().min(1).max(100),
  // From string input
  stringToNumber: z.string().pipe(z.coerce.number().positive()),
});

// Date validations
const dateSchema = z.object({
  date: z.coerce.date(),
  future: z.coerce.date().min(new Date(), 'Must be in future'),
  dateRange: z.coerce.date().min(new Date('2020-01-01')).max(new Date()),
});

// Optional and nullable
const optionalSchema = z.object({
  optional: z.string().optional(), // string | undefined
  nullable: z.string().nullable(), // string | null
  nullish: z.string().nullish(),   // string | null | undefined
  defaulted: z.string().default('default value'),
});

// Enums
const roleSchema = z.enum(['admin', 'user', 'guest']);
const statusSchema = z.nativeEnum(Status); // From TypeScript enum
```

### Complex Validations
```typescript
// Password confirmation
const passwordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Conditional validation
const profileSchema = z
  .object({
    accountType: z.enum(['personal', 'business']),
    companyName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.accountType === 'business') {
        return data.companyName && data.companyName.length > 0;
      }
      return true;
    },
    {
      message: 'Company name required for business accounts',
      path: ['companyName'],
    }
  );

// At least one field required
const contactSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
  });

// Array validation
const tagsSchema = z.object({
  tags: z
    .array(z.string().min(1))
    .min(1, 'At least one tag')
    .max(5, 'Maximum 5 tags'),
});

// Nested objects
const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
});

const userWithAddressSchema = z.object({
  name: z.string().min(1),
  address: addressSchema,
});
```

### Transform and Preprocess
```typescript
// Transform output
const formSchema = z.object({
  // Trim and lowercase email
  email: z.string().trim().toLowerCase().email(),

  // Parse number from string input
  age: z.string().transform((val) => parseInt(val, 10)),

  // Format phone number
  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 10, 'Must be 10 digits'),
});

// Preprocess (before validation)
const numberInput = z.preprocess(
  (val) => (val === '' ? undefined : Number(val)),
  z.number().optional()
);
```

## Reusable Form Components

### FormField Component
```typescript
// components/ui/FormField.tsx
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  description,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-gray-500">
          {description}
        </p>
      )}

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          [error && errorId, description && descriptionId]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={`
          w-full rounded border px-3 py-2
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />

      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-500">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
```

### FormProvider Pattern
```typescript
// components/ProfileForm.tsx
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from './ui/FormField';

export function ProfileForm({ onSubmit, defaultValues }) {
  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField name="name" label="Full Name" />
        <FormField name="email" label="Email" type="email" />
        <FormField
          name="bio"
          label="Bio"
          description="A short description about yourself"
        />
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
}
```

## Dynamic Forms

### Array Fields
```typescript
import { useForm, useFieldArray } from 'react-hook-form';

const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().min(1),
    })
  ).min(1, 'Add at least one item'),
});

function OrderForm() {
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [{ name: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`items.${index}.name`)}
            placeholder="Item name"
          />
          <input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>

          {errors.items?.[index]?.name && (
            <span>{errors.items[index].name.message}</span>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', quantity: 1 })}>
        Add Item
      </button>

      {errors.items?.root && (
        <span>{errors.items.root.message}</span>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Conditional Fields
```typescript
function ConditionalForm() {
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(conditionalSchema),
  });

  const accountType = watch('accountType');

  return (
    <form>
      <select {...register('accountType')}>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>

      {accountType === 'business' && (
        <>
          <input {...register('companyName')} placeholder="Company Name" />
          <input {...register('taxId')} placeholder="Tax ID" />
        </>
      )}
    </form>
  );
}
```

## Form State Management

### Dirty Tracking and Reset
```typescript
function EditForm({ initialData }) {
  const {
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
  } = useForm({
    defaultValues: initialData,
  });

  // Warn on navigation if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (data) => {
    // Only send changed fields
    const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    await updateProfile(changedFields);
    reset(data); // Reset dirty state with new values
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* fields */}
      <button type="submit" disabled={!isDirty}>
        Save Changes
      </button>
      <button type="button" onClick={() => reset()}>
        Discard Changes
      </button>
    </form>
  );
}
```

### Form with Server Errors
```typescript
function SignupForm() {
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createAccount(data);
    } catch (error) {
      if (error.code === 'EMAIL_EXISTS') {
        setError('email', {
          type: 'server',
          message: 'This email is already registered',
        });
      } else if (error.code === 'USERNAME_TAKEN') {
        setError('username', {
          type: 'server',
          message: 'This username is taken',
        });
      } else {
        setError('root.serverError', {
          type: 'server',
          message: 'Something went wrong. Please try again.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.serverError && (
        <div role="alert" className="bg-red-100 p-3 rounded">
          {errors.root.serverError.message}
        </div>
      )}
      {/* fields */}
    </form>
  );
}
```

## Validation Modes

```typescript
const form = useForm({
  resolver: zodResolver(schema),

  // When to validate
  mode: 'onBlur',          // Validate on blur (default)
  mode: 'onChange',        // Validate on every change (can be slow)
  mode: 'onSubmit',        // Only validate on submit
  mode: 'onTouched',       // Validate on blur, then onChange
  mode: 'all',             // Validate on blur and change

  // When to revalidate after error
  reValidateMode: 'onChange', // Revalidate on change after error
  reValidateMode: 'onBlur',   // Revalidate on blur after error

  // Criteria for showing errors
  criteriaMode: 'firstError', // Show first error only (default)
  criteriaMode: 'all',        // Show all errors
});
```

## Multi-Step Forms

```typescript
const steps = [
  { id: 'personal', schema: personalSchema },
  { id: 'address', schema: addressSchema },
  { id: 'payment', schema: paymentSchema },
];

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const currentSchema = steps[currentStep].schema;

  const { handleSubmit, ...form } = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: formData,
  });

  const onStepSubmit = (data) => {
    const newData = { ...formData, ...data };
    setFormData(newData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit
      submitForm(newData);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onStepSubmit)}>
      {/* Progress indicator */}
      <div className="flex gap-2 mb-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-2 flex-1 rounded ${
              index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      {currentStep === 0 && <PersonalFields />}
      {currentStep === 1 && <AddressFields />}
      {currentStep === 2 && <PaymentFields />}

      {/* Navigation */}
      <div className="flex gap-2">
        {currentStep > 0 && (
          <button type="button" onClick={goBack}>
            Back
          </button>
        )}
        <button type="submit">
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
}
```

## Form UX Best Practices

### Inline Validation Feedback
```typescript
// Show success state when valid
function ValidatedInput({ name, label }) {
  const { formState: { errors, touchedFields, isValid } } = useFormContext();
  const error = errors[name];
  const touched = touchedFields[name];
  const valid = touched && !error;

  return (
    <div>
      <input
        {...register(name)}
        className={`
          border rounded px-3 py-2
          ${error ? 'border-red-500' : ''}
          ${valid ? 'border-green-500' : ''}
        `}
      />
      {valid && <span className="text-green-500">✓</span>}
      {error && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}
```

### Accessible Error Summary
```typescript
function ErrorSummary() {
  const { formState: { errors } } = useFormContext();
  const errorList = Object.entries(errors);

  if (errorList.length === 0) return null;

  return (
    <div
      role="alert"
      aria-labelledby="error-summary-title"
      className="bg-red-50 border border-red-200 rounded p-4 mb-4"
    >
      <h2 id="error-summary-title" className="font-semibold text-red-800">
        Please fix the following errors:
      </h2>
      <ul className="list-disc list-inside mt-2">
        {errorList.map(([field, error]) => (
          <li key={field}>
            <a href={`#${field}`} className="text-red-600 underline">
              {error.message as string}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Loading States
```typescript
function SubmitButton() {
  const { formState: { isSubmitting, isValid } } = useFormContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting || !isValid}
      className="relative"
    >
      <span className={isSubmitting ? 'invisible' : ''}>
        Submit
      </span>
      {isSubmitting && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </button>
  );
}
```

### Prevent Double Submit
```typescript
function Form() {
  const submitRef = useRef(false);

  const onSubmit = async (data) => {
    if (submitRef.current) return;
    submitRef.current = true;

    try {
      await saveData(data);
    } finally {
      submitRef.current = false;
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

## Server Actions (Next.js)

```typescript
// actions/profile.ts
'use server';

import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function updateProfile(formData: FormData) {
  const data = Object.fromEntries(formData);
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  await db.users.update({
    where: { id: getCurrentUserId() },
    data: result.data,
  });

  revalidatePath('/profile');
  return { success: true };
}

// components/ProfileForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { updateProfile } from '@/actions/profile';

export function ProfileForm() {
  const [state, formAction] = useFormState(updateProfile, null);

  return (
    <form action={formAction}>
      <input name="name" />
      {state?.error?.name && <span>{state.error.name}</span>}

      <input name="email" type="email" />
      {state?.error?.email && <span>{state.error.email}</span>}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```
