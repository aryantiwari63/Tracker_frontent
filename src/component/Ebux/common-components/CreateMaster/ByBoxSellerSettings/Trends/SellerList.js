import React, { useEffect, useState } from "react";
import { fetchSellerList, fetchComprehensiveBreakdownTable } from "../../../../services/ebuxMaster.service";
import { useEbuxContext } from "../../../../Context/EbuxProvider";

export default function SellerList() {
  const { selectedFilters, filters } = useEbuxContext();
  const [sellerData, setSellerData] = useState([]);
  const [sortOrder, setSortOrder] = useState("high"); // default highest → lowest

  useEffect(() => {
    async function fetchData() {
      let currentData = await fetchSellerList(
        filters,
        selectedFilters,
        selectedFilters.selectedPlatform
      );

      let fetchComprehensive = await fetchComprehensiveBreakdownTable(
        filters,
        selectedFilters,
        selectedFilters.selectedPlatform
      );

      console.log('fetchComprehensiveBreakdownTable', fetchComprehensive)

      if (Array.isArray(currentData)) {
        setSellerData(currentData);
      }
    }

    fetchData();
  }, [selectedFilters, filters]);

  // 🔥 Sort logic here
  const sortedData = [...sellerData].sort((a, b) => {
    if (sortOrder === "low") {
      return a.percentage_raw - b.percentage_raw; // lowest → highest
    }
    return b.percentage_raw - a.percentage_raw; // highest → lowest
  });

  function formatPercentage(value) {
    const num = parseFloat(value);

    if (num >= 10) {
      return `${num.toFixed(1)}%`;
    } else {
      return `${value}%`;
    }
  }
  return (
    <div className="px-4 w-[60%] flex-[0_0_auto]">
      <div className="card border h-[344px] flex flex-col rounded-xl">
        <div className="flex items-center justify-between mb-3 border-b py-2 px-3">
          <h3 className="text-[20px] font-medium text-[#000000]">
            Top Competitors <span className="font-bold text-[#0081F7]">({sortedData?.length ?? 0})</span>
          </h3>

          {/* 🔥 Sort Dropdown */}
          <select
            className="border rounded text-[12px] text-[#000000] bg-white px-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="high">Sort: High to Low</option>
            <option value="low">Sort: Low to High</option>
          </select>
        </div>

        <div className="p-4 overflow-y-scroll">
          {sortedData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No Data Found</p>
          ) : (
            sortedData.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex gap-4 justify-between items-center">
                  <p className="mb-0 text-[14px] font-medium">
                    {item?.seller_name ?? ""}
                  </p>
                  <p className="mb-0 text-[14px] font-medium">
                    {formatPercentage(item?.percentage_raw ?? 0)}
                  </p>
                </div>

                <div className="mt-3 h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-3 rounded-full bg-[#0081F733]">
                    <div
                      className="h-full rounded-full bg-[#0081F7] transition-all"
                      style={{ width: `${item?.percentage_raw ?? 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
