import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Hind_Siliguri } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { AppGoogleOAuthProvider } from "@/providers/google-oauth-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import "./globals.css";

// Cormorant Garamond is the default serif (maps to --font-sans / body).
const cormorant = Cormorant_Garamond({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Montserrat is used via the .font-montserrat utility.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Hind Siliguri renders Bangla (Bengali) cleanly; applied via the .font-bengali
// utility whenever the blog is switched to বাংলা.
const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Glowly",
  description: "Glowly storefront",
  icons: {
    icon: [
      { url: "/glowly.svg", type: "image/svg+xml" },
      { url: "/glowly.png", type: "image/png" },
    ],
    apple: "/glowly.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppGoogleOAuthProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </QueryProvider>
        </AppGoogleOAuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
