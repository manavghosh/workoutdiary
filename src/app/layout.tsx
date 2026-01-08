import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workout Diary",
  description: "Track your workouts and fitness progress",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="p-4 border-b">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Workout Diary</h1>
                <div className="flex gap-4 items-center">
                  <ThemeToggle />
                  <SignedOut>
                    <Button variant="default" size="sm" asChild>
                      <SignInButton mode="modal">
                        Sign In
                      </SignInButton>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <SignUpButton mode="modal">
                        Sign Up
                      </SignUpButton>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center gap-3">
                      {user?.firstName && (
                        <span className="text-sm">Hello, {user.firstName}</span>
                      )}
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto p-4">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
