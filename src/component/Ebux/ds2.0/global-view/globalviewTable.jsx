import React, { useState, useMemo } from "react";
import { FaSort } from "react-icons/fa";
import Loader from "../../common-components/Loader";
import { IoIosRedo } from "react-icons/io";
import { useEbuxContext } from "../../Context/EbuxProvider";

const CountryMetricsTable = ({
    loading,
    kpiData,
    handle_active_client_project_change,
    countriesData = []
}) => {
    const { selectedFilters } = useEbuxContext();
    const [search] = useState(""); // search is currently unused
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [open, setOpen] = useState(true);

    // Combine countriesData + kpiData.rowData
    const combinedData = useMemo(() => {
        return countriesData.map((country) => {
            const metricsFromKpi = kpiData?.rowData?.[country.name?.toLowerCase()] ?? {};

            const metricsArray = Object.keys(metricsFromKpi).map((key) => ({
                key,
                ...metricsFromKpi[key],
            }));

            return {
                ...country,
                metrics: metricsArray,
            };
        });
    }, [countriesData, kpiData]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return combinedData;

        return [...combinedData].sort((a, b) => {
            let aVal, bVal;

            if (sortConfig.key === "name") {
                aVal = a?.name?.toLowerCase() ?? "";
                bVal = b?.name?.toLowerCase() ?? "";
            } else {
                aVal = a.metrics?.find((i) => i.key === sortConfig.key)?.value ?? 0;
                bVal = b.metrics?.find((i) => i.key === sortConfig.key)?.value ?? 0;
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [sortConfig, combinedData]);

    // Filter by search
    const filteredData = search?.length
        ? sortedData.filter((item) =>
              item?.name?.toLowerCase().includes(search?.toLowerCase())
          )
        : sortedData;

    const columns = {
        OSA: "OSA",
        SOS: "SOS",
        OR: "Ranking",
        CS: "Content Score",
        PRO: "Promotions",
        RR: "Rating & Reviews",
    };

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const renderMetric = (country_name, metric_key) => {
        const metric = kpiData?.rowData?.[country_name?.toLowerCase()]?.[metric_key];
        if (!metric) return "-";

        return (
            <div className="flex items-center gap-3 overflow-x-auto overflow-y-auto w-full">
                <span className="w-[30%] font-bold text-gray-900 text-sm">
                    {metric?.value ?? (metric_key === "RR" ? "-" : 0)}
                    {(metric_key === "RR" || metric_key === "OR") ? "" : "%"}
                </span>
                {metric?.reference !== undefined && (
                    <>
                        <span className="w-[30%] text-gray-500 text-xs">
                            {metric?.reference ?? 0}
                            {(metric_key === "RR" || metric_key === "OR") ? "" : "%"}
                        </span>
                        <span
                            className={`w-[40%] flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${
                                Number(metric.delta) >= 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {Number(metric.delta) >= 0 ? "▲" : "▼"}{" "}
                            {isNaN(metric?.delta) ? 0 : Math.abs(metric.delta)}
                            {(metric_key === "RR" || metric_key === "OR") ? "" : "%"}
                        </span>
                    </>
                )}
            </div>
        );
    };

    const renderMetricFooter = (metric_key) => {
        const metric = kpiData?.footerData?.[metric_key];
        if (!metric) return "-";

        return (
            <div className="flex items-center gap-3 overflow-x-auto overflow-y-auto w-full">
                <span className="w-[30%] font-bold text-gray-900 text-sm">
                    {metric?.value ?? (metric_key === "RR" ? "-" : 0)}
                    {(metric_key === "RR" || metric_key === "OR") ? "" : "%"}
                </span>
                {metric?.reference !== undefined && (
                    <>
                        <span className="w-[30%] text-gray-500 text-xs">
                            {metric?.reference ?? 0}
                            {(metric_key === "RR" || metric_key === "OR") ? "" : "%"}
                        </span>
                        <span
                            className={`w-[40%] flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${
                                Number(metric.delta) >= 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {Number(metric.delta) >= 0 ? "▲" : "▼"}{" "}
                            {isNaN(metric?.delta) ? 0 : Math.abs(metric.delta)}
                            {(metric_key === "RR" || metric_key === "OR") ? "" : "%"}
                        </span>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white w-full rounded-lg shadow-md flex flex-col px-4 shadow-lg">
            {/* Header */}
            <div className="items-center flex py-3 border-b border-gray-200 bg-white">
                <div className="flex-1">
                    <h1 className="text-2xl flex flex-1 gap-2">
                        Tabular View {loading && <Loader show={loading} fullScreen={false} />}
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={`graphIconBtn ${open ? "arrowRotate" : ""}`}
                >
                    <img src="/assets/images/toggleDown.svg" width={20} height={20} />
                </button>
            </div>

            {open && (
                <div className="overflow-x-auto overflow-y-auto max-h-96 pt-2">
                    <style>
                        {`
                            .sticky-table { border-collapse: separate; border-spacing: 0; }
                            .sticky-header { position: sticky; top: 0; z-index: 20; background: #F6F9FB; border: none; }
                            .sticky-footer { position: sticky; bottom: 0; z-index: 40; background: #FFFFFF; border: none; box-shadow: 0 -2px 6px rgba(0,0,0,0.08);}
                            .sticky-column-0 { position: sticky; left: 0; z-index: 15; background: inherit; border: none; }
                            .sticky-column-header-0 { position: sticky; left: 0; z-index: 25; background: #F6F9FB; border: none; }
                        `}
                    </style>
                    <table className="w-full relative text-sm sticky-table">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => handleSort("name")}
                                    className="p-4 text-sm border-none text-left sticky-column-header-0 sticky-header"
                                >
                                    <div className="flex items-center gap-1">
                                        <span>Country</span>
                                        <FaSort className="w-3 h-3 opacity-70" />
                                    </div>
                                </th>
                                {Object.keys(columns).map((col) => (
                                    <th
                                        key={col}
                                        onClick={() => handleSort(col)}
                                        className="p-4 text-sm border-none text-left sticky-header"
                                    >
                                        <div className="flex items-center gap-1">
                                            <span>{columns[col]}</span>
                                            <FaSort className="w-3 h-3 opacity-70" />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((row, i) => {
                                const isStriped = i % 2 === 0 ? "white" : "#F9FAFA";
                                return (
                                    <tr key={i} className="border-b" style={{ background: isStriped }}>
                                        <td className="justify-between sticky-column-0 py-3 px-3 flex items-center gap-2 font-medium">
                                            <span className="flex items-center gap-2">
                                                <img
                                                    src={row?.flag}
                                                    alt={row?.name}
                                                    className="w-5 h-4 rounded-sm"
                                                />
                                                {row?.name}
                                            </span>
                                            <button
                                                className="border border-gray-200 p-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handle_active_client_project_change(row?.project);
                                                }}
                                            >
                                                <IoIosRedo />
                                            </button>
                                        </td>

                                        {Object.keys(columns).map((col) => (
                                            <td key={col} className="px-4 py-2 border-none text-left">
                                                {row.metrics?.some((m) => m.key === col)
                                                    ? renderMetric(row?.name, col)
                                                    : "-"}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot className="sticky-footer">
                            <tr>
                                <td className="p-2 border-none text-sm text-gray-600 sticky-column-0">
                                    <span className="flex mb-1 w-full text-left justify-start">Total Country</span>
                                    <div className="flex items-center gap-2 font-bold">{filteredData?.length}</div>
                                </td>
                                {Object.keys(columns).map((col) => (
                                    <td key={col} className="px-4 py-2  border-none text-sm text-gray-600">
                                        <span
                                            className={`flex mb-1 w-full ${
                                                selectedFilters?.selectedDateRange?.isCompareToPrevious
                                                    ? "text-center justify-center"
                                                    : ""
                                            }`}
                                        >
                                            Avg {columns[col]}
                                        </span>
                                        <div className="flex items-center gap-2">{renderMetricFooter(col)}</div>
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CountryMetricsTable;
