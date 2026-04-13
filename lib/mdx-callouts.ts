function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function stripOneBlockquoteLevel(line: string) {
  return line.replace(/^>\s?/, '')
}

function buildCalloutTag(type: string, title: string, body: string, foldable: boolean, defaultOpen: boolean) {
  const props = [`type="${escapeAttribute(type)}"`]

  if (title) {
    props.push(`title="${escapeAttribute(title)}"`)
  }

  if (foldable) {
    props.push('foldable="true"')
    props.push(`defaultOpen="${defaultOpen ? 'true' : 'false'}"`)
  }

  const normalizedBody = body.trim()

  if (!normalizedBody) {
    return `<MdxCallout ${props.join(' ')} />`
  }

  return `<MdxCallout ${props.join(' ')}>\n${normalizedBody}\n</MdxCallout>`
}

export function transformObsidianCallouts(source: string): string {
  const lines = source.split(/\r?\n/)
  const output: string[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const match = line.match(/^>\s*\[!([a-z0-9-]+)\]([+-])?\s*(.*)$/i)

    if (!match) {
      output.push(line)
      continue
    }

    const [, rawType, foldMarker = '', rawTitle = ''] = match
    const calloutLines: string[] = []

    index += 1

    while (index < lines.length) {
      const nextLine = lines[index]

      if (/^>\s*\[!([a-z0-9-]+)\]([+-])?\s*(.*)$/i.test(nextLine)) {
        break
      }

      if (nextLine.trim() === '') {
        calloutLines.push('')
        index += 1
        continue
      }

      if (!/^>/.test(nextLine)) {
        break
      }

      calloutLines.push(stripOneBlockquoteLevel(nextLine))
      index += 1
    }

    index -= 1

    const type = rawType.toLowerCase()
    const title = rawTitle.trim() || titleCase(type)
    const foldable = foldMarker === '+' || foldMarker === '-'
    const defaultOpen = foldMarker !== '-'
    const body = transformObsidianCallouts(calloutLines.join('\n'))

    output.push(buildCalloutTag(type, title, body, foldable, defaultOpen))
  }

  return output.join('\n')
}
