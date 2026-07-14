import { useEffect, useState } from 'react';
import { Save, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from '../../components/Router';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { DynamicPropertyFields } from '../../components/admin/DynamicPropertyFields';
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  SUBCATEGORIES,
  PropertyType,
  getBasicFields,
  getAdditionalFields,
} from '../../lib/propertyTypes';

interface UploadedImage {
  id?: string;
  url: string;
  path?: string;
  is_main: boolean;
  order_index: number;
  isNew?: boolean;
}

interface PropertyFormProps {
  isEdit?: boolean;
  propertyId?: string;
}

type FormStep = 'type' | 'basic' | 'additional' | 'images';

export function PropertyForm({ isEdit = false, propertyId }: PropertyFormProps) {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('type');
  const [images, setImages] = useState<UploadedImage[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    property_type: 'APARTMENT' as PropertyType,
    subcategory: '',
    transaction_type: 'prodaja',
    price: 0,
    area: 0,
    city: '',
    municipality: '',
    street: '',
    hide_exact_address: false,
    registered: false,
    urgent_sale: false,
    slug: '',
    status: 'aktivno',
    description: '',
    details: {} as Record<string, any>,
  });

  useEffect(() => {
    if (isEdit && propertyId) {
      loadProperty();
    }
  }, [isEdit, propertyId]);

  async function loadProperty() {
    setLoading(true);
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .maybeSingle();

    if (data) {
      setFormData({
        title: data.title || '',
        property_type: data.property_type as PropertyType,
        subcategory: data.subcategory || '',
        transaction_type: data.transaction_type || 'prodaja',
        price: data.price || 0,
        area: data.area || 0,
        city: data.city || '',
        municipality: data.municipality || '',
        street: data.street || '',
        hide_exact_address: data.hide_exact_address || false,
        registered: data.registered || false,
        urgent_sale: data.urgent_sale || false,
        slug: data.slug || '',
        status: data.status || 'aktivno',
        description: data.description || '',
        details: (data.details as Record<string, any>) || {},
      });

      const { data: imagesData } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('order_index', { ascending: true });

      if (imagesData) {
        setImages(
          imagesData.map((img) => ({
            id: img.id,
            url: img.url,
            is_main: img.is_main,
            order_index: img.order_index,
          }))
        );
      }
      setCurrentStep('basic');
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 'images') {
      return;
    }

    await saveProperty();
  };

  const saveProperty = async () => {
    setSaving(true);

    try {
      if (!formData.slug) {
        formData.slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const propertyData = {
        title: formData.title,
        property_type: formData.property_type,
        subcategory: formData.subcategory || null,
        transaction_type: formData.transaction_type,
        price: formData.price,
        area: formData.area,
        city: formData.city,
        municipality: formData.municipality || null,
        street: formData.street || null,
        hide_exact_address: formData.hide_exact_address,
        registered: formData.registered,
        urgent_sale: formData.urgent_sale,
        slug: formData.slug,
        status: formData.status,
        description: formData.description || null,
        details: formData.details,
      };

      let savedPropertyId = propertyId;

      if (isEdit && propertyId) {
        await supabase.from('properties').update(propertyData).eq('id', propertyId);
      } else {
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        savedPropertyId = newProperty.id;
      }

      if (savedPropertyId && images.length > 0) {
        const imagesToUpdate = images.filter((img) => img.id && !img.isNew);
        const imagesToInsert = images.filter((img) => !img.id || img.isNew);

        if (imagesToUpdate.length > 0) {
          for (const image of imagesToUpdate) {
            await supabase
              .from('property_images')
              .update({
                is_main: image.is_main,
                order_index: image.order_index,
              })
              .eq('id', image.id!);
          }
        }

        if (imagesToInsert.length > 0) {
          const imageInserts = imagesToInsert.map((img) => ({
            property_id: savedPropertyId,
            url: img.url,
            is_main: img.is_main,
            order_index: img.order_index,
          }));

          await supabase.from('property_images').insert(imageInserts);
        }
      }

      navigate('/admin/properties');
    } catch (error) {
      alert('Greška pri čuvanju oglasa');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDetailField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }));
  };

  const handleNext = () => {
    if (currentStep === 'type') setCurrentStep('basic');
    else if (currentStep === 'basic') setCurrentStep('additional');
    else if (currentStep === 'additional') setCurrentStep('images');
  };

  const handlePrevious = () => {
    if (currentStep === 'images') setCurrentStep('additional');
    else if (currentStep === 'additional') setCurrentStep('basic');
    else if (currentStep === 'basic') setCurrentStep('type');
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

  const basicFields = getBasicFields(formData.property_type);
  const additionalFields = getAdditionalFields(formData.property_type);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/properties"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? 'Izmeni oglas' : 'Novi oglas'}
            </h1>
            <p className="text-gray-600">
              Korak {currentStep === 'type' ? '1' : currentStep === 'basic' ? '2' : currentStep === 'additional' ? '3' : '4'} od 4
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2">
            {['type', 'basic', 'additional', 'images'].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex-1 h-2 rounded-full transition-all ${
                    currentStep === step
                      ? 'bg-[#7096AF]'
                      : index < ['type', 'basic', 'additional', 'images'].indexOf(currentStep)
                      ? 'bg-[#7096AF]'
                      : 'bg-gray-200'
                  }`}
                />
                {index < 3 && <div className="w-2" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl">
          {currentStep === 'type' && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Izaberite tip nekretnine</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      updateField('property_type', value);
                      updateField('subcategory', '');
                      updateField('details', {});
                    }}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      formData.property_type === value
                        ? 'border-[#7096AF] bg-[#7096AF]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-900">
                      {PROPERTY_TYPE_LABELS[value as PropertyType]}
                    </div>
                  </button>
                ))}
              </div>

              {formData.property_type && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Podkategorija
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => updateField('subcategory', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                  >
                    <option value="">Izaberite podkategoriju</option>
                    {SUBCATEGORIES[formData.property_type]?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {currentStep === 'basic' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Osnovne informacije</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Naslov <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      placeholder="Luksuzan trosoban stan u centru grada"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tip transakcije <span className="text-red-600">*</span>
                      </label>
                      <select
                        required
                        value={formData.transaction_type}
                        onChange={(e) => updateField('transaction_type', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      >
                        <option value="prodaja">Prodaja</option>
                        <option value="izdavanje">Izdavanje</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena (€) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => updateField('price', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                        placeholder="150000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.property_type === 'LAND' ? 'Površina' : 'Kvadratura (m²)'}{' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.area}
                        onChange={(e) => updateField('area', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                        placeholder="75"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-600">*</span>
                      </label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      >
                        <option value="aktivno">Aktivno</option>
                        <option value="rezervisano">Rezervisano</option>
                        <option value="prodato">Prodato</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.registered}
                        onChange={(e) => updateField('registered', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
                      />
                      Uknjiženost
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.urgent_sale}
                        onChange={(e) => updateField('urgent_sale', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
                      />
                      Hitna prodaja
                    </label>
                  </div>

                  <DynamicPropertyFields
                    propertyType={formData.property_type}
                    fields={basicFields}
                    values={formData.details}
                    onChange={updateDetailField}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lokacija</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grad <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      placeholder="Kragujevac"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opština</label>
                    <input
                      type="text"
                      value={formData.municipality}
                      onChange={(e) => updateField('municipality', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      placeholder="Centar"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ulica</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => updateField('street', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
                      placeholder="Kneza Miloša 10"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hide_exact_address}
                        onChange={(e) => updateField('hide_exact_address', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
                      />
                      Sakrij tačnu adresu
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'additional' && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dodatne informacije
              </h2>

              {additionalFields.length > 0 ? (
                <DynamicPropertyFields
                  propertyType={formData.property_type}
                  fields={additionalFields}
                  values={formData.details}
                  onChange={updateDetailField}
                />
              ) : (
                <p className="text-gray-600">Nema dodatnih polja za ovaj tip nekretnine.</p>
              )}

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all resize-none"
                  placeholder="Detaljan opis nekretnine..."
                />
              </div>
            </div>
          )}

          {currentStep === 'images' && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Slike</h2>
              <ImageUpload propertyId={propertyId} images={images} onChange={setImages} />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mt-8">
            <div>
              {currentStep !== 'type' && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Nazad
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/admin/properties"
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Otkaži
              </Link>

              {currentStep !== 'images' ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all"
                >
                  Dalje
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={saveProperty}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-[#7096AF] hover:bg-[#5a7a96] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Sačuvaj
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
