import { _POST } from "../../../services/axios.method";
import {
  ALL_BUTTON_FLAGS,
  GET_PERFORMANCE_BREAKDOWN,
} from "../../../utils/constants";
import ActionType from "../../types";
import { setLoading } from ".././commonAction";
import { cancelRequest } from "../../../utils/helpers";

export const getPerformanceBreakDown = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.BLINKITPERFORMANCEBREAKDOWN));

    const ourRequest = await cancelRequest();
    const res = await _POST(GET_PERFORMANCE_BREAKDOWN, payload, {
      cancelToken: ourRequest.token,
    });
    if (res?.data?.data) {
      dispatch({
        type: ActionType.BLINKITPERFORMANCEBREAKDOWN,
        payload: res?.data?.data,
      });
      dispatch(setLoading(false, ALL_BUTTON_FLAGS.BLINKITPERFORMANCEBREAKDOWN));
    }
  } catch (error) {
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.BLINKITPERFORMANCEBREAKDOWN));
  }
};
