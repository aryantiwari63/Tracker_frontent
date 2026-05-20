// ByBoxSellerSettings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { getByBoxSellerSettings, updateByBoxSellerSettings } from "../../../services/ebuxMaster.service";

import SellerCards from "./SellerCards";
import SellerTable from "./SellerTable";
import Pagination from "./Pagination";

/* libs for parsing, excel gen, toasts, save */
import Excel from "exceljs";
// import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import UploadExcelModal from "./UploadExcelModal";


export default function ByBoxSellerSettings() {
  // core state
  const [tableData, setTableData] = useState([]);
  const [counterData, setCounterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log('errorerror', error)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selected, setSelected] = useState({});
  const [sellerTypeBulk, setSellerTypeBulk] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null); // optional stored preview
  console.log('uploadPreviewuploadPreview', uploadPreview)
  // --- fetchData (extract so other handlers can call it) ---
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getByBoxSellerSettings();
      const data = res?.data ?? [];

      const normalized = data.map((item, idx) => ({
        id: String(item.reseller_id ?? `row_${idx}`),
        seller_name: item.seller_name ?? "",
        reseller_id: item.reseller_id ?? "",
        seller_type: item.seller_type ?? "",
        last_seen: item.last_seen ?? ""
      }));
      setTableData(normalized);
      setCounterData(res?.counts ?? {});

      // auto-select rows that already have seller_type
      // const autoSelected = {};
      // normalized.forEach(r => {
      //   if (r.seller_type) autoSelected[String(r.id)] = true;
      // });
      // setSelected(autoSelected);

      setPage(1);
    } catch (err) {
      console.error("Failed to fetch seller settings:", err);
      setError("Failed to fetch data");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- sorting ---
  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return [...tableData];
    const arr = [...tableData];
    arr.sort((a, b) => {
      const va = String(a[sortConfig.key] ?? "").toLowerCase();
      const vb = String(b[sortConfig.key] ?? "").toLowerCase();
      if (va < vb) return sortConfig.direction === "asc" ? -1 : 1;
      if (va > vb) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [tableData, sortConfig]);

  // --- pagination ---
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  // --- selection helpers ---
  const headerCheckedAll = paginatedRows.length > 0 && paginatedRows.every(r => !!selected[String(r.id)]);
  const headerIndeterminate = paginatedRows.some(r => !!selected[String(r.id)]) && !headerCheckedAll;

  const toggleSelectAllVisible = () => {
    if (headerCheckedAll) {
      const newSelected = { ...selected };
      paginatedRows.forEach(r => delete newSelected[String(r.id)]);
      setSelected(newSelected);
    } else {
      const newSelected = { ...selected };
      paginatedRows.forEach(r => {
        newSelected[String(r.id)] = true;
      });
      setSelected(newSelected);
    }
  };

  const toggleRow = (rowId, type) => {
    const key = String(rowId);
    setSelected(prev => {
      const next = { ...prev };
      if (next[key] && type === 0) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  // --- edit seller_type locally & auto-select/unselect ---
  const handleSellerTypeChange = async (rowId, newType) => {
    try {
      setLoading(true);
      const key = String(rowId);

      setTableData(prev =>
        prev.map(r =>
          String(r.id) === key ? { ...r, seller_type: newType } : r
        )
      );
      // if (selected[rowId]) {
      //   console.log("Row is selected — seller type change prevented");
      //   return;
      // }
      const item = {
        reseller_id: Number(rowId),
        seller_type: newType || "",
      };

      const payload = {
        items: [item],
      };

      const result = await updateByBoxSellerSettings(payload);

      if (!result || result?.isSuccess === false) {
        toast.error(result?.message || "Failed to save configuration");
        return;
      }

      toast.success("Saved successfully.");
      await fetchData();
    } catch (err) {
      console.error("Save error", err);
      toast.error(err?.message || "Save error");
    } finally {
      setLoading(false);
    }
  };


  // --- build payload for API ---
  const buildPayload = () => {
    const checkedIds = Object.keys(selected);
    const filteredRows = tableData.filter(r => checkedIds.includes(String(r.id)));
    const items = filteredRows.map(r => ({
      reseller_id: Number(r.reseller_id),
      seller_type: sellerTypeBulk || ""
    }));
    return { items };
  };

  // --- save changes (selected rows) ---
  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = buildPayload();
      console.log('payloadpayloadpayload',payload)
      if (!payload.items.length) {
        toast.error("Please select rows to save.");
        return;
      }
      const result = await updateByBoxSellerSettings(payload);
      if (!result || result?.isSuccess === false) {
        const msg = result?.message || "Failed to save configuration";
        toast.error(msg);
        return;
      }
      setSelected({});  
      setSellerTypeBulk("")
      toast.success("Saved successfully.");
      await fetchData();
      setLoading(false);
    } catch (err) {
      console.error("Save error", err);
      toast.error(err?.message || "Save error");
      setLoading(false);
    }
  };

  // --- seller cards (unchanged) ---
  const sellerCards = [
    { id: 1, title: "1P Seller", subtitle: "First Party", icon: "/assets/images/master/monitor-up.svg", value: "1P", change: "12% from last month", changeType: "up" },
    { id: 2, title: "2P Seller", subtitle: "Second Party", icon: "/assets/images/master/monitor-up.svg", value: "2P", change: "8% from last month", changeType: "up" },
    { id: 3, title: "3P Seller", subtitle: "Third Party", icon: "/assets/images/master/monitor-up.svg", value: "3P", change: "5% from last month", changeType: "down" },
    { id: 3, title: "Un-Assigned Seller", subtitle: "Un-Assigned Party", icon: "/assets/images/master/monitor-up.svg", value: "3P", change: "5% from last month", changeType: "down" },
  ];

  // --- date formatter ---
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // --- download excel using ExcelJS + file-saver ---
  const handleDownload = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Seller Data");
    console.log('sdssdsdsd')

    worksheet.addRow(["Seller Name", "Reseller ID", "Seller Type", "Last Seen"]);

    sortedData.forEach((row) => {
      worksheet.addRow([
        row.seller_name || "-",
        row.reseller_id || "-",
        "",
        formatDate(row?.last_seen) || "-"
      ]);
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.columns = [
      { width: 25 }, // Seller Name
      { width: 15 }, // Reseller ID
      { width: 15 }, // Seller Type
      { width: 20 }, // Last Seen
    ];


    // 3. Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `buy_box_seller_settings${Date.now()}.xlsx`;
    link.click();
  };

  // --- upload modal open/close handlers ---
  const openUpload = () => setUploadOpen(true);
  const closeUpload = () => setUploadOpen(false);

  // --- handle confirmed upload preview (rows parsed by modal) ---
  const handleUploadConfirm = async ({ fileName, headers, rows }) => {
    try {
      // Map columns from file. Your file had: 'Seller Name', 'Reseller ID', 'Seller Type', 'Last Seen'
      const items = rows.map(r => ({
        reseller_id: Number(r['Reseller ID'] ?? r.reseller_id ?? r.resellerId ?? 0),
        seller_type: String(r['Seller Type'] ?? r.seller_type ?? "").trim()
      }));

      const validItems = items.filter(it => Number.isFinite(it.reseller_id) && it.reseller_id > 0);
      if (validItems.length === 0) {
        toast.error("Uploaded file has no valid Reseller ID values.");
        return;
      }

      const payload = { items: validItems };

      await toast.promise(
        updateByBoxSellerSettings(payload).then(res => {
          if (!res || res?.isSuccess === false) throw new Error(res?.message || "Upload failed");
          return res;
        }),
        {
          loading: `Uploading ${validItems.length} rows...`,
          success: "Upload successful",
          error: (err) => `Upload failed: ${err.message || err}`
        }
      );

      setUploadPreview({ fileName, headers, rows });
      setUploadOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Upload error", err);
      toast.error(err?.message || "Upload failed");
    }
  };

  return (
    <div className="">
      <div className="p-4 bg-gray-50 min-h-[120px]">
        <div className="max-w-full mx-auto rounded-xl bg-white/60 p-4 border border-gray-100 shadow-sm border-[0.48px]">
          <SellerCards cards={sellerCards} counterData={counterData} />
        </div>
      </div>

      <div className="bg-gray-50 mt-2 px-4 flex flex-col">
        <main className="flex-1 px-4 bg-white rounded-lg shadow-md py-2">
          {/* HEADER + ACTIONS */}
          <div className="flex items-center justify-between px-2 py-3">
            <h1 className="text-xl font-semibold text-gray-800">Seller List</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button onClick={handleDownload} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiDownload size={18} />
                </button>
              </div>

              <button onClick={openUpload} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                <img src="/assets/images/master/file-line-chart.svg" alt="icon" className="w-5 h-5" />
                Bulk Upload
              </button>

              {/* <button onClick={handleSave} disabled={(Object.keys(selected).length === 0) || loading} className={`flex items-center gap-2 bg-[#0081F7] text-white px-4 py-2 rounded-lg transition ${(Object.keys(selected).length === 0 || loading) ? "opacity-50 cursor-not-allowed" : ""}`}>
                <img src="/assets/images/master/save.svg" alt="icon" className="w-5 h-5" />
                Save Changes
              </button> */}
            </div>
          </div>

          {/* Search + Type dropdown */}
          <div className="flex gap-4 items-center my-4 px-2">
            {/* <div className="relative w-80">
              <input type="text" placeholder="Search and filter" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ height: 36 }} />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div> */}
            <div className="relative">
              <select
                value={sellerTypeBulk ?? ""}
                onChange={(e) => {
                  setSellerTypeBulk(e.target.value);
                  // toggleRow(row.id,1);
                }}
                className={`appearance-none border px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none pr-8 ${(Object.keys(selected).length === 0 || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={(Object.keys(selected).length === 0) || loading}
              >
                <option value="">Select Seller Type</option>
                <option value="1P">1P</option>
                <option value="2P">2P</option>
                <option value="3P">3P</option>
              </select>
            </div>

            <div className="relative">
              <button onClick={handleSave} disabled={(Object.keys(selected).length === 0) || loading || sellerTypeBulk==""} className={`flex items-center gap-2 bg-[#0081F7] text-white px-4 py-2 rounded-lg transition ${(Object.keys(selected).length === 0 || loading || sellerTypeBulk=="") ? "opacity-50 cursor-not-allowed" : ""}`}>
                <img src="/assets/images/master/save.svg" alt="icon" className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Table component */}
          <SellerTable
            paginatedRows={paginatedRows}
            loading={loading}
            selected={selected}
            toggleRow={toggleRow}
            headerCheckedAll={headerCheckedAll}
            headerIndeterminate={headerIndeterminate}
            toggleSelectAllVisible={toggleSelectAllVisible}
            handleSellerTypeChange={handleSellerTypeChange}
            sortConfig={sortConfig}
            sortTable={sortTable}
            formatDate={formatDate}
          />
        </main>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedData.length)} of {sortedData.length}
          </div>

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>

      <UploadExcelModal open={uploadOpen} onClose={closeUpload} onConfirm={handleUploadConfirm} />
    </div>
  );
}

