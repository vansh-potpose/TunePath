import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/contexts/AudioContext";
import { AppStateProvider } from "@/contexts/AppStateContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description: "A modern music player built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <ErrorBoundary>
          <AppStateProvider>
            <AudioProvider>
              {children}
            </AudioProvider>
          </AppStateProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
