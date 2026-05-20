import React from "react";
import NewCampSteps from "./NewCampSteps";
import StepCampaignDetails from "./StepCampaignDetails";
import StepCampaignFormat from "./StepCampaignFormat";
import StepTargetingOptions from "./StepTargetingOptions";
import StepCampaignBudget from "./StepCampaignBudget";
import TargetBtn from "./targetoption/button/TargetBtn";
import { APPLICATION_ROUTES } from "../../../../../utils/constants";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  editBlinkitCampaignAction,
  getBlinkitCampaignDetails,
} from "../../../../../redux/action-creator/campaignAction";

const NewCampaign = ({ heading }) => {
  const [campaignEditData, setCampaignEditData] = React.useState({
    campaign_type: "",
    start_duration: new Date().toISOString().slice(0, -14),
    no_end_date: "1",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCampaignEditData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  // const saveDraft = () => {
  //   setCampaignEditData({
  //     ...campaignData,
  //     draft: "2",
  //   });
  // };
  const history = useHistory();
  const dispatch = useDispatch();
  const createCampaign = () => {
    dispatch(
      editBlinkitCampaignAction(campaignEditData, blinkitcampaignDetails)
    );
    history.push(APPLICATION_ROUTES.BLINKITCAMPAING);
  };

  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData", campaignEditData);
  // }, [campaignEditData]);
  const location = useLocation();

  const campaignId = location?.state;
  React.useEffect(() => {
    if (campaignId) {
      dispatch(getBlinkitCampaignDetails(campaignId));
    }
  }, []);
  const { blinkitcampaignDetails } = useSelector(
    (state) => state?.CampaignReducer
  );
  React.useEffect(() => {
    if (blinkitcampaignDetails) {
      if (campaignId) {
        setCampaignEditData({
          ...blinkitcampaignDetails,
        });
      }
    }
  }, [blinkitcampaignDetails]);

  return (
    <>
      <div className="">
        <div className="font-bold text-lg pb-4">{heading}</div>
        <NewCampSteps stepno={1} stepname="Campaign Format">
          <StepCampaignFormat
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={2} stepname="Campaign Details">
          <StepCampaignDetails
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={3} stepname="Targeting Options">
          <StepTargetingOptions
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={4} stepname="Campaign Budget">
          <StepCampaignBudget
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
      </div>
      <div className="row justify-center ">
        {/* <TargetBtn title="Save as draft" onClick={saveDraft} /> */}
        <TargetBtn
          title="Update Campaign"
          btn="create"
          // disabled={active != 5}
          onClick={createCampaign}
        />
      </div>
    </>
  );
};

export default NewCampaign;
