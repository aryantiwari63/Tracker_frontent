import { _POST } from "../../../services/axios.method";
import {
  AMAZON_CREATE_CAMPAIGN,
  AMAZON_CREATE_MULTI_ADGROUPS,
} from "../../../utils/constants";
import { setToastMessageHandler } from ".././commonAction";

export const createAmazonCampaign = (payload, type) => async (dispatch) => {
  try {
    await _POST(AMAZON_CREATE_CAMPAIGN, {
      data: payload,
      type: type,
    });

    // dispatch({
    //   type: ActionType.AMAZONCREATECAMPAIGN,
    //   payload: res?.data?.data,
    // });
    dispatch(setToastMessageHandler("Campaign created successFully", true));
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("failed to create campaign", false));
  }
};
export const createAmazonMultiAdgroup = (payload) => async (dispatch) => {
  try {
    await _POST(AMAZON_CREATE_MULTI_ADGROUPS, {
      data: payload,
    });

    // dispatch({
    //   type: ActionType.AMAZONCREATECAMPAIGN,
    //   payload: res?.data?.data,
    // });
    dispatch(setToastMessageHandler("Adgroups created successFully", true));
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("failed to create adgroups", false));
  }
};
