import React from "react";

const ActionDetail = ({ data }) => {
 
  return (
    <>
      <div className={"max-h-[400px] max-w-[1200px] p-4 flex justify-stretch"}>
        <table className="min-w-full">
          <tr>
            <th className="min-w-[200px]">Action Type</th>
            <th className="min-w-[300px]">Status message</th>
          </tr>
          <tbody>
            <tr>
              <td>
                {data?.action_type ? (
                  <div className="flex justify-center">{data?.action_type}</div>
                ) : (
                  <div className="flex justify-center">-</div>
                )}
              </td>
              <td>
                {data?.action_message ? (
                  <div className="flex justify-center">{data?.action_message}</div>
                ) : (
                  <div className="flex justify-center">-</div>
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
