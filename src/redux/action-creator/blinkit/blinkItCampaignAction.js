import { _GET, _POST } from "../../../services/axios.method";
import {
  GET_BLINKIT_KEYWORD_SEARCH,
  GET_PLACEMENT_SEARCH,
  GET_CREATIVE_SEARCH,
  GET_SAVED_SEARCH,
  SAVE_SEARCH,
  GET_BLINKIT_CATEGORY_SEARCH, GET_BLINKIT_CAMPAIGN_SEARCH,
} from "../../../utils/constants";
import { cancelRequest } from "../../../utils/helpers";

export const getCampaignList = async (payload) => {
  try {
     const ourRequest = await cancelRequest();
    const res = await _POST(GET_BLINKIT_CAMPAIGN_SEARCH, payload, { cancelToken: ourRequest.token });
    return res?.data?.data;
  } catch (error) {
    console.error(error, "error");
  }
};
export const getKeywordList = async (payload) => {
  try {
     const ourRequest = await cancelRequest();
    const res = await _POST(GET_BLINKIT_KEYWORD_SEARCH, payload, { cancelToken: ourRequest.token });
    return res?.data?.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCategoryList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_BLINKIT_CATEGORY_SEARCH, payload, { cancelToken: ourRequest.token });
    return res?.data?.data;

  } catch (error) {
    console.error(error);
  }
};

export const getPlacementList = async (payload) => {
  try {


   
    const ourRequest = await cancelRequest();
     const res = await _POST(GET_PLACEMENT_SEARCH, payload, { cancelToken: ourRequest.token });


    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.error(error);
  }
};

export const getCreativeList = async (payload) => {
  try {
     const ourRequest = await cancelRequest();
     
    const res = await _POST(GET_CREATIVE_SEARCH, payload, { cancelToken: ourRequest.token });


    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.error(error);
  }
};

export const getSavedSearchList = async (payload) => {
  try {
    // console.error("payload", payload);
    const res = await _GET(GET_SAVED_SEARCH,
      payload);
    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.error(error);
  }
};

export const saveSearch = async (payload) => {
  try {
    const res = await _POST(SAVE_SEARCH,
      payload);
    return res?.data?.data;
  } catch (error) {
    console.error(error);
  }
};
