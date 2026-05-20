// InfoTooltip.jsx
import React, { useState } from "react";

export default function InfoTooltip({
  text,
  position = "top",
}) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex group">
      {/* i button */}
      <span
        className="
          flex items-center justify-center
          w-4 h-4
          rounded-full
          bg-gray-300 text-gray-700
          text-xs font-semibold
          cursor-pointer
          hover:bg-gray-400
        "
        onMouseEnter={()=>setOpen(true)}
        onMouseLeave={()=>setOpen(false)}
      >
        i
      </span>

      {/* tooltip */}
      {open?
      <div
        className={`
          absolute z-50
          rounded-md
          bg-gray-900
          px-2 py-1
          text-xs text-white
          opacity-0 scale-95
          transition-all duration-150
          group-hover:opacity-100
          group-hover:scale-100
          max-w-[450px] min-w-[450px]
          whitespace-normal
          break-words
          ${positionClasses[position]}
        `}
      >
        {text}
      </div>
      :<></>}
    </div>
  );
}
