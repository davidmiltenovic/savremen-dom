import { useState } from 'react';
import { Home, MapPin, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PublicLayout } from '../../components/public/PublicLayout';

const SUBCATEGORIES = {
  stan: ['garsonjera', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5+'],
  kuća: ['samostalna', 'u nizu', 'dvojna/dupleks', '1-etažna', '2-etažna', '3-etažna'],
  poslovni_prostor: ['lokal', 'kancelarija', 'magacin', 'hala', 'ugostiteljski', 'poslovna zgrada', 'ostalo'],
  zemljište: ['plac', 'građevinsko', 'poljoprivredno', 'šumsko'],
  garaža: ['garaža', 'parking']
} as const;

export function ListProperty() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    subcategory: '',
    location: '',
    price: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const messageContent = `Tip nekretnine: ${formData.propertyType}${formData.subcategory ? `\nPodkategorija: ${formData.subcategory}` : ''}\nLokacija: ${formData.location}\nCena: ${formData.price}\nOpis: ${formData.description}`;

      const { error: submitError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          lead_type: 'upit',
          message: messageContent,
          status: 'novi'
        }]);

      if (submitError) throw submitError;

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        subcategory: '',
        location: '',
        price: '',
        description: '',
      });
    } catch (err) {
      setError('Došlo je do greške. Molimo pokušajte ponovo.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'propertyType') {
        return { ...prev, propertyType: value, subcategory: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  return (
    <PublicLayout>
    <div className="min-h-screen">
      <div className="relative h-[300px] overflow-hidden" style={{ backgroundColor: '#7096AF' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">Ponudite svoju nekretninu</h1>
            <p className="text-xl max-w-2xl">
              Vaša nekretnina je u sigurnim rukama!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Zašto odabrati nas?
            </h2>
            <p className="text-gray-600 mb-8">
              Prodaja ili rentiranje nekretnine može biti jednostavna i efikasna uz našu stručnu pomoć. Naša agencija vam pruža:
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7096AF' }}>
                    <Home className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Profesionalna procena vrednosti
                  </h3>
                  <p className="text-gray-600">
                    Naš tim stručnjaka će vam pomoći da odredite realnu tržišnu cenu vaše nekretnine.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7096AF' }}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Maksimalna vidljivost
                  </h3>
                  <p className="text-gray-600">
                    Vaša nekretnina će biti promovirana na svim relevantnim platformama i portalima.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7096AF' }}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pravna sigurnost
                  </h3>
                  <p className="text-gray-600">
                    Obezbeđujemo proveru svih dokumenata i pravnu podršku tokom čitavog procesa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7096AF' }}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Stalna podrška
                  </h3>
                  <p className="text-gray-600">
                    Naš tim je tu za vas od prvog kontakta do uspešnog zaključenja posla.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#7096AF' }}>
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Hvala vam!
                </h3>
                <p className="text-gray-600 mb-6">
                  Vaš zahtev je uspešno poslat. Kontaktiraćemo vas u najkraćem mogućem roku.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: '#7096AF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a7a96'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7096AF'}
                >
                  Pošalji još jedan zahtev
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Popunite formular
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Vaše ime i prezime *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                      style={{ focusRingColor: '#7096AF' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                        style={{ focusRingColor: '#7096AF' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                        style={{ focusRingColor: '#7096AF' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                      Tip nekretnine *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      required
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                      style={{ focusRingColor: '#7096AF' }}
                    >
                      <option value="">Izaberite tip</option>
                      <option value="stan">Stan</option>
                      <option value="kuća">Kuća</option>
                      <option value="poslovni_prostor">Poslovni prostor</option>
                      <option value="zemljište">Zemljište</option>
                      <option value="garaža">Garaža</option>
                    </select>
                  </div>

                  {formData.propertyType && (
                    <div>
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                        Podkategorija
                      </label>
                      <select
                        id="subcategory"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                        style={{ focusRingColor: '#7096AF' }}
                      >
                        <option value="">Izaberite podkategoriju</option>
                        {SUBCATEGORIES[formData.propertyType as keyof typeof SUBCATEGORIES]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokacija *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Npr. Centar, Kragujevac"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                      style={{ focusRingColor: '#7096AF' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Željena cena (€)
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Npr. 80000"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all"
                      style={{ focusRingColor: '#7096AF' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Opis nekretnine
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Opišite vašu nekretninu (kvadratura, broj soba, stanje, itd.)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-offset-2 transition-all resize-none"
                      style={{ focusRingColor: '#7096AF' }}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#7096AF' }}
                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#5a7a96')}
                    onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#7096AF')}
                  >
                    {isSubmitting ? 'Šaljem...' : 'Pošalji ponudu'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
