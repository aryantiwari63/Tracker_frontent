// KeywordConfiguration.jsx
import React, { useState, useMemo } from "react";
import { FaSort } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { LuSlidersHorizontal } from "react-icons/lu";

function MetricCard({ icon, title, value, active }) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg shadow-sm ${active ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-100 bg-white"}`}>
      <div className="w-[60px] h-[60px] flex items-center justify-center rounded-md border border-gray-200 bg-[#FAFAFA] shrink-0">
        {icon ? <img src={icon} className="w-[26.93px] h-[24px]" alt="" /> : null}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-inter font-medium text-[14px] leading-[100%] tracking-[0px]">{title}</div>
          </div>
        </div>
        <div className="mt-4 flex">
          <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[0]">{value} </div>
        </div>

      </div>
    </div>
  );
}

const HeaderCell = ({ label, sortKey, activeSort, onSort }) => (
  <th className="px-4 py-1 font-semibold select-none">
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {sortKey && (
        <FaSort
          className={`cursor-pointer ${activeSort?.key === sortKey
            ? "text-gray-400"
            : "text-gray-400"
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onSort(sortKey);
          }}
        />
      )}
    </div>
  </th>
);

function DataTable({ data, sortConfig, onSort }) {

  // Extract unique values for dropdowns from the data
  const uniqueBrands = useMemo(() => [...new Set(data.map(item => item.brand).filter(Boolean))], [data]);
  const uniqueSubBrands = useMemo(() => [...new Set(data.map(item => item.subBrand).filter(Boolean))], [data]);
  const uniqueCategories = useMemo(() => [...new Set(data.map(item => item.category).filter(Boolean))], [data]);
  const uniqueSubCategories = useMemo(() => [...new Set(data.map(item => item.subCategory).filter(Boolean))], [data]);

  return (
    <div className="bg-white px-4 pb-2 max-h-[400px] overflow-y-scroll">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-[#F6F9FB] text-left sticky top-0 z-10">
          <tr className="">
            <th className="px-4 py-2 w-10 rounded-tl-lg mt-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <HeaderCell label="Platform" sortKey="platform" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="SKU Id" sortKey="skuid" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Product Name" sortKey="productname" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Brand" sortKey="brand" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Sub-Brand" sortKey="subBrand" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Category" sortKey="category" activeSort={sortConfig} onSort={onSort} />
            <th className="px-4 py-1 font-semibold select-none rounded-tr-lg">
              <div className="flex items-center gap-2">
                <span>Sub Category</span>
                <FaSort
                  className={`cursor-pointer ${sortConfig?.key === "subCategory"
                    ? "text-blue-500"
                    : "text-gray-400"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSort("subCategory");
                  }}
                />
              </div>
            </th>
          </tr>
          <tr>
            <th className="pb-2"></th>
            <th className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Platform..."
                  className="w-[75%] pl-8 pr-2 py-1  rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search SKU Id..."
                  className="w-[75%] pl-8 pr-2 py-1  rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="w-[75%] pl-8 pr-2 py-1 rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Brand..."
                  className="w-[75%] pl-8 pr-2 py-1  rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Sub-Brand..."
                  className="w-[75%] pl-8 pr-2 py-1 rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Category..."
                  className="w-[75%] pl-8 pr-2 py-1 text-sm rounded-lg border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
            <th className="rounded-br-lg pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Sub Category..."
                  className="w-[75%] pl-8 pr-2 py-1 rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-black placeholder-gray-500"
                />
                <svg className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#F6F9FB] border-b last:border-none">
              <td className="px-4 py-3 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <img
                    src={`/assets/images/blinkitFavicon.ico`}
                    alt={row.platform}
                    className="w-5 h-5"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {row.platform}
                </div>
              </td>
              <td className="px-4 py-3">{row.skuid}</td>
              <td className="px-4 py-3">{row.productname}</td>

              {/* Brand Dropdown */}
              <td className="py-3">
                <div className="flex justify-start">
                  <select
                    className="w-[75%] px-2 py-1  rounded-lg text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    defaultValue={row.brand || ""}
                  >
                    <option value="">Select Brand</option>
                    {uniqueBrands.map((brand, index) => (
                      <option key={index} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </td>

              {/* Sub-Brand Dropdown */}
              <td className="py-3">
                <select
                  className="w-[75%] px-2 py-1 text-sm  rounded-lg border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  defaultValue={row.subBrand || ""}
                >
                  <option value="">Select Sub-Brand</option>
                  {uniqueSubBrands.map((subBrand, index) => (
                    <option key={index} value={subBrand}>{subBrand}</option>
                  ))}
                </select>
              </td>

              {/* Category Dropdown */}
              <td className="py-3">
                <select
                  className="w-[75%] px-2 py-1 text-sm rounded-lg border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  defaultValue={row.category || ""}
                >
                  <option value="">Select Category</option>
                  {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </td>

              {/* Sub Category Dropdown */}
              <td className="py-3">
                <select
                  className="w-[75%] px-2 py-1 text-sm  rounded-lg border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  defaultValue={row.subCategory || ""}
                >
                  <option value="">Select Sub Category</option>
                  {uniqueSubCategories.map((subCategory, index) => (
                    <option key={index} value={subCategory}>{subCategory}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductSkuMapping() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);

  const sellerCards = [
    { id: 1, title: "Total SKU", icon: "/assets/images/Totalsku.svg", value: "234" },
    { id: 2, title: "Mapped SKUs", icon: "/assets/images/Mappedsku.svg", value: "156" },
    { id: 3, title: "Pending Mapping", icon: "/assets/images/pendingsku.svg", value: "610" },
    { id: 4, title: "Competitors", icon: "/assets/images/competitors.svg", value: "710" },
    { id: 5, title: "Platforms", icon: "/assets/images/platform.svg", value: "310" },
  ];

  const tableData = [
    { platform: "Amazon", skuid: "SKU001", productname: "Coca Cola 330ml", brand: "Coca Cola", subBrand: "Coca Cola", category: "Beverages", subCategory: "Carbonated Drinks" },
    { platform: "Flipkart", skuid: "SKU002", productname: "Pepsi 500ml", brand: "Pepsi", subBrand: "Pepsi", category: "Beverages", subCategory: "Soft Drinks" },
    { platform: "Blinkit", skuid: "SKU003", productname: "Sprite 250ml", brand: "Sprite", subBrand: "Sprite", category: "Beverages", subCategory: "Lemon Drink" },
    { platform: "Amazon", skuid: "SKU004", productname: "Fanta Orange", brand: "Fanta", subBrand: "Fanta", category: "Beverages", subCategory: "Fruit Flavored" },
    { platform: "Flipkart", skuid: "SKU005", productname: "Mountain Dew", brand: "Mountain Dew", subBrand: "Mountain Dew", category: "Beverages", subCategory: "Citrus Drink" },
    { platform: "Amazon", skuid: "SKU006", productname: "7UP 1L", brand: "7UP", subBrand: "7UP", category: "Beverages", subCategory: "Lemon Lime" },
    { platform: "Blinkit", skuid: "SKU007", productname: "Thums Up", brand: "Thums Up", subBrand: "Thums Up", category: "Beverages", subCategory: "Cola Drink" },
    { platform: "Flipkart", skuid: "SKU008", productname: "Mirinda Orange", brand: "Mirinda", subBrand: "Mirinda", category: "Beverages", subCategory: "Orange Flavored" },
    { platform: "Amazon", skuid: "SKU009", productname: "Red Bull", brand: "Red Bull", subBrand: "Red Bull", category: "Energy Drinks", subCategory: "Energy Drink" },
    { platform: "Blinkit", skuid: "SKU010", productname: "Monster Energy", brand: "Monster", subBrand: "Monster Energy", category: "Energy Drinks", subCategory: "Energy Drink" },
  ];

  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return tableData;
    const copy = [...tableData].sort((a, b) => {
      const va = (a[sortConfig.key] ?? "").toString().toLowerCase();
      const vb = (b[sortConfig.key] ?? "").toString().toLowerCase();
      if (va < vb) return sortConfig.direction === "asc" ? -1 : 1;
      if (va > vb) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [sortConfig, tableData]);

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="p-4 bg-gray-50">
        <div className="max-w-full mx-auto rounded-xl bg-white/60 p-4 border border-gray-100 shadow-sm border-[0.48px]">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {sellerCards.map((c, i) => (
              <MetricCard key={c.id} {...c} active={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Table area */}
      <div className="bg-gray-50 mt-2 px-4 ">
        <main className="flex-1 bg-white rounded-lg shadow-lg py-0.5">
          <div className="bg-[#F9FAFA] py-2 px-4">
            <h1 className="text-xl font-semibold mb-2">Product SKU Mapping</h1>
            <h5 className="text-sm text-gray-600">Map your platform SKUs to brand, category, sub-category, business unit, and mother pack</h5>
          </div>
          <div className="flex items-center justify-between px-4 py-3 pb-8 ">
            <h1 className="text-xl font-semibold text-gray-800">SKU Mapping Table</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition"><FiDownload size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition"><LuSlidersHorizontal size={18} /></button>
              </div>

              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                <img src="/assets/images/file-line-chart.svg" alt="icon" className="w-5 h-5" />
                Bulk Upload
              </button>
            </div>
          </div>

          <DataTable data={sortedData} sortConfig={sortConfig} onSort={sortTable} />

        </main>
        {/* pagination stub */}
        <div className="bg-white rounded-lg shadow-md flex justify-end mt-2">
          <div className="flex items-center gap-3 py-4 px-2">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className={`text-gray-500 ${page === 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}>&lt;</button>
            {[1, 2, 3, 4, 5].map((num) => (
              <button key={num} onClick={() => setPage(num)} className={`px-2 py-1 rounded text-sm ${page === num ? "bg-blue-500 text-white" : "text-gray-800"}`}>{num}</button>
            ))}
            <button onClick={() => setPage(page + 1)} disabled={page === 5} className={`text-gray-500 ${page === 5 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}