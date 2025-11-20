import { Metadata } from "next/types";
import Link from "next/link";
import { LucideOctagon } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Inventory Management",
  description: "Login to your inventory management account",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <Link
              prefetch={false}
              href="/"
              className="inline-flex items-center text-primary hover:opacity-80 transition-opacity"
            >
              <LucideOctagon className="mr-2 h-6 w-6" />
              <span className="text-lg font-medium">Inventory</span>
            </Link>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-card-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-card-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
