import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { History, ShieldCheck, Clock, User, Filter, AlertCircle, FileText, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
                SECURITY TRAIL
              </span>
              <span className="text-xs text-slate-400 font-medium">Immutable Audit Trail</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              System Audit Log & Security Events
            </h1>
            <p className="text-xs text-slate-400">
              Cryptographic audit trail of role assignments, assessment submissions, evaluations, and final locks.
            </p>
          </div>

          <div>
            <span className="text-xs bg-[#0b1021] border border-white/[0.08] text-slate-300 px-3.5 py-1.5 rounded-xl font-medium">
              Recorded Events: <strong className="text-white font-mono">{logs.length}</strong>
            </span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#060813]/60 border-b border-white/[0.06] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                      No audit logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isLock = log.action.includes("LOCK");
                    const isSubmit = log.action.includes("SUBMIT");
                    const isEval = log.action.includes("EVAL");

                    return (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} className="text-slate-500" />
                            <span>{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                              isLock
                                ? "bg-purple-500/15 text-purple-300 border-purple-500/25"
                                : isSubmit
                                ? "bg-violet-600/15 text-violet-300 border-violet-500/25"
                                : isEval
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                                : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {log.userId ? log.userId.slice(0, 12) : "SYSTEM"}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] max-w-md truncate">
                          {log.details}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
