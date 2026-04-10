import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import { MdxCallout } from '@/components/MdxCallout'

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
}
