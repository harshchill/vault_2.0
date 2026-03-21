"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  async function getPostSignupDestination() {
    try {
      const response = await fetch("/api/onboarding", { cache: "no-store" });
      if (!response.ok) {
        return "/onboarding";
      }

      const data = await response.json();
      if (data?.isOnboarded === false) {
        return "/onboarding";
      }
    } catch (err) {
      console.error("Onboarding check error:", err);
    }

    return "/";
  }

  function validateForm() {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await signupRes.json();

      if (!signupRes.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful signup
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        const destination = await getPostSignupDestination();
        router.push(destination);
      } else {
        setError("Account created, but auto-login failed. Please sign in.");
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
      await signIn("google", { redirect: true, callbackUrl: "/onboarding" });
    } catch (err) {
      setError("Google sign-up failed");
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#25671E" }}>
          Get Started
        </h1>
        <p className="text-sm" style={{ color: "#25671E", opacity: 0.65 }}>
          Create your account to unlock exam papers
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

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            className="text-xs font-semibold mb-2 block"
            style={{ color: "#25671E" }}
          >
            Full Name
          </label>
          <div className="relative flex items-center">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "#48A111" }}
            />
            <input
              type="text"
              placeholder="Priya Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) {
                  setValidationErrors({ ...validationErrors, name: "" });
                }
              }}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm placeholder:opacity-50 transition-all"
              style={{
                background: "white",
                border: validationErrors.name
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
              }}
              onFocus={(e) => {
                if (!validationErrors.name) {
                  e.target.style.borderColor = "rgba(72, 161, 17, 0.4)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(72, 161, 17, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = validationErrors.name
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(37, 103, 30, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          {validationErrors.name && (
            <p className="text-xs mt-1" style={{ color: "#991b1b" }}>
              {validationErrors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: "" });
                }
              }}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm placeholder:opacity-50 transition-all"
              style={{
                background: "white",
                border: validationErrors.email
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
              }}
              onFocus={(e) => {
                if (!validationErrors.email) {
                  e.target.style.borderColor = "rgba(72, 161, 17, 0.4)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(72, 161, 17, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = validationErrors.email
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(37, 103, 30, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs mt-1" style={{ color: "#991b1b" }}>
              {validationErrors.email}
            </p>
          )}
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: "" });
                }
              }}
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm placeholder:opacity-50 transition-all"
              style={{
                background: "white",
                border: validationErrors.password
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
              }}
              onFocus={(e) => {
                if (!validationErrors.password) {
                  e.target.style.borderColor = "rgba(72, 161, 17, 0.4)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(72, 161, 17, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = validationErrors.password
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(37, 103, 30, 0.15)";
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
          {validationErrors.password && (
            <p className="text-xs mt-1" style={{ color: "#991b1b" }}>
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            className="text-xs font-semibold mb-2 block"
            style={{ color: "#25671E" }}
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "#48A111" }}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) {
                  setValidationErrors({ ...validationErrors, confirmPassword: "" });
                }
              }}
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm placeholder:opacity-50 transition-all"
              style={{
                background: "white",
                border: validationErrors.confirmPassword
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid rgba(37, 103, 30, 0.15)",
                color: "#25671E",
              }}
              onFocus={(e) => {
                if (!validationErrors.confirmPassword) {
                  e.target.style.borderColor = "rgba(72, 161, 17, 0.4)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(72, 161, 17, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = validationErrors.confirmPassword
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(37, 103, 30, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
              disabled={loading}
              style={{ color: "#25671E" }}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs mt-1" style={{ color: "#991b1b" }}>
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading || !name || !email || !password || !confirmPassword}
          className="w-full py-2.5 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: loading ? "#1a4d15" : "#25671E" }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
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

      {/* Google Sign Up */}
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
        Create Account with Google
      </button>

      {/* Sign In Link */}
      <p className="text-center text-sm" style={{ color: "#25671E" }}>
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold transition-opacity hover:opacity-60"
          style={{ color: "#48A111" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
