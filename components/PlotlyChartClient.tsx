'use client'

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import type { Data, Frame, Layout } from 'plotly.js'

export type PlotlyFigure = {
  data?: unknown[]
  layout?: Record<string, unknown>
  frames?: unknown[]
}

export function PlotlyChartClient({ figure, ariaLabel }: { figure: PlotlyFigure; ariaLabel?: string }) {
  const [PlotComponent, setPlotComponent] = useState<ComponentType<Record<string, unknown>> | null>(null)
  const [plotError, setPlotError] = useState('')
  const figureData = (figure.data ?? []) as Array<Record<string, unknown>>
  const hasLegacyMapboxTrace = figureData.some((trace) =>
    typeof trace.type === 'string' && trace.type.endsWith('mapbox')
  )
  const hasMapTrace =
    hasLegacyMapboxTrace ||
    figureData.some((trace) => trace.type === 'densitymap' || trace.type === 'scattermap' || trace.type === 'choroplethmap')

  const normalizedData = figureData

  const figureLayout = { ...(figure.layout as Partial<Layout> | undefined) }

  if (hasLegacyMapboxTrace) {
    const legacyMapbox = (figureLayout as Partial<Layout> & { mapbox?: Record<string, unknown> }).mapbox

    ;(figureLayout as Partial<Layout> & { mapbox?: Record<string, unknown> }).mapbox = {
      style: 'carto-positron',
      ...(legacyMapbox ?? {}),
    }
  }

  const layout: Partial<Layout> = {
    ...figureLayout,
    autosize: true,
    width: undefined,
    height: typeof figureLayout?.height === 'number' ? figureLayout.height : hasMapTrace ? 520 : 450,
    paper_bgcolor: figureLayout?.paper_bgcolor ?? '#ffffff',
    plot_bgcolor: figureLayout?.plot_bgcolor ?? '#ffffff',
    margin: {
      t: 32,
      r: 28,
      b: 32,
      l: 28,
      ...figureLayout?.margin,
    },
  }

  useEffect(() => {
    let active = true

    async function loadPlotComponent() {
      try {
        const module = await import('react-plotly.js')

        if (!active) {
          return
        }

        setPlotComponent(() => module.default as unknown as ComponentType<Record<string, unknown>>)
      } catch (caughtError) {
        if (!active) {
          return
        }

        setPlotError(caughtError instanceof Error ? caughtError.message : String(caughtError))
      }
    }

    void loadPlotComponent()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="plotly-chart">
      <div className="plotly-chart-frame">
        {plotError ? (
          <div className="mermaid-diagram-fallback">
            <strong>Não foi possível renderizar o gráfico.</strong>
            <pre className="mermaid-error-details">{plotError}</pre>
          </div>
        ) : PlotComponent ? (
          <PlotComponent
            data={normalizedData as Data[]}
            layout={layout}
            frames={figure.frames as Frame[] | undefined}
            config={{
              responsive: true,
              displaylogo: false,
            }}
            onError={(caughtError: unknown) => {
              setPlotError(caughtError instanceof Error ? caughtError.message : String(caughtError))
            }}
            aria-label={ariaLabel}
            useResizeHandler
            style={{ width: '100%', height: `${layout.height ?? (hasMapTrace ? 520 : 450)}px` }}
          />
        ) : (
          <div className="mermaid-diagram-fallback">Renderizando gráfico...</div>
        )}
      </div>
    </div>
  )
}
