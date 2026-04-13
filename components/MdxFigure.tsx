type MdxFigureProps = {
  src: string
  alt: string
  caption?: string
}

export function MdxFigure({ src, alt, caption }: MdxFigureProps) {
  return (
    <figure className="mdx-figure">
      <img src={src} alt={alt} className="mdx-figure-image" loading="lazy" />
      {caption ? <figcaption className="mdx-figure-caption">{caption}</figcaption> : null}
    </figure>
  )
}
