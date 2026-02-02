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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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
      <head>
        <meta
          name="facebook-domain-verification"
          content="5cu4a7gq0gn7su6km8j9frsow53xdw"
        />
      </head>
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `,
          }}
        />
      )}

      <body
        className={cn(
          `${
            locale === "ar" ? `!font-cairo` : `!font-sans`
          } min-h-screen   antialiased`,
          fontSans.variable,
          cairo.variable,
        )}
      >
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
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
