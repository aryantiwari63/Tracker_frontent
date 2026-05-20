import React from "react";

const AlertBox = ({
  posImp,
  posSpend,
  posCtr,
  posCpc,
  posRoas,
  negImp,
  negSpend,
  negCtr,
  negCpc,
  negRoas,
  negCpm,
  posCpm,
  platformIcon,
  campaignType,
  posClicks,
  negClicks,
  posSales,
  negSales,
}) => {
  return (
    <>
      <div className="flex-1 mt-2 bg-white">
        <div className=" h-7 pl-2 text-2xl font-extrabold my-2">
          {campaignType}
        </div>
        <div className="">
          {" "}
          <div className="border rounded mb-[4px] mx-1 px-2   w-30 py-1 h-[80px] ">
            {/* h-[80px] border rounded mt-[5.5px] m-1 px-2 border w-52 py-5 bg-white
            font-semibold */}
            <img
              className="inline-block align-middle h-16"
              src={platformIcon}
              alt=""
            />
          </div>
          <div className="  h-[73px] rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {negImp !== null ? Math.abs(negImp?.toFixed(2)) : 0}%
              <img
                src="/assets/images/negArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {posImp !== null ? posImp?.toFixed(2) : 0}%
              <img
                src="/assets/images/posArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {negClicks !== null ? Math.abs(negClicks?.toFixed(2)) : 0}%
              <img
                src="/assets/images/negArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {posClicks !== null ? posClicks?.toFixed(2) : 0}%
              <img
                src="/assets/images/posArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {negSpend !== null ? Math.abs(negSpend?.toFixed(2)) : 0}%
              <img
                src="/assets/images/negArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {posSpend !== null ? posSpend?.toFixed(2) : 0}%
              <img
                src="/assets/images/posArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {negSales !== null ? Math.abs(negSales?.toFixed(2)) : 0}%
              <img
                src="/assets/images/negArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {posSales !== null ? posSales?.toFixed(2) : 0}%
              <img
                src="/assets/images/posArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {negCtr !== null ? Math.abs(negCtr?.toFixed(2)) : 0}%
              <img
                src="/assets/images/negArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {posCtr !== null ? posCtr?.toFixed(2) : 0}%
              <img
                src="/assets/images/posArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {posCpc !== null ? posCpc?.toFixed(2) : 0}%
              <img
                src="/assets/images/down_green.svg"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {negCpc !== null ? Math.abs(negCpc?.toFixed(2)) : 0}%{" "}
              <img
                src="/assets/images/up_red.svg"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {negRoas !== null ? Math.abs(negRoas?.toFixed(2)) : 0}%
              <img
                src="/assets/images/negArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {posRoas !== null ? posRoas?.toFixed(2) : 0}%
              <img
                src="/assets/images/posArrow.png"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
          <div className="  h-[73px] border rounded mt-[5.5px] m-1 px-2 border w-30 p-4 bg-white font-semibold    ">
            <div className="flex">
              {" "}
              {posCpm !== null ? posCpm?.toFixed(2) : 0}%
              <img
                src="/assets/images/down_green.svg"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
            <div className="flex">
              {" "}
              {negCpm !== null ? Math.abs(negCpm?.toFixed(2)) : 0}%
              <img
                src="/assets/images/up_red.svg"
                alt="loader"
                className="h-1/2 m-[4.5px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertBox;
