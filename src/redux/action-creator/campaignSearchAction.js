/* eslint-disable no-console */
import { _POST } from "../../services/axios.method";
import {
  GET_CAMPAIGN_SEARCH,
  GET_ADGROUP_SEARCH,
  GET_FSN_SEARCH,
  GET_KEYWORD_SEARCH,
  GET_PLACEMENT_SEARCH,
  GET_CREATIVE_SEARCH,
  GET_SAVED_SEARCH,
  SAVE_SEARCH,
} from "../../utils/constants";
import { cancelRequest } from "../../utils/helpers";

export const getCampaignList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_CAMPAIGN_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;

    // dispatch({
    //   type: ActionType.GETCAMPAIGNSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error, "error");
  }
};

export const getAdGroupsList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_ADGROUP_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETADGROUPSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};
export const getKeywordList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();

    const res = await _POST(GET_KEYWORD_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const getFsnList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_FSN_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const getPlacementList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_PLACEMENT_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const getCreativeList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();

    const res = await _POST(GET_CREATIVE_SEARCH, payload, {
      cancelToken: ourRequest.token,
    });

    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const getSavedSearchList = async (payload) => {
  try {
    // console.log("payload", payload);
    const res = await _POST(GET_SAVED_SEARCH, payload);
    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const saveSearch = async (payload) => {
  try {
    // console.log("payload", payload);
    const res = await _POST(SAVE_SEARCH, payload);
    if(res?.status == 200){
      return res?.data?.data;
    }
      return res?.data?.status?.message
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};
