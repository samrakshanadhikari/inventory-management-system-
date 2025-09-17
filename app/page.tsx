import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Modern Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <Link href="/" className="nav-brand">
            InventoryPro
          </Link>
          <ul className="nav-links">
            <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link href="/assets" className="nav-link">Assets</Link></li>
            <li><Link href="/checkouts" className="nav-link">Checkouts</Link></li>
            <li><Link href="/users" className="nav-link">Users</Link></li>
            <li><Link href="/vendors" className="nav-link">Vendors</Link></li>
            <li><Link href="/reports" className="nav-link">Reports</Link></li>
          </ul>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <header className="header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container header-content">
          <div className="text-center animate-fadeIn">
            <h1 className="text-5xl font-black mb-6" style={{color: 'white'}}>
              Professional Inventory
              <span className="block" style={{
                background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Management System
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed" style={{color: 'rgba(255,255,255,0.9)'}}>
              Streamline your IT operations with our enterprise-grade inventory management platform. 
              Built with modern technologies and designed for scalability.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/signin" className="btn btn-primary">
                Get Started
              </Link>
              <Link href="/dashboard" className="btn btn-outline" style={{color: 'white', borderColor: 'white'}}>
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16 animate-slideInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your IT assets efficiently and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-interactive animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-primary rounded-xl mb-6 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Asset Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete lifecycle management for all IT assets with real-time status updates, 
                comprehensive tracking, and automated workflows.
              </p>
            </div>

            <div className="card card-interactive animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl mb-6 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based access control and comprehensive user administration with 
                advanced security features and permission management.
              </p>
            </div>

            <div className="card card-interactive animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-gradient-accent rounded-xl mb-6 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time insights and comprehensive reporting for data-driven decisions, 
                business intelligence, and performance optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card animate-scaleIn" style={{animationDelay: '0.1s'}}>
              <div className="stat-value">500+</div>
              <div className="stat-label">Assets Managed</div>
              <div className="stat-change positive">+15% this month</div>
            </div>

            <div className="stat-card animate-scaleIn" style={{animationDelay: '0.2s'}}>
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
              <div className="stat-change positive">Reliable service</div>
            </div>

            <div className="stat-card animate-scaleIn" style={{animationDelay: '0.3s'}}>
              <div className="stat-value">50+</div>
              <div className="stat-label">Active Users</div>
              <div className="stat-change positive">Growing team</div>
            </div>

            <div className="stat-card animate-scaleIn" style={{animationDelay: '0.4s'}}>
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
              <div className="stat-change positive">Always available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="card text-center animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations already using our platform to streamline 
              their inventory management processes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/signin" className="btn btn-primary">
                Start Free Trial
              </Link>
              <Link href="/dashboard" className="btn btn-secondary">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">InventoryPro</h3>
              <p className="text-gray-400">
                Professional inventory management for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InventoryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}