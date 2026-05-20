import ActionType from "../types";

const initialState = {};

export const ruleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RULE:
      return {
        ...state,
        ruleData: action.payload,
      };
    default:
      return state;
  }
};
