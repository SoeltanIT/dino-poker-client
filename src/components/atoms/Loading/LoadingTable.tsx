'use client'

import { cn } from '@/lib/utils'

interface LoadingTableProps {
  rows?: number
  columns?: number
  className?: string
  showHeader?: boolean
}

export function LoadingTable({ rows = 5, columns = 4, className, showHeader = true }: LoadingTableProps) {
  return (
    <div className={cn('w-full', className)} role='status' aria-label='Loading table'>
      <div className='overflow-hidden rounded-lg'>
        {showHeader && (
          <div className='bg-app-table-bg-header'>
            <div className='flex gap-4 p-4'>
              {Array.from({ length: columns }).map((_, i) => (
                <div
                  key={i}
                  className='h-4 bg-app-table-text-body rounded animate-pulse flex-1'
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div className='divide-y divide-app-table-border-body bg-app-table-bg-body'>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className='p-4'>
              <div className='flex gap-4'>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className='h-4 bg-app-table-text-body rounded animate-pulse flex-1'
                    style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
