import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">MIS</h1>
      <p className="text-gray-600 mb-8">Management Information System</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/register/student"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Student Registration
        </Link>
        <Link
          href="/register/faculty"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Faculty Registration
        </Link>
        <Link
          href="/register/admin"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Admin Registration
        </Link>
      </div>
    </div>
  );
}
