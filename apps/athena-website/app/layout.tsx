import type { Metadata } from "next";
import "@/app/globals.css";
import "flowbite/dist/flowbite.css";
import { createTheme, ThemeModeScript, ThemeProvider } from "flowbite-react";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Athena Marketplace Website",
  icons: {
    icon: "/logo.png",
  },
};

const theme = createTheme({
  card: {
    root: {
      base: "bg-surface text-foreground outline-none border-0 shadow-lg dark:bg-surface dark:text-foreground",
    },
  },
  button: {
    color: {
      primary:
        "bg-primary text-primary-text hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary dark:text-primary-text dark:hover:bg-primary-800 dark:focus:ring-primary-300",
      secondary:
        "bg-secondary text-secondary-text hover:bg-secondary-600 focus:ring-4 focus:ring-secondary-300 dark:bg-secondary dark:text-secondary-text dark:hover:bg-secondary-600 dark:focus:ring-secondary-300",
      light:
        "bg-surface text-foreground hover:bg-muted focus:ring-4 focus:ring-border dark:bg-surface dark:text-foreground dark:hover:bg-muted dark:focus:ring-border",
    },
  },
  badge: {
    color: {
      info: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300",
    },
  },
  navbar: {
    root: {
      base: "bg-surface text-foreground border-b border-border dark:bg-surface dark:text-foreground dark:border-border",
    },
    link: {
      active: {
        on: "md:bg-transparent md:text-primary text-primary",
        off: "text-foreground hover:text-primary",
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          <ThemeModeScript />
        </head>
        <body>
          <ThemeProvider theme={theme as any}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
