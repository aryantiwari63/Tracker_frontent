import { _POST } from "../../../services/axios.method";
import ActionType from "../../types";
import {
  ALL_BUTTON_FLAGS,
  EDIT_SEARCH_TERM,
  AMAZON_SEARCH_TERM,
  GET_AMAZON_NEGATIVE_KEYWORD,
  AMAZON_DUPLICATE_CAMPAIGN,
  EDIT_SEARCH_TERM_NEGATIVE,
  GET_CAMPAIGN_LIST_AMAZON,
  GET_ADGROUP_LIST_AMAZON,
} from "../../../utils/constants";
import { REMOVE_AMAZON_NEGATIVE_KEYWORDS } from "../../../utils/amazonConstants";
import { setLoading, setToastMessageHandler } from "../commonAction";
import { cancelRequest } from "../../../utils/helpers";
export const getAmsNegativeKeyword = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_AMAZON_NEGATIVE_KEYWORD, payload, {
      cancelToken: ourRequest.token,
    });

    dispatch({
      type: ActionType.AMAZOMNEGATIVEKEYWORDS,
      payload: res?.data?.data,
    });
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
  } catch (error) {
    console.error(error);
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
  }
};

export const removeNegativeKeyWord = (data) => async (dispatch) => {
  try {
    await _POST(REMOVE_AMAZON_NEGATIVE_KEYWORDS, {
      data,
    });
    dispatch(setToastMessageHandler("Keyword deleted successFully", true));
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("Something went wrong", false));
  }
};
export const getCampaignListForAddKeywordAmazon =
  (account) => async (dispatch) => {
    try {
      const res = await _POST(GET_CAMPAIGN_LIST_AMAZON, {
        account: account,
      });
      dispatch({
        type: ActionType.CAMPAIGNLISTAMAZON,
        payload: res?.data?.data,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
export const getAdgroupListAmazon = (id) => async (dispatch) => {
  try {
    const res = await _POST(GET_ADGROUP_LIST_AMAZON, {
      id,
    });
    dispatch({
      type: ActionType.ADGROUPLISTAMAZON,
      payload: res?.data?.data,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getAmazonSearchTerm = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.AMAZONSEARCHTERMS));

    const ourRequest = await cancelRequest();
    const res = await _POST(AMAZON_SEARCH_TERM, payload, {
      cancelToken: ourRequest.token,
    });
    if (res?.data?.data) {
      dispatch({
        type: ActionType.AMAZONSEARCHTERM,
        payload: res?.data?.data,
      });
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.AMAZONSEARCHTERMS));
    }
  } catch (error) {
    // console.error(error, "testError");
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.AMAZONSEARCHTERMS));
  }
};

export const editSearchTermAction =
  (id, keywordType, campaign_id, ad_group_id, media_type) => async () => {
    try {
      await _POST(EDIT_SEARCH_TERM, {
        id,
        keywordType,
        campaign_id,
        ad_group_id,
        media_type,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const editNegativeSearchTermAction =
  (searchTerm, searchTermTypeData, searchTermAction) => async (dispatch) => {
    try {
      await _POST(EDIT_SEARCH_TERM_NEGATIVE, {
        searchTerm,
        searchTermTypeData,
        searchTermAction,
        media_type: "Amazon",
        action_type: "edit_keyword_product",
      });
      dispatch(
        setToastMessageHandler("Negative Keyword added successFully", true)
      );
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong", false));
    }
  };

export const duplicateAMSCampaign = (payload) => async (dispatch) => {
  try {
    await _POST(AMAZON_DUPLICATE_CAMPAIGN, {
      ids: payload,
    });

    dispatch(setToastMessageHandler("Success", true));
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("Failed", false));
  }
};
