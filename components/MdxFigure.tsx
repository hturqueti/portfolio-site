type MdxFigureProps = {
  src: string
  alt: string
  caption?: string
}

function normalizeCaption(caption?: string) {
  return caption?.trim().replace(/\.+$/, '')
}

export function MdxFigure({ src, alt, caption }: MdxFigureProps) {
  const normalizedCaption = normalizeCaption(caption)

  return (
    <figure className="mdx-figure">
      <img src={src} alt={alt} className="mdx-figure-image" loading="lazy" />
      {normalizedCaption ? <figcaption className="mdx-figure-caption">{normalizedCaption}</figcaption> : null}
    </figure>
  )
}
