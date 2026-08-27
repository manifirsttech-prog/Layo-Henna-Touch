# Video Support Added! 🎥

Your admin dashboard now supports both **image** and **video** uploads!

## ✨ What's New

### Upload Both Images & Videos
- ✅ Upload images (JPG, PNG, GIF, WebP)
- ✅ Upload videos (MP4, MOV, AVI, WebM)
- ✅ Automatic detection of file type
- ✅ Preview before uploading
- ✅ Video badge in gallery

## 🚀 How to Use

### In Admin Dashboard:

1. **Navigate to Gallery tab**
2. **Click "Choose File"** 
3. **Select an image OR video**
   - Supports: JPG, PNG, GIF, WebP (images)
   - Supports: MP4, MOV, AVI, WebM (videos)
4. **Preview appears automatically**
   - Images show as thumbnails
   - Videos show with video player
5. **Fill in details** (title, category, description)
6. **Click "Upload Design"**
7. **Video uploads to Cloudinary** automatically
8. **Appears in gallery** with "Video" badge

### On Website:

- Videos display in Featured Gallery section
- Videos have playback controls
- Auto-detects and displays correctly
- Works on mobile devices

## 📋 File Requirements

### Images:
- Max size: 5MB (recommended)
- Formats: JPG, JPEG, PNG, GIF, WebP
- Recommended size: 1200x1600px

### Videos:
- Max size: 10MB (Cloudinary default)
- Formats: MP4, MOV, AVI, WebM
- Recommended: MP4 format for best compatibility
- Duration: Up to 60 seconds (recommended)

## 🎨 Features

### Admin Dashboard:
- ✅ Video preview with controls
- ✅ Purple "Video" badge to identify videos
- ✅ Same management as images (delete, featured, etc.)
- ✅ Upload progress indicator

### Website Display:
- ✅ Videos show in Featured Gallery
- ✅ Video controls (play, pause, volume)
- ✅ Responsive design
- ✅ Works on all devices

## 🔧 Technical Details

### How It Works:

1. **File Selection**: Detects if file is image or video
2. **Upload**: Sends to appropriate Cloudinary endpoint
   - Images: `/image/upload`
   - Videos: `/video/upload`
3. **Storage**: Saves resource type in Firestore
4. **Display**: Renders `<video>` or `<img>` tag based on type

### Database Structure:

```javascript
{
  imageUrl: "https://res.cloudinary.com/...",
  cloudinaryPublicId: "henna-gallery/video-123",
  resourceType: "video", // or "image"
  category: "bridal",
  title: "Beautiful Bridal Video",
  description: "Time-lapse of henna application",
  featured: true,
  createdAt: timestamp
}
```

## 📝 Best Practices

### For Images:
- Use high-resolution photos
- Good lighting is essential
- Show the henna design clearly
- Close-up shots work best

### For Videos:
- Keep videos short (10-30 seconds ideal)
- Compress before uploading for faster load
- Good lighting and steady camera
- Show application process or final result
- MP4 format recommended for compatibility

## 🎯 Use Cases

### Images Best For:
- Finished henna designs
- Detail shots
- Before/after comparisons
- Portfolio showcase

### Videos Best For:
- Application process (time-lapse)
- Design tutorials
- Behind-the-scenes
- Customer testimonials
- Event highlights

## 🆘 Troubleshooting

### Video Not Uploading?
- Check file size (max 10MB)
- Verify format is MP4, MOV, or WebM
- Ensure Cloudinary preset accepts videos
- Check browser console for errors

### Video Not Playing on Website?
- Browser compatibility (use MP4 for best support)
- Check file wasn't corrupted
- Verify URL in Firestore is correct
- Test in different browser

### Upload Taking Too Long?
- Large video files take time
- Compress video before uploading
- Use tools like HandBrake or FFmpeg
- Recommended: Keep under 5MB

## 🎥 Video Compression Tips

To reduce video file size:

1. **Use Online Tools:**
   - CloudConvert.com
   - FreeConvert.com
   - Compress-video.com

2. **Desktop Tools:**
   - HandBrake (free, open-source)
   - FFmpeg (command-line)
   - VLC Media Player

3. **Recommended Settings:**
   - Format: MP4 (H.264)
   - Resolution: 720p (1280x720)
   - Bitrate: 1-2 Mbps
   - Frame rate: 30 fps

## 🌟 Examples

### Good Video Content:
- ✅ 15-second time-lapse of henna application
- ✅ 10-second showcase of finished design
- ✅ 20-second customer testimonial
- ✅ 30-second event highlights reel

### Avoid:
- ❌ Very long videos (>60 seconds)
- ❌ Large file sizes (>10MB)
- ❌ Low quality or shaky footage
- ❌ Poor lighting

## 🎉 Benefits

- **Engaging**: Videos attract more attention
- **Educational**: Show your process
- **Professional**: Showcase your skills
- **Social Media**: Easy to share
- **SEO**: Videos improve search rankings

---

**Now you can showcase both beautiful henna photos AND videos of your work!** 🎨📹
