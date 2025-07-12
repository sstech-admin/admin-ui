import React from "react";
import { Calendar } from "lucide-react";

interface CustomDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  label,
  value,
  onChange,
  name,
  required,
  error,
  min,
  max,
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>
      <div className="relative group">
        <input
          type="date"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className={`w-full appearance-none px-4 py-3 border rounded-xl bg-white text-gray-900 text-sm transition-all focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400
            ${error ? "border-red-300 bg-red-50" : "border-gray-300"}`}
        />
        <Calendar
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-cyan-500 pointer-events-none transition-colors"
          size={18}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CustomDateInput;
