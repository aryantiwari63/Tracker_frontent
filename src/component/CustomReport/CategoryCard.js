import React from "react";
import { useHistory } from "react-router-dom";

function CategoryCard({ typesOfReport, color, path }) {
  const history = useHistory();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {typesOfReport?.map((content, index) => (
        <div className={`flex cursor-pointer`} key={index}>
          <div
            className={`w-full sm:w-auto md:w-full rounded overflow-hidden px-2 py-4 border border-gray-100`}
            style={{
              backgroundColor: content.bg ? color : "#ffffff",
            }}
            onClick={() =>
              history.push(path, {
                reportTypeValue: content?.value,
                edit: false,
              })
            }
          >
            <div className="flex items-center ">
              <img
                className="w-7 h-7 rounded-full mr-4"
                src={content?.logo}
                alt="Logo"
              />
              <div
                className={`font-normal  text-[14px] leading-[17px] text-[${
                  content.bg ? "#ffffff" : "#000000"
                }] `}
              >
                {content?.title}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategoryCard;
