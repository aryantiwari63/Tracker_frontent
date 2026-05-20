import ActionType from "../types";

const initialState = {};

export const campaignTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.CAMPAIGN_TYPE:
      return {
        ...state,
        campaign_type: action.payload,
      };
    default:
      return state;
  }
};
