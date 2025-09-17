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

export default async function CheckoutsPage() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch checkouts with related data
  const checkouts = await prisma.checkout.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      asset: {
        select: {
          name: true,
          tag: true,
          status: true
        }
      }
    },
    orderBy: {
      checkoutDate: "desc"
    }
  });

  // Calculate stats
  const activeCheckouts = checkouts.filter(c => !c.returnDate).length;
  const overdueCheckouts = checkouts.filter(c => {
    if (c.returnDate) return false;
    const daysSinceCheckout = Math.floor((Date.now() - c.checkoutDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCheckout > 30; // Assuming 30 days is the limit
  }).length;

  return (
    <div className="min-h-screen theme-checkouts">
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
                  Checkout Management
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
            <a href="/checkouts" className="nav-link active">
              Checkouts
            </a>
            <a href="/users" className="nav-link">
              Users
            </a>
            <a href="/vendors" className="nav-link">
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
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">📋</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Total Checkouts</dt>
                    <dd className="text-5xl font-bold text-white">{checkouts.length}</dd>
                    <dd className="text-sm text-blue-300 font-semibold">All time</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">✅</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Active Checkouts</dt>
                    <dd className="text-5xl font-bold text-white">{activeCheckouts}</dd>
                    <dd className="text-sm text-green-300 font-semibold">Currently out</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="stat-card hover-lift animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-beautiful hover-glow">
                    <span className="text-white text-3xl">⚠️</span>
                  </div>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-white/60 truncate">Overdue</dt>
                    <dd className="text-5xl font-bold text-white">{overdueCheckouts}</dd>
                    <dd className="text-sm text-red-300 font-semibold">Need attention</dd>
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
                  placeholder="Search checkouts..."
                  className="input-premium pl-10 pr-4 py-3 w-64 focus-ring"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/60">🔍</span>
                </div>
              </div>
              <select className="input-premium px-4 py-3 focus-ring">
                <option>All Status</option>
                <option>Active</option>
                <option>Returned</option>
                <option>Overdue</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button className="btn-premium btn-primary hover-glow">
                <span className="mr-2">+</span>
                New Checkout
              </button>
              <button className="btn-premium btn-secondary hover-glow">
                Export
              </button>
            </div>
          </div>

          {/* Checkouts Table */}
          <div className="card-premium overflow-hidden animate-fadeInScale" style={{animationDelay: '0.4s'}}>
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                Checkout History ({checkouts.length})
              </h3>
              <p className="text-white/70 text-sm">
                Complete history of all asset checkouts and returns
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table-premium">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Checkout Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {checkouts.map((checkout, index) => {
                    const isOverdue = !checkout.returnDate && 
                      Math.floor((Date.now() - checkout.checkoutDate.getTime()) / (1000 * 60 * 60 * 24)) > 30;
                    
                    const getStatusBadge = () => {
                      if (checkout.returnDate) {
                        return (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-beautiful bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <span className="mr-1">✅</span>
                            Returned
                          </span>
                        );
                      } else if (isOverdue) {
                        return (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-beautiful bg-gradient-to-r from-red-500 to-red-600 text-white">
                            <span className="mr-1">⚠️</span>
                            Overdue
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-beautiful bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <span className="mr-1">📋</span>
                            Active
                          </span>
                        );
                      }
                    };

                    return (
                      <tr key={checkout.id} className="hover-lift" style={{animationDelay: `${0.5 + index * 0.05}s`}}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-beautiful hover-glow">
                              <span className="text-white text-lg">💻</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {checkout.asset.name}
                              </div>
                              <div className="text-sm text-white/60">
                                {checkout.asset.tag}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-beautiful">
                              <span className="text-white text-sm">👤</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {checkout.user.name || checkout.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {checkout.checkoutDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {checkout.returnDate ? 
                            checkout.returnDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                            <span className="text-white/40">Not returned</span>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {!checkout.returnDate && (
                              <button className="text-green-300 hover:text-green-200 font-medium transition-colors hover-glow">
                                Return
                              </button>
                            )}
                            <button className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover-glow">
                              View
                            </button>
                            <button className="text-red-300 hover:text-red-200 font-medium transition-colors hover-glow">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {checkouts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-white/40 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-white mb-2">No checkouts found</h3>
                <p className="text-white/60 mb-6">Get started by creating your first checkout.</p>
                <button className="btn-premium btn-primary hover-glow">
                  <span className="mr-2">+</span>
                  New Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
