'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { Session } from 'next-auth';
import AddUserModal from '../components/AddUserModal';

interface UserWithCounts extends User {
  _count: {
    checkouts: number;
  };
}

interface SessionWithRole {
  user?: {
    email?: string | null;
    name?: string | null;
  };
  role?: string;
  expires: string;
}

interface UsersPageClientProps {
  users: UserWithCounts[];
  session: SessionWithRole;
}

export default function UsersPageClient({ users, session }: UsersPageClientProps) {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === 'ADMIN').length;
  const staffUsers = users.filter(user => user.role === 'STAFF').length;
  const activeUsers = users.filter(user => user._count.checkouts > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <a href="/dashboard" className="nav-brand">
            InventoryPro
          </a>
          <ul className="nav-links">
            <li><a href="/dashboard" className="nav-link">Dashboard</a></li>
            <li><a href="/assets" className="nav-link">Assets</a></li>
            <li><a href="/checkouts" className="nav-link">Checkouts</a></li>
            <li><a href="/users" className="nav-link active">Users</a></li>
            <li><a href="/vendors" className="nav-link">Vendors</a></li>
            <li><a href="/reports" className="nav-link">Reports</a></li>
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {session?.user?.name || session?.user?.email}
            </span>
            <span className="badge badge-primary">{(session as any)?.role}</span>
            <button 
              onClick={() => window.location.href = '/api/auth/signout'}
              className="btn btn-ghost"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="container">
          <div className="flex items-center justify-between animate-slideInDown">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage system users and permissions
              </p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="btn btn-primary"
            >
              Add User
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="container">
          {/* Modern Stats Grid */}
          <div className="stats-grid mb-8">
            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <div className="stat-value">{totalUsers}</div>
              <div className="stat-label">Total Users</div>
              <div className="stat-change positive">Active accounts</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="stat-value">{adminUsers}</div>
              <div className="stat-label">Admin Users</div>
              <div className="stat-change positive">Full access</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.3s'}}>
              <div className="stat-value">{staffUsers}</div>
              <div className="stat-label">Staff Users</div>
              <div className="stat-change positive">Limited access</div>
            </div>

            <div className="stat-card animate-slideInUp" style={{animationDelay: '0.4s'}}>
              <div className="stat-value">{activeUsers}</div>
              <div className="stat-label">Active Users</div>
              <div className="stat-change positive">Currently online</div>
            </div>
          </div>

          {/* Modern Users Table */}
          <div className="card animate-slideInUp" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">All Users</h3>
              <div className="flex items-center gap-4">
                <input
                  type="search"
                  placeholder="Search users..."
                  className="form-input"
                  style={{maxWidth: '300px'}}
                />
                <select className="form-select" style={{maxWidth: '150px'}}>
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Staff</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="animate-slideInUp" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            user.role === 'ADMIN' 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}>
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.name || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-600">{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'ADMIN' 
                            ? 'badge-error' 
                            : 'badge-primary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                      <td className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="btn btn-ghost" style={{padding: '0.5rem'}}>
                            Edit
                          </button>
                          <button className="btn btn-ghost" style={{padding: '0.5rem', color: '#ef4444'}}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first user.</p>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="btn btn-primary"
                >
                  Add User
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
}