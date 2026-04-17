import type { Metadata } from "next";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Gayatri Plywood & Hardware | Plumbing Shop in Ahmedabad",
  description: "Professional plumbing, pipe fitting, and hardware services in Ahmedabad. Book your plumber today for reliable repairs and installations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
