import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

export const UseServerSendEvent = () => {
  // const [trigger, setTrigger] = useState<any[]>([])
  const [balanceTrigger, setBalanceTrigger] = useState<any[]>([])
  // const [messages, setMessages] = useState<any[]>([
  //   {
  //     status: 'not-connected'
  //   }
  // ])

  const [balanceMessages, setBalanceMessages] = useState<any[]>([
    {
      status: 'not-connected'
    }
  ])

  const [isConnected, setIsConnected] = useState(false)
  const [isBalanceConnected, setIsBalanceConnected] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    // Only connect if we have a session with access token
    if (status === 'loading') {
      console.log('Session loading...')

      return
    }

    if (!(session as any)?.accessToken) {
      console.log('No access token available, waiting for session...')
      setIsConnected(false)

      return
    }

    // let eventSource: EventSource | null = null
    let balanceSource: EventSource | null = null

    const connectToSSE = () => {
      // Create an EventSource to listen to notification stream from local API route
      // eventSource = new EventSource('/api/notification-stream')
      balanceSource = new EventSource('/api/balance-stream')
      // Handle connection open
      // eventSource.onopen = () => {
      //   setIsConnected(true)
      //   console.log('SSE connection established')
      // }

      balanceSource.onopen = () => {
        setIsConnected(true)
        setIsBalanceConnected(true)
        console.log('SSE connection established')
      }
      // Handle incoming messages
      // eventSource.onmessage = event => {
      //   try {
      //     const data: any = JSON.parse(event.data)
      //     if (data && data?.event) {
      //       setTrigger(prevTrigger => [...prevTrigger, data])
      //       }
      //       setMessages(prevMessages => [...prevMessages, data])
      //   } catch (error) {
      //     console.error('Error parsing SSE data:', error)
      //   }
      // }

      balanceSource.onmessage = event => {
        try {
          const data: any = JSON.parse(event.data)
          if (data && data.data?.event && data.data.event === 'balance_updated') {
            setBalanceTrigger(prevBalanceTrigger => [...prevBalanceTrigger, data])
          }
          setBalanceMessages(prevBalanceMessages => [...prevBalanceMessages, data])
        } catch (error) {
          console.error('Error parsing SSE data:', error)
        }
      }

      // Handle errors
      // eventSource.onerror = error => {
      //   console.error('Error connecting to SSE server:', error)
      //   setIsConnected(false)

      //   if (eventSource) {
      //     eventSource.close()
      //     eventSource = null
      //   }

      //   // Try to reconnect after 5 seconds
      //   setTimeout(() => {
      //     if (status === 'authenticated') {
      //       connectToSSE()
      //     }
      //   }, 3000)
      // }
      // handle balance source error
      balanceSource.onerror = error => {
        setIsBalanceConnected(false)
        if (balanceSource) {
          balanceSource.close()
          balanceSource = null
        }
        setTimeout(() => {
          if (status === 'authenticated') {
            connectToSSE()
          }
        }, 3000)
      }
    }

    connectToSSE()

    // Cleanup on unmount
    return () => {
      // if (eventSource) {
      //   eventSource.close()
      //   eventSource = null
      // }
      if (balanceSource) {
        balanceSource.close()
        balanceSource = null
      }
      setIsConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session])

  return { isConnected, balanceMessages, isBalanceConnected, balanceTrigger: balanceTrigger.length }
}
