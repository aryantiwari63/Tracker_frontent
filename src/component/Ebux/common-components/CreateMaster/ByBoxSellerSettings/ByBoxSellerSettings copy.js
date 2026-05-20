import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import {
  // FiEdit3,
  // FiEdit, FiTrash2, 
  FiDownload
} from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { BiPlusCircle } from "react-icons/bi";

import { getByBoxSellerSettings } from "../../services/ebuxMaster.service";


export default function ByBoxSellerSettings() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);

  const [sellerData, setSellerData] = useState([]);
    const [loadingSeller, setLoadingSeller] = useState(false);
  

  useEffect(() => {
      const fetchPlatforms = async () => {
        setLoadingSeller(true);
        try {
          const result = await getByBoxSellerSettings();
          setSellerData(result || []);
  
        } catch (error) {
          console.error("Failed to load platforms:", error);
        } finally {
          setLoadingSeller(false);
        }
      };
  
      fetchPlatforms();
    }, []);

  // Sorting Function
  const sortTable = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = [...sellerData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key]?.toString().toLowerCase();
    const valueB = b[sortConfig.key]?.toString().toLowerCase();

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // const statusClass = (status) =>
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


  const sellerCards = [
    {
      id: 1,
      title: "1P Seller",
      subtitle: "First Party",
      icon: "/assets/images/master/monitor-up.svg",
      value: "234",
      change: "12% from last month",
      changeType: "up", // or "down"
    },
    {
      id: 2,
      title: "2P Seller",
      subtitle: "Second Party",
      icon: "/assets/images/master/monitor-up.svg",
      value: "156",
      change: "8% from last month",
      changeType: "up",
    },
    {
      id: 3,
      title: "3P Seller",
      subtitle: "Third Party",
      icon: "/assets/images/master/monitor-up.svg",
      value: "610",
      change: "5% from last month",
      changeType: "down",
    },
  ];


  
  return (

    <div className="">
      <div className="bg-white">
        <div className="p-4 bg-gray-50 min-h-[120px]">
          <div className="max-w-full mx-auto rounded-xl bg-white/60 p-4 border border-gray-100 shadow-sm border-[0.48px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {sellerCards.map(card => (
                <div key={card.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-[60px] h-[60px] flex items-center justify-center rounded-md border border-gray-200 bg-[#FAFAFA] shrink-0">
                    <img src="/assets/images/master/monitor-up.svg" className="w-[26.93px] h-[24px]" alt="" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-inter font-medium text-[14px] leading-[100%] tracking-[0px]">{card.title}</div>
                        <div className="bg-[#EBF7FF] px-[8px] opacity-60">

                          <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0]"> {card.subtitle}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[0]"> {card.value}</div>
                    </div>

                    <div className="mt-[2px]">
                      <span className="inline-flex items-center text-sm font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100">
                        {card.changeType === "up" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        )}

                        {/* DOWN arrow */}
                        {card.changeType === "down" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        )}

                        <span className="font-inter font-normal text-[10px] leading-[100%] tracking-[0]">{card.change}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>




      <div className="bg-gray-50 mt-2 px-4 flex flex-col">
        <main className="flex-1 px-4 bg-white rounded-lg shadow-md py-2">

          {/* HEADER */}
          <div className="flex items-center justify-between px-2 py-3">
            <h1 className="text-xl font-semibold text-gray-800">
              Seller List
            </h1>

            <div className="flex items-center gap-4">

              {/* 3 Small Icon Buttons */}
              <div className="flex items-center gap-3">
                {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiEdit size={18} />
                </button> */}
                {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiTrash2 size={18} />
                </button> */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiDownload size={18} />
                </button>
              </div>

              {/* Bulk Upload */}
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                <img
                  src="/assets/images/master/file-line-chart.svg"
                  alt="icon"
                  className="w-5 h-5"
                />
                Bulk Upload
              </button>

              {/* Add Keyword */}
              <button className="flex items-center gap-2 bg-[#0081F7] text-white px-4 py-2 rounded-lg transition">
                {/* <BiPlusCircle className="text-white w-5 h-5" /> */}
                <img
                  src="/assets/images/master/save.svg"
                  alt="icon"
                  className="w-5 h-5"
                />
                Save Changes
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

                  <HeaderCell label="Seller Name" sortKey="seller_name" />
                  <HeaderCell label="Reseller ID" sortKey="seller_id" />
                  <HeaderCell label="Seller Type" sortKey="seller_type" />
                  <HeaderCell label="Last Seen" sortKey="last_seen" />
                  {/* <HeaderCell label="Sub-Brand" sortKey="subBrand" />
                  <HeaderCell label="Category" sortKey="category" />
                  <HeaderCell label="Sub Category" sortKey="subCategory" />
                  <HeaderCell label="Status" sortKey="status" />
                  <HeaderCell label="Action" /> */}
                </tr>
              </thead>

              <tbody>

                { loadingSeller ? (
                  <tr>
                    <td colSpan={5} className="text-center p-6">
                      Loading...
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-gray-500">
                      No records
                    </td>
                  </tr>
                ) : (
                sortedData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F6F9FB] border-b last:border-none"
                  >
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>

                    <td className="px-4 py-3">{row.seller_name}</td>
                    <td className="px-4 py-3">{row.seller_id}</td>
                    <td className="px-4 py-3">
                      <select
                        className="appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none pr-8"
                      >
                        <option value="" selected>Seller Type</option>
                        <option value={"1P"}>1P</option>
                        <option value={"2P"}>2P</option>
                        <option value={"3P"}>3P</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{row.last_seen}</td>

                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </main>
        <div className="bg-white rounded-lg shadow-md flex justify-end mt-2">
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

    </div>
  );
}
