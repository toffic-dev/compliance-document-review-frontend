"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/AuthContext";
import { normalizeRole } from "@/lib/utils";
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validateNewPassword,
  type FieldErrors,
} from "@/lib/validation";

type SignupField = "name" | "email" | "password" | "confirmPassword";

/** Order used to focus the first invalid field after a failed submit. */
const FIELD_ORDER: SignupField[] = [
  "name",
  "email",
  "password",
  "confirmPassword",
];

interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"ADVISOR" | "COMPLIANCE_OFFICER">("ADVISOR");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignupField>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const values: SignupValues = { name, email, password, confirmPassword };

  /** Runs every rule and returns only the fields that failed. */
  const validateAll = (next: SignupValues): FieldErrors<SignupField> => {
    const errors: FieldErrors<SignupField> = {};

    const nameError = validateFullName(next.name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(next.email);
    if (emailError) errors.email = emailError;

    const passwordError = validateNewPassword(next.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      next.password,
      next.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
  };

  const handleValueChange = (field: SignupField, value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    // Re-validate live once a problem has been shown, so messages clear as the
    // user fixes them without nagging fields they have not reached yet.
    if (hasSubmitted || fieldErrors[field]) {
      setFieldErrors(validateAll({ ...values, [field]: value }));
    }
  };

  const handleFieldBlur = (field: SignupField) => {
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
      await signup(name.trim(), email.trim(), password, role);
      router.push(normalizeRole(role) === "ADVISOR" ? "/advisor" : "/officer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Get started with Compliance Review
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                id="name"
                label="Full name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => handleValueChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                error={fieldErrors.name}
                required
                icon={<User className="h-4 w-4" />}
              />
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => handleValueChange("password", e.target.value)}
                onBlur={() => handleFieldBlur("password")}
                error={fieldErrors.password}
                required
                icon={<Lock className="h-4 w-4" />}
              />
              <Input
                id="confirmPassword"
                label="Confirm password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  handleValueChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleFieldBlur("confirmPassword")}
                error={fieldErrors.confirmPassword}
                required
                icon={<Lock className="h-4 w-4" />}
              />
              <div role="group" aria-labelledby="role-label">
                <label
                  id="role-label"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Role
                  <span className="ml-0.5 text-red-600" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={role === "ADVISOR"}
                    onClick={() => setRole("ADVISOR")}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      role === "ADVISOR"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Advisor
                  </button>
                  <button
                    type="button"
                    aria-pressed={role === "COMPLIANCE_OFFICER"}
                    onClick={() => setRole("COMPLIANCE_OFFICER")}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      role === "COMPLIANCE_OFFICER"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Officer
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
