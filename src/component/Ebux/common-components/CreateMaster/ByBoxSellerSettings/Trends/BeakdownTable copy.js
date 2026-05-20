import React, { useEffect, useState } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { fetchComprehensiveBreakdownTable } from "../../../../services/ebuxMaster.service";
import moment from "moment";



export default function BeakdownTable() {
    const { selectedFilters, filters } = useEbuxContext();

    const [tableData, setTableData] = useState([]);
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await fetchComprehensiveBreakdownTable(
                    filters,
                    selectedFilters,
                    selectedFilters?.selectedPlatform
                );

                setTableData(res?.rows || []);
                setFooter(res?.footer || null);
            } catch (err) {
                console.error("BuyBox API Error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [filters, selectedFilters]);

    const groupedByLocation = tableData.reduce((acc, curr) => {
        if (!acc[curr.location]) acc[curr.location] = [];
        acc[curr.location].push(curr);
        return acc;
    }, {});

    return (
        <div className="px-4 w-full flex-[0_0_auto]">
            <div className="card border rounded-xl">
                <div className="flex items-center justify-between border-b py-2 px-3">
                    <h3 className="text-[18px] font-medium text-[#000000]">Comprehensive Breakdown</h3>
                    <img src="/assets/images/master/columns.png" alt="columngs img" />
                </div>

                <div className="max-w-full overflow-x-auto h-[420px] overflow-y-auto scroll-smooth">
                    <table className="w-full table-fixed text-sm text-left border-collapse no-zebra">
                        <thead className="bg-[#FAFAFA] sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-[14px] text-[#000000]">Location</span>
                                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                    </div>
                                </th>

                                <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                    <div className="flex items-center justify-between">
                                        <span>Products Name</span>
                                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                    </div>
                                </th>

                                <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                    <div className="flex items-center justify-between">
                                        <span>Seller Type</span>
                                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                    </div>
                                </th>

                                <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                    <div className="flex items-center justify-between">
                                        <span>Win Rate</span>
                                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                    </div>
                                </th>

                                <th className="px-4 py-3 text-sm font-medium border-b border-gray-200 w-[20%]">
                                    Last Check On
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className="
    text-gray-700
    [&_td]:bg-transparent
    [&_td]:border-r [&_td]:border-gray-200
    [&_td:last-child]:border-r-0
    [&_tr]:border-b [&_tr]:border-gray-200
  "
                        >
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6">Loading...</td>
                                </tr>
                            )}

                            {!loading &&
                                Object.entries(groupedByLocation).map(([location, products]) =>
                                    products.map((row, idx) => (
                                        <tr key={`${location}-${idx}`}>

                                            {/* ✅ LOCATION (ROW SPAN) */}
                                            {idx === 0 && (
                                                <td
                                                    rowSpan={products.length}
                                                    className="px-4 py-4 font-normal align-middle border-r border-gray-200"
                                                >
                                                    {location}
                                                </td>
                                            )}

                                            {/* ✅ PRODUCT NAME */}
                                            <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">
                                                {row.product_name}
                                            </td>

                                            {/* ✅ SELLER TYPE */}
                                            <td className="px-4 py-4 space-y-1 font-normal text-[14px] text-[#000000]">
                                                <div>1P</div>
                                                <div>2P</div>
                                                <div>3P</div>
                                            </td>

                                            {/* ✅ WIN % */}
                                            <td className="px-4 py-4 space-y-1 font-medium">
                                                <div>{Math.round(row.p1_percentage)}%</div>
                                                <div>{Math.round(row.p2_percentage)}%</div>
                                                <div>{Math.round(row.p3_percentage)}%</div>
                                            </td>

                                            {/* ✅ LAST CHECK */}
                                            <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">
                                                {row.last_check_on
                                                    ? moment(row.last_check_on).format("DD-MM-YYYY")
                                                    : "-"}
                                            </td>

                                        </tr>
                                    ))
                                )}
                        </tbody>


                        <tfoot>
                            <tr className="bg-gray-50 border-t">
                                <td className="px-4 py-4">
                                    <p className="text-[#000000] text-normal text-[12px]">Total Location</p>
                                    <p className="font-medium">{footer?.total_locations ?? 0}</p>
                                </td>

                                <td className="px-4 py-4">
                                    <p className="text-[#000000] text-normal text-[12px]">Total Products</p>
                                    <p className="font-medium">{footer?.total_products ?? 0}</p>
                                </td>

                                <td className="px-4 py-4">
                                    <p className="text-[#000000] text-normal text-[12px]">Total Seller Type</p>
                                    <p className="font-medium">{footer?.total_seller_types ?? 0}</p>
                                </td>

                                <td className="px-4 py-4">
                                    <p className="text-[#000000] text-normal text-[12px]">Average Win Rate</p>
                                    <p className="font-medium">
                                        {footer?.avg_win_rate
                                            ? `${Math.round(footer.avg_win_rate)}%`
                                            : "0%"}
                                    </p>
                                </td>

                                <td></td>
                            </tr>
                        </tfoot>

                    </table>

                </div>
            </div>
        </div>
    );
}

