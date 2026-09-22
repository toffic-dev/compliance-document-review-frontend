"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Mail, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/AuthContext";
import {
  SESSION_EXPIRED_MESSAGE,
  SESSION_EXPIRED_REASON,
} from "@/lib/session";
import { validateEmail, validateRequired, type FieldErrors } from "@/lib/validation";

type LoginField = "email" | "password";

/** Order used to focus the first invalid field after a failed submit. */
const FIELD_ORDER: LoginField[] = ["email", "password"];

interface LoginValues {
  email: string;
  password: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // The session handler sends visitors here with `?reason=session-expired` when
  // a token expired or was rejected, so the redirect is never silent.
  const sessionExpired = searchParams.get("reason") === SESSION_EXPIRED_REASON;
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginField>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const values: LoginValues = { email, password };

  /** Runs every rule and returns only the fields that failed. */
  const validateAll = (next: LoginValues): FieldErrors<LoginField> => {
    const errors: FieldErrors<LoginField> = {};

    const emailError = validateEmail(next.email);
    if (emailError) errors.email = emailError;

    // Sign-in only checks presence: length rules belong to account creation.
    const passwordError = validateRequired(next.password, "Password");
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  const handleValueChange = (field: LoginField, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    // Re-validate live once a problem has been shown, so messages clear as the
    // user fixes them without nagging fields they have not reached yet.
    if (hasSubmitted || fieldErrors[field]) {
      setFieldErrors(validateAll({ ...values, [field]: value }));
    }
  };

  const handleFieldBlur = (field: LoginField) => {
    // Empty fields are reported on submit; blurring past them stays quiet.
    if (!values[field].trim()) return;
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateAll(values)[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHasSubmitted(true);

    const validationErrors = validateAll(values);
    setFieldErrors(validationErrors);

    const firstInvalidField = FIELD_ORDER.find(
      (field) => validationErrors[field]
    );
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email.trim(), password);
      // Redirect based on user role, ignoring any redirect query param
      const normalizedRole = (user.role ?? "").trim().toUpperCase();
      if (normalizedRole === "COMPLIANCE_OFFICER" || normalizedRole === "OFFICER") {
        router.push("/officer");
      } else {
        router.push("/advisor");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {sessionExpired && !error && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{SESSION_EXPIRED_MESSAGE}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => handleValueChange("email", e.target.value)}
          onBlur={() => handleFieldBlur("email")}
          error={fieldErrors.email}
          required
          icon={<Mail className="h-4 w-4" />}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => handleValueChange("password", e.target.value)}
          onBlur={() => handleFieldBlur("password")}
          error={fieldErrors.password}
          required
          icon={<Lock className="h-4 w-4" />}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <a
            href="#"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Forgot password?
          </a>
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-slate-900" />
              <span className="text-xl font-semibold text-slate-900">
                Compliance Review
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-slate-900 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
