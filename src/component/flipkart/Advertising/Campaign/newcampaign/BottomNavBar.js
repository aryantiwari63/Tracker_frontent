import { useDispatch, useSelector } from "react-redux";
import MultipleButton from "./MultipleButton";
import { createCampaign } from "../../../../../redux/action-creator/campaignAction";
import {
  ALL_BUTTON_FLAGS,
  APPLICATION_ROUTES,
} from "../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import React from "react";
import ActionType from "../../../../../redux/types";

const BottomNavBar = ({
  step,
  setStep,
  campaignData,
  setError,
  error,
  setCampaignData,
}) => {
  // const sidebarState = useSelector((state) => state.sidebar.value);
  const sideBarState = useSelector((state) => state.SideBarReducer.expandState);
  const { loading } = useSelector((state) => state.CommonReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const discardCampaign = () => {
    history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
    dispatch({
      type: ActionType.GETPRODUCTS,
      payload: [],
    });
    dispatch({
      type: ActionType.GETCATEGORIES,
      payload: [],
    });
  };
  const saveDraft = () => {
    setCampaignData({
      ...campaignData,
      draft: "1",
    });
    dispatch({
      type: ActionType.GETPRODUCTS,
      payload: [],
    });
    dispatch({
      type: ActionType.GETCATEGORIES,
      payload: [],
    });
    // dispatch(createCampaign(campaignData));
    // history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
  };
  React.useEffect(() => {
    if (campaignData.draft == "1") {
      dispatch(createCampaign(campaignData));
      history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
    }
  }, [campaignData.draft]);
  return (
    <>
      <div
        className={[
          "bottomnavbar",
          sideBarState && "bottomnavbar--collapse",
        ].join(" ")}
      >
        <div>
          {step > 1 && (
            <button
              type="button"
              className="multibtn  "
              onClick={() => {
                // console.log(step, "step");
                setStep(step - 1);
              }}
            >
              Back
            </button>
          )}
        </div>
        <div className="ml-auto mr-0">
          {step > 1 && (
            <MultipleButton name="Save As Draft" onClick={saveDraft} />
          )}
          <MultipleButton name="Discard Campign" onClick={discardCampaign} />

          {/* <MultipleButton name="Continue" className="bg-blue-400"/> */}
          {step === 3 ? (
            <button
              type="submit"
              className="multibtn"
              onClick={() => {
                dispatch(createCampaign(campaignData));
                history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
                dispatch({
                  type: ActionType.GETPRODUCTS,
                  payload: [],
                });
                dispatch({
                  type: ActionType.GETCATEGORIES,
                  payload: [],
                });
              }}
            >
              {loading &&
              loading.buttonFlag == ALL_BUTTON_FLAGS.CREATECAMPAIGN &&
              loading.state
                ? "loading"
                : "Submit"}
            </button>
          ) : (
            <button
              type="submit"
              className="multibtn__contbtn "
              onClick={() => {
                if (step === 1) {
                  if (!campaignData.campaign_name) {
                    // setError("Campaign name cannot be empty");
                    setError({
                      ...error,
                      campaignName: "Campaign name cannot be empty",
                    });
                  } else if (
                    campaignData?.subbrand == "" &&
                    localStorage.getItem("client_name") == "Bajaj"
                  ) {
                    // setError("Category cannot be empty");
                    setError({
                      ...error,
                      subbrand: "Please select a Brand",
                    });
                  } else if (!campaignData?.category) {
                    // setError("Category cannot be empty");
                    setError({
                      ...error,
                      category: "Category cannot be empty",
                    });
                  } else if (!campaignData?.products) {
                    // setError("Category cannot be empty");
                    setError({
                      ...error,
                      products: "Product cannot be empty",
                    });
                  } else {
                    setStep(step + 1);
                  }
                }
                if (step === 2) {
                  if (!campaignData?.start_duration) {
                    // setError("Campaign Budget cannot be empty");
                    setError({
                      ...error,
                      startDate: "Duration cannot be empty",
                    });
                  } else if (
                    !campaignData?.end_duration &&
                    campaignData.is_till_end_duration != "1"
                  ) {
                    setError({
                      ...error,
                      endDate: "Duration cannot be empty",
                    });
                  } else if (!campaignData?.campaign_budget) {
                    // setError("Campaign Budget cannot be empty");
                    setError({
                      ...error,
                      campaignBudget: "Campaign Budget cannot be empty",
                    });
                  } else if (campaignData?.campaign_budget < 1000) {
                    // setError("Campaign Budget minimum amount 1000");
                    setError({
                      ...error,
                      campaignBudget: "Campaign Budget minimum amount 1000",
                    });
                  } else {
                    setStep(step + 1);
                  }
                }
              }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomNavBar;
