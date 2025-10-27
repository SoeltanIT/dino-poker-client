# 🎯 Vercel Flags Troubleshooting

## ❌ **Masalah: Flags Tidak Muncul di Vercel Toolbar**

### **Penyebab:**

1. **Permission Issue** - Git author tidak memiliki akses ke team Vercel
2. **Flags Configuration** - Flags tidak terdeteksi dengan benar
3. **Deployment Issue** - Project belum ter-deploy dengan flags

### **🔧 Solusi:**

#### **1. Fix Permission Issue**

```bash
# Login dengan akun yang memiliki akses ke team
vercel logout
vercel login

# Atau invite user ke team di Vercel Dashboard
```

#### **2. Manual Flags Configuration**

Buka **Vercel Dashboard** → **Project Settings** → **Feature Flags**:

```json
{
  "loginButtonStyle": {
    "options": [
      { "value": "default", "label": "Default Style" },
      { "value": "modern", "label": "Modern Style" },
      { "value": "minimal", "label": "Minimal Style" }
    ],
    "defaultValue": "default"
  },
  "logoVariant": {
    "options": [
      { "value": "light", "label": "Light Logo" },
      { "value": "dark", "label": "Dark Logo" },
      { "value": "animated", "label": "Animated Logo" }
    ],
    "defaultValue": "light"
  },
  "showLoginButton": {
    "options": [
      { "value": true, "label": "Show Login Button" },
      { "value": false, "label": "Hide Login Button" }
    ],
    "defaultValue": true
  },
  "showLogo": {
    "options": [
      { "value": true, "label": "Show Logo" },
      { "value": false, "label": "Hide Logo" }
    ],
    "defaultValue": true
  }
}
```

#### **3. Local Testing**

```bash
# Start development server dengan flags
vercel dev

# Flags akan muncul di toolbar jika:
# - Vercel Toolbar plugin aktif
# - Flags ter-export dengan benar
# - Project ter-link ke Vercel
```

#### **4. Alternative: Environment Variables**

Jika flags tidak muncul, gunakan environment variables:

```bash
# Set di .env.local
NEXT_PUBLIC_LOGIN_BUTTON_STYLE=modern
NEXT_PUBLIC_LOGO_VARIANT=animated
NEXT_PUBLIC_SHOW_LOGIN_BUTTON=true
NEXT_PUBLIC_SHOW_LOGO=true
```

### **🎯 Next Steps:**

1. **Fix permission** dengan invite user ke team
2. **Manual configure** flags di Vercel Dashboard
3. **Test locally** dengan `vercel dev`
4. **Deploy** setelah permission fixed

### **📞 Support:**

- **Vercel Docs**: https://vercel.com/docs/workflow-collaboration/feature-flags
- **Team Access**: https://vercel.com/docs/deployments/troubleshoot-project-collaboration
