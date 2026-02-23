import { notFound } from "next/navigation";

type StaffProfile = {
  staff: {
    staffId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    title?: string;
    designation: string;
    department: string;
    emailOfficial: string;
    phoneOffice?: string;
    researchAreas?: string[];
    totalTeachingExpYears?: number;
    totalResearchExpYears?: number;
  };
  qualifications: {
    degree: string;
    discipline: string;
    institute: string;
    university?: string;
    yearOfCompletion?: number;
  }[];
  publications: {
    type: string;
    category?: string;
    title: string;
    authors: string;
    venue: string;
    year: number;
  }[];
};

async function getStaffProfile(staffId: string): Promise<StaffProfile | null> {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/staff/${encodeURIComponent(staffId)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch staff profile");
  return res.json();
}

interface PageProps {
  params: { staffId: string };
}

export default async function StaffProfilePage({ params }: PageProps) {
  const data = await getStaffProfile(params.staffId);
  if (!data) notFound();

  const { staff, qualifications, publications } = data;
  const name = [staff.title, staff.firstName, staff.middleName, staff.lastName].filter(Boolean).join(" ");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-700">
          {staff.designation}, {staff.department}
        </p>
        <p className="mt-1 text-sm text-gray-600">Email: {staff.emailOfficial}</p>
        {staff.phoneOffice && (
          <p className="mt-1 text-sm text-gray-600">
            Phone (office): {staff.phoneOffice}
          </p>
        )}
        {staff.researchAreas && staff.researchAreas.length > 0 && (
          <p className="mt-2 text-sm">
            <span className="font-semibold">Research Areas:</span> {staff.researchAreas.join(", ")}
          </p>
        )}
      </section>

      {qualifications.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Academic Information</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {qualifications.map((q, idx) => (
              <li key={idx}>
                <span className="font-semibold">{q.degree}</span> – {q.discipline},{" "}
                {q.institute}
                {q.university ? ` (${q.university})` : ""}{" "}
                {q.yearOfCompletion ? `, ${q.yearOfCompletion}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {publications.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Publications</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {publications.map((p, idx) => (
              <li key={idx}>
                <span className="font-semibold">
                  {p.type}
                  {p.category ? ` (${p.category})` : ""}:
                </span>{" "}
                {p.authors}. <em>{p.title}</em>. {p.venue}, {p.year}.
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

