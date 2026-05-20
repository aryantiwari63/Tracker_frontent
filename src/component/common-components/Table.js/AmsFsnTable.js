
const AmsFsnTable = ({
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
                      <td className="bg-white text-blue-400 sticky left-14  box-border overflow-hidden ">
                        {item.fsn_name}
                      </td>
                      {/* <td className="bg-white pr-4 box-border sticky left-64 text-green-400 z-10">
                        {item.sku}
                      </td> */}
                      {/* <td className="pr-4 ">{item.title}</td> */}
                      <td className="pr-4 text-green-400 text-center bg-white  box-border sticky left-64  z-10">
                        {item.advertised_fsn_id}
                      </td>
                      <td className="pr-4">{item.fsn_status}</td>
                      <td className="pr-4 text-blue-400">{item.adgroup_name}</td>
                      <td className="pr-4">{item.platform}</td>
                      <td className="pr-4">{item.spend}</td>
                      <td className="pr-4 ">{item.views}</td>
                      <td className="pr-4">{item.ctr}</td>
                      <td className="pr-4">{item.cpc}</td>
                      <td className="pr-4">{item.direct_unit_sold}</td>
                      <td className="pr-4">{item.direct_revenue}</td>
                      <td className="pr-4">{item.direct_roi}</td>
                      <td className="pr-4">{item.direct_cvr}</td>
                      <td className="pr-4">{item.direct_aov}</td>
                     
                    
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
                        <td className="font-semibold pr-4"> {item.fsn_name}</td>
                        {/* <td>{item.sku}</td> */}
                        {/* <td>{item.title}</td> */}
                        <td className="font-semibold pr-4"> {item.advertised_fsn_id}</td>
                        <td className="font-semibold pr-4">{item.fsn_status}</td>
                        <td className="font-semibold pr-4">{item.adgroup_name}</td>
                        <td className="font-semibold pr-4">{item.platform}</td>
                      <td className="font-semibold pr-4">{item.spend}</td>
                      <td className="font-semibold pr-4 ">{item.views}</td>
                      <td className="font-semibold pr-4">{item.ctr}</td>
                      <td className="font-semibold pr-4">{item.cpc}</td>
                      <td className="font-semibold pr-4">{item.direct_unit_sold}</td>
                      <td className="font-semibold pr-4">{item.direct_revenue}</td>
                      <td className="font-semibold pr-4">{item.direct_roi}</td>
                      <td className="font-semibold pr-4">{item.direct_cvr}</td>
                      <td className="font-semibold pr-4">{item.direct_aov}</td>
                        
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

export default AmsFsnTable;
