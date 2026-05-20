import { useState } from "react";
import { getPriceingRuleById } from "../service/service";
import { useHistory } from "react-router-dom";

export default function ProductTable({ rows = [], selectedIds = [],
  onToggleRow,
  onToggleAll,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onOverrideRow
}) {
  const history = useHistory();
  const [loadingRuleId, setLoadingRuleId] = useState(null);

  const handleEditRule = async (ruleId) => {
    try {
      setLoadingRuleId(ruleId);

      const ruleData = await getPriceingRuleById({
        rule_id: ruleId
      });

      if (!ruleData) return;

      history.push({
        pathname: "/pricing-rule-engine/create-rule",
        state: {
          edit_rule: ruleData
        }
      });
    } catch (error) {
      console.error("Failed to fetch rule", error);
    } finally {
      setLoadingRuleId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden !mb-[86px]">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-500">
            <th className="p-3 text-left">
              <input
                type="checkbox"
                checked={rows.length > 0 && selectedIds.length === rows.length}
                onChange={onToggleAll}
              />
            </th>
            <th>Date</th>
            <th className="p-3 text-left">Product Details</th>
            <th>Platform</th>
            <th>Current Price</th>
            <th>Competitor</th>
            <th>Delta</th>
            <th>Trigger Reason</th>
            <th>Suggested</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan="8" className="p-6 text-center text-gray-400">
                No data available
              </td>
            </tr>
          )}

          {rows?.map((row) => (
            <tr key={row?.id} className="border-b last:border-0">

              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={() => onToggleRow(row.id)}
                />
              </td>
              <td className="text-center">
                {row?.last_updated_at
                  ? new Date(row.last_updated_at).toLocaleString("en-IN", {
                    timeZone: "UTC",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  : "--"}
              </td>

              {/* Product */}
              <td className="p-3 w-[36%]">
                <div className="flex items-center gap-2">
                  <img src={row?.product_image_url} alt={row?.product_name} className="w-10 h-10 object-contain rounded" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {row?.product_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      SKU: {row?.product_id}
                    </div>
                  </div>
                </div>
              </td>

              {/* Platform */}
              <td className="text-center">
                <div className="flex items-center justify-center">
                  {
                    row?.base_platform == "--" ? "" :
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2">
                        <img src={row?.platform_image_url} alt={row?.base_platform} className="w-10 h-10 object-contain rounded" />
                      </div>
                  }
                  {row?.base_platform}
                </div>
              </td>

              {/* Prices */}
              <td className="text-center">${Number(row?.shopify_price).toFixed(2)}</td>
              <td className="text-center">${Number(row?.competitor_price).toFixed(2)}</td>

              <td className={row?.delta_price < 0 ? "text-center text-red-600" : "text-center text-green-600"}>
                ${Number(row?.delta_price).toFixed(2)}
              </td>
              <td className="text-center">
                {/* <Link
                  to={""}
                  className="hover:text-gray-900 transition"
                >
                  {row?.rule?.rule_name ?? "--"}
                </Link> */}

                <button
                  disabled={loadingRuleId === row?.rule_id}
                  className={`inline-flex max-w-[120px] flex-col gap-[2px]
        rounded-md border border-gray-200
        bg-gray-50 px-2 py-1
        text-left
    ${loadingRuleId === row?.rule_id ? "opacity-60 cursor-not-allowed" : ""}
  `}
                  onClick={() => row?.rule?.rule_name && handleEditRule(row?.rule_id)}
                >

                  {row?.rule?.rule_name ?? "--"}
                  {
                    (loadingRuleId === row?.rule_id && row?.rule?.rule_name) && (
                      <span className="ml-2 text-xs text-gray-500">Loading...</span>
                    )
                  }
                </button>
              </td>

              <td className="text-center text-green-600 font-medium">
                ${Number(row?.suggested_price).toFixed(2)}
              </td>


              {/* Status (derived example) */}
              {/* <td className="text-center text-green-600">{row?.status}</td> */}
              <td className="text-center">

                {/* Status text */}
                <div
                  className={`flex font-medium gap-2 ${row?.status === "Blocked"
                    ? "text-red-600"
                    : "text-green-600"
                    }`}
                >
                  {row?.status}
                  {row?.status === "Blocked" && (
                    <div title={`${row?.remarks}`} className='text-white bg-blue-600 w-[17px] h-[17px] rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                      i
                    </div>
                  )}
                </div>

                {/* Override button */}
                {row?.status === "Blocked" && (
                  <button
                    disabled={!row?.can_override}
                    onClick={() => onOverrideRow(row)}
                    className={`flex justify-center mt-1 px-2 py-1 text-xs rounded border
        ${row?.can_override
                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                        : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                      }
      `}
                  >
                    Override
                  </button>
                )}

              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination (static for now) */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
        <span>
          Showing {(page - 1) * pageSize + 1} to{" "}
          {(page - 1) * pageSize + rows.length} of {total} results
        </span>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}
