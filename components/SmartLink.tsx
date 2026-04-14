import type { ComponentPropsWithoutRef } from 'react'
import { isInternalHref, isSamePageHref, mergeRelValues } from '@/lib/links'
import { ScrollTopLink } from '@/components/ScrollTopLink'

type SmartLinkProps = ComponentPropsWithoutRef<'a'>

export function SmartLink({ href = '', rel, ...props }: SmartLinkProps) {
  if (!href) {
    return <a {...props} />
  }

  if (isInternalHref(href)) {
    if (isSamePageHref(href)) {
      return <a href={href} rel={rel} {...props} />
    }

    return <ScrollTopLink href={href} rel={rel} {...props} />
  }

  return <a href={href} target="_blank" rel={mergeRelValues(rel, 'noopener', 'noreferrer')} {...props} />
}
