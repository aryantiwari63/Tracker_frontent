const AmsAsinTable = ({
  headers,
  bodyContent,
  footer,
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
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 z-[20]"
                  : "campaignreport__tablehead  table-fixed sticky top-0 z-[20]"
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
                        <div className="tableHead px-3">
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
                      <td className="bg-white text-blue-400 sticky left-14  box-border overflow-hidden ">
                        {item.products}
                      </td>
                      <td className="pr-4 text-green-400 text-center bg-white  box-border  left-64  z-10">
                        {item.asin_id}
                      </td>
                      <td className="pr-4 px-3">{item.portfolio}</td>
                      <td className="pr-4 text-blue-400">
                        {item.campaign_name}
                      </td>
                      <td className="pr-4">{item.status}</td>
                      <td className="pr-4">{item.type}</td>
                      <td className="pr-4">{item.sales}</td>
                      <td className="pr-4">{item.roas}</td>
                      <td className="pr-4">{item.conversion_rate}</td>
                      <td className="pr-4">{item.impressions}</td>
                      <td className="pr-4">{item.clicks}</td>
                      <td className="pr-4">{item.ctr}</td>
                      <td className="pr-4">{item.spend}</td>
                      <td className="pr-4">{item.cpc}</td>
                      <td className="pr-4">{item.orders}</td>
                      <td className="pr-4">{item.acos}</td>
                      <td className="pr-4">{item.ntb_orders}</td>
                      <td className="pr-4">{item.percent_orders_ntb}</td>
                      <td className="pr-4">{item.ntb_sales}</td>
                      <td className="pr-4">{item.percent_sales_ntb}</td>
                      <td className="pr-4">{item.viewable_impressions}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
            {footer && (
              <tfoot
                className="sticky bottom-0 z-[20] "
                style={{ boxShadow: "1px 5px 15px rgba(0,0,0,0.5)" }}
              >
                <tr className="bg-white">
                  {footer?.map((item) => {
                    return (
                      <>
                        <td className="sticky left-0 text-base font-semibold py-3">
                          Result{" "}
                        </td>
                        <td className="font-semibold pr-4">{item.products}</td>
    <td className="font-semibold pr-4">{item.asin_id}</td>
    <td className="font-semibold pr-4">{item.portfolio}</td>
    <td className="font-semibold pr-4">{item.campaign_name}</td>
    <td className="font-semibold pr-4">{item.adgroup_name}</td>
    <td className="font-semibold pr-4">{item.status}</td>
    <td className="font-semibold pr-4">{item.type}</td>
    <td className="font-semibold pr-4">{item.sales}</td>
    <td className="font-semibold pr-4">{item.roas}</td>
    <td className="font-semibold pr-4">{item.conversion_rate}</td>
    <td className="font-semibold pr-4">{item.impressions}</td>
    <td className="font-semibold pr-4">{item.clicks}</td>
    <td className="font-semibold pr-4">{item.ctr}</td>
    <td className="font-semibold pr-4">{item.spend}</td>
    <td className="font-semibold pr-4">{item.cpc}</td>
    <td className="font-semibold pr-4">{item.orders}</td>
    <td className="font-semibold pr-4">{item.acos}</td>
    <td className="font-semibold pr-4">{item.ntb_orders}</td>
    <td className="font-semibold pr-4">{item.percent_orders_ntb}</td>
    <td className="font-semibold pr-4">{item.ntb_sales}</td>
    <td className="font-semibold pr-4">{item.percent_sales_ntb}</td>
    <td className="font-semibold pr-4">{item.viewable_impressions}</td>
                        
                      </>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default AmsAsinTable;
