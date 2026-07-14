import { useEffect, useState } from 'react';
import { Building2, TrendingUp, MessageSquare, Eye, Plus, CircleAlert as AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Link } from '../../components/Router';

interface Stats {
  total: number;
  active: number;
  sold: number;
  newLeads: number;
  inactiveLeads: number;
}

interface TopProperty {
  id: string;
  title: string;
  code: string;
  views: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, sold: 0, newLeads: 0, inactiveLeads: 0 });
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [propertiesRes, leadsRes, allLeadsRes, topPropsRes] = await Promise.all([
      supabase.from('properties').select('status', { count: 'exact' }),
      supabase.from('leads').select('*', { count: 'exact' }).eq('status', 'novi'),
      supabase.from('leads').select('id, status, last_updated_at, created_at'),
      supabase.from('properties').select('id, title, code, views').order('views', { ascending: false }).limit(5)
    ]);

    const properties = propertiesRes.data || [];
    const active = properties.filter(p => p.status === 'aktivno').length;
    const sold = properties.filter(p => p.status === 'prodato').length;

    const now = new Date();
    const inactiveLeads = (allLeadsRes.data || []).filter((lead: any) => {
      const lastUpdated = new Date(lead.last_updated_at || lead.created_at);
      const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      return hoursSinceUpdate > 24 &&
             lead.status !== 'zatvoreno' &&
             lead.status !== 'izgubljen';
    }).length;

    setStats({
      total: propertiesRes.count || 0,
      active,
      sold,
      newLeads: leadsRes.count || 0,
      inactiveLeads
    });

    setTopProperties(topPropsRes.data || []);
    setLoading(false);
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Pregled aktivnosti</p>
          </div>
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-2 px-6 py-3 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Dodaj oglas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#7096AF]/10 rounded-lg">
                <Building2 className="w-6 h-6 text-[#7096AF]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Ukupno oglasa</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.active}</div>
            <div className="text-sm text-gray-600">Aktivni oglasi</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.sold}</div>
            <div className="text-sm text-gray-600">Prodato</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.newLeads}</div>
            <div className="text-sm text-gray-600">Novi upiti</div>
          </div>
        </div>

        {stats.inactiveLeads > 0 && (
          <Link
            to="/admin/leads"
            className="block mb-8"
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Neobrađeni leadovi</h3>
                  <p className="text-gray-600">
                    Imate <span className="font-bold text-red-600">{stats.inactiveLeads}</span>{' '}
                    {stats.inactiveLeads === 1 ? 'lead koji nije kontaktiran' : 'lead-a koji nisu kontaktirani'} u poslednjih 24 sata
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Najgledaniji oglasi</h2>
          <div className="space-y-3">
            {topProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <div className="font-medium text-gray-900">{property.title}</div>
                  <div className="text-sm text-gray-500">{property.code}</div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{property.views}</span>
                </div>
              </div>
            ))}
            {topProperties.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nema podataka
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
