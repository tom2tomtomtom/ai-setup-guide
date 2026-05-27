import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../lib/cn'

export function MarkdownCodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const text = extractText(children)

  const onCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  return (
    <div className="not-prose card overflow-hidden my-4 relative">
      <pre className="m-0 p-4 pr-20 text-sm font-mono text-ink whitespace-pre-wrap break-words overflow-x-auto max-h-[480px]">
        {children}
      </pre>
      {text && (
        <button
          onClick={onCopy}
          className={cn(
            'absolute top-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm',
            copied
              ? 'bg-ok text-white'
              : 'bg-bg-subtle text-ink-muted hover:bg-border hover:text-ink',
          )}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
    </div>
  )
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props
    return extractText(props?.children)
  }
  return ''
}
