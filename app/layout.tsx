import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanjina Riznica Priča",
  description: "Zbirka priča i maštarija",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
