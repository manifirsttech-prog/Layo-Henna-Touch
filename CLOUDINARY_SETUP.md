# Cloudinary Integration Guide

Cloudinary has been successfully integrated into your Layo Henna Touch website!

## 🔐 Configuration

Your Cloudinary credentials are stored in `.env`:
- **Cloud Name**: pxz965s7
- **API Key**: 376845236637869
- **API Secret**: qqe5cwZ26eKUAg5nYoh2hmY6NXI

⚠️ **Security Note**: The `.env` file is already added to `.gitignore` to keep your secrets safe.

## 📁 Files Added

- `.env` - Environment variables with Cloudinary credentials
- `src/cloudinary.ts` - Cloudinary configuration and helper functions

## 🚀 Setup Steps

### 1. Create an Upload Preset in Cloudinary Dashboard

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload**
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Set preset name: `henna-designs`
6. Set signing mode: **Unsigned** (for client-side uploads)
7. Set folder: `henna-gallery`
8. Save

### 2. Install Cloudinary Widget (Optional)

If you want to use the Cloudinary Upload Widget:

```bash
npm install cloudinary-react
```

Or add this script to your `index.html`:

```html
<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
```

## 💻 How to Use Cloudinary

### 1. Upload Images (Basic)

```typescript
import { uploadToCloudinary } from './cloudinary';

const handleImageUpload = async (file: File) => {
  try {
    const result = await uploadToCloudinary(file, 'henna-gallery');
    console.log('Image uploaded:', result.url);
    // Save result.url to Firebase Firestore
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 2. Upload with Cloudinary Widget

```typescript
import { getCloudinaryUploadWidget } from './cloudinary';

const openUploadWidget = () => {
  const config = getCloudinaryUploadWidget();
  
  // @ts-ignore
  window.cloudinary.openUploadWidget(
    config,
    (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('Upload successful:', result.info.secure_url);
        // Save to Firebase
      }
    }
  );
};
```

### 3. Get Optimized Image URLs

```typescript
import { getOptimizedImageUrl } from './cloudinary';

// Original Cloudinary public ID from upload
const publicId = 'henna-gallery/design-123';

// Get optimized URL
const optimizedUrl = getOptimizedImageUrl(publicId, {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'webp',
  crop: 'fill'
});

// Use in your component
<img src={optimizedUrl} alt="Henna Design" />
```

### 4. Different Image Sizes for Different Use Cases

```typescript
import { getOptimizedImageUrl } from './cloudinary';

const publicId = 'henna-gallery/my-design';

// Thumbnail for gallery grid
const thumbnail = getOptimizedImageUrl(publicId, {
  width: 400,
  height: 400,
  quality: 'auto',
  format: 'webp',
  crop: 'thumb'
});

// Full size for modal/lightbox
const fullSize = getOptimizedImageUrl(publicId, {
  width: 1920,
  quality: 80,
  format: 'webp',
  crop: 'fit'
});

// Mobile optimized
const mobile = getOptimizedImageUrl(publicId, {
  width: 600,
  quality: 'auto',
  format: 'webp'
});
```

## 🎨 Example: Complete Upload Component

```typescript
import { useState } from 'react';
import { uploadToCloudinary } from './cloudinary';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

function ImageUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file, 'henna-gallery');
      
      // Save to Firebase Firestore
      await addDoc(collection(db, 'gallery'), {
        imageUrl: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
        category: 'bridal',
        title: 'New Design',
        createdAt: new Date(),
        featured: false
      });

      alert('Image uploaded successfully!');
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {preview && <img src={preview} alt="Preview" style={{ width: '200px' }} />}
      {uploading && <p>Uploading...</p>}
    </div>
  );
}

export default ImageUploadComponent;
```

## 📊 Firestore + Cloudinary Integration

Store Cloudinary URLs in Firebase:

```typescript
// When uploading
const result = await uploadToCloudinary(file);

await addDoc(collection(db, 'gallery'), {
  imageUrl: result.url,
  cloudinaryPublicId: result.publicId,
  category: 'bridal',
  title: 'Beautiful Bridal Design',
  description: 'Intricate mehndi pattern',
  featured: true,
  createdAt: new Date()
});

// When fetching for display
const galleryDocs = await getDocs(collection(db, 'gallery'));
galleryDocs.forEach(doc => {
  const data = doc.data();
  // Use data.imageUrl directly or optimize it
  const optimizedUrl = getOptimizedImageUrl(
    data.cloudinaryPublicId,
    { width: 400, quality: 'auto' }
  );
});
```

## 🌟 Benefits of Using Cloudinary

1. **Automatic Optimization** - Images are compressed and optimized
2. **Responsive Images** - Generate multiple sizes on-the-fly
3. **Format Conversion** - Automatic WebP for supported browsers
4. **CDN Delivery** - Fast loading from edge locations
5. **Transformations** - Crop, resize, filters, and effects
6. **Storage** - No need to store large images in Firebase Storage

## 🔗 Cloudinary Dashboard Links

- **Media Library**: https://console.cloudinary.com/console/media_library
- **Upload Settings**: https://console.cloudinary.com/settings/upload
- **Transformations**: https://console.cloudinary.com/console/transformations
- **Usage**: https://console.cloudinary.com/console/lui/usage

## 🎯 Next Steps

1. ✅ Create the `henna-designs` upload preset in Cloudinary
2. Upload your henna design images to Cloudinary
3. Store the image URLs in Firebase Firestore
4. Update the gallery components to fetch from Firestore
5. Use optimized image URLs for better performance

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Widget Guide](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [React Integration](https://cloudinary.com/documentation/react_integration)
