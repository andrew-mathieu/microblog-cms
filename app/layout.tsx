import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plein de petits nuages pour Andrew",
  description:
    "Plein de petits nuages pour faire de la pluie, plein de petits soleils pour faire du beau temps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>
        <main>{children}</main>
      </body>
      <GoogleTagManager gtmId="GTM-58W4429B" />
    </html>
  );
}
