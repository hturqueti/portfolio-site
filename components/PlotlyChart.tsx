import fs from 'node:fs'
import path from 'node:path'
import { PlotlyChartClient, type PlotlyFigure } from '@/components/PlotlyChartClient'

type PlotlyChartProps = {
  src: string
  alt?: string
  caption?: string
}

function normalizeCaption(caption?: string) {
  return caption?.trim().replace(/\.+$/, '')
}

export function PlotlyChart({ src, alt, caption }: PlotlyChartProps) {
  const filePath = path.join(process.cwd(), 'content', 'plots', src)
  const raw = fs.readFileSync(filePath, 'utf8')
  const figure = JSON.parse(raw) as PlotlyFigure
  const normalizedCaption = normalizeCaption(caption)

  return (
    <figure className="mdx-figure">
      <PlotlyChartClient figure={figure} ariaLabel={alt} />
      {normalizedCaption ? <figcaption className="mdx-figure-caption">{normalizedCaption}</figcaption> : null}
    </figure>
  )
}
