/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PropertyForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api("/api/categories", { method: "GET" });
        if (res && res.success) {
          setCategories(Array.isArray(res.data) ? res.data : []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
        toast.error("Failed to load property categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ২. ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const propertyData = {
      title: formData.get("title"),
      price: Number(formData.get("price")),
      location: formData.get("location"),
      description: formData.get("description"),
      image: formData.get("image"),
      categoryId: formData.get("categoryId"), // ডাইনামিক ক্যাটাগরি আইডি এখানে পাস হবে
      isAvailable: true,
    };

    try {
      const res = await api("/api/landlord/properties", {
        method: "POST",
        body: JSON.stringify(propertyData),
      });

      if (res && res.success) {
        toast.success("Property created successfully!");
        router.push("/dashboard/landlord");
      } else {
        toast.error(res?.message || "Failed to create property");
      }
    } catch (err) {
      console.error("Error creating property:", err);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-8 my-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Add New Property</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Property Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Modern Luxury Apartment"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Category Dropdown (Dynamic) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Category</label>
          <select
            name="categoryId"
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 bg-white"
          >
            <option value="">{loading ? "Loading categories..." : "Select a category"}</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Monthly Rent ($)</label>
          <input
            type="number"
            name="price"
            required
            placeholder="e.g. 500"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            required
            placeholder="e.g. Dhanmondi, Dhaka"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Image URL</label>
          <input
            type="url"
            name="image"
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="Write details about the property..."
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
        >
          {submitting ? "Creating Property..." : "Publish Property"}
        </button>
      </form>
    </div>
  );
}