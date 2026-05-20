import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSort } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  getSubBrandList,
  UpdateIsBrandAndStatusForSubBrand,
  DeleteSubBrandMaster,

  getBrandList,
  UpdateSubBrandMaster // <-- ensure this exists in your service file or rename accordingly
} from "../../services/ebuxMaster.service";

export default function SubBrandMasterList() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Parent brand options (for select)
  const [parentOptions, setParentOptions] = useState([]);

  // Modal / editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formState, setFormState] = useState({
    selectedParent: "",            // combined select value "brandId::platformId"
    parent_brand_id: "",           // brandId as string or id
    platform_id: "",               // platformId as string
    brand_name: "",
    alias: "",
    is_brand: 0,
    status: 1
  });
  const submitButtonRef = useRef(null);

  const fetchBrandList = async () => {
    setLoading(true);
    try {
      const result = await getSubBrandList();
      setBrandData(result ?? []);
    } catch (error) {
      console.error("Failed to load brands:", error);
      setBrandData([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch parent brand list (for select)
  const fetchParentBrandList = async () => {
    try {
      const res = await getBrandList();
      const list = Array.isArray(res) ? res : (res?.data ?? res ?? []);
      // normalize to an array of { id, brandId, brandName, platformId, platformName } with string ids
      const opts = (Array.isArray(list) ? list : []).map(item => {
        const idRaw = item?.id ?? null;
        const brandIdRaw = item.brand_id ?? item.id ?? item?.brandId ?? null;
        const brandName = item.brand_name ?? item.label ?? item?.brandName ?? "";
        const platformIdRaw = item.platform?.pf_id ?? item.platform_id ?? item.pf_id ?? item?.platformId ?? null;
        const platformName = item.platform?.pf_name ?? item.pf_name ?? item.platformName ?? item?.pf_name ?? "";

        return {
          id: idRaw != null ? String(idRaw) : null,
          brandId: brandIdRaw != null ? String(brandIdRaw) : null,
          brandName,
          platformId: platformIdRaw != null ? String(platformIdRaw) : "",
          platformName: platformName ?? ""
        };
      }).filter(o => o.brandId != null);
      setParentOptions(opts);
    } catch (err) {
      console.error("Failed to fetch parent brands:", err);
      setParentOptions([]);
    }
  };

  useEffect(() => {
    fetchBrandList();
    fetchParentBrandList();
  }, []);

  const updateRow = (id, patch) => {
    setBrandData(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
  };

  // ---------- toggles (unchanged) ----------
  const toggleIsBrand = async (id) => {
    const row = brandData.find(item => item.id === id);
    if (!row) return;

    const original = row.is_brand;
    const newIsBrand = original === 1 ? 0 : 1;

    updateRow(id, { is_brand: newIsBrand });

    const payload = { is_brand: newIsBrand };
    try {
      const res = await UpdateIsBrandAndStatusForSubBrand(id, payload);
      const updatedFromApi = res?.data ?? res?.updatedBrand ?? res ?? null;
      const serverIsBrand = Number(
        updatedFromApi?.is_brand ?? updatedFromApi?.isBrand ?? newIsBrand
      );
      updateRow(id, { is_brand: serverIsBrand });
    } catch (err) {
      console.error("Update isBrand failed:", err);
      updateRow(id, { is_brand: original });
    }
  };

  const toggleStatus = async (id) => {
    const row = brandData.find(item => item.id === id);
    if (!row) return;

    const original = row.status;
    const newStatus = original === 1 ? 0 : 1;

    updateRow(id, { status: newStatus });

    const payload = { status: newStatus };
    try {
      const res = await UpdateIsBrandAndStatusForSubBrand(id, payload);
      const updatedFromApi = res?.data ?? res?.updatedBrand ?? res ?? null;
      const serverStatus = Number(
        updatedFromApi?.status ?? updatedFromApi?.Status ?? newStatus
      );
      updateRow(id, { status: serverStatus });
    } catch (err) {
      console.error("Update status failed:", err);
      updateRow(id, { status: original });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    const backup = brandData;
    setBrandData(prev => prev.filter(item => item.id !== id));

    try {
      await DeleteSubBrandMaster(id);
    } catch (err) {
      console.error("Delete failed:", err);
      setBrandData(backup);
    }
  };

  // ---------- Sorting ----------
  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return brandData;
    const arr = [...brandData];
    const key = sortConfig.key;
    arr.sort((a, b) => {
      const valueA = (a[key] ?? "").toString().toLowerCase();
      const valueB = (b[key] ?? "").toString().toLowerCase();
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [brandData, sortConfig]);

  const HeaderCell = ({ label, sortKey }) => {
    const arrow = sortKey === sortConfig.key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "";
    return (
      <th className="px-4 py-3 font-semibold select-none relative">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {sortKey && (
            <button
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                sortTable(sortKey);
              }}
              aria-label={`Sort by ${label}`}
            >
              <FaSort />
              <span className="text-xs">{arrow}</span>
            </button>
          )}
        </div>
      </th>
    );
  };

  const SkeletonRows = ({ rows = 6 }) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b last:border-none">
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-24" /></td>
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-40" /></td>
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-36" /></td>
          <td className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse w-32" /></td>
          <td className="px-4 py-3"><div className="h-6 rounded bg-gray-200 animate-pulse w-14" /></td>
          <td className="px-4 py-3"><div className="h-6 rounded bg-gray-200 animate-pulse w-14" /></td>
          <td className="px-2 py-2"><div className="h-4 rounded bg-gray-200 animate-pulse w-16" /></td>
        </tr>
      ))}
    </>
  );

  // ---------- Edit modal logic ----------
  const openEditModal = (row) => {
    setEditingRow(row);

    // parent id from row (could be parent.brand_id or parent_id)
    const parentIdRaw = row?.parent?.brand_id ?? row?.parent_id ?? null;

    // normalize to string for comparison
    const parentId = parentIdRaw != null ? String(parentIdRaw) : "";

    // find matching option by brandId or id
    const match = parentOptions.find(opt =>
      (opt.brandId && opt.brandId === parentId) ||
      (opt.id && opt.id === parentId)
    );

    if (match) {
      // use matched option's brandId and platformId to set selected value
      const selected = `${match.brandId}::${match.platformId ?? ""}`;
      setFormState({
        selectedParent: selected,
        parent_brand_id: match.brandId ?? "",
        platform_id: match.platformId ?? "",
        brand_name: row?.brand_name ?? "",
        alias: row?.alias ?? "",
        is_brand: Number(row?.is_brand ?? 0),
        status: Number(row?.status ?? 1)
      });
    } else {
      // fallback: try to use row values directly (older API shapes)
      const brandId = row?.parent?.brand_id ?? row?.parent_id ?? "";
      const platformId = row?.platform?.pf_id ?? row?.platform_id ?? "";
      const selected = (brandId !== "" && platformId !== "") ? `${String(brandId)}::${String(platformId)}` : "";
      setFormState({
        selectedParent: selected,
        parent_brand_id: brandId !== null && brandId !== undefined ? String(brandId) : "",
        platform_id: platformId !== null && platformId !== undefined ? String(platformId) : "",
        brand_name: row?.brand_name ?? "",
        alias: row?.alias ?? "",
        is_brand: Number(row?.is_brand ?? 0),
        status: Number(row?.status ?? 1)
      });
    }

    setIsModalOpen(true);
    setTimeout(() => submitButtonRef.current?.focus?.(), 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRow(null);
  };

  const preparePayloadForUpdate = (form) => {
    // map to API shape. Convert parent id to number if present.
    return {
      parent_id: form.parent_brand_id ? Number(form.parent_brand_id) : null,
      brand_name: form.brand_name,
      alias: form.alias,
      is_brand: Number(form.is_brand),
      status: Number(form.status)
    };
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingRow) return;

    // Basic validation
    if (!formState.brand_name?.trim()) {
      alert("Brand name is required.");
      return;
    }

    const id = editingRow.id;
    const payload = preparePayloadForUpdate(formState);

    // keep copy to revert if necessary
    const originalRow = { ...editingRow };
    updateRow(id, { ...payload }); // optimistic update (fields overlap)

    try {
      const res = await UpdateSubBrandMaster(id, payload);
      // try to get updated data from response, fallback to what we sent
      const updatedFromApi = res?.data ?? res?.updatedBrand ?? res ?? null;

      // If response returns new representation, use it. Else we already updated optimistically.
      if (updatedFromApi && typeof updatedFromApi === "object") {
        updateRow(id, {
          brand_name: updatedFromApi.brand_name ?? payload.brand_name,
          alias: updatedFromApi.alias ?? payload.alias,
          is_brand: Number(updatedFromApi.is_brand ?? payload.is_brand),
          status: Number(updatedFromApi.status ?? payload.status),
          // parent/platform mapping if returned
          parent: updatedFromApi.parent ?? editingRow.parent,
          platform: updatedFromApi.platform ?? editingRow.platform
        });
      }
      // close modal on success
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
      // revert
      updateRow(id, originalRow);
      alert("Update failed. Changes were not saved.");
    }
  };

  // ---------- form helpers ----------
  const handleInputChange = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  // when user picks parent-brand option, set both selectedParent and ids
  const handleParentSelect = (e) => {
    const val = e.target.value; // format: `${brandId}::${platformId}`
    if (!val) {
      setFormState(prev => ({
        ...prev,
        selectedParent: "",
        parent_brand_id: "",
        platform_id: ""
      }));
      return;
    }
    const [brandId, platformId] = val.split('::');
    setFormState(prev => ({
      ...prev,
      selectedParent: val,
      parent_brand_id: brandId ?? "",
      platform_id: platformId ?? ""
    }));
  };

  // ---------- render ----------
  return (
    <main className="flex-1 px-4">
      <div className="w-full bg-white rounded-lg shadow-md mx-auto relative">
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <div className="text-sm text-gray-600">Loading sub-brands...</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Sub Brand List</h1>
          <Link
            to={'/createMaster/add-sub-brand'}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <span>Add Sub Brand</span>
          </Link>
        </div>

        <div className="w-full overflow-x-auto max-h-[710px] px-2">
          <table className="w-full min-w-full border-collapse table-fixed">
            <thead className="bg-[#F6F9FB] text-left sticky top-0 z-20">
              <tr>
                <HeaderCell label="Parent Brand" sortKey="parent_brand" />
                <HeaderCell label="Platform" sortKey="pf_name" />
                <HeaderCell label="Sub Brand Name" sortKey="brand_name" />
                <HeaderCell label="Sub Brand Alice Name" sortKey="alias" />
                <th className="px-4 py-3 w-[120px] font-semibold relative">Is Brand</th>
                <th className="px-4 py-3 w-[120px] font-semibold relative">Status</th>
                <th className="px-4 py-3 w-[120px] font-semibold relative">Action</th>
              </tr>
            </thead>

            {/* rest of render unchanged... */}
            <tbody>
              {loading ? (
                <SkeletonRows rows={8} />
              ) : (
                sortedData.length > 0 ? (
                  sortedData.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F6F9FB] border-b last:border-none">
                      <td className="px-4 py-3">{row?.parent?.brand_name ?? '-'}</td>
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
                            aria-checked={row.is_brand === 1}
                            aria-label={`Is brand for ${row.brand_name ?? 'row'}`}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:w-5 after:h-5 after:bg-white after:border after:border-gray-300
                        after:rounded-full after:transition-all peer-checked:after:translate-x-full relative" />
                        </label>
                      </td>

                      <td className="px-4 py-3 w-[120px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.status === 1}
                            onChange={() => toggleStatus(row.id)}
                            className="sr-only peer"
                            aria-checked={row.status === 1}
                            aria-label={`Status for ${row.brand_name ?? 'row'}`}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:w-5 after:h-5 after:bg-white after:border after:border-gray-300
                        after:rounded-full after:transition-all peer-checked:after:translate-x-full relative" />
                        </label>
                      </td>

                      <td className="px-2 py-2 text-gray-600 w-[120px]">
                        <div className="flex items-center gap-3">
                          <FiEdit3
                            className="cursor-pointer hover:text-blue-600 text-xl"
                            onClick={() => openEditModal(row)}
                            title="Edit sub-brand"
                            aria-label={`Edit ${row.brand_name ?? 'sub-brand'}`}
                          />
                          <RiDeleteBin6Line
                            className="cursor-pointer text-red-600 hover:text-red-700 text-xl"
                            onClick={() => handleDelete(row.id)}
                            title={`Delete ${row.brand_name ?? 'sub-brand'}`}
                            aria-label={`Delete ${row.brand_name ?? 'sub-brand'}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No brands found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (unchanged) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-subbrand-title"
        >
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg z-50">
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 id="edit-subbrand-title" className="text-lg font-medium">Edit Sub Brand</h2>
                <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Parent Brand (brand - platform)</label>
                  <select
                    value={formState.selectedParent ?? ""}
                    onChange={handleParentSelect}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Select parent brand</option>
                    {parentOptions.length === 0 ? (
                      <option value="">No parent brands found</option>
                    ) : parentOptions.map(opt => (
                      <option
                        key={`${opt.brandId}::${opt.platformId}`}
                        value={`${opt.brandId}::${opt.platformId}`}
                      >
                        {`${opt.brandName} - ${opt.platformName}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                  <input
                    type="text"
                    value={formState.brand_name}
                    onChange={(e) => handleInputChange('brand_name', e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    placeholder="Brand name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Alias</label>
                  <input
                    type="text"
                    value={formState.alias}
                    onChange={(e) => handleInputChange('alias', e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    placeholder="Alias"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Number(formState.is_brand) === 1}
                      onChange={(e) => handleInputChange('is_brand', e.target.checked ? 1 : 0)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Is Brand</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Number(formState.status) === 1}
                      onChange={(e) => handleInputChange('status', e.target.checked ? 1 : 0)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  ref={submitButtonRef}
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
