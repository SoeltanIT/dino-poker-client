import React from 'react'

import { cn } from '@/lib/utils'

import { LoadingText } from '@/components/atoms/Loading'
import { EmptyTable } from '@/components/molecules/EmptyState'
import { RowData } from '@tanstack/react-table'
import { DataTableColumn } from './types'

interface MobileTableProps<T extends RowData> {
  columns: DataTableColumn<T>[]
  data: T[]
  className?: string
  rowClassName?: string | ((row: T, index: number) => string)
  onRowClick?: (row: T, index: number) => void
  renderMobileRows: (row: T, index: number) => React.ReactNode
  mobileHeader?: React.ReactNode
  classNames?: {
    table?: string
    header?: string
    content?: string
    row?: string
    contentWrapper?: string
  }
  loading?: boolean
  emptyState?: {
    message?: string
    image?: string
  }
}

export const MobileTable = <T extends RowData>({
  columns,
  data,
  className,
  rowClassName,
  onRowClick,
  renderMobileRows,
  mobileHeader,
  classNames,
  loading,
  emptyState
}: MobileTableProps<T>) => {
  return (
    <div className={cn('w-full', className, classNames?.table)}>
      {/* Mobile Header */}
      {mobileHeader && (
        <div className={cn(classNames?.header)}>
          <div className='flex h-12 items-center px-3'>
            <div className='text-lg font-semibold mb-4'>{mobileHeader}</div>
          </div>
        </div>
      )}

      {/* Mobile Content */}
      <div className={cn('p-1', classNames?.content)}>
        <div className={cn('flex flex-col gap-px overflow-hidden rounded-lg space-y-3', classNames?.contentWrapper)}>
          {loading ? (
            <LoadingText lines={3} />
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <div
                key={index}
                className={cn(
                  'bg-ds-bg-lv3 backdrop-blur-sm backdrop-filter transition-colors',
                  classNames?.row,
                  onRowClick && 'cursor-pointer hover:bg-ds-bg-lv4',
                  typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName
                )}
                onClick={() => onRowClick?.(row, index)}
              >
                {renderMobileRows(row, index)}
              </div>
            ))
          ) : (
            <EmptyTable message={emptyState?.message} image={emptyState?.image} />
          )}
        </div>
      </div>
    </div>
  )
}
