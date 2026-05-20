import React from "react";
import { CommonScreenTabledata } from "../../utils/amazonConstants";
import SkeletonPlatformCard from "../common-components/loader/SkeletonPlatformCard";

const AmazonTable = ({
  filterName,
  onClick,
  amazonSummary,
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

  findGraphIndex();
  return (
    <>
      {CommonScreenTabledata?.map((item, i) => (
        <tr key={i} className="">
          <td className="">
            <div className="flex justify-center">
              <img src="/assets/images/icons8-amazon.svg" alt="" />
            </div>
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("amazon_spend");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_spend"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {amazonSummary?.spend.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {amazonSummary?.spend.last_data}
                      </div>
                      <div className="flex gap-1">
                        {amazonSummary?.spend.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.spend.last_val
                          ? amazonSummary?.spend.last_val >= 0
                            ? amazonSummary?.spend.last_val + "%"
                            : -amazonSummary?.spend.last_val + "%"
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
              onClick("amazon_sales");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_sales"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {amazonSummary?.sales.value}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {amazonSummary?.sales.last_data}
                      </div>
                      <div className="flex gap-1">
                        {amazonSummary?.sales.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.sales.last_val
                          ? amazonSummary?.sales.last_val >= 0
                            ? amazonSummary?.sales.last_val + "%"
                            : -amazonSummary?.sales.last_val + "%"
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
              onClick("amazon_orders");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_orders"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.units_sold.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {amazonSummary?.units_sold.last_data}
                      </div>
                      <div className="flex gap-1">
                        {amazonSummary?.units_sold.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.units_sold.last_val
                          ? amazonSummary?.units_sold.last_val >= 0
                            ? amazonSummary?.units_sold.last_val + "%"
                            : -amazonSummary?.units_sold.last_val + "%"
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
              onClick("amazon_roas");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_roas"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.roas.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{amazonSummary?.roas.last_data}</div>
                      <div className="flex gap-1">
                        {amazonSummary?.roas.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.roas.last_val
                          ? amazonSummary?.roas.last_val >= 0
                            ? amazonSummary?.roas.last_val + "%"
                            : -amazonSummary?.roas.last_val + "%"
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
              onClick("amazon_impressions");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_impressions"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.impressions.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {amazonSummary?.impressions.last_data}
                      </div>
                      <div className="flex gap-1">
                        {amazonSummary?.impressions.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.impressions.last_val
                          ? amazonSummary?.impressions.last_val >= 0
                            ? amazonSummary?.impressions.last_val + "%"
                            : -amazonSummary?.impressions.last_val + "%"
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
              onClick("amazon_clicks");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_clicks"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.clicks.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{amazonSummary?.clicks.last_data}</div>
                      <div className="flex gap-1">
                        {amazonSummary?.clicks.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.clicks.last_val
                          ? amazonSummary?.clicks.last_val >= 0
                            ? amazonSummary?.clicks.last_val + "%"
                            : -amazonSummary?.clicks.last_val + "%"
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
              onClick("amazon_ctr");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_ctr"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.ctr.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{amazonSummary?.ctr.last_data}</div>
                      <div className="flex gap-1">
                        {amazonSummary?.ctr.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.ctr.last_val
                          ? amazonSummary?.ctr.last_val >= 0
                            ? amazonSummary?.ctr.last_val + "%"
                            : -amazonSummary?.ctr.last_val + "%"
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
              onClick("amazon_cpc");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_cpc"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.cpc.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{amazonSummary?.cpc.last_data}</div>
                      <div className="flex gap-1">
                        {amazonSummary?.cpc.last_val >= 0 ? (
                          // <div className="px-0.5 py-1.5">
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          //</div>
                          <img src="/assets/images/down_green.svg" alt="" />
                        )}
                        {amazonSummary?.cpc.last_val
                          ? amazonSummary?.cpc.last_val >= 0
                            ? amazonSummary?.cpc.last_val + "%"
                            : -amazonSummary?.cpc.last_val + "%"
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
              onClick("amazon_aov");
            }}
          >
            {!loadingSummary? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("amazon_aov"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{amazonSummary?.aov.value}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{amazonSummary?.aov.last_data}</div>
                      <div className="flex gap-1">
                        {amazonSummary?.aov.last_val >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {amazonSummary?.aov.last_val
                          ? amazonSummary?.aov.last_val >= 0
                            ? amazonSummary?.aov.last_val + "%"
                            : -amazonSummary?.aov.last_val + "%"
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

export default AmazonTable;
