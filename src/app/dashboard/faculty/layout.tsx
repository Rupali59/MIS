import DashboardNav from "@/components/DashboardNav";

const facultyLinks = [
  { href: "/dashboard/faculty", label: "Home" },
  { href: "/dashboard/faculty/profile", label: "Profile" },
  { href: "/dashboard/faculty/qualifications", label: "Qualifications" },
  { href: "/dashboard/faculty/payroll", label: "Payroll" },
  { href: "/dashboard/faculty/timetable", label: "Timetable upload" },
  { href: "/dashboard/faculty/courses", label: "Course list" },
  { href: "/dashboard/faculty/attendance", label: "Attendance" },
  { href: "/dashboard/faculty/photo", label: "Photo upload" },
];

export default function FacultyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardNav role="faculty" links={facultyLinks}>
      {children}
    </DashboardNav>
  );
}
