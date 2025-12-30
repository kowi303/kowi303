import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kowi303 - Ordine Maglia",
  description: "Ordina la tua maglia con un form elegante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
