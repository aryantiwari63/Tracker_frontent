import React from "react";

const ActionDetail = ({ data }) => {
  let mapping = {
    campaign: [{key: "campaign_name",label: "Campaign Name"}],
    keyword: [{key: "campaign_name",label: "Campaign Name"},{key: "keywords",label: "Keyword"}],
    category: [{key: "campaign_name",label: "Campaign Name"},{key: "category_name",label: "Category"}]
  }
  return (
    <>
     <div className="max-h-[400px] max-w-[1200px] p-4 flex justify-stretch overflow-auto">
  <table className="min-w-full table-auto">
    <thead>
      <tr>
        <th className="px-4 py-2 text-center border">Action Type</th>
        {mapping[data.action_type.toLowerCase()]?.map((item, idx) => (
          <th key={idx} className="px-4 py-2 text-center border">{item.label}</th>
        ))}
        <th className="px-4 py-2 text-center border">Message</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-2 border">
          {data?.action_type ? (
            <div className="text-center break-words">{data?.action_type}</div>
          ) : (
            <div className="text-center">-</div>
          )}
        </td>
        {mapping[data.action_type.toLowerCase()]?.map((item, idx) => (
          <td key={idx} className="px-4 py-2 border">
            <div className="text-center break-words">
              {data[item.key] ? data[item.key] : '-'}
            </div>
          </td>
        ))}
        <td className="px-4 py-2 border">
          {data?.message ? (
            <div className="text-center break-words">{data?.message}</div>
          ) : (
            <div className="text-center">-</div>
          )}
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </>
  );
};

export default ActionDetail;
