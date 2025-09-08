import { EnvironmentProvider } from '@/components/providers/EnvironmentProvider';
import { HydrationFix } from '@/components/providers/HydrationFix';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { PageTransition } from '@/components/providers/PageTransition';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Don't preload mono font for better performance
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: {
    default: 'Owl AI - Your Personal AI Study Partner',
    template: '%s | Owl AI',
  },
  description:
    'Transform your learning experience with Owl AI. Get instant answers, personalized explanations, and master any subject with our intelligent AI study partner.',
  keywords: [
    'Owl AI',
    'AI learning assistant',
    'study partner',
    'educational assistant',
    'personalized learning',
    'AI tutor',
    'UGC NET preparation',
    'CSIR NET preparation',
    'SSC preparation',
    'CTET preparation',
  ],
  authors: [{ name: 'Owl AI Team' }],
  creator: 'Owl AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://owlai.com'),
  openGraph: {
    type: 'website',
    title: 'Owl AI - Your Personal AI Study Partner',
    description:
      'Transform your learning experience with intelligent, personalized assistance.',
    siteName: 'Owl AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owl AI - Your Personal AI Study Partner',
    description:
      'Transform your learning experience with intelligent, personalized assistance.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/owl-ai-logo.png',
    shortcut: '/owl-ai-logo.png',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'application-name': 'Owl AI',
    'apple-mobile-web-app-title': 'Owl AI',
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0D9488',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth' data-scroll-behavior='smooth'>
      <head>
        <link
          rel='icon'
          href='/owl-ai-logo.png'
          type='image/png'
          sizes='32x32'
        />
        <link
          rel='icon'
          href='/owl-ai-logo.png'
          type='image/png'
          sizes='16x16'
        />
        <link rel='shortcut icon' href='/owl-ai-logo.png' type='image/png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#0D9488' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        {/* Performance optimizations */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link rel='dns-prefetch' href='https://fonts.googleapis.com' />
        {/* No CSP in development to avoid blocking reCAPTCHA and Firebase scripts */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <HydrationFix />
        <EnvironmentProvider>
          <AuthProvider>
            <LenisProvider>
              <PageTransition>{children}</PageTransition>
            </LenisProvider>
          </AuthProvider>
        </EnvironmentProvider>
        <Toaster />
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                      // Preload critical resources if needed
                      // Currently no specific resources to preload
                    });
                  }
                });
              }
            `,
          }}
        />
        {/* Fix hydration issues caused by browser extensions */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Run immediately to clean up attributes before React hydration
                const extensionAttrs = [
                  'bis_skin_checked',
                  'data-new-gr-c-s-check-loaded',
                  'data-gr-ext-installed',
                  'data-gramm_editor',
                  'data-gramm',
                  'spellcheck',
                  'data-lexical-editor'
                ];

                function removeExtensionAttributes() {
                  extensionAttrs.forEach(attr => {
                    const elements = document.querySelectorAll('[' + attr + ']');
                    elements.forEach(element => {
                      element.removeAttribute(attr);
                    });
                  });
                }

                // Clean up immediately
                removeExtensionAttributes();

                // Set up mutation observer for future additions
                if (typeof window !== 'undefined') {
                  const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                      if (mutation.type === 'attributes') {
                        const target = mutation.target;
                        if (target.nodeType === Node.ELEMENT_NODE) {
                          extensionAttrs.forEach(attr => {
                            if (target.hasAttribute(attr)) {
                              target.removeAttribute(attr);
                            }
                          });
                        }
                      }
                    });
                  });

                  // Start observing when DOM is ready
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                      observer.observe(document.body, {
                        attributes: true,
                        subtree: true,
                        attributeFilter: extensionAttrs
                      });
                    });
                  } else {
                    observer.observe(document.body, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: extensionAttrs
                    });
                  }
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
