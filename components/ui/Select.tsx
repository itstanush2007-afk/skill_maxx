import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
        >
          {label} {props.required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-xl bg-[#030712] border ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
          } px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 font-mono pr-10 ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#090d16] text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#090d16] text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
};
