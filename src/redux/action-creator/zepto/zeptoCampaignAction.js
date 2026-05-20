/* eslint-disable no-console */
import { _POST } from "../../../services/axios.method";
import {
  GET_ZEPTO_CATEGORY_SEARCH,
  GET_ZEPTO_CAMPAIGN_SEARCH,
  GET_ZEPTO_KEYWORD_SEARCH,
  GET_ZEPTO_PRODUCT_SEARCH,
} from "../../../utils/constants";
import { cancelRequest } from "../../../utils/helpers";

export const getZeptoCampaignList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_ZEPTO_CAMPAIGN_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });
    return res?.data?.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error, "error");
  }
};
export const getZeptoKeywordList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_ZEPTO_KEYWORD_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });
    return res?.data?.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getZeptoCategoryList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_ZEPTO_CATEGORY_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getZeptoProductList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_ZEPTO_PRODUCT_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

//   try {

//     const ourRequest = await cancelRequest();
//      const res = await _POST(GET_PLACEMENT_SEARCH, payload, { cancelToken: ourRequest.token });

//     return res?.data?.data;
//     // dispatch({
//     //   type: ActionType.GETKEYWORDSEARCH,
//     //   payload: res?.data?.data,
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getCreativeList = async (payload, tab = false) => {
//   try {
//      const ourRequest = await cancelRequest();

//     const res = await _POST(GET_CREATIVE_SEARCH, payload, { cancelToken: ourRequest.token });

//     return res?.data?.data;
//     // dispatch({
//     //   type: ActionType.GETKEYWORDSEARCH,
//     //   payload: res?.data?.data,
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getSavedSearchList = async (payload) => {
//   try {
//     // console.log("payload", payload);
//     const res = await _GET(GET_SAVED_SEARCH,
//       payload);
//     return res?.data?.data;
//     // dispatch({
//     //   type: ActionType.GETKEYWORDSEARCH,
//     //   payload: res?.data?.data,
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const saveSearch = async (payload) => {
//   try {
//     // console.log("payload", payload);
//     const res = await _POST(SAVE_SEARCH,
//       payload);
//     return res?.data?.data;
//     // dispatch({
//     //   type: ActionType.GETKEYWORDSEARCH,
//     //   payload: res?.data?.data,
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };
