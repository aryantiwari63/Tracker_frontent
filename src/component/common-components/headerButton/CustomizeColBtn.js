import React, { useState } from "react";

const CustomizeColBtn = ({ className = "", onClick = false }) => {
  const [columnHover, setColumnHover] = useState(false);
  return (
    <button
      className={`campaignreport__btn flex !rounded-md hover:border-none ${className}`}
      onMouseEnter={() => setColumnHover(true)}
      onMouseLeave={() => setColumnHover(false)}
      onClick={() => onClick && onClick()}
    >
      <img
        className="w-[14px]"
        src={
          columnHover
            ? "/assets/images/columns-white.svg"
            : "/assets/images/columns.svg"
        }
        alt=""
      />
    </button>
  );
};

export default CustomizeColBtn;
