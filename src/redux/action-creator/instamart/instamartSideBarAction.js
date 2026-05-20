import { _POST } from "../../../services/axios.method";
import { INSTAMART_WALLET } from "../../../utils/constants";
import ActionType from "../../types";

export const collapse = (state) => async (dispatch) => {
  try {
    dispatch({
      type: ActionType.COLLAPSE,
      payload: state,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
export const instamartWalletBal = (payload) => async (dispatch) => {
  try {
    const res = await _POST(INSTAMART_WALLET, {
      brand: payload,
    });
    dispatch({
      type: ActionType.INSTAMART_WALLET_BALANCE,
      payload: res?.data?.data?.data,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
