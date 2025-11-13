import { Header } from "@/components/header";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-24">
        {children}
      </div>
    </>
  );
}
