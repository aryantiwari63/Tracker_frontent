// import React from "react";

// export default function WeightageCard({ title, subtitle, percentage, isTotal = false, onChange }) {
//   const pct = Number(percentage) || 0;
//   const circumference = 2 * Math.PI * 16;
//   const strokeDashoffset = circumference - (pct / 100) * circumference;

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-3 relative">
//       <div className="flex gap-3">
//         <div className="flex-1">
//           <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>

//           {isTotal ? (
//             <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
//           ) : (
//             <p className="text-sm text-white mb-3">-</p>
//           )}

//           <input
//             type="text"
//             value={pct}
//             min={0}
//             max={100}
//             onKeyDown={(e) => {
//               // allow only digits and special keys
//               if (
//                 !/[0-9]/.test(e.key) &&
//                 e.key !== "Backspace" &&
//                 e.key !== "Tab" &&
//                 e.key !== "ArrowLeft" &&
//                 e.key !== "ArrowRight" &&
//                 !(e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
//               ) {
//                 e.preventDefault();
//               }
//             }}
//             onChange={(e) => {
//               let val = e.target.value;

//               // Allow empty while typing
//               if (val === "") {
//                 onChange(0);
//                 return;
//               }

//               // Remove any non-digit characters
//               val = val.replace(/\D/g, "");

//               // 🔥 Special case: Allow exact 100
//               if (val === "100") {
//                 onChange(100);
//                 return;
//               }

//               // 🔥 If more than 2 digits, keep only first 2
//               if (val.length > 2) {
//                 val = val.slice(0, 2); // take first 2 digits
//               }

//               let num = Number(val);

//               // Enforce max & min
//               if (num > 100) num = 100;
//               if (num < 0) num = 0;

//               onChange(num);
//             }}

//             className="w-[74%] px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             disabled={isTotal}
//           />

//         </div>

//         <div className="flex-shrink-0">
//           <div className="relative w-14 h-14">
//             <svg className="w-15 h-15 transform -rotate-90" viewBox="0 0 56 56">
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="16"
//                 stroke="#e5e7eb"
//                 strokeWidth="3"
//                 fill="none"
//               />
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="16"
//                 stroke={isTotal ? '#1890FF' : '#60a5fa'}
//                 strokeWidth="3"
//                 fill="none"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={strokeDashoffset}
//                 strokeLinecap="round"
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span
//                 className="text-[10px] font-semibold"
//                 style={{ color: "#1890FF" }}
//               >
//                 {pct}%
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









import React, { useEffect, useRef, useState } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

/**
 * WeightageCard
 *
 * Props:
 *  - title: string
 *  - subtitle: string
 *  - percentage: number
 *  - isTotal: boolean (optional)
 *  - onChange: function(newNumber)
 */
export default function WeightageCard({ title, subtitle, percentage, isTotal = false, onChange }) {
  const pct = Number(percentage) || 0;

  // local editing state + temp value
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(pct);

  // input ref so we can focus when editing starts
  const inputRef = useRef(null);

  useEffect(() => {
    // keep localValue in sync if parent changes percentage from outside
    if (!editing) setLocalValue(pct);
  }, [pct, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      // small timeout so focus after render
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [editing]);

  // circle math
  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const startEditing = () => {
    if (isTotal) return;
    setLocalValue(pct);
    setEditing(true);
  };

  const cancelEditing = () => {
    setLocalValue(pct);
    setEditing(false);
  };

  const saveEditing = () => {
    // clamp & sanitize
    let val = Number(localValue) || 0;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    onChange && onChange(val);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    // allow empty while typing
    if (val === "") {
      setLocalValue("");
      return;
    }
    // remove non-digits
    val = val.replace(/\D/g, "");
    // allow exact 100
    if (val === "100") {
      setLocalValue("100");
      return;
    }
    // limit to 2 digits otherwise
    if (val.length > 2) val = val.slice(0, 2);
    let num = Number(val);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setLocalValue(String(num));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 relative">
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>

            {/* Edit controls */}
            {!isTotal && (
              <div className="ml-2 flex items-center gap-2">
                {!editing ? (
                  <button
                    type="button"
                    onClick={startEditing}
                    title="Edit"
                    className="text-gray-500 hover:text-gray-700 p-1 rounded"
                  >
                    <FiEdit2 size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={saveEditing}
                      title="Save"
                      className="text-green-600 hover:text-green-800 p-1 rounded"
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      title="Cancel"
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                    >
                      <FiX size={16} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isTotal ? (
            <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
          ) : (
            <p className="text-sm text-white mb-3">-</p>
          )}

          <input
            ref={inputRef}
            type="text"
            value={localValue === "" ? "" : Number(localValue)}
            min={0}
            max={100}
            onKeyDown={(e) => {
              // allow only digits and editing keys while typing
              if (
                !editing &&
                !["Tab", "Backspace", "ArrowLeft", "ArrowRight"].includes(e.key)
              ) {
                // when not editing, prevent typing
                e.preventDefault();
                return;
              }
              // if editing, allow digit handling + Enter/Escape
              if (editing) handleKeyDown(e);
            }}
            onChange={handleChange}
            className={`w-[74%] px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isTotal || !editing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white text-gray-900"
            }`}
            disabled={isTotal || !editing}
            placeholder="0"
          />
        </div>

        <div className="flex-shrink-0">
          <div className="relative w-14 h-14">
            <svg className="w-15 h-15 transform -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="16" stroke="#e5e7eb" strokeWidth="3" fill="none" />
              <circle
                cx="28"
                cy="28"
                r="16"
                stroke={isTotal ? "#1890FF" : "#60a5fa"}
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-semibold" style={{ color: "#1890FF" }}>
                {pct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
