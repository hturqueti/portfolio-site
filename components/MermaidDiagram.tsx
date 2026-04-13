'use client'

import type { ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'

type MermaidDiagramProps = {
  chart?: string
  caption?: string
  children?: ReactNode
  src?: string
}

let initialized = false

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return getTextContent((node as { props?: { children?: ReactNode } }).props?.children)
  }

  return ''
}

export function MermaidDiagram({ chart, caption, children, src }: MermaidDiagramProps) {
  const mermaidId = useId().replace(/:/g, '-')
  const [mounted, setMounted] = useState(false)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [diagramSource, setDiagramSource] = useState(() =>
    (typeof chart === 'string' ? chart : getTextContent(children)).trim()
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const inlineSource = (typeof chart === 'string' ? chart : getTextContent(children)).trim()

    if (inlineSource) {
      setDiagramSource(inlineSource)
      return
    }

    if (!src) {
      setDiagramSource('')
      return
    }

    const diagramUrl = src
    let active = true

    async function loadDiagramSource() {
      try {
        const response = await fetch(diagramUrl)

        if (!response.ok) {
          throw new Error(`Falha ao carregar o arquivo Mermaid: ${response.status}`)
        }

        const text = (await response.text()).trim()

        if (!active) {
          return
        }

        setDiagramSource(text)
      } catch (caughtError) {
        if (!active) {
          return
        }

        setDiagramSource('')
        setSvg('')
        setError(true)
        setErrorMessage(
          caughtError instanceof Error ? caughtError.message : String(caughtError)
        )
      }
    }

    void loadDiagramSource()

    return () => {
      active = false
    }
  }, [chart, children, src])

  useEffect(() => {
    if (!mounted) {
      return
    }

    let active = true

    async function renderDiagram() {
      if (!diagramSource) {
        setSvg('')
        setError(true)
        setErrorMessage('O diagrama Mermaid está vazio.')
        return
      }

      try {
        const mermaid = (await import('mermaid')).default

        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            fontFamily: '"Noto Sans", ui-sans-serif, system-ui, sans-serif',
            themeVariables: {
              background: '#fefefc',
              primaryColor: '#ffffff',
              primaryTextColor: '#030303',
              primaryBorderColor: '#e00450',
              secondaryColor: '#fff4ef',
              secondaryTextColor: '#030303',
              secondaryBorderColor: '#fd6a31',
              tertiaryColor: '#f6f6f6',
              tertiaryTextColor: '#030303',
              tertiaryBorderColor: 'rgba(3, 3, 3, 0.12)',
              lineColor: '#595959',
              textColor: '#030303',
              mainBkg: '#ffffff',
              clusterBkg: '#f6f6f6',
              clusterBorder: '#e00450',
              edgeLabelBackground: '#fefefc',
            },
            er: {
              useMaxWidth: true,
            },
          })

          initialized = true
        }

        await mermaid.parse(diagramSource)
        const { svg: renderedSvg } = await mermaid.render(`mermaid-${mermaidId}`, diagramSource)

        if (!active) {
          return
        }

        setSvg(renderedSvg)
        setError(false)
        setErrorMessage('')
      } catch (caughtError) {
        if (!active) {
          return
        }

        setSvg('')
        setError(true)
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : typeof caughtError === 'object' && caughtError && 'str' in caughtError
              ? String((caughtError as { str?: unknown }).str)
              : String(caughtError)

        console.error('Mermaid render error:', caughtError)
        setErrorMessage(message)
      }
    }

    void renderDiagram()

    return () => {
      active = false
    }
  }, [diagramSource, mounted, mermaidId])

  return (
    <figure className="mdx-figure">
      <div className="mermaid-diagram-shell">
        {!mounted ? (
          <div className="mermaid-diagram-fallback">Renderizando diagrama...</div>
        ) : error ? (
          <div className="mermaid-diagram-fallback">
            <strong>Não foi possível renderizar o diagrama.</strong>
            {errorMessage ? <pre className="mermaid-error-details">{errorMessage}</pre> : null}
          </div>
        ) : svg ? (
          <div
            className="mermaid-diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="mermaid-diagram-fallback">Renderizando diagrama...</div>
        )}
      </div>
      {caption ? <figcaption className="mdx-figure-caption">{caption}</figcaption> : null}
    </figure>
  )
}
