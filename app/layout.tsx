import type { Metadata } from "next";
import { AppLayout } from "@/components/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamShield Senior",
  description: "Senior-friendly anti-scam assistant for checking suspicious messages, calls and phishing attempts.",
  applicationName: "ScamShield Senior"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
