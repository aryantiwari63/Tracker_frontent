import ActionType from "../../types";
const initialState = {
  expandState: false,
  instamartWalletBalance: "",
};
export const instamartSideBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.COLLAPSE:
      return {
        ...state,
        expandState: action.payload,
      };
    case ActionType.INSTAMART_WALLET_BALANCE:
      return {
        ...state,
        instamartWalletBalance: action.payload,
      };
    case ActionType.DATASYNCTIME:
      return {
        ...state,
        dataSyncTime: action.payload,
      };

    default:
      return state;
  }
};

export default instamartSideBarReducer;
