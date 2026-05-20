import { _GET, _POST } from "../../../services/axios.method";
import {
  ALL_BUTTON_FLAGS,
  BLINKIT_CREATE_CAMPAIGN,
  GET_BLINKIT_ASSET_LIST,
  GET_BLINKIT_BRAND_SUGGESTION_LIST,
  GET_BLINKIT_CATEGORY_LIST,
  GET_BLINKIT_CATEGORY_LIST_BY_BRAND,
  GET_BLINKIT_COLLECTION_LIST,
  GET_BLINKIT_KEYWORDS_LIST,
  GET_BLINKIT_KEYWORDS_LIST_BY_BRAND_PRODUCTS,
  GET_BLINKIT_KEYWORDS_LIST_SPOTLIGHT,
  GET_BLINKIT_PRODUCTS_LIST,
} from "../../../utils/constants";
import ActionType from "../../types";
import { setLoading, setToastMessageHandler } from ".././commonAction";
export const getProductList = () => async (dispatch) => {
  try {
    const res = await _GET(GET_BLINKIT_PRODUCTS_LIST);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETPRODUCTLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getCollectionList = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BLINKIT_COLLECTION_LIST, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETCOLLECTIONLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getBlinkitKeywordList = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BLINKIT_KEYWORDS_LIST, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETKEYWORDLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getBlinkitKeywordListByBrandsProducts =
  (payload) => async (dispatch) => {
    try {
      const res = await _POST(
        GET_BLINKIT_KEYWORDS_LIST_BY_BRAND_PRODUCTS,
        payload
      );
      if (res?.data?.data) {
        dispatch({
          type: ActionType.GETKEYWORDLISTBYBRANDPRODUCTS,
          payload: res?.data?.data?.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
export const getBlinkitKeywordListForSpotLIght =
  (payload) => async (dispatch) => {
    try {
      const res = await _POST(GET_BLINKIT_KEYWORDS_LIST_SPOTLIGHT, payload);
      if (res?.data?.data) {
        dispatch({
          type: ActionType.GETKEYWORDLISTSPOTLIGHT,
          payload: res?.data?.data?.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
export const getBlinkitCategoryList = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BLINKIT_CATEGORY_LIST, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETCATEGORYLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getBlinkitCategoryListByBrand = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BLINKIT_CATEGORY_LIST_BY_BRAND, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETCATEGORYLISTByBrand,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getBlinkitAssetList = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BLINKIT_ASSET_LIST, payload);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETASSETLIST,
        payload: res?.data?.data?.data,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getBlinkitBrandSuggestionList = () => async (dispatch) => {
  try {
    const res = await _GET(GET_BLINKIT_BRAND_SUGGESTION_LIST);
    if (res?.data?.data) {
      dispatch({
        type: ActionType.GETBRANDSUGGESTIONLIST,
        payload: res?.data?.data?.result,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const createBlinkitCampaign =
  (payload, callback) => async (dispatch) => {
    try {
      dispatch(setLoading(true, ALL_BUTTON_FLAGS.BLINKITCREATECAMPAIGN));

      const res = await _POST(BLINKIT_CREATE_CAMPAIGN, {
        data: payload,
      });

      dispatch({
        type: ActionType.BLINKITCREATECAMPAIGN,
        payload: res?.data?.data,
      });
      if (res && res.data && res.data.status && res.data.data.draft == "0") {
        dispatch(setToastMessageHandler("Campaign created successFully", true));
      } else {
        dispatch(
          setToastMessageHandler("Campaign saved as draft successFully", true)
        );
      }

      dispatch(setLoading(false, ALL_BUTTON_FLAGS.BLINKITCREATECAMPAIGN));
      callback();
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.BLINKITCREATECAMPAIGN));
      dispatch(setToastMessageHandler("failed to create campaign", false));
    }
  };
