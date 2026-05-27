---
name: date-time-handling
description: Handle dates, times, and timezones with date-fns, Day.js, and Intl APIs. Use when formatting dates for display, parsing user input across timezones, or building calendar and scheduling features.
---

# Date & Time Handling Patterns

Comprehensive patterns for handling dates, times, and timezones in JavaScript/TypeScript applications.

## When to Use This Skill

Use this skill when:
- Formatting dates for display
- Parsing user date input
- Handling timezones
- Calculating date differences
- Working with recurring events
- Building calendar features

## date-fns (Recommended)

### Installation

```bash
npm install date-fns date-fns-tz
```

### Basic Formatting

```typescript
import { format, formatDistance, formatRelative } from 'date-fns';

const date = new Date();

// Basic formats
format(date, 'yyyy-MM-dd');           // 2024-01-15
format(date, 'MMMM d, yyyy');         // January 15, 2024
format(date, 'MMM d, yyyy h:mm a');   // Jan 15, 2024 2:30 PM
format(date, "EEEE, MMMM do 'at' h:mm a"); // Monday, January 15th at 2:30 PM

// Relative time
formatDistance(date, new Date(), { addSuffix: true }); // "2 hours ago"
formatRelative(date, new Date()); // "yesterday at 2:30 PM"
```

### Parsing Dates

```typescript
import { parse, parseISO, isValid } from 'date-fns';

// ISO string (most common from APIs)
const date1 = parseISO('2024-01-15T14:30:00Z');

// Custom format
const date2 = parse('15/01/2024', 'dd/MM/yyyy', new Date());

// Validate parsed date
if (isValid(date2)) {
  console.log('Valid date');
}

// Safe parsing helper
function safeParseDate(dateString: string): Date | null {
  const date = parseISO(dateString);
  return isValid(date) ? date : null;
}
```

### Date Math

```typescript
import {
  addDays,
  addMonths,
  subWeeks,
  differenceInDays,
  differenceInHours,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  isWithinInterval,
} from 'date-fns';

const now = new Date();

// Add/subtract
const nextWeek = addDays(now, 7);
const lastMonth = subWeeks(now, 4);
const nextQuarter = addMonths(now, 3);

// Differences
const daysDiff = differenceInDays(nextWeek, now); // 7
const hoursDiff = differenceInHours(nextWeek, now); // 168

// Boundaries
const dayStart = startOfDay(now);   // Today at 00:00:00
const dayEnd = endOfDay(now);       // Today at 23:59:59
const monthStart = startOfMonth(now);
const monthEnd = endOfMonth(now);

// Comparisons
isAfter(nextWeek, now);  // true
isBefore(now, nextWeek); // true
isWithinInterval(now, { start: dayStart, end: dayEnd }); // true
```

### Timezone Handling

```typescript
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

const date = new Date();

// Format in specific timezone
formatInTimeZone(date, 'America/New_York', 'yyyy-MM-dd HH:mm:ss zzz');
// "2024-01-15 09:30:00 EST"

formatInTimeZone(date, 'Europe/London', 'yyyy-MM-dd HH:mm:ss zzz');
// "2024-01-15 14:30:00 GMT"

// Convert to zoned time (for display)
const nyTime = toZonedTime(date, 'America/New_York');

// Convert from zoned time (for storage)
const utcDate = fromZonedTime('2024-01-15 09:30:00', 'America/New_York');
```

## Day.js (Lightweight Alternative)

### Installation

```bash
npm install dayjs
```

### Setup with Plugins

```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(duration);
```

### Usage

```typescript
import dayjs from 'dayjs';

// Create
const now = dayjs();
const date = dayjs('2024-01-15');
const fromTimestamp = dayjs.unix(1705312200);

// Format
dayjs().format('YYYY-MM-DD');              // 2024-01-15
dayjs().format('MMMM D, YYYY h:mm A');    // January 15, 2024 2:30 PM

// Manipulate
dayjs().add(7, 'day');
dayjs().subtract(1, 'month');
dayjs().startOf('week');
dayjs().endOf('month');

// Relative time
dayjs().fromNow();        // "a few seconds ago"
dayjs().to(dayjs('2025-01-01')); // "in 11 months"

// Timezone
dayjs().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss z');
```

## Common Patterns

### User-Friendly Date Display

```typescript
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';

function formatSmartDate(date: Date): string {
  if (isToday(date)) {
    return format(date, "'Today at' h:mm a");
  }

  if (isYesterday(date)) {
    return format(date, "'Yesterday at' h:mm a");
  }

  if (isThisWeek(date)) {
    return format(date, "EEEE 'at' h:mm a");
  }

  // Older dates
  return format(date, 'MMM d, yyyy');
}

// Result examples:
// "Today at 2:30 PM"
// "Yesterday at 9:00 AM"
// "Monday at 3:45 PM"
// "Jan 10, 2024"
```

### Relative Time with Threshold

```typescript
import { differenceInMinutes, differenceInHours, format } from 'date-fns';

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const minutesDiff = differenceInMinutes(now, date);
  const hoursDiff = differenceInHours(now, date);

  if (minutesDiff < 1) return 'Just now';
  if (minutesDiff < 60) return `${minutesDiff}m ago`;
  if (hoursDiff < 24) return `${hoursDiff}h ago`;
  if (hoursDiff < 48) return 'Yesterday';

  return format(date, 'MMM d');
}
```

### Date Range Formatting

```typescript
import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';

function formatDateRange(start: Date, end: Date): string {
  if (isSameDay(start, end)) {
    return format(start, 'MMMM d, yyyy');
  }

  if (isSameMonth(start, end)) {
    return `${format(start, 'MMMM d')} - ${format(end, 'd, yyyy')}`;
  }

  if (isSameYear(start, end)) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  }

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}

// Result examples:
// "January 15, 2024"
// "January 15 - 20, 2024"
// "Jan 15 - Feb 20, 2024"
// "Dec 15, 2023 - Jan 15, 2024"
```

### Duration Formatting

```typescript
import { intervalToDuration, formatDuration } from 'date-fns';

function formatTimeDuration(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    zero: true,
    delimiter: ':',
  });
}

// Or manual formatting
function formatDurationManual(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}
```

### Working with User Timezones

```typescript
import { formatInTimeZone } from 'date-fns-tz';

// Get user's timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// "America/New_York"

// Store in UTC, display in user's timezone
function displayInUserTimezone(utcDate: Date): string {
  return formatInTimeZone(utcDate, userTimezone, 'MMM d, yyyy h:mm a zzz');
}

// Parse user input in their timezone, store as UTC
import { fromZonedTime } from 'date-fns-tz';

function parseUserDate(dateString: string, timeString: string): Date {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDateTime = `${dateString}T${timeString}:00`;
  return fromZonedTime(localDateTime, userTimezone);
}
```

### Calendar Week Calculation

```typescript
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getWeek,
  addWeeks,
} from 'date-fns';

function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

function getWeekNumber(date: Date): number {
  return getWeek(date, { weekStartsOn: 1 });
}

// Calendar grid (6 weeks)
function getCalendarGrid(date: Date): Date[][] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(addWeeks(monthEnd, 1), { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Split into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks.slice(0, 6); // Max 6 weeks
}
```

## React Components

### Date Display Component

```tsx
// components/DateTime.tsx
'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

interface DateTimeProps {
  date: Date | string;
  relative?: boolean;
  format?: string;
}

export function DateTime({ date, relative, format: formatStr }: DateTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Prevent hydration mismatch
  if (!mounted) {
    return <time dateTime={dateObj.toISOString()}>{dateObj.toISOString()}</time>;
  }

  const displayText = relative
    ? formatDistanceToNow(dateObj, { addSuffix: true })
    : format(dateObj, formatStr || 'MMM d, yyyy');

  return (
    <time dateTime={dateObj.toISOString()} title={dateObj.toLocaleString()}>
      {displayText}
    </time>
  );
}
```

### Auto-Updating Relative Time

```tsx
// components/RelativeTime.tsx
'use client';

import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

export function RelativeTime({ date }: { date: Date | string }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const update = () => {
      setText(formatDistanceToNow(dateObj, { addSuffix: true }));
    };

    update();
    const interval = setInterval(update, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [date]);

  return <span>{text}</span>;
}
```

## Best Practices

1. **Store in UTC** - Always store dates in UTC format
2. **Parse on server** - Parse and validate dates server-side
3. **Use ISO 8601** - Prefer ISO format for APIs
4. **Handle timezones explicitly** - Never assume timezone
5. **Avoid timezone bugs** - Use date-fns-tz for timezone operations
6. **Test edge cases** - DST transitions, leap years, month boundaries

## Database Patterns

```typescript
// Store as ISO string or timestamp
const createdAt = new Date().toISOString(); // "2024-01-15T14:30:00.000Z"

// Prisma: Use DateTime type
// created_at DateTime @default(now())

// Query with dates
const recentPosts = await prisma.post.findMany({
  where: {
    createdAt: {
      gte: startOfDay(new Date()),
    },
  },
});
```

## Resources

- [date-fns Documentation](https://date-fns.org)
- [Day.js Documentation](https://day.js.org)
- [date-fns-tz Documentation](https://github.com/marnusw/date-fns-tz)
- [IANA Time Zone Database](https://www.iana.org/time-zones)
