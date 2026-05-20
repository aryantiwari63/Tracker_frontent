// SellerTable.jsx
import React from "react";
import { FaSort } from "react-icons/fa";

function SellerTableComp({
    paginatedRows = [],
    loading = false,
    selected = {},
    toggleRow,
    headerCheckedAll,
    headerIndeterminate,
    toggleSelectAllVisible,
    handleSellerTypeChange,
    //   sortConfig,
    sortTable,
    formatDate,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType
}) {
    // local input value to avoid immediate parent re-renders (prevents input blur)
    const [localSearch, setLocalSearch] = React.useState(searchTerm || "");

    // keep localSearch in sync when parent searchTerm changes externally
    React.useEffect(() => {
        setLocalSearch(searchTerm || "");
    }, [searchTerm]);

    // debounce applying localSearch to parent setSearchTerm
    React.useEffect(() => {
        if (!setSearchTerm) return;
        const id = setTimeout(() => {
            try {
                setSearchTerm(localSearch);
            } catch (e) {
                // ignore
            }
        }, 250); // 250ms debounce
        return () => clearTimeout(id);
    }, [localSearch, setSearchTerm]);

    // caret / focus preservation
    const inputRef = React.useRef(null);
    const caretRef = React.useRef(null); // store selectionStart/End

    // onChange handler that also stores caret
    const handleLocalChange = (e) => {
        const el = e.target;
        // store caret positions
        try {
            caretRef.current = {
                start: el.selectionStart,
                end: el.selectionEnd
            };
        } catch (err) {
            caretRef.current = null;
        }
        setLocalSearch(el.value);
    };

    // After each render, if caretRef exists, restore focus and selection
    React.useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        if (document.activeElement === el) return; // already focused
        if (!caretRef.current) return;
        try {
            el.focus();
            // restore selection range (clamp safely)
            const { start, end } = caretRef.current;
            const len = el.value?.length ?? 0;
            const s = Math.min(Math.max(0, start ?? 0), len);
            const e = Math.min(Math.max(0, end ?? s), len);
            el.setSelectionRange(s, e);
        } catch (err) {
            // ignore if browser doesn't support
        } finally {
            // keep caretRef so further renders can reuse if needed
        }
    });

    const HeaderCell = ({ label, sortKey, w }) => (
        <th className={`px-4 py-3 font-semibold select-none w-[${w}]`}>
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
                {
                    sortKey == "seller_name" && (
                        <div className="relative w-80">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search Seller By Name"
                                value={localSearch}
                                onChange={handleLocalChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ height: 36 }}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    )
                }

                {
                    sortKey == "seller_type" && (
                        <div className="relative">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none pr-8"
                            >
                                <option value="">All Types</option>
                                <option value="1P">1P</option>
                                <option value="2P">2P</option>
                                <option value="3P">3P</option>
                                <option value="null">Un-Assigned</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                        </div>
                    )
                }

            </div>
        </th>
    );

    return (
        <div className="bg-white pb-2">
            <table className="w-full table-fixed border-collapse">
                <thead className="bg-[#F6F9FB] text-left py-4">
                    <tr>
                        <th className="px-4 py-4 w-10">
                            <input
                                type="checkbox"
                                checked={headerCheckedAll}
                                ref={el => {
                                    if (!el) return;
                                    el.indeterminate = headerIndeterminate;
                                }}
                                onChange={toggleSelectAllVisible}
                                className="rounded border-gray-300"
                            />
                        </th>

                        <HeaderCell label="Seller Name" sortKey="seller_name" w={"700px"} />
                        {/* <HeaderCell label="Reseller ID" sortKey="reseller_id" /> */}
                        <HeaderCell label="Seller Type" sortKey="seller_type" w={"500px"} />
                        <HeaderCell label="Detected On" sortKey="last_seen" w={"300px"} />
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="text-center p-6">Loading...</td>
                        </tr>
                    ) : paginatedRows.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No records found</td>
                        </tr>
                    ) : (
                        paginatedRows.map((row) => (
                            <tr key={row.id} className="hover:bg-[#F6F9FB] border-b last:border-none">
                                <td className="px-4 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={!!selected[row.id]}
                                        onChange={() => toggleRow(row.id, 0)}
                                        className="rounded border-gray-300"
                                    />
                                </td>

                                <td className="px-4 py-3">{row?.seller_name ?? "-"}</td>
                                {/* <td className="px-4 py-3">{row?.reseller_id ?? "-"}</td> */}
                                <td className="px-4 py-3">
                                    <div className="relative w-[170px] left-[5%]">
                                        <select
                                            value={row.seller_type ?? ""}
                                            onChange={(e) => {
                                                handleSellerTypeChange(row.id, e.target.value);
                                                // toggleRow(row.id,1);
                                            }}
                                            className={`appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none pr-8 ${row.seller_type == "" || row.seller_type == null ? "border-[red]" : ""}`}
                                        >
                                            <option value="">Select Seller Type</option>
                                            <option value="1P">1P</option>
                                            <option value="2P">2P</option>
                                            <option value="3P">3P</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{formatDate(row?.last_seen)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// memoize to avoid unnecessary re-renders from parent changes
export default React.memo(SellerTableComp);
