import { useEffect, useState } from 'react';
import {
  MapPin, Ruler, DoorOpen, Building, Calendar, Phone, MessageSquare, X, ArrowLeft, ArrowRight
} from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout';
import { PropertyFeatures } from '../../components/public/PropertyFeatures';
import { supabase } from '../../lib/supabase';
import { Link } from '../../components/Router';
import { COMPANY_INFO } from '../../lib/constants';
import { PropertyType } from '../../lib/propertyTypes';
import type { Database } from '../../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyDetailProps {
  slug: string;
}

export function PropertyDetail({ slug }: PropertyDetailProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const defaultImage = 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1920';

  useEffect(() => {
    loadProperty();
  }, [slug]);

  async function loadProperty() {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setProperty(data);

      const { data: propertyImages } = await supabase
        .from('property_images')
        .select('url')
        .eq('property_id', data.id)
        .order('order_index', { ascending: true });

      if (propertyImages && propertyImages.length > 0) {
        const imageUrls = propertyImages.map(img => img.url);
        setImages(imageUrls);
      } else {
        setImages([defaultImage]);
      }

      await supabase
        .from('properties')
        .update({ views: data.views + 1 })
        .eq('id', data.id);

      const { data: similar } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'aktivno')
        .eq('city', data.city)
        .neq('id', data.id)
        .limit(4);

      setSimilarProperties(similar || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-screen bg-[#EEEEEE]">
          <div className="w-12 h-12 border-4 border-[#7096AF]/20 border-t-[#7096AF] rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  if (!property) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-screen bg-[#EEEEEE]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Oglas nije pronađen</h1>
            <Link to="/search" className="text-[#7096AF] hover:text-[#5a7a96]">
              Vrati se na pretragu
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#EEEEEE] min-h-screen">
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#7096AF] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Nazad na pretragu
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-[500px] bg-gray-200 cursor-pointer" onClick={() => setShowLightbox(true)}>
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-lg">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 p-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer ${
                      selectedImage === idx ? 'ring-2 ring-[#7096AF]' : ''
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{property.city}{property.municipality && `, ${property.municipality}`}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Šifra oglasa</div>
                  <div className="font-mono text-[#7096AF] font-semibold">{property.code}</div>
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-200">
                <div className="text-4xl font-bold text-[#7096AF]">
                  €{property.price.toLocaleString()}
                </div>
                {property.price_per_m2 && (
                  <div className="text-gray-500">
                    €{property.price_per_m2}/m²
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                  <Ruler className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-500">m²</div>
                </div>

                {(property.details as any)?.rooms && (
                  <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                    <DoorOpen className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{(property.details as any).rooms}</div>
                    <div className="text-sm text-gray-500">sobe</div>
                  </div>
                )}

                {(property.details as any)?.floor !== undefined && (property.details as any)?.floor !== null && (
                  <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                    <Building className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{(property.details as any).floor}</div>
                    <div className="text-sm text-gray-500">sprat</div>
                  </div>
                )}

                {(property.details as any)?.year_built && (
                  <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                    <Calendar className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{(property.details as any).year_built}</div>
                    <div className="text-sm text-gray-500">godina</div>
                  </div>
                )}

                {(property.details as any)?.num_floors && (
                  <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                    <Building className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{(property.details as any).num_floors}</div>
                    <div className="text-sm text-gray-500">etaže</div>
                  </div>
                )}

                {(property.details as any)?.garage_spaces && (
                  <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                    <Building className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{(property.details as any).garage_spaces}</div>
                    <div className="text-sm text-gray-500">garažna mesta</div>
                  </div>
                )}

                {(property.details as any)?.area_in_ares && (
                  <div className="text-center p-4 bg-[#EEEEEE] rounded-lg">
                    <Ruler className="w-6 h-6 text-[#7096AF] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{(property.details as any).area_in_ares}</div>
                    <div className="text-sm text-gray-500">ari</div>
                  </div>
                )}
              </div>

              {property.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Opis</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              )}

              <PropertyFeatures
                propertyType={property.property_type as PropertyType}
                transactionType={property.transaction_type}
                details={(property.details as Record<string, any>) || {}}
                heating={property.heating}
                furnished={property.furnished}
                parking={property.parking}
                totalFloors={property.total_floors}
                registered={property.registered}
              />
            </div>

            {!property.hide_exact_address && property.street && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Lokacija</h2>
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-[#7096AF]" />
                  {property.street}, {property.city}
                </div>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  Mapa će biti dostupna uskoro
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Kontaktirajte nas</h3>

                <div className="space-y-3">
                  <a
                    href={`tel:${COMPANY_INFO.contact.phones[0].replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Pozovite
                  </a>

                  <a
                    href={`https://wa.me/${COMPANY_INFO.contact.phones[0].replace(/\s/g, '').replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </a>

                  <button
                    onClick={() => setShowContactModal(true)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all border border-gray-300"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Pošalji upit
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detalji oglasa</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Šifra</span>
                    <span className="text-gray-900 font-medium">{property.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-green-600 font-medium capitalize">{property.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pregleda</span>
                    <span className="text-gray-900 font-medium">{property.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProperties.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Slične nekretnine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showContactModal && (
        <ContactModal
          property={property}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showLightbox && (
        <Lightbox
          images={images}
          selectedIndex={selectedImage}
          onClose={() => setShowLightbox(false)}
          onSelect={setSelectedImage}
        />
      )}
    </PublicLayout>
  );
}

function Feature({ icon, label, value, capitalize }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#EEEEEE] rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-[#7096AF]/10 flex items-center justify-center text-[#7096AF]">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className={`text-gray-900 font-medium ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function ContactModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    leadType: 'upit' as 'upit' | 'obilazak'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await supabase.from('leads').insert({
        property_id: property.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        message: formData.message || null,
        lead_type: formData.leadType,
        status: 'novi'
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      alert('Greška pri slanju upita');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Pošalji upit</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Hvala!</h4>
            <p className="text-gray-600">Vaš upit je uspešno poslat. Kontaktiraćemo vas uskoro.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-[#EEEEEE] rounded-lg mb-6">
              <div className="text-sm text-gray-500 mb-1">Nekretnina</div>
              <div className="text-gray-900 font-medium">{property.title}</div>
              <div className="text-sm text-[#7096AF]">{property.code}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip upita
              </label>
              <select
                value={formData.leadType}
                onChange={(e) => setFormData({ ...formData, leadType: e.target.value as any })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
              >
                <option value="upit">Opšti upit</option>
                <option value="obilazak">Zakazivanje obilaska</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime i prezime <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                placeholder="Vaše ime"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                placeholder="+381 60 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                placeholder="vas@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poruka
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all resize-none"
                placeholder="Dodatne informacije..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Pošalji upit
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Lightbox({ images, selectedIndex, onClose, onSelect }: {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  const handlePrevious = () => {
    onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 text-white hover:bg-white/10 rounded-lg transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <button
          onClick={handlePrevious}
          className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <img
          src={images[selectedIndex]}
          alt=""
          className="max-w-full max-h-full object-contain"
        />

        <button
          onClick={handleNext}
          className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === selectedIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const [imageUrl, setImageUrl] = useState('https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800');

  useEffect(() => {
    async function loadImage() {
      const { data } = await supabase
        .from('property_images')
        .select('url')
        .eq('property_id', property.id)
        .order('is_main', { ascending: false })
        .order('order_index', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (data) {
        setImageUrl(data.url);
      }
    }
    loadImage();
  }, [property.id]);

  return (
    <Link
      to={`/property/${property.slug}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#7096AF]/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent z-10" />
        <img src={imageUrl} alt={property.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#7096AF] transition-colors">
          {property.title}
        </h3>

        <div className="text-lg font-bold text-[#7096AF] mb-2">
          €{property.price.toLocaleString()}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>{property.area}m²</span>
          {(property.details as any)?.rooms && <span>{(property.details as any).rooms} sobe</span>}
        </div>
      </div>
    </Link>
  );
}
