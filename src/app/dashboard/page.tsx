'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>
  }

  const user = session?.user as any

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/customers', label: 'Customers', icon: '👥' },
    { href: '/suppliers', label: 'Suppliers', icon: '🏢' },
    { href: '/shipments', label: 'Shipments', icon: '🚢' },
    { href: '/invoices', label: 'Invoices', icon: '📄' },
    { href: '/quotes', label: 'Quotes', icon: '📋' },
    { href: '/warehouse', label: 'Warehouse', icon: '🏭' },
    { href: '/containers', label: 'Containers', icon: '📦' },
    { href: '/tracking', label: 'Tracking', icon: '📍' },
    { href: '/reports', label: 'Reports', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">CF-ERP</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold flex-1">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {(session?.user as any)?.name || 'User'}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                {(session?.user as any)?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {(session?.user as any)?.name?.split(' ')[0] || 'User'}!</h2>
            <p className="text-gray-600 mt-1">Here's an overview of your operations.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Customers" value="1,234" change="+12%" icon="👥" />
            <StatCard title="Active Shipments" value="56" change="+3" icon="🚢" />
            <StatCard title="Pending Invoices" value="23" change="-2" icon="📄" />
            <StatCard title="Revenue This Month" value="$127,450" change="+8.5%" icon="💰" />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/customers/new" className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-2xl mb-1">👤</div>
                <p className="font-medium">Add Customer</p>
                <p className="text-sm text-gray-500">Create new customer</p>
              </Link>
              <Link href="/shipments/new" className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-2xl mb-1">🚢</div>
                <p className="font-medium">New Shipment</p>
                <p className="text-sm text-gray-500">Book shipment</p>
              </Link>
              <Link href="/invoices/new" className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-2xl mb-1">📄</div>
                <p className="font-medium">Create Invoice</p>
                <p className="text-sm text-gray-500">Generate invoice</p>
              </Link>
              <Link href="/quotes/new" className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-2xl mb-1">📋</div>
                <p className="font-medium">Create Quote</p>
                <p className="text-sm text-gray-500">Send quotation</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Shipments</h3>
              <Link href="/shipments" className="text-blue-600 hover:underline text-sm">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETD</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SHP-2024-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Acme Corp</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shanghai → Los Angeles</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Transit</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 15, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                      <a href="#" className="text-blue-600 hover:text-blue-900">Track</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SHP-2024-002</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Global Logistics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shenzhen → New York</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Customs</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 20, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                      <a href="#" className="text-blue-600 hover:text-blue-900">Track</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: string }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-bold text-gray-900">{value}</dd>
            <dd className="text-sm font-medium text-green-600">{change}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}