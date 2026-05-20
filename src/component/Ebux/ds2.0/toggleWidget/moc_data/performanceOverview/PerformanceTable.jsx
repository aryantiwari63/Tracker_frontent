import React, { useState, useMemo } from "react";

/**
 * PerformanceTable
 *
 * Props:
 * - darkStoreLocationData: object (expects `.data` array with Region/State/City items)
 */
const PerformanceTable = ({ darkStoreLocationData = { data: [] } }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Normalize the incoming darkStoreLocationData.data into the flat rows the table expects
  const normalizedRows = useMemo(() => {
    const payload = Array.isArray(darkStoreLocationData?.data) ? darkStoreLocationData.data : [];

    return payload.map((item) => {
      // pick pf_data 'All' row if available, otherwise first pf_data entry
      const pfRow =
        Array.isArray(item?.pf_data) && item.pf_data.length > 0
          ? item.pf_data.find((p) => String(p.pf_name).toLowerCase() === "all") ?? item.pf_data[0]
          : null;

      // map fields (safe fallbacks)
      const location = item?.location ?? item?.location_key ?? "Unknown";
      const avgOsa = Number(pfRow?.osa ?? item?.osa ?? 0);
      const wtOsa = Number(pfRow?.pf_overall_ms ?? pfRow?.ms ?? item?.wtOsa ?? 0);
      // avgOfftake isn't present in your pf_data schema — using ms as representative (adjust if you want another field)
      const avgOfftake = Number(pfRow?.ms ?? item?.avgOfftake ?? 0);
      // prev value may not exist in your payload; default to 0
      const prev = Number(item?.prev ?? 0);

      return {
        location,
        avgOsa,
        wtOsa,
        avgOfftake,
        prev,
      };
    });
  }, [darkStoreLocationData]);

  // Sorting logic (works on normalizedRows)
  const sortedData = useMemo(() => {
    const arr = [...normalizedRows];
    if (!sortConfig.key) return arr;
    arr.sort((a, b) => {
      const A = a[sortConfig.key] ?? 0;
      const B = b[sortConfig.key] ?? 0;
      if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
      if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [normalizedRows, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="mt-5 bg-white p-2" style={{ height: '180px', minHeight: '180px', maxHeight: '200px', overflowY: 'auto' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-[10px] font-semibold text-gray-800 leading-tight">Tabular View</h2>
          <div className="flex gap-1 items-center">
            <img
              src="/assets/images/widget/download.png"
              className="w-[12px] h-[12px] cursor-pointer"
              alt="download"
            />
            <img
              src="/assets/images/widget/book.png"
              className="w-[12px] h-[12px] cursor-pointer"
              alt="book"
            />
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="mt-0.5 overflow-x-auto">
        <table className="min-w-full rounded-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-[6px]">
              {[
                { key: "location", label: "Location", align: "text-left" },
                { key: "avgOsa", label: "Avg OSA", align: "text-center" },
                { key: "wtOsa", label: "Wt OSA", align: "text-center" },
                { key: "avgOfftake", label: "Avg Off take", align: "text-center" },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`px-[1px] py-[0.5px] rounded-sm cursor-pointer ${col.align}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex gap-[1px] items-center justify-center md:justify-start">
                    {col.label}
                    <img
                      src="/assets/images/widget/sort.png"
                      className={`w-[4px] h-[4px] transform ${sortConfig.key === col.key && sortConfig.direction === "desc"
                          ? "rotate-180"
                          : ""
                        }`}
                      alt="sort"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-[5px]">
            {sortedData.length > 0 ? (
              sortedData.map((row, idx) => {
                const isIncrease = Number(row.avgOsa) > Number(row.prev || 0);
                const diff = Math.abs(Number(row.avgOsa) - Number(row.prev || 0));
                return (
                  <tr
                    key={row.location + idx}
                    className={`${idx % 2 === 1 ? "bg-gray-50" : ""} h-[14px]`}
                  >
                    {/* Location */}
                    <td className="px-[1px] py-[0.5px] font-medium text-blue-600 underline text-[5px]">
                      {row.location}
                    </td>

                    {/* Columns */}
                    {[row.avgOsa, row.wtOsa, row.avgOfftake].map((val, i) => (
                      <td key={i} className="px-[1px] py-[0.5px] text-center">
                        <div className="flex justify-center gap-[1px] items-center">
                          <span className="text-[5px] font-bold text-gray-800">
                            {Number(val).toFixed(2)}%
                          </span>
                          <span className="text-gray-400 text-[4px]">
                            {row.prev}%
                          </span>
                          <span
                            className={`text-[4px] px-[1px] py-[0px] rounded-[50px] ${isIncrease
                                ? "text-green-500 bg-green-100"
                                : "text-red-500 bg-red-100"
                              }`}
                          >
                            {isIncrease ? "▲" : "▼"} {Number(diff).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-[0.5px] text-gray-500 text-[5px]"
                >
                  No data to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PerformanceTable;
