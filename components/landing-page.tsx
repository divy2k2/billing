import { ServicesList } from "@/components/services-list";
import { ProductGrid } from "@/components/product-grid";
import { PlumberGrid } from "@/components/plumber-grid";

const whatsappNumber = "919898196882";
const whatsappText = encodeURIComponent("Hello Gayatri Plywood and Hardware, I need assistance with plumbing or hardware supplies.");
const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappText}`;

export function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Offer Banner */}
      <div className="offer-banner">
        <div className="offer-banner-content">
          <span className="offer-highlight">🔥 SPECIAL OFFER: 20% OFF ALL PLUMBING MATERIALS THIS WEEK! 🔥</span>
          <span>Quality Plumbing & Sanitaryware at Affordable Prices. Book your installation or repair service today!</span>
        </div>
      </div>

      {/* Header / Logo and Navigation */}
      <header className="top-header">
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/images/logo.png" alt="Gayatri Plywood and Hardware Logo" className="logo-image" />
        </a>
        
        <nav className="nav-menu">
          <a href="#products" className="nav-link">Products</a>
          <a href="#plumbers" className="nav-link">Book Plumber</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="nav-link">WhatsApp Support</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="hero-content text-center animate-fade-in-up">
            <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
              Gayatri Plywood and Hardware
            </h1>
            <p className="hero-subtitle">
              Complete plumbing supplies, expert installation, and emergency plumber support.
            </p>
            <p className="hero-description">
              Premium CPVC pipes, fittings, sanitaryware, and 24/7 plumbing services for home and business.
            </p>
            <div className="hero-buttons" style={{ justifyContent: 'center', gap: '1rem' }}>
              <a href="#products" className="btn-primary">Browse Products</a>
              <a href="#plumbers" className="btn-secondary">Book a Plumber</a>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>Our Latest & Top Rated Brands</p>
          <div className="brand-carousel">
            <div className="brand-marquee-content">
              {['1-1.png', '2-1.png', '3-1.png', '4-1.png', '5-1.png', '6.png', '7.png', '8.png', '9.png', '10.png', '1-1.png', '2-1.png', '3-1.png', '4-1.png', '5-1.png'].map((img, i) => (
                <img key={i} src={`/images/trusted/${img}`} alt={`Brand ${i+1}`} className="brand-logo" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Plumbing & Sanitaryware */}
      <section className="section" style={{ padding: '4rem 0', backgroundColor: 'var(--card-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>
            <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
               <img src="/images/trusted/customer.jpg" alt="Customer" style={{ width: '100%', maxWidth: '300px', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', margin: '0 auto 2rem' }} />
               <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 2rem' }}>
                  Gayatri Plywood & Hardware provides premium plumbing materials, sanitaryware, and bathroom accessories. With durable pipes, modern faucets, toilets, and shower systems, we deliver expert guidance, reliable products, and dependable after-sales support to make every bathroom functional, stylish, and long-lasting. We also expertly provide professional plumbing services for all your needs.
               </p>
               <a href="#plumbers" className="btn-primary">Book a Service</a>
            </div>
          </div>
        </div>
      </section>

      {/* Pipes & Hardware Section */}
      <section className="section" style={{ padding: '4rem 0', backgroundColor: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Premium Pipes & Hardware Solutions</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 3rem' }}>
            We stock an extensive range of durable pipes including PVC, CPVC, UPVC, and SWR fitting solutions. Guaranteed high pressure handling, leak-proof joints, and weather resistance for industrial, residential, and commercial plumbing projects.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="type-pill" style={{ fontSize: '1rem', padding: '10px 20px', color: 'var(--text)' }}>🚰 CPVC Hot & Cold Pipes</span>
            <span className="type-pill" style={{ fontSize: '1rem', padding: '10px 20px', color: 'var(--text)' }}>🚰 UPVC Plumbing Systems</span>
            <span className="type-pill" style={{ fontSize: '1rem', padding: '10px 20px', color: 'var(--text)' }}>🚰 SWR Drainage Pipes</span>
            <span className="type-pill" style={{ fontSize: '1rem', padding: '10px 20px', color: 'var(--text)' }}>🔩 Brass & Metal Fittings</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why choose us?</h2>
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
            {[
              { title: "Affordable Prices", desc: "Quality plumbing and bathroom products at fair, budget-friendly prices." },
              { title: "Customer Focus", desc: "Prioritizing customer needs with personalized service, expert guidance, and reliable support." },
              { title: "Quality Of Product", desc: "Offering durable, premium-grade plumbing materials and sanitaryware built to last." },
              { title: "After Sales Services", desc: "Providing dependable support, quick assistance, and hassle-free solutions after purchase." },
              { title: "Guarantee & Warranty", desc: "Ensuring product reliability with trusted guarantees and hassle-free warranty support." },
              { title: "Repair & Maintenance", desc: "Expert repair and maintenance services to keep your plumbing working flawlessly." },
              { title: "Installation Services", desc: "Professional installation for plumbing and sanitaryware, ensuring perfect fit and function." },
              { title: "Consultation & Design", desc: "Expert consultation and creative bathroom designs tailored to your space needs." }
            ].map((feature, idx) => (
              <div key={idx} className="premium-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Comprehensive plumbing and hardware solutions for residential and commercial projects</p>
          <ServicesList />
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section section-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Product Catalog</h2>
          <p className="section-subtitle">Browse our extensive collection of premium plumbing materials and hardware</p>
          <ProductGrid />
        </div>
      </section>

      {/* What We Sell Section */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">What We Sell</h2>
          <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="premium-card">
              <h3>Retail Sales</h3>
              <p>Premium plumbing materials, fittings, and sanitaryware available for home customers.</p>
            </div>
            <div className="premium-card">
              <h3>Wholesale Supply</h3>
              <p>Reliable bulk supply for contractors, builders, and commercial projects at competitive rates.</p>
            </div>
            <div className="premium-card">
              <h3>Plumbing Services</h3>
              <p>Expert installation, repairs, maintenance, and emergency plumbing support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plumbers Section */}
      <section id="plumbers" className="section section-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Book a Professional Plumber</h2>
          <p className="section-subtitle">Connect with licensed, experienced plumbers for all your installation and repair needs</p>
          <PlumberGrid />
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title contact-title">Contact Us</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.92)', maxWidth: '720px', margin: '0.75rem auto 0' }}>Need help with plumbing supplies or service? Reach out anytime — our store is open daily from 9:00 AM to 10:30 PM.</p>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8" style={{ marginTop: '2rem' }}>
            <div className="premium-card contact-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Phone</h3>
              <p>+91 9898196882</p>
            </div>
            <div className="premium-card contact-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>WhatsApp</h3>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Chat on WhatsApp
              </a>
            </div>
            <div className="premium-card contact-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Opening Hours</h3>
              <p>Every day: 9:00 AM to 10:30 PM</p>
            </div>
            <div className="premium-card contact-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Location</h3>
              <p>Main Market, Ahmedabad<br />Near the plumbing warehouse.</p>
            </div>
          </div>
        </div>
      </section>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        style={{
          position: 'fixed',
          right: '1.25rem',
          bottom: '1.25rem',
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '999px',
          padding: '0.95rem 1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
          zIndex: 50,
          textDecoration: 'none'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>💬</span>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}