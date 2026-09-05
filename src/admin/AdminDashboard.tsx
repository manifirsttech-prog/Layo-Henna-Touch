import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin, onAuthChange } from '../auth';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../cloudinary';
import './Admin.css';

interface GalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  featured: boolean;
  createdAt: any;
  resourceType?: string; // 'image' or 'video'
  cloudinaryPublicId?: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  approved: boolean;
  createdAt: any;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gallery');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Gallery form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [fileSize, setFileSize] = useState<string>('');
  const [category, setCategory] = useState('bridal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  // Testimonial form state
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });

    fetchGallery();
    fetchTestimonials();

    return () => unsubscribe();
  }, [navigate]);

  const fetchGallery = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryItem));
    setGallery(items);
  };

  const fetchTestimonials = async () => {
    const querySnapshot = await getDocs(collection(db, 'testimonials'));
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Testimonial));
    setTestimonials(items);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Calculate file size
      const fileSizeMB = file.size / (1024 * 1024);
      setFileSize(`${fileSizeMB.toFixed(2)} MB`);
      
      // Check file size (warn if > 5MB for images, > 10MB for videos)
      const maxSize = file.type.startsWith('video/') ? 10 : 5;
      
      if (fileSizeMB > maxSize) {
        const shouldContinue = window.confirm(
          `⚠️ Large File Warning!\n\n` +
          `File size: ${fileSizeMB.toFixed(2)}MB\n` +
          `Recommended max: ${maxSize}MB\n\n` +
          `Large files take longer to upload and may cause issues.\n\n` +
          `Tips:\n` +
          `• Compress the ${file.type.startsWith('video/') ? 'video' : 'image'} before uploading\n` +
          `• Use online tools like TinyPNG or CloudConvert\n\n` +
          `Continue anyway?`
        );
        
        if (!shouldContinue) {
          e.target.value = '';
          return;
        }
      }
      
      setImageFile(file);
      
      // Determine if it's image or video
      const isVideo = file.type.startsWith('video/');
      setFileType(isVideo ? 'video' : 'image');
      
      // Create preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image or video');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing upload...');

    try {
      // Simulate progress for user feedback
      setUploadProgress(10);
      setUploadStatus('Uploading to Cloudinary...');
      
      // Upload to Cloudinary (automatically detects image or video)
      const cloudinaryResult = await uploadToCloudinary(imageFile);
      
      setUploadProgress(70);
      setUploadStatus('Saving to database...');

      // Save to Firestore
      await addDoc(collection(db, 'gallery'), {
        imageUrl: cloudinaryResult.url,
        cloudinaryPublicId: cloudinaryResult.publicId,
        resourceType: cloudinaryResult.resourceType,
        category,
        title,
        description,
        featured,
        createdAt: new Date()
      });

      setUploadProgress(100);
      setUploadStatus('Upload complete!');

      setTimeout(() => {
        alert(`${fileType === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
        
        // Reset form
        setImageFile(null);
        setImagePreview('');
        setTitle('');
        setDescription('');
        setFeatured(false);
        setFileType('image');
        setUploadProgress(0);
        setUploadStatus('');
        
        fetchGallery();
      }, 500);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      setUploadStatus('');
      
      // Show specific error message
      const errorMessage = error.message || 'Upload failed. Please try again.';
      
      if (errorMessage.includes('upload preset')) {
        alert(`❌ Upload Preset Missing!\n\n${errorMessage}\n\nSteps to fix:\n1. Go to https://console.cloudinary.com/\n2. Settings → Upload → Upload presets\n3. Click "Add upload preset"\n4. Name: henna-designs\n5. Signing Mode: Unsigned\n6. Folder: henna-gallery\n7. Save`);
      } else if (errorMessage.includes('API key')) {
        alert(`❌ API Key Error!\n\n${errorMessage}\n\nSteps to fix:\n1. Go to https://console.cloudinary.com/\n2. Settings → Upload → Upload presets\n3. Find "henna-designs" preset\n4. Make sure Signing Mode is set to "Unsigned"\n5. Save changes`);
      } else {
        alert(`❌ Upload Error:\n\n${errorMessage}`);
      }
    }
    setLoading(false);
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'gallery', id));
      fetchGallery();
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'testimonials'), {
        name: testimonialName,
        text: testimonialText,
        rating: testimonialRating,
        approved: true,
        createdAt: new Date()
      });

      alert('Testimonial added successfully!');
      
      // Reset form
      setTestimonialName('');
      setTestimonialText('');
      setTestimonialRating(5);
      
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Failed to add testimonial.');
    }
    setLoading(false);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    }
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'testimonials', id), {
      approved: !currentStatus
    });
    fetchTestimonials();
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Layo Henna Touch</h2>
        <nav>
          <button
            className={activeTab === 'gallery' ? 'active' : ''}
            onClick={() => setActiveTab('gallery')}
          >
            📸 Gallery
          </button>
          <button
            className={activeTab === 'testimonials' ? 'active' : ''}
            onClick={() => setActiveTab('testimonials')}
          >
            ⭐ Testimonials
          </button>
          <button onClick={() => navigate('/')}>
            🏠 View Website
          </button>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        {activeTab === 'gallery' && (
          <div className="admin-section">
            <h1>Gallery Management</h1>

            <div className="upload-form">
              <h2>Upload New Design</h2>
              <form onSubmit={handleGallerySubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Image or Video *</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageChange}
                      required
                    />
                    {imagePreview && (
                      <div className="media-preview">
                        {fileType === 'video' ? (
                          <video src={imagePreview} controls className="image-preview">
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                        )}
                        <p className="file-size-info">
                          File size: <strong>{fileSize}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                      <option value="bridal">Bridal Henna</option>
                      <option value="arabic">Eid Henna</option>
                      <option value="simple">Birthday Henna</option>
                      <option value="traditional">Part & Event Henna</option>
                      <option value="feet">Wedding Guest Henna</option>
                      <option value="event">Graduation Henna</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g., Elegant Bridal Pattern"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the design..."
                    rows={3}
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    Featured Design
                  </label>
                </div>

                {loading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="progress-text">{uploadStatus}</p>
                  </div>
                )}

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '⏳ Uploading...' : '📤 Upload Design'}
                </button>
              </form>
            </div>

            <div className="gallery-list">
              <h2>Current Gallery ({gallery.length} items)</h2>
              <div className="gallery-grid-admin">
                {gallery.map((item) => (
                  <div key={item.id} className="gallery-card-admin">
                    {item.resourceType === 'video' ? (
                      <video src={item.imageUrl} controls className="gallery-media">
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={item.imageUrl} alt={item.title} className="gallery-media" />
                    )}
                    <div className="card-info">
                      <h3>{item.title}</h3>
                      <p className="category">{item.category}</p>
                      {item.resourceType === 'video' && <span className="badge badge-video">Video</span>}
                      {item.featured && <span className="badge">Featured</span>}
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="admin-section">
            <h1>Testimonials Management</h1>

            <div className="upload-form">
              <h2>Add New Testimonial</h2>
              <form onSubmit={handleTestimonialSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      type="text"
                      value={testimonialName}
                      onChange={(e) => setTestimonialName(e.target.value)}
                      required
                      placeholder="e.g., Aisha Rahman"
                    />
                  </div>

                  <div className="form-group">
                    <label>Rating *</label>
                    <select
                      value={testimonialRating}
                      onChange={(e) => setTestimonialRating(Number(e.target.value))}
                      required
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                      <option value={3}>⭐⭐⭐ (3 stars)</option>
                      <option value={2}>⭐⭐ (2 stars)</option>
                      <option value={1}>⭐ (1 star)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Testimonial Text *</label>
                  <textarea
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    required
                    placeholder="What did the customer say about your service?"
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Testimonial'}
                </button>
              </form>
            </div>

            <div className="testimonials-list">
              <h2>All Testimonials ({testimonials.length})</h2>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card-admin">
                  <div className="testimonial-header">
                    <h3>{testimonial.name}</h3>
                    <span className="rating">{'⭐'.repeat(testimonial.rating)}</span>
                  </div>
                  <p>{testimonial.text}</p>
                  <div className="testimonial-actions">
                    <button
                      onClick={() => handleToggleApproval(testimonial.id, testimonial.approved)}
                      className={testimonial.approved ? 'btn-approved' : 'btn-pending'}
                    >
                      {testimonial.approved ? '✓ Approved' : '⏳ Pending'}
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
