import './globals.css'

export const metadata = {
  title: 'Shopify Variants Clone',
  description: 'A pixel-perfect clone of Shopify\'s Variants section',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
