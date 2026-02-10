"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ misId?: number; error?: string } | null>(null);
  const [form, setForm] = useState({
    password: "",
    secQuest: "",
    secAns: "",
    hint: "",
    fname: "",
    mname: "",
    lname: "",
    dob: "",
    gender: "",
    p_street: "",
    p_city: "",
    p_state: "",
    p_country: "",
    p_pincode: "",
    t_street: "",
    t_city: "",
    t_state: "",
    t_country: "",
    t_pincode: "",
    blood_group: "",
    email_id: "",
    marital_status: "",
    nationality: "",
    mno: "",
    lno: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ error: data.error || "Registration failed" });
        return;
      }
      setResult({ misId: data.misId });
    } catch {
      setResult({ error: "Registration failed" });
    } finally {
      setLoading(false);
    }
  }

  if (result?.misId != null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow p-6 max-w-md text-center">
          <h2 className="text-lg font-bold text-green-700 mb-2">Registration successful</h2>
          <p className="text-gray-700 mb-4">Save your Admin ID: <strong>{result.misId}</strong></p>
          <Link href="/login" className="text-blue-600 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-bold mb-6">Admin Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name *</label>
              <input required value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name *</label>
              <input required value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email_id} onChange={(e) => setForm({ ...form, email_id: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security question</label>
            <input value={form.secQuest} onChange={(e) => setForm({ ...form, secQuest: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security answer</label>
            <input value={form.secAns} onChange={(e) => setForm({ ...form, secAns: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          {result?.error && <p className="text-red-600 text-sm">{result.error}</p>}
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Submitting..." : "Register"}
            </button>
            <Link href="/" className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
