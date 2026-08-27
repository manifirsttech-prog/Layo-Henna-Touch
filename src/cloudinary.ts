// Cloudinary Configuration
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
};

// Cloudinary Upload Widget Configuration
export const getCloudinaryUploadWidget = () => {
  return {
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: 'henna-designs', // You'll need to create this in Cloudinary dashboard
    folder: 'henna-gallery',
    sources: ['local', 'camera', 'url'],
    multiple: true,
    maxFiles: 10,
    maxFileSize: 5000000, // 5MB
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    styles: {
      palette: {
        window: '#FFFFFF',
        windowBorder: '#1e40af',
        tabIcon: '#3b82f6',
        menuIcons: '#1e40af',
        textDark: '#000000',
        textLight: '#FFFFFF',
        link: '#3b82f6',
        action: '#3b82f6',
        inactiveTabIcon: '#999999',
        error: '#F44235',
        inProgress: '#3b82f6',
        complete: '#10b981',
        sourceBg: '#f8f9fa'
      }
    }
  };
};

// Upload image OR video to Cloudinary
export const uploadToCloudinary = async (file: File) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  // Determine if file is video or image
  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'henna-designs');
  // Note: For unsigned uploads, we only need file and upload_preset
  // Don't send API key, API secret, or manually set folder (it's in the preset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Provide more specific error message
      const errorMessage = data.error?.message || 'Upload failed';
      console.error('Cloudinary error:', data);
      throw new Error(errorMessage);
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      resourceType: data.resource_type, // 'image' or 'video'
      format: data.format,
      duration: data.duration, // Only for videos
    };
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('Invalid upload preset') || error.message.includes('preset')) {
      throw new Error('Upload preset not found. Please create "henna-designs" preset in Cloudinary dashboard.');
    } else if (error.message.includes('API key') || error.message.includes('api_key')) {
      throw new Error('API key error. Make sure your upload preset is set to "Unsigned" mode in Cloudinary.');
    } else if (error.message.includes('cloud_name')) {
      throw new Error('Cloudinary is not configured properly. Check your .env file.');
    } else {
      throw new Error(error.message || 'Failed to upload file. Please try again.');
    }
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  } = {}
) => {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  const transformations = [
    `w_${width}`,
    height ? `h_${height}` : '',
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
};

// Delete image from Cloudinary (requires backend for security)
export const deleteFromCloudinary = async (publicId: string) => {
  // Note: This should be done from your backend for security
  // The API secret should never be exposed in the frontend
  console.warn('Delete operation should be performed from backend', publicId);
  return {
    success: false,
    message: 'Delete must be done from backend'
  };
};

export default cloudinaryConfig;
