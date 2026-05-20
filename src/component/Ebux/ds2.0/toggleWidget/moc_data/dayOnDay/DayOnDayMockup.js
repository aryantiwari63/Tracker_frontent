import React from "react";

export default function DayOnDayMockup() {
    const dummyData = [
        {
            platform: "Zepto",
            logo: "https://i.imgur.com/Hz8VQ5I.png",
            reviewRating: "82%",
            priorityFlag: "High",
            isBrandSKU: "Yes",
            segment: "Grocery",
            category: "Beverages",
            subBrand: "Diet Cola",
            cpCode: "CP-1023",
            date: '22/11/2025'

        },
        {
            platform: "Bigbasket",
            logo: "https://i.imgur.com/FsugO7G.png",
            reviewRating: "75%",
            priorityFlag: "Medium",
            isBrandSKU: "No",
            segment: "Food",
            category: "Snacks",
            subBrand: "Chips Max",
            cpCode: "CP-2451",
            date: '23/11/2025'
        },
        {
            platform: "Blinkit",
            logo: "https://i.imgur.com/m7Y5s8e.png",
            reviewRating: "90%",
            priorityFlag: "Low",
            isBrandSKU: "Yes",
            segment: "Household",
            category: "Detergents",
            subBrand: "Sparkle",
            cpCode: "CP-9801",
            date: '24/11/2025'

        }
    ];

    return (
        <div className="w-full">
            {/* Header with title and actions */}
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-semibold">Daily Performance</h5>
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
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <img src="/assets/images/columnsIcon.svg" className="w-4 h-4" alt="Customize" />
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
                            {/* Platform Column with Checkbox */}
                            <th className="px-2 py-2 text-left">
                                <div className="flex items-center gap-2">
                                    <span>Date</span>
                                </div>
                            </th>

                            {/* Metric Columns */}
                            <th className="px-2 py-2 text-left">Platform</th>

                        </tr>
                    </thead>

                    <tbody>
                        {dummyData.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                {/* Platform Cell */}
                                <td className="px-2 py-2 text-left">
                                    <div className="flex items-left gap-1">
                                        <span className="font-medium">{row.date}</span>
                                    </div>
                                </td>
                                <td className="px-2 py-2">
                                    <div className="flex items-left gap-2">
                                        <img src={row.logo} alt="" className="w-5 h-5 object-contain" />
                                        <span className="font-medium">{row.platform}</span>
                                    </div>
                                </td>


                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>
        </div>
    );
}