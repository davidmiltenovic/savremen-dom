import { useEffect, useState } from 'react';
import { Search, Phone, Mail, MessageSquare, Calendar, CircleAlert as AlertCircle, ChevronDown } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];

interface LeadWithProperty extends Lead {
  property?: Property | null;
  isInactive?: boolean;
}

export function Leads() {
  const [leads, setLeads] = useState<LeadWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadWithProperty | null>(null);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  async function loadLeads() {
    let query = supabase
      .from('leads')
      .select(`
        *,
        property:properties(*)
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;

    const now = new Date();
    const leadsWithStatus = (data || []).map((lead: any) => {
      const lastUpdated = new Date(lead.last_updated_at || lead.created_at);
      const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      const isInactive = hoursSinceUpdate > 24 &&
                         lead.status !== 'zatvoreno' &&
                         lead.status !== 'izgubljen';

      return { ...lead, isInactive };
    });

    setLeads(leadsWithStatus as LeadWithProperty[]);
    setLoading(false);
  }

  async function updateLeadStatus(leadId: string, status: string) {
    await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId);

    loadLeads();
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status: status as any });
    }
  }

  async function updateLeadNotes(leadId: string, notes: string) {
    await supabase
      .from('leads')
      .update({ notes })
      .eq('id', leadId);

    loadLeads();
  }

  async function updateNextAction(leadId: string, nextAction: string, nextActionDate: string | null) {
    await supabase
      .from('leads')
      .update({
        next_action: nextAction,
        next_action_date: nextActionDate
      })
      .eq('id', leadId);

    loadLeads();
    if (selectedLead?.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        next_action: nextAction,
        next_action_date: nextActionDate
      });
    }
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novi': return 'bg-gray-100 text-gray-700';
      case 'kontaktiran': return 'bg-blue-100 text-blue-700';
      case 'zakazan_obilazak': return 'bg-orange-100 text-orange-700';
      case 'pregovori': return 'bg-purple-100 text-purple-700';
      case 'zatvoreno': return 'bg-green-100 text-green-700';
      case 'izgubljen': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'novi': 'Novi upit',
      'kontaktiran': 'Kontaktiran',
      'zakazan_obilazak': 'Zakazan obilazak',
      'pregovori': 'Pregovori',
      'zatvoreno': 'Zatvoreno',
      'izgubljen': 'Izgubljen',
    };
    return labels[status] || status.replace(/_/g, ' ');
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upiti</h1>
          <p className="text-gray-600">Upravljajte upitima klijenata</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pretražite po imenu, telefonu ili emailu..."
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
              <option value="novi">Novi upit</option>
              <option value="kontaktiran">Kontaktiran</option>
              <option value="zakazan_obilazak">Zakazan obilazak</option>
              <option value="pregovori">Pregovori</option>
              <option value="zatvoreno">Zatvoreno</option>
              <option value="izgubljen">Izgubljen</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedLead?.id === lead.id ? 'bg-gray-100' : ''
                  } ${lead.isInactive ? 'border-l-4 border-red-500 bg-red-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                        {lead.isInactive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                            <AlertCircle className="w-3 h-3" />
                            Nije kontaktiran 24h
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                      {lead.next_action && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <ChevronDown className="w-3 h-3" />
                          Sledeći korak: {lead.next_action}
                          {lead.next_action_date && (
                            <span>
                              {' '}({new Date(lead.next_action_date).toLocaleDateString('sr-RS')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateLeadStatus(lead.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)} border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50`}
                      >
                        <option value="novi">Novi upit</option>
                        <option value="kontaktiran">Kontaktiran</option>
                        <option value="zakazan_obilazak">Zakazan obilazak</option>
                        <option value="pregovori">Pregovori</option>
                        <option value="zatvoreno">Zatvoreno</option>
                        <option value="izgubljen">Izgubljen</option>
                      </select>
                    </div>
                  </div>

                  {lead.property && (
                    <div className="text-sm text-gray-600 mb-2">
                      Nekretnina: <span className="text-gray-900">{lead.property.title}</span>
                    </div>
                  )}

                  {lead.message && (
                    <p className="text-sm text-gray-500 line-clamp-2">{lead.message}</p>
                  )}

                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(lead.created_at).toLocaleDateString('sr-RS', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
              {filteredLeads.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Nema upita
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Detalji upita</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Ime</label>
                    <div className="text-gray-900 font-medium">{selectedLead.name}</div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Telefon</label>
                    <a href={`tel:${selectedLead.phone}`} className="text-[#7096AF] hover:text-[#5a7a96] transition-colors">
                      {selectedLead.phone}
                    </a>
                  </div>

                  {selectedLead.email && (
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Email</label>
                      <a href={`mailto:${selectedLead.email}`} className="text-[#7096AF] hover:text-[#5a7a96] transition-colors">
                        {selectedLead.email}
                      </a>
                    </div>
                  )}

                  {selectedLead.message && (
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Poruka</label>
                      <div className="text-gray-900 text-sm">{selectedLead.message}</div>
                    </div>
                  )}

                  {selectedLead.property && (
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Nekretnina</label>
                      <div className="text-gray-900 font-medium">{selectedLead.property.title}</div>
                      <div className="text-sm text-gray-600">{selectedLead.property.code}</div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                    >
                      <option value="novi">Novi upit</option>
                      <option value="kontaktiran">Kontaktiran</option>
                      <option value="zakazan_obilazak">Zakazan obilazak</option>
                      <option value="pregovori">Pregovori</option>
                      <option value="zatvoreno">Zatvoreno</option>
                      <option value="izgubljen">Izgubljen</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">Sledeći korak</label>
                    <select
                      value={selectedLead.next_action || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedLead({ ...selectedLead, next_action: value });
                        updateNextAction(selectedLead.id, value, selectedLead.next_action_date || null);
                      }}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all mb-2"
                    >
                      <option value="">-- Izaberite --</option>
                      <option value="Pozvati klijenta">Pozvati klijenta</option>
                      <option value="Zakazati obilazak">Zakazati obilazak</option>
                      <option value="Poslati ponudu">Poslati ponudu</option>
                      <option value="Pratiti ponovo">Pratiti ponovo</option>
                    </select>
                    <input
                      type="date"
                      value={selectedLead.next_action_date ? new Date(selectedLead.next_action_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const value = e.target.value || null;
                        setSelectedLead({ ...selectedLead, next_action_date: value });
                        updateNextAction(selectedLead.id, selectedLead.next_action || '', value);
                      }}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">Beleške</label>
                    <textarea
                      rows={4}
                      value={selectedLead.notes || ''}
                      onChange={(e) => {
                        setSelectedLead({ ...selectedLead, notes: e.target.value });
                      }}
                      onBlur={(e) => updateLeadNotes(selectedLead.id, e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all resize-none"
                      placeholder="Dodajte beleške..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 h-64 flex items-center justify-center shadow-sm">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Izaberite upit za detalje</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
