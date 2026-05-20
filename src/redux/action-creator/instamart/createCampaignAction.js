import { _POST } from "../../../services/axios.method";
import {
  GET_INSTAMART_KEYWORDS_LIST,
  GET_INSTAMART_PRODUCTS_LIST,
  INSTAMART_CLONE_CAMPAIGN,
  INSTAMART_CREATE_CAMPAIGN,
} from "../../../utils/constants";

import ActionType from "../../types";
import { setToastMessageHandler } from "../commonAction";
export const getInstamartProductList = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_INSTAMART_PRODUCTS_LIST, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETINSTAMARTPRODUCTLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getInstamartKeywordList = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_INSTAMART_KEYWORDS_LIST, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETINSTAMARTKEYWORDLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
// export const getBlinkitCategoryList = (payload) => async (dispatch) => {
//   try {
//     const res = await _POST(GET_BLINKIT_CATEGORY_LIST, payload);
//     if (res?.data?.data) {
//       dispatch({
//         type: ActionType.GETCATEGORYLIST,
//         payload: res?.data?.data?.data,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
export const createInstamartCampaign = (payload) => async (dispatch) => {
  try {
    const res = await _POST(INSTAMART_CREATE_CAMPAIGN, {
      data: payload,
    });

    if (res && res.data && res.data.status?.code == 200) {
      dispatch(setToastMessageHandler("Campaign created successFully", true));
    } else {
      dispatch(setToastMessageHandler("failed to create campaign", false));
    }
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("failed to create campaign", false));
  }
};
export const cloneInstamartCampaign = (payload) => async (dispatch) => {
  try {
    const res = await _POST(INSTAMART_CLONE_CAMPAIGN, {
      data: payload,
    });

    if (res && res.data && res.data.status?.code == 200) {
      dispatch(setToastMessageHandler("Campaign cloned successFully", true));
    } else {
      dispatch(setToastMessageHandler("failed to clone campaign", false));
    }
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("failed to create campaign", false));
  }
};
