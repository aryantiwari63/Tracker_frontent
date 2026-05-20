import React from "react";

const CampaignBudgetTargetblock = ({
  title,
  subtitle,
  placeholder,
  value,
  name,
  typeBudget,
  // setTypeBudget,
  setCampaignData,
  campaignData,
  // error,
}) => {
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      Budget: "",
    });
  }, [campaignData.BudgetType]);
  return (
    <>
      <div
        className={[
          "campaignbudgettarget",
          typeBudget === value && "campaignbudgettarget--active",
        ].join(" ")}
      >
        <div className="row px-3 items-center ">
          <div className="row">
            <div>
              <label htmlFor={name}>
                {/* <input
                type="radio"
                name={name}
                value={value}
                onClick={(e) => {
                  setTypeBudget(e.target.value);
                  setCampaignData({
                    ...campaignData,
                    BudgetType: e.target.value,
                  });
                }}
              /> */}

                {title}
              </label>
              <div className="text-[10px]">{subtitle}</div>
            </div>
            <div>
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
        </div>
        {/* {error.BudgetType && <p className="errorText">{error.BudgetType}</p>}
        {error.Budget && <p className="errorText">{error.Budget}</p>} */}
      </div>
    </>
  );
};

export default CampaignBudgetTargetblock;
