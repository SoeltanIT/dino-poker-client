interface LC_API {
  /** Opens the chat window. */
  open_chat_window: () => void

  /** Closes the current chat session. */
  close_chat: () => void

  /** Hides the chat window without ending the session. */
  hide_chat_window: () => void

  /** Minimizes the chat window. */
  minimize_chat_window: () => void

  /** Opens the full chat window (typically after it's minimized). */
  show_full_view: () => void

  /** Checks whether the chat widget is fully loaded. */
  is_loaded: () => boolean

  /** Checks if the chat window is hidden. */
  chat_window_hidden: () => boolean

  /** Returns whether the chat window is maximized. */
  chat_window_maximized: () => boolean

  /** Checks if the chat window is minimized. */
  chat_window_minimized: () => boolean

  /** Returns whether the current chat session is running. */
  chat_running: () => boolean

  /** Returns the visitor's unique ID. */
  get_visitor_id: () => string

  /** Returns the number of chats the visitor has had. */
  get_chats_number: () => number

  /** Returns the number of page views the visitor has made. */
  get_page_views_number: () => number

  /** Sets custom variables for the chat. */
  set_custom_variables: (variables: { name: string; value: string }[]) => void

  /** Updates the custom variables for the chat. */
  update_custom_variables: (variables: { name: string; value: string }[]) => void

  /** Sets the visitor's name. */
  set_visitor_name: (name: string) => void

  /** Sets the visitor's email address. */
  set_visitor_email: (email: string) => void

  /** Enables the specified event listener. */
  on: (event: string, callback: () => void) => void

  /** Disables the specified event listener. */
  off: (event: string) => void

  /** Runs diagnostics or logs some details (optional argument). */
  diagnose: (i?: any) => void

  /** Checks if agents are available for a chat. */
  agents_are_available: () => void

  /** Initiates a call (specific action not detailed). */
  call: () => void

  /** Disables chat sounds. */
  disable_sounds: () => void

  /** A generic getter function that returns unspecified data. */
  get: () => any

  /** Returns the current chat's ID. */
  get_chat_id: () => string

  /** Returns the timestamp of the visitor's last visit. */
  get_last_visit_timestamp: () => number

  /** Returns the number of visits the visitor has made. */
  get_visits_number: () => number

  /** Returns the type of window (e.g., 'embedded'). */
  get_window_type: () => string

  /** Hides the eye catcher (visual cue for the chat widget). */
  hide_eye_catcher: () => void

  /** Returns whether the chat is being viewed on a mobile device. */
  mobile_is_detected: () => boolean

  /** Opens the mobile-specific chat window. */
  open_mobile_window: () => void

  /** Returns the version of the LiveChat script. */
  scriptTagVersion: () => string

  /** Triggers the sales tracker with the provided data. */
  trigger_sales_tracker: (e: any, t: any) => void

  /** Triggers when the visitor is engaged in the chat. */
  visitor_engaged: () => void

  /** Triggers when the visitor is queued in the chat system. */
  visitor_queued: () => void
}

interface LiveChatWidgetAPI {
  call: (method: string, payload?: any) => void
  on: (event: string, callback: () => void) => void
  off: (event: string) => void
  get: (...args: any[]) => any
  once: (event: string, callback: () => void) => void
}

interface Window {
  gtag: (...args: any[]) => void
  dataLayer: Record<string, any>
  __lc?: {
    license?: string
    integration_name?: string
    product_name?: string
    asyncInit?: boolean
  }
  LC_API: LC_API
  LiveChatWidget: LiveChatWidgetAPI
}
