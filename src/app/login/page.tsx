import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth-screen";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Green Solutions account.",
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
