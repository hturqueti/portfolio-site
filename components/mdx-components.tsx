import type { ComponentPropsWithoutRef } from 'react'
import { MdxCallout } from '@/components/MdxCallout'
import { MdxFigure } from '@/components/MdxFigure'
import { MermaidDiagram } from '@/components/MermaidDiagram'
import { MdxPre } from '@/components/MdxPre'
import { PlotlyChart } from '@/components/PlotlyChart'
import { SmartLink } from '@/components/SmartLink'

type AnchorProps = ComponentPropsWithoutRef<'a'>

function MdxAnchor({ href = '', ...props }: AnchorProps) {
  return <SmartLink href={href} {...props} />
}

export const mdxComponents = {
  a: MdxAnchor,
  MdxCallout,
  MdxFigure,
  MermaidDiagram,
  PlotlyChart,
  pre: MdxPre,
}
