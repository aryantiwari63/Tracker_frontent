import React from "react";
import { CommonScreenBlinkiTabledata } from "../../utils/amazonConstants";
import SkeletonPlatformCard from "../common-components/loader/SkeletonPlatformCard";

const BlinkitTable = ({
  filterName,
  onClick,
  blinkitSummary,
  noComparison,
  loadingSummary,
}) => {
  const gcolors = ["#3FA2FD", "#A887F8", "#62EA98", "#FFC0CB"];
  const findGraphIndex = (item1) => {
    const index = filterName.indexOf(item1);
    if (index >= 0) {
      return gcolors[index];
    } else return "";
  };

  let currency = localStorage.getItem("currency");

  return (
    <>
      {CommonScreenBlinkiTabledata?.map((item, i) => (
        <tr key={i} className="">
          <td className=" ">
            <div className="flex justify-center">
              <img src={item.image} alt="" />
            </div>
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("blinkit_spend");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_spend"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {blinkitSummary?.estimated_budget_consumed.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {blinkitSummary?.estimated_budget_consumed.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.estimated_budget_consumed.last_val >=
                        0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.estimated_budget_consumed.last_val
                          ? blinkitSummary?.estimated_budget_consumed
                              .last_val >= 0
                            ? blinkitSummary?.estimated_budget_consumed
                                .last_val + "%"
                            : -blinkitSummary?.estimated_budget_consumed
                                .last_val + "%"
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
              onClick("blinkit_sales");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_sales"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {blinkitSummary?.total_sales.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {blinkitSummary?.total_sales.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.total_sales.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.total_sales.last_val
                          ? blinkitSummary?.total_sales.last_val >= 0
                            ? blinkitSummary?.total_sales.last_val + "%"
                            : -blinkitSummary?.total_sales.last_val + "%"
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
              onClick("blinkit_orders");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_orders"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{blinkitSummary?.total_quantities_sold.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {blinkitSummary?.total_quantities_sold.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.total_quantities_sold.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.total_quantities_sold.last_val
                          ? blinkitSummary?.total_quantities_sold.last_val >= 0
                            ? blinkitSummary?.total_quantities_sold.last_val +
                              "%"
                            : -blinkitSummary?.total_quantities_sold.last_val +
                              "%"
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
              onClick("blinkit_roas");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_roas"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{blinkitSummary?.total_roas.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {blinkitSummary?.total_roas.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.total_roas.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.total_roas.last_val
                          ? blinkitSummary?.total_roas.last_val >= 0
                            ? blinkitSummary?.total_roas.last_val + "%"
                            : -blinkitSummary?.total_roas.last_val + "%"
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
              onClick("blinkit_impressions");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_impressions"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{blinkitSummary?.impressions.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {blinkitSummary?.impressions.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.impressions.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.impressions.last_val
                          ? blinkitSummary?.impressions.last_val >= 0
                            ? blinkitSummary?.impressions.last_val + "%"
                            : -blinkitSummary?.impressions.last_val + "%"
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
              onClick("blinkit_clicks");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_clicks"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{blinkitSummary?.unique_clicks.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {blinkitSummary?.unique_clicks.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.unique_clicks.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.unique_clicks.last_val
                          ? blinkitSummary?.unique_clicks.last_val >= 0
                            ? blinkitSummary?.unique_clicks.last_val + "%"
                            : -blinkitSummary?.unique_clicks.last_val + "%"
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
              onClick("blinkit_ctr");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_ctr"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {blinkitSummary?.ctr.value == "NaN"
                    ? 0
                    : blinkitSummary?.ctr.value}
                  %
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {blinkitSummary?.ctr.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.ctr.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.ctr.last_val
                          ? blinkitSummary?.ctr.last_val >= 0
                            ? blinkitSummary?.ctr.last_val + "%"
                            : -blinkitSummary?.ctr.last_val + "%"
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
              onClick("blinkit_cpc");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_cpc"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {blinkitSummary?.cpc.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {blinkitSummary?.cpc.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.cpc.last_val >= 0 ? (
                          // <div className="px-0.5 py-1.5">
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          // </div>
                          <img src="/assets/images/down_green.svg" alt="" />
                        )}
                        {blinkitSummary?.cpc.last_val
                          ? blinkitSummary?.cpc.last_val >= 0
                            ? blinkitSummary?.cpc.last_val + "%"
                            : -blinkitSummary?.cpc.last_val + "%"
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
              onClick("blinkit_aov");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("blinkit_aov"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {blinkitSummary?.aov.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {blinkitSummary?.aov.last_data}
                      </div>
                      <div className="flex gap-1">
                        {blinkitSummary?.aov.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {blinkitSummary?.aov.last_val
                          ? blinkitSummary?.aov.last_val >= 0
                            ? blinkitSummary?.aov.last_val + "%"
                            : -blinkitSummary?.aov.last_val + "%"
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

export default BlinkitTable;
