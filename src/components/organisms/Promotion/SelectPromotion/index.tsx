'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PromotionSelectorProps } from './types'
import { IconTicket } from '@/components/atoms/Icons'
import { PromotionDTO } from '@/types/promotionDTO'
import { PromotionSkeletonList } from '@/components/molecules/Skeleton/PromotionSkeleton'
import { truncateHtml } from '@/utils/helper/truncateHtml'

export default function PromotionSelector({
  selectedPromotion,
  onSelect,
  lang,
  initialData,
  isLoading
}: PromotionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempSelected, setTempSelected] = useState<PromotionDTO | undefined>(undefined)

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Sync tempSelected with selectedPromotion when selectedPromotion changes
    if (selectedPromotion?.id !== tempSelected?.id) {
      setTempSelected(selectedPromotion)
    }
  }, [selectedPromotion])

  const handleSelect = () => {
    onSelect(tempSelected) // could be undefined for "No Promotion"
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) setTempSelected(selectedPromotion)
  }

  const renderPromotionItem = (promotion?: PromotionDTO) => {
    const isSelected = tempSelected?.id === promotion?.id || (!promotion && !tempSelected)

    const content = promotion?.content || ''
    const charLimit = 200 // Adjust this to your desired character limit

    // Use truncateHtml to truncate the content if necessary
    const truncatedContent = truncateHtml(content, charLimit)
    const isThisExpanded = promotion?.id ? expandedIds.has(promotion.id) : false

    return (
      <div
        key={promotion?.id ?? 'none'}
        onClick={() => setTempSelected(tempSelected?.id === promotion?.id ? undefined : promotion)} // ✅ here
        className={cn(
          'relative p-4 rounded-lg border cursor-pointer transition-all',
          isSelected ? 'border-app-primary' : 'border-app-neutral600 hover:border-app-primary'
        )}
      >
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='text-app-text-color font-semibold text-base mb-2'>
              {promotion?.name || lang?.common?.noPromo || 'No Promotion'}
            </h3>
            {promotion?.content && (
              <div className='text-app-text-color text-sm mb-3'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: isThisExpanded || !content ? content : truncatedContent
                  }}
                />
                {content.length > charLimit && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      if (!promotion?.id) return

                      setExpandedIds(prev => {
                        const newSet = new Set(prev)
                        if (newSet.has(promotion.id)) {
                          newSet.delete(promotion.id)
                        } else {
                          newSet.add(promotion.id)
                        }
                        return newSet
                      })
                    }}
                    className='text-app-text-color underline text-xs mt-1'
                  >
                    {isThisExpanded ? lang?.common?.seeLess : lang?.common?.seeMore}
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              isSelected ? 'border-app-primary bg-app-primary' : 'border-app-neutral500'
            )}
          >
            {isSelected && <div className='w-2 h-2 bg-white rounded-full' />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          type='button'
          className='flex flex-row items-center w-full h-10 bg-app-white100 text-app-text-color justify-between rounded-lg mb-1 py-2 px-4'
        >
          <div className='flex items-center gap-2'>
            <IconTicket className='w-4 h-4' />
            <span className='text-sm line-clamp-1'>
              {selectedPromotion?.name || lang?.common?.selectPromo || 'Select Promotion'}
            </span>
          </div>
          <ChevronRight className='w-4 h-4' />
        </button>
      </SheetTrigger>

      <SheetContent side='right' className='w-full sm:max-w-md flex flex-col'>
        <div className='mb-8 mt-6 text-xl font-bold uppercase text-app-text-color'>{lang?.common?.promotion}</div>

        <div className='flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide'>
          {isLoading ? (
            <PromotionSkeletonList />
          ) : (
            <>
              {renderPromotionItem(undefined)} {/* No Promotion Option */}
              {initialData?.map(renderPromotionItem)}
            </>
          )}
        </div>

        <div className='pt-4 border-t border-gray-800'>
          <Button
            onClick={handleSelect}
            className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
          >
            {lang?.common?.select}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
