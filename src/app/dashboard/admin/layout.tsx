import DashboardNav from "@/components/DashboardNav";

const adminLinks = [
  { href: "/dashboard/admin", label: "Home" },
  { href: "/dashboard/admin/profile", label: "Profile" },
  { href: "/dashboard/admin/roll-numbers", label: "Roll number generation" },
  { href: "/dashboard/admin/timetable", label: "Timetable upload" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardNav role="admin" links={adminLinks}>
      {children}
    </DashboardNav>
  );
}
