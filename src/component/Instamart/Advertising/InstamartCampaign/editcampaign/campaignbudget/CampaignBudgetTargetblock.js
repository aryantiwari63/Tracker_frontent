import React from "react";

const CampaignBudgetTargetblock = ({
  // title,
  // subtitle,
  placeholder,
  // value,
  // name,
  // typeBudget,
  // setTypeBudget,
  setCampaignData,
  campaignData,
}) => {
  const handleIncludePage = (check) => {
    if (check) {
      setCampaignData({
        ...campaignData,
        include_ad_page: "1",
        do_not_include_ad_page: "0",
      });
    } else {
      setCampaignData({
        ...campaignData,
        include_ad_page: "0",
        do_not_include_ad_page: "1",
      });
    }
  };
  const handleDontIncludePage = (check) => {
    if (check) {
      setCampaignData({
        ...campaignData,
        include_ad_page: "0",
        do_not_include_ad_page: "1",
      });
    } else {
      setCampaignData({
        ...campaignData,
        include_ad_page: "1",
        do_not_include_ad_page: "0",
      });
    }
  };
  return (
    <>
      <div
      // className={[
      //   "campaignbudgettarget",
      //   typeBudget === value && "campaignbudgettarget--active",
      // ].join(" ")}
      >
        <div className="row px-3 items-center ">
          <div className="col">
            <label htmlFor="Include Ad Pace">
              <input
                type="checkbox"
                name="include_ad_page"
                checked={campaignData.include_ad_page == "1"}
                onChange={(e) => {
                  handleIncludePage(e.target.checked);
                }}
                disabled
              />
              Include Ad Pace
            </label>
            {/* <div className="text-[10px]">{subtitle}</div> */}
          </div>
          <div className="col">
            <label htmlFor="Do not include Ad Pace">
              <input
                type="checkbox"
                name="do_not_include_ad_page"
                checked={campaignData.do_not_include_ad_page == "1"}
                onChange={(e) => {
                  handleDontIncludePage(e.target.checked);
                }}
                disabled
              />
              Do not Include Ad Pace
            </label>
            {/* <div className="text-[10px]">{subtitle}</div> */}
          </div>
        </div>
        <div className="row  py-7">
          <div className="text-[15px]">Campaign Budget</div>
          &nbsp;
          <input
            type="number"
            placeholder={placeholder}
            value={campaignData?.Budget}
            className="text-[10px] px-2 rounded py-1 outline-none bg-gray-200"
            onChange={(e) => {
              setCampaignData({
                ...campaignData,
                Budget: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CampaignBudgetTargetblock;
