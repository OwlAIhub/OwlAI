import { LenisProvider } from '@/components/providers/LenisProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
    'educational chatbot',
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
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link
          rel='icon'
          href='/owl-ai-logo.png'
          type='image/png'
          sizes='32x32'
        />
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
        <LenisProvider>{children}</LenisProvider>
        {/* Performance monitoring and hydration fixes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Handle browser extension modifications
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      // Remove browser extension attributes that cause hydration mismatches
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                  });
                });

                // Start observing when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                  });
                } else {
                  observer.observe(document.body, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                }

                window.addEventListener('load', () => {
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                      // Preload critical resources
                      const link = document.createElement('link');
                      link.rel = 'prefetch';
                      link.href = '/';
                      document.head.appendChild(link);
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
