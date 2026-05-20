import React from "react";

const TargetingOptions = ({
  title,
  targetoption,
  value,
  // setValue,
  setCampaignData,
  campaignData,
  setTitleOption,
}) => {
  const targetTitle = (checked, data) => {
    if (checked) {
      setTitleOption((prev) => [...prev, data]);
    } else {
      setTitleOption((prev) => prev.filter((item) => item !== data));
    }
  };
  return (
    <>
      <div className="border-b py-3 pt-2 ">
        <div className="row  ">
          <div className="col_2">
            <input
              className="mr-1"
              type="checkbox"
              value={title}
              checked={value}
              onClick={(e) => {
                // setValue(!value);
                setCampaignData({
                  ...campaignData,
                  targetingType: title,
                });
                targetTitle(e.target.checked, title);
              }}
            />
            <label className="text-xs">{title}</label>
          </div>
          <div className="keywordtargeting__field text-start ">
            {targetoption}
          </div>
        </div>
        <div className="row text-xs px-4 py-0.5">
          Select this for boosting your products on specific search keyword
          based targeting
        </div>
      </div>
    </>
  );
};
export default TargetingOptions;
