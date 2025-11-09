# 🐛 Panduan Debugging - Telegram Mini App

Panduan lengkap untuk debugging aplikasi Telegram Mini App.

## 📋 Daftar Isi

1. [Debugging Tools](#debugging-tools)
2. [Browser Console Debugging](#browser-console-debugging)
3. [Network Debugging](#network-debugging)
4. [Telegram Environment Debugging](#telegram-environment-debugging)
5. [Common Debugging Scenarios](#common-debugging-scenarios)
6. [Debugging Tips & Tricks](#debugging-tips--tricks)
7. [Error Tracking](#error-tracking)

---

## 🛠️ Debugging Tools

### 1. Browser DevTools

#### Chrome/Edge DevTools
- **F12** atau **Cmd+Option+I** (Mac) / **Ctrl+Shift+I** (Windows)
- **Console Tab**: Lihat logs, errors, dan warnings
- **Network Tab**: Monitor API calls dan responses
- **Application Tab**: Check cookies, localStorage, sessionStorage
- **Sources Tab**: Set breakpoints dan debug JavaScript

#### Firefox DevTools
- **F12** atau **Cmd+Option+I** (Mac) / **Ctrl+Shift+I** (Windows)
- Fitur serupa dengan Chrome DevTools

#### Safari DevTools
- Enable Developer menu: Preferences → Advanced → Show Develop menu
- **Cmd+Option+I** untuk buka DevTools

### 2. Telegram Web Debugging

#### Telegram Desktop
- Buka Mini App di Telegram Desktop
- Right-click → **Inspect Element**
- DevTools akan terbuka (biasanya Chrome DevTools)

#### Telegram Mobile (Android)
- Enable **USB Debugging** di Android
- Connect device via USB
- Buka Chrome → `chrome://inspect`
- Pilih device dan inspect WebView

#### Telegram Mobile (iOS)
- Requires Mac dengan Xcode
- Connect iOS device
- Safari → Develop → [Device Name] → [WebView]

### 3. Remote Debugging Tools

#### Ngrok Inspector
```bash
# Start ngrok dengan web interface
ngrok http 3000 --log=stdout

# Buka http://127.0.0.1:4040 untuk melihat requests
```

#### React Developer Tools
- Install extension: [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- Inspect React components
- Check component state dan props
- Monitor React hooks

---

## 🖥️ Browser Console Debugging

### Basic Console Commands

```javascript
// Check jika Telegram WebApp tersedia
console.log('Telegram:', window.Telegram)
console.log('WebApp:', window.Telegram?.WebApp)

// Check initData
console.log('Init Data:', window.Telegram?.WebApp?.initData)
console.log('Init Data Unsafe:', window.Telegram?.WebApp?.initDataUnsafe)

// Check user data
console.log('User:', window.Telegram?.WebApp?.initDataUnsafe?.user)

// Check viewport
console.log('Viewport:', window.Telegram?.WebApp?.viewportHeight)

// Check theme
console.log('Theme:', window.Telegram?.WebApp?.themeParams)
console.log('Color Scheme:', window.Telegram?.WebApp?.colorScheme)
```

### Debugging Helper Functions

Tambahkan ini di browser console untuk debugging:

```javascript
// Helper: Check Telegram WebApp status
function debugTelegram() {
  const webApp = window.Telegram?.WebApp
  if (!webApp) {
    console.error('❌ Telegram WebApp tidak tersedia')
    return
  }

  console.group('🔍 Telegram WebApp Debug Info')
  console.log('✅ Telegram WebApp tersedia')
  console.log('Version:', webApp.version)
  console.log('Platform:', webApp.platform)
  console.log('User:', webApp.initDataUnsafe?.user)
  console.log('Viewport Height:', webApp.viewportHeight)
  console.log('Theme:', webApp.themeParams)
  console.log('Color Scheme:', webApp.colorScheme)
  console.log('Is Expanded:', webApp.isExpanded)
  console.log('Is Closing Confirmation Enabled:', webApp.isClosingConfirmationEnabled)
  console.groupEnd()
}

// Helper: Check session
function debugSession() {
  const session = document.cookie
    .split('; ')
    .find(row => row.startsWith('next-auth.session-token'))
  console.log('Session Cookie:', session)
}

// Helper: Check auth state
async function debugAuth() {
  const response = await fetch('/api/auth/session')
  const session = await response.json()
  console.log('Auth Session:', session)
}

// Helper: Simulate Telegram WebApp (untuk testing)
function simulateTelegram() {
  window.Telegram = {
    WebApp: {
      initData: 'test_data',
      initDataUnsafe: {
        user: {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          language_code: 'en'
        },
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'test_hash'
      },
      ready: () => console.log('✅ WebApp ready'),
      expand: () => console.log('✅ WebApp expanded'),
      close: () => console.log('✅ WebApp closed'),
      showAlert: (msg, cb) => {
        alert(msg)
        if (cb) cb()
      },
      version: '6.0',
      platform: 'web',
      viewportHeight: window.innerHeight,
      themeParams: {},
      colorScheme: 'light',
      isExpanded: true
    }
  }
  console.log('✅ Telegram WebApp simulated')
}

// Usage
debugTelegram()
debugSession()
debugAuth()
```

### Console Logging Best Practices

#### 1. Use Console Groups

```typescript
console.group('🔐 Authentication Flow')
console.log('Step 1: Checking Telegram WebApp')
console.log('Step 2: Getting initData')
console.log('Step 3: Signing in')
console.groupEnd()
```

#### 2. Use Different Log Levels

```typescript
// Debug info
console.debug('Debug info:', data)

// Regular info
console.log('Info:', data)

// Warning
console.warn('Warning:', data)

// Error
console.error('Error:', error)
```

#### 3. Conditional Logging

```typescript
// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

---

## 🌐 Network Debugging

### Monitor API Calls

#### 1. Check Network Tab

1. Buka DevTools → **Network** tab
2. Filter by **Fetch/XHR** untuk API calls
3. Check:
   - Request URL
   - Request Method
   - Request Headers
   - Request Body
   - Response Status
   - Response Headers
   - Response Body

#### 2. Debug Authentication Flow

```javascript
// Monitor fetch calls
const originalFetch = window.fetch
window.fetch = function(...args) {
  console.log('🌐 Fetch Request:', {
    url: args[0],
    options: args[1]
  })
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('🌐 Fetch Response:', {
    url: args[0],
    status: response.status,
    statusText: response.statusText
  })
      return response
    })
}
```

#### 3. Check API Responses

```javascript
// Helper: Test API endpoint
async function testAPI(endpoint, options = {}) {
  try {
    console.log('🧪 Testing API:', endpoint)
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    const data = await response.json()
    console.log('✅ Response:', data)
    return data
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

// Usage
testAPI('/api/auth/session')
testAPI('/api/users/me', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

### Debug Cookies

```javascript
// Check all cookies
console.log('Cookies:', document.cookie)

// Check specific cookie
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

// Check auth cookie
console.log('Auth Cookie:', getCookie('next-auth.session-token'))
console.log('Authorization Cookie:', getCookie('_authorization'))
```

---

## 📱 Telegram Environment Debugging

### 1. Check Telegram WebApp Availability

```typescript
// Di component atau hook
useEffect(() => {
  if (typeof window !== 'undefined') {
    console.log('Window available:', typeof window !== 'undefined')
    console.log('Telegram available:', typeof window.Telegram !== 'undefined')
    console.log('WebApp available:', typeof window.Telegram?.WebApp !== 'undefined')

    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp
      console.log('WebApp Version:', webApp.version)
      console.log('Platform:', webApp.platform)
    }
  }
}, [])
```

### 2. Monitor Telegram Events

```typescript
useEffect(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp

    // Monitor viewport changes
    webApp.onEvent('viewportChanged', (event: any) => {
      console.log('📱 Viewport Changed:', event)
    })

    // Monitor theme changes
    webApp.onEvent('themeChanged', () => {
      console.log('🎨 Theme Changed:', webApp.themeParams)
    })

    // Monitor main button clicks
    webApp.MainButton.onClick(() => {
      console.log('🔘 Main Button Clicked')
    })

    // Monitor back button clicks
    webApp.BackButton.onClick(() => {
      console.log('⬅️ Back Button Clicked')
    })

    // Cleanup
    return () => {
      webApp.offEvent('viewportChanged', () => {})
      webApp.offEvent('themeChanged', () => {})
      webApp.MainButton.offClick(() => {})
      webApp.BackButton.offClick(() => {})
    }
  }
}, [])
```

### 3. Debug Initialization Flow

Tambahkan logging di `TelegramMiniApp.tsx`:

```typescript
async function initTelegramMiniApp() {
  console.log('🚀 [Telegram.MiniApp] Starting initialization...')

  const webApp = window.Telegram.WebApp
  console.log('📱 [Telegram.MiniApp] WebApp object:', webApp)

  const initData = webApp.initData
  console.log('📋 [Telegram.MiniApp] Init Data:', initData)

  const { user, auth_date, hash } = webApp.initDataUnsafe
  console.log('👤 [Telegram.MiniApp] User:', user)
  console.log('📅 [Telegram.MiniApp] Auth Date:', auth_date)
  console.log('🔐 [Telegram.MiniApp] Hash:', hash)

  if (!user) {
    console.warn('⚠️ [Telegram.MiniApp] No user data found')
    return
  }

  try {
    console.log('🔑 [Telegram.MiniApp] Signing in...')
    const response = await signIn('telegram', {
      redirect: false,
      telegramData: JSON.stringify(telegramData)
    })

    console.log('✅ [Telegram.MiniApp] Sign in response:', response)
    return response
  } catch (error) {
    console.error('❌ [Telegram.MiniApp] Sign in error:', error)
    throw error
  }
}
```

---

## 🔍 Common Debugging Scenarios

### Scenario 1: `window.Telegram is undefined`

**Problem**: Telegram WebApp tidak tersedia

**Debug Steps**:
```javascript
// 1. Check script loaded
console.log('Script loaded:', document.querySelector('script[src*="telegram-web-app"]'))

// 2. Check after delay (script might load async)
setTimeout(() => {
  console.log('Telegram after delay:', window.Telegram)
}, 1000)

// 3. Check script source
const scripts = Array.from(document.querySelectorAll('script'))
scripts.forEach(script => {
  if (script.src.includes('telegram')) {
    console.log('Telegram script found:', script.src)
  }
})
```

**Solution**: Pastikan script di-load di `layout.tsx` dan tunggu sampai load

### Scenario 2: Authentication Failed

**Problem**: Login gagal atau tidak otomatis

**Debug Steps**:
```javascript
// 1. Check initData
console.log('Init Data:', window.Telegram?.WebApp?.initData)
console.log('User:', window.Telegram?.WebApp?.initDataUnsafe?.user)

// 2. Check auth endpoint
fetch('/api/auth/session')
  .then(r => r.json())
  .then(session => {
    console.log('Current Session:', session)
  })

// 3. Check cookies
console.log('All Cookies:', document.cookie)

// 4. Test sign in manually
import { signIn } from 'next-auth/react'
signIn('telegram', {
  redirect: false,
  telegramData: JSON.stringify({
    type: 'miniapp',
    id: 123456789,
    first_name: 'Test',
    // ... other data
  })
}).then(console.log)
```

### Scenario 3: Cookie Not Saved

**Problem**: Cookie tidak tersimpan setelah login

**Debug Steps**:
```javascript
// 1. Check cookie settings
console.log('Current URL:', window.location.href)
console.log('Is HTTPS:', window.location.protocol === 'https:')

// 2. Try to set cookie manually
document.cookie = 'test=value; path=/; max-age=3600'
console.log('Test cookie set:', document.cookie.includes('test=value'))

// 3. Check SameSite settings
// Cookies dengan SameSite=Strict tidak akan work di cross-origin
```

### Scenario 4: API Calls Failing

**Problem**: API calls return error atau tidak terkirim

**Debug Steps**:
```javascript
// 1. Check network tab
// - Status code
// - Response body
// - Request headers
// - CORS headers

// 2. Test API directly
fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${getCookie('_authorization')}`
  }
})
  .then(r => {
    console.log('Status:', r.status)
    return r.json()
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err))

// 3. Check CORS
console.log('Origin:', window.location.origin)
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
```

### Scenario 5: Session Expired

**Problem**: Session expired atau tidak persist

**Debug Steps**:
```javascript
// 1. Check session expiration
const session = await fetch('/api/auth/session').then(r => r.json())
console.log('Session:', session)

// 2. Check JWT expiration
if (session?.accessToken) {
  const payload = JSON.parse(atob(session.accessToken.split('.')[1]))
  const exp = new Date(payload.exp * 1000)
  console.log('Token expires at:', exp)
  console.log('Is expired:', exp < new Date())
}

// 3. Check NEXTAUTH_SECRET
// (tidak bisa check dari client, tapi pastikan sudah di-set)
```

---

## 💡 Debugging Tips & Tricks

### 1. Use React DevTools

Install React Developer Tools untuk inspect components:

```typescript
// Check component state
// Check props
// Check hooks state
// Monitor re-renders
```

### 2. Use Redux DevTools (Jika menggunakan Redux)

Monitor state changes dan actions

### 3. Add Debug Mode

```typescript
// .env.local
NEXT_PUBLIC_DEBUG_MODE=true

// In code
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

if (DEBUG) {
  console.log('Debug info:', data)
}
```

### 4. Use Debugger Statement

```typescript
function problematicFunction() {
  debugger // Execution akan pause di sini jika DevTools terbuka
  // Your code
}
```

### 5. Logging Library

Gunakan library seperti `debug` untuk better logging:

```bash
pnpm add debug
```

```typescript
import debug from 'debug'

const log = debug('app:telegram')
const error = debug('app:telegram:error')

log('Initializing...')
error('Error occurred:', err)
```

### 6. Network Request Interceptor

```typescript
// Intercept all fetch calls
const originalFetch = window.fetch
window.fetch = async function(...args) {
  const [url, options] = args
  const start = Date.now()

  try {
    const response = await originalFetch.apply(this, args)
    const duration = Date.now() - start

    console.log(`🌐 ${options?.method || 'GET'} ${url} - ${response.status} (${duration}ms)`)

    return response
  } catch (error) {
    console.error(`❌ ${options?.method || 'GET'} ${url} - Error:`, error)
    throw error
  }
}
```

---

## 📊 Error Tracking

### 1. Console Error Tracking

```typescript
// Track all console errors
const originalError = console.error
console.error = function(...args) {
  originalError.apply(console, args)
  // Send to error tracking service
  // trackError(args)
}
```

### 2. Global Error Handler

```typescript
// In layout.tsx or _app.tsx
useEffect(() => {
  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error)
    // Send to error tracking
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Rejection:', event.reason)
    // Send to error tracking
  })

  return () => {
    window.removeEventListener('error', () => {})
    window.removeEventListener('unhandledrejection', () => {})
  }
}, [])
```

### 3. Error Boundary Logging

```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary:', error, errorInfo)
    // Send to error tracking service
    // trackError(error, errorInfo)
  }
}
```

### 4. API Error Logging

```typescript
// In API wrapper
async function apiCall(endpoint, options) {
  try {
    const response = await fetch(endpoint, options)
    if (!response.ok) {
      const error = await response.json()
      console.error('API Error:', {
        endpoint,
        status: response.status,
        error
      })
      // Send to error tracking
    }
    return response
  } catch (error) {
    console.error('API Request Error:', error)
    // Send to error tracking
    throw error
  }
}
```

---

## 🔧 Debugging Checklist

Saat debugging, pastikan untuk check:

- [ ] Console untuk errors dan warnings
- [ ] Network tab untuk API calls
- [ ] Application tab untuk cookies dan storage
- [ ] React DevTools untuk component state
- [ ] Telegram WebApp object availability
- [ ] Environment variables
- [ ] Session state
- [ ] Authentication flow
- [ ] Cookie settings
- [ ] CORS configuration
- [ ] HTTPS certificate (untuk production)

---

## 📝 Quick Reference

### Console Commands

```javascript
// Check Telegram
debugTelegram()

// Check Session
debugSession()
debugAuth()

// Simulate Telegram
simulateTelegram()

// Test API
testAPI('/api/auth/session')
```

### Network Debugging

```javascript
// Monitor fetch
// (use interceptor code above)

// Check cookies
document.cookie

// Test API
fetch('/api/endpoint').then(r => r.json()).then(console.log)
```

### Component Debugging

```typescript
// Add debugger
debugger

// Log props and state
console.log('Props:', props)
console.log('State:', state)

// Monitor re-renders
useEffect(() => {
  console.log('Component rendered')
})
```

---

## 🆘 Getting Help

Jika masih mengalami masalah setelah debugging:

1. **Collect Information**:
   - Screenshot error
   - Console logs
   - Network requests
   - Steps to reproduce

2. **Check Documentation**:
   - [Development Guide](./TELEGRAM_MINI_APP_DEVELOPMENT_GUIDE.md)
   - [Troubleshooting Section](./TELEGRAM_MINI_APP_DEVELOPMENT_GUIDE.md#troubleshooting)

3. **Search for Similar Issues**:
   - Check GitHub issues
   - Search Stack Overflow
   - Check Telegram Mini Apps documentation

---

**Happy Debugging! 🐛🔍**

