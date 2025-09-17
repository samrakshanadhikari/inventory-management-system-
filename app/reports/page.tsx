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

export default async function ReportsPage() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch comprehensive data for reports
  const [
    totalAssets,
    availableAssets,
    checkedOutAssets,
    retiredAssets,
    totalUsers,
    totalVendors,
    totalCheckouts,
    recentCheckouts,
    assetStatusCounts,
    topVendors,
    monthlyCheckouts
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "CHECKED_OUT" } }),
    prisma.asset.count({ where: { status: "RETIRED" } }),
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.checkout.count(),
    prisma.checkout.findMany({
      take: 5,
      orderBy: { checkoutDate: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        asset: { select: { name: true, tag: true } }
      }
    }),
    prisma.asset.groupBy({
      by: ["status"],
      _count: { status: true }
    }),
    prisma.vendor.findMany({
      include: {
        _count: {
          select: { assets: true }
        }
      },
      orderBy: {
        assets: {
          _count: "desc"
        }
      },
      take: 5
    }),
    prisma.checkout.groupBy({
      by: ["checkoutDate"],
      _count: { id: true },
      where: {
        checkoutDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      }
    })
  ]);

  const utilizationRate = totalAssets > 0 ? Math.round((checkedOutAssets / totalAssets) * 100) : 0;
  const returnRate = totalCheckouts > 0 ? Math.round(((totalCheckouts - checkedOutAssets) / totalCheckouts) * 100) : 0;

  return (
    <div className="min-h-screen theme-reports">
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
                  Reports & Analytics
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
            <a href="/vendors" className="nav-link">
              Vendors
            </a>
            <a href="/reports" className="nav-link active">
              Reports
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">💻</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Total Assets</dt>
                    <dd className="text-5xl font-bold text-white">{totalAssets}</dd>
                    <dd className="text-sm text-blue-300 font-semibold">In inventory</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">📊</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Utilization Rate</dt>
                    <dd className="text-5xl font-bold text-white">{utilizationRate}%</dd>
                    <dd className="text-sm text-green-300 font-semibold">Assets in use</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">📋</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Total Checkouts</dt>
                    <dd className="text-5xl font-bold text-white">{totalCheckouts}</dd>
                    <dd className="text-sm text-purple-300 font-semibold">All time</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">🔄</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Return Rate</dt>
                    <dd className="text-5xl font-bold text-white">{returnRate}%</dd>
                    <dd className="text-sm text-yellow-300 font-semibold">Assets returned</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            {/* Asset Status Distribution */}
            <div className="card-premium p-8 hover-lift animate-slideInLeft" style={{animationDelay: '0.5s'}}>
              <h3 className="text-2xl font-bold text-white mb-8">Asset Status Distribution</h3>
              <div className="space-y-6">
                {assetStatusCounts.map((item) => {
                  const percentage = totalAssets > 0 ? Math.round((item._count.status / totalAssets) * 100) : 0;
                  const colors = {
                    AVAILABLE: "bg-gradient-to-r from-green-500 to-green-600",
                    CHECKED_OUT: "bg-gradient-to-r from-blue-500 to-blue-600",
                    RETIRED: "bg-gradient-to-r from-red-500 to-red-600"
                  };
                  const labels = {
                    AVAILABLE: "Available",
                    CHECKED_OUT: "Checked Out",
                    RETIRED: "Retired"
                  };
                  
                  return (
                    <div key={item.status} className="flex items-center justify-between p-4 glass rounded-xl hover-lift">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${colors[item.status as keyof typeof colors]} mr-4 shadow-beautiful`}></div>
                        <span className="text-lg font-semibold text-white">
                          {labels[item.status as keyof typeof labels]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-white">{item._count.status}</span>
                        <span className="text-sm text-white/60 glass px-3 py-1 rounded-full">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-8">
                <div className="progress-bar">
                  {assetStatusCounts.map((item) => {
                    const percentage = totalAssets > 0 ? (item._count.status / totalAssets) * 100 : 0;
                    const colors = {
                      AVAILABLE: "bg-gradient-to-r from-green-500 to-green-600",
                      CHECKED_OUT: "bg-gradient-to-r from-blue-500 to-blue-600",
                      RETIRED: "bg-gradient-to-r from-red-500 to-red-600"
                    };
                    return (
                      <div
                        key={item.status}
                        className={`progress-fill ${colors[item.status as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Vendors */}
            <div className="card-premium p-8 hover-lift animate-slideInRight" style={{animationDelay: '0.6s'}}>
              <h3 className="text-2xl font-bold text-white mb-8">Top Vendors by Asset Count</h3>
              <div className="space-y-4">
                {topVendors.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 glass rounded-xl hover-lift" style={{animationDelay: `${0.7 + index * 0.1}s`}}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-beautiful">
                        <span className="text-white text-lg">🏢</span>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">{vendor.name}</div>
                        <div className="text-sm text-white/60">{vendor.contactEmail || vendor.phone || "No contact info"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{vendor._count.assets}</div>
                      <div className="text-sm text-white/60">Assets</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-premium p-8 hover-lift animate-fadeInScale" style={{animationDelay: '0.8s'}}>
            <h3 className="text-2xl font-bold text-white mb-8">Recent Checkout Activity</h3>
            <div className="space-y-4">
              {recentCheckouts.map((checkout, index) => (
                <div key={checkout.id} className="flex items-center space-x-4 p-5 glass rounded-xl hover-lift" style={{animationDelay: `${0.9 + index * 0.1}s`}}>
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-white truncate">
                      {checkout.user.name || checkout.user.email}
                    </p>
                    <p className="text-white/70 truncate">
                      checked out {checkout.asset.name} ({checkout.asset.tag})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60 glass px-3 py-1 rounded-full">
                      {new Date(checkout.checkoutDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="card-premium p-8 hover-lift animate-fadeInScale" style={{animationDelay: '1s'}}>
            <h3 className="text-2xl font-bold text-white mb-8">Export Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="btn-premium btn-primary hover-glow">
                <span className="mr-2">📊</span>
                Asset Report
              </button>
              <button className="btn-premium btn-secondary hover-glow">
                <span className="mr-2">📋</span>
                Checkout Report
              </button>
              <button className="btn-premium btn-success hover-glow">
                <span className="mr-2">🏢</span>
                Vendor Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
