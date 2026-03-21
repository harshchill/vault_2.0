"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function getPostAuthDestination() {
    try {
      const response = await fetch("/api/onboarding", { cache: "no-store" });
      if (!response.ok) {
        return callbackUrl;
      }

      const data = await response.json();
      if (data?.isOnboarded === false) {
        return "/onboarding";
      }
    } catch (err) {
      console.error("Onboarding check error:", err);
    }

    return callbackUrl;
  }

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Login failed");
      } else if (result?.ok) {
        const destination = await getPostAuthDestination();
        router.push(destination);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    try {
      const googleCallbackUrl = callbackUrl === "/" ? "/onboarding" : callbackUrl;
      await signIn("google", { redirect: true, callbackUrl: googleCallbackUrl });
    } catch (err) {
      setError("Google sign-in failed");
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#25671E" }}>
          Welcome Back
        </h1>
        <p className="text-sm" style={{ color: "#25671E", opacity: 0.65 }}>
          Sign in to access your papers and coins
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-3 rounded-lg text-sm border"
          style={{
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="relative">
          <label
            className="text-xs font-semibold mb-2 block"
            style={{ color: "#25671E" }}
          >
            Email
          </label>
          <div className="relative flex items-center">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "#48A111" }}
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm placeholder:opacity-50 transition-all"
              style={{
                background: "white",
                border: "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(72, 161, 17, 0.4)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(72, 161, 17, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(37, 103, 30, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            className="text-xs font-semibold mb-2 block"
            style={{ color: "#25671E" }}
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "#48A111" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm placeholder:opacity-50 transition-all"
              style={{
                background: "white",
                border: "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(72, 161, 17, 0.4)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(72, 161, 17, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(37, 103, 30, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
              disabled={loading}
              style={{ color: "#25671E" }}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full py-2.5 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: loading ? "#1a4d15" : "#25671E" }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In with Email"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-2">
        <div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: "rgba(37, 103, 30, 0.15)" }}
        />
        <div className="relative flex justify-center">
          <span
            className="bg-white px-3 text-xs font-medium"
            style={{ color: "#25671E", opacity: 0.6 }}
          >
            OR
          </span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-2.5 rounded-full font-semibold transition-all flex items-center justify-center gap-2 border-2 disabled:opacity-60"
        style={{
          background: "white",
          border: "2px solid rgba(37, 103, 30, 0.2)",
          color: "#25671E",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="1" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
        Sign In with Google
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm" style={{ color: "#25671E" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold transition-opacity hover:opacity-60"
          style={{ color: "#48A111" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
