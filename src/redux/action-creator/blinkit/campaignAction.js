import { _POST } from "../../../services/axios.method";
import {
  ALL_BUTTON_FLAGS,
  GET_NEGATIVE_KEYWORD,
} from "../../../utils/constants";
import ActionType from "../../types";
import { setLoading } from ".././commonAction";
import { cancelRequest } from "../../../utils/helpers";
export const getNegativeKeyword = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
    const ourRequest = await cancelRequest();
    const res = await _POST(GET_NEGATIVE_KEYWORD, payload, {
      cancelToken: ourRequest.token,
    });

    dispatch({
      type: ActionType.NEGATIVEKEYWORDS,
      payload: res?.data?.data,
    });
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
  } catch (error) {
    console.error(error);
    dispatch(setLoading(false, ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS));
  }
};
