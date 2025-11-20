import React from 'react'

import { cn } from '@/lib/utils'

import { RowData } from '@tanstack/react-table'
import { DesktopTable } from './DesktopTable'
import { MobileTable } from './MobileTable'
import { Pagination } from './Pagination'
import { DataTableProps } from './types'

export const DataTable = <T extends RowData>({
  columns,
  data,
  pagination,
  loading = false,
  emptyState,
  className,
  rowClassName,
  onRowClick,
  renderMobileRows,
  mobileHeader,
  classNames
}: DataTableProps<T>) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return (
    <div className={cn('w-full', className, classNames?.root)}>
      {/* Main Table Container */}
      <div className={cn('relative', classNames?.wrapper)}>
        {/* Table Content */}
        {isMobile && renderMobileRows ? (
          <MobileTable
            columns={columns}
            data={data}
            rowClassName={rowClassName}
            onRowClick={onRowClick}
            renderMobileRows={renderMobileRows}
            mobileHeader={mobileHeader}
            classNames={classNames}
            loading={loading}
            emptyState={emptyState}
          />
        ) : (
          <DesktopTable
            columns={columns}
            data={data}
            rowClassName={rowClassName}
            onRowClick={onRowClick}
            classNames={classNames}
            loading={loading}
            emptyState={emptyState}
          />
        )}

        {/* Pagination */}
        {pagination && data.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            showPageNumbers={pagination.showPageNumbers}
            maxVisiblePages={pagination.maxVisiblePages}
            className={classNames?.pagination}
          />
        )}
      </div>
    </div>
  )
}
