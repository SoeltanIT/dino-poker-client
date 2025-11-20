// utils/helper/interpolateReact.tsx
import { Fragment, ReactNode } from 'react'

export function interpolateReact(template: string, args: Record<string, string | number | ReactNode>): ReactNode {
  const parts = template?.split(/{{(\w+)}}/g)

  return parts
    ?.map((part, index) => {
      // Odd indices are the keys
      if (index % 2 === 1) {
        const value = args[part] ?? part
        return <Fragment key={index}>{value}</Fragment>
      }
      return <Fragment key={index}>{part}</Fragment>
    })
    .filter(Boolean)
}
