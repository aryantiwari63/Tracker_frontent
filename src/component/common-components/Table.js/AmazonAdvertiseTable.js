
const AmazonAdvertiseTable = ({
  headers,
  bodyContent,
  isCheckBoxRequired,
}) => {
  return (
    <>
      <div className="bg-white w-full">
        <div
          className={
            isCheckBoxRequired
              ? "campaignreportcheckbox__table "
              : "campaignreport__table "
          }
        >
          <table>
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 z-20"
                  : "campaignreport__tablehead  table-fixed sticky top-0 z-20"
              }
            >
              <tr>
                {isCheckBoxRequired === true && (
                  <th className="pr-6">
                    <input
                      className="h-16 "
                      type="checkbox"
                      //   checked={
                      //     bodyContent?.length > 0 &&
                      //     selectedCheckBox?.length == bodyContent?.length
                      //   }
                      //   onChange={(e) => handleAllCheckBox(e, bodyContent)}
                    />
                  </th>
                )}

                {headers?.map((item) => {
                  return (
                    <>
                      <th>
                        <div className="tableHead px-2.5">
                          <p>{item.name}</p>
                          {item.show && (
                            <div className="sortArrow cursor-pointer">
                              <div>
                                <div
                                //   onClick={() => sortData(item?.value, 1)}
                                >
                                  ▲
                                </div>
                              </div>
                              <div>
                                <div
                                  className="downArrow"
                                  //   onClick={() => sortData(item?.value, -1)}
                                >
                                  ▼
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </th>
                    </>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {bodyContent?.map((item, i) => {
                return (
                  <tr key={i}>
                    {isCheckBoxRequired === true && (
                      <td className="pl-2 sticky left-0 z-10">
                        <input className="h-16" type="checkbox" />
                      </td>
                    )}
                    <td className="bg-white text-blue-400 sticky left-14 max-w-[43px] box-border overflow-hidden">
                      {item.campaigns}
                    </td>
                    <td className="bg-white pr-4 box-border  left-64 text-green-400 z-10">
                      {item.status}
                    </td>
                    <td className="pr-4 ">{item.type}</td>
                    <td className="pr-4 text-blue-400 text-center">
                      {item.targeting}
                    </td>
                    <td className="pr-4">{item.campaign_bidding_strategy}</td>
                    <td className="pr-1">
                      {" "}
                      <button className="border-1 px-1 py-1 bg-gray-200">
                        {item.start_date}
                      </button>
                    </td>
                    <td className="pr-1 ">
                      <button className="border px-1 py-1  bg-[#EBEDF0]">
                        {item.end_date}
                      </button>
                    </td>
                    <td className="px-3">{item.portfolio}</td>
                    <td className="pr-4 ">
                      <button className="border-1 p-1 bg-[#F8F9FA]">
                        {item.budget_inr}
                      </button>
                    </td>
                    <td className="pr-4 b">{item.top_search}</td>
                    <td className="pr-4">{item.cost_type}</td>
                    <td className="pr-4">{item.impressions}</td>
                    <td className="pr-4">{item.clicks}</td>
                    <td className="pr-4">{item.ctr}</td>
                    <td className="pr-4">{item.spend}</td>
                    <td className="pr-4">{item.cpc}</td>
                    <td className="pr-4">{item.orders}</td>
                    <td className="pr-4">{item.sales}</td>
                    <td className="pr-4">{item.acos}</td>
                    <td className="pr-4">{item.roas}</td>
                    <td className="pr-4">{item.ntb_orders}</td>
                    <td className="pr-4">{item.ntb_orderspercentage}</td>
                    <td className="pr-4">{item.ntb_sales}</td>
                    <td className="pr-4">{item.ntb_salespercentage}</td>
                    <td className="pr-4">{item.viewable_impressions}</td>
                    <td className="pr-4">{item.vcpm}</td>
                    <td className="pr-4">{item.video_first_quartile}</td>
                    <td className="pr-4">{item.video_midpoint}</td>
                    <td className="pr-4">{item.video_third_quartile}</td>
                    <td className="pr-4">{item.video_complete}</td>
                    <td className="pr-4">{item.unmute}</td>
                    <td className="pr-4">{item.vtr}</td>
                    <td className="pr-4">{item.vctr}</td>
                  </tr>
                );
              })}
            </tbody>
            {/* {footer && (
              <tfoot
                className="sticky bottom-0 z-20"
                style={{ boxShadow: "1px 5px 15px rgba(0,0,0,0.5)" }}
              >
                <tr className="bg-white">
                  {footer?.map((item) => {
                    return (
                      <>
                        <td className="sticky left-0 text-base font-semibold py-3">
                          Result{" "}
                        </td>
                        <td className="font-semibold pr-4">
                          {item.campaignname}
                        </td>
                        <td className="font-semibold pr-4">{item.state}</td>
                        <td className="font-semibold pr-4">{item.status}</td>
                        <td className="font-semibold pr-4">
                          {item.active_totaladgroup}
                        </td>
                        <td className="font-semibold pr-4">
                          {item.profilename}
                        </td>
                        <td className="font-semibold pr-4">{item.campaign}</td>
                        <td className="font-semibold pr-4">{item.targeting}</td>
                        <td className="font-semibold pr-4">{item.daily}</td>
                        <td className="font-semibold pr-4">{item.bid}</td>
                        <td className="font-semibold pr-4">
                          {item.impressions}
                        </td>
                        <td className="font-semibold pr-4">{item.clicks}</td>
                        <td className="font-semibold pr-4">{item.ctr}</td>
                        <td className="font-semibold pr-4">{item.spend}</td>
                        <td className="font-semibold pr-4">{item.cpc}</td>
                      </>
                    );
                  })}
                </tr>
              </tfoot>
            )} */}
          </table>
        </div>
      </div>
    </>
  );
};

export default AmazonAdvertiseTable;
