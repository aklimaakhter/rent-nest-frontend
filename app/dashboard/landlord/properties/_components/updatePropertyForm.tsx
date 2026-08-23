/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { updatePropertyAction } from "../_actions/propertyActions";
import { toast } from "sonner";

export default function UpdatePropertyForm() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!propertyId) return;

    const fetchData = async () => {
      try {
        // ১. সঠিক ল্যান্ডলর্ড প্রপার্টি ফেচ রুট
        const propRes = await fetch(`http://localhost:5000/api/landlord/properties/${propertyId}`, {
          method: "GET",
          credentials: "include",
        });
        const propData = await propRes.json();
        setProperty(propData?.data || propData?.property || propData);

        // ২. ক্যাটাগরি ফেচ রুট
        const catRes = await fetch("http://localhost:5000/api/categories", {
          method: "GET",
        });
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : catData?.data || []);
      } catch (err) {
        console.error("Failed to load data", err);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId]);

  const updateActionWithId = updatePropertyAction.bind(null, propertyId);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateActionWithId(null, formData);
      if (result && !result.success) {
        toast.error(result.message);
      } else {
        toast.success("Property updated successfully!");
      }
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-xs">Loading property data...</div>;
  }

  if (!property) {
    return <div className="text-center py-12 text-red-500 text-xs">Property not found!</div>;
  }

  const selectedCategoryId = 
    property?.categoryId || 
    property?.category?._id || 
    property?.category?.id || 
    property?.category || 
    "";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <form action={handleSubmit} className="space-y-4">
        
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Property Title</label>
          <input
            type="text"
            name="title"
            defaultValue={property?.title || ""}
            required
            placeholder="e.g. Modern Luxury Apartment"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Category</label>
            <select
              name="categoryId"
              defaultValue={selectedCategoryId}
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

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Monthly Price (BDT)</label>
            <input
              type="number"
              name="price"
              defaultValue={property?.price || ""}
              required
              min="0"
              placeholder=" "
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Location / Address</label>
          <input
            type="text"
            name="location"
            defaultValue={property?.location || ""}
            required
            placeholder="e.g. 123 Main Street"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Image URL</label>
          <input
            type="url"
            name="image"
            defaultValue={property?.image || ""}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            defaultValue={property?.description || ""}
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
            {isPending ? "Updating..." : "Update Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}