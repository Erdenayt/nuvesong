import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ============================================
// UTILITY:  Smooth Scroll Handler
// ============================================
const smoothScroll = (targetId) => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// ============================================
// NAVIGATION COMPONENT
// ============================================

const Navigation = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (targetId) => {
    smoothScroll(targetId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navigation ${isSticky ? "sticky" : ""} nav-enter`}>
      <div className="nav-container">
        <div className="nav-logo">
          <h1 className="logo-text">
            <a href="#">🌾 Nüve Permakültür Çiftliği</a>
          </h1>
        </div>
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <li className="nav-item">
            <button
              onClick={() => handleNavClick("products")}
              className="nav-link"
            >
              Ürünlerimiz
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => handleNavClick("photos")} className="nav-link">
              Fotoğraflar
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => handleNavClick("videos")} className="nav-link">
              Videolar
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => handleNavClick("contact")}
              className="nav-link"
            >
              İletişim
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
// ============================================
// HERO SECTION COMPONENT
// ============================================
const HeroSection = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <h2 className="hero-headline">
          Çok Çalışıyoruz... Çünkü Bizim İçin Değerlisiniz ..!
        </h2>
        <p className="hero-text">
          Kendi tarlamızdan sizin sofranıza. En sağlıklı ve lezzetli şekilde
          sebze, meyve ve yumurta üretiyoruz. Yapay gübre ve ilaç kullanmıyoruz.
          Bitkiyi değil toprağı besliyoruz!
        </p>
        <button onClick={() => smoothScroll("products")} className="cta-button">
          Ürünlerimizi Keşfedin
        </button>
      </div>
      <div className="hero-overlay"></div>
    </section>
  );
};

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
const ProductCard = ({
  image,
  name,
  description,
  availability,
  category,
  onCardClick,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`product-card ${isVisible ? "fade-in" : ""}`}
      onClick={onCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image-wrapper">
        <img src={image} alt={name} className="product-image" loading="lazy" />
        <span className="product-category-badge">{category}</span>
      </div>
      <div className="product-content">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-availability">
          <span className="availability-label">Uygunluk durumu :</span>
          <span className="availability-text">{availability}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRODUCT MODAL COMPONENT
// ============================================
const ProductModal = ({ product, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="product-modal" onClick={handleBackdropClick}>
      <div
        className="product-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="product-modal-close" onClick={onClose} type="button">
          ✕
        </button>
        <div className="product-modal-body">
          <div className="product-modal-image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-modal-image"
            />
            <span className="product-modal-category-badge">
              {product.category}
            </span>
          </div>
          <div className="product-modal-info">
            <h2 className="product-modal-title">{product.name}</h2>
            <div className="product-modal-short-description">
              <p>{product.description}</p>
            </div>
            <div className="product-modal-detailed-description">
              <h3>Detaylı Açıklama</h3>
              <p>
                {product.detailedDescription ||
                  "Bu ürün hakkında daha detaylı bilgi yakında eklenecektir. Sorularınız için bizimle iletişime geçebilirsiniz."}
              </p>
            </div>
            <div className="product-modal-availability">
              <span className="availability-label">Uygunluk durumu :</span>
              <span className="availability-text">{product.availability}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRODUCTS SECTION COMPONENT
// ============================================
const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      id: 1,
      name: "Permakültür Yumurta",
      category: "Yumurta",
      description:
        "Günlük topladığımız yumurtalar sadece doğal gıdalarla beslenen tavuklarımızdan sofralarınıza. Yumurtamız kokusuz, taze ve oldukça lezzetlidir.",
      availability: "Yıl boyunca",
      image: "images/stock/eggs.jpg",
      detailedDescription:
        " Permakültür prensiplerine uygun olarak yetiştirilen tavuklarımızdan elde edilen yumurtalar, her gün taze olarak toplanır ve doğrudan sofralarınıza ulaştırılır. Tavuklarımız doğal ortamlarında serbestçe dolaşır, stres yaşamaz ve yalnızca içeriğinde aktif karbon, diatom ve toplam 13 çeşit gıdayla hazırlanan doğal yemle beslenir.",
    },
    {
      id: 2,
      name: "Permakültür Domates Sosu",
      category: "Sos",
      description:
        "En doğal şekilde yetiştirdiğimiz San Marzano cinsi domateslerimizle özenle hazırladığımız domates sosumuz.. Pizza ve yemeklerinizde kullanılmak üzere hazırdır..",
      availability: "Eylül ayından sonra",
      image: "images/stock/tomatosauce.jpg",
      detailedDescription:
        "En doğal yöntemlerle yetiştirdiğimiz, aroması ve dengeli asiditesiyle ünlü San Marzano cinsi domateslerden özenle hazırlanan domates sosumuz, katkı maddesi ve koruyucu içermez. Domateslerimiz tam olgunluğunda hasat edilir, lezzetini kaybetmeden işlenir. Doğal tadı ve yoğun kıvamı sayesinde özellikle pizzalar için mükemmeldir; aynı zamanda makarna, et ve sebze yemeklerinde de farkını hemen hissettirir. Ev yapımı lezzet arayanlar için, zaman kazandıran ama lezzetten ödün vermeyen bir seçenektir.",
    },
    {
      id: 3,
      name: "Çeri Domates",
      category: "Sebze",
      description:
        "Sağlıklı ve son derece lezzetli çeri domateslerimiz, tamamen doğal olarak yetiştirilmiştir. İddialıyız; yedikten yarım saat sonra bile tadını ve aromasını ağzınızda hissedeceksiniz!",
      availability: "Haziran - Eylül",
      image: "images/cesmeli/domates2.jpg",
      detailedDescription:
        "Sağlıklı ve son derece lezzetli çeri domateslerimiz, tamamen doğal yöntemlerle yetiştirilmiştir. Doğal gübre kullanılarak, ilaçsız şekilde üretilen domateslerimiz; tazeliği, yoğun aroması ve dengeli tatlılığıyla fark yaratır. Salatalarda, yemeklerde ya da dalından koparıp taze taze yemek için idealdir. Lezzetine o kadar güveniyoruz ki; yedikten yarım saat sonra bile tadını ve aromasını ağzınızda hissetmeye devam edersiniz. Market domatesi değil, gerçek domates tadını arayanlar için.",
    },
    {
      id: 4,
      name: "Permakültür Mevsim Sebzeleri ",
      category: "Sebze",
      description:
        "Sağlıklı ve lezzetli. Doğal gübre kullanılarak, tamamen ilaçsız şekilde üretilir. Sebzelerimiz doğanın ritmine uygun olarak yetiştirildiği için hem besin değeri hem de aroması yüksektir..",
      availability: "Yıl boyunca",
      image: "images/cesmeli/sebzeler.jpg",
      detailedDescription:
        "Permakültür prensiplerine uygun olarak yetiştirilen mevsim sebzelerimiz; sağlıklı, taze ve lezzetlidir. Her mevsim tarlamızda bulunan sebzeler değişiklik gösterebilir. Güncel olarak hangi sebzelerin mevcut olduğu bilgisi için bizimle iletişime geçebilirsiniz. Gerçek mevsim sebzesinin tadını bilenler için, doğrudan tarladan sofraya..",
    },
    {
      id: 5,
      name: "Permakültür Mevsim Meyveleri ",
      category: "Meyve",
      description:
        " Permakültür prensiplerine uygun olarak yetiştirilen mevsim meyvelerimiz; gerçek meyve tadını arayanlar için idealdir.",
      availability: "Yıl boyunca",
      image: "images/cesmeli/erik2.jpeg",
      detailedDescription:
        "Permakültür prensiplerine uygun olarak yetiştirilen mevsim meyvelerimiz; sağlıklı, taze ve yoğun aromalıdır. Doğal gübre kullanılarak, tamamen ilaçsız şekilde yetiştirilir. Doğanın kendi döngüsüne saygı gösterilerek üretilen meyvelerimiz, gerçek meyve tadını arayanlar için idealdir. Mevsime göre tarlamızda bulunan meyveler değişiklik gösterebilir. Güncel olarak hangi meyvelerin mevcut olduğu bilgisi için bizimle iletişime geçebilirsiniz. Dalından kopmuş gibi taze, doğadan sofranıza.",
    },
  ];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section className="products-section" id="products">
      <div className="section-container">
        <h2 className="section-title">Ürünlerimiz</h2>
        <p className="section-subtitle">
          Üretmediğimiz hiçbir ürünün satışını yapmıyoruz.
        </p>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            Bütün Ürünler
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "Sebze" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Sebze")}
          >
            Sebze
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "Meyve" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Meyve")}
          >
            Meyve
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "Yumurta" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Yumurta")}
          >
            Yumurta
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "Sos" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Sos")}
          >
            Sos
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onCardClick={() => handleProductClick(product)}
            />
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <p className="no-products-message">
            Bu kategoride bir ürün bulunamadı.
          </p>
        )}

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};
// ============================================
// PHOTO GALLERY COMPONENT
// ============================================
const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpenModal = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const photos = [
    { id: 1, url: "images/cesmeli/farmer.jpeg", alt: "Farmer" },
    { id: 2, url: "images/cesmeli/farmer2.jpeg", alt: "Farmer 2" },
    { id: 3, url: "images/cesmeli/traktor.jpeg", alt: "Traktor" },
    { id: 4, url: "images/cesmeli/tavuk1.jpg", alt: "Tavuk 1" },
    { id: 5, url: "images/cesmeli/tarla.jpg", alt: "Tarla" },
    { id: 6, url: "images/cesmeli/tavuk2.jpg", alt: "Tavuk 2" },
    { id: 7, url: "images/cesmeli/tarla2.jpg", alt: "Tarla 2" },
    { id: 8, url: "images/cesmeli/fasulye.jpg", alt: "Fasulye" },
    { id: 9, url: "images/cesmeli/feslegen.jpg", alt: "Feslegen" },
    { id: 10, url: "images/cesmeli/erik1.jpeg", alt: "Erik 1" },
    { id: 11, url: "images/cesmeli/boncuk.jpg", alt: "Boncuk" },
    { id: 12, url: "images/cesmeli/anka.jpg", alt: "Anka" },
  ];

  return (
    <section className="photo-gallery-section" id="photos">
      <div className="section-container">
        <h2 className="section-title">Fotoğraflarımız</h2>
        <p className="section-subtitle">
          Doğal ürettiğimiz ürünleri ve tarlamızı yakından görmek için
          fotoğraflarımızı inceleyebilirsiniz.
        </p>

        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img
                src={photo.url}
                alt={photo.alt}
                className="photo-image"
                onClick={() => handleOpenModal(photo.url)}
              />
              <div className="photo-overlay">
                <button
                  className="view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(photo.url);
                  }}
                  type="button"
                >
                  Büyüt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={handleCloseModal}
              type="button"
            >
              ✕
            </button>
            <img src={selectedPhoto} alt="Full size" className="modal-image" />
          </div>
        </div>
      )}
    </section>
  );
};
// ============================================
// VIDEOS SECTION COMPONENT
// ============================================

const VideosSection = () => {
  const videoId = "uhauM_3ljbc";

  return (
    <section className="videos-section" id="videos">
      <div className="section-container">
        <h2 className="section-title">Permakültür Yolculuğumuzun Hikayesi</h2>
        <p className="section-subtitle">
          Bizi daha yakından tanımak ve sağlıklı bir şekilde ürünlerimizi nasıl
          yetiştirdiğimizi öğrenmek için videomuzu izleyebilirsiniz.
        </p>

        <div className="video-container fade-in">
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                width: "100%",
                height: "600px",
                borderRadius: "12px",
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT FORM COMPONENT
// ============================================
/* const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          İsim Soyisim
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Özgür Güngör"
          aria-label="Your name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          E-mail Adresiniz
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="merhaba@nuvepermakultur.com"
          aria-label="Your email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          className="form-input form-textarea"
          placeholder="Bizim için mesajınız..."
          aria-label="Your message"
        ></textarea>
      </div>

      <button
        type="submit"
        className="form-submit-button"
        aria-label="Send message"
      >
        Gönder
      </button>

      {submitted && (
        <div className="success-message" role="status" aria-live="polite">
          Teşekkürler. En kısa zamanda sizinle iletişime geçeceğiz.
        </div>
      )}
    </form>
  );
}; */

// ============================================
// CONTACT SECTION COMPONENT
// ============================================
const ContactSection = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        <h2 className="section-title">Üyelik İçin...</h2>
        <p className="section-subtitle">
          Eğer sizde Tekirdağ (Merkez), Çorlu veya İstanbul'da yaşıyorsanız ve
          üye olmak istiyorsanız, bizimle iletişime geçebilirsiniz...
        </p>

        <div className="contact-info">
          <a
            href="https://www.instagram.com/nuve_permakultur_ciftligi"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-button"
          >
            <span className="instagram-icon">📷</span>
            Instagram'dan Bize Mesaj Gönderebilirsiniz...
          </a>
          <p>
            <a className="instagram-button" href="tel:+905329999999">
              {" "}
              (532) 999 99 99
            </a>
          </p>
          <p>
            <a
              className="instagram-button"
              href="mailto:merhaba@nuvepermakultur.com"
            >
              merhaba@nuvepermakultur.com
            </a>
          </p>
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=Çeşmeli+Köyü+59740+Tekirdağ+Marmaraereglisi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "var(--border-radius-lg)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nüve Permakültür Çiftliği Konumu"
            ></iframe>
          </div>

          <p>
            <strong>Adresimiz : </strong> Çeşmeli Köyü 59740 Tekirdağ,
            Marmaraereglisi 59740
          </p>
        </div>

        {/* <div className="contact-form-wrapper">
          <ContactForm />
        </div> */}
      </div>
    </section>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-content">
          <p>
            &copy; {currentYear} Nüve Permakültür Çiftliği. Tüm Hakları
            Saklıdır.
          </p>
          <p>Doğayı seven bir aile olarak, Sağlıklı gıda yetiştiriyoruz. 🌱</p>
          <p class="trademark">
            powered by <a href="#">Erdenay Türedi</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  return (
    <div className="app">
      <Navigation />
      <HeroSection />
      <ProductsSection />
      <PhotoGallery />
      <VideosSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
