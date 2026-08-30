"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Users,
  LayoutDashboard,
  Briefcase,
  BookOpen,
  FileText,
  BarChart2,
  GitCompare,
  ShieldCheck,
  Download,
  History,
  Menu,
  X,
  ChevronRight,
  Shield
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Control Center" },
  { href: "/dashboard/candidates", icon: Users, label: "Candidates" },
  { href: "/dashboard/allocation", icon: Briefcase, label: "Capability Allocation" },
  { href: "/dashboard/cases", icon: BookOpen, label: "Case Study Bank" },
  { href: "/dashboard/assessments", icon: FileText, label: "Assessments Queue" },
  { href: "/dashboard/evaluations", icon: BarChart2, label: "Evaluations" },
  { href: "/dashboard/comparison", icon: GitCompare, label: "Candidate Comparison" },
  { href: "/dashboard/final", icon: ShieldCheck, label: "Final 7 Selection" },
  { href: "/dashboard/exports", icon: Download, label: "Export Center" },
  { href: "/dashboard/audit", icon: History, label: "Security Audit" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0b1021] border-b border-white/[0.08] sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Shield size={16} />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">MAGIC Portal</span>
            <span className="block text-[10px] text-slate-400">Admin Control</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0b1021] border-r border-white/[0.08] flex flex-col z-50 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-sm shadow-violet-900/20">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>MAGIC PORTAL</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Control Center v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/15 text-violet-300 border border-violet-500/25 shadow-sm shadow-violet-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} className={isActive ? "text-violet-400" : "text-slate-500"} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-violet-400/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Sign Out */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
