const AmsAdgroupTable = ({
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
                        <div className="tableHead px-1">
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
              {bodyContent?.map((item) => {
                return (
                  <>
                    <tr>
                      {isCheckBoxRequired === true && (
                        <td className="pl-2 sticky left-0 z-10">
                          <input className="h-16" type="checkbox" />
                        </td>
                      )}
                      <td className="bg-white text-blue-400 sticky left-14 max-w-[43px] box-border overflow-hidden">
                        {item.state}
                      </td>
                      <td className="bg-white pr-4 box-border  left-64 text-green-400 z-10">
                        {item.ad_groups}
                      </td>
                      <td className="pr-4 ">{item.campaign_name}</td>
                       <td className="pr-4">{item.status}</td>
                      <td className="pr-4">{item.keywords}</td>
                     <td className="pr-4 px-2">{item.products}</td>
                      <td className="pr-4">{item.impressions}</td>
                      <td className="pr-4">{item.clicks}</td>
                      <td className="pr-4">{item.ctr}</td>
                      <td className="pr-4">{item.spend_inr}</td>
                      <td className="pr-4">{item.cpc_inr}</td>
                      <td className="pr-4">{item.sales}</td>
                      <td className="pr-4">{item.orders}</td>
                      <td className="pr-4">{item.acos}</td>
                      <td className="pr-4">{item.ads}</td>
                      <td className="pr-4">{item.unit_solds}</td>
                      <td className="pr-4">{item.new_brandorders}</td>
                      <td className="pr-4">{item.percent_new}</td>
                      <td className="pr-4">{item.new_brand_ntbsales}</td>
                      <td className="pr-4">{item.percent_sales_newntb}</td>
                    </tr>
                  </>
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
                        <td className="sticky left-0 text-base font-semibold py-3 ">
                          Result{" "}
                        </td>
                        <td className="font-semibold pr-4">{item.state}</td>
        <td className="font-semibold pr-4">{item.ad_groups}</td>
        <td className="font-semibold pr-4">{item.campaign_name}</td>
        <td className="font-semibold pr-4">{item.status}</td>
        <td className="font-semibold pr-4">{item.keywords}</td>
        <td className="font-semibold pr-4">{item.products}</td>
        <td className="font-semibold pr-4">{item.impressions}</td>
        <td className="font-semibold pr-4">{item.clicks}</td>
        <td className="font-semibold pr-4">{item.ctr}</td>
        <td className="font-semibold pr-4">{item.spend_inr}</td>
        <td className="font-semibold pr-4">{item.cpc_inr}</td>
        <td className="font-semibold pr-4">{item.sales}</td>
        <td className="font-semibold pr-4">{item.orders}</td>
        <td className="font-semibold pr-4">{item.acos}</td>
        <td className="font-semibold pr-4">{item.ads}</td>
        <td className="font-semibold pr-4">{item.unit_solds}</td>
        <td className="font-semibold pr-4">{item.new_brandorders}</td>
        <td className="font-semibold pr-4">{item.percent_new}</td>
        <td className="font-semibold pr-4">{item.new_brand_ntbsales}</td>
        <td className="font-semibold pr-4">{item.percent_sales_newntb}</td>
                       
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

export default AmsAdgroupTable;
