"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("admin");
  const [role, setRole] = useState("ADMIN");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", { 
        email, 
        role, 
        callbackUrl: "/dashboard",
        redirect: false 
      });
      
      if (result?.ok) {
        router.push("/dashboard");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center animate-slideInUp">
            <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-2xl hover:shadow-white/20 transition-all duration-300 animate-float">
              <span className="text-white text-3xl font-bold">📦</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3" style={{
              background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome Back
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Sign in to access your inventory dashboard
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 animate-fadeInScale" style={{animationDelay: '0.2s'}}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-white/90">
                  Email or Username
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                  placeholder="Type: admin, staff, or full email"
                />
                <p className="text-xs text-white/60">
                  Try: admin, staff, admin@example.com, or staff1@example.com
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-semibold text-white/90">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                >
                  <option value="ADMIN" className="bg-gray-800 text-white">Admin</option>
                  <option value="STAFF" className="bg-gray-800 text-white">Staff</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-sm text-white/70 mb-4 font-semibold">🎯 Demo Accounts</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slideInLeft" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">👑</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Admin</p>
                      <p className="text-white/70 text-sm">admin@example.com</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEmail("admin");
                      setRole("ADMIN");
                    }}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all duration-300"
                  >
                    Use
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slideInRight" style={{animationDelay: '0.5s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">👤</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Staff</p>
                      <p className="text-white/70 text-sm">staff1@example.com</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEmail("staff");
                      setRole("STAFF");
                    }}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all duration-300"
                  >
                    Use
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home & Setup */}
          <div className="text-center animate-fadeInScale" style={{animationDelay: '0.6s'}}>
            <div className="space-y-2">
              <Link
                href="/"
                className="inline-flex items-center text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:underline"
              >
                ← Back to Home
              </Link>
              <div>
                <Link
                  href="/setup"
                  className="inline-flex items-center text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:underline"
                >
                  🔧 Database Setup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}