import type { ReactNode } from 'react'

type MdxCalloutProps = {
  type?: string
  title?: string
  foldable?: boolean | string
  defaultOpen?: boolean | string
  children: ReactNode
}

const calloutAliases: Record<string, string> = {
  abstract: 'abstract',
  attention: 'warning',
  bug: 'bug',
  caution: 'warning',
  check: 'success',
  cite: 'quote',
  danger: 'danger',
  done: 'success',
  error: 'danger',
  example: 'example',
  fail: 'failure',
  failure: 'failure',
  faq: 'question',
  help: 'question',
  hint: 'tip',
  important: 'tip',
  info: 'info',
  missing: 'failure',
  note: 'note',
  question: 'question',
  quote: 'quote',
  success: 'success',
  summary: 'abstract',
  tip: 'tip',
  tldr: 'abstract',
  todo: 'todo',
  warning: 'warning',
}

function normalizeType(value?: string) {
  const normalized = (value ?? 'note').toLowerCase()
  return calloutAliases[normalized] ?? 'note'
}

function getCalloutTitle(type: string, title?: string) {
  if (title) {
    return title
  }

  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function MdxCallout({ type, title, foldable = false, defaultOpen = true, children }: MdxCalloutProps) {
  const normalizedType = normalizeType(type)
  const resolvedTitle = getCalloutTitle(normalizedType, title)
  const isFoldable = foldable === true || foldable === 'true'
  const isDefaultOpen = defaultOpen === true || defaultOpen === 'true'

  const header = (
    <>
      <span className={`mdx-callout-icon mdx-callout-icon-${normalizedType}`} aria-hidden="true" />
      <strong className="mdx-callout-title">{resolvedTitle}</strong>
    </>
  )

  if (isFoldable) {
    return (
      <details className={`mdx-callout mdx-callout-${normalizedType}`} open={isDefaultOpen}>
        <summary className="mdx-callout-summary">
          {header}
        </summary>
        <div className="mdx-callout-body">{children}</div>
      </details>
    )
  }

  return (
    <aside className={`mdx-callout mdx-callout-${normalizedType}`}>
      <div className="mdx-callout-header">
        {header}
      </div>
      <div className="mdx-callout-body">{children}</div>
    </aside>
  )
}
