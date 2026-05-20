import ActionType from "../types";

const initialState = {};

export const amazonProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.AMAZONPROFILE:
      return {
        ...state,
        amazonProfile: action.payload,
      };
    default:
      return state;
  }
};
