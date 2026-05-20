import React, { useState } from "react";
import businesszone from "../../../../data/flipkart/advertise/businesszone.json";
import SelectDropDrown from "../../../common-components/SelectDropDown";

const BusinessZoneSelection = ({ setCampaignData, campaignData }) => {
  const [selectedBussiness, setSelectedBussiness] = useState([]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      businesszone: selectedBussiness,
    });
  }, [selectedBussiness]);

  return (
    <>
      <div className="col_3 businesszone__heading">
        <h2>Choose Business Zone (Optional)</h2>
        <div className="">
          <SelectDropDrown
            //  FilterHeading={"Select Zone"}
            //  options={businesszone[0].header}
            setSelectedVal={setSelectedBussiness}
            selectedVal={selectedBussiness}
            name="businesszone"
            FilterHeading={"Select Zone"}
            options={businesszone[0].header}
            alignBottom={true}
          />
        </div>
      </div>
    </>
  );
};
export default BusinessZoneSelection;
