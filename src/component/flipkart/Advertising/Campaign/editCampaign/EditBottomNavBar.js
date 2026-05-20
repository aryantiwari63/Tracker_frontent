import { useDispatch, useSelector } from "react-redux";

import {
  ALL_BUTTON_FLAGS,
  APPLICATION_ROUTES,
} from "../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import React from "react";
import EditMultipleButton from "./EditMultipleButton";
import { editCampaignAction } from "../../../../../redux/action-creator/campaignAction";

const EditBottomNavBar = ({
  step,
  setStep,
  campaignData,
  setError,
  error,
  campaignDetails,
}) => {
  // const sidebarState = useSelector((state) => state.sidebar.value);
  const sideBarState = useSelector((state) => state.SideBarReducer.expandState);
  const { loading } = useSelector((state) => state.CommonReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const discardCampaign = () => {
    history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
  };
  // const saveDraft = () => {
  //   setCampaignData({
  //     ...campaignData,
  //     draft: "1",
  //   });
  //   // dispatch(createCampaign(campaignData));
  //   // history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
  // };
  // React.useEffect(() => {
  //   if (campaignData.draft == "1") {
  //     dispatch(createCampaign(campaignData));
  //     history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
  //   }
  // }, [campaignData.draft]);
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
          {/* {step > 1 && (
            <EditMultipleButton name="Save As Draft" onClick={saveDraft} />
          )} */}
          <EditMultipleButton
            name="Discard Campign"
            onClick={discardCampaign}
          />

          {/* <MultipleButton name="Continue" className="bg-blue-400"/> */}
          {step === 3 ? (
            <button
              type="submit"
              className="multibtn"
              onClick={() => {
                dispatch(editCampaignAction(campaignData, campaignDetails));
                history.push(APPLICATION_ROUTES.FLIPKARTCAMPAING);
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
                  if (!campaignData?.products) {
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
                  if (
                    Number(campaignData?.campaign_budget) <
                    Number(campaignDetails.campaign_budget)
                  ) {
                    // setError("Campaign Budget minimum amount 1000");
                    setError({
                      ...error,
                      campaignBudget:
                        "Campaign Budget cannot be less than last budget",
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

export default EditBottomNavBar;
