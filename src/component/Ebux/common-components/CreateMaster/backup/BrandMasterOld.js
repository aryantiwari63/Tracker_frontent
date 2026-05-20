// BrandMaster.jsx
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

export default function BrandMaster() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  // const [rows, setRows] = useState([]); // [{ brand, _rowIndex }]
  const [error, setError] = useState('');
  const [chips, setChips] = useState([]); // selected brand names 
  const [chipsFromExcel, setChipsFromExcel] = useState([]); // selected brand names setChipsFromExcel
  const [manualValue, setManualValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Acceptable mime types (note: some browsers give empty type -> we also check extension)
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ];

  function resetFile() {
    setFileName('');
    setChipsFromExcel([]);
    setError('');
    setSuccessMsg('')
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  const addChip = (name) => {
    const trimmed = String(name || '').trim();
    if (!trimmed) return;
    const exists = chips.some(c => c.toLowerCase() === trimmed.toLowerCase());
    if (!exists) setChips(prev => [...prev, trimmed]);
  };

  const removeChip = (index, type) => {
    type == 'for_excel' ?
      setChipsFromExcel(prev => prev.filter((_, i) => i !== index)) : setChips(prev => prev.filter((_, i) => i !== index))
  };

  const handleManualAdd = () => {
    if (!manualValue.trim()) return;
    addChip(manualValue);
    setManualValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualAdd();
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    const lowerName = (file.name || '').toLowerCase();
    const hasExcelExt = lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx');
    if (!allowedTypes.includes(file.type) && !hasExcelExt) {
      setError('Please upload an Excel file (.xls or .xlsx)');
      return;
    }

    setError('');
    setSuccessMsg('');
    setParsing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        // If sheet empty
        if (!json || !json.length) {
          setParsing(false);
          setError('Sheet is empty.');
          return;
        }

        const originalKeys = Object.keys(json[0] || {});
        console.log('originalKeysoriginalKeys', originalKeys)
        const lowerToOriginal = {};
        originalKeys.forEach(k => {
          if (typeof k === 'string') lowerToOriginal[k.toLowerCase().trim()] = k;
        });

        // Accept several possible header names (adjust as required)
        const requiredCandidates = ['brand', 'brand_name', 'brand name', 'dark store'];
        let chosenOriginalKey = null;
        for (const cand of requiredCandidates) {
          if (lowerToOriginal[cand]) {
            chosenOriginalKey = lowerToOriginal[cand];
            break;
          }
        }

        if (!chosenOriginalKey) {
          setParsing(false);
          setError('Invalid Excel format — required column "brand" or "brand_name" (or similar) not found.');
          return;
        }

        // const normalizedRows = json.map((row, idx) => {
        //   const raw = row[chosenOriginalKey];
        //   return {
        //     brand: raw !== undefined && raw !== null ? String(raw).trim() : '',
        //     _rowIndex: idx
        //   };
        // }).filter(r => r.brand); 

        const normalizedRows = json
          .map(row => String(row[chosenOriginalKey] || '').trim())
          .filter(v => v); // remove empty rows

        setChipsFromExcel(normalizedRows)
        // setRows(normalizedRows);

        // Optionally add new distinct brands to chips (dedupe case-insensitive)
        // const existingLower = new Set(chips.map(c => c.toLowerCase()));
        // const toAdd = [];
        // normalizedRows.forEach(r => {
        //   if (!existingLower.has(r.toLowerCase())) toAdd.push(r);
        // });

        // console.log('normalizedRowsnormalizedRows222', JSON.stringify(toAdd))
        // if ( toAdd.length) {
        //   setChipsFromExcel(prev => [...prev, ...toAdd]);
        // }

        setParsing(false);
        setSuccessMsg(`${normalizedRows.length} rows parsed.`);
      } catch (err) {
        console.error(err);
        setParsing(false);
        setError('Failed to parse the Excel file.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!chips.length) {
      setError('Add at least one brand before submitting.');
      return;
    }
    setError('');
    setLoading(true);
    setSuccessMsg('');

    try {
      // example POST - replace URL with your server endpoint
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: chips })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Server error');
      }

      setSuccessMsg('Brands saved successfully');
      // optionally clear after save:
      // setChips([]); resetFile();
    } catch (err) {
      setError('Failed to save: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 px-4 ">
      <div className="bg-white shadow-sm border border-gray-200 min-h-[800px]">
        <div className="flex items-center justify-between bg-[#FAFAFA] border-[1px] border-solid border-black/6 p-[16px] ">
          <h2 className="text-lg font-semibold">Brands</h2>
        </div>

        <div className=" gap-6 p-4">
          <div className="font-inter font-semibold text-[16px] leading-[22px] tracking-[0]">What would you like to do? <i className="fa fa-info-circle text-[#666666] px-1" aria-hidden="true"></i></div>

          <div className="mt-4">
            <label className="font-inter font-medium text-[14px] leading-[22px] tracking-[0.02em]">Input Brands Name Manually</label>
            <div className="flex gap-2 w-[30%]">
              <input
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Enter Brand Name"
                className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={handleManualAdd} className="w-[58px] px-3 py-2 bg-[#1890FF] text-white rounded text-sm">Add</button>
            </div>

            {chips?.length > 0 ? (
              <div className="mt-3 w-full h-[90px] p-[10px] gap-[10px] opacity-100 rounded-[4px] border border-[1px]">
                <div className="flex flex-wrap gap-2">
                  {chips.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded text-sm border-[1px] border-solid  border-[#D9D9D9]">
                      <span className="font-roboto font-light text-[16px] leading-[20px] tracking-[0]">{c}</span>
                      <button onClick={() => removeChip(i, 'for_input')} className="text-xs px-1 rounded">X</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-2 flex justify-center">
            <h1 className='font-inter font-medium text-[16px] leading-[22px] tracking-[0.02em] text-center'>Or</h1>
          </div>

          <div className="mt-2">
            <div className="text-md mb-3">
              <div>Upload Brand from sheet (.csv or .xlsx)</div>
              <span className="text-gray-400 block mt-2">Upload the Brand in any given format</span>
            </div>
            <div className="relative bg-[#f3f4f6]">
              <div
                className="relative rounded border-2 border-dashed border-blue-300 p-4 text-center h-[300px]"
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <div className="flex flex-col justify-center absolute left-[44%] top-[24%]">


                  <img className='w-[38px] h-[33.3px] -translate-x-1/2 ml-[60px]' src="/assets/images/master/Vector.svg" alt="" />
                  <p className="text-sm text-gray-600 py-2">
                    <span className="block">Click to Upload</span>
                    <span className="block">or</span>
                    <span className="block">Drag & Drop file here</span>
                  </p>

                  <div className="mt-4">
                    <input
                      ref={fileInputRef}
                      onChange={onInputChange}
                      accept=".xls,.xlsx"
                      type="file"
                      className="hidden"
                    />

                    {fileName ?
                      <div className="mt-3 flex items-center gap-3">
                        <div className="text-sm text-gray-700">{fileName}</div>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          resetFile();
                        }} className="text-sm px-3 py-1 border rounded text-gray-600">Remove</button>
                      </div>

                      : <></>}

                    {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
                    {successMsg && <div className="text-sm text-green-600 mt-2">{successMsg}</div>}
                  </div>
                </div>
              </div>

              {parsing && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-blue-700 font-medium">Parsing Excel…</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {chipsFromExcel.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Preview ({chipsFromExcel.length} brands)</h3>
                  </div>

                  <div className="overflow-x-auto border rounded">

                    {chipsFromExcel?.length > 0 ? (
                      <div className="mt-3 w-full min-h-[200px] p-[8px] gap-[10px] opacity-100 rounded-[4px]">
                        <div className="flex flex-wrap gap-2">
                          {chipsFromExcel.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded text-sm border-[1px] border-solid  border-[#D9D9D9]">
                              <span className="font-roboto font-light text-[16px] leading-[20px] tracking-[0]">{c}</span>
                              <button onClick={() => removeChip(i, 'for_excel')} className="text-xs px-1 rounded">X</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                  </div>
                </div>
              ) : <></>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 p-4">
          <button onClick={() => { setChips([]); resetFile(); setError(''); setSuccessMsg(''); }} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && <div className="mt-3 text-sm text-red-600 p-4">{error}</div>}
        {successMsg && <div className="mt-3 text-sm text-green-600 p-4">{successMsg}</div>}
      </div>
    </main>
  );
}
