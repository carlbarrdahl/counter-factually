import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";

import Logo from "./logo.gif";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "counter factually",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Providers>
            <header className="pl-2  bg-[#ffdeee]">
              <img src={Logo.src} />
              {/* <video
                loop
                playsInline
                className="h-16"
                autoPlay
                src={"./logo.mp4"}
                muted
              /> */}
            </header>
            <main>{children}</main>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
