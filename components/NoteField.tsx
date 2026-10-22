"use client";

import { useId, useState } from "react";

export default function NoteField({ label }: { label: string }) {
  const id = useId();
  const [value, setValue] = useState("");

  return (
    <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
        placeholder="Ketik untuk menguji state"
      />
    </div>
  );
}
