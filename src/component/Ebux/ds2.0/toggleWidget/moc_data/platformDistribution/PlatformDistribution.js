import React from "react";

export default function PlatformDistributionMockup() {
    const dummyData = [
        {
            platform: "Zepto",
            logo: "https://i.imgur.com/Hz8VQ5I.png",
            brand: "Coca-Cola",
            category: "Beverages",
            platformId: "PLAT-001",
            platformName: "Zepto Express",
            status: "Active"
        },
        {
            platform: "Bigbasket",
            logo: "https://i.imgur.com/FsugO7G.png",
            brand: "PepsiCo",
            category: "Snacks",
            platformId: "PLAT-002",
            platformName: "Bigbasket Premium",
            status: "Inactive"
        },
        {
            platform: "Blinkit",
            logo: "https://i.imgur.com/m7Y5s8e.png",
            brand: "Unilever",
            category: "Household",
            platformId: "PLAT-003",
            platformName: "Blinkit Hyper",
            status: "Active"
        },
        {
            platform: "Amazon",
            logo: "https://i.imgur.com/m7Y5s8e.png",
            brand: "Apple",
            category: "Electronics",
            platformId: "PLAT-004",
            platformName: "Amazon India",
            status: "Pending"
        },
        {
            platform: "Flipkart",
            logo: "https://i.imgur.com/m7Y5s8e.png",
            brand: "Samsung",
            category: "Mobile Phones",
            platformId: "PLAT-005",
            platformName: "Flipkart Plus",
            status: "Active"
        }
    ];

    return (
        <div className="w-full">
            {/* Header with title and actions */}
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-semibold">Platform Distribution</h5>
                <div className="flex items-center gap-2">
                    {/* Filter Button */}
                    <button className="text-xs border rounded px-2 py-1 hover:bg-gray-50">
                        Filter By
                    </button>
                    {/* Action Buttons */}
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <img src="/assets/images/downloadIcon.svg" className="w-4 h-4" alt="Download" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Range */}
            <p className="text-[10px] text-gray-500 mb-2 italic">
                {new Date().toLocaleDateString()} → {new Date().toLocaleDateString()}
            </p>

            {/* Table */}
            <div className="border rounded bg-white text-xs overflow-x-auto max-w-full">
                <table className="min-w-[800px] w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            {/* Platform Column */}
                            <th className="px-2 py-2 text-left border-r sticky left-0 bg-gray-50 z-10">
                                <div className="flex items-center gap-2">
                                    <span>Platform</span>
                                </div>
                            </th>

                            {/* Brand Column */}
                            <th className="px-2 py-2 text-left">
                                <div className="flex items-center gap-2">
                                    <span>Brand</span>
                                </div>
                            </th>
                            {/* Category Column */}
                            <th className="px-2 py-2 text-left">
                                <div className="flex items-center gap-2">
                                    <span>Category</span>
                                </div>
                            </th>


                        </tr>
                    </thead>

                    <tbody>
                        {dummyData.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                {/* Platform Cell - Sticky */}
                                <td className="px-2 py-2 text-left border-r sticky left-0 bg-white z-10">
                                    <div className="flex items-center gap-2">
                                        <img src={row.logo} alt={row.platform} className="w-5 h-5 object-contain rounded" />
                                        <span className="font-medium">{row.platform}</span>
                                    </div>
                                </td>

                                {/* Brand Cell */}
                                <td className="px-2 py-2 text-left">
                                    <span>{row.brand}</span>
                                </td>

                                {/* Category Cell */}
                                <td className="px-2 py-2 text-left">
                                    <span>{row.category}</span>
                                </td>
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}