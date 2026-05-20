import React, { useState } from "react";
import NewCampSteps from "./NewCampSteps";
import StepCampaignDetails from "./StepCampaignDetails";
import StepCampaignFormat from "./StepCampaignFormat";
import StepTargetingOptions from "./StepTargetingOptions";
import StepTargetingKeywordOptionsBrandSuggestion from "./StepTargetingKeywordOptionsBrandSuggestion";
import StepCampaignBudget from "./StepCampaignBudget";
import TargetBtn from "./targetoption/button/TargetBtn";
import {
  ALL_BUTTON_FLAGS,
  APPLICATION_ROUTES,
} from "../../../../../utils/constants";
import { createBlinkitCampaign } from "../../../../../redux/action-creator/blinkit/createCampaignAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./styles.css";
import StepAdSettings from "./StepAdSettings";
import StepthreeSpotlight from "./StepthreeSpotlight";
import Toast from "../../../../common-components/toast";
import StepfourSpotlight from "./StepfourSpotlight";
import StepTargetingOptionsRecommendation from "./StepTargetingOptionsRecommendation";
import StepTargetingOptionsBrandSuggestion from "./StepTargetingOptionsBrandSuggestion";

const NewCampaign = ({ heading }) => {
  const [active, setActive] = useState(1);
  const [campaignData, setCampaignData] = React.useState({
    campaign_type: "",
    active: active,
    start_duration: new Date().toISOString().slice(0, -14),
    no_end_date: "1",
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

  const history = useHistory();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.CommonReducer);

  const createCampaign = () => {
    dispatch(
      createBlinkitCampaign(campaignData, () => {
        history.push(APPLICATION_ROUTES.BLINKITCAMPAING);
      })
    );
  };

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("debugerrr campaignData", campaignData);
  }, [campaignData]);

  return (
    <>
      <Toast></Toast>
      <div className="">
        <div className="font-bold text-lg pb-4">{heading}</div>
        <NewCampSteps stepno={1} stepname="Ad Format" active={active}>
          <StepCampaignFormat
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </NewCampSteps>
        {campaignData?.campaign_type == "Product Booster" && active > 1 && (
          <>
            <NewCampSteps stepno={2} stepname="Ad Settings" active={active}>
              <StepAdSettings
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps stepno={3} stepname="Product details" active={active}>
              <StepCampaignDetails
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps
              stepno={4}
              stepname="Targeting Options"
              active={active}
            >
              <StepTargetingOptions
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps stepno={5} stepname="Budget Details" active={active}>
              <StepCampaignBudget
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
          </>
        )}
        {campaignData?.campaign_type == "Listing Spotlight" && active > 1 && (
          <>
            <NewCampSteps stepno={2} stepname="Ad Settings" active={active}>
              <StepAdSettings
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps stepno={3} stepname="Product details" active={active}>
              <StepthreeSpotlight
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps
              stepno={4}
              stepname="Targeting Options"
              active={active}
            >
              <StepfourSpotlight
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps stepno={5} stepname="Budget Details" active={active}>
              <StepCampaignBudget
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
          </>
        )}
        {campaignData?.campaign_type == "Recommendation Ads" && active > 1 && (
          <>
            <NewCampSteps stepno={2} stepname="Ad Settings" active={active}>
              <StepAdSettings
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>

            <NewCampSteps stepno={3} stepname="Product details" active={active}>
              <StepCampaignDetails
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>

            <NewCampSteps
              stepno={4}
              stepname="Targeting Options"
              active={active}
            >
              <StepTargetingOptionsRecommendation
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps stepno={5} stepname="Budget Details" active={active}>
              <StepCampaignBudget
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
          </>
        )}
        {campaignData?.campaign_type == "Brand Booster" && active > 1 && (
          <>
            <NewCampSteps stepno={2} stepname="Ad Settings" active={active}>
              <StepAdSettings
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>

            <NewCampSteps stepno={3} stepname="Brand details" active={active}>
              <StepTargetingOptionsBrandSuggestion
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>

            <NewCampSteps
              stepno={4}
              stepname="Targeting Options"
              active={active}
            >
              <StepTargetingKeywordOptionsBrandSuggestion
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
            <NewCampSteps stepno={5} stepname="Budget Details" active={active}>
              <StepCampaignBudget
                active={active}
                setActive={setActive}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </NewCampSteps>
          </>
        )}
      </div>
      <div className="row justify-center ">
        <TargetBtn
          title="Create Campaign"
          btn="create"
          disabled={
            active != 6 ||
            (loading &&
              loading.buttonFlag == ALL_BUTTON_FLAGS.BLINKITCREATECAMPAIGN &&
              loading.state)
          }
          onClick={createCampaign}
        />
      </div>
    </>
  );
};

export default NewCampaign;
