import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
          <div className="mx-auto max-w-md">
            <p className="text-sm text-slate-600">
              Memuat halaman login...
            </p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}