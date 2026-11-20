import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) return;

  return (
    <>
      <Navbar userRole={user.role} />
      <main className="container mx-auto p-5">{children}</main>
    </>
  );
}
