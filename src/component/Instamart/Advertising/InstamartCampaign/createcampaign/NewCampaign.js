import React, { useState } from "react";
import NewCampSteps from "./NewCampSteps";
import StepCampaignDetails from "./StepCampaignDetails";
// import StepCampaignFormat from "./StepCampaignFormat";
import StepTargetingOptions from "./StepTargetingOptions";
import StepCampaignBudget from "./StepCampaignBudget";
import TargetBtn from "./targetoption/button/TargetBtn";
// import { APPLICATION_ROUTES } from "../../../../../utils/constants";
// import { createBlinkitCampaign } from "../../../../../redux/action-creator/blinkit/createCampaignAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import StepCampaignName from "./StepCampaignName";
import StepScheduleOptions from "./StepScheduleOptions";
import { APPLICATION_ROUTES } from "../../../../../utils/constants";
import { createInstamartCampaign } from "../../../../../redux/action-creator/instamart/createCampaignAction";

const NewCampaign = ({ heading }) => {
  const [active, setActive] = useState(1);
  const [campaignData, setCampaignData] = React.useState({
    active: active,
    start_duration: new Date().toISOString().slice(0, -14),
    account_id: localStorage.getItem("instamartCampaignManagerSelectedAccount"),
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCampaignData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  // const saveDraft = () => {
  //   setCampaignData({
  //     ...campaignData,
  //     draft: "1",
  //   });
  // };
  const history = useHistory();
  const dispatch = useDispatch();
  const createCampaign = () => {
    dispatch(createInstamartCampaign(campaignData));
    history.push(APPLICATION_ROUTES.INSTAMARTCAMPAIGNMANAGER);
  };
  // React.useEffect(() => {
  //   if (campaignData.draft == "1") {
  //     dispatch(createBlinkitCampaign(campaignData));
  //     history.push(APPLICATION_ROUTES.BLINKITCAMPAING);
  //   }
  // }, [campaignData.draft]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData>>>", campaignData);
  // }, [campaignData]);

  return (
    <>
      <div className="">
        <div className="font-bold text-lg pb-4">{heading}</div>

        <NewCampSteps stepno={1} stepname="Placement" active={active}>
          <StepCampaignName
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={2} stepname="Ad Preferences" active={active}>
          <StepScheduleOptions
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={3} stepname="Search Products" active={active}>
          <StepCampaignDetails
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={4} stepname="Choose Keywords" active={active}>
          <StepTargetingOptions
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={5} stepname="Budget" active={active}>
          <StepCampaignBudget
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </NewCampSteps>
      </div>
      <div className="row justify-center ">
        {/* <TargetBtn title="Save as draft" onClick={saveDraft} /> */}
        <TargetBtn
          title="Create Campaign"
          btn="create"
          disabled={active != 6}
          onClick={createCampaign}
        />
      </div>
    </>
  );
};

export default NewCampaign;
