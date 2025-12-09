import { Inter as FontSans } from "next/font/google";
import { Cairo } from "next/font/google";
import "./globals.css";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "../../components/ui/sonner";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/footer";
import { Provider } from "@/utils/Provider";
import Script from "next/script";
import AnalyticsListener from "@/components/analytics-listener";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cairo = Cairo({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} dir={`${locale === "ar" ? `rtl` : `ltr`}`}>
      <body
        className={cn(
          `${
            locale === "ar" ? `!font-cairo` : `!font-sans`
          } min-h-screen   antialiased`,
          fontSans.variable,
          cairo.variable
        )}
      >
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>
        )}

        <AnalyticsListener />
        <Provider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <NextTopLoader showSpinner={false} color="#a7603a" />
            <main> {children}</main>
            <Footer />
          </NextIntlClientProvider>
          <Toaster position="top-center" richColors />
        </Provider>
      </body>
    </html>
  );
}
