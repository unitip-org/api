import type { Metadata } from "next";
import "./globals.css";

import { Nunito } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Provider from "./provider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Unitip",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <Provider>
          <NextTopLoader />
          {children}
        </Provider>
      </body>
    </html>
  );
}
