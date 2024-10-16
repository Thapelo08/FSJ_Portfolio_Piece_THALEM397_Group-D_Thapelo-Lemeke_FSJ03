import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Rename your local metadata object
export const metadata = {
  title: {
    default: 'Stylish E-commerce Store',
    template: '%s | Stylish E-commerce Store'
  },
  description: 'A beautiful and modern e-commerce experience',
  keywords: ['e-commerce', 'online shopping', 'stylish products'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Stylish E-commerce Store',
    description: 'A beautiful and modern e-commerce experience',
    url: 'https://your-website.com',
    siteName: 'Stylish E-commerce Store',
    images: [
      {
        url: 'https://your-website.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stylish E-commerce Store',
    description: 'A beautiful and modern e-commerce experience',
    creator: '@yourtwitter',
    images: ['https://your-website.com/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className= {`${inter.className} min-h-screen flex flex-col`}>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-pink-500 to-red-700 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            © 2024 Stylish Store. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
