"use client";

import { useState, useEffect } from "react";
import { AssetStatus } from "@prisma/client";

interface Vendor {
  id: string;
  name: string;
}

interface Asset {
  id: string;
  tag: string;
  name: string;
  status: AssetStatus;
  vendorId: string | null;
}

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetUpdated: () => void;
  asset: Asset | null;
  vendors: Vendor[];
}

export default function EditAssetModal({ isOpen, onClose, onAssetUpdated, asset, vendors }: EditAssetModalProps) {
  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    status: AssetStatus.AVAILABLE as AssetStatus,
    vendorId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (asset) {
      setFormData({
        tag: asset.tag,
        name: asset.name,
        status: asset.status,
        vendorId: asset.vendorId || ""
      });
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          vendorId: formData.vendorId || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update asset");
      }

      onAssetUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-premium max-w-md w-full p-6 animate-fadeInScale">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Asset</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Asset Tag *</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              className="input-premium focus-ring"
              placeholder="e.g., LT-001"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Asset Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-premium focus-ring"
              placeholder="e.g., Dell Latitude 5440"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-premium focus-ring"
            >
              <option value={AssetStatus.AVAILABLE}>Available</option>
              <option value={AssetStatus.CHECKED_OUT}>Checked Out</option>
              <option value={AssetStatus.RETIRED}>Retired</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Vendor</label>
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              className="input-premium focus-ring"
            >
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-premium btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium btn-primary flex-1 hover-glow"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
