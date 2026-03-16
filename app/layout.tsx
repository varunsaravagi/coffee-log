import type { Metadata, Viewport } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Log",
  description: "Track coffee bags and dial-in grind settings from phone or desktop.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6f3b1f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <div className="app-frame">
            <header className="mb-5 flex items-center justify-between rounded-[2rem] panel px-5 py-4">
              <Link className="text-lg font-bold" href="/">
                Coffee Log
              </Link>
              <nav className="flex flex-wrap gap-2 text-sm font-semibold">
                <Link className="secondary-button" href="/beans/new">
                  Add bean
                </Link>
                <Link className="secondary-button" href="/grinders">
                  Grinders
                </Link>
                <Link className="secondary-button" href="/search">
                  Search
                </Link>
              </nav>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
