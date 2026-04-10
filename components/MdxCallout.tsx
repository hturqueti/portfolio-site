import type { ReactNode } from 'react'

type MdxCalloutProps = {
  title?: string
  children: ReactNode
}

export function MdxCallout({ title, children }: MdxCalloutProps) {
  return (
    <aside className="surface-card">
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </aside>
  )
}
