import React from "react";

const TargetCategoryResult = ({ campaignData }) => {
  return (
    <>
      <div className="pt-4">
        Category Targeting
        <table className=" rounded border ">
          <thead className="bg-gray-200 ">
            <tr className="font-light text-gray-600 text-xs h-11">
              <th className="w-[70px] ">Category</th>
              <th className="w-[70px]">CPM</th>
            </tr>
          </thead>
          <tbody className="bg-white  ">
            {campaignData?.categoryData &&
              campaignData?.categoryData.length &&
              campaignData?.categoryData.map((data) => {
                return (
                  <>
                    <tr className="h-8 ">
                      <td className="w-[70px] text-center">{data?.keyword}</td>
                      <td className="w-[70px] text-center">
                        {data.cpm ? data.cpm : "-"}
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default TargetCategoryResult;
