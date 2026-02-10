import DashboardNav from "@/components/DashboardNav";

const studentLinks = [
  { href: "/dashboard/student", label: "Home" },
  { href: "/dashboard/student/profile", label: "Profile" },
  { href: "/dashboard/student/qualifications", label: "Qualifications" },
  { href: "/dashboard/student/current-details", label: "Current details" },
  { href: "/dashboard/student/course-registration", label: "Course registration" },
  { href: "/dashboard/student/fee-payment", label: "Fee payment" },
  { href: "/dashboard/student/grade-report", label: "Grade report" },
  { href: "/dashboard/student/feedback", label: "Feedback" },
  { href: "/dashboard/student/photo", label: "Photo upload" },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardNav role="student" links={studentLinks}>
      {children}
    </DashboardNav>
  );
}
