// utils/interpolate.ts
export function interpolate(template: string, args: Record<string, string | number> = {}) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => args[key]?.toString() ?? '')
}
