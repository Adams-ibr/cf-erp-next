'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface StatCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
}

function StatCard({ title, value, change, icon, trend }: StatCard) {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50'
  }
  const trendIcon = {
    up: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
    down: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7v-18"/></svg>,
    neutral: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14"/></svg>
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
              {trendIcon[trend]}
              {change}
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ title, description, icon, href }: { title: string; description: string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all">
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-100 transition-colors mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </Link>
  )
}

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Redirecting...</div>
  }

  const user = session?.user as any

  const stats: StatCard[] = [
    { title: 'Total Customers', value: '1,234', change: '+12%', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>, trend: 'up' },
    { title: 'Active Shipments', value: '56', change: '+3', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h16M8 7l4-4m6 4l4 4m-10 3v14"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v4"/></svg>, trend: 'up' },
    { title: 'Pending Invoices', value: '23', change: '-2', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>, trend: 'down' },
    { title: 'Revenue This Month', value: '$127,450', change: '+8.5%', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, trend: 'up' },
  ]

  const recentShipments = [
    { id: 'SHP-2024-001', customer: 'Acme Corp', route: 'Shanghai → Los Angeles', status: 'In Transit', statusColor: 'bg-blue-100 text-blue-700', etd: 'Mar 15, 2024' },
    { id: 'SHP-2024-002', customer: 'Global Logistics', route: 'Shenzhen → New York', status: 'Customs', statusColor: 'bg-amber-100 text-amber-700', etd: 'Mar 20, 2024' },
    { id: 'SHP-2024-003', customer: 'Tech Imports', route: 'Hong Kong → Seattle', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-700', etd: 'Mar 10, 2024' },
    { id: 'SHP-2024-004', customer: 'Auto Parts Ltd', route: 'Busan → Long Beach', status: 'Loading', statusColor: 'bg-violet-100 text-violet-700', etd: 'Mar 25, 2024' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your operations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                <p className="text-sm text-slate-500">Common tasks and shortcuts</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/customers/new" className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-100 transition-colors mb-3">
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Add Customer</h3>
                <p className="text-sm text-slate-500 mt-1">Create new customer</p>
              </Link>
              <Link href="/shipments/new" className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-100 transition-colors mb-3">
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h16M8 7l4-4m6 4l4 4m-10 3v14"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v4"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">New Shipment</h3>
                <p className="text-sm text-slate-500 mt-1">Book shipment</p>
              </Link>
              <Link href="/invoices/new" className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-100 transition-colors mb-3">
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Create Invoice</h3>
                <p className="text-sm text-slate-500 mt-1">Generate invoice</p>
              </Link>
              <Link href="/quotes/new" className="group p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-100 transition-colors mb-3">
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Create Quote</h3>
                <p className="text-sm text-slate-500 mt-1">Send quotation</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">System Status</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-slate-700">API Services</span>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-slate-700">Database</span>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-slate-700">Message Queue</span>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Running</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-slate-700">Storage</span>
              </div>
              <span className="text-xs text-amber-600 font-medium">72% used</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Shipments</h3>
              <p className="text-sm text-slate-500">Latest shipment activity</p>
            </div>
            <Link href="/shipments" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ETD</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'SHP-2024-001', customer: 'Acme Corp', route: 'Shanghai → Los Angeles', status: 'In Transit', statusColor: 'bg-blue-100 text-blue-700', etd: 'Mar 15, 2024' },
                { id: 'SHP-2024-002', customer: 'Global Logistics', route: 'Shenzhen → New York', status: 'Customs', statusColor: 'bg-amber-100 text-amber-700', etd: 'Mar 20, 2024' },
                { id: 'SHP-2024-003', customer: 'Tech Imports', route: 'Hong Kong → Seattle', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-700', etd: 'Mar 10, 2024' },
                { id: 'SHP-2024-004', customer: 'Auto Parts Ltd', route: 'Busan → Long Beach', status: 'Loading', statusColor: 'bg-violet-100 text-violet-700', etd: 'Mar 25, 2024' },
              ].map((shipment) => (
                <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{shipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{shipment.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{shipment.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${shipment.statusColor}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{shipment.etd}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                    <Link href="#" className="text-blue-600 hover:text-blue-900">Track</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}