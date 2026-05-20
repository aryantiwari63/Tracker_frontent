
const AmsKeywordTable = ({
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
                        <td className="bg-white text-blue-400 sticky left-14 max-w-[43px] box-border overflow-hidden">
          {item.state}
        </td>
        <td className="bg-white pr-4 box-border left-64 text-green-400 z-10 px-3">
          {item.campaign_name}
        </td>
        <td className="pr-4 px-3">{item.ad_group_name}</td>
        <td className="pr-4 px-3">{item.portfolio_name}</td>
        <td className="pr-4 px-3">{item.keyword}</td>
        <td className="pr-4 px-3">{item.match_type}</td>
        <td className="pr-4">{item.status}</td>
        <td className="pr-4 px-3">{item.keyword_bid_inr}</td>
        <td className="pr-4 px-3">{item.top_of_search_is}</td>
        <td className="pr-4 px-3">{item.impressions}</td>
        <td className="pr-4 px-3">{item.clicks}</td>
        <td className="pr-4 px-3">{item.ctr}</td>
        <td className="pr-4 px-3">{item.spend_inr}</td>
        <td className="pr-4 px-3">{item.cpc_inr}</td>
        <td className="pr-4 px-3">{item.orders}</td>
        <td className="pr-4 px-3">{item.sales_inr}</td>
        <td className="pr-4 px-3">{item.acos}</td>
        <td className="pr-4 px-3">{item.roas}</td>
        <td className="pr-4 px-3">{item.ntb_orders}</td>
        <td className="pr-4 px-3">{item.percent_orders_ntb}</td>
        <td className="pr-4 px-3">{item.ntb_sales_inr}</td>
        <td className="pr-4 px-3">{item.percent_sales_ntb}</td>
        <td className="pr-4 px-3">{item.detail_page_views}</td>
        <td className="pr-4 px-3">{item.units_sold}</td>
        <td className="pr-4 px-3">{item.id}</td>
        <td className="pr-4 px-3">{item.audiences}</td>
                      
                    </tr>
                  </>
                );
              })}
            </tbody>
            {footer && (
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
                        <td className="pr-4 font-semibold">{item.state}</td>
    <td className="pr-4 font-semibold">{item.campaign_name}</td>
    <td className="pr-4 font-semibold">{item.ad_group_name}</td>
    <td className="pr-4 font-semibold">{item.portfolio_name}</td>
    <td className="pr-4 font-semibold">{item.keyword}</td>
    <td className="pr-4 font-semibold">{item.match_type}</td>
    <td className="pr-4 font-semibold">{item.status}</td>
    <td className="pr-4 font-semibold">{item.keyword_bid_inr}</td>
    <td className="pr-4 font-semibold">{item.top_of_search_is}</td>
    <td className="pr-4 font-semibold">{item.impressions}</td>
    <td className="pr-4 font-semibold">{item.clicks}</td>
    <td className="pr-4 font-semibold">{item.ctr}</td>
    <td className="pr-4 font-semibold">{item.spend_inr}</td>
    <td className="pr-4 font-semibold">{item.cpc_inr}</td>
    <td className="pr-4 font-semibold">{item.orders}</td>
    <td className="pr-4 font-semibold">{item.sales_inr}</td>
    <td className="pr-4 font-semibold">{item.acos}</td>
    <td className="pr-4 font-semibold">{item.roas}</td>
    <td className="pr-4 font-semibold">{item.ntb_orders}</td>
    <td className="pr-4 font-semibold">{item.percent_orders_ntb}</td>
    <td className="pr-4 font-semibold">{item.ntb_sales_inr}</td>
    <td className="pr-4 font-semibold">{item.percent_sales_ntb}</td>
    <td className="pr-4 font-semibold">{item.detail_page_views}</td>
    <td className="pr-4 font-semibold">{item.units_sold}</td>
    <td className="pr-4 font-semibold">{item.id}</td>
    <td className="pr-4 font-semibold">{item.audiences}</td>

                     
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

export default AmsKeywordTable;
