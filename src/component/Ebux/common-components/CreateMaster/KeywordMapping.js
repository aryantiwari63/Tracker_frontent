import React, { useState } from "react";
import { FaSort } from "react-icons/fa";
import { FiEdit3, FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiPlusCircle } from "react-icons/bi";

export default function KeywordMapping() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);

  const data = [
    {
      keyword: "Coca Cola 500ml",
      type: "Brand",
      platform: "Amazon",
      brand: "Coca Cola",
      subBrand: "Coca Cola",
      category: "Beverages",
      subCategory: "Carbonate Drinks",
      status: "Active",
    },
    {
      keyword: "Soft Drink Online",
      type: "Generic",
      platform: "Flipkart",
      brand: "-",
      subBrand: "-",
      category: "Beverages",
      subCategory: "All Soft Drinks",
      status: "Pending",
    },
    {
      keyword: "Buy Pepsi Online",
      type: "Competitors",
      platform: "Flipkart",
      brand: "Pepsi",
      subBrand: "Pepsi",
      category: "Beverages",
      subCategory: "Carbonate Drinks",
      status: "Active",
    },
    {
      keyword: "Cold Drink Delivery",
      type: "Generic",
      platform: "Blinkit",
      brand: "-",
      subBrand: "-",
      category: "Beverages",
      subCategory: "Quick Commerce",
      status: "Active",
    },
    {
      keyword: "Sprite Lemon Drink",
      type: "Competitors",
      platform: "Amazon",
      brand: "Sprite",
      subBrand: "Sprite",
      category: "Beverages",
      subCategory: "Lemon Drink",
      status: "Pending",
    },
  ];

  // Sorting Function
  const sortTable = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key]?.toString().toLowerCase();
    const valueB = b[sortConfig.key]?.toString().toLowerCase();

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const statusClass = (status) =>
    status === "Active"
      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
      : "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm";

  const HeaderCell = ({ label, sortKey }) => (
    <th className="px-4 py-3 font-semibold select-none">
      <div className="flex items-center gap-2">

        {/* Column Label (Not clickable) */}
        <span>{label}</span>

        {/* Sort Icon (Clickable Only) */}
        {sortKey && (
          <FaSort
            className="text-gray-400 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();   // prevent triggering th click
              sortTable(sortKey);
            }}
          />
        )}

      </div>
    </th>
  );


  return (
    <div className="bg-gray-50 mt-2 flex flex-col">
      <main className="flex-1 px-4 bg-white rounded-lg shadow-md py-2">

        {/* HEADER */}
        <div className="flex items-center justify-between px-2 py-3">
          <h1 className="text-xl font-semibold text-gray-800">
            Keyword Configuration
          </h1>

          <div className="flex items-center gap-4">

            {/* 3 Small Icon Buttons */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FiEdit size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FiTrash2 size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FiDownload size={18} />
              </button>
            </div>

            {/* Bulk Upload */}
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              <img
                src="assets/images/file-line-chart.svg"
                alt="icon"
                className="w-5 h-5"
              />
              Bulk Upload
            </button>

            {/* Add Keyword */}
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <BiPlusCircle className="text-white w-5 h-5" />
              Add Keyword
            </button>

          </div>
        </div>

        {/* SEARCH + DROPDOWN */}
        <div className="flex justify-between items-center my-4 px-2">

          {/* Search Bar (Rounded Full) */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search and filter"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ height: 36 }}
            />

            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select
              className="appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm 
               focus:outline-none pr-8"
            >
              <option>All Types</option>
            </select>

            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

        </div>


        {/* TABLE */}
        <div className="bg-white pb-2">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-[#F6F9FB] text-left py-4">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>

                <HeaderCell label="Keyword" sortKey="keyword" />
                <HeaderCell label="Type" sortKey="type" />
                <HeaderCell label="Platform" sortKey="platform" />
                <HeaderCell label="Brand" sortKey="brand" />
                <HeaderCell label="Sub-Brand" sortKey="subBrand" />
                <HeaderCell label="Category" sortKey="category" />
                <HeaderCell label="Sub Category" sortKey="subCategory" />
                <HeaderCell label="Status" sortKey="status" />
                <HeaderCell label="Action" />
              </tr>
            </thead>

            <tbody>
              {sortedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#F6F9FB] border-b last:border-none"
                >
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>

                  <td className="px-4 py-3">{row.keyword}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.platform}</td>
                  <td className="px-4 py-3">{row.brand}</td>
                  <td className="px-4 py-3">{row.subBrand}</td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.subCategory}</td>

                  <td className="px-4 py-3">
                    <span className={statusClass(row.status)}>{row.status}</span>
                  </td>

                  <td className="px-2 py-2 text-gray-600">
                    <div className="flex items-center gap-3">
                      <FiEdit3 className="cursor-pointer hover:text-blue-600 text-xl" />
                      <RiDeleteBin6Line className="cursor-pointer text-red-600 hover:text-red-700 text-xl" />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <div className="bg-white rounded-lg shadow-md flex justify-end mt-4">
        <div className="flex items-center gap-3 py-4 px-2">

          {/* Prev Button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`text-gray-500 ${page === 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          >
            &lt;
          </button>

          {/* Page Numbers */}
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-2 py-1 rounded text-sm ${page === num ? "bg-blue-500 text-white" : "text-gray-800"
                }`}
            >
              {num}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === 5}
            className={`text-gray-500 ${page === 5 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          >
            &gt;
          </button>

        </div>
      </div>

    </div>
  );
}
