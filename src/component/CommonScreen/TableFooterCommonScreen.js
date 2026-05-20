import React from "react";
import { CommonScreenTablefooterdata } from "../../utils/amazonConstants";
import { isNull } from "lodash";
import SkeletonPlatformCard from "../common-components/loader/SkeletonPlatformCard";

const TableFooterCommonScreen = ({
  filterName,
  onClick,
  amazonSummary,
  flipkartSummary,
  blinkitSummary,
  zeptoSummary,
  allowedPlatforms,
  noComparison,
  instamartSummary,
  loadingSummary,
}) => {
  let currency = localStorage.getItem("currency");

  function convertValueToNumber(value) {
    // console.error(value,pf,"convertValueToNumber")
    if (isNull(value)) {
      return 0;
    } else if (value?.endsWith && value?.endsWith("k")) {
      return parseFloat(value) * 1000;
    } else if (value?.endsWith && value?.endsWith("M")) {
      return parseFloat(value) * 1000000;
    } else {
      return parseFloat(value);
    }
  }
  let [
    amazonSpend,
    amazonLastSpend,
    amazonSales,
    amazonLastSales,
    amazonImpressions,
    amazonLastImpressions,
    amazonOrders,
    amazonLastOrders,
    amazonClicks,
    amazonLastClicks,
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (allowedPlatforms && allowedPlatforms?.includes("amazon")) {
    amazonSpend =
      amazonSummary?.spend?.original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary?.spend?.original_val);
    amazonLastSpend =
      amazonSummary?.spend?.last_original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary?.spend?.last_original_val);
    amazonSales =
      amazonSummary?.sales?.original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary?.sales?.original_val);
    amazonLastSales =
      amazonSummary?.sales?.last_original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary?.sales?.last_original_val);
    amazonImpressions =
      amazonSummary.impressions.original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary.impressions.original_val);
    amazonLastImpressions =
      amazonSummary.impressions.last_original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary.impressions.last_original_val);

    amazonOrders =
      amazonSummary?.units_sold?.original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary?.units_sold?.original_val);
    amazonLastOrders =
      amazonSummary?.units_sold?.last_original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary?.units_sold?.last_original_val);
    amazonClicks =
      amazonSummary.clicks.original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary.clicks.original_val);
    amazonLastClicks =
      amazonSummary.clicks.last_original_val == 0
        ? 0
        : convertValueToNumber(amazonSummary.clicks.last_original_val);
  }

  let [
    flipkartSpend,
    flipkartLastSpend,
    flipkartOrders,
    flipkartLastOrders,
    flipkartRevenue,
    flipkartLastRevenue,
    flipkartViews,
    flipkartLastViews,
    flipkartClicks,
    flipkartLastClicks,
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (allowedPlatforms && allowedPlatforms?.includes("flipkart")) {
    flipkartSpend =
      flipkartSummary?.spend?.original_val === 0
        ? flipkartSummary?.spend?.original_val
        : convertValueToNumber(flipkartSummary?.spend?.original_val);
    flipkartLastSpend =
      flipkartSummary?.spend?.last_original_val === 0
        ? flipkartSummary?.spend?.last_original_val
        : convertValueToNumber(flipkartSummary?.spend?.last_original_val);
    flipkartOrders =
      parseInt(flipkartSummary?.orders?.original_val) == 0
        ? parseInt(flipkartSummary?.orders?.original_val)
        : convertValueToNumber(flipkartSummary?.orders?.original_val);
    flipkartLastOrders =
      parseInt(flipkartSummary?.orders?.last_original_val) == 0
        ? parseInt(flipkartSummary?.orders?.last_original_val)
        : convertValueToNumber(flipkartSummary?.orders?.last_original_val);
    flipkartRevenue =
      flipkartSummary?.total_revenue?.original_val === 0
        ? flipkartSummary?.total_revenue.original_val
        : convertValueToNumber(flipkartSummary?.total_revenue?.original_val);
    flipkartLastRevenue =
      flipkartSummary?.total_revenue?.last_original_val === 0
        ? flipkartSummary?.total_revenue.last_original_val
        : convertValueToNumber(
            flipkartSummary?.total_revenue?.last_original_val
          );
    flipkartViews =
      flipkartSummary.views.original_val === 0
        ? flipkartSummary.views.original_val
        : convertValueToNumber(flipkartSummary.views.original_val);
    flipkartLastViews =
      flipkartSummary.views.last_original_val === 0
        ? flipkartSummary.views.last_original_val
        : convertValueToNumber(flipkartSummary.views.last_original_val);
    flipkartClicks =
      flipkartSummary.clicks.original_val === 0
        ? flipkartSummary.clicks.original_val
        : convertValueToNumber(flipkartSummary.clicks.original_val);
    flipkartLastClicks =
      flipkartSummary.clicks.last_original_val === 0
        ? flipkartSummary.clicks.original_val
        : convertValueToNumber(flipkartSummary.clicks.last_original_val);
  }

  let [
    blinkitSpend,
    blinkitLastSpend,
    blinkitSales,
    blinkitLastSales,
    blinkitOrders,
    blinkitLastOrders,
    blinkitImpressions,
    blinkitLastImpressions,
    blinkitClicks,
    blinkitLastClicks,
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (allowedPlatforms && allowedPlatforms?.includes("blinkit")) {
    blinkitSpend =
      blinkitSummary?.estimated_budget_consumed?.original_val === 0
        ? 0
        : convertValueToNumber(
            blinkitSummary?.estimated_budget_consumed?.original_val
          );
    blinkitLastSpend =
      blinkitSummary?.estimated_budget_consumed?.last_original_val === 0
        ? 0
        : convertValueToNumber(
            blinkitSummary?.estimated_budget_consumed?.last_original_val
          );
    blinkitSales =
      blinkitSummary?.total_sales?.original_val == 0
        ? 0
        : convertValueToNumber(blinkitSummary?.total_sales?.original_val);
    blinkitLastSales =
      blinkitSummary?.total_sales?.last_original_val == 0
        ? 0
        : convertValueToNumber(blinkitSummary?.total_sales?.last_original_val);
    blinkitOrders =
      blinkitSummary?.total_quantities_sold?.original_val === 0
        ? 0
        : convertValueToNumber(
            blinkitSummary?.total_quantities_sold?.original_val
          );
    blinkitLastOrders =
      blinkitSummary?.total_quantities_sold?.last_original_val === 0
        ? 0
        : convertValueToNumber(
            blinkitSummary?.total_quantities_sold?.last_original_val
          );

    blinkitImpressions =
      blinkitSummary.impressions.original_val === 0
        ? 0
        : convertValueToNumber(blinkitSummary.impressions.original_val);
    blinkitLastImpressions =
      blinkitSummary.impressions.last_original_val === 0
        ? 0
        : convertValueToNumber(blinkitSummary.impressions.last_original_val);
    blinkitClicks =
      blinkitSummary.unique_clicks.original_val === 0
        ? 0
        : convertValueToNumber(blinkitSummary.unique_clicks.original_val);
    blinkitLastClicks =
      blinkitSummary.unique_clicks.last_original_val === 0
        ? 0
        : convertValueToNumber(blinkitSummary.unique_clicks.last_original_val);
  }

  let [
    zeptoSpend,
    zeptoLastSpend,
    zeptoSales,
    zeptoLastSales,
    zeptoOrders,
    zeptoLastOrders,
    zeptoImpressions,
    zeptoLastImpressions,
    zeptoClicks,
    zeptoLastClicks,
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (allowedPlatforms && allowedPlatforms?.includes("zepto")) {
    zeptoSpend =
      zeptoSummary?.spend?.original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary?.spend?.original_val);
    zeptoLastSpend =
      zeptoSummary?.spend?.last_original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary?.spend?.last_original_val);
    zeptoSales =
      zeptoSummary?.revenues?.original_val == 0
        ? 0
        : convertValueToNumber(zeptoSummary?.revenues?.original_val);
    zeptoLastSales =
      zeptoSummary?.revenues?.last_original_val == 0
        ? 0
        : convertValueToNumber(zeptoSummary?.revenues?.last_original_val);
    zeptoOrders =
      zeptoSummary?.orders?.original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary?.orders?.original_val);
    zeptoLastOrders =
      zeptoSummary?.orders?.last_original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary?.orders?.last_original_val);
    zeptoImpressions =
      zeptoSummary.impressions.original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary.impressions.original_val);
    zeptoLastImpressions =
      zeptoSummary.impressions.last_original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary.impressions.last_original_val);
    zeptoClicks =
      zeptoSummary.clicks.original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary.clicks.original_val);
    zeptoLastClicks =
      zeptoSummary.clicks.last_original_val === 0
        ? 0
        : convertValueToNumber(zeptoSummary.clicks.last_original_val);
  }
  let [
    instamartSpend,
    instamartLastSpend,
    instamartSales,
    instamartLastSales,
    instamartImpressions,
    instamartLastImpressions,
  ] = [0, 0, 0, 0, 0, 0];
  if (allowedPlatforms && allowedPlatforms?.includes("instamart")) {
    instamartSpend =
      instamartSummary?.spend?.original_val == 0
        ? 0
        : convertValueToNumber(instamartSummary?.spend?.original_val);
    instamartLastSpend =
      instamartSummary?.spend?.last_original_val == 0
        ? 0
        : convertValueToNumber(instamartSummary?.spend?.last_original_val);
    instamartSales =
      instamartSummary?.gmv?.original_val == 0
        ? 0
        : convertValueToNumber(instamartSummary?.gmv?.original_val);
    instamartLastSales =
      instamartSummary?.gmv?.last_original_val == 0
        ? 0
        : convertValueToNumber(instamartSummary?.gmv?.last_original_val);
    instamartImpressions =
      instamartSummary.impressions.original_val == 0
        ? 0
        : convertValueToNumber(instamartSummary.impressions.original_val);
    instamartLastImpressions =
      instamartSummary.impressions.last_original_val == 0
        ? 0
        : convertValueToNumber(instamartSummary.impressions.last_original_val);
  }
  // const amazonCPC = parseFloat(amazonSummary.cpc.value.replace(currency, "").trim());
  // const flipkartCPC =
  //   flipkartSummary.cpc.value === 0
  //     ? parseFloat(flipkartSummary.cpc.value)
  //     : parseFloat(flipkartSummary.cpc.value.replace(currency, "").trim());
  // const blinkitCPC =
  //   blinkitSummary.cpc.value === 0 ? 0 : parseFloat(blinkitSummary.cpc.value);

  // const amazonCTR = parseFloat(
  //   amazonSummary.ctr.value.replace(" %", "").trim()
  // );
  // const flipkartCTR =
  //   flipkartSummary.ctr.value === 0
  //     ? parseFloat(flipkartSummary.ctr.value)
  //     : parseFloat(flipkartSummary.ctr.value.replace(" %", "").trim());
  // const blinkitCTR =
  //   blinkitSummary.ctr.value === 0 ? 0 : parseFloat(blinkitSummary.ctr.value);

  // const amazonAOV = parseFloat(amazonSummary.aov.value.replace(currency, "").trim());
  // const flipkartAOV =
  //   flipkartSummary.aov.value === 0
  //     ? parseFloat(flipkartSummary.ctr.value)
  //     : parseFloat(flipkartSummary.aov.value.replace(currency, "").trim());
  // const blinkitAOV =
  //   blinkitSummary.aov.value === 0 ? 0 : parseFloat(blinkitSummary.aov.value);

  // Check for NaN
  function calculate(newVal, oldVal) {
    // let newValdiv = newVal;
    if (isNaN(newVal) || newVal == null || newVal == 0) {
      // newValdiv = 1;
      newVal = 0;
    }
    let diff = newVal - oldVal;
    return (diff / oldVal) * 100;
  }
  const totalSpend =
    amazonSpend + flipkartSpend + blinkitSpend + zeptoSpend + instamartSpend;
  const totalLastSpend =
    amazonLastSpend +
    flipkartLastSpend +
    blinkitLastSpend +
    zeptoLastSpend +
    instamartLastSpend;
  const percSpend = Math.ceil(calculate(totalSpend, totalLastSpend));
  const totalSales =
    amazonSales + flipkartRevenue + blinkitSales + zeptoSales + instamartSales;
  const totalLastSales =
    amazonLastSales +
    flipkartLastRevenue +
    blinkitLastSales +
    zeptoLastSales +
    instamartLastSales;
  const percSales = Math.ceil(calculate(totalSales, totalLastSales));
  const totalOrders =
    amazonOrders + flipkartOrders + blinkitOrders + zeptoOrders;
  const totalLastOrders =
    amazonLastOrders + flipkartLastOrders + blinkitLastOrders + zeptoLastOrders;
  const percOrders = Math.ceil(calculate(totalOrders, totalLastOrders));
  const totalROAS = totalSpend == 0 ? 0 : (totalSales / totalSpend).toFixed(1);
  const totalLastROAS =
    totalLastSpend == 0 ? 0 : (totalLastSales / totalLastSpend).toFixed(1);
  const percROAS = Math.ceil(calculate(totalROAS, totalLastROAS));
  const totalImpressions =
    amazonImpressions +
    flipkartViews +
    blinkitImpressions +
    zeptoImpressions +
    instamartImpressions;
  const totalLastImpressions =
    amazonLastImpressions +
    flipkartLastViews +
    blinkitLastImpressions +
    zeptoLastImpressions +
    instamartLastImpressions;
  const percImpressions = Math.ceil(
    calculate(totalImpressions, totalLastImpressions)
  );
  const totalClicks =
    amazonClicks + flipkartClicks + blinkitClicks + zeptoClicks;
  const totalLastClicks =
    amazonLastClicks + flipkartLastClicks + blinkitLastClicks + zeptoLastClicks;
  const percClicks = Math.ceil(calculate(totalClicks, totalLastClicks));
  const totalCTR =
    totalImpressions == 0
      ? 0
      : ((totalClicks / totalImpressions) * 100).toFixed(1);
  const totalLastCTR =
    totalLastImpressions == 0
      ? 0
      : ((totalLastClicks / totalLastImpressions) * 100).toFixed(1);
  const percCTR = Math.ceil(calculate(totalCTR, totalLastCTR));
  const totalCPC = totalClicks == 0 ? 0 : (totalSpend / totalClicks).toFixed(1);
  const totalLastCPC =
    totalLastClicks == 0 ? 0 : (totalLastSpend / totalLastClicks).toFixed(1);
  const percCPC = Math.ceil(calculate(totalCPC, totalLastCPC));
  const totalAOV = totalOrders == 0 ? 0 : (totalSales / totalOrders).toFixed(1);
  const totalLastAOV =
    totalLastOrders == 0 ? 0 : (totalLastSales / totalLastOrders).toFixed(1);
  const percAOV = Math.ceil(calculate(totalAOV, totalLastAOV));
  // console.error(totalSales,totalOrders,totalSales/totalOrders,"afsdfhdf")
  //     const amazonUnitsSold = parseFloat(amazonSummary.units_sold.value);
  //   const flipkartOrders = parseFloat(flipkartSummary.orders.value);

  // Check for NaN (e.g., if the value can't be converted to a number)
  //   const total = !isNaN(amazonUnitsSold) && !isNaN(flipkartOrders)
  //     ? amazonUnitsSold + flipkartOrders
  //     : 0;

  const gcolors = ["#3FA2FD", "#A887F8", "#62EA98", "#FFC0CB"];
  const findGraphIndex = (item1) => {
    const index = filterName.indexOf(item1);
    if (index >= 0) {
      return gcolors[index];
    } else return "";
  };

  return (
    <>
      {CommonScreenTablefooterdata?.map((item, i) => (
        <tr key={i} className="">
          <td className=" ">
            <div className="flex justify-center">
              <label className="font-bold text-black px-2 text-[20px] ">
                Total
              </label>
            </div>
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_spend");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_spend"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {totalSpend >= 1000000
                    ? `${currency}${(totalSpend / 1000000).toFixed(1)}M`
                    : `${currency}${(totalSpend / 1000).toFixed(1)}k`}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {totalLastSpend >= 1000000
                          ? `${currency}${(totalLastSpend / 1000000).toFixed(
                              1
                            )}M`
                          : `${currency}${(totalLastSpend / 1000).toFixed(1)}k`}
                      </div>
                      <div className="flex gap-1">
                        {percSpend >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percSpend
                          ? percSpend >= 0
                            ? percSpend + "%"
                            : -percSpend + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>

          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_sales");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_sales"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {totalSales >= 1000000
                    ? `${currency}${(totalSales / 1000000).toFixed(1)}M`
                    : `${currency}${(totalSales / 1000).toFixed(1)}k`}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {totalLastSales >= 1000000
                          ? `${currency}${(totalLastSales / 1000000).toFixed(
                              1
                            )}M`
                          : `${currency}${(totalLastSales / 1000).toFixed(1)}k`}
                      </div>
                      <div className="flex gap-1">
                        {percSales >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percSales
                          ? percSales >= 0
                            ? percSales + "%"
                            : -percSales + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_orders");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_orders"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {totalOrders >= 1000000
                    ? `${(totalOrders / 1000000).toFixed(1)}M`
                    : `${(totalOrders / 1000).toFixed(1)}k`}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {totalLastOrders >= 1000000
                          ? `${currency}${(totalLastOrders / 1000000).toFixed(
                              1
                            )}M`
                          : `${currency}${(totalLastOrders / 1000).toFixed(
                              1
                            )}k`}
                      </div>
                      <div className="flex gap-1">
                        {percOrders >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percOrders
                          ? percOrders >= 0
                            ? percOrders + "%"
                            : -percOrders + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_roas");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_roas"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{totalROAS}</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{totalLastROAS}</div>
                      <div className="flex gap-1">
                        {percROAS >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percROAS
                          ? percROAS >= 0
                            ? percROAS + "%"
                            : -percROAS + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_impressions");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_impressions"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {totalImpressions >= 1000000
                    ? `${(totalImpressions / 1000000).toFixed(1)}M`
                    : `${(totalImpressions / 1000).toFixed(1)}k`}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {totalLastImpressions >= 1000000
                          ? `${(totalLastImpressions / 1000000).toFixed(1)}M`
                          : `${(totalLastImpressions / 1000).toFixed(1)}k`}
                      </div>
                      <div className="flex gap-1">
                        {percImpressions >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percImpressions
                          ? percImpressions >= 0
                            ? percImpressions + "%"
                            : -percImpressions + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_clicks");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_clicks"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {totalClicks >= 1000000
                    ? `${(totalClicks / 1000000).toFixed(1)}M`
                    : `${(totalClicks / 1000).toFixed(1)}k`}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {totalLastClicks >= 1000000
                          ? `${(totalLastClicks / 1000000).toFixed(1)}M`
                          : `${(totalLastClicks / 1000).toFixed(1)}k`}
                      </div>
                      <div className="flex gap-1">
                        {percClicks >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percClicks
                          ? percClicks >= 0
                            ? percClicks + "%"
                            : -percClicks + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_ctr");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_ctr"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>{totalCTR}%</div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">{totalLastCTR}%</div>
                      <div className="flex gap-1">
                        {percCTR >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percCTR
                          ? percCTR >= 0
                            ? percCTR + "%"
                            : -percCTR + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_cpc");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_cpc"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {totalCPC}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {totalLastCPC}
                      </div>
                      <div className="flex gap-1">
                        {percCPC >= 0 ? (
                          // <div className="px-0.5 py-1.5">
                          <img src="/assets/images/up_red.svg" alt="" />
                        ) : (
                          // </div>
                          <img src="/assets/images/down_green.svg" alt="" />
                        )}
                        {percCPC
                          ? percCPC >= 0
                            ? percCPC + "%"
                            : -percCPC + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <SkeletonPlatformCard />
            )}
          </td>
          <td
            className="p-0.5"
            onClick={() => {
              onClick("total_aov");
            }}
          >
            {!loadingSummary ? (
              <div
                className={["commonscreen__card font-semibold text-lg "].join(
                  " "
                )}
                style={{
                  borderColor: findGraphIndex("total_aov"),
                  boxShadow: "1px 12px 22px -3px rgb(158 163 167 / 30%)",
                }}
              >
                <div>
                  {currency}
                  {totalAOV}
                </div>
                {!noComparison && (
                  <div className="flex justify-between">
                    <div className="row text-xs font-normal justify-between">
                      <div className="">
                        {currency}
                        {totalLastAOV}
                      </div>
                      <div className="flex gap-1">
                        {percAOV >= 0 ? (
                          <div className="px-0.5 py-1.5">
                            <img src="/assets/images/up.svg" alt="" />
                          </div>
                        ) : (
                          <img src="/assets/images/down.svg" alt="" />
                        )}
                        {percAOV
                          ? percAOV >= 0
                            ? percAOV + "%"
                            : -percAOV + "%"
                          : "0%"}
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="row">
                <div>
                  <div className="row text-xs font-normal ">
                    ${currency}{item.rise}
                    {item.rise >= 0 ? (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/up.svg" alt="" />
                      </div>
                    ) : (
                      <div className="px-0.5 py-1.5">
                        <img src="/assets/images/down.svg" alt="" />
                      </div>
                    )}
                    <div>{item.percentage}</div>
                  </div>
                </div>
              </div> */}
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

export default TableFooterCommonScreen;
