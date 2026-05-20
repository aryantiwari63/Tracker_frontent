// UploadExcelModal.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcelModal({ open, onClose, onConfirm }) {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState("");
    const [previewRows, setPreviewRows] = useState([]); // array of objects
    const [headers, setHeaders] = useState([]); // array of header strings
    const [error, setError] = useState("");

    const reset = () => {
        setFileName("");
        setPreviewRows([]);
        setHeaders([]);
        setError("");
        setDragOver(false);
    };

    const closeAndReset = () => {
        reset();
        onClose?.();
    };

    const handleFile = async (file) => {
        try {
            setError("");
            setFileName(file.name);

            // read file
            const data = await file.arrayBuffer();
            // parse workbook
            const workbook = XLSX.read(data, { type: "array" });

            // get first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // convert to json
            const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            if (!json || json.length === 0) {
                setError("No data found in the first sheet.");
                setPreviewRows([]);
                setHeaders([]);
                return;
            }

            const hdrs = Object.keys(json[0]);
            setHeaders(hdrs);
            setPreviewRows(json);
        } catch (err) {
            console.error("Failed to parse file", err);
            setError("Failed to read the file. Make sure it's a valid Excel/CSV file.");
            setPreviewRows([]);
            setHeaders([]);
        }
    };

    const onDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        await handleFile(file);
    };

    const onFileInputChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await handleFile(file);
    };

    const onConfirmClick = () => {
        if (!previewRows || previewRows.length === 0) {
            setError("No data to confirm. Please select a file first.");
            return;
        }
        onConfirm?.({ fileName, headers, rows: previewRows });
        reset();
    };

    // const hasInvalidSellerType = previewRows.some((r) => {
    //     const type = (r["Seller Type"] || "").toString().trim();
    //     return !!(type && !["1P", "2P", "3P"].includes(type));
    // });

    const hasInvalidSellerType = previewRows.some((r) => {
        const type = (r["Seller Type"] || "").toString().trim();
        return type === "" || !["1P", "2P", "3P"].includes(type);
    });

    if (!open) return null;

    const isFileUploaded = previewRows.length > 0;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-[95%] md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-lg font-semibold">Upload Excel (drag & drop)</h2>
                    {/* <div className="flex items-center gap-2">
            <button onClick={closeAndReset} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
          </div> */}
                </div>

                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 px-4 py-2">
                    <li>
                        <span className="font-medium"> Download the complete seller list.</span>
                    </li>
                    <li>
                        <span className="font-medium">Fill the Seller Type column with your preferred type — </span><em>1P</em>, <em>2P</em>, or <em>3P</em>.
                    </li>
                    <li>
                        <span className="font-medium">Upload the updated sheet using the Bulk Upload option.</span>
                    </li>
                </ol>

                {/* Body */}
                <div className="p-4">
                    <div
                        onDragOver={(e) => {
                            if (isFileUploaded) return;
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            if (isFileUploaded) return;
                            onDrop(e);
                        }}
                        className={`w-full border-2 rounded-md p-6 flex flex-col items-center justify-center gap-3 text-center ${dragOver ? "border-blue-400 bg-blue-50" : "border-dashed border-gray-300 bg-white"}`}
                        style={{ minHeight: 160 }}
                    >
                        <div className="text-sm text-gray-600">
                            {fileName ? (
                                <div>
                                    <div className="font-medium">{fileName}</div>
                                    {/* <div className="text-xs text-gray-500">Drop another file to replace</div> */}
                                    <div className="font-medium">
                                        {isFileUploaded
                                            ? "File uploaded successfully"
                                            : "Drag & drop file here"}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="font-medium">Drag & drop file here</div>
                                    <div className="text-xs text-gray-500">or click to choose an Excel / CSV file</div>
                                </div>
                            )}
                        </div>

                        <input type="file" accept=".xlsx,.xls,.csv" disabled={isFileUploaded} onChange={onFileInputChange} className="hidden" id="excel-file-input" />
                        <label htmlFor="excel-file-input" className={`px-4 py-2 rounded-md text-sm ${isFileUploaded
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white cursor-pointer"
                            }`}>Browse file</label>
                    </div>

                    {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

                    {previewRows && previewRows.length > 0 && (
                        <div className="mt-4 overflow-auto max-h-[45vh] border rounded">
                            <table className="min-w-full divide-y">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {headers.map((h) => (
                                            <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-600">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {previewRows.map((row, idx) => (
                                        <tr key={idx} className={`odd:bg-white even:bg-gray-50`}>
                                            {headers.map((h) => (
                                                <td
                                                    key={h}
                                                    className={`px-3 py-2 text-sm text-gray-700 whitespace-pre-wrap max-w-[300px] ${(h === "Seller Type" && (row["Seller Type"] === "" || !["1P", "2P", "3P"].includes(row["Seller Type"]))) ? "!bg-[#ffadad]" : ""
                                                        }`}
                                                >
                                                    {String(row[h] ?? "")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!previewRows || previewRows.length === 0 ? (
                        <div className="mt-2 text-sm text-gray-500">Preview will appear here after upload.</div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-4 py-3 border-t">
                    <button onClick={closeAndReset} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                    <button
                        onClick={onConfirmClick}
                        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                        disabled={!previewRows || previewRows.length === 0 || hasInvalidSellerType}
                    >
                        Confirm & Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
