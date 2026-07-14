import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Link } from '../../components/Router';
import { PROPERTY_TYPE_LABELS, PropertyType } from '../../lib/propertyTypes';
import type { Database } from '../../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadProperties();
  }, [statusFilter]);

  async function loadProperties() {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;
    setProperties(data || []);
    setLoading(false);
  }

  async function deleteProperty(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')) return;

    await supabase.from('properties').delete().eq('id', id);
    loadProperties();
  }

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-[#7096AF]/20 border-t-[#7096AF] rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nekretnine</h1>
            <p className="text-gray-600">Upravljajte oglasima</p>
          </div>
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-2 px-6 py-3 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Dodaj oglas
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pretražite po naslovu, šifri ili gradu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
            >
              <option value="all">Svi statusi</option>
              <option value="aktivno">Aktivno</option>
              <option value="rezervisano">Rezervisano</option>
              <option value="prodato">Prodato</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Šifra</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Naslov</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tip</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Cena</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Grad</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Pregledi</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">{property.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{property.title}</div>
                      <div className="text-sm text-gray-500">
                        {property.area}m²
                        {(property.details as any)?.rooms && <> • {(property.details as any).rooms} sobe</>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{PROPERTY_TYPE_LABELS[property.property_type as PropertyType]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">€{property.price.toLocaleString()}</div>
                      {property.price_per_m2 && (
                        <div className="text-xs text-gray-500">€{property.price_per_m2}/m²</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{property.city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'aktivno' ? 'bg-green-100 text-green-700' :
                        property.status === 'rezervisano' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{property.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/properties/edit/${property.id}`}
                          className="p-2 text-gray-600 hover:text-[#7096AF] hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProperties.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nema oglasa
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
