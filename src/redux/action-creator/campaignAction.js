/* eslint-disable no-console */
import { _GET, _POST,_GET2 } from "../../services/axios.method";
import {
  ALL_BUTTON_FLAGS,
  CREATE_CAMPAIGN,
  DUPLICATE_CAMPAIGN,
  EDIT_CAMPAIGN,
  EDIT_SEARCH_TERM,
  GET_ADGROUP_LIST,
  GET_BRANDS_BY_ACCOUNT,
  GET_CAMPAIGN_DETAILS,
  GET_CAMPAIGN_LIST,
  GET_CATEGORIES,
  GET_KEYWORD_LIST,
  GET_PRODUCTS,
  GET_PRODUCTS_BY_CSV,
  NEGATIVE_KEYWORD,
  REMOVE_KEYWORD,
  SEARCH_TERM,
  UPDATE_CAMPAIGN,
  ADD_NEGATIVE_KEYWORD,
  LIVE_CAMPAIGN_LIST,
  GET_PRODUCTS_ZEPTO,
  ZEPTO_CREATE_CAMPAIGN,
  GET_BLINKIT_CAMPAIGN_DETAILS,
  BLINKIT_EDIT_CAMPAIGN,
  GET_INSTAMART_CAMPAIGN_DETAILS,
  INSTAMART_EDIT_CAMPAIGN,
  ROLE_PERMISSIONS
} from "../../utils/constants";
import ActionType from "../types";
import { setLoading, setToastMessageHandler } from "./commonAction";
import { cancelRequest } from "../../utils/helpers";
import { trackCampaignCreation } from "../../analytics/EventController";

export const getCategories = (payload, platform) => async (dispatch) => {
  try {
    const res = await _POST(GET_CATEGORIES, {
      brand: payload,
      platform: platform,
    });

    dispatch({
      type: ActionType.GETCATEGORIES,
      payload: res?.data?.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getBrandsByAccount = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BRANDS_BY_ACCOUNT, { account: payload });

    dispatch({
      type: ActionType.GETBRANDBYACCOUNT,
      payload: res?.data?.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getNegativeKeyword = (payload) => async (dispatch) => {
  try {
    if (payload.platform_id.length < 1) {
      return true;
    }
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));

    const res = await _POST(NEGATIVE_KEYWORD, payload);

    dispatch({
      type: ActionType.NEGATIVEKEYWORDS,
      payload: res?.data?.data,
    });
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
  }
};
export const getSearchTerm = (payload) => async (dispatch) => {
  try {
    if (payload.platform_id.length < 1) {
      return true;
    }
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.SEARCHTERMS));

    const ourRequest = await cancelRequest();
    const res = await _POST(SEARCH_TERM, payload, {
      cancelToken: ourRequest.token,
    });
    // if(res?.data?.data) {

    // dispatch({
    //   type: ActionType.SEARCHTERM,
    //   payload: res?.data?.data,
    // });
    if (res?.data?.data) {
      dispatch({
        type: ActionType.SEARCHTERM,
        payload: res?.data?.data,
      });
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.SEARCHTERMS));
    }
  } catch (error) {
    // console.log(error, "testError");
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.SEARCHTERMS));
  }
};
export const getCampaignLiveList = (payload) => async () => {
  try {
    const res = await _POST(LIVE_CAMPAIGN_LIST, payload);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};
export const getCampaignDetails = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_CAMPAIGN_DETAILS, { id: payload });

    dispatch({
      type: ActionType.CAMPAIGN_DETAILS,
      payload: res?.data?.data.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getBlinkitCampaignDetails = (payload) => async (dispatch) => {
  try {
    const res = await _POST(GET_BLINKIT_CAMPAIGN_DETAILS, { id: payload });

    dispatch({
      type: ActionType.CAMPAIGN_DETAILS_BLINKIT,
      payload: res?.data?.data.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getProducts =
  (payload, account, search, type, offset, platform) => async (dispatch) => {
    try {
      const res = await _POST(GET_PRODUCTS, {
        category_id: payload,
        search: search ? search : "",
        type: type ? type : "",
        account: account ? account : "",
        offset: offset,
        platform: platform,
      });

      dispatch({
        type: ActionType.GETPRODUCTS,
        payload: res?.data?.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
export const getProductsForZeptoCampaign =
  (account, search, type, offset) => async (dispatch) => {
    try {
      const res = await _POST(GET_PRODUCTS_ZEPTO, {
        account: account ? account : "",
        search: search ? search : "",
        type: type,
        offset: offset,
      });

      dispatch({
        type: ActionType.GETPRODUCTSZEPTO,
        payload: res?.data?.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
export const createZeptoCampaign = (payload) => async (dispatch) => {
  try {
    const res = await _POST(ZEPTO_CREATE_CAMPAIGN, {
      data: payload,
    });

    if (res && res.data && res.data.status.code == 200) {
      dispatch(setToastMessageHandler("Campaign created successFully", true));
    }
  } catch (error) {
    console.error(error);
    dispatch(setToastMessageHandler("failed to create campaign", false));
  }
};
export const getProductsByCsv =
  (category, FSNs, account, platform) => async (dispatch) => {
    try {
      const res = await _POST(GET_PRODUCTS_BY_CSV, {
        category: category,
        FSNs: FSNs,
        account: account,
        platform: platform,
      });

      dispatch({
        type: ActionType.GETPRODUCTSBYCSV,
        payload: res?.data?.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
export const createCampaign = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.CREATECAMPAIGN));

    const res = await _POST(CREATE_CAMPAIGN, {
      data: payload,
    });

    dispatch({
      type: ActionType.CREATECAMPAIGN,
      payload: res?.data?.data,
    });
    if (res && res.data && res.data.status && res.data.data.draft == "0") {
      dispatch(setToastMessageHandler("Campaign created successFully", true));
      trackCampaignCreation("Campaign created successFully"); //Track campaign creation
    } else {
      dispatch(
        setToastMessageHandler("Campaign saved as draft successFully", true)
      );
      trackCampaignCreation("Campaign saved as draft successFully"); //Track campaign creation
    }

    dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
    dispatch(setToastMessageHandler("failed to create campaign", false));
  }
};
export const editCampaignAction =
  (editedData, originalData) => async (dispatch) => {
    try {
      dispatch(setLoading(true, ALL_BUTTON_FLAGS.CREATECAMPAIGN));

      const res = await _POST(EDIT_CAMPAIGN, {
        data: editedData,
        originalData: originalData,
      });

      dispatch({
        type: ActionType.EDITCAMPAIGN,
        payload: res?.data?.data,
      });
      if (res && res.data && res.data.status) {
        dispatch(setToastMessageHandler("Campaign edited successFully", true));
      }

      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
      dispatch(setToastMessageHandler("failed to create campaign", false));
    }
  };
export const editBlinkitCampaignAction =
  (editedData, originalData) => async (dispatch) => {
    try {
      dispatch(setLoading(true, ALL_BUTTON_FLAGS.CREATECAMPAIGN));

      const res = await _POST(BLINKIT_EDIT_CAMPAIGN, {
        data: editedData,
        originalData: originalData,
      });

      if (res && res.data && res.data.status) {
        dispatch(setToastMessageHandler("Campaign edited successFully", true));
      }

      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
      dispatch(setToastMessageHandler("failed to edit campaign", false));
    }
  };
export const updateCampaign = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.CREATECAMPAIGN));

    const res = await _POST(UPDATE_CAMPAIGN, {
      data: payload,
    });

    dispatch({
      type: ActionType.UPDATECAMPAIGN,
      payload: res?.data?.data,
    });
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
  } catch (error) {
    console.log(error);
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
  }
};
export const duplicateCampaign = (payload) => async (dispatch) => {
  try {
    const res = await _POST(DUPLICATE_CAMPAIGN, {
      ids: payload,
    });

    dispatch({
      type: ActionType.DUPLICATECAMPAIGN,
      payload: res?.data?.data,
    });
    if (res?.data?.status?.code == 200) {
      dispatch(setToastMessageHandler("Success", true));
    } else {
      dispatch(setToastMessageHandler("Failed", false));
    }
  } catch (error) {
    console.log(error);
    dispatch(setToastMessageHandler("Failed", false));
  }
};
export const removeNegativeKeyWord = (data) => async (dispatch) => {
  try {
    const res = await _POST(REMOVE_KEYWORD, {
      data,
    });

    dispatch({
      type: ActionType.REMOVEKEYWORD,
      payload: res?.data?.data,
    });
    dispatch(setToastMessageHandler("Keyword deleted successFully", true));
  } catch (error) {
    console.log(error);
    dispatch(setToastMessageHandler("Something went wrong", false));
  }
};

export const addNegativeKeyWord = (data) => async (dispatch) => {
  try {
    const res = await _POST(ADD_NEGATIVE_KEYWORD, {
      data,
    });

    dispatch({
      type: ActionType.ADDNEGATIVEKEYWORD,
      payload: res?.data?.data,
    });
    dispatch(
      setToastMessageHandler("Negative Keyword added successFully", true)
    );
  } catch (error) {
    console.log(error);
    dispatch(setToastMessageHandler("Something went wrong", false));
  }
};
// recordId[]: vanish liquid
// keyword_match_type: EXACT
// campaign_id: FIQH3KJZW950
// adgroup[]: 5TSWMY00YOLG
// status: add-searchterm-keyword
// action_type: keyword
// status_value: add_keyword
export const editSearchTermAction =
  (id, keywordType, campaign_id, ad_group_id) => async (dispatch) => {
    try {
      const res = await _POST(EDIT_SEARCH_TERM, {
        id,
        keywordType,
        campaign_id,
        ad_group_id,
      });
      if (res) {
        dispatch(setToastMessageHandler("Keyword added successFully", true));
      }
    } catch (error) {
      console.log(error);
      dispatch(setToastMessageHandler("Something went wrong", false));
    }
  };

export const getCampaignList = () => async (dispatch) => {
  try {
    const res = await _GET(GET_CAMPAIGN_LIST);
    dispatch({
      type: ActionType.CAMPAIGNLIST,
      payload: res?.data?.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCampaignListForAddKeyword = (account) => async (dispatch) => {
  try {
    const res = await _POST(GET_CAMPAIGN_LIST, {
      account: account,
    });
    dispatch({
      type: ActionType.CAMPAIGNLIST,
      payload: res?.data?.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAdgroupList = (id) => async (dispatch) => {
  try {
    const res = await _POST(GET_ADGROUP_LIST, {
      id,
    });
    dispatch({
      type: ActionType.ADGROUPLIST,
      payload: res?.data?.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getKeywordList = (account, search) => async (dispatch) => {
  try {
    const res = await _POST(GET_KEYWORD_LIST, {
      account,
      search,
    });
    dispatch({
      type: ActionType.GETKEYWORDLIST,
      payload: res?.data?.data,
    });
  } catch (error) {
    console.log(error);
  }
};
export const editInstamartCampaignAction =
  (editedData, originalData) => async (dispatch) => {
    try {
      dispatch(setLoading(true, ALL_BUTTON_FLAGS.CREATECAMPAIGN));

      const res = await _POST(INSTAMART_EDIT_CAMPAIGN, {
        data: editedData,
        originalData: originalData,
      });

      if (res && res.data && res.data.status) {
        dispatch(setToastMessageHandler("Campaign edited successFully", true));
      }

      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.CREATECAMPAIGN));
      dispatch(setToastMessageHandler("failed to edit campaign", false));
    }
  };
export const getInstamartCampaignDetails =
  (payload, accountid) => async (dispatch) => {
    try {
      const res = await _POST(GET_INSTAMART_CAMPAIGN_DETAILS, {
        id: payload,
        accountid: accountid,
      });

      dispatch({
        type: ActionType.CAMPAIGN_DETAILS_INSTAMART,
        payload: res?.data?.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  export const getUserPermissions = (role = "") => async (dispatch) => {
    try {
      if (role) {
      // const res = await _GET2(ROLE_PERMISSIONS); 
      let clientId = localStorage.getItem("client_id");
      const res = await _GET2(`${ROLE_PERMISSIONS}?client_id=${clientId}`); 
      dispatch({
        type: ActionType.PERMISSIONS_DETAILS,
        payload: res?.data?.data.result,
      });
      return;
    }
    dispatch({
      type: ActionType.PERMISSIONS_DETAILS,
      payload: [],
    });

    } catch (error) {
      console.log(error);
    }
  };