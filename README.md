# Layo Henna Touch - Business Website with Admin Dashboard

A beautiful, modern henna business website with a complete admin dashboard for content management.

## 🌟 Features

- **Responsive Design** - Looks great on all devices
- **8 Complete Sections**:
  1. ✅ Navigation Bar with logo and links
  2. ✅ Hero Section with background image and CTA
  3. ✅ Featured Gallery (dynamic from database)
  4. ✅ About the Brand section
  5. ✅ Henna Showcase with 4 categories (dynamic from database)
  6. ✅ Testimonials (dynamic from database)
  7. ✅ Booking CTA section
  8. ✅ Footer with social links and contact info

- **🔐 Admin Dashboard**:
  - Upload and manage gallery images
  - Add and manage testimonials
  - Firebase Authentication
  - Cloudinary image optimization
  - Real-time content updates

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at:
- **Website**: `http://localhost:5173`
- **Admin Login**: `http://localhost:5173/admin/login`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Admin Setup

### 1. Create Firebase Admin User

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Authentication** → **Users**
3. Click **Add user**
4. Create admin credentials

### 2. Set Up Cloudinary Upload Preset

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Settings → Upload → Upload presets
3. Create preset named: `henna-designs`
4. Set to **Unsigned** mode

### 3. Access Admin Dashboard

Navigate to `/admin/login` and use your Firebase credentials.

**📖 Full admin guide**: See `ADMIN_GUIDE.md`

## 🎨 Dynamic vs Static Content

### Dynamic (Managed via Admin Dashboard)
- ✅ Gallery images
- ✅ Henna design showcase
- ✅ Customer testimonials

### Static (Edit in code)
- Hero section content
- About section text
- Footer information
- Navigation links

## 📁 Project Structure

```
henna/
├── src/
│   ├── admin/              # Admin dashboard components
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── Admin.css
│   ├── assets/             # Static images
│   ├── App.tsx             # Router setup
│   ├── Home.tsx            # Main website
│   ├── auth.ts             # Firebase auth
│   ├── firebase.ts         # Firebase config
│   ├── cloudinary.ts       # Cloudinary config
│   ├── App.css             # Website styles
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── ADMIN_GUIDE.md          # Admin instructions
├── CLOUDINARY_SETUP.md     # Cloudinary guide
├── FIREBASE_USAGE.md       # Firebase usage
└── CHANGES_SUMMARY.md      # What's dynamic vs static
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Firebase** - Authentication & Database (Firestore + Realtime DB)
- **Cloudinary** - Image hosting & optimization
- **CSS3** - Styling with gradients and animations

## 🎯 Quick Start Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Set up Firebase admin user
- [ ] Create Cloudinary upload preset
- [ ] Run dev server (`npm run dev`)
- [ ] Login to admin (`/admin/login`)
- [ ] Upload first gallery image
- [ ] Add first testimonial
- [ ] Update contact info in footer
- [ ] Test on mobile devices
- [ ] Deploy to production

## 📝 Environment Variables

Create `.env` file with:

```env
# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... etc
```

## 🔗 Important Links

- **Firebase Console**: https://console.firebase.google.com/
- **Cloudinary Console**: https://console.cloudinary.com/
- **Admin Guide**: `ADMIN_GUIDE.md`
- **Setup Guides**: `CLOUDINARY_SETUP.md`, `FIREBASE_USAGE.md`

## 📄 License

This project is ready for commercial use.

---

**Need help?** Check the documentation files:
- `ADMIN_GUIDE.md` - How to use the admin dashboard
- `CHANGES_SUMMARY.md` - What's dynamic vs hardcoded
- `CLOUDINARY_SETUP.md` - Image upload setup
- `FIREBASE_USAGE.md` - Database usage examples
