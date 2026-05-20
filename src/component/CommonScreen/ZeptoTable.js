import React from "react";
import { CommonScreenZeptoTabledata } from "../../utils/amazonConstants";
import SkeletonPlatformCard from "../common-components/loader/SkeletonPlatformCard";

const ZeptoTable = ({
  filterName,
  onClick,
  zeptoSummary,
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
      {CommonScreenZeptoTabledata?.map((item, i) => (
        <tr key={i} className="">
          <td className=" ">
            <div className="flex justify-center">
              <img src={item.image} style={{ height: "3.5rem" }} alt="" />
            </div>
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("zepto_spend");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_spend") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_spend"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {zeptoSummary?.spend.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {zeptoSummary?.spend.last_data}
                      </div>
                      <div className="flex gap-1">
                        {zeptoSummary?.spend.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.spend.last_val
                          ? zeptoSummary?.spend.last_val >= 0
                            ? zeptoSummary?.spend.last_val + "%"
                            : -zeptoSummary?.spend.last_val + "%"
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
              onClick("zepto_sales");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_sales") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_sales"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {zeptoSummary?.revenues.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {zeptoSummary?.revenues.last_data}
                      </div>
                      <div className="flex gap-1">
                        {zeptoSummary?.revenues.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.revenues.last_val
                          ? zeptoSummary?.revenues.last_val >= 0
                            ? zeptoSummary?.revenues.last_val + "%"
                            : -zeptoSummary?.revenues.last_val + "%"
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
              onClick("zepto_orders");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_orders") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_orders"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{zeptoSummary?.orders.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{zeptoSummary?.orders.last_data}</div>
                      <div className="flex gap-1">
                        {zeptoSummary?.orders.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.orders.last_val
                          ? zeptoSummary?.orders.last_val >= 0
                            ? zeptoSummary?.orders.last_val + "%"
                            : -zeptoSummary?.orders.last_val + "%"
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
              onClick("zepto_roas");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_roas") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_roas"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {zeptoSummary?.total_roas.value == "NaN"
                    ? 0
                    : zeptoSummary?.total_roas.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {zeptoSummary?.total_roas.last_data}
                      </div>
                      <div className="flex gap-1">
                        {zeptoSummary?.total_roas.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.total_roas.last_val
                          ? zeptoSummary?.total_roas.last_val >= 0
                            ? zeptoSummary?.total_roas.last_val + "%"
                            : -zeptoSummary?.total_roas.last_val + "%"
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
              onClick("zepto_impressions");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_impressions") &&
                    "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_impressions"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{zeptoSummary?.impressions.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {zeptoSummary?.impressions.last_data}
                      </div>
                      <div className="flex gap-1">
                        {zeptoSummary?.impressions.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.impressions.last_val
                          ? zeptoSummary?.impressions.last_val >= 0
                            ? zeptoSummary?.impressions.last_val + "%"
                            : -zeptoSummary?.impressions.last_val + "%"
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
              onClick("zepto_clicks");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_clicks") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_clicks"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{zeptoSummary?.clicks.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{zeptoSummary?.clicks.last_data}</div>
                      <div className="flex gap-1">
                        {zeptoSummary?.clicks.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.clicks.last_val
                          ? zeptoSummary?.clicks.last_val >= 0
                            ? zeptoSummary?.clicks.last_val + "%"
                            : -zeptoSummary?.clicks.last_val + "%"
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
              onClick("zepto_ctr");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_ctr") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_ctr"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {zeptoSummary?.ctr.value == "NaN"
                    ? 0
                    : zeptoSummary?.ctr.value}
                  %
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{zeptoSummary?.ctr.last_data}</div>
                      <div className="flex gap-1">
                        {zeptoSummary?.ctr.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.ctr.last_val
                          ? zeptoSummary?.ctr.last_val >= 0
                            ? zeptoSummary?.ctr.last_val + "%"
                            : -zeptoSummary?.ctr.last_val + "%"
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
              onClick("zepto_cpc");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_cpc") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_cpc"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {zeptoSummary?.cpc.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {zeptoSummary?.cpc.last_data}
                      </div>
                      <div className="flex gap-1">
                        {zeptoSummary?.cpc.last_val >= 0 ? (
                          // <div className="px-0.5 py-1.5">
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          // </div>
                          <img src="/assets/images/down_green.svg" alt="" />
                        )}
                        {zeptoSummary?.cpc.last_val
                          ? zeptoSummary?.cpc.last_val >= 0
                            ? zeptoSummary?.cpc.last_val + "%"
                            : -zeptoSummary?.cpc.last_val + "%"
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
              onClick("zepto_aov");
            }}
          >
            {!loadingSummary ? (
              <div
                className={[
                  "commonscreen__card font-semibold text-lg ",
                  filterName?.some((item) => item === "zepto_aov") && "",
                ].join(" ")}
                style={{
                  borderColor: findGraphIndex("zepto_aov"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {zeptoSummary?.aov.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {zeptoSummary?.aov.last_data}
                      </div>
                      <div className="flex gap-1">
                        {zeptoSummary?.aov.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {zeptoSummary?.aov.last_val
                          ? zeptoSummary?.aov.last_val >= 0
                            ? zeptoSummary?.aov.last_val + "%"
                            : -zeptoSummary?.aov.last_val + "%"
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

export default ZeptoTable;
