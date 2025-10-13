import ListNotification from '@/components/molecules/Notification/ListNotification'
import { getDictionary } from '@/dictionaries/dictionaries'

const NotificationPage = async ({ params }: { params: any }) => {
  const dict = await getDictionary(params?.lang)

  return (
    <div className='flex md:hidden flex-col px-8 py-5 min-h-[90vh]'>
      <ListNotification lang={dict} isLogin={true} locale={params?.lang} />
    </div>
  )
}

export default NotificationPage
