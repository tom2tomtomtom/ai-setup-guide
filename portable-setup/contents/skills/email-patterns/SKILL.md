---
name: email-patterns
description: Send transactional emails like welcome messages, password resets, and notifications with React Email and Resend. Use when building email templates, setting up a notification system, or adding email to an auth flow.
---

# Email Patterns

Comprehensive patterns for sending emails using React Email, Resend, Nodemailer, and other email services.

## When to Use This Skill

Use this skill when:
- Building transactional email systems
- Creating email templates
- Sending welcome/confirmation emails
- Implementing password reset flows
- Building notification systems
- Creating marketing email templates

## React Email + Resend (Recommended)

### Installation

```bash
npm install @react-email/components resend
```

### Email Template

```tsx
// emails/welcome.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  username: string;
  loginUrl: string;
}

export function WelcomeEmail({ username, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform, {username}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://example.com/logo.png"
            width="170"
            height="50"
            alt="Logo"
            style={logo}
          />
          <Heading style={heading}>Welcome, {username}!</Heading>
          <Text style={paragraph}>
            Thanks for signing up. We're excited to have you on board.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Get Started
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '5px',
  maxWidth: '600px',
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#525252',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

export default WelcomeEmail;
```

### Sending with Resend

```typescript
// lib/email.ts
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, username: string) {
  const { data, error } = await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'Welcome to Our Platform!',
    react: WelcomeEmail({ username, loginUrl: 'https://app.example.com/login' }),
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw error;
  }

  return data;
}
```

### Password Reset Email

```tsx
// emails/password-reset.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn: string;
}

export function PasswordResetEmail({ resetUrl, expiresIn }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reset Your Password</Heading>
          <Text style={paragraph}>
            We received a request to reset your password. Click the button below
            to choose a new password.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          <Text style={paragraph}>
            This link will expire in {expiresIn}. If you didn't request a password
            reset, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### API Route

```typescript
// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const { email, username } = await request.json();

  try {
    const result = await sendWelcomeEmail(email, username);
    return NextResponse.json({ success: true, id: result?.id });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

## Nodemailer (Self-hosted)

### Installation

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### Configuration

```typescript
// lib/nodemailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });

  return info;
}

// Verify connection
export async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('SMTP connection verified');
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
}
```

### Gmail Configuration

```typescript
// For Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});
```

## Email Queue Pattern

```typescript
// lib/email-queue.ts
import { Queue, Worker } from 'bullmq';
import { sendEmail } from './email';

const emailQueue = new Queue('emails', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Add email to queue
export async function queueEmail(data: {
  to: string;
  subject: string;
  template: string;
  props: Record<string, unknown>;
}) {
  await emailQueue.add('send-email', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}

// Process queue
const worker = new Worker(
  'emails',
  async (job) => {
    const { to, subject, template, props } = job.data;
    await sendEmail({ to, subject, template, props });
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Email sent: ${job.id}`);
});

worker.on('failed', (job, error) => {
  console.error(`Email failed: ${job?.id}`, error);
});
```

## Common Email Templates

### Order Confirmation

```tsx
// emails/order-confirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
}

export function OrderConfirmation({
  orderNumber,
  items,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Order #{orderNumber} confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Order Confirmed!</Heading>
          <Text style={paragraph}>
            Thank you for your order. Here's a summary:
          </Text>
          <Text style={orderNum}>Order #{orderNumber}</Text>

          <Section style={itemsSection}>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={priceColumn}>
                  <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Row>
            <Column>
              <Text style={totalLabel}>Total</Text>
            </Column>
            <Column style={priceColumn}>
              <Text style={totalPrice}>${total.toFixed(2)}</Text>
            </Column>
          </Row>

          <Hr style={hr} />

          <Section>
            <Text style={sectionTitle}>Shipping Address</Text>
            <Text style={paragraph}>{shippingAddress}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

### Notification Email

```tsx
// emails/notification.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
} from '@react-email/components';

interface NotificationEmailProps {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export function NotificationEmail({
  title,
  message,
  actionUrl,
  actionText,
}: NotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{title}</Heading>
          <Text style={paragraph}>{message}</Text>
          {actionUrl && actionText && (
            <Button style={button} href={actionUrl}>
              {actionText}
            </Button>
          )}
        </Container>
      </Body>
    </Html>
  );
}
```

## Development Preview

```bash
# Preview emails in browser
npx react-email dev

# Export to HTML
npx react-email export
```

## Testing

```typescript
// __tests__/email.test.ts
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/welcome';

describe('WelcomeEmail', () => {
  it('renders correctly', () => {
    const html = render(
      WelcomeEmail({
        username: 'John',
        loginUrl: 'https://example.com/login',
      })
    );

    expect(html).toContain('Welcome, John!');
    expect(html).toContain('https://example.com/login');
  });
});
```

## Best Practices

1. **Use React Email** - Type-safe, component-based templates
2. **Queue emails** - Don't send synchronously in API routes
3. **Include text version** - Always provide plain text fallback
4. **Test rendering** - Preview emails during development
5. **Handle bounces** - Implement bounce/complaint handling
6. **Verify domains** - Set up SPF, DKIM, DMARC

## Environment Variables

```bash
# Resend
RESEND_API_KEY=re_xxx

# Nodemailer (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASSWORD=password
SMTP_FROM="App Name <noreply@example.com>"
```

## Resources

- [React Email Documentation](https://react.email)
- [Resend Documentation](https://resend.com/docs)
- [Nodemailer Documentation](https://nodemailer.com)
