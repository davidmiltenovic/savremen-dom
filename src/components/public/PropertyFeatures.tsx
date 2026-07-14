import {
  Home, Key, Flame, Package, Car, Building, Check, Scroll, Fence,
  TreeDeciduous, Warehouse, DoorOpen, Calendar, MapPin, Zap, Wifi,
  Phone, Mountain, Compass, Bath, Droplet, Wrench, Grid, Shield
} from 'lucide-react';
import { PropertyType, PROPERTY_TYPE_LABELS } from '../../lib/propertyTypes';

interface PropertyFeaturesProps {
  propertyType: PropertyType;
  transactionType: string;
  details: Record<string, any>;
  heating?: string | null;
  furnished?: string | null;
  parking?: string | null;
  totalFloors?: number | null;
  registered?: boolean;
}

export function PropertyFeatures({
  propertyType,
  transactionType,
  details,
  heating,
  furnished,
  parking,
  totalFloors,
  registered,
}: PropertyFeaturesProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Karakteristike</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Feature
          icon={<Home />}
          label="Tip"
          value={PROPERTY_TYPE_LABELS[propertyType]}
        />
        <Feature
          icon={<Key />}
          label="Transakcija"
          value={transactionType}
          capitalize
        />

        {details.rooms && (
          <Feature icon={<DoorOpen />} label="Broj soba" value={details.rooms.toString()} />
        )}

        {details.floor !== undefined && details.floor !== null && (
          <Feature icon={<Building />} label="Sprat" value={details.floor.toString()} />
        )}

        {totalFloors && (
          <Feature icon={<Building />} label="Ukupno spratova" value={totalFloors.toString()} />
        )}

        {details.total_floors && (
          <Feature icon={<Building />} label="Ukupno spratova" value={details.total_floors.toString()} />
        )}

        {details.condition && (
          <Feature icon={<Wrench />} label="Stanje" value={details.condition} />
        )}

        {heating && (
          <Feature icon={<Flame />} label="Grejanje" value={heating} />
        )}

        {details.heating && (
          <Feature icon={<Flame />} label="Grejanje" value={details.heating} />
        )}

        {furnished && (
          <Feature icon={<Package />} label="Nameštenost" value={furnished} capitalize />
        )}

        {details.furnished && (
          <Feature icon={<Package />} label="Nameštenost" value={details.furnished} capitalize />
        )}

        {parking && <Feature icon={<Car />} label="Parking" value={parking} />}

        {details.parking && <Feature icon={<Car />} label="Parking" value={details.parking} />}

        {details.parking_spaces && (
          <Feature icon={<Car />} label="Parking mesta" value={details.parking_spaces.toString()} />
        )}

        {details.year_built && (
          <Feature icon={<Calendar />} label="Godina izgradnje" value={details.year_built.toString()} />
        )}

        {details.bathrooms && (
          <Feature icon={<Bath />} label="Kupatila" value={details.bathrooms.toString()} />
        )}

        {details.toilets && (
          <Feature icon={<Bath />} label="WC" value={details.toilets.toString()} />
        )}

        {details.view && (
          <Feature icon={<Mountain />} label="Pogled" value={details.view} />
        )}

        {details.orientation && (
          <Feature icon={<Compass />} label="Orijentacija" value={details.orientation} />
        )}

        {details.house_area && (
          <Feature icon={<Home />} label="Površina kuće" value={`${details.house_area} m²`} />
        )}

        {details.plot_area && (
          <Feature icon={<MapPin />} label="Površina placa" value={`${details.plot_area} m²`} />
        )}

        {details.num_floors && (
          <Feature icon={<Building />} label="Broj etaža" value={details.num_floors.toString()} />
        )}

        {details.building_material && (
          <Feature icon={<Grid />} label="Materijal" value={details.building_material} />
        )}

        {details.area_in_ares && (
          <Feature icon={<MapPin />} label="Površina" value={`${details.area_in_ares} ari`} />
        )}

        {details.purpose && (
          <Feature icon={<Scroll />} label="Namena" value={details.purpose} />
        )}

        {details.urban_conditions && (
          <Feature icon={<Scroll />} label="Urbanistički uslovi" value={details.urban_conditions} />
        )}

        {details.additional_rooms && (
          <Feature icon={<DoorOpen />} label="Dodatne prostorije" value={details.additional_rooms} />
        )}

        {details.garage_spaces && (
          <Feature icon={<Car />} label="Garažna mesta" value={details.garage_spaces.toString()} />
        )}

        {details.garage_type && (
          <Feature icon={<Warehouse />} label="Tip garaže" value={details.garage_type} capitalize />
        )}

        {registered && (
          <IconFeature icon={<Scroll />} label="Uknjiženost" />
        )}

        {details.has_elevator && (
          <IconFeature icon={<Check />} label="Lift" />
        )}

        {details.has_terrace && (
          <IconFeature icon={<Fence />} label="Terasa" />
        )}

        {details.has_loggia && (
          <IconFeature icon={<Fence />} label="Lođa" />
        )}

        {details.has_balcony && (
          <IconFeature icon={<Fence />} label="Balkon" />
        )}

        {details.has_yard && (
          <IconFeature icon={<TreeDeciduous />} label="Dvorište" />
        )}

        {details.has_basement && (
          <IconFeature icon={<Warehouse />} label="Podrum" />
        )}

        {details.has_garage && (
          <IconFeature icon={<Car />} label="Garaža" />
        )}

        {details.water_supply && (
          <IconFeature icon={<Droplet />} label="Vodovod" />
        )}

        {details.has_water && (
          <IconFeature icon={<Droplet />} label="Voda" />
        )}

        {details.has_electricity && (
          <IconFeature icon={<Zap />} label="Struja" />
        )}

        {details.has_sewage && (
          <IconFeature icon={<Droplet />} label="Kanalizacija" />
        )}

        {details.paved_access && (
          <IconFeature icon={<MapPin />} label="Asfaltiran prilaz" />
        )}

        {details.has_toilet && (
          <IconFeature icon={<Bath />} label="Toalet" />
        )}

        {details.internet && (
          <IconFeature icon={<Wifi />} label="Internet" />
        )}

        {details.cable_tv && (
          <IconFeature icon={<Wifi />} label="Kablovska TV" />
        )}

        {details.phone && (
          <IconFeature icon={<Phone />} label="Telefon" />
        )}

        {details.public_transport_access && (
          <IconFeature icon={<Car />} label="Javni prevoz" />
        )}

        {details.video_surveillance && (
          <IconFeature icon={<Shield />} label="Video nadzor" />
        )}

        {details.automatic_doors && (
          <IconFeature icon={<Check />} label="Automatska vrata" />
        )}
      </div>
    </div>
  );
}

function Feature({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#EEEEEE] rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-[#7096AF]/10 flex items-center justify-center flex-shrink-0">
        <div className="text-[#7096AF]">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`font-medium text-gray-900 truncate ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function IconFeature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#EEEEEE] rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-[#7096AF]/10 flex items-center justify-center">
        <div className="text-[#7096AF]">{icon}</div>
      </div>
      <span className="text-gray-900 font-medium">{label}</span>
    </div>
  );
}
