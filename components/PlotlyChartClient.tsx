'use client'

import dynamic from 'next/dynamic'
import type { Data, Frame, Layout } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export type PlotlyFigure = {
  data?: unknown[]
  layout?: Record<string, unknown>
  frames?: unknown[]
}

export function PlotlyChartClient({ figure }: { figure: PlotlyFigure }) {
  const layout: Partial<Layout> = {
    ...figure.layout,
    autosize: true,
    width: undefined,
    height: undefined,
    paper_bgcolor: 'transparent',
  }

  return (
    <div className="plotly-chart">
      <Plot
        data={(figure.data ?? []) as Data[]}
        layout={layout}
        frames={figure.frames as Frame[] | undefined}
        config={{
          responsive: true,
          displaylogo: false,
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
