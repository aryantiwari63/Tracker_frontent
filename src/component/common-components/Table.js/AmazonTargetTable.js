const AmazonTargetTable = ({
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
                        {item.keyword}
                      </td>
                      <td className="bg-white pr-4 box-border sticky left-64 text-green-400 z-10">
                        {item.state}
                      </td>
                      <td className="pr-4 ">{item.current_bid}</td>
                      <td className="pr-4 text-blue-400 text-center">
                        {item.suggested_bid}
                      </td>
                      <td className="pr-4">{item.type}</td>
                      <td className="pr-4">{item.match}</td>
                      <td className="pr-4">{item.campaignname}</td>
                      <td className="pr-4 text-blue-400">{item.adgroupname}</td>
                      <td className="pr-4 b">{item.status}</td>
                      <td className="pr-4">{item.impression}</td>
                      <td className="pr-4">{item.clicks}</td>
                      <td className="pr-4">{item.ctr}</td>
                      <td className="pr-4">{item.spend}</td>
                      <td className="pr-4">{item.cpc}</td>
                      <td className="pr-4">{item.sales}</td>
                      <td className="pr-4">{item.orders}</td>
                      <td className="pr-4">{item.saleunits}</td>
                      <td className="pr-4">{item.cvr}</td>
                      <td className="pr-4">{item.cpa}</td>
                      <td className="pr-4">{item.roas}</td>
                      <td className="pr-4">{item.acos}</td>
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
                        <td className="sticky left-0 text-base font-semibold py-3">
                          Result{" "}
                        </td>
                        <td className="font-semibold pr-4">{item.type}</td>
                      <td className="font-semibold pr-4">{item.match}</td>
                      <td className="font-semibold pr-4">{item.campaignname}</td>
                      <td className="font-semibold pr-4">{item.adgroupname}</td>
                      <td className="font-semibold pr-4">{item.status}</td>
                      <td className="font-semibold pr-4">{item.impression}</td>
                      <td className="font-semibold pr-4">{item.clicks}</td>
                      <td className="font-semibold pr-4">{item.ctr}</td>
                      <td className="font-semibold pr-4">{item.spend}</td>
                      <td className="font-semibold pr-4">{item.cpc}</td>
                      <td className="font-semibold pr-4">{item.sales}</td>
                      <td className="font-semibold pr-4">{item.orders}</td>
                      <td className="font-semibold pr-4">{item.saleunits}</td>
                      <td className="font-semibold pr-4">{item.cvr}</td>
                      <td className="font-semibold pr-4">{item.cpa}</td>
                      <td className="font-semibold pr-4">{item.roas}</td>
                      <td className="font-semibold pr-4">{item.acos}</td>
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

export default AmazonTargetTable;
