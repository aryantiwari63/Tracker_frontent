import React from "react";

const CampaignBudgetTargetblock = ({
  title,
  subtitle,
  placeholder,
  value,
  name,
  typeBudget,
  setTypeBudget,
  setCampaignData,
  campaignData,
  // error,
}) => {
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     Budget: "",
  //   });
  // }, [campaignData.BudgetType]);
  return (
    <>
      <div
        className={[
          "campaignbudgettarget",
          typeBudget === value && "campaignbudgettarget--active",
        ].join(" ")}
      >
        <div className="px-3 flex justify-between items-center">
          <div className="flex gap-2">
            <input
              type="radio"
              className="accent-green-600"
              name={name}
              value={value}
              id={title}
              checked={campaignData?.BudgetType === value}
              onClick={(e) => {
                setTypeBudget(e.target.value);
                setCampaignData({
                  ...campaignData,
                  BudgetType: e.target.value,
                });
              }}
            />
            <label htmlFor={title}>
              <div className="font-semibold">{title}</div>
              <div className="text-[10px]">{subtitle}</div>
            </label>
          </div>
          <div className="campaignbudgettarget__bid w-[40%]">
            <div className="relative w-[90%]">
              <span className="absolute left-1 top-0.5">₹</span>

              <input
                type="number"
                placeholder={placeholder}
                className="text-[10px] pl-4 pr-2 w-full rounded py-1 outline-none bg-gray-200"
                value={campaignData?.Budget}
                onChange={(e) => {
                  setCampaignData({
                    ...campaignData,
                    Budget: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        {/* {error.BudgetType && <p className="errorText">{error.BudgetType}</p>}
        {error.Budget && <p className="errorText">{error.Budget}</p>} */}
      </div>
    </>
  );
};

export default CampaignBudgetTargetblock;
