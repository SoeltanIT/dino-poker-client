'use client'

import { LoadingTable } from '@/components/atoms/Loading'
import { EmptyTable } from '@/components/molecules/EmptyState'
import { DataTableProps } from '@/components/molecules/Table/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ColumnDef, flexRender, getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table'

export const DesktopTable = <T extends RowData>({
  //   title,
  data,
  columns,
  //   footer,
  emptyState,
  pagination,
  loading,
  className,
  rowClassName,
  onRowClick,
  classNames
}: DataTableProps<T>) => {
  // Convert our custom columns to react-table columns
  const tableColumns: ColumnDef<T>[] = columns.map(col => ({
    id: col.key as string,
    accessorKey: col.accessor as string,
    header: () => col.header,
    cell: ({ row }) => {
      const value = row.original[col.accessor as keyof T]
      return col.render ? col.render(value, row) : (value as React.ReactNode)
    },
    meta: {
      className: col.className
    }
  }))

  // Determine if we're using server-side or client-side pagination
  // const isServerPagination = !!serverPagination

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div>
      <Table
        style={
          {
            '--border': 'var(--table-border-body)'
          } as React.CSSProperties
        }
        className='border-separate border-spacing-0 mb-2'
      >
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className='bg-app-table-bg-header rounded-[8px] pb-2.5'>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={`${header.id}-${index}`}
                  className={cn(
                    'px-4 py-3 text-neutral-500 capitalize text-app-table-text-header uppercase text-sm font-semibold first:rounded-l-lg last:rounded-r-lg min-w-48',
                    (header.column.columnDef.meta as { className?: string })?.className
                  )}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className={cn(
            'before:content-[" "] before:block before:h-2.5 before:invisible before:overflow-hidden before:clear-both',
            '[&>tr:first-child_td:first-child]:rounded-tl-lg',
            '[&>tr:first-child_td:last-child]:rounded-tr-lg',
            '[&>tr:last-child_td:first-child]:rounded-bl-lg',
            '[&>tr:last-child_td:last-child]:rounded-br-lg',
            '[&>tr:first-child_td]:border-t',
            '[&>tr:last-child_td]:border-b',
            '[&>tr_td:first-child]:border-l',
            '[&>tr_td:last-child]:border-r'
          )}
        >
          {loading ? (
            <TableRow className='bg-app-table-bg-body'>
              <TableCell colSpan={columns.length} className='p-0'>
                <LoadingTable />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={`${row.id}-${index}`}
                onClick={() => onRowClick?.(row.original, index)}
                className={cn('bg-app-table-bg-body', onRowClick ? 'cursor-pointer hover:bg-app-table-hover-bg' : '')}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={`${cell.id}-${index}`}
                    className={cn(
                      'p-4 text-neutral-800 capitalize text-app-text-color border-app-table-border-body min-w-48',
                      (cell.column.columnDef.meta as { className?: string })?.className
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='p-0 capitalize'>
                <EmptyTable
                  message={emptyState?.message || 'No data found'}
                  image={emptyState?.image || '/images/betNotFound.png'}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
