// SubCategoryMasterList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSort } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// Replace these with your actual service functions if names differ
import { getSubCategoryList, UpdateIsBrandAndStatusForSubCategory, DeleteSubCategoryMaster } from "../../services/ebuxMaster.service";

export default function SubCategoryMasterList() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const result = await getSubCategoryList();
      const arr = Array.isArray(result) ? result : (result?.data ?? result ?? []);
      setDataList(arr);
    } catch (err) {
      console.error("Failed to load sub-categories:", err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // toggle status (0/1) — optimistic update with revert on error
  const toggleStatus = async (id) => {
    const row = dataList.find(r => r.id === id);
    if (!row) return;
    const oldStatus = row.status;
    const newStatus = oldStatus === 1 ? 0 : 1;

    // optimistic update
    setDataList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    try {
      const payload = { status: newStatus };
      const res = await UpdateIsBrandAndStatusForSubCategory(id, payload);
      const updated = res?.data ?? res?.updatedCategory ?? res ?? null;
      const serverStatus = updated?.status ?? updated?.Status ?? newStatus;
      setDataList(prev => prev.map(item => item.id === id ? { ...item, status: Number(serverStatus) } : item));
    } catch (err) {
      console.error("Update status failed:", err);
      // revert
      setDataList(prev => prev.map(item => item.id === id ? { ...item, status: oldStatus } : item));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) return;
    try {
      await DeleteSubCategoryMaster(id);
      await fetchList();
    } catch (err) {
      console.error("Delete failed:", err);
      // optionally show toast / message
    }
  };

  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...dataList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = (a[sortConfig.key] ?? "").toString().toLowerCase();
    const valueB = (b[sortConfig.key] ?? "").toString().toLowerCase();
    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const HeaderCell = ({ label, sortKey }) => (
    <th className="px-4 py-3 font-semibold select-none relative">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {sortKey && (
          <FaSort
            className="text-gray-400 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              sortTable(sortKey);
            }}
          />
        )}
      </div>
    </th>
  );

  const SkeletonRows = ({ rows = 6 }) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b last:border-none">
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-24" /></td>
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-32" /></td>
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-40" /></td>
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-36" /></td>
          <td className="px-4 py-3"><div className="h-6 rounded bg-gray-200 animate-pulse w-14" /></td>
          <td className="px-2 py-2"><div className="h-4 rounded bg-gray-200 animate-pulse w-16" /></td>
        </tr>
      ))}
    </>
  );

  return (
    <main className="flex-1 px-4">
      <div className="w-full bg-white rounded-lg shadow-md mx-auto relative">

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <div className="text-sm text-gray-600">Loading sub-categories...</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Sub Category List</h1>
          <Link
            to={'/createMaster/add-sub-category'}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <span>Add Sub Category</span>
          </Link>
        </div>

        <div className="w-full overflow-x-auto max-h-[710px] px-2">
          <table className="w-full min-w-full border-collapse table-fixed">
            <thead className="bg-[#F6F9FB] text-left sticky top-0 z-20">
              <tr>
                <HeaderCell label="Parent Category" sortKey="parent_category" />
                <HeaderCell label="Platform" sortKey="pf_name" />
                <HeaderCell label="Sub Category Name" sortKey="category_name" />
                <th className="px-4 py-3 w-[120px] font-semibold relative">Status</th>
                <th className="px-4 py-3 w-[120px] font-semibold relative">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <SkeletonRows rows={8} />
              ) : (
                sortedData.length > 0 ? (
                  sortedData.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F6F9FB] border-b last:border-none">
                      <td className="px-4 py-3">{row?.parent?.category_name ?? row?.parent?.brand_name ?? '-'}</td>
                      <td className="px-4 py-3">{row?.platform?.pf_name ?? '-'}</td>
                      <td className="px-4 py-3">{row?.category_name ?? row?.sub_category_name ?? row?.brand_name ?? '-'}</td>

                      <td className="px-4 py-3 w-[120px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.status === 1}
                            onChange={() => toggleStatus(row.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:w-5 after:h-5 after:bg-white after:border after:border-gray-300
                            after:rounded-full after:transition-all peer-checked:after:translate-x-full relative">
                          </div>
                        </label>
                      </td>

                      <td className="px-2 py-2 text-gray-600 w-[120px]">
                        <div className="flex items-center gap-3">
                          <RiDeleteBin6Line
                            className="cursor-pointer text-red-600 hover:text-red-700 text-xl"
                            onClick={async () => { await handleDelete(row.id); }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No sub-categories found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
