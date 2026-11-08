import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-5 py-10">
          <div className="mx-auto max-w-md">
            Memuat halaman login...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
