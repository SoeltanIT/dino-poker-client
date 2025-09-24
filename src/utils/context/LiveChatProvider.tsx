'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface LiveChatContextProps {
  ready: boolean
}

const LiveChatContext = createContext<LiveChatContextProps>({ ready: false })

export const useLiveChatContext = () => useContext(LiveChatContext)

export const LiveChatProvider = ({ children, licenseId }: { children: React.ReactNode; licenseId: string }) => {
  const [ready, setReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    setReady(false)

    // Remove old script if exists
    const existingScript = document.querySelector('script[src*="livechatinc"]')
    if (existingScript) existingScript.remove()

    // Setup config
    window.__lc = {
      license: '19314593',
      integration_name: 'manual_channels',
      product_name: 'livechat'
    }

    // Reattach LiveChatWidget proxy queue
    ;(function (n, t, c) {
      function i(n: any) {
        return e._h ? e._h.apply(null, n) : e._q.push(n)
      }
      const e: any = {
        _q: [],
        _h: null,
        _v: '2.0',
        on: function () {
          i(['on', c.call(arguments)])
        },
        once: function () {
          i(['once', c.call(arguments)])
        },
        off: function () {
          i(['off', c.call(arguments)])
        },
        get: function () {
          if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.")
          return i(['get', c.call(arguments)])
        },
        call: function () {
          i(['call', c.call(arguments)])
        }
      }
      n.LiveChatWidget = n.LiveChatWidget || e
    })(window, document, [].slice)

    // Inject script
    const script = document.createElement('script')
    script.src = 'https://cdn.livechatinc.com/tracking.js'
    script.async = true
    script.type = 'text/javascript'
    script.onload = () => {
      console.log('[LiveChatContext] ✅ Script loaded')
      setReady(true)
    }
    document.head.appendChild(script)
  }, [pathname, licenseId])

  return <LiveChatContext.Provider value={{ ready }}>{children}</LiveChatContext.Provider>
}
