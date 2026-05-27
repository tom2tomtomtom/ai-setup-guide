---
name: pdf-generation
description: Generates PDF documents using @react-pdf/renderer (declarative) and jsPDF (imperative); use when building downloadable reports, invoices, dashboards, or any printable document
---

# PDF Generation Patterns

Production patterns for generating PDF documents in TypeScript/React applications. Covers two complementary libraries: `@react-pdf/renderer` for declarative React component-based PDFs, and `jsPDF` for imperative coordinate-based generation. Includes server-side rendering, client-side downloads, multi-page reports, tables, images, and font management.

## When to Use This Skill

Use when:
- Building downloadable PDF reports or dashboards
- Generating invoices, receipts, or formal documents
- Creating multi-page branded reports with headers/footers
- Adding PDF export to existing React applications
- Rendering data grids and tables into PDF format
- Building server-side PDF endpoints (Next.js API routes)
- Creating client-side PDF downloads triggered by user action

## Choosing Between Libraries

### @react-pdf/renderer (Declarative)
- Best for complex, branded multi-page reports
- Uses familiar React component patterns (JSX)
- Flexbox-based layout system
- Supports server-side rendering via `renderToStream`/`renderToBuffer`
- Component reuse across different report types
- Better for teams already thinking in React
- **Gotcha**: Not all CSS properties are supported; uses a CSS-like subset

### jsPDF (Imperative)
- Best for simpler documents or precise coordinate control
- No React dependency -- works in any JavaScript environment
- Direct coordinate-based text/shape positioning
- Smaller bundle size for simple use cases
- `autoTable` plugin for quick data grids
- `pdf.save()` triggers download directly in the browser
- **Gotcha**: Manual page break management; no automatic layout flow

### Using Both Together
AIDEN uses both: `@react-pdf/renderer` for the full multi-section report with component composition, and `jsPDF` as a production fallback in API routes (avoids React rendering overhead on the server). Choose one as primary; keep the other as fallback.

## Installation

```bash
# Declarative (React-based)
npm install @react-pdf/renderer

# Imperative (coordinate-based)
npm install jspdf

# Optional: table plugin for jsPDF
npm install jspdf-autotable
```

---

## @react-pdf/renderer Patterns

### Core Components

The library provides a small set of primitive components that map to PDF constructs:

```tsx
import {
  Document,   // Root wrapper -- represents the PDF file
  Page,       // A single page (size, orientation, style)
  View,       // Layout container (like <div>) -- supports flexbox
  Text,       // Text content (like <span>) -- only Text can render strings
  Image,      // Embed images (local path, URL, or base64)
  Link,       // Clickable hyperlinks in the PDF
  StyleSheet, // Create typed style objects (like React Native)
  Font,       // Register custom fonts
} from '@react-pdf/renderer'
```

**Critical rule**: All visible text must be wrapped in `<Text>`. Bare strings inside `<View>` will throw errors.

### Minimal Document

```tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#000000',
    padding: 40,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
  },
})

export function MinimalPDF({ title }: { title: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.text}>Report: {title}</Text>
        </View>
      </Page>
    </Document>
  )
}
```

### StyleSheet API and Design Tokens

Extract colors, fonts, spacing, and font sizes into a shared design token file. All PDF components import from this single source of truth.

```typescript
// lib/export/report-styles.ts
import { StyleSheet } from '@react-pdf/renderer'

// Brand colors
export const colors = {
  black: '#050505',
  blackDeep: '#0a0a0a',
  blackCard: '#0f0f0f',
  redHot: '#ff2e2e',
  white: '#ffffff',
  whiteMuted: '#999999',
  whiteDim: '#666666',
  scoreHigh: '#22c55e',
  scoreMedium: '#eab308',
  scoreLow: '#ef4444',
  strengthBg: '#052e16',
  strengthBorder: '#22c55e',
  weaknessBg: '#450a0a',
  weaknessBorder: '#ef4444',
}

// Typography
export const fonts = {
  heading: 'Helvetica-Bold',
  body: 'Helvetica',
  mono: 'Courier',
}

export const fontSize = {
  title: 32,
  h1: 24,
  h2: 18,
  h3: 14,
  body: 11,
  small: 9,
  tiny: 8,
}

export const spacing = {
  page: 40,
  section: 24,
  item: 12,
  small: 8,
  tiny: 4,
}

// Reusable style objects
export const baseStyles = StyleSheet.create({
  page: {
    backgroundColor: colors.black,
    padding: spacing.page,
    fontFamily: fonts.body,
    color: colors.white,
  },
  sectionTitle: {
    fontSize: fontSize.h1,
    fontFamily: fonts.heading,
    color: colors.white,
    marginBottom: spacing.section,
    borderBottomWidth: 2,
    borderBottomColor: colors.redHot,
    paddingBottom: spacing.small,
  },
  card: {
    backgroundColor: colors.blackCard,
    padding: spacing.item,
    marginBottom: spacing.item,
    borderLeftWidth: 3,
  },
  bodyText: {
    fontSize: fontSize.body,
    color: colors.white,
    lineHeight: 1.5,
    marginBottom: spacing.small,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 30,
    left: spacing.page,
    right: spacing.page,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.whiteDim,
    paddingTop: spacing.small,
  },
  footerText: {
    fontSize: fontSize.tiny,
    color: colors.whiteDim,
  },
})
```

### Safe Text Helper

Database values can be objects, arrays, null, or undefined. Always wrap dynamic content with a safe text converter to prevent React rendering errors (Error #31).

```typescript
export function safeText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.map(v => safeText(v)).join(', ')
    try { return JSON.stringify(value) } catch { return '[Object]' }
  }
  return String(value)
}
```

Use it everywhere dynamic data appears in `<Text>`:

```tsx
<Text>{safeText(response.archetype?.name)}</Text>
// NOT: <Text>{response.archetype?.name}</Text>  // can throw if name is object
```

### Multi-Page Report with Component Composition

Structure reports as a root `<Document>` that composes section components. Each section renders its own `<Page>`. This keeps each section self-contained and testable.

```tsx
// lib/export/pdf-generator.tsx
import { Document } from '@react-pdf/renderer'
import { CoverPage } from './components/cover-page'
import { ExecutiveSummary } from './components/executive-summary'
import { ScoresDashboard } from './components/scores-dashboard'
import { StrengthsSection } from './components/strengths-section'
import { PersonaAppendix } from './components/persona-appendix'

interface ReportProps {
  test: TestData
  project: ProjectData
  result: TestResultData
  responses: PersonaResponseData[]
  options?: { includeAppendix?: boolean }
}

export function PressureTestReport({
  test, project, result, responses,
  options = { includeAppendix: true },
}: ReportProps) {
  return (
    <Document
      title={`Report - ${test.name}`}
      author="AIDEN"
      subject={`Results for ${test.name}`}
      creator="AIDEN Platform"
    >
      <CoverPage
        testName={String(test.name)}
        projectName={String(project.name)}
        stimulusType={test.stimulus_type}
        createdAt={String(test.created_at)}
      />

      <ExecutiveSummary
        pressureScore={Number(result.pressure_score) || 0}
        oneLineVerdict={result.one_line_verdict}
        keyStrengths={result.key_strengths}
        keyWeaknesses={result.key_weaknesses}
      />

      <ScoresDashboard
        pressureScore={Number(result.pressure_score) || 0}
        gutAttractionIndex={Number(result.gut_attraction_index) || 0}
        credibilityScore={Number(result.credibility_score) || 0}
      />

      {/* Conditional sections */}
      {result.key_strengths && result.key_strengths.length > 0 && (
        <StrengthsSection strengths={result.key_strengths} />
      )}

      {/* Multi-page appendix */}
      {options.includeAppendix && responses.length > 0 && (
        <PersonaAppendix responses={responses} />
      )}
    </Document>
  )
}
```

### Cover Page Component

A full-bleed cover page using flexbox `justifyContent: 'space-between'` to push content to top and bottom.

```tsx
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { colors, fonts, fontSize, spacing, safeText } from '../report-styles'

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.black,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topSection: { marginTop: 80 },
  brandLabel: {
    fontSize: fontSize.small,
    color: colors.redHot,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: spacing.section,
  },
  title: {
    fontSize: 42,
    fontFamily: fonts.heading,
    color: colors.white,
    marginBottom: spacing.item,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: fontSize.h2,
    color: colors.whiteMuted,
    marginBottom: spacing.section * 2,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.redHot,
    marginVertical: spacing.section,
  },
  metaRow: { flexDirection: 'row', marginBottom: spacing.small },
  metaLabel: {
    fontSize: fontSize.small,
    color: colors.whiteDim,
    width: 80,
    textTransform: 'uppercase',
  },
  metaValue: { fontSize: fontSize.small, color: colors.white },
  bottomSection: { alignItems: 'center', marginBottom: 40 },
  logo: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.redHot,
    letterSpacing: 6,
    marginBottom: spacing.small,
  },
  tagline: {
    fontSize: fontSize.small,
    color: colors.whiteDim,
    letterSpacing: 2,
  },
})

interface CoverPageProps {
  testName: string
  projectName: string
  stimulusType: string
  createdAt: string
  completedAt?: string
}

export function CoverPage({ testName, projectName, stimulusType, createdAt, completedAt }: CoverPageProps) {
  const formattedDate = new Date(completedAt || createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topSection}>
        <Text style={styles.brandLabel}>Pressure Test Report</Text>
        <View style={styles.decorativeLine} />
        <Text style={styles.title}>{safeText(testName)}</Text>
        <Text style={styles.subtitle}>{safeText(projectName)}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Type</Text>
          <Text style={styles.metaValue}>{safeText(stimulusType)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>{safeText(formattedDate)}</Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.logo}>AIDEN</Text>
        <Text style={styles.tagline}>SYNTHETIC QUALITATIVE RESEARCH</Text>
      </View>
    </Page>
  )
}
```

### Score Cards with Dynamic Colors

Use helper functions to compute colors from data, then apply inline via the style array pattern `style={[base, { color: dynamic }]}`.

```tsx
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { colors, fonts, fontSize, spacing, getScoreColor, safeText } from '../report-styles'

// Helper
export function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e'   // green
  if (score >= 50) return '#eab308'   // yellow
  return '#ef4444'                     // red
}

const styles = StyleSheet.create({
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.section,
  },
  scoreCard: { alignItems: 'center', width: 140 },
  scoreValue: { fontSize: 48, fontFamily: fonts.heading },
  scoreLabel: {
    fontSize: fontSize.small,
    color: colors.whiteMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreBar: { width: '100%', height: 4, backgroundColor: colors.blackCard, marginTop: spacing.small },
  scoreBarFill: { height: 4 },
})

export function ScoresDashboard({ pressureScore, gutAttractionIndex, credibilityScore }: Props) {
  const scores = [
    { value: pressureScore, label: 'Pressure Score' },
    { value: gutAttractionIndex, label: 'Gut Attraction' },
    { value: credibilityScore, label: 'Credibility' },
  ]

  return (
    <Page size="A4" style={baseStyles.page}>
      <Text style={baseStyles.sectionTitle}>Scores Dashboard</Text>
      <View style={styles.scoresContainer}>
        {scores.map((score, i) => (
          <View key={i} style={styles.scoreCard}>
            <Text style={[styles.scoreValue, { color: getScoreColor(score.value || 0) }]}>
              {safeText(Math.round(score.value || 0))}
            </Text>
            <Text style={styles.scoreLabel}>{safeText(score.label)}</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, {
                width: `${score.value || 0}%`,
                backgroundColor: getScoreColor(score.value || 0),
              }]} />
            </View>
          </View>
        ))}
      </View>
    </Page>
  )
}
```

### Cards with Severity/Confidence Badges

Pattern for rendering data items as cards with colored badge indicators.

```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.strengthBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.strengthBorder,
    padding: spacing.item,
    marginBottom: spacing.item,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  cardTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.white,
    flex: 1,   // title takes remaining space, badge stays right
  },
  badge: {
    fontSize: fontSize.tiny,
    paddingHorizontal: 8,
    paddingVertical: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeHigh: { backgroundColor: colors.scoreHigh, color: colors.black },
  badgeMedium: { backgroundColor: colors.scoreMedium, color: colors.black },
  badgeLow: { backgroundColor: colors.whiteDim, color: colors.white },
})

function getBadgeStyle(level: string) {
  switch (level) {
    case 'high': return styles.badgeHigh
    case 'critical': return styles.badgeHigh
    case 'medium': return styles.badgeMedium
    case 'major': return styles.badgeMedium
    default: return styles.badgeLow
  }
}

// Usage in component:
<View style={styles.card}>
  <View style={styles.cardHeader}>
    <Text style={styles.cardTitle}>{safeText(item.point)}</Text>
    <Text style={[styles.badge, getBadgeStyle(item.confidence)]}>
      {safeText(item.confidence)}
    </Text>
  </View>
  {item.evidence?.map((ev, i) => (
    <Text key={i} style={{ fontSize: 9, color: colors.whiteMuted }}>
      {safeText(ev)}
    </Text>
  ))}
</View>
```

### Multi-Page Appendix (Pagination of Data)

When rendering many items (e.g., persona responses), chunk them into groups per page. Use a Fragment wrapper to emit multiple `<Page>` components from a single section component.

```tsx
export function PersonaAppendix({ responses }: { responses: PersonaResponse[] }) {
  const responsesPerPage = 2
  const pages: PersonaResponse[][] = []

  for (let i = 0; i < responses.length; i += responsesPerPage) {
    pages.push(responses.slice(i, i + responsesPerPage))
  }

  return (
    <>
      {pages.map((pageResponses, pageIndex) => (
        <Page key={pageIndex} size="A4" style={baseStyles.page}>
          {pageIndex === 0 && (
            <>
              <Text style={baseStyles.sectionTitle}>Appendix: Full Panel Responses</Text>
              <Text style={{ fontSize: 11, color: colors.whiteMuted, marginBottom: 24 }}>
                Detailed responses from each phantom consumer in the panel.
              </Text>
            </>
          )}

          {pageResponses.map((response) => (
            <View key={response.id} style={styles.personaCard}>
              {/* Card content */}
            </View>
          ))}

          <View style={baseStyles.footer}>
            <Text style={baseStyles.footerText}>AIDEN Pressure Test</Text>
            <Text style={baseStyles.footerText}>Page {7 + pageIndex}</Text>
          </View>
        </Page>
      ))}
    </>
  )
}
```

### Persistent Footer on Every Page

Use absolute positioning to pin footer content to the bottom of each page.

```tsx
const footerStyles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,   // match page padding
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#666666',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
})

// Include in every <Page>:
<View style={footerStyles.footer}>
  <Text style={footerStyles.footerText}>Company Name</Text>
  <Text style={footerStyles.footerText}>Page 3</Text>
</View>
```

### Blockquotes / Verbatim Quotes

```tsx
const quoteStyles = StyleSheet.create({
  quoteCard: {
    backgroundColor: colors.blackCard,
    padding: spacing.item,
    marginBottom: spacing.item,
    borderLeftWidth: 3,
    borderLeftColor: colors.scoreHigh,
  },
  quoteText: {
    fontSize: fontSize.body,
    fontStyle: 'italic',
    color: colors.white,
    lineHeight: 1.5,
    marginBottom: spacing.tiny,
  },
  quoteAttribution: {
    fontSize: fontSize.small,
    color: colors.whiteMuted,
  },
})

// Usage:
<View style={quoteStyles.quoteCard}>
  <Text style={quoteStyles.quoteText}>"{safeText(quote.text)}"</Text>
  <Text style={quoteStyles.quoteAttribution}>
    -- {safeText(quote.author)} ({safeText(quote.role)})
  </Text>
</View>
```

### Tables and Data Grids

`@react-pdf/renderer` has no native table component. Build tables with `View` rows and fixed-width columns.

```tsx
const tableStyles = StyleSheet.create({
  table: { marginVertical: 12 },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.redHot,
    paddingBottom: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteDim,
    paddingVertical: 6,
  },
  col1: { width: '30%' },
  col2: { width: '40%' },
  col3: { width: '30%', textAlign: 'right' },
  headerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.whiteDim,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cellText: { fontSize: 10, color: colors.white },
})

function DataTable({ rows }: { rows: { name: string; description: string; score: number }[] }) {
  return (
    <View style={tableStyles.table}>
      <View style={tableStyles.headerRow}>
        <Text style={[tableStyles.headerText, tableStyles.col1]}>Name</Text>
        <Text style={[tableStyles.headerText, tableStyles.col2]}>Description</Text>
        <Text style={[tableStyles.headerText, tableStyles.col3]}>Score</Text>
      </View>
      {rows.map((row, i) => (
        <View key={i} style={tableStyles.row}>
          <Text style={[tableStyles.cellText, tableStyles.col1]}>{safeText(row.name)}</Text>
          <Text style={[tableStyles.cellText, tableStyles.col2]}>{safeText(row.description)}</Text>
          <Text style={[tableStyles.cellText, tableStyles.col3, { color: getScoreColor(row.score) }]}>
            {safeText(row.score)}
          </Text>
        </View>
      ))}
    </View>
  )
}
```

### Font Registration

Register custom fonts before rendering. Use `Font.register` at module scope.

```tsx
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Inter-Italic.ttf', fontStyle: 'italic' },
  ],
})

// Then use in styles:
const styles = StyleSheet.create({
  body: { fontFamily: 'Inter', fontWeight: 'normal' },
  heading: { fontFamily: 'Inter', fontWeight: 'bold' },
})
```

**Built-in fonts** (no registration needed): `Courier`, `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`, `Times-Roman`, `Times-Bold`.

### Embedding Images

```tsx
import { Image } from '@react-pdf/renderer'

// From URL
<Image src="https://example.com/logo.png" style={{ width: 100, height: 40 }} />

// From local file (server-side)
<Image src="/public/logo.png" style={{ width: 100, height: 40 }} />

// From base64
<Image src={`data:image/png;base64,${base64String}`} style={{ width: 200, height: 150 }} />
```

### Hyperlinks

```tsx
import { Link, Text } from '@react-pdf/renderer'

<Link src="https://aiden.services">
  <Text style={{ color: '#3b82f6', textDecoration: 'underline' }}>
    Visit AIDEN
  </Text>
</Link>
```

---

## jsPDF Patterns

### Basic Document Setup

```typescript
import { jsPDF } from 'jspdf'

const doc = new jsPDF({
  orientation: 'portrait',   // 'portrait' | 'landscape'
  unit: 'mm',                // 'mm' | 'pt' | 'in' | 'px'
  format: 'a4',              // 'a4' | 'letter' | [width, height]
})

const pageWidth = doc.internal.pageSize.getWidth()    // 210 for A4
const pageHeight = doc.internal.pageSize.getHeight()  // 297 for A4
const margin = 20
const contentWidth = pageWidth - margin * 2
```

### Core Drawing Operations

```typescript
// Text
doc.setFontSize(24)
doc.setTextColor(255, 255, 255)
doc.setFont('helvetica', 'bold')
doc.text('Title Text', margin, 50)

// Centered text
doc.text('Centered', pageWidth / 2, 50, { align: 'center' })

// Right-aligned text
doc.text('Right', pageWidth - margin, 50, { align: 'right' })

// Rectangles (filled)
doc.setFillColor(5, 5, 5)
doc.rect(0, 0, pageWidth, pageHeight, 'F')

// Rounded rectangles
doc.setFillColor(15, 15, 15)
doc.roundedRect(margin, y, contentWidth, 50, 3, 3, 'F')

// Rectangles with fill AND stroke
doc.setFillColor(5, 46, 22)
doc.setDrawColor(34, 197, 94)
doc.setLineWidth(0.5)
doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD')

// Lines
doc.setDrawColor(255, 46, 46)
doc.setLineWidth(0.5)
doc.line(margin, 55, margin + 30, 55)
```

### Text Wrapping

jsPDF does not auto-wrap. Use `splitTextToSize` to break long text into lines that fit a given width.

```typescript
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  yPos: number,
  maxWidth: number,
  lineHeight: number = 5
): number {
  const safeStr = safeText(text)
  const lines = doc.splitTextToSize(safeStr, maxWidth)
  doc.text(lines, x, yPos)
  return yPos + lines.length * lineHeight
}

// Usage:
y = addWrappedText(doc, longParagraph, margin, y, contentWidth)
```

### Page Break Management

Track the current Y position and add a new page before content overflows.

```typescript
let y = margin

function checkNewPage(doc: jsPDF, neededSpace: number): void {
  if (y + neededSpace > pageHeight - margin) {
    doc.addPage()
    // Re-draw background on new page (for dark themes)
    doc.setFillColor(5, 5, 5)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
    y = margin
  }
}

// Before rendering a card:
const cardHeight = 20 + (item.evidence?.length || 0) * 6
checkNewPage(doc, cardHeight + 10)
```

### Dark Theme Full-Page Background

For dark-themed PDFs, fill every page with a background color immediately after creating it.

```typescript
// Initial page
doc.setFillColor(5, 5, 5)
doc.rect(0, 0, pageWidth, pageHeight, 'F')

// Every new page
doc.addPage()
doc.setFillColor(5, 5, 5)
doc.rect(0, 0, pageWidth, pageHeight, 'F')
y = margin
```

### Persistent Footer

```typescript
function addFooter(doc: jsPDF, pageLabel: string): void {
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setDrawColor(102, 102, 102)
  doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15)
  doc.setTextColor(102, 102, 102)
  doc.setFontSize(8)
  doc.text('AIDEN Pressure Test', 20, pageHeight - 10)
  doc.text(pageLabel, pageWidth - 20, pageHeight - 10, { align: 'right' })
}

// Call at end of each page section:
addFooter(doc, 'Page 2')
```

### Score Cards in jsPDF

Render multiple metric cards side-by-side using calculated x offsets.

```typescript
const scores = [
  { value: result.pressure_score, label: 'Pressure Score' },
  { value: result.gut_attraction_index, label: 'Gut Attraction' },
  { value: result.credibility_score, label: 'Credibility' },
]

const cardWidth = (contentWidth - 20) / 3
scores.forEach((score, i) => {
  const x = margin + i * (cardWidth + 10)
  const [r, g, b] = hexToRgb(getScoreColor(score.value))

  doc.setTextColor(r, g, b)
  doc.setFontSize(32)
  doc.text(String(Math.round(score.value)), x + cardWidth / 2, y, { align: 'center' })

  doc.setTextColor(153, 153, 153)
  doc.setFontSize(8)
  doc.text(score.label.toUpperCase(), x + cardWidth / 2, y + 10, { align: 'center' })

  // Progress bar
  doc.setFillColor(30, 30, 30)
  doc.rect(x, y + 15, cardWidth, 3, 'F')
  doc.setFillColor(r, g, b)
  doc.rect(x, y + 15, cardWidth * (score.value / 100), 3, 'F')
})
```

### Color Utility: Hex to RGB

jsPDF uses RGB tuples, not hex strings. Convert with this helper.

```typescript
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 255, 255]
}
```

### Font Management in jsPDF

```typescript
// Built-in fonts
doc.setFont('helvetica', 'normal')     // Regular
doc.setFont('helvetica', 'bold')       // Bold
doc.setFont('helvetica', 'italic')     // Italic
doc.setFont('courier', 'normal')       // Monospace
doc.setFont('times', 'normal')         // Serif

// Custom fonts (must be base64 encoded)
// doc.addFont(base64FontData, 'CustomFont', 'normal')
// doc.setFont('CustomFont', 'normal')
```

### Adding Images in jsPDF

```typescript
// From base64
const base64Logo = 'data:image/png;base64,iVBOR...'
doc.addImage(base64Logo, 'PNG', x, y, width, height)

// From URL (must fetch first)
async function addImageFromURL(doc: jsPDF, url: string, x: number, y: number, w: number, h: number) {
  const response = await fetch(url)
  const blob = await response.blob()
  const reader = new FileReader()
  return new Promise<void>((resolve) => {
    reader.onloadend = () => {
      doc.addImage(reader.result as string, 'PNG', x, y, w, h)
      resolve()
    }
    reader.readAsDataURL(blob)
  })
}
```

### jsPDF autoTable Plugin

For structured data grids, use the `jspdf-autotable` plugin.

```typescript
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const doc = new jsPDF()

autoTable(doc, {
  startY: 30,
  head: [['Name', 'Archetype', 'Intent', 'Credibility']],
  body: responses.map(r => [
    r.generated_name,
    r.archetype.name,
    String(r.response_data.purchase_intent),
    String(r.response_data.credibility_rating),
  ]),
  theme: 'grid',
  headStyles: { fillColor: [255, 46, 46], textColor: [255, 255, 255] },
  styles: { fontSize: 9, cellPadding: 3 },
  alternateRowStyles: { fillColor: [15, 15, 15] },
})
```

---

## Server-Side PDF Generation (Next.js API Route)

Use jsPDF in API routes since it has no React dependency. Return the PDF as a binary response with proper headers.

```typescript
// app/api/tests/[testId]/export/route.tsx
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { generatePDF } from '@/lib/export/jspdf-generator'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params
    const auth = await requireAuth()
    if (!auth.success) return auth.response

    const adminClient = createAdminClient()

    const { data: test, error } = await adminClient
      .from('pressure_tests')
      .select('*, projects (id, name, category), test_results (*)')
      .eq('id', testId)
      .single()

    if (error || test.status !== 'completed') {
      return NextResponse.json({ error: 'Test not available' }, { status: 400 })
    }

    const resultData = test.test_results?.[0]
    if (!resultData) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 })
    }

    // Generate PDF -- returns ArrayBuffer
    const pdfArrayBuffer = generatePDF(
      { name: test.name, stimulus_type: test.stimulus_type, created_at: test.created_at },
      { name: test.projects.name },
      { pressure_score: resultData.pressure_score || 0, /* ... */ }
    )

    const pdfBuffer = Buffer.from(pdfArrayBuffer)
    const sanitizedName = test.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    const filename = `${sanitizedName}_report_${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

// Force Node.js runtime -- Edge runtime lacks some jsPDF dependencies
export const runtime = 'nodejs'
```

### Server-Side with @react-pdf/renderer

If you need the declarative approach server-side, use `renderToBuffer`:

```typescript
import { renderToBuffer } from '@react-pdf/renderer'
import { PressureTestReport } from '@/lib/export/pdf-generator'

// Inside API route:
const pdfBuffer = await renderToBuffer(
  <PressureTestReport test={test} project={project} result={result} responses={responses} />
)

return new NextResponse(pdfBuffer, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${filename}"`,
  },
})
```

**Note**: `renderToBuffer` and `renderToStream` require Node.js runtime. They will not work on Edge.

---

## Client-Side Download Triggers

### Method 1: Fetch from API Route (Preferred for Server-Generated PDFs)

```typescript
async function downloadPDF(testId: string) {
  const response = await fetch(`/api/tests/${testId}/export`)
  if (!response.ok) throw new Error('Export failed')

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report_${testId}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Method 2: jsPDF Client-Side Direct Save

```typescript
// jsPDF has a built-in save method that triggers browser download
const doc = new jsPDF('p', 'mm', 'a4')
// ... build the document ...
doc.save('campaign_overview.pdf')   // triggers download
```

### Method 3: jsPDF Output Formats

```typescript
// ArrayBuffer (for sending to server or further processing)
const arrayBuffer = doc.output('arraybuffer')

// Blob (for creating object URLs)
const blob = doc.output('blob')

// Data URI (for embedding or previewing)
const dataUri = doc.output('datauristring')

// Base64 string
const base64 = doc.output('dataurlstring')
```

### Method 4: JSON/Blob Download Pattern

For non-PDF exports (JSON, CSV) alongside PDF, use the same blob pattern.

```typescript
function exportJSON(data: object, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Export Hook Pattern (React)

Encapsulate export logic in a custom hook with loading state.

```typescript
import { useState, useCallback } from 'react'
import jsPDF from 'jspdf'

interface UseExportReturn {
  isExportingPDF: boolean
  exportPDF: () => Promise<void>
  exportJSON: () => void
}

export function useExport({ data, filename }: { data: ExportData; filename: string }): UseExportReturn {
  const [isExportingPDF, setIsExportingPDF] = useState(false)

  const exportPDF = useCallback(async () => {
    setIsExportingPDF(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 15
      const maxWidth = pageWidth - 2 * margin
      let yPos = margin

      const checkPageBreak = (needed: number = 30) => {
        if (yPos > pdf.internal.pageSize.getHeight() - margin - needed) {
          pdf.addPage()
          yPos = margin
        }
      }

      const addText = (text: string, size: number = 10, bold: boolean = false) => {
        pdf.setFontSize(size)
        pdf.setFont('helvetica', bold ? 'bold' : 'normal')
        const lines = pdf.splitTextToSize(text, maxWidth)
        lines.forEach((line: string) => {
          checkPageBreak()
          pdf.text(line, margin, yPos)
          yPos += size * 0.35
        })
        yPos += 3
      }

      // Build document sections...
      addText(data.title, 24, true)
      // ... more sections ...

      pdf.save(`${filename}.pdf`)
    } catch (error) {
      console.error('PDF generation failed:', error)
      throw error
    } finally {
      setIsExportingPDF(false)
    }
  }, [data, filename])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [data, filename])

  return { isExportingPDF, exportPDF, exportJSON }
}
```

---

## Common Pitfalls and Solutions

### 1. Bare strings in @react-pdf/renderer
**Problem**: `<View>Some text</View>` throws Error #31.
**Solution**: Always wrap in `<Text>`: `<View><Text>Some text</Text></View>`.

### 2. Objects rendered as text
**Problem**: Database returns nested objects where strings are expected.
**Solution**: Use `safeText()` on every dynamic value.

### 3. Edge runtime incompatibility
**Problem**: PDF libraries need Node.js APIs not available in Edge runtime.
**Solution**: Add `export const runtime = 'nodejs'` to API routes.

### 4. Missing page backgrounds on new pages
**Problem**: `doc.addPage()` creates a white page even in dark-themed reports.
**Solution**: Immediately fill the background after every `addPage()` call.

### 5. Unhandled content overflow in jsPDF
**Problem**: Text overflows the page bottom and disappears.
**Solution**: Always call `checkNewPage()` before rendering variable-height content.

### 6. Style array merging in @react-pdf/renderer
**Problem**: Need to combine static and dynamic styles.
**Solution**: Use the array syntax: `style={[styles.base, { color: dynamicColor }]}`.

### 7. Large reports with many pages
**Problem**: Memory usage grows with page count.
**Solution**: For @react-pdf/renderer, use `renderToStream` instead of `renderToBuffer` for streaming output. For jsPDF, chunk data and reuse the single doc instance.

### 8. Content-Disposition filename
**Problem**: Browser shows generic filename for downloaded PDF.
**Solution**: Set `Content-Disposition: attachment; filename="descriptive_name.pdf"` in response headers. Sanitize the filename to remove special characters.

## File Structure Convention

```
lib/export/
  report-styles.ts              # Shared design tokens, StyleSheet, helpers
  pdf-generator.tsx             # @react-pdf/renderer Document component
  jspdf-generator.ts            # jsPDF imperative generator (fallback)
  minimal-pdf.tsx               # Minimal @react-pdf/renderer for testing
  components/
    cover-page.tsx              # Cover page section
    executive-summary.tsx       # Executive summary section
    scores-dashboard.tsx        # Score cards section
    strengths-section.tsx       # Strengths with evidence cards
    weaknesses-section.tsx      # Weaknesses with severity badges
    recommendations-section.tsx # Prioritized recommendations
    persona-appendix.tsx        # Multi-page appendix
app/api/tests/[testId]/export/
  route.tsx                     # API route that generates and returns PDF
```
