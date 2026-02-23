"use client";

import useSWR from "swr";

type Staff = {
  _id: string;
  staffId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  designation: string;
  department: string;
  category: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FacultyListPage() {
  const { data, error, isLoading } = useSWR<Staff[]>("/api/staff?category=faculty", fetcher);

  if (isLoading) return <div className="p-6">Loading faculty…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load faculty list.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Faculty</h1>
      <p className="text-sm text-gray-600 mb-4">
        This list is driven from the MIS staff module (no manual HTML edits).
      </p>
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Designation</th>
              <th className="px-3 py-2 text-left font-semibold">Department</th>
              <th className="px-3 py-2 text-left font-semibold">Profile</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((s) => {
              const name = [s.title, s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
              return (
                <tr key={s._id} className="border-t">
                  <td className="px-3 py-2">{name}</td>
                  <td className="px-3 py-2">{s.designation}</td>
                  <td className="px-3 py-2">{s.department}</td>
                  <td className="px-3 py-2">
                    <a
                      href={`/faculty/${encodeURIComponent(s.staffId)}`}
                      className="text-blue-600 hover:underline"
                    >
                      View profile
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

