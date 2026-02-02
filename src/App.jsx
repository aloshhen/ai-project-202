import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Scissors, Menu, X, Star, Clock, MapPin, Phone, Mail, Instagram, Send, CheckCircle, Award, Users } from 'lucide-react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Form Handler Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    
    const formData = new FormData(e.target);
    formData.append('access_key', accessKey);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        e.target.reset();
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Něco se pokazilo');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('Chyba sítě. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');
  };
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm };
};

// Map Component
const CleanMap = ({ coordinates = [14.4378, 50.0755], zoom = 15, markers = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    const styleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: coordinates,
      zoom: zoom,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: true,
      keyboard: false
    });

    map.current.scrollZoom.disable();

    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 28px;
          height: 28px;
          background: #d97706;
          border-radius: 50%;
          border: 3px solid #1c1917;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.5);
          cursor: pointer;
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat([marker.lng, marker.lat])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>${marker.title}</strong>`))
          .addTo(map.current);
      });
    } else {
      const el = document.createElement('div');
      el.style.cssText = `
        width: 28px;
        height: 28px;
        background: #d97706;
        border-radius: 50%;
        border: 3px solid #1c1917;
        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.5);
      `;
      new maplibregl.Marker({ element: el })
        .setLngLat(coordinates)
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, zoom, markers]);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-stone-800 shadow-2xl relative">
      <style>{
        `.maplibregl-ctrl-attrib { display: none !important; }
        .maplibregl-ctrl-logo { display: none !important; }
        .maplibregl-compact { display: none !important; }`
      }</style>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

// Booking Form Component
const BookingForm = () => {
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler();
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'; // Replace with your Web3Forms Access Key from https://web3forms.com

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Jméno a příjmení"
                  required
                  className="w-full px-6 py-4 bg-stone-900/50 border-2 border-stone-800 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon"
                  required
                  className="w-full px-6 py-4 bg-stone-900/50 border-2 border-stone-800 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-6 py-4 bg-stone-900/50 border-2 border-stone-800 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <select
                  name="service"
                  required
                  className="w-full px-6 py-4 bg-stone-900/50 border-2 border-stone-800 rounded-lg text-white focus:outline-none focus:border-amber-600 transition-colors"
                >
                  <option value="">Vyberte službu</option>
                  <option value="classic-cut">Klasický střih</option>
                  <option value="modern-cut">Moderní střih</option>
                  <option value="beard-trim">Úprava vousů</option>
                  <option value="royal-shave">Královské holení</option>
                  <option value="deluxe">Deluxe balíček</option>
                </select>
              </div>
              <div>
                <input
                  type="datetime-local"
                  name="datetime"
                  required
                  className="w-full px-6 py-4 bg-stone-900/50 border-2 border-stone-800 rounded-lg text-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Poznámka (volitelné)"
                rows="3"
                className="w-full px-6 py-4 bg-stone-900/50 border-2 border-stone-800 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors resize-none"
              ></textarea>
            </div>

            {isError && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-white px-8 py-5 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3 shadow-lg shadow-amber-600/30 min-h-[60px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Odesílání...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Rezervovat termín
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-center py-16"
          >
            <div className="bg-amber-600/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-amber-600">
              <CheckCircle className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-4 font-display">
              Rezervace odeslána!
            </h3>
            <p className="text-stone-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Děkujeme za Vaši rezervaci. Brzy Vás budeme kontaktovat pro potvrzení termínu.
            </p>
            <button
              onClick={resetForm}
              className="text-amber-600 hover:text-amber-500 font-semibold text-lg transition-colors"
            >
              ← Zpět na formulář
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const servicesRef = useRef(null);
  const galleryRef = useRef(null);
  const reviewsRef = useRef(null);
  
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });
  const reviewsInView = useInView(reviewsRef, { once: true, margin: "-100px" });

  const services = [
    { name: 'Klasický střih', price: '800 Kč', duration: '45 min', description: 'Precizní střih podle přání klienta s konzultací stylingu' },
    { name: 'Moderní střih', price: '900 Kč', duration: '60 min', description: 'Aktuální trendy a kreativní přístup k Vašemu stylu' },
    { name: 'Úprava vousů', price: '500 Kč', duration: '30 min', description: 'Profesionální tvarování a péče o vousy' },
    { name: 'Královské holení', price: '700 Kč', duration: '45 min', description: 'Tradiční horká pěna, břitva a relaxační masáž obličeje' },
    { name: 'Střih + Vousy', price: '1200 Kč', duration: '75 min', description: 'Kompletní péče o vlasy i vousy v jednom balíčku' },
    { name: 'Deluxe balíček', price: '1800 Kč', duration: '120 min', description: 'Střih, holení, masáž, styling - kompletní zážitek' },
  ];

  const reviews = [
    { name: 'Martin K.', role: 'CEO', rating: 5, text: 'Nejlepší barbershop v Praze. Profesionální přístup, skvělá atmosféra a výsledek vždy perfektní. Doporučuji každému, kdo hledá kvalitu.' },
    { name: 'Petr N.', role: 'Architekt', rating: 5, text: 'Chodím sem pravidelně už rok. Vždy spokojenost, precizní práce a příjemné prostředí. BAZA je pro mě jasná volba.' },
    { name: 'David S.', role: 'Podnikatel', rating: 5, text: 'Konečně barbershop, kde rozumí potřebám profesionálů. Rychlá online rezervace, vždy na čas, vynikající výsledek.' },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&q=80',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-stone-950/95 backdrop-blur-xl z-50 border-b border-stone-800">
        <nav className="container mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Scissors className="w-6 h-6 text-stone-950" />
            </div>
            <span className="text-3xl font-black text-white font-display tracking-tight">BAZA</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('services')} className="text-stone-300 hover:text-amber-600 transition-colors font-medium">Služby</button>
            <button onClick={() => scrollToSection('gallery')} className="text-stone-300 hover:text-amber-600 transition-colors font-medium">Galerie</button>
            <button onClick={() => scrollToSection('reviews')} className="text-stone-300 hover:text-amber-600 transition-colors font-medium">Recenze</button>
            <button onClick={() => scrollToSection('contact')} className="text-stone-300 hover:text-amber-600 transition-colors font-medium">Kontakt</button>
          </div>

          <div className="hidden md:block">
            <button onClick={() => scrollToSection('booking')} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-amber-600/30">
              Rezervovat
            </button>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-stone-900 border-t border-stone-800"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                <button onClick={() => scrollToSection('services')} className="block w-full text-left text-stone-300 hover:text-amber-600 transition-colors font-medium py-2">Služby</button>
                <button onClick={() => scrollToSection('gallery')} className="block w-full text-left text-stone-300 hover:text-amber-600 transition-colors font-medium py-2">Galerie</button>
                <button onClick={() => scrollToSection('reviews')} className="block w-full text-left text-stone-300 hover:text-amber-600 transition-colors font-medium py-2">Recenze</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-stone-300 hover:text-amber-600 transition-colors font-medium py-2">Kontakt</button>
                <button onClick={() => scrollToSection('booking')} className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-all mt-4">
                  Rezervovat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 md:px-6 min-h-screen flex items-center mobile-safe-container">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80" 
            alt="BAZA Barbershop interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/70 to-stone-950" />
        </div>
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-amber-600"></div>
              <span className="text-amber-600 font-bold text-lg tracking-widest">PRAGUE</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter font-display leading-none">
              Premium<br/>Barbershop<br/>
              <span className="text-amber-600">BAZA</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 mb-8 leading-relaxed font-light">
              Kde se tradice setkává s moderním stylem.<br/>
              Pro muže, kteří si cení kvality a preciznosti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollToSection('booking')} className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-lg text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-2xl shadow-amber-600/40 min-h-[64px]">
                Rezervovat online
                <Scissors className="w-5 h-5" />
              </button>
              <button onClick={() => scrollToSection('services')} className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-lg text-lg font-bold transition-all backdrop-blur-sm border-2 border-white/20 min-h-[64px]">
                Zobrazit služby
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4 md:px-6 bg-stone-900/50 border-y border-stone-800 mobile-safe-container">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-amber-600 mb-2 font-display">8+</div>
              <div className="text-stone-400 font-medium">Let zkušeností</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-amber-600 mb-2 font-display">5000+</div>
              <div className="text-stone-400 font-medium">Spokojených klientů</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-amber-600 mb-2 font-display">4.9</div>
              <div className="text-stone-400 font-medium">Hodnocení</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-amber-600 mb-2 font-display">100%</div>
              <div className="text-stone-400 font-medium">Profesionalita</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={servicesRef} className="py-24 px-4 md:px-6 bg-gradient-to-b from-stone-950 to-stone-900 mobile-safe-container">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-amber-600"></div>
              <span className="text-amber-600 font-bold tracking-widest">SLUŽBY</span>
              <div className="h-1 w-12 bg-amber-600"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">
              Naše služby
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Každá služba je poskytována s maximální péčí a profesionalitou
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-stone-900/50 backdrop-blur-sm border-2 border-stone-800 rounded-xl p-8 hover:border-amber-600/50 transition-all transform hover:scale-[1.02] group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-600 transition-colors">
                    {service.name}
                  </h3>
                  <div className="bg-amber-600/20 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-600 inline mr-1" />
                    <span className="text-amber-600 text-sm font-semibold">{service.duration}</span>
                  </div>
                </div>
                <p className="text-stone-400 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-3xl font-black text-amber-600 font-display">
                  {service.price}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" ref={galleryRef} className="py-24 px-4 md:px-6 bg-stone-950 mobile-safe-container">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-amber-600"></div>
              <span className="text-amber-600 font-bold tracking-widest">GALERIE</span>
              <div className="h-1 w-12 bg-amber-600"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">
              Naše práce
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Podívejte se na výsledky naší práce a inspirujte se
            </p>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-500 font-bold transition-colors"
            >
              <Instagram className="w-5 h-5" />
              Sledujte nás na Instagramu
            </a>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="aspect-square overflow-hidden rounded-xl border-2 border-stone-800 hover:border-amber-600 transition-all group"
              >
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" ref={reviewsRef} className="py-24 px-4 md:px-6 bg-gradient-to-b from-stone-900 to-stone-950 mobile-safe-container">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-amber-600"></div>
              <span className="text-amber-600 font-bold tracking-widest">RECENZE</span>
              <div className="h-1 w-12 bg-amber-600"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">
              Co říkají klienti
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-stone-900/50 backdrop-blur-sm border-2 border-stone-800 rounded-xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-600 text-amber-600" />
                  ))}
                </div>
                <p className="text-stone-300 mb-6 leading-relaxed italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{review.name}</div>
                    <div className="text-stone-500 text-sm">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 px-4 md:px-6 bg-stone-950 mobile-safe-container">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-amber-600"></div>
              <span className="text-amber-600 font-bold tracking-widest">REZERVACE</span>
              <div className="h-1 w-12 bg-amber-600"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">
              Rezervujte si termín
            </h2>
            <p className="text-xl text-stone-400 leading-relaxed">
              Vyplňte formulář a my Vás budeme kontaktovat pro potvrzení
            </p>
          </div>

          <div className="bg-stone-900/30 backdrop-blur-sm border-2 border-stone-800 rounded-2xl p-8 md:p-12">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* CONTACT & MAP */}
      <section id="contact" className="py-24 px-4 md:px-6 bg-gradient-to-b from-stone-900 to-stone-950 mobile-safe-container telegram-safe-bottom">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-amber-600"></div>
              <span className="text-amber-600 font-bold tracking-widest">KONTAKT</span>
              <div className="h-1 w-12 bg-amber-600"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-display tracking-tight">
              Navštivte nás
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-stone-900/50 backdrop-blur-sm border-2 border-stone-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-amber-600" />
                  Adresa
                </h3>
                <p className="text-stone-300 text-lg leading-relaxed mb-4">
                  Pařížská 123<br/>
                  110 00 Praha 1<br/>
                  Česká republika
                </p>
              </div>

              <div className="bg-stone-900/50 backdrop-blur-sm border-2 border-stone-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-600" />
                  Otevírací doba
                </h3>
                <div className="space-y-3 text-stone-300">
                  <div className="flex justify-between">
                    <span className="font-medium">Po - Pá:</span>
                    <span>09:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sobota:</span>
                    <span>10:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Neděle:</span>
                    <span className="text-amber-600">Zavřeno</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-900/50 backdrop-blur-sm border-2 border-stone-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-amber-600" />
                  Kontaktní údaje
                </h3>
                <div className="space-y-4">
                  <a href="tel:+420123456789" className="flex items-center gap-3 text-stone-300 hover:text-amber-600 transition-colors text-lg">
                    <Phone className="w-5 h-5" />
                    +420 123 456 789
                  </a>
                  <a href="mailto:info@bazabarbershop.cz" className="flex items-center gap-3 text-stone-300 hover:text-amber-600 transition-colors text-lg">
                    <Mail className="w-5 h-5" />
                    info@bazabarbershop.cz
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-300 hover:text-amber-600 transition-colors text-lg">
                    <Instagram className="w-5 h-5" />
                    @bazabarbershop
                  </a>
                </div>
              </div>
            </div>

            <div>
              <CleanMap 
                coordinates={[14.4378, 50.0755]}
                zoom={15}
                markers={[
                  { lat: 50.0755, lng: 14.4378, title: 'BAZA Barbershop' }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 border-t-2 border-stone-800 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-600 p-2 rounded-lg">
                <Scissors className="w-6 h-6 text-stone-950" />
              </div>
              <span className="text-2xl font-black text-white font-display">BAZA</span>
            </div>
            
            <div className="text-stone-500 text-sm text-center">
              © 2024 BAZA Barbershop Prague. Všechna práva vyhrazena.
            </div>

            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-stone-900 hover:bg-amber-600 p-3 rounded-lg transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App