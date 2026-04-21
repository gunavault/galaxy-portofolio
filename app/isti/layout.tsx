import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Outfit } from "next/font/google";
import "./secondapp.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-dm-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Istiazah Latifah Sadina — Engineering Physics",
  description:
    "Portfolio of Istiazah Latifah Sadina — Engineering Physics undergraduate specializing in Instrumentation, Control Systems, and Data Analytics at Telkom University, Bandung.",
  keywords: ["Engineering Physics", "Instrumentation", "PID Control", "Data Analytics", "Telkom University"],
  openGraph: {
    title: "Istiazah Latifah Sadina",
    description: "Engineering Physics · Instrumentation & Control · Data Analytics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable} font-outfit antialiased bg-cream text-bark`}
      >
        {children}
      </body>
    </html>
  );
}
