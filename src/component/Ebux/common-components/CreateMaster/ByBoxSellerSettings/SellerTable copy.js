// SellerTable.jsx
import React from "react";
import { FaSort } from "react-icons/fa";

export default function SellerTable({
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
    formatDate
}) {
    // console.log('paginatedRowspaginatedRows', paginatedRows)

    const HeaderCell = ({ label, sortKey, index }) => (
        <th className={`px-4 py-3 font-semibold select-none ${index === 0 ? "w-[700px]" : ""}`}>
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
                            <input type="text" placeholder="Search Seller By Name" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ height: 36 }} />
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
                                value={""}
                                // onChange={(e) => {
                                //   setSellerTypeBulk(e.target.value);
                                //   // toggleRow(row.id,1);
                                // }}
                                className={`appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none pr-8`}
                            >
                                <option value="">Select Seller Type</option>
                                <option value="1P">1P</option>
                                <option value="2P">2P</option>
                                <option value="3P">3P</option>
                            </select>
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

                        <HeaderCell label="Seller Name" sortKey="seller_name" index={0} />
                        {/* <HeaderCell label="Reseller ID" sortKey="reseller_id" /> */}
                        <HeaderCell label="Seller Type" sortKey="seller_type" />
                        <HeaderCell label="Detected On" sortKey="last_seen" />
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
