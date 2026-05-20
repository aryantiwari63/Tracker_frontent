// BrandMasterList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSort } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  getBrandList,
  UpdateIsBrandAndStatus,
  DeleteBrandMaster,
  getPlatformList,
  updateBrandMaster,
} from "../../services/ebuxMaster.service";

export default function BrandMasterList() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [platforms, setPlatforms] = useState([]);

  const fetchBrandList = async () => {
    setLoading(true);
    try {
      const result = await getBrandList();
      setBrandData(result ?? []);
    } catch (error) {
      console.error("Failed to load brands:", error);
      setBrandData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandList();
  }, []);

  // load platforms once (for modal select)
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await getPlatformList();
        setPlatforms(res ?? []);
      } catch (err) {
        console.error("Failed to load platforms:", err);
        setPlatforms([]);
      }
    };
    fetchPlatforms();
  }, []);

  const toggleIsBrand = async (id) => {
    const row = brandData.find(item => item.id === id);
    if (!row) return;

    const newIsBrand = row.is_brand === 1 ? 0 : 1;
    setBrandData(prev => prev.map(item => item.id === id ? { ...item, is_brand: newIsBrand } : item));

    const payload = { is_brand: newIsBrand };

    try {
      const res_darkstore = await UpdateIsBrandAndStatus(id, payload);
      const updatedFromApi = res_darkstore?.data ?? res_darkstore?.updatedBrand ?? res_darkstore ?? null;

      const serverIsBrand =
        updatedFromApi?.is_brand ?? updatedFromApi?.isBrand ?? newIsBrand;

      setBrandData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, is_brand: Number(serverIsBrand) } : item
        )
      );
    } catch (err) {
      console.error("Update isBrand failed:", err);
      setBrandData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, is_brand: row.is_brand } : item
        )
      );
    }
  };


  const toggleStatus = async (id) => {
    const row = brandData.find(item => item.id === id);
    if (!row) return;

    const newStatus = row.status === 1 ? 0 : 1;
    setBrandData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    const payload = { status: newStatus };

    try {
      const res_darkstore = await UpdateIsBrandAndStatus(id, payload);
      const updatedFromApi = res_darkstore?.data ?? res_darkstore?.updatedBrand ?? res_darkstore ?? null;

      const serverStatus =
        updatedFromApi?.status ?? updatedFromApi?.Status ?? newStatus;

      setBrandData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: Number(serverStatus) } : item
        )
      );
    } catch (err) {
      console.error("Update status failed:", err);
      // rollback
      setBrandData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: row.status } : item
        )
      );
    }
  };

  const openEditModal = (row) => {
    // Normalize editingRow fields for modal form
    const initial = {
      id: row.id,
      brand_name: row.brand_name ?? "",
      alias: row.alias ?? "",
      pf_id: row.pf_id ?? (row.platform?.pf_id ?? null),
      is_brand: Number(row.is_brand ?? 0),
      status: Number(row.status ?? 0),
    };
    console.log('initialinitial',initial)
    setEditingRow(initial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRow(null);
  };

  const handleModalChange = (field, value) => {
    setEditingRow(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editingRow) return;
    setModalSaving(true);
    try {
      // Build payload according to your backend API expected keys
      const payload = {
        brand_name: editingRow?.brand_name,
        alias: editingRow?.alias,
        pf_id: Number(editingRow.pf_id),
        is_brand: Number(editingRow.is_brand),
        status: Number(editingRow.status),
      };

      console.log('payloadpayloadpayload',editingRow)

      const result = await updateBrandMaster(editingRow?.id??0 , payload);
      if (!result) {
        throw new Error("Server error");
      }

      // If service returns updated object, patch locally else refetch list
      const updated = result?.data ?? result ?? null;
      if (updated) {
        setBrandData(prev => prev.map(item => item.id === editingRow.id ? { ...item, ...updated } : item));
      } else {
        // fallback: refresh list
        await fetchBrandList();
      }

      closeModal();
    } catch (err) {
      console.error("Failed to update brand:", err);
      // show error feedback (simple alert for now)
      window.alert("Failed to update brand: " + (err?.message ?? "Unknown"));
    } finally {
      setModalSaving(false);
    }
  };

  const confirmAndDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await DeleteBrandMaster(id);
      await fetchBrandList();
    } catch (err) {
      console.error("Delete failed", err);
      window.alert("Delete failed: " + (err?.message ?? "Unknown"));
    }
  };

  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...brandData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key]?.toString().toLowerCase() ?? "";
    const valueB = b[sortConfig.key]?.toString().toLowerCase() ?? "";

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

  // Skeleton helper: returns n skeleton rows
  const SkeletonRows = ({ rows = 6 }) => {
    return (
      <>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="border-b last:border-none">
            <td className="px-4 py-3">
              <div className="h-4 rounded bg-gray-200 animate-pulse w-24" />
            </td>
            <td className="px-4 py-3">
              <div className="h-4 rounded bg-gray-200 animate-pulse w-40" />
            </td>
            <td className="px-4 py-3">
              <div className="h-4 rounded bg-gray-200 animate-pulse w-36" />
            </td>
            <td className="px-4 py-3">
              <div className="h-6 rounded bg-gray-200 animate-pulse w-14" />
            </td>
            <td className="px-4 py-3">
              <div className="h-6 rounded bg-gray-200 animate-pulse w-14" />
            </td>
            <td className="px-2 py-2">
              <div className="h-4 rounded bg-gray-200 animate-pulse w-16" />
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <main className="flex-1 px-4">
      <div className="w-full bg-white rounded-lg shadow-md mx-auto relative">

        {/* Spinner overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              {/* simple spinner */}
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <div className="text-sm text-gray-600">Loading brands...</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Brand List</h1>
          <Link
            to={'/createMaster/add-brand'}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <span>Add Brand</span>
          </Link>
        </div>

        <div className="w-full overflow-x-auto max-h-[710px] px-2">
          <table className="w-full min-w-full border-collapse table-fixed">
            <thead className="bg-[#F6F9FB] text-left sticky top-0 z-20">
              <tr>
                <HeaderCell label="Platform" sortKey="platform" />
                <HeaderCell label="Brand Name" sortKey="brandName" />
                <HeaderCell label="Brand Alice Name" sortKey="brandAliceName" />
                <th className="px-4 py-3 w-[120px] font-semibold relative">Is Brand</th>
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
                      <td className="px-4 py-3">{row?.platform?.pf_name ?? '-'}</td>
                      <td className="px-4 py-3">{row?.brand_name ?? '-'}</td>
                      <td className="px-4 py-3">{row?.alias ?? '-'}</td>

                      <td className="px-4 py-3 w-[120px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.is_brand === 1}
                            onChange={() => toggleIsBrand(row.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:w-5 after:h-5 after:bg-white after:border after:border-gray-300
                          after:rounded-full after:transition-all peer-checked:after:translate-x-full relative">
                          </div>
                        </label>
                      </td>

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
                          <FiEdit3
                            className="cursor-pointer hover:text-blue-600 text-xl"
                            onClick={() => openEditModal(row)}
                          />
                          <RiDeleteBin6Line
                            className="cursor-pointer text-red-600 hover:text-red-700 text-xl"
                            onClick={() => confirmAndDelete(row.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // empty state
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No brands found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-xl mx-4 rounded-lg shadow-lg z-60">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Edit Brand</h3>
              <button className="text-gray-600" onClick={closeModal}>✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Brand Name</label>
                <input
                  type="text"
                  value={editingRow.brand_name}
                  onChange={(e) => handleModalChange('brand_name', e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Alias</label>
                <input
                  type="text"
                  value={editingRow.alias}
                  onChange={(e) => handleModalChange('alias', e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Platform</label>
                <select
                  value={editingRow.pf_id ?? ""}
                  onChange={(e) => handleModalChange('pf_id', e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                >
                  <option value="">-- Select Platform --</option>
                  {platforms.map((p) => (
                    <option key={p.pf_id ?? p.id} value={p.pf_id ?? p.id}>
                      {p.pf_name ?? p.name ?? p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingRow.is_brand === 1}
                    onChange={() => handleModalChange('is_brand', editingRow.is_brand === 1 ? 0 : 1)}
                  />
                  <span className="text-sm">Is Brand</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingRow.status === 1}
                    onChange={() => handleModalChange('status', editingRow.status === 1 ? 0 : 1)}
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border rounded" onClick={closeModal} disabled={modalSaving}>
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={saveEdit}
                  disabled={modalSaving}
                >
                  {modalSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
