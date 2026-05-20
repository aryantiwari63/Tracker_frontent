import React from "react";
import { CommonScreenTabledata } from "../../utils/amazonConstants";
import SkeletonPlatformCard from "../common-components/loader/SkeletonPlatformCard";

const FlipkartTableCommonScreen = ({
  filterName,
  onClick,
  flipkartSummary,
  noComparison,
  loadingSummary
}) => {
  const gcolors = ["#3FA2FD", "#A887F8", "#62EA98", "#FFC0CB"];
  const findGraphIndex = (item1) => {
    const index = filterName.indexOf(item1);
    if (index >= 0) {
      return gcolors[index];
    } else return "";
  };
  return (
    <>
      {CommonScreenTabledata?.map((item, i) => (
        <tr key={i} className="">
          <td className=" ">
            <div className="flex justify-center">
              <img className="h-14" src={item.image} alt="" />
            </div>
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("flipkart_spend");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_spend"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.spend.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{flipkartSummary?.spend.last_data}</div>
                      <div className="flex gap-1">
                        {flipkartSummary?.spend.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.spend.last_val
                          ? flipkartSummary?.spend.last_val >= 0
                            ? flipkartSummary?.spend.last_val + "%"
                            : -flipkartSummary?.spend.last_val + "%"
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
              onClick("flipkart_sales");
            }}
          >
            {!loadingSummary? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_sales"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.total_revenue.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {flipkartSummary?.total_revenue.last_data}
                      </div>
                      <div className="flex gap-1">
                        {flipkartSummary?.total_revenue.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.total_revenue.last_val
                          ? flipkartSummary?.total_revenue.last_val >= 0
                            ? flipkartSummary?.total_revenue.last_val + "%"
                            : -flipkartSummary?.total_revenue.last_val + "%"
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
              onClick("flipkart_orders");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_orders"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.orders.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {flipkartSummary?.orders.last_data}
                      </div>
                      <div className="flex gap-1">
                        {flipkartSummary?.orders.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.orders.last_val
                          ? flipkartSummary?.orders.last_val >= 0
                            ? flipkartSummary?.orders.last_val + "%"
                            : -flipkartSummary?.orders.last_val + "%"
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
              onClick("flipkart_roas");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_roas"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.total_roas.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {flipkartSummary?.total_roas.last_data}
                      </div>
                      <div className="flex gap-1">
                        {flipkartSummary?.total_roas.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.total_roas.last_val
                          ? flipkartSummary?.total_roas.last_val >= 0
                            ? flipkartSummary?.total_roas.last_val + "%"
                            : -flipkartSummary?.total_roas.last_val + "%"
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
              onClick("flipkart_impressions");
            }}
          >
            {!loadingSummary? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_impressions"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.views.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{flipkartSummary?.views.last_data}</div>
                      <div className="flex gap-1">
                        {flipkartSummary?.views.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.views.last_val
                          ? flipkartSummary?.views.last_val >= 0
                            ? flipkartSummary?.views.last_val + "%"
                            : -flipkartSummary?.views.last_val + "%"
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
              onClick("flipkart_clicks");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_clicks"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.clicks.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {flipkartSummary?.clicks.last_data}
                      </div>
                      <div className="flex gap-1">
                        {flipkartSummary?.clicks.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.clicks.last_val
                          ? flipkartSummary?.clicks.last_val >= 0
                            ? flipkartSummary?.clicks.last_val + "%"
                            : -flipkartSummary?.clicks.last_val + "%"
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
              onClick("flipkart_ctr");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_ctr"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.ctr.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{flipkartSummary?.ctr.last_data}</div>
                      <div className="flex gap-1">
                        {flipkartSummary?.ctr.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.ctr.last_val
                          ? flipkartSummary?.ctr.last_val >= 0
                            ? flipkartSummary?.ctr.last_val + "%"
                            : -flipkartSummary?.ctr.last_val + "%"
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
              onClick("flipkart_cpc");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_cpc"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.cpc.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{flipkartSummary?.cpc.last_data}</div>
                      <div className="flex gap-1">
                        {flipkartSummary?.cpc.last_val >= 0 ? (
                          // <div className="px-0.5 py-1.5">
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          // </div>
                          <img src="/assets/images/down_green.svg" alt="" />
                        )}
                        {flipkartSummary?.cpc.last_val
                          ? flipkartSummary?.cpc.last_val >= 0
                            ? flipkartSummary?.cpc.last_val + "%"
                            : -flipkartSummary?.cpc.last_val + "%"
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
              onClick("flipkart_aov");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("flipkart_aov"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{flipkartSummary?.aov.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{flipkartSummary?.aov.last_data}</div>
                      <div className="flex gap-1">
                        {flipkartSummary?.aov.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {flipkartSummary?.aov.last_val
                          ? flipkartSummary?.aov.last_val >= 0
                            ? flipkartSummary?.aov.last_val + "%"
                            : -flipkartSummary?.aov.last_val + "%"
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

export default FlipkartTableCommonScreen;
