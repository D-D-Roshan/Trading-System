import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Users, BarChart2 } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold flex items-center space-x-2">
            <BarChart2 className="h-6 w-6" />
            <span>Trading System</span>
          </Link>
          <div className="flex space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-white hover:text-gray-300 flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/client" passHref>
              <Button variant="ghost" className="text-white hover:text-gray-300 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Client Interface</span>
              </Button>
            </Link>
            <Link href="/manager" passHref>
              <Button variant="ghost" className="text-white hover:text-gray-300 flex items-center space-x-2">
                <BarChart2 className="h-5 w-5" />
                <span>Settlement Interface</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

