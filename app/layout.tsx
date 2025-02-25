import type { Metadata } from "next";
import "./globals.css";
import MainNav from "./components/MainNav";

export const metadata: Metadata = {
  title: "Firecrawl Testing",
  description: "E2E testing examples with Firecrawl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono">
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <header className="row-start-1 w-full">
            <MainNav />
          </header>
          <div className="pl-64">
            {children}
          </div>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <span>footer</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
