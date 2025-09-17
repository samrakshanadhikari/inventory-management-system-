"use client";

import { useState } from "react";
import { AssetStatus } from "@prisma/client";
import AddAssetModal from "../components/AddAssetModal";
import EditAssetModal from "../components/EditAssetModal";
import CheckoutModal from "../components/CheckoutModal";

interface Vendor {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Asset {
  id: string;
  tag: string;
  name: string;
  status: AssetStatus;
  vendorId: string | null;
  vendor: {
    name: string;
  } | null;
  checkouts: Array<{
    user: {
      name: string | null;
      email: string;
    };
  }>;
  createdAt: Date | string;
}

interface AssetsPageClientProps {
  initialAssets: Asset[];
  vendors: Vendor[];
  users: User[];
  session: {
    user?: {
      email?: string | null;
      name?: string | null;
    };
    role?: string;
  };
}

export default function AssetsPageClient({ initialAssets, vendors, users, session }: AssetsPageClientProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssetAdded = async () => {
    // Refresh assets from server
    const response = await fetch("/api/assets");
    if (response.ok) {
      const updatedAssets = await response.json();
      setAssets(updatedAssets);
    }
  };

  const handleAssetUpdated = async () => {
    // Refresh assets from server
    const response = await fetch("/api/assets");
    if (response.ok) {
      const updatedAssets = await response.json();
      setAssets(updatedAssets);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete asset");
        return;
      }

      // Remove asset from local state
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    } catch (error) {
      alert("An error occurred while deleting the asset");
    }
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowEditModal(true);
  };

  const handleCheckoutAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowCheckoutModal(true);
  };

  const handleReturnAsset = async (assetId: string) => {
    try {
      // Find the active checkout for this asset
      const response = await fetch("/api/checkouts");
      if (!response.ok) return;
      
      const checkouts = await response.json();
      const activeCheckout = checkouts.find((checkout: { assetId: string; returnDate: string | null }) => 
        checkout.assetId === assetId && !checkout.returnDate
      );

      if (!activeCheckout) {
        alert("No active checkout found for this asset");
        return;
      }

      const returnResponse = await fetch(`/api/checkouts/${activeCheckout.id}/return`, {
        method: "POST",
      });

      if (!returnResponse.ok) {
        const errorData = await returnResponse.json();
        alert(errorData.error || "Failed to return asset");
        return;
      }

      // Refresh assets
      handleAssetUpdated();
    } catch (error) {
      alert("An error occurred while returning the asset");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case AssetStatus.AVAILABLE:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-beautiful">
            Available
          </span>
        );
      case AssetStatus.CHECKED_OUT:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-beautiful">
            Checked Out
          </span>
        );
      case AssetStatus.RETIRED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-beautiful">
            Retired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen theme-assets">
      {/* Header */}
      <header className="nav-premium sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="icon-container w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl shadow-beautiful hover-glow icon-float">
                <svg className="w-8 h-8 text-white icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Asset Management</h1>
                <p className="text-white/70">Track and manage your IT assets</p>
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
              <button 
                onClick={() => window.location.href = '/api/auth/signout'}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors hover-glow"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-premium border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/assets" className="nav-link active">
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
            <a href="/reports" className="nav-link">
              Reports
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Action Bar */}
          <div className="mb-8 animate-slideInUp">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-premium focus-ring pl-10 w-64"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-premium focus-ring"
                >
                  <option value="">All Statuses</option>
                  <option value={AssetStatus.AVAILABLE}>Available</option>
                  <option value={AssetStatus.CHECKED_OUT}>Checked Out</option>
                  <option value={AssetStatus.RETIRED}>Retired</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-premium btn-primary hover-glow"
                >
                  <span className="mr-2">+</span>
                  Add Asset
                </button>
                <button className="btn-premium btn-secondary hover-glow">
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Assets Table */}
          <div className="card-premium overflow-hidden animate-fadeInScale">
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">Assets ({filteredAssets.length})</h3>
              <p className="text-white/70">Manage your inventory assets</p>
            </div>
            
            {filteredAssets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th className="text-gray-700">Tag</th>
                      <th className="text-gray-700">Name</th>
                      <th className="text-gray-700">Status</th>
                      <th className="text-gray-700">Vendor</th>
                      <th className="text-gray-700">Assigned To</th>
                      <th className="text-gray-700">Date Added</th>
                      <th className="text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset, index) => (
                      <tr key={asset.id} className="hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
                        <td className="text-gray-900 font-medium">{asset.tag}</td>
                        <td className="text-gray-900">{asset.name}</td>
                        <td>{getStatusBadge(asset.status)}</td>
                        <td>
                          {asset.vendor ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-beautiful">
                                <span className="text-white text-xs font-bold">
                                  {asset.vendor.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-gray-900 font-medium">{asset.vendor.name}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">No vendor</span>
                          )}
                        </td>
                        <td>
                          {asset.checkouts.length > 0 ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-beautiful">
                                <span className="text-white text-xs font-bold">
                                  {asset.checkouts[0].user.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="text-gray-900 font-medium">{asset.checkouts[0].user.name || 'Unknown User'}</div>
                                <div className="text-gray-500 text-xs">{asset.checkouts[0].user.email}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Unassigned</span>
                          )}
                        </td>
                        <td className="text-gray-600">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAsset(asset)}
                              className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover-glow"
                            >
                              Edit
                            </button>
                            {asset.status === AssetStatus.AVAILABLE ? (
                              <button
                                onClick={() => handleCheckoutAsset(asset)}
                                className="text-green-300 hover:text-green-200 font-medium transition-colors hover-glow"
                              >
                                Checkout
                              </button>
                            ) : asset.status === AssetStatus.CHECKED_OUT ? (
                              <button
                                onClick={() => handleReturnAsset(asset.id)}
                                className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors hover-glow"
                              >
                                Return
                              </button>
                            ) : null}
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="text-red-300 hover:text-red-200 font-medium transition-colors hover-glow"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-white/40 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-white mb-2">No assets found</h3>
                <p className="text-white/60 mb-6">Get started by adding your first asset to the inventory.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-premium btn-primary hover-glow"
                >
                  <span className="mr-2">+</span>
                  Add Asset
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAssetAdded={handleAssetAdded}
        vendors={vendors}
      />

      <EditAssetModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onAssetUpdated={handleAssetUpdated}
        asset={selectedAsset}
        vendors={vendors}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onCheckoutComplete={handleAssetUpdated}
        asset={selectedAsset}
        users={users}
      />
    </div>
  );
}
