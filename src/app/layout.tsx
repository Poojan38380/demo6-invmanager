import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SessionProvider } from "next-auth/react";

import type { Metadata, Viewport } from "next";

const APP_NAME = "InvManager";
const APP_DEFAULT_TITLE = "InvManager";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Manage your inventory seamlessly!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="InvManager" />
      </head>
      <body className="antialiased vsc-initialized">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors expand={true} />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
