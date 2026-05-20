import React from "react";
import NewCampSteps from "./NewCampSteps";
// import StepCampaignDetails from "./StepCampaignDetails";
// import StepCampaignFormat from "./StepCampaignFormat";
import StepTargetingOptions from "./StepTargetingOptions";
import StepCampaignBudget from "./StepCampaignBudget";
import TargetBtn from "./targetoption/button/TargetBtn";
import { APPLICATION_ROUTES } from "../../../../../utils/constants";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  editInstamartCampaignAction,
  getInstamartCampaignDetails,
} from "../../../../../redux/action-creator/campaignAction";
import StepCampaignName from "./StepCampaignName";
import StepScheduleOptions from "./StepScheduleOptions";
import StepCampaignDetails from "./StepCampaignDetails";

const NewCampaign = ({ heading }) => {
  const [campaignEditData, setCampaignEditData] = React.useState({
    account_id: localStorage.getItem("instamartCampaignManagerSelectedAccount"),
    active: 1,
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
  //     draft: "1",
  //   });
  // };
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = React.useState("");

  const createCampaign = () => {
    if (!campaignEditData?.campaign_name) {
      setError("Please enter a campaign name");
    } else if (!campaignEditData?.end_duration) {
      setError("Please enter a end duration");
    } else if (!campaignEditData?.Budget) {
      setError("Please enter a budget");
    } else if (
      Number(campaignEditData?.Budget) <
      Number(instamartcampaignDetails?.Budget)
    ) {
      setError("Budget cannot be less than original budget");
    } else if (!campaignEditData?.days?.length) {
      setError("Please select a days");
    } else if (!campaignEditData?.timeslots?.length) {
      setError("Please select a timeslots");
    } else if (!campaignEditData?.products?.length) {
      setError("Please select a products");
    } else if (!campaignEditData?.keywords?.length) {
      setError("Please enter a keywords");
    } else if (
      campaignEditData?.keywords?.length &&
      campaignEditData?.keywords
        .map((data) => Object.prototype.hasOwnProperty.call(data, "cpm"))
        .includes(false)
    ) {
      setError("Please enter a cpm values of selected keywords");
    } else {
      dispatch(
        editInstamartCampaignAction(campaignEditData, instamartcampaignDetails)
      );
      history.push(APPLICATION_ROUTES.INSTAMARTCAMPAIGNMANAGER);
    }
  };

  React.useEffect(() => {
    setError("");
    // eslint-disable-next-line no-console
    // console.log("debugerrr campaignData", campaignEditData);
  }, [campaignEditData]);
  const location = useLocation();

  const campaignId = location?.state;
  React.useEffect(() => {
    if (campaignId) {
      dispatch(
        getInstamartCampaignDetails(
          campaignId,
          localStorage.getItem("instamartCampaignManagerSelectedAccount")
        )
      );
    }
  }, []);
  const { instamartcampaignDetails } = useSelector(
    (state) => state?.CampaignReducer
  );
  React.useEffect(() => {
    if (instamartcampaignDetails) {
      if (campaignId) {
        setCampaignEditData({
          ...campaignEditData,
          ...instamartcampaignDetails,
        });
        // eslint-disable-next-line no-console
        // console.log(
        //   "debugerrr instamartcampaignDetails",
        //   instamartcampaignDetails
        // );
      }
    }
  }, [instamartcampaignDetails]);

  return (
    <>
      <div className="">
        <div className="font-bold text-lg pb-4">{heading}</div>
        <NewCampSteps stepno={1} stepname="Campaign Format">
          <StepCampaignName
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={2} stepname="Campaign Details">
          <StepScheduleOptions
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={3} stepname="Search Products">
          <StepCampaignDetails
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={4} stepname="Targeting Options">
          <StepTargetingOptions
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        <NewCampSteps stepno={5} stepname="Campaign Budget">
          <StepCampaignBudget
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
          />
        </NewCampSteps>
      </div>
      <div className="row justify-center ">
        {/* <TargetBtn title="Save as draft" onClick={saveDraft} /> */}
        <div>
          {error ? <p className="errorText">{error}</p> : null}

          <TargetBtn
            title="Update Campaign"
            btn="create"
            // disabled={active != 5}
            onClick={createCampaign}
          />
        </div>
      </div>
    </>
  );
};

export default NewCampaign;
