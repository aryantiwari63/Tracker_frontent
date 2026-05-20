// SubBrandMaster.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBrandList, createSubBrandMaster } from "../../services/ebuxMaster.service";

// Zod: pf_ids stores string keys like "brandId_pfId"
const BrandSchema = z.object({
  brand_name: z.string().min(1, "Sub Brand Name is required").min(2, "Minimum 2 characters"),
  alias: z.string().min(1, "Alias is required").min(2, "Minimum 2 characters"),
  pf_ids: z.array(z.string()).min(1, "Please select at least one parent brand/platform"),
  status: z.number().optional(),
});

export default function SubBrandMaster() {
  const [options, setOptions] = useState([]); // flattened brand-platform options
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const dropdownRef = useRef(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      brand_name: "",
      alias: "",
      pf_ids: [],
      status: 0,
    },
  });

  const pf_ids = watch("pf_ids") || [];
  const status = watch("status");

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // fetch brand list and flatten into options
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getBrandList();
        // response could be array or { data: [...] }
        const arr = Array.isArray(res) ? res : (res?.data ?? res ?? []);
        if (!mounted) return;

        const opts = arr.map((b) => {
          const brandId = Number(b.id);
          const pfId = Number(b.pf_id ?? 0);
          const pfName = b?.platform?.pf_name ?? String(b.pf_id ?? "");
          const key = `${brandId}_${pfId}`;
          const label = `${b.brand_name ?? b.alias ?? 'Brand'} - ${pfName}`;
          return { key, brandId, pfId, label, raw: b };
        });

        setOptions(opts);
      } catch (err) {
        console.error("fetch brands error", err);
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  // toggle single option
  const toggleOption = (key) => {
    const existing = Array.isArray(pf_ids) ? pf_ids : [];
    const updated = existing.includes(key) ? existing.filter((k) => k !== key) : [...existing, key];
    setValue("pf_ids", updated, { shouldValidate: true, shouldDirty: true });
  };

  // select/unselect all
  const toggleSelectAll = () => {
    const allKeys = options.map(o => o.key);
    const allSelected = pf_ids.length === allKeys.length && allKeys.length > 0;
    setValue("pf_ids", allSelected ? [] : allKeys, { shouldValidate: true, shouldDirty: true });
  };

  // labels shown on button
  const selectedNames = () => {
    if (!pf_ids || pf_ids.length === 0) return "";
    const labels = pf_ids.map(k => options.find(o => o.key === k)?.label).filter(Boolean);
    return labels.join(", ");
  };

  // submit: build payload with unique brand ids as parent_ids
  const onSubmit = async (formData) => {
    setSaving(true);
    setSuccessMsg("");
    try {
      const selectedKeys = formData.pf_ids || [];
      const parentIds = Array.from(new Set(selectedKeys.map(k => Number(k.split("_")[0]))));

      const payload = {
        brand_name: formData.brand_name,
        alias: formData.alias,
        parent_ids: parentIds,
        status: Number(formData.status ?? 1),
      };

      // call your API — replace createSubBrandMaster with createSubBrandMaster if needed
      const result = await createSubBrandMaster(payload);
      if (!result) {
        throw new Error("Server error");
      }
      setSuccessMsg("Sub-brand created successfully");
      reset({ brand_name: "", alias: "", pf_ids: [], status: 0 });
      setIsDropdownOpen(false);

    } catch (err) {
      console.error("create error", err);
      setSuccessMsg("Failed to save: " + (err?.message ?? "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 px-4">
      <div className="bg-white shadow-sm border border-gray-200 min-h-[600px]">
        <div className="flex items-center justify-between bg-[#FAFAFA] border p-[16px]">
          <h2 className="text-lg font-semibold">Create Sub Brand</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 gap-6">
            <div className="font-inter font-semibold text-[16px] leading-[22px]">Add a sub-brand and assign parent brands</div>

            <div className="mt-4 flex flex-wrap gap-4">
              {/* Sub Brand Name */}
              <div className="w-[32%]">
                <label className="font-inter font-medium text-[14px]">Sub Brand Name</label>
                <input
                  type="text"
                  {...register("brand_name")}
                  placeholder="Enter Sub Brand Name"
                  className={`mt-1 w-full rounded border px-3 py-2 ${errors.brand_name ? "border-red-500" : ""}`}
                  disabled={loading || saving}
                />
                {errors.brand_name && <p className="text-sm text-red-600 mt-1">{errors.brand_name.message}</p>}
              </div>

              {/* Alias */}
              <div className="w-[32%]">
                <label className="font-inter font-medium text-[14px]">Alias</label>
                <input
                  type="text"
                  {...register("alias")}
                  placeholder="Enter Alias"
                  className={`mt-1 w-full rounded border px-3 py-2 ${errors.alias ? "border-red-500" : ""}`}
                  disabled={loading || saving}
                />
                {errors.alias && <p className="text-sm text-red-600 mt-1">{errors.alias.message}</p>}
              </div>

              {/* Parent Brands multi-select */}
              <div className="w-[32%] relative" ref={dropdownRef}>
                <label className="font-inter font-medium text-[14px]">Parent Brand(s)</label>

                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(s => !s)}
                  className={`mt-1 w-full rounded border px-3 py-2 bg-white text-sm flex justify-between items-center ${errors.pf_ids ? "border-red-500" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  disabled={loading || saving}
                >
                  <span className="truncate">{selectedNames() || "Select Brand - Platform"}</span>
                  <i className={`fa fa-chevron-down transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-72 overflow-auto" role="listbox">
                    <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                      onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }}>
                      <input type="checkbox" checked={pf_ids.length === options.length && options.length > 0} readOnly />
                      <span className="ml-2">{pf_ids.length === options.length && options.length > 0 ? "Unselect All" : "Select All"}</span>
                    </div>

                    <hr className="border-gray-200 my-1" />

                    {options.map(o => {
                      const checked = pf_ids.includes(o.key);
                      return (
                        <div key={o.key} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer select-none"
                          onClick={(e) => e.stopPropagation()}>
                          <input
                            id={`opt-${o.key}`}
                            type="checkbox"
                            checked={checked}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleOption(o.key)}
                            className="w-4 h-4"
                            disabled={loading || saving}
                          />
                          <label htmlFor={`opt-${o.key}`} className="ml-2">{o.label}</label>
                        </div>
                      );
                    })}

                    {options.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">No brands available.</div>}
                  </div>
                )}

                {errors.pf_ids && <p className="text-sm text-red-600 mt-1">{errors.pf_ids.message}</p>}
                <div className="text-xs text-gray-500 mt-1">Each item shows <strong>Brand - Platform</strong>. Select one or more.</div>
              </div>

              {/* Status toggle (optional) */}
              <div className="w-[32%] flex items-center gap-3 mt-4">
                <label className="font-inter font-medium text-[14px]">Status</label>
                <button
                  type="button"
                  onClick={() => setValue("status", (watch("status") ? 0 : 1), { shouldValidate: true, shouldDirty: true })}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition ${status ? "bg-blue-600" : "bg-gray-300"}`}
                  aria-pressed={!!status}
                  disabled={loading || saving}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${status ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {successMsg && <div className="flex justify-end mt-3 text-green-600 p-4">{successMsg}</div>}

          <div className="mt-6 flex items-center justify-end gap-3 p-4">
            <button type="button" onClick={() => { reset(); setSuccessMsg(""); }} className="px-4 py-2 border rounded" disabled={loading || saving}>Cancel</button>
            <button type="submit" disabled={saving || loading} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Saving..." : "Save Sub Brand"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
