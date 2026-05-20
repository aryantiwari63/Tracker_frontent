import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { FaSort } from "react-icons/fa";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import CustomizeCampiagnModal from "../../common-components/CustomizeCampiangn";
// import Excel from "exceljs";
import _ from 'lodash';
import { useEbuxContext } from "../../Context/EbuxProvider";
import DayOnDayComprehenisiveFilterPlatform from "./filter/DayOnDayComprehenisiveFilterPlatform";
import { FILTERACTION, searchFilterArr } from "../../common-components/MultiFilter/FilterConstant";
import { fetchDailyPerformanceData } from "./services/service";
import LoaderSpinner from "../../../common-components/loader-spinner";

const isShowDummyData = false;
const dummyData = (!isShowDummyData) ? [] : [

  { date: "01-09-2025", platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 }, dummy: "just check" },
  { date: "01-09-2025", platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
  { date: "01-09-2025", platform: "Zepto", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
  { date: "01-09-2025", platform: "Blinkit", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
  { date: "01-09-2025", platform: "Flipkart", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },


  { date: "02-09-2025", platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
  { date: "02-09-2025", platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
  { date: "02-09-2025", platform: "Zepto", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
  { date: "02-09-2025", platform: "Blinkit", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
  { date: "02-09-2025", platform: "Flipkart", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },

  { date: "03-09-2025", platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
  { date: "03-09-2025", platform: "Zepto", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
  { date: "03-09-2025", platform: "Blinkit", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },

];

function TableDayOnDay({ data = {}, setSelectedRows, selectedRows }) {
  const { kpi, clientCustomizeColumnsComprehensiveBreakdown } = useEbuxContext();
  const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: ((i?.kpi?.indexOf(kpi) > -1) || ((!i?.isDisabled) && (data?.visibleMatrix?.length) && (data?.visibleMatrix?.findIndex(v => v?.value == i?.value) > -1))), disabled: i?.isDisabled })));

  return (
    <div>
      <PerformanceTable kpicol={kpicol} data={data} setSelectedRows={setSelectedRows} selectedRows={selectedRows} selectedDates={selectedRows?.selectedDates || []} />
    </div>
  )
}

const PerformanceTable = ({ kpicol, data = {}, selectedDates = [], selectedRows }) => {
  const { kpi, selectedFilters, filters } = useEbuxContext();
  const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});

  const initTabColumnList = localStorage.getItem(`${kpi}_daily_performance`) ? JSON.parse(localStorage.getItem(`${kpi}_daily_performance`)) : {
    "comprehensive": [{
      "persentageValue": false, "title": "Date", "type": "breakdown", "value": "date", "key": "date", "breakdown": "", "allowKPI": ["OSA", "CS", "PRO", "RR"], "notAllowWithIsValueIn": [], "allowWithIsValueIn": [], "isDisabled": false, "remove": false,
      "drag": false
    },
    ]
  };
  console.log('initTabColumnListinitTabColumnList', initTabColumnList)

  const [tabColumnList, setTabColumnList] = useState(initTabColumnList);

  useEffect(() => {
    localStorage.setItem(`${kpi}_daily_performance`, JSON.stringify(tabColumnList));
  }, [tabColumnList]);

  const [selectedTabName,] = useState("comprehensive");
  const [defaultfixedColumns, setDefaultFixedColumns] = useState([
    {
      "persentageValue": false,
      "title": "Date",
      "type": "breakdown",
      "value": "date",
      "key": "date",
      "breakdown": "",
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR",
        "SOS",
        "OR",
        "SOD"
      ],
      "notAllowWithIsValueIn": [],
      "allowWithIsValueIn": [],
      "isDisabled": true,
      "remove": false,
      "drag": false,
      "align": "left",
    },
    {
      "persentageValue": false,
      "title": "Platform",
      "type": "breakdown",
      "value": "platform",
      "key": "platform",
      "breakdown": "",
      "allowKPI": [
        "OSA",
        "CS",
        "PRO",
        "RR",
        "SOS",
        "OR",
        "SOD"
      ],
      "notAllowWithIsValueIn": [],
      "allowWithIsValueIn": [],
      "isDisabled": true,
      "remove": false,
      "drag": false,
      "align": "left",
    },
    ...(kpicol?.filter(i => i?.checked) ?? [])
  ]);

  const columns = [
    {
      key: "date",
      value: "date",
      label: "Date",
      align: "between",
      checkbox: true,
      sortable: true,
    },
    {
      type: "breakdown",
      key: "platform",
      value: "platform",
      label: "Platform",
      sortable: true,
    },
    ...(kpicol?.filter(i => i?.checked)?.map(i => ({
      ...i,
      label: i.title,
      align: "center",
      sortable: true
    })) ?? [])
  ];

  const [apiResponse, setApiResponse] = useState({});
  const { rowData } = useMemo(() => {
    if (apiResponse?.rowData) {
      const { rowData, footerData } = apiResponse;
      return { rowData: rowData || [], footerData: footerData || {} };
    } else {
      return { rowData: apiResponse, footerData: {} };
    }
  }, [JSON.stringify(apiResponse)]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });



  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortedRows = (rows = []) => {
    if (!sortConfig.key || !rows) return rows;

    return [...rows].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'platform') {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      } else {
        aValue = a[sortConfig.key]?.value || 0;
        bValue = b[sortConfig.key]?.value || 0;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  };


  const getHeaderIcon = (icon) => {
    switch (icon) {
      case "rupee":
        return "₹ ";
      default:
        return (icon) ? icon + " " : "";
    }
  }

  const showValue = (col, value) => {
    return <>{value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}{value}{value != undefined && col?.subValue ? col?.subValue : ""}{value != undefined && col?.persentageValue ? "%" : ""}</>
  }

  const renderCell = (col, metric) => (
    <div className="flex items-center justify-left gap-1">
      {
        (metric || (metric != undefined && col?.value == "osa")) ? <span className="font-medium">{showValue(col, metric)}</span> : <>-</>
      }

    </div>
  );
  const renderCellDownload = (col, value) =>(value || (value != undefined && col?.value == "osa")) ? `${value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}${value}${value != undefined && col?.subValue ? col?.subValue : ""}${value != undefined && col?.persentageValue ? "%" : ""}`: "-";

  const handleCustomizeClick = () => {
    setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
  };

  const closeCustomizePopup = () => {
    setCustomizeInfo({ isOpen: false, column: null });
  };

  const getOrderedColumns = () => {
    const order = {"breakdown": 1, "parameters": 2};
    const orderedColumnConfigs = tabColumnList[selectedTabName] || [];
    console.log('orderedColumnConfigs', orderedColumnConfigs, selectedTabName, tabColumnList)
    if (orderedColumnConfigs.length > 0) {
      const columnsMap = new Map(columns.map(col => [col.value, col]));

      return orderedColumnConfigs.map(config => {
        const existingCol = columnsMap.get(config.key);
        if (existingCol) {
          return existingCol;
        }
        return {
          ...config,
          label: config.title,
          align: config?.align ?? "center",
          sortable: true,
        };
      })?.sort((a, b) => order[a?.type] - order[b?.type]);
    }

    return columns;
  };

  useEffect(() => {
    if (tabColumnList[selectedTabName]?.length > 0) {
      setDefaultFixedColumns(tabColumnList[selectedTabName]);
    }
  }, [tabColumnList, selectedTabName]);

  const orderedColumns = getOrderedColumns();

  const [breakdownFilters, setBreakdownFilters] = useState({});
  const selectAllRef = useRef(null);
  const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);
  const [additionalFilter, setAdditionalFilter] = useState([]);


  // ---- Sliding-window 
  // const WINDOW_SIZE = 2500;
  const WINDOW_SIZE = 250;
  // const CHUNK_SIZE = 500;
  // const CHUNK_SIZE = 50;
  const DEFAULT_LIMIT = 250;//10000;

  // const TRIGGER_INDEX_DOWN = 2000;
  // const TRIGGER_INDEX_DOWN = 200;
  // const TRIGGER_INDEX_UP = 1000;
  // const TRIGGER_INDEX_UP = 100;


  const [startIndex, setStartIndex] = useState(0);
  const [isLazyLoading, setIsLazyLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  // const [, setAfterKey] = useState(null);
  const afterKeyRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  // refs for flags / sync
  const tableRef = useRef(null);
  const scrollRef = useRef(null);
  // const lastScrollTopRef = useRef(0);

  const isLazyLoadingRef = useRef(false);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const startIndexRef = useRef(startIndex);
  const fetchingDirectionRef = useRef({ up: false, down: false });

  // keep these effects to sync refs with state
  useEffect(() => { isLazyLoadingRef.current = isLazyLoading; }, [isLazyLoading]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { startIndexRef.current = startIndex; }, [startIndex]);

  useEffect(() => {
    setStartIndex(0)

  }, [])

 const updateAfterKey = (key) => {
    afterKeyRef.current = key;
    // setAfterKey(key);
  };
  const fetchData = async (start = 0, customLimit = null, after = false) => {
    console.log("customLimit:", customLimit);
    try {
      if (start === 0) setLoading(true);
      else setIsLazyLoading(true);

      const performanceOf = data?.performanceOf ?? 'brand';
      const payload = {
        kpi,
        start,
        // limit: customLimit ?? DEFAULT_LIMIT, // use passed customLimit
        limit: DEFAULT_LIMIT, // use passed customLimit
        afterKey: after ? afterKeyRef.current : null,
        breakdown: [...(defaultfixedColumns?.length ? (defaultfixedColumns?.filter(column => column?.type == "breakdown")?.map(column => column.value)??[]) : [])],
        matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa', 'wt_osa', 'avg-off-take'],
        key: performanceOf,
        value: data?.value ?? "",
        selectedFilters, filters,
        breakdownFilters,
        sortConfig,
        selectedTableRows: {
          selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
          selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
          selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
          selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
          selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
        }
      };

      const response = await fetchDailyPerformanceData(payload);
      const fetchedRows = response?.rowData ?? [];
      updateAfterKey(response?.afterKey ?? null);
      setHasMore(response?.hasMore);

      // if (!fetchedRows.length) {
      //   setHasMore(false);
      // }

      // If start === 0 (initial load) we replace state, else append (fallback)
      setApiResponse((prev) => {
        const prevRows = prev?.rowData ? prev.rowData : (Array.isArray(prev) ? prev : (prev?.rowData ?? []));
        if (start === 0 || !prevRows?.length) {
          return { ...response, rowData: fetchedRows };
        } else {
          const merged = [...prevRows, ...fetchedRows];
          // keep trimmed to WINDOW_SIZE if overly large (safety)
          if (merged.length > WINDOW_SIZE * 2) {
            return { ...prev, rowData: merged.slice(merged.length - WINDOW_SIZE * 2) };
          }
          return { ...prev, rowData: merged };
        }
      });

      return fetchedRows;
    } catch (error) {
      console.error("Error in fetchData:", error);
      return [];
    } finally {
      setLoading(false);
      setIsLazyLoading(false);
    }
  };


  useEffect(() => {
    const loadInitial = async () => {
      setStartIndex(0);
      startIndexRef.current = 0;
      setIsLazyLoading(true);
      try {
        // Load initial WINDOW_SIZE rows
        await fetchData(0, WINDOW_SIZE,false);
        setHasMore(true);
      } catch (err) {
        console.error("initial load error", err);
      } finally {
        setIsLazyLoading(false);
      }
    };

    loadInitial();
  }, [JSON.stringify(selectedFilters), JSON.stringify(breakdownFilters), JSON.stringify(defaultfixedColumns)]);


  // const adjustScrollAfterPrepend = (el, prevScrollTop, prevScrollHeight) => {
  //   const apply = () => {
  //     try {
  //       const newScrollHeight = el.scrollHeight;
  //       const delta = newScrollHeight - prevScrollHeight;
  //       el.scrollTop = prevScrollTop + delta;
  //     } catch (err) {
  //       console.warn("adjustScrollAfterPrepend failed", err);
  //     }
  //   };
  //   if (typeof requestAnimationFrame !== "undefined") {
  //     requestAnimationFrame(() => requestAnimationFrame(apply));
  //   } else {
  //     setTimeout(apply, 50);
  //   }
  // };




  useEffect(() => {
    if (selectAllRef.current) {
      const currentData = (rowData?.length ? rowData : dummyData) || [];
      selectAllRef.current.indeterminate =
        (selectedDates?.length || 0) > 0 && (selectedDates?.length || 0) < currentData.length;
    }
  }, [selectedDates, ((rowData?.length ? rowData : dummyData) || []).length]);

  // const normalizeData = (rowData = [], defaultfixedColumns = []) => {
  //   const flat = [];
  //   rowData.forEach((section) => {
  //     const { date, rows = [] } = section;
  //     rows.forEach((row) => {
  //       const flatRow = { date, platform: row.platform };

  //       defaultfixedColumns.forEach((col) => {
  //         const key = col.value;

  //         if (key === "date" || key === "platform") return;

  //         const metric = row[key];

  //         if (metric) {
  //           flatRow[key] = metric.value ?? "-";
  //           if (metric.reference !== undefined) {
  //             flatRow[`${key}_reference`] = metric.reference;
  //           }
  //           if (metric.delta !== undefined) {
  //             flatRow[`${key}_delta`] = metric.delta;
  //           }
  //         } else {
  //           flatRow[key] = "-";
  //         }
  //       });

  //       flat.push(flatRow);
  //     });
  //   });
  //   return flat;
  // };
  const buildDownloadPayload = (start, limit, after_key) => ({
    kpi,
    start,
    afterKey: after_key,
    limit,
    breakdown: [...(defaultfixedColumns?.length ? (defaultfixedColumns?.filter(column => column?.type == "breakdown")?.map(column => column.value)??[]) : [])],
    matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa', 'wt_osa', 'avg-off-take'],
    key: data?.performanceOf ?? 'brand',
    value: data?.value ?? "",
    selectedFilters, filters,
    breakdownFilters,
    sortConfig,
    selectedTableRows: {
      selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
      selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
      selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
      selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
      selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
    }
  });


  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    // Use the current data that's being displayed in the table
    // const currentData = (rowData?.length ? rowData : dummyData) || [];

    // // If no data available, show alert and return
    // if (currentData.length === 0) {
    //   alert("No data available to download");
    //   return;
    // }

    // const workbook = new Excel.Workbook();
    // const worksheet = workbook.addWorksheet("Performance Data");

    // // Create headers
    // const headers = orderedColumns.map(col => col.label);
    // worksheet.addRow(headers);

    // // Add data rows
    // currentData.forEach((row) => {
    //   const values = orderedColumns.map(col => {
    //     if (col.value === "date") {
    //       return row.date ? moment(new Date(row.date)).format("DD-MM-YYYY") : "";
    //     }
    //     else if (col.value === "platform") {
    //       return row.platform || "-";
    //     }
    //     else if (col.type === "parameters" || col.type === "breakdown") {
    //       // For metric columns, get the value directly
    //       const value = row[col.value];

    //       // Handle different value types (object with value property or direct value)
    //       if (value && typeof value === 'object' && 'value' in value) {
    //         // If it's an object like {value: 75, delta: 15}
    //         return value.value ?? "-";
    //       } else {
    //         // If it's a direct value
    //         return value ?? "-";
    //       }
    //     }
    //     return "-";
    //   });

    //   worksheet.addRow(values);
    // });

    try {
      const PAGE_LIMIT = 10000;
      let start = 0;
      let hasMoreData = true;
      let after_key = null;

      console.log("Starting CSV download...");

      // 🔹 CSV header
      let csvContent =
        orderedColumns.map(col => escapeCSV(col.label)).join(",") + "\n";

      while (hasMoreData) {
        const payload = buildDownloadPayload(start, PAGE_LIMIT, after_key);
        const response = await fetchDailyPerformanceData(payload);

        const rows = response?.rowData ?? [];
        after_key = response?.afterKey;
        hasMoreData = response?.hasMore;

        if (!rows.length) break;

        // 🔹 Append rows to CSV
        rows.forEach(row => {
          const csvRow = orderedColumns.map(col => {
            if (col.value === "date") {
              if (!row.date) return "";
              const m = moment(row.date, ["DD-MMM-YYYY", "YYYY-MM-DD"], true);
              return m.isValid() ? m.format("DD-MM-YYYY") : "";
            }
              const value = row[col.value];
            if (value && typeof value === "object" && "value" in value) {
              return escapeCSV(value.value ?? "-");
            }else if(col.value && col?.type == 'breakdown'){
              return escapeCSV(value ?? "-");
            }else if(col.value && col?.type == 'parameters'){
              return escapeCSV(renderCellDownload(col, (value ?? null)));
            }
            return escapeCSV(value ?? "-");
             

            
          }).join(",");
          csvContent += csvRow + "\n";
        });
        start += PAGE_LIMIT;
      }
      if (!csvContent.trim()) {
        alert("No data available to download");
        return;
      }
      // 🔹 Download CSV
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `daily_performance_${moment().format(
        "YYYY-MM-DD_HH-mm-ss"
      )}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("CSV download completed");
    } catch (err) {
      console.error("CSV download failed:", err);
      alert("Failed to download CSV. Please try again.");
    } finally {
      setIsDownloading(false);
    }
      // const buffer = await workbook.xlsx.writeBuffer();
      // const blob = new Blob([buffer], {
      //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // });
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = `daily_performance_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(link.href);
    // } catch (error) {
    //   console.error("Error downloading file:", error);
    //   alert("Error downloading file. Please try again.");
    // }
  };




  // const handleDownload = async () => {
  //   const normalized = normalizeData(rowData, defaultfixedColumns);

  //   const workbook = new Excel.Workbook();
  //   const worksheet = workbook.addWorksheet("Performance Data");

  //   if (normalized.length > 0) {
  //     const headers = ["Date", "Platform"];

  //     defaultfixedColumns.forEach((col) => {
  //       if (col.value === "date" || col.value === "platform") return;

  //       headers.push(col.title);

  //       const hasReference = normalized.some((r) => r[`${col.value}_reference`] !== undefined);
  //       const hasDelta = normalized.some((r) => r[`${col.value}_delta`] !== undefined);

  //       if (hasReference) headers.push(`${col.title} Pervious`);
  //       if (hasDelta) headers.push(`${col.title} Delta`);
  //     });

  //     worksheet.addRow(headers);

  //     normalized.forEach((row) => {
  //       const values = [row.date, row.platform];

  //       defaultfixedColumns.forEach((col) => {
  //         if (col.value === "date" || col.value === "platform") return;

  //         values.push(row[col.value]);
  //         if (row[`${col.value}_reference`] !== undefined) values.push(row[`${col.value}_reference`]);
  //         if (row[`${col.value}_delta`] !== undefined) values.push(row[`${col.value}_delta`]);
  //       });

  //       worksheet.addRow(values);
  //     });
  //   }

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `performance_table_${Date.now()}.xlsx`;
  //   link.click();
  // };

  const fetchAndShiftDown = async () => {
    const el = scrollRef.current;
    if (!el) return;
    // if (isLazyLoadingRef.current || loadingRef.current || fetchingDirectionRef.current.down) return;
    // if (!hasMoreRef.current) return;
    if (
      isLazyLoadingRef.current ||
      loadingRef.current ||
      fetchingDirectionRef.current.down ||
      !hasMoreRef.current
    ) return;
    fetchingDirectionRef.current.down = true;
    setIsLazyLoading(true);
    try {
      // const tbody = tableRef.current?.querySelector("tbody");
      // let removedHeight = 0;
      // if (tbody) {
      //   const trs = Array.from(tbody.querySelectorAll("tr")).slice(0, CHUNK_SIZE);
      //   removedHeight = trs.reduce((acc, tr) => acc + tr.getBoundingClientRect().height, 0);
      // }
      // const prevScrollTop = el.scrollTop;

      // const fetchStart = startIndexRef.current + WINDOW_SIZE;
      // const payload = {
      //   kpi,
      //   start: fetchStart,
      //   limit: CHUNK_SIZE,
      //   breakdown: ['date', 'platform'],
      //   matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa', 'wt_osa', 'avg-off-take'],
      //   key: data?.performanceOf ?? 'brand',
      //   value: data?.value ?? "",
      //   selectedFilters, filters,
      //   breakdownFilters,
      //   selectedTableRows: {
      //     selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
      //     selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
      //     selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
      //     selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
      //     selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
      //   }
      // };

      const response = await fetchDailyPerformanceData({
        kpi,
        start:0,
        // limit: customLimit ?? DEFAULT_LIMIT, // use passed customLimit
        limit: DEFAULT_LIMIT, // use passed customLimit
        afterKey: afterKeyRef.current,
        breakdown: [...(defaultfixedColumns?.length ? (defaultfixedColumns?.filter(column => column?.type == "breakdown")?.map(column => column.value)??[]) : [])],
        matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa', 'wt_osa', 'avg-off-take'],
        key: data?.performanceOf ?? 'brand',
        value: data?.value ?? "",
        selectedFilters, filters,
        breakdownFilters,
        sortConfig,
      });
      const newRows = response?.rowData ?? [];
      updateAfterKey(response?.afterKey ?? null);
      setHasMore(response?.hasMore ?? false);
      setApiResponse(prev => {
        const prevRows = prev?.rowData ?? [];
        return {
          ...prev,
          rowData: [...prevRows, ...newRows],
        };
      });

      // if (!newRows?.length) {
      //   setHasMore(false);
      //   return;
      // }

      // // drop top CHUNK_SIZE and append newRows
      // setApiResponse((prev) => {
      //   const prevRows = prev?.rowData ? prev.rowData : (Array.isArray(prev) ? prev : (prev?.rowData ?? []));
      //   const afterRemoval = prevRows.slice(CHUNK_SIZE);
      //   const appended = [...afterRemoval, ...newRows];
      //   return { ...prev, rowData: appended };
      // });

      // // advance startIndex
      // const newStart = startIndexRef.current + CHUNK_SIZE;
      // startIndexRef.current = newStart;
      // setStartIndex(newStart);

      // // subtract removedHeight so visual viewport stays at same rows
      // setTimeout(() => {
      //   try {
      //     const adjusted = Math.max(0, prevScrollTop - removedHeight);
      //     el.scrollTop = adjusted;
      //   } catch (e) {
      //     console.warn("fetchAndShiftDown scroll adjust failed", e);
      //   }
      // }, 0);
    } catch (err) {
      console.error("fetchAndShiftDown error", err);
    } finally {
      setIsLazyLoading(false);
      fetchingDirectionRef.current.down = false;
    }
  };

  // const fetchAndShiftUp = async () => {
  //   const el = scrollRef.current;
  //   if (!el) return;

  //   if (isLazyLoadingRef.current || loadingRef.current || fetchingDirectionRef.current.up) return;
  //   if (startIndexRef.current <= 0) return;

  //   fetchingDirectionRef.current.up = true;
  //   setIsLazyLoading(true);

  //   try {
  //     const prevScrollTop = el.scrollTop;
  //     const prevScrollHeight = el.scrollHeight;

  //     const prevStart = Math.max(0, startIndexRef.current - CHUNK_SIZE);

  //     const payload = {
  //       kpi,
  //       start: prevStart,
  //       limit: CHUNK_SIZE,
  //       breakdown: ['date', 'platform'],
  //       matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa', 'wt_osa', 'avg-off-take'],
  //       key: data?.performanceOf ?? 'brand',
  //       value: data?.value ?? "",
  //       selectedFilters, filters,
  //       breakdownFilters,
  //       selectedTableRows: {
  //         selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
  //         selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
  //         selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
  //         selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
  //         selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
  //       }
  //     };

  //     const response = await fetchDailyPerformanceData(payload);
  //     const newRows = response?.rowData ?? [];

  //     if (!newRows?.length) {
  //       return;
  //     }

  //     setApiResponse((prev) => {
  //       const prevRows = prev?.rowData ? prev.rowData : (Array.isArray(prev) ? prev : (prev?.rowData ?? []));
  //       let nextRows = [...newRows, ...prevRows];

  //       if (nextRows.length > CHUNK_SIZE) {
  //         nextRows = nextRows.slice(0, nextRows.length - CHUNK_SIZE);
  //       }
  //       return { ...prev, rowData: nextRows };
  //     });

  //     startIndexRef.current = prevStart;
  //     setStartIndex(prevStart);
  //     adjustScrollAfterPrepend(el, prevScrollTop, prevScrollHeight);
  //   } catch (err) {
  //     console.error("fetchAndShiftUp error", err);
  //   } finally {
  //     setIsLazyLoading(false);
  //     fetchingDirectionRef.current.up = false;
  //   }
  // };

  // helper (if not present): returns 0-based first visible row index inside tbody
  // const getFirstVisibleRowIndex = () => {
  //   const el = scrollRef.current;
  //   const tbody = tableRef.current?.querySelector("tbody");
  //   if (!el || !tbody) return 0;
  //   const containerRect = el.getBoundingClientRect();
  //   const trs = Array.from(tbody.querySelectorAll("tr"));
  //   for (let i = 0; i < trs.length; i++) {
  //     const rect = trs[i].getBoundingClientRect();
  //     if (rect.bottom >= containerRect.top + 1) {
  //       return i;
  //     }
  //   }
  //   return 0;
  // };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isLazyLoadingRef.current || loadingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const isScrollingDown = scrollTop > lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop;
    if (!isScrollingDown) return;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    if (
      isNearBottom &&
      hasMoreRef.current &&
      !fetchingDirectionRef.current.down
    ) {
      fetchAndShiftDown();
    }

    // const { scrollTop } = el;
    // const delta = scrollTop - (lastScrollTopRef.current || 0);
    // const direction = delta > 0 ? "down" : (delta < 0 ? "up" : "none");
    // lastScrollTopRef.current = scrollTop;

    // const firstVisibleRelativeIndex = getFirstVisibleRowIndex();
    // const offsetInBuffer = firstVisibleRelativeIndex;

    // //DOWN
    // if (direction === "down") {
    //   if (offsetInBuffer < TRIGGER_INDEX_DOWN) return;

    //   if (!fetchingDirectionRef.current.down && hasMoreRef.current) {
    //     fetchAndShiftDown().catch(err => console.error(err)).finally(() => {
    //       fetchingDirectionRef.current.down = false;
    //     });
    //   }
    //   return;
    // }

    // //UP
    // if (direction === "up") {
    //   if (offsetInBuffer > TRIGGER_INDEX_UP) return;
    //   if (!fetchingDirectionRef.current.up && startIndexRef.current > 0) {
    //     fetchAndShiftUp().catch(err => console.error(err)).finally(() => {
    //       fetchingDirectionRef.current.up = false;
    //     });
    //   }
    //   return;
    // }
  };


  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);


  // Initial fetch and on filter change
  useEffect(() => {
    const columns = getOrderedColumns();

    if (_.size(columns)) {
      let additionalFilterObj = [];
      for (const e of columns) {
        if (e?.type == "breakdown") {
          additionalFilterObj.push(e.value);
        }
      }
      console.log('columnscolumnscolumns', additionalFilterObj)
      setAdditionalFilter(additionalFilterObj)

      const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
      tagFilter.children = [];
      const updatedArray = searchFilterArray.map((ele) => {
        if (ele.key === "metric") {
          for (const e of columns) {
            if (e.type == "parameters") {
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

  const applyBreakdownFilters = (sFilters, current) => {
    setBreakdownFilters((prevFilters) => {
      return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
    });
  };

  // FIXED: Added null checks for data rendering
  const currentData = (rowData?.length ? rowData : dummyData) || [];

  return (
    <div className='bg-white p-4 !rounded-2xl shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008]'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="text-[20px] font-semibold mb-4 text-[#000000E0]">Daily Performance</h4>
          {/* font-semibold text-lg  */}
          {loading &&
            <div className="flex items-center justify-center h-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            </div>
          }
        </div>
        <div className="flex items-center gap-2">
          <DayOnDayComprehenisiveFilterPlatform text="Filter By"
            savedSearch={{}}
            arr={searchFilterArray}
            additionalFilter={additionalFilter}
            applySearchFilter={applyBreakdownFilters}
            handleSaveFilters={false} />
          <div className="graphIconBtnWrap flex gap-2">
            {/* <button type="button" className="graphIconBtn">
              <img src="/assets/images/downloadIcon.svg" width={22} height={22} alt="Download" onClick={handleDownload} />
            </button> */}
            <button
              type="button"
              className="graphIconBtn"
              disabled={isDownloading}
              onClick={handleDownload}
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              ) : (
                <img src="/assets/images/downloadIcon.svg" width={22} height={22} alt="Download" />
              )}
            </button>

            <button type="button" className="graphIconBtn" onClick={handleCustomizeClick}>
              <img src="/assets/images/columnsIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="Customize" />
            </button>
          </div>
        </div>
      </div>
      <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mt-[10px]">{moment(selectedFilters?.selectedDateRange?.startDate ?? new Date())?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? new Date())?.format("DD/MM/YYYY")}
      </p>

      <div className="p-4 w-full h-[400px] flex flex-col">

        <div className="overflow-x-auto overflow-y-auto flex-1 relative"
          ref={scrollRef}
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
                left: 300px;
                z-index: 15;
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
                left: 300px;
                z-index: 25;
                background: #F6F9FB;
                border : none;
              }
            `}
          </style>
          <table className="w-full relative text-sm sticky-table" ref={tableRef}>
            <thead>
              <tr>
                {orderedColumns?.map((col, colIndex) => (
                  <th
                    key={col.value}
                    onClick={col.sortable ? () => handleSort(col.value) : undefined}
                    className={`
                      p-4 text-sm border-none
                      ${col.sortable ? "cursor-pointer" : ""}
                      ${col.align === "left" ? "text-left" : "text-center"}
                      ${colIndex === 0 ? "sticky-column-header-0" : ""}
                      sticky-header
                    `}
                    style={{
                      width: colIndex < 1 ? 'auto' : 'auto',
                      minWidth: colIndex < 1 ? 'auto' : 'auto'
                    }}
                  >
                    <div className={`flex items-center  ${col.align === "left" ? "justify-start" :
                      col.align === "right" ? "justify-end" :
                        col.align === "between" ? "gap-8" : "justify-start"
                      }`}>

                      <span>{col.label}</span>
                      {col.sortable &&false && <FaSort className="inline h-3 w-3" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getSortedRows(currentData)?.map((section, dateIndex) => {
                const isStriped = dateIndex % 2 === 0 ? "white" : "#F9FAFA";
                return (
                  <tr
                    key={`${dateIndex}`}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {orderedColumns?.map((col, colIndex) => {
                      if (col.value === "date") {
                        return colIndex === 0 ? (
                          <td
                            key={`${dateIndex}-${colIndex}-${col.value}`}
                            className={`px-4 py-2 text-center align-middle border-none 
                                  ${colIndex === 0 ? "sticky-column-0" : ""}
                                `}
                            style={{
                              background: isStriped,
                              borderTopLeftRadius: "12px",
                              borderBottomLeftRadius: "12px",
                              width: 'auto',
                              minWidth: 'auto',

                              // ensure wrapping is allowed
                            }}

                          >
                            <div className="flex items-center justify-start gap-8">
                              <span>{section?.date ? moment(new Date(section?.date))?.format("DD-MM-YYYY") : ""}</span>
                            </div>
                          </td>
                        ) : null;
                      }

                      return (
                        <td
                          key={`${dateIndex}-${colIndex}-${col.value}`}
                          className={`
                                px-4 py-2 border-none text-left
                              `}
                          style={{
                            background: isStriped,
                            width: colIndex < 1 ? 'auto' : '200px',
                            minWidth: colIndex < 1 ? 'auto' : '200px',
                            maxWidth: '600px',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal', // Changed from 'nowrap'
                          }}
                        // style={{
                        //   background: isStriped,
                        //   width: col.value === "platform" ? "200px" : "auto",
                        //   minWidth: col.value === "platform" ? "200px" : "auto",
                        //   maxWidth: col.value === "platform" ? "200px" : "600px",

                        //   // Prevent text breaking for platform column
                        //   whiteSpace: col.value === "platform" ? "nowrap" : "normal",
                        //   overflowWrap: col.value === "platform" ? "normal" : "break-word",
                        //   wordBreak: col.value === "platform" ? "normal" : "break-word",
                        // }}
                        >
                          {col.value === "platform" ?
                            <span className="flex items-center gap-2">
                              {pf_images?.[section?.[col.value]?.toLowerCase()] ? <img
                                src={pf_images?.[section?.[col.value]?.toLowerCase()]}
                                alt={section?.[col.value]}
                                className="oos-plat-img max-w-9 max-h-9 object-contain"
                              /> : <></>}
                              {(section?.[col.value] ?? '-')}
                            </span>
                            :
                            col.value === "product_image" ?
                              <span className="flex items-center gap-2">
                                {section?.[col.value] ? <img
                                  src={section?.[col.value]}
                                  alt={section?.[col.value]}
                                  className="oos-plat-img max-w-9 max-h-9 object-contain"
                                /> : <></>}
                              </span>
                              :
                              col.value && col?.type == 'breakdown' ? (section?.[col.value] ?? '-') : col.value && renderCell(col, (section?.[col.value] ?? null))
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* Loading spinner */}
              {isLazyLoading && (
                <tr>
                  <td colSpan={orderedColumns.length}>
                    <div className="flex justify-center p-4">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {customizeInfo.isOpen && (
        <CustomizeCampiagnModal
          isWidget={true}
          kpi={kpi}
          selectedTabName={selectedTabName}
          closePopup={closeCustomizePopup}
          tabColumnList={tabColumnList}
          // setTabColumnList={[]}
          setTabColumnList={setTabColumnList}
          isSaveViewVisible={false}
          // columnVisible="ds"
          // fixedColumns={defaultfixedColumns}
          //  dummyColumnGroup={[]}

          initCustomizeColumns={{
            "breakdown": {
              "title": "Breakdowns",
              "columns": [
                {
                  "persentageValue": false,
                  "title": "Date",
                  "type": "breakdown",
                  "value": "date",
                  "key": "date",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "OR",
                    "SOS",
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Keyword",
                  "type": "breakdown",
                  "value": "keyword",
                  "key": "keyword",
                  "breakdown": "Platform",
                  "allowKPI": [

                    "OR",
                    "SOS",
                  ],
                  "allowInDarkStore": true,
                  "isDisabled": false
                }, {
                  "persentageValue": false,
                  "title": "Keyword Type",
                  "type": "breakdown",
                  "value": "keyword_type",
                  "key": "keyword_type",
                  "breakdown": "Platform",
                  "allowKPI": [

                    "OR",
                    "SOS",
                  ],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Platform",
                  "type": "breakdown",
                  "value": "platform",
                  "key": "platform",
                  "breakdown": "Platform",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "OR",
                    "SOS",
                  ],
                  "allowInDarkStore": true,
                  "isDisabled": false
                }, 
                 {
                  "persentageValue": false,
                  "title": "Product Type",
                  "type": "breakdown",
                  "value": "product_type",
                  "key": "product_type",
                  "breakdown": "Platform",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"                  
                  ],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Year",
                  "type": "breakdown",
                  "value": "year",
                  "key": "year",
                  "breakdown": "Platform",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Market",
                  "type": "breakdown",
                  "value": "market",
                  "key": "market",
                  "breakdown": "Platform",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "OR",
                    "SOS",
                  ],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },

                {
                  "persentageValue": false,
                  "title": "Brands",
                  "type": "breakdown",
                  "value": "brand",
                  "key": "brand",
                  "breakdown": "Brand",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "OR",
                    "SOS",
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Category",
                  "type": "breakdown",
                  "value": "category",
                  "key": "category",
                  "breakdown": "Category",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },

                {
                  "persentageValue": false,
                  "title": "Locations",
                  "type": "breakdown",
                  "value": "location",
                  "key": "location",
                  "breakdown": "Location",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [
                    "rating_value",
                    "review_count"
                  ],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Pincode",
                  "type": "breakdown",
                  "value": "pincode",
                  "key": "pincode",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [
                    "rating_value",
                    "review_count"
                  ],
                  "allowWithIsValueIn": [],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },

                {
                  "persentageValue": false,
                  "title": "SKU",
                  "type": "breakdown",
                  "value": "web_pid",
                  "key": "web_pid",
                  "breakdown": "SKU",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Product name",
                  "type": "breakdown",
                  "value": "sku_name",
                  "key": "sku_name",
                  "breakdown": "SKU",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "OR",
                    "SOS",
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "allowInDarkStore": true,
                  "isDisabled": false
                },

                // {
                //   "persentageValue": false,
                //   "title": "Platform ID",
                //   "type": "breakdown",
                //   "value": "ebux_code",
                //   "key": "ebux_code",
                //   "breakdown": "",
                //   "allowKPI": [
                //     "OSA",
                //     "CS",
                //     "PRO",
                //     "RR"
                //   ],
                //   "notAllowWithIsValueIn": [],
                //   "allowWithIsValueIn": [],
                //   "isDisabled": false
                // },
                {
                  "persentageValue": false,
                  "title": "CP Code",
                  "type": "breakdown",
                  "value": "cp_code",
                  "key": "cp_code",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Segment",
                  "type": "breakdown",
                  "value": "segment",
                  "key": "segment",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Grade",
                  "type": "breakdown",
                  "value": "grade",
                  "key": "grade",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Priority Sku",
                  "type": "breakdown",
                  "value": "priority_sku",
                  "key": "priority_sku",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "State",
                  "type": "breakdown",
                  "value": "state",
                  "key": "state",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Seller Name",
                  "type": "breakdown",
                  "value": "seller_name",
                  "key": "seller_name",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Month Year",
                  "type": "breakdown",
                  "value": "month_year",
                  "key": "month_year",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Quarter Year",
                  "type": "breakdown",
                  "value": "quarter_year",
                  "key": "quarter_year",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "CS Reason",
                  "type": "breakdown",
                  "value": "cs_reason",
                  "key": "cs_reason",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Issue/Non Issue",
                  "type": "breakdown",
                  "value": "issue_non_issue",
                  "key": "issue_non_issue",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "OSA Status",
                  "type": "breakdown",
                  "value": "osa_remark",
                  "key": "osa_remark",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                },
                {
                  "persentageValue": false,
                  "title": "Product Image",
                  "type": "breakdown",
                  "value": "product_image",
                  "key": "product_image",
                  "breakdown": "",
                  "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                  ],
                  "notAllowWithIsValueIn": [],
                  "allowWithIsValueIn": [],
                  "isDisabled": false
                }
              ]
            },
            "ds": {
              "title": "Digital Shelf",
              "columns": [{
                "persentageValue": false,
                "title": "Ranking",
                "type": "parameters",
                "value": "or",
                "key": "or",
                "kpi": [
                  "SOS",
                  "OR"
                ],
                "allowKPI": [
                  "SOS",
                  "OR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "Total Score",
                "type": "parameters",
                "value": "total_score",
                "key": "total_score",
                "kpi": [
                  "CS"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "Title Score",
                "type": "parameters",
                "value": "title_score",
                "key": "title_score",
                "kpi": [
                  "CS"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "Description Score",
                "type": "parameters",
                "value": "desc_score",
                "key": "desc_score",
                "kpi": [
                  "CS"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "Bullet Score",
                "type": "parameters",
                "value": "bulletin_score",
                "key": "bulletin_score",
                "kpi": [
                  "CS"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "Image Score",
                "type": "parameters",
                "value": "image_score",
                "key": "image_score",
                "kpi": [
                  "CS"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "A+ Score",
                "type": "parameters",
                "value": "a_plus_score",
                "key": "a_plus_score",
                "kpi": [
                  "CS"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": true,
                "title": "Promotions",
                "type": "parameters",
                "value": "price_variation",
                "key": "price_variation",
                "kpi": [
                  "PRO"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": true,
                "isDisabled": false
              },

              {
                "persentageValue": false,
                "icon": "₹",
                "title": "MRP",
                "type": "parameters",
                "value": "price_rp",
                "key": "price_rp",
                "kpi": [
                  "PRO"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": true,
                "isDisabled": false
              },
              {
                "persentageValue": false,
                "icon": "₹",
                "title": "SP",
                "type": "parameters",
                "value": "price_sp",
                "key": "price_sp",
                "kpi": [
                  "PRO"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInWidget": true,
                "allowInDarkStore": true,
                "isDisabled": false
              },
              {
                "persentageValue": false,
                "title": "Reviews Count",
                "type": "parameters",
                "value": "review_count",
                "key": "review_count",
                "kpi": [
                  "RR"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [

                ],
                "allowWithIsValueIn": [],
                "allowInWidget": false,
                "allowInDarkStore": false,
                "isDisabled": false
              },
              {
                "persentageValue": false,
                "subValue": " / 5",
                "title": "Ratings",
                "type": "parameters",
                "value": "rating_value",
                "key": "rating_value",
                "kpi": [
                  "RR"
                ],
                "allowKPI": [
                  "OSA",
                  "CS",
                  "PRO",
                  "RR"
                ],
                "notAllowWithIsValueIn": [

                ],
                "allowWithIsValueIn": [],
                "allowInWidget": false,
                "allowInDarkStore": false,
                "isDisabled": false
              },



              ]
            }

          }}
        />
      )}
    </div>
  );
};

export default TableDayOnDay