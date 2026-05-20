import ActionType from "../types";

const initialState = {
  recallRules: false,
};

export const recallGetRulesApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.RECALLGETRULESAPI:
      return {
        ...state,
        recallRules: action.payload,
      };
    default:
      return state;
  }
};
