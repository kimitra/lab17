import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fc", padding: "40px 20px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}