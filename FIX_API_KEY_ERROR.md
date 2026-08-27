# Fix "Unknown API Key" Error

## The Problem

You're seeing **"Unknown API key"** error when uploading images.

## ✅ The Solution

The upload preset needs to be set to **"Unsigned"** mode. Here's how:

### Step-by-Step Fix:

1. **Go to Cloudinary Console**
   - Open: https://console.cloudinary.com/

2. **Navigate to Upload Settings**
   - Click **Settings** (⚙️ icon)
   - Click **Upload** in sidebar

3. **Find Your Preset**
   - Scroll to "Upload presets"
   - Find the preset named: `henna-designs`
   - Click on it to edit

4. **Change Signing Mode**
   ```
   Signing Mode: 
   ⦿ Unsigned  ← SELECT THIS
   ○ Signed    ← Not this
   ```

5. **Save Changes**
   - Click **Save** button
   - The preset is now configured correctly

6. **Try Again**
   - Go back to admin dashboard
   - Try uploading the image again
   - Should work now! ✅

## Why This Happens

When a preset is in **"Signed"** mode, it requires an API key and signature from the backend. But we're uploading from the browser (frontend), which requires **"Unsigned"** mode.

## Verify Your Setup

Make sure your preset looks like this:

```
Upload preset name: henna-designs
Signing Mode: Unsigned ✓
Folder: henna-gallery
```

## Still Having Issues?

### Check Your Cloud Name
In `.env` file, verify:
```
VITE_CLOUDINARY_CLOUD_NAME=pxz965s7
```

### Refresh the Page
After changing the preset, refresh your admin dashboard page.

---

**Once fixed, images will upload successfully!** 🎉
