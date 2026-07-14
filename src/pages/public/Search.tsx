import { useEffect, useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, Grid3x3, Map, MapPin, Star } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout';
import { supabase } from '../../lib/supabase';
import { Link } from '../../components/Router';
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS, SUBCATEGORIES, PropertyType } from '../../lib/propertyTypes';
import type { Database } from '../../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export function Search() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    city: 'Kragujevac',
    type: '',
    subcategory: '',
    transactionType: 'prodaja',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    rooms: '',
    hasElevator: false,
    hasParking: false,
    hasTerrace: false,
  });

  const [sortBy, setSortBy] = useState('created_at_desc');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    const typeParam = params.get('type');
    const transactionTypeParam = params.get('transactionType');

    if (cityParam || typeParam || transactionTypeParam) {
      setFilters(prev => ({
        ...prev,
        city: cityParam || prev.city,
        type: typeParam || prev.type,
        transactionType: transactionTypeParam || prev.transactionType
      }));
    } else {
      loadProperties();
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [filters, sortBy]);

  async function loadProperties() {
    setLoading(true);
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'aktivno');

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.type) {
      query = query.eq('property_type', filters.type);
    }

    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }

    if (filters.transactionType) {
      query = query.eq('transaction_type', filters.transactionType);
    }

    if (filters.minPrice) {
      query = query.gte('price', parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      query = query.lte('price', parseFloat(filters.maxPrice));
    }

    if (filters.minArea) {
      query = query.gte('area', parseFloat(filters.minArea));
    }

    if (filters.maxArea) {
      query = query.lte('area', parseFloat(filters.maxArea));
    }

    if (filters.rooms) {
      query = query.filter('details->>rooms', 'eq', filters.rooms);
    }

    if (filters.hasElevator) {
      query = query.filter('details->has_elevator', 'eq', 'true');
    }

    if (filters.hasParking) {
      query = query.or('parking.not.is.null,details->parking_spaces.gt.0');
    }

    if (filters.hasTerrace) {
      query = query.filter('details->has_terrace', 'eq', 'true');
    }

    const lastUnderscoreIndex = sortBy.lastIndexOf('_');
    const orderField = sortBy.substring(0, lastUnderscoreIndex);
    const orderDirection = sortBy.substring(lastUnderscoreIndex + 1);
    query = query.order(orderField, { ascending: orderDirection === 'asc' });

    const { data } = await query;
    setProperties(data || []);
    setLoading(false);
  }

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      type: '',
      subcategory: '',
      transactionType: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      rooms: '',
      hasElevator: false,
      hasParking: false,
      hasTerrace: false,
    });
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#EEEEEE]">
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Pretraga nekretnina
            </h1>
            <p className="text-gray-600">Pronađeno {properties.length} rezultata</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filteri
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#7096AF] hover:text-[#5a7a96] transition-colors"
                  >
                    Resetuj
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pretraga
                    </label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        placeholder="Pretražite..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grad
                    </label>
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => updateFilter('city', e.target.value)}
                      placeholder="Beograd, Novi Sad..."
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tip nekretnine
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => {
                        updateFilter('type', e.target.value);
                        updateFilter('subcategory', '');
                      }}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                    >
                      <option value="">Svi tipovi</option>
                      {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {PROPERTY_TYPE_LABELS[value as PropertyType]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filters.type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Podkategorija
                      </label>
                      <select
                        value={filters.subcategory}
                        onChange={(e) => updateFilter('subcategory', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      >
                        <option value="">Sve podkategorije</option>
                        {SUBCATEGORIES[filters.type as keyof typeof SUBCATEGORIES]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transakcija
                    </label>
                    <select
                      value={filters.transactionType}
                      onChange={(e) => updateFilter('transactionType', e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                    >
                      <option value="">Sve</option>
                      <option value="prodaja">Prodaja</option>
                      <option value="izdavanje">Izdavanje</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cena (€)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        placeholder="Od"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        placeholder="Do"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kvadratura (m²)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.minArea}
                        onChange={(e) => updateFilter('minArea', e.target.value)}
                        placeholder="Od"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      />
                      <input
                        type="number"
                        value={filters.maxArea}
                        onChange={(e) => updateFilter('maxArea', e.target.value)}
                        placeholder="Do"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Broj soba
                    </label>
                    <select
                      value={filters.rooms}
                      onChange={(e) => updateFilter('rooms', e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                    >
                      <option value="">Sve</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasElevator}
                        onChange={(e) => updateFilter('hasElevator', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
                      />
                      Lift
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasParking}
                        onChange={(e) => updateFilter('hasParking', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
                      />
                      Parking
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasTerrace}
                        onChange={(e) => updateFilter('hasTerrace', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
                      />
                      Terasa
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filteri
                </button>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                  >
                    <option value="created_at_desc">Najnovije</option>
                    <option value="price_asc">Cena rastuće</option>
                    <option value="price_desc">Cena opadajuće</option>
                    <option value="area_asc">Veličina rastuće</option>
                    <option value="area_desc">Veličina opadajuće</option>
                  </select>

                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-all ${
                        viewMode === 'grid' ? 'bg-[#7096AF] text-white' : 'text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded transition-all ${
                        viewMode === 'map' ? 'bg-[#7096AF] text-white' : 'text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="w-12 h-12 border-4 border-[#7096AF]/20 border-t-[#7096AF] rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 h-[600px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Mapa view će biti dostupna uskoro</p>
                      </div>
                    </div>
                  )}

                  {properties.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl mb-2">Nema rezultata</p>
                      <p className="text-sm">Pokušajte sa drugim filterima</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
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
