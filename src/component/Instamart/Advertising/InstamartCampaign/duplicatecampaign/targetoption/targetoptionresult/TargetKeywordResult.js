import React from "react";

const TargetKeywordResult = ({ campaignData }) => {
  return (
    <>
      <div className="pt-4"> Keyword Targeting</div>

      <table className="border rounded-md">
        <thead className="bg-gray-200  h-6">
          <tr className="font-light text-gray-600 text-xs h-11">
            <th className="w-[110px] text-center">Keyword</th>
            <th className="w-[110px] text-center">Exact Match Bid</th>
            <th className="w-[110px] text-center">Smart Match Bid</th>
          </tr>
        </thead>
        <tbody>
          {campaignData &&
            campaignData?.keywords?.length &&
            campaignData?.keywords.map((keyword, i) => {
              return (
                <tr key={i} className="h-11">
                  <td className=" w-[70px] text-center">{keyword.keyword}</td>
                  <td className=" w-[70px] text-center">{keyword.cpm}</td>
                  <td className=" w-[70px] text-center">
                    {keyword.smartcpm ? "on" : "off"}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
export default TargetKeywordResult;
