"use client";

import { useState } from "react";
import { loginAction } from "@/app/login/actions";
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<"candidate" | "admin">("candidate");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAction(identifier, password);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Access Selector Tabs */}
      <div className="flex bg-[#060813] p-1 rounded-xl border border-white/[0.08]">
        <button
          type="button"
          onClick={() => {
            setActiveTab("candidate");
            setError("");
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
            activeTab === "candidate"
              ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <User size={14} />
          <span>Candidate Access</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("admin");
            setError("");
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
            activeTab === "admin"
              ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck size={14} />
          <span>Administrator Access</span>
        </button>
      </div>

      {/* Role Subheading */}
      <div className="text-center space-y-1">
        <h2 className="text-sm font-semibold text-slate-200">
          {activeTab === "candidate" ? "Candidate Portal Sign In" : "Selection Board Sign In"}
        </h2>
        <p className="text-xs text-slate-400">
          {activeTab === "candidate"
            ? "Enter your SEC ID (e.g. SEC25AD046) or student email"
            : "Enter authorized administrator credentials"}
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            {activeTab === "candidate" ? "SEC ID / Student Email" : "Admin ID / Email"}
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              name="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#060813] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/80 transition-all"
              placeholder={activeTab === "candidate" ? "e.g. SEC25AD046" : "admin@magic.com"}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#060813] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/80 transition-all"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm shadow-md shadow-violet-900/30 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>{activeTab === "candidate" ? "Enter Candidate Portal" : "Sign In to Admin"}</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
