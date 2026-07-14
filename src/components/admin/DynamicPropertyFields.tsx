import { FormField, PropertyType } from '../../lib/propertyTypes';

interface DynamicPropertyFieldsProps {
  propertyType: PropertyType;
  fields: FormField[];
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export function DynamicPropertyFields({
  propertyType,
  fields,
  values,
  onChange,
}: DynamicPropertyFieldsProps) {
  const renderField = (field: FormField) => {
    const value = values[field.name] ?? '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
              type="text"
              required={field.required}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value || null)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
              type="number"
              required={field.required}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value ? parseFloat(e.target.value) : null)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <select
              required={field.required}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value || null)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all"
            >
              <option value="">Izaberite</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => onChange(field.name, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 bg-white text-[#7096AF] focus:ring-2 focus:ring-[#7096AF]/50"
              />
              {field.label}
            </label>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <textarea
              required={field.required}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value || null)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7096AF]/50 focus:border-[#7096AF] transition-all resize-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field) => renderField(field))}
    </div>
  );
}
