"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(identifier: string, password: string) {
  if (!identifier || !password) {
    return { error: "Please enter both identifier and password." };
  }

  try {
    await signIn("credentials", {
      identifier: identifier.trim(),
      password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please verify your ID/Email and password." };
        default:
          return { error: "Authentication failed. Please verify your credentials and try again." };
      }
    }
    // Next.js redirection throws an internal NEXT_REDIRECT error which must be re-thrown
    throw error;
  }
}
