// BrandMaster.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPlatformList, createBrandMaster } from "../../services/ebuxMaster.service";

// ------------------ ZOD SCHEMA ------------------
const BrandSchema = z.object({
  brand_name: z
    .string()
    .min(1, "Brand Name is required")
    .min(2, "Minimum 2 characters"),
  alias: z
    .string()
    .min(1, "Alice Brand Name is required")
    .min(2, "Minimum 2 characters"),
  // pf_ids will store numeric IDs
  pf_ids: z
    .array(z.number())
    .min(1, "Please select at least one platform"),
  isBrand: z.number(),
  status: z.number(),
});

// ------------------ COMPONENT ------------------
export default function BrandMaster() {
  const [platforms, setPlatforms] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const dropdownRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      brand_name: "",
      alias: "",
      pf_ids: [],
      isBrand: 0,
      status: 0,
    },
  });

  const pf_ids = watch("pf_ids") || [];
  const isBrand = watch("isBrand");
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

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const result = await getPlatformList();
        setPlatforms(result);
      } catch (error) {
        console.error("Failed to load platforms:", error);
      }
    };

    fetchPlatforms();
  }, []);


  // Toggle one platform by numeric id
  const togglePlatform = (platformId) => {
    const existing = Array.isArray(pf_ids) ? pf_ids : [];
    const updated = existing.includes(platformId)
      ? existing.filter((id) => id !== platformId)
      : [...existing, platformId];

    setValue("pf_ids", updated, { shouldValidate: true, shouldDirty: true });
  };

  // Select All / Unselect All (works with numeric ids)
  const toggleSelectAll = () => {
    const allIds = platforms.map((p) => p.pf_id);
    const allSelected = pf_ids.length === allIds.length;
    setValue("pf_ids", allSelected ? [] : allIds, { shouldValidate: true, shouldDirty: true });
  };

  // toggles for switches (0/1)
  const toggleIsBrand = () => setValue("isBrand", isBrand ? 0 : 1, { shouldValidate: true, shouldDirty: true });
  const toggleStatus = () => setValue("status", status ? 0 : 1, { shouldValidate: true, shouldDirty: true });

  const onSubmit = async (formData) => {
    setLoading(true);
    setSuccessMsg("");
    try {
      console.log("FINAL DATA:", formData);
      const result = await createBrandMaster(formData);
      if (!result) {
        throw new Error("Server error");
      }
      setSuccessMsg("Brands saved successfully");

      reset({
        brand_name: "",
        alias: "",
        pf_ids: [],
        isBrand: 0,
        status: 0,
      });

      // Close dropdown if open
      setIsDropdownOpen(false);

    } catch (err) {
      setSuccessMsg("Failed to save: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Helper to show selected names (comma separated)
  const selectedNames = () => {
    if (!pf_ids || pf_ids.length === 0) return "";
    const names = pf_ids
      .map((id) => platforms.find((p) => p.pf_id === id))
      .filter(Boolean)
      .map((p) => p.pf_name);
    return names.join(", ");
  };

  return (
    <main className="flex-1 px-4">
      <div className="bg-white shadow-sm border border-gray-200 min-h-[800px]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FAFAFA] border p-[16px]">
          <h2 className="text-lg font-semibold">Brands</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 gap-6">
            <div className="font-inter font-semibold text-[16px] leading-[22px]">
              What would you like to do?
              <i className="fa fa-info-circle text-[#666] px-1" />
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              {/* Manual Brand */}
              <div className="w-[32%]">
                <label className="font-inter font-medium text-[14px]">Brand Name</label>
                <input
                  type="text"
                  {...register("brand_name")}
                  placeholder="Enter Brand Name"
                  className={`mt-1 w-full rounded border px-3 py-2 ${errors.brand_name ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.brand_name && <p className="text-sm text-red-600 mt-1">{errors.brand_name.message}</p>}
              </div>

              {/* Alice Brand */}
              <div className="w-[32%]">
                <label className="font-inter font-medium text-[14px]">Brand Name Alice</label>
                <input
                  type="text"
                  {...register("alias")}
                  placeholder="Enter Alice Brand"
                  className={`mt-1 w-full rounded border px-3 py-2 ${errors.alias ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.alias && <p className="text-sm text-red-600 mt-1">{errors.alias.message}</p>}
              </div>

              {/* Platform Dropdown */}
              <div className="w-[32%] relative" ref={dropdownRef}>
                <label className="font-inter font-medium text-[14px]">Platforms</label>

                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((s) => !s)}
                  className={`mt-1 w-full rounded border px-3 py-2 bg-white text-sm flex justify-between items-center ${errors.pf_ids ? "border-red-500" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  disabled={loading}
                >
                  <span className="truncate">{selectedNames() || "Select platforms"}</span>
                  <i className={`fa fa-chevron-down transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-auto" role="listbox" aria-label="Platforms">
                    {/* Select All */}
                    <div
                      className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectAll();
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={pf_ids.length === platforms.length}
                        readOnly
                      />
                      <span className="ml-2">{pf_ids.length === platforms.length ? "Unselect All" : "Select All"}</span>
                    </div>

                    <hr className="border-gray-200 my-1" />

                    {/* Individual platforms */}
                    {platforms.map((p) => {
                      const checked = pf_ids.includes(p?.pf_id);
                      const inputId = `platform-${p.pf_id}`;

                      return (
                        <div
                          key={p.pf_id}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer select-none"
                          onClick={(e) => {
                            // prevent outer click from toggling dropdown open/close
                            e.stopPropagation();
                          }}
                        >
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onClick={(e) => e.stopPropagation()} // keep dropdown open
                            onChange={() => togglePlatform(p.pf_id)}
                            className="w-4 h-4"
                            disabled={loading}
                          />

                          {/* Clicking this span toggles too */}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlatform(p.pf_id);
                            }}
                            className="ml-2 capitalize"
                            style={{ userSelect: "none" }}
                          >
                            {p.pf_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {errors.pf_ids && <p className="text-sm text-red-600 mt-1">{errors.pf_ids.message}</p>}
              </div>

              {/* isBrand Toggle */}
              <div className="w-[32%] flex items-center gap-3 mt-4">
                <label className="font-inter font-medium text-[14px]">is Brand</label>
                <button
                  type="button"
                  onClick={toggleIsBrand}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition ${isBrand ? "bg-blue-600" : "bg-gray-300"}`}
                  aria-pressed={!!isBrand}
                  disabled={loading}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${isBrand ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Status Toggle */}
              <div className="w-[32%] flex items-center gap-3 mt-4">
                <label className="font-inter font-medium text-[14px]">Status</label>
                <button
                  type="button"
                  onClick={toggleStatus}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition ${status ? "bg-blue-600" : "bg-gray-300"}`}
                  aria-pressed={!!status}
                  disabled={loading}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${status ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
          {successMsg && <div className="flex justify-end mt-3 text-green-600 p-4">{successMsg}</div>}
          {/* Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 p-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setSuccessMsg("");
              }}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
