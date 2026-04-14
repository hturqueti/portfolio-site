'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

type PreProps = ComponentPropsWithoutRef<'pre'>

type NodeWithChildren = {
  props: {
    children?: ReactNode
  }
}

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return getTextContent((node as NodeWithChildren).props.children)
  }

  return ''
}

export function MdxPre({ children, ...props }: PreProps) {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const textToCopy = getTextContent(children)
  const lineCount = textToCopy.replace(/\n$/, '').split('\n').length
  const isSingleLine = lineCount <= 1

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function handleCopy() {
    if (!textToCopy) {
      return
    }

    await navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsCopied(false)
    }, 5000)
  }

  return (
    <div className={`mdx-pre-wrap${isSingleLine ? ' mdx-pre-wrap-single-line' : ''}`}>
      <div
        className={`code-copy-controls${isSingleLine ? ' code-copy-controls-single-line' : ''}${isCopied ? ' code-copy-controls-copied' : ''}`}
      >
        <span
          className={`code-copy-feedback${isCopied ? ' code-copy-feedback-visible' : ''}`}
          aria-hidden="true"
        >
          Copiado
        </span>
        <button
          type="button"
          onClick={() => {
            void handleCopy()
          }}
          className="code-copy-button"
          aria-label={isCopied ? 'Código copiado' : 'Copiar código'}
        >
          <span
            className={`code-copy-icon${isCopied ? ' code-copy-icon-copied' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>
      <pre {...props}>{children}</pre>
    </div>
  )
}
