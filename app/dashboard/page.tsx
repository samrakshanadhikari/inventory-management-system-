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

export default async function Dashboard() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch dashboard data
  const [
    totalAssets,
    availableAssets,
    checkedOutAssets,
    totalUsers,
    recentCheckouts,
    assetStatusCounts
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "CHECKED_OUT" } }),
    prisma.user.count(),
    prisma.checkout.findMany({
      take: 5,
      orderBy: { checkoutDate: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        asset: { select: { tag: true, name: true } }
      }
    }),
    prisma.asset.groupBy({
      by: ["status"],
      _count: { status: true }
    })
  ]);

  const stats = {
    totalAssets,
    availableAssets,
    checkedOutAssets,
    totalUsers,
    utilizationRate: totalAssets > 0 ? Math.round((checkedOutAssets / totalAssets) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <Link href="/dashboard" className="nav-brand">
            InventoryPro
          </Link>
          <ul className="nav-links">
            <li><Link href="/dashboard" className="nav-link active">Dashboard</Link></li>
            <li><Link href="/assets" className="nav-link">Assets</Link></li>
            <li><Link href="/checkouts" className="nav-link">Checkouts</Link></li>
            <li><Link href="/users" className="nav-link">Users</Link></li>
            <li><Link href="/vendors" className="nav-link">Vendors</Link></li>
            <li><Link href="/reports" className="nav-link">Reports</Link></li>
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <span className="badge badge-primary">{session.role}</span>
            <Link href="/api/auth/signout" className="btn btn-ghost">
              Sign Out
            </Link>
          </div>
        </div>
      </nav>

      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="container">
          <div className="animate-slideInDown">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-lg text-gray-600">
              Monitor your inventory performance and system activity
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="container">
          {/* Modern Stats Grid */}
          <div className="stats-grid mb-12">
            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <div className="stat-value">{stats.totalAssets}</div>
              <div className="stat-label">Total Assets</div>
              <div className="stat-change positive">+12% from last month</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="stat-value">{stats.availableAssets}</div>
              <div className="stat-label">Available</div>
              <div className="stat-change positive">Ready for assignment</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <div className="stat-value">{stats.checkedOutAssets}</div>
              <div className="stat-label">Checked Out</div>
              <div className="stat-change positive">In active use</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.4s'}}>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Active Users</div>
              <div className="stat-change positive">System users</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.5s'}}>
              <div className="stat-value">{stats.utilizationRate}%</div>
              <div className="stat-label">Utilization Rate</div>
              <div className="stat-change positive">Asset efficiency</div>
            </div>
          </div>

          {/* Modern Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Asset Status Overview */}
            <div className="card animate-slideInUp" style={{animationDelay: '0.6s'}}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Asset Status Overview</h3>
              <div className="space-y-4">
                {assetStatusCounts.map((item) => {
                  const percentage = totalAssets > 0 ? Math.round((item._count.status / totalAssets) * 100) : 0;
                  const colors = {
                    AVAILABLE: "bg-green-500",
                    CHECKED_OUT: "bg-yellow-500",
                    RETIRED: "bg-red-500"
                  };
                  const labels = {
                    AVAILABLE: "Available",
                    CHECKED_OUT: "Checked Out",
                    RETIRED: "Retired"
                  };
                  
                  return (
                    <div key={item.status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[item.status as keyof typeof colors]}`}></div>
                        <span className="font-semibold text-gray-900">
                          {labels[item.status as keyof typeof labels]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">{item._count.status}</span>
                        <span className="badge badge-secondary">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  {assetStatusCounts.map((item) => {
                    const percentage = totalAssets > 0 ? (item._count.status / totalAssets) * 100 : 0;
                    const colors = {
                      AVAILABLE: "bg-green-500",
                      CHECKED_OUT: "bg-yellow-500",
                      RETIRED: "bg-red-500"
                    };
                    return (
                      <div
                        key={item.status}
                        className={`h-full ${colors[item.status as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card animate-slideInUp" style={{animationDelay: '0.7s'}}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentCheckouts.map((checkout, index) => (
                  <div key={checkout.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-slideInUp" style={{animationDelay: `${0.8 + index * 0.1}s`}}>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {checkout.user.name || checkout.user.email}
                      </p>
                      <p className="text-gray-600 truncate">
                        checked out {checkout.asset.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="badge badge-secondary">
                        {new Date(checkout.checkoutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentCheckouts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card animate-fadeIn" style={{animationDelay: '0.9s'}}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/assets" className="btn btn-primary">
                Manage Assets
              </Link>
              <Link href="/checkouts" className="btn btn-secondary">
                View Checkouts
              </Link>
              <Link href="/users" className="btn btn-outline">
                User Management
              </Link>
              <Link href="/reports" className="btn btn-ghost">
                Generate Reports
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}