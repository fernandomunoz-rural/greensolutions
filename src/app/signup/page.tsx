import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth-screen";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your free Green Solutions account.",
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
