import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

interface SessionWithRole {
  user?: {
    email?: string | null;
    name?: string | null;
  };
  role?: string;
}

export default async function VendorsPage() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch vendors with asset counts
  const vendors = await prisma.vendor.findMany({
    include: {
      _count: {
        select: {
          assets: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  // Calculate stats
  const totalVendors = vendors.length;
  const totalAssets = vendors.reduce((sum, vendor) => sum + vendor._count.assets, 0);
  const avgAssetsPerVendor = totalVendors > 0 ? Math.round(totalAssets / totalVendors) : 0;

  return (
    <div className="min-h-screen theme-vendors">
      {/* Header */}
      <header className="nav-premium sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow animate-float">
                <span className="text-white text-3xl font-bold">I</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Vendor Management
                </h1>
                <p className="text-white/70">Welcome back, {session.user?.name || session.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="status-online"></span>
                <span className="text-sm text-white/70 font-medium">System Online</span>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold glass text-white border border-white/20">
                {session.role}
              </span>
              <Link 
                href="/api/auth/signout"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors hover-glow"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-premium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2">
            <a href="/dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/assets" className="nav-link">
              Assets
            </a>
            <a href="/checkouts" className="nav-link">
              Checkouts
            </a>
            <a href="/users" className="nav-link">
              Users
            </a>
            <a href="/vendors" className="nav-link active">
              Vendors
            </a>
            <a href="/reports" className="nav-link">
              Reports
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">🏢</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Total Vendors</dt>
                    <dd className="text-5xl font-bold text-white">{totalVendors}</dd>
                    <dd className="text-sm text-purple-300 font-semibold">Active suppliers</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">📦</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Total Assets</dt>
                    <dd className="text-5xl font-bold text-white">{totalAssets}</dd>
                    <dd className="text-sm text-blue-300 font-semibold">From all vendors</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">📊</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Avg Assets/Vendor</dt>
                    <dd className="text-5xl font-bold text-white">{avgAssetsPerVendor}</dd>
                    <dd className="text-sm text-green-300 font-semibold">Per supplier</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slideInUp">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="input-premium pl-10 pr-4 py-3 w-64 focus-ring"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/60">🔍</span>
                </div>
              </div>
              <select className="input-premium px-4 py-3 focus-ring">
                <option>All Vendors</option>
                <option>Top Suppliers</option>
                <option>New Vendors</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button className="btn-premium btn-primary hover-glow">
                <span className="mr-2">+</span>
                Add Vendor
              </button>
              <button className="btn-premium btn-secondary hover-glow">
                Export
              </button>
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {vendors.map((vendor, index) => (
              <div key={vendor.id} className="card-premium p-6 hover-lift animate-fadeInScale" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-2xl">🏢</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{vendor._count.assets}</div>
                    <div className="text-sm text-white/60">Assets</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{vendor.name}</h3>
                <p className="text-white/70 text-sm mb-4">
                  {vendor.contactEmail || vendor.phone || "No contact information available"}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-white/60">
                    Added {new Date(vendor.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors hover-glow">
                      Edit
                    </button>
                    <button className="text-green-300 hover:text-green-200 text-sm font-medium transition-colors hover-glow">
                      View Assets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vendors Table */}
          <div className="card-premium overflow-hidden animate-fadeInScale" style={{animationDelay: '0.6s'}}>
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                Vendor Details ({vendors.length})
              </h3>
              <p className="text-white/70 text-sm">
                Complete list of all vendors and their asset counts
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table-premium">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Assets Count
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Added Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor, index) => (
                    <tr key={vendor.id} className="hover-lift" style={{animationDelay: `${0.7 + index * 0.05}s`}}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-beautiful hover-glow">
                            <span className="text-white text-lg">🏢</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {vendor.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {vendor.contactEmail || vendor.phone || "No contact info"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-beautiful bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <span className="mr-1">📦</span>
                          {vendor._count.assets} Assets
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {new Date(vendor.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover-glow">
                            Edit
                          </button>
                          <button className="text-green-300 hover:text-green-200 font-medium transition-colors hover-glow">
                            View Assets
                          </button>
                          <button className="text-red-300 hover:text-red-200 font-medium transition-colors hover-glow">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {vendors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-white/40 text-6xl mb-4">🏢</div>
                <h3 className="text-lg font-medium text-white mb-2">No vendors found</h3>
                <p className="text-white/60 mb-6">Get started by adding your first vendor.</p>
                <button className="btn-premium btn-primary hover-glow">
                  <span className="mr-2">+</span>
                  Add Vendor
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
