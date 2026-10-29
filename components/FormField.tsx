
import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  id: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormField({
  label,
  id,
  error,
  className = "",
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
          error ? "border-red-400" : "border-slate-300"
        } ${className}`}
        {...inputProps}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
