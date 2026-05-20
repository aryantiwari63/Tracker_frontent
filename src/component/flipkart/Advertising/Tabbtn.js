/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const Tabbtn = ({ title, imgsrc, onClick, active, icon, platform }) => {
  // console.log("platform", platform);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let {
    totalCampaign,

    totalPortfolios,
    amazonCampaignCount,
    totalAmsAdgroupCount,
    totalKeywords,
    totalCategoryCount,
    blinkitFunnelCount,
    zeptoFunnelCount,
    totalAsins,
    instamartFunnelCount,
   
    flipkartFunnelCount,
    totalCreatives,
    totalPlacements,
    // selectedCheckBox
  } = useSelector((state) => state?.CampaignReducer);

  // let blinkitKeyword = blinkitFunnelCount.keyword_count;
  // let blinkitCategory = blinkitFunnelCount.category_count;

  // zepto variables
  // let zeptoKeyword = zeptoFunnelCount.keyword;
  // let zeptoCategory = zeptoFunnelCount.category;
  // let zeptoProducts = zeptoFunnelCount.product;

  // instamart variables
  // let instamartKeyword = instamartFunnelCount.keyword;
  // let instamartProducts = instamartFunnelCount.product;

  const buttonCss =
    platform === "amazon"
      ? "text-amsPrimary"
      : platform === "instamart"
      ? "text-instamartPrimary"
      : platform === "zepto"
      ? "text-zeptoPrimary"
      : platform === "blinkit"
      ? "text-blinkitPrimary"
      : "text-flipkartPrimary";

  // const totalTabKeyObj = {
  //   portfolio: totalPortfolios,
  //   campaign: totalCampaign,
  //   adgroup: totalAmsAdgroupCount,
  //   keyword: totalKeywords,
  //   asin: totalAsins,
  //   product: totalAsins,
  //   category: totalCategoryCount,
  //   creative: totalCreatives,
  //   placement: totalPlacements,
  // };
  // console.log("teststsees>>>>>>>>>>>", totalTabKeyObj);

  // const getTotalCount = (title) => {
  //   let tabName = title.toLowerCase().split(" ").join("");
  //   let val = totalTabKeyObj[tabName] || "";
  //   if (Array.isArray(val)) val = "";
  //   // console.log(val,title)
  //   return val;
  // };

  // const getSelectedCheckboxCount = (titleUpperCase) => {
  //   let val = "";
  //   let title = titleUpperCase.toLowerCase().split(" ").join("");
  //   if (selectedCheckBox[title]?.length) {
  //     val = `${selectedCheckBox[title]?.length} / ${
  //       totalTabKeyObj[title] || "0"
  //     }`;
  //   }

  //   return val || "";
  // };

  // const amazonFunnelObj = useMemo(() => {
  //   return {
  //     campaign: amazonCampaignCount?.camp,
  //     portfolio: amazonCampaignCount?.portfolio,
  //     adgroup: amazonCampaignCount?.adgroup,
  //     asin: amazonCampaignCount?.asin,
  //     keyword: amazonCampaignCount?.keyword,
  //     placement: amazonCampaignCount?.placement,
  //     creative: amazonCampaignCount?.creative,
  //   };
  // }, [amazonCampaignCount]);

  // const blinkitFunnelObj = useMemo(() => {
  //   return {
  //     campaign: blinkitFunnelCount.camp,
  //     keyword: blinkitFunnelCount.keyword_count,
  //     category: blinkitFunnelCount.category_count,
  //   };
  // }, [blinkitFunnelCount]);

  // const zeptoFunnelObj = useMemo(() => {
  //   return {
  //     keyword: zeptoFunnelCount.keyword,
  //     category: zeptoFunnelCount.category,
  //     product: zeptoFunnelCount.product,
  //   };
  // }, [zeptoFunnelCount]);

  // const instamartFunnelObj = useMemo(() => {
  //   // console.log("etststsesttststtstststsst", totalCampaign);
  //   return {
  //     campaign: instamartFunnelCount.camp,
  //     keyword: instamartFunnelCount.keyword,
  //     product: instamartFunnelCount.product,
  //   };
  // }, [instamartFunnelCount]);

  // const getFunnelCount = (platform, titleText) => {
  //   let title = titleText.toLowerCase().split(" ").join("");
  //   let val = "";

  //   if (
  //     platform === "amazon" &&
  //     amazonCampaignCount &&
  //     Object.keys(amazonCampaignCount)?.length > 0
  //   ) {
  //     val = amazonFunnelObj[title];
  //   } else if (
  //     platform === "blinkit" &&
  //     blinkitFunnelCount &&
  //     Object.keys(blinkitFunnelCount)?.length > 0
  //   ) {
  //     val = blinkitFunnelObj[title];
  //   } else if (
  //     platform === "zepto" &&
  //     zeptoFunnelCount &&
  //     Object.keys(zeptoFunnelCount)?.length > 0
  //   ) {
  //     val = zeptoFunnelObj[title];
  //   } else if (
  //     platform === "instamart" &&
  //     instamartFunnelCount &&
  //     Object.keys(instamartFunnelCount)?.length > 0
  //   ) {
  //     // console.log("etstnggsssf>>>>>>>>>>>>");
  //     val = instamartFunnelObj[title];
  //   }
  //   return String(val);
  // };
  // const returnValue = (platform, title, active, value) => {
  //   // console.log("title>>>>>>>>", title);
  //   let funnel_count = getFunnelCount(platform, title);
  //   let total_count = getTotalCount(title);
  //   // console.log("total_count>>>>>>>>", total_count);
  //   if (Array.isArray(selectedCheckBox) && !total_count) {
  //     // console.log("u_funnel");
  //     // console.log("newtttstsssssssssssssssssssssssss", getTotalCount(title));
  //     return funnel_count;
  //   } else if (
  //     selectedCheckBox &&
  //     typeof selectedCheckBox === "object" &&
  //     selectedCheckBox !== null &&
  //     selectedCheckBox[value] &&
  //     selectedCheckBox[value].length > 0
  //   ) {
  //     // console.log("selected>>>>>>>");
  //     return getSelectedCheckboxCount(title);
  //   } else if (active || total_count) {
  //     // console.log("active");
  //     return getTotalCount(title);
  //     // t;
  //   } else if (funnel_count) {
  //     // console.log("b_funnel");
  //     return funnel_count;
  //   }
  // };

  // const returnValue = (platform, title, active, value) => {
  //   // console.log("title>>>>>>>>", title);
  //   let funnel_count = getFunnelCount(platform, title);
  //   let total_count = getTotalCount(title);
  //   // console.log("total_count>>>>>>>>", total_count);
  //   if (Array.isArray(selectedCheckBox) && !total_count) {
  //     // console.log("u_funnel");
  //     // console.log("newtttstsssssssssssssssssssssssss", getTotalCount(title));
  //     return funnel_count;
  //   } else if (
  //     selectedCheckBox &&
  //     typeof selectedCheckBox === "object" &&
  //     selectedCheckBox !== null &&
  //     selectedCheckBox[value] &&
  //     selectedCheckBox[value].length > 0
  //   ) {
  //     // console.log("selected>>>>>>>");
  //     return getSelectedCheckboxCount(title);
  //   } else if (active || total_count) {
  //     // console.log("active");
  //     return getTotalCount(title);
  //     // t;
  //   } else if (funnel_count) {
  //     // console.log("b_funnel");
  //     return funnel_count;
  //   }
  // };

  return (
    <>
      <div className="bg-white pt-8 ">
        {" "}
        <div
          className={[
            "campaign__navtabli border-b",
            active && "campaign__navtabli--active border-b-white",
            platform == "amazon" && "campaign__navtabli--ams",
            platform !== "amazon" && "campaign__navtabli--flipkart",
          ].join(" ")}
        >
          <button onClick={onClick} className="border-b">
            <div className="row">
              <div className={title == "Portfolio" ? "mt-1" : ""}>
                <img className="imgicon !ml-0" src={imgsrc} alt="" />
              </div>
              <div>{icon}</div>
              <div className={`text-lg font-normal ${active && buttonCss}`}>
                {" "}
                {title}{" "}
              </div>
             
              {/* {platform == "amazon" && title == "Campaign" && (
                <div
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                >
                  {" "}
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)}
                  {returnValue(platform, title, active, value)}
                </div>
              )}
              {platform == "amazon" && title == "Portfolio" && (
                <div
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {" "}
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)} 
                  {returnValue(platform, title, active, value)}
                </div>
              )}
              {platform == "amazon" && title == "Ad Group" && (
                <div
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {" "}
                   {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)} 
                  {returnValue(platform, title, active, value)}
                </div>
              )}
              {platform == "amazon" && title == "ASIN" && (
                <div
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {" "}
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)} 
                  {returnValue(platform, title, active, value)}
                </div>
              )}
              {platform == "amazon" && title == "Keyword" && (
                <div
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {" "}
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)}
                  {returnValue(platform, title, active, value)}
                </div>
              )}
              {platform == "amazon" && title == "Placement" && (
                <div
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {" "}
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)}
                  {returnValue(platform, title, active, value)}
                </div>
              )}
              {platform == "amazon" && title == "Creative" && (
                <div
                  style={{
                    background: active === true ? "#ffe0b1" : "#F0F0F0",
                    color: active === true ? "#EF880F" : "#737373",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[10px] text-[#EF880F] bg-[#ffe0b1] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {" "}
                 {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)} 
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}
              {/* ----------------BLINKIT ------------------------------ */}
              {/* {platform === "blinkit" && title === "Campaign" && (
                <div
                  style={{
                    background: active === true ? "#DBFBED" : "#F0F0F0",
                    color: active === true ? "#23BC7C" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) || getTotalCount(title)
                      ? "text-[#23BC7C] bg-[#DBFBED] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {getSelectedCheckboxCount(title) || getTotalCount(title)}
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

              {/* {platform === "blinkit" && title === "Category" && (
                <div
                  style={{
                    background: active === true ? "#DBFBED" : "#F0F0F0",
                    color: active === true ? "#23BC7C" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#23BC7C] bg-[#DBFBED] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)}
                {returnValue(platform, title, active, value)}
                </div>
              )}

              {platform === "blinkit" && title === "Keyword" && (
                <div
                  style={{
                    background: active === true ? "#DBFBED" : "#F0F0F0",
                    color: active === true ? "#23BC7C" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#23BC7C] bg-[#DBFBED] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)}
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

              {/* {platform === "blinkit" && title === "Keyword" && !active && (
                <div
                  className={
                    selectedCheckBox?.campaign?.length > 0
                      ? "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {selectedCheckBox?.campaign?.length > 0 &&
                    (blinkitKeyword ?? 0)}
                </div>
              )} */}

              {/* ---------------ZEPTO----------------- */}
              {/* {platform === "zepto" && title === "Campaign" && (
                <div
                  style={{
                    background: active === true ? "#e5e0ed" : "#F0F0F0",
                    color: active === true ? "#9D7FB5" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) || getTotalCount(title)
                      ? "text-[#9D7FB5] bg-[#e5e0ed] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

              {/* {platform === "zepto" && title === "Category" && (
                <div
                  style={{
                    background: active === true ? "#e5e0ed" : "#F0F0F0",
                    color: active === true ? "#9D7FB5" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#9D7FB5] bg-[#e5e0ed] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

            

              {/* {platform === "zepto" && title === "Keyword" && (
                <div
                  style={{
                    background: active === true ? "#e5e0ed" : "#F0F0F0",
                    color: active === true ? "#9D7FB5" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#9D7FB5] bg-[#e5e0ed] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

              {/* {platform === "zepto" && title === "Keyword" && !active && (
                <div
                  className={
                    selectedCheckBox?.campaign?.length > 0
                      ? "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {selectedCheckBox?.campaign?.length > 0 &&
                    (zeptoKeyword ?? 0)}
                </div>
              )} */}

              {/* {platform === "zepto" && title === "Product" && (
                <div
                  style={{
                    background: active === true ? "#e5e0ed" : "#F0F0F0",
                    color: active === true ? "#9D7FB5" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#9D7FB5] bg-[#e5e0ed] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

              {/* {platform === "zepto" && title === "Product" && !active && (
                <div
                  className={
                    selectedCheckBox?.campaign?.length > 0
                      ? "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {selectedCheckBox?.campaign?.length > 0 &&
                    (zeptoProducts ?? 0)}
                </div>
              )} */}

              {/* ---------------------------------------------------------------- */}

              {/* ---------------INSTAMART----------------- */}
              {/* {platform === "instamart" && title === "Campaign" && (
                <div
                  style={{
                    background: active === true ? "#EFE1E9" : "#F0F0F0",
                    color: active === true ? "#912F64" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) || getTotalCount(title)
                      ? "text-[#912F64] bg-[#EFE1E9] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {/* {getSelectedCheckboxCount(title) || getTotalCount(title)}
                   */}
                  {/* {returnValue(platform, title, active, value)} */}
                </div>
            

              {/* {platform === "instamart" && title === "Keyword" && (
                <div
                  style={{
                    background: active === true ? "#EFE1E9" : "#F0F0F0",
                    color: active === true ? "#912F64" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#912F64] bg-[#EFE1E9] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {/* {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)} */}
                  {/* {returnValue(platform, title, active, value)} */}
                {/* </div> */}
              

              {/* {platform === "instamart" && title === "Keyword" && !active && (
                <div
                  className={
                    selectedCheckBox?.campaign?.length > 0
                      ? "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {selectedCheckBox?.campaign?.length > 0 &&
                    (instamartKeyword ?? 0)}
                </div>
              )} */}

              {/* {platform === "instamart" && title === "Keyword" && (
                <div
                  style={{
                    background: active === true ? "#EFE1E9" : "#F0F0F0",
                    color: active === true ? "#912F64" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#912F64] bg-[#EFE1E9] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {/* {getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)} */}
                  {/* {returnValue(platform, title, active, value)} */}
                {/* </div> */}
            

              {/* {platform === "instamart" && title === "Product" && (
                <div
                  style={{
                    background: active === true ? "#EFE1E9" : "#F0F0F0",
                    color: active === true ? "#912F64" : "#000000",
                  }}
                  className={
                    getSelectedCheckboxCount(title) ||
                    getFunnelCount(platform, title) ||
                    getTotalCount(title)
                      ? "text-[#912F64] bg-[#EFE1E9] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                 
                  {returnValue(platform, title, active, value)}
                </div>
              )} */}

              {/* {platform === "instamart" && title === "Product" && !active && (
                <div
                  className={
                    selectedCheckBox?.campaign?.length > 0
                      ? "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : ""
                  }
                >
                  {selectedCheckBox?.campaign?.length > 0 &&
                    (instamartProducts ?? 0)}
                </div>
              )} */}

              {/* ---------------------------------------------------------------- */}
              {/* {platform === "flipkart" && title === "Campaign" && (
                <div
                  className={
                    active
                      ? "text-[#0081F7] bg-[#badeff] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                  }
                >
                  {selectedCheckBox?.campaign?.length > 0
                    ? `${selectedCheckBox?.campaign?.length}/${
                        active ? totalCampaign : flipkartFunnelCount.camp
                      }`
                    : active
                    ? totalCampaign
                    : flipkartFunnelCount.camp}
                </div>
              )} */}

              {/* {platform === "flipkart" && title === "Ad Group" && (
                <div
                  className={
                    active
                      ? "text-[#0081F7] bg-[#badeff] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                  }
                >
                  {selectedCheckBox?.adgroup?.length > 0
                    ? `${selectedCheckBox?.adgroup?.length}/${
                        active
                          ? totalAmsAdgroupCount
                          : flipkartFunnelCount.adgroup
                      }`
                    : active
                    ? totalAmsAdgroupCount
                    : flipkartFunnelCount.adgroup}
                </div>
              )} */}

              {/* {platform === "flipkart" && title === "FSN" && (
                <div
                  className={
                    active
                      ? "text-[#0081F7] bg-[#badeff] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                  }
                >
                  {selectedCheckBox?.fsn?.length > 0
                    ? `${selectedCheckBox?.fsn?.length}/${
                        active ? totalAsins : flipkartFunnelCount.fsn
                      }`
                    : active
                    ? totalAsins
                    : flipkartFunnelCount.fsn}
                </div>
              )} */}

              {/* {platform === "flipkart" && title === "Placement" && (
                <div
                  className={
                    active
                      ? "text-[#0081F7] bg-[#badeff] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                  }
                >
                  {selectedCheckBox?.placement?.length > 0
                    ? `${selectedCheckBox?.placement?.length}/${
                        active ? totalPlacements : flipkartFunnelCount.placement
                      }`
                    : active
                    ? totalPlacements
                    : flipkartFunnelCount.placement}
                </div>
              )} */}

              {/* {platform === "flipkart" && title === "Keyword" && (
                <div
                  className={
                    active
                      ? "text-[#0081F7] bg-[#badeff] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                  }
                >
                  {selectedCheckBox?.keyword?.length > 0
                    ? `${selectedCheckBox?.keyword?.length}/${
                        active ? totalKeywords : flipkartFunnelCount.keyword
                      }`
                    : active
                    ? totalKeywords
                    : flipkartFunnelCount.keyword}
                </div>
              )} */}

              {/* {platform === "flipkart" && title === "Creative" && (
                <div
                  className={
                    active
                      ? "text-[#0081F7] bg-[#badeff] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                      : "text-[#000000] bg-[#F0F0F0] text-[10px] rounded-xl px-1 h-6 ml-[3px] min-w-[25px]"
                  }
                >
                  {selectedCheckBox?.creative?.length > 0
                    ? `${selectedCheckBox?.creative?.length}/${
                        active ? totalCreatives : flipkartFunnelCount.creative
                      }`
                    : active
                    ? totalCreatives
                    : flipkartFunnelCount.creative}
                </div>
              )} */}
            {/* </div> */}
          </button>
        </div>
      </div>
    </>
  );
};
export default Tabbtn;
