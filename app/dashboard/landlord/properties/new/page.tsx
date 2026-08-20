/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useTransition } from "react";
import { api } from "@/lib/api";
import { createPropertyAction } from "../_actions/propertyActions";
import { toast } from "sonner";

export default function NewPropertyPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api("/api/categories", { method: "GET" });
        if (res) {
          setCategories(Array.isArray(res) ? res : res.data || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createPropertyAction(null, formData);
      if (result && !result.success) {
        toast.error(result.message);
      } else {
        toast.success("Property created successfully!");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Rental Property</h1>
          <p className="text-gray-500 text-xs mt-1">
            Select a category from the list and fill in the property details.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Property Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Modern Luxury Apartment"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name || cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Monthly Price (BDT)
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                placeholder="1200"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Location / Address
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. 123 Main Street"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Describe the property..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-md"
            >
              {isPending ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}