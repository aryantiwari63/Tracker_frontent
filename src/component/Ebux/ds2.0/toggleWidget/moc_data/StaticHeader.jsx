import React from "react";

const StaticHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-center py-[4px] px-[5px] bg-white">
        <div>
          <h2 className="text-[10px] font-semibold text-[#000000]">
            Digital Shelf Management
          </h2>
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <div className="cursor-pointer h-[20px] border border-gray-300 rounded-md shadow-sm bg-white px-2 pt-1 pb-1 leading-none inline-block relative">
              <div className="flex items-center gap-1  absolute -top-[8px] left-1 bg-white p-[3px] rounded-full ">
                <svg
                  width={8}
                  height={8}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6667 2.66797H3.33333C2.59695 2.66797 2 3.26492 2 4.0013V13.3346C2 14.071 2.59695 14.668 3.33333 14.668H12.6667C13.403 14.668 14 14.071 14 13.3346V4.0013C14 3.26492 13.403 2.66797 12.6667 2.66797Z"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6641 1.33203V3.9987"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33594 1.33203V3.9987"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 6.66797H14"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33594 9.33203H5.3426"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9.33203H8.00667"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6641 9.33203H10.6707"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33594 12H5.3426"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12H8.00667"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.6641 12H10.6707"
                    stroke="black"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[3px] font-semibold text-gray-800">
                  Current Date Range
                </span>
              </div>
              <div className="flex items-center text-[6px] text-gray-600 mt-[3px]">
                31/08/25
                <span className="mx-1 text-gray-500">
                  <svg
                    width={6}
                    height={6}
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.83594 8.0612H13.1693M13.1693 8.0612L8.5026 3.39453M13.1693 8.0612L8.5026 12.7279"
                      stroke="black"
                      strokeOpacity="0.65"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                06/09/25
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-full ">
              <span className="text-[6px] font-semibold text-gray-800">
                Compare:
              </span>
              <button
                aria-pressed="false"
                className="
    relative inline-flex h-[12px] w-[22px] items-center rounded-full transition
    bg-neutral-300
    shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]
  "
                // fdprocessedid="dmn2xo"
              >
                <span
                  className="
      pointer-events-none inline-block h-[8px] w-[8px] rounded-full bg-white transform transition
      translate-x-[2px]
      shadow-[0_1px_1px_rgba(0,0,0,0.2)]
    "
                />
              </button>
            </div>
            <button className="px-[4px] py-[2px] rounded border border-gray-400">
              <div className="flex gap-1 items-center">
                <img
                  className="rounded-full w-[8px] h-[8px]"
                  src="/assets/images/nestleLogo.svg"
                  alt="Nestle"
                />
                <h2 className="capitalize text-[6px] font-semibold">Nestle</h2>
                <img
                src="/assets/images/dropdownArrow.svg"
                className="w-[5px] h-[5px]"
                alt
              />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticHeader;
