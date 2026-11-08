
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateUser } from "../../actions";
import type { AdminUserFormState } from "../../actions";

type EditUserFormProps = {
  user: {
    id: string;
    username: string;
    email: string;
    role: "ADMIN" | "USER";
  };
};

const initialState: AdminUserFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: {
    username: "",
    email: "",
    role: "USER",
  },
};

export default function EditUserForm({ user }: EditUserFormProps) {
  const updateUserWithId = updateUser.bind(null, user.id);

  const [state, formAction, pending] = useActionState(
    updateUserWithId,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          defaultValue={user.username}
          required
          maxLength={30}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          aria-describedby="username-error"
        />

        {state.errors.username && (
          <p id="username-error" className="mt-1 text-sm text-red-600">
            {state.errors.username}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
          required
          maxLength={254}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          aria-describedby="email-error"
        />

        {state.errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {state.errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Role Pengguna
        </label>

        <select
          id="role"
          name="role"
          defaultValue={user.role}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          aria-describedby="role-error"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        {state.errors.role && (
          <p id="role-error" className="mt-1 text-sm text-red-600">
            {state.errors.role}
          </p>
        )}
      </div>

      {state.message && (
        <p
          role="alert"
          className={`rounded-lg p-3 text-sm ${
            state.status === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        <Link
          href="/admin"
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
