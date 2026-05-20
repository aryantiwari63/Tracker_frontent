import React, { useState } from "react";

import { convertDateFormatToDateMonthNameYear } from "../../../utils/helpers";
import LoaderSpinner from "../loader-spinner";
import PreviewBtn from "../../Amazon/rules/button/Previewbtn";
import "./styles.css";
import RulesResult from "../../Amazon/rules/button/RulesResult";
import Popup from "../Popups/Popup";
import RulesPreview from "../../Amazon/rules/button/RulesPreview";
import Tooltip from "../../Amazon/advertise/CampaignManager/createBulkadgroup/Tooltip";
import { getRuleConditionText } from "./function";
import { accentThemeObj } from "../../../style/StyleConstants";

const AMAZONTABLE = ({
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
  tags,
  getRulesApi,
}) => {
  const [rulesPopup, setRulesPopup] = useState(false);
  const [ruleData, setRuleData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [ruleId, setRuleId] = useState({});

  let currency = localStorage.getItem("currency");

  React.useEffect(() => {
    //console.log("bodyContent123", bodyContent);
  }, [bodyContent]);

  const handleCheckBox = (check, data) => {
    // console.log(check, data, "check");
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item.id !== data.id));
    }
  };
  const handleAllCheckBox = (check, data) => {
    if (check) {
      setEditData([...data]);
    } else {
      setEditData([]);
    }
  };
  let currency_format = localStorage.getItem("currency_format");

  const userName = localStorage.getItem("name");
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };

  const getAcc = (id) => {
    let selected = [];
    accountsData.map((item) => {
      if (id.includes(item.value)) {
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
          className="campaignreport__table max-h-[70vh] overflow-y-auto"
          onScroll={handleScroll}
        >
          <table className="w-full">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35]"
                  : source === "rule"
                  ? "campaignreport__tablehead  table-fixed sticky top-0 left-0 bg-[#F3F4F6] z-10"
                  : "campaignreport__tablehead  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6] "
              }
            >
              <tr className={source}>
                {isCheckBoxRequired === true && (
                  <th className="pl-2">
                    <input
                      className={` h-16  ${accentThemeObj["ams"]}`} 
                      type="checkbox"
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
                          <th
                            className={`py-4 !pl-4 ${
                              source === "rule" &&
                              `!max-w-[200px] !min-w-[200px] !static`
                            }`}
                          >
                            <div
                              className={
                                customCss === true
                                  ? "rule_table "
                                  : "tableHead py-2 px-1.5 text-center !text-base"
                              }
                            >
                              <p>{item.title}</p>
                              {bodyContent &&
                                bodyContent.length > 0 &&
                                item.show && (
                                  <div
                                    className={
                                      customCss === true
                                        ? "rule_arrow flex justify-end"
                                        : "sortArrow cursor-pointer flex justify-end"
                                    }
                                  >
                                    <div>
                                      <div
                                        className="flex justify-end pr-8"
                                        onClick={() => sortData(item?.value, 1)}
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            sortBy.order === 1
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
                                        className="downArrow flex justify-end pr-8"
                                        onClick={() =>
                                          sortData(item?.value, -1)
                                        }
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            sortBy.order === -1
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
                          <th rowSpan={3} className="multiCol">
                            <div className="graycol">{item.title}</div>
                            {item.showCol &&
                              item.subTitles?.map((v, index) => {
                                return (
                                  <td key={index} className="graydirect">
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
                  bodyContent?.map((item, bodyIndex) => {
                    if (source === "campaign") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.campaign_name || item.campaign_name === 0 ? (
                              <td className="p-2">
                                <div>{item.campaign_name}</div>
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
                            {item.campaign_budget ||
                            item.campaign_budget === 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.campaign_budget.toLocaleString(
                                    currency_format
                                  )}
                                </div>
                              </td>
                            ) : null}
                            {item.spend || item.spend === 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views === 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.clicks || item.clicks === 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.CTR || item.CTR === 0 ? (
                              <td className="p-2">
                                <div> {item.CTR}</div>
                              </td>
                            ) : null}
                            {item.cpc || item.cpc === 0 ? (
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
                    if (source === "fsn") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.fsn_id || item.fsn_id == 0 ? (
                              <td className="p-2">
                                <div> {item.fsn_id}</div>
                              </td>
                            ) : null}
                            {item.product_name || item.product_name == 0 ? (
                              <td className="p-2">
                                <div> {item.product_name}</div>
                              </td>
                            ) : null}
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
                    if (source == "adgroup") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {item.adgroup_name || item.adgroup_name == 0 ? (
                              <td className="pl-2 min-w-max ">
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
                                  {item.campaign_budget != null
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
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {convertDateFormatToDateMonthNameYear(
                                    item.created_on
                                  )}
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
                            {item.created_on || item.created_on == 0 ? (
                              <td className="p-2">
                                <div>
                                  {convertDateFormatToDateMonthNameYear(
                                    item.created_on
                                  )}
                                </div>
                              </td>
                            ) : null}
                            {item.mode || item.mode == 0 ? (
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
                            {item.orders || item.orders == 0 ? (
                              <td className="px-2">
                                <div> {item.orders}</div>
                              </td>
                            ) : null}
                            {item.direct_revenue || item.direct_revenue == 0 ? (
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
                                  {item.direct_revenue - item.indirect_revenue >
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

                            {item.direct_aov || item.direct_aov == 0 ? (
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
                                  {item.direct_aov - item.indirect_aov > 0
                                    ? "▲"
                                    : item.direct_aov - item.indirect_aov == 0
                                    ? ""
                                    : "▼"}
                                  <b className="text-[#23BC7C] font-normal text-sm">
                                    {!isNaN(
                                      (Math.abs(
                                        item.direct_aov - item.indirect_aov
                                      ) /
                                        item.direct_aov) *
                                        100
                                    )
                                      ? (
                                          (Math.abs(
                                            item.direct_aov - item.indirect_aov
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
                            {item.clicks || item.clicks == 0 ? (
                              <td className="px-2">
                                <div>
                                  {" "}
                                  {item.clicks.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.views || item.views == 0 ? (
                              <td className="">
                                <div>
                                  {" "}
                                  {item.views.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.direct_roi || item.direct_roi == 0 ? (
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
                                  {item.direct_roi - item.indirect_roi > 0
                                    ? "▲"
                                    : item.direct_roi - item.indirect_roi == 0
                                    ? ""
                                    : "▼"}
                                  <b className="text-[#23BC7C] font-normal text-sm">
                                    {!isNaN(
                                      (Math.abs(
                                        item.direct_roi - item.indirect_roi
                                      ) /
                                        item.direct_roi) *
                                        100
                                    )
                                      ? (
                                          (Math.abs(
                                            item.direct_roi - item.indirect_roi
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

                            {item.cpc || item.cpc == 0 ? (
                              <td className="p-2">
                                <div> {item.cpc.toFixed(2)}</div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "keyword") {
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
                              <td className="p-2">
                                {" "}
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
                    if (source == "searchCampaign") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="p-1 text-center">
                                <input
                                  className="h-16 m-3"
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
                                    {item[header.value]
                                      ? item[header.value]
                                      : "-"}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source == "reportKeyword") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="p-1 text-center">
                                <input
                                  className="h-16 m-3"
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
                                    {item[header.value]
                                      ? item[header.value]
                                      : "__"}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "amazonSearchData") {
                      return (
                        <>
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {isCheckBoxRequired === true && (
                              <td className="pl-5  min-w-max ">
                                <input
                                  className="h-16"
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

                            {item._id ? (
                              <td className="p-2">
                                <div> {item._id}</div>
                              </td>
                            ) : null}
                            {item.search_term ? (
                              <td className="p-2">
                                <div> {item.search_term}</div>
                              </td>
                            ) : (
                              <td className="p-2">
                                <div> __ </div>
                              </td>
                            )}
                            {item.campaign_name ? (
                              <td className="p-2">
                                <div> {item.campaign_name}</div>
                              </td>
                            ) : null}
                            {item.campaign_id || item.campaign_id == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_id}</div>
                              </td>
                            ) : null}
                            {item.ad_group_name || item.ad_group_name == 0 ? (
                              <td className="p-2">
                                <div> {item.ad_group_name}</div>
                              </td>
                            ) : null}
                            {item.ad_group_id ? (
                              <td className="p-2">
                                <div> {item.ad_group_id}</div>
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
                            {item.spend || item.spend == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.spend.toLocaleString(currency_format)}
                                </div>
                              </td>
                            ) : null}
                            {item.profile_id || item.profile_id == 0 ? (
                              <td className="p-2">
                                <div>
                                  {" "}
                                  {item.profile_id.toLocaleString(
                                    currency_format
                                  )}
                                </div>
                              </td>
                            ) : null}
                            {item.created_on || item.created_on == 0 ? (
                              <td className="p-2">
                                <div> {item.created_on}</div>
                              </td>
                            ) : null}
                            {item.match_type || item.match_type == 0 ? (
                              <td className="p-2">
                                <div> {item.match_type}</div>
                              </td>
                            ) : null}
                            {item.keyword_text || item.keyword_text == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_text}</div>
                              </td>
                            ) : null}
                            {item.keyword_bid || item.keyword_bid == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_bid}</div>
                              </td>
                            ) : null}
                            {item.keyword_status || item.keyword_status == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_status}</div>
                              </td>
                            ) : null}
                            {item.campaign_budget ||
                            item.campaign_budget == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_budget}</div>
                              </td>
                            ) : null}
                            {item.conversions || item.conversions == 0 ? (
                              <td className="p-2">
                                <div> {item.conversions}</div>
                              </td>
                            ) : null}
                            {item.campaign_budget_type ||
                            item.campaign_budget_type == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_budget_type}</div>
                              </td>
                            ) : null}
                            {item.campaign_status ||
                            item.campaign_status == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_status}</div>
                              </td>
                            ) : null}
                            {item.revenue || item.revenue == 0 ? (
                              <td className="p-2">
                                <div> {item.revenue}</div>
                              </td>
                            ) : null}
                            {item.campaign_goal || item.campaign_goal == 0 ? (
                              <td className="p-2">
                                <div> {item.campaign_goal}</div>
                              </td>
                            ) : null}
                            {item.keyword_id || item.keyword_id == 0 ? (
                              <td className="p-2">
                                <div> {item.keyword_id}</div>
                              </td>
                            ) : null}
                            {item.portfolio_id || item.portfolio_id == 0 ? (
                              <td className="p-2">
                                <div> {item.portfolio_id}</div>
                              </td>
                            ) : null}
                          </tr>
                        </>
                      );
                    }
                    if (source == "searchadgroup") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="p-1 text-center">
                                <input
                                  className="h-16 m-3"
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
                                    {item[header.value]}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source == "search") {
                      return (
                        <>
                          <tr className="tablecontent">
                            {isCheckBoxRequired === true && (
                              <td className="p-1 text-center">
                                <input
                                  className="h-16 m-3"
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
                                    {item[header.value]}
                                  </td>
                                )
                            )}
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
                    if (source == "amazonnegativeKeyword") {
                      return (
                        <>
                          <tr className="">
                            {isCheckBoxRequired === true && (
                              <td className=" text-center">
                                <input
                                  className="h-16  accent-orange-600/100"
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
                                  <td
                                    className="p-2 bg-red-400"
                                    key={headerIndex}
                                  >
                                    {header.value === "campaign_name" ? (
                                      item.state === "paused" ? (
                                        <div className="flex">
                                          <img
                                            className="mr-2 mx-2"
                                            src="/assets/images/pause-circle.svg"
                                            alt=""
                                          />
                                          <p>{item[header.value]}</p>
                                        </div>
                                      ) : (
                                        <div className="flex">
                                          <img
                                            className="mr-2 mx-2"
                                            src="/assets/images/active-circle.svg"
                                            alt=""
                                          />
                                          <p>{item[header.value]}</p>
                                        </div>
                                      )
                                    ) : item[header.value] ? (
                                      item[header.value]
                                    ) : (
                                      "-"
                                    )}
                                    {/* {item[header.value]
                                      ? [header.value] === "campaign_name"
                                        ? "abc"
                                        : item[header.value]
                                      : "-fdgdg"} */}
                                  </td>
                                )
                            )}
                          </tr>
                        </>
                      );
                    }
                    if (source === "searchData") {
                      return (
                        <>
                          <tr
                            className={
                              isCheckBoxRequired
                                ? "tableContentCheckBox"
                                : "tablecontent"
                            }
                          >
                            {isCheckBoxRequired === true && (
                              <td className="pl-2">
                                <input
                                  className="h-16 m-3"
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
                      if (item.tags.length > 0) {
                        let tagData = [];
                        item.tags.map((tag) => {
                          tagData.push(
                            tags?.find((x) => x._id === tag)?.tag_name
                          );
                        });

                        item.tagsData = tagData;
                      }

                      return (
                        <>
                          <tr className="rule_content">
                            {item?.rule_name || item?.rule_name == 0 ? (
                              <td
                                className="p-2  hover:text-[13px] hover:underline transition-all duration-300"
                                style={{
                                  maxWidth: "100px",
                                  width: "100px !important",
                                }}
                              >
                                <div
                                  className="text-[13px] text-center flex items-center justify-center gap-1 max-w-[80px]"
                                  title={item?.rule_name}
                                >
                                  <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                    {" "}
                                    {item?.rule_name?.length > 16
                                      ? item?.rule_name?.slice(0, 16)
                                      : item?.rule_name}
                                  </p>
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            {item?.is_active === true ? (
                              <td className="p-2">
                                {item.is_deleted == false && (
                                  <div className="text-[13px]"> Enabled</div>
                                )}
                              </td>
                            ) : (
                              <td className="p-2">
                                <div className="text-[13px]"> Disabled</div>
                              </td>
                            )}

                            {item.platform_id && item.platform_id.length > 0 ? (
                              <td className="p-2">
                                <div className="text-[13px]">
                                  {getAcc(item.platform_id)}
                                </div>
                              </td>
                            ) : (
                              "--"
                            )}
                            {item.campaign_type || item.campaign_type == 0 ? (
                              <td className="p-2 text-[13px]">
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
                                <div className="text-[13px]">
                                  {" "}
                                  {item.entity}
                                </div>
                              </td>
                            ) : (
                              "-"
                            )}
                            <td className="p-2">
                              <div className=" text-[13px] flex items-center gap-1">
                                {item?.action
                                  .split(/(?=[A-Z])/)
                                  .map((word) => word)
                                  .join(" ")}
                                {getRuleConditionText(item.rule_conditions)
                                  .length > 0 && (
                                  <span className="text-[13px]">
                                    <Tooltip
                                      title={getRuleConditionText(
                                        item.rule_conditions
                                      )}
                                      className={`!px-3 flex items-center gap-1 rounded-sm !shadow-md ${
                                        bodyIndex < 1 && "top-7 !py-6"
                                      }`}
                                    />
                                  </span>
                                )}
                              </div>
                              {/* {item?.rule_conditions?.map(
                                (conditionGroup, groupIndex) => (
                                  <div className="text-[13px]" key={groupIndex}>
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
                                  className="text-[13px] text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setRulesPopup(item.id);
                                    setRuleData(item.id);
                                  }}
                                >
                                  {" "}
                                  <span className="text-blue-500">
                                    No Changes To{" "}
                                    {item.entity.length > 8
                                      ? `${item.entity.slice(0, 8)}`
                                      : item.entity}
                                  </span>
                                  {item?.entity?.length > 8 && (
                                    <Tooltip
                                      title={`No Changes To ${item.entity}`}
                                      className={
                                        "!px-3 flex items-center gap-1 rounded-sm !shadow-md"
                                      }
                                    />
                                  )}
                                </div>
                              </td>
                            ) : null}
                            {item.entity || item.entity == 0 ? (
                              <td className="p-2">
                                <button
                                  className="preview__btn w-14 hover:!bg-[#EF880F] hover:border-[#EF880F]"
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
                                <div className="text-[13px]">
                                  {" "}
                                  {item.schedule}
                                </div>
                              </td>
                            ) : null}

                            {/* {item.clicks || item.clicks == 0 ? ( */}

                            <td className="p-2">
                              <div className="text-[12px]">{userName}</div>
                            </td>

                            {/* ) : null} */}

                            {/* {item.action ? ( */}
                            <td className="">
                              {/* data to show in the popup */}
                              <div className="w-[100px]">
                                <PreviewBtn rowData={item} platform="ams" />
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
                  <RulesPreview
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    ruleId={ruleId}
                    accountsData={accountsData}
                    getRulesApi={getRulesApi}
                  />
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

export default AMAZONTABLE;
