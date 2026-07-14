import { useEffect, useState } from 'react';
import { Search, MapPin, Building2, TrendingUp, Star } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout';
import GoogleReviews from '../../components/public/GoogleReviews';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from '../../components/Router';
import { COMPANY_INFO } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [searchCity, setSearchCity] = useState('Kragujevac');
  const [searchType, setSearchType] = useState('');
  const [searchTransactionType, setSearchTransactionType] = useState('prodaja');
  const { navigate } = useRouter();

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const [featured, latest] = await Promise.all([
      supabase
        .from('properties')
        .select('*')
        .eq('status', 'aktivno')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('properties')
        .select('*')
        .eq('status', 'aktivno')
        .order('created_at', { ascending: false })
        .limit(8)
    ]);

    setFeaturedProperties(featured.data || []);
    setLatestProperties(latest.data || []);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('type', searchType);
    if (searchTransactionType) params.set('transactionType', searchTransactionType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <PublicLayout>
      <div className="relative">
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-[#EEEEEE]" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5998120/pexels-photo-5998120.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-55" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Pronađite svoj
              <span className="block text-[#7096AF]">savremen dom</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {COMPANY_INFO.tagline}
            </p>

            <form onSubmit={handleSearch} className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Grad"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                  />
                </div>

                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all appearance-none"
                  >
                    <option value="">Tip nekretnine</option>
                    <option value="stan">Stan</option>
                    <option value="kuća">Kuća</option>
                    <option value="poslovni_prostor">Poslovni prostor</option>
                    <option value="zemljište">Zemljište</option>
                    <option value="garaža">Garaža</option>
                  </select>
                </div>

                <select
                  value={searchTransactionType}
                  onChange={(e) => setSearchTransactionType(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                >
                  <option value="prodaja">Prodaja</option>
                  <option value="izdavanje">Izdavanje</option>
                </select>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all"
                >
                  <Search className="w-5 h-5" />
                  Pretraži
                </button>
              </div>
            </form>
          </div>
        </div>

        {featuredProperties.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex items-center gap-3 mb-12">
              <Star className="w-8 h-8 text-[#7096AF]" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Istaknuti oglasi</h2>
                <p className="text-gray-600 mt-1">Najbolje iz naše ponude</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-12">
            <TrendingUp className="w-8 h-8 text-[#7096AF]" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Najnoviji oglasi</h2>
              <p className="text-gray-600 mt-1">Poslednje dodatе nekretnine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all border border-gray-300 shadow-sm"
            >
              Pogledaj sve nekretnine
            </Link>
          </div>
        </section>

        <section className="bg-[#EEEEEE] border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#7096AF]/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#7096AF]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium nekretnine</h3>
                <p className="text-gray-600">
                  Pažljivo odabrana ponuda najkvalitetnijih nekretnina na tržištu
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#7096AF]/10 flex items-center justify-center">
                  <Star className="w-8 h-8 text-[#7096AF]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vrhunska usluga</h3>
                <p className="text-gray-600">
                  Profesionalan tim spremno da odgovori na sva vaša pitanja
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#7096AF]/10 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[#7096AF]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Proveren kvalitet</h3>
                <p className="text-gray-600">
                  Svi oglasi su provereni i ažurirani sa tačnim informacijama
                </p>
              </div>
            </div>
          </div>
        </section>

        <GoogleReviews />
      </div>
    </PublicLayout>
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
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#7096AF]/50 transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent z-10" />
        <img src={imageUrl} alt={property.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

        {property.featured && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-[#7096AF] text-white text-xs font-semibold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Istaknuto
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-lg capitalize">
            {property.transaction_type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#7096AF] transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          {property.city}
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <div className="text-2xl font-bold text-[#7096AF]">
            €{property.price.toLocaleString()}
          </div>
          {property.price_per_m2 && (
            <div className="text-sm text-gray-500">
              €{property.price_per_m2}/m²
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
          <span>{property.area}m²</span>
          {(property.details as any)?.rooms && <span>{(property.details as any).rooms} sobe</span>}
          {(property.details as any)?.floor !== undefined && (property.details as any)?.floor !== null && <span>{(property.details as any).floor}. sprat</span>}
        </div>
      </div>
    </Link>
  );
}
