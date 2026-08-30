import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#060813] text-slate-100 p-4 sm:p-6 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Portal Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/30 text-violet-400 mb-2 shadow-inner">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            MAGIC SELECTION PORTAL
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Leadership Assessment & Governance System
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-[#0b1021] border border-white/[0.08] p-6 sm:p-8 rounded-2xl shadow-xl shadow-black/40">
          <LoginForm />
        </div>
        
        {/* Security Footer Note */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-slate-500">
            Confidential Governance Platform • All sessions are cryptographically signed and audited.
          </p>
        </div>
      </div>
    </div>
  );
}
