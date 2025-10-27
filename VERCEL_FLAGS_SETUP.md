# 🎯 Vercel Flags Integration Guide

## 📋 **Setup Vercel Flag**

### **1. Install Vercel CLI**

```bashs
npm i -g vercel
```

### **2. Login ke Vercel**x

```bash
vercel login
```

### **3. Link Project ke Vercel**

```bash
vercel link --ye
```

### **4. Deploy dengan Flags**

```bash
vercel --prod
```

## 🔧 **Konfigurasi Flags**

### **File Structure:**

```
├── flags.json          # Flag definitions
└── src/@core/utils/flags.ts  # Flag implementation
```

### **flags.json:**

```json
{
  "loginButtonStyle": {
    "options": [
      { "value": "default", "label": "Default Style" },
      { "value": "modern", "label": "Modern Style" },
      { "value": "minimal", "label": "Minimal Style" }
    ],
    "defaultValue": "default"
  }
}
```

### **Flags Configuration:**

Flags dikonfigurasi melalui:

1. **`flags.json`** - Definisi flags
2. **Vercel Dashboard** - Kontrol flags
3. **Environment Variables** - Override values

## 🚀 **Cara Menggunakan Flags**

### **1. Di Vercel Dashboard:**

1. **Buka project** di Vercel Dashboard
2. **Go to Settings** → **Feature Flags**
3. **Toggle flags** sesuai kebutuhan
4. **Deploy** untuk apply changes

### **2. Di Code:**

```typescript
import { getLoginButtonStyle } from '@/@core/utils/flags'

const buttonStyle = getLoginButtonStyle()
// Returns: 'default' | 'modern' | 'minimal'
```

### **3. Environment Variables:**

```bash
# Set flags via environment variables
VERCEL_FLAG_LOGIN_BUTTON_STYLE=modern
VERCEL_FLAG_SHOW_LOGIN_BUTTON=true
```

## 🎨 **Available Flags**

| Flag               | Type    | Options                  | Default |
| ------------------ | ------- | ------------------------ | ------- |
| `loginButtonStyle` | string  | default, modern, minimal | default |
| `logoVariant`      | string  | light, dark, animated    | light   |
| `showLoginButton`  | boolean | true, false              | true    |
| `showLogo`         | boolean | true, false              | true    |

## 🔄 **Testing Flags**

### **Local Development:**

```bash
# Start with flags enabled
vercel dev
```

### **Preview Deployment:**

```bash
# Deploy preview with flags
vercel
```

### **Production Deployment:**

```bash
# Deploy production with flags
vercel --prod
```

## 📱 **Vercel Toolbar**

Setelah deploy, Anda akan melihat **Vercel Toolbar** di development/preview:

1. **Toggle flags** secara real-time
2. **Test different combinations**
3. **Share specific flag states**
4. **Debug flag values**

## 🛠️ **Troubleshooting**

### **Flags Tidak Muncul?**

- Pastikan `vercel.json` ada di root project
- Check `flags.json` format valid
- Redeploy project

### **Flags Tidak Berubah?**

- Clear browser cache
- Check Vercel Dashboard settings
- Verify flag keys match

### **Build Error?**

- Check TypeScript types
- Verify import paths
- Check flag function calls

---

**🎯 Sekarang flags terintegrasi dengan Vercel dan bisa dikontrol dari dashboard!**
