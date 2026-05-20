import React from "react";

const TargetingOptions = ({
  title,
  targetoption,
  value,
  // setValue,
  setCampaignData,
  campaignData,
  setTitleOption,
  description,
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
        <div className="row">
          <div className="flex items-center">
            <input
              className="accent-green-700 mr-1"
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
            <div className="flex gap-2">
              <label className="text-md font-semibold">{title}</label>
              <div className="keywordtargeting__field !text-xs text-start ">
                {targetoption}
              </div>
            </div>
          </div>
        </div>
        <div className="row text-xs px-4 py-1">
          {description ? description : ""}
        </div>
      </div>
    </>
  );
};
export default TargetingOptions;
