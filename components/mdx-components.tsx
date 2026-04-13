import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import { MdxCallout } from '@/components/MdxCallout'
import { MdxFigure } from '@/components/MdxFigure'
import { MermaidDiagram } from '@/components/MermaidDiagram'
import { MdxPre } from '@/components/MdxPre'
import { PlotlyChart } from '@/components/PlotlyChart'

type AnchorProps = ComponentPropsWithoutRef<'a'>

function MdxAnchor({ href = '', ...props }: AnchorProps) {
  if (href.startsWith('/')) {
    return <Link href={href} {...props} />
  }

  return <a href={href} target="_blank" rel="noreferrer" {...props} />
}

export const mdxComponents = {
  a: MdxAnchor,
  MdxCallout,
  MdxFigure,
  MermaidDiagram,
  PlotlyChart,
  pre: MdxPre,
}
