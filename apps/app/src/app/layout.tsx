import type { Metadata, Viewport } from "next";
import Script from 'next/script'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const webSite = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  name: 'Kreyolopal',
  url: 'https://kreyolopal.com/',
}

const org = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://kreyolopal.com/',
  logo: '/images/logo_name.png',
}

export const viewport: Viewport = {
  themeColor: {
    color: "#000000"
  },
  width: 'device-width',
  initialScale: 1.0
}

export const metadata: Metadata = {
  title: "Kreyolopal",
  description: "Utiliser les technologies d'aujourd'hui pour encourager, améliorer et diffuser l'écriture du créole.",
  manifest: "/favicons/site.webmanifest",

  openGraph: {
    type: "website",
    images: [
      {
        url: "/images/kreyolopal_social.png",
        type: "image/png",
        width: 940,
        height: 788,
        alt: "Kreyolopal : les technologies au service du créole"
      }
    ]
  },
  icons: {
    icon: [{
      url: "/favicons/favicon-32x32.png",
      type: "image/png",
      sizes: "32x32",

    },
    {
      url: "/favicons/favicon-16x16.png",
      type: "image/png",
      sizes: "16x16",

    },
    ],
    shortcut: "/favicons/favicon.ico",
    apple: {
      sizes: "180x180",
      url: "/favicons/apple-touch-icon.png"

    },
    other: [{
      rel: "mask-icon",
      url: "/favicons/safari-pinned-tab.svg",
      color: "#5bbad5"

    }
    ]

  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <Script
        id="website_ld_json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />

      <Script
        id="org_ld_json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >{children}
        </ThemeProvider>
      </body>
    </html>
  );
}
