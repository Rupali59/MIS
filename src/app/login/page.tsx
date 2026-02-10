"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [misId, setMisId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const id = parseInt(misId, 10);
    if (Number.isNaN(id)) {
      setError("Enter a valid MIS ID (number).");
      return;
    }
    const res = await signIn("credentials", {
      misId: misId,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid MIS ID or password.");
      return;
    }
    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="misId" className="block text-sm font-medium text-gray-700 mb-1">
              MIS ID
            </label>
            <input
              id="misId"
              type="text"
              value={misId}
              onChange={(e) => setMisId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/" className="text-gray-500 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
