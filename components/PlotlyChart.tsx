import fs from 'node:fs'
import path from 'node:path'
import { PlotlyChartClient, type PlotlyFigure } from '@/components/PlotlyChartClient'

export function PlotlyChart({ src }: { src: string }) {
  const filePath = path.join(process.cwd(), 'content', 'plots', src)
  const raw = fs.readFileSync(filePath, 'utf8')
  const figure = JSON.parse(raw) as PlotlyFigure

  return <PlotlyChartClient figure={figure} />
}
