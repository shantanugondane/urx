import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shopify Variants Clone
        </h1>
        <p className="text-gray-600 mb-8">
          A pixel-perfect clone of Shopify's Variants section
        </p>
        <Link 
          href="/variants"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Variants
        </Link>
      </div>
    </div>
  )
}
