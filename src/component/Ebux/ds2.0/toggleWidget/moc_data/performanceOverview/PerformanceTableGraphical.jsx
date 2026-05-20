import React, { useState, useMemo } from "react";

// Dummy data with separate prev values for each metric
const initialData = [
  {
    product: "Coca Cola 1L",
    avgOsa: 85,
    prevAvgOsa: 70,
    wtOsa: 80,
    prevWtOsa: 75,
    avgOffTake: 5,
    prevAvgOffTake: 3,
  },
  {
    product: "Pepsi 500ml",
    avgOsa: 70,
    prevAvgOsa: 75,
    wtOsa: 65,
    prevWtOsa: 68,
    avgOffTake: 5,
    prevAvgOffTake: 6,
  },
  {
    product: "Nestle KitKat",
    avgOsa: 92,
    prevAvgOsa: 90,
    wtOsa: 95,
    prevWtOsa: 92,
    avgOffTake: -3,
    prevAvgOffTake: -1,
  },
  {
    product: "Amul Butter 500g",
    avgOsa: 60,
    prevAvgOsa: 65,
    wtOsa: 55,
    prevWtOsa: 60,
    avgOffTake: 5,
    prevAvgOffTake: 4,
  },
  {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  },
  {
    product: "Red Bull Energy",
    avgOsa: 88,
    prevAvgOsa: 85,
    wtOsa: 85,
    prevWtOsa: 83,
    avgOffTake: 3,
    prevAvgOffTake: 2,
  },
];

const PerformanceTableGraphical = () => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [filter, setFilter] = useState("All");

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortable = [...initialData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filter === "All"
      ? sortable
      : sortable.filter((item) => item.product === filter);
  }, [sortConfig, filter]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Column config with key + prevKey for ▲▼ calc
  const columns = [
    { key: "product", label: "Product", align: "text-left" },
    { key: "avgOsa", prevKey: "prevAvgOsa", label: "Avg OSA", align: "text-center" },
    { key: "wtOsa", prevKey: "prevWtOsa", label: "Wt OSA", align: "text-center" },
    { key: "avgOffTake", prevKey: "prevAvgOffTake", label: "Avg Off take", align: "text-center" },
  ];

  return (
    <div className="mt-2 bg-white shadow-md rounded-xl p-2 mb-2 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-[10px] font-semibold text-gray-800 leading-snug">
              OSA Movers and Shakers
            </h2>
            <p className="text-[8px] text-gray-500 leading-none">23/07/25 → 23/07/25</p>
          </div>

          {/* Dropdown */}
          <div className="mt-1 md:mt-0">
            <div className="relative">
            <select
              className="appearance-none pr-8 border border-gray-300 rounded-sm px-0.5 py-0.25 text-[6px] text-gray-700 h-4 w-10 focus:ring focus:ring-blue-200"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              {initialData.map((row) => (
                <option key={row.product} value={row.product}>
                  {row.product}
                </option>
              ))}
            </select>

            </div>
          </div>



        </div>
      </div>

      {/* Table */}
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full rounded-sm text-[7px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-[7px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-0.5 py-0.5 cursor-pointer ${col.align}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex gap-0.25 items-center justify-center md:justify-start">
                    {col.label}
                    <img
                      src="/assets/images/widget/sort.png"
                      className={`w-[5px] transform ${sortConfig.key === col.key &&
                        sortConfig.direction === "desc"
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
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={row.product}
                className={idx % 2 === 1 ? "bg-gray-50" : ""}
              >
                {columns.map((col, i) => {
                  if (col.key === "product") {
                    return (
                      <td key={i} className="px-0.5 py-0.5 font-medium">
                        {row[col.key]}
                      </td>
                    );
                  }

                  const value = row[col.key];
                  const prevValue = row[col.prevKey];
                  const isIncrease = value > prevValue;
                  const diff = Math.abs(value - prevValue);

                  return (
                    <td key={i} className="px-0.5 py-0.5 text-center">
                      <div className="flex justify-center gap-0.25 items-center">
                        <span className="text-[7px] font-bold text-gray-800">{value}%</span>
                        <span className="text-gray-400 text-[5px]">{prevValue}%</span>
                        <span
                          className={`text-[5px] px-[1px] py-[0.25px] rounded-[50px] ${isIncrease
                            ? "text-green-500 bg-green-100"
                            : "text-red-500 bg-red-100"
                            }`}
                        >
                          {isIncrease ? "▲" : "▼"} {diff}%
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PerformanceTableGraphical;
