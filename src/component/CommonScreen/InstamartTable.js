import React from "react";
import { CommonScreenSwiggyTabledata } from "../../utils/amazonConstants";
import SkeletonPlatformCard from "../common-components/loader/SkeletonPlatformCard";

const InstamartTable = ({
  filterName,
  onClick,
  instamartSummary,
  noComparison,
  loadingSummary,
}) => {
  const gcolors = ["#3FA2FD", "#A887F8", "#62EA98", "#FFC0CB", "#963C71"];
  const findGraphIndex = (item1) => {
    const index = filterName.indexOf(item1);
    if (index >= 0) {
      return gcolors[index];
    } else return "";
  };

  let currency = localStorage.getItem("currency");

  return (
    <>
      {CommonScreenSwiggyTabledata?.map((item, i) => (
        <tr key={i} className="">
          <td className=" ">
            <div className="flex justify-center">
              <img src={item.image} style={{ height: "3.5rem" }} alt="" />
            </div>
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_spend");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_spend") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_spend"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {instamartSummary?.spend.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {instamartSummary?.spend.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.spend.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.spend.last_val
                          ? instamartSummary?.spend.last_val >= 0
                            ? instamartSummary?.spend.last_val + "%"
                            : -instamartSummary?.spend.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_sales");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_sales") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_sales"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {instamartSummary?.gmv.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {instamartSummary?.gmv.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.gmv.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.gmv.last_val
                          ? instamartSummary?.gmv.last_val >= 0
                            ? instamartSummary?.gmv.last_val + "%"
                            : -instamartSummary?.gmv.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_orders");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_orders") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_orders"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{instamartSummary?.units_sold.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {instamartSummary?.units_sold.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.units_sold.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.units_sold.last_val
                          ? instamartSummary?.units_sold.last_val >= 0
                            ? instamartSummary?.units_sold.last_val + "%"
                            : -instamartSummary?.units_sold.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_roas");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("instamart_roas"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{instamartSummary?.roi.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{instamartSummary?.roi.last_data}</div>
                      <div className="flex gap-1">
                        {instamartSummary?.roi.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.roi.last_val
                          ? instamartSummary?.roi.last_val >= 0
                            ? instamartSummary?.roi.last_val + "%"
                            : -instamartSummary?.roi.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_impressions");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some(
                    (item) => item === "instamart_impressions"
                  ) && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_impressions"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{instamartSummary?.impressions.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {instamartSummary?.impressions.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.impressions.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.impressions.last_val
                          ? instamartSummary?.impressions.last_val >= 0
                            ? instamartSummary?.impressions.last_val + "%"
                            : -instamartSummary?.impressions.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_clicks");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_clicks") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_clicks"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{instamartSummary?.clicks.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {instamartSummary?.clicks.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.clicks.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.clicks.last_val
                          ? instamartSummary?.clicks.last_val >= 0
                            ? instamartSummary?.clicks.last_val + "%"
                            : -instamartSummary?.clicks.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_ctr");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_ctr") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_ctr"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {instamartSummary?.ctr.value == "NaN"
                    ? 0
                    : instamartSummary?.ctr.value}
                  %
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{instamartSummary?.ctr.last_data}</div>
                      <div className="flex gap-1">
                        {instamartSummary?.ctr.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.ctr.last_val
                          ? instamartSummary?.ctr.last_val >= 0
                            ? instamartSummary?.ctr.last_val + "%"
                            : -instamartSummary?.ctr.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_cpc");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_cpc") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_cpc"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {instamartSummary?.cpc.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {instamartSummary?.cpc.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.cpc.last_val >= 0 ? (
                          // <div className="px-0.5 py-1.5">
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          // </div>
                          <img src="/assets/images/down_green.svg" alt="" />
                        )}
                        {instamartSummary?.cpc.last_val
                          ? instamartSummary?.cpc.last_val >= 0
                            ? instamartSummary?.cpc.last_val + "%"
                            : -instamartSummary?.cpc.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("instamart_aov");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "instamart_aov") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("instamart_aov"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {instamartSummary?.aov.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {instamartSummary?.aov.last_data}
                      </div>
                      <div className="flex gap-1">
                        {instamartSummary?.aov.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {instamartSummary?.aov.last_val
                          ? instamartSummary?.aov.last_val >= 0
                            ? instamartSummary?.aov.last_val + "%"
                            : -instamartSummary?.aov.last_val + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default InstamartTable;
