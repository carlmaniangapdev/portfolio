import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Carl Angelo M. Maniangap — Software Developer Portfolio";
const description = "Software developer portfolio featuring apps, integrations, and automation built with React, Next.js, PHP, Laravel, JavaScript, and MySQL.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Carl Angelo M. Maniangap" }],
  applicationName: "Carl Angelo Maniangap Portfolio",
  openGraph: { title, description, type: "website", images: [{ url: "/profile.jpg", width: 1332, height: 1665, alt: "Portrait of Carl Angelo M. Maniangap" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/profile.jpg"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#10141D", colorScheme: "dark light" };

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="system")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";if(t)document.documentElement.dataset.theme=t;var p=JSON.parse(localStorage.getItem("prefs")||"{}");if(p.motion)document.documentElement.dataset.motion=p.motion}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The root layout is the App Router equivalent of a document-level font include. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
