export function getInitials(fullName?: string | null): string {
  if (!fullName || typeof fullName !== 'string') return ''

  const names = fullName.trim().split(/\s+/).filter(Boolean)
  if (names.length === 0) return ''
  if (names.length === 1) return names[0][0]?.toUpperCase() ?? ''

  return (names[0][0]?.toUpperCase() ?? '') + (names[names.length - 1][0]?.toUpperCase() ?? '')
}
