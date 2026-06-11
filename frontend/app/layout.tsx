import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BMI — Mustaqil Fikrlash",
  description: "8–9-sinf o'quvchilarida mustaqil fikrlashni rivojlantirish demo platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
