import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import PaystackPop from '@paystack/inline-js';
import './App.css';

interface GalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description?: string;
  featured?: boolean;
  resourceType?: string; // 'image' or 'video'
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  approved: boolean;
}

function Home() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; type: string; title: string } | null>(null);
  const [fullGalleryOpen, setFullGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGallery();
    fetchTestimonials();
  }, []);

  const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GalleryItem));
      setGallery(items);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'), where('approved', '==', true));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Testimonial));
      setTestimonials(items.slice(0, 3)); // Show only 3 testimonials
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const featuredGallery = gallery.filter(item => item.featured).slice(0, 3);
  const displayGallery = featuredGallery.length >= 3 ? featuredGallery : gallery.slice(0, 3);

  const bridalDesigns = gallery.filter(item => item.category === 'bridal');
  const arabicDesigns = gallery.filter(item => item.category === 'arabic');
  const simpleDesigns = gallery.filter(item => item.category === 'simple');
  const traditionalDesigns = gallery.filter(item => item.category === 'traditional');
  const feetDesigns = gallery.filter(item => item.category === 'feet');
  const eventDesigns = gallery.filter(item => item.category === 'event');

  // Professional booking payment handler with Paystack
  const handlePayBookingFee = () => {
    const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    
    if (!paystackPublicKey || paystackPublicKey.includes('your_paystack')) {
      alert('⚠️ Payment system configuration error. Please contact us via WhatsApp to complete your booking.');
      window.open('https://wa.me/2348085521289?text=Hello%20Layo%20Henna%20Touch!%20I%27d%20like%20to%20book%20and%20pay%20the%20booking%20fee.', '_blank');
      return;
    }

    // Collect customer information
    const customerName = prompt('👤 Enter your full name:');
    if (!customerName || customerName.trim() === '') {
      alert('❌ Name is required to proceed with booking.');
      return;
    }

    const customerEmail = prompt('📧 Enter your email address:');
    if (!customerEmail || !customerEmail.includes('@')) {
      alert('❌ Valid email is required to proceed with booking.');
      return;
    }

    const customerPhone = prompt('📱 Enter your phone number:');
    if (!customerPhone || customerPhone.trim() === '') {
      alert('❌ Phone number is required to proceed with booking.');
      return;
    }

    // Generate unique reference
    const reference = 'HT-BF-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Initialize Paystack payment using the library
    const paystack = PaystackPop.setup({
      key: paystackPublicKey,
      email: customerEmail,
      amount: 250000, // ₦2,500 in kobo (Paystack uses kobo)
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: customerName
          },
          {
            display_name: 'Phone Number',
            variable_name: 'phone_number',
            value: customerPhone
          },
          {
            display_name: 'Service Type',
            variable_name: 'service_type',
            value: 'Henna Booking Fee'
          }
        ]
      },
      onSuccess: (transaction: any) => {
        // Payment successful
        console.log('Payment successful:', transaction);
        
        alert(`✅ Payment Successful!\n\n💰 Amount: ₦2,500\n📝 Reference: ${transaction.reference}\n\n✨ Your booking slot is now secured!\n\nYou'll be redirected to WhatsApp to confirm your booking details.`);
        
        // Redirect to WhatsApp with booking confirmation
        const whatsappMessage = `Hello Layo Henna Touch! 🎨\n\n✅ I've successfully paid the booking fee.\n\n👤 Name: ${customerName}\n📧 Email: ${customerEmail}\n📱 Phone: ${customerPhone}\n💳 Payment Reference: ${transaction.reference}\n💰 Amount: ₦2,500\n\nI'd like to confirm my henna appointment. Please let me know the next steps. Thank you!`;
        
        window.open(`https://wa.me/2348085521289?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      },
      onClose: () => {
        // Payment cancelled
        console.log('Payment cancelled');
        alert('⚠️ Payment cancelled. Your booking fee was not processed.\n\nFeel free to try again when you\'re ready, or contact us via WhatsApp for assistance.');
      }
    });

    // Open Paystack popup
    paystack.openIframe();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openLightbox = (url: string, type: string, title: string) => {
    setLightboxMedia({ url, type, title });
    setLightboxOpen(true);
    // Don't prevent scrolling when opened from full gallery
    if (!fullGalleryOpen) {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxMedia(null);
    // Only restore scrolling if full gallery is not open
    if (!fullGalleryOpen) {
      document.body.style.overflow = 'auto';
    }
  };

  const openFullGallery = () => {
    setFullGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullGallery = () => {
    setFullGalleryOpen(false);
    setLightboxOpen(false);
    setLightboxMedia(null);
    document.body.style.overflow = 'auto';
  };

  const openLightboxFromGallery = (index: number) => {
    const item = gallery[index];
    setCurrentImageIndex(index);
    setLightboxMedia({
      url: item.imageUrl,
      type: item.resourceType || 'image',
      title: item.title
    });
    setLightboxOpen(true);
  };

  const goToNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % gallery.length;
    openLightboxFromGallery(nextIndex);
  };

  const goToPreviousImage = () => {
    const prevIndex = (currentImageIndex - 1 + gallery.length) % gallery.length;
    openLightboxFromGallery(prevIndex);
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen && fullGalleryOpen) {
          closeLightbox();
        } else if (lightboxOpen) {
          closeLightbox();
        } else if (fullGalleryOpen) {
          closeFullGallery();
        }
      } else if (e.key === 'ArrowRight' && lightboxOpen && fullGalleryOpen) {
        goToNextImage();
      } else if (e.key === 'ArrowLeft' && lightboxOpen && fullGalleryOpen) {
        goToPreviousImage();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lightboxOpen, fullGalleryOpen, currentImageIndex]);

  return (
    <div className="app">
      {/* 1. NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">Layo Henna Touch</div>
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <li><a href="#home" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="#gallery" onClick={closeMobileMenu}>Gallery</a></li>
            <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
            <li><a href="#book" className="btn-book" onClick={closeMobileMenu}>Book Now</a></li>
          </ul>
          <button 
            className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="brand-name">Layo Henna Touch</h1>
          <h2 className="hero-headline">Traditional Beauty, Modern Elegance</h2>
          <p className="hero-description">
            Experience the timeless art of henna with intricate designs 
            crafted for your special moments
          </p>
          <a href="#book" className="cta-button">Book Your Appointment</a>
        </div>
      </section>

      {/* 3. FEATURED GALLERY */}
      <section id="gallery" className="featured-gallery">
        <div className="container">
          <h2 className="section-title">Featured Designs</h2>
          <div className="gallery-grid">
            {displayGallery.length > 0 ? (
              <>
                <div className="gallery-item large" onClick={() => openLightbox(displayGallery[0]?.imageUrl, displayGallery[0]?.resourceType || 'image', displayGallery[0]?.title)}>
                  {displayGallery[0]?.resourceType === 'video' ? (
                    <video src={displayGallery[0]?.imageUrl}>
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={displayGallery[0]?.imageUrl} alt={displayGallery[0]?.title} />
                  )}
                  <div className="gallery-overlay">
                    <h3>{displayGallery[0]?.title}</h3>
                    <p className="click-to-view">🔍 Click to view full screen</p>
                  </div>
                </div>
                {displayGallery[1] && (
                  <div className="gallery-item" onClick={() => openLightbox(displayGallery[1]?.imageUrl, displayGallery[1]?.resourceType || 'image', displayGallery[1]?.title)}>
                    {displayGallery[1]?.resourceType === 'video' ? (
                      <video src={displayGallery[1]?.imageUrl}>
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={displayGallery[1]?.imageUrl} alt={displayGallery[1]?.title} />
                    )}
                    <div className="gallery-overlay">
                      <h3>{displayGallery[1]?.title}</h3>
                      <p className="click-to-view">🔍 Click to view</p>
                    </div>
                  </div>
                )}
                {displayGallery[2] && (
                  <div className="gallery-item" onClick={() => openLightbox(displayGallery[2]?.imageUrl, displayGallery[2]?.resourceType || 'image', displayGallery[2]?.title)}>
                    {displayGallery[2]?.resourceType === 'video' ? (
                      <video src={displayGallery[2]?.imageUrl}>
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={displayGallery[2]?.imageUrl} alt={displayGallery[2]?.title} />
                    )}
                    <div className="gallery-overlay">
                      <h3>{displayGallery[2]?.title}</h3>
                      <p className="click-to-view">🔍 Click to view</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p>No gallery images yet. Add some from the admin dashboard!</p>
            )}
          </div>
          <button className="view-gallery-btn" onClick={openFullGallery}>
            View Full Gallery ({gallery.length} items)
          </button>
        </div>
      </section>

      {/* 4. ABOUT THE BRAND */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About Our Art</h2>
              <p>
                With over a decade of experience in the art of henna, we bring 
                traditional techniques and contemporary designs together to create 
                stunning body art for your special occasions.
              </p>
              <p>
                Each design is crafted with natural, organic henna that ensures 
                deep, long-lasting color while being gentle on your skin. From 
                intimate gatherings to grand celebrations, we make every moment 
                memorable with our intricate artistry.
              </p>
              <div className="about-actions">
                <a href="#book" className="btn-primary">Book Now</a>
                <a href="#showcase" className="btn-secondary">View Our Work</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.7. BOOKING PROCESS */}
      <section className="booking-process">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="process-intro">Simple 4-step process to book your henna appointment</p>
          
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">🎨</div>
              <h3>Choose Your Design</h3>
              <p>Browse our gallery and select your preferred style, or bring your own design inspiration.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">📱</div>
              <h3>Contact Us</h3>
              <p>Reach out via WhatsApp or phone. We'll discuss your requirements and answer any questions.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">📅</div>
              <h3>Confirm Date & Pay</h3>
              <p>Secure your slot by confirming the date and paying a booking fee of ₦2,500.</p>
              <button className="pay-booking-fee-btn" onClick={() => handlePayBookingFee()}>
                💳 Pay ₦2,500 Booking Fee Now
              </button>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">✨</div>
              <h3>Get Your Henna Done</h3>
              <p>Relax and enjoy as we create beautiful henna art on your special day!</p>
            </div>
          </div>

          <div className="booking-notes">
            <h4>Important Notes:</h4>
            <ul>
              <li>📍 <strong>Location:</strong> Ilaro, Ogun State (Home service available)</li>
              <li>⏰ <strong>Booking in Advance:</strong> Recommended a weeks ahead for events</li>
              <li>💰 <strong>Payment:</strong> booking fee secures your slot, balance due after service</li>
              <li>📞 <strong>Cancellation:</strong> 48 hours notice required for full refund</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. HENNA SHOWCASE */}
      <section id="showcase" className="showcase">
        <div className="container">
          <h2 className="section-title">Design Collections</h2>
          <div className="showcase-grid">
            <div className="showcase-card">
              <img 
                src={bridalDesigns[0]?.imageUrl || 'https://via.placeholder.com/400x500/3b82f6/ffffff?text=Bridal+Designs'} 
                alt="Bridal henna designs" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
                  target.style.minHeight = '350px';
                }}
              />
              <div className="showcase-info">
                <h3>Bridal Henna</h3>
                <p>Elaborate and intricate patterns for your special day</p>
              </div>
            </div>
            <div className="showcase-card">
              <img 
                src={arabicDesigns[0]?.imageUrl || 'https://via.placeholder.com/400x500/3b82f6/ffffff?text=Arabic+Designs'} 
                alt="Arabic henna designs" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
                  target.style.minHeight = '350px';
                }}
              />
              <div className="showcase-info">
                <h3>Eid Henna</h3>
                <p>Bold, flowing patterns with contemporary flair</p>
              </div>
            </div>
            <div className="showcase-card">
              <img 
                src={simpleDesigns[0]?.imageUrl || 'https://via.placeholder.com/400x500/3b82f6/ffffff?text=Simple+Designs'} 
                alt="Simple henna designs" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
                  target.style.minHeight = '350px';
                }}
              />
              <div className="showcase-info">
                <h3>Birthday Henna</h3>
                <p>Elegant minimalist patterns for everyday beauty</p>
              </div>
            </div>
            <div className="showcase-card">
              <div className="showcase-image-wrapper">
                {traditionalDesigns.length > 0 ? (
                  <img 
                    src={traditionalDesigns[0].imageUrl} 
                    alt="Traditional henna designs"
                  />
                ) : (
                  <div className="placeholder-box">
                    Upload Traditional Designs
                  </div>
                )}
              </div>
              <div className="showcase-info">
                <h3>Party & Event Henna</h3>
                <p>Classic and authentic cultural henna patterns</p>
              </div>
            </div>
            <div className="showcase-card">
              <div className="showcase-image-wrapper">
                {feetDesigns.length > 0 ? (
                  <img 
                    src={feetDesigns[0].imageUrl} 
                    alt="Feet henna designs"
                  />
                ) : (
                  <div className="placeholder-box">
                    Upload Feet Designs
                  </div>
                )}
              </div>
              <div className="showcase-info">
                <h3>Wedding Guest Henna</h3>
                <p>Beautiful henna patterns for feet and ankles</p>
              </div>
            </div>
            <div className="showcase-card">
              <img 
                src={eventDesigns[0]?.imageUrl || 'https://via.placeholder.com/400x500/3b82f6/ffffff?text=Event+Designs'} 
                alt="Event henna designs" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
                  target.style.minHeight = '350px';
                }}
              />
              <div className="showcase-info">
                <h3>Graduation Henna</h3>
                <p>Perfect for festivals, parties, and celebrations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">What Our Clients Say</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="stars">{'★'.repeat(testimonial.rating)}</div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <p className="customer-name">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. BOOKING CTA */}
      <section id="book" className="booking-cta">
        <div className="container">
          <h2>Ready for Your Henna?</h2>
          <p>Book your appointment today and let us create beautiful art for your special occasion</p>
          <a href="https://wa.me/2348085521289?text=Hello%20Layo%20Henna%20Touch!%20I%20would%20like%20to%20book%20an%20appointment." className="cta-button" target="_blank" rel="noopener noreferrer">
            Book Appointment
          </a>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-logo">Layo Henna Touch</h3>
              <p>Creating beautiful memories, one design at a time</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <div className="social-links">
                <a href="https://wa.me/2348085521289" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a href="https://tiktok.com/@hennaartistinilaro" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                  TikTok
                </a>
              </div>
              <p>📍 Ilaro, Ogun State.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#book">Book Now</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Layo Henna Touch. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxMedia && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              ✕
            </button>
            
            {/* Navigation arrows - only show when in full gallery mode */}
            {fullGalleryOpen && gallery.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-prev" 
                  onClick={goToPreviousImage}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button 
                  className="lightbox-nav lightbox-next" 
                  onClick={goToNextImage}
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
            
            <div className="lightbox-content">
              {lightboxMedia.type === 'video' ? (
                <video src={lightboxMedia.url} controls autoPlay className="lightbox-media">
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={lightboxMedia.url} alt={lightboxMedia.title} className="lightbox-media" />
              )}
              <div className="lightbox-footer">
                <h3 className="lightbox-title">{lightboxMedia.title}</h3>
                {fullGalleryOpen && (
                  <p className="lightbox-counter">
                    {currentImageIndex + 1} / {gallery.length}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Gallery Modal */}
      {fullGalleryOpen && (
        <div className="full-gallery-overlay" onClick={closeFullGallery}>
          <div className="full-gallery-container" onClick={(e) => e.stopPropagation()}>
            <div className="full-gallery-header">
              <button className="back-button" onClick={closeFullGallery} aria-label="Back to Home">
                ← Back to Home
              </button>
              <h2>Complete Gallery ({gallery.length} items)</h2>
              <button className="lightbox-close" onClick={closeFullGallery} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="full-gallery-content">
              {gallery.length > 0 ? (
                <div className="full-gallery-grid">
                  {gallery.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="full-gallery-item"
                      onClick={() => openLightboxFromGallery(index)}
                    >
                      {item.resourceType === 'video' ? (
                        <video src={item.imageUrl} className="full-gallery-media">
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={item.imageUrl} alt={item.title} className="full-gallery-media" />
                      )}
                      <div className="full-gallery-item-overlay">
                        <h4>{item.title}</h4>
                        <p className="category-badge">{item.category}</p>
                        <p className="click-hint">🔍 Click to view</p>
                      </div>
                      {item.resourceType === 'video' && (
                        <div className="video-indicator">▶ Video</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-gallery">
                  <p>No items in gallery yet.</p>
                  <p>Upload some from the admin dashboard!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home;
