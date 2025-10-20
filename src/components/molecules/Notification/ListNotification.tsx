'use client'
import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { NotificationProps } from '@/components/molecules/Notification/types'
import { Button } from '@/components/ui/button'
import { ListNotifCount, ListNotificationDTO } from '@/types/listNotificationDTO'
import { interpolate } from '@/utils/helper/interpolate'
import { format } from 'date-fns'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type ViewState = 'list' | 'detail'

const ListNotification = ({ lang }: NotificationProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('list')
  const [selectedNotification, setSelectedNotification] = useState<ListNotificationDTO | null>(null)
  const [notifications, setNotifications] = useState<ListNotificationDTO[]>([])
  const router = useRouter()
  const { data: respListNotif, isFetching } = GetData<ListNotificationDTO[]>('/notification', ['getListNotification'])

  const { data: respNotifCount } = GetData<ListNotifCount>('/notification/notifCount', ['getListNotifCount'])

  const { mutateAsync: readNotification } = useMutationQuery<any, any>(
    ['readNotification'],
    'post',
    'json',
    false,
    '',
    [['getListNotification'], ['getListNotifCount']]
  )
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
  const getTitleNotification = (type: string) => {
    switch (type) {
      case 'depositApproved':
        return lang?.notification?.depositApprovedTitle || ''
      case 'depositRejected':
        return lang?.notification?.depositRejectedTitle || ''
      case 'withdrawApproved':
        return lang?.notification?.withdrawApprovedTitle || ''
      case 'withdrawRejected':
        return lang?.notification?.withdrawRejectedTitle || ''
      case 'promoFailed':
        return lang?.notification?.promotionFailedTitle || ''
      case 'kycApproved':
        return lang?.notification?.kycApprovedTitle || ''
      case 'kycRejected':
        return lang?.notification?.kycRejectedTitle || ''
      default:
        return ''
    }
  }

  const getTypeNotification = (type: string) => {
    switch (type) {
      case 'depositApproved':
      case 'depositRejected':
        return lang?.common?.deposit || ''
      case 'withdrawApproved':
      case 'withdrawRejected':
        return lang?.common?.withdraw || ''
      case 'kycApproved':
      case 'kycRejected':
        return lang?.common?.kyc || ''
      default:
        return ''
    }
  }

  useEffect(() => {
    if (window !== undefined && window.innerWidth > 768) {
      router.push('/en')
    }
  }, [router])

  if (isFetching && !respListNotif) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='h-10 w-10 animate-spin' />
      </div>
    )
  }

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        {currentView === 'detail' ? (
          <div className='flex items-center mb-5'>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6 -mt-1 text-app-neutral500 mr-4 hover:text-app-text-color hover:bg-app-neutral300'
              onClick={handleBackToList}
            >
              <ArrowLeft size={25} />
            </Button>
            <h2 className='text-xl font-bold text-app-text-color mb-2 uppercase'>{lang?.common?.notificationDetail}</h2>
          </div>
        ) : (
          <h1 className='text-xl font-bold text-app-text-color mb-2 uppercase'>{lang?.common?.notification}</h1>
        )}
      </div>

      <div className='max-h-[70vh] mt-4 overflow-y-auto scrollbar-hide'>
        {currentView === 'list' ? (
          <div className='space-y-4'>
            {respListNotif && respListNotif.length > 0 ? (
              respListNotif.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`  space-y-1 cursor-pointer rounded-lg transition-colors bg-app-background-primary`}
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
                    <div
                      className={`font-bold capitalize  text-sm ${
                        notification.read_at ? 'text-app-neutral500' : 'text-app-text-color'
                      }`}
                    >
                      {getTitleNotification(notification.type)}
                    </div>
                    {!notification.is_read && <div className='h-2 w-2 bg-blue-500 rounded-full'></div>}
                  </div>
                  <div
                    className={`text-sm leading-relaxed line-clamp-2 ${
                      notification.read_at ? 'text-app-neutral500' : 'text-app-text-color'
                    }`}
                  >
                    {interpolate(
                      lang?.notification?.[notification.type] || notification.message,
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
                    {getTitleNotification(selectedNotification.type)}
                  </div>
                  <div className='text-xs text-app-text-color bg-app-background-primary px-2 py-1 rounded'>
                    {getTypeNotification(selectedNotification.type)}
                  </div>
                </div>
                <div className='text-app-neutral500 text-xs'>
                  {format(new Date(selectedNotification.created_at), 'yyyy-MM-dd | HH:mm')}
                </div>
              </div>

              <div className='border-t border-app-neutral600 pt-4'>
                <div className='text-app-text-color text-sm leading-relaxed whitespace-pre-line'>
                  {interpolate(
                    lang?.notification?.[selectedNotification.type] || selectedNotification.message,
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
  )
}

export default ListNotification
