const INTERNAL_HOSTS = new Set(['hmturqueti.com', 'www.hmturqueti.com', 'localhost', '127.0.0.1'])

function isSpecialInternalHref(href: string) {
  return href.startsWith('#') || href.startsWith('?')
}

export function isInternalHref(href: string) {
  const normalizedHref = href.trim()

  if (!normalizedHref) {
    return false
  }

  if (isSpecialInternalHref(normalizedHref)) {
    return true
  }

  if (normalizedHref.startsWith('/')) {
    return !normalizedHref.startsWith('//')
  }

  if (normalizedHref.startsWith('mailto:') || normalizedHref.startsWith('tel:')) {
    return false
  }

  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(normalizedHref)) {
    return true
  }

  try {
    const url = new URL(normalizedHref)
    return (url.protocol === 'http:' || url.protocol === 'https:') && INTERNAL_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

export function isSamePageHref(href: string) {
  return isSpecialInternalHref(href.trim())
}

export function mergeRelValues(...values: Array<string | undefined>) {
  const parts = values
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .map((value) => value.trim())
    .filter(Boolean)

  return Array.from(new Set(parts)).join(' ')
}
