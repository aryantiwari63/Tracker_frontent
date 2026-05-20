import { useState, useRef, useEffect } from "react";

// const MARKETPLACES = ["Amazon", "Walmart", "Target"];
// const STATUS_OPTIONS = [
//   { label: "Active", value: "Active" },
//   { label: "Inactive", value: "Inactive" },
//   { label: "Deleted", value: "Deleted" }
// ];

export default function FilterBar({ STATUS_OPTIONS, MARKETPLACES, onMarketplaceChange, onStatusChange, status, onSearchChange, type, selectedCount = 0, onPause, onOverride }) {
  const [openMarketplace, setOpenMarketplace] = useState(false);
  const [selected, setSelected] = useState([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [search, setSearch] = useState("");


  const dropdownRef = useRef(null);
  const statusRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMarketplace(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (item) => {
    const updated = selected.includes(item)
      ? selected.filter(i => i !== item)
      : [...selected, item];

    setSelected(updated);
    onMarketplaceChange(updated); // 🔥 pass array to parent
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setOpenStatus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusSelect = (status) => {
    onStatusChange(status);
    setOpenStatus(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange(search.trim());
    }, 1000);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* SEARCH */}
          <div className="w-[38%] relative">
            <input
              type="text"
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="relative" ref={statusRef}>
            {/* STATUS BUTTON */}
            <button
              onClick={() => setOpenStatus(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <span className="text-sm font-medium text-gray-700">
                {status ? `${status.charAt(0).toUpperCase() + status.slice(1)} ` : "Status"}
              </span>

              <svg
                className={`w-4 h-4 transition-transform ${openStatus ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21L10 12l4.77-4.79" />
              </svg>
            </button>

            {/* DROPDOWN */}
            {openStatus && (
              <div className="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                {STATUS_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {option.label}
                  </button>
                ))}

                <div className="border-t px-4 py-2">
                  <button
                    onClick={() => handleStatusSelect(null)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MARKETPLACE MULTISELECT */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenMarketplace(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-700">
                Platform
                {selected.length > 0 && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({selected.length})
                  </span>
                )}
              </span>

              <svg
                className={`w-4 h-4 transition-transform ${openMarketplace ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21L10 12l4.77-4.79" />
              </svg>
            </button>

            {openMarketplace && (
              <div className="absolute z-50 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul className="py-2">
                  {MARKETPLACES.map(item => (
                    <li
                      key={item}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleSelection(item)}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(item)}
                        readOnly
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                {selected.length > 0 && (
                  <div className="border-t px-4 py-2 text-right">
                    <button
                      onClick={() => {
                        setSelected([]);
                        onMarketplaceChange([]);
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* {
          type === "products-affected" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">2 selected</span>

                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  Apply Selected
                </button>

                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  Pause
                </button>

                <button className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm">
                  Override
                </button>
              </div>
            </div>
          )
        } */}
        {type === "products-affected" && (
          <div className="flex items-center gap-2">
            {
              selectedCount > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedCount} selected
                </span>
              )}


            {/* <button
              disabled={selectedCount === 0}
              className={`px-3 py-2 rounded-lg text-sm ${selectedCount === 0
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 text-white"
                }`}
            >
              Apply Selected
            </button> */}

            <button
              disabled={selectedCount === 0}
              onClick={onPause}
              className={`px-3 py-2 rounded-lg text-sm border ${selectedCount === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              Pause
            </button>

            <button
              disabled={selectedCount === 0}
              onClick={onOverride}
              className={`px-3 py-2 rounded-lg text-sm border border-red-200 text-red-600 ${selectedCount === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              Override
            </button>

          </div>
        )}


      </div>
    </div>
  );
}
