import React from 'react'

import { IconSize } from '@/components/atoms/Icons'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { PaginationProps } from './types'

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages)
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    // Add first page
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className={cn('flex items-center justify-center gap-2 px-4 pb-4 pt-3', className)}>
      <div className='flex items-center gap-2'>
        {/* Previous button */}
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant='ghost' size='icon'>
          <ChevronLeftIcon size={IconSize.sm} className='text-ds-grey-80' />
        </Button>

        {/* Page numbers */}
        {showPageNumbers && (
          <>
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <div className='flex h-8 w-8 items-center justify-center'>
                    <span className='text-sm text-ds-grey-80'>...</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => onPageChange(page as number)}
                    variant={page === currentPage ? 'default' : 'ghost'}
                    size='icon'
                    className={page === currentPage ? 'bg-app-primary text-white' : ''}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </>
        )}

        {/* Next button */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant='ghost'
          size='icon'
        >
          <ChevronRightIcon size={IconSize.sm} className='text-ds-grey-80' />
        </Button>
      </div>
    </div>
  )
}
