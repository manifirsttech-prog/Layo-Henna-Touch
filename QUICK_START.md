# Quick Start Guide - Layo Henna Touch

## 🎉 Your Website is Ready!

You now have a complete henna business website with an admin dashboard for managing content.

## 🚀 Run Your Website

```bash
npm run dev
```

Then open:
- **Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login

## ⚡ Set Up Admin Access (Required!)

### Step 1: Create Admin User in Firebase (5 minutes)

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: **layo-henna-touch**
3. Click **Authentication** → **Get Started**
4. Enable **Email/Password** sign-in method
5. Go to **Users** tab → **Add user**
6. Create your admin credentials:
   - Email: `admin@layohennatouch.com`
   - Password: [choose a strong password]
7. Save these credentials securely!

### Step 2: Create Cloudinary Upload Preset (2 minutes)

1. Open [Cloudinary Console](https://console.cloudinary.com/)
2. Go to **Settings** → **Upload**
3. Scroll to **Upload presets** → **Add upload preset**
4. Settings:
   - Preset name: `henna-designs`
   - Signing mode: **Unsigned**
   - Folder: `henna-gallery`
5. Click **Save**

## ✅ You're Done! Now Use Your Admin Dashboard

1. Go to http://localhost:5173/admin/login
2. Login with your admin email/password
3. Start uploading henna designs!
4. Add customer testimonials!

## 📋 What You Can Do in Admin Dashboard

### Upload Gallery Images
- Click **Gallery** tab
- Upload images
- Set category (Bridal, Arabic, Simple, Event)
- Add title and description
- Mark as "Featured" to show on homepage

### Manage Testimonials
- Click **Testimonials** tab
- Add customer reviews
- Set star ratings
- Approve/unapprove testimonials
- Only approved ones show on website

## 🎨 Update Static Content (Optional)

Update these in the code:

### Contact Information (in `src/Home.tsx`)
- WhatsApp number: Search for `https://wa.me/1234567890`
- TikTok handle: Search for `@hennaartistry`
- Location: Search for `Your City, Your Location`

### About Section
- Update the text in the "About the Brand" section

## 📝 File Structure

```
henna/
├── src/
│   ├── admin/          # Admin dashboard
│   ├── Home.tsx        # Main website
│   ├── App.tsx         # Router
│   ├── firebase.ts     # Firebase config
│   └── cloudinary.ts   # Cloudinary config
├── .env                # API keys (already configured)
└── Documentation files...
```

## 🆘 Troubleshooting

### Can't login to admin?
- Check Firebase Authentication is enabled
- Verify email/password are correct

### Images not uploading?
- Check Cloudinary preset exists: `henna-designs`
- Verify preset is set to **Unsigned** mode

### Content not showing?
- Check Firebase Firestore for data
- Verify testimonials are marked as "approved"

## 📚 Documentation Files

- **ADMIN_GUIDE.md** - Full admin dashboard instructions
- **CHANGES_SUMMARY.md** - What's dynamic vs hardcoded
- **CLOUDINARY_SETUP.md** - Cloudinary setup and usage
- **FIREBASE_USAGE.md** - Firebase examples
- **README.md** - Project overview

## 🎯 Next Steps

1. ✅ Create Firebase admin user
2. ✅ Create Cloudinary upload preset
3. Run `npm run dev`
4. Login to admin dashboard
5. Upload 5-10 henna design images
6. Add 3-5 customer testimonials
7. Update contact info in footer
8. Test on your phone
9. Deploy to production!

## 🌐 Deploy to Production

When ready to go live:

```bash
npm run build
```

Then deploy the `dist` folder to:
- Vercel
- Netlify
- Firebase Hosting
- Or any static hosting service

---

**You're all set!** Your professional henna business website with admin dashboard is ready to use! 🎉

**Questions?** Check the documentation files or the code comments.
