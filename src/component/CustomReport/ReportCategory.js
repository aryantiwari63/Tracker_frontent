import React from "react";

const ReportCategory = ({ contentArray, setCategory, active, color }) => {
  return (
    <div className="grid grid-cols-3 border rounded bg-[#F8F8F8] border-[#E3E3E3]">
      {contentArray.map((content, index) => (
        <div
          key={index}
          className={`p-1 cursor-pointer `}
          onClick={() => setCategory(content.value)}
        >
          <p
            className={`py-1 px-1 rounded text-center `}
            style={{
              background: active === content.value ? color : "",
              color: active === content.value ? "#ffffff" : "#5B5B5B",
            }}
          >
            {content.title}
          </p>
        </div>
      ))}
    </div>
  );
};
export default ReportCategory;
