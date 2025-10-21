'use client'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { IconBell } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ListNotifCount, ListNotificationDTO } from '@/types/listNotificationDTO'
import { interpolate } from '@/utils/helper/interpolate'
import { getMessageNotification, getTitleNotification, getTypeNotification } from '@/utils/helper/notification'
import { format } from 'date-fns'
import { ArrowLeft, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NotificationProps } from './types'

type ViewState = 'list' | 'detail'

export default function NotificationDropdown({ lang }: NotificationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewState>('list')
  const [selectedNotification, setSelectedNotification] = useState<ListNotificationDTO | null>(null)
  const [notifications, setNotifications] = useState<ListNotificationDTO[]>([])

  const { data: respListNotif } = GetData<ListNotificationDTO[]>('/notification', ['getListNotification'])

  const { data: respNotifCount } = GetData<ListNotifCount>('/notification/notifCount', ['getListNotifCount'])

  const { mutateAsync: readNotification } = useMutationQuery<any, any>(
    ['readNotification'],
    'post',
    'json',
    false,
    '',
    [['getListNotification'], ['getListNotifCount']]
  )

  useEffect(() => {
    if (respListNotif) setNotifications(respListNotif)
  }, [respListNotif])

  const handleNotificationClick = async (notification: ListNotificationDTO) => {
    if (!notification.is_read) {
      // Optimistic update
      setNotifications(prev => prev.map(item => (item.id === notification.id ? { ...item, is_read: true } : item)))
      setSelectedNotification(notification)
      try {
        await readNotification({
          url: '/notification/readNotif',
          body: notification.id
        })
      } catch (error) {}
    }

    setSelectedNotification(notification)
    setCurrentView('detail')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedNotification(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentView('list')
    setSelectedNotification(null)
  }

  return (
    <div className='relative'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role='button'
            aria-label='Open notifications'
            className='relative text-app-text-color hover:bg-app-bg-button-hover w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-colors'
          >
            <IconBell />
            {respNotifCount && respNotifCount?.count > 0 && (
              <span className='absolute -top-1 -right-1 h-3 w-3 bg-app-danger rounded-full'></span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          side='bottom'
          className='w-[360px] max-w-[calc(100vw-2rem)] p-0 bg-app-background-secondary border-app-neutral600 shadow-xl'
          sideOffset={8}
        >
          <div className='rounded-2xl bg-app-background-secondary p-6 space-y-4'>
            <div className='flex ml-auto h-6 w-6 text-app-text-color cursor-pointer' onClick={handleClose}>
              <X className='h-6 w-6' />
            </div>

            <div className='flex items-center justify-between'>
              {currentView === 'detail' ? (
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 text-app-neutral500 hover:text-app-text-color hover:bg-app-neutral300'
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className='h-4 w-4' />
                  </Button>
                  <h2 className='text-app-text-color font-bold text-sm tracking-wider uppercase'>
                    {lang?.common?.notificationDetail}
                  </h2>
                </div>
              ) : (
                <h2 className='text-app-text-color font-bold text-lg tracking-wider uppercase'>
                  {lang?.common?.notification}
                </h2>
              )}
            </div>

            <div className='max-h-[400px] overflow-y-auto scrollbar-hide'>
              {currentView === 'list' ? (
                <div className='space-y-4'>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={`space-y-1 cursor-pointer rounded-lg transition-colors p-3 ${
                          index % 2 === 0 ? 'bg-app-background-primary' : 'bg-app-background-secondary'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                        role='button'
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNotificationClick(notification)
                          }
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='font-bold text-app-text-color text-sm'>
                            {getTitleNotification(notification.type, lang)}
                          </div>
                          {!notification.is_read && <div className='h-2 w-2 bg-blue-500 rounded-full'></div>}
                        </div>
                        <div className='text-app-text-color text-sm leading-relaxed line-clamp-2'>
                          {interpolate(
                            getMessageNotification(notification.type, lang) || notification.message,
                            notification.args ?? {}
                          )}
                        </div>
                        <div className='text-app-neutral500 text-sm'>
                          {format(new Date(notification.created_at), 'yyyy-MM-dd | HH:mm')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-app-text-color'>{lang?.common?.noData}</div>
                  )}
                </div>
              ) : (
                selectedNotification && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='font-bold text-app-text-color text-sm'>
                          {getTitleNotification(selectedNotification.type, lang)}
                        </div>
                        <div className='text-xs text-app-text-color bg-app-background-primary px-2 py-1 rounded'>
                          {getTypeNotification(selectedNotification.type, lang)}
                        </div>
                      </div>
                      <div className='text-app-neutral500 text-xs'>
                        {format(new Date(selectedNotification.created_at), 'yyyy-MM-dd | HH:mm')}
                      </div>
                    </div>

                    <div className='border-t border-app-neutral600 pt-4'>
                      <div className='text-app-text-color text-sm leading-relaxed whitespace-pre-line'>
                        {interpolate(
                          getMessageNotification(selectedNotification.type, lang) || selectedNotification.message,
                          selectedNotification.args ?? {}
                        )}
                      </div>
                    </div>

                    {!selectedNotification.is_read && (
                      <div className='flex items-center space-x-2 text-xs text-blue-400'>
                        <div className='h-2 w-2 bg-blue-500 rounded-full'></div>
                        <span>{lang?.common?.newNotification}</span>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
