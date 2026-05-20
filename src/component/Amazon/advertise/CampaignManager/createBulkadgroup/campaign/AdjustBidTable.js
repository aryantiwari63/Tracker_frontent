import React from "react";

const AdjustBidTable = ({
  // setCampaignData,
  campaignData,
  handleChange,
  formIndex,
}) => {
  return (
    <>
      <div>
        <table className="adjustBId__table">
          <tbody>
            <tr className="">
              <td className="px-2 py-4">Top of search(first page)</td>
              <td className="px-2 py-4">
                <div className="border rounded-md px-2 py-1 bg-white percentageBox">
                  <input
                    type="number"
                    className="border rounded-lg bg-transparent outline-none border-none"
                    name="PLACEMENT_TOP"
                    id="PLACEMENT_TOP"
                    placeholder="Enter number"
                    onChange={(e) => handleChange(e, formIndex)}
                    value={
                      campaignData &&
                      campaignData?.find(({ index }) => index === formIndex)
                        ?.PLACEMENT_TOP
                    }
                  />
                  %
                </div>
              </td>
              <td className="px-2 py-4">
                Example:A 3.00 bid will return 3.00 for this placement dynamic
                biding increase it upto
                <br />
                6.00
              </td>
            </tr>
            <tr className="">
              <td className="px-2 py-4">Product pages</td>
              <td className="px-2 py-4">
                <div className="border rounded-md px-2 py-1 bg-white percentageBox">
                  <input
                    type="number"
                    className="border rounded-lg bg-transparent outline-none border-none"
                    name="PLACEMENT_PRODUCT_PAGE"
                    id="PLACEMENT_PRODUCT_PAGE"
                    placeholder="Enter number"
                    onChange={(e) => handleChange(e, formIndex)}
                    value={
                      campaignData &&
                      campaignData?.find(({ index }) => index === formIndex)
                        ?.PLACEMENT_PRODUCT_PAGE
                    }
                  />
                  %
                </div>
              </td>
              <td className="px-2 py-4">
                Example:A 3.00 bid will return 3.00 for this placement dynamic
                biding increase it upto
                <br />
                4.50
              </td>
            </tr>
            <tr className="">
              <td className="px-2 py-4">Rest of search(Beta)</td>
              <td className="px-2 py-4">
                <div className="border rounded-md px-2 py-1 bg-white percentageBox">
                  <input
                    type="number"
                    className="border rounded-lg bg-transparent outline-none border-none"
                    name="PLACEMENT_REST_OF_SEARCH"
                    id="PLACEMENT_REST_OF_SEARCH"
                    placeholder="Enter number"
                    onChange={(e) => handleChange(e, formIndex)}
                    value={
                      campaignData &&
                      campaignData?.find(({ index }) => index === formIndex)
                        ?.PLACEMENT_REST_OF_SEARCH
                    }
                  />
                  %
                </div>
              </td>
              <td className="px-2 py-4">
                Example: A ₹3.00 bid will remain ₹3.00 for this placement.
                Dynamic bidding could increase it upto
                <br />
                ₹4.50
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdjustBidTable;
