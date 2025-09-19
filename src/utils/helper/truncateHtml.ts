export function truncateHtml(html: string, limit: number, ellipsis = '...'): string {
  const tagStack: string[] = []
  let charCount = 0
  let result = ''
  let i = 0

  while (i < html.length && charCount < limit) {
    const currentChar = html[i]

    if (currentChar === '<') {
      // Handle HTML tags
      const endOfTag = html.indexOf('>', i)
      if (endOfTag === -1) break // invalid HTML

      const tagContent = html.slice(i + 1, endOfTag).trim()
      const isClosing = tagContent.startsWith('/')
      const tagName = tagContent.replace('/', '').split(' ')[0]

      const fullTag = html.slice(i, endOfTag + 1)
      result += fullTag
      i = endOfTag + 1

      // Stack logic
      if (!isClosing && !tagContent.endsWith('/')) {
        tagStack.push(tagName)
      } else if (isClosing) {
        tagStack.pop()
      }
    } else {
      // Text content
      result += currentChar
      charCount++
      i++
    }
  }

  // Append ellipsis if truncation occurred
  if (i < html.length) result += ellipsis

  // Close remaining open tags
  while (tagStack.length > 0) {
    const tag = tagStack.pop()
    result += `</${tag}>`
  }

  return result
}
