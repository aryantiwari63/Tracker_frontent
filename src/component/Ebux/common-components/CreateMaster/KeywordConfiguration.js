// KeywordConfiguration.jsx
import React, { useState, useMemo } from "react";
import { FaSort } from "react-icons/fa";
import { FiEdit3, FiTrash2, FiDownload } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiPlusCircle } from "react-icons/bi";

function MetricCard({ icon, title, subtitle, value, active }) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg shadow-sm ${active ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-100 bg-white"}`}>
      <div className="w-[60px] h-[60px] flex items-center justify-center rounded-md border border-gray-200 bg-[#FAFAFA] shrink-0">
        {icon ? <img src={icon} className="w-[26.93px] h-[24px]" alt="" /> : null}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-inter font-medium text-[14px] leading-[100%] tracking-[0px]">{title}</div>
            <div className="bg-[#EBF7FF] px-[8px] opacity-60 rounded-[12px] py-[2px]">
              <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0]">{subtitle}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex">
          <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[0]">{value} </div>
          <div className="w-[27px] h-[17px] px-2 text-[#00000099]">51%</div>
        </div>

      </div>
    </div>
  );
}


function SectionGrid({ title, items, isKeywodAdd }) {
  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {
          isKeywodAdd ? <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              <BiPlusCircle className="text-white w-5 h-5" />
              Add Keyword
            </button>
          </div> : <></>
        }

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="w-[60px] h-[60px] flex items-center justify-center rounded-md border border-gray-200 bg-[#FAFAFA] shrink-0">
              <img src={it.icon} className="w-[26.93px] h-[24px]" alt="" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 relative">
                <div className="font-inter font-medium text-[14px] leading-[100%] tracking-[0px]">{it.title}</div>
                <div className="bg-[#EBF7FF] px-[8px] opacity-60 rounded-[12px] py-[2px]">
                  <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0]">{it.subtitle}</span>
                </div>
                {
                  isKeywodAdd ?
                    <button className="px-3 py-1 text-sm inline-flex items-center gap-1 bg-white absolute right-[0px]">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2.30484H3.33333C2.97971 2.30484 2.64057 2.44531 2.39052 2.69536C2.14048 2.94541 2 3.28455 2 3.63817V12.9715C2 13.3251 2.14048 13.6643 2.39052 13.9143C2.64057 14.1644 2.97971 14.3048 3.33333 14.3048H12.6667C13.0203 14.3048 13.3594 14.1644 13.6095 13.9143C13.8595 13.6643 14 13.3251 14 12.9715V8.30484M12.25 2.05484C12.5152 1.78962 12.8749 1.64063 13.25 1.64062C13.6251 1.64062 13.9848 1.78962 14.25 2.05484C14.5152 2.32006 14.6642 2.67977 14.6642 3.05484C14.6642 3.42991 14.5152 3.78962 14.25 4.05484L8.24133 10.0642C8.08303 10.2223 7.88747 10.3381 7.67267 10.4008L5.75733 10.9608C5.69997 10.9776 5.63916 10.9786 5.58127 10.9637C5.52339 10.9489 5.47055 10.9188 5.4283 10.8765C5.38604 10.8343 5.35593 10.7815 5.3411 10.7236C5.32627 10.6657 5.32727 10.6049 5.344 10.5475L5.904 8.63217C5.96702 8.41754 6.08302 8.22221 6.24133 8.06417L12.25 2.05484Z" stroke="black" strokeOpacity="0.85" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    :
                    <button className="px-3 py-1 text-sm inline-flex items-center gap-1 bg-white absolute right-[0px]">
                      <img src="/assets/images/master/more-vertical.svg" className="w-[16px] h-[16px]" />
                    </button>
                }

                {/* */}
              </div>
              <div className="mt-1">
                <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[0]">{it.value}</div>
                {it.subText && <div className="text-xs text-gray-500 mt-1 bg-[#F0F0F0] w-fit rounded-[18px] gap-[2px] pt-[2px] pr-[4px] pb-[2px] pl-[4px] border-[0.2px] opacity-100">{it.subText}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


const HeaderCell = ({ label, sortKey, onSort }) => (
  <th className="px-4 py-3 font-semibold select-none">
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {sortKey && (
        <FaSort
          className="text-gray-400 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSort(sortKey);
          }}
        />
      )}
    </div>
  </th>
);


function DataTable({ data, sortConfig, onSort, onEdit, onDelete }) {
  const statusClass = (status) =>
    status === "Active"
      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
      : "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm";

  return (
    <div className="bg-white pb-2">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-[#F6F9FB] text-left py-4">
          <tr>
            <th className="px-4 py-4 w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <HeaderCell label="Keyword" sortKey="keyword" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Type" sortKey="type" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Platform" sortKey="platform" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Brand" sortKey="brand" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Sub-Brand" sortKey="subBrand" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Category" sortKey="category" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Sub Category" sortKey="subCategory" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Status" sortKey="status" activeSort={sortConfig} onSort={onSort} />
            <HeaderCell label="Action" />
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#F6F9FB] border-b last:border-none">
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
                  <FiEdit3 className="cursor-pointer hover:text-blue-600 text-xl" onClick={() => onEdit(row)} />
                  <RiDeleteBin6Line className="cursor-pointer text-red-600 hover:text-red-700 text-xl" onClick={() => onDelete(row)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default function KeywordConfiguration() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);

  const sellerCards = [
    { id: 1, title: "1P Seller", subtitle: "First Party", icon: "/assets/images/master/monitor-up.svg", value: "234", change: "12% from last month", changeType: "up" },
    { id: 2, title: "2P Seller", subtitle: "Second Party", icon: "/assets/images/master/monitor-up.svg", value: "156", change: "8% from last month", changeType: "up" },
    { id: 3, title: "3P Seller", subtitle: "Third Party", icon: "/assets/images/master/monitor-up.svg", value: "610", change: "5% from last month", changeType: "down" },
  ];

  const keywordTypes = [
    { id: "kt1", title: "Brand Keywords", subtitle: "Default Keyword", icon: "/assets/images/master/monitor-up.svg", value: "456", subText: "51% of total" },
    { id: "kt2", title: "Generic Keywords", subtitle: "Default Keyword", icon: "/assets/images/master/monitor-up.svg", value: "312", subText: "35% of total" },
    { id: "kt3", title: "Competition Keywords", subtitle: "Default Keyword", icon: "/assets/images/master/monitor-up.svg", value: "124", subText: "14% of total" },
  ];

  const customKeywords = [
    { id: "c1", title: "High Intent", subtitle: "Custom Keyword", icon: "/assets/images/master/monitor-up.svg", value: "87", subText: "Avg SOS: 52.3%" },
    { id: "c2", title: "Quick Commerce", subtitle: "Custom Keyword", icon: "/assets/images/master/monitor-up.svg", value: "143", subText: "Avg SOS: 41.8%" },
    { id: "c3", title: "Premium Product", subtitle: "Custom Keyword", icon: "/assets/images/master/monitor-up.svg", value: "43", subText: "Avg SOS: 38.3%" },
    { id: "c4", title: "Top Performer", subtitle: "Custom Keyword", icon: "/assets/images/master/monitor-up.svg", value: "92", subText: "Avg SOS: 92.8%" },
    { id: "c5", title: "Growth Focus", subtitle: "Custom Keyword", icon: "/assets/images/master/monitor-up.svg", value: "156", subText: "Avg SOS: 45.7%" },
    { id: "c6", title: "Need Attention", subtitle: "Custom Keyword", icon: "/assets/images/master/monitor-up.svg", value: "78", subText: "Avg SOS: 22.8%" },
  ];

  const tableData = [
    { keyword: "Coca Cola 500ml", type: "Brand", platform: "Amazon", brand: "Coca Cola", subBrand: "Coca Cola", category: "Beverages", subCategory: "Carbonate Drinks", status: "Active" },
    { keyword: "Soft Drink Online", type: "Generic", platform: "Flipkart", brand: "-", subBrand: "-", category: "Beverages", subCategory: "All Soft Drinks", status: "Pending" },
    { keyword: "Buy Pepsi Online", type: "Competitors", platform: "Flipkart", brand: "Pepsi", subBrand: "Pepsi", category: "Beverages", subCategory: "Carbonate Drinks", status: "Active" },
    { keyword: "Cold Drink Delivery", type: "Generic", platform: "Blinkit", brand: "-", subBrand: "-", category: "Beverages", subCategory: "Quick Commerce", status: "Active" },
    { keyword: "Sprite Lemon Drink", type: "Competitors", platform: "Amazon", brand: "Sprite", subBrand: "Sprite", category: "Beverages", subCategory: "Lemon Drink", status: "Pending" },
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

  // table actions
  const handleEdit = (row) => {
    console.log("Edit", row);
  };
  const handleDelete = (row) => {
    console.log("Delete", row);
  };

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="p-4 bg-gray-50">
        <div className="max-w-full mx-auto rounded-xl bg-white/60 p-4 border border-gray-100 shadow-sm border-[0.48px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sellerCards.map((c, i) => (
              <MetricCard key={c.id} {...c} active={i === 3} />
            ))}
          </div>
        </div>
      </div>

      {/* Keyword Types & Custom Keywords */}
      <div className="p-4 bg-white">
        <div className="max-w-full mx-auto rounded-xl bg-white/60 px-4 py-4 border border-gray-100 shadow-sm border-[0.48px]">
          <SectionGrid title="Keyword Types" items={keywordTypes} isKeywodAdd={true} />
          <div className="border border-[#D9D9D9] mt-4 mb-4" />
          <SectionGrid title="Custom Keywords" className="" items={customKeywords} isKeywodAdd={false} />
        </div>
      </div>

      {/* Table area */}
      <div className="bg-gray-50 mt-2 px-4">
        <main className="flex-1 px-4 bg-white rounded-lg shadow-md py-2">
          <div className="flex items-center justify-between px-2 py-3">
            <h1 className="text-xl font-semibold text-gray-800">Keyword Configuration</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition"><FiEdit3 size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition"><FiTrash2 size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition"><FiDownload size={18} /></button>
              </div>

              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                <img src="/assets/images/file-line-chart.svg" alt="icon" className="w-5 h-5" />
                Bulk Upload
              </button>

              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <BiPlusCircle className="text-white w-5 h-5" />
                Add Keyword
              </button>
            </div>
          </div>

          {/* search + filter area (minimal) */}
          <div className="flex justify-between items-center my-4 px-2">
            <div className="relative w-80">
              <input type="text" placeholder="Search and filter" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ height: 36 }} />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="relative">
              <select className="appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none pr-8">
                <option>All Types</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <DataTable data={sortedData} sortConfig={sortConfig} onSort={sortTable} onEdit={handleEdit} onDelete={handleDelete} />


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
