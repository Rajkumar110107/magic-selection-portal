import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login");
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
    return;
  }

  // If unauthenticated, redirect all protected routes to /login
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Support /candidate aliases
  if (pathname === "/candidate" || pathname === "/candidate/dashboard") {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (pathname.startsWith("/candidate/assessment/")) {
    const assessmentId = pathname.replace("/candidate/assessment/", "");
    return Response.redirect(new URL(`/assessment/${assessmentId}`, req.nextUrl));
  }

  // Admin route aliases
  if (pathname.startsWith("/admin")) {
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (pathname === "/admin" || pathname === "/admin/dashboard") {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (pathname === "/admin/candidates") {
      return Response.redirect(new URL("/dashboard/candidates", req.nextUrl));
    }
    if (pathname.startsWith("/admin/candidates/")) {
      const candidateId = pathname.replace("/admin/candidates/", "");
      return Response.redirect(new URL(`/dashboard/candidates/${candidateId}`, req.nextUrl));
    }
    if (pathname === "/admin/allocation" || pathname === "/admin/role-allocation") {
      return Response.redirect(new URL("/dashboard/allocation", req.nextUrl));
    }
    if (pathname === "/admin/cases" || pathname === "/admin/case-studies") {
      return Response.redirect(new URL("/dashboard/cases", req.nextUrl));
    }
    if (pathname === "/admin/assessments") {
      return Response.redirect(new URL("/dashboard/assessments", req.nextUrl));
    }
    if (pathname === "/admin/evaluations") {
      return Response.redirect(new URL("/dashboard/evaluations", req.nextUrl));
    }
    if (pathname === "/admin/comparison") {
      return Response.redirect(new URL("/dashboard/comparison", req.nextUrl));
    }
    if (pathname === "/admin/final" || pathname === "/admin/final-allocation") {
      return Response.redirect(new URL("/dashboard/final", req.nextUrl));
    }
    if (pathname === "/admin/exports") {
      return Response.redirect(new URL("/dashboard/exports", req.nextUrl));
    }
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Role-based protection: Candidates cannot access Admin dashboard sub-routes
  const adminOnlyRoutes = [
    "/dashboard/candidates",
    "/dashboard/allocation",
    "/dashboard/cases",
    "/dashboard/assessments",
    "/dashboard/evaluations",
    "/dashboard/comparison",
    "/dashboard/final",
    "/dashboard/exports",
    "/dashboard/audit",
  ];

  if (userRole === "CANDIDATE" && adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
