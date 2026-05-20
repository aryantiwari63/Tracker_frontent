import { _POST } from "../../../services/axios.method";
import {
  GET_ZEPTO_PERFORMANCE_BREAKDOWN,
} from "../../../utils/constants";
import ActionType from "../../types";
import { cancelRequest } from "../../../utils/helpers";

export const getZeptoPerformanceBreakDown = (payload) => async (dispatch) => {
  try {
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_ZEPTO_PERFORMANCE_BREAKDOWN, payload, {
      cancelToken: ourRequest.token,
    });
    if (res?.data?.data) {
      dispatch({
        type: ActionType.ZEPTOPERFORMANCEBREAKDOWN,
        payload: res?.data?.data,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
