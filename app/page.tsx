import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Trading System
        </h1>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/client" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Client Interface &rarr;</h3>
            <p className="mt-4 text-xl">
              Place and manage your trading orders
            </p>
          </Link>
          <Link href="/manager" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Settlement Interface &rarr;</h3>
            <p className="mt-4 text-xl">
              Match and settle trades (Account Managers only)
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}

