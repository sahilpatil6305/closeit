"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/schemas/register";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

interface FieldErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    // Client-side validation using Zod
    const validationResult = registerSchema.safeParse(formData);

    if (!validationResult.success) {
      const formatted = validationResult.error.flatten().fieldErrors;
      setFieldErrors({
        name: formatted.name,
        email: formatted.email,
        password: formatted.password,
        confirmPassword: formatted.confirmPassword,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          setFieldErrors(data.details);
        } else {
          setServerError(data.error || "Failed to register. Please try again.");
        }
        return;
      }

      const signInResult = await signIn("credentials", {
        email: validationResult.data.email,
        password: validationResult.data.password,
        redirect: false,
      });

      if (!signInResult?.ok || signInResult.error) {
        setServerError("Your account was created, but we could not sign you in. Please try signing in.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordValidationChecklist = [
    {
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      valid: formData.password.length >= PASSWORD_MIN_LENGTH,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter your details below to register
          </p>
        </div>

        {serverError && (
          <div
            className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3"
            role="alert"
          >
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Jane Doe"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                fieldErrors.name
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                  : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                {fieldErrors.name[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="jane@example.com"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                fieldErrors.email
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                  : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isSubmitting}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••••"
                className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                  fieldErrors.password
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                {fieldErrors.password[0]}
              </p>
            )}

            {/* Password Requirement Guidance */}
            <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
              <div className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                Password requirements:
              </div>
              {passwordValidationChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 transition-colors ${
                    item.valid
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={item.valid ? 3 : 2}
                      d={item.valid ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                    />
                  </svg>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={isSubmitting}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••••••"
                className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 dark:bg-slate-900 dark:text-white ${
                  fieldErrors.confirmPassword
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium focus:outline-none"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                {fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
