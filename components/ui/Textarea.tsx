import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  maxLength,
  className = '',
  value,
  id,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
          >
            {label} {props.required && <span className="text-red-400">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs font-mono text-slate-500">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={textareaId}
        value={value}
        maxLength={maxLength}
        className={`w-full rounded-xl bg-[#030712] border ${
          error
            ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
        } px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 font-mono resize-none ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
