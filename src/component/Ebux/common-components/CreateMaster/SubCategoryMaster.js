// SubCategoryMaster.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCategoryList, createSubCategoryMaster } from "../../services/ebuxMaster.service";

const CategorySchema = z.object({
  category_name: z.string().min(1, "Sub Category Name is required").min(2, "Minimum 2 characters"),
  pf_ids: z.array(z.string()).min(1, "Please select at least one parent category/platform"),
  status: z.number().optional(),
});

export default function SubCategoryMaster() {
  const [options, setOptions] = useState([]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const dropdownRef = useRef(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      category_name: "",
      pf_ids: [],
      status: 0,
    },
  });

  const pf_ids = watch("pf_ids") || [];
  const status = watch("status");

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Fetch Category List
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCategoryList();
        const arr = Array.isArray(res) ? res : (res?.data ?? res ?? []);
        if (!mounted) return;

        const opts = arr.map((c) => {
          const catId = Number(c.id);
          const pfId = Number(c.pf_id ?? 0);
          const pfName = c?.platform?.pf_name ?? String(c.pf_id ?? "");
          const key = `${catId}_${pfId}`;
          const label = `${c.category_name ?? 'Category'} - ${pfName}`;
          return { key, catId, pfId, label, raw: c };
        });

        setOptions(opts);
      } catch (err) {
        console.error("fetch categories error", err);
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const toggleOption = (key) => {
    const updated = pf_ids.includes(key)
      ? pf_ids.filter((k) => k !== key)
      : [...pf_ids, key];
    setValue("pf_ids", updated, { shouldValidate: true, shouldDirty: true });
  };

  const toggleSelectAll = () => {
    const allKeys = options.map(o => o.key);
    const allSelected = pf_ids.length === allKeys.length && allKeys.length > 0;
    setValue("pf_ids", allSelected ? [] : allKeys, { shouldValidate: true, shouldDirty: true });
  };

  const selectedNames = () => {
    if (pf_ids.length === 0) return "";
    return pf_ids
      .map(k => options.find(o => o.key === k)?.label)
      .filter(Boolean)
      .join(", ");
  };

  // Submit Handler
  const onSubmit = async (formData) => {
    setSaving(true);
    setSuccessMsg("");

    try {
      const parentIds = Array.from(
        new Set(formData.pf_ids.map(k => Number(k.split("_")[0])))
      );

      const payload = {
        category_name: formData.category_name,
        parent_ids: parentIds,
        status: Number(formData.status ?? 1),
      };

      const result = await createSubCategoryMaster(payload);
      if (!result) throw new Error("Server error");

      setSuccessMsg("Sub-category created successfully");
      reset({ category_name: "", pf_ids: [], status: 0 });
      setIsDropdownOpen(false);

    } catch (err) {
      setSuccessMsg("Failed to save: " + (err?.message ?? "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-[600px] flex-1 px-4">
      <div className="bg-white shadow-sm border border-gray-200 min-h-[600px]">
        <div className="flex items-center justify-between bg-[#FAFAFA] border p-[16px]">
          <h2 className="text-lg font-semibold">Create Sub Category</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 gap-6">
            <div className="font-inter font-semibold text-[16px] leading-[22px]">
              Add a sub-category and assign parent category
            </div>

            <div className="mt-4 flex flex-wrap gap-4">

              {/* Sub Category Name */}
              <div className="w-[40%]">
                <label className="font-inter font-medium text-[14px]">Sub Category Name</label>
                <input
                  type="text"
                  {...register("category_name")}
                  placeholder="Enter Sub Category Name"
                  className={`mt-1 w-full rounded border px-3 py-2 ${errors.category_name ? "border-red-500" : ""}`}
                  disabled={loading || saving}
                />
                {errors.category_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.category_name.message}</p>
                )}
              </div>

              {/* Parent Category Select */}
              <div className="w-[40%] relative" ref={dropdownRef}>
                <label className="font-inter font-medium text-[14px]">Parent Category(s)</label>

                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(s => !s)}
                  className={`mt-1 w-full rounded border px-3 py-2 bg-white text-sm flex justify-between items-center ${
                    errors.pf_ids ? "border-red-500" : ""
                  }`}
                  disabled={loading || saving}
                >
                  <span className="truncate">
                    {selectedNames() || "Select Category - Platform"}
                  </span>
                  <i className={`fa fa-chevron-down transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-72 overflow-auto">

                    {/* Select All */}
                    <div
                      className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                      onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }}
                    >
                      <input type="checkbox" checked={pf_ids.length === options.length && options.length > 0} readOnly />
                      <span className="ml-2">
                        {pf_ids.length === options.length && options.length > 0 ? "Unselect All" : "Select All"}
                      </span>
                    </div>

                    <hr className="border-gray-200 my-1" />

                    {options.map(o => {
                      const checked = pf_ids.includes(o.key);
                      return (
                        <div key={o.key} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer select-none"
                          onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleOption(o.key)}
                            className="w-4 h-4"
                            disabled={loading || saving}
                          />
                          <label className="ml-2">{o.label}</label>
                        </div>
                      );
                    })}

                    {options.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No parent categories available.</div>
                    )}
                  </div>
                )}

                {errors.pf_ids && (
                  <p className="text-sm text-red-600 mt-1">{errors.pf_ids.message}</p>
                )}

                <div className="text-xs text-gray-500 mt-1">
                  Each item shows <strong>Category - Platform</strong>. Select one or more.
                </div>
              </div>

              {/* Status Toggle */}
              <div className="w-[32%] flex items-center gap-3 mt-4">
                <label className="font-inter font-medium text-[14px]">Status</label>
                <button
                  type="button"
                  onClick={() => setValue("status", status ? 0 : 1, { shouldValidate: true })}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition ${
                    status ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  disabled={loading || saving}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                    status ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {successMsg && (
            <div className="flex justify-end mt-3 text-green-600 p-4">
              {successMsg}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 p-4">
            <button
              type="button"
              onClick={() => { reset(); setSuccessMsg(""); }}
              className="px-4 py-2 border rounded"
              disabled={loading || saving}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving || loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {saving ? "Saving..." : "Save Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
