/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ReviewModal from "./requests/reviewModal";

export default function TenantRequestsClient({ requests }: { requests: any[] }) {
    const [reviewTarget, setReviewTarget] = useState<{ propertyId: string; title: string } | null>(null);
    
    const [reviewedIds, setReviewedIds] = useState<string[]>([]);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6">
            {requests.length === 0 ? (
                <p className="text-gray-500 text-xs text-center py-8">No rental requests found.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((req: any) => {
                        const propertyId = req?.property?.id || req?.propertyId;
                        const isAlreadyReviewed = reviewedIds.includes(propertyId);

                        return (
                            <div key={req.id || req._id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-800">{req?.property?.title || "Property Rental"}</h4>
                                    <p className="text-xs text-gray-500">Location: {req?.property?.location}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${req.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                        req.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                req.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'COMPLETED' ? 'bg-gray-200 text-gray-700' :
                                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {req.status}
                                    </span>

                                    {req.status === 'APPROVED' && (
                                        <a
                                            href={`/dashboard/tenant/requests/${req.id || req._id}/pay`}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
                                        >
                                            Pay Now
                                        </a>
                                    )}

                                    {(req.status === 'ACTIVE' || req.status === 'COMPLETED') && propertyId && !isAlreadyReviewed && (
                                        <button
                                            onClick={() =>
                                                setReviewTarget({
                                                    propertyId,
                                                    title: req?.property?.title || "this property",
                                                })
                                            }
                                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition"
                                        >
                                            Leave Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {reviewTarget && (
                <ReviewModal
                    propertyId={reviewTarget.propertyId}
                    onClose={() => {
                       
                        if (reviewTarget) {
                            setReviewedIds((prev) => [...prev, reviewTarget.propertyId]);
                        }
                        setReviewTarget(null);
                    }}
                />
            )}
        </div>
    );
}