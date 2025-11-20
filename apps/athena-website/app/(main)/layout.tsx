import Popup from "../_components/Popup";
import Footer from "./_components/Footer";
import NavbarClient from "./_components/NavbarClient";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarClient />
      <Popup />
      <main className="pt-14">{children}</main>
      <Footer />
    </>
  );
}
