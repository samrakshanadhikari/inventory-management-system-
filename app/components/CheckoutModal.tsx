"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Asset {
  id: string;
  tag: string;
  name: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutComplete: () => void;
  asset: Asset | null;
  users: User[];
}

export default function CheckoutModal({ isOpen, onClose, onCheckoutComplete, asset, users }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    userId: "",
    dueDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: asset.id,
          userId: formData.userId,
          dueDate: formData.dueDate || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to checkout asset");
      }

      // Reset form and close modal
      setFormData({
        userId: "",
        dueDate: ""
      });
      onCheckoutComplete();
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
          <h2 className="text-2xl font-bold text-gray-900">Checkout Asset</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 glass rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Asset Details</h3>
          <p className="text-white/80"><strong>Tag:</strong> {asset.tag}</p>
          <p className="text-white/80"><strong>Name:</strong> {asset.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Assign to User *</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="input-premium focus-ring"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || 'Unknown User'} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date (Optional)</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-premium focus-ring"
              min={new Date().toISOString().split('T')[0]}
            />
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
              {isLoading ? "Processing..." : "Checkout Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
