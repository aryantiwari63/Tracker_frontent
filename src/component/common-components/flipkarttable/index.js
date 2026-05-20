import React, { useState } from "react";
import {
  convertDateFormartToMMDDYYYY,
  convertDateFormatToDateMonthNameYear,
} from "../../../utils/helpers";
import LoaderSpinner from "../loader-spinner";
import PreviewBtn from "../../flipkart/Rules/button/Previewbtn";
import ZeptoPreviewBtn from "../../Zepto/Rules/button/Previewbtn";
import InstamartPreviewBtn from "../../Instamart/Rules/button/Previewbtn";
import "./styles.css";
import RulesResult from "../../flipkart/Rules/button/RulesResult";
import ZeptoRuleResult from "../../Zepto/Rules/button/RulesResult";
import Popup from "../Popups/Popup";
import RulesPreview from "../../flipkart/Rules/button/RulesPreview";
import ZeptoRulesPreview from "../../Zepto/Rules/button/RulesPreview";
import InstamartRulesPreview from "../../Instamart/Rules/button/RulesPreview";
import BlinkitRulesPreview from "../../BlinkIt/Rules/button/RulesPreview";
import InstamartRuleResult from "../../Instamart/Rules/button/RulesResult"
import Tooltip from "../../Amazon/advertise/CampaignManager/createBulkadgroup/Tooltip";
import { getRuleConditionText } from "../amazontable/function";

const FlipkartTable = ({
  headers,
  bodyContent,
  loading,
  sortData,
  source,
  isCheckBoxRequired,
  setEditData,
  editData,
  customCss,
  setDataLIMIT,
  dataLIMIT,
  sortBy,
  accountsData,
  getRulesApi,
  headerClassName=""
}) => {
  const styleScheduledInfo = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const [rulesPopup, setRulesPopup] = useState(false);
  const [ruleData, setRuleData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [ruleId, setRuleId] = useState({});
  React.useEffect(() => {
    // console.log("bodyContent123", bodyContent);
  }, [bodyContent]);

  const handleCheckBox = (check, data) => {
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item.id !== data.id));
    }
  };

  const handleCheckBoxSearchTerm = (check, data) => {
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item.id !== data.id));
    }
  };

  let currency = localStorage.getItem("currency");

  const handleAllCheckBox = (check, data) => {
    if (check) {
      setEditData([...data]);
    } else {
      setEditData([]);
    }
  };

  // const userName = localStorage.getItem("name");
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };
  let currency_format = localStorage.getItem("currency_format");

  const getAcc = (id) => {
    let selected = [];
    accountsData.map((item) => {
      if (id.includes(item.platform_id)) {
        selected?.push(item.label);
      }
    });
    selected = selected?.join(",");
    return selected;
  };
  return (
    <>
      <div>
        <div
          className="campaignreport__table max-h-[640px] overflow-y-auto"
          onScroll={handleScroll}
        >
          <table className="w-full ">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6] "
                  : ((source==="blinkit_rule"||source==="instamart_rule"||source==="zepto_rule"||source==="rule")&&"!max-w-[200px] !min-w-[200px]")
                    ? "campaignreport__tablehead  table-fixed sticky top-0 left-0 z-10 bg-[#F3F4F6]"
                    : "campaignreport__tablehead  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className=" ">
                    <input
                      className=" h-16 "
                      type="checkbox"
                      // style={{ verticalAlign: "left" }}
                      checked={
                        editData?.length === bodyContent?.length &&
                        !loading &&
                        bodyContent?.length !== 0
                      }
                      onChange={(e) =>
                        handleAllCheckBox(e.target.checked, bodyContent)
                      }
                      disabled={bodyContent?.length > 0 ? false : true}
                    />
                  </th>
                )}

                {headers?.map((item) => {
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th className={`py-4 ${(source==="blinkit_rule"||source==="instamart_rule"||source==="rule_content"||source==="rule")&&`!max-w-[200px] !min-w-[200px] !static`}`}>
                                <div
                              className={
                                customCss === true
                                  ? `rule_table py-1  font-semibold text-[15px] ${headerClassName}`
                                  : `tableHead py-5 px-1.5 font-semibold text-base ${headerClassName}`
                              }
                            >
                              <span className="">{item.title}</span>
                              {bodyContent &&
                                bodyContent.length > 0 &&
                                item.show && (
                                  <div
                                    className={
                                      customCss === true
                                        ? "rule_arrow"
                                        : "sortArrow cursor-pointer"
                                    }
                                  >
                                    <div>
                                      <div
                                        onClick={() =>
                                          sortData(
                                            item?.value,
                                            source === "blinkit" ? "ASC" : 1
                                          )
                                        }
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            (sortBy.order === 1 ||
                                              sortBy.order === "ASC")
                                              ? "black"
                                              : "grey",
                                          marginBottom: 2,
                                        }}
                                      >
                                        ▲
                                      </div>
                                    </div>
                                    <div>
                                      <div
                                        className="downArrow"
                                        onClick={() =>
                                          sortData(
                                            item?.value,
                                            source === "blinkit" ? "DESC" : -1
                                          )
                                        }
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            (sortBy.order === -1 ||
                                              sortBy.order === "DESC")
                                              ? "black"
                                              : "grey",
                                        }}
                                      >
                                        ▼
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </th>
                        ) : (
                          <th rowSpan={3} className="multiCol font-medium">
                            <div className="graycol">{item.title}</div>
                            {item.showCol &&
                              item.subTitles?.map((v, i) => {
                                return (
                                  <td key={i} className="graydirect">
                                    {v}
                                  </td>
                                );
                              })}
                          </th>
                        )}
                      </>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {
                // loading ? (
                // <>
                //   <td
                //     className="p-2"
                //     colSpan={16}
                //     rowSpan={3}
                //     style={{ alignItems: "center", verticalAlign: "middle" }}
                //   >
                //     <div className="loaderStyle">
                //       <LoaderSpinner />
                //     </div>
                //   </td>
                // </>
                // ) :
                bodyContent && bodyContent.length > 0 ? (
                  bodyContent?.map((item,bodyIndex) => {
                    // if (source === "campaign") {
                    //   return (
                    //     <>
                    //       <tr className="tablecontent">
                    //         {item.campaign_name || item.campaign_name === 0 ? (
                    //           <td className="p-2">
                    //             <div>{item.campaign_name}</div>
                    //           </td>
                    //         ) : null}

                    //         {item.segment || item.segment === 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.segment}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.platform || item.platform === 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.platform}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.campaign_budget ||
                    //         item.campaign_budget === 0 ? (
                    //           <td className="p-2">
                    //             <div>
                    //               {" "}
                    //               {item.campaign_budget.toLocaleString(currency_format)}
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.spend || item.spend === 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.spend.toLocaleString(currency_format)}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.views || item.views === 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.views.toLocaleString(currency_format)}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.clicks || item.clicks === 0 ? (
                    //           <td className="p-2">
                    //             <div>
                    //               {" "}
                    //               {item.clicks.toLocaleString(currency_format)}
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.CTR || item.CTR === 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.CTR}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.cpc || item.cpc === 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.cpc}</div>
                    //           </td>
                    //         ) : null}

                    //         {item.ppv_direct_click ||
                    //         item.ppv_direct_click == 0 ? (
                    //           <td className="">
                    //             <div className="row text-center">
                    //               <div className="col">
                    //                 {item.ppv_direct_click.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //               <div className="col">
                    //                 {item.ppv_indirect_click.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //               <div className="col font-semibold">
                    //                 {item.total_ppv_data.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.units_sold_direct ||
                    //         item.units_sold_direct == 0 ? (
                    //           <td className="">
                    //             <div className="row text-center">
                    //               <div className="col">
                    //                 {item.units_sold_direct.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //               <div className="col">
                    //                 {item.units_sold_indirect.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //               <div className="col font-semibold">
                    //                 {item.total_units_sold.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.direct_revenue || item.direct_revenue == 0 ? (
                    //           <td className="">
                    //             <div className="row text-center text-[10px]">
                    //               <div className="col ">
                    //                 {item.direct_revenue.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //               <div className="col ">
                    //                 {item.indirect_revenue.toLocaleString(
                    //                   currency_format
                    //                 )}
                    //               </div>
                    //               <div className="col font-semibold">
                    //                 {item.total_revenue.toLocaleString(currency_format)}
                    //               </div>
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.cvr_direct || item.cvr_direct == 0 ? (
                    //           <td className="">
                    //             <div className="row text-center">
                    //               <div className="col">{item.cvr_direct}</div>
                    //               <div className="col">{item.cvr_indirect}</div>
                    //               <div className="col font-semibold">
                    //                 {item.cvr_total}
                    //               </div>
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.roi_direct || item.roi_direct == 0 ? (
                    //           <td className="">
                    //             <div className="row text-center">
                    //               <div className="col">{item.roi_direct}</div>
                    //               <div className="col">{item.roi_indirect}</div>
                    //               <div className="col font-semibold">
                    //                 {item.total_roi}
                    //               </div>
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //         {item.aov_direct || item.aov_direct == 0 ? (
                    //           <td className="">
                    //             <div className="row text-center text-[13px]">
                    //               <div className="col">{item.aov_direct}</div>
                    //               <div className="col">{item.aov_indirect}</div>
                    //               <div className="col font-semibold">
                    //                 {item.aov_total}
                    //               </div>
                    //             </div>
                    //           </td>
                    //         ) : null}
                    //       </tr>
                    //     </>
                    //   );
                    // }
                    if (source === "fsn") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.fsn_id || item.fsn_id === 0 ? (
                              <td className="p-2">
                                <div> {item.fsn_id}</div>
                              </td>
                            ) : null}
                            {item.product_name || item.product_name === 0 ? (
                              <td className="p-2">
                                <div> {item.product_name}</div>
                              </td>
                            ) : null}
                            {item.adgroup_name || item.adgroup_name === 0 ? (
                              <td className="p-2">
                                <div> {item.adgroup_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name === 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment === 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform === 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spent || item.spent == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spent.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}

                            {item.add_to_baskets || item.add_to_baskets == 0 ? (
                              <td className="p-2">
                                <div> {item.add_to_baskets}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row  text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.total_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col">{item.cvr_total}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "creative") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.banner_id || item.banner_id == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_id}</div>
                              </td>
                            ) : null}
                            {item.banner_name || item.banner_name == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_name}</div>
                              </td>
                            ) : null}
                            {item.banner_preview || item.banner_preview == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_preview}</div>
                              </td>
                            ) : null}
                            {item.type_banner || item.type_banner == 0 ? (
                              <td className="p-2">
                                <div> {item.type_banner}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_type || item.campaign_type == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_type}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.banner_spend || item.banner_spend == 0 ? (
                              <td className="p-2">
                                <div> {item.banner_spend}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views}</div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div> {item.clicks}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.average_cpc || item.average_cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.average_cpc}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.units_sold}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.ppv_direct_click ||
                            item.ppv_direct_click == 0 ? (
                              // <td className="p-2">
                              //   <div> {item.ppv_direct_click}</div>
                              //   </td>
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.ppv_direct_click}
                                  </div>
                                  <div className="col">
                                    {item.ppv_indirect_click}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.ppv_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue}
                                  </div>
                                  <div className="col">{item.revenue}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_cvr || item.direct_cvr == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_cvr}</div>
                                  <div className="col">{item.indirect_cvr}</div>
                                  <div className="col">{item.cvr}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_roi || item.direct_roi == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_roi}</div>
                                  <div className="col">{item.indirect_roi}</div>
                                  <div className="col">{item.roi}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_aov || item.direct_aov == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_aov}</div>
                                  <div className="col">{item.indirect_aov}</div>
                                  <div className="col">{item.aov}</div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "adgroup") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.adgroup_name || item.adgroup_name == 0 ? (
                              <td className="p-2">
                                <div> {item.adgroup_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.campaign_budget ||
                            item.campaign_budget == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.campaign_budget !== null &&
                                  item.campaign_budget !== `${currency}NaN`
                                    ? item.campaign_budget.toLocaleString(
                                        currency_format
                                      )
                                    : "N/A"}
                                </div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.created_on || item.created_on == 0 ? (
                              <td className="p-4">
                                <div>
                                  {" "}
                                  {convertDateFormatToDateMonthNameYear(
                                    item.created_on
                                  )}
                                  test
                                </div>
                              </td>
                            ) : null}

                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.CTR || item.CTR == 0 ? (
                              <td className="p-2">
                                <div> {item.CTR}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.ppv_direct_click ||
                            item.ppv_direct_click == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.ppv_direct_click.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.ppv_indirect_click.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_ppv_data.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center ">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.total_roi}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center text-[13px]">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "revenue") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {headers.map(
                              (header) =>
                                header.showCol && (
                                  <>
                                    {header.value == "created_on" &&
                                    (item.created_on ||
                                      item.created_on == 0) ? (
                                      <td className="p-2">
                                        <div>
                                          {convertDateFormartToMMDDYYYY(
                                            item.created_on
                                          )}
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "mode" &&
                                    (item.mode || item.mode == 0) ? (
                                      <td className="px-2">
                                        <div>
                                          <b className="font-semibold text-sm">
                                            Direct
                                          </b>
                                          <br />
                                          <b className="font-normal text-sm">
                                            Indirect
                                          </b>
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "orders" &&
                                    (item.orders || item.orders == 0) ? (
                                      <td className="px-2">
                                        <div> {item.orders}</div>
                                      </td>
                                    ) : null}
                                    {header.value == "direct_revenue" &&
                                    (item.direct_revenue ||
                                      item.direct_revenue == 0) ? (
                                      <td className="px-2.5">
                                        <div>
                                          <b className="font-semibold text-sm">
                                            {currency}
                                            {item.direct_revenue.toFixed(2)}
                                          </b>
                                          <br />
                                          <b className="font-normal text-sm">
                                            {currency}
                                            {item.indirect_revenue.toFixed(2)}
                                          </b>
                                          <br />
                                          {item.direct_revenue -
                                            item.indirect_revenue >
                                          0
                                            ? "▲"
                                            : item.direct_revenue -
                                                item.indirect_revenue ==
                                              0
                                            ? ""
                                            : "▼"}
                                          <b className="text-[#23BC7C] font-normal text-sm ">
                                            {!isNaN(
                                              (Math.abs(
                                                item.direct_revenue -
                                                  item.indirect_revenue
                                              ) /
                                                item.direct_revenue) *
                                                100
                                            )
                                              ? (
                                                  (Math.abs(
                                                    item.direct_revenue -
                                                      item.indirect_revenue
                                                  ) /
                                                    item.direct_revenue) *
                                                  100
                                                ).toFixed(2)
                                              : 0}
                                            %
                                          </b>
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "direct_aov" &&
                                    (item.direct_aov ||
                                      item.direct_aov == 0) ? (
                                      <td className="px-2">
                                        <div>
                                          <b className="font-semibold text-sm">
                                            {item.direct_aov.toFixed(2)}
                                          </b>
                                          <br />
                                          <b className="font-normal text-sm">
                                            {item.indirect_aov.toFixed(2)}
                                          </b>
                                          <br />
                                          {item.direct_aov - item.indirect_aov >
                                          0
                                            ? "▲"
                                            : item.direct_aov -
                                                item.indirect_aov ==
                                              0
                                            ? ""
                                            : "▼"}
                                          <b className="text-[#23BC7C] font-normal text-sm">
                                            {!isNaN(
                                              (Math.abs(
                                                item.direct_aov -
                                                  item.indirect_aov
                                              ) /
                                                item.direct_aov) *
                                                100
                                            )
                                              ? (
                                                  (Math.abs(
                                                    item.direct_aov -
                                                      item.indirect_aov
                                                  ) /
                                                    item.direct_aov) *
                                                  100
                                                ).toFixed(2)
                                              : 0}
                                            %
                                          </b>
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "clicks" &&
                                    (item.clicks || item.clicks == 0) ? (
                                      <td className="px-2">
                                        <div>
                                          {" "}
                                          {item.clicks.toLocaleString(
                                            currency_format
                                          )}
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "views" &&
                                    (item.views || item.views == 0) ? (
                                      <td className="">
                                        <div>
                                          {" "}
                                          {item.views.toLocaleString(
                                            currency_format
                                          )}
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "direct_roi" &&
                                    (item.direct_roi ||
                                      item.direct_roi == 0) ? (
                                      <td className="">
                                        <div>
                                          <b className="font-semibold text-sm">
                                            {currency}
                                            {item.direct_roi.toFixed(2)}
                                          </b>
                                          <br />
                                          <b className="font-normal text-sm">
                                            {currency}
                                            {item.indirect_roi.toFixed(2)}
                                          </b>
                                          <br />
                                          {item.direct_roi - item.indirect_roi >
                                          0
                                            ? "▲"
                                            : item.direct_roi -
                                                item.indirect_roi ==
                                              0
                                            ? ""
                                            : "▼"}
                                          <b className="text-[#23BC7C] font-normal text-sm">
                                            {!isNaN(
                                              (Math.abs(
                                                item.direct_roi -
                                                  item.indirect_roi
                                              ) /
                                                item.direct_roi) *
                                                100
                                            )
                                              ? (
                                                  (Math.abs(
                                                    item.direct_roi -
                                                      item.indirect_roi
                                                  ) /
                                                    item.direct_roi) *
                                                  100
                                                ).toFixed(2)
                                              : 0}
                                            %
                                          </b>
                                        </div>
                                      </td>
                                    ) : null}
                                    {header.value == "cpc" &&
                                    (item.cpc || item.cpc == 0) ? (
                                      <td className="p-2">
                                        <div> {item.cpc.toFixed(2)}</div>
                                      </td>
                                    ) : null}
                                  </>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "keyword") {
                      return (
                        <>
                          {/* <div className=""> */}
                          {/* </div> */}
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {/* {isCheckBoxRequired === true && (
                            <td className="pl-2">
                              <input
                                className="h-16 m-2 bg-red-200"
                                type="checkbox"
                                onChange={(e) => handleCheckBox(e, item)}
                              />
                            </td>
                          )} */}

                            {item.keyword || item.keyword == 0 ? (
                              <td className="p-2 ">
                                <div className=""> {item.keyword}</div>
                              </td>
                            ) : null}
                            {item.keyword_match_type ||
                            item.keyword_match_type == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_match_type}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}

                            {item.ad_group_name ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.campaign_name ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="flex text-center">
                                  <div className="col px-1">
                                    {item.direct_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col px-1">
                                    {item.indirect_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col px-1 font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="flex text-center">
                                  <div className="col px-1">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col px-1">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold px-1">
                                    {item.total_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="flex text-center">
                                  <div className="col px-1">
                                    {item.cvr_direct}
                                  </div>
                                  <div className="col px-1">
                                    {item.cvr_indirect}
                                  </div>
                                  <div className="col px-1 font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center ">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "search") {
                      return (
                        <>
                          {/* <div className=""> */}
                          {/* </div> */}
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {/* {isCheckBoxRequired === true && (
                            <td className="pl-20">
                              <input
                                className="h-16"
                                type="checkbox"
                                onChange={(e) => handleCheckBox(e, item)}
                              />
                            </td>
                          )} */}

                            {item.search_term || item.search_term == 0 ? (
                              <td className="p-2">
                                {" "}
                                <div> {item.search_term}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}

                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "placement") {
                      return (
                        <>
                          {/* <div className=""> */}
                          {/* </div> */}
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {/* {isCheckBoxRequired === true && (
                            <td className="pl-2">
                              <input
                                className="h-16"
                                type="checkbox"
                                onChange={(e) => handleCheckBox(e, item)}
                              />
                            </td>
                          )} */}

                            {item.placement_type || item.placement_type == 0 ? (
                              <td className="p-2">
                                {" "}
                                <div> {item.placement_type}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}

                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.placement_bids || item.placement_bids == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.placement_bids.toLocaleString(
                                    currency_format
                                  )}
                                </div>
                              </td>
                            ) : null}

                            {item.placement_bids_percentage ||
                            item.placement_bids_percentage == 0 ? (
                              <td className="p-2">
                                <div> {item.placement_bids_percentage}</div>
                              </td>
                            ) : null}
                            {item.placement_spent ||
                            item.placement_spent == 0 ? (
                              <td className="p-2">
                                <div> {item.placement_spent}</div>
                              </td>
                            ) : null}
                            {item.placement_spent_percentage ||
                            item.placement_spent_percentage == 0 ? (
                              <td className="p-2">
                                <div> {item.placement_spent_percentage}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.units_sold_direct ||
                            item.units_sold_direct == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.units_sold_direct.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.units_sold_indirect.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.units_sold_total.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.revenue_direct_view ||
                            item.revenue_direct_view == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.revenue_direct_view.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.revenue_indirect_view.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.revenue_total_view.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_cvr || item.direct_cvr == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_cvr}</div>
                                  <div className="col">{item.indirect_cvr}</div>
                                  <div className="col">{item.cvr}</div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_roi || item.direct_roi == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_roi}</div>
                                  <div className="col">{item.indirect_roi}</div>
                                  <div className="col font-semibold">
                                    {item.roi}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_aov || item.direct_aov == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.direct_aov}</div>
                                  <div className="col">{item.indirect_aov}</div>
                                  <div className="col font-semibold">
                                    {item.aov}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    // if (source == "negativeKeyword") {
                    //   return (
                    //     <>
                    //       <tr
                    //         className={
                    //           isCheckBoxRequired
                    //             ? "tableContentCheckBox"
                    //             : "tablecontent"
                    //         }
                    //       >
                    //         {isCheckBoxRequired === true && (
                    //           <td className="pl-5  min-w-max ">
                    //             <input
                    //               className="h-16 "
                    //               type="checkbox"
                    //               checked={editData
                    //                 .map((data) => data._id)
                    //                 .includes(item._id)}
                    //               onChange={(e) =>
                    //                 handleCheckBox(e.target.checked, item)
                    //               }
                    //             />
                    //           </td>
                    //         )}

                    //         {item.keyword || item.keyword == 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.keyword}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.campaign_id ? (
                    //           <td className="p-2">
                    //             <div> {item.campaign_id}</div>
                    //           </td>
                    //         ) : null}

                    //         {item.campaign_name || item.campaign_name == 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.campaign_name}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.ad_group_id || item.ad_group_id == 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.ad_group_id}</div>
                    //           </td>
                    //         ) : null}
                    //         {item.ad_group_name || item.ad_group_name == 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.ad_group_name}</div>
                    //           </td>
                    //         ) : null}

                    //         {item.created_on || item.created_on == 0 ? (
                    //           <td className="p-2">
                    //             <div> {item.created_on}</div>
                    //           </td>
                    //         ) : null}

                    //         {item.action_status ? (
                    //           <td className="p-2">
                    //             <div>
                    //               {" "}
                    //               {item.action_status == 1
                    //                 ? "pending"
                    //                 : "completed"}
                    //             </div>
                    //           </td>
                    //         ) : (
                    //           <td className="p-2">
                    //             <div>completed</div>
                    //           </td>
                    //         )}
                    //       </tr>
                    //     </>
                    //   );
                    // }
                    if (source === "searchData") {
                      return (
                        <>
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox  sticky top-0 left-0 z-30 w-[160px]"
                                : "tablecontent "
                            }
                          >
                            {isCheckBoxRequired === true && (
                              <td className="">
                                <input
                                  className="h-16 "
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data._id)
                                    .includes(item._id)}
                                  onChange={(e) =>
                                    handleCheckBox(e.target.checked, item)
                                  }
                                />
                              </td>
                            )}

                            {item._id ? (
                              <td className="p-2">
                                <div> {item._id}</div>
                              </td>
                            ) : null}
                            {item.campaign_name ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.platform ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}

                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.direct_units_sold ||
                            item.direct_units_sold == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_units_sold.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">
                                    {item.direct_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col">
                                    {item.indirect_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                  <div className="col font-semibold">
                                    {item.total_revenue.toLocaleString(
                                      currency_format
                                    )}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.cvr_direct || item.cvr_direct === 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.cvr_direct}</div>
                                  <div className="col">{item.cvr_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.cvr_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.roi_direct || item.roi_direct === 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.roi_direct}</div>
                                  <div className="col">{item.roi_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.roi_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                            {item.aov_direct || item.aov_direct === 0 ? (
                              <td className="">
                                <div className="row text-center">
                                  <div className="col">{item.aov_direct}</div>
                                  <div className="col">{item.aov_indirect}</div>
                                  <div className="col font-semibold">
                                    {item.aov_total}
                                  </div>
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "rule") {
                      return (
                        <>
                          <tr className="rule_content">
                            {item.rule_name || item.rule_name == 0 ? (
                              <td className="p-2  hover:text-[13px] hover:underline transition-all duration-300" >
                               <div className="text-[13px] text-center flex items-center justify-center gap-1" title={item?.rule_name}>
                                 <p className="truncate  max-w-[80px]" style={styleScheduledInfo} >
                                 {" "}
                                 {item?.rule_name}
                                 </p>
                               </div>
                               </td>
                            ) : (
                              "-"
                            )}
                            {item?.is_active === true ? (
                              <td className="p-2">
                                {item.is_deleted == false && (
                                  <div className="text-[13px] text-center">
                                    {" "}
                                    Enabled
                                  </div>
                                )}
                              </td>
                            ) : (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  Disabled
                                </div>
                              </td>
                            )}
                            {item.platform?.includes("MP") &&
                            item.platform.includes("SM") ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  Flipkart, SuperMart
                                </div>
                              </td>
                            ) : item.platform?.includes("MP") ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  Flipkart
                                </div>
                              </td>
                            ) : item.platform?.includes("SM") ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  SuperMart
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}

                            {item.platform_id && item.platform_id.length > 0 ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {getAcc(item.platform_id)}
                                </div>
                              </td>
                            ) : (
                              "--"
                            )}
                            {item.campaign_type || item.campaign_type == 0 ? (
                              <td className="p-2 text-[13px] text-center">
                                {item.campaign_type.map((x, index) => (
                                  <div key={index}>
                                    {x}
                                    {index !==
                                      item.campaign_type.length - 1 && (
                                      <span>, </span>
                                    )}
                                  </div>
                                ))}
                              </td>
                            ) : (
                              "-"
                            )}
                            {item.entity || item.entity === 0 ? (
                              <td className="p-2 ">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  {item.entity}
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            <td className="p-2">
                            <div className=" text-[13px] text-center justify-center flex items-center gap-1">
                              <span>
                                {item?.action
                                  .split(/(?=[A-Z])/)
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                                </span>
                              { 
                                getRuleConditionText(item.rule_conditions)?.length>0 &&
                                  <span className="text-[13px]">
                                    <Tooltip 
                                      title={
                                        getRuleConditionText(item.rule_conditions)
                                      }
                                      className={
                                        `!px-3 flex items-center gap-1 rounded-sm !shadow-md ${bodyIndex<1&&"top-7 !py-6"}`
                                      }
                                      /> 
                                  </span>
                                  }
                              {/* {item?.rule_conditions?.map(
                                (conditionGroup, groupIndex) => (
                                  <div
                                    className="text-[13px] text-center"
                                    key={groupIndex}
                                  >
                                    {groupIndex > 0 && (
                                      <span>
                                        OR <br />
                                      </span>
                                    )}

                                    {conditionGroup?.map(
                                      (condition, conditionIndex) => (
                                        <div
                                          key={conditionIndex}
                                          className="inline"
                                        >
                                          {conditionIndex > 0 && (
                                            <span className="ml-2">AND</span>
                                          )}{" "}
                                          <span>
                                            (If {condition?.conditionCategory}{" "}
                                            is
                                            {condition.conditionType !=
                                            "is_not_in_range"
                                              ? "  "
                                              : ""}
                                            {condition?.conditionType ===
                                            "greater_than"
                                              ? "Greater than"
                                              : condition.conditionType ===
                                                "smaller_than"
                                              ? "Less than"
                                              : condition.conditionType ===
                                                "range"
                                              ? "Between"
                                              : condition.conditionType ===
                                                "is_not_in_range"
                                              ? "n't between"
                                              : "-"}{" "}
                                            {condition?.conditionType ===
                                              "range" ||
                                            condition?.conditionType ===
                                              "is_not_in_range"
                                              ? `${condition?.less}-${condition?.greater}`
                                              : condition?.conditionType ===
                                                "smaller_than"
                                              ? `${condition?.less}`
                                              : condition?.greater}
                                            )
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )} */}
                              </div>
                            </td>

                            {item.entity || item.entity === 0 ? (
                              <td className="p-2">
                                <div
                                  className="text-[13px] text-blue-500 cursor-pointer text-center"
                                  onClick={() => {
                                    setRulesPopup(item.id);
                                    setRuleData(item.id);
                                  }}
                                >
                                  {" "}
                                  No Changes To {item.entity}
                                </div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2 flex justify-center">
                                <button
                                  className="preview__btn w-14 hover:bg-[#0081f7cc]"
                                  onClick={() => {
                                    setRuleId(item);
                                    setShowPopup(!showPopup);
                                  }}
                                >
                                  <div className="row flex-col items-center">
                                    <div className=" w-4 col_4 ">
                                      <img
                                        src="/assets/images/eye-solid.svg"
                                        alt=""
                                      />
                                      {/* <BsEyeFill/> */}
                                    </div>
                                    <div className="">View</div>
                                  </div>
                                </button>
                              </td>
                            ) : null}
                            {item.schedule || item.schedule == 0 ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  {item.schedule}
                                </div>
                              </td>
                            ) : null}

                            {/* {item.clicks || item.clicks == 0 ? ( */}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div className="text-[12px] text-center">
                                  {item.created_by}
                                </div>
                              </td>
                            ) : null}
                            {/* ) : null} */}

                            {/* {item.action ? ( */}
                            <td className="">
                              {/* data to show in the popup */}
                              <div className="">
                                <PreviewBtn rowData={item} source={"flipkart"}/>
                              </div>
                            </td>
                            {/* ) : null} */}
                            {rulesPopup === item.id && (
                              <Popup
                                title="Rule results"
                                
                                setShowPopup={setRulesPopup}
                                apply_button_css={true}
                                cutomButton={[
                                  {
                                    handleClick: () => {
                                      setRulesPopup(false);
                                    },
                                    label: "OK",
                                    style: "",
                                  },
                                ]}
                                footerless={true}
                              >
                                <p>
                                  <RulesResult rowData={ruleData} />
                                </p>
                              </Popup>
                            )}
                          </tr>
                        </>
                      );
                    }
                    if(source === "blinkit_rule") {
                        return (
                          <>
                            <tr className="rule_content blinkit_rule">
                              {item?.rule_name || item?.rule_name == 0 ? (
                               <td className="p-2  hover:text-[13px] hover:underline transition-all duration-300" >
                               <div className="text-[13px] text-center flex items-center justify-center gap-1" title={item?.rule_name}>
                                 <p className="truncate  max-w-[80px]" style={styleScheduledInfo} >
                                 {" "}
                                 {item?.rule_name}
                                 </p>
                               </div>
                               </td>
                              ) : (
                                "-"
                              )}
                              {item?.is_active === true ? (
                                <td className="p-2">
                                  {item.is_deleted == false && (
                                    <div className="text-[13px] text-center">
                                      {" "}
                                      Enabled
                                    </div>
                                  )}
                                </td>
                              ) : (
                                <td className="p-2">
                                  <div className="text-[13px] text-center">
                                    {" "}
                                    Disabled
                                  </div>
                                </td>
                              )}
                              {item.campaign_type || item.campaign_type == 0 ? (
                                <td className="p-2 text-[13px] text-center">
                                  {item.campaign_type.map((x, index) => (
                                    <span key={index}>
                                      {x}
                                      {index !==
                                        item.campaign_type.length - 1 && (
                                          <span>, </span>
                                        )}
                                    </span>
                                  ))}
                                </td>
                              ) : (
                                "-"
                              )}
                              {item.entity || item.entity === 0 ? (
                                <td className="p-2 ">
                                  <div className="text-[13px] text-center">
                                    {" "}
                                    {item.entity}
                                  </div>
                                </td>
                              ) : (
                                "-"
                              )}
                              <td className="p-2">
                                <div className=" text-[13px] text-center justify-center flex items-center gap-1">
                                  <span>

                                  {item?.action
                                    .split(/(?=[A-Z])/)
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                    </span>
                                      { 
                                      getRuleConditionText(item.rule_conditions).length>0&&
                                        <span className="text-[13px]">
                                          <Tooltip 
                                            title={
                                              getRuleConditionText(item.rule_conditions)
                                            }
                                            className={
                                              `!px-3 flex items-center gap-1 rounded-sm !shadow-md ${bodyIndex<1&&"top-7 !py-6"}`
                                            }
                                            /> 
                                        </span>
                                        }
                                    
                                </div>
                                {/* {item?.rule_conditions?.map(
                                  (conditionGroup, groupIndex) => (
                                    <span
                                      className="text-[13px] text-center"
                                      key={groupIndex}
                                    >
                                      {groupIndex > 0 && (
                                        <span>
                                          OR <br />
                                        </span>
                                      )}
  
                                      {conditionGroup?.map(
                                        (condition, conditionIndex) => {
                                          let tooltipText=`(If 
                                            ${condition?.conditionCategory}${" "}
                                            is
                                            ${condition.conditionType !=
                                              "is_not_in_range"
                                              ? "  "
                                              : ""}
                                            ${condition?.conditionType ===
                                              "greater_than"
                                              ? "Greater than"
                                              : condition.conditionType ===
                                                "smaller_than"
                                                ? "Less than"
                                                : condition.conditionType ===
                                                  "range"
                                                  ? "Between"
                                                  : condition.conditionType ===
                                                    "is_not_in_range"
                                                    ? "n't between"
                                                    : "-"}
                                                    ${" "}
                                            ${condition?.conditionType ===
                                              "range" ||
                                              condition?.conditionType ===
                                              "is_not_in_range"
                                              ? `${condition?.less}-${condition?.greater}`
                                              : condition?.conditionType ===
                                                "smaller_than"
                                                ? `${condition?.less}`
                                                : condition?.greater}
                                            )`
                                          return <span
                                            key={conditionIndex}
                                            className="flex"
                                          >
                                            {conditionIndex > 0 && (
                                              <span className="ml-2">AND</span>
                                            )}{" "}
                                              <Tooltip 
                                              title={
                                                tooltipText
                                              }
                                              className={
                                                "!px-3 flex items-center gap-1 rounded-sm !shadow-md"
                                              }
                                              />
                                             
                                          </span>
                                        }
                                      )}
                                    </span>
                                  )
                                )} */}
                                
                              </td>
  
                              {item.entity || item.entity === 0 ? (
                                <td className="p-2">
                                  <div
                                    className="text-[13px] cursor-pointer text-center flex justify-center items-center gap-1"
                                    onClick={() => {
                                      setRulesPopup(item.id);
                                      setRuleData(item.id);
                                    }}
                                  >
                                    {" "}
                                    <span className="text-blue-500">
                                    No Changes To {item.entity.length>8?`${item.entity.slice(0,8)}`:item.entity}
                                    </span>
                                    {
                                      item?.entity?.length>8 &&(
                                        <Tooltip 
                                          title={`No Changes To ${item.entity}`}
                                          className={
                                            "!px-3 flex items-center gap-1 rounded-sm !shadow-md"
                                          }
                                        />
                                      )
                                    }
                                  </div>
                                </td>
                              ) : null}
                              {item.entity || item.entity == 0 ? (
                                <td className="p-2">
                                  <button
                                    className="preview__btn w-14"
                                    onClick={() => {
                                      setRuleId(item)
                                      setShowPopup(!showPopup)
                                    }}
                                  >
                                    <div className="row flex-col items-center">
                                      <div className=" w-4 col_4 ">
                                        <img src="/assets/images/eye-solid.svg" alt="" />
                                        {/* <BsEyeFill/> */}
                                      </div>
                                      <div className="">View</div>
                                    </div>
                                  </button>
                                </td>
                              ) : null}
                              {item.schedule || item.schedule == 0 ? (
                                <td className="p-2">
                                  <div className="text-[13px] text-center">
                                    {" "}
                                    {item.schedule}
                                  </div>
                                </td>
                              ) : null}
  
  
                              {/* {item.clicks || item.clicks == 0 ? ( */}
                              {item.entity || item.entity == 0 ? (
                                <td className="p-2">
                                  <div className="text-[12px] text-center">
                                    {item.created_by}
                                  </div>
                                </td>
                              ) : null}
                              {/* ) : null} */}
  
                              {/* {item.action ? ( */}
                              <td className="">
                                {/* data to show in the popup */}
                                <div className="">
                                  <ZeptoPreviewBtn rowData={item} source="blinkit" />
                                </div>
                              </td>
                              {/* ) : null} */}
                              {rulesPopup === item.id && (
                                <Popup
                                  title="Rule results"
                                  
                                  setShowPopup={setRulesPopup}
                                  apply_button_css={true}
                                  cutomButton={[
                                    {
                                      handleClick: () => {
                                        setRulesPopup(false);
                                      },
                                      label: "OK",
                                      style: "",
                                    },
                                  ]}
                                  footerless={true}
                                >
                                  <p>
                                    <ZeptoRuleResult rowData={ruleData} source="blinkit"  />
                                  </p>
                                </Popup>
                              )}
                            </tr>
                          </>
                        );
                      
                    }
                    if (source === "zepto_rule") {
                      return (
                        <>
                          <tr className="rule_content">
                            {item?.rule_name || item?.rule_name == 0 ? (
                             <td className="p-2  hover:text-[13px] hover:underline transition-all duration-300" >
                             <div className="text-[13px] text-center flex items-center justify-center gap-1" title={item?.rule_name}>
                               <p className="truncate  max-w-[80px]" style={styleScheduledInfo} >
                               {" "}
                               {item?.rule_name}
                               </p>
                             </div>
                             </td>
                            ) : (
                              "-"
                            )}
                            {item?.is_active === true ? (
                              <td className="p-2">
                                {item.is_deleted == false && (
                                  <div className="text-[13px] text-center">
                                    {" "}
                                    Enabled
                                  </div>
                                )}
                              </td>
                            ) : (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  Disabled
                                </div>
                              </td>
                            )}

                            {item.platform_id && item.platform_id.length > 0 ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                {item.platform_id.map((x, index) => (
                                    <span key={index}>
                                      {x}
                                      {index !==
                                        item.platform_id.length - 1 && (
                                        <span>, </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            ) : (
                              "--"
                            )}
                            {item.campaign_type || item.campaign_type == 0 ? (
                              <td className="p-2 text-[13px] text-center">
                                {item.campaign_type.map((x, index) => (
                                  <div key={index}>
                                    {x}
                                    {index !==
                                      item.campaign_type.length - 1 && (
                                      <span>, </span>
                                    )}
                                  </div>
                                ))}
                              </td>
                            ) : (
                              "-"
                            )}
                            {item.entity || item.entity === 0 ? (
                              <td className="p-2 ">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  {item.entity}
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            <td className="p-2">
                              <div className="text-[13px] flex items-center justify-center gap-1">
                                {item?.action
                                  .split(/(?=[A-Z])/)
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                                  { 
                              getRuleConditionText(item.rule_conditions).length>0&&
                              <span className="text-[13px]">
                                <Tooltip 
                                    title={
                                      getRuleConditionText(item.rule_conditions)
                                    }
                                    className={
                                      `!px-3 flex items-center gap-1 rounded-sm !shadow-md ${bodyIndex<1&&"top-7 !py-6"}`
                                    }
                                    /> 
                                </span>
                                }
                              </div>
                              {/* {item?.rule_conditions?.map(
                                (conditionGroup, groupIndex) => (
                                  <div
                                    className="text-[13px] text-center"
                                    key={groupIndex}
                                  >
                                    {groupIndex > 0 && (
                                      <span>
                                        OR <br />
                                      </span>
                                    )}

                                    {conditionGroup?.map(
                                      (condition, conditionIndex) => (
                                        <div
                                          key={conditionIndex}
                                          className="inline"
                                        >
                                          {conditionIndex > 0 && (
                                            <span className="ml-2">AND</span>
                                          )}{" "}
                                          <span>
                                            (If {condition?.conditionCategory}{" "}
                                            is
                                            {condition.conditionType !=
                                            "is_not_in_range"
                                              ? "  "
                                              : ""}
                                            {condition?.conditionType ===
                                            "greater_than"
                                              ? "Greater than"
                                              : condition.conditionType ===
                                                "smaller_than"
                                              ? "Less than"
                                              : condition.conditionType ===
                                                "range"
                                              ? "Between"
                                              : condition.conditionType ===
                                                "is_not_in_range"
                                              ? "n't between"
                                              : "-"}{" "}
                                            {condition?.conditionType ===
                                              "range" ||
                                            condition?.conditionType ===
                                              "is_not_in_range"
                                              ? `${condition?.less}-${condition?.greater}`
                                              : condition?.conditionType ===
                                                "smaller_than"
                                              ? `${condition?.less}`
                                              : condition?.greater}
                                            )
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )} */}
                            </td>

                            {item.entity || item.entity === 0 ? (
                              <td className="p-2">
                                <div
                                  className="text-[13px] text-blue-500 cursor-pointer text-center"
                                  onClick={() => {
                                    setRulesPopup(item.id);
                                    setRuleData(item.id);
                                  }}
                                >
                                  {" "}
                                  <span>
                                  No Changes To {item.entity.length>8?`${item.entity.slice(0,8)}`:item.entity}
                                  </span>
                                  {
                                      item?.entity?.length>8 &&(
                                        <Tooltip 
                                          title={`No Changes To ${item.entity}`}
                                          className={
                                            "!px-3 flex items-center gap-1 rounded-sm !shadow-md"
                                          }
                                        />
                                      )
                                    }
                                </div>
                              </td>
                            ) : null}
                            {item.entity || item.entity == 0 ? (
                              <td className="p-2">
                                <button
                                  className="preview__btn preview__btn_zepto w-14"
                                  onClick={() => {
                                    setRuleId(item);
                                    setShowPopup(!showPopup);
                                  }}
                                >
                                  <div className="row flex-col items-center">
                                    <div className=" w-4 col_4 ">
                                      <img
                                        src="/assets/images/eye-solid.svg"
                                        alt=""
                                      />
                                      {/* <BsEyeFill/> */}
                                    </div>
                                    <div className="">View</div>
                                  </div>
                                </button>
                              </td>
                            ) : null}
                            {item.schedule || item.schedule == 0 ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  {item.schedule}
                                </div>
                              </td>
                            ) : null}

                            {/* {item.clicks || item.clicks == 0 ? ( */}
                            {item.entity || item.entity == 0 ? (
                              <td className="p-2">
                                <div className="text-[12px] text-center">
                                  {item.created_by}
                                </div>
                              </td>
                            ) : null}
                            {/* ) : null} */}

                            {/* {item.action ? ( */}
                            <td className="">
                              {/* data to show in the popup */}
                              <div className="">
                                <ZeptoPreviewBtn rowData={item} source={"zepto"}/>
                              </div>
                            </td>
                            {/* ) : null} */}
                            {rulesPopup === item.id && (
                              <Popup
                                title="Rule results"
                                
                                setShowPopup={setRulesPopup}
                                apply_button_css={true}
                                cutomButton={[
                                  {
                                    handleClick: () => {
                                      setRulesPopup(false);
                                    },
                                    label: "OK",
                                    style: "",
                                  },
                                ]}
                                footerless={true}
                              >
                                <p>
                                  <ZeptoRuleResult rowData={ruleData} />
                                </p>
                              </Popup>
                            )}
                          </tr>
                        </>
                      );
                    }

                    if (source === "instamart_rule") {
                      return (
                        <>
                          <tr className="rule_content blinkit_rule">
                            {item.rule_name || item.rule_name == 0 ? (
                              <td className="p-2  hover:text-[13px] hover:underline transition-all duration-300" >
                              <div className="text-[13px] text-center flex items-center justify-center gap-1" title={item?.rule_name}>
                                <p className="truncate  max-w-[80px]" style={styleScheduledInfo} >
                                {" "}
                                {item?.rule_name}
                                </p>
                              </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            {item?.is_active === true ? (
                              <td className="p-2">
                                {item.is_deleted == false && (
                                  <div className="text-[13px] text-center">
                                    {" "}
                                    Enabled
                                  </div>
                                )}
                              </td>
                            ) : (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  Disabled
                                </div>
                              </td>
                            )}

                            {item.platform_id && item.platform_id.length > 0 ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center flex justify-center">
                                  {item.platform_id.map((x, index) => (
                                    <div key={index}>
                                      {x}
                                      {index !==
                                        item.platform_id.length - 1 && (
                                        <span>, </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            ) : (
                              "--"
                            )}
                            {item.entity || item.entity === 0 ? (
                              <td className="p-2 ">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  {item.entity}
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            <td className="p-2">
                            <div className=" text-[13px] text-center justify-center flex items-center gap-1">
                              <span>
                                {item?.action
                                  .split(/(?=[A-Z])/)
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </span>
                              { 
                                getRuleConditionText(item.rule_conditions)?.length>0 &&
                                  <span className="text-[13px]">
                                    <Tooltip 
                                      title={
                                        getRuleConditionText(item.rule_conditions)
                                      }
                                      className={
                                        `!px-3 flex items-center gap-1 rounded-sm !shadow-md ${bodyIndex<1&&"top-7 !py-6"}`
                                      }
                                      /> 
                                  </span>
                                  }
                              {/* {item?.rule_conditions?.map(
                                (conditionGroup, groupIndex) => (
                                  <div
                                    className="text-[13px] text-center"
                                    key={groupIndex}
                                  >
                                    {groupIndex > 0 && (
                                      <span>
                                        OR <br />
                                      </span>
                                    )}

                                    {conditionGroup?.map(
                                      (condition, conditionIndex) => (
                                        <div
                                          key={conditionIndex}
                                          className="inline"
                                        >
                                          {conditionIndex > 0 && (
                                            <span className="ml-2">AND</span>
                                          )}{" "}
                                          <span>
                                            (If {condition?.conditionCategory}{" "}
                                            is
                                            {condition.conditionType !=
                                            "is_not_in_range"
                                              ? "  "
                                              : ""}
                                            {condition?.conditionType ===
                                            "greater_than"
                                              ? "Greater than"
                                              : condition.conditionType ===
                                                "smaller_than"
                                              ? "Less than"
                                              : condition.conditionType ===
                                                "range"
                                              ? "Between"
                                              : condition.conditionType ===
                                                "is_not_in_range"
                                              ? "n't between"
                                              : "-"}{" "}
                                            {condition?.conditionType ===
                                              "range" ||
                                            condition?.conditionType ===
                                              "is_not_in_range"
                                              ? `${condition?.less}-${condition?.greater}`
                                              : condition?.conditionType ===
                                                "smaller_than"
                                              ? `${condition?.less}`
                                              : condition?.greater}
                                            )
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )} */}
                              </div>
                            </td>

                            {item.entity || item.entity === 0 ? (
                              <td className="p-2">
                                <div
                                  className="text-[13px] text-blue-500 cursor-pointer text-center"
                                  onClick={() => {
                                    setRulesPopup(item.id);
                                    setRuleData(item.id);
                                  }}
                                >
                                  {" "}
                                  No Changes To {item.entity}
                                </div>
                              </td>
                            ) : null}
                            {item.entity || item.entity == 0 ? (
                              <td className="p-2">
                                <button
                                  className="preview__btn preview__btn_insta w-14"
                                  onClick={() => {
                                    setRuleId(item);
                                    setShowPopup(!showPopup);
                                  }}
                                >
                                  <div className="row flex-col items-center">
                                    <div className=" w-4 col_4 ">
                                      <img
                                        src="/assets/images/eye-solid.svg"
                                        alt=""
                                      />
                                      {/* <BsEyeFill/> */}
                                    </div>
                                    <div className="">View</div>
                                  </div>
                                </button>
                              </td>
                            ) : null}
                            {item.schedule || item.schedule == 0 ? (
                              <td className="p-2">
                                <div className="text-[13px] text-center">
                                  {" "}
                                  {item.schedule}
                                </div>
                              </td>
                            ) : null}

                            {/* {item.clicks || item.clicks == 0 ? ( */}
                            {item.entity || item.entity == 0 ? (
                              <td className="p-2">
                                <div className="text-[12px] text-center">
                                  {item.created_by}
                                </div>
                              </td>
                            ) : null}
                            {/* ) : null} */}

                            {/* {item.action ? ( */}
                            <td className="">
                              {/* data to show in the popup */}
                              <div className="">
                                <InstamartPreviewBtn rowData={item} />
                              </div>
                            </td>
                            {/* ) : null} */}
                            {rulesPopup === item.id && (
                              <Popup
                                title="Rule results"
                                
                                setShowPopup={setRulesPopup}
                                apply_button_css={true}
                                cutomButton={[
                                  {
                                    handleClick: () => {
                                      setRulesPopup(false);
                                    },
                                    label: "OK",
                                    style: "",
                                  },
                                ]}
                                footerless={true}
                              >
                                <p>
                                  <InstamartRuleResult rowData={ruleData} />
                                </p>
                              </Popup>
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "amazon_creative") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.impressions || item.impressions == 0 ? (
                              <td className="p-2">
                                <div> {item.impressions}</div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div> {item.clicks}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : null}
                            {item.sales || item.sales == 0 ? (
                              <td className="p-2">
                                <div> {item.sales}</div>
                              </td>
                            ) : null}
                            {item.acos || item.acos == 0 ? (
                              <td className="p-2">
                                <div> {item.acos}</div>
                              </td>
                            ) : null}
                            {item.roas || item.roas == 0 ? (
                              <td className="p-2">
                                <div> {item.roas}</div>
                              </td>
                            ) : null}
                            {item.units_sold || item.units_sold == 0 ? (
                              <td className="p-2">
                                <div> {item.units_sold}</div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "amazon_placement") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.placement || item.placement == 0 ? (
                              <td className="p-2">
                                <div> {item.placement}</div>
                              </td>
                            ) : null}
                            {item.campaign_bidding_stratergy ||
                            item.campaign_bidding_stratergy == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_bidding_stratergy}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.impressions || item.impressions == 0 ? (
                              <td className="p-2">
                                <div> {item.impressions}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div> {item.clicks}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.conversion || item.conversion == 0 ? (
                              <td className="p-2">
                                <div> {item.conversion}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.sales || item.sales == 0 ? (
                              <td className="p-2">
                                <div> {item.sales}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.acos || item.acos == 0 ? (
                              <td className="p-2">
                                <div> {item.acos}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                            {item.roas || item.roas == 0 ? (
                              <td className="p-2">
                                <div> {item.roas}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> -</div>
                              </td>
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "dummy") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.keyword || item.keyword == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword}</div>
                              </td>
                            ) : null}
                            {item.keyword_match_type ||
                            item.keyword_match_type == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_match_type}</div>
                              </td>
                            ) : null}
                            {item.segment || item.segment == 0 ? (
                              <td className="p-2">
                                <div> {item.segment}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_name || item.campaign_name == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.platform || item.platform == 0 ? (
                              <td className="p-2">
                                <div> {item.platform}</div>
                              </td>
                            ) : null}
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div> {item.spend}</div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="p-2">
                                <div> {item.views}</div>
                              </td>
                            ) : null}

                            {item.clicks || item.clicks == 0 ? (
                              <td className="p-2">
                                <div> {item.clicks}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                            {item.ctr || item.ctr == 0 ? (
                              <td className="p-2">
                                <div> {item.ctr}</div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source === "blinkit") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="!pl-4">
                                <input
                                  className=""
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data._id)
                                    .includes(item._id)}
                                  onChange={(e) =>
                                    handleCheckBox(e.target.checked, item)
                                  }
                                />
                              </td>
                            )}
                            {headers.map(
                              (header, headerIndex) =>
                                header.showCol && (
                                  <td className="p-2" key={headerIndex}>
                                    {header.value === "created_on"
                                      ? convertDateFormartToMMDDYYYY(
                                          item[header.value]
                                        )
                                      : item[header.value]}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "search_term") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="p-1 text-left">
                                <input
                                  className="h-16 m-3"
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data.id)
                                    .includes(item.id)}
                                  onChange={(e) =>
                                    handleCheckBoxSearchTerm(
                                      e.target.checked,
                                      item
                                    )
                                  }
                                />
                              </td>
                            )}
                            {headers.map(
                              (header, headerIndex) =>
                                header.showCol && (
                                  <td className="p-2" key={headerIndex}>
                                    {item[header.value]}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "zepto") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="p-1 text-center">
                                <input
                                  className="h-16 m-3"
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data.id)
                                    .includes(item.id)}
                                  onChange={(e) =>
                                    handleCheckBox(e.target.checked, item)
                                  }
                                />
                              </td>
                            )}
                            {headers.map(
                              (header, headerIndex) =>
                                header.showCol && (
                                  <td className="p-2" key={headerIndex}>
                                    {item[header.value]}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    // if (source === "amazon") {
                    //   return (
                    //     <>
                    //       <tr className="tablecontent">
                    //         {isCheckBoxRequired === true && (
                    //           <td className="p-1 text-center">
                    //             <input
                    //               className="h-16 m-3"
                    //               type="checkbox"
                    //               checked={editData
                    //                 .map((data) => data.id)
                    //                 .includes(item.id)}
                    //               onChange={(e) =>
                    //                 handleCheckBox(e.target.checked, item)
                    //               }
                    //             />
                    //           </td>
                    //         )}
                    //         {headers.map(
                    //           (header, headerIndex) =>
                    //             header.showCol && (
                    //               <td className="p-2" key={headerIndex}>
                    //                 {item[header.value]}
                    //               </td>
                    //             )
                    //         )}
                    //       </tr>
                    //     </>
                    //   );
                    // }
                  })
                ) : !loading ? (
                  <td
                    className="p-2"
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle  row sticky font-semibold">
                      No Data Found
                    </div>
                  </td>
                ) : // <tr>
                //   <div className="p-2 row sticky "> No Data found</div>
                // </tr>
                null
              }
              {showPopup && (
                <div>
                  {source == "zepto_rule" ? (
                    <ZeptoRulesPreview
                      showPopup={showPopup}
                      setShowPopup={setShowPopup}
                      ruleId={ruleId}
                      getRulesApi={getRulesApi}
                    />
                  ) : source == "blinkit_rule" ? (
                    <BlinkitRulesPreview
                      showPopup={showPopup}
                      setShowPopup={setShowPopup}
                      ruleId={ruleId}
                      getRulesApi={getRulesApi}
                    />
                  ) : source == "instamart_rule" ? (
                    <InstamartRulesPreview
                      showPopup={showPopup}
                      setShowPopup={setShowPopup}
                      ruleId={ruleId}
                      getRulesApi={getRulesApi}
                    />
                  ) : (
                    <RulesPreview
                      showPopup={showPopup}
                      setShowPopup={setShowPopup}
                      ruleId={ruleId}
                      accountsData={accountsData}
                      getRulesApi={getRulesApi}
                    />
                  )}
                </div>
              )}
              {loading && (
                <>
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle p-2 row sticky ">
                      <LoaderSpinner />
                    </div>
                  </td>
                </>
              )}
            </tbody>
          </table>

          {/* <button
          onClick={() => {
            callSearchPropertyAction();
          }}
        >
          Load More
        </button> */}
        </div>
        {/* {totalData > 10 ? (
          <Pagination paginate={paginate} page={page} totalData={totalData} />
        ) : null} */}
        {/* <NewPagination newpaginate={newpaginate} /> */}
      </div>
    </>
  );
};

export default FlipkartTable;
