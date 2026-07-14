export const PROPERTY_TYPES = {
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  LAND: 'LAND',
  COMMERCIAL: 'COMMERCIAL',
  GARAGE: 'GARAGE',
} as const;

export type PropertyType = typeof PROPERTY_TYPES[keyof typeof PROPERTY_TYPES];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Stan',
  HOUSE: 'Kuća',
  LAND: 'Zemljište',
  COMMERCIAL: 'Poslovni prostor',
  GARAGE: 'Garaža',
};

export const SUBCATEGORIES: Record<PropertyType, string[]> = {
  APARTMENT: ['garsonjera', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5+'],
  HOUSE: ['samostalna', 'u nizu', 'dvojna/dupleks', '1-etažna', '2-etažna', '3-etažna'],
  COMMERCIAL: ['lokal', 'kancelarija', 'magacin', 'hala', 'ugostiteljski', 'poslovna zgrada', 'ostalo'],
  LAND: ['plac', 'građevinsko', 'poljoprivredno', 'šumsko'],
  GARAGE: ['garaža', 'parking'],
};

export interface BasePropertyFields {
  location: string;
  area: number;
  price: number;
  registered: boolean;
  urgent_sale: boolean;
}

export interface ApartmentDetails {
  rooms?: number;
  floor?: number;
  total_floors?: number;
  condition?: string;
  heating?: string;
  furnished?: 'namešteno' | 'polunamešteno' | 'prazno';
  has_terrace?: boolean;
  has_loggia?: boolean;
  has_balcony?: boolean;
  bathrooms?: number;
  toilets?: number;
  view?: string;
  orientation?: string;
  has_elevator?: boolean;
  parking?: string;
  parking_spaces?: number;
  year_built?: number;
  internet?: boolean;
  cable_tv?: boolean;
  phone?: boolean;
}

export interface HouseDetails {
  house_area?: number;
  plot_area?: number;
  rooms?: number;
  num_floors?: number;
  building_material?: string;
  heating?: string;
  condition?: string;
  furnished?: 'namešteno' | 'polunamešteno' | 'prazno';
  has_terrace?: boolean;
  has_loggia?: boolean;
  bathrooms?: number;
  toilets?: number;
  water_supply?: boolean;
  has_yard?: boolean;
  has_garage?: boolean;
  garage_spaces?: number;
  parking_spaces?: number;
  year_built?: number;
  internet?: boolean;
  cable_tv?: boolean;
  phone?: boolean;
}

export interface LandDetails {
  area_in_ares?: number;
  has_water?: boolean;
  has_electricity?: boolean;
  has_sewage?: boolean;
  paved_access?: boolean;
  purpose?: string;
  urban_conditions?: string;
}

export interface CommercialDetails {
  floor?: number;
  total_floors?: number;
  heating?: string;
  condition?: string;
  furnished?: 'namešteno' | 'polunamešteno' | 'prazno';
  additional_rooms?: string;
  has_toilet?: boolean;
  parking?: string;
  parking_spaces?: number;
  has_elevator?: boolean;
  view?: string;
  internet?: boolean;
  cable_tv?: boolean;
  phone?: boolean;
  public_transport_access?: boolean;
}

export interface GarageDetails {
  garage_spaces?: number;
  garage_type?: 'podzemna' | 'nadzemna' | 'box';
  video_surveillance?: boolean;
  has_electricity?: boolean;
  automatic_doors?: boolean;
}

export type PropertyDetails =
  | ApartmentDetails
  | HouseDetails
  | LandDetails
  | CommercialDetails
  | GarageDetails;

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  options?: string[] | readonly string[];
  placeholder?: string;
  required?: boolean;
  section: 'basic' | 'additional';
}

export const APARTMENT_FIELDS: FormField[] = [
  { name: 'rooms', label: 'Broj soba', type: 'number', placeholder: '3', section: 'basic' },
  { name: 'floor', label: 'Sprat', type: 'number', placeholder: '2', section: 'basic' },
  { name: 'total_floors', label: 'Ukupno spratova', type: 'number', placeholder: '5', section: 'basic' },
  { name: 'condition', label: 'Stanje nekretnine', type: 'text', placeholder: 'renovirano', section: 'basic' },
  { name: 'heating', label: 'Grejanje', type: 'text', placeholder: 'centralno', section: 'basic' },
  { name: 'furnished', label: 'Opremljenost', type: 'select', options: ['namešteno', 'polunamešteno', 'prazno'], section: 'additional' },
  { name: 'has_terrace', label: 'Terasa', type: 'checkbox', section: 'additional' },
  { name: 'has_loggia', label: 'Lođa', type: 'checkbox', section: 'additional' },
  { name: 'has_balcony', label: 'Balkon', type: 'checkbox', section: 'additional' },
  { name: 'bathrooms', label: 'Broj kupatila', type: 'number', placeholder: '1', section: 'additional' },
  { name: 'toilets', label: 'Broj WC-a', type: 'number', placeholder: '1', section: 'additional' },
  { name: 'view', label: 'Pogled ka', type: 'text', placeholder: 'park, reka', section: 'additional' },
  { name: 'orientation', label: 'Strana sveta', type: 'text', placeholder: 'jug, istok', section: 'additional' },
  { name: 'has_elevator', label: 'Lift', type: 'checkbox', section: 'additional' },
  { name: 'parking', label: 'Parking i garaža', type: 'text', placeholder: 'garažno mesto', section: 'additional' },
  { name: 'parking_spaces', label: 'Broj parking mesta', type: 'number', placeholder: '1', section: 'additional' },
  { name: 'year_built', label: 'Godina izgradnje', type: 'number', placeholder: '2020', section: 'additional' },
  { name: 'internet', label: 'Internet', type: 'checkbox', section: 'additional' },
  { name: 'cable_tv', label: 'Kablovska', type: 'checkbox', section: 'additional' },
  { name: 'phone', label: 'Telefon', type: 'checkbox', section: 'additional' },
];

export const HOUSE_FIELDS: FormField[] = [
  { name: 'house_area', label: 'Površina kuće (m²)', type: 'number', placeholder: '120', required: true, section: 'basic' },
  { name: 'plot_area', label: 'Površina placa (m²)', type: 'number', placeholder: '300', section: 'basic' },
  { name: 'rooms', label: 'Broj soba', type: 'number', placeholder: '4', section: 'basic' },
  { name: 'num_floors', label: 'Broj etaža', type: 'number', placeholder: '2', section: 'basic' },
  { name: 'building_material', label: 'Materijal gradnje', type: 'text', placeholder: 'cigla', section: 'basic' },
  { name: 'heating', label: 'Grejanje', type: 'text', placeholder: 'centralno', section: 'basic' },
  { name: 'condition', label: 'Stanje nekretnine', type: 'text', placeholder: 'renovirano', section: 'basic' },
  { name: 'furnished', label: 'Opremljenost', type: 'select', options: ['namešteno', 'polunamešteno', 'prazno'], section: 'additional' },
  { name: 'has_terrace', label: 'Terasa', type: 'checkbox', section: 'additional' },
  { name: 'has_loggia', label: 'Lođa', type: 'checkbox', section: 'additional' },
  { name: 'bathrooms', label: 'Broj kupatila', type: 'number', placeholder: '2', section: 'additional' },
  { name: 'toilets', label: 'Broj WC-a', type: 'number', placeholder: '2', section: 'additional' },
  { name: 'water_supply', label: 'Vodovod', type: 'checkbox', section: 'additional' },
  { name: 'has_yard', label: 'Dvorište', type: 'checkbox', section: 'additional' },
  { name: 'has_garage', label: 'Garaža', type: 'checkbox', section: 'additional' },
  { name: 'garage_spaces', label: 'Broj garažnih mesta', type: 'number', placeholder: '1', section: 'additional' },
  { name: 'parking_spaces', label: 'Broj parking mesta', type: 'number', placeholder: '2', section: 'additional' },
  { name: 'year_built', label: 'Godina izgradnje', type: 'number', placeholder: '2015', section: 'additional' },
  { name: 'internet', label: 'Internet', type: 'checkbox', section: 'additional' },
  { name: 'cable_tv', label: 'Kablovska', type: 'checkbox', section: 'additional' },
  { name: 'phone', label: 'Telefon', type: 'checkbox', section: 'additional' },
];

export const LAND_FIELDS: FormField[] = [
  { name: 'area_in_ares', label: 'Površina u arima', type: 'number', placeholder: '10', required: true, section: 'basic' },
  { name: 'has_water', label: 'Voda', type: 'checkbox', section: 'additional' },
  { name: 'has_electricity', label: 'Struja', type: 'checkbox', section: 'additional' },
  { name: 'has_sewage', label: 'Kanalizacija', type: 'checkbox', section: 'additional' },
  { name: 'paved_access', label: 'Asfaltiran prilaz', type: 'checkbox', section: 'additional' },
  { name: 'purpose', label: 'Namena', type: 'text', placeholder: 'građevinsko, poljoprivredno', section: 'additional' },
  { name: 'urban_conditions', label: 'Urbanistički uslovi', type: 'textarea', placeholder: 'Detaljni urbanistički uslovi...', section: 'additional' },
];

export const COMMERCIAL_FIELDS: FormField[] = [
  { name: 'floor', label: 'Sprat', type: 'number', placeholder: '1', section: 'basic' },
  { name: 'total_floors', label: 'Ukupno spratova', type: 'number', placeholder: '4', section: 'basic' },
  { name: 'heating', label: 'Grejanje', type: 'text', placeholder: 'centralno', section: 'basic' },
  { name: 'condition', label: 'Stanje', type: 'text', placeholder: 'renovirano', section: 'basic' },
  { name: 'furnished', label: 'Opremljenost', type: 'select', options: ['namešteno', 'polunamešteno', 'prazno'], section: 'additional' },
  { name: 'additional_rooms', label: 'Dodatne prostorije', type: 'text', placeholder: 'kuhinja, kancelarija', section: 'additional' },
  { name: 'has_toilet', label: 'Toalet', type: 'checkbox', section: 'additional' },
  { name: 'parking', label: 'Parking', type: 'text', placeholder: 'sopstveni parking', section: 'additional' },
  { name: 'parking_spaces', label: 'Broj parking mesta', type: 'number', placeholder: '2', section: 'additional' },
  { name: 'has_elevator', label: 'Lift', type: 'checkbox', section: 'additional' },
  { name: 'view', label: 'Pogled', type: 'text', placeholder: 'ulica, park', section: 'additional' },
  { name: 'internet', label: 'Internet', type: 'checkbox', section: 'additional' },
  { name: 'cable_tv', label: 'Kablovska', type: 'checkbox', section: 'additional' },
  { name: 'phone', label: 'Telefon', type: 'checkbox', section: 'additional' },
  { name: 'public_transport_access', label: 'Dostupnost javnog prevoza', type: 'checkbox', section: 'additional' },
];

export const GARAGE_FIELDS: FormField[] = [
  { name: 'garage_spaces', label: 'Broj garažnih mesta', type: 'number', placeholder: '1', required: true, section: 'basic' },
  { name: 'garage_type', label: 'Tip garaže', type: 'select', options: ['podzemna', 'nadzemna', 'box'], section: 'basic' },
  { name: 'video_surveillance', label: 'Video nadzor', type: 'checkbox', section: 'additional' },
  { name: 'has_electricity', label: 'Struja', type: 'checkbox', section: 'additional' },
  { name: 'automatic_doors', label: 'Automatska vrata', type: 'checkbox', section: 'additional' },
];

export const PROPERTY_FIELDS_MAP: Record<PropertyType, FormField[]> = {
  APARTMENT: APARTMENT_FIELDS,
  HOUSE: HOUSE_FIELDS,
  LAND: LAND_FIELDS,
  COMMERCIAL: COMMERCIAL_FIELDS,
  GARAGE: GARAGE_FIELDS,
};

export function getFieldsForPropertyType(propertyType: PropertyType): FormField[] {
  return PROPERTY_FIELDS_MAP[propertyType] || [];
}

export function getBasicFields(propertyType: PropertyType): FormField[] {
  return getFieldsForPropertyType(propertyType).filter(f => f.section === 'basic');
}

export function getAdditionalFields(propertyType: PropertyType): FormField[] {
  return getFieldsForPropertyType(propertyType).filter(f => f.section === 'additional');
}
