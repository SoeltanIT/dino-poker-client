import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { DepositDataProps } from '../types'

export function useLiveChat() {
  const { ready } = useLiveChatContext()
  const { data: session } = useSession()

  const openLiveChat = () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.LiveChatWidget !== 'undefined' &&
      typeof window.LiveChatWidget.call === 'function'
    ) {
      if (!ready) {
        console.warn('[LiveChat] Widget is not ready yet. Aborting...')
        return
      }

      const widget = window.LiveChatWidget

      if (!widget || typeof widget.call !== 'function') {
        console.error('[LiveChat] LiveChatWidget is not available or malformed.')
        return
      }

      if (session?.user) {
        widget.call('set_customer_name', session.user.name ?? '')
        widget.call('set_customer_email', session.user.email ?? '')
      }
      window.LiveChatWidget.call('maximize')
    } else {
      console.warn('[LiveChat] Widget not ready')
    }
  }

  const openLiveChatWithTransaction = (transaction: DepositDataProps) => {
    if (!ready) {
      console.warn('[LiveChat] Widget is not ready yet. Aborting...')
      return
    }

    const widget = window.LiveChatWidget

    if (!widget || typeof widget.call !== 'function') {
      console.error('[LiveChat] LiveChatWidget is not available or malformed.')
      return
    }

    widget.call('set_session_variables', {
      userID: session?.user?.id,
      depositID: transaction.deposit_id,
      amount: `KRW ${thousandSeparatorComma(transaction.amount || 0)}`,
      type: transaction.type,
      dateTransaction: format(new Date(transaction.created_at || ''), 'yyyy-MM-dd | HH:mm')
    })

    if (session?.user) {
      widget.call('set_customer_name', session.user.name ?? '')
      widget.call('set_customer_email', session.user.email ?? '')
    }

    widget.call('maximize')
  }

  return {
    openLiveChat,
    openLiveChatWithTransaction,
    ready
  }
}
