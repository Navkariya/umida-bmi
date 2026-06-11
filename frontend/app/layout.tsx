import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "BMI — Mustaqil Fikrlash",
  description: "8–9-sinf o'quvchilarida mustaqil fikrlashni rivojlantirish demo platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
