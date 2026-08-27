# Firebase Integration Guide

Firebase has been successfully integrated into your Henna Business website!

## 🔥 What's Configured

- **Firebase Analytics** - Track user interactions and page views
- **Firestore Database** - Store bookings, testimonials, and gallery data
- **Firebase Storage** - Store and serve henna design images

## 📁 Files Added

- `src/firebase.ts` - Firebase configuration and initialization

## 🚀 How to Use Firebase

### 1. Track Page Views (Analytics)

Analytics is automatically initialized and tracking page views.

### 2. Save Booking Data to Firestore

```typescript
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// Example: Save a booking
const saveBooking = async (bookingData: {
  name: string;
  phone: string;
  email: string;
  date: string;
  designType: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: new Date(),
      status: 'pending'
    });
    console.log('Booking saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};
```

### 3. Store Testimonials in Firestore

```typescript
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Fetch testimonials
const getTestimonials = async () => {
  const querySnapshot = await getDocs(collection(db, 'testimonials'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Add a new testimonial
const addTestimonial = async (testimonial: {
  name: string;
  text: string;
  rating: number;
}) => {
  await addDoc(collection(db, 'testimonials'), {
    ...testimonial,
    createdAt: new Date(),
    approved: false
  });
};
```

### 4. Upload Henna Design Images to Storage

```typescript
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload an image
const uploadHennaImage = async (file: File, category: string) => {
  const storageRef = ref(storage, `designs/${category}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
```

### 5. Fetch Gallery Images from Firestore

```typescript
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Get gallery images by category
const getGalleryImages = async (category: string) => {
  const q = query(
    collection(db, 'gallery'),
    where('category', '==', category)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

## 🗃️ Suggested Firestore Collections

### `bookings`
```javascript
{
  name: string,
  phone: string,
  email: string,
  date: string,
  designType: string, // 'bridal', 'arabic', 'simple', 'event'
  status: string,     // 'pending', 'confirmed', 'completed', 'cancelled'
  createdAt: timestamp,
  notes: string
}
```

### `testimonials`
```javascript
{
  name: string,
  text: string,
  rating: number,     // 1-5
  approved: boolean,
  createdAt: timestamp
}
```

### `gallery`
```javascript
{
  imageUrl: string,
  category: string,   // 'bridal', 'arabic', 'simple', 'event'
  title: string,
  description: string,
  featured: boolean,
  createdAt: timestamp
}
```

### `designs`
```javascript
{
  name: string,
  category: string,
  imageUrl: string,
  price: number,
  duration: number,   // in minutes
  description: string
}
```

## 🔐 Security Rules (Add to Firebase Console)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for gallery and testimonials
    match /gallery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /testimonials/{document} {
      allow read: if resource.data.approved == true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    
    // Bookings require authentication to read/write
    match /bookings/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## 📦 Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /designs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Next Steps

1. **Set up Firestore Database** in Firebase Console
2. **Create collections** as described above
3. **Set up Storage** for image uploads
4. **Add authentication** if needed (for admin panel)
5. **Configure security rules** in Firebase Console

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Storage Guide](https://firebase.google.com/docs/storage)
- [Analytics Guide](https://firebase.google.com/docs/analytics)
