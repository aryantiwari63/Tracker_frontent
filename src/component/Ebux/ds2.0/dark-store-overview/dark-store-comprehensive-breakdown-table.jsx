import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchDarkStoreComprehensiveBreakdownTableData, fetchNDPFDarkStoreCoverage } from "./services/service";
import { useEbuxContext } from "../../Context/EbuxProvider";
import moment from "moment";
import CustomizeCampiagnModal from "../../common-components/CustomizeCampiangn";
import { FILTERACTION, searchFilterArr } from "../../common-components/MultiFilter/FilterConstant";
import _ from "lodash";
import { FaSort } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import Excel from "exceljs";
import { copyToClipboard, getTextFromReactNode } from "../../../../utils/helpers";
import DarkstoreComprehensiveFilter from "../osaWidgets/osaPerformanceOverview/Components/DrawerComponent/filter/darkStoreComprehenisiveFilter";
import InfoTooltip from "../common-components/InfoTooltip";


// const buildHierarchy = (buckets, fields, level = 0, parentValues = {}, idPrefix = "") => {
//   if (!buckets || !fields || fields.length === 0) return [];

//   const grouped = {};
//   for (const b of buckets) {
//     const key = b.key?.[fields[level]] ?? "Unknown";
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(b);
//   }

//   return Object.entries(grouped).map(([key, group], idx) => {
//     const currentValues = { ...parentValues, [fields[level]]: key };
//     const nodeId = `${idPrefix}-${level}-${idx}-${key}`.replace(/\s+/g, '_');

//     if (level === fields.length - 1) {
//       // Calculate metrics for leaf nodes using correct field names

//       // OSA calculation: sum of total_data / sum of data_count * 100
//       const totalDataSum = group.reduce((sum, bucket) => sum + (bucket.total_data?.value || 0), 0);
//       const dataCountSum = group.reduce((sum, bucket) => sum + (bucket.data_count?.value || 0), 0);


//       // Price calculations only for buckets with total_data > 0
//       const sumPriceRP = group.reduce((sum, bucket) =>
//         sum + ((bucket.total_data?.value || 0) > 0 ? (bucket.price_rp?.value || 0) : 0), 0);

//       const diameterPriceRP = group.reduce((sum, bucket) =>
//         sum + ((bucket.total_data?.value || 0) > 0 ? 1 : 0), 0);
//       const sumPriceSP = group.reduce((sum, bucket) =>
//         sum + ((bucket.total_data?.value || 0) > 0 ? (bucket.price_sp?.value || 0) : 0), 0);
//       const diameterPriceSP = group.reduce((sum, bucket) =>
//         sum + ((bucket.total_data?.value || 0) > 0 ? 1 : 0), 0);

//       const metrics = {
//         osa: dataCountSum > 0 ? (totalDataSum / dataCountSum) * 100 : 0,
//         price_rp: diameterPriceRP > 0 ? sumPriceRP / diameterPriceRP : 0,
//         price_sp: diameterPriceSP > 0 ? sumPriceSP / diameterPriceSP : 0,
//         sum_price_rp: sumPriceRP,
//         sum_price_sp: sumPriceSP,
//       };

//       // Price variation calculation using sums
//       metrics.price_variation =
//         metrics.sum_price_rp > 0
//           ? ((metrics.sum_price_rp - metrics.sum_price_sp) / metrics.sum_price_rp) * 100
//           : 0;

//       return { id: nodeId, ...currentValues, metrics, _buckets: group };
//     }

//     const children = buildHierarchy(group, fields, level + 1, currentValues, nodeId);

//     // Calculate rollup metrics from children
//     const allChildBuckets = children.flatMap(child => child._buckets || []);

//     // If no child buckets, return empty metrics
//     if (allChildBuckets.length === 0) {
//       return { id: nodeId, ...currentValues, metrics: null, children: [], _buckets: [] };
//     }

//     // OSA calculation for parent nodes
//     const totalDataSum = allChildBuckets.reduce((sum, bucket) => sum + (bucket.total_data?.value || 0), 0);
//     const dataCountSum = allChildBuckets.reduce((sum, bucket) => sum + (bucket.data_count?.value || 0), 0);

//     // Calculate osaDataCountSum for parent nodes (count of data_count where total_data > 0)

//     // Price calculations only for buckets with total_data > 0
//     const sumPriceRP = allChildBuckets.reduce((sum, bucket) =>
//       sum + ((bucket.total_data?.value || 0) > 0 ? (bucket.price_rp?.value || 0) : 0), 0);
//     const diameterPriceRP = allChildBuckets.reduce((sum, bucket) =>
//       sum + ((bucket.total_data?.value || 0) > 0 ? 1 : 0), 0);

//     const sumPriceSP = allChildBuckets.reduce((sum, bucket) =>
//       sum + ((bucket.total_data?.value || 0) > 0 ? (bucket.price_sp?.value || 0) : 0), 0);
//     const diameterPriceSP = allChildBuckets.reduce((sum, bucket) =>
//       sum + ((bucket.total_data?.value || 0) > 0 ? 1 : 0), 0);

//     const rollup = {
//       osa: dataCountSum > 0 ? (totalDataSum / dataCountSum) * 100 : 0,
//       price_rp: diameterPriceRP > 0 ? sumPriceRP / diameterPriceRP : 0,
//       price_sp: diameterPriceSP > 0 ? sumPriceSP / diameterPriceSP : 0,
//       sum_price_rp: sumPriceRP,
//       sum_price_sp: sumPriceSP,
//     };

//     rollup.price_variation =
//       rollup.sum_price_rp > 0
//         ? ((rollup.sum_price_rp - rollup.sum_price_sp) / rollup.sum_price_rp) * 100
//         : 0;

//     return {
//       id: nodeId,
//       ...currentValues,
//       metrics: rollup,
//       children,
//       _buckets: allChildBuckets
//     };
//   });
// };

/**
 * @param {Array} buckets - Elasticsearch aggregation buckets
 * @param {Array} fields - Hierarchy field order, e.g. ["region","state","city"]
 * @param {number} level - Current recursion depth
 * @param {Object} parentValues - Parent field key-values
 * @param {string} idPrefix - Unique prefix
 * @param {Array} filters - Array of filters, e.g.
 *   [
 *     { field: "osa", operator: ">", value: 60 },
 *     { field: "price_rp", operator: "<", value: 100 }
 *   ]
 * @param {string} logic - "AND" | "OR" (how multiple filters are combined)
 */
const buildHierarchy = (
  buckets,
  fields,
  level = 0,
  parentValues = {},
  idPrefix = "",
  filters = [],
  logic = "AND",
  nd_pf_darkstore_coverage = {}
) => {
  if (!buckets || !fields || fields.length === 0) return [];

  const grouped = {};
  for (const b of buckets) {
    const key = b.key?.[fields[level]] ?? "Unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  }

  const checkFilter = (metrics) => {
    if (!filters || filters.length === 0) return true;

    const results = filters.map((filter) => {
      const { field, operator, value } = filter;
      const metricValue = metrics[field];
      if (metricValue === undefined) return true; // ignore unknown metric

      switch (operator) {
        case ">":
          return metricValue > value;
        case ">=":
          return metricValue >= value;
        case "<":
          return metricValue < value;
        case "<=":
          return metricValue <= value;
        case "between":
          return metricValue >= value[0] && metricValue <= value[1];
        case "notIn":
          if (Array.isArray(value)) return !value.includes(metricValue);
          if (typeof value === "object" && value.min !== undefined && value.max !== undefined)
            return metricValue < value.min || metricValue > value.max;
          return true;
        default:
          return true;
      }
    });

    return logic === "AND" ? results.every(Boolean) : results.some(Boolean);
  };

  const nodes = Object.entries(grouped)
    .map(([key, group], idx) => {
      const currentValues = { ...parentValues, [fields[level]]: key };
      const nodeId = `${idPrefix}-${level}-${idx}-${key}`.replace(/\s+/g, "_");

      // 🟩 LEAF LEVEL — compute metrics
      if (level === fields.length - 1) {
        const totalDataSum = group.reduce(
          (sum, b) => sum + (b.total_data?.value || 0),
          0
        );
        const dataCountSum = group.reduce(
          (sum, b) => sum + (b.data_count?.value || 0),
          0
        );

        const sumPriceRP = group.reduce(
          (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? (b.sum_price_rp?.value || 0) : 0),
          0
        );

        const osa_in_stock_count = group.reduce(
          (sum, b) => sum + b.osa_in_stock_count?.value,
          0
        );
        // const diameterPriceRP = group.reduce(
        //   (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? 1 : 0),
        //   0
        // );
        const sumPriceSP = group.reduce(
          (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? (b.sum_price_sp?.value || 0) : 0),
          0
        );

        // const diameterPriceSP = group.reduce(
        //   (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? 1 : 0),
        //   0
        // );

        const nestle_nd_sum = group.reduce(
          (sum, b) => sum + (b.nestle_nd_total_data?.value || 0),
          0
        );
        const nestle_nd_total = group.reduce(
          (sum, b) => sum + (b.nestle_nd_data_count?.value || 0),
          0
        );

        const group_pf_platform = group?.[0]?.key?.["platform"] ?? null;

        const metrics = {
          nestle_nd_osa: nestle_nd_total > 0 ? `${nestle_nd_sum} / ${nestle_nd_total}` : null,
          nestle_nd_osa_darkstore_coverage: nd_pf_darkstore_coverage?.[group_pf_platform] ?? null,
          nd_osa: `${totalDataSum} / ${dataCountSum}`,
          osa: dataCountSum > 0 ? (totalDataSum / dataCountSum) * 100 : 0,
          osa_in_stock_count: osa_in_stock_count,
          price_rp: osa_in_stock_count > 0 ? sumPriceRP / osa_in_stock_count : 0,
          price_sp: osa_in_stock_count > 0 ? sumPriceSP / osa_in_stock_count : 0,
          sum_price_rp: sumPriceRP,
          sum_price_sp: sumPriceSP,
          wt_osa: group?.[0]?.wt_osa?.value ?? null,
          // sum_price_rp1: sumPriceRP1,
          // sum_price_sp1: sumPriceSP1,
        };

        metrics.price_variation =
          metrics.sum_price_rp > 0
            ? ((metrics.sum_price_rp - metrics.sum_price_sp) / metrics.sum_price_rp) * 100
            : 0;

        // ✅ Apply multiple filters
        if (!checkFilter(metrics)) return null;

        return { id: nodeId, ...currentValues, metrics, _buckets: group };
      }

      // 🟨 RECURSIVE: build next level
      const children = buildHierarchy(
        group,
        fields,
        level + 1,
        currentValues,
        nodeId,
        filters,
        logic,
        nd_pf_darkstore_coverage
      ).filter(Boolean);

      if (children.length === 0) return null;

      // 🟦 Roll up metrics from kept children
      const allChildBuckets = children.flatMap((c) => c._buckets || []);
      const totalDataSum = allChildBuckets.reduce(
        (sum, b) => sum + (b.total_data?.value || 0),
        0
      );
      const dataCountSum = allChildBuckets.reduce(
        (sum, b) => sum + (b.data_count?.value || 0),
        0
      );
      // const sumPriceRP = allChildBuckets.reduce(
      //   (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? (b.price_rp?.value || 0) : 0),
      //   0
      // );
      const sumPriceRP = allChildBuckets.reduce(
        (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? (b.sum_price_rp?.value || 0) : 0),
        0
      );
      const osa_in_stock_count = allChildBuckets.reduce(
        (sum, b) => sum + b.osa_in_stock_count?.value,
        0
      );
      // const sumPriceSP = allChildBuckets.reduce(
      //   (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? (b.price_sp?.value || 0) : 0),
      //   0
      // );
      const sumPriceSP = allChildBuckets.reduce(
        (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? (b.sum_price_sp?.value || 0) : 0),
        0
      );
      // const diameterPriceSP = allChildBuckets.reduce(
      //   (sum, b) => sum + ((b.total_data?.value || 0) > 0 ? 1 : 0),
      //   0
      // );

      const rollup = {
        nd_osa: `${totalDataSum} / ${dataCountSum}`,
        osa: dataCountSum > 0 ? (totalDataSum / dataCountSum) * 100 : 0,
        osa_in_stock_count: osa_in_stock_count,
        price_rp: osa_in_stock_count > 0 ? sumPriceRP / osa_in_stock_count : 0,
        price_sp: osa_in_stock_count > 0 ? sumPriceSP / osa_in_stock_count : 0,
        sum_price_rp: sumPriceRP,
        sum_price_sp: sumPriceSP

        // sum_price_rp1: sumPriceRP1,
        // sum_price_sp1: sumPriceSP1,
      };

      rollup.price_variation =
        rollup.sum_price_rp > 0
          ? ((rollup.sum_price_rp - rollup.sum_price_sp) / rollup.sum_price_rp) * 100
          : 0;
      // rollup.price_variation =
      //   rollup.sum_price_rp1 > 0
      //     ? ((rollup.sum_price_rp1 - rollup.sum_price_sp1) / rollup.sum_price_rp1) * 100
      //     : 0;

      return {
        id: nodeId,
        ...currentValues,
        metrics: rollup,
        children,
        _buckets: allChildBuckets,
      };
    })
    .filter(Boolean);

  return nodes;
};

const flattenHierarchy = (nodes, level = 0) => {
  if (!nodes || !Array.isArray(nodes)) return [];

  let rows = [];

  for (const node of nodes) {
    if (!node) continue;

    let currentNode = node;
    let currentLevel = level;

    // Keep collapsing while the current node has exactly one child
    while (currentNode.children?.length === 1) {
      const onlyChild = currentNode.children[0];
      if (!onlyChild) break;

      currentNode = {
        ...onlyChild,
        ...currentNode, // Keep original parent properties
        id: currentNode.id, // Keep parent ID for consistency
        children: onlyChild.children, // But keep child's children
        metrics: onlyChild.metrics || currentNode.metrics, // Prefer child's metrics
      };
    }

    // Now push the final node after all collapsing
    rows.push({ node: currentNode, level: currentLevel });

    // Process children if any exist after collapsing
    if (currentNode.children && currentNode.children.length > 0) {
      rows = rows.concat(flattenHierarchy(currentNode.children, currentLevel + 1));
    }
  }

  return rows;
};
const decimalValueManager = (val) => {
  if (val == undefined || isNaN(val) || val === null || val === "") {
    return val;
  }

  const strVal = String(val);
  const [intPart, decPart = ""] = strVal.split(".");

  if (intPart.length > 2) {
    return Math.round(val);
  } else if (intPart.length > 1) {
    return intPart + (decPart.length > 0 ? `.${decPart.substring(0, 1)}` : "");
  } else {
    return intPart + (decPart.length > 0 ? `.${decPart.substring(0, 2)}` : "");
  }
}
const getHeaderIcon = (icon) => {
  switch (icon) {
    case "rupee":
      return "₹ ";
    default:
      return (icon) ? icon + " " : "";
  }
}
const showValue = (col, value) => {
  return <>{value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}{decimalValueManager(value)}{value != undefined && col?.subValue ? col?.subValue : ""}{value != undefined && col?.persentageValue ? "%" : ""}</>

}

// Table row renderer with improved styling
const TableRow = ({ node, selectedFields, matrix, level }) => {
  return (
    <>
      {selectedFields.map((field, idx) => (
        <td
          key={`${node.id}-${field.value}-${idx}`}

          className={`group !min-w-[200px] !max-w-[200px]  border px-3 py-1 ${idx === 0 ? "sticky-column-0" : ""}
                                               
                                                text-left
                                            `}
        >
          <div className="flex justify-start">
            <div className="truncate" title={node[field.value] ?? "-"}>
              {idx < level ? "" : (node[field.value] ?? "All")}
            </div>
            {node[field.value] &&
              <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(node[field.value])) }}> <IoMdCopy /></span>}
          </div>
        </td>
      ))}
      {matrix?.map((field, idx) => {
        const rawVal = node?.metrics?.[field.value];

        const isNumber = typeof rawVal === "number";

        const hasRealValue =
          rawVal !== null &&
          rawVal !== undefined &&
          (isNumber
            ? rawVal > 0 || field.value === "osa" || field.value === "price_variation"
            : Boolean(rawVal));

        const displayValue = hasRealValue ? showValue(field, rawVal) : "-";

        return (
          <td
            key={`${node.id}-metric-${idx}`}
            className="group !min-w-[150px] !max-w-[150px] border px-3 py-1 text-center"
          >
            <p className="flex justify-center">
              <span>{displayValue}</span>
              {hasRealValue && (
                <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center">
                  <IoMdCopy
                    onClick={(e) => copyToClipboard(e, getTextFromReactNode(displayValue))}
                  />
                </span>
              )}

            </p>
          </td>
        );
      })}

      {/* {matrix?.map((field, idx) => (
        <td
          key={`${node.id}-metric-${idx}`}

          className={`!min-w-[150px] !max-w-[150px] 
                                                border px-3 py-1 text-center
                                               `}
        >
          <p className="flex justify-start">
          <span>
          {node?.metrics?.[field.value] !== null && node?.metrics?.[field.value] !== undefined
            ? typeof node.metrics[field.value] === 'number'
              ? (node?.metrics?.[field.value] > 0 || field.value == "osa"||field.value == "price_variation") ? showValue(field, node?.metrics?.[field.value]) : "-"
              : node?.metrics?.[field.value] ? showValue(field, node?.metrics?.[field.value]) : "-"
            : "-"}
          </span>
          {node?.metrics?.[field.value] !== null && node?.metrics?.[field.value] !== undefined
            ? typeof node.metrics[field.value] === 'number'
              ? (node?.metrics?.[field.value] > 0 || field.value == "osa"||field.value == "price_variation") ? (<span className="cursor-pointer" onClick={(e) => { copyToClipboard(e, product?.[activeTab]?.value) }}><IoMdCopy /></span>) : "-"
              : node?.metrics?.[field.value] ? (<span className="cursor-pointer" onClick={(e) => { copyToClipboard(e, product?.[activeTab]?.value) }}><IoMdCopy /></span>) : "-"
            : "-"}
          </p>
        </td>
      ))} */}
    </>
  );
};

const DarkStoreComprehensiveBreakdownTable = () => {
  const { kpi, selectedFilters, filtersDarkStore, clientCustomizeColumnsComprehensiveBreakdown, activeClientProject } =
    useEbuxContext();

  // Memoized metrics calculation
  const metrics = useMemo(() => {
    const breakdownColumns = clientCustomizeColumnsComprehensiveBreakdown?.breakdown?.columns
      ?.filter((i) => i?.allowInDarkStore && i?.allowKPI?.includes(kpi) && !i?.isDisabled)
      ?.map((i) => ({
        ...i,
        label: i?.title,
        id: i?.value,
        checked: true,
        disabled: i?.isDisabled,
        type: "breakdown"
      })) ?? [];

    const parameterColumns = clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns
      ?.filter((i) => i?.allowInDarkStore && i?.allowKPI?.includes(kpi) && !i?.isDisabled)
      ?.map((i) => ({
        ...i,
        label: i?.title,
        id: i?.value,
        checked: true,
        disabled: i?.isDisabled,
        type: "parameters"
      })) ?? [];

    return [...breakdownColumns, ...[
      {
        persentageValue: false,
        title: "Location (Region)",
        type: "breakdown",
        value: "region",
        key: "region",
        breakdown: "",
        allowKPI: ['OSA', 'CS', 'PRO', 'RR'],
        notAllowWithIsValueIn: [],
        allowWithIsValueIn: []
      },
      {
        persentageValue: false,
        title: "Location (State)",
        type: "breakdown",
        value: "state",
        key: "state",
        breakdown: "",
        allowKPI: ['OSA', 'CS', 'PRO', 'RR'],
        notAllowWithIsValueIn: [],
        allowWithIsValueIn: []
      },
      {
        persentageValue: false,
        title: "Location (City)",
        type: "breakdown",
        value: "location",
        key: "location_city",
        breakdown: "Location",
        allowKPI: ['OSA', 'CS', 'PRO', 'RR', 'SOS', 'OR'],
        notAllowWithIsValueIn: ["rating_value", "review_count"],
        allowWithIsValueIn: []
      },
      {
        "persentageValue": false,
        "title": "Dark Store",
        "type": "breakdown",
        "value": "dark_store",
        "key": "dark_store",
        "breakdown": "dark_store",
        "allowKPI": [
          "OSA",
          "CS",
          "PRO",
          "RR"
        ],
        "notAllowWithIsValueIn": [],
        "allowWithIsValueIn": [],
        // "isDisabled": true,
        // "remove": false,
        // "drag": false,
        "align": "left"
      },

    ], ...parameterColumns];
  }, [clientCustomizeColumnsComprehensiveBreakdown, kpi]);

  const [data, setData] = useState(null);
  const [tabColumnList, setTabColumnList] = useState({});
  const [selectedTabName] = useState("comprehensive");
  const [defaultfixedColumns, setDefaultFixedColumns] = useState([...metrics.filter((i) => i?.type === "breakdown" && i?.value == "dark_store") ?? [], ...metrics.filter((i) => i?.type === "parameters" && ["nestle_nd_osa", "nestle_nd_osa_darkstore_coverage"].indexOf(i.value) == -1) ?? []]);
  const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrderedColumns = useCallback(() => {
    const orderedColumnConfigs = tabColumnList[selectedTabName] || [];
    if (orderedColumnConfigs.length > 0) {
      return orderedColumnConfigs.map((config) => ({
        ...config,
        label: config.title,
        align: config?.align ?? "center",
        sortable: true,
      }));
    }
    return defaultfixedColumns ?? metrics ?? []; // Fallback to default metrics if no customized columns
  }, [tabColumnList, selectedTabName, metrics]);

  const orderedColumns = getOrderedColumns();
  const breakdownFields = useMemo(() => (orderedColumns?.filter((c) => c?.type === "breakdown") || []), [metrics, tabColumnList[selectedTabName]]);
  const parameterFields = useMemo(() => (orderedColumns?.filter((c) => c?.type === "parameters") || []), [metrics, tabColumnList[selectedTabName]]);
  const [matrixfilters, setMatrixfilters] = useState([]);
  //[
  //   { field: "osa", operator: ">", value: 60 },
  //   { field: "price_rp", operator: "<", value: 100 }
  // ];
  const matrixfiltersType = "AND";//??"OR";
  useEffect(() => {
    if (tabColumnList[selectedTabName]?.length > 0) {
      setDefaultFixedColumns(tabColumnList[selectedTabName]);
    }
  }, [tabColumnList, selectedTabName]);

  // Fetch data effect
  useEffect(() => {
    const fetchAllBuckets = async () => {
      if (breakdownFields?.length === 0) {
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let allBuckets = [];
        let afterKey = null;
        let nd_pf_darkstore_coverage = {};
        if (parameterFields.map((c) => c.value).indexOf("nestle_nd_osa_darkstore_coverage") > -1) {

          const data = await fetchNDPFDarkStoreCoverage({
            kpi,
            selectedFilters,
            filters: filtersDarkStore,
          });
          nd_pf_darkstore_coverage = data?.pf_darkstore_coverage || {};
        }

        do {
          const payload = {
            kpi,
            breakdown: breakdownFields.map((c) => c.value),
            matrix: parameterFields.map((c) => c.value) ?? [
              "osa",
              "price_variation",
              "price_rp", "price_sp"],
            selectedFilters,
            filters: filtersDarkStore,
            after_key: afterKey
          };

          const response = await fetchDarkStoreComprehensiveBreakdownTableData(payload);
          const aggs = response?.response || response || {};
          const buckets = aggs.child_group?.buckets || [];
          allBuckets = allBuckets.concat(buckets);
          afterKey = aggs.child_group?.after_key || null;
        } while (afterKey);

        // const hierarchy = buildHierarchy(
        //   allBuckets,
        //   breakdownFields.map((f) => f.value)
        // );
        const hierarchy = buildHierarchy(
          allBuckets,
          breakdownFields.map((f) => f.value),
          0, {}, "", matrixfilters, matrixfiltersType,
          nd_pf_darkstore_coverage
        );

        // Calculate parent metrics only if we have valid data
        // let parentMetrics = null;
        // if (hierarchy.length > 0) {
        //   const validNodes = hierarchy.filter(node => node.metrics);
        //   if (validNodes.length > 0) {
        //     parentMetrics = {
        //       osa: validNodes.reduce((s, c) => s + (c.metrics?.osa || 0), 0) / validNodes.length,
        //       price_sp: validNodes.reduce((s, c) => s + (c.metrics?.price_sp || 0), 0) / validNodes.length,
        //       price_rp: validNodes.reduce((s, c) => s + (c.metrics?.price_rp || 0), 0) / validNodes.length,
        //     };
        //     parentMetrics.price_variation =
        //       parentMetrics.price_rp > 0
        //         ? ((parentMetrics.price_rp - parentMetrics.price_sp) / parentMetrics.price_rp) * 100
        //         : 0;
        //   }
        // }
        // Calculate parent metrics from all buckets
        let parentMetrics = null;
        if (allBuckets.length > 0) {

          const checkFilter = (metrics) => {
            if (!matrixfilters || matrixfilters.length === 0) return true;

            const results = matrixfilters.map((filter) => {
              const { field, operator, value } = filter;
              const metricValue = metrics?.[field]?.value;

              if (metricValue === undefined) return true; // ignore unknown metric

              switch (operator) {
                case ">":
                  return metricValue > value;
                case ">=":
                  return metricValue >= value;
                case "<":
                  return metricValue < value;
                case "<=":
                  return metricValue <= value;
                case "between":
                  return metricValue >= value[0] && metricValue <= value[1];
                case "notIn":
                  if (Array.isArray(value)) return !value.includes(metricValue);
                  if (typeof value === "object" && value.min !== undefined && value.max !== undefined)
                    return metricValue < value.min || metricValue > value.max;
                  return true;
                default:
                  return true;
              }
            });

            return matrixfiltersType === "AND" ? results.every(Boolean) : results.some(Boolean);
          };
          const allBucketsAfterFilter = allBuckets?.filter(bucket => checkFilter(bucket));
          // OSA calculation for parent
          const totalDataSum = allBucketsAfterFilter.reduce((sum, bucket) => sum + (bucket.total_data?.value || 0), 0);
          const dataCountSum = allBucketsAfterFilter.reduce((sum, bucket) => sum + (bucket.data_count?.value || 0), 0);

          // Price calculations only for buckets with osa > 0
          // const validBuckets = allBucketsAfterFilter.filter(bucket => bucket.osa?.value > 0);
          // // OSA calculation for parent
          // const totalDataSum = allBuckets.reduce((sum, bucket) => sum + (bucket.total_data?.value || 0), 0);
          // const dataCountSum = allBuckets.reduce((sum, bucket) => sum + (bucket.data_count?.value || 0), 0);

          // // Price calculations only for buckets with osa > 0
          // const validBuckets = allBuckets.filter(bucket => bucket.osa?.value > 0);
          const osa_in_stock_count = allBucketsAfterFilter.reduce((sum, bucket) => sum + bucket.osa_in_stock_count?.value, 0);
          const sumPriceRP = allBucketsAfterFilter.reduce((sum, bucket) => sum + bucket.sum_price_rp?.value, 0);
          const sumPriceSP = allBucketsAfterFilter.reduce((sum, bucket) => sum + bucket.sum_price_sp?.value, 0);
          // const sumPriceRP = validBuckets.reduce((sum, bucket) => sum + (bucket.sum_price_rp?.value || 0), 0);
          // const sumPriceSP = validBuckets.reduce((sum, bucket) => sum + (bucket.sum_price_sp?.value || 0), 0);
          // const sumPriceRP1 = validBuckets.reduce((sum, bucket) => sum + (bucket.sum_price_rp?.value || 0), 0);
          // const sumPriceSP1 = validBuckets.reduce((sum, bucket) => sum + (bucket.sum_price_sp?.value || 0), 0);

          parentMetrics = {
            nd_osa: `${totalDataSum} / ${dataCountSum}`,
            osa: dataCountSum > 0 ? (totalDataSum / dataCountSum) * 100 : 0,
            price_rp: osa_in_stock_count > 0 ? sumPriceRP / osa_in_stock_count : 0,
            price_sp: osa_in_stock_count > 0 ? sumPriceSP / osa_in_stock_count : 0,
            sum_price_rp: sumPriceRP,
            sum_price_sp: sumPriceSP,
            // sum_price_rp1: sumPriceRP1,
            // sum_price_sp1: sumPriceSP1,
          };

          parentMetrics.price_variation =
            parentMetrics.sum_price_rp > 0
              ? ((parentMetrics.sum_price_rp - parentMetrics.sum_price_sp) / parentMetrics.sum_price_rp) * 100
              : 0;
          // parentMetrics.price_variation =
          //   parentMetrics.sum_price_rp1 > 0
          //     ? ((parentMetrics.sum_price_rp1 - parentMetrics.sum_price_sp1) / parentMetrics.sum_price_rp1) * 100
          //     : 0;
        }


        setData({ hierarchy, parentMetrics });
      } catch (err) {
        console.error("Error fetching table data:", err);
        setError("Failed to load table data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBuckets();
  }, [breakdownFields, matrixfilters, selectedFilters]);

  // Calculate unique counts for footer
  const uniqueCounts = useMemo(() => {
    if (!data?.hierarchy) return [];

    return breakdownFields.map((f) => {
      const values = new Set();
      const traverse = (node) => {
        if (node && node[f.value]) values.add(node[f.value]);
        node?.children?.forEach(traverse);
      };
      data.hierarchy.forEach(traverse);
      return values.size;
    });
  }, [data?.hierarchy, breakdownFields]);

  // Virtualization setup
  const rowHeight = 42; // Increased for better spacing
  const tableHeight = 400; // Increased height
  const [scrollTop, setScrollTop] = useState(0);

  const flatData = useMemo(() =>
    data ? flattenHierarchy(data.hierarchy) : [],
    [data]
  );

  const [sortedCols, setSortedCols] = React.useState({ current_key: "" });

  const sortedData = useMemo(() => {
    if (!sortedCols.current_key) return flatData;

    const key = sortedCols.current_key;

    return [...flatData].sort((a, b) => {
      // let valA = a.node?.metrics?.[key] ?? "";
      // let valB = b.node?.metrics?.[key] ?? "";
      let valA = a.node?.metrics?.[key] ?? a.node?.[key] ?? "";
      let valB = b.node?.metrics?.[key] ?? b.node?.[key] ?? "";

      const numA = parseFloat(valA);
      const numB = parseFloat(valB);

      const isNumA = !isNaN(numA);
      const isNumB = !isNaN(numB);

      // Both numbers
      if (isNumA && isNumB) {
        return sortedCols[key] ? numA - numB : numB - numA;
      }

      // One number, one string → numbers first
      if (isNumA && !isNumB) return sortedCols[key] ? -1 : 1;
      if (!isNumA && isNumB) return sortedCols[key] ? 1 : -1;

      // Both strings
      return sortedCols[key]
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [flatData, sortedCols]);

  const handleSort = (key) => {
    setSortedCols((prev) => ({
      ...prev,
      [key]: !prev?.[key],
      current_key: key,
    }));
  };


  const totalRows = sortedData.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight));
  const endIndex = Math.min(totalRows - 1, Math.floor((scrollTop + tableHeight) / rowHeight));
  const visibleRows = sortedData.slice(startIndex, endIndex + 1);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);



  if (error) {
    return (
      <div className="bg-white px-6 py-4 rounded-lg mt-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-40">
          <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
          </div>
        </div>
      </div>
    );
  }


  const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);

  useEffect(() => {
    const columns = getOrderedColumns();
    // console.log('tabColumnList',tabColumnList,selectedTabName)
    if (_.size(columns)) {
      const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
      tagFilter.children = [];
      const updatedArray = searchFilterArray.map((ele) => {
        // console.log('ele.key',ele.key)
        if (ele.key === "metric") {
          for (const e of columns) {
            if (e.type == "parameters" && e.value != 'nd_osa') {
              ele.children.push({
                label: e?.title,
                key: e?.value,
                persentageValue: e?.persentageValue ?? false,
                action: FILTERACTION.METRIC,
              });
            }
          }
        }
        return ele;
      });
      setSearchFilterArray(updatedArray);
    }
  }, [JSON.stringify(tabColumnList?.[selectedTabName])]);

  const [breakdownFilters, setBreakdownFilters] = useState({});
  const applyBreakdownFilters = (sFilters, current) => {
    setBreakdownFilters((prevFilters) => {
      return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
    });
  };
  useEffect(() => {
    const value = breakdownFilters?.["metric"]?.map((f) => {
      let operator;
      let value;

      switch (f.condition) {
        case "is_greater_than":
          operator = ">";
          value = parseFloat(f.value.replace("%", ""));
          break;
        case "is_less_than":
          operator = "<";
          value = parseFloat(f.value.replace("%", ""));
          break;
        case "is_greater_or_equal":
          operator = ">=";
          value = parseFloat(f.value.replace("%", ""));
          break;
        case "is_less_or_equal":
          operator = "<=";
          value = parseFloat(f.value.replace("%", ""));
          break;
        case "is_between":
          operator = "between";
          value = f.value
            .split(",")
            .map((v) => parseFloat(v.replace("%", "")));
          break;
        case "is_not_in":
          operator = "notIn";
          if (f.value.includes(",")) {
            value = f.value.split(",").map((v) => parseFloat(v.replace("%", "")));
          } else {
            const [min, max] = f.value.split("-").map((v) => parseFloat(v.replace("%", "")));
            value = { min, max };
          }
          break;
        default:
          operator = "=";
          value = f.value;
      }

      return {
        field: f.key,
        operator,
        value,
      };
    });
    if (value?.length) {
      setMatrixfilters(value);
    } else {
      setMatrixfilters([]);
    }
  }, [JSON.stringify(breakdownFilters)]);


  // const handleDownload = async () => {
  //   console.log('sortedDatasortedDatasortedData',sortedData)
  //   // Use whichever flattened data you want to export (flatData / sortedData)
  //   const rowsToExport = sortedData ?? flatData ?? []; // sortedData is used if you want sorted output
  //   if (!rowsToExport || rowsToExport.length === 0) {
  //     // nothing to export
  //     return;
  //   }

  //   const workbook = new Excel.Workbook();

  //   // rows per sheet before creating a new one (tune if needed)
  //   const MAX_ROWS_PER_SHEET = 80000;

  //   // Build headers from breakdownFields and parameterFields
  //   // breakdownFields and parameterFields are available in this component
  //   const breakdownHeaders = (breakdownFields || []).map((f) => ({
  //     title: f.title,
  //     value: f.value,
  //     isPercent: false,
  //     orig: f
  //   }));

  //   const parameterHeaders = (parameterFields || []).map((f) => ({
  //     title: f.title,
  //     value: f.value,
  //     // decide percent by property persentageValue or by metric name (osa/price_variation)
  //     isPercent: !!f?.persentageValue || f.value === "osa" || f.value === "price_variation",
  //     orig: f
  //   }));

  //   const headers = [...breakdownHeaders, ...parameterHeaders];

  //   // helper: convert column index to letter
  //   // const colLetter = (col) => {
  //   //   let s = "";
  //   //   while (col > 0) {
  //   //     const mod = (col - 1) % 26;
  //   //     s = String.fromCharCode(65 + mod) + s;
  //   //     col = Math.floor((col - 1) / 26);
  //   //   }
  //   //   return s;
  //   // };

  //   let sheetIndex = 0;
  //   let worksheet = null;
  //   let currentRowNumber = 1;

  //   const createNewSheet = () => {
  //     sheetIndex++;
  //     const name = sheetIndex === 1 ? "Comprehensive Data" : `Comprehensive Data (${sheetIndex})`;
  //     const ws = workbook.addWorksheet(name);

  //     // Add header row
  //     const headerTitles = headers.map(h => h.title);
  //     ws.addRow(headerTitles);
  //     const headerRow = ws.getRow(1);
  //     headerRow.font = { bold: true };
  //     headerRow.alignment = { vertical: "middle", horizontal: "center" };
  //     headerRow.eachCell(cell => {
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" }
  //       };
  //     });

  //     currentRowNumber = 2;
  //     return ws;
  //   };

  //   // start first sheet
  //   worksheet = createNewSheet();

  //   // iterate over the flattened rows (each element: { node, level })
  //   for (let i = 0; i < rowsToExport.length; i++) {
  //     const { node } = rowsToExport[i];

  //     // If adding this row would exceed sheet capacity, create a new sheet
  //     if (currentRowNumber + 1 > MAX_ROWS_PER_SHEET) {
  //       worksheet = createNewSheet();
  //     }

  //     // build row values in order of headers
  //     const rowValues = headers.map((h) => {
  //       // For breakdown columns, values are on node itself (e.g., node.region, node.state, node.dark_store)
  //       if ((breakdownFields || []).some(b => b.value === h.value)) {
  //         // prefer node[field] else fallback to "All"
  //         return node?.[h.value] ?? "All";
  //       }

  //       // For parameter columns, values are under node.metrics
  //       const metricVal = node?.metrics?.[h.value];

  //       if (metricVal === undefined || metricVal === null) return "-";

  //       // If metric is percent, append % and keep as string
  //       if (h.isPercent) {
  //         // ensure numeric formatting trimmed to reasonable decimals
  //         const num = Number(metricVal);
  //         if (!Number.isNaN(num)) {
  //           // format up to 2 decimals, but remove trailing zeros
  //           const formatted = parseFloat(num.toFixed(2)).toString();
  //           return `${formatted}%`;
  //         }
  //         return `${metricVal}%`;
  //       }

  //       // Not percent: if numeric, return number (so Excel sees numeric type)
  //       const asNum = Number(metricVal);

  //       if (!Number.isNaN(asNum)) {
  //           if (h.value === "price_rp" || h.value === "price_sp") {
  //             return Math.round(asNum); // ROUND MRP / SP to nearest integer
  //           }
  //           return asNum;
  //         }

  //       // fallback string
  //       return metricVal;
  //     });

  //     // Add row and apply basic cell borders
  //     const added = worksheet.addRow(rowValues);
  //     added.eachCell((cell) => {
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" }
  //       };
  //       // Align numeric values to center-right
  //       if (typeof cell.value === "number") {
  //         cell.alignment = { horizontal: "right", vertical: "middle" };
  //       } else {
  //         cell.alignment = { horizontal: "left", vertical: "middle" };
  //       }
  //     });

  //     currentRowNumber++;
  //   }

  //   // Auto-adjust column widths for every sheet
  //   workbook.eachSheet((ws) => {
  //     ws.columns.forEach((col, i) => {
  //       // .values is 1-indexed (first element is header)
  //       const maxLength = ws.getColumn(i + 1).values.reduce((acc, v) => {
  //         const val = v == null ? "" : String(v);
  //         return Math.max(acc, val.length);
  //       }, 10);
  //       col.width = Math.min(60, Math.max(12, maxLength + 2));
  //     });
  //   });

  //   // Generate workbook and trigger download
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `comprehensive_breakdown_${Date.now()}.xlsx`;
  //   link.click();
  //   URL.revokeObjectURL(link.href);
  // };



  const handleDownload = async () => {
    const rowsToExport = sortedData ?? flatData ?? [];
    if (!rowsToExport || rowsToExport.length === 0) return;

    const workbook = new Excel.Workbook();
    const MAX_ROWS_PER_SHEET = 80000;

    const breakdownHeaders = (breakdownFields || []).map((f) => ({
      title: f.title,
      value: f.value,
      isPercent: false,
      orig: f
    }));

    const parameterHeaders = (parameterFields || []).map((f) => ({
      title: f.title,
      value: f.value,
      isPercent: !!f?.persentageValue || f.value === "osa" || f.value === "price_variation",
      orig: f
    }));

    const headers = [...breakdownHeaders, ...parameterHeaders];
    const headerTitles = headers.map(h => h.title);

    const darkStoreField = breakdownHeaders.find(b => b.value === "dark_store") || breakdownHeaders[0];
    const darkStoreColIndex = headers.findIndex(h => h.value === (darkStoreField?.value)) + 1; // 1-indexed for exceljs

    let sheetIndex = 0;
    let worksheet = null;
    let currentRowNumber = 1;

    const createNewSheet = () => {
      sheetIndex++;
      const name = sheetIndex === 1 ? "Comprehensive Data" : `Comprehensive Data (${sheetIndex})`;
      const ws = workbook.addWorksheet(name);

      ws.addRow(headerTitles);
      const headerRow = ws.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.eachCell(cell => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      currentRowNumber = 2;
      return ws;
    };

    worksheet = createNewSheet();

    const grouped = rowsToExport.reduce((acc, item) => {
      const dsVal = item.node?.[darkStoreField?.value] ?? "Unknown";
      if (!acc[dsVal]) acc[dsVal] = [];
      acc[dsVal].push(item.node);
      return acc;
    }, {});

    const darkStoreNames = Object.keys(grouped);

    for (const dsName of darkStoreNames) {
      const nodes = grouped[dsName] || [];

      if (currentRowNumber + nodes.length > MAX_ROWS_PER_SHEET) {
        worksheet = createNewSheet();
      }

      const startRow = currentRowNumber;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        const rowValues = headers.map((h) => {
          if (breakdownHeaders.some(b => b.value === h.value)) {
            if (h.value === darkStoreField?.value) {
              return i === 0 ? (node?.[h.value] ?? "All") : ""; // first row gets value (we'll also set merged cell after)
            }
            return node?.[h.value] ?? "All";
          }

          // parameter columns come from node.metrics
          const metricVal = node?.metrics?.[h.value];
          if (metricVal === undefined || metricVal === null) return "-";

          if (h.isPercent) {
            const num = Number(metricVal);
            if (!Number.isNaN(num)) {
              const formatted = parseFloat(num.toFixed(2)).toString();
              return `${formatted}%`;
            }
            return `${metricVal}%`;
          }

          const asNum = Number(metricVal);
          // if (!Number.isNaN(asNum)) return asNum;
          if (!Number.isNaN(asNum)) {
            if (h.value === "price_rp" || h.value === "price_sp") {
              return Math.round(asNum); // ROUND MRP / SP to nearest integer
            }
            return asNum;
          }
          return metricVal;
        });

        // Add row to worksheet
        const added = worksheet.addRow(rowValues);
        added.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
          if (typeof cell.value === "number") {
            cell.alignment = { horizontal: "right", vertical: "middle" };
          } else {
            cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
          }
        });

        currentRowNumber++;
      }

      const endRow = currentRowNumber - 1;

      const colLetter = (col) => {
        let s = "";
        while (col > 0) {
          const mod = (col - 1) % 26;
          s = String.fromCharCode(65 + mod) + s;
          col = Math.floor((col - 1) / 26);
        }
        return s;
      };
      const dsColLetter = colLetter(darkStoreColIndex);

      worksheet.getCell(`${dsColLetter}${startRow}`).value = dsName;
      worksheet.getCell(`${dsColLetter}${startRow}`).alignment = { vertical: "middle", horizontal: "left", wrapText: true };

      if (endRow > startRow) {
        worksheet.mergeCells(`${dsColLetter}${startRow}:${dsColLetter}${endRow}`);
        // Apply border and alignment to merged region
        const masterCell = worksheet.getCell(`${dsColLetter}${startRow}`);
        masterCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      }
    }

    // Auto-adjust column widths for every sheet
    workbook.eachSheet((ws) => {
      ws.columns.forEach((col, i) => {
        const maxLength = ws.getColumn(i + 1).values.reduce((acc, v) => {
          const val = v == null ? "" : String(v);
          return Math.max(acc, val.length);
        }, 10);
        col.width = Math.min(60, Math.max(12, maxLength + 2));
      });
    });

    // Generate workbook and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `comprehensive_breakdown_${Date.now()}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const [openMFilter, setOpenMFilter] = useState(null);
  const addFilterFor = (e, headerValue) => {
    e.stopPropagation()
    setOpenMFilter(headerValue)
  }
  return (
    <div className="bg-white px-6 py-4 rounded-lg mt-4 shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg text-gray-800">Comprehensive Breakdown</h4>

            {loading ?
              // <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center h-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              </div>
              // </div> 
              : <>
                {/* {flatData?.length} */}
              </>}

          </div>
          <p className="font-inter italic text-xs text-gray-600 mt-1" title={"Total Rows: " + flatData?.length}>
            {(selectedFilters?.calendarType == "week") ?
              <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
              :
              <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <DarkstoreComprehensiveFilter text="Filter By"
              savedSearch={{}}
              openMFilter={openMFilter}
              setOpenMFilter={setOpenMFilter}
              arr={searchFilterArray}
              additionalFilter={[]}
              applySearchFilter={applyBreakdownFilters}
              handleSaveFilters={false} />
          </div>
          <div className="flex gap-2 items-center">
            <img src="/assets/images/downloadIcon.svg" className={`w-[20px] h-[20px] ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} alt="download" onClick={loading ? undefined : handleDownload} />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            onClick={() => setCustomizeInfo({ isOpen: true, column: "" })}
          >
            <img
              src="/assets/images/columnsIcon.svg"
              className="w-5 h-5"
              alt="Customize Columns"
            />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full h-[500px] flex flex-col bg-gray-50 rounded-lg border border-gray-200">
        <div
          className="flex-1 relative overflow-hidden"
          style={{ height: tableHeight }}
        >
          {breakdownFields.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">No Columns Configured</div>
                <div className="text-sm">Click the customize button to add breakdown columns</div>
              </div>
            </div>
          ) : flatData.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">No Data Available</div>
                <div className="text-sm">Try adjusting your filters or date range</div>
              </div>
            </div>
          ) : flatData.length === 0 && loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2 flex items-center gap-2">
                  <div className="flex items-center justify-center h-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  </div>
                  Loading...
                </div>
              </div>
            </div>
          ) : (
            <div
              className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              onScroll={handleScroll}
            >
              <style>
                {`
                    .sticky-table {
                        border-collapse: separate;
                        border-spacing: 0;
                    }
                    .sticky-header {
                        position: sticky;
                        top: 0;
                        z-index: 20;
                        background: #F6F9FB;
                        border : none;
                    }
                    .sticky-footer {
                        position: sticky;
                        bottom : 0;
                        z-index: 40;
                        background: #FFFFFF;
                        border: none;
                        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
                      }
                    .sticky-column-0 {
                        position: sticky;
                        left: 0;
                        z-index: 15;
                        background: inherit;
                        border : none;
                        
                    }
                    .sticky-column-1 {
                        position: sticky;
                        left: 200px;
                        z-index: 14;
                        background: inherit;
                        border : none;
                    }
                    .sticky-column-header-0 {
                        position: sticky;
                        left: 0;
                        z-index: 25;
                        background: #F6F9FB;
                        border : none;
                    }
                    .sticky-column-header-1 {
                        position: sticky;
                        left: 200px;
                        z-index: 25;
                        background: #F6F9FB;
                        border : none;
                    }
                     .truncate {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 100%;
                    }

                    `}
              </style>
              <table className="min-w-full border-collapse table-auto">
                {/* Table Header */}
                <thead >
                  <tr>
                    {breakdownFields.map((f, idx) => (
                      <th
                        key={`header-${f.value}-${idx}`}
                        className={`!min-w-[200px] !max-w-[200px]
                                        p-4 text-sm border-none
                                        cursor-default
                                        first:rounded-l-2xl last:rounded-r-2xl
                                        text-left
                                        ${idx === 0 ? "sticky-column-header-0" : ""}
                                        sticky-header
                                    `}
                      >
                        <span
                          onClick={() => handleSort(f.value)}
                          className="cursor-pointer">
                          {f.title}
                          <FaSort className="inline h-3 w-3" />
                        </span>
                      </th>
                    ))}
                    {parameterFields.map((f, idx) => (
                      <th
                        key={`metric-header-${f.value}-${idx}`}
                        // onClick={() => handleSort(f.value)}
                        className={`!min-w-[150px] !max-w-[150px]
                                        p-4 text-sm border-none
                                        first:rounded-l-2xl last:rounded-r-2xl
                                        cursor-default
                                        text-center
                                        sticky-header
                                    `}
                      >
                        <span className="cursor-pointer" onClick={() => handleSort(f.value)}>
                          {f.title}
                          <FaSort className="inline h-3 w-3" />
                        </span>
                        <span className="cursor-pointer absolute right-2">
                          {
                            f?.value == "nd_osa"
                              ?
                              <></> :
                              f?.value == "nestle_nd_osa"
                                ?
                                <InfoTooltip text={((activeClientProject?.calendarType ?? "date") == "date") ? `This metric now calculates at day-level data, displaying dark store penetration for single-date selections and showing "-" when multiple dates are selected.` : "Regardless of the date range selected, ND (OSA) will showcase just the latest week's data at an SKU-level."} position="left" />
                                :
                                f?.value == "nestle_nd_osa_darkstore_coverage"
                                  ?
                                  <InfoTooltip text={((activeClientProject?.calendarType ?? "date") == "date") ? `This metric now calculates at day-level data, displaying dark store penetration for single-date selections and showing "-" when multiple dates are selected.` : "Regardless of the date range selected, ND (Dark Store Coverage) will showcase just the latest week's data at an SKU-level."} position="left" />
                                  :
                                  <CiFilter className="text-[20px]" onClick={(e) => { addFilterFor(e, f?.value) }} />
                          }
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body with Virtualization */}
                <tbody style={{ height: totalRows * rowHeight, position: 'relative' }}>
                  {visibleRows.map(({ node, level }, idx) => {

                    // const isStriped = idx % 2 === 0 ? "white" : "#F9FAFA";
                    return (
                      <tr
                        key={node.id || `row-${startIndex + idx}`}
                        className={`cursor-pointer border-none `}
                        style={{
                          position: "absolute",
                          top: (startIndex + idx) * rowHeight,
                          height: rowHeight,
                          display: "table",
                          minWidth: "100%",
                          tableLayout: "fixed",
                        }}
                      >
                        <TableRow
                          node={node}
                          selectedFields={breakdownFields}
                          matrix={parameterFields}
                          level={level}
                        />
                      </tr>
                    )
                  }
                  )}
                </tbody>

                {/* Table Footer */}
                {data?.parentMetrics && (
                  <tfoot className="bg-blue-50 sticky-footer bottom-0 z-30 border-t border-gray-300">
                    <tr>
                      {uniqueCounts?.map((count, idx) => (
                        <td
                          key={`footer-${idx}`}
                          className={`group !min-w-[200px] !max-w-[200px] border-b border-gray-300 px-3 py-3 text-sm font-semibold text-gray-800 ${idx === 0 ? "sticky-column-0 left-0 bg-blue-50 z-40 shadow-sm" : "bg-blue-50"

                            }`}
                        >
                          <div className="flex flex-col gap-1 items-left justify-between">
                            <span>Total {breakdownFields?.[idx]?.title}</span>
                            <p className="flex justify-start">
                              <span className="py-1 text-xs">
                                {count}
                              </span>
                              <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, count) }}> <IoMdCopy /></span>
                            </p>
                          </div>
                        </td>
                      ))}
                      {parameterFields?.map((field, idx) => (
                        <td
                          key={`metric-footer-${field.value}-${idx}`}
                          className="group !min-w-[150px] !max-w-[150px] border-b border-gray-300 px-3 py-3 text-sm font-semibold text-gray-800 text-center bg-blue-50"
                        >
                          <div className="flex flex-col gap-1 items-center justify-between">
                            <span>Avg {field?.title}</span>
                            <p className="flex justify-start">
                              <span className="px-2 py-1 text-xs">
                                {data?.parentMetrics?.[field.value] !== null &&
                                  data?.parentMetrics?.[field.value] !== undefined
                                  ? typeof data.parentMetrics[field.value] === 'number'
                                    ? showValue(field, data.parentMetrics[field.value])
                                    : showValue(field, data.parentMetrics[field.value])
                                  : "-"}
                              </span>
                              {
                                (data?.parentMetrics?.[field.value] !== null &&
                                  data?.parentMetrics?.[field.value] !== undefined)
                                &&
                                <span className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(field, data.parentMetrics[field.value]))) }}> <IoMdCopy /></span>
                              }
                            </p>
                          </div>

                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Customize Modal */}
      {customizeInfo.isOpen && (
        <CustomizeCampiagnModal
          isWidget={true}
          kpi={kpi}
          selectedTabName={selectedTabName}
          closePopup={() => setCustomizeInfo({ isOpen: false, column: null })}
          tabColumnList={tabColumnList}
          setTabColumnList={setTabColumnList}
          isSaveViewVisible={false}
          fixedColumns={defaultfixedColumns}
          initCustomizeColumns={{
            "breakdown": {
              "title": "Breakdowns",
              "columns": metrics?.filter((i) => i?.type === "breakdown") ?? []
            },
            "ds": {
              "title": "Digital Shelf",
              "columns": metrics?.filter((i) => i?.type === "parameters") ?? []
            }
          }}
        />
      )}
    </div>
  );
};

export default DarkStoreComprehensiveBreakdownTable;