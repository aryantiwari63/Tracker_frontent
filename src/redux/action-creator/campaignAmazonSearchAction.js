/* eslint-disable no-console */
import { _POST } from "../../services/axios.method";
import {
  GET_SAVED_SEARCH,
  SAVE_SEARCH,
  GET_AMAZON_CAMPAIGN_SEARCH,
  GET_AMAZON_ADGROUP_SEARCH,
  AMAZON_PLACEMENT_SEARCH,
  GET_AMAZON_KEYWORD_SEARCH,
  AMAZON_CREATIVE_SEARCH,
} from "../../utils/constants";

import {
  GET_AMAZON_PORTFOLIOLIST,
  GET_AMAZON_ASINLIST,
} from "../../utils/amazonConstants";

import { cancelRequest } from "../../utils/helpers";

export const getAmazonCampaignList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_AMAZON_CAMPAIGN_SEARCH, payload, {
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
export const getAmazonAdgroupList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_AMAZON_ADGROUP_SEARCH, payload, {
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

export const getAmazonPortfolioList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_AMAZON_PORTFOLIOLIST, payload, {
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
export const getAmazonKeywordList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();

    const res = await _POST(GET_AMAZON_KEYWORD_SEARCH, payload, {
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

export const getAsinList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_AMAZON_ASINLIST, payload, {
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
    return res?.data?.data;
    // dispatch({
    //   type: ActionType.GETKEYWORDSEARCH,
    //   payload: res?.data?.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const getAmazonPlacementSearchList = async (payload) => {
  try {
    const res = await _POST(AMAZON_PLACEMENT_SEARCH, payload);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAmazonCreativeSearchList = async (payload) => {
  try {
    const res = await _POST(AMAZON_CREATIVE_SEARCH, payload);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};
