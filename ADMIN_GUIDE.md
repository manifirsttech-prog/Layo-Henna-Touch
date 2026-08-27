# Admin Dashboard Guide - Layo Henna Touch

## 🎉 Admin Dashboard Successfully Created!

Your website now has a complete admin dashboard where you can manage gallery images and testimonials dynamically!

## 🔐 Setting Up Admin Access

### Step 1: Create Admin User in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **layo-henna-touch**
3. Click on **Authentication** in the left sidebar
4. Click **Get Started** (if not already enabled)
5. Click on **Sign-in method** tab
6. Enable **Email/Password** provider
7. Click on **Users** tab
8. Click **Add user**
9. Enter:
   - Email: `admin@layohennatouch.com` (or your preferred email)
   - Password: Create a strong password
10. Click **Add user**

### Step 2: Access Your Admin Dashboard

**Admin Login URL**: `http://localhost:5174/admin/login`

Or in production: `https://yourdomain.com/admin/login`

## 📋 Admin Dashboard Features

### 1. Gallery Management
- ✅ Upload new henna design images
- ✅ Organize by categories (Bridal, Arabic, Simple, Event)
- ✅ Add titles and descriptions
- ✅ Mark designs as "Featured"
- ✅ Delete images
- ✅ Images automatically uploaded to Cloudinary
- ✅ Metadata saved to Firebase Firestore

### 2. Testimonials Management
- ✅ Add customer testimonials
- ✅ Set ratings (1-5 stars)
- ✅ Approve/Pending status toggle
- ✅ Delete testimonials
- ✅ Only approved testimonials show on website

## 🚀 How to Use the Admin Dashboard

### Login
1. Navigate to `/admin/login`
2. Enter your admin email and password
3. Click "Login"

### Upload Gallery Images
1. Click **Gallery** in the sidebar
2. Fill in the upload form:
   - Select an image file
   - Choose category
   - Enter title
   - Add description (optional)
   - Check "Featured" to show in Featured section
3. Click **Upload Design**
4. Image will appear in the gallery list below

### Manage Testimonials
1. Click **Testimonials** in the sidebar
2. Fill in the form:
   - Customer name
   - Rating (1-5 stars)
   - Testimonial text
3. Click **Add Testimonial**
4. Toggle approval status or delete as needed

## 📁 How Content is Stored

### Gallery Images
- **Images**: Uploaded to Cloudinary (`henna-gallery` folder)
- **Metadata**: Stored in Firebase Firestore (`gallery` collection)

Structure:
```javascript
{
  imageUrl: "https://res.cloudinary.com/...",
  cloudinaryPublicId: "henna-gallery/bridal/image-123",
  category: "bridal",
  title: "Elegant Bridal Pattern",
  description: "Beautiful intricate design",
  featured: true,
  createdAt: timestamp
}
```

### Testimonials
- **Storage**: Firebase Firestore (`testimonials` collection)

Structure:
```javascript
{
  name: "Aisha Rahman",
  text: "Absolutely stunning work!",
  rating: 5,
  approved: true,
  createdAt: timestamp
}
```

## 🌐 Website Integration

The home page (`/`) automatically fetches and displays:

1. **Featured Gallery** (section 3):
   - Shows up to 3 images marked as "featured"
   - Falls back to most recent 3 if no featured images

2. **Design Collections** (section 5):
   - Shows one image from each category
   - Bridal, Arabic, Simple, Event

3. **Testimonials** (section 6):
   - Shows 3 most recent approved testimonials
   - Falls back to hardcoded testimonials if none exist

## 🎨 Admin URLs

- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Back to Website**: Click "View Website" in sidebar or navigate to `/`

## 🔒 Security Features

- ✅ Firebase Authentication required
- ✅ Auto-redirect to login if not authenticated
- ✅ Cloudinary API keys protected in `.env`
- ✅ Only authenticated users can access dashboard
- ✅ Approved testimonials filter on public site

## 📝 Cloudinary Setup (Required!)

Before uploading images, create an upload preset:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Settings → Upload
3. Scroll to "Upload presets"
4. Click "Add upload preset"
5. Set name: `henna-designs`
6. Set mode: **Unsigned**
7. Set folder: `henna-gallery`
8. Save

## 🎯 Quick Start Checklist

- [ ] Create admin user in Firebase Authentication
- [ ] Enable Email/Password sign-in method
- [ ] Create Cloudinary upload preset (`henna-designs`)
- [ ] Login to admin dashboard
- [ ] Upload your first henna design image
- [ ] Add your first testimonial
- [ ] Check the home page to see your content!

## 💡 Tips

1. **Image Quality**: Upload high-quality images (recommended: 1200x1600px for best results)
2. **Featured Images**: Mark your best 3-4 designs as featured
3. **Categories**: Keep designs organized by category for better showcase
4. **Testimonials**: Only approve genuine testimonials
5. **Backup**: Your content is automatically backed up in Firebase

## 🐛 Troubleshooting

### Can't Login?
- Check Firebase Authentication is enabled
- Verify email/password are correct
- Check browser console for errors

### Images Not Uploading?
- Verify Cloudinary upload preset exists (`henna-designs`)
- Check `.env` file has correct Cloudinary credentials
- Ensure image file size is under 5MB

### Content Not Showing on Website?
- Check Firebase Firestore has data
- Verify testimonials are marked as "approved"
- Clear browser cache and refresh

## 📞 Admin Account Details

**Remember to save these securely!**

- Email: _[Your admin email]_
- Password: _[Your admin password]_
- Firebase Project: layo-henna-touch
- Cloudinary Cloud: pxz965s7

## 🎉 You're All Set!

Your admin dashboard is ready to use. Start uploading your beautiful henna designs and managing your website content!

---

**Note**: The hardcoded placeholder images will be replaced automatically as you upload real images from the admin dashboard.
