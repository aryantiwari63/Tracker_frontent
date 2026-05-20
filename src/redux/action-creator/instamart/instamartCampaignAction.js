import { _POST } from "../../../services/axios.method";
import {
  INSTAMART_KEYWORD,
  INSTAMART_PRODUCT,
  INSTAMART_CAMPAIGN,
} from "../../../utils/constants";
import { cancelRequest } from "../../../utils/helpers";
// import { setLoading, setToastMessageHandler } from "../commonAction";

export const getCampaignList = async (payload) => {
  try {
    // dispatch(setLoading(true, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
    const ourRequest = await cancelRequest();
    const res = await _POST(INSTAMART_CAMPAIGN, payload, {
      cancelToken: ourRequest.token,
    });
    return res?.data?.data;
  } catch (error) {
    console.error(error, "error");
  }
};
export const getKeywordList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(INSTAMART_KEYWORD, payload, {
      cancelToken: ourRequest.token,
    });
    return res?.data?.data;
  } catch (error) {
    console.error(error);
  }
};

export const getProductList = async (payload) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(INSTAMART_PRODUCT, payload, {
      cancelToken: ourRequest.token,
    });
    return res?.data?.data;
  } catch (error) {
    console.error(error);
  }
};
