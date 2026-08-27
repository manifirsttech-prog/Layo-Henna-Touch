# Upload Troubleshooting Guide 🔧

## Common Upload Issues & Solutions

---

## Issue 1: "Upload Preset Not Found" ❌

### Error Message:
```
Upload preset not found
Invalid upload preset: henna-designs
```

### Solution:
You need to create an **unsigned upload preset** in Cloudinary:

#### Steps to Fix:
1. **Go to Cloudinary Dashboard**: https://console.cloudinary.com/
2. **Login** with your account
3. **Click Settings** (gear icon, bottom left)
4. **Click "Upload" tab**
5. **Scroll to "Upload presets"**
6. **Click "Add upload preset"**
7. **Configure preset**:
   ```
   Preset name: henna-designs
   Signing Mode: Unsigned ✅ (IMPORTANT!)
   Folder: henna-gallery
   ```
8. **Click "Save"**
9. **Try uploading again**

---

## Issue 2: Images Not Appearing After Upload ❌

### Possible Causes:

#### A. Server Not Running
**Solution:**
```powershell
# Stop any running servers (Ctrl+C)
# Then restart:
npm run dev
```

#### B. .env File Not Loaded
**Solution:**
```powershell
# Restart the dev server:
1. Stop server (Ctrl+C)
2. Run: npm run dev
```

#### C. Firebase Connection Issue
**Check:**
- Open browser console (F12)
- Look for Firebase errors
- Make sure Firebase Firestore is enabled

---

## Issue 3: "Cloudinary Not Configured" ❌

### Error Message:
```
Cloudinary cloud name is not configured
```

### Solution:

#### Check .env File Exists:
```
File: c:\Users\Hademola\Desktop\henna\.env
Should contain:
VITE_CLOUDINARY_CLOUD_NAME=pxz965s7
VITE_CLOUDINARY_UPLOAD_PRESET=henna-designs
```

#### Restart Server:
```powershell
# Stop server
Ctrl+C

# Clear cache and restart
npm run dev
```

---

## Issue 4: Upload Button Does Nothing 🤔

### Possible Causes:

#### A. Not Logged In
**Solution:**
1. Go to: http://localhost:5174/admin/login
2. Login with admin credentials
3. Try uploading

#### B. Form Not Filled
**Check:**
- ✅ Image/video file selected
- ✅ Category selected
- ✅ Title filled in
- ✅ Description filled in

#### C. File Too Large
**Limits:**
- Images: Maximum 5 MB
- Videos: Maximum 10 MB

**Solution:**
- Compress large images before uploading
- Use online tools like TinyPNG

---

## Issue 5: "API Key Error" ❌

### Error Message:
```
API key error
Make sure your upload preset is set to "Unsigned"
```

### Solution:

#### Fix Upload Preset:
1. Go to https://console.cloudinary.com/
2. Settings → Upload → Upload presets
3. Find "henna-designs" preset
4. **Change Signing Mode to: "Unsigned"** ✅
5. Save
6. Try uploading again

---

## Issue 6: Upload Stuck at "Uploading..." 🔄

### Possible Causes:

#### A. Slow Internet Connection
**Solution:**
- Wait a bit longer
- Check progress percentage
- Reduce file size

#### B. Cloudinary Server Issue
**Solution:**
- Wait a few minutes
- Try again
- Check Cloudinary status: https://status.cloudinary.com/

---

## Step-by-Step Upload Process ✅

### To Upload Successfully:

1. **Make Sure Dev Server is Running**
   ```powershell
   npm run dev
   ```

2. **Login to Admin**
   - Go to: http://localhost:5174/admin/login
   - Enter credentials

3. **Go to Gallery Management**
   - Should see upload form

4. **Fill Out Form**:
   ```
   ✅ Select file (image or video)
   ✅ Choose category from dropdown
   ✅ Enter title
   ✅ Enter description
   ✅ Check "Featured" if desired
   ```

5. **Click Upload**
   - Should see progress bar
   - Wait for "Upload complete!" message

6. **Verify Upload**
   - Go to homepage
   - Scroll to "Featured Gallery" or "Design Collections"
   - Should see your uploaded image

---

## Quick Diagnostics 🔍

### Test 1: Check Environment Variables
Open browser console (F12) and type:
```javascript
console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
```
Should show: `pxz965s7`

If it shows `undefined`:
- .env file missing or incorrect
- Need to restart dev server

### Test 2: Check Cloudinary Config
In browser console:
```javascript
fetch('https://api.cloudinary.com/v1_1/pxz965s7/image/upload', {
  method: 'OPTIONS'
}).then(r => console.log('Cloudinary OK'));
```
Should show: `Cloudinary OK`

### Test 3: Check Firebase Connection
In browser console:
```javascript
console.log('Firebase loaded:', !!window.firebase);
```

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Upload preset not found" | Preset not created | Create "henna-designs" preset |
| "Invalid API key" | Preset not unsigned | Set preset to "Unsigned" mode |
| "Cloudinary not configured" | .env missing | Check .env file, restart server |
| "File too large" | File > 5MB (images) | Compress file |
| Button does nothing | Not logged in | Login to admin first |
| Upload stuck | Internet slow | Wait or reduce file size |
| Image not appearing | Firebase issue | Check browser console |

---

## Still Not Working? 🆘

### Complete Reset Procedure:

1. **Stop Dev Server**
   ```powershell
   Ctrl+C
   ```

2. **Verify .env File**
   - Check file exists: `c:\Users\Hademola\Desktop\henna\.env`
   - Check content matches your Cloudinary details

3. **Create Upload Preset**
   - Go to Cloudinary dashboard
   - Create "henna-designs" preset
   - Set to "Unsigned" mode

4. **Clear Browser Cache**
   - Press F12
   - Right-click refresh button
   - "Empty Cache and Hard Reload"

5. **Restart Everything**
   ```powershell
   npm run dev
   ```

6. **Login Again**
   - http://localhost:5174/admin/login

7. **Try Upload**
   - Small test image first
   - Check all form fields filled

---

## Verify Cloudinary Setup ✅

### Checklist:

- [ ] Cloudinary account created
- [ ] Cloud name: `pxz965s7`
- [ ] Upload preset "henna-designs" exists
- [ ] Preset signing mode: **Unsigned** ✅
- [ ] Preset folder: `henna-gallery`
- [ ] .env file has correct values
- [ ] Dev server restarted after .env changes

---

## Test Upload Without Website 🧪

### Test Cloudinary Directly:

Use this curl command to test:

```powershell
curl -X POST https://api.cloudinary.com/v1_1/pxz965s7/image/upload `
  -F "upload_preset=henna-designs" `
  -F "file=@C:\path\to\your\image.jpg"
```

If this works → Cloudinary is OK, issue is in code
If this fails → Cloudinary preset not set up correctly

---

## Browser Console Errors 🐛

### How to Check:

1. **Open Developer Tools**: Press F12
2. **Go to Console tab**
3. **Try uploading**
4. **Look for red errors**

### Common Console Errors:

**"Upload preset not found"**
→ Create preset in Cloudinary

**"Invalid signature"**
→ Change preset to "Unsigned"

**"Failed to fetch"**
→ Internet connection issue

**"CORS error"**
→ Cloudinary CORS settings (shouldn't happen with unsigned)

---

## Need More Help? 📞

### Information to Provide:

1. **Error message** (exact text)
2. **Browser console errors** (screenshot)
3. **Network tab** (F12 → Network → try upload → screenshot failed request)
4. **Steps you've tried** from this guide

### What to Check:

- Dev server running? (`npm run dev`)
- Logged into admin? (http://localhost:5174/admin/login)
- Cloudinary preset created and unsigned?
- .env file correct?
- Browser console errors?

---

## Success Indicators ✅

### Upload is Working When:

1. ✅ Click upload button
2. ✅ See progress bar (0% → 100%)
3. ✅ See "Uploading to Cloudinary..." message
4. ✅ Progress reaches 100%
5. ✅ See "Upload complete!" alert
6. ✅ Form resets (clears)
7. ✅ Go to homepage → see image in gallery

---

**Most common issue:** Upload preset not created or not set to "Unsigned" mode!
