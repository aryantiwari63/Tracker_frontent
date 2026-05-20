import ActionType from "../types";

const initialState = {
    recallCampaign:false
};

export const recallCampaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RECALLCAMPAIGNPAPI:
      return {
        ...state,
        recallCampaign: action.payload,
      };
    default:
      return state;
  }
};
