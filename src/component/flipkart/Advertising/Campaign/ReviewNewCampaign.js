import React, { useEffect } from "react";
import { trackCampaignCreationSteps } from "../../../../analytics/EventController";

const ReviewNewCampaign = ({ campaignData }) => {
  let currency = localStorage.getItem("currency");

  const productDetails = {
    header: [
      {
        name: "Ad Group",
      },
      {
        name: "CPC",
      },
      {
        name: "Budget Limit",
      },
    ],
    body: [
      {
        name: "Category 1",
      },
      {
        title: "8.62(Base Bid)",
        spanData: [
          {
            name: "Top of Search Page",
            price: `${currency}7.62 (0%)`,
          },
          {
            name: `Rest of Search Page`,
            price: `${currency}7.62 (0%)`,
          },
          {
            name: `Top of Browse Page`,
            price: `${currency}7.62 (0%)`,
          },
          {
            name: `Rest of Browse Page`,
            price: `${currency}7.62 (0%)`,
          },
        ],
      },
      {
        name: "Campaign budget >",
      },
    ],
  };

  useEffect(() => {
    trackCampaignCreationSteps("Review"); // Tracking campaign creation steps
  });
  return (
    <>
      <div className="loginpage__card">
        <div className="row">
          <div className="col_7">
            <div className="row items-center text-xs pb-4 text-gray-500">
              <div>Campaign Basic Details</div>
              <div className="col reviewcapmtable--line"></div>
            </div>
            <div>
              <table className="w-full reviewcamptable ">
                <tbody>
                  {/* {tableData.map((val, index) => {
                    return (
                      <tr>
                        <td className="text-gray-500 text-sm pb-3">
                          {val.name}
                        </td>
                        <td className="">
                          {val.img ? <img src={val.img} /> : val.value}
                        </td>
                      </tr>
                    );
                  })} */}
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">Name</td>
                    <td className="">{campaignData?.campaign_name}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">Market Place</td>
                    <td className="">
                      {campaignData?.platform == "Flipkart" ? (
                        <img src="/assets/images/flipkart.png" />
                      ) : (
                        <img src="/assets/images/supermart-logo.png" />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">Cost Model</td>
                    <td className="">
                      {campaignData?.cost_model
                        ? campaignData?.cost_model
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">Duration</td>
                    <td className="">
                      {campaignData &&
                      campaignData?.start_duration &&
                      campaignData?.end_duration
                        ? "From " +
                          campaignData?.start_duration.split("T").join(" ") +
                          "-" +
                          "to " +
                          campaignData?.end_duration.split("T").join(" ")
                        : campaignData && campaignData?.start_duration
                        ? "From " +
                          campaignData?.start_duration.split("T").join(" ") +
                          "-" +
                          "Till budget ends"
                        : null}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">Budget Type</td>
                    <td className=""> {campaignData?.budget_limit}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">
                      Campaign Budget
                    </td>
                    <td className="">
                      {currency}
                      {campaignData?.campaign_budget}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">
                      Equally Divide Budget
                    </td>
                    <td className="">
                      {campaignData?.budget_limit == "Daily" ? "YES" : "NO"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">
                      Business Zone
                    </td>
                    <td className="">
                      {campaignData && campaignData?.businesszone
                        ? campaignData?.businesszone.join(",")
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">
                      Broad Keywords
                    </td>
                    <td className="">
                      {campaignData && campaignData.keywords_broad
                        ? campaignData.keywords_broad.join(",")
                        : "None"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 text-sm pb-3">
                      Exact Keywords
                    </td>
                    <td className="">
                      {campaignData && campaignData.keywords_exact
                        ? campaignData.keywords_exact.join(",")
                        : "None"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row items-center ">
              <div className="reviewcapmtable--producttable pb-2">
                Product Details
              </div>
              <div className="col reviewcapmtable--line"></div>
            </div>
            <div>
              <div className="reviewPayment__box">
                <div className="reviewPayment__table ">
                  <div className="reviewPayment__tableHeader row ">
                    {productDetails.header.map((v) => {
                      return (
                        <>
                          <div
                            className={[
                              "col_3 productdetails-heading",
                              v.name === "CPC" && "col",
                            ].join(" ")}
                          >
                            {v.name}
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <div className="reviewPayment__tableBody row items-center pt-3">
                    <div className="col_3 reviewPayment__category-name px-2">
                      Category {campaignData.category}
                    </div>
                    <div className="col reviewPayment__category-name px-2">
                      <div className="reviewPayment__tableBody-title">
                        <div className=" reviewPayment__subtit">
                          {campaignData.cost_per_basket}
                        </div>
                        <ul className="">
                          <li className="py-1">
                            Top of Search Page
                            <span className="font-bold pl-1">
                              {currency}
                              {campaignData.top_of_search_page} ({" "}
                              {campaignData.topSearchCount}%)
                            </span>
                          </li>
                          <li className="py-1">
                            Rest of Search Page
                            <span className="font-bold pl-1">
                              {currency}
                              {campaignData.rest_of_search_page} (
                              {campaignData.restSearchCount}%)
                            </span>
                          </li>
                          <li className="py-1">
                            Top of Browse Page
                            <span className="font-bold pl-1">
                              {currency}
                              {campaignData.top_of_browse_page} (
                              {campaignData.topBrowseCount}%)
                            </span>
                          </li>
                          <li className="py-1">
                            Rest of Browse Page
                            <span className="font-bold pl-1">
                              {currency}
                              {campaignData.rest_of_browse_page} (
                              {campaignData.restBrowseCount}%)
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col_3 reviewPayment__category-name px-2">
                      {campaignData.budget_limit}
                    </div>
                    {/* {productDetails.body.map((v, i) => {
                      return (
                        // <div className="col_4 reviewPayment__category-name px-2">
                        v.spanData ? (
                          <div className="col reviewPayment__category-name px-2">
                            <div className="reviewPayment__tableBody-title">
                              <div className=" reviewPayment__subtit">
                                {v.title}
                              </div>
                              <ul className="">
                                {v.spanData.map((v, i) => {
                                  return (
                                    <li className="py-1">
                                      {v.name}
                                      <span className="font-bold pl-1">
                                        {v.price}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="col_3 reviewPayment__category-name px-2">
                            {v.name} 
                          </div>
                        )
                      );
                    })} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col_5">
            <div className="reviewpayment__container ">
              <div className="reviewpayment__heading">Payment Breakdown</div>
              <div>
                <table className="reviewpayment__table ">
                  <tbody>
                    {/* {paymentBreakDownData.map((value, index) => {
                      return (
                        <tr>
                          <td className="reviewpayment__table-title">
                            {value.title}
                          </td>
                          <td className="reviewpayment__table-vlaue">
                            {value.value}
                          </td>
                        </tr>
                      );
                    })} */}
                    <tr>
                      <td className="reviewpayment__table-title">
                        New Campaign Budget
                      </td>
                      <td className="reviewpayment__table-vlaue">
                        {currency}
                        {campaignData.campaign_budget}
                      </td>
                    </tr>
                    <tr>
                      <td className="reviewpayment__table-title">
                        New Campaign Budget
                      </td>
                      <td className="reviewpayment__table-vlaue">
                        -{currency}
                        {campaignData.campaign_budget}
                      </td>
                    </tr>
                    <tr>
                      <td className="reviewpayment__table-title">
                        Net Payable Amount
                      </td>
                      <td className="reviewpayment__table-vlaue">
                        {(
                          Number(campaignData.campaign_budget) -
                          Number(campaignData.campaign_budget)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ReviewNewCampaign);
